var do_login = function() {
    "use strict";

    var lf = document.loginform;

    rng_state = null;

    var buffer = new ArrayBuffer(256);
    var int32View = new Int32Array(buffer);
    var Uint8View = new Uint8Array(buffer);

    var key_from_pass = sjcl.misc.pbkdf2(lf.passwd.value, "salt", 10000, 256 * 8);

    int32View.set(key_from_pass);

    for (var i = 0; i < rng_psize; i++) {
        rng_pool[i] = Uint8View[i];
    }

    rng_prefetch = parseInt(lf.magik_num.value);

    rsa.generate(1024, '10001');

    rsaProfile = {
        n: rsa.n.toString(16),
        d: rsa.d.toString(16),
        p: rsa.p.toString(16),
        q: rsa.q.toString(16),
        dmp1: rsa.dmp1.toString(16),
        dmq1: rsa.dmq1.toString(16),
        coeff: rsa.coeff.toString(16)
    };

    rsa_hash = hex_sha1(rsaProfile.n);
    rsa_hashB64 = hex2b64(rsa_hash);

    localStorage.setItem('magic_desu_numbers', JSON.stringify(rsaProfile));

    $('#identi').html(rsa_hash).identicon5({
        rotate: true,
        size: 64
    });
    $('#pub_key_info').val(linebrk(rsa.n.toString(16), 64));
    lf.magik_num.value = lf.passwd.value = '';
};


var do_encode = function() {
    "use strict";

    if(!container_data){
        alert('Image needed. Please select one.');
    }

    var plaintext, p, p2, rp = {}, key, pwd, salt, preIter, ct, iv, message = {}, msgDate, payLoad = {}, i;

    payLoad.msg = $('#hidbord_reply_text').val();
    payLoad.ts = Math.floor((new Date()).getTime() / 1000);

    plaintext = JSON.stringify(payLoad);

    $("#dloadarea").empty();

    preIter = Math.random() * 20;
    for (i = 0; i < preIter; i++) {
        sjcl.random.randomWords(8, 0);
    }
    pwd = sjcl.codec.hex.fromBits(sjcl.random.randomWords(8, 0));
    
    preIter = Math.random() * 20;
    for (i = 0; i < preIter; i++) {
        sjcl.random.randomWords(8, 0);
    }
    salt = sjcl.random.randomWords(8, 0);
    
    preIter = Math.random() * 20;
    for (i = 0; i < preIter; i++) {
        sjcl.random.randomWords(8, 0);
    }
    iv = sjcl.random.randomWords(4, 0);

    var keys = {};
    keys[rsa_hash] = hex2b64(rsa.encrypt(pwd));

    for (var c in contacts) {
        if('hide' in contacts[c] && contacts[c].hide == 1){
            continue;
        }
        var testRsa = new RSAKey();
        testRsa.setPublic(contacts[c].key, '10001');
        keys[c] = hex2b64(testRsa.encrypt(pwd));
    }

    p2 = {
        salt: salt,
        iter: 1000
    };
    p2 = sjcl.misc.cachedPbkdf2(pwd, p2);

    p = {
        adata: JSON.stringify(keys),
        iv: iv,
        iter: 1000,
        mode: "ccm",
        ts: 64,
        ks: 256,
        salt: p2.salt
    };

    message.k = rsa.n.toString(16);

    message.m = sjcl.encrypt(p2.key, plaintext, p, rp);

    message.s = rsa.signStringWithSHA1(message.m);

    var gzip = new Zlib.Gzip(stringToByteArray(JSON.stringify(message)));
    var compressed = gzip.compress();
    var endmark = new Uint8Array(2);
    endmark[0] = 255;
    endmark[1] = 217;

    var out_file = appendBuffer(container_data, appendBuffer(compressed, endmark));

    var compressedB64 = arrayBufferDataUri(out_file);

    $("#dloadarea").empty().append('<a href="data:image/jpeg;base64,' + compressedB64 + '" download="SecretMessageImage.jpg">Download container image</a>');

    sendBoardForm(out_file);

};

var do_decode = function(arc, msgPrepend, thumb, fdate, post_id) {
    "use strict";

    if (arc.byteLength === 0) return false;

    var hasEndMark = false,
        skip = -2;

    for (var i = 0; i < 16; i++) {
        if (arc[arc.byteLength + skip] == 255 && arc[arc.byteLength + skip + 1] == 217) {
            hasEndMark = true;
            break;
        }
        skip--;
    }

    if (!hasEndMark) return false;

    arc = arc.subarray(0, skip);

    var out_msg = {
        post_id: post_id,
        id: '',
        txt: {
            ts: Math.round(fdate.getTime() / 1000),
            msg: null
        },
        keyid: '',
        pubkey: '',
        status: 'OK',
        to: [],
    },
        coded, rp = {}, key, msg;

    try {
        var gunzip = new Zlib.Gunzip(arc);
        var plain = gunzip.decompress();
        plain = ab2Str(plain);
        coded = JSON.parse(plain);
    } catch (e) {
//        console.log('gunzip error.', arc);
        return false;
    }

    out_msg.pubkey = coded.k;

    var testRsa = new RSAKey();
    testRsa.setPublic(coded.k, '10001');
    if (!testRsa.verifyString(coded.m, coded.s)) {
        return false;
    }

    var new_rsa_hash = hex_sha1(coded.k);

    out_msg.keyid = new_rsa_hash;
    out_msg.id = hex_sha1(coded.m);

    msg = coded.m;
    coded = JSON.parse(coded.m);
    var keys;

    try {
        keys = JSON.parse(decodeURIComponent(coded.adata));
    } catch (e) {
        return false;
    }

    for (var kk in keys) {
        out_msg.to.push(kk);
    }

    if (!(rsa_hash in keys)) {
        out_msg.status = 'NOKEY';
//        console.log(out_msg, rsa_hash, keys);
        push_msg(out_msg, msgPrepend, thumb);
        return true;
    }

    try {
        key = rsa.decrypt(b64tohex(keys[rsa_hash]));
        var om = sjcl.decrypt(key, msg, {}, rp);
        out_msg.id = hex_sha1(om);
        out_msg.txt = JSON.parse(om);
    } catch (e) {
        return false;
    }

//    console.log(out_msg);
    push_msg(out_msg, msgPrepend, thumb);

    return true;
};
