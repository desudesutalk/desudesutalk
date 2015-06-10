function ddtSaveThread(){
	"use strict";
	var msgs = JSON.parse(JSON.stringify(all_messages)), m,
		zip = new JSZip(),
		data = zip.folder("data"),
		img = zip.folder("ddt_thumb"),
		fname = boardHostName + '-' + board_section + '-' + threadId + '-ddt',
		thumbs = [];
	
	zip.file(fname + ".html", '<html><head><title>' + fname + '</title>\n'+
		'	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n'+
		'   <style>\n' +
			'      body {\n\tbackground: ' + $('body').css("background-color") + ';\t\n}\n' +
			'   </style>\n' +
		'<script language="JavaScript" type="text/javascript" src="data/ddt_thread.js"></script>\n'+
		'<script language="JavaScript" type="text/javascript" src="data/ddt.js"></script>\n'+
		'</head><body></body></html>'); /*jshint newcap: false  */
	data.file("ddt.js", 'function GM_getMetadata(){ return "'+(typeof GM_info !== 'undefined' ? GM_info.script.version : GM_getMetadata("version"))+'"}\n' + ddtMainFunction.toString() + '\nddtMainFunction();');

	for(m in msgs){
		if(msgs[m].contactsNum < 3){
			msgs[m].to = [];
			msgs[m].contactsHidden = true;
		}
		thumbs.push({id: msgs[m].id, thumb: msgs[m].thumb});
	}

	$('#hidbord_btn_save_thread_info').text('Saving: [' + thumbs.length + ']');

	var processThumbUrl = function(thumbURL, id, cb){
		getURLasAB(thumbURL, function(arrayBuffer, date) {
			var ext = thumbURL.match(/\.(\w+)$/)[1];
			msgs[id].thumb = 'ddt_thumb/' + id + '.' + ext;

			if(arrayBuffer !== null){
				img.file(id + '.' + ext, arrayBuffer, {binary: true});
			}

			if (typeof(cb) == "function") {
				cb();
			}

		});
	};

	var processThumbs = function() {
		var thumbURL;

		if (thumbs.length > 0) {
			thumbURL = thumbs.pop();

			if (thumbs.length !== 0) {
				$('#hidbord_btn_save_thread_info').text('Saving: [' + thumbs.length + ']');           
				processThumbUrl(thumbURL.thumb, thumbURL.id, function(){setTimeout(processThumbs, 0);});
			}else{
				processThumbUrl(thumbURL.thumb, thumbURL.id, function(){
					data.file("ddt_thread.js", "var ddtThread = " + JSON.stringify(msgs, null, 2));
					saveAs(zip.generate({type:"blob", compression: "DEFLATE"}), fname + ".zip");
					$('#hidbord_btn_save_thread').show();
					$('#hidbord_btn_save_thread_info').hide().text('Saving...');      
				});
			}
		}
	};

	processThumbs();
}
