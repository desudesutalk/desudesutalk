var steg_iv = [];
var stegger = null;

var _initIv = function(){
    "use strict";

    if(steg_iv.length === 0){
        steg_iv = sjcl.codec.bytes.fromBits(sjcl.misc.pbkdf2($('#steg_pwd').val(), $('#steg_pwd').val(), 1000, 256 * 8));
    }  
};

var allocateStegger = function () {
	if (stegger === null) {
		stegger = new Eph5.Simple();
	}
};

var freeStegger = function () {
	if (stegger !== null) {
		stegger = null;

		console.log("Stegger freed");
	}
};

var jpegEmbed = function(img_container, data_array){
    "use strict";

    _initIv();
	allocateStegger();

	try {
		var result = stegger.embed(data_array, img_container, steg_iv);

		console.log("Container properties:", result.containerProperties);
		console.log("Used k:", result.k)
		console.log("Embedded length:", result.embeddedLength)

		if (result.embeddedLength !== data_array.length) {
			throw new Error("Capacity exceeded. Select bigger/more complex image");
		}

		return result.image;
	} catch (exception) {
		alert(exception.message);
		return false;
	}
};

var jpegExtract = function(inArBuf) {
    "use strict";

    _initIv();
	allocateStegger();

	try {
		var result = stegger.extract(new Uint8Array(inArBuf), steg_iv);

		return {
			"1": result.get(1),
			"2": result.get(2),
			"3": result.get(3),
			"4": result.get(4),
			"5": result.get(5),
			"6": result.get(6),
			"7": result.get(7)
		};
	} catch (exception) {
		alert(exception.message);
		return false;
	}

    return data;
};

var processedJpegs = {}, process_images = [], isJpegLoading = false;

var processJpgUrl = function(jpgURL, thumbURL, post_id, cb){
    "use strict";

    if(processedJpegs[jpgURL]){
        
        if(processedJpegs[jpgURL].id != 'none'){
            $("#msg_" + processedJpegs[jpgURL].id).addClass('hidbord_msg_new');
        }
        
        console.log('from cache');

        if (typeof(cb) == "function") {
            cb();
        }
        return;
    }
        
    getURLasAB(jpgURL, function(arrayBuffer, date) {
        if(arrayBuffer !== null){
            processedJpegs[jpgURL] = {'id': 'none'};
        }else{
            cb();
            return;
        }

        if (typeof(cb) == "function") {
            cb();
        }

        var arc = jpegExtract(arrayBuffer);
        if(arc){
            var p = decodeMessage(arc);
            if(p){
                processedJpegs[jpgURL] = {id: do_decode(p, null, thumbURL, date, post_id).id};
            }
        }
    });
};

var process_olds = function() {
    "use strict";

    var jpgURL;

    if (process_images.length > 0) {
        jpgURL = process_images.pop();

        if (process_images.length !== 0) {
            $('#hidbord_btn_getold').val('Stop fetch! ['+process_images.length+']');            
            processJpgUrl(jpgURL[0], jpgURL[1], jpgURL[2], function(){setTimeout(process_olds, 0);});
        }else{
            $('#hidbord_btn_getold').val('Get old messages');
            isJpegLoading = false;
            processJpgUrl(jpgURL[0], jpgURL[1], jpgURL[2], freeStegger);
        }
    }
};


function readJpeg(url, thumb, post_id){
    "use strict";

    process_images.push([url, thumb, post_id]);

    if(!isJpegLoading){
        isJpegLoading = true;
        setTimeout(process_olds, 0);
    }
}

function stopReadJpeg(){
    "use strict";

    process_images = [];
    isJpegLoading = false;
    $('#hidbord_btn_getold').val('Get old messages');
	freeStegger();
}

function isJpegReading(){
    "use strict";

    return isJpegLoading;
}
