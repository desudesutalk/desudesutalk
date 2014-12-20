var contacts = {}, keyPair = null;

var ECcrypt = ellipticjs.ec("secp256k1"), 
    ECsign  = ellipticjs.ec("ed25519"),
    fieldSize = Math.ceil(ECcrypt.curve.red.prime.n / 8);

var login = function(salt, password) {
    var privateKey = sjcl.codec.bytes.fromBits(sjcl.misc.pbkdf2(password, salt, 10002, 512)),
        encKey = ECcrypt.keyPair(privateKey.slice(0,32)),
        sigKey = ECsign.keyPair(privateKey.slice(32));
    
    try{
        if(!encKey.validate().result || !sigKey.validate().result){
            throw "invalid";
        }
    } catch (e) {
        alert('Bad key generated! Try another salt and/or password.');
        return false;
    }

    var pubEncKey = encKey.getPublic(true, "hex"),
        pubSigKey = sigKey.getPublic(true, "hex"),
        publicKeyPair = hexToBytes(pubEncKey + pubSigKey),
        publicKeyPairPrintable = bs58.enc(publicKeyPair),
        publicKeyPairPrintableHash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(publicKeyPair)));


    $('#login_info').empty().html(publicKeyPairPrintableHash).identicon5({rotate: true,size: 64});
    $('#login_info').append('<br/><br/><i style="color: #090;">'+publicKeyPairPrintableHash+'</i>')
                    .append('<br/><br/><i style="color: #009;">'+publicKeyPairPrintable+'</i>');

    return {
        "privateEnc": encKey,
        "privateSig": sigKey,
        "publicEnc": hexToBytes(pubEncKey),
        "publicSig": hexToBytes(pubSigKey),
        "publicKeyPair": publicKeyPair,
        "privateKeyPair": bs58.enc(privateKey),
        "publicKeyPairPrintable": publicKeyPairPrintable,
        "publicKeyPairPrintableHash": publicKeyPairPrintableHash
    };
};

var addContact = function(contactStr) {
    contactStr = contactStr.replace(/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]/g, '');
    var words  = bs58.dec(contactStr);

    if(words.length != 66) return false;

    var pubEncKey = words.slice(0, 33),
        pubSigKey = words.slice(33);

    try{
        if(!ECcrypt.keyPair(pubEncKey).validate() || !ECsign.keyPair(pubSigKey).validate()){
            return false;
        }
    } catch(e) {
        return false;
    }

    contacts[contactStr] = {
        "publicEnc": pubEncKey,
        "publicSig": pubSigKey,
        "publicKeyPair": words,
        "publicKeyPairPrintable": contactStr,
        "publicKeyPairPrintableHash": sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(words)))
    };

    return contacts[contactStr];
};


var encodeMessage = function(msg, contacts, hideSender, hideRecievers) {
    var msgRaw = strToUTF8Arr(msg),
        msgCompressed = pako.deflateRaw(msgRaw),
        codedAt = Math.floor((new Date()).getTime() / 15000) * 15,
        msgLength = 16 + msgCompressed.byteLength + 8,
        numContacts = Object.keys(contacts).length + 1, i,
        ephemeral = ECcrypt.genKeyPair();

/*
[MAGIK           4B] = "DESU" = [ 68, 69, 83, 85 ]
[Flags           3B] = message flags. 24bit (just not decided at the moment)
[Date            4B] = Timestamp
[Length          3B] = Total message length
[Contacts        2B] = Total contacts

if recievers not hidden
[Private e-key  32B] = Private ephemeral keys used for encryption
[Contact public 66B] x number of contacts
                     if sender is not hidden - first contact is sender

if recievers hidden but sender is not
[Contact public 66B] = Sender public Address key

[message         ?B] = message itself

If sender is not hidden
[Signature      80B] = Signature of all above bytes


*/

    var sessionKey = sjcl.codec.bytes.fromBits(sjcl.random.randomWords(8, 0)), sessionKeyBits, rp,
        iv = sjcl.random.randomWords(4, 0),
        slots = [],
        msgHash = new sjcl.hash.sha256(),
        ephemeral_byte = hexToBytes(ephemeral.getPublic(true, "hex"));

    ephemeral_byte[0] ^= (Math.random() * 0x100 | 0) & 0xfe;

    sessionKey[31] = 0xAA;
    sessionKeyBits = sjcl.codec.bytes.toBits(sessionKey);

    var secret = getSharedSecret(ephemeral, keyPair.publicEnc);

    slots.push(xorBytes(secret, sessionKey));

    for (i in contacts) {
        secret = getSharedSecret(ephemeral, contacts[i].publicEnc);
        slots.push(xorBytes(secret, sessionKey));
    }

    slots = shuffleArray(slots);

    msgHash.update(sjcl.codec.bytes.toBits(ephemeral_byte));
    msgHash.update(iv);
    
    for (i = 0; i < slots.length; i++) {
        msgHash.update(sjcl.codec.bytes.toBits(slots[i]));
    };

    if(!hideSender){
        msgLength += 80; // Length of signature here!
    }

    if(!hideRecievers){        
        msgLength += 32 + 66 * numContacts;
    }else if(!hideSender){
        msgLength += 66; // add sender address
    }

    var containerAB = new ArrayBuffer(msgLength - 8),
        container = new Uint8Array(containerAB), container2sig = new Uint8Array(containerAB, 0, msgLength - 88),
        contPos = 0;

    var addByte = function(byte){
        container[contPos++] = byte;
    };

    var addBytes = function(bytes){
        for (var i = 0; i < bytes.length; i++) {
            addByte(bytes[i]);
        }
    };

    addBytes([ 68, 69, 83, 85, // DESU!
        1, // container version;
        (hideSender ? 1 : 0) + (hideRecievers ? 2 : 0),  //flags
        0, // reserved
    
        codedAt & 255, //coding unix_timestamp
        (codedAt >> 8) & 255,
        (codedAt >> 16) & 255,
        (codedAt >> 24) & 255,

        msgLength & 255, //container length
        (msgLength >> 8) & 255,
        (msgLength >> 16) & 255,

        numContacts & 255, //contacts number
        (numContacts >> 8) & 255
    ]);

    var msgContacts = [];

    if(!hideRecievers){
        addBytes(padBytes(ephemeral.getPrivate().toArray()));

        for (i in contacts) {
            if(contacts[i].publicKeyPairPrintable != keyPair.publicKeyPairPrintable)
                msgContacts.push(contacts[i].publicKeyPair);            
        }
        msgContacts = shuffleArray(msgContacts);
    }

    if(!hideSender){
        msgContacts.unshift(keyPair.publicKeyPair);
    }else{
        msgContacts.push(keyPair.publicKeyPair);
        msgContacts = shuffleArray(msgContacts);
    }

    if(!hideSender || !hideRecievers){
        for (i = 0; i < msgContacts.length; i++) {
            addBytes(msgContacts[i]);
        }
    }

    addBytes(msgCompressed);

    if(!hideSender){
        var sig = keyPair.privateSig.sign(sjcl.codec.bytes.fromBits(msgHash.update(sjcl.codec.bytes.toBits(container2sig)).finalize())).toDER();
        
        if(sig.length > 80){
            throw 'SIGNATURE TO LOONG!!!';
        }
        
        if(sig.length < 80){
            var add = 80 - sig.length;
            for (i = 0; i < add; i++) {
                sig.push( (Math.random() * 0xFF) & 0xFF);
            };
        }

        addBytes(sig);
    }

    

    var aes_cypher = new sjcl.cipher['aes'](sessionKeyBits),
        crypted_msg = sjcl.codec.bytes.fromBits(sjcl.mode['ccm'].encrypt(aes_cypher, sjcl.codec.bytes.toBits(container), iv, [], 64));

    var clearContainer = container,
        cryptedLength = 33 + 16 + 32 * numContacts + crypted_msg.length,
        crytpoAB = new ArrayBuffer(cryptedLength),
        container = new Uint8Array(crytpoAB),
        contHead = new Uint8Array(containerAB, 0, 32),
        contTail = new Uint8Array(containerAB, 32);

    contPos = 0;



    addBytes(ephemeral_byte);
    addBytes(sjcl.codec.bytes.fromBits(iv));

    addBytes(crypted_msg.slice(0,32));

    for (i = 0; i < slots.length; i++) {
        addBytes(slots[i]);
    };

    addBytes(crypted_msg.slice(32));

    return container;
};

var decodeMessage = function(msg) {
    var ephemAB   = new Uint8Array(msg, 0, 33),
        iv        = new Uint8Array(msg, 33, 16),
        contHead  = new Uint8Array(msg, 49, 32),
        secrets   = new Uint8Array(msg, 81),
        msgHash   = new sjcl.hash.sha256(),
        shift = 0, secret, sessionKey = [], ephemeral = [], i, j, aesDecryptor, message = {};
        
        msgHash.update(sjcl.codec.bytes.toBits(ephemAB));
        msgHash.update(sjcl.codec.bytes.toBits(iv));

        for (i = 0; i < 33; i++) {
            ephemeral.push(ephemAB[i]);
        }

        ephemeral[0] &= 1;
        ephemeral[0] |= 2;

        var firstByte = 0xAA;        

        try {
            secret = getSharedSecret(keyPair.privateEnc, ephemeral);
            message.ephemeralPub = ephemeral;
            firstByte ^= secret[31];
        } catch (exception) {
            return undefined;
        }

        while(shift < secrets.byteLength){
            
            if(firstByte != secrets[shift + 31]){
                shift += 32;
                continue;
            }

            for (i = 0; i < 32; i++) {
                sessionKey[i] = secrets[i + shift] ^ secret[i];
            }

            var aes_decypher = new sjcl.cipher['aes'](sjcl.codec.bytes.toBits(sessionKey));
            var test_head = sjcl.mode['ccm_head'].decrypt(aes_decypher, sjcl.codec.bytes.toBits(contHead), sjcl.codec.bytes.toBits(iv), [], 64);
            var res = sjcl.codec.bytes.fromBits(test_head);

            // [ 68, 69, 83, 85 ]
            if(res[0] == 68  && res[1] == 69  && res[2] == 83  && res[3] == 85 && res[4] == 1){
                message.sessionKey = sessionKey;
                message.senderHidden = !!(res[5] & 1);
                message.contactsHidden = !!(res[5] & 2);
                message.containerVersion = res[4];
                message.timestamp = res[7] + res[8] * 256 + res[9] * 65536 + res[10] * 16777216;
                message.msgLength = res[11] + res[12] * 256 + res[13] * 65536;
                message.contactsNum = res[14] + res[15] * 256;
                message.msgContacts = [];

                var crypted_msg = appendBuffer(contHead, new Uint8Array(msg, 81 + 32 * message.contactsNum, message.msgLength - 32));

                aes_decypher = new sjcl.cipher['aes'](sjcl.codec.bytes.toBits(sessionKey));
                res = sjcl.mode['ccm'].decrypt(aes_decypher, sjcl.codec.bytes.toBits(crypted_msg), sjcl.codec.bytes.toBits(iv), [], 64);

                msgHash.update(sjcl.codec.bytes.toBits(new Uint8Array(msg, 81, 32 * message.contactsNum)));                

                res = sjcl.codec.bytes.fromBits(res);

                if(message.senderHidden){
                    message.text = utf8ArrToStr(pako.inflateRaw(res.slice(16 + (message.contactsHidden?0:(32 + 66*message.contactsNum)))));  // 
                    msgHash.update(sjcl.codec.bytes.toBits(res));
                }else{
                    message.text = utf8ArrToStr(pako.inflateRaw(res.slice(16 + (message.contactsHidden?66:(32 + 66*message.contactsNum)), -80)));
                    msgHash.update(sjcl.codec.bytes.toBits(res.slice(0, -80)));
                }

                message.msgHash = sjcl.codec.bytes.fromBits(msgHash.finalize());

                var pubEncKey, pubSigKey, tmpSecret;

                if(!message.contactsHidden){
                    var otherSecrets = [];

                    message.ephemeralPriv = ECcrypt.keyPair(res.slice(16, 48));

                    for (i = 0; i < message.contactsNum; i++) {
                        otherSecrets[i] = [];
                        for (j = 0; j < 32; j++) {                        
                            otherSecrets[i][j] = secrets[j + i*32] ^ message.sessionKey[j];
                        }
                         otherSecrets[i] = arrayBufferDataUri(otherSecrets[i]);
                    }                    

                    

                    for (i = 0; i < message.contactsNum; i++) {
                        pubEncKey = res.slice(     48 + i*66, 33 + 48 + i*66);
                        tmpSecret = arrayBufferDataUri(getSharedSecret(message.ephemeralPriv, pubEncKey));

                        if(otherSecrets.indexOf(tmpSecret) == -1){
                            return undefined;                            
                        }

                        message.msgContacts.push(bs58.enc(res.slice(     48 + i*66, 66 + 48 + i*66)));
                    }

                }

                if(!message.senderHidden){
                    pubSigKey = ECsign.keyPair(res.slice(33 + 16 + (message.contactsHidden?0:32), 66 + 16 + (message.contactsHidden?0:32)));
                    message.sender = bs58.enc(res.slice(16 + (message.contactsHidden?0:32), 66 + 16 + (message.contactsHidden?0:32)));

                    if(!pubSigKey.verify(message.msgHash, res.slice(-80))){
                        return undefined; 
                    }
                    message.signatureOk = true;
                }

                message.msgHash = bytesToHex(message.msgHash);

                return message;
            }

            shift += 32;
        }

        return null;
};




$(function(){

    $('#login').on('submit', function(event){
        event.preventDefault();
        keyPair = login($('#login input[name="login_salt"]').val(), $('#login input[name="login_pwd"]').val());
        console.log(keyPair);
        return false;
    });
    
    $('#contacts').on('submit', function(event){
        event.preventDefault();
        var c = addContact($('#contacts input[name="contact_address"]').val());
        console.log(c);

        localStorage.ddt_contacts = JSON.stringify(Object.keys(contacts));
        $('#contacts textarea').val(Object.keys(contacts).join("\n"));
        return false;
    });
    var cc;

    $('#clear_contacts').on('click', function(event){
        event.preventDefault();

        contacts = {};

        localStorage.ddt_contacts = JSON.stringify([]);
        $('#contacts textarea').val('');
        
        return false;
    });

    if(localStorage.ddt_contacts){
        var cont = JSON.parse(localStorage.ddt_contacts);
        for (var i = 0; i < cont.length; i++) {
            addContact(cont[i]);
        };
    }

    $('#contacts textarea').val(Object.keys(contacts).join("\n"));



    $('#encode').on('submit', function(event){
        event.preventDefault();

        var msg = $('#encode textarea').val();
        var hideSender = $('#encode input[name="hide_sender"]').attr('checked');
        var hideContacts = $('#encode input[name="hide_contacts"]').attr('checked');

        var start = new Date().getTime();
        
        var c = encodeMessage(JSON.stringify({"msg": msg}), contacts, hideSender, hideContacts);//, true, true);

        var end = new Date().getTime();
        var time = end - start;
        console.log('Encode Execution time: ' + time);

        start = new Date().getTime();        
        console.log(decodeMessage(c.buffer));

        end = new Date().getTime();
        time = end - start;
        console.log('Decode Execution time: ' + time);

        $('#decode #in_coded').val(arrayBufferDataUri(c).match(/.{1,64}/g).join("\n"));

        return false;
    });

    $('#decode').on('submit', function(event){
        event.preventDefault();

        var msg = decodeBase64($('#decode #in_coded').val().replace(/[^a-z-A-Z0-9\/\+]/g, ''));
        var c = new Uint8Array(msg.length);

        for (var i = 0; i < msg.length; i++) {
            c[i] = msg[i];
        };

        var start = new Date().getTime();

        var m = decodeMessage(c.buffer);

        var end = new Date().getTime();
        var time = end - start;
        console.log(m);

        console.log('Decode Execution time: ' + time);

        if(m){
            $('#encode textarea').val((JSON.parse(m.text)).msg);
            var data = '';
            if(m.sender){
                data += '<b>FROM:</b> ' + m.sender + '<br/><br/>';
            }else{
                data += '<b>FROM:</b> Unknown<br/><br/>';
            }

            if(m.msgContacts.length > 0){
                data += '<b>TO:</b><br/>';
                for (i = 0; i < m.msgContacts.length; i++) {
                    data += m.msgContacts[i] + '<br>';
                };
            }else{
                data += '<b>TO:</b> ' + m.contactsNum + ' hidden contacts.';
            }

            $('#contacts_output').empty().html(data);
        }else{
            $('#contacts_output').empty().html('<b style="color: #f00;">DECODE FAIL.</b>');
        }

        return false;
    });


});