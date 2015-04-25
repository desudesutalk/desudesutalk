var contacts = {}, cont_groups = [];


var add_contact_key = function(contactStr) {
    "use strict";

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

    var name = contactStr.substring(0,3) + "-" + contactStr.substring(3,6) + "-" + contactStr.substring(6,9);

    if (ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage));
    }

    contacts[contactStr] = {
        key: contactStr,
        name: name,
        hide: 0,
        groups: [],
        "publicEnc": pubEncKey,
        "publicKeyPair": words,
        "publicKeyPairPrintable": contactStr,
        "publicKeyPairPrintableHash": sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(words)))        
    };

    ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);

    return contactStr;
};

var add_contact = function(e) {
    "use strict";

    var key = $(e.target).attr('alt');
    var rsa_hash = key;
    var temp_name = rsa_hash.substring(0,3) + "-" + rsa_hash.substring(3,6) + "-" + rsa_hash.substring(6,9);

    if(!add_contact_key(key)){
        alert('Invalid key!');
        return false;
    }

    var name = prompt("Name this contact:", temp_name);

    if (ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage));
    }

    contacts[rsa_hash].name = '' + name;

    ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);
    render_contact();
    $('em[alt="'+rsa_hash+'"]').text('' + name).css({"color": '', "font-weight": "bold", "font-style": 'normal'});
};

var add_contact_string = function(e) {
    "use strict";

    var key = $('#contact_address').val();
    var rsa_hash = key;
    var temp_name = rsa_hash.substring(0,3) + "-" + rsa_hash.substring(3,6) + "-" + rsa_hash.substring(6,9);

    if(!add_contact_key(key)){
        alert('Invalid key!');
        return false;
    }

    var name = prompt("Name this contact:", temp_name);
    if(!name) return false;

    if (ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage));
    }

    contacts[rsa_hash].name = '' + name;

    ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);
    render_contact();
    $('em[alt="'+rsa_hash+'"]').text('' + name).css({"color": '', "font-weight": "bold", "font-style": 'normal'});
};



var add_contact = function(e) {
    "use strict";

    var key = $(e.target).attr('alt');
    var rsa_hash = key;
    var temp_name = rsa_hash.substring(0,3) + "-" + rsa_hash.substring(3,6) + "-" + rsa_hash.substring(6,9);

    if(!add_contact_key(key)){
        alert('Invalid key!');
        return false;
    }

    var name = prompt("Name this contact:", temp_name);
    if(!name) return false;

    if (ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage));
    }

    contacts[rsa_hash].name = '' + name;

    ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);
    render_contact();
    $('em[alt="'+rsa_hash+'"]').text('' + name).css({"color": '', "font-weight": "bold", "font-style": 'normal'});
};

function safe_tags(str) {
    "use strict";

    if(str && typeof str === 'string'){
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    return "";
}

var getContactHTML = function(hash, key) {
    "use strict";

    if(isSavedThread){
        return '<strong class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">' + safe_tags(hash.substring(0,3) + "-" + hash.substring(3,6) + "-" + hash.substring(6,9)) + '</strong>';
    }

    if (hash == rsa_hashB64) {
        return '<strong style="color: #090; font-style: italic" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">Me</strong>';
    }

    if (hash == broad_hashB64) {
        return '<strong style="color: #900; font-style: italic" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">BROADCAST</strong>';
    }

    if (!(hash in contacts)) {
        return '<em style="color: #00f" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">Unknown</em> [<a href="javascript:;" alt="' + hash + '" class="hidbord_addcntct_link">add</a>]';
    }

    if ('hide' in contacts[hash] && contacts[hash].hide == 1) {
        return '<strike class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">' + safe_tags(contacts[hash].name) + '</strike>';
    }

    return '<strong class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">' + safe_tags(contacts[hash].name) + '</strong>';

};

var contactsSelector = function(){
    "use strict";
    var code = '<div id="hidbord_contacts_select"><strong>to:</strong>&nbsp;<select id="hidbord_cont_type"><option selected="selected" value="all">All</option><option value="direct">Direct</option><option value="broadcast">Broadcast</option><option disabled="disabled">Groups:</option>';

    for (var i = 0; i < cont_groups.length; i++) {
        code += '<option value="group_'+safe_tags(cont_groups[i])+'">'+safe_tags(cont_groups[i])+'</option>';
    }
    
    code += '</select>&nbsp;<select id="hidbord_cont_direct" style="display: none;">';
    
    for (var c in contacts) {
        code += '<option value="'+c+'">'+safe_tags(contacts[c].name)+'</option>';
    }

    code += '</select>';

    return code + '</div>';
};

var render_contact = function() {
    "use strict";

    if (ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage));
    //    console.log(contacts);
    }


    cont_groups = {};

    var code = '<br><a href="data:text/plain;base64,' + strToDataUri(encodeURIComponent(JSON.stringify(contacts))) + 
               '" download="[DDT] Contacts - ' + document.location.host + ' - ' + dateToStr(new Date(), true) + 
               '.txt">Download contacts as file</a> or import from file: <input type="file" id="cont_import_file" name="cont_import_file"><br/>' +
               '<p><label>Address: <input name="contact_address" type="text" length=90 id="contact_address" style="width: 400px;"/></label><input type="button" value="Add" id="add_contact_key"/></p>', cnt = 1;

    for (var c in contacts) {
        var ren_action = ('hide' in contacts[c] && contacts[c].hide == 1) ? 'enable' : 'disable';
        var groups_list = '';

        if(contacts[c].groups && $.isArray(contacts[c].groups) && contacts[c].groups.length > 0){
            groups_list = '<div style="float:right; color: #999;">['+safe_tags(contacts[c].groups.join('; '))+']</div>';
            for (var i = 0; i < contacts[c].groups.length; i++) {
                var grp = contacts[c].groups[i].trim().toLowerCase();
                cont_groups[grp] = grp;
            }
        }


        code += '<div class="hidbord_msg">' +
            '<div class="cont_identi" style="float: left">' + c + '</div>' +
            '<div  style="float: left; padding: 5px;">' + getContactHTML(c) + '<br/><i style="color: #009">' + c + '</i><br/>' +
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">delete</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">' + ren_action + '</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">rename</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">groups</a>]</sub></div>'+groups_list+'<div style="float: right; color: #ccc;"><sup>#'+(cnt++)+'</sup></div><br style="clear: both;"/></div>';
    }

    var cont_list = $(code);
    cont_list.find('.cont_identi').identicon5({
        rotate: true,
        size: 48
    });
    cont_list.find('a.hidbord_cont_action').on('click', manage_contact);
    //cont_list.find('#cont_import_file').on('change', import_contact);

    $('.hidbord_contacts').empty().append(cont_list);
    $('.hidbord_contacts #cont_import_file').on('change', import_contact);
    $('#add_contact_key').on('click', add_contact_string);

    cont_groups = Object.keys(cont_groups).sort();
};

var manage_contact = function(e) {
    "use strict";

    if (ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage));
    }

    var action = $(e.target).text(),
        key = $(e.target).attr('alt'), name, prmpt;
    
    if (action == 'delete' && confirm('Really delete?')) {
        delete contacts[key];
    }

    if (action == 'disable' && confirm('Are you sure?')) {
        contacts[key].hide = 1;
    }

    if (action == 'enable' && confirm('Are you sure?')) {
        contacts[key].hide = 0;
    }

    if (action == 'rename') {
        prmpt = prompt("Name this contact:", contacts[key].name);
        if(prmpt !== null) {
            contacts[key].name = '' + prmpt;
            $('strong[alt="'+key+'"]').text('' + prmpt);
            $('em[alt="'+key+'"]').text('' + prmpt).css({"color": '', "font-weight": "bold", "font-style": 'normal'});
        }
    }

    if (action == 'groups') {
        prmpt = prompt("Groups separated by semicolon (;)", $.isArray(contacts[key].groups) ? contacts[key].groups.join('; ') : "");
        if(prmpt !== null){
            if(prmpt === ''){
                contacts[key].groups = [];
            }else{
                contacts[key].groups = prmpt.split(';').map(function(s){return s.trim().toLowerCase();}).sort();
            }
        }
    }

    ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);
    render_contact();
};

var import_contact = function(evt) {
    "use strict";
    var files = evt.target.files; // FileList object

    if (files[0] && files[0].type.match('text.*')) {
        var reader = new FileReader();

//        console.log(files[0]);

        reader.onload = (function(theFile) {
            return function(e) {
                // result e.target.result;                
                try{
//                    console.log(decodeURIComponent(e.target.result));
                    var in_data = JSON.parse(decodeURIComponent(e.target.result));
//                    console.log(in_data);
                    for(var c in in_data){
                        if(!(c in contacts)){
                            contacts[c] = in_data[c];
                        }
                    }
                    ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);
                    render_contact();
                }catch(err){
//                    console.log(err);
                    alert('Can\'t import!');
                }
            };
        })(files[0]);
        reader.readAsText(files[0]);
    }
};

