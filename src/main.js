var isDobro = !!document.URL.match(/\/dobrochan\.[comrgu]+\//);
var is4chan = !!document.URL.match(/\/boards\.4chan\.org\//);

var autoscanNewJpegs = true;
var contactsInLocalStorage = false;
var useGlobalContacts = false;

var uiFontSize = ssGet('magic_desu_fontsize');
if(!uiFontSize) uiFontSize = 13;

contactsInLocalStorage = ssGet('magic_desu_contactsInLocalStorage');
useGlobalContacts = ssGet('magic_desu_useGlobalContacts');

if(useGlobalContacts && contactsInLocalStorage) useGlobalContacts = false;

autoscanNewJpegs = ssGet(boardHostName + 'autoscanDefault');

if(autoscanNewJpegs !== false && autoscanNewJpegs !== true){
    autoscanNewJpegs = true;
    ssSet(boardHostName + 'autoscanDefault', true);
}

// Dirty hack (i really start to forget how this script works)
prev_to = ssGet(boardHostNameSection + '_prev_to');
prev_cont = ssGet(boardHostNameSection + '_prev_cont');
hidboard_hide_sender = ssGet(boardHostNameSection + '_hidboard_hide_sender');
hidboard_hide_contacts = ssGet(boardHostNameSection + '_hidboard_hide_contacts');

var jpegInserted = function(event) {
    "use strict";

    if(!autoscanNewJpegs) return false;

    if (event.animationName == 'hidbordNodeInserted') {
        var jpgURL = $(event.target).closest('a').attr('href');
        var thumbURL = $(event.target).attr('src');
        var post_el = $(event.target).closest('.reply');
        var post_id = 0;

        if(jpgURL.match(/\?/) && (jpgURL.match(/iqdb/) || jpgURL.match(/google/))){
            return false;
        }

        if(post_el.length === 1){
            post_id = parseInt(post_el.attr('id').replace(/[^0-9]/g, ''));
            if(isNaN(post_id)){
                post_id = 0;
            }
        }

        readJpeg(jpgURL, thumbURL, post_id);
    }
};

var ArrayPrototypeEvery = Array.prototype.every;

function startAnimeWatch(){
    "use strict";

    if(document.hidden || window.document.readyState != 'complete'){
        setTimeout(startAnimeWatch, 1000);
    }else{
        setTimeout(function(){
            $(document).bind('animationstart', jpegInserted).bind('MSAnimationStart', jpegInserted).bind('webkitAnimationStart', jpegInserted);
        }, 0);
    }
}

$(function($) {
    "use strict";

    Array.prototype.every = ArrayPrototypeEvery;

    sjcl.random.startCollectors();

    var insertAnimation = ' hidbordNodeInserted{from{clip:rect(1px,auto,auto,auto);}to{clip:rect(0px,auto,auto,auto);}}',
        animationTrigger = '{animation-duration:0.001s;-o-animation-duration:0.001s;-ms-animation-duration:0.001s;-moz-animation-duration:0.001s;-webkit-animation-duration:0.001s;animation-name:hidbordNodeInserted;-o-animation-name:hidbordNodeInserted;-ms-animation-name:hidbordNodeInserted;-moz-animation-name:hidbordNodeInserted;-webkit-animation-name:hidbordNodeInserted;}';

    $('<style type="text/css">@keyframes ' + insertAnimation + '@-moz-keyframes ' + insertAnimation + '@-webkit-keyframes ' +
        insertAnimation + '@-ms-keyframes ' + insertAnimation + '@-o-keyframes ' + insertAnimation +
        'a[href*=jpg] img, a[href*=jpeg] img ' + animationTrigger + '</style>').appendTo('head');

    setTimeout(startAnimeWatch, 1000);

    $('.hidbord_main').remove();

    inject_ui();

    do_login(false, true);
    do_loginBroadcast(false, true);

    if (ssGet(boardHostName + 'magic_desu_pwd')) {
        $('#steg_pwd').val(ssGet(boardHostName + 'magic_desu_pwd'));
    }

    render_contact();

    if(isSavedThread){
        for(var m in ddtThread){
            push_msg(ddtThread[m], null, ddtThread[m].thumb);
        }
        
        $('.hidbord_notifer .hidbord_clickable').click();
    }

});
