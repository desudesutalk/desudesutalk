(function(){
	//fix for % escaping.
	var _spoilerTag = '%' + '%';

	var boardHostName = location.hostname.toLowerCase();

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
