var EC = ellipticjs.ec("secp256k1"), // Здесь http://safecurves.cr.yp.to/ написано, что эта курва небезопасна, но её используют в Биткоине и Битмессадже
    fieldSize = Math.ceil(EC.curve.red.prime.n / 8);

// Операции над массивами байтов

var padBytes = function (array, length) {
    if (length === undefined) {
        length = fieldSize;
    }

    for (var i = 0; array.length < length; ++i) {
        array.unshift(0);
    }

    return array;
};

var xorBytes = function (a, b) {
    if (a.length != b.length) {
        throw new Error("Длины не сходятся");
    }

    for (var i in a) {
        a[i] ^= b[i];
    }

    return a;
};

// Кодирование из внутреннего представления в байтовую форму и наоборот

var encodeWordArray = function (array) {
    var result = [];

    for (var i = 0; i < array.sigBytes; ++i) {
        result.push(array.words[i >> 2] >> (24 - (i % 4) * 8) & 0xff);
    }

    return result;
};

var decodeWordArray = function (bytes) {
    var words = [];

    for (var i in bytes) {
        words[i >> 2] = words[i >> 2] || 0;
        words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
    }

    return CryptoJS.lib.WordArray.create(words, bytes.length);
};

var encodePrivateKey = function (key) {
    return padBytes(key.getPrivate().toArray());
};

var decodePrivateKey = function (encoded) {
    return EC.keyPair(encoded);
};

var encodePublicKey = function (key, compress) {
    var publicKey = key.getPublic();
    var result;

    if (publicKey.inf) {
        result = [0];
    } else if (compress) {
        result = padBytes(publicKey.getX().toArray());
        result.unshift(2 + publicKey.getY().isOdd());
    } else {
        result = padBytes(publicKey.getX().toArray()).concat(padBytes(publicKey.getY().toArray()));
        result.unshift(4);
    }

    return result;
};

var decodePublicKey = function (encoded) {
    var point;

    switch (encoded[0]) {
        case 0:
            point = EC.curve.point(null, null);
            break;

        case 2:
        case 3:
            point = EC.curve.pointFromX(encoded[0] - 2, encoded.slice(1, fieldSize + 1));
            break;

        case 4:
            point = EC.curve.point(encoded.slice(1, fieldSize + 1), encoded.slice(fieldSize + 1, 2 * fieldSize + 1));
        break;

    default:
        throw new Error("Ключ неправильного формата");
    }

    return EC.keyPair(point);
};

var encodeInteger = function (integer) {
    var result = [];

    if (integer < 0 || integer > 0xffffffff) {
        throw new Error("Число вне допустимого диапазона");
    }

    while (integer) {
        result.push(integer & 0xff);
        integer >>= 8;
    }

    return padBytes(result.reverse(), 8); // Тут один хуй 32-битные целые числа
};

var decodeInteger = function (encoded) {
    var result = 0;

    for (var i in encoded) {
        result *= 0x100;
        result += encoded[i];
    }

    return result;
};

// Криптографические операции

var getSharedSecret = function (privateKey, publicKey) {
    var sharedSecret = padBytes(privateKey.derive(publicKey.getPublic()).toArray());

    var PBKDF2Options = {
        keySize: 8,
        iterations: 1,
        hasher: CryptoJS.algo.SHA256
    };

    return encodeWordArray(CryptoJS.PBKDF2(decodeWordArray(sharedSecret), "", PBKDF2Options));
};

var getRandomBytes = function (length) {
    return ellipticjs.rand(length);
};

var getRandomNumber = function () {
    var bytes = ellipticjs.rand(7);
    var result = 0;

    for (var i in bytes) {
        result += bytes[i];
        result /= 0x100;
    }

    return result;
};

var shuffleArray = function (array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(getRandomNumber() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
};

// Самый велосипедный велосипед на свете

var arrayBufferDataUri = function (raw) {
    "use strict";

    var base64 = '',
        encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        bytes = new Uint8Array(raw),
        byteLength = bytes.byteLength,
        byteRemainder = byteLength % 3,
        mainLength = byteLength - byteRemainder,
        a, b, c, d,
        chunk;

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63; // 63       = 2^6 - 1
        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1
        base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
};

var decodeBase64 = function (s) {
    var e={},i,b=0,c,x,l=0,a,r=[],w=String.fromCharCode,L=s.length;
    var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(i=0;i<64;i++){e[A.charAt(i)]=i;}
    for(x=0;x<L;x++){
        c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
        while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r.push(a));}
    }
    return r;
};
