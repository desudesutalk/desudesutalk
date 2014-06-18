var rsaProfile = {},
    rsa = new RSAKey(),
    rsa_hash, rsa_hashB64;

var do_login = function() {
    "use strict";

    var lf = document.loginform;

    rng_state = null;

    var buffer = new ArrayBuffer(256);
    var int32View = new Int32Array(buffer);
    var Uint8View = new Uint8Array(buffer);

    var key_from_pass = sjcl.misc.pbkdf2(lf.passwd.value, parseInt(lf.magik_num.value) + "_salt", 10000, 256 * 8);

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

    ssSet(boardHostName + 'magic_desu_numbers', rsaProfile);

    $('#identi').html(rsa_hash).identicon5({
        rotate: true,
        size: 64
    });
    $('#identi').append('<br/><br/><i style="color: #090;">'+rsa_hash+'</i>');
    $('#pub_key_info').val(linebrk(rsa.n.toString(16), 64));
    lf.magik_num.value = lf.passwd.value = '';
};

var do_encode = function() {
    "use strict";

    prev_to = $('#hidbord_cont_type').val();
    prev_cont = $('#hidbord_cont_direct').val();

    var to_group = null;

    if(prev_to.indexOf('group_') === 0){
        to_group = prev_to.substring(6);
    }

    var payLoad = {};

    if(!container_data){
        alert('Image needed. Please select one.');
        return false;
    }

    if(!("n" in rsaProfile)){
        alert('Please log in.');
        return false;   
    }

    payLoad.text = $('#hidbord_reply_text').val();
    payLoad.ts = Math.floor((new Date()).getTime() / 1000);

    var keys = {};
    keys[rsa_hash] = rsaProfile.n;

    for (var c in contacts) {
        if(prev_to == 'direct' && c == prev_cont){
            keys[c] = contacts[c].key;
            continue;
        }
        
        if('hide' in contacts[c] && contacts[c].hide == 1){
            continue;
        }

        if(to_group !== null && contacts[c].groups && $.isArray(contacts[c].groups) && contacts[c].groups.indexOf(to_group) != -1){
            keys[c] = contacts[c].key;
        }

        if(prev_to == 'direct' || to_group !== null){
            continue;
        }

        keys[c] = contacts[c].key;
    }

    var p = encodeMessage(payLoad,keys, 0);
    var testEncode = decodeMessage(p);

    if(!testEncode || testEncode.status != "OK"){
        alert('Error in crypt module!');
        return false;
    }

    var lastRand = stringToByteArray(String(Math.round(Math.random() * 1e6)));

    var out_file = appendBuffer(jpegEmbed(container_data, p),lastRand);
    var compressedB64 = arrayBufferDataUri(out_file);

    sendBoardForm(out_file);
};

var do_decode = function(message, msgPrepend, thumb, fdate, post_id) {
    "use strict";

    var out_msg = {
        post_id: post_id,
        id: message.id,
        txt: {
            ts: message.ts,
            msg: message.message.text
        },
        keyid: message.keyhash,
        pubkey: message.key,
        status: message.status,
        to: message.keys,
    };

    push_msg(out_msg, msgPrepend, thumb);
    return true;
};
