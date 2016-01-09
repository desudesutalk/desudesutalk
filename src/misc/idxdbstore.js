var idxdbStoreName = board_section + '-' + threadId;

function _idxdbOpen(cb){
	"use strict";
	var request = indexedDB.open("ddt_posts", 1);
	
	request.onupgradeneeded = function(event) {
		event.target.result.createObjectStore(idxdbStoreName, {keyPath: "id"})
			.createIndex("src", "src", {unique: false});
	};

	request.onsuccess = function(event) {cb(event.target.result);};
}

function idxdbGetPosts(cb){
	"use strict";
	_idxdbOpen(function(db){
	db.transaction([idxdbStoreName])
		.objectStore(idxdbStoreName)
		.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				cb(cursor.value);
				cursor.continue();
			}
		};
	});
}

function idxdbPutPost(post){
	"use strict";
	_idxdbOpen(function(db){
		db.transaction([idxdbStoreName], "readwrite")
			.objectStore(idxdbStoreName)
			.put(post);
	});
}
