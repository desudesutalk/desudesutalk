var contacts = {}, pubKey = null;

var addContact = function(contactStr) {
    contactStr = contactStr.replace(/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]/g, '');
    var words  = bs58.dec(contactStr);

    if(words.length != 33) return false;

    var pubEncKey = words;


    try{
        if(!ECcrypt.keyPair(pubEncKey).validate()){
            return false;
        }
    } catch(e) {
        return false;
    }

    contacts[contactStr] = {
        "publicEnc": pubEncKey,
        "publicKeyPair": words,
        "publicKeyPairPrintable": contactStr,
        "publicKeyPairPrintableHash": sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(words)))
    };

    return contacts[contactStr];
};


var container = null, inputImg = null;
var iv = [];
var j = new jsf5steg();

var handleContainerSelect = function(evt) {
    "use strict";

    container = null;

    var files = evt.target.files; // FileList object

    if (files[0] && files[0].type.match('image.*')) {
        var reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {
                    container = e.target.result;
            };
        })(files[0]);
        reader.readAsArrayBuffer(files[0]);
    }else{
        alert('Please select image!');
    }
};

var handleInputSelect = function(evt) {
    "use strict";

    inputImg = null;

    var files = evt.target.files; // FileList object

    if (files[0] && files[0].type.match('image.*')) {
        var reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {
                    inputImg = e.target.result;
            };
        })(files[0]);
        reader.readAsArrayBuffer(files[0]);
    }else{
        alert('Please select image!');
    }
};


$(function(){

    $('#login').on('submit', function(event){
        event.preventDefault();
        pubKey = cryptCore.login($('#login input[name="login_salt"]').val(), $('#login input[name="login_pwd"]').val());

        var publicKeyPairPrintableHash = pubKey.publicKeyPairPrintableHash;

        $('#login_info').empty().html(publicKeyPairPrintableHash).identicon5({rotate: true,size: 64});
        $('#login_info').append('<br/><br/><i style="color: #090;">'+publicKeyPairPrintableHash+'</i>')
                    .append('<br/><br/><i style="color: #009;">'+pubKey+'</i>');

        console.log(pubKey);
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

        $('#outputdiv').empty();

        if(iv.length == 0){
            iv = sjcl.codec.bytes.fromBits(sjcl.misc.pbkdf2($('input[name="passwd"]').val(), $('input[name="passwd"]').val(), 1000, 256 * 8));
        }

        var msg = $('#encode textarea').val();
        var hideSender = $('#encode input[name="hide_sender"]').attr('checked');
        var hideContacts = $('#encode input[name="hide_contacts"]').attr('checked');
        var start = new Date().getTime();
        
        var c = cryptCore.encodeMessage(JSON.stringify({"msg": msg}), contacts, hideSender, hideContacts);
        console.log(cryptCore.decodeMessage(c.buffer));
        
        try{
            j.parse(container);
        } catch(e){
            alert('Can not use this image!\n' + e);
            console.log(e);
            return false;
        }
        
        j.f5embed(c,iv);
        
        var pck = j.pack();
        
        var jpegDataUri = 'data:image/jpeg;base64,' + arrayBufferDataUri(pck);
        
        $('#outputdiv').append('<a href="'+jpegDataUri+'" download="repack.jpg">download image</a><br/>');
        $('#outputdiv').append('<img src="'+jpegDataUri+'" style="max-width: 200px;">');
        
        var end = new Date().getTime();
        var time = end - start;
        console.log('Encode execution time: ' + time);

        console.log(c);

        return false;
    });

    $('#decode').on('submit', function(event){
        event.preventDefault();

        if(iv.length == 0){
            iv = sjcl.codec.bytes.fromBits(sjcl.misc.pbkdf2($('input[name="passwd"]').val(), $('input[name="passwd"]').val(), 1000, 256 * 8));
        }    

        $('#out_message').val('');    
        $('#contacts_output').empty();

        var start = new Date().getTime();

        try{
            j.parse(inputImg);
        } catch(e){
            alert('Can not use this image!\n' + e);
            return false;
        }
        
        
        var hidData = j.f5extract(iv), m;

        console.log(hidData);

        for (var i = 1; i < 8; i++) {
            m = cryptCore.decodeMessage(hidData[i].buffer);
            if(m) break;            
        };
        
        if(m){
            console.log(m);
            $('#out_message').val((JSON.parse(m.text)).msg);
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

        var end = new Date().getTime();
        var time = end - start;
        console.log('Decode Execution time: ' + time);

        return false;
    });

    $('input[name="passwd"]').on('change', function(){iv = [];});
    $('#image-select').on('change', handleContainerSelect);
    $('#image-read').on('change', handleInputSelect);

});