function ddtMainFunction(){
	//fix for % escaping.
	var _spoilerTag = '%' + '%';

	var boardHostName = location.hostname.toLowerCase();
	var boardHostNameSection = boardHostName;
	var board_section = location.pathname.match(/\/([^\/]+)\//);
	if (board_section[1]){
		boardHostNameSection += '_' + board_section[1];
		board_section = board_section[1];
	}else{
		board_section = "unknown";
	}

	var threadId = location.pathname.match(/(\d+)[^\/]*$/);

	var isSavedThread = window.location.protocol == 'file:' && ddtThread;

	if (threadId[1]){
		threadId = threadId[1];
	}else{
		threadId = "0";
	}

	function math_ceil(a){
		return Math.ceil(a);
	}

	function math_floor(a){
		return Math.floor(a);
	}

	function math_max(a,b){
		if(a > b) return a
		return b;
	}

	function math_min(a,b){
		if(a < b) return a
		return b;
	}

	function math_round(a){
		return Math.round(a);
	}

	function math_pow(a,b){
		return Math.pow(a,b);
	}

	function math_random(){
		return Math.random();
	}

    function makeUin8(size, p2, p3){
        return new Uint8Array(size, p2, p3);
    }

    function makeUin32(size, p2, p3){
        return new Uint32Array(size, p2, p3);
    }   

    function makeArr(size){
        return new Array(size);
    } 

    var contactStoreName = 'magic_desu4_contacts',
        profileStoreName = 'magic_desu4_numbers';
