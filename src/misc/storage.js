var scriptStore = window.opera && window.opera.scriptStorage || localStorage,
    isGM = typeof GM_setValue === 'function';

if(isGM || window.opera && window.opera.scriptStorage){
	localStorage.removeItem('magic_desu_numbers');
}

var ssGet = function(name)    {
	"use strict";

	if(isGM){
		/*jshint newcap: false */
		if(GM_getValue(name) === undefined) return null;
		return JSON.parse(GM_getValue(name));
	}

	return JSON.parse(scriptStore.getItem(name));
};

var ssSet = function(name, val)    {
	"use strict";

	if(isGM){
		/*jshint newcap: false  */
		return GM_setValue(name, JSON.stringify(val));
	}

	return scriptStore.setItem(name, JSON.stringify(val));
};
