var contacts = {};

var add_contact = function(e) {
    "use strict";

    var name = prompt("Name this contact:");
    var key = $(e.target).attr('alt');
    var rsa_hash = hex_sha1(key);

    contacts[rsa_hash] = {
        key: key,
        name: name,
        hide: 0
    };

    localStorage.setItem('magic_desu_contacts', JSON.stringify(contacts));
    render_contact();
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

    if (hash == rsa_hash) {
        return '<strong style="color: #090; font-style: italic" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">Me</strong>';
    }

    if (!(hash in contacts) && key) {
        return '<em style="color: #00f" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">Unknown</em> [<a href="javascript:;" alt="' + key + '" class="hidbord_addcntct_link">add</a>]';
    }

    if (!(hash in contacts)) {
        return '<em style="color: #00f" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">Unknown</em>';
    }

    if ('hide' in contacts[hash] && contacts[hash].hide == 1) {
        return '<strike class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">' + safe_tags(contacts[hash].name) + '</strike>';
    }

    return '<strong class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">' + safe_tags(contacts[hash].name) + '</strong>';

};

var render_contact = function() {
    "use strict";

    var code = '<br><a href="data:text/plain;base64,' + strToDataUri(encodeURIComponent(JSON.stringify(contacts))) + 
               '" download="[DDT] Contacts - ' + document.location.host + ' - ' + dateToStr(new Date(), true) + 
               '.txt">Download contacts as file</a> or import from file: <input type="file" id="cont_import_file" name="cont_import_file"><br/><br/>';

    for (var c in contacts) {
        var ren_action = ('hide' in contacts[c] && contacts[c].hide == 1) ? 'enable' : 'disable';
        code += '<div class="hidbord_msg">' +
            '<div class="cont_identi" style="float: left">' + c + '</div>' +
            '<div  style="float: left; padding: 5px;">' + getContactHTML(c) + '<br/><i style="color: #090">' + c + '</i><br/>' +
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">delete</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">' + ren_action + '</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">rename</a>]</sub></div><br style="clear: both;"/></div>';
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

};

var manage_contact = function(e) {
    "use strict";

    var action = $(e.target).text(),
        key = $(e.target).attr('alt'), name;
    
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
        contacts[key].name = '' + prompt("Name this contact:", contacts[key].name);
    }

    localStorage.setItem('magic_desu_contacts', JSON.stringify(contacts));
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
                    localStorage.setItem('magic_desu_contacts', JSON.stringify(contacts));
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

if (localStorage.getItem('magic_desu_contacts')) {
    contacts = JSON.parse(localStorage.getItem('magic_desu_contacts'));
//    console.log(contacts);
}
