var contacts = {}, cont_groups = [];

var add_contact = function(e) {
    "use strict";

    var name = prompt("Name this contact:");
    var key = $(e.target).attr('alt');
    var rsa_hash = hex_sha1(key);

    contacts[rsa_hash] = {
        key: key,
        name: name,
        hide: 0,
        groups: []
    };

    ssSet(boardHostName + 'magic_desu_contacts', JSON.stringify(contacts));
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

var contactsSelector = function(){
    "use strict";
    var code = '<div id="hidbord_contacts_select"><strong>to:</strong>&nbsp;<select id="hidbord_cont_type"><option selected="selected" value="all">All</option><option value="direct">Direct</option><option disabled="disabled">Groups:</option>';

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

    cont_groups = {};

    var code = '<br><a href="data:text/plain;base64,' + strToDataUri(encodeURIComponent(JSON.stringify(contacts))) + 
               '" download="[DDT] Contacts - ' + document.location.host + ' - ' + dateToStr(new Date(), true) + 
               '.txt">Download contacts as file</a> or import from file: <input type="file" id="cont_import_file" name="cont_import_file"><br/><br/>';

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
            '<div  style="float: left; padding: 5px;">' + getContactHTML(c) + '<br/><i style="color: #090">' + c + '</i><br/>' +
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">delete</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">' + ren_action + '</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">rename</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">groups</a>]</sub></div>'+groups_list+'<br style="clear: both;"/></div>';
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

    cont_groups = Object.keys(cont_groups).sort();
};

var manage_contact = function(e) {
    "use strict";

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
        if(prmpt !== null) contacts[key].name = '' + prmpt;
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

    ssSet(boardHostName + 'magic_desu_contacts', JSON.stringify(contacts));
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
                    ssSet(boardHostName + 'magic_desu_contacts', JSON.stringify(contacts));
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

if (ssGet(boardHostName + 'magic_desu_contacts')) {
    contacts = JSON.parse(ssGet(boardHostName + 'magic_desu_contacts'));
//    console.log(contacts);
}
