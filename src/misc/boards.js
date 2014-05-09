var upload_handler = (new Date()).getTime() * 10000;
ParseUrl = function(url){
    "use strict";
    var m = (url || document.location.href).match( /https?:\/\/([^\/]+)\/([^\/]+)\/((\d+)|res\/(\d+)|\w+)(\.x?html)?(#i?(\d+))?/);
    return m?{host:m[1], board:m[2], page:m[4], thread:m[5], pointer:m[8]}:{};
};
var Hanabira={URL:ParseUrl()};

var sendBoardForm = function(file) {
    "use strict";
    replyForm.find("#do_encode").val('..Working...').attr("disabled", "disabled");

    if ($('form[name*="postcontrols"]').length !==0) {
        $.ajax({
            url: location.href,
            type: 'GET',
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR) {
                var doc = document.implementation.createHTMLDocument('');
                doc.documentElement.innerHTML = data;

                var l = $("form[action*=post]", doc).serializeArray();
                l = l.filter(function(a){
                    if(["name","email","subject","post","spoiler","body","file","file_url","password","thread","board"].indexOf(a.name) > -1) return false;
                    return true;
                });

                l.push({"name": "post", "value": $('#de-pform input[type=submit]').val()});

                //console.log("fresh post form: ", l);
                
                _sendBoardForm(file, l);  
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('failed to get fresh form. Try again!');
                replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
                upload_handler = (new Date()).getTime() * 10000;
            }
        });
    }else{
        _sendBoardForm(file, []);        
    }
};

var _sendBoardForm = function(file, formAddon) {
    "use strict";
    
    var formData, fileInputName, formAction,
        fd = new FormData();

    if($('a#yukiForceUpdate').length !== 0 && $('form#yukipostform').length === 0){
        $('a.reply_.icon').last().click();
        $('form#yukipostform textarea').val('');
    }

    if($('#de-pform form').length !== 0){
        formData = $('#de-pform form').serializeArray();
        fileInputName = $("#de-pform form input[type=file]")[0].name;
        formAction = $("#de-pform form")[0].action; //+ "?X-Progress-ID=" + upload_handler,
    }else if(($('form#yukipostform').length !== 0)){
        formData = $('form#yukipostform').serializeArray();
        fileInputName = 'file_1';
        fd.append('file_1_rating', 'SFW'); 
        formAction = '/' + Hanabira.URL.board + '/post/new.xhtml' + "?X-Progress-ID=" + upload_handler;   
    }

    if(is4chan){
        var forForm = $('form[name=post]');
        if($('form[name=qrPost]').length !==0){
            forForm = $('form[name=qrPost]');
        }

        formData = forForm.serializeArray();
        fileInputName = forForm.find("input[type=file]")[0].name;
        formAction = forForm[0].action; 
    }

    if(formAddon.length > 0){
        formData = formData.filter(function(a){
            if(["name","email","subject","post","spoiler","body","file","file_url","password","thread","board"].indexOf(a.name) > -1) return true;
            return false;
        });
        formData.push.apply(formData, formAddon);
    }

    for (var i = 0; i < formData.length; i++) {
        if (formData[i].name != fileInputName) {
            fd.append(formData[i].name, formData[i].value);
        }
    }

    var fnme = Math.floor((new Date()).getTime() / 10 - Math.random() * 100000000) + '.jpg';

    fd.append(fileInputName, uint8toBlob(file, 'image/jpeg'), fnme);

    

    $.ajax({
        url: formAction,
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        success: function(data, textStatus, jqXHR) {
            var doc = document.implementation.createHTMLDocument(''),
                p;
            doc.documentElement.innerHTML = data;

//            console.log(data, textStatus, jqXHR);

            if (jqXHR.status === 200 && jqXHR.readyState === 4) {
                p = $('form[action*="delete"]', doc).length +
                    $('form[action*="delete"]', doc).length +
                    $('#posts_form, #delform', doc).length +
                    $('form:not([enctype])', doc).length +
                    $('form[name="postcontrols"]', doc).length +
                    $('form[name="postcontrols"]', doc).length +
                    $('#delform, form[name="delform"]', doc).length;
                    if(isDobro && data.match(/parent\.location\.replace/)){
                        p = 1;
                    }

                    if(is4chan && data.indexOf('<title>Post successful!</title>') != -1){
                        p = 1;
                    }
            } else {
                p = 1;
            }

            if (p !== 0) {
                $('#de-pform textarea').val('');
                $('form#yukipostform textarea').val('');
                $('#de-pform img[src*=captcha]').click();
                $('#hidbord_replyform #c_file').val('');
                $('#de-updater-btn').click();
                $('#de-thrupdbtn').click();
                $('a#yukiForceUpdate').click();
                if(is4chan){
                    setTimeout(function() {$('a[data-cmd=update]').first().click();}, 2500);                    
                    $('#qrCapField').val('');
                    $('#recaptcha_response_field').val('');
                    $('#recaptcha_challenge_image').click();
                    $('#qrCaptcha').click();
                    $('textarea[name=com]').val('');
                }
                replyForm.remove();
                replyForm = null;
                container_image = null;
                container_data = null;

            } else {
                alert('Can\'t post. Wrong capch? Fucked up imageboard software?.');
                replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            }
            upload_handler = (new Date()).getTime() * 10000;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Error while posting. Something in network or so.');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            upload_handler = (new Date()).getTime() * 10000;
        }
    });
};
