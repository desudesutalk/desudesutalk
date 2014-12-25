var fieldSize = 32, ECcrypt = ellipticjs.ec("secp256k1");

var cryptCore = (function(){
	"use strict";

	var keyPair = null, keyPairBroadcast = null, cryptCore = {};

	var getSharedSecret = function (privateKey, publicKey) {
		var sharedSecret = padBytes(privateKey.derive(ECcrypt.keyPair(publicKey).getPublic()).toArray());
		return sjcl.codec.bytes.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(sharedSecret)));
	};

	cryptCore.login = function login(password, salt, key) {
	    var privateKey = null, encKey = null;

	    if(key){
		    if (ssGet(boardHostName + profileStoreName)) {
		        privateKey = bs58.dec(ssGet(boardHostName + profileStoreName).privateKeyPair);
		    }else{
		    	return false;
		    }
	    }else{
	    	privateKey = sjcl.codec.bytes.fromBits(sjcl.misc.pbkdf2(password, salt, 500017, 256));
	    }

	    encKey = ECcrypt.keyPair(privateKey);

	    try{
	        if(!encKey.validate().result){
	            throw "invalid";
	        }
	    } catch (e) {
	        alert('Bad key generated! Try another salt and/or password.');
	        return false;
	    }

	    var pubEncKey = encKey.getPublic(true, "hex"),
	        publicKeyPair = hexToBytes(pubEncKey),
	        publicKeyPairPrintable = bs58.enc(publicKeyPair),
	        publicKeyPairPrintableHash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(publicKeyPair)));

	    keyPair = {
	    	"privateEnc": encKey,
	        "privateKeyPair": bs58.enc(privateKey),
	        "publicEnc": hexToBytes(pubEncKey),
	        "publicKeyPair": publicKeyPair,
	        "publicKeyPairPrintable": publicKeyPairPrintable,
	        "publicKeyPairPrintableHash": publicKeyPairPrintableHash
	    };

	    ssSet(boardHostName + profileStoreName, keyPair);

	    return {
	        "publicEnc": hexToBytes(pubEncKey),
	        "publicKeyPair": publicKeyPair,
	        "publicKeyPairPrintable": publicKeyPairPrintable,
	        "publicKeyPairPrintableHash": publicKeyPairPrintableHash
	    };
	};

	cryptCore.loginBroadcast = function login(password, salt, key) {
	    var privateKey = null, encKey = null;

	    if(key){
		    if (ssGet(boardHostName + profileStoreName + '2')) {
		        privateKey = bs58.dec(ssGet(boardHostName + profileStoreName + '2').privateKeyPair);
		    }else{
		    	privateKey = bs58.dec('5n24WDyUV5b41fkk8eoocKxZuWTHxpYqDekMwo4MvDv1'); // pass: desu   salt: desu
		    }
	    }else{
	    	privateKey = sjcl.codec.bytes.fromBits(sjcl.misc.pbkdf2(password, salt, 500017, 256));
	    }

	    encKey = ECcrypt.keyPair(privateKey);

	    try{
	        if(!encKey.validate().result){
	            throw "invalid";
	        }
	    } catch (e) {
	        alert('Bad key generated! Try another salt and/or password.');
	        return false;
	    }

	    var pubEncKey = encKey.getPublic(true, "hex"),
	        publicKeyPair = hexToBytes(pubEncKey),
	        publicKeyPairPrintable = bs58.enc(publicKeyPair),
	        publicKeyPairPrintableHash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(publicKeyPair)));

	    keyPairBroadcast = {
	    	"privateEnc": encKey,
	        "privateKeyPair": bs58.enc(privateKey),
	        "publicEnc": hexToBytes(pubEncKey),
	        "publicKeyPair": publicKeyPair,
	        "publicKeyPairPrintable": publicKeyPairPrintable,
	        "publicKeyPairPrintableHash": publicKeyPairPrintableHash
	    };

	    ssSet(boardHostName + profileStoreName + '2', keyPairBroadcast);

	    return {
	        "publicEnc": hexToBytes(pubEncKey),
	        "publicKeyPair": publicKeyPair,
	        "publicKeyPairPrintable": publicKeyPairPrintable,
	        "publicKeyPairPrintableHash": publicKeyPairPrintableHash
	    };
	};

	cryptCore.encodeMessage = function encodeMessage(msg, contacts, hideSender, hideRecievers) {
	    var msgRaw = strToUTF8Arr(msg),
	        msgCompressed = pako.deflateRaw(msgRaw),
	        codedAt = Math.floor((new Date()).getTime() / 15000) * 15,
	        msgLength = 16 + msgCompressed.byteLength + 8,
	        numContacts = Object.keys(contacts).length + 1, i,
	        ephemeral = ECcrypt.genKeyPair(),
	        sessionKey = sjcl.codec.bytes.fromBits(sjcl.random.randomWords(8, 0)), sessionKeyBits, rp,
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
	    }

	    if(!hideSender){
	        msgLength += 80; // Length of signature here!
	    }

	    if(!hideRecievers){        
	        msgLength += 32 + 33 * numContacts;
	    }else if(!hideSender){
	        msgLength += 33; // add sender address
	    }

	    var containerAB = new ArrayBuffer(msgLength - 8),
	        container = new Uint8Array(containerAB), container2sig = container,
	        contPos = 0;

	    if(!hideSender){
	        container2sig = new Uint8Array(containerAB, 0, msgLength - 88);
	    }        

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
	        var sig = keyPair.privateEnc.sign(sjcl.codec.bytes.fromBits(msgHash.update(sjcl.codec.bytes.toBits(container2sig)).finalize())).toDER();
	        
	        if(sig.length > 80){
	            throw 'SIGNATURE TO LOONG!!!';
	        }
	        
	        if(sig.length < 80){
	            var add = 80 - sig.length;
	            for (i = 0; i < add; i++) {
	                sig.push( (Math.random() * 0xFF) & 0xFF);
	            }
	        }

	        addBytes(sig);
	    }   

	    var aes_cypher = new sjcl.cipher.aes(sessionKeyBits),
	        crypted_msg = sjcl.codec.bytes.fromBits(sjcl.mode.ccm.encrypt(aes_cypher, sjcl.codec.bytes.toBits(container), iv, [], 64)),
	        clearContainer = container,
	        cryptedLength = 33 + 16 + 32 * numContacts + crypted_msg.length,
	        crytpoAB = new ArrayBuffer(cryptedLength);
	    container = new Uint8Array(crytpoAB);

	    contPos = 0;

	    addBytes(ephemeral_byte);
	    addBytes(sjcl.codec.bytes.fromBits(iv));

	    addBytes(crypted_msg.slice(0,32));

	    for (i = 0; i < slots.length; i++) {
	        addBytes(slots[i]);
	    }

	    addBytes(crypted_msg.slice(32));

	    return container;
	};

	cryptCore.decodeMessage = function decodeMessage(msg, forBroadcast) {
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
	            secret = getSharedSecret(forBroadcast ? keyPairBroadcast.privateEnc : keyPair.privateEnc, ephemeral);
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

	            var aes_decypher = new sjcl.cipher.aes(sjcl.codec.bytes.toBits(sessionKey));
	            var test_head = sjcl.mode.ccm_head.decrypt(aes_decypher, sjcl.codec.bytes.toBits(contHead), sjcl.codec.bytes.toBits(iv), [], 64);
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

	                aes_decypher = new sjcl.cipher.aes(sjcl.codec.bytes.toBits(sessionKey));
	                try{	                
	                	res = sjcl.mode.ccm.decrypt(aes_decypher, sjcl.codec.bytes.toBits(crypted_msg), sjcl.codec.bytes.toBits(iv), [], 64);
	                } catch(e){
	                	return undefined;   
	                }

	                msgHash.update(sjcl.codec.bytes.toBits(new Uint8Array(msg, 81, 32 * message.contactsNum)));                

	                res = sjcl.codec.bytes.fromBits(res);

	                if(message.senderHidden){
	                    message.text = utf8ArrToStr(pako.inflateRaw(res.slice(16 + (message.contactsHidden?0:(32 + 33*message.contactsNum)))));  // 
	                    msgHash.update(sjcl.codec.bytes.toBits(res));
	                }else{
	                    message.text = utf8ArrToStr(pako.inflateRaw(res.slice(16 + (message.contactsHidden?33:(32 + 33*message.contactsNum)), -80)));
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
	                        pubEncKey = res.slice(     48 + i*33, 33 + 48 + i*33);
	                        tmpSecret = arrayBufferDataUri(getSharedSecret(message.ephemeralPriv, pubEncKey));

	                        if(otherSecrets.indexOf(tmpSecret) == -1){
	                            return undefined;                            
	                        }

	                        message.msgContacts.push(bs58.enc(res.slice(     48 + i*33, 33 + 48 + i*33)));
	                    }
	                }

	                if(!message.senderHidden){
	                    pubSigKey = ECcrypt.keyPair(res.slice(16 + (message.contactsHidden?0:32), 33 + 16 + (message.contactsHidden?0:32)));
	                    message.sender = bs58.enc(res.slice(16 + (message.contactsHidden?0:32), 33 + 16 + (message.contactsHidden?0:32)));

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

	return cryptCore;
})();
