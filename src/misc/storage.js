var scriptStore = window.opera && window.opera.scriptStorage || localStorage,
    isGM = typeof GM_setValue === 'function';

var ssGet = function(name, inLocal)    {
	"use strict";

	if(!inLocal) inLocal = false;

	if(isGM && !inLocal){
		/*jshint newcap: false */
		if(GM_getValue(name) === undefined) return null;
		return JSON.parse(GM_getValue(name));
	}

	return JSON.parse(scriptStore.getItem(name));
};

var ssSet = function(name, val, inLocal)    {
	"use strict";

	if(!inLocal) inLocal = false;

	if(isGM && !inLocal){
		/*jshint newcap: false  */
		return GM_setValue(name, JSON.stringify(val));
	}

	return scriptStore.setItem(name, JSON.stringify(val));
};
