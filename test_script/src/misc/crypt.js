var CODEC_VERSION = 1, MESSAGE_NORMAL = 0, MESSAGE_DIRECT = 1;

var hidboard_hide_sender = false, hidboard_hide_contacts = false;

var encodeMessage = function(message, keys, msg_type, hideSender, hideContacts){
    'use strict';

    return cryptCore.encodeMessage(JSON.stringify(message), keys, hidboard_hide_sender, hidboard_hide_contacts);
};

var decodeMessage = function(hidData){
    'use strict';
    var m = null, i;

    for (i = 1; i < 8; i++) {
        if(!hidData[i]) continue;
        m = cryptCore.decodeMessage(hidData[i].buffer, true);
        if(m) {
        	m.isBroad = true;
        	return m;
        }
    }

    for (i = 1; i < 8; i++) {
    	if(!hidData[i]) continue;
        m = cryptCore.decodeMessage(hidData[i].buffer);
        if(m) {
        	m.isBroad = false;
        	return m;
        }
    }
    return false;
};