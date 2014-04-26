var CODEC_VERSION = 1;

var encodeMessage = function(message, keys){
    'use strict';

    var i, pwd,salt,iv,preIter, arrTemp, keyshift, rp, p, sig,
        deflate = new Zlib.RawDeflate(strToUTF8Arr(JSON.stringify(message))),
        compressed = deflate.compress(),
        compressedAt = Math.floor((new Date()).getTime() / 1000),
        finalLength = 316 + 148 * Object.keys(keys).length + compressed.byteLength + 8,
        containerAB = new ArrayBuffer(finalLength),
        container = new Uint8Array(containerAB), crypted,
        signedPart = new Uint8Array(containerAB, 261);

    preIter = Math.random()*20;for (i = 0; i < preIter; i++){sjcl.random.randomWords(8, 0);}
    pwd = sjcl.codec.hex.fromBits(sjcl.random.randomWords(8, 0));
    
    preIter = Math.random()*20;for (i = 0; i < preIter; i++) {sjcl.random.randomWords(8, 0);}
    salt = sjcl.random.randomWords(8, 0);
    
    preIter = Math.random()*20;for (i = 0; i < preIter; i++) {sjcl.random.randomWords(8, 0);}
    iv = sjcl.random.randomWords(4, 0);

    p = {
        iv: iv,
        iter: 1000,
        mode: "ccm",
        ts: 64,
        ks: 256,
        salt: salt
    };

    p = sjcl.encrypt(pwd, sjcl.codec.bytes.toBits(compressed), p, rp);

    crypted = sjcl.codec.bytes.fromBits(p.ct);

    container[0] = CODEC_VERSION; // version

    container[1] = finalLength & 255; //data size
    container[2] = (finalLength >> 8) & 255;
    container[3] = (finalLength >> 16) & 255;
    container[4] = (finalLength >> 24) & 255;

    arrTemp = hexToBytes(rsaProfile.n); // our publick key
    for (i = 0; i < arrTemp.length; i++) {
        container[5 + i] = arrTemp[i];
    }

    container[261] = 0; //type of message
    container[262] = compressedAt & 255; //coding unix_timestamp
    container[263] = (compressedAt >> 8) & 255;
    container[264] = (compressedAt >> 16) & 255;
    container[265] = (compressedAt >> 24) & 255;

    arrTemp = sjcl.codec.bytes.fromBits(iv); // iv
    for (i = 0; i < arrTemp.length; i++) {
        container[266 + i] = arrTemp[i];
    }
    var iv2 = arrayBufferDataUri(arrTemp);

    arrTemp = sjcl.codec.bytes.fromBits(salt); // iv
    for (i = 0; i < arrTemp.length; i++) {
        container[282 + i] = arrTemp[i];
    }
    var salt2 = arrayBufferDataUri(arrTemp);

    container[314] = Object.keys(keys).length & 255; // number of keys
    container[315] = (Object.keys(keys).length >> 8) & 255; // number of keys

    keyshift = 0;
    for (var c in keys) {

        arrTemp = hexToBytes(c); // keyhash
        for (i = 0; i < arrTemp.length; i++) {
            container[316 + i + keyshift*148] = arrTemp[i];
        }

        var testRsa = new RSAKey();
        testRsa.setPublic(keys[c], '10001');

        arrTemp = hexToBytes(testRsa.encrypt(pwd)); // crypted password
        for (i = 0; i < arrTemp.length; i++) {
            container[336 + i + keyshift*148] = arrTemp[i];
        }

        keyshift++;
    }

    keyshift = 316 + 148 * Object.keys(keys).length;
    for (i = 0; i < crypted.length; i++) {
        container[keyshift + i] = crypted[i];
    }

    sig = rsa.signStringWithSHA256(signedPart);

    arrTemp = hexToBytes(sig); // keyhash
    for (i = 0; i < arrTemp.length; i++) {
        container[133 + i] = arrTemp[i];
    }

    return container;
};

var decodeMessage = function(data){
    'use strict';

    if(data[0] != CODEC_VERSION) return false;
    console.log('Version ok');
    var msgType = data[261],
        keyNum = data[314] + data[315] * 256,
        dataLength = data[1] + data[2] * 256 + data[3] * 65536 + data[4] * 16777216,
        compressedAt = data[262] + data[263] * 256 + data[264] * 65536 + data[265] * 16777216,
        cryptedPart = data.subarray(316 + 148 * keyNum),
        signedPart = data.subarray(261), keys = {}, i, j, message;

    if(dataLength != data.byteLength) return false;
    console.log('length ok');
    if(keyNum * 148 > data.byteLength) return false;
    console.log('keysize seems ok');

    var key = [], sig = [], iv = [], salt = [];

    for (i = 0; i < 128; i++) {
        key.push(data[5+i]);
        sig.push(data[133+i]);
    }

    key = bytesToHex(key);
    sig = bytesToHex(sig);

    var testRsa = new RSAKey();
    testRsa.setPublic(key, '10001');
    if (!testRsa.verifyString(signedPart, sig)) {
        console.log('signature error.');
        return false;
    }

    for (i = 0; i < 16; i++) {
        iv.push(data[266+i]);
    }
    
    for (i = 0; i < 32; i++) {
        salt.push(data[282+i]);
    }

    for (j = 0; j < keyNum; j++) {
        var keyhas = [], keyval = [];

        for (i = 0; i < 20; i++) {
            keyhas.push(data[316 + i + j*148]);
        }

        for (i = 0; i < 128; i++) {
            keyval.push(data[336 + i + j*148]);
        }

        keyhas = bytesToHex(keyhas);
        keyval = bytesToHex(keyval);

        keys[keyhas] = keyval;
    }


    var container = {
        id: SHA256(signedPart),
        ts: compressedAt,
        key: key,
        keyhash: hex_sha1(key),
        type: msgType,
        keys: Object.keys(keys),
        message: {text:""}
    };

    if (!(rsa_hash in keys)) {
        container.status = 'NOKEY';
        return container;
    }

    var aesmsg = {
        "iv": sjcl.codec.bytes.toBits(iv),
        "v": 1,
        "iter": 1000,
        "ks": 256,
        "ts": 64,
        "mode": "ccm",
        "cipher": "aes",
        "salt": sjcl.codec.bytes.toBits(salt),
        "ct": sjcl.codec.bytes.toBits(cryptedPart)
    };

    try {
        var password = rsa.decrypt(keys[rsa_hash]);
        var om = sjcl.decrypt(password, aesmsg);
        var inflate = new Zlib.RawInflate(om);
        var plain = inflate.decompress();
        container.status = 'OK';
        container.message = JSON.parse(utf8ArrToStr(plain));
        return container;
    } catch (e) {
        return false;
    }

    return false;
};