var EC = ellipticjs.ec("secp256k1"), // Здесь http://safecurves.cr.yp.to/ написано, что эта курва небезопасна, но её используют в Биткоине и Битмессадже
    fieldSize = 32;

var encodeWordArray = function(array) {
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

var pad = function(array, length) {
    if (length === undefined) {
        length = fieldSize;
    }

    for (var i = 0; array.length < length; ++i) {
        array.unshift(0);
    }

    return array;
};

var encodeWordArray = function(array) {
    var result = [];

    for (var i = 0; i < array.sigBytes; ++i) {
        result.push(array.words[i >> 2] >> (24 - (i % 4) * 8) & 0xff);
    }

    return result;
};

var encodePrivateKey = function(key) {
	return pad(key.getPrivate().toArray());
};

var decodePrivateKey = function(encoded) {
    return EC.keyPair(encoded);
};

var encodePublicKey = function(key, compress) {
    var result;

    key = key.getPublic();

    if (key.inf) {
        result = [0];
    } else if (compress) {
        result = pad(key.getX().toArray());
        result.unshift(2 + key.getY().isOdd());
    } else {
        result = pad(key.getX().toArray()).concat(pad(key.getY().toArray()));
        result.unshift(4);
    }

    return result;
};

var decodePublicKey = function(encoded) {
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
    }

    return EC.keyPair(point);
};

var encodeSharedSecret = function(secret) {
	return pad(secret.toArray());
};

var encodeInteger = function(integer) {
	var result = [];

	while (integer) {
		result.push(integer & 0xff);
		integer >>= 8;
	}

	return pad(result.reverse(), 8);
};

// Операции над байтовыми массивами одинакового размера

var xorBytes = function(a, b) {
	for (var i in a) {
		a[i] ^= b[i];
	}

	return a;
};

var contacts = {}, keyPair = null;

var login = function(salt, password) {
    // Есть чрезвычайно пренебрежимо малая вероятность, что ключ будет невалидным
    // Но автору Битмессаджа похуй, например

    var options = {
        keySize: fieldSize / 2,
        iterations: 1001,
        hasher: CryptoJS.algo.SHA256
    };

    var privateKey = encodeWordArray(CryptoJS.PBKDF2(password, salt, options)),
        encKey = decodePrivateKey(privateKey.slice(0,32)),
        sigKey = decodePrivateKey(privateKey.slice(32));

    if(!encKey.validate().result || !sigKey.validate().result){
        alert('Bad key generated! Try another salt/pwd');
        return false;
    }

    var pubEncKey = encKey.getPublic(),
        pubSigKey = sigKey.getPublic(),
        publicKeyPair = encodePublicKey(encKey, true).concat(encodePublicKey(sigKey, true)),
        publicKeyPairPrintable = decodeWordArray(publicKeyPair).toString(CryptoJS.enc.Base64),
        publicKeyPairPrintableHash = CryptoJS.SHA256(decodeWordArray(publicKeyPair)).toString(CryptoJS.enc.Hex);


    $('#login_info').empty().html(publicKeyPairPrintableHash).identicon5({rotate: true,size: 64});
    $('#login_info').append('<br/><br/><i style="color: #090;">'+publicKeyPairPrintableHash+'</i>')
    			    .append('<br/><br/><i style="color: #009;">'+publicKeyPairPrintable+'</i>');

    return {
        "privateEnc": encKey,
        "privateSig": sigKey,
        "publicEnc": pubEncKey,
        "publicSig": pubSigKey,
        "publicKeyPair": publicKeyPair,
        "publicKeyPairPrintable": publicKeyPairPrintable,
        "publicKeyPairPrintableHash": publicKeyPairPrintableHash
    };
};

var addContact = function(contactStr) {
    var words  = encodeWordArray(CryptoJS.enc.Base64.parse(contactStr));

    var pubEncKey = decodePublicKey(words.slice(0, 33)),
        pubSigKey = decodePublicKey(words.slice(33));

    contacts[contactStr] = {
        "publicEnc": pubEncKey,
        "publicSig": pubSigKey,
        "publicKeyPair": words,
        "publicKeyPairPrintable": contactStr,
        "publicKeyPairPrintableHash": CryptoJS.SHA256(decodeWordArray(words)).toString(CryptoJS.enc.Hex)
    };

    return contacts[contactStr];
};

var encodeMessage = function(msg, contacts, hideSender, hideRecievers) {
    var msgRaw = strToUTF8Arr(msg),
        msgCompressed = pako.deflateRaw(msgRaw),
        codedAt = Math.floor((new Date()).getTime() / 15000) * 15,
        msgLength = 16 + msgCompressed.byteLength,
        numContacts = Object.keys(contacts).length + 1, i,
        ephemeral = EC.genKeyPair();

        

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
    if(!hideSender){
        msgLength += 80; // Length of signature here!
    }

    if(!hideRecievers){        
        msgLength += 32 + 66 * numContacts;
    }else if(!hideSender){
        msgLength += 66; // add sender address
    }
    //console.log('msg length: ' + msgLength,contacts.length);

    var containerAB = new ArrayBuffer(msgLength),
        container = new Uint8Array(containerAB),
        contPos = 0;

    var addByte = function(byte){
        container[contPos++] = byte;
    };

    var addBytes = function(bytes){
        //console.log(bytes);

        for (var i = 0; i < bytes.length; i++) {
            addByte(bytes[i]);
        }
    };

    //console.log('msg lng '+msgLength);
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
    	addBytes(encodePrivateKey(ephemeral));

    	for (i in contacts) {
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
	    var sig = keyPair.privateSig.sign(container).toDER();

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

	//console.log('cont: ', container, container[1000]);

    var clearContainer = container,
        cryptedLength = 33 + 16 + 32 * numContacts + Math.floor(clearContainer.byteLength / 16 + 1) * 16,
        crytpoAB = new ArrayBuffer(cryptedLength),
        container = new Uint8Array(crytpoAB),
        contHead = new Uint8Array(containerAB, 0, 32),
        contTail = new Uint8Array(containerAB, 32);

    contPos = 0;

    var sessionKey = ellipticjs.rand(32),
    	iv = ellipticjs.rand(16);

    sessionKey[31] = 0xAA;

    var aesEncryptor = CryptoJS.algo.AES.createEncryptor(decodeWordArray(sessionKey), { iv: decodeWordArray(iv), mode: CryptoJS.mode.CFB});

	var slots = [];

	var secret = encodeSharedSecret(ephemeral.derive(keyPair.publicEnc));
    //console.log('secret', sessionKey);
	slots.push(xorBytes(secret, sessionKey));

	for (i in contacts) {
		secret = encodeSharedSecret(ephemeral.derive(contacts[i].publicEnc.getPublic()));
		slots.push(xorBytes(secret, sessionKey));
	}

	slots = shuffleArray(slots);
    //console.log(slots);

    ephemeral = encodePublicKey(ephemeral, true);
	ephemeral[0] ^= (Math.random() * 0x100 | 0) & 0xfe;

    addBytes(ephemeral);
    addBytes(iv);

    addBytes(encodeWordArray(aesEncryptor.process(decodeWordArray(contHead))));

    //console.log('write contacts: ' + slots.length);
    for (i = 0; i < slots.length; i++) {
    	addBytes(slots[i]);
    };

    addBytes(encodeWordArray(aesEncryptor.process(decodeWordArray(contTail))));
    addBytes(encodeWordArray(aesEncryptor.finalize()));

    

    //console.log(cryptedLength, container);

    //console.log(container, msgRaw, msgCompressed);
    return container;
};

var decodeMessage = function(msg) {
    var ephemAB   = new Uint8Array(msg, 0, 33),
        iv        = decodeWordArray(new Uint8Array(msg, 33, 16)),
        contHead  = decodeWordArray(new Uint8Array(msg, 49, 32)),
        secrets   = new Uint8Array(msg, 81),
        shift = 0, secret, sessionKey = [], ephemeral = [], i, j, aesDecryptor, message = {};
        
        for (i = 0; i < 33; i++) {
            ephemeral.push(ephemAB[i]);
        }

        ephemeral[0] &= 1;
        ephemeral[0] |= 2;


        var firstByte = 0xAA;
        

        try {
            ephemeral = decodePublicKey(ephemeral);
            secret = encodeSharedSecret(keyPair.privateEnc.derive(ephemeral.getPublic()));
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

            //console.log('try secret', JSON.stringify(sessionKey), shift, secrets[shift]);
            aesDecryptor = CryptoJS.algo.AES.createDecryptor(decodeWordArray(sessionKey), { iv: iv, mode: CryptoJS.mode.CFB});

            var res = encodeWordArray(aesDecryptor.process(contHead));

            //console.log(res, shift);

            // [ 68, 69, 83, 85 ]
            if(res[0] == 68  && res[1] == 69  && res[2] == 83  && res[3] == 85 && res[4] == 1){
                //console.log('found! at position: ' + shift);
                //console.log(res);
                message.sessionKey = sessionKey;
                message.senderHidden = !!(res[5] & 1);
                message.contactsHidden = !!(res[5] & 2);
                message.containerVersion = res[4];
                message.timestamp = res[7] + res[8] * 256 + res[9] * 65536 + res[10] * 16777216;
                message.msgLength = res[11] + res[12] * 256 + res[13] * 65536;
                message.contactsNum = res[14] + res[15] * 256;
                message.msgContacts = [];

                //console.log(message, res[5], msg.byteLength, 81 + 32 * message.contactsNum, Math.floor(message.msgLength / 16 + 1) * 16 - 32);

                var finalPart  = decodeWordArray(new Uint8Array(msg, 81 + 32 * message.contactsNum, Math.floor(message.msgLength / 16 + 1) * 16 - 32));
                res = res.concat(encodeWordArray(aesDecryptor.process(finalPart)));
                res = res.concat(encodeWordArray(aesDecryptor.finalize()));

                //console.log(res, res.slice(16+32+66*message.contactsNum, -80));


                //var contactsSkip = (message.contactsHidden?(message.senderHidden?0:32):(32 + 66*message.contactsNum));



                if(message.senderHidden){
                	message.text = utf8ArrToStr(pako.inflateRaw(res.slice(16 + (message.contactsHidden?0:(32 + 66*message.contactsNum)))));  // 
                }else{
                	message.text = utf8ArrToStr(pako.inflateRaw(res.slice(16 + (message.contactsHidden?66:(32 + 66*message.contactsNum)), -80)));
                }


                var pubEncKey, pubSigKey, tmpSecret;

                if(!message.contactsHidden){
                    var otherSecrets = [];

                    message.ephemeralPriv = decodePrivateKey(res.slice(16, 48));

                    for (i = 0; i < message.contactsNum; i++) {
                        otherSecrets[i] = [];
                        for (j = 0; j < 32; j++) {                        
                            otherSecrets[i][j] = secrets[j + i*32] ^ message.sessionKey[j];
                        }
                         otherSecrets[i] = arrayBufferDataUri(otherSecrets[i]);
                    }                    

                    

                    for (i = 0; i < message.contactsNum; i++) {
                        pubEncKey = decodePublicKey(res.slice(     48 + i*66, 33 + 48 + i*66));
                        pubSigKey = decodePublicKey(res.slice(33 + 48 + i*66, 66 + 48 + i*66));
                        tmpSecret = arrayBufferDataUri(encodeSharedSecret(message.ephemeralPriv.derive(pubEncKey.getPublic())));

                        if(otherSecrets.indexOf(tmpSecret) == -1){
                            return undefined;                            
                        }

                        message.msgContacts.push(arrayBufferDataUri(res.slice(     48 + i*66, 66 + 48 + i*66)));
                    }

                }

                if(!message.senderHidden){
                    pubSigKey = decodePublicKey(res.slice(33 + 16 + (message.contactsHidden?0:32), 66 + 16 + (message.contactsHidden?0:32)));
                    message.sender = arrayBufferDataUri(res.slice(16 + (message.contactsHidden?0:32), 66 + 16 + (message.contactsHidden?0:32)));

                    if(!pubSigKey.verify(res.slice(0,-80), res.slice(-80))){
                        return undefined; 
                    }
                    message.signatureOk = true;
                }

                //console.log(message);
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

    $('#encode').on('submit', function(event){
        event.preventDefault();

        var msg = $('#encode textarea').val();
        var start = new Date().getTime();

        
        var c = encodeMessage(JSON.stringify({"msg": msg}), contacts);//, true, true);
        //console.log(c);

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
        	}

        	if(m.msgContacts.length > 0){
        		data += '<b>TO:</b><br/>';
        		for (i = 0; i < m.msgContacts.length; i++) {
        			data += m.msgContacts[i] + '<br>';
        		};
        	}

        	$('#contacts_output').empty().html(data);
        }

        return false;
    });

    if(localStorage.ddt_contacts){
    	var cont = JSON.parse(localStorage.ddt_contacts);
    	for (var i = 0; i < cont.length; i++) {
    		addContact(cont[i]);
    	};
    }

    $('#contacts textarea').val(Object.keys(contacts).join("\n"));

});