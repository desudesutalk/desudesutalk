var CODEC_VERSION = 1, MESSAGE_NORMAL = 0, MESSAGE_DIRECT = 1;

var hidboard_hide_sender = false, hidboard_hide_contacts = false;

var encodeMessage = function(message, keys, msg_type, hideSender, hideContacts){
    'use strict';

    return cryptCore.encodeMessage(JSON.stringify(message), contacts, hidboard_hide_sender, hidboard_hide_contacts);
};

var decodeMessage = function(hidData){
    'use strict';
    var m = null;

    for (var i = 1; i < 8; i++) {
        m = cryptCore.decodeMessage(hidData[i].buffer);
        if(m) return m;            
    }
    return false;
};