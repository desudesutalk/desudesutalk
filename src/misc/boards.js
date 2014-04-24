var sendBoardForm = function(file) {
    "use strict";
    
    var formData = $('#de-pform form').serializeArray(),
        fileInputName = $("#de-pform form input[type=file]")[0].name,
        fd = new FormData();

    for (var i = 0; i < formData.length; i++) {
        if (formData[i].name != fileInputName) {
            fd.append(formData[i].name, formData[i].value);
        }
    }

    if (document.URL.match(/\/8chan.co\//)) {
        fd.append('post', $('#de-pform input[type=submit]').val());
    }

    var fnme = Math.floor((new Date()).getTime() / 10 - Math.random() * 100000000) + '.jpg';

    fd.append(fileInputName, uint8toBlob(file, 'image/jpeg'), fnme);

    replyForm.find("#do_encode").val('..Working...').attr("disabled", "disabled");

    $.ajax({
        url: $("#de-pform form")[0].action, //+ "?X-Progress-ID=" + upload_handler,
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
            } else {
                p = 1;
            }

            if (p !== 0) {
                $('#de-pform textarea').val('');
                $('#de-pform img[src*=captcha]').click();
                $('#hidbord_replyform #c_file').val('');
                $('#de-updater-btn').click();
                replyForm.remove();
                replyForm = null;
                container_image = null;
                container_data = null;

            } else {
                replyForm.find("input[type=submit]").attr("disabled", null);
                alert('Can\'t post. Wrong capch? Fucked up imageboard software?.');
                replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
//                console.log(data, textStatus, jqXHR, doc, doc.find('#delform, form[name="delform"]'));
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
//            console.log(jqXHR, textStatus, errorThrown);
            alert('Error while posting. Something in network or so.');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
        }
    });
};
