// крестики, сердечки и цветочки (для красоты)
// †♥♥♥♥♥✿♥✿♥✿♥✿♥✿♥✿♥✿♥✿♥✿♥✿♥✿✿✿✿✿✿†

var desudesuicon = 'data:image/png;base64,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';

var injectCSS = function(css) {
	"use strict";

    $('<style type="text/css">' + css + '</style>').appendTo("head");
};

var inject_ui = function() {
	"use strict";

    var ui = '<div class="hidbord_main" style="display: none">'+
            '    <div class="hidbord_thread hidbord_maincontent">'+
            '        <p style="text-align: center; display: none;" id="allgetter_button">'+
            '        </p>'+
            '        <p style="text-align: center; display: none;" id="hidbord_reply_button">'+
            '        </p><p style="text-align: center; height: 80%;">'+
            '        </p>'+
            '    </div>'+
            '    <div class="hidbord_contacts hidbord_maincontent" style="display: none"></div>'+
            '    <div class="hidbord_config hidbord_maincontent" style="display: none">'+
            '    <div class="hidbord_msg"><h3 style="text-align: center;">Your key:</h3><p id="identi" style="text-align: center;"></p>'+
            '        <form name="loginform" style="margin: 0;">'+
            '                    <table style="margin-left:auto; margin-right:auto; text-align: right;"><tr><td>Password: </td><td><input name="passwd" type="text" value=""  style="width: 300px; color: rgb(221, 221, 221); max-width: none;"></td></tr><tr><td>Salt: </td>'+
            '                    <td><input name="magik_num" type="text" value="" style="width: 300px; color: rgb(221, 221, 221); max-width: none;"></td></tr>'+
            '                    <tr><td>&nbsp;</td><td style="text-align: left;"><input type="button" value="log in" id="do_login"></td></tr></table>'+
            '            </p>'+
            '        </form></div>'+

            '    <div class="hidbord_msg"><p id="identi" style="text-align: center;"></p>'+

            '            <p  style="text-align: center;">'+
            '                    <label>Use global contacts: <input type="checkbox" id="hidboard_option_globalcontacts" style="vertical-align:middle;" checked></label>'+
            '            </p>'+

            '            <p  style="text-align: center;">'+
            '                    <label>Store contacts in public: <input type="checkbox" id="hidboard_option_pubstore" style="vertical-align:middle;" checked></label><br/>'+
            '                     (Should be used with Scriptish. Also this will disable "Global contacts")'+
            '            </p>'+

            '            <p  style="text-align: center;">'+
            '                    <label>Autoscan is on by default: <input type="checkbox" id="hidboard_option_autoscanison" style="vertical-align:middle;" checked></label>'+
            '            </p>'+


            '        </div>'+

            '    <div class="hidbord_msg">'+
            '        <p style="text-align: center; background: #f00; color: #fff;"><b>DANGER ZONE!!!</b></p>'+
            '        <p style="text-align: center;">Change this only when you know what you\'re doing!</p><hr/>'+
            '        <h3 style="text-align: center;">Broadcast address:</h3><p id="identi_broad" style="text-align: center;"></p>'+
            '        <form name="broadcastform" style="margin: 0;">'+
            '                    <table style="margin-left:auto; margin-right:auto; text-align: right;"><tr><td>Password: </td><td><input name="passwd" type="text" value=""  style="width: 300px; color: rgb(221, 221, 221); max-width: none;"></td></tr><tr><td>Salt: </td>'+
            '                    <td><input name="magik_num" type="text" value="" style="width: 300px; color: rgb(221, 221, 221); max-width: none;"></td></tr>'+
            '                    <tr><td>&nbsp;</td><td style="text-align: left;"><input type="button" value="set" id="do_login_broadcast"></td></tr></table>'+
            '            </p>'+
            '            <hr/><p  style="text-align: center;">'+
            '                    Steg Password: <input name="steg_pwd" type="text" value="desu" size=10 id="steg_pwd">'+
            '            </p>'+
            '        </form></div>'+


            '    </div>'+
            '    <div class="hidbord_head">'+
            '        <img alt="Moshi moshi!" title="Moshi moshi!" src="' + desudesuicon +'" width="64" style="float:left;" class="hidbord_clickable" id="hidbord_headicon">'+
            '        <h3 class="hidbord_clickable" style="text-shadow: 0 1px 0 #fff;">'+
                        '<span style="color: #900">De</span>'+
                        '<span style="color: #090">su</span> '+
                        '<span style="color: #900">De</span>'+ /*jshint newcap: false  */
                        '<span style="color: #090">su</span> Test?<span style="font-size: x-small;">&nbsp;(v'+(typeof GM_info !== 'undefined' ? GM_info.script.version : GM_getMetadata("version"))+')</span></h3>'+
                    '<div class="hidbord_nav">'+
            '            <div class="hidbord_clickable active" id="hidbord_show_msgs">Messages</div>'+
            '            <div class="hidbord_clickable" id="hidbord_show_cntc">Contacts</div>'+
            '            <div class="hidbord_clickable" id="hidbord_show_cfg">Log in!</div>'+
            '        </div>'+
            '    </div>'+
                '<div style="position: absolute;left: 0;right: 0;bottom: 0;background-color: rgb(217,225,229);border-top: 1px solid #fff;  box-shadow: 0 0 10px #000;height: 27px;text-align: center;padding: 0 5px;">'+
                '<input type="button" value="Write reply" style="font-weight: bold;float: left;font-size: 12px;" id="hidbord_btn_reply">'+
                '<input type="button" value="Get old messages" style="font-size: 12px;" id="hidbord_btn_getold">&nbsp;<label><input type="checkbox" id="hidboard_option_autofetch" style="vertical-align:middle;" checked>autoscan</label>'+
                '<a href="javascript:;" style="float: right;line-height: 27px;" id="hidbord_btn_checknew">check for new</a>'+
                '</div>'+
            '</div>'+
            '<div class="hidbord_notifer">'+
            '    <img id="hidbord_show" class="hidbord_clickable" alt="Moshi moshi!" title="Moshi moshi!" src="' + desudesuicon +'" width="32" style="margin:0; z-index:1050;vertical-align: bottom;"/>'+
            '<span id="hidbord_notify_counter" class="hidbord_clickable" style="position: absolute;background: #f00;z-index: 100;bottom: 4px;right: 4px;font-weight: bold;padding: 2px 7px;border-radius: 30px; color: #fff;box-shadow: 0 0 1px #f00;font-size: 15px;display: none;">1</span>'+
            '</div>';
    
    injectCSS('.hidbord_popup a, .hidbord_main a {color: #ff6600;} .hidbord_popup a:hover, .hidbord_main a:hover {color: #0066ff;}'+
            '.hidbord_notifer{ z-index: 1000; font-size: smaller !important;padding: 0;font-family: calibri;position: fixed;bottom: 25px;right: 25px;box-shadow: 0 0 10px #999;display: block;border: 3px solid #fff;border-radius: 5px;background-color: rgb(217,225,229);overflow: hidden;} '+
            '.hidbord_msg code { padding: 0 4px; font-size: 90%; color: #c7254e; background-color: #f9f2f4; white-space: nowrap; border-radius: 4px; } '+
            '.hidbord_msg code, .hidbord_msg kbd, .hidbord_msg pre, .hidbord_msg samp { font-family: Menlo,Monaco,Consolas,"Courier New",monospace; white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word; } '+
            '.hidbord_spoiler code { padding: 0; } '+
            '.hidbord_msg pre { clear: left; display: block; padding: 9.5px; margin: 10px; font-size: 13px; line-height: 1.42857143; word-wrap: break-word; border-radius: 4px; white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word; } '+
            '.hidbord_spoiler, .hidbord_spoiler code { background-color: #CCCCCC; } '+
            '.hidbord_spoiler:not(:hover) pre{ background-color: #CCCCCC; } '+
            '.hidbord_spoiler:not(:hover) img{ opacity: 0; } '+
            '.hidbord_spoiler:not(:hover), .hidbord_spoiler:not(:hover) * { color: #CCCCCC !important; } '+
            '.hidbord_quot1 { color: #789922; }'+
            '.hidbord_quot2 { color: #546c18; } '+
            '.hidbord_main { z-index: 1000; color: #800000 !important; font-size: medium !important; font-family: calibri; position: fixed; bottom: 25px; right: 25px; box-shadow: 0 0 10px #999; display: block; width: 650px; border: 3px solid #fff; border-radius: 5px; background-color: rgb(217,225,229); overflow: hidden; top: 25px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAEAgMAAADUn3btAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gQIFQEfWioE/wAAAAlQTFRF0Njc2eHl////72WY8QAAAAFiS0dEAmYLfGQAAAAQSURBVAgdY2BlEGEIYHAEAAHAAKtr/oOEAAAAAElFTkSuQmCC); } '+
            '.hidbord_maincontent{ padding: 5px; overflow-y: scroll; overflow-x: hidden; position: absolute; top: 65px; width: 640px; bottom: 28px; } '+
            '.hidbord_head{ height: 64px; border-bottom: 1px solid #fff; box-shadow: 0 0 10px #000; position: absolute; top: 0; left: 0; right: 0; text-align: center; background-color: rgb(217,225,229); } '+
            '.hidbord_head h3{ margin-top: 5px; padding-left: 0; font-family: comic sans ms; font-style: italic; font-size: x-large; } '+
            '.hidbord_nav{ position: absolute; bottom: 0; margin: auto; width: 370px; left: 0; right: 0; } '+
            '.hidbord_nav div{ display: inline-block; background: #eee; width: 120px; } '+
            '.hidbord_nav .active{ background: #fff; box-shadow: 0 0 5px #999; } '+
            '.hidbord_msg { font-family: calibri; display: block; border-right: 1px solid #999; border-bottom: 1px solid #999; border-left: 1px solid #fafafa; border-top: 0; margin: 2px 10px 10px 2px; background-color: #fafafa; padding: 5px; word-wrap: break-word;} '+
            '.hidbord_msg_focused { border: 1px dashed #e00; } '+
            '.hidbord_msg_new { background-color: #ffe; } '+
            '.hidbord_main hr, .hidbord_popup hr { background:#ddd; border:0; height:1px } '+
            '.hidbord_mnu{ visibility: hidden; font-size: x-small; float:right; } '+
            '.hidbord_msg:hover .hidbord_mnu { visibility: visible; } '+
            '.hidbord_msg ol, .hidbord_msg ul { clear: both; } '+
            '.hidbord_mnu a { color: #999; padding: 0.2em 0.4em; text-decoration: none; border: 1px solid #fff; } '+
            '.hidbord_mnu a:hover { background: #fe8; border: 1px solid #db4; } '+
            '.hidbord_clickable { cursor: pointer; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: -moz-none; -ms-user-select: none; user-select: none; }'+
            '.hidbord_hidden { display: none; } .hidbord_main h3 {background: none}'+
            '.hidbord_popup {z-index: 2000; font-size: medium !important; font-family: calibri; color: #800000 !important;}');
    
    //Highlight.js
    injectCSS('.hljs { display: block; padding: 0.5em; background: #002b36; color: #839496; } .hljs-comment, .hljs-template_comment, .diff .hljs-header, .hljs-doctype, .hljs-pi, .lisp .hljs-string, .hljs-javadoc { color: #586e75; }  .hljs-keyword, .hljs-winutils, .method, .hljs-addition, .css .hljs-tag, .hljs-request, .hljs-status, .nginx .hljs-title { color: #859900; }  .hljs-number, .hljs-command, .hljs-string, .hljs-tag .hljs-value, .hljs-rules .hljs-value, .hljs-phpdoc, .tex .hljs-formula, .hljs-regexp, .hljs-hexcolor, .hljs-link_url { color: #2aa198; }  .hljs-title, .hljs-localvars, .hljs-chunk, .hljs-decorator, .hljs-built_in, .hljs-identifier, .vhdl .hljs-literal, .hljs-id, .css .hljs-function { color: #268bd2; }  .hljs-attribute, .hljs-variable, .lisp .hljs-body, .smalltalk .hljs-number, .hljs-constant, .hljs-class .hljs-title, .hljs-parent, .haskell .hljs-type, .hljs-link_reference { color: #b58900; }  .hljs-preprocessor, .hljs-preprocessor .hljs-keyword, .hljs-pragma, .hljs-shebang, .hljs-symbol, .hljs-symbol .hljs-string, .diff .hljs-change, .hljs-special, .hljs-attr_selector, .hljs-subst, .hljs-cdata, .clojure .hljs-title, .css .hljs-pseudo, .hljs-header { color: #cb4b16; }  .hljs-deletion, .hljs-important { color: #dc322f; }  .hljs-link_label { color: #6c71c4; } .tex .hljs-formula { background: #073642; } ');
    
    $('body').append(ui);

    $('.hidbord_notifer .hidbord_clickable').on('click', function() {
        $('.hidbord_notifer').hide();
        $('body').css('margin-right', '680px');
        $('.hidbord_main').show();
    });

    $('.hidbord_head h3, .hidbord_head #hidbord_headicon').on('click', function() {
        $('.hidbord_main').hide();
        $('.hidbord_msg_new').removeClass('hidbord_msg_new');
        $('body').css('margin-right', '0');
        $('#hidbord_notify_counter').hide();
        new_messages = 0;
        $('.hidbord_notifer').show();
    });

    $('#hidbord_show_msgs').on('click', function() {
        $('.hidbord_maincontent').hide();
        $('.hidbord_thread').show();
        $('.hidbord_nav div').removeClass('active');
        $('#hidbord_show_msgs').addClass('active');
    });

    $('#hidbord_show_cntc').on('click', function() {
        $('.hidbord_maincontent').hide();
        $('.hidbord_contacts').show();
        $('.hidbord_nav div').removeClass('active');
        $('#hidbord_show_cntc').addClass('active');
    });

    $('#hidbord_show_cfg').on('click', function() {
        $('.hidbord_maincontent').hide();
        $('.hidbord_config').show();
        $('.hidbord_nav div').removeClass('active');
        $('#hidbord_show_cfg').addClass('active');
    });

    $('#hidboard_option_autofetch').on('change', function() {
        autoscanNewJpegs = $('#hidboard_option_autofetch').attr('checked');
    });

    $('#hidboard_option_pubstore').on('change', function() {
        contactsInLocalStorage = !!$('#hidboard_option_pubstore').attr('checked');
        ssSet('magic_desu_contactsInLocalStorage', !!$('#hidboard_option_pubstore').attr('checked'));
        render_contact();
    });

    if(!useGlobalContacts){
        $('#hidboard_option_globalcontacts').attr('checked', null);
    }else{
        $('#hidboard_option_pubstore').attr('checked', null);
    }

    if(!contactsInLocalStorage){
        $('#hidboard_option_pubstore').attr('checked', null);        
    }

    if(!autoscanNewJpegs){
        $('#hidboard_option_autofetch').attr('checked', null);
        $('#hidboard_option_autoscanison').attr('checked', null);
    }

    $('#hidboard_option_globalcontacts').on('change', function() {
        ssSet('magic_desu_useGlobalContacts', !!$('#hidboard_option_globalcontacts').attr('checked'));
        if(ssGet('magic_desu_useGlobalContacts')){
            useGlobalContacts = true;
            contactsInLocalStorage = false;
            $('#hidboard_option_pubstore').attr('checked', null);
            ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);
            render_contact();
        }else{
            useGlobalContacts = false;
            render_contact();
        }
    });

    $('#hidboard_option_autoscanison').on('change', function() {
        ssSet(boardHostName + 'autoscanDefault', !!$('#hidboard_option_autoscanison').attr('checked'));
    });

    $('#hidbord_btn_reply').on('click', function() {
        $('.hidbord_maincontent').hide();
        $('.hidbord_thread').show();
        $('.hidbord_nav div').removeClass('active');
        $('#hidbord_show_msgs').addClass('active');
        showReplyform('#hidbord_reply_button');
    });

    $('#hidbord_btn_checknew').on('click', function() {
        $('#de-updater-btn').click();
        $('a#yukiForceUpdate').click();
        $('a#update_thread').click();
        if(is4chan){
            $('a[data-cmd=update]').first().click();
        }
    });

    $('#do_login').on('click', do_login);
    $('#do_login_broadcast').on('click', do_loginBroadcast);

    $('#hidbord_btn_getold').on('click', read_old_messages);

    $('#steg_pwd').on('change', function() {
        ssSet(boardHostName + 'magic_desu_pwd', $('#steg_pwd').val());
        steg_iv = [];
    });


};

var popup_del_timer;

var do_popup = function(e) {
	"use strict";

    var msgid = $(e.target).attr('alt'),
        fromId = $(e.target).closest('.hidbord_msg').first().attr('id').replace(/^msg_/, ''),
        msgClone, oMsg, oMsgH;

    $('#hidbord_popup_' + msgid).remove();
    $('body').append('<div class="hidbord_popup" id="hidbord_popup_' + msgid + '" style="position: fixed; top: 0; right: -1250px; width: 611px;"></div');

    if(!all_messages[msgid]){
        oMsg = msgClone = $('<div style="padding: 10px; background: #fee; border: 1px solid #f00; font-weight: bold; text-align:center;">NOT FOUND</div>');
        $('#hidbord_popup_' + msgid).append(msgClone);
        oMsgH = 50;
    } else{
        var msg = all_messages[msgid], txt, person, msgTimeTxt,
            msgDate = new Date();
        
        msgDate.setTime(parseInt(msg.txt.ts) * 1000);
    
        if (msg.status == 'OK') {
            txt = wkbmrk(msg.txt.msg);        
        } else {
            txt = '<p><strong style="color: #f00; font-size: x-large;">NOT FOR YOU! CAN\'T BE DECODED!</strong></p>';
        }

        msgTimeTxt = dateToStr(msgDate);

        if(msg.senderHidden){
            person = '<b>Anonymous</b>';
        }else{
            person = getContactHTML(msg.keyid, msg.pubkey);
        }

        var code = '<div class="hidbord_msg" id="msg_' + msg.id + '" style="margin: 0;">'+
                   '    <div style="overflow: hidden" class="hidbord_msg_header" >'+ 
                   (msg.keyid !=='' ? '<span style="background: #fff;" class="idntcn2">' + msg.keyid + '</span>&nbsp;' : '') + person +
                   ' <i style="color: #999;">(' + msgTimeTxt + ') <span href="javascript:;" class="hidbord_mnu_reply hidbord_clickable">#'+msg.id.substr(0, 8)+'</span></i>'+
                   '    </div>'+
                   '    <hr style="clear:both;">'+
                   '    <div style="overflow: hidden;"><img src="'+msg.thumb+'" class="hidbord_post_img hidbord_clickable" style="max-width: 150px; max-height:150px; float: left; padding: 5px 15px 5px 5px;"/>' + txt + '</div>'+
                   '<span class="msgrefs" style="font-size: 11px;font-style: italic;"></span>'+
                   '</div>';

        $('#hidbord_popup_' + msgid).append(code).css('box-shadow', ' 0 0 10px #555');

        msgClone = $('#hidbord_popup_' + msgid).css('margin', '0');
        oMsgH = msgClone.height();
    }

    var opy = $(e.target).offset().top - window.scrollY,
        px = e.clientX,
        py = 10 + opy + $(e.target).height(),
        height_css = null;

    if (py > $(window).height() / 2) {
        py -= oMsgH + 20 + $(e.target).height();
        if(py < 10 ){
            height_css = (opy- 25);
            py = 10;
            msgClone.css({"overflow-y":"scroll", height: height_css+'px'});
        }        
    }else{
        if(py + oMsgH + 20 > $(window).height()){
            height_css = ($(window).height() - py - 20);
            msgClone.css({"overflow-y":"scroll", height: height_css+'px'});
        }
    }

    msgAppendListeners('#hidbord_popup_' + msgid);

    renderRefs(msgid, '#hidbord_popup_' + msgid);

    $('#hidbord_popup_' + msgid).css({'right': '50px', 'top': py+'px'});

    $('#hidbord_popup_' + msgid + ' .hidbord_msglink[alt="'+fromId+'"]').css({'text-decoration': 'none', 'border-bottom':'1px dashed', 'font-weight': 'bold' });

    var local_popup_del_timer;

    $('#hidbord_popup_' + msgid ).on('mouseover', function() {
        clearTimeout(local_popup_del_timer);
        clearTimeout(msgPopupTimers[msgid]);
    }).on('mouseout', function(){
        local_popup_del_timer = setTimeout(function() {
            $('#hidbord_popup_' + msgid).remove();
        }, 200);
    });

};

var msgPopupTimers = {};

var del_popup = function(e) {
	"use strict";

    var msgid = $(e.target).attr('alt');
    
    clearTimeout(msgPopupTimers[msgid]);

    if(msgid == 'file_selector'){
        $('#file_selector').remove();
        return;
    }
    
    msgPopupTimers[msgid] = setTimeout(function() {
        if(msgid == 'msg_preview'){
            $('#prev_popup').remove();
        }else{
            $('#hidbord_popup_' + msgid).remove();
        }
    }, 200);
};

var msgAppendListeners = function(msgQuery){
    "use strict";

    $(msgQuery + ' .idntcn').identicon5({
        rotate: true,
        size: 40
    });

    $(msgQuery + ' .hidbord_addcntct_link').on('click', add_contact);
    $(msgQuery + ' .hidbord_mnu_reply').on('click', replytoMsg);
    $(msgQuery + ' .hidbord_usr_reply').on('click', replytoUsr);
    $(msgQuery + ' .hidbord_mnu_replydirect').on('click', replytoMsgDirect);

    $(msgQuery + ' #hidbord_mnu_info').on('click', function(e){
        var msg_id = $(e.target).closest('.hidbord_msg').first().attr('id');
        var headrs = $(e.target).closest('.hidbord_msg').first().find('#' + msg_id + ' .hidbord_msg_header');
        for (var i = 0; i < headrs.length; i++) {
            var elm = $(headrs[i]);
            if(elm.css('display') == 'none'){
                elm.removeClass('hidbord_hidden');
            }else{
                elm.addClass('hidbord_hidden');
            }

        }
    });

    $(msgQuery + ' .hidbord_post_img').on('click', function(e){
        var imgname = e.target.src.replace(/.+?\/([^\/]+)$/, '$1');
        window.scrollTo(0, $('a img[src*="' + imgname + '"]').offset().top);
    });    

    var new_msg = $(msgQuery);

    new_msg.on('mouseout', function() {
        $(this).removeClass('hidbord_msg_new');
    });


    new_msg.find('pre').each(function(i, e) {
        hljs.highlightBlock(e);
    });

    new_msg.find('.hidbord_msglink').on('mouseover', function(e){
        var msgid = $(e.target).attr('alt');   
        msgPopupTimers[msgid] = setTimeout(function() {
            do_popup(e);
        }, 200);

    }).on('mouseout', del_popup)
        .on('click', function(e) {
            var to_msg = $('#msg_' + $(e.target).attr('alt'));
            $('.hidbord_msg_focused').removeClass('hidbord_msg_focused');
            to_msg.addClass('hidbord_msg_focused').children().one('click', function(e) {
                $(e.target).parent().removeClass('hidbord_msg_focused');
            });
            $('.hidbord_thread')[0].scrollTop += to_msg.offset().top - 100 - window.scrollY;
        });

    new_msg.find('.idntcn2').identicon5({
        rotate: true,
        size: 18
    }); 
};

var renderRefs = function(msgId, elm){
    "use strict";

    if(!ref_map[msgId]){
        return false;
    }

    if(!elm){
        elm = '#msg_' + msgId;
    }

    ref_map[msgId].sort(function(m1, m2) {
        var a = messages_list.indexOf(m1),
            b = messages_list.indexOf(m2);
        return b - a;
    });

    var links = '';

    for (var i = 0; i < ref_map[msgId].length; i++) {
        links += '<a href="javascript:;" alt="' + ref_map[msgId][i] + '" class="hidbord_msglink">&gt;&gt;' + ref_map[msgId][i].substr(0, 8) + '</a> &nbsp; ';
    }

    if(links !== ''){
        $(elm + ' .msgrefs').empty().append('replies: ' + links);
    }

    msgAppendListeners(elm + ' .msgrefs');

};

var messages_list = [], new_messages = 0, all_messages = {}, ref_map = {};

var push_msg = function(msg, msgPrepend, thumb) {
	"use strict";
/*var out_msg = {
    post_id: post_id,
    id: '',
    txt: {
        msg:
        ts:
    },
    keyid: '',
    pubkey: '',
    status: 'OK',
    to: []
  },*/

  msg.thumb = thumb;

  //console.log(msg);

    var prependTo = '#allgetter_button',
        txt, person = '', recipients = '',
        msgDate = new Date(),
        msgTimeTxt, i;

    if (all_messages[msg.id]) {
        $("#msg_" + msg.id).addClass('hidbord_msg_new');
        return;
    }

    all_messages[msg.id] = msg;

     if(messages_list.length > 0){
        for (i = 0; i < messages_list.length; i++) {
            if(msg.post_id !==0){
                if(all_messages[messages_list[i]].post_id <= msg.post_id){
                    prependTo = '#msg_' + all_messages[messages_list[i]].id;
                    break;
                }
            }else{
                if(all_messages[messages_list[i]].txt.ts <= msg.txt.ts){
                    prependTo = '#msg_' + all_messages[messages_list[i]].id;
                    break;
                }
            }
        }
    }

    messages_list.push(msg.id);

    if(messages_list.length > 0){
        messages_list.sort(function(m1, m2) {
            var a = all_messages[m1],
                b = all_messages[m2];
            if(b.post_id != a.post_id){
                return b.post_id - a.post_id;
            }

            if(b.txt.ts != a.txt.ts){
                return b.txt.ts - a.txt.ts;
            }else{
                if(b.txt.id < a.txt.id){
                    return -1;
                }else{
                    return 1;
                }

            }
        });
    }

    msgDate.setTime(parseInt(msg.txt.ts) * 1000);
    
    if (msg.status == 'OK') {
        txt = wkbmrk(msg.txt.msg);        
    } else {
        txt = '<p><strong style="color: #f00; font-size: x-large;">NOT FOR YOU! CAN\'T BE DECODED!</strong></p>';
    }

    for (i = 0; i < msg.to.length; i++) {
        recipients += '<span style="background: #fff;" class="idntcn2">' + msg.to[i] + '</span>&nbsp;' + getContactHTML(msg.to[i]) + '; ';
    }
    
    if(msg.contactsHidden){
        recipients = msg.contactsNum + ' unknown contacts.';
    }

    msgTimeTxt = dateToStr(msgDate);

    if(msg.senderHidden){
        person = '<b>Anonymous</b>';
    }else{
        person = getContactHTML(msg.keyid, msg.pubkey);
    }

    var isDirect = msg.contactsNum == 2;
    if(msg.isBroad) isDirect = false;

    var code = '<div class="hidbord_msg hidbord_msg_new" id="msg_' + msg.id + '" ' + (isDirect? '  style="border-left: 8px solid #090;"' : '') + (msg.isBroad? '  style="border-left: 8px solid #900;"' : '') + '>'+
            '    <div class="hidbord_mnu"><a href="javascript:;" id="hidbord_mnu_info">info</a> <a href="javascript:;" class="hidbord_mnu_replydirect">' + (msg.isBroad? 'BROADCAST' : 'direct') + '</a>'+ ((isDirect || msg.isBroad)? '': '<a href="javascript:;" class="hidbord_mnu_reply">reply</a>')+'</div>'+
            '    <div class="hidbord_msg_header hidbord_hidden" >'+
            (msg.keyid !=='' ? '        <div style="float:left; width:40px; background: #fff;" class="idntcn">' + msg.keyid + '</div>' : '')+
            '        <div style="float:left;padding-left: 5px;">' + person + ' <i style="color: #999;">(' + msgTimeTxt + ')  <span href="javascript:;" class="hidbord_mnu_reply hidbord_clickable">#'+msg.id.substr(0, 8)+'</span></i>'+
            '            <br/><i style="color: #009; font-size: x-small;" class="hidbord_clickable hidbord_usr_reply" alt="'+msg.keyid+'">' + msg.keyid + '</i>'+
            '        </div>'+
            '        <div style="clear: both; padding: 5px;"><strong>Sent to:</strong> ' + recipients + '</div>'+
            '    </div>'+
            '    <div style="overflow: hidden" class="hidbord_msg_header" >'+ 
            (msg.keyid !=='' ? '<span style="background: #fff;" class="idntcn2">' + msg.keyid + '</span>&nbsp;' : '') + person +
            ' <i style="color: #999;">(' + msgTimeTxt + ') <span href="javascript:;" class="hidbord_mnu_reply hidbord_clickable">#'+msg.id.substr(0, 8)+'</span></i>'+
            '    </div>'+
            '    <hr style="clear:both;">'+
            '    <div style="overflow: hidden;"><img src="'+thumb+'" class="hidbord_post_img hidbord_clickable" style="max-width: 150px; max-height:150px; float: left; padding: 5px 15px 5px 5px;"/>' + txt + '</div>'+
            '<span class="msgrefs" style="font-size: 11px;font-style: italic;"></span>'+
            '</div>';

    $(prependTo).after($(code));

    msgAppendListeners('#msg_' + msg.id);

    $('#msg_' + msg.id + ' .hidbord_msglink').each(function(i, e){
        var refTo = $(e).attr('alt');

        if(!ref_map[refTo]){
            ref_map[refTo] = [];
        }

        if(ref_map[refTo].indexOf(msg.id) == -1){
            ref_map[refTo].push(msg.id);   
        }

        renderRefs(refTo);
    });

    renderRefs(msg.id);

    new_messages++;
    $('#hidbord_notify_counter').text(new_messages).show();

};

var process_images = [];

var read_old_messages = function() {
	"use strict";

    if (process_images.length !== 0) {
        process_images = [];
        $('#hidbord_btn_getold').val('Get old messages');
        return true;
    }
    $('a[href*=jpg] img, a[href*=jpeg] img').each(function(i, e) {
        var url = $(e).closest('a').attr('href');
        var post_el = $(e).closest('.reply');
        var post_id = 0;

        if(post_el.length === 1){
            post_id = parseInt(post_el.attr('id').replace(/[^0-9]/g, ''));
            if(isNaN(post_id)){
                post_id = 0;
            }
        }

        if (url.indexOf('?') == -1 && url.match(/\.jpe?g$/)) process_images.push([url, $(e).attr('src'), post_id]);
    });

//    console.log(process_images);
    $('#hidbord_btn_getold').val('Stop fetch! ['+process_images.length+']');
    setTimeout(process_olds, 0);//500 + Math.round(500 * Math.random()));
};

var process_olds = function() {
	"use strict";

    var jpgURL;

    if (process_images.length > 0) {
        jpgURL = process_images.pop();

        if (process_images.length !== 0) {
            $('#hidbord_btn_getold').val('Stop fetch! ['+process_images.length+']');
            //setTimeout(process_olds, 0); //500 + Math.round(500 * Math.random()));
            processJpgUrl(jpgURL[0], jpgURL[1], jpgURL[2], function(){setTimeout(process_olds, 0);});
        }else{
            $('#hidbord_btn_getold').val('Get old messages');
            processJpgUrl(jpgURL[0], jpgURL[1], jpgURL[2]);
        }
    }
};

var replyForm = null,
    container_data = null, container_image = null, quotedText;

function handleFileSelect(evt) {
	"use strict";

    var files = evt.target.files; // FileList object

    if (files[0] && files[0].type.match('image.*')) {
        var reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {

                if(theFile.type != "image/jpeg" || isDobro){
                    var img = new Image();

                    img.onload = function() {
                        var o1 = 0, o2 = 0, o3 = 0, o4 = 0, q = 0.9;
                        if(isDobro){
                            o1 = Math.round(Math.random() * 10);
                            o2 = Math.round(Math.random() * 10);
                            o3 = Math.round(Math.random() * 10);
                            o4 = Math.round(Math.random() * 10);
                            q  = (85 + Math.random() * 10) / 100;
                        }

                        var buffer = document.createElement('canvas'),
                            ctxB = buffer.getContext('2d');
                        buffer.width = img.width - o1 - o2;
                        buffer.height = img.height - o3 - o4;

                        ctxB.beginPath();
                        ctxB.fillStyle = "white";
                        ctxB.rect(0, 0, buffer.width, buffer.height); 
                        ctxB.fill();

                        ctxB.drawImage(img, -o1, -o3);
                        container_data = jpegClean(dataURLtoUint8Array(buffer.toDataURL("image/jpeg", q)));
                        container_image= "data:image/Jpeg;base64," + arrayBufferDataUri(container_data);
                    };
                    img.src = "data:image/Jpeg;base64," +arrayBufferDataUri(e.target.result);
                }else{
                    container_data = jpegClean(e.target.result);
                    container_image= "data:"+theFile.type+";base64," + arrayBufferDataUri(container_data);
                }
            };
        })(files[0]);
        reader.readAsArrayBuffer(files[0]);
    }else{
        container_image = null;
        container_data = null;
        alert('Please select image.');
    }

}

var replytoMsg = function(e) {
	"use strict";

    var msg_id = $(e.target).closest('.hidbord_msg').first().attr('id').replace(/^msg\_/, '');
//    console.log(msg_id);
    showReplyform('#msg_' + msg_id, '>>' + msg_id);
};

var replytoMsgDirect = function(e) {
    "use strict";

    var msg_id = $(e.target).closest('.hidbord_msg').first().attr('id').replace(/^msg\_/, ''),
        usr_id = $(e.target).closest('.hidbord_msg').first().find('.hidbord_usr_reply').attr('alt');

    if($(e.target).text() == 'BROADCAST'){
        showReplyform('#msg_' + msg_id, '>>' + msg_id);
        $('#hidbord_cont_type').val('broadcast').trigger('change');
        return true;
    }

    if(rsa_hashB64 == usr_id){
        alert('So ronery?');
        return false;
    }

    if(!(usr_id in contacts)){
        alert('Unknow contact!');
        return false;
    }

    
    showReplyform('#msg_' + msg_id, '>>' + msg_id);
    $('#hidbord_cont_type').val('direct').trigger('change');
    $('#hidbord_cont_direct').val(usr_id);
};



var replytoUsr = function(e) {
	"use strict";

    var msg_id = $(e.target).closest('.hidbord_msg').first().attr('id').replace(/^msg\_/, '');
    var usr_id = $(e.target).attr('alt').replace(/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]/, '');
//    console.log(msg_id);
    showReplyform('#msg_' + msg_id, '{' + usr_id + '}');
};

var do_preview_popup = function(e) {
    "use strict";


    var img_thumb = '';

    if (container_image){
        img_thumb = '<img src="'+container_image+'" class="hidbord_post_img hidbord_clickable" style="max-width: 150px; max-height:150px; float: left; padding: 5px 15px 5px 5px;"/>';
    }else{
        img_thumb = '<div style="width: 148px; height:148px; float: left; margin: 5px 15px 5px 5px; border: 2px dashed #999;"/>';
    }

    $('#prev_popup').remove();
    var txt = '<div class="hidbord_msg" style="box-shadow: 0 0 10px #555;overflow-y: scroll;" alt="msg_preview">' + img_thumb + wkbmrk($('#hidbord_reply_text').val()) + '</div>';

//    console.log(txt);

    $('body').append('<div class="hidbord_popup" id="prev_popup" style="position: fixed; top: -2000px; right: -2000px; width: 611px;"></div');
    $('#prev_popup').append(txt);
    $('#prev_popup .idntcn2').identicon5({
        rotate: true,
        size: 18
    });
    $('#prev_popup pre').each(function(i, e) {
        hljs.highlightBlock(e);
    });

    var px = e.clientX,
        py = e.clientY + 10;

    if (px > $(window).width() / 2) {
        px -= $('#prev_popup').width();
    }

    if (py > $(window).height() / 2) {
        py -= $('#prev_popup').height() + 20;
        if(py < 10 ){
            $('#prev_popup').find('.hidbord_msg').css('height', (e.clientY - 50) + 'px');
            py = 10;
        }        
    }else{
        if(py + $('#prev_popup').height() + 10 > $(window).height()){
            $('#prev_popup').find('.hidbord_msg').css('height', ($(window).height() - py - 50) + 'px');
        }
    }

    $('#prev_popup').css('right', '50px').css('top', py + 'px');

    $('#prev_popup .hidbord_msg').on('mouseover', function() {
        clearTimeout(msgPopupTimers.msg_preview);
    }).on('mouseout', del_popup);

};

var do_imgpreview_popup = function(e) {
	"use strict";

    $('#file_selector').remove();
    if (!container_image) return;
    var txt = '<div class="hidbord_msg" style="box-shadow: 0 0 10px #555;"><img style="max-width: 200px; max-height: 200px;" src="' + container_image + '"></div>';
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    $('body').append('<div class="hidbord_popup" id="file_selector" style="position: fixed; bottom: -2000px; left: -2000px;"></div');
    $('#file_selector').append(txt);

    var px = $(e.target).offset().left,
        py = $(window).height() - ($(e.target).offset().top - window.scrollY);

    $('#file_selector').css('left', px + 'px').css('bottom', py + 'px');

    $('#file_selector .hidbord_msg').on('mouseover', function() {
        clearTimeout(popup_del_timer);
    }).on('mouseout', del_popup);

};

var prev_to = null, prev_cont = null;

var showReplyform = function(msg_id, textInsert) {
	"use strict";

//    console.log(msg_id, $(msg_id));
    if (!replyForm) {
        $(msg_id).after('<div class="hidbord_msg" id="hidbord_replyform"><div style="height: 40px;">' +
            '  <div style="float:left; width:40px; background: #fff;" class="idntcn">' + rsa_hashB64 + '</div>' +
            '  <div style="float:left;padding-left: 5px;">' +
            '    <strong style="color: #090; font-style: italic">Me</strong><br/>' +
            '    <i style="color: #009; font-size: x-small;">' + rsa_hashB64 + '</i>' +
            '  </div>' +
            '  <div class="hidbord_mnu"><a href="javascript:;" id="hidbordform_hide">hide</a></div>' +
            '  </div>' +
            '  <hr style="clear:both;">' +
            contactsSelector()+
            '  <div>' +
            '    <div style="margin:  3px;">' +
            '      <div style="width: 590px;">' +
            '        <input type="file" id="c_file" name="c_file" style="max-width: 300px;" alt="file_selector">' +
            '            <span style="float: right;" id="hidbordTextControls">' +
            '              <span title="Bold"><input value="B" style="font-weight: bold;" type="button" id="hidbordBtBold"></span>' +
            '              <span title="Italic"><input value="i" style="font-weight: bold; font-style: italic;" type="button" id="hidbordBtItalic"></span>' +
            '              <span title="Strike"><input value="S" style="font-weight: bold; text-decoration: line-through" type="button" id="hidbordBtStrike"></span>' +
            '              <span title="Spoiler"><input value="%" style="font-weight: bold;" type="button" id="hidbordBtSpoiler"></span>' +
            '              <span title="Code"><input value="C" style="font-weight: bold;" type="button" id="hidbordBtCode"></span>' +
            '              <span title="irony"><input value=":)" style="font-weight: bold;" type="button" id="hidbordBtCode"></span>' +
            '              <span title="Quote selected"><input value=">" style="font-weight: bold;" type="button" id="hidbordBtQuote"></span>' +
            '            </span>  ' +
            '      </div>  ' +
            '      <textarea style="max-width: none; margin: 2px; width: 580px; height: 136px; resize: vertical; background-image: none; background-position: 0% 0%; background-repeat: repeat repeat;" id="hidbord_reply_text"></textarea>  ' +
            '      <div style="width: 590px;">' +
            '        <span>Hide: <label><input id="hidboard_hide_sender" type="checkbox" checked/> sender</label>; <label><input id="hidboard_hide_contacts" type="checkbox"  checked/> contacts</label></span><br>'+
            '        <input type="button" value="crypt and send" id="do_encode">  ' +
            '        <span style="float: right;"><a href="javascript:;" id="hidbordform_preview" alt="msg_preview">message preview</a></span>  ' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>');
        replyForm = $('#hidbord_replyform');

//        console.log('ddd', $('#hidbord_replyform'));


        if(!hidboard_hide_sender){
            $('#hidboard_hide_sender').attr('checked', null);        
        }

        if(!hidboard_hide_contacts){
            $('#hidboard_hide_contacts').attr('checked', null);        
        }

        $('#hidboard_hide_sender').on('change', function() {
            hidboard_hide_sender = !!$('#hidboard_hide_sender').attr('checked');
        });

        $('#hidboard_hide_contacts').on('change', function() {
            hidboard_hide_contacts = !!$('#hidboard_hide_contacts').attr('checked');
            console.log(hidboard_hide_contacts);
        });



        $('#hidbord_cont_type').on('change',function(){
            $('#hidbord_replyform').css('border-left', 'none');
            
            if($('#hidbord_cont_type').val()=='direct'){
                $('#hidbord_cont_direct').show();
                $('#hidbord_replyform').css('border-left', '8px solid #090');
            }else{
                $('#hidbord_cont_direct').hide();
            }

            if($('#hidbord_cont_type').val()=='broadcast')
                $('#hidbord_replyform').css('border-left', '8px solid #900');

        });

        if(prev_to !== null){
            $('#hidbord_cont_type').val(prev_to).trigger('change');
            $('#hidbord_cont_direct').val(prev_cont);
        }

        $('#hidbord_replyform .idntcn').identicon5({
            rotate: true,
            size: 40
        });
        $('#hidbord_replyform #c_file').on('change', handleFileSelect);
        $('#hidbord_replyform #do_encode').on('click', do_encode);

        $('#hidbord_replyform #hidbordform_preview').on('mouseover', function(e){
            var evt = e;
            
            msgPopupTimers.msg_preview = setTimeout((function(e){ return function(){
                do_preview_popup(evt);
            };})(e), 200);
        })
            .on('mouseout', del_popup);

        $('#hidbord_replyform #c_file').on('mouseover', do_imgpreview_popup)
            .on('mouseout', del_popup)
            .on('click', function() {
                $('#hidbord_popup').remove();
            });

        $('#hidbord_replyform #hidbordform_hide').on('click', function() {
            $('#hidbord_replyform').hide();
        });

        $('#hidbordTextControls').on('mouseover', function(e) {
            //quotedText = window.getSelection().toString();
            quotedText = quoteSelection(window.getSelection().getRangeAt(0).cloneContents());
        });

        $('#hidbordTextControls input').on('click', function(e) {
            var mode = $(this).val(),
                ta = $('#hidbord_reply_text'),
                taStart = ta[0].selectionStart,
                taEnd = ta[0].selectionEnd,
                taPost = ta.val().length - taEnd, tag, selected, parts;

            if (mode == '>') {
                if (taStart !== taEnd && quotedText.length === 0) {
                    quotedText = ta.val().substring(taStart, taEnd);
                }
                if (quotedText.length > 0) {
                    //quotedText = '> ' + quotedText.replace(/\n/gm, "\n> ") + "\n";
                    ta.val(ta.val().substring(0, taStart) + quotedText + ta.val().substring(taEnd));
                }
            }

            if (mode == 'B' || mode == 'i' || mode == 'S' || mode == ':)') {
                tag = mode == 'B' ? '**' : '*';
                tag = mode == 'S' ? '--' : tag;
                tag = mode == ':)' ? '++' : tag;
                 selected = ta.val().substring(taStart, taEnd).split("\n");
                for (var i = 0; i < selected.length; i++) {
                    parts = selected[i].match(/^(\s*)(.*?)(\s*)$/);
                    selected[i] = parts[1] + tag + parts[2] + tag + parts[3];
                }
                ta.val(ta.val().substring(0, taStart) + selected.join("\n") + ta.val().substring(taEnd));
            }

            if (mode == '%' || mode == 'C') {
                tag = mode == '%' ? _spoilerTag : '`';
                var tagmultiline = mode == '%' ? _spoilerTag : '``';
                selected = ta.val().substring(taStart, taEnd).split("\n");

                if (selected.length > 1) {
                    selected = "\n" + tagmultiline + "\n" + selected.join("\n") + "\n" + tagmultiline + "\n";
                } else {
                    parts = selected[0].match(/^(\s*)(.*?)(\s*)$/);
                    selected = parts[1] + tag + parts[2] + tag + parts[3];
                }
                ta.val(ta.val().substring(0, taStart) + selected + ta.val().substring(taEnd));
            }

            ta[0].selectionStart = ta.val().length - taPost;
            ta[0].selectionEnd = ta.val().length - taPost;
            ta.focus();
        });
    }
    $(msg_id).after($('#hidbord_replyform'));
    $('#hidbord_replyform').show();

    $('.hidbord_thread')[0].scrollTop += $('#hidbord_replyform').offset().top - window.scrollY - $(window).height() + $('#hidbord_replyform').height() + 50;

    if (textInsert) {
        insertInto(document.getElementById('hidbord_reply_text'), textInsert + "\n");
    }
};

var insertInto = function(textarea, text) {
	"use strict";

    if (textarea.createTextRange && textarea.caretPos) {
        var caretPos = textarea.caretPos;
        caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == " " ? text + " " : text;
    } else if (textarea.setSelectionRange) {
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        textarea.value = textarea.value.substr(0, start) + text + textarea.value.substr(end);
        textarea.setSelectionRange(start + text.length, start + text.length);
    } else {
        textarea.value += text + " ";
    }
};
