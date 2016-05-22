var idxdbThreadTag = board_section + '-' + threadId;

function _idxdbOpen(cb){
	"use strict";
	var request = indexedDB.open("ddt_posts", 2);

	request.onupgradeneeded = function(event) {
		var db = event.target.result;

        while (db.objectStoreNames.length>0) {
			db.deleteObjectStore(db.objectStoreNames[0]);
        }

		var store = db.createObjectStore("posts", {keyPath: "id"});
		store.createIndex("src", "src", {unique: false});
		store.createIndex("inthread", "inthread", {unique: false});

		store = db.createObjectStore("processed_links", {keyPath: "src"});
		store.createIndex("inthread", "inthread", {unique: false});
	};

	request.onsuccess = function(event) {cb(event.target.result);};
}

function idxdbDropAll(){
	"use strict";
	indexedDB.deleteDatabase("ddt_posts");
}

function idxdbGetPosts(cb){
	"use strict";
	_idxdbOpen(function(db){
	db.transaction(["posts"])
		.objectStore("posts")
		.index('inthread')
		.openCursor(IDBKeyRange.only(idxdbThreadTag)).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				cb(cursor.value);
				cursor.continue();
			}
		};
	});
}

function idxdbGetPostById(id, cb){
	"use strict";
	_idxdbOpen(function(db){
		var req = db.transaction(["posts"])
			.objectStore("posts")
			.get(id);
		req.onerror = function(event) {cb(null);};
		req.onsuccess = function(event) {cb(event.target.result);};
	});
}

function idxdbGetPostBySrc(src, cb){
	"use strict";
	_idxdbOpen(function(db){
	db.transaction(["posts"])
		.objectStore("posts")
		.index('src')
		.openCursor(IDBKeyRange.only(src)).onsuccess = function(event) {
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
		post.inthread = idxdbThreadTag;
		db.transaction(["posts"], "readwrite")
			.objectStore("posts")
			.put(post);
	});
}

function idxdbGetLinks(cb){
	"use strict";
	_idxdbOpen(function(db){
	db.transaction(["processed_links"])
		.objectStore("processed_links")
		.index('inthread')
		.openCursor(IDBKeyRange.only(idxdbThreadTag)).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				cb(cursor.value);
				cursor.continue();
			}
		};
	});
}

function idxdbPutLink(link){
	"use strict";
	_idxdbOpen(function(db){
		link.inthread = idxdbThreadTag;
		db.transaction(["processed_links"], "readwrite")
			.objectStore("processed_links")
			.put(link);
	});
}
