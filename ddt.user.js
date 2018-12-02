// ==UserScript==
// @name         DesuDesuTalk
// @namespace    udp://desushelter/*
// @version      0.4.87
// @description  Write something useful!
// @include      *://dobrochan.com/*/*
// @include      *://dobrochan.ru/*/*
// @include      *://dobrochan.org/*/*
// @include      *://inach.org/*/*
// @include      *://8chan.co/*/*
// @include      *://hatechan.co/*/*
// @include      *://8ch.net/*/*
// @include      *://www.8ch.net/*/*
// @include      *://oxwugzccvk3dk6tj.onion/*/*
// @include      *://lainchan.org/*/*
// @include      *://iichan.hk/*/*
// @include      *://2-ch.su/*/*
// @include      *://syn-ch.com/*/*
// @include      *://syn-ch.org/*/*
// @include      *://syn-ch.ru/*/*
// @include      *://krautchan.net/*/*
// @include      *://boards.4chan.org/*/*
// @include      *://boards.4channel.org/*/*
// @include      *://2ch.hk/*/*
// @include      *://2ch.re/*/*
// @include      *://2ch.pm/*/*
// @include      *://2ch.tf/*/*
// @include      *://2ch.wf/*/*
// @include      *://2ch.yt/*/*
// @include      *://2-ch.so/*/*
// @include      *://dva-ch.net/*/*
// @include      *://02ch.su/*/*
// @include      *://dmirrgetyojz735v.onion/*/*
// @include      *://2-chru.net/*/*
// @include      *://mirror.2-chru.net/*/*
// @include      *://bypass.2-chru.net/*/*
// @include      *://2chru.cafe/*/*
// @include      *://2-chru.cafe/*/*
// @include      *://127.0.0.1:7345/*
// @include      *://ech.su/*
// @include      *://8ch.pl/*/*
// @include      *://8ch.vichandcxw4gm3wy.onion/*/*
// @exclude      *#dev
// @copyright    2014+, Boku
// @icon         https://github.com/desudesutalk/desudesutalk/raw/master/icon.jpg
// @updateURL    https://github.com/desudesutalk/desudesutalk/raw/master/ddt.meta.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// ==/UserScript==

function ddtMainFunction(){
	//fix for % escaping.
	var _spoilerTag = '%' + '%';

	var boardHostName = location.hostname.toLowerCase();

	if(["2ch.hk", "2ch.pm", "2ch.re", "2ch.tf", "2ch.wf", "2ch.yt", "2-ch.so"].indexOf(boardHostName) != -1){
        boardHostName = "2ch.hk";
    }

	var boardHostNameSection = boardHostName;
	var board_section = location.pathname.match(/\/([^\/]+)\//);
	if (board_section && board_section[1]){
		boardHostNameSection += '_' + board_section[1];
		board_section = board_section[1];
	}else{
		board_section = "unknown";
	}

	var threadId = location.pathname.match(/(\d+)[^\/]*$/);

	var isSavedThread = window.location.protocol == 'file:' && ddtThread;

	if (threadId && threadId[1]){
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

!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.ellipticjs=e()}}(function(){return function e(t,r,d){function f(n,c){if(!r[n]){if(!t[n]){var a="function"==typeof require&&require;if(!c&&a)return a(n,!0);if(i)return i(n,!0);throw new Error("Cannot find module '"+n+"'")}var s=r[n]={exports:{}};t[n][0].call(s.exports,function(e){var r=t[n][1][e];return f(r?r:e)},s,s.exports,e,t,r,d)}return r[n].exports}for(var i="function"==typeof require&&require,n=0;n<d.length;n++)f(d[n]);return f}({1:[function(e,t,r){var d=r;d.version=e("../package.json").version,d.utils=e("./elliptic/utils"),d.rand=e("./elliptic/rand"),d.hmacDRBG=e("./elliptic/hmac-drbg"),d.curve=e("./elliptic/curve"),d.curves=e("./elliptic/curves"),d.ec=e("./elliptic/ec")},{"../package.json":26,"./elliptic/curve":4,"./elliptic/curves":7,"./elliptic/ec":8,"./elliptic/hmac-drbg":11,"./elliptic/rand":12,"./elliptic/utils":13}],2:[function(e,t){function r(e,t){this.type=e,this.p=new i(t.p,16),this.red=t.prime?i.red(t.prime):i.mont(this.p),this.zero=new i(0).toRed(this.red),this.one=new i(1).toRed(this.red),this.two=new i(2).toRed(this.red),this.n=t.n&&new i(t.n,16),this.g=t.g&&this.pointFromJSON(t.g,t.gRed),this._wnafT1=makeArr(4),this._wnafT2=makeArr(4),this._wnafT3=makeArr(4),this._wnafT4=makeArr(4)}function d(e,t){this.curve=e,this.type=t,this.precomputed=null}var f=e("assert"),i=e("bn.js"),n=e("../../elliptic"),c=n.utils.getNAF,a=n.utils.getJSF;t.exports=r,r.prototype.point=function(){throw new Error("Not implemented")},r.prototype.validate=function(){throw new Error("Not implemented")},r.prototype._fixedNafMul=function(e,t){var r=e._getDoubles(),d=c(t,1),f=(1<<r.step+1)-(r.step%2===0?2:1);f/=3;for(var i=[],n=0;n<d.length;n+=r.step){for(var a=0,t=n+r.step-1;t>=n;t--)a=(a<<1)+d[t];i.push(a)}for(var s=this.jpoint(null,null,null),o=this.jpoint(null,null,null),b=f;b>0;b--){for(var n=0;n<i.length;n++){var a=i[n];a===b?o=o.mixedAdd(r.points[n]):a===-b&&(o=o.mixedAdd(r.points[n].neg()))}s=s.add(o)}return s.toP()},r.prototype._wnafMul=function(e,t){var r=4,d=e._getNAFPoints(r);r=d.wnd;for(var i=d.points,n=c(t,r),a=this.jpoint(null,null,null),s=n.length-1;s>=0;s--){for(var t=0;s>=0&&0===n[s];s--)t++;if(s>=0&&t++,a=a.dblp(t),0>s)break;var o=n[s];f(0!==o),a="affine"===e.type?a.mixedAdd(o>0?i[o-1>>1]:i[-o-1>>1].neg()):a.add(o>0?i[o-1>>1]:i[-o-1>>1].neg())}return"affine"===e.type?a.toP():a},r.prototype._wnafMulAdd=function(e,t,r,d){for(var f=this._wnafT1,i=this._wnafT2,n=this._wnafT3,s=0,o=0;d>o;o++){var b=t[o],h=b._getNAFPoints(e);f[o]=h.wnd,i[o]=h.points}for(var o=d-1;o>=1;o-=2){var u=o-1,p=o;if(1===f[u]&&1===f[p]){var l=[t[u],null,null,t[p]];0===t[u].y.cmp(t[p].y)?(l[1]=t[u].add(t[p]),l[2]=t[u].toJ().mixedAdd(t[p].neg())):0===t[u].y.cmp(t[p].y.redNeg())?(l[1]=t[u].toJ().mixedAdd(t[p]),l[2]=t[u].add(t[p].neg())):(l[1]=t[u].toJ().mixedAdd(t[p]),l[2]=t[u].toJ().mixedAdd(t[p].neg()));var v=[-3,-1,-5,-7,0,7,5,1,3],g=a(r[u],r[p]);s=math_max(g[0].length,s),n[u]=makeArr(s),n[p]=makeArr(s);for(var y=0;s>y;y++){var m=0|g[0][y],w=0|g[1][y];n[u][y]=v[3*(m+1)+(w+1)],n[p][y]=0,i[u]=l}}else n[u]=c(r[u],f[u]),n[p]=c(r[p],f[p]),s=math_max(n[u].length,s),s=math_max(n[p].length,s)}for(var S=this.jpoint(null,null,null),A=this._wnafT4,o=s;o>=0;o--){for(var x=0;o>=0;){for(var I=!0,y=0;d>y;y++)A[y]=0|n[y][o],0!==A[y]&&(I=!1);if(!I)break;x++,o--}if(o>=0&&x++,S=S.dblp(x),0>o)break;for(var y=0;d>y;y++){var b,M=A[y];0!==M&&(M>0?b=i[y][M-1>>1]:0>M&&(b=i[y][-M-1>>1].neg()),S="affine"===b.type?S.mixedAdd(b):S.add(b))}}for(var o=0;d>o;o++)i[o]=null;return S.toP()},r.BasePoint=d,d.prototype.validate=function(){return this.curve.validate(this)},d.prototype.precompute=function(e){if(this.precomputed)return this;var t={doubles:null,naf:null,beta:null};return t.naf=this._getNAFPoints(8),t.doubles=this._getDoubles(4,e),t.beta=this._getBeta(),this.precomputed=t,this},d.prototype._getDoubles=function(e,t){if(this.precomputed&&this.precomputed.doubles)return this.precomputed.doubles;for(var r=[this],d=this,f=0;t>f;f+=e){for(var i=0;e>i;i++)d=d.dbl();r.push(d)}return{step:e,points:r}},d.prototype._getNAFPoints=function(e){if(this.precomputed&&this.precomputed.naf)return this.precomputed.naf;for(var t=[this],r=(1<<e)-1,d=1===r?null:this.dbl(),f=1;r>f;f++)t[f]=t[f-1].add(d);return{wnd:e,points:t}},d.prototype._getBeta=function(){return null},d.prototype.dblp=function(e){for(var t=this,r=0;e>r;r++)t=t.dbl();return t}},{"../../elliptic":1,assert:15,"bn.js":14}],3:[function(e,t){function r(e){this.twisted=1!=e.a,this.mOneA=this.twisted&&-1==e.a,this.extended=this.mOneA,s.call(this,"mont",e),this.a=new c(e.a,16).mod(this.red.m).toRed(this.red),this.c=new c(e.c,16).toRed(this.red),this.c2=this.c.redSqr(),this.d=new c(e.d,16).toRed(this.red),this.dd=this.d.redAdd(this.d),f(!this.twisted||0===this.c.fromRed().cmpn(1)),this.oneC=1==e.c}function d(e,t,r,d,f){s.BasePoint.call(this,e,"projective"),null===t&&null===r&&null===d?(this.x=this.curve.zero,this.y=this.curve.one,this.z=this.curve.one,this.t=this.curve.zero,this.zOne=!0):(this.x=new c(t,16),this.y=new c(r,16),this.z=d?new c(d,16):this.curve.one,this.t=f&&new c(f,16),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.y.red||(this.y=this.y.toRed(this.curve.red)),this.z.red||(this.z=this.z.toRed(this.curve.red)),this.t&&!this.t.red&&(this.t=this.t.toRed(this.curve.red)),this.zOne=this.z===this.curve.one,this.curve.extended&&!this.t&&(this.t=this.x.redMul(this.y),this.zOne||(this.t=this.t.redMul(this.z.redInvm()))))}{var f=e("assert"),i=e("../curve"),n=e("../../elliptic"),c=e("bn.js"),a=e("inherits"),s=i.base;n.utils.getNAF}a(r,s),t.exports=r,r.prototype._mulA=function(e){return this.mOneA?e.redNeg():this.a.redMul(e)},r.prototype._mulC=function(e){return this.oneC?e:this.c.redMul(e)},r.prototype.point=function(e,t,r,f){return new d(this,e,t,r,f)},r.prototype.jpoint=function(e,t,r,d){return this.point(e,t,r,d)},r.prototype.pointFromJSON=function(e){return d.fromJSON(this,e)},r.prototype.pointFromX=function(e,t){t=new c(t,16),t.red||(t=t.toRed(this.red));var r=t.redSqr(),d=this.c2.redSub(this.a.redMul(r)),f=this.one.redSub(this.c2.redMul(this.d).redMul(r)),n=d.redMul(f.redInvm()).redSqrt(),a=n.fromRed().isOdd();return(e&&!a||!e&&a)&&(n=n.redNeg()),this.point(t,n,i.one)},r.prototype.validate=function(e){if(e.isInfinity())return!0;e.normalize();var t=e.x.redSqr(),r=e.y.redSqr(),d=t.redMul(this.a).redAdd(r),f=this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r)));return 0===d.cmp(f)},a(d,s.BasePoint),d.fromJSON=function(e,t){return new d(e,t[0],t[1],t[2])},d.prototype.inspect=function(){return this.isInfinity()?"<EC Point Infinity>":"<EC Point x: "+this.x.fromRed().toString(16)+" y: "+this.y.fromRed().toString(16)+" z: "+this.z.fromRed().toString(16)+">"},d.prototype.isInfinity=function(){return 0===this.x.cmpn(0)&&0===this.y.cmp(this.z)},d.prototype._extDbl=function(){var e=this.x.redSqr(),t=this.y.redSqr(),r=this.z.redSqr();r=r.redIAdd(r);var d=this.curve._mulA(e),f=this.x.redAdd(this.y).redSqr().redISub(e).redISub(t),i=d.redAdd(t),n=i.redSub(r),c=d.redSub(t),a=f.redMul(n),s=i.redMul(c),o=f.redMul(c),b=n.redMul(i);return this.curve.point(a,s,b,o)},d.prototype._projDbl=function(){var e=this.x.redAdd(this.y).redSqr(),t=this.x.redSqr(),r=this.y.redSqr();if(this.curve.twisted){var d=this.curve._mulA(t),f=d.redAdd(r);if(this.zOne)var i=e.redSub(t).redSub(r).redMul(f.redSub(this.curve.two)),n=f.redMul(d.redSub(r)),c=f.redSqr().redSub(f).redSub(f);else var a=this.z.redSqr(),s=f.redSub(a).redISub(a),i=e.redSub(t).redISub(r).redMul(s),n=f.redMul(d.redSub(r)),c=f.redMul(s)}else var d=t.redAdd(r),a=this.curve._mulC(redMul(this.z)).redSqr(),s=d.redSub(a).redSub(a),i=this.curve._mulC(e.redISub(d)).redMul(s),n=this.curve._mulC(d).redMul(t.redISub(r)),c=d.redMul(s);return this.curve.point(i,n,c)},d.prototype.dbl=function(){return this.isInfinity()?this:this.curve.extended?this._extDbl():this._projDbl()},d.prototype._extAdd=function(e){var t=this.y.redSub(this.x).redMul(e.y.redSub(e.x)),r=this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)),d=this.t.redMul(this.curve.dd).redMul(e.t),f=this.z.redMul(e.z.redAdd(e.z)),i=r.redSub(t),n=f.redSub(d),c=f.redAdd(d),a=r.redAdd(t),s=i.redMul(n),o=c.redMul(a),b=i.redMul(a),h=n.redMul(c);return this.curve.point(s,o,h,b)},d.prototype._projAdd=function(e){var t=this.z.redMul(e.z),r=t.redSqr(),d=this.x.redMul(e.x),f=this.y.redMul(e.y),i=this.curve.d.redMul(d).redMul(f),n=r.redSub(i),c=r.redAdd(i),a=this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(d).redISub(f),s=t.redMul(n).redMul(a);if(this.curve.twisted)var o=t.redMul(c).redMul(f.redSub(this.curve._mulA(d))),b=n.redMul(c);else var o=t.redMul(c).redMul(f.redSub(d)),b=this.curve._mulC(n).redMul(c);return this.curve.point(s,o,b)},d.prototype.add=function(e){return this.isInfinity()?e:e.isInfinity()?this:this.curve.extended?this._extAdd(e):this._projAdd(e)},d.prototype.mul=function(e){return this.precomputed&&this.precomputed.doubles?this.curve._fixedNafMul(this,e):this.curve._wnafMul(this,e)},d.prototype.mulAdd=function(e,t,r){return this.curve._wnafMulAdd(1,[this,t],[e,r],2)},d.prototype.normalize=function(){if(this.zOne)return this;var e=this.z.redInvm();return this.x=this.x.redMul(e),this.y=this.y.redMul(e),this.t&&(this.t=this.t.redMul(e)),this.z=this.curve.one,this.zOne=!0,this},d.prototype.neg=function(){return this.curve.point(this.x.redNeg(),this.y,this.z,this.t&&this.t.redNeg())},d.prototype.getX=function(){return this.normalize(),this.x.fromRed()},d.prototype.getY=function(){return this.normalize(),this.y.fromRed()},d.prototype.toP=d.prototype.normalize,d.prototype.mixedAdd=d.prototype.add},{"../../elliptic":1,"../curve":4,assert:15,"bn.js":14,inherits:25}],4:[function(e,t,r){var d=r;d.base=e("./base"),d.short=e("./short"),d.mont=e("./mont"),d.edwards=e("./edwards")},{"./base":2,"./edwards":3,"./mont":5,"./short":6}],5:[function(e,t){function r(e){a.call(this,"mont",e),this.a=new n(e.a,16).toRed(this.red),this.b=new n(e.b,16).toRed(this.red),this.i4=new n(4).toRed(this.red).redInvm(),this.two=new n(2).toRed(this.red),this.a24=this.i4.redMul(this.a.redAdd(this.two))}function d(e,t,r){a.BasePoint.call(this,e,"projective"),null===t&&null===r?(this.x=this.curve.one,this.z=this.curve.zero):(this.x=new n(t,16),this.z=new n(r,16),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.z.red||(this.z=this.z.toRed(this.curve.red)))}{var f=(e("assert"),e("../curve")),i=e("../../elliptic"),n=e("bn.js"),c=e("inherits"),a=f.base;i.utils.getNAF}c(r,a),t.exports=r,r.prototype.point=function(e,t){return new d(this,e,t)},r.prototype.pointFromJSON=function(e){return d.fromJSON(this,e)},r.prototype.validate=function(e){var t=e.normalize().x,r=t.redSqr(),d=r.redMul(t).redAdd(r.redMul(this.a)).redAdd(t),f=d.redSqrt();return 0===f.redSqr().cmp(d)},c(d,a.BasePoint),d.prototype.precompute=function(){},d.fromJSON=function(e,t){return new d(e,t[0],t[1]||e.one)},d.prototype.inspect=function(){return this.isInfinity()?"<EC Point Infinity>":"<EC Point x: "+this.x.fromRed().toString(16)+" z: "+this.z.fromRed().toString(16)+">"},d.prototype.isInfinity=function(){return 0===this.z.cmpn(0)},d.prototype.dbl=function(){var e=this.x.redAdd(this.z),t=e.redSqr(),r=this.x.redSub(this.z),d=r.redSqr(),f=t.redSub(d),i=t.redMul(d),n=f.redMul(d.redAdd(this.curve.a24.redMul(f)));return this.curve.point(i,n)},d.prototype.add=function(){throw new Error("Not supported on Montgomery curve")},d.prototype.diffAdd=function(e,t){var r=this.x.redAdd(this.z),d=this.x.redSub(this.z),f=e.x.redAdd(e.z),i=e.x.redSub(e.z),n=i.redMul(r),c=f.redMul(d),a=t.z.redMul(n.redAdd(c).redSqr()),s=t.x.redMul(n.redISub(c).redSqr());return this.curve.point(a,s)},d.prototype.mul=function(e){for(var t=e.clone(),r=this,d=this.curve.point(null,null),f=this,i=[];0!==t.cmpn(0);t.ishrn(1))i.push(t.andln(1));for(var n=i.length-1;n>=0;n--)0===i[n]?(r=r.diffAdd(d,f),d=d.dbl()):(d=r.diffAdd(d,f),r=r.dbl());return d},d.prototype.mulAdd=function(){throw new Error("Not supported on Montgomery curve")},d.prototype.normalize=function(){return this.x=this.x.redMul(this.z.redInvm()),this.z=this.curve.one,this},d.prototype.getX=function(){return this.normalize(),this.x.fromRed()}},{"../../elliptic":1,"../curve":4,assert:15,"bn.js":14,inherits:25}],6:[function(e,t){function r(e){o.call(this,"short",e),this.a=new a(e.a,16).toRed(this.red),this.b=new a(e.b,16).toRed(this.red),this.tinv=this.two.redInvm(),this.zeroA=0===this.a.fromRed().cmpn(0),this.threeA=0===this.a.fromRed().sub(this.p).cmpn(-3),this.endo=this._getEndomorphism(e),this._endoWnafT1=makeArr(4),this._endoWnafT2=makeArr(4)}function d(e,t,r,d){o.BasePoint.call(this,e,"affine"),null===t&&null===r?(this.x=null,this.y=null,this.inf=!0):(this.x=new a(t,16),this.y=new a(r,16),d&&(this.x.forceRed(this.curve.red),this.y.forceRed(this.curve.red)),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.y.red||(this.y=this.y.toRed(this.curve.red)),this.inf=!1)}function f(e,t,r,d){o.BasePoint.call(this,e,"jacobian"),null===t&&null===r&&null===d?(this.x=this.curve.one,this.y=this.curve.one,this.z=new a(0)):(this.x=new a(t,16),this.y=new a(r,16),this.z=new a(d,16)),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.y.red||(this.y=this.y.toRed(this.curve.red)),this.z.red||(this.z=this.z.toRed(this.curve.red)),this.zOne=this.z===this.curve.one}{var i=e("assert"),n=e("../curve"),c=e("../../elliptic"),a=e("bn.js"),s=e("inherits"),o=n.base;c.utils.getNAF}s(r,o),t.exports=r,r.prototype._getEndomorphism=function(e){if(this.zeroA&&this.g&&this.n&&1===this.p.modn(3)){var t,r;if(e.beta)t=new a(e.beta,16).toRed(this.red);else{var d=this._getEndoRoots(this.p);t=d[0].cmp(d[1])<0?d[0]:d[1],t=t.toRed(this.red)}if(e.lambda)r=new a(e.lambda,16);else{var f=this._getEndoRoots(this.n);0===this.g.mul(f[0]).x.cmp(this.g.x.redMul(t))?r=f[0]:(r=f[1],i(0===this.g.mul(r).x.cmp(this.g.x.redMul(t))))}var n;return n=e.basis?e.basis.map(function(e){return{a:new a(e.a,16),b:new a(e.b,16)}}):this._getEndoBasis(r),{beta:t,lambda:r,basis:n}}},r.prototype._getEndoRoots=function(e){var t=e===this.p?this.red:a.mont(e),r=new a(2).toRed(t).redInvm(),d=r.redNeg(),f=(new a(1).toRed(t),new a(3).toRed(t).redNeg().redSqrt().redMul(r)),i=d.redAdd(f).fromRed(),n=d.redSub(f).fromRed();return[i,n]},r.prototype._getEndoBasis=function(e){for(var t,r,d,f,i,n,c,s=this.n.shrn(math_floor(this.n.bitLength()/2)),o=e,b=this.n.clone(),h=new a(1),u=new a(0),p=new a(0),l=new a(1),v=0;0!==o.cmpn(0);){var g=b.div(o),y=b.sub(g.mul(o)),m=p.sub(g.mul(h)),w=l.sub(g.mul(u));if(!d&&y.cmp(s)<0)t=c.neg(),r=h,d=y.neg(),f=m;else if(d&&2===++v)break;c=y,b=o,o=y,p=h,h=m,l=u,u=w}i=y.neg(),n=m;var S=d.sqr().add(f.sqr()),A=i.sqr().add(n.sqr());return A.cmp(S)>=0&&(i=t,n=r),d.sign&&(d=d.neg(),f=f.neg()),i.sign&&(i=i.neg(),n=n.neg()),[{a:d,b:f},{a:i,b:n}]},r.prototype._endoSplit=function(e){var t=this.endo.basis,r=t[0],d=t[1],f=d.b.mul(e).divRound(this.n),i=r.b.neg().mul(e).divRound(this.n),n=f.mul(r.a),c=i.mul(d.a),a=f.mul(r.b),s=i.mul(d.b),o=e.sub(n).sub(c),b=a.add(s).neg();return{k1:o,k2:b}},r.prototype.point=function(e,t,r){return new d(this,e,t,r)},r.prototype.pointFromX=function(e,t){t=new a(t,16),t.red||(t=t.toRed(this.red));var r=t.redSqr().redMul(t).redIAdd(t.redMul(this.a)).redIAdd(this.b),d=r.redSqrt(),f=d.fromRed().isOdd();return(e&&!f||!e&&f)&&(d=d.redNeg()),this.point(t,d)},r.prototype.jpoint=function(e,t,r){return new f(this,e,t,r)},r.prototype.pointFromJSON=function(e,t){return d.fromJSON(this,e,t)},r.prototype.validate=function(e){if(e.inf)return!0;var t=e.x,r=e.y,d=this.a.redMul(t),f=t.redSqr().redMul(t).redIAdd(d).redIAdd(this.b);return 0===r.redSqr().redISub(f).cmpn(0)},r.prototype._endoWnafMulAdd=function(e,t){for(var r=this._endoWnafT1,d=this._endoWnafT2,f=0;f<e.length;f++){var i=this._endoSplit(t[f]),n=e[f],c=n._getBeta();i.k1.sign&&(i.k1.sign=!i.k1.sign,n=n.neg(!0)),i.k2.sign&&(i.k2.sign=!i.k2.sign,c=c.neg(!0)),r[2*f]=n,r[2*f+1]=c,d[2*f]=i.k1,d[2*f+1]=i.k2}for(var a=this._wnafMulAdd(1,r,d,2*f),s=0;2*f>s;s++)r[s]=null,d[s]=null;return a},s(d,o.BasePoint),d.prototype._getBeta=function(){function e(e){return d.point(e.x.redMul(d.endo.beta),e.y)}if(this.curve.endo){var t=this.precomputed;if(t&&t.beta)return t.beta;var r=this.curve.point(this.x.redMul(this.curve.endo.beta),this.y);if(t){var d=this.curve;t.beta=r,r.precomputed={beta:null,naf:t.naf&&{wnd:t.naf.wnd,points:t.naf.points.map(e)},doubles:t.doubles&&{step:t.doubles.step,points:t.doubles.points.map(e)}}}return r}},d.prototype.toJSON=function(){return this.precomputed?[this.x,this.y,this.precomputed&&{doubles:this.precomputed.doubles&&{step:this.precomputed.doubles.step,points:this.precomputed.doubles.points.slice(1)},naf:this.precomputed.naf&&{wnd:this.precomputed.naf.wnd,points:this.precomputed.naf.points.slice(1)}}]:[this.x,this.y]},d.fromJSON=function(e,t,r){function d(t){return e.point(t[0],t[1],r)}"string"==typeof t&&(t=JSON.parse(t));var f=e.point(t[0],t[1],r);if(!t[2])return f;var i=t[2];return f.precomputed={beta:null,doubles:i.doubles&&{step:i.doubles.step,points:[f].concat(i.doubles.points.map(d))},naf:i.naf&&{wnd:i.naf.wnd,points:[f].concat(i.naf.points.map(d))}},f},d.prototype.inspect=function(){return this.isInfinity()?"<EC Point Infinity>":"<EC Point x: "+this.x.fromRed().toString(16)+" y: "+this.y.fromRed().toString(16)+">"},d.prototype.isInfinity=function(){return this.inf},d.prototype.add=function(e){if(this.inf)return e;if(e.inf)return this;if(this.eq(e))return this.dbl();if(this.neg().eq(e))return this.curve.point(null,null);if(0===this.x.cmp(e.x))return this.curve.point(null,null);var t=this.y.redSub(e.y);0!==t.cmpn(0)&&(t=t.redMul(this.x.redSub(e.x).redInvm()));var r=t.redSqr().redISub(this.x).redISub(e.x),d=t.redMul(this.x.redSub(r)).redISub(this.y);return this.curve.point(r,d)},d.prototype.dbl=function(){if(this.inf)return this;var e=this.y.redAdd(this.y);if(0===e.cmpn(0))return this.curve.point(null,null);var t=this.curve.a,r=this.x.redSqr(),d=e.redInvm(),f=r.redAdd(r).redIAdd(r).redIAdd(t).redMul(d),i=f.redSqr().redISub(this.x.redAdd(this.x)),n=f.redMul(this.x.redSub(i)).redISub(this.y);return this.curve.point(i,n)},d.prototype.getX=function(){return this.x.fromRed()},d.prototype.getY=function(){return this.y.fromRed()},d.prototype.mul=function(e){return e=new a(e,16),this.precomputed&&this.precomputed.doubles?this.curve._fixedNafMul(this,e):this.curve.endo?this.curve._endoWnafMulAdd([this],[e]):this.curve._wnafMul(this,e)},d.prototype.mulAdd=function(e,t,r){var d=[this,t],f=[e,r];return this.curve.endo?this.curve._endoWnafMulAdd(d,f):this.curve._wnafMulAdd(1,d,f,2)},d.prototype.eq=function(e){return this===e||this.inf===e.inf&&(this.inf||0===this.x.cmp(e.x)&&0===this.y.cmp(e.y))},d.prototype.neg=function(e){function t(e){return e.neg()}if(this.inf)return this;var r=this.curve.point(this.x,this.y.redNeg());if(e&&this.precomputed){var d=this.precomputed;r.precomputed={naf:d.naf&&{wnd:d.naf.wnd,points:d.naf.points.map(t)},doubles:d.doubles&&{step:d.doubles.step,step:d.doubles.points.map(t)}}}return r},d.prototype.toJ=function(){if(this.inf)return this.curve.jpoint(null,null,null);var e=this.curve.jpoint(this.x,this.y,this.curve.one);return e},s(f,o.BasePoint),f.prototype.toP=function(){if(this.isInfinity())return this.curve.point(null,null);var e=this.z.redInvm(),t=e.redSqr(),r=this.x.redMul(t),d=this.y.redMul(t).redMul(e);return this.curve.point(r,d)},f.prototype.neg=function(){return this.curve.jpoint(this.x,this.y.redNeg(),this.z)},f.prototype.add=function(e){if(this.isInfinity())return e;if(e.isInfinity())return this;var t=e.z.redSqr(),r=this.z.redSqr(),d=this.x.redMul(t),f=e.x.redMul(r),i=this.y.redMul(t.redMul(e.z)),n=e.y.redMul(r.redMul(this.z)),c=d.redSub(f),a=i.redSub(n);if(0===c.cmpn(0))return 0!==a.cmpn(0)?this.curve.jpoint(null,null,null):this.dbl();var s=c.redSqr(),o=s.redMul(c),b=d.redMul(s),h=a.redSqr().redIAdd(o).redISub(b).redISub(b),u=a.redMul(b.redISub(h)).redISub(i.redMul(o)),p=this.z.redMul(e.z).redMul(c);return this.curve.jpoint(h,u,p)},f.prototype.mixedAdd=function(e){if(this.isInfinity())return e.toJ();if(e.isInfinity())return this;var t=this.z.redSqr(),r=this.x,d=e.x.redMul(t),f=this.y,i=e.y.redMul(t).redMul(this.z),n=r.redSub(d),c=f.redSub(i);if(0===n.cmpn(0))return 0!==c.cmpn(0)?this.curve.jpoint(null,null,null):this.dbl();var a=n.redSqr(),s=a.redMul(n),o=r.redMul(a),b=c.redSqr().redIAdd(s).redISub(o).redISub(o),h=c.redMul(o.redISub(b)).redISub(f.redMul(s)),u=this.z.redMul(n);return this.curve.jpoint(b,h,u)},f.prototype.dblp=function(e){if(0===e)return this;if(this.isInfinity())return this;if(!e)return this.dbl();if(this.curve.zeroA||this.curve.threeA){for(var t=this,r=0;e>r;r++)t=t.dbl();return t}for(var d=this.curve.a,f=this.curve.tinv,i=this.x,n=this.y,c=this.z,a=c.redSqr().redSqr(),s=n.redAdd(n),r=0;e>r;r++){var o=i.redSqr(),b=s.redSqr(),h=b.redSqr(),u=o.redAdd(o).redIAdd(o).redIAdd(d.redMul(a)),p=i.redMul(b),l=u.redSqr().redISub(p.redAdd(p)),v=p.redISub(l),g=u.redMul(v);g=g.redIAdd(g).redISub(h);var y=s.redMul(c);e>r+1&&(a=a.redMul(h)),i=l,c=y,s=g}return this.curve.jpoint(i,s.redMul(f),c)},f.prototype.dbl=function(){return this.isInfinity()?this:this.curve.zeroA?this._zeroDbl():this.curve.threeA?this._threeDbl():this._dbl()},f.prototype._zeroDbl=function(){if(this.zOne){var e=this.x.redSqr(),t=this.y.redSqr(),r=t.redSqr(),d=this.x.redAdd(t).redSqr().redISub(e).redISub(r);d=d.redIAdd(d);var f=e.redAdd(e).redIAdd(e),i=f.redSqr().redISub(d).redISub(d),n=r.redIAdd(r);n=n.redIAdd(n),n=n.redIAdd(n);var c=i,a=f.redMul(d.redISub(i)).redISub(n),s=this.y.redAdd(this.y)}else{var o=this.x.redSqr(),b=this.y.redSqr(),h=b.redSqr(),u=this.x.redAdd(b).redSqr().redISub(o).redISub(h);u=u.redIAdd(u);var p=o.redAdd(o).redIAdd(o),l=p.redSqr(),v=h.redIAdd(h);v=v.redIAdd(v),v=v.redIAdd(v);var c=l.redISub(u).redISub(u),a=p.redMul(u.redISub(c)).redISub(v),s=this.y.redMul(this.z);s=s.redIAdd(s)}return this.curve.jpoint(c,a,s)},f.prototype._threeDbl=function(){if(this.zOne){var e=this.x.redSqr(),t=this.y.redSqr(),r=t.redSqr(),d=this.x.redAdd(t).redSqr().redISub(e).redISub(r);d=d.redIAdd(d);var f=e.redAdd(e).redIAdd(e).redIAdd(this.curve.a),i=f.redSqr().redISub(d).redISub(d),n=i,c=r.redIAdd(r);c=c.redIAdd(c),c=c.redIAdd(c);var a=f.redMul(d.redISub(i)).redISub(c),s=this.y.redAdd(this.y)}else{var o=this.z.redSqr(),b=this.y.redSqr(),h=this.x.redMul(b),u=this.x.redSub(o).redMul(this.x.redAdd(o));u=u.redAdd(u).redIAdd(u);var p=h.redIAdd(h);p=p.redIAdd(p);var l=p.redAdd(p),n=u.redSqr().redISub(l),s=this.y.redAdd(this.z).redSqr().redISub(b).redISub(o),v=b.redSqr();v=v.redIAdd(v),v=v.redIAdd(v),v=v.redIAdd(v);var a=u.redMul(p.redISub(n)).redISub(v)}return this.curve.jpoint(n,a,s)},f.prototype._dbl=function(){var e=this.curve.a,t=(this.curve.tinv,this.x),r=this.y,d=this.z,f=d.redSqr().redSqr(),i=t.redSqr(),n=r.redSqr(),c=i.redAdd(i).redIAdd(i).redIAdd(e.redMul(f)),a=t.redAdd(t);a=a.redIAdd(a);var s=a.redMul(n),o=c.redSqr().redISub(s.redAdd(s)),b=s.redISub(o),h=n.redSqr();h=h.redIAdd(h),h=h.redIAdd(h),h=h.redIAdd(h);var u=c.redMul(b).redISub(h),p=r.redAdd(r).redMul(d);return this.curve.jpoint(o,u,p)},f.prototype.trpl=function(){if(!this.curve.zeroA)return this.dbl().add(this);var e=this.x.redSqr(),t=this.y.redSqr(),r=this.z.redSqr(),d=t.redSqr(),f=e.redAdd(e).redIAdd(e),i=f.redSqr(),n=this.x.redAdd(t).redSqr().redISub(e).redISub(d);n=n.redIAdd(n),n=n.redAdd(n).redIAdd(n),n=n.redISub(i);var c=n.redSqr(),a=d.redIAdd(d);a=a.redIAdd(a),a=a.redIAdd(a),a=a.redIAdd(a);var s=f.redIAdd(n).redSqr().redISub(i).redISub(c).redISub(a),o=t.redMul(s);o=o.redIAdd(o),o=o.redIAdd(o);var b=this.x.redMul(c).redISub(o);b=b.redIAdd(b),b=b.redIAdd(b);var h=this.y.redMul(s.redMul(a.redISub(s)).redISub(n.redMul(c)));h=h.redIAdd(h),h=h.redIAdd(h),h=h.redIAdd(h);var u=this.z.redAdd(n).redSqr().redISub(r).redISub(c);return this.curve.jpoint(b,h,u)},f.prototype.mul=function(e,t){return e=new a(e,t),this.curve._wnafMul(this,e)},f.prototype.eq=function(e){if("affine"===e.type)return this.eq(e.toJ());if(this===e)return!0;var t=this.z.redSqr(),r=e.z.redSqr();if(0!==this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0))return!1;var d=t.redMul(this.z),f=r.redMul(e.z);return 0===this.y.redMul(f).redISub(e.y.redMul(d)).cmpn(0)},f.prototype.inspect=function(){return this.isInfinity()?"<EC JPoint Infinity>":"<EC JPoint x: "+this.x.toString(16)+" y: "+this.y.toString(16)+" z: "+this.z.toString(16)+">"},f.prototype.isInfinity=function(){return 0===this.z.cmpn(0)}},{"../../elliptic":1,"../curve":4,assert:15,"bn.js":14,inherits:25}],7:[function(e,t,r){function d(e){this.curve="short"===e.type?new a.curve.short(e):"edwards"===e.type?new a.curve.edwards(e):new a.curve.mont(e),this.g=this.curve.g,this.n=this.curve.n,this.hash=e.hash,n(this.g.validate(),"Invalid curve"),n(this.g.mul(this.n).isInfinity(),"Invalid curve, G*N != O")}function f(e,t){Object.defineProperty(i,e,{configurable:!0,enumerable:!0,get:function(){var r=new d(t);return Object.defineProperty(i,e,{configurable:!0,enumerable:!0,value:r}),r}})}var i=r,n=e("assert"),c=e("hash.js"),a=(e("bn.js"),e("../elliptic"));i.PresetCurve=d,f("p192",{type:"short",prime:"p192",p:"ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",a:"ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",b:"64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",n:"ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",hash:c.sha256,gRed:!1,g:["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012","07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"]}),f("p224",{type:"short",prime:"p224",p:"ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",a:"ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",b:"b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",n:"ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",hash:c.sha256,gRed:!1,g:["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21","bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"]}),f("p256",{type:"short",prime:null,p:"ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",a:"ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",b:"5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",n:"ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",hash:c.sha256,gRed:!1,g:["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296","4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"]}),f("curve25519",{type:"mont",prime:"p25519",p:"7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",a:"76d06",b:"0",n:"1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",hash:c.sha256,gRed:!1,g:["9"]}),f("ed25519",{type:"edwards",prime:"p25519",p:"7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",a:"-1",c:"1",d:"52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",n:"1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",hash:c.sha256,gRed:!1,g:["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a","6666666666666666666666666666666666666666666666666666666666666658"]}),f("secp256k1",{type:"short",prime:"k256",p:"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",a:"0",b:"7",n:"ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",h:"1",hash:c.sha256,beta:"7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",lambda:"5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",basis:[{a:"3086d221a7d46bcde86c90e49284eb15",b:"-e4437ed6010e88286f547fa90abfe4c3"},{a:"114ca50f7a8e2f3f657c1108d9d44cfd8",b:"3086d221a7d46bcde86c90e49284eb15"}],gRed:!1,g:["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798","483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",{doubles:{step:4,points:[["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a","f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"],["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508","11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"],["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739","d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"],["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640","4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"],["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c","4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"],["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda","96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"],["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa","5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"],["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0","cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"],["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d","9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"],["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d","e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"],["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1","9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"],["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0","5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"],["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047","10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"],["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862","283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"],["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7","7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"],["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd","56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"],["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83","7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"],["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a","53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"],["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8","bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"],["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d","4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"],["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725","7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"],["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754","4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"],["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c","17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"],["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6","6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"],["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39","c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"],["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891","893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"],["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b","febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"],["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03","2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"],["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d","eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"],["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070","7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"],["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4","e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"],["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da","662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"],["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11","1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"],["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e","efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"],["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41","2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"],["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef","67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"],["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8","db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"],["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d","648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"],["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96","35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"],["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd","ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"],["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5","9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"],["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266","40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"],["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71","34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"],["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac","c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"],["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751","1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"],["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e","493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"],["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241","c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"],["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3","be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"],["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f","4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"],["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19","aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"],["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be","b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"],["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9","6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"],["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2","8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"],["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13","7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"],["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c","ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"],["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba","2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"],["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151","e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"],["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073","d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"],["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458","38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"],["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b","69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"],["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366","d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"],["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa","40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"],["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0","620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"],["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787","7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"],["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e","ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]]},naf:{wnd:7,points:[["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9","388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"],["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4","d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"],["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc","6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"],["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe","cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"],["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb","d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"],["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8","ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"],["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e","581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"],["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34","4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"],["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c","85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"],["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5","321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"],["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f","2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"],["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714","73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"],["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729","a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"],["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db","2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"],["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4","e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"],["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5","b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"],["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479","2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"],["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d","80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"],["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f","1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"],["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb","d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"],["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9","eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"],["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963","758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"],["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74","958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"],["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530","e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"],["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b","5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"],["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247","cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"],["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1","cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"],["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120","4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"],["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435","91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"],["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18","673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"],["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8","59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"],["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb","3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"],["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f","55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"],["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143","efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"],["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba","e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"],["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45","f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"],["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a","744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"],["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e","c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"],["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8","e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"],["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c","30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"],["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519","e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"],["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab","100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"],["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca","ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"],["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf","8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"],["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610","68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"],["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4","f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"],["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c","d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"],["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940","edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"],["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980","a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"],["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3","66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"],["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf","9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"],["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63","4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"],["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448","fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"],["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf","5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"],["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5","8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"],["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6","8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"],["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5","5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"],["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99","f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"],["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51","f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"],["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5","42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"],["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5","204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"],["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997","4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"],["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881","73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"],["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5","39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"],["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66","d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"],["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726","ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"],["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede","6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"],["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94","60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"],["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31","3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"],["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51","b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"],["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252","ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"],["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5","cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"],["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b","6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"],["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4","322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"],["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f","6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"],["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889","2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"],["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246","b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"],["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984","998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"],["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a","b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"],["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030","bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"],["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197","6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"],["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593","c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"],["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef","21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"],["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38","60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"],["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a","49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"],["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111","5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"],["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502","7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"],["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea","be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"],["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26","8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"],["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986","39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"],["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e","62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"],["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4","25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"],["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda","ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"],["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859","cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"],["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f","f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"],["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c","6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"],["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942","fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"],["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a","1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"],["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80","5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"],["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d","438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"],["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1","cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"],["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63","c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"],["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352","6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"],["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193","ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"],["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00","9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"],["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58","ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"],["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7","d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"],["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8","c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"],["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e","67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"],["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d","cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"],["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b","299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"],["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f","f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"],["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6","462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"],["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297","62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"],["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a","7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"],["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c","ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"],["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52","4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"],["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb","bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"],["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065","bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"],["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917","603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"],["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9","cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"],["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3","553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"],["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57","712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"],["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66","ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"],["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8","9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"],["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721","9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"],["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180","4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]]}}]})
},{"../elliptic":1,assert:15,"bn.js":14,"hash.js":19}],8:[function(e,t){function r(e){return this instanceof r?("string"==typeof e&&(e=f.curves[e]),e instanceof f.curves.PresetCurve&&(e={curve:e}),this.curve=e.curve.curve,this.n=this.curve.n,this.nh=this.n.shrn(1),this.g=this.curve.g,this.g=e.curve.g,this.g.precompute(e.curve.n.bitLength()+1),void(this.hash=e.hash||e.curve.hash)):new r(e)}var d=(e("assert"),e("bn.js")),f=e("../../elliptic"),i=(f.utils,e("./key")),n=e("./signature");t.exports=r,r.prototype.keyPair=function(e,t){return new i(this,e,t)},r.prototype.genKeyPair=function(e){e||(e={});for(var t=new f.hmacDRBG({hash:this.hash,pers:e.pers,entropy:e.entropy||f.rand(this.hash.hmacStrength),nonce:this.n.toArray()}),r=this.n.byteLength(),i=this.n.sub(new d(2));;){var n=new d(t.generate(r));if(!(n.cmp(i)>0))return n.iaddn(1),this.keyPair(n)}},r.prototype._truncateToN=function(e,t){var r=8*e.byteLength()-this.n.bitLength();return r>0&&(e=e.shrn(r)),!t&&e.cmp(this.n)>=0?e.sub(this.n):e},r.prototype.sign=function(e,t,r){t=this.keyPair(t,"hex"),e=this._truncateToN(new d(e,16)),r||(r={});for(var i=this.n.byteLength(),c=t.getPrivate().toArray(),a=c.length;21>a;a++)c.unshift(0);for(var s=e.toArray(),a=s.length;i>a;a++)s.unshift(0);for(var o=new f.hmacDRBG({hash:this.hash,entropy:c,nonce:s}),b=this.n.sub(new d(1));;){var h=new d(o.generate(this.n.byteLength()));if(h=this._truncateToN(h,!0),!(h.cmpn(1)<=0||h.cmp(b)>=0)){var u=this.g.mul(h);if(!u.isInfinity()){var p=u.getX().mod(this.n);if(0!==p.cmpn(0)){var l=h.invm(this.n).mul(p.mul(t.getPrivate()).iadd(e)).mod(this.n);if(0!==l.cmpn(0))return r.canonical&&l.cmp(this.nh)>0&&(l=this.n.sub(l)),new n(p,l)}}}}},r.prototype.verify=function(e,t,r){e=this._truncateToN(new d(e,16)),r=this.keyPair(r,"hex"),t=new n(t,"hex");var f=t.r,i=t.s;if(f.cmpn(1)<0||f.cmp(this.n)>=0)return!1;if(i.cmpn(1)<0||i.cmp(this.n)>=0)return!1;var c=i.invm(this.n),a=c.mul(e).mod(this.n),s=c.mul(f).mod(this.n),o=this.g.mulAdd(a,r.getPublic(),s);return o.isInfinity()?!1:0===o.getX().mod(this.n).cmp(f)}},{"../../elliptic":1,"./key":9,"./signature":10,assert:15,"bn.js":14}],9:[function(e,t){function r(e,t,d){return t instanceof r?t:d instanceof r?d:(t||(t=d,d=null),null!==t&&"object"==typeof t&&(t.x?(d=t,t=null):(t.priv||t.pub)&&(d=t.pub,t=t.priv)),this.ec=e,this.priv=null,this.pub=null,void(this._importPublicHex(t,d)||("hex"===d&&(d=null),t&&this._importPrivate(t),d&&this._importPublic(d))))}var d=(e("assert"),e("bn.js")),f=e("../../elliptic"),i=f.utils;t.exports=r,r.prototype.validate=function(){var e=this.getPublic();return e.isInfinity()?{result:!1,reason:"Invalid public key"}:e.validate()?e.mul(this.ec.curve.n).isInfinity()?{result:!0,reason:null}:{result:!1,reason:"Public key * N != O"}:{result:!1,reason:"Public key is not a point"}},r.prototype.getPublic=function(e,t){if(this.pub||(this.pub=this.ec.g.mul(this.priv)),"string"==typeof e&&(t=e,e=null),!t)return this.pub;for(var r=this.ec.curve.p.byteLength(),d=this.pub.getX().toArray(),f=d.length;r>f;f++)d.unshift(0);if(e)var n=[this.pub.getY().isEven()?2:3].concat(d);else{for(var c=this.pub.getY().toArray(),f=c.length;r>f;f++)c.unshift(0);var n=[4].concat(d,c)}return i.encode(n,t)},r.prototype.getPrivate=function(e){return"hex"===e?this.priv.toString(16):this.priv},r.prototype._importPrivate=function(e){this.priv=new d(e,16),this.priv=this.priv.mod(this.ec.curve.n)},r.prototype._importPublic=function(e){this.pub=this.ec.curve.point(e.x,e.y)},r.prototype._importPublicHex=function(e,t){e=i.toArray(e,t);var r=this.ec.curve.p.byteLength();if(4===e[0]&&e.length-1===2*r)this.pub=this.ec.curve.point(e.slice(1,1+r),e.slice(1+r,1+2*r));else{if(2!==e[0]&&3!==e[0]||e.length-1!==r)return!1;this.pub=this.ec.curve.pointFromX(3===e[0],e.slice(1,1+r))}return!0},r.prototype.derive=function(e){return e.mul(this.priv).getX()},r.prototype.sign=function(e){return this.ec.sign(e,this)},r.prototype.verify=function(e,t){return this.ec.verify(e,t,this)},r.prototype.inspect=function(){return"<Key priv: "+(this.priv&&this.priv.toString(16))+" pub: "+(this.pub&&this.pub.inspect())+" >"}},{"../../elliptic":1,assert:15,"bn.js":14}],10:[function(e,t){function r(e,t){return e instanceof r?e:void(this._importDER(e,t)||(d(e&&t,"Signature without r or s"),this.r=new f(e,16),this.s=new f(t,16)))}var d=e("assert"),f=e("bn.js"),i=e("../../elliptic"),n=i.utils;t.exports=r,r.prototype._importDER=function(e,t){if(e=n.toArray(e,t),e.length<6||48!==e[0]||2!==e[2])return!1;var r=e[1];if(1+r>e.length)return!1;var d=e[3];if(d>=128)return!1;if(4+d+2>=e.length)return!1;if(2!==e[4+d])return!1;var i=e[5+d];return i>=128?!1:4+d+2+i>e.length?!1:(this.r=new f(e.slice(4,4+d)),this.s=new f(e.slice(4+d+2,4+d+2+i)),!0)},r.prototype.toDER=function(e){var t=this.r.toArray(),r=this.s.toArray();128&t[0]&&(t=[0].concat(t)),128&r[0]&&(r=[0].concat(r));var d=t.length+r.length+4,f=[48,d,2,t.length];return f=f.concat(t,[2,r.length],r),n.encode(f,e)}},{"../../elliptic":1,assert:15,"bn.js":14}],11:[function(e,t){function r(e){if(!(this instanceof r))return new r(e);this.hash=e.hash,this.predResist=!!e.predResist,this.outLen=this.hash.outSize,this.minEntropy=e.minEntropy||this.hash.hmacStrength,this.reseed=null,this.reseedInterval=null,this.K=null,this.V=null;var t=n.toArray(e.entropy,e.entropyEnc),f=n.toArray(e.nonce,e.nonceEnc),i=n.toArray(e.pers,e.persEnc);d(t.length>=this.minEntropy/8,"Not enough entropy. Minimum is: "+this.minEntropy+" bits"),this._init(t,f,i)}var d=e("assert"),f=e("hash.js"),i=e("../elliptic"),n=i.utils;t.exports=r,r.prototype._init=function(e,t,r){var d=e.concat(t).concat(r);this.K=makeArr(this.outLen/8),this.V=makeArr(this.outLen/8);for(var f=0;f<this.V.length;f++)this.K[f]=0,this.V[f]=1;this._update(d),this.reseed=1,this.reseedInterval=281474976710656},r.prototype._hmac=function(){return new f.hmac(this.hash,this.K)},r.prototype._update=function(e){var t=this._hmac().update(this.V).update([0]);e&&(t=t.update(e)),this.K=t.digest(),this.V=this._hmac().update(this.V).digest(),e&&(this.K=this._hmac().update(this.V).update([1]).update(e).digest(),this.V=this._hmac().update(this.V).digest())},r.prototype.reseed=function(e,t,r,f){"string"!=typeof t&&(f=r,r=t,t=null),e=n.toBuffer(e,t),r=n.toBuffer(r,f),d(e.length>=this.minEntropy/8,"Not enough entropy. Minimum is: "+this.minEntropy+" bits"),this._update(e.concat(r||[])),this.reseed=1},r.prototype.generate=function(e,t,r,d){if(this.reseed>this.reseedInterval)throw new Error("Reseed is required");"string"!=typeof t&&(d=r,r=t,t=null),r&&(r=n.toArray(r,d),this._update(r));for(var f=[];f.length<e;)this.V=this._hmac().update(this.V).digest(),f=f.concat(this.V);var i=f.slice(0,e);return this._update(r),this.reseed++,n.encode(i,t)}},{"../elliptic":1,assert:15,"hash.js":19}],12:[function(e,t){function r(){}{var d;e("assert"),e("../elliptic")}if(t.exports=function(e){return d||(d=new r),d.generate(e)},r.prototype.generate=function(e){return this._rand(e)},"object"==typeof window)r.prototype._rand=window.crypto&&window.crypto.getRandomValues?function(e){var t=new Uint8Array(e);return window.crypto.getRandomValues(t),t}:window.msCrypto&&window.msCrypto.getRandomValues?function(e){var t=new Uint8Array(e);return window.msCrypto.getRandomValues(t),t}:function(){throw new Error("Not implemented yet")};else{var f;r.prototype._rand=function(t){return f||(f=e("crypto")),f.randomBytes(t)}}},{"../elliptic":1,assert:15}],13:[function(e,t,r){function d(e,t){if(Array.isArray(e))return e.slice();if(!e)return[];var r=[];if("string"==typeof e)if(t){if("hex"===t){e=e.replace(/[^a-z0-9]+/gi,""),e.length%2!==0&&(e="0"+e);for(var d=0;d<e.length;d+=2)r.push(parseInt(e[d]+e[d+1],16))}}else for(var d=0;d<e.length;d++){var f=e.charCodeAt(d),i=f>>8,n=255&f;i?r.push(i,n):r.push(n)}else for(var d=0;d<e.length;d++)r[d]=0|e[d];return r}function f(e){for(var t="",r=0;r<e.length;r++)t+=i(e[r].toString(16));return t}function i(e){return 1===e.length?"0"+e:e}function n(e,t){for(var r=[],d=1<<t+1,f=e.clone();f.cmpn(1)>=0;){var i;if(f.isOdd()){var n=f.andln(d-1);i=n>(d>>1)-1?(d>>1)-n:n,f.isubn(i)}else i=0;r.push(i);for(var c=0!==f.cmpn(0)&&0===f.andln(d-1)?t+1:1,a=1;c>a;a++)r.push(0);f.ishrn(c)}return r}function c(e,t){var r=[[],[]];e=e.clone(),t=t.clone();for(var d=0,f=0;e.cmpn(-d)>0||t.cmpn(-f)>0;){var i=e.andln(3)+d&3,n=t.andln(3)+f&3;3===i&&(i=-1),3===n&&(n=-1);var c;if(0===(1&i))c=0;else{var a=e.andln(7)+d&7;c=3!==a&&5!==a||2!==n?i:-i}r[0].push(c);var s;if(0===(1&n))s=0;else{var a=t.andln(7)+f&7;s=3!==a&&5!==a||2!==i?n:-n}r[1].push(s),2*d===c+1&&(d=1-d),2*f===s+1&&(f=1-f),e.ishrn(1),t.ishrn(1)}return r}var a=(e("assert"),e("bn.js"),r);a.toArray=d,a.toHex=f,a.encode=function(e,t){return"hex"===t?f(e):e},a.zero2=i,a.getNAF=n,a.getJSF=c},{assert:15,"bn.js":14}],14:[function(e,t){function r(e,t){if(!e)throw new Error(t||"Assertion failed")}function d(e,t){e.super_=t;var r=function(){};r.prototype=t.prototype,e.prototype=new r,e.prototype.constructor=e}function f(e,t){return null!==e&&"object"==typeof e&&Array.isArray(e.words)?e:(this.sign=!1,this.words=null,this.length=0,this.red=null,void(null!==e&&this._init(e||0,t||10)))}function i(e,t){this.name=e,this.p=new f(t,16),this.n=this.p.bitLength(),this.k=new f(1).ishln(this.n).isub(this.p),this.tmp=this._tmp()}function n(){i.call(this,"k256","ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")}function c(){i.call(this,"p224","ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")}function a(){i.call(this,"p192","ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")}function s(){i.call(this,"25519","7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")}function o(e){if("string"==typeof e){var t=f._prime(e);this.m=t.p,this.prime=t}else this.m=e,this.prime=null}function b(e){o.call(this,e),this.shift=this.m.bitLength(),this.shift%26!==0&&(this.shift+=26-this.shift%26),this.r=new f(1).ishln(this.shift),this.r2=this.imod(this.r.sqr()),this.rinv=this.r.invm(this.m),this.minv=this.rinv.mul(this.r).sub(new f(1)).div(this.m).neg().mod(this.r)}"object"==typeof t&&(t.exports=f),f.BN=f,f.wordSize=26,f.prototype._init=function(e,t){if("number"==typeof e)return 0>e&&(this.sign=!0,e=-e),void(67108864>e?(this.words=[67108863&e],this.length=1):(this.words=[67108863&e,e/67108864&67108863],this.length=2));if("object"==typeof e){r("number"==typeof e.length),this.length=math_ceil(e.length/3),this.words=makeArr(this.length);for(var d=0;d<this.length;d++)this.words[d]=0;for(var f=0,d=e.length-1,i=0;d>=0;d-=3){var n=e[d]|e[d-1]<<8|e[d-2]<<16;this.words[i]|=n<<f&67108863,this.words[i+1]=n>>>26-f&67108863,f+=24,f>=26&&(f-=26,i++)}return this.strip()}"hex"===t&&(t=16),r(t===(0|t)&&t>=2&&36>=t),e=e.toString().replace(/\s+/g,"");var c=0;"-"===e[0]&&c++,16===t?this._parseHex(e,c):this._parseBase(e,t,c),"-"===e[0]&&(this.sign=!0),this.strip()},f.prototype._parseHex=function(e,t){this.length=math_ceil((e.length-t)/6),this.words=makeArr(this.length);for(var r=0;r<this.length;r++)this.words[r]=0;for(var d=0,r=e.length-6,f=0;r>=t;r-=6){var i=parseInt(e.slice(r,r+6),16);this.words[f]|=i<<d&67108863,this.words[f+1]|=i>>>26-d&4194303,d+=24,d>=26&&(d-=26,f++)}if(r+6!==t){var i=parseInt(e.slice(t,r+6),16);this.words[f]|=i<<d&67108863,this.words[f+1]|=i>>>26-d&4194303}this.strip()},f.prototype._parseBase=function(e,t,d){this.words=[0],this.length=1;for(var i=0,n=1,c=0,a=null,s=d;s<e.length;s++){var o,b=e[s];o=10===t||"9">=b?0|b:b>="a"?b.charCodeAt(0)-97+10:b.charCodeAt(0)-65+10,i*=t,i+=o,n*=t,c++,n>1048575&&(r(67108863>=n),a||(a=new f(n)),this.mul(a).copy(this),this.iadd(new f(i)),i=0,n=1,c=0)}0!==c&&(this.mul(new f(n)).copy(this),this.iadd(new f(i)))},f.prototype.copy=function(e){e.words=makeArr(this.length);for(var t=0;t<this.length;t++)e.words[t]=this.words[t];e.length=this.length,e.sign=this.sign,e.red=this.red},f.prototype.clone=function(){var e=new f(null);return this.copy(e),e},f.prototype.strip=function(){for(;this.length>1&&0===this.words[this.length-1];)this.length--;return this._normSign()},f.prototype._normSign=function(){return 1===this.length&&0===this.words[0]&&(this.sign=!1),this},f.prototype.inspect=function(){return(this.red?"<BN-R: ":"<BN: ")+this.toString(16)+">"};var h=["","0","00","000","0000","00000","000000","0000000","00000000","000000000","0000000000","00000000000","000000000000","0000000000000","00000000000000","000000000000000","0000000000000000","00000000000000000","000000000000000000","0000000000000000000","00000000000000000000","000000000000000000000","0000000000000000000000","00000000000000000000000","000000000000000000000000","0000000000000000000000000"],u=[0,0,25,16,12,11,10,9,8,8,7,7,7,7,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],p=[0,0,33554432,43046721,16777216,48828125,60466176,40353607,16777216,43046721,1e7,19487171,35831808,62748517,7529536,11390625,16777216,24137569,34012224,47045881,64e6,4084101,5153632,6436343,7962624,9765625,11881376,14348907,17210368,20511149,243e5,28629151,33554432,39135393,45435424,52521875,60466176];f.prototype.toString=function(e){if(e=e||10,16===e||"hex"===e){for(var t="",d=0,f=0,i=0;i<this.length;i++){var n=this.words[i],c=(16777215&(n<<d|f)).toString(16);f=n>>>24-d&16777215,t=0!==f||i!==this.length-1?h[6-c.length]+c+t:c+t,d+=2,d>=26&&(d-=26,i--)}return 0!==f&&(t=f.toString(16)+t),this.sign&&(t="-"+t),t}if(e===(0|e)&&e>=2&&36>=e){var a=u[e],s=p[e],t="",o=this.clone();for(o.sign=!1;0!==o.cmpn(0);){var b=o.modn(s).toString(e);o=o.idivn(s),t=0!==o.cmpn(0)?h[a-b.length]+b+t:b+t}return 0===this.cmpn(0)&&(t="0"+t),this.sign&&(t="-"+t),t}r(!1,"Base should be between 2 and 36")},f.prototype.toJSON=function(){return this.toString(16)},f.prototype.toArray=function(){this.strip();var e=makeArr(this.byteLength());e[0]=0;for(var t=this.clone(),r=0;0!==t.cmpn(0);r++){var d=t.andln(255);t.ishrn(8),e[e.length-r-1]=d}return e},f.prototype._countBits=function(e){return e>=33554432?26:e>=16777216?25:e>=8388608?24:e>=4194304?23:e>=2097152?22:e>=1048576?21:e>=524288?20:e>=262144?19:e>=131072?18:e>=65536?17:e>=32768?16:e>=16384?15:e>=8192?14:e>=4096?13:e>=2048?12:e>=1024?11:e>=512?10:e>=256?9:e>=128?8:e>=64?7:e>=32?6:e>=16?5:e>=8?4:e>=4?3:e>=2?2:e>=1?1:0},f.prototype.bitLength=function(){var e=0,t=this.words[this.length-1],e=this._countBits(t);return 26*(this.length-1)+e},f.prototype.byteLength=function(){this.words[this.length-1];return math_ceil(this.bitLength()/8)},f.prototype.neg=function(){if(0===this.cmpn(0))return this.clone();var e=this.clone();return e.sign=!this.sign,e},f.prototype.iadd=function(e){if(this.sign&&!e.sign){this.sign=!1;var t=this.isub(e);return this.sign=!this.sign,this._normSign()}if(!this.sign&&e.sign){e.sign=!1;var t=this.isub(e);return e.sign=!0,t._normSign()}var r,d;this.length>e.length?(r=this,d=e):(r=e,d=this);for(var f=0,i=0;i<d.length;i++){var t=r.words[i]+d.words[i]+f;this.words[i]=67108863&t,f=t>>>26}for(;0!==f&&i<r.length;i++){var t=r.words[i]+f;this.words[i]=67108863&t,f=t>>>26}if(this.length=r.length,0!==f)this.words[this.length]=f,this.length++;else if(r!==this)for(;i<r.length;i++)this.words[i]=r.words[i];return this},f.prototype.add=function(e){if(e.sign&&!this.sign){e.sign=!1;var t=this.sub(e);return e.sign=!0,t}if(!e.sign&&this.sign){this.sign=!1;var t=e.sub(this);return this.sign=!0,t}return this.length>e.length?this.clone().iadd(e):e.clone().iadd(this)},f.prototype.isub=function(e){if(e.sign){e.sign=!1;var t=this.iadd(e);return e.sign=!0,t._normSign()}if(this.sign)return this.sign=!1,this.iadd(e),this.sign=!0,this._normSign();var r=this.cmp(e);if(0===r)return this.sign=!1,this.length=1,this.words[0]=0,this;if(r>0)var d=this,f=e;else var d=e,f=this;for(var i=0,n=0;n<f.length;n++){var t=d.words[n]-f.words[n]-i;0>t?(t+=67108864,i=1):i=0,this.words[n]=t}for(;0!==i&&n<d.length;n++){var t=d.words[n]-i;0>t?(t+=67108864,i=1):i=0,this.words[n]=t}if(0===i&&n<d.length&&d!==this)for(;n<d.length;n++)this.words[n]=d.words[n];return this.length=math_max(this.length,n),d!==this&&(this.sign=!0),this.strip()},f.prototype.sub=function(e){return this.clone().isub(e)},f.prototype.mulTo=function(e,t){t.sign=e.sign!==this.sign,t.length=this.length+e.length;for(var r=0,d=0;d<t.length-1;d++){for(var f=r>>>26,i=67108863&r,n=math_min(d,e.length-1),c=math_max(0,d-this.length+1);n>=c;c++){var a=d-c,s=0|this.words[a],o=0|e.words[c],b=s*o,h=67108863&b;f=f+(b/67108864|0)|0,h=h+i|0,i=67108863&h,f=f+(h>>>26)|0}t.words[d]=i,r=f}return 0!==r?t.words[d]=r:t.length--,t.strip()},f.prototype.mul=function(e){var t=new f(null);return t.words=makeArr(this.length+e.length),this.mulTo(e,t)},f.prototype.imul=function(e){if(0===this.cmpn(0)||0===e.cmpn(0))return this.words[0]=0,this.length=1,this;var t=this.length,r=e.length;this.sign=e.sign!==this.sign,this.length=this.length+e.length,this.words[this.length-1]=0;for(var d=this.length-2;d>=0;d--){for(var f=0,i=0,n=math_min(d,r-1),c=math_max(0,d-t+1);n>=c;c++){var a=d-c,s=this.words[a],o=e.words[c],b=s*o,h=67108863&b;f+=b/67108864|0,h+=i,i=67108863&h,f+=h>>>26}this.words[d]=i,this.words[d+1]+=f,f=0}for(var f=0,a=1;a<this.length;a++){var u=this.words[a]+f;this.words[a]=67108863&u,f=u>>>26}return this.strip()},f.prototype.sqr=function(){return this.mul(this)},f.prototype.isqr=function(){return this.mul(this)},f.prototype.ishln=function(e){r("number"==typeof e&&e>=0);{var t=e%26,d=(e-t)/26,f=67108863>>>26-t<<26-t;this.clone()}if(0!==t){for(var i=0,n=0;n<this.length;n++){var c=this.words[n]&f,a=this.words[n]-c<<t;this.words[n]=a|i,i=c>>>26-t}i&&(this.words[n]=i,this.length++)}if(0!==d){for(var n=this.length-1;n>=0;n--)this.words[n+d]=this.words[n];for(var n=0;d>n;n++)this.words[n]=0;this.length+=d}return this.strip()},f.prototype.ishrn=function(e,t,d){r("number"==typeof e&&e>=0),t=t?(t-t%26)/26:0;var f=e%26,i=math_min((e-f)/26,this.length),n=67108863^67108863>>>f<<f,c=d;if(t-=i,t=math_max(0,t),c){for(var a=0;i>a;a++)c.words[a]=this.words[a];c.length=i}if(0===i);else if(this.length>i){this.length-=i;for(var a=0;a<this.length;a++)this.words[a]=this.words[a+i]}else this.words[0]=0,this.length=1;for(var s=0,a=this.length-1;a>=0&&(0!==s||a>=t);a--){var o=this.words[a];this.words[a]=s<<26-f|o>>>f,s=o&n}return c&&0!==s&&(c.words[c.length++]=s),0===this.length&&(this.words[0]=0,this.length=1),this.strip(),d?{hi:this,lo:c}:this},f.prototype.shln=function(e){return this.clone().ishln(e)},f.prototype.shrn=function(e){return this.clone().ishrn(e)},f.prototype.testn=function(e){r("number"==typeof e&&e>=0);var t=e%26,d=(e-t)/26,f=1<<t;if(this.length<=d)return!1;var i=this.words[d];return!!(i&f)},f.prototype.imaskn=function(e){r("number"==typeof e&&e>=0);var t=e%26,d=(e-t)/26;if(r(!this.sign,"imaskn works only with positive numbers"),0!==t&&d++,this.length=math_min(d,this.length),0!==t){var f=67108863^67108863>>>t<<t;this.words[this.length-1]&=f}return this.strip()},f.prototype.maskn=function(e){return this.clone().imaskn(e)},f.prototype.iaddn=function(e){if(r("number"==typeof e),0>e)return this.isubn(e);this.words[0]+=e;for(var t=0;t<this.length&&this.words[t]>=67108864;t++)this.words[t]-=67108864,t===this.length-1?this.words[t+1]=1:this.words[t+1]++;return this.length=math_max(this.length,t+1),this},f.prototype.isubn=function(e){if(r("number"==typeof e),r(this.cmpn(e)>=0,"Sign change is not supported in isubn"),0>e)return this.iaddn(-e);this.words[0]-=e;for(var t=0;t<this.length&&this.words[t]<0;t++)this.words[t]+=67108864,this.words[t+1]-=1;return this.strip()},f.prototype.addn=function(e){return this.clone().iaddn(e)},f.prototype.subn=function(e){return this.clone().isubn(e)},f.prototype.iabs=function(){return this.sign=!1,this},f.prototype.abs=function(){return this.clone().iabs()},f.prototype._wordDiv=function(e,t){for(var r=this.length-e.length,d=this.clone(),i=e,n="mod"!==t&&new f(0);d.length>i.length;){var c=67108864*d.words[d.length-1]+d.words[d.length-2],a=c/i.words[i.length-1],s=a/67108864|0,o=67108863&a;a=new f(null),a.words=[o,s],a.length=2;var r=26*(d.length-i.length-1);if(n){var b=a.shln(r);d.sign?n.isub(b):n.iadd(b)}a=a.mul(i).ishln(r),d.sign?d.iadd(a):d.isub(a)}for(;d.ucmp(i)>=0;){var c=d.words[d.length-1],a=new f(c/i.words[i.length-1]|0),r=26*(d.length-i.length);if(n){var b=a.shln(r);d.sign?n.isub(b):n.iadd(b)}a=a.mul(i).ishln(r),d.sign?d.iadd(a):d.isub(a)}return d.sign&&(n&&n.isubn(1),d.iadd(i)),{div:n?n:null,mod:d}},f.prototype.divmod=function(e,t){if(r(0!==e.cmpn(0)),this.sign&&!e.sign){var d,i,n=this.neg().divmod(e,t);return"mod"!==t&&(d=n.div.neg()),"div"!==t&&(i=0===n.mod.cmpn(0)?n.mod:e.sub(n.mod)),{div:d,mod:i}}if(!this.sign&&e.sign){var d,n=this.divmod(e.neg(),t);return"mod"!==t&&(d=n.div.neg()),{div:d,mod:n.mod}}return this.sign&&e.sign?this.neg().divmod(e.neg(),t):e.length>this.length||this.cmp(e)<0?{div:new f(0),mod:this}:1===e.length?"div"===t?{div:this.divn(e.words[0]),mod:null}:"mod"===t?{div:null,mod:new f(this.modn(e.words[0]))}:{div:this.divn(e.words[0]),mod:new f(this.modn(e.words[0]))}:this._wordDiv(e,t)},f.prototype.div=function(e){return this.divmod(e,"div").div},f.prototype.mod=function(e){return this.divmod(e,"mod").mod},f.prototype.divRound=function(e){var t=this.divmod(e);if(0===t.mod.cmpn(0))return t.div;var r=t.div.sign?t.mod.isub(e):t.mod,d=e.shrn(1),f=e.andln(1),i=r.cmp(d);return 0>i||1===f&&0===i?t.div:t.div.sign?t.div.isubn(1):t.div.iaddn(1)},f.prototype.modn=function(e){r(67108863>=e);for(var t=(1<<26)%e,d=0,f=this.length-1;f>=0;f--)d=(t*d+this.words[f])%e;return d},f.prototype.idivn=function(e){r(67108863>=e);for(var t=0,d=this.length-1;d>=0;d--){var f=this.words[d]+67108864*t;this.words[d]=f/e|0,t=f%e}return this.strip()},f.prototype.divn=function(e){return this.clone().idivn(e)},f.prototype._egcd=function(e,t){r(!t.sign),r(0!==t.cmpn(0));var d=this,i=t.clone();d=d.sign?d.mod(t):d.clone();for(var n=new f(0);d.cmpn(1)>0&&i.cmpn(1)>0;){for(;d.isEven();)d.ishrn(1),e.isEven()?e.ishrn(1):e.iadd(t).ishrn(1);for(;i.isEven();)i.ishrn(1),n.isEven()?n.ishrn(1):n.iadd(t).ishrn(1);d.cmp(i)>=0?(d.isub(i),e.isub(n)):(i.isub(d),n.isub(e))}return 0===d.cmpn(1)?e:n},f.prototype.gcd=function(e){if(0===this.cmpn(0))return e.clone();if(0===e.cmpn(0))return this.clone();var t=this.clone(),r=e.clone();t.sign=!1,r.sign=!1;for(var d=0;t.isEven()&&r.isEven();d++)t.ishrn(1),r.ishrn(1);for(;t.isEven();)t.ishrn(1);do{for(;r.isEven();)r.ishrn(1);if(t.cmp(r)<0){var f=t;t=r,r=f}t.isub(t.div(r).mul(r))}while(0!==t.cmpn(0)&&0!==r.cmpn(0));return 0===t.cmpn(0)?r.ishln(d):t.ishln(d)},f.prototype.invm=function(e){return this._egcd(new f(1),e).mod(e)},f.prototype.isEven=function(){return 0===(1&this.words[0])},f.prototype.isOdd=function(){return 1===(1&this.words[0])},f.prototype.andln=function(e){return this.words[0]&e},f.prototype.bincn=function(e){r("number"==typeof e);var t=e%26,d=(e-t)/26,f=1<<t;if(this.length<=d){for(var i=this.length;d+1>i;i++)this.words[i]=0;return this.words[d]|=f,this.length=d+1,this}for(var n=f,i=d;0!==n&&i<this.length;i++){var c=this.words[i];c+=n,n=c>>>26,c&=67108863,this.words[i]=c}return 0!==n&&(this.words[i]=n,this.length++),this},f.prototype.cmpn=function(e){var t=0>e;if(t&&(e=-e),this.sign&&!t)return-1;if(!this.sign&&t)return 1;e&=67108863,this.strip();var r;if(this.length>1)r=1;else{var d=this.words[0];r=d===e?0:e>d?-1:1}return this.sign&&(r=-r),r},f.prototype.cmp=function(e){if(this.sign&&!e.sign)return-1;if(!this.sign&&e.sign)return 1;var t=this.ucmp(e);return this.sign?-t:t},f.prototype.ucmp=function(e){if(this.length>e.length)return 1;if(this.length<e.length)return-1;for(var t=0,r=this.length-1;r>=0;r--){var d=this.words[r],f=e.words[r];if(d!==f){f>d?t=-1:d>f&&(t=1);break}}return t},f.red=function(e){return new o(e)},f.prototype.toRed=function(e){return r(!this.red,"Already a number in reduction context"),r(!this.sign,"red works only with positives"),e.convertTo(this)._forceRed(e)},f.prototype.fromRed=function(){return r(this.red,"fromRed works only with numbers in reduction context"),this.red.convertFrom(this)},f.prototype._forceRed=function(e){return this.red=e,this},f.prototype.forceRed=function(e){return r(!this.red,"Already a number in reduction context"),this._forceRed(e)},f.prototype.redAdd=function(e){return r(this.red,"redAdd works only with red numbers"),this.red.add(this,e)},f.prototype.redIAdd=function(e){return r(this.red,"redIAdd works only with red numbers"),this.red.iadd(this,e)},f.prototype.redSub=function(e){return r(this.red,"redSub works only with red numbers"),this.red.sub(this,e)},f.prototype.redISub=function(e){return r(this.red,"redISub works only with red numbers"),this.red.isub(this,e)},f.prototype.redShl=function(e){return r(this.red,"redShl works only with red numbers"),this.red.shl(this,e)},f.prototype.redMul=function(e){return r(this.red,"redMul works only with red numbers"),this.red._verify2(this,e),this.red.mul(this,e)},f.prototype.redIMul=function(e){return r(this.red,"redMul works only with red numbers"),this.red._verify2(this,e),this.red.imul(this,e)},f.prototype.redSqr=function(){return r(this.red,"redSqr works only with red numbers"),this.red._verify1(this),this.red.sqr(this)},f.prototype.redISqr=function(){return r(this.red,"redISqr works only with red numbers"),this.red._verify1(this),this.red.isqr(this)},f.prototype.redSqrt=function(){return r(this.red,"redSqrt works only with red numbers"),this.red._verify1(this),this.red.sqrt(this)},f.prototype.redInvm=function(){return r(this.red,"redInvm works only with red numbers"),this.red._verify1(this),this.red.invm(this)},f.prototype.redNeg=function(){return r(this.red,"redNeg works only with red numbers"),this.red._verify1(this),this.red.neg(this)},f.prototype.redPow=function(e){return r(this.red&&!e.red,"redPow(normalNum)"),this.red._verify1(this),this.red.pow(this,e)};var l={k256:null,p224:null,p192:null,p25519:null};i.prototype._tmp=function(){var e=new f(null);return e.words=makeArr(math_ceil(this.n/13)),e},i.prototype.ireduce=function(e){var t,r=e;do{var d=r.ishrn(this.n,0,this.tmp);r=this.imulK(d.hi),r=r.iadd(d.lo),t=r.bitLength()}while(t>this.n);var f=t<this.n?-1:r.cmp(this.p);return 0===f?(r.words[0]=0,r.length=1):f>0?r.isub(this.p):r.strip(),r},i.prototype.imulK=function(e){return e.imul(this.k)},d(n,i),n.prototype.imulK=function(e){e.words[e.length]=0,e.words[e.length+1]=0,e.length+=2;for(var t=e.length-3;t>=0;t--){var r=e.words[t],d=64*r,f=977*r;d+=f/67108864|0;var i=d/67108864|0;d&=67108863,f&=67108863,e.words[t+2]+=i,e.words[t+1]+=d,e.words[t]=f}var r=e.words[e.length-2];return r>=67108864&&(e.words[e.length-1]+=r>>>26,e.words[e.length-2]=67108863&r),0===e.words[e.length-1]&&e.length--,0===e.words[e.length-1]&&e.length--,e},d(c,i),d(a,i),d(s,i),s.prototype.imulK=function(e){for(var t=0,r=0;r<e.length;r++){var d=19*e.words[r]+t,f=67108863&d;d>>>=26,e.words[r]=f,t=d}return 0!==t&&(e.words[e.length++]=t),e},f._prime=function v(e){if(l[e])return l[e];var v;if("k256"===e)v=new n;else if("p224"===e)v=new c;else if("p192"===e)v=new a;else{if("p25519"!==e)throw new Error("Unknown prime "+e);v=new s}return l[e]=v,v},o.prototype._verify1=function(e){r(!e.sign,"red works only with positives"),r(e.red,"red works only with red numbers")},o.prototype._verify2=function(e,t){r(!e.sign&&!t.sign,"red works only with positives"),r(e.red&&e.red===t.red,"red works only with red numbers")},o.prototype.imod=function(e){return this.prime?this.prime.ireduce(e)._forceRed(this):e.mod(this.m)._forceRed(this)},o.prototype.neg=function(e){var t=e.clone();return t.sign=!t.sign,t.iadd(this.m)._forceRed(this)},o.prototype.add=function(e,t){this._verify2(e,t);var r=e.add(t);return r.cmp(this.m)>=0&&r.isub(this.m),r._forceRed(this)},o.prototype.iadd=function(e,t){this._verify2(e,t);var r=e.iadd(t);return r.cmp(this.m)>=0&&r.isub(this.m),r},o.prototype.sub=function(e,t){this._verify2(e,t);var r=e.sub(t);return r.cmpn(0)<0&&r.iadd(this.m),r._forceRed(this)},o.prototype.isub=function(e,t){this._verify2(e,t);var r=e.isub(t);return r.cmpn(0)<0&&r.iadd(this.m),r},o.prototype.shl=function(e,t){return this._verify1(e),this.imod(e.shln(t))},o.prototype.imul=function(e,t){return this._verify2(e,t),this.imod(e.imul(t))},o.prototype.mul=function(e,t){return this._verify2(e,t),this.imod(e.mul(t))},o.prototype.isqr=function(e){return this.imul(e,e)},o.prototype.sqr=function(e){return this.mul(e,e)},o.prototype.sqrt=function(e){if(0===e.cmpn(0))return e.clone();var t=this.m.andln(3);if(r(t%2===1),3===t){var d=this.m.add(new f(1)).ishrn(2),i=this.pow(e,d);return i}for(var n=this.m.subn(1),c=0;0!==n.cmpn(0)&&0===n.andln(1);)c++,n.ishrn(1);r(0!==n.cmpn(0));var a=new f(1).toRed(this),s=a.redNeg(),o=this.m.subn(1).ishrn(1),b=this.m.bitLength();for(b=new f(2*b*b).toRed(this);0!==this.pow(b,o).cmp(s);)b.redIAdd(s);for(var h=this.pow(b,n),i=this.pow(e,n.addn(1).ishrn(1)),u=this.pow(e,n),p=c;0!==u.cmp(a);){for(var l=u,v=0;0!==l.cmp(a);v++)l=l.redSqr();r(p>v);var g=this.pow(h,new f(1).ishln(p-v-1));i=i.redMul(g),h=g.redSqr(),u=u.redMul(h),p=v}return i},o.prototype.invm=function(e){var t=e._egcd(new f(1),this.m);return t.sign?(t.sign=!1,this.imod(t).redNeg()):this.imod(t)},o.prototype.pow=function(e,t){for(var r=[],d=t.clone();0!==d.cmpn(0);)r.push(d.andln(1)),d.ishrn(1);for(var f=e,i=0;i<r.length&&0===r[i];i++,f=this.sqr(f));if(++i<r.length)for(var d=this.sqr(f);i<r.length;i++,d=this.sqr(d))0!==r[i]&&(f=this.mul(f,d));return f},o.prototype.convertTo=function(e){return e.clone()},o.prototype.convertFrom=function(e){var t=e.clone();return t.red=null,t},f.mont=function(e){return new b(e)},d(b,o),b.prototype.convertTo=function(e){return this.imod(e.shln(this.shift))},b.prototype.convertFrom=function(e){var t=this.imod(e.mul(this.rinv));return t.red=null,t},b.prototype.imul=function(e,t){if(0===e.cmpn(0)||0===t.cmpn(0))return e.words[0]=0,e.length=1,e;var r=e.imul(t),d=r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),f=r.isub(d).ishrn(this.shift),i=f;return f.cmp(this.m)>=0?i=f.isub(this.m):f.cmpn(0)<0&&(i=f.iadd(this.m)),i._forceRed(this)},b.prototype.mul=function(e,t){if(0===e.cmpn(0)||0===t.cmpn(0))return new f(0)._forceRed(this);var r=e.mul(t),d=r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),i=r.isub(d).ishrn(this.shift),n=i;return i.cmp(this.m)>=0?n=i.isub(this.m):i.cmpn(0)<0&&(n=i.iadd(this.m)),n._forceRed(this)},b.prototype.invm=function(e){var t=this.imod(e.invm(this.m).mul(this.r2));return t._forceRed(this)}},{}],15:[function(e,t){function r(e,t){return h.isUndefined(t)?""+t:!h.isNumber(t)||!isNaN(t)&&isFinite(t)?h.isFunction(t)||h.isRegExp(t)?t.toString():t:t.toString()}function d(e,t){return h.isString(e)?e.length<t?e:e.slice(0,t):e}function f(e){return d(JSON.stringify(e.actual,r),128)+" "+e.operator+" "+d(JSON.stringify(e.expected,r),128)}function i(e,t,r,d,f){throw new l.AssertionError({message:r,actual:e,expected:t,operator:d,stackStartFunction:f})}function n(e,t){e||i(e,!0,t,"==",l.ok)}function c(e,t){if(e===t)return!0;if(h.isBuffer(e)&&h.isBuffer(t)){if(e.length!=t.length)return!1;for(var r=0;r<e.length;r++)if(e[r]!==t[r])return!1;return!0}return h.isDate(e)&&h.isDate(t)?e.getTime()===t.getTime():h.isRegExp(e)&&h.isRegExp(t)?e.source===t.source&&e.global===t.global&&e.multiline===t.multiline&&e.lastIndex===t.lastIndex&&e.ignoreCase===t.ignoreCase:h.isObject(e)||h.isObject(t)?s(e,t):e==t}function a(e){return"[object Arguments]"==Object.prototype.toString.call(e)}function s(e,t){if(h.isNullOrUndefined(e)||h.isNullOrUndefined(t))return!1;if(e.prototype!==t.prototype)return!1;if(a(e))return a(t)?(e=u.call(e),t=u.call(t),c(e,t)):!1;try{var r,d,f=v(e),i=v(t)}catch(n){return!1}if(f.length!=i.length)return!1;for(f.sort(),i.sort(),d=f.length-1;d>=0;d--)if(f[d]!=i[d])return!1;for(d=f.length-1;d>=0;d--)if(r=f[d],!c(e[r],t[r]))return!1;return!0}function o(e,t){return e&&t?"[object RegExp]"==Object.prototype.toString.call(t)?t.test(e):e instanceof t?!0:t.call({},e)===!0?!0:!1:!1}function b(e,t,r,d){var f;h.isString(r)&&(d=r,r=null);try{t()}catch(n){f=n}if(d=(r&&r.name?" ("+r.name+").":".")+(d?" "+d:"."),e&&!f&&i(f,r,"Missing expected exception"+d),!e&&o(f,r)&&i(f,r,"Got unwanted exception"+d),e&&f&&r&&!o(f,r)||!e&&f)throw f
}var h=e("util/"),u=Array.prototype.slice,p=Object.prototype.hasOwnProperty,l=t.exports=n;l.AssertionError=function(e){this.name="AssertionError",this.actual=e.actual,this.expected=e.expected,this.operator=e.operator,e.message?(this.message=e.message,this.generatedMessage=!1):(this.message=f(this),this.generatedMessage=!0);var t=e.stackStartFunction||i;if(Error.captureStackTrace)Error.captureStackTrace(this,t);else{var r=new Error;if(r.stack){var d=r.stack,n=t.name,c=d.indexOf("\n"+n);if(c>=0){var a=d.indexOf("\n",c+1);d=d.substring(a+1)}this.stack=d}}},h.inherits(l.AssertionError,Error),l.fail=i,l.ok=n,l.equal=function(e,t,r){e!=t&&i(e,t,r,"==",l.equal)},l.notEqual=function(e,t,r){e==t&&i(e,t,r,"!=",l.notEqual)},l.deepEqual=function(e,t,r){c(e,t)||i(e,t,r,"deepEqual",l.deepEqual)},l.notDeepEqual=function(e,t,r){c(e,t)&&i(e,t,r,"notDeepEqual",l.notDeepEqual)},l.strictEqual=function(e,t,r){e!==t&&i(e,t,r,"===",l.strictEqual)},l.notStrictEqual=function(e,t,r){e===t&&i(e,t,r,"!==",l.notStrictEqual)},l.throws=function(){b.apply(this,[!0].concat(u.call(arguments)))},l.doesNotThrow=function(){b.apply(this,[!1].concat(u.call(arguments)))},l.ifError=function(e){if(e)throw e};var v=Object.keys||function(e){var t=[];for(var r in e)p.call(e,r)&&t.push(r);return t}},{"util/":18}],16:[function(e,t){function r(){}var d=t.exports={};d.nextTick=function(){var e="undefined"!=typeof window&&window.setImmediate,t="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(e)return function(e){return window.setImmediate(e)};if(t){var r=[];return window.addEventListener("message",function(e){var t=e.source;if((t===window||null===t)&&"process-tick"===e.data&&(e.stopPropagation(),r.length>0)){var d=r.shift();d()}},!0),function(e){r.push(e),window.postMessage("process-tick","*")}}return function(e){setTimeout(e,0)}}(),d.title="browser",d.browser=!0,d.env={},d.argv=[],d.on=r,d.addListener=r,d.once=r,d.off=r,d.removeListener=r,d.removeAllListeners=r,d.emit=r,d.binding=function(){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(){throw new Error("process.chdir is not supported")}},{}],17:[function(e,t){t.exports=function(e){return e&&"object"==typeof e&&"function"==typeof e.copy&&"function"==typeof e.fill&&"function"==typeof e.readUInt8}},{}],18:[function(e,t,r){(function(t,d){function f(e,t){var d={seen:[],stylize:n};return arguments.length>=3&&(d.depth=arguments[2]),arguments.length>=4&&(d.colors=arguments[3]),l(t)?d.showHidden=t:t&&r._extend(d,t),S(d.showHidden)&&(d.showHidden=!1),S(d.depth)&&(d.depth=2),S(d.colors)&&(d.colors=!1),S(d.customInspect)&&(d.customInspect=!0),d.colors&&(d.stylize=i),a(d,e,d.depth)}function i(e,t){var r=f.styles[t];return r?"["+f.colors[r][0]+"m"+e+"["+f.colors[r][1]+"m":e}function n(e){return e}function c(e){var t={};return e.forEach(function(e){t[e]=!0}),t}function a(e,t,d){if(e.customInspect&&t&&_(t.inspect)&&t.inspect!==r.inspect&&(!t.constructor||t.constructor.prototype!==t)){var f=t.inspect(d,e);return m(f)||(f=a(e,f,d)),f}var i=s(e,t);if(i)return i;var n=Object.keys(t),l=c(n);if(e.showHidden&&(n=Object.getOwnPropertyNames(t)),M(t)&&(n.indexOf("message")>=0||n.indexOf("description")>=0))return o(t);if(0===n.length){if(_(t)){var v=t.name?": "+t.name:"";return e.stylize("[Function"+v+"]","special")}if(A(t))return e.stylize(RegExp.prototype.toString.call(t),"regexp");if(I(t))return e.stylize(Date.prototype.toString.call(t),"date");if(M(t))return o(t)}var g="",y=!1,w=["{","}"];if(p(t)&&(y=!0,w=["[","]"]),_(t)){var S=t.name?": "+t.name:"";g=" [Function"+S+"]"}if(A(t)&&(g=" "+RegExp.prototype.toString.call(t)),I(t)&&(g=" "+Date.prototype.toUTCString.call(t)),M(t)&&(g=" "+o(t)),0===n.length&&(!y||0==t.length))return w[0]+g+w[1];if(0>d)return A(t)?e.stylize(RegExp.prototype.toString.call(t),"regexp"):e.stylize("[Object]","special");e.seen.push(t);var x;return x=y?b(e,t,d,l,n):n.map(function(r){return h(e,t,d,l,r,y)}),e.seen.pop(),u(x,g,w)}function s(e,t){if(S(t))return e.stylize("undefined","undefined");if(m(t)){var r="'"+JSON.stringify(t).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return e.stylize(r,"string")}return y(t)?e.stylize(""+t,"number"):l(t)?e.stylize(""+t,"boolean"):v(t)?e.stylize("null","null"):void 0}function o(e){return"["+Error.prototype.toString.call(e)+"]"}function b(e,t,r,d,f){for(var i=[],n=0,c=t.length;c>n;++n)i.push(k(t,String(n))?h(e,t,r,d,String(n),!0):"");return f.forEach(function(f){f.match(/^\d+$/)||i.push(h(e,t,r,d,f,!0))}),i}function h(e,t,r,d,f,i){var n,c,s;if(s=Object.getOwnPropertyDescriptor(t,f)||{value:t[f]},s.get?c=s.set?e.stylize("[Getter/Setter]","special"):e.stylize("[Getter]","special"):s.set&&(c=e.stylize("[Setter]","special")),k(d,f)||(n="["+f+"]"),c||(e.seen.indexOf(s.value)<0?(c=v(r)?a(e,s.value,null):a(e,s.value,r-1),c.indexOf("\n")>-1&&(c=i?c.split("\n").map(function(e){return"  "+e}).join("\n").substr(2):"\n"+c.split("\n").map(function(e){return"   "+e}).join("\n"))):c=e.stylize("[Circular]","special")),S(n)){if(i&&f.match(/^\d+$/))return c;n=JSON.stringify(""+f),n.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(n=n.substr(1,n.length-2),n=e.stylize(n,"name")):(n=n.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),n=e.stylize(n,"string"))}return n+": "+c}function u(e,t,r){var d=0,f=e.reduce(function(e,t){return d++,t.indexOf("\n")>=0&&d++,e+t.replace(/\u001b\[\d\d?m/g,"").length+1},0);return f>60?r[0]+(""===t?"":t+"\n ")+" "+e.join(",\n  ")+" "+r[1]:r[0]+t+" "+e.join(", ")+" "+r[1]}function p(e){return Array.isArray(e)}function l(e){return"boolean"==typeof e}function v(e){return null===e}function g(e){return null==e}function y(e){return"number"==typeof e}function m(e){return"string"==typeof e}function w(e){return"symbol"==typeof e}function S(e){return void 0===e}function A(e){return x(e)&&"[object RegExp]"===q(e)}function x(e){return"object"==typeof e&&null!==e}function I(e){return x(e)&&"[object Date]"===q(e)}function M(e){return x(e)&&("[object Error]"===q(e)||e instanceof Error)}function _(e){return"function"==typeof e}function z(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||"undefined"==typeof e}function q(e){return Object.prototype.toString.call(e)}function R(e){return 10>e?"0"+e.toString(10):e.toString(10)}function j(){var e=new Date,t=[R(e.getHours()),R(e.getMinutes()),R(e.getSeconds())].join(":");return[e.getDate(),P[e.getMonth()],t].join(" ")}function k(e,t){return Object.prototype.hasOwnProperty.call(e,t)}var E=/%[sdj%]/g;r.format=function(e){if(!m(e)){for(var t=[],r=0;r<arguments.length;r++)t.push(f(arguments[r]));return t.join(" ")}for(var r=1,d=arguments,i=d.length,n=String(e).replace(E,function(e){if("%%"===e)return"%";if(r>=i)return e;switch(e){case"%s":return String(d[r++]);case"%d":return Number(d[r++]);case"%j":try{return JSON.stringify(d[r++])}catch(t){return"[Circular]"}default:return e}}),c=d[r];i>r;c=d[++r])n+=v(c)||!x(c)?" "+c:" "+f(c);return n},r.deprecate=function(e,f){function i(){if(!n){if(t.throwDeprecation)throw new Error(f);t.traceDeprecation?console.trace(f):console.error(f),n=!0}return e.apply(this,arguments)}if(S(d.process))return function(){return r.deprecate(e,f).apply(this,arguments)};if(t.noDeprecation===!0)return e;var n=!1;return i};var N,O={};r.debuglog=function(e){if(S(N)&&(N=t.env.NODE_DEBUG||""),e=e.toUpperCase(),!O[e])if(new RegExp("\\b"+e+"\\b","i").test(N)){var d=t.pid;O[e]=function(){var t=r.format.apply(r,arguments);console.error("%s %d: %s",e,d,t)}}else O[e]=function(){};return O[e]},r.inspect=f,f.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},f.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"},r.isArray=p,r.isBoolean=l,r.isNull=v,r.isNullOrUndefined=g,r.isNumber=y,r.isString=m,r.isSymbol=w,r.isUndefined=S,r.isRegExp=A,r.isObject=x,r.isDate=I,r.isError=M,r.isFunction=_,r.isPrimitive=z,r.isBuffer=e("./support/isBuffer");var P=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];r.log=function(){console.log("%s - %s",j(),r.format.apply(r,arguments))},r.inherits=e("inherits"),r._extend=function(e,t){if(!t||!x(t))return e;for(var r=Object.keys(t),d=r.length;d--;)e[r[d]]=t[r[d]];return e}}).call(this,e("FWaASH"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":17,FWaASH:16,inherits:25}],19:[function(e,t,r){var d=r;d.utils=e("./hash/utils"),d.common=e("./hash/common"),d.sha=e("./hash/sha"),d.ripemd=e("./hash/ripemd"),d.hmac=e("./hash/hmac"),d.sha256=d.sha.sha256,d.sha224=d.sha.sha224,d.ripemd160=d.ripemd.ripemd160},{"./hash/common":20,"./hash/hmac":21,"./hash/ripemd":22,"./hash/sha":23,"./hash/utils":24}],20:[function(e,t,r){function d(){this.pending=null,this.pendingTotal=0,this.blockSize=this.constructor.blockSize,this.outSize=this.constructor.outSize,this.hmacStrength=this.constructor.hmacStrength,this.endian="big"}var f=e("../hash"),i=f.utils,n=i.assert;r.BlockHash=d,d.prototype.update=function(e,t){if(e=i.toArray(e,t),this.pending=this.pending?this.pending.concat(e):e,this.pendingTotal+=e.length,this.pending.length>=this.blockSize/8){e=this.pending;var r=e.length%(this.blockSize/8);this.pending=e.slice(e.length-r,e.length),0===this.pending.length&&(this.pending=null),e=i.join32(e.slice(0,e.length-r),this.endian);for(var d=0;d<e.length;d+=this.blockSize/32)this._update(e.slice(d,d+this.blockSize/32))}return this},d.prototype.digest=function(e){return this.update(this._pad()),n(null===this.pending),this._digest(e)},d.prototype._pad=function(){var e=this.pendingTotal,t=this.blockSize/8,r=t-(e+8)%t,d=makeArr(r+8);d[0]=128;for(var f=1;r>f;f++)d[f]=0;return e<<=3,"big"===this.endian?(d[f++]=0,d[f++]=0,d[f++]=0,d[f++]=0,d[f++]=e>>>24&255,d[f++]=e>>>16&255,d[f++]=e>>>8&255,d[f++]=255&e):(d[f++]=255&e,d[f++]=e>>>8&255,d[f++]=e>>>16&255,d[f++]=e>>>24&255,d[f++]=0,d[f++]=0,d[f++]=0,d[f++]=0),d}},{"../hash":19}],21:[function(e,t,r){function d(e,t,r){return this instanceof d?(this.Hash=e,this.blockSize=e.blockSize/8,this.outSize=e.outSize/8,void this._init(i.toArray(t,r))):new d(e,t,r)}var f=e("../hash"),i=f.utils,n=i.assert;t.exports=d,d.prototype._init=function(e){e.length>this.blockSize&&(e=(new this.Hash).update(e).digest()),n(e.length<=this.blockSize);for(var t=e.length;t<this.blockSize;t++)e.push(0);for(var r=e.slice(),t=0;t<e.length;t++)e[t]^=54,r[t]^=92;this.hash={inner:(new this.Hash).update(e),outer:(new this.Hash).update(r)}},d.prototype.update=function(e,t){return this.hash.inner.update(e,t),this},d.prototype.digest=function(e){return this.hash.outer.update(this.hash.inner.digest()),this.hash.outer.digest(e)}},{"../hash":19}],22:[function(e,t,r){function d(){return this instanceof d?(u.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],void(this.endian="little")):new d}function f(e,t,r,d){return 15>=e?t^r^d:31>=e?t&r|~t&d:47>=e?(t|~r)^d:63>=e?t&d|r&~d:t^(r|~d)}function i(e){return 15>=e?0:31>=e?1518500249:47>=e?1859775393:63>=e?2400959708:2840853838}function n(e){return 15>=e?1352829926:31>=e?1548603684:47>=e?1836072691:63>=e?2053994217:0}var c=e("../hash"),a=c.utils,s=a.rotl32,o=a.sum32,b=a.sum32_3,h=a.sum32_4,u=c.common.BlockHash;a.inherits(d,u),r.ripemd160=d,d.blockSize=512,d.outSize=160,d.hmacStrength=192,d.prototype._update=function(e){for(var t=this.h[0],r=this.h[1],d=this.h[2],c=this.h[3],a=this.h[4],u=t,y=r,m=d,w=c,S=a,A=0;80>A;A++){var x=o(s(h(t,f(A,r,d,c),e[p[A]],i(A)),v[A]),a);t=a,a=c,c=s(d,10),d=r,r=x,x=o(s(h(u,f(79-A,y,m,w),e[l[A]],n(A)),g[A]),S),u=S,S=w,w=s(m,10),m=y,y=x}x=b(this.h[1],d,w),this.h[1]=b(this.h[2],c,S),this.h[2]=b(this.h[3],a,u),this.h[3]=b(this.h[4],t,y),this.h[4]=b(this.h[0],r,m),this.h[0]=x},d.prototype._digest=function(e){return"hex"===e?a.toHex32(this.h,"little"):a.split32(this.h,"little")};var p=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],l=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],v=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],g=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]},{"../hash":19}],23:[function(e,t,r){function d(){return this instanceof d?(y.call(this),this.h=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],void(this.k=m)):new d}function f(){return this instanceof f?(d.call(this),void(this.h=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])):new f}function i(e,t,r){return e&t^~e&r}function n(e,t,r){return e&t^e&r^t&r}function c(e){return p(e,2)^p(e,13)^p(e,22)}function a(e){return p(e,6)^p(e,11)^p(e,25)}function s(e){return p(e,7)^p(e,18)^e>>>3}function o(e){return p(e,17)^p(e,19)^e>>>10}var b=e("../hash"),h=b.utils,u=h.assert,p=h.rotr32,l=(h.rotl32,h.sum32),v=h.sum32_4,g=h.sum32_5,y=b.common.BlockHash,m=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];h.inherits(d,y),r.sha256=d,d.blockSize=512,d.outSize=256,d.hmacStrength=192,d.prototype._update=function(e){for(var t=makeArr(64),r=0;16>r;r++)t[r]=e[r];for(;r<t.length;r++)t[r]=v(o(t[r-2]),t[r-7],s(t[r-15]),t[r-16]);var d=this.h[0],f=this.h[1],b=this.h[2],h=this.h[3],p=this.h[4],y=this.h[5],m=this.h[6],w=this.h[7];u(this.k.length===t.length);for(var r=0;r<t.length;r++){var S=g(w,a(p),i(p,y,m),this.k[r],t[r]),A=l(c(d),n(d,f,b));w=m,m=y,y=p,p=l(h,S),h=b,b=f,f=d,d=l(S,A)}this.h[0]=l(this.h[0],d),this.h[1]=l(this.h[1],f),this.h[2]=l(this.h[2],b),this.h[3]=l(this.h[3],h),this.h[4]=l(this.h[4],p),this.h[5]=l(this.h[5],y),this.h[6]=l(this.h[6],m),this.h[7]=l(this.h[7],w)},d.prototype._digest=function(e){return"hex"===e?h.toHex32(this.h,"big"):h.split32(this.h,"big")},h.inherits(f,d),r.sha224=f,f.blockSize=512,f.outSize=224,f.hmacStrength=192,f.prototype._digest=function(e){return"hex"===e?h.toHex32(this.h.slice(0,7),"big"):h.split32(this.h.slice(0,7),"big")}},{"../hash":19}],24:[function(e,t,r){function d(e,t){if(Array.isArray(e))return e.slice();if(!e)return[];var r=[];if("string"==typeof e)if(t){if("hex"===t){e=e.replace(/[^a-z0-9]+/gi,""),e.length%2!=0&&(e="0"+e);for(var d=0;d<e.length;d+=2)r.push(parseInt(e[d]+e[d+1],16))}}else for(var d=0;d<e.length;d++){var f=e.charCodeAt(d),i=f>>8,n=255&f;i?r.push(i,n):r.push(n)}else for(var d=0;d<e.length;d++)r[d]=0|e[d];return r}function f(e){for(var t="",r=0;r<e.length;r++)t+=n(e[r].toString(16));return t}function i(e,t){for(var r="",d=0;d<e.length;d++){var f=e[d];"little"===t&&(f=f>>>24|f>>>8&65280|f<<8&16711680|(255&f)<<24,0>f&&(f+=4294967296)),r+=c(f.toString(16))}return r}function n(e){return 1===e.length?"0"+e:e}function c(e){return 7===e.length?"0"+e:6===e.length?"00"+e:5===e.length?"000"+e:4===e.length?"0000"+e:3===e.length?"00000"+e:2===e.length?"000000"+e:1===e.length?"0000000"+e:e}function a(e,t){v(e.length%4===0);for(var r=makeArr(e.length/4),d=0,f=0;d<r.length;d++,f+=4){var i;i="big"===t?e[f]<<24|e[f+1]<<16|e[f+2]<<8|e[f+3]:e[f+3]<<24|e[f+2]<<16|e[f+1]<<8|e[f],0>i&&(i+=4294967296),r[d]=i}return r}function s(e,t){for(var r=makeArr(4*e.length),d=0,f=0;d<e.length;d++,f+=4){var i=e[d];"big"===t?(r[f]=i>>>24,r[f+1]=i>>>16&255,r[f+2]=i>>>8&255,r[f+3]=255&i):(r[f+3]=i>>>24,r[f+2]=i>>>16&255,r[f+1]=i>>>8&255,r[f]=255&i)}return r}function o(e,t){return e>>>t|e<<32-t}function b(e,t){return e<<t|e>>>32-t}function h(e,t){var r=e+t&4294967295;return 0>r&&(r+=4294967296),r}function u(e,t,r){var d=e+t+r&4294967295;return 0>d&&(d+=4294967296),d}function p(e,t,r,d){var f=e+t+r+d&4294967295;return 0>f&&(f+=4294967296),f}function l(e,t,r,d,f){var i=e+t+r+d+f&4294967295;return 0>i&&(i+=4294967296),i}function v(e,t){if(!e)throw new Error(t||"Assertion failed")}var g=r;g.toArray=d,g.toHex=f,g.toHex32=i,g.zero2=n,g.zero8=c,g.join32=a,g.split32=s,g.rotr32=o,g.rotl32=b,g.sum32=h,g.sum32_3=u,g.sum32_4=p,g.sum32_5=l,g.assert=v,g.inherits="function"==typeof Object.create?function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}:function(e,t){e.super_=t;var r=function(){};r.prototype=t.prototype,e.prototype=new r,e.prototype.constructor=e}},{}],25:[function(e,t){t.exports="function"==typeof Object.create?function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}:function(e,t){e.super_=t;var r=function(){};r.prototype=t.prototype,e.prototype=new r,e.prototype.constructor=e}},{}],26:[function(e,t){t.exports={name:"elliptic",version:"0.15.11",description:"EC cryptography",main:"lib/elliptic.js",scripts:{test:"mocha --reporter=spec test/*-test.js"},repository:{type:"git",url:"git@github.com:indutny/elliptic"},keywords:["EC","Elliptic","curve","Cryptography"],author:"Fedor Indutny <fedor@indutny.com>",license:"MIT",bugs:{url:"https://github.com/indutny/elliptic/issues"},homepage:"https://github.com/indutny/elliptic",devDependencies:{browserify:"^3.44.2",mocha:"^1.18.2","uglify-js":"^2.4.13"},dependencies:{"bn.js":"^0.14.1","hash.js":"^0.2.0",inherits:"^2.0.1"}}},{}]},{},[1])(1)});
"use strict";function q(a){throw a;}var t=void 0,u=!1;var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
"undefined"!==typeof module&&module.exports&&(module.exports=sjcl);"function"===typeof define&&define([],function(){return sjcl});
sjcl.cipher.aes=function(a){this.k[0][0][0]||this.D();var b,c,d,e,f=this.k[0][4],g=this.k[1];b=a.length;var h=1;4!==b&&(6!==b&&8!==b)&&q(new sjcl.exception.invalid("invalid aes key size"));this.b=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&
255]]};
sjcl.cipher.aes.prototype={encrypt:function(a){return y(this,a,0)},decrypt:function(a){return y(this,a,1)},k:[[[],[],[],[],[]],[[],[],[],[],[]]],D:function(){var a=this.k[0],b=this.k[1],c=a[4],d=b[4],e,f,g,h=[],l=[],k,n,m,p;for(e=0;0x100>e;e++)l[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=k||1,g=l[g]||1){m=g^g<<1^g<<2^g<<3^g<<4;m=m>>8^m&255^99;c[f]=m;d[m]=f;n=h[e=h[k=h[f]]];p=0x1010101*n^0x10001*e^0x101*k^0x1010100*f;n=0x101*h[m]^0x1010100*m;for(e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][m]=p=p<<24^p>>>8}for(e=
0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};
function y(a,b,c){4!==b.length&&q(new sjcl.exception.invalid("invalid aes block size"));var d=a.b[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,l,k,n=d.length/4-2,m,p=4,s=[0,0,0,0];h=a.k[c];a=h[0];var r=h[1],v=h[2],w=h[3],x=h[4];for(m=0;m<n;m++)h=a[e>>>24]^r[f>>16&255]^v[g>>8&255]^w[b&255]^d[p],l=a[f>>>24]^r[g>>16&255]^v[b>>8&255]^w[e&255]^d[p+1],k=a[g>>>24]^r[b>>16&255]^v[e>>8&255]^w[f&255]^d[p+2],b=a[b>>>24]^r[e>>16&255]^v[f>>8&255]^w[g&255]^d[p+3],p+=4,e=h,f=l,g=k;for(m=0;4>
m;m++)s[c?3&-m:m]=x[e>>>24]<<24^x[f>>16&255]<<16^x[g>>8&255]<<8^x[b&255]^d[p++],h=e,e=f,f=g,g=b,b=h;return s}
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.P(a.slice(b/32),32-(b&31)).slice(1);return c===t?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=math_floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.P(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,math_ceil(b/32));var c=a.length;b&=31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return math_round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return u;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},P:function(a,b,c,d){var e;e=0;for(d===t&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},l:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&0xff00|(c&0xff00)<<8|c<<24;return a}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>24),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};
sjcl.codec.base64={J:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.J,g=0,h=sjcl.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d,e=0,f=sjcl.codec.base64.J,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++)h=f.indexOf(a.charAt(d)),
0>h&&q(new sjcl.exception.invalid("this isn't base64!")),26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e);e&56&&c.push(sjcl.bitArray.partial(e&56,g,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.b[0]||this.D();a?(this.r=a.r.slice(0),this.o=a.o.slice(0),this.h=a.h):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.r=this.N.slice(0);this.o=[];this.h=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.o=sjcl.bitArray.concat(this.o,a);b=this.h;a=this.h=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)z(this,c.splice(0,16));return this},finalize:function(){var a,b=this.o,c=this.r,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(math_floor(this.h/
4294967296));for(b.push(this.h|0);b.length;)z(this,b.splice(0,16));this.reset();return c},N:[],b:[],D:function(){function a(a){return 0x100000000*(a-math_floor(a))|0}var b=0,c=2,d;a:for(;64>b;c++){for(d=2;d*d<=c;d++)if(0===c%d)continue a;8>b&&(this.N[b]=a(math_pow(c,0.5)));this.b[b]=a(math_pow(c,1/3));b++}}};
function z(a,b){var c,d,e,f=b.slice(0),g=a.r,h=a.b,l=g[0],k=g[1],n=g[2],m=g[3],p=g[4],s=g[5],r=g[6],v=g[7];for(c=0;64>c;c++)16>c?d=f[c]:(d=f[c+1&15],e=f[c+14&15],d=f[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+f[c&15]+f[c+9&15]|0),d=d+v+(p>>>6^p>>>11^p>>>25^p<<26^p<<21^p<<7)+(r^p&(s^r))+h[c],v=r,r=s,s=p,p=m+d|0,m=n,n=k,k=l,l=d+(k&n^m&(k^n))+(k>>>2^k>>>13^k>>>22^k<<30^k<<19^k<<10)|0;g[0]=g[0]+l|0;g[1]=g[1]+k|0;g[2]=g[2]+n|0;g[3]=g[3]+m|0;g[4]=g[4]+p|0;g[5]=g[5]+s|0;g[6]=
g[6]+r|0;g[7]=g[7]+v|0}
sjcl.mode.ccm={name:"ccm",encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,l=h.bitLength(c)/8,k=h.bitLength(g)/8;e=e||64;d=d||[];7>l&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(f=2;4>f&&k>>>8*f;f++);f<15-l&&(f=15-l);c=h.clamp(c,8*(15-f));b=sjcl.mode.ccm.L(a,b,c,d,e,f);g=sjcl.mode.ccm.p(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),l=f.clamp(b,h-e),k=f.bitSlice(b,
h-e),h=(h-e)/8;7>g&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(b=2;4>b&&h>>>8*b;b++);b<15-g&&(b=15-g);c=f.clamp(c,8*(15-b));l=sjcl.mode.ccm.p(a,l,c,k,e,b);a=sjcl.mode.ccm.L(a,l.data,c,d,e,b);f.equal(l.tag,a)||q(new sjcl.exception.corrupt("ccm: tag doesn't match"));return l.data},L:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,l=h.l;e/=8;(e%2||4>e||16<e)&&q(new sjcl.exception.invalid("ccm: invalid tag length"));(0xffffffff<d.length||0xffffffff<b.length)&&q(new sjcl.exception.bug("ccm: can't deal with 4GiB or more data"));
f=[h.partial(8,(d.length?64:0)|e-2<<2|f-1)];f=h.concat(f,c);f[3]|=h.bitLength(b)/8;f=a.encrypt(f);if(d.length){c=h.bitLength(d)/8;65279>=c?g=[h.partial(16,c)]:0xffffffff>=c&&(g=h.concat([h.partial(16,65534)],[c]));g=h.concat(g,d);for(d=0;d<g.length;d+=4)f=a.encrypt(l(f,g.slice(d,d+4).concat([0,0,0])))}for(d=0;d<b.length;d+=4)f=a.encrypt(l(f,b.slice(d,d+4).concat([0,0,0])));return h.clamp(f,8*e)},p:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.l;var l=b.length,k=h.bitLength(b);c=h.concat([h.partial(8,
f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!l)return{tag:d,data:[]};for(g=0;g<l;g+=4)c[3]++,e=a.encrypt(c),b[g]^=e[0],b[g+1]^=e[1],b[g+2]^=e[2],b[g+3]^=e[3];return{tag:d,data:h.clamp(b,k)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));var g,h=sjcl.mode.ocb2.H,l=sjcl.bitArray,k=l.l,n=[0,0,0,0];c=h(a.encrypt(c));var m,p=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4)m=b.slice(g,g+4),n=k(n,m),p=p.concat(k(c,a.encrypt(k(c,m)))),c=h(c);m=b.slice(g);b=l.bitLength(m);g=a.encrypt(k(c,[0,0,0,b]));m=l.clamp(k(m.concat([0,0,0]),g),b);n=k(n,k(m.concat([0,0,0]),g));n=a.encrypt(k(n,k(c,h(c))));d.length&&
(n=k(n,f?d:sjcl.mode.ocb2.pmac(a,d)));return p.concat(l.concat(m,l.clamp(n,e)))},decrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));e=e||64;var g=sjcl.mode.ocb2.H,h=sjcl.bitArray,l=h.l,k=[0,0,0,0],n=g(a.encrypt(c)),m,p,s=sjcl.bitArray.bitLength(b)-e,r=[];d=d||[];for(c=0;c+4<s/32;c+=4)m=l(n,a.decrypt(l(n,b.slice(c,c+4)))),k=l(k,m),r=r.concat(m),n=g(n);p=s-32*c;m=a.encrypt(l(n,[0,0,0,p]));m=l(m,h.clamp(b.slice(c),p).concat([0,0,0]));
k=l(k,m);k=a.encrypt(l(k,l(n,g(n))));d.length&&(k=l(k,f?d:sjcl.mode.ocb2.pmac(a,d)));h.equal(h.clamp(k,e),h.bitSlice(b,s))||q(new sjcl.exception.corrupt("ocb: tag doesn't match"));return r.concat(h.clamp(m,p))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.H,e=sjcl.bitArray,f=e.l,g=[0,0,0,0],h=a.encrypt([0,0,0,0]),h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4)h=d(h),g=f(g,a.encrypt(f(h,b.slice(c,c+4))));c=b.slice(c);128>e.bitLength(c)&&(h=f(h,d(h)),c=e.concat(c,[-2147483648,0,0,0]));g=f(g,c);return a.encrypt(f(d(f(h,
d(h))),g))},H:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^135*(a[0]>>>31)]}};
sjcl.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl.bitArray;d=d||[];a=sjcl.mode.gcm.p(!0,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl.mode.gcm.p(u,a,f,d,c,e);g.equal(a.tag,b)||q(new sjcl.exception.corrupt("gcm: tag doesn't match"));return a.data},Z:function(a,b){var c,d,e,f,g,h=sjcl.bitArray.l;e=[0,0,0,0];f=b.slice(0);
for(c=0;128>c;c++){(d=0!==(a[math_floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-0x1f000000)}return e},g:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=0xffffffff&c[d],b[1]^=0xffffffff&c[d+1],b[2]^=0xffffffff&c[d+2],b[3]^=0xffffffff&c[d+3],b=sjcl.mode.gcm.Z(b,a);return b},p:function(a,b,c,d,e,f){var g,h,l,k,n,m,p,s,r=sjcl.bitArray;m=c.length;p=r.bitLength(c);s=r.bitLength(d);h=r.bitLength(e);g=b.encrypt([0,
0,0,0]);96===h?(e=e.slice(0),e=r.concat(e,[1])):(e=sjcl.mode.gcm.g(g,[0,0,0,0],e),e=sjcl.mode.gcm.g(g,e,[0,0,math_floor(h/0x100000000),h&0xffffffff]));h=sjcl.mode.gcm.g(g,[0,0,0,0],d);n=e.slice(0);d=h.slice(0);a||(d=sjcl.mode.gcm.g(g,h,c));for(k=0;k<m;k+=4)n[3]++,l=b.encrypt(n),c[k]^=l[0],c[k+1]^=l[1],c[k+2]^=l[2],c[k+3]^=l[3];c=r.clamp(c,p);a&&(d=sjcl.mode.gcm.g(g,h,c));a=[math_floor(s/0x100000000),s&0xffffffff,math_floor(p/0x100000000),p&0xffffffff];d=sjcl.mode.gcm.g(g,d,a);l=b.encrypt(e);d[0]^=l[0];
d[1]^=l[1];d[2]^=l[2];d[3]^=l[3];return{tag:r.bitSlice(d,0,f),data:c}}};sjcl.misc.hmac=function(a,b){this.M=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.n=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.n[0].update(c[0]);this.n[1].update(c[1]);this.G=new b(this.n[0])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){this.Q&&q(new sjcl.exception.invalid("encrypt on already updated hmac called!"));this.update(a);return this.digest(a)};sjcl.misc.hmac.prototype.reset=function(){this.G=new this.M(this.n[0]);this.Q=u};sjcl.misc.hmac.prototype.update=function(a){this.Q=!0;this.G.update(a)};sjcl.misc.hmac.prototype.digest=function(){var a=this.G.finalize(),a=(new this.M(this.n[1])).update(a).finalize();this.reset();return a};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;(0>d||0>c)&&q(sjcl.exception.invalid("invalid params to pbkdf2"));"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,l,k=[],n=sjcl.bitArray;for(l=1;32*k.length<(d||1);l++){e=f=a.encrypt(n.concat(b,[l]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}k=k.concat(e)}d&&(k=n.clamp(k,d));return k};
sjcl.prng=function(a){this.c=[new sjcl.hash.sha256];this.i=[0];this.F=0;this.s={};this.C=0;this.K={};this.O=this.d=this.j=this.W=0;this.b=[0,0,0,0,0,0,0,0];this.f=[0,0,0,0];this.A=t;this.B=a;this.q=u;this.w={progress:{},seeded:{}};this.m=this.V=0;this.t=1;this.u=2;this.S=0x10000;this.I=[0,48,64,96,128,192,0x100,384,512,768,1024];this.T=3E4;this.R=80};
sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;d===this.m&&q(new sjcl.exception.notReady("generator isn't seeded"));if(d&this.u){d=!(d&this.t);e=[];var f=0,g;this.O=e[0]=(new Date).valueOf()+this.T;for(g=0;16>g;g++)e.push(0x100000000*math_random()|0);for(g=0;g<this.c.length&&!(e=e.concat(this.c[g].finalize()),f+=this.i[g],this.i[g]=0,!d&&this.F&1<<g);g++);this.F>=1<<this.c.length&&(this.c.push(new sjcl.hash.sha256),this.i.push(0));this.d-=f;f>this.j&&(this.j=f);this.F++;
this.b=sjcl.hash.sha256.hash(this.b.concat(e));this.A=new sjcl.cipher.aes(this.b);for(d=0;4>d&&!(this.f[d]=this.f[d]+1|0,this.f[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.S&&A(this),e=B(this),c.push(e[0],e[1],e[2],e[3]);A(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b&&q("Setting paranoia=0 will ruin your security; use it only for testing");this.B=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=(new Date).valueOf(),
g=this.s[c],h=this.isReady(),l=0;d=this.K[c];d===t&&(d=this.K[c]=this.W++);g===t&&(g=this.s[c]=0);this.s[c]=(this.s[c]+1)%this.c.length;switch(typeof a){case "number":b===t&&(b=1);this.c[g].update([d,this.C++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else{"[object Array]"!==c&&(l=1);for(c=0;c<a.length&&!l;c++)"number"!==typeof a[c]&&(l=1)}if(!l){if(b===t)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,
e>>>=1;this.c[g].update([d,this.C++,2,b,f,a.length].concat(a))}break;case "string":b===t&&(b=a.length);this.c[g].update([d,this.C++,3,b,f,a.length]);this.c[g].update(a);break;default:l=1}l&&q(new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string"));this.i[g]+=b;this.d+=b;h===this.m&&(this.isReady()!==this.m&&C("seeded",math_max(this.j,this.d)),C("progress",this.getProgress()))},isReady:function(a){a=this.I[a!==t?a:this.B];return this.j&&this.j>=a?this.i[0]>this.R&&
(new Date).valueOf()>this.O?this.u|this.t:this.t:this.d>=a?this.u|this.m:this.m},getProgress:function(a){a=this.I[a?a:this.B];return this.j>=a?1:this.d>a?1:this.d/a},startCollectors:function(){this.q||(this.a={loadTimeCollector:D(this,this.aa),mouseCollector:D(this,this.ba),keyboardCollector:D(this,this.$),accelerometerCollector:D(this,this.U)},window.addEventListener?(window.addEventListener("load",this.a.loadTimeCollector,u),window.addEventListener("mousemove",this.a.mouseCollector,u),window.addEventListener("keypress",
this.a.keyboardCollector,u),window.addEventListener("devicemotion",this.a.accelerometerCollector,u)):document.attachEvent?(document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector)):q(new sjcl.exception.bug("can't attach event")),this.q=!0)},stopCollectors:function(){this.q&&(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,u),window.removeEventListener("mousemove",
this.a.mouseCollector,u),window.removeEventListener("keypress",this.a.keyboardCollector,u),window.removeEventListener("devicemotion",this.a.accelerometerCollector,u)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",this.a.mouseCollector),document.detachEvent("keypress",this.a.keyboardCollector)),this.q=u)},addEventListener:function(a,b){this.w[a][this.V++]=b},removeEventListener:function(a,b){var c,d,e=this.w[a],f=[];for(d in e)e.hasOwnProperty(d)&&
e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},$:function(){E(1)},ba:function(a){var b,c;try{b=a.x||a.clientX||a.offsetX||0,c=a.y||a.clientY||a.offsetY||0}catch(d){c=b=0}0!=b&&0!=c&&sjcl.random.addEntropy([b,c],2,"mouse");E(0)},aa:function(){E(2)},U:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&sjcl.random.addEntropy(b,1,"accelerometer")}a&&sjcl.random.addEntropy(a,
2,"accelerometer");E(0)}};function C(a,b){var c,d=sjcl.random.w[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}function E(a){"undefined"!==typeof window&&window.performance&&"function"===typeof window.performance.now?sjcl.random.addEntropy(window.performance.now(),a,"loadtime"):sjcl.random.addEntropy((new Date).valueOf(),a,"loadtime")}function A(a){a.b=B(a).concat(B(a));a.A=new sjcl.cipher.aes(a.b)}
function B(a){for(var b=0;4>b&&!(a.f[b]=a.f[b]+1|0,a.f[b]);b++);return a.A.encrypt(a.f)}function D(a,b){return function(){b.apply(a,arguments)}}sjcl.random=new sjcl.prng(6);
a:try{var F,G,H,I;if(I="undefined"!==typeof module){var J;if(J=module.exports){var K;try{K=require("crypto")}catch(L){K=null}J=(G=K)&&G.randomBytes}I=J}if(I)F=G.randomBytes(128),F=new Uint32Array((new Uint8Array(F)).buffer),sjcl.random.addEntropy(F,1024,"crypto['randomBytes']");else if("undefined"!==typeof window&&"undefined"!==typeof Uint32Array){H=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(H);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(H);
else break a;sjcl.random.addEntropy(H,1024,"crypto['getRandomValues']")}}catch(M){"undefined"!==typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(M))}
sjcl.json={defaults:{v:1,iter:1E3,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},Y:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.e({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.e(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl.codec.base64.toBits(f.iv));(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&0x100!==f.ks||2>f.iv.length||4<
f.iv.length)&&q(new sjcl.exception.invalid("json encrypt: invalid parameters"));"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.publicKey&&(g=a.kem(),f.kemtag=g.tag,a=g.key.slice(0,f.ks/32));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));"string"===typeof c&&(c=sjcl.codec.utf8String.toBits(c));g=new sjcl.cipher[f.cipher](a);e.e(d,f);d.key=a;f.ct=sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},encrypt:function(a,
b,c,d){var e=sjcl.json,f=e.Y.apply(e,arguments);return e.encode(f)},X:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.e(e.e(e.e({},e.defaults),b),c,!0);var f,g;f=b.adata;"string"===typeof b.salt&&(b.salt=sjcl.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl.codec.base64.toBits(b.iv));(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||"string"===typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&0x100!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)&&q(new sjcl.exception.invalid("json decrypt: invalid parameters"));
"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,b),a=g.key.slice(0,b.ks/32),b.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.secretKey&&(a=a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0,b.ks/32));"string"===typeof f&&(f=sjcl.codec.utf8String.toBits(f));g=new sjcl.cipher[b.cipher](a);f=sjcl.mode[b.mode].decrypt(g,b.ct,b.iv,f,b.ts);e.e(d,b);d.key=a;return 1===c.raw?f:sjcl.codec.utf8String.fromBits(f)},decrypt:function(a,b,c,d){var e=sjcl.json;return e.X(a,e.decode(b),c,d)},encode:function(a){var b,
c="{",d="";for(b in a)if(a.hasOwnProperty(b))switch(b.match(/^[a-z0-9]+$/i)||q(new sjcl.exception.invalid("json encode: invalid property name")),c+=d+'"'+b+'":',d=",",typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+sjcl.codec.base64.fromBits(a[b],0)+'"';break;default:q(new sjcl.exception.bug("json encode: unsupported type"))}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");a.match(/^\{.*\}$/)||q(new sjcl.exception.invalid("json decode: this isn't json!"));
a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++)(d=a[c].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i))||q(new sjcl.exception.invalid("json decode: this isn't json!")),b[d[2]]=d[3]?parseInt(d[3],10):d[2].match(/^(ct|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4]);return b},e:function(a,b,c){a===t&&(a={});if(b===t)return a;for(var d in b)b.hasOwnProperty(d)&&(c&&(a[d]!==t&&a[d]!==b[d])&&q(new sjcl.exception.invalid("required parameter overridden")),
a[d]=b[d]);return a},ea:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},da:function(a,b){var c={},d;for(d=0;d<b.length;d++)a[b[d]]!==t&&(c[b[d]]=a[b[d]]);return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.ca={};
sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.ca,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=b.salt===t?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};

// Original ccm mode from sjcl hacked for checking header without checking message integrity


/** @fileOverview CCM mode implementation.
 *
 * Special thanks to Roy Nicholson for pointing out a bug in our
 * implementation.
 *
 * @author Emily Stark
 * @author Mike Hamburg
 * @author Dan Boneh
 */

/** @namespace CTR mode with CBC MAC. */
sjcl.mode.ccm_head = {
  /** The name of the mode.
   * @constant
   */
  name: "ccm_head",

  /** Decrypt in CCM mode.
   * @static
   * @param {Object} prf The pseudorandom function.  It must have a block size of 16 bytes.
   * @param {bitArray} ciphertext The ciphertext data.
   * @param {bitArray} iv The initialization value.
   * @param {bitArray} [[]] adata The authenticated data.
   * @param {Number} [64] tlen the desired tag length, in bits.
   * @return {bitArray} The decrypted data.
   */
  decrypt: function(prf, ciphertext, iv, adata, tlen) {
    tlen = tlen || 64;
    adata = adata || [];
    var L,
        w=sjcl.bitArray,
        ivl = w.bitLength(iv) / 8,
        ol = w.bitLength(ciphertext), 
        out = w.clamp(ciphertext, ol - tlen),
        tag = w.bitSlice(ciphertext, ol - tlen), tag2;
    

    ol = (ol - tlen) / 8;
        
    if (ivl < 7) {
      throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");
    }
    
    // compute the length of the length
    for (L=2; L<4 && ol >>> 8*L; L++) {}
    if (L < 15 - ivl) { L = 15-ivl; }
    iv = w.clamp(iv,8*(15-L));
    
    // decrypt
    // here we call sjcl.mode.ccm.p - name of function in compressed sjcl js. MUST TRACK THAT NAME!
    out = sjcl.mode.ccm.p(prf, out, iv, tag, tlen, L);    
   
    return out.data;
  }
};

/** @fileOverview Bit array codec implementations.
 *
 * @author Emily Stark
 * @author Mike Hamburg
 * @author Dan Boneh
 */

/** @namespace Arrays of bytes */
sjcl.codec.bytes = {
  /** Convert from a bitArray to an array of bytes. */
  fromBits: function (arr) {
    var out = [], bl = sjcl.bitArray.bitLength(arr), i, tmp;
    for (i=0; i<bl/8; i++) {
      if ((i&3) === 0) {
        tmp = arr[i/4];
      }
      out.push(tmp >>> 24);
      tmp <<= 8;
    }
    return out;
  },
  /** Convert from an array of bytes to a bitArray. */
  toBits: function (bytes) {
    var out = [], i, tmp=0;
    for (i=0; i<bytes.length; i++) {
      tmp = tmp << 8 | bytes[i];
      if ((i&3) === 3) {
        out.push(tmp);
        tmp = 0;
      }
    }
    if (i&3) {
      out.push(sjcl.bitArray.partial(8*(i&3), tmp));
    }
    return out;
  }
};

var Eph5=new(function(){var invalidColourSpaceError=new Error("Invalid colour space");var invalidBlockSizeError=new Error("Invalid block size");var cantAllocateMemoryError=new Error("Can't allocate memory");var tooBigImageError=new Error("Too big image");var Raw=(function(memory){var kernel={};if(arguments.length>=1){kernel.TOTAL_MEMORY=memory}var Module;if(!Module)Module=(typeof kernel!=="undefined"?kernel:null)||{};var moduleOverrides={};for(var key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}var ENVIRONMENT_IS_WEB=typeof window==="object";var ENVIRONMENT_IS_WORKER=typeof importScripts==="function";var ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof require==="function"&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER;var ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;if(ENVIRONMENT_IS_NODE){if(!Module["print"])Module["print"]=function print(x){process["stdout"].write(x+"\n")};if(!Module["printErr"])Module["printErr"]=function printErr(x){process["stderr"].write(x+"\n")};var nodeFS=require("fs");var nodePath=require("path");Module["read"]=function read(filename,binary){filename=nodePath["normalize"](filename);var ret=nodeFS["readFileSync"](filename);if(!ret&&filename!=nodePath["resolve"](filename)){filename=path.join(__dirname,"..","src",filename);ret=nodeFS["readFileSync"](filename)}if(ret&&!binary)ret=ret.toString();return ret};Module["readBinary"]=function readBinary(filename){var ret=Module["read"](filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}assert(ret.buffer);return ret};Module["load"]=function load(f){globalEval(read(f))};if(!Module["thisProgram"]){if(process["argv"].length>1){Module["thisProgram"]=process["argv"][1].replace(/\\/g,"/")}else{Module["thisProgram"]="unknown-program"}}Module["arguments"]=process["argv"].slice(2);if(typeof module!=="undefined"){module["exports"]=Module}process["on"]("uncaughtException",(function(ex){if(!(ex instanceof ExitStatus)){throw ex}}));Module["inspect"]=(function(){return"[Emscripten Module object]"})}else if(ENVIRONMENT_IS_SHELL){if(!Module["print"])Module["print"]=print;if(typeof printErr!="undefined")Module["printErr"]=printErr;if(typeof read!="undefined"){Module["read"]=read}else{Module["read"]=function read(){throw"no read() available (jsc?)"}}Module["readBinary"]=function readBinary(f){if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}var data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){Module["arguments"]=scriptArgs}else if(typeof arguments!="undefined"){Module["arguments"]=arguments}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){Module["read"]=function read(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(typeof arguments!="undefined"){Module["arguments"]=arguments}if(typeof console!=="undefined"){if(!Module["print"])Module["print"]=function print(x){console.log(x)};if(!Module["printErr"])Module["printErr"]=function printErr(x){console.log(x)}}else{var TRY_USE_DUMP=false;if(!Module["print"])Module["print"]=TRY_USE_DUMP&&typeof dump!=="undefined"?(function(x){dump(x)}):(function(x){})}if(ENVIRONMENT_IS_WORKER){Module["load"]=importScripts}if(typeof Module["setWindowTitle"]==="undefined"){Module["setWindowTitle"]=(function(title){document.title=title})}}else{throw"Unknown runtime environment. Where are we?"}function globalEval(x){throw"NO_DYNAMIC_EXECUTION was set, cannot eval"}if(!Module["load"]&&Module["read"]){Module["load"]=function load(f){globalEval(Module["read"](f))}}if(!Module["print"]){Module["print"]=(function(){})}if(!Module["printErr"]){Module["printErr"]=Module["print"]}if(!Module["arguments"]){Module["arguments"]=[]}if(!Module["thisProgram"]){Module["thisProgram"]="./this.program"}Module.print=Module["print"];Module.printErr=Module["printErr"];Module["preRun"]=[];Module["postRun"]=[];for(var key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}var Runtime={setTempRet0:(function(value){tempRet0=value}),getTempRet0:(function(){return tempRet0}),stackSave:(function(){return STACKTOP}),stackRestore:(function(stackTop){STACKTOP=stackTop}),getNativeTypeSize:(function(type){switch(type){case"i1":case"i8":return 1;case"i16":return 2;case"i32":return 4;case"i64":return 8;case"float":return 4;case"double":return 8;default:{if(type[type.length-1]==="*"){return Runtime.QUANTUM_SIZE}else if(type[0]==="i"){var bits=parseInt(type.substr(1));assert(bits%8===0);return bits/8}else{return 0}}}}),getNativeFieldSize:(function(type){return Math.max(Runtime.getNativeTypeSize(type),Runtime.QUANTUM_SIZE)}),STACK_ALIGN:16,prepVararg:(function(ptr,type){if(type==="double"||type==="i64"){if(ptr&7){assert((ptr&7)===4);ptr+=4}}else{assert((ptr&3)===0)}return ptr}),getAlignSize:(function(type,size,vararg){if(!vararg&&(type=="i64"||type=="double"))return 8;if(!type)return Math.min(size,8);return Math.min(size||(type?Runtime.getNativeFieldSize(type):0),Runtime.QUANTUM_SIZE)}),dynCall:(function(sig,ptr,args){if(args&&args.length){if(!args.splice)args=Array.prototype.slice.call(args);args.splice(0,0,ptr);return Module["dynCall_"+sig].apply(null,args)}else{return Module["dynCall_"+sig].call(null,ptr)}}),functionPointers:[],addFunction:(function(func){for(var i=0;i<Runtime.functionPointers.length;i++){if(!Runtime.functionPointers[i]){Runtime.functionPointers[i]=func;return 2*(1+i)}}throw"Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."}),removeFunction:(function(index){Runtime.functionPointers[(index-2)/2]=null}),warnOnce:(function(text){if(!Runtime.warnOnce.shown)Runtime.warnOnce.shown={};if(!Runtime.warnOnce.shown[text]){Runtime.warnOnce.shown[text]=1;Module.printErr(text)}}),funcWrappers:{},getFuncWrapper:(function(func,sig){assert(sig);if(!Runtime.funcWrappers[sig]){Runtime.funcWrappers[sig]={}}var sigCache=Runtime.funcWrappers[sig];if(!sigCache[func]){sigCache[func]=function dynCall_wrapper(){return Runtime.dynCall(sig,func,arguments)}}return sigCache[func]}),getCompilerSetting:(function(name){throw"You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"}),stackAlloc:(function(size){var ret=STACKTOP;STACKTOP=STACKTOP+size|0;STACKTOP=STACKTOP+15&-16;return ret}),staticAlloc:(function(size){var ret=STATICTOP;STATICTOP=STATICTOP+size|0;STATICTOP=STATICTOP+15&-16;return ret}),dynamicAlloc:(function(size){var ret=DYNAMICTOP;DYNAMICTOP=DYNAMICTOP+size|0;DYNAMICTOP=DYNAMICTOP+15&-16;if(DYNAMICTOP>=TOTAL_MEMORY){var success=enlargeMemory();if(!success){DYNAMICTOP=ret;return 0}}return ret}),alignMemory:(function(size,quantum){var ret=size=Math.ceil(size/(quantum?quantum:16))*(quantum?quantum:16);return ret}),makeBigInt:(function(low,high,unsigned){var ret=unsigned?+(low>>>0)+ +(high>>>0)*+4294967296:+(low>>>0)+ +(high|0)*+4294967296;return ret}),GLOBAL_BASE:8,QUANTUM_SIZE:4,__dummy__:0};Module["Runtime"]=Runtime;var __THREW__=0;var ABORT=false;var EXITSTATUS=0;var undef=0;var tempValue,tempInt,tempBigInt,tempInt2,tempBigInt2,tempPair,tempBigIntI,tempBigIntR,tempBigIntS,tempBigIntP,tempBigIntD,tempDouble,tempFloat;var tempI64,tempI64b;var tempRet0,tempRet1,tempRet2,tempRet3,tempRet4,tempRet5,tempRet6,tempRet7,tempRet8,tempRet9;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}var globalScope=this;function getCFunc(ident){var func=Module["_"+ident];if(!func){abort("NO_DYNAMIC_EXECUTION was set, cannot eval - ccall/cwrap are not functional")}assert(func,"Cannot call unknown function "+ident+" (perhaps LLVM optimizations or closure removed it?)");return func}var cwrap,ccall;((function(){var JSfuncs={"stackSave":(function(){Runtime.stackSave()}),"stackRestore":(function(){Runtime.stackRestore()}),"arrayToC":(function(arr){var ret=Runtime.stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}),"stringToC":(function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){ret=Runtime.stackAlloc((str.length<<2)+1);writeStringToMemory(str,ret)}return ret})};var toC={"string":JSfuncs["stringToC"],"array":JSfuncs["arrayToC"]};ccall=function ccallFunc(ident,returnType,argTypes,args,opts){var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=Runtime.stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);if(returnType==="string")ret=Pointer_stringify(ret);if(stack!==0){if(opts&&opts.async){EmterpreterAsync.asyncFinalizers.push((function(){Runtime.stackRestore(stack)}));return}Runtime.stackRestore(stack)}return ret};cwrap=function cwrap(ident,returnType,argTypes){return(function(){return ccall(ident,returnType,argTypes,arguments)})}}))();Module["ccall"]=ccall;Module["cwrap"]=cwrap;function setValue(ptr,value,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":HEAP8[ptr>>0]=value;break;case"i8":HEAP8[ptr>>0]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":tempI64=[value>>>0,(tempDouble=value,+Math_abs(tempDouble)>=+1?tempDouble>+0?(Math_min(+Math_floor(tempDouble/+4294967296),+4294967295)|0)>>>0:~~+Math_ceil((tempDouble- +(~~tempDouble>>>0))/+4294967296)>>>0:0)],HEAP32[ptr>>2]=tempI64[0],HEAP32[ptr+4>>2]=tempI64[1];break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;default:abort("invalid type for setValue: "+type)}}Module["setValue"]=setValue;function getValue(ptr,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":return HEAP8[ptr>>0];case"i8":return HEAP8[ptr>>0];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":return HEAP32[ptr>>2];case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];default:abort("invalid type for setValue: "+type)}return null}Module["getValue"]=getValue;var ALLOC_NORMAL=0;var ALLOC_STACK=1;var ALLOC_STATIC=2;var ALLOC_DYNAMIC=3;var ALLOC_NONE=4;Module["ALLOC_NORMAL"]=ALLOC_NORMAL;Module["ALLOC_STACK"]=ALLOC_STACK;Module["ALLOC_STATIC"]=ALLOC_STATIC;Module["ALLOC_DYNAMIC"]=ALLOC_DYNAMIC;Module["ALLOC_NONE"]=ALLOC_NONE;function allocate(slab,types,allocator,ptr){var zeroinit,size;if(typeof slab==="number"){zeroinit=true;size=slab}else{zeroinit=false;size=slab.length}var singleType=typeof types==="string"?types:null;var ret;if(allocator==ALLOC_NONE){ret=ptr}else{ret=[_malloc,Runtime.stackAlloc,Runtime.staticAlloc,Runtime.dynamicAlloc][allocator===undefined?ALLOC_STATIC:allocator](Math.max(size,singleType?1:types.length))}if(zeroinit){var ptr=ret,stop;assert((ret&3)==0);stop=ret+(size&~3);for(;ptr<stop;ptr+=4){HEAP32[ptr>>2]=0}stop=ret+size;while(ptr<stop){HEAP8[ptr++>>0]=0}return ret}if(singleType==="i8"){if(slab.subarray||slab.slice){HEAPU8.set(slab,ret)}else{HEAPU8.set(new Uint8Array(slab),ret)}return ret}var i=0,type,typeSize,previousType;while(i<size){var curr=slab[i];if(typeof curr==="function"){curr=Runtime.getFunctionIndex(curr)}type=singleType||types[i];if(type===0){i++;continue}if(type=="i64")type="i32";setValue(ret+i,curr,type);if(previousType!==type){typeSize=Runtime.getNativeTypeSize(type);previousType=type}i+=typeSize}return ret}Module["allocate"]=allocate;function getMemory(size){if(!staticSealed)return Runtime.staticAlloc(size);if(typeof _sbrk!=="undefined"&&!_sbrk.called||!runtimeInitialized)return Runtime.dynamicAlloc(size);return _malloc(size)}Module["getMemory"]=getMemory;function Pointer_stringify(ptr,length){if(length===0||!ptr)return"";var hasUtf=0;var t;var i=0;while(1){t=HEAPU8[ptr+i>>0];hasUtf|=t;if(t==0&&!length)break;i++;if(length&&i==length)break}if(!length)length=i;var ret="";if(hasUtf<128){var MAX_CHUNK=1024;var curr;while(length>0){curr=String.fromCharCode.apply(String,HEAPU8.subarray(ptr,ptr+Math.min(length,MAX_CHUNK)));ret=ret?ret+curr:curr;ptr+=MAX_CHUNK;length-=MAX_CHUNK}return ret}return Module["UTF8ToString"](ptr)}Module["Pointer_stringify"]=Pointer_stringify;function AsciiToString(ptr){var str="";while(1){var ch=HEAP8[ptr++>>0];if(!ch)return str;str+=String.fromCharCode(ch)}}Module["AsciiToString"]=AsciiToString;function stringToAscii(str,outPtr){return writeAsciiToMemory(str,outPtr,false)}Module["stringToAscii"]=stringToAscii;function UTF8ArrayToString(u8Array,idx){var u0,u1,u2,u3,u4,u5;var str="";while(1){u0=u8Array[idx++];if(!u0)return str;if(!(u0&128)){str+=String.fromCharCode(u0);continue}u1=u8Array[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}u2=u8Array[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u3=u8Array[idx++]&63;if((u0&248)==240){u0=(u0&7)<<18|u1<<12|u2<<6|u3}else{u4=u8Array[idx++]&63;if((u0&252)==248){u0=(u0&3)<<24|u1<<18|u2<<12|u3<<6|u4}else{u5=u8Array[idx++]&63;u0=(u0&1)<<30|u1<<24|u2<<18|u3<<12|u4<<6|u5}}}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}Module["UTF8ArrayToString"]=UTF8ArrayToString;function UTF8ToString(ptr){return UTF8ArrayToString(HEAPU8,ptr)}Module["UTF8ToString"]=UTF8ToString;function stringToUTF8Array(str,outU8Array,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127){if(outIdx>=endIdx)break;outU8Array[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;outU8Array[outIdx++]=192|u>>6;outU8Array[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;outU8Array[outIdx++]=224|u>>12;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=2097151){if(outIdx+3>=endIdx)break;outU8Array[outIdx++]=240|u>>18;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=67108863){if(outIdx+4>=endIdx)break;outU8Array[outIdx++]=248|u>>24;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else{if(outIdx+5>=endIdx)break;outU8Array[outIdx++]=252|u>>30;outU8Array[outIdx++]=128|u>>24&63;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}}outU8Array[outIdx]=0;return outIdx-startIdx}Module["stringToUTF8Array"]=stringToUTF8Array;function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}Module["stringToUTF8"]=stringToUTF8;function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127){++len}else if(u<=2047){len+=2}else if(u<=65535){len+=3}else if(u<=2097151){len+=4}else if(u<=67108863){len+=5}else{len+=6}}return len}Module["lengthBytesUTF8"]=lengthBytesUTF8;function UTF16ToString(ptr){var i=0;var str="";while(1){var codeUnit=HEAP16[ptr+i*2>>1];if(codeUnit==0)return str;++i;str+=String.fromCharCode(codeUnit)}}Module["UTF16ToString"]=UTF16ToString;function stringToUTF16(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;var startPtr=outPtr;var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;for(var i=0;i<numCharsToWrite;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr>>1]=codeUnit;outPtr+=2}HEAP16[outPtr>>1]=0;return outPtr-startPtr}Module["stringToUTF16"]=stringToUTF16;function lengthBytesUTF16(str){return str.length*2}Module["lengthBytesUTF16"]=lengthBytesUTF16;function UTF32ToString(ptr){var i=0;var str="";while(1){var utf32=HEAP32[ptr+i*4>>2];if(utf32==0)return str;++i;if(utf32>=65536){var ch=utf32-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}else{str+=String.fromCharCode(utf32)}}}Module["UTF32ToString"]=UTF32ToString;function stringToUTF32(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343){var trailSurrogate=str.charCodeAt(++i);codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023}HEAP32[outPtr>>2]=codeUnit;outPtr+=4;if(outPtr+4>endPtr)break}HEAP32[outPtr>>2]=0;return outPtr-startPtr}Module["stringToUTF32"]=stringToUTF32;function lengthBytesUTF32(str){var len=0;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343)++i;len+=4}return len}Module["lengthBytesUTF32"]=lengthBytesUTF32;function demangle(func){var hasLibcxxabi=!!Module["___cxa_demangle"];if(hasLibcxxabi){try{var buf=_malloc(func.length);writeStringToMemory(func.substr(1),buf);var status=_malloc(4);var ret=Module["___cxa_demangle"](buf,0,0,status);if(getValue(status,"i32")===0&&ret){return Pointer_stringify(ret)}}catch(e){}finally{if(buf)_free(buf);if(status)_free(status);if(ret)_free(ret)}}var i=3;var basicTypes={"v":"void","b":"bool","c":"char","s":"short","i":"int","l":"long","f":"float","d":"double","w":"wchar_t","a":"signed char","h":"unsigned char","t":"unsigned short","j":"unsigned int","m":"unsigned long","x":"long long","y":"unsigned long long","z":"..."};var subs=[];var first=true;function dump(x){if(x)Module.print(x);Module.print(func);var pre="";for(var a=0;a<i;a++)pre+=" ";Module.print(pre+"^")}function parseNested(){i++;if(func[i]==="K")i++;var parts=[];while(func[i]!=="E"){if(func[i]==="S"){i++;var next=func.indexOf("_",i);var num=func.substring(i,next)||0;parts.push(subs[num]||"?");i=next+1;continue}if(func[i]==="C"){parts.push(parts[parts.length-1]);i+=2;continue}var size=parseInt(func.substr(i));var pre=size.toString().length;if(!size||!pre){i--;break}var curr=func.substr(i+pre,size);parts.push(curr);subs.push(curr);i+=pre+size}i++;return parts}function parse(rawList,limit,allowVoid){limit=limit||Infinity;var ret="",list=[];function flushList(){return"("+list.join(", ")+")"}var name;if(func[i]==="N"){name=parseNested().join("::");limit--;if(limit===0)return rawList?[name]:name}else{if(func[i]==="K"||first&&func[i]==="L")i++;var size=parseInt(func.substr(i));if(size){var pre=size.toString().length;name=func.substr(i+pre,size);i+=pre+size}}first=false;if(func[i]==="I"){i++;var iList=parse(true);var iRet=parse(true,1,true);ret+=iRet[0]+" "+name+"<"+iList.join(", ")+">"}else{ret=name}paramLoop:while(i<func.length&&limit-->0){var c=func[i++];if(c in basicTypes){list.push(basicTypes[c])}else{switch(c){case"P":list.push(parse(true,1,true)[0]+"*");break;case"R":list.push(parse(true,1,true)[0]+"&");break;case"L":{i++;var end=func.indexOf("E",i);var size=end-i;list.push(func.substr(i,size));i+=size+2;break};case"A":{var size=parseInt(func.substr(i));i+=size.toString().length;if(func[i]!=="_")throw"?";i++;list.push(parse(true,1,true)[0]+" ["+size+"]");break};case"E":break paramLoop;default:ret+="?"+c;break paramLoop}}}if(!allowVoid&&list.length===1&&list[0]==="void")list=[];if(rawList){if(ret){list.push(ret+"?")}return list}else{return ret+flushList()}}var parsed=func;try{if(func=="Object._main"||func=="_main"){return"main()"}if(typeof func==="number")func=Pointer_stringify(func);if(func[0]!=="_")return func;if(func[1]!=="_")return func;if(func[2]!=="Z")return func;switch(func[3]){case"n":return"operator new()";case"d":return"operator delete()"}parsed=parse()}catch(e){parsed+="?"}if(parsed.indexOf("?")>=0&&!hasLibcxxabi){Runtime.warnOnce("warning: a problem occurred in builtin C++ name demangling; build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling")}return parsed}function demangleAll(text){return text.replace(/__Z[\w\d_]+/g,(function(x){var y=demangle(x);return x===y?x:x+" ["+y+"]"}))}function jsStackTrace(){var err=new Error;if(!err.stack){try{throw new Error(0)}catch(e){err=e}if(!err.stack){return"(no stack trace available)"}}return err.stack.toString()}function stackTrace(){return demangleAll(jsStackTrace())}Module["stackTrace"]=stackTrace;var PAGE_SIZE=4096;function alignMemoryPage(x){if(x%4096>0){x+=4096-x%4096}return x}var HEAP;var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;var STATIC_BASE=0,STATICTOP=0,staticSealed=false;var STACK_BASE=0,STACKTOP=0,STACK_MAX=0;var DYNAMIC_BASE=0,DYNAMICTOP=0;function abortOnCannotGrowMemory(){abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+TOTAL_MEMORY+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which adjusts the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")}function enlargeMemory(){abortOnCannotGrowMemory()}var TOTAL_STACK=Module["TOTAL_STACK"]||5242880;var TOTAL_MEMORY=Module["TOTAL_MEMORY"]||16777216;var totalMemory=64*1024;while(totalMemory<TOTAL_MEMORY||totalMemory<2*TOTAL_STACK){if(totalMemory<16*1024*1024){totalMemory*=2}else{totalMemory+=16*1024*1024}}if(totalMemory!==TOTAL_MEMORY){TOTAL_MEMORY=totalMemory}assert(typeof Int32Array!=="undefined"&&typeof Float64Array!=="undefined"&&!!(new Int32Array(1))["subarray"]&&!!(new Int32Array(1))["set"],"JS engine does not provide full typed array support");var buffer;buffer=new ArrayBuffer(TOTAL_MEMORY);HEAP8=new Int8Array(buffer);HEAP16=new Int16Array(buffer);HEAP32=new Int32Array(buffer);HEAPU8=new Uint8Array(buffer);HEAPU16=new Uint16Array(buffer);HEAPU32=new Uint32Array(buffer);HEAPF32=new Float32Array(buffer);HEAPF64=new Float64Array(buffer);HEAP32[0]=255;assert(HEAPU8[0]===255&&HEAPU8[3]===0,"Typed arrays 2 must be run on a little-endian system");Module["HEAP"]=HEAP;Module["buffer"]=buffer;Module["HEAP8"]=HEAP8;Module["HEAP16"]=HEAP16;Module["HEAP32"]=HEAP32;Module["HEAPU8"]=HEAPU8;Module["HEAPU16"]=HEAPU16;Module["HEAPU32"]=HEAPU32;Module["HEAPF32"]=HEAPF32;Module["HEAPF64"]=HEAPF64;function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback();continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){Runtime.dynCall("v",func)}else{Runtime.dynCall("vi",func,[callback.arg])}}else{func(callback.arg===undefined?null:callback.arg)}}}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATEXIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeExited=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function ensureInitRuntime(){if(runtimeInitialized)return;runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function exitRuntime(){callRuntimeCallbacks(__ATEXIT__);runtimeExited=true}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}Module["addOnPreRun"]=addOnPreRun;function addOnInit(cb){__ATINIT__.unshift(cb)}Module["addOnInit"]=addOnInit;function addOnPreMain(cb){__ATMAIN__.unshift(cb)}Module["addOnPreMain"]=addOnPreMain;function addOnExit(cb){__ATEXIT__.unshift(cb)}Module["addOnExit"]=addOnExit;function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}Module["addOnPostRun"]=addOnPostRun;function intArrayFromString(stringy,dontAddNull,length){var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array}Module["intArrayFromString"]=intArrayFromString;function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){chr&=255}ret.push(String.fromCharCode(chr))}return ret.join("")}Module["intArrayToString"]=intArrayToString;function writeStringToMemory(string,buffer,dontAddNull){var array=intArrayFromString(string,dontAddNull);var i=0;while(i<array.length){var chr=array[i];HEAP8[buffer+i>>0]=chr;i=i+1}}Module["writeStringToMemory"]=writeStringToMemory;function writeArrayToMemory(array,buffer){for(var i=0;i<array.length;i++){HEAP8[buffer++>>0]=array[i]}}Module["writeArrayToMemory"]=writeArrayToMemory;function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;++i){HEAP8[buffer++>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer>>0]=0}Module["writeAsciiToMemory"]=writeAsciiToMemory;function unSign(value,bits,ignore){if(value>=0){return value}return bits<=32?2*Math.abs(1<<bits-1)+value:Math.pow(2,bits)+value}function reSign(value,bits,ignore){if(value<=0){return value}var half=bits<=32?Math.abs(1<<bits-1):Math.pow(2,bits-1);if(value>=half&&(bits<=32||value>half)){value=-2*half+value}return value}if(!Math["imul"]||Math["imul"](4294967295,5)!==-5)Math["imul"]=function imul(a,b){var ah=a>>>16;var al=a&65535;var bh=b>>>16;var bl=b&65535;return al*bl+(ah*bl+al*bh<<16)|0};Math.imul=Math["imul"];if(!Math["clz32"])Math["clz32"]=(function(x){x=x>>>0;for(var i=0;i<32;i++){if(x&1<<31-i)return i}return 32});Math.clz32=Math["clz32"];var Math_abs=Math.abs;var Math_cos=Math.cos;var Math_sin=Math.sin;var Math_tan=Math.tan;var Math_acos=Math.acos;var Math_asin=Math.asin;var Math_atan=Math.atan;var Math_atan2=Math.atan2;var Math_exp=Math.exp;var Math_log=Math.log;var Math_sqrt=Math.sqrt;var Math_ceil=Math.ceil;var Math_floor=Math.floor;var Math_pow=Math.pow;var Math_imul=Math.imul;var Math_fround=Math.fround;var Math_min=Math.min;var Math_clz32=Math.clz32;var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function getUniqueRunDependency(id){return id}function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}Module["addRunDependency"]=addRunDependency;function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["removeRunDependency"]=removeRunDependency;Module["preloadedImages"]={};Module["preloadedAudios"]={};var memoryInitializer=null;var ASM_CONSTS=[];STATIC_BASE=8;STATICTOP=STATIC_BASE+29712;__ATINIT__.push();memoryInitializer='\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00e8?UUUUUU\u00e5?\x00\x00\x00\x00\x00\x00\u00e6?F]t\u00d1E\u00e7?\x00\x00\x00\x00\x00\x00\u00e9?\u00e1z\u00aeG\u00e1\u00ea?%I\u0092$I\u0092\u00ec?\u00de\u00dd\u00dd\u00dd\u00dd\u00dd\u00ed?\u00e3+\u00be\u00e2+\u00be\u00ee?t`GI\u00ef?\u008e\u00a2\u009f\u00c4\u009a\u00ef?\u00a9}\u00de\u00f7\u00ce\u00c8\u00ef?\u00b9#\u00ee\u0088;\u00e2\u00ef?\u00b2\u00ee\u00f0\u00ef?oQ\u00c5\u0084\u00f7\u00ef?\u0096\u009aU\u0081\u00fb\u00ef?Q*\u00f1^\u00a0\u00fd\u00ef?\u00ed\u00d8=\u00c0\u00fe\u00ef?\u009b\u00b07X\u00ff\u00ef?\u00a3\u00f4\u00f9\u00a8\u00ff\u00ef?b\u00fe\u0089\x00\u00d2\u00ff\u00ef?\u00c5%\x00\u00e8\u00ff\u00ef?\u00f8\'\n\u0080\u00f3\u00ff\u00ef?\u00ff\u00bd\u0080\u00f9\u00ff\u00ef?\x00\u00bd\x00\u00a0\u00fc\u00ff\u00ef?\u00c02\x00@\u00fe\u00ff\u00ef?\u0098\r\x00\u00ff\u00ff\u00ef?\u00a2\x00\u0088\u00ff\u00ff\u00ef?\u00f8\x00\x00\u00c2\u00ff\u00ff\u00ef?B\x00\x00\u00e0\u00ff\u00ff\u00ef?\x00\u0080\u00ef\u00ff\u00ff\u00ef?\x00\u0080\u00f7\u00ff\u00ff\u00ef?\x00\u00a0\u00fb\u00ff\u00ff\u00ef?\x00\x00\u00c0\u00fd\u00ff\u00ff\u00ef?\x00\x00\u00d8\u00fe\u00ff\u00ff\u00ef?\x00\x00h\u00ff\u00ff\u00ff\u00ef?\x00\x00\u00b2\u00ff\u00ff\u00ff\u00ef?\x00\x00\u00d8\u00ff\u00ff\u00ff\u00ef?\x00\u0080\u00eb\u00ff\u00ff\u00ff\u00ef?\x00\u0080\u00f5\u00ff\u00ff\u00ff\u00ef?\x00\u00a0\u00fa\u00ff\u00ff\u00ff\u00ef?\x00@\u00fd\u00ff\u00ff\u00ff\u00ef?\x00\u0098\u00fe\u00ff\u00ff\u00ff\u00ef?\x00H\u00ff\u00ff\u00ff\u00ff\u00ef?\x00\u00a2\u00ff\u00ff\u00ff\u00ff\u00ef?\x00\u00d0\u00ff\u00ff\u00ff\u00ff\u00ef?\u0080\u00e7\u00ff\u00ff\u00ff\u00ff\u00ef?\u0080\u00f3\u00ff\u00ff\u00ff\u00ff\u00ef?\u00a0\u00f9\u00ff\u00ff\u00ff\u00ff\u00ef?\u00e0\u00fc\u00ff\u00ff\u00ff\u00ff\u00ef?p\u00fe\u00ff\u00ff\u00ff\u00ff\u00ef?`\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?\u00a8\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?\u00a0\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?\u00e0\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?\x00\x00\x00\x00\x00\x00\u00ec?n\u00db\u00b6m\u00db\u00b6\u00e9?.\u00d8\u0082-\u00d8\u0082\u00e9?\u00fc{\u00eb\bJ\u00b3\u00e9?\u00e1V\u00f9;\u00e4\u00e9?\u00c9%b\u008d*\u00ea?R\u00fe\u00a1ok\u0080\u00ea?\u0093\u00e4U\u00f8\u0085\u00de\u00ea?\u00b7\u00ae\u00f8\u0095(D\u00eb?\u00b8\u00a4!8\u00d4\u00aa\u00eb?+\u0087\u00d9\u00ec?\u00f4\u00b0\u009an\u009em\u00ec?\u00c7y\u00bfR\u00c5\u00ec?eJ\u00ffh\u00be\u00ed?\u0098{g\u00a1\u00c4\\\u00ed?\u0092\u0094p\u00cf\u009d\u00ed?\u00f3\u0085\u00d3\u00e4\u00ab\u00d8\u00ed?E\u00dfp\u00ac\f\u00ee?\u00ebH.\u0084>\u00ee?g?\u008a\u00b5\u0085j\u00ee?\u00c8 \u00a8p\u0092\u00ee?\\\u00f2\n\u0097\u0098\u00b6\u00ee?\u0091\u00c2\u00e3I\u00d7\u00ee?\u00ad\u00fd*\u00cc\u00f4\u00ee?\u00a4\u0083@c\u00ef?+i\u00a2O\'\u00ef?\u00f2N\u008e\u00ce<\u00ef?\u00fb\u00fd\u00de\u00edP\u00ef?\u00f7\u00cf+ha\u00ef?O\u0085\u00be\u00ff\u00ebp\u00ef?7\u00ac)J\u00d4~\u00ef?5\u00c5\u00f1L\u008b\u00ef?{\u00a2KFz\u0096\u00ef?\u0080\u00c8i\u0082\u00a0\u00ef?\u0093J\u00d02\u0084\u00a9\u00ef?T;\u00f4\u009c\u00b1\u00ef?\u00d5D\u00e4n\u00e3\u00b8\u00ef?\u00d4Q\u00c1\u00d3p\u00bf\u00ef?\u00de\u00d7\u00adOX\u00c5\u00ef?\u00c0\u008bw\u00aa\u00ab\u00ca\u00ef?/\u00c2F\u00a6z\u00cf\u00ef?W\'\u008b9\u00d3\u00d3\u00ef?\u0088\u00c9\u00c3\u00c1\u00d7\u00ef?\u00da7=Q\u00db\u00ef?\u00e97Ua\u008b\u00de\u00ef?\u00ae\u00e0\u00b6\u00d4x\u00e1\u00ef?\u00c0tF!\u00e4\u00ef?3<\u0092\u008d\u008b\u00e6\u00ef?4\u00ce\u00c2\u00bd\u00e8\u00ef?C?W\u00bd\u00ea\u00ef?(\u008f\u00ec\u00ef?+\u00a2\u00fd\u008f7\u00ee\u00ef?\tWv\u00ba\u00ef\u00ef?\u00e8.[\u00f1\u00ef?k\u0097\u008be]\u00f2\u00ef?Gj\u00c2j\u0083\u00f3\u00ef?~\u008b\u00bb\u00f8\u008f\u00f4\u00ef?t\u00e2x]\u0085\u00f5\u00ef?\u00bd\u00ef\u00ef\u00ade\u00f6\u00ef?\u0092\u00cc2\u00f7\u00ef?\u00db\u00f6\'l\u00ee\u00f7\u00ef?\u00b2ex\u009a\u00f8\u00ef?\u0083:7\u00f9\u00ef?\u00db\u0080\u00ac\u00c7\u00f9\u00ef?\u00bc\u00f8\u0089\u00cfJ\u00fa\u00ef?\u0082\u00cfw\u00c3\u00fa\u00ef?\u008e\u00eb2\u00fb\u00ef?\u00df+^L\u0097\u00fb\u00ef?r\u00cc\u00d0!\u00f4\u00fb\u00ef?U\u00e8\u00f2:I\u00fc\u00ef?\u00c3z*@\u0097\u00fc\u00ef?3i\u00cb\u00de\u00fc\u00ef?\u00bd\u00ce\u00eag \u00fd\u00ef?|\u00df\u00aa\u0096\\\u00fd\u00ef?\u00a3\'D\u00cc\u0093\u00fd\u00ef?g\u008es\u00c6\u00fd\u00ef?W\u00e72\u00ee\u00f4\u00fd\u00ef?\u00c8\u00f1}\u0095\u00fe\u00ef?\u00a5{\u00bbF\u00fe\u00ef?]>\u00c8\u00a9j\u00fe\u00ef?\u00ad\u00c7\u00e3\u00a5\u008b\u00fe\u00ef?\u00a8G\b\u00ee\u00a9\u00fe\u00ef? i\u0086\u00bb\u00c5\u00fe\u00ef?;w\u00dbB\u00df\u00fe\u00ef?\u00b4\u00f6\u00fe\u00ef?M\u00efT;\f\u00ff\u00ef?n\u00dd\u00e3\x00 \u00ff\u00ef?\u009b\u00bf\u00c7)2\u00ff\u00ef?\u0088b\u00ea\u00d7B\u00ff\u00ef?\u00eccc*R\u00ff\u00ef??i\u00b5=`\u00ff\u00ef?\u00a7\u00f7,m\u00ff\u00ef?tP\ry\u00ff\u00ef?\u00b1\u00bd\u0094\u00f7\u0083\u00ff\u00ef?\u00f2\u00c5\u00ff\u008d\u00ff\u00ef?v{6\u0097\u00ff\u00ef?\u00b3k\u00e3\u00ad\u009f\u00ff\u00ef?\u00bbL\u00efu\u00a7\u00ff\u00ef?\b\u00cc\u0090\u009c\u00ae\u00ff\u00ef?)\u00dd\u00eb.\u00b5\u00ff\u00ef?\u00be\u00989\u00bb\u00ff\u00ef?\u00b05\u00c6\u00c0\u00ff\u00ef?\u00d7\u00dc\u00e0\u00c5\u00ff\u00ef?\u00e4\u00e4\u0083\u0090\u00ca\u00ff\u00ef?na\u00dd\u00df\u00ce\u00ff\u00ef?\u00b81\b\u00d6\u00d2\u00ff\u00ef?4\u00cd?z\u00d6\u00ff\u00ef?\u00b6\u00c1(\u00d3\u00d9\u00ff\u00ef?^\u00dd\u00e6\u00dc\u00ff\u00ef?\u00f7\u00b3\u00f7\u00ba\u00df\u00ff\u00ef?\u00c3\u009eT\u00e2\u00ff\u00ef?kE\u008d\u00b8\u00e4\u00ff\u00ef?\u00d6\u00d5\u00eb\u00e6\u00ff\u00ef?*\u00b5H\u00f0\u00e8\u00ff\u00ef?\u009a+\u00bf\u00cb\u00ea\u00ff\u00ef?\nN\u00de\u0080\u00ec\u00ff\u00ef?2\u00bf\u00ee\u00ff\u00ef?k\u00a8:\u0084\u00ef\u00ff\u00ef?)u\u00ee\u00d7\u00f0\u00ff\u00ef?+B\u00f2\u00ff\u00ef?\u0086Nk/\u00f3\u00ff\u00ef?\u00f4\u00f6q7\u00f4\u00ff\u00ef?F\u00f13*\u00f5\u00ff\u00ef?\u00efnh\t\u00f6\u00ff\u00ef?\u00b8$\u00a3\u00d6\u00f6\u00ff\u00ef?a\'W\u0093\u00f7\u00ff\u00ef?\u008e\u00d9@\u00f8\u00ff\u00ef?\u00fe\u00e1c\u00e0\u00f8\u00ff\u00ef?0[s\u00f9\u00ff\u00ef?z\u00ee\u00f9\u00f9\u00f9\u00ff\u00ef?\u008e,v\u00fa\u00ff\u00ef??\u00fc\u00e8\u00fa\u00ff\u00ef?\u00a06\u00eeP\u00fb\u00ff\u00ef?]\u00b1\u00fb\u00ff\u00ef?>\u00a0\t\n\u00fc\u00ff\u00ef?\u0097\u00bc\u0093[\u00fc\u00ff\u00ef?5|\u008e\u00a6\u00fc\u00ff\u00ef?\u00fd\u0081\u00eb\u00fc\u00ff\u00ef?R\u00d0\u00e7*\u00fd\u00ff\u00ef?O\u00fa4e\u00fd\u00ff\u00ef?\u00a1\u00a9\u00d1\u009a\u00fd\u00ff\u00ef?\u0087v\u00cc\u00fd\u00ff\u00ef?\u00db:t\u00f9\u00fd\u00ff\u00ef?\u00da\u00a0$#\u00fe\u00ff\u00ef?\u008a\u00c1zI\u00fe\u00ff\u00ef?\u00ba\u00ad\u00bbl\u00fe\u00ff\u00ef?\u0085\u00df&\u008d\u00fe\u00ff\u00ef?5\u00bc\u00f6\u00aa\u00fe\u00ff\u00ef?7\u00ef`\u00c6\u00fe\u00ff\u00ef?\u00a0\u00d6\u0096\u00df\u00fe\u00ff\u00ef?.\u00d7\u00c5\u00f6\u00fe\u00ff\u00ef?3\u00a9\f\u00ff\u00ff\u00ef?\u00b0\u00b2\u00ff\u00ff\u00ef?\u00e73\u00ba1\u00ff\u00ff\u00ef?H\u00abNB\u00ff\u00ff\u00ef??\u00e8\u008dQ\u00ff\u00ff\u00ef?\b^\u0093_\u00ff\u00ff\u00ef?\tGxl\u00ff\u00ff\u00ef?^\u00d6Sx\u00ff\u00ff\u00ef?\u00a2b;\u0083\u00ff\u00ff\u00ef?\u00c8\u0089B\u008d\u00ff\u00ff\u00ef?\u00e3V{\u0096\u00ff\u00ff\u00ef?\u009e`\u00f6\u009e\u00ff\u00ff\u00ef?G\u00e7\u00c2\u00a6\u00ff\u00ff\u00ef?8\u00f5\u00ee\u00ad\u00ff\u00ff\u00ef?>n\u0087\u00b4\u00ff\u00ff\u00ef?\u00c30\u0098\u00ba\u00ff\u00ff\u00ef?\u0093&,\u00c0\u00ff\u00ff\u00ef?\u0095VM\u00c5\u00ff\u00ff\u00ef?\u00fa\u00ca\u00ff\u00ff\u00ef?\u00ed\u008e[\u00ce\u00ff\u00ff\u00ef?\u00d1\u00e1X\u00d2\u00ff\u00ff\u00ef?y\u00d6\u00ff\u00ff\u00ef?\u00d5\u00ddc\u00d9\u00ff\u00ff\u00ef?D3~\u00dc\u00ff\u00ff\u00ef?\u00a8\u00b0X\u00df\u00ff\u00ff\u00ef?wy\u00f8\u00e1\u00ff\u00ff\u00ef?\u00a1Db\u00e4\u00ff\u00ff\u00ef?i\u009a\u00e6\u00ff\u00ff\u00ef?\u00e5\u00a4\u00e8\u00ff\u00ff\u00ef?fc\u0085\u00ea\u00ff\u00ff\u00ef?AD?\u00ec\u00ff\u00ff\u00ef?n\u00a2\u00d5\u00ed\u00ff\u00ff\u00ef?\u0085XK\u00ef\u00ff\u00ff\u00ef?\u00c2\u00a3\u00f0\u00ff\u00ff\u00ef?\u00f7\u00df\u00f1\u00ff\u00ff\u00ef?\u0098\u00bc\u00f3\u00ff\u00ff\u00ef?\f\n\r\u00f4\u00ff\u00ff\u00ef?]\u00db\u00f5\u00ff\u00ff\u00ef?V\u00eb\u00e4\u00f5\u00ff\u00ff\u00ef?{\u00d1\u00b4\u00f6\u00ff\u00ff\u00ef?;t\u00f7\u00ff\u00ff\u00ef?L\u00d5#\u00f8\u00ff\u00ff\u00ef?^\u0088\u00c5\u00f8\u00ff\u00ff\u00ef?<Z\u00f9\u00ff\u00ff\u00ef?4\u00fc\u00e2\u00f9\u00ff\u00ff\u00ef?x\u00bf`\u00fa\u00ff\u00ff\u00ef?\u00c0g\u00d4\u00fa\u00ff\u00ff\u00ef?x\u00c4>\u00fb\u00ff\u00ff\u00ef?m\u0095\u00a0\u00fb\u00ff\u00ff\u00ef?G\u0089\u00fa\u00fb\u00ff\u00ff\u00ef?~CM\u00fc\u00ff\u00ff\u00ef?\u0089W\u0099\u00fc\u00ff\u00ff\u00ef?N\u00df\u00fc\u00ff\u00ff\u00ef?\u009a\u00a5\u00fd\u00ff\u00ff\u00ef?\u00bf\u00d1Z\u00fd\u00ff\u00ff\u00ef?\u00bb<\u0091\u00fd\u00ff\u00ff\u00ef?LH\u00c3\u00fd\u00ff\u00ff\u00ef?\u0080M\u00f1\u00fd\u00ff\u00ff\u00ef?)\u00a1\u00fe\u00ff\u00ff\u00ef?\u00ba\u008cB\u00fe\u00ff\u00ff\u00ef?KXf\u00fe\u00ff\u00ff\u00ef?yC\u0087\u00fe\u00ff\u00ff\u00ef?\u008a\u00a5\u00fe\u00ff\u00ff\u00ef?\u00c6`\u00c1\u00fe\u00ff\u00ff\u00ef?\u00f4\u00fb\u00da\u00fe\u00ff\u00ff\u00ef?"\u0087\u00f2\u00fe\u00ff\u00ff\u00ef?\u00d8.\b\u00ff\u00ff\u00ff\u00ef?|\u00ff\u00ff\u00ff\u00ef?Ai.\u00ff\u00ff\u00ff\u00ef?2@?\u00ff\u00ff\u00ff\u00ef?\u00e1\u00bdN\u00ff\u00ff\u00ff\u00ef?%\u00fc\\\u00ff\u00ff\u00ff\u00ef?\u00faj\u00ff\u00ff\u00ff\u00ef?\u00ee!v\u00ff\u00ff\u00ff\u00ef?\u00c95\u0081\u00ff\u00ff\u00ff\u00ef?\u00c9e\u008b\u00ff\u00ff\u00ff\u00ef?\u00d2\u00c4\u0094\u00ff\u00ff\u00ff\u00ef?c\u009d\u00ff\u00ff\u00ff\u00ef?;O\u00a5\u00ff\u00ff\u00ff\u00ef?\u0099\u00ac\u00ff\u00ff\u00ff\u00ef?\u00eaL\u00b3\u00ff\u00ff\u00ff\u00ef?"w\u00b9\u00ff\u00ff\u00ff\u00ef?Y!\u00bf\u00ff\u00ff\u00ff\u00ef?\u00e7W\u00c4\u00ff\u00ff\u00ff\u00ef?x#\u00c9\u00ff\u00ff\u00ff\u00ef?\u00c2\u008b\u00cd\u00ff\u00ff\u00ff\u00ef?A\u0099\u00d1\u00ff\u00ff\u00ff\u00ef?oT\u00d5\u00ff\u00ff\u00ff\u00ef?\u00bc\u00c1\u00d8\u00ff\u00ff\u00ff\u00ef?A\u00e9\u00db\u00ff\u00ff\u00ff\u00ef?\u009d\u00cf\u00de\u00ff\u00ff\u00ff\u00ef?8z\u00e1\u00ff\u00ff\u00ff\u00ef?u\u00ee\u00e3\u00ff\u00ff\u00ff\u00ef?\u00cf/\u00e6\u00ff\u00ff\u00ff\u00ef?PB\u00e8\u00ff\u00ff\u00ff\u00ef?\u00fd*\u00ea\u00ff\u00ff\u00ff\u00ef?V\u00ec\u00eb\u00ff\u00ff\u00ff\u00ef?r\u0089\u00ed\u00ff\u00ff\u00ff\u00ef?\u00ef\u00ff\u00ff\u00ff\u00ef?Pb\u00f0\u00ff\u00ff\u00ff\u00ef?x\u00a3\u00f1\u00ff\u00ff\u00ff\u00ef?\u00fd\u00ca\u00f2\u00ff\u00ff\u00ff\u00ef?\u00fd\u00da\u00f3\u00ff\u00ff\u00ff\u00ef?>\u00d4\u00f4\u00ff\u00ff\u00ff\u00ef?i\u00ba\u00f5\u00ff\u00ff\u00ff\u00ef?~\u008d\u00f6\u00ff\u00ff\u00ff\u00ef?1P\u00f7\u00ff\u00ff\u00ff\u00ef?\u0082\u00f8\u00ff\u00ff\u00ff\u00ef?\u00f1\u00a6\u00f8\u00ff\u00ff\u00ff\u00ef?\u00a7>\u00f9\u00ff\u00ff\u00ff\u00ef?r\u00c9\u00f9\u00ff\u00ff\u00ff\u00ef?I\u00fa\u00ff\u00ff\u00ff\u00ef?u\u00be\u00fa\u00ff\u00ff\u00ff\u00ef?i*\u00fb\u00ff\u00ff\u00ff\u00ef?u\u008e\u00fb\u00ff\u00ff\u00ff\u00ef?\u00e9\u00fb\u00ff\u00ff\u00ff\u00ef?\u00b0=\u00fc\u00ff\u00ff\u00ff\u00ef?.\u008b\u00fc\u00ff\u00ff\u00ff\u00ef?\u00ed\u00d1\u00fc\u00ff\u00ff\u00ff\u00ef?\u00aa\u00fd\u00ff\u00ff\u00ff\u00ef?;O\u00fd\u00ff\u00ff\u00ff\u00ef?\u00bf\u0086\u00fd\u00ff\u00ff\u00ff\u00ef?\u00d5\u00b9\u00fd\u00ff\u00ff\u00ff\u00ef?\u00ad\u00e8\u00fd\u00ff\u00ff\u00ff\u00ef?G\u00fe\u00ff\u00ff\u00ff\u00ef?`;\u00fe\u00ff\u00ff\u00ff\u00ef?l_\u00fe\u00ff\u00ff\u00ff\u00ef?\u00c5\u0080\u00fe\u00ff\u00ff\u00ff\u00ef?l\u009f\u00fe\u00ff\u00ff\u00ff\u00ef?\u00f4\u00bb\u00fe\u00ff\u00ff\u00ff\u00ef?+\u00d6\u00fe\u00ff\u00ff\u00ff\u00ef?\u00e1\u00ed\u00fe\u00ff\u00ff\u00ff\u00ef?\u00db\u00ff\u00ff\u00ff\u00ff\u00ef?\u00ff\u00ff\u00ff\u00ff\u00ef?\u00fd*\u00ff\u00ff\u00ff\u00ff\u00ef?\u00c2;\u00ff\u00ff\u00ff\u00ff\u00ef?\u00f4K\u00ff\u00ff\u00ff\u00ff\u00ef?8Z\u00ff\u00ff\u00ff\u00ff\u00ef?\u0085g\u00ff\u00ff\u00ff\u00ff\u00ef?\u00dbs\u00ff\u00ff\u00ff\u00ff\u00ef?l\u00ff\u00ff\u00ff\u00ff\u00ef?\u0089\u00ff\u00ff\u00ff\u00ff\u00ef?\u00e4\u0092\u00ff\u00ff\u00ff\u00ff\u00ef?\u0091\u009b\u00ff\u00ff\u00ff\u00ff\u00ef?\u00db\u00a3\u00ff\u00ff\u00ff\u00ff\u00ef?.\u00ab\u00ff\u00ff\u00ff\u00ff\u00ef?\u00b2\u00ff\u00ff\u00ff\u00ff\u00ef?J\u00b8\u00ff\u00ff\u00ff\u00ff\u00ef?\u00be\u00ff\u00ff\u00ff\u00ff\u00ef?\u00e4\u00c2\u00ff\u00ff\u00ff\u00ff\u00ef?\u00c8\u00ff\u00ff\u00ff\u00ff\u00ef?\u0088\u00cc\u00ff\u00ff\u00ff\u00ff\u00ef?\u00c5\u00d0\u00ff\u00ff\u00ff\u00ff\u00ef?\u00d2\u00d4\u00ff\u00ff\u00ff\u00ff\u00ef?J\u00d8\u00ff\u00ff\u00ff\u00ff\u00ef?\u0091\u00db\u00ff\u00ff\u00ff\u00ff\u00ef?D\u00de\u00ff\u00ff\u00ff\u00ff\u00ef?(\u00e1\u00ff\u00ff\u00ff\u00ff\u00ef?\u00aa\u00e3\u00ff\u00ff\u00ff\u00ff\u00ef?\u00c8\u00e5\u00ff\u00ff\u00ff\u00ff\u00ef?\u00b6\u00e7\u00ff\u00ff\u00ff\u00ff\u00ef?8\u00ea\u00ff\u00ff\u00ff\u00ff\u00ef?\u00c2\u00eb\u00ff\u00ff\u00ff\u00ff\u00ef?M\u00ed\u00ff\u00ff\u00ff\u00ff\u00ef?\u00d8\u00ee\u00ff\u00ff\u00ff\u00ff\u00ef?1\u00f0\u00ff\u00ff\u00ff\u00ff\u00ef?Y\u00f1\u00ff\u00ff\u00ff\u00ff\u00ef?\u00f3\u00ff\u00ff\u00ff\u00ff\u00ef?x\u00f3\u00ff\u00ff\u00ff\u00ff\u00ef?\u00a0\u00f4\u00ff\u00ff\u00ff\u00ff\u00ef?4\u00f5\u00ff\u00ff\u00ff\u00ff\u00ef?\u008e\u00f6\u00ff\u00ff\u00ff\u00ff\u00ef?"\u00f7\u00ff\u00ff\u00ff\u00ff\u00ef?\u00e7\u00f7\u00ff\u00ff\u00ff\u00ff\u00ef?{\u00f8\u00ff\u00ff\u00ff\u00ff\u00ef?A\u00f9\u00ff\u00ff\u00ff\u00ff\u00ef?\u00d5\u00f9\u00ff\u00ff\u00ff\u00ff\u00ef?8\u00fa\u00ff\u00ff\u00ff\u00ff\u00ef?8\u00fa\u00ff\u00ff\u00ff\u00ff\u00ef?.\u00fb\u00ff\u00ff\u00ff\u00ff\u00ef?`\u00fb\u00ff\u00ff\u00ff\u00ff\u00ef?\u00c2\u00fb\u00ff\u00ff\u00ff\u00ff\u00ef?\u00f4\u00fb\u00ff\u00ff\u00ff\u00ff\u00ef?\u0088\u00fc\u00ff\u00ff\u00ff\u00ff\u00ef?\u00ea\u00fc\u00ff\u00ff\u00ff\u00ff\u00ef?\u0088\u00fc\u00ff\u00ff\u00ff\u00ff\u00ef?\u00b0\u00fd\u00ff\u00ff\u00ff\u00ff\u00ef?~\u00fd\u00ff\u00ff\u00ff\u00ff\u00ef?~\u00fd\u00ff\u00ff\u00ff\u00ff\u00ef?\u00e1\u00fd\u00ff\u00ff\u00ff\u00ff\u00ef?D\u00fe\u00ff\u00ff\u00ff\u00ff\u00ef?D\u00fe\u00ff\u00ff\u00ff\u00ff\u00ef?\u00fe\u00ff\u00ff\u00ff\u00ff\u00ef?\u00d8\u00fe\u00ff\u00ff\u00ff\u00ff\u00ef?u\u00fe\u00ff\u00ff\u00ff\u00ff\u00ef?u\u00fe\u00ff\u00ff\u00ff\u00ff\u00ef?\t\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?\t\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?\u00d8\u00fe\u00ff\u00ff\u00ff\u00ff\u00ef?;\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?l\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?;\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?;\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?l\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?;\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?;\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?l\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?;\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?;\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?\u009d\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?\u009d\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?\u009d\u00ff\u00ff\u00ff\u00ff\u00ff\u00ef?\x00\x00\x00\x00\x00\x00\u00ee?ffffff\u00ec?\u00a8\u00a4\u00c5\u00ec\u00cf\u00eb?\u00e8+\u00f2\u00cfe\u009b\u00eb?\u00cf\u00ab\u00b8\u00bf6\u0084\u00eb?gy\u00c7\u00b6|\u00eb?\fgA\u00fcx\u00eb?3\u00f3\tv\u00eb?\u00d5\u00f5n\u00cbu\u00eb?\u008e\u00ca|lw\u00eb?\u00a7\u00d7)\u00ea\u0093z\u00eb?\u00e9dz\u00cf~\u00eb?+\u00f31\u00da5\u0083\u00eb?\u00de\u00d1P\x00l\u0087\u00eb?@\u0093\u00a1\u00c8^\u008b\u00eb?\u00c6\u008cK%\u008f\u00eb?e\u008d>\u00da\u00c1\u0092\u00eb?\u00de\u00benxg\u0096\u00eb?N?Y$\u009a\u00eb?Q\u00c3\u0092\u009e\u00eb?o]\u00efU\u00a2\u00eb?\u00e4tA\u00ea\u00a6\u00eb?\u00885\u008e\u00d5\u00d8\u00ab\u00eb?4<\u0097o \u00b1\u00eb?\u00c32\u00f0\u00be\u00bc\u00b6\u00eb?\u00aa\u00f5S\u00b4\u00a9\u00bc\u00eb?G\u00c6S(\u00e5\u00c2\u00eb?\u00b3rGqo\u00c9\u00eb?XgL\u00d0\u00eb?:;\u00f9u\u0081\u00d7\u00eb?pG/\u0089\u00df\u00eb??\t\u00fe,\u00e7\u00eb?b\u009b\u00b4\u00dc\u0098\u00ef\u00eb?\u00d0\u008c\u009c\u00f8\u00eb?\u00f4l\u00fb3\u00ec?"\u0099\u0088\u00c8n\f\u00ec?\u009e\t\u00af\u00ccZ\u00ec?\u00ea\\G#\u00ec?\u0088\u00ed*|/\u00ec?\u00b8\u0083\u00de\u00c6\u00d4<\u00ec?\u0088=F\u00b3K\u00ec?\u00bb\u00b2\u00a9\u00f8MZ\u00ec?[\u00b1.P\u008fj\u00ec?L\u00b3\u00e7{\u00ec?g\u00ff;\u00b3b\u008e\u00ec?n#\u00c4\u00d9\r\u00a2\u00ec?\u00eba\u0095\u00f1\u00b6\u00ec?B[\u009eL\u00cd\u00ec?Og\u00c8s\u00e4\u00ec?\u00b7/\u00b0P\u00fd\u00ec?Te\u00fd\u00d7\u00ed?\u008c\u008a\u00edC\u00bf1\u00ed?J \u0081\u00d4\u00abM\u00ed?\u00b2q\u00b1\u00c1~j\u00ed?\\\u00e2\u00c8\u00fb\u0088\u00ed?/\u00fc\u00f0>\u00a6\u00ed?~\u00a3\u00e6>\u00d1\u00c4\u00ed?J$\u00d6\u008a\u009a\u00e3\u00ed?\u00c07f\u00ee?\bH#\x00!\u00ee?hq55?\u00ee?\u00d0\u00e0B\u00bb\u00d4\\\u00ee?\r\u00c6\u008d\u00a5\u00b1y\u00ee?\u00c5R.\u0091\u00a3\u0095\u00ee?\u00b8\u0093:\u0099\u0087\u00b0\u00ee?\u00c5\u00d7{\u00e4@\u00ca\u00ee?^>\u00cd\u00ed\u00b8\u00e2\u00ee?\u00c1|\u00f4\u0088\u00df\u00f9\u00ee?\u00fb\u00a1P\u00aa\u00aa\u00ef?,]\u00b3\u00fb$\u00ef?\u00ccG\u00b4I"7\u00ef?\u00839\u00ed\u00d7\u00d4H\u00ef?\b\u00c5@\u00a76Y\u00ef?\u00c8\u008e\u00baSh\u00ef?\u0093\u0093\u009eb:v\u00ef?\u00e8\u00d1\u0097\u00fa\u0082\u00ef?\u00d7\u00ce\u00a5f\u00a5\u008e\u00ef?a<\u0083pL\u0099\u00ef?f\t\u00ba\u0081\u00a3\u00ef?\u00cb\u00850<\u00d6\u00ab\u00ef?\u0095>\u00d4\u00db\u00b3\u00ef?~;X\u00de"\u00bb\u00ef?\u0084-+\u00bb\u00c1\u00ef?o(\t\u00ae\u00b3\u00c7\u00ef?\u00dd\u00fc5p\u00cd\u00ef?\u00e8\x00\f\u0088\u00fc\u00d1\u00ef?\u00f3o\\f\u00d6\u00ef?1\u00bc\u00b9Xb\u00da\u00ef?\\;\n\u0093\u00fb\u00dd\u00ef?\u00b8\u00fe\u00fe7;\u00e1\u00ef?T\u00e5)\u00e4\u00ef?\u009f\u009d\u0094r\u00cf\u00e6\u00ef?%\u00883\u00e9\u00ef?<\u00c9\u00a2\b[\u00eb\u00ef?\u00fa\u00ae\u00eaaM\u00ed\u00ef?\u00fc\u00c8\u00c8W\u00ef\u00ef?\u009b\u0085;\u00b1\u00a5\u00f0\u00ef?\u00f0\u00d0\u00da\u00bd\u00f2\u00ef?\u00d1 ``\u00f3\u00ef?\u008d\u00b1\u00d9\u008c\u00f4\u00ef?\u0095\u00e9\u00e4\u009b\u00f5\u00ef?]\u00c7\x00\u0090\u00f6\u00ef?t5H\u00c5m\u00f7\u00ef?\u00ad`6\u00f8\u00ef?P\u00ab\u00fa\u00eb\u00f8\u00ef?\u00c9c\u0083q\u0090\u00f9\u00ef?c\u0083q%\u00fa\u00ef?\u00de\u0080\u00c2z\u00ac\u00fa\u00ef?!!`\u00e9&\u00fb\u00ef?\u0096(N\u00f5\u0095\u00fb\u00ef?\u00f2>`\u00b7\u00fa\u00fb\u00ef?V\u00f0\u0094,V\u00fc\u00ef?i\u0085\u00df8\u00a9\u00fc\u00ef?\u0081Jm\u00a9\u00f4\u00fc\u00ef?\u00c7\u00bar79\u00fd\u00ef?\u0084\u0097\u0083\u0089w\u00fd\u00ef?\u00b7\u0085Y6\u00b0\u00fd\u00ef?O`s\u00c5\u00e3\u00fd\u00ef?|Zz\u00b1\u00fe\u00ef?\u00a0\u00c6i=\u00fe\u00ef?\u00a4\u0098\u00efOd\u00fe\u00ef?\u00cb\u00d3\u00b6\u00c0\u0087\u00fe\u00ef?\u0093\u00fe\u00c4\f\u00a8\u00fe\u00ef?"#~\u00c5\u00fe\u00ef?k\u00a6[W\u00e0\u00fe\u00ef?\u00da\u00d5\u00f8\u00fe\u00ef?/\u00a2..\u00ff\u00ef?n\u00a9\u0094#\u00ff\u00ef?\u00da\u0089\u00b336\u00ff\u00ef?\u008b\u00f9\u00ea5G\u00ff\u00ef?\u00fb\f\u00ae\u00bfV\u00ff\u00ef?\'\u00e4l\u00f2d\u00ff\u00ef?\b_\u00d5\u00ecq\u00ff\u00ef?\u00ef\u00aaW\u00ca}\u00ff\u00ef?U.>\u00a4\u0088\u00ff\u00ef?m-=\u0091\u0092\u00ff\u00ef?\u00deU$\u00a6\u009b\u00ff\u00ef?\u00ac\u00d4\u00ca\u00f5\u00a3\u00ff\u00ef?\u00f1\u00eap\u0091\u00ab\u00ff\u00ef?\u00a0\u00cc\u00b4\u0088\u00b2\u00ff\u00ef?%\u0090\u00cd\u00e9\u00b8\u00ff\u00ef?\u00bd\u00af\u00c1\u00be\u00ff\u00ef?c\u00c4\u00ff\u00ef?\u009a\u00af\u00fe\u00c9\u00ff\u00ef?\u0087\f\u0083\u00cd\u00ff\u00ef?\u00db\tR\u00a2\u00d1\u00ff\u00ef?\u00df\u00e0\u00aci\u00d5\u00ff\u00ef?\u00cd\u00ce\u00f4\u00e0\u00d8\u00ff\u00ef?*E\u00b7\u00dc\u00ff\u00ef?\u00e4 A\u00f9\u00de\u00ff\u00ef??\u00a6\u00e1\u00ff\u00ef?f\u00a3\u00d1\u00e4\u00ff\u00ef?\u0092\u00e5\u00c1[\u00e6\u00ff\u00ef?\u00d4bm\u00e8\u00ff\u00ef?pm\u009fS\u00ea\u00ff\u00ef?\u00f1\u00ec\u00ff\u00ef?\u00a4\u009a!\u00ac\u00ed\u00ff\u00ef?)7\u00b4$\u00ef\u00ff\u00ef?\u00f8\u00b7~\u00f0\u00ff\u00ef?\u0098\u00df\u0092\u00bc\u00f1\u00ff\u00ef?,\u0086\u00a7\u00e0\u00f2\u00ff\u00ef?\u00f5\u00ed\u00f3\u00ff\u00ef?O\u00a6\u00c3\u00e3\u00f4\u00ff\u00ef?\u00aa\u0082\u00c6\u00f5\u00ff\u00ef?\u0084\u00a3\u0097\u00f6\u00ff\u00ef?\u00cb\u00af\u00a8V\u00f7\u00ff\u00ef?\u00ed\u00d8\u00ea\u00f8\u00ff\u00ef?\u00fe\u00e9\u00f1\u00a8\u00f8\u00ff\u00ef?9\r>\u00f9\u00ff\u00ef?\u00c0,\u00c7\u00f9\u00ff\u00ef?v\u00eaBE\u00fa\u00ff\u00ef?[S\u00b9\u00fa\u00ff\u00ef?2\u0096$\u00fb\u00ff\u00ef?\tLS\u0086\u00fb\u00ff\u00ef?lc\u00bb\u00e0\u00fb\u00ff\u00ef?\u009aN\u00fa3\u00fc\u00ff\u00ef?\u00cb\u00e9\u008f\u0080\u00fc\u00ff\u00ef?\u00f4\u00b3\f\u00c7\u00fc\u00ff\u00ef?3)\u00ec\u00fd\u00ff\u00ef?\u00d0d\u00afC\u00fd\u00ff\u00ef?m\u00b2z\u00fd\u00ff\u00ef?*R\u00ad\u00fd\u00ff\u00ef?\u009eJ\u00f8\u00db\u00fd\u00ff\u00ef?\u00ed\u00c6\u00ec\u00fe\u00ff\u00ef?\u00ae\u0082.\u00fe\u00ff\u00ef?!\u00edR\u00fe\u00ff\u00ef?\u00f9\u00bf\u0081t\u00fe\u00ff\u00ef?\u00e2\u00b9n\u0093\u00fe\u00ff\u00ef?\u00f0\u00e8\u00af\u00fe\u00ff\u00ef?M\u00ca%\u00ca\u00fe\u00ff\u00ef?\u00b1O\u00e2\u00fe\u00ff\u00ef?\u00e5T\u0095\u00f8\u00fe\u00ff\u00ef?\u00a7\u00da!\r\u00ff\u00ff\u00ef?\u008a\t \u00ff\u00ff\u00ef?@|1\u00ff\u00ff\u00ef?y\u008bA\u00ff\u00ff\u00ef?\u0093\u00e7\\P\u00ff\u00ff\u00ef?&-^\u00ff\u00ff\u00ef?\u00caf\u0097j\u00ff\u00ff\u00ef?y\u00994v\u00ff\u00ff\u00ef?\u009d`\u00e7\u0080\u00ff\u00ff\u00ef?M\'\u00c1\u008a\u00ff\u00ff\u00ef?\u00dc\u00ff\u00db\u0093\u00ff\u00ff\u00ef?48?\u009c\u00ff\u00ff\u00ef?\u00d9\u00fa\u00a3\u00ff\u00ff\u00ef?j\u00d3\u00ab\u00ff\u00ff\u00ef?\u00c3\u00e0\u00ac\u00b1\u00ff\u00ff\u00ef?\u0098G\u00bd\u00b7\u00ff\u00ff\u00ef?-JR\u00bd\u00ff\u00ff\u00ef?t\u0084z\u00c2\u00ff\u00ff\u00ef?QG>\u00c7\u00ff\u00ff\u00ef?!\\\u009e\u00cb\u00ff\u00ff\u00ef?N%\u00a9\u00cf\u00ff\u00ff\u00ef?^d\u00d3\u00ff\u00ff\u00ef?\u00afH\u00d3\u00d6\u00ff\u00ff\u00ef?\u00fd\u009a\u00da\u00ff\u00ff\u00ef?\u00e5\u00f5\u00f1\u00dc\u00ff\u00ff\u00ef?\u009e\u00a4\u00df\u00ff\u00ff\u00ef?7\u00b8!\u00e2\u00ff\u00ff\u00ef?\u00fbq\u00e4\u00ff\u00ff\u00ef?\u00fe)\u008e\u00e6\u00ff\u00ff\u00ef?\u00d3\u0083\u00e8\u00ff\u00ff\u00ef?$Q\u00ea\u00ff\u00ff\u00ef?u\u00bb\u00fb\u00eb\u00ff\u00ff\u00ef?\u00bbH\u0085\u00ed\u00ff\u00ff\u00ef?"\u00f2\u00ee\u00ff\u00ff\u00ef?3\u00d8@\u00f0\u00ff\u00ff\u00ef?;\u00e0t\u00f1\u00ff\u00ff\u00ef?\u00a5\u0091\u00f2\u00ff\u00ff\u00ef?e2\u009b\u00f3\u00ff\u00ff\u00ef?\u00ad\u00d8\u008f\u00f4\u00ff\u00ff\u00ef?\u00fe\u0094n\u00f5\u00ff\u00ff\u00ef?_>\u00f6\u00ff\u00ff\u00ef?\u00ec\u00a6\u00fe\u00f6\u00ff\u00ff\u00ef?\'\u00bd\u00ad\u00f7\u00ff\u00ff\u00ef?\u00c9\x00O\u00f8\u00ff\u00ff\u00ef?\u00e5\u00bc\u00e8\u00f8\u00ff\u00ff\u00ef?T3t\u00f9\u00ff\u00ff\u00ef?y\u00a3\u00f3\u00f9\u00ff\u00ff\u00ef?\u00efl\u00fa\u00ff\u00ff\u00ef?\u0091\u00de\u00d6\u00fa\u00ff\u00ff\u00ef?\u00fao:\u00fb\u00ff\u00ff\u00ef?Q,\u0099\u00fb\u00ff\u00ff\u00ef?\u00e6\u00f3\u00f1\u00fb\u00ff\u00ff\u00ef?\u0095=\u00fc\u00ff\u00ff\u00ef?z\u008a\u0088\u00fc\u00ff\u00ff\u00ef?\u008b\u0090\u00cf\u00fc\u00ff\u00ff\u00ef?\u00b0\u00fd\u00ff\u00ff\u00ef?y\u00e3D\u00fd\u00ff\u00ff\u00ef?}xx\u00fd\u00ff\u00ff\u00ef?\u00baR\u00b0\u00fd\u00ff\u00ff\u00ef?\u00fa|\u00dc\u00fd\u00ff\u00ff\u00ef?\u00b3\u0095\u00fe\u00ff\u00ff\u00ef?\b\u00bd-\u00fe\u00ff\u00ff\u00ef?\u00e9\u00cfQ\u00fe\u00ff\u00ff\u00ef?ap\u00fe\u00ff\u00ff\u00ef?9\t\u008d\u00fe\u00ff\u00ff\u00ef?\u00ba\u00ac\u00fe\u00ff\u00ff\u00ef?vY\u00c6\u00fe\u00ff\u00ff\u00ef?\u00dc\u00df\u00fe\u00ff\u00ff\u00ef?\u00ddU\u00f6\u00fe\u00ff\u00ff\u00ef?#\f\u00ff\u00ff\u00ff\u00ef?\u00e5\u00d8\u00ff\u00ff\u00ff\u00ef?\u00a3\u00df/\u00ff\u00ff\u00ff\u00ef?\u008b~?\u00ff\u00ff\u00ff\u00ef?\u0099P\u00ff\u00ff\u00ff\u00ef?nC\\\u00ff\u00ff\u00ff\u00ef?\u00f3\u008el\u00ff\u00ff\u00ff\u00ef?>w\u00ff\u00ff\u00ff\u00ef?\x00\x00\u0080\u00ff\u00ff\u00ff\u00ef?9\u00a7\u0088\u00ff\u00ff\u00ff\u00ef?\u0083#\u0096\u00ff\u00ff\u00ff\u00ef?\u0081q\u009d\u00ff\u00ff\u00ff\u00ef?\u00bf\u00a4\u00ff\u00ff\u00ff\u00ef?\u00b7f\u00ad\u00ff\u00ff\u00ff\u00ef?\u00b5\u00b4\u00b4\u00ff\u00ff\u00ff\u00ef?\u008c\u00a6\u00b9\u00ff\u00ff\u00ff\u00ef?\u008b\b\u00be\u00ff\u00ff\u00ff\u00ef?\u00c4M\u00c2\u00ff\u00ff\u00ff\u00ef?sE\u00c9\u00ff\u00ff\u00ff\u00ef?\u0086\u00a4\u00cc\u00ff\u00ff\u00ff\u00ef?"\u00b3\u00d1\u00ff\u00ff\u00ff\u00ef?\u00d24\u00d7\u00ff\u00ff\u00ff\u00ef?\u00e5\u00a7\u00d7\u00ff\u00ff\u00ff\u00ef?\u0082@\u00db\u00ff\u00ff\u00ff\u00ef?Y\u00bc\u00de\u00ff\u00ff\u00ff\u00ef?\u0093\u008b\u00e1\u00ff\u00ff\u00ff\u00ef?~z\u00e5\u00ff\u00ff\u00ff\u00ef?/\u00e8\u00ff\u00ff\u00ff\u00ef?B\u00f9\u00e9\u00ff\u00ff\u00ff\u00ef?\u0090\u00c5\u00eb\u00ff\u00ff\u00ff\u00ef?-r\u00ec\u00ff\u00ff\u00ff\u00ef?\u00b7!\u00ee\u00ff\u00ff\u00ff\u00ef?\u00a2\u009a\u00f0\u00ff\u00ff\u00ff\u00ef?,J\u00f2\u00ff\u00ff\u00ff\u00ef?\u00f0\u00dc\u00f3\u00ff\u00ff\u00ff\u00ef?>\u00a9\u00f5\u00ff\u00ff\u00ff\u00ef?\u00b5o\u00f5\u00ff\u00ff\u00ff\u00ef?*\u00ac\u00f6\u00ff\u00ff\u00ff\u00ef?*"\u00f8\u00ff\u00ff\u00ff\u00ef?xx\u00f8\u00ff\u00ff\u00ff\u00ef?x\u00ee\u00f9\u00ff\u00ff\u00ff\u00ef?d\u00f1\u00fa\u00ff\u00ff\u00ff\u00ef?\u00b3G\u00fb\u00ff\u00ff\u00ff\u00ef?<\u0081\u00fb\u00ff\u00ff\u00ff\u00ef?)\u00fb\u00ff\u00ff\u00ff\u00ef?P\u00f4\u00fb\u00ff\u00ff\u00ff\u00ef?<\u00f7\u00fc\u00ff\u00ff\u00ff\u00ef?<\u00f7\u00fc\u00ff\u00ff\u00ff\u00ef?\u00d9\u00a3\u00fd\u00ff\u00ff\u00ff\u00ef?c\u00dd\u00fd\u00ff\u00ff\u00ff\u00ef?\u0087\u00fd\u00ff\u00ff\u00ff\u00ef?\u00ed\u00fe\u00ff\u00ff\u00ff\u00ef?(\u00fa\u00fd\u00ff\u00ff\u00ff\u00ef?<m\u00fe\u00ff\u00ff\u00ff\u00ef?\u00fd\u00fe\u00ff\u00ff\u00ff\u00ef?\u00d9\u00ff\u00ff\u00ff\u00ff\u00ef?\u00fd\u00fe\u00ff\u00ff\u00ff\u00ef?\u00d9\u00ff\u00ff\u00ff\u00ff\u00ef?O\u00e0\u00fe\u00ff\u00ff\u00ff\u00ef?cS\u00ff\u00ff\u00ff\u00ff\u00ef?cS\u00ff\u00ff\u00ff\u00ff\u00ef?(p\u00ff\u00ff\u00ff\u00ff\u00ef?\u00b1\u00a9\u00ff\u00ff\u00ff\u00ff\u00ef?v\u00c6\u00ff\u00ff\u00ff\u00ff\u00ef?\u00ec\u008c\u00ff\u00ff\u00ff\u00ff\u00ef?v\u00c6\u00ff\u00ff\u00ff\u00ff\u00ef?v\u00c6\u00ff\u00ff\u00ff\u00ff\u00ef?;\u00e3\u00ff\u00ff\u00ff\u00ff\u00ef?;\u00e3\u00ff\u00ff\u00ff\u00ff\u00ef?;\u00e3\u00ff\u00ff\u00ff\u00ff\u00ef?v\u00c6\u00ff\u00ff\u00ff\u00ff\u00ef?v\u00c6\u00ff\u00ff\u00ff\u00ff\u00ef?v\u00c6\u00ff\u00ff\u00ff\u00ff\u00ef?;\u00e3\u00ff\u00ff\u00ff\u00ff\u00ef?\x00\x00\x00\x00\x00\x00\u00ef?\u00f8\u00de{\u00ef\u00bd\u00f7\u00ed?M\u00aa\u00d6\u009dgm\u00ed?\u0082 \u00bd\u00a5/\u00ed?,\u0098\x00\u00b5\u00ed?\u00aa\u00b2\u00d7\u00ca\u0092\u00ed?l]F\u0094l\u00fd\u00ec?i]|\u00f9K\u00f9\u00ec?\u0085~K)q\u00f7\u00ec?\u0081\u00d1\u00bf\u008b\u00f6\u00ec?\u00ae\u00e6\u00bd\u00c8\u00f6\u00ec?_N c\u00dc\u00f5\u00ec?\u00d2\u00c3T"\u00be\u00f5\u00ec?\u0095un\u00b5\u00f5\u00ec?\u00ad\u0087\u00c8\u00aa\u00b6\u00f5\u00ec?\u008a5\u0092\u00ad\u00be\u00f5\u00ec?\u0082\u0086\u00a0\u00e8\u00bb\u00f5\u00ec?\u00dc\u00b2\u00b6\u00d4\u00f5\u00ec?\u00bb5}\u00eb\u00f5\u00ec?g\u00d7}w\u00f6\u00ec?\u00ff`Q\'\u00f6\u00ec?!\u0098GL\u00f6\u00ec?fe<"y\u00f6\u00ec?\u00f6Z\u00b3\u00f6\u00ec?\u009e\u00c1\u009e\u00dc\u00f6\u00ec?M\u0092\u00ff`\f\u00f7\u00ec?*_\u00aaA\u00f7\u00ec?\u00fev\u00a6a\u00f7\u00ec?en\u00e2s\u0094\u00f7\u00ec?\u0080\u00a0\u00c4\u00f7\u00ec?\u009dg\u00b3w\u00e7\u00f7\u00ec?\u00ad\u00f3\u00fc>\x00\u00f8\u00ec?[\u00e8H4\u00f8\u00ec?\u0090\u00f2\u00b1\u00af7\u00f8\u00ec?\u00eai\u00bfc\u00f8\u00ec?A7\u0080\u00f8\u00ec?\u00b4\u00ef\u00f3\u00a3\u00a3\u00f8\u00ec?\u00f2P\u00ba\u00d4\u00bc\u00f8\u00ec?\x00\u00a7\u00ac\u00ee\u00f8\u00ec?\u0099\u00f5\u00b6\u00fe\u00f8\u00ec?1\u00faV \u00f9\u00ec?vum\u00a05\u00f9\u00ec?C\u00b9$$L\u00f9\u00ec?<\u00c9\u0096c\u00f9\u00ec?GN^\u00bc\u0089\u00f9\u00ec?\u00cbc\u00da\u0092\u00f9\u00ec?\u008cME\u00e0\u00c4\u00f9\u00ec?]\u00e9O\u00c7\u00dd\u00f9\u00ec?V\u0099,\u00fa\u00ec?\u009f\u009a\u0098\u00f4\u00e1\u00f9\u00ec?\x00\u00dd\u00d1\u00d1&\u00fa\u00ec?\u00ae\u008e\u00d78\u00fa\u00ec?3\u00c9YG\u00fa\u00ec?\u00e4\u00bc\u00cb"\u0081\u00fa\u00ec?@{\u00ee\u008f\u00a1\u00fa\u00ec?\u00c2\u00b8\u00f0\b\u00c7\u00fa\u00ec?\u008c\u0090\u00bdJ\u00d2\u00fa\u00ec?>\u0087r\u008e\u00f0\u00fa\u00ec?^3\u00fb\u00ec?\u00ca\u00c3\u00e74\u00fb\u00ec?\u0082\u00af\u0085\u00e84\u00fb\u00ec?\u00a7\u0087\u0094\u00bal\u00fb\u00ec?\b\u00ea\u00b15_\u00fb\u00ec?+x\u00de\u00d3\u00fb\u00ec?\u00b8\u00a8M\u00bc\u00ae\u00fb\u00ec?\u00be\u0098\u0082s\u00ae\u00fb\u00ec?\u00d1\u00c7\u00fc\u00ec?\u00a6\u0084\u00c9\u00fe\u00fb\u00ec?P\u00ec\u0088\u00e5\u00fd\u00fb\u00ec?\u00f20\u00b6\u008a\u00ad\u00fc\u00ec?CP\u0097;\u00fc\u00ec?u\u00b23x\u00a0\u00fc\u00ec?\u00d1yf\u00df\u00fc\u00ec?\u008f.\u00de\u00a7\u00fc\u00ec?]N+\u00eb\u00fc\u00ec?\u00fcgAL/\u00fd\u00ec?\u00b7\u00bf\u00a0Q\u00fd\u00ec?`w\u00e7\f\u00fd\u00ec?#0\u00e5\u00ab\u00fd\u00ec?s\u00e6&U\u00d0\u00fd\u00ec?\u00daV%\t\u00be\u00fd\u00ec?\nr\u00fe\u00ec?\u00c4eC^\u00d4\u00fd\u00ec?O\u00f8{\u00a2\u00c2\u00fd\u00ec?\u00cc\u0097)\u00e1C\u00ff\u00ec?\u00fb\u00d1[\u008dB\u00fe\u00ec?\u00b0\u0095X\u00cd\u00a2\u00fd\u00ec?\u00f6\u00eb\u00c5\u0091\u00fe\u00ec?\u00ff\u009e\u0099F\x00\u00fe\u00ec?\n~[Q\u00cd\u00fe\u00ec?+oX\u00bc\u00aa\u00fd\u00ec?\u00e2\u00f0\u00c9\u009e\u00a6\u00ff\u00ec?\u00bbq\u0097\u008f|\u00ff\u00ec?^4\u00e7\u00f6\u00ab\u00fe\u00ec?n\u009d\u00a9w\u00d2\u00ff\u00ec?6Q.9\u00ff\u00ec?\u00aa\u00e9\u00d0\u00db\u00ff\u00ec?\u0086v\u00e7[\u0084\u00ff\u00ec?\u00f1\u00b5\u00dfP\u00d6\u00ff\u00ec?\u00f4\u0095T\u00f3;\x00\u00ed?f\u00a9\u00dc\u00e2z\u00fe\u00ec?"\u009e\u00e9K\u00ed?\u00a0\rX\u0091\\\x00\u00ed?z\u009fZ\u00ed?\u00da\u00bd\u00fb\u00c9\u00a4\u00ff\u00ec?\u00b8K\u00801\u00ed?\u00aa\u0084\u00bdj%\u00ed?y\u00f1w\u008fw\u00fd\u00ec?\u00ae\u009e\u0091\u00a7\u00df\u00ed?\u00ac\u00a7\u00f20\x00\u00ed?\u00b3\u00d2\u00a8`\u0095\x00\u00ed?\u008dm\u00b2\u00d5\u0097\u00ff\u00ec?\u00d7r\u00cd\u009e\u00e9\u00ed?A\u00be\u00d8\u009f1\u00ed?\u00f0\\`\u008a-\u00ed?\u00d5\u00a6\u00b2y\u00ed?\u00faN^\u00a35\u00ff\u00ec?\u00ea\u00b1Ij\u00aa\u00ed?\u00d9\u008bM\u00f1\\\x00\u00ed?\u00eb!x\u009al\u00ed?=x\u00c5w\u00d6\u00ed?BS1\u00c7\u00ed?\u00d8cB\u00f9\u00ed?i\u00c0P*\u00bc\u00ed?\u00fa/\u00c2\u00c3^\n\u00ed?f\u00e0\u00f5M\u00ae\u00ed?\u00e9S((t\t\u00ed?7\u00a8\u00b6\u00ba\u00fd\u00ec?;\u00db\u0091\t\u00ed?\u00f7m\u009f\u00af%\x00\u00ed?\u00d3\u0083zf\u00e7\u00ed?r\u008afB\u00ed?\u0098\u00dd|\u00d9\u00b4\n\u00ed?\u0094\u00f5k\u00a4\t\u00ed?\u0080\u00f2F\u00ee\u00ed?MW\u00aaY\u00ed?p?&\u00d2L\u00ed?*\u00e2\u00ed?\u00a08\u00f0m\u00b0\u00ed?)\u008a\u00db\u0090n\u00ed?C\u008b\u00d8FZ\u00ed??\u00f7\u00eec,\b\u00ed?x\u0085=P\f\u00ed?Y\u00fea\u00ce\u00ed?\u00a8V\u00b6\u00ab\u00bd \u00ed?\u00bfG\u00c6<\r\u00ed?\u0084\u00fc\u00bbb\u00c0\n\u00ed?\u009e\u00cc\\\u00b9\u00ed??\r\u00f7\u009a\n\u00ed?\u00bcN\u00cdt\u00ed?\u00e3iI\u00c7`\u00ed?\u00db\u0096!\u00df\u00aa*\u00ed?\u0083&\u00fa\u008a>\u00ed?;u\u00da!\u00ed?sNh\u00eeX+\u00ed?\u00eeQY\u008aP"\u00ed?(g\u00a8.\u00ed?\u00de;\u00ff\u00cc9\u00ed?\u00b9&]_]\u00ed?\u00fa@\u00975\u00ed?\u00ca\u0082\u0084<\u00ed?\u008a\u00f8l\u00a1K\u00ed?NF\u0095F\u00a69\u00ed?B}\u00d4\u00a7A\u00ed?QLf_\u00ed?T\u00b1:\u00abS\u00ed?-\u00abM\u00c8\u0098a\u00ed?\u00ba\u00b4p\u0089\u00dda\u00ed?\u00c9a\u00b54Gm\u00ed?#\u00f3\u00a8$k\u00ed?\u00a0\u00e1\u00b7;\u00df\u0081\u00ed?ag!\u00ec,\u0084\u00ed?i]\u008a\u00d6\u00a5h\u00ed?A\u00b8\u00fb\u0091\u00ed?\u00d0\u008c\u00ce\u00ba\u00ed?\u00a6\u009e\u00eb\u00a6\u00ce\u00d2\u00ed?\u00d9\u00a9\u00e0\u00e9l\u00a7\u00ed?9\u00cc\u00ad\u00b5\u0091\u009c\u00ed?\u0089X\u00d2\u00d4\u00d3\u00ed?\u009b\u00cf\u00d4\u00fe\u00d1\u00d5\u00ed?\u00cdk\f>{\u00ee?"xK\u00ce)\u00ee?h\u00d4b\u00cc<\u00ee?\n\u0096\u00c4~g\n\u00ee?Wa;\u00b0\u00e9\u00ed?a\u00e9\u00e8s1K\u00ee?\n\u00d8V\u00b6i_\u00ee?p\u00b14m\u00ee?\u00ed\u00ae5q\u0092\u009b\u00ee?\u009bd\u00c5.\u00e7\u00a9\u00ee?\u0081~\u0081~\u0081\u00ee?\u00c4-}\u00e1\u00bf\u00ee?b\u009cY\u00cc\u00c6\u00ee?J\u00ea\u00c7\u0099b\u00e9\u00ee?\\\u00ad\u0085\u00de\u00c9\u00ee?\u00c4Q\u00f4\u0093X\u00f3\u00ee?e\u00efkBP\u00f6\u00ee?BQ?\u00e9^\u00ef?\u00dd\nj%%\u00ef?5\u00df\u008d\x00>\u00ef?v\u00b7"/+\u00ef?#\b$\u00c4\u00adJ\u00ef?\u00af\u00b8\u009f\u0093F\u00ef?C}\u00caw_\u00ef?\u00f5R37\u00f4\u0083\u00ef?\u0089\u00a1[q\u00f8w\u00ef?X\u00a6\u00cfQ\u00ef?q&Y+#}\u00ef?qV~B\u009c\u0095\u00ef?\u00978\u00f5{n\u0089\u00ef?\u00bdS\u00d7rp\u00b3\u00ef?\u00c0\u00eeB%\u008e\u0086\u00ef?}\u00ee5$\u009b\u00ef?>he\u00c9D\u00c7\u00ef?\u00e5{9\u00db\u00d8\u00ef?\u009a\u00828G\u00a1\u00af\u00ef?\u00c1\u0086l\u00d5\u00ae\u00ef?dX\u0099\u0096\u00bf\u00ef?\u008d\u0093(\u00ab\u00c8\u00d0\u00ef?}\u00f7\u00eb\u0092\u00ca\u00ef?\u00d7\u0080J#9\u00ca\u00ef?*M{\u00f8\u00f3\u00ef?\u00f4\u00f3\u00f3\u00f3\u00f3\u00f3\u00ef?\u00f0\u00dcZY\u00b5\u00c9\u00ef?)\bQ\u00d1}\u00d5\u00ef?2\u00c2E\u00d5\u00ef?\u00ff3\u00ba\u00f3\u00ef?\u00a6=\u00a3\u00b6E\u00e1\u00ef?Jx\u00a3\u00a9\u00f3\u00ef?\u00e0\u00a4\u00f3\u00df\u00a4\u00f3\u00ef?\u009d1@\u00e7\u00ef?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\u00f4g9\u0096\u00f3\u00ef?o\u00d6\u00c8\u00f9\u00ef??\fm\u00e3V\u00ed\u00ef?\u009c\u00ffp\u00fe\u00c3\u00f9\u00ef?#\u00cc\u00c9UH\u00ed\u00ef?\u008cW\u00e0\u00bf\u00f9\u00ef?\u0086d\u0096\u00cb{\u00f3\u00ef?(\u00efa\u00e4v\u00f3\u00ef?u\u008cT\u00f9q\u00f3\u00ef?\x00\x00\x00\x00\x00\x00\u00f0?\u00b0\u00d94\u0085\u00b6\u00f9\u00ef?\x00\x00\x00\x00\x00\x00\u00f0?\u00aa\u00cd\u0091j\u00f3\u00ef?\x00\x00\x00\x00\x00\x00\u00f0?5`\u00ce\u00b2\u00f9\u00ef?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\u00abt\u0090\u00b1\u00f9\u00ef?\x00\x00\x00\x00\x00\u0080\u00ef?v]\u00d7cn\u00dd\u00ee?\u00a8\u0088"\u0084vr\u00ee?\u00ea-\u00cc[\t:\u00ee?d\u00fc\u00aa\u00d0\u00ee?\u00aec\u00e6\u00cf\u00ee?\u00e4\u00cc\u00bf\u0088L\u00ee?\u00d0\u0087r\u00c8\b\u00ee?w&\u008f\t\u0080\u00ee?7v"=P\u00ee?x/a\\\u00ee?\u00c1w,\u0085\u00c8\u00ee?c\u00c6\u00d9:o\u00ee?\ng\u00c3\u009c:\u00ee?Lb\u0096F$\u00ee?\u0088\u009a\u00ab\u00ee?\u00e4\u00f9%\u00ee?\u00d0\u00c6\u00c2|\u00fd\u00ee?\u00e2\u00de{\u0083\u00f9\u00ee?a`\u00ee?\u00d0\u009a^ \u00ff\u00ee?\u00b1\u0092\\n\u00ee?\u00bb\u00c4\u00a7\u00ee?\u00cd\u00c9\\\u00f9\u00ee?|\u00de\f\u00ee?A\u00db~\u00e6\u00ee?\u00a6\u00d0\u00c5\u00ee?q\u00a5H\x00\u00ee?!\u008f_\b\u00ee?\u0085^\u009e\u00e3\u00ee?\u00fa\u00b5=W\u00ee?i\u0086\u00b2~\u00ee?0\u00ff\u008e\u00f9\u00ee?Qv\u00a8j\u00ee?$K\u00ee\u00f1&\u00ee?\u0099\u00de\x00\u00ee?|+{\'\u00ee?W\u00d7\\\u00b2/\u00ee?|\u008c\u00a1\u00c3-\u00ee?\u00b3\u00ff7\u00af>\u00ee?\u009f$$1\u00ee?\u00c9*o3\u00ee?S\u00af\u0094\u00c49\u00ee?\u00f6y\u00a9\tK\u00ee?a\u00aeMM\u00ee?\u00e8B\u0080I\u00ee?\u00b0\u008d;\u0084[\u00ee?Yk\u00acX\\\u00ee?*l\u0099b\u00ee?Brzr\u00ee?7\u0092r`\u0082\u00ee?C\u00de\u00c1m\u00ee?.X~\u00ee?.\u00ef\u0092\u00ee?\u00b4\u0094\u00ee\u008a\u00ee?\u00e6U\u008f\u0080\u0088\u00ee?]/\u00f6\u00c1\u008d\u00ee?\u009b\u0097\u00c5\u00f8\u0081\u00ee?P:\r1\u00a3\u00ee?\u00bcY\u00e4\u00d9\u00b0\u00ee?8JU\u00a1\u00ee?z\u00a7\u00a9\u00ba\u0083\u00ee?\u00bf5*\u00a4\u00ee?g\u00e7\u00b3\u00ee?\u00d4\u00eem\u00a9\u00a5\u00ee?\u0089\u00a1Z\u00d9\u00cb\u00ee?:!\u00e5\u00d6\u00ee?\u00916\u00b9\u00e4\u00b3\u00ee?\u0097\u00a5s\u00db\u00a7\u00ee?\u0095\u00d2\u00ab\u009f\u00c8\u00ee?\u00c4uE~\u00bd\u00ee?d\u00b6\u009a\u0098\u0094\u00ee?St\f\u00e2\u00c6\u00ee??\u0097\u00f8\u00e8\u00b2\u00ee?\nM\u00df\u00b3\u00be\u00ee?\u00cc\u009eQ\u00c6\u00d6\u00ee?&d\u00ed\u00dc\u00ee?\u00beM\u00e3\u00f4\u00e0\u00ee?\u00c9\u00c0\u00f8\u00ed\u00ee?\u009e\u00bcu\u00ca\u00f5\u00ee?2\u00a5\u00df\u00e0\u00ee?\u00cfIg.\u00c6\u00ee?Uu0\u00eaQ\u00ee?\u00ff_M\u00cb\u00ee?\u00bbf5=\u00ee?\u00c3r\u00eb\u00f8\u00fc\u00ee?\u0089=I\u00d8\u00e4\u00ee??\u00c7\n\u00ac\u00f9\u00ee?\u00dc\u008a\u00f0\u00ee?j\u00da\u00af\u00eb\u00f6\u00ee?2\u00f5SR\u00d4\u00ee?6\u00e6#\u00f7\u00ee?\u0092\u00c1\u0086\u0082\u00ee?;j\u00e6\'\u009f\u00ee?CGG\u00cb\u00ee?\u00dd\u00ec\u00ac\u00ee?\u00f7\u00da_\u00b4\u00de\u00ee?\u00c9I\u00fd\u00dc\u00ee?\u00c6\u00b2\u00fe\u009e\u00ee?\u00a66\u00f4\u0087\u00bd\u00ee?\u00e8\u00e5\u00ae\\\u00ee?\u00f0\u0085!\tt\u00ee?\u00c7IK\u00b8\u00ee?\u00c8\'5\u00fe\u00ee?7\u0082c\u00ce\u00ee?\u0085\u00aaaN\u00ee?\r\u00fc!\u00c6\u00a4\u00ee?\u009ag\u00f3\u00c7\u00ee?o\u008b\u00ae\u008a\u0086\u00ee?\u008f\u00fd\u00c9ho\u00ee?O\u00bb\u00eb\u00f8\u00ee?\u0086\u00f9\u008b\x00\u00ee?4\u0088-@\u00ee?6\u009e\u0082J\u00ee?\u00a9d]"\u00ed\u00ee?\u00f9\u00ec\u00fc5\u00ee?/\u00c72\u00fc\u00ee?oj\u00e9\u00b2\u0081\u00ee?5\u00bcQ/\u00ee?\u00dcef6\u00e1\u00ee?%l#\u00cbJ\u00ee?d\u00fb\u0096@\u00ee?\u00a5\u00ec,K\u00ee?\u00d8\u00e3dN\u00ee?`\u0096\u00a0\u00ca\u00ee?\u00fc\\\u009e/.\u00ee?*\u00c90{\u008d\u00ee?\u00d0\u00c3\r~Q\u00ee?a\u008bB \u00ee?G\u00d9\u009b.\u00ee?t\u00cf\u00cf\u008bE\u00ee?\u008civ\u008a\u00ee?\u00dbBq\u00e2\u00ee?\u00e8\rcV\u00b2\u00ee?n\u00ccn\u00a2\u00ee?N7^\u00fd\u0084\u00ee?79r[\u00c1\u00ee??\u0099dQ)\u00ee?\u00b0\u00b5I\u00ee?#\u00c6#\u00dd\u00ea\u00ee?G\u009f\u00ae\u00aa\u00ee?N\u00f7h\u00fe\u00ee?x\u00de\u00c5\u00b0\u00ee? \u00fb\u00a4s\u0095\u00ee?\u0092\u0082cQ\u00ee?\u0084\u00aa\u0095\u00c0\u00ee?\b\u00d2G=\u0095\u00ee?\u0084\u00ee?\u0083\u009d\u0082"R\u00ee?uw%\u00f5y\u00ee?\u00d2\u0088\u00b1=\u00ee?\u00a1\u00adz\n\u00ee?\'\f\u00d2J\u00ee?\u00f1\u00af\u00f4\u00a5\u00dc\u00ee?|\u00af#E\u00ee?_\u00e0\u0090\u0099\u00ed\u00ee?\u00e1\u00d6\u00ea\u00c4u\u00ee?\u0094\u009e#\u00ef\u00c7\u00ee?\u00fe\u008b\u00ca\u00d4\u00ee?yt\u0083\u0099\u00ee?\u00f5,WS\u00ee?\u00af\u00b8\u00d1\u00ca\u00ee?\u008d\u0093r\u00db\u00bb\u00ee?\'x\u00cbM\t\u00ee?\u0096q8\u00d9\u00ee?9K5V\u008d\u00ee?\u00f4\u00dd\u00e7\u00f5p\u00ee?\u008b\u00fa#F\u00a7\u00ee?+\u00e2\u00b9\u00b1\u00ee?\u00d3F\u008e\b\u00a3\u00ee?t\u00aa9\n\u008c\u00ee?\u009b\u00f8_;\u00ee?9\u00f7Z\u00f6 \u00ee?>F\u0085J\u00b5\u00ee?\u00cf\n\u00ee\u009d\u00ee?\u00del\u00f3\u00b6\u00b5\u00ee?Te\u0095|M\u00ee?7\u00f8n$!\u00ee?\u00dae\u00e2\t\u00ee?\u0088%HG\r\u00ee?\u00811t2\t\u00ee?m\u0086\u00ae*\u00cb\u00ee?\n]\u00a2\u00b5\x00\u00ee?=\u00d0t\u00ee?\u00c6\u0084\u00a1 \u00aa\u00ee?V_\u00bd\u008e\t\u00ee?\u00ae\u00a6~\u00ee?\u00b7\u00c9;\u0096g\u00ee?\u0090L\u00d6P+\b\u00ee?Ln\u00f0\u00a6\u00ee?\u00db\u00cc-\u00e8\u00fa\u00fe\u00ed?{I\u00c4\u009b|\u00ee?w\u00f6\u0098\u00c3\u00f8\u00ed?H\u008b\u0099\u00d5\u00ee?\u00b6Sd\u00e3\u00ca\u00ee?\u00e8\u00a5\t\u00ee?xV\u00e2\u00d3\u00ee?\u00b5t\u00b8\u00f99\b\u00ee?J\u00d6\u008e$\u00eb\t\u00ee?X\u00d1\u00d3\u0097;\n\u00ee?\u00b8\u00d9L\n\u00ee?\u00aaH*\u00f0\u00ee?1kc\u00ee?\u00ff0\u00eaI\u00af\u00ee?O\u00b7v5\u00be\u00ee?.i:\u00fd\u00ed?J\u00d7 `1\u00ee?*)\u00ef\u00e7\u00b6\n\u00ee?"P\u0098\t\u00ee?8~\u0096\u00a9,\u00fa\u00ed?g\u00c5 :\u00ee?\u00c9\x00\u00ec\u00fd\u00b4\u00f8\u00ed?\u00f4S\u009d\u00e7S\u00ee?\u00e7\u00e7\u0088\u00f9\u00fa\u00ed?$L2\u00ee?\u00bf\u00c8\u0081\u00e5\u00fd\u00ed?\b\u00ccF\u00b1\u00ee?#\u00e1\u00b3\u00fa1\u00ee?\u00b9q`%7\u00ee?\u00d0\u00bc\u00ce\u00f81\u00ee?\u009f\u00bf4\u0097\u00a4\u00f6\u00ed?\u00b3\u00dc\u00e8q\u0080\u00ee?\u0081\u00ef\'\u00f0\u00fd\u00ee?P$u\u008bE\r\u00ee?\x00\u00ad\u00c3\u00b6\u00bb\u00ee?\u00b7m\u00db\u00b6m\u00f3\u00ed?W\u00d29\u00ee?\u00813{\u00ef\u00de\u00ee?Z\u0087\u00f5#\u008a\u00ea\u00ed?\u008a\u00fa~\u00ee?\u00ecBJ\u00e5)\u00ee?\u00b8\u00e01W\u0084\u00ee?(K;\u0090\u008d\u00fb\u00ed?-\u00eeZj\u00ee?\u00ce\u00e8\u00cd\u00ad\u00b2\u00ee?`\u00e5KI\u00ee?\u008d2mG\u00ee?n\nd\u0090\u00b8\u00ee?\u00eaB\u00d5r\f\u00ee?,\u00b0U\u00c2\u00e9\u00ed?\u00cbu)\u00c9\u00ee\u00ed?4\u0082U\u00ed\u00c3\u00fd\u00ed?\u00a5\u0086\x00}\u00b7\u00ee?&\u00d0;u-\u00ee?Nf\u00ecMf\u00ec\u00ed?\u008fLS\u00f2\b\u00ee?\u00b2\u00d7.?\u00d2\u00fd\u00ed?\u0097x\u00f1QF\u00ee?q\n\u0094~\u00ee?\u00ca\u00c4\u0095\u00ee\r\u00ee?\u00fe\u00b6\u00bd\u00bb,\u00ee?\u00b5\u0094\u0099\u00f1\u00ed?\u00df\u00e0\u0090%\u00ca\u00e1\u00ed?\u00ae\u00dd\u00da\u00ad\u00dd\u00da\u00ed?\u00b4;\u00d90\u00fe\u00ed?\u00dc0\u0085\u00f8\u00f2\u00ed?9x\u00e3C\u00ee?\u00f0 ~\u00e9\u00ee?\u009d\u00dc\u00e1\u0085\u00a7\u00ed?\u0096\u00ddxp\u009a\u00c8\u00ed?\u00ce\u00e2\\8t\'\u00ee?m\u00eb\fc\u00f7\u00bd\u00ed?\u00be\f\u00f9\u00bd\f\u00f9\u00ed?\u00f3\u008d\u00d1!\u00f9\u00ed?C%b\u00f3u\u00ee?\u00cf\u00e5\u0083/\u00e5\u00ed?\u009f\u00dd\u0098\u00ca_\u00ee?\u00d4\u008dx\u00e6\u0083V\u00ee?5Vk\u0092Y\t\u00ee?>\u00f5=\u00f5=\u00f5\u00ed?6\u00ec\u00ae\u00d9\u00ec\u00ed?\fo8h\u00fe\u00fa\u00ed?=^\u00e2\u00f24=\u00ee?\u00fbl\u00c6\u00f7G\n\u00ee?\u00cf\u00fd\u00b7\u00a0C\u00cf\u00ed?^\u00e9*b~\u00de\u00ed?\t\u00aa\u00f43\u00a7\u00c1\u00ed?\u00b8\u00d8\u00e0b\u0083\u008b\u00ed?^\u0080\u0085\u00d2U\u00ee?\u009e\u00d4 \u0094\u00ab\u00a7\u00ed?^H\u00cb\u00a2B\u00ee?p>\u00e7cp\u00ee?\u00e1\u00e1\u00ee?\u00e1=\u0084\u00f7\u00ee?\u00be$\u00be$\u00ee?\u00ad\u00ad\u00e2\u009d\u00fc`\u00ee?\u00cc\'S\u00cc\u00d8]\u00ee?\u00e4\u00b47?S3\u00ee?\u00e1\u00d6\u00deX\u00fd\u0081\u00ee?!Y\u00c8B\u00ee?\u0094\u008cE5\u00cc\u00ee?\u00ab{\u0087D!\u00ee?}}}}}}\u00ed?\u00fb\u00ceF}g\u00a3\u00ee?\t\u00ed%\u00b4\u0097\u00d0\u00ee?_\u00e8\u0085^\u00e8\u0085\u00ee?\u00ef\u00bd\u00f7\u00de{\u00ef\u00ed?\u0084\u00e5\u009eFX\u00ee\u00ed?\u00f1Tx*<\u00ee?nnnnnn\u00ee?\u00ce\u00f2$2\r\u00db\u00ed?x\u00dfY]\u0086\u00ed?\u009b\u00ed\u00d5\u0083F\u00ee?T:\u00b2g *\u00ed?\u008e\u00e38\u008e\u00e38\u00ee?\u0097\u0096\u0096\u0096\u0096\u0096\u00ee?\u008e\u00dc\u00c8\u008d\u00dc\u00c8\u00ed?Sa\u00e2\u00fd\u00c8i\u00ee?\u00e5\u00c3\u00b8_\u0097T\u00ee?6\u00ed\'K`\u00d3\u00ee?\u009e\u00e7y\u009e\u00e7y\u00ee?\u00c3\u00f5(\\\u008f\u00c2\u00ed?\u00f8\u00de{\u00ef\u00bd\u00f7\u00ee?\u008e\u00e38\u008e\u00e38\u00ee?\u00ee?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00ee?\u00de\u00dd\u00dd\u00dd\u00dd\u00dd\u00ed?n\u00db\u00b6m\u00db\u00b6\u00ed??\u00f0?\u00f0\u00ef?\u009e\u00e7y\u009e\u00e7y\u00ee?\u00cd\u00cc\u00cc\u00cc\u00cc\u00cc\u00ec?\u0098\u00d0^B{\t\u00ed?\u0083\u0097S\u00f0r\n\u00ee?\u009c\u00de\u00f4\u00a67\u00bd\u00e9?*\u00f2Y7\u0098"\u00ef?UUUUUU\u00ed?\b|\u00f0\u00c1\u00ef?\x00\x00\x00\x00\x00\x00\u00ef?\u00f8\u00de{\u00ef\u00bd\u00f7\u00ee?\u00ef\u00ee\u00ee\u00ee\u00ee\u00ee\u00ee?\u008d\u00b0\u00dc\u00d3\b\u00cb\u00ed?\x00\x00\x00\x00\x00\x00\u00f0?&\u00b4\u0097\u00d0^B\u00eb?\x00\x00\x00\x00\x00\x00\u00f0?\u00eaMoz\u00d3\u009b\u00ee?\u008c.\u00ba\u00e8\u00a2\u008b\u00ee?=\u00cf\u00f3<\u00cf\u00f3\u00ec?\x00\x00\x00\x00\x00\x00\u00f0?\u00cak(\u00af\u00a1\u00ec?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?<<<<<<\u00ec?\u00de\u00dd\u00dd\u00dd\u00dd\u00dd\u00ed?n\u00db\u00b6m\u00db\u00b6\u00ed?\x00\x00\x00\x00\x00\x00\u00f0?;\u00b1;\u00b1\u00eb?/\u00ba\u00e8\u00a2\u008b.\u00ea?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\u00c7q\u00c7q\u00ec?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00e8?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?UUUUUU\u00e5?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00e8?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?UUUUUU\u00e5?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00e0?\x00\x00\x00\x00\x00\u00c0\u00ef?\u0093\u00c9d\u00ba7_\u00ef?\u00c3\u0080\u00b8\u00fb\u00e9\u00ef?L(c\u00a2\u00b5\u00e4\u00ee?\u008e\tEc\u00cc\u00ee?\u00be\u00b2\u00f9\u0088\u00c0\u00ee?\u00a0>\u00a3\u00a6\u00c7\u00ba\u00ee?\u00adL\u00f7\u00b8\u00ee?(\u0080\u009a\u00b8\u00b6\u00ee?\u0080\u00f5\u0081\u00d3\u00b5\u00ee?\ts>g=\u00b5\u00ee?<U7"\u00cb\u00b4\u00ee?\u008ao\u00e4\u00c6\u008f\u00b4\u00ee?s\u00e8[k\u00b4\u00ee?\u00bf&@\u00b4\u00ee?\u00f4}\u00c58D\u00b4\u00ee?=\u009ep"9\u00b4\u00ee?\r\u00db(_1\u00b4\u00ee?\u008a\u009d\u00a5#\u00b4\u00ee?\u00ac\u00ae\u00e8\u00b4\u00ee?\u00bd\u00cc\u0084)\u00b4\u00ee?\u00ac\u00d5lL\u00b4\u00ee?\u00b6h\n\u00b4\u00ee?\u00edo8\u00fb\u00b3\u00ee?VF\u00e8\u00b3\u00ee?\u00a0wM\u00ca\u00f7\u00b3\u00ee?l\rm\u00f9\u00b3\u00ee?\u0098\x00=H\u00f0\u00b3\u00ee?\u00f3\u00f1C\u0094\u00ef\u00b3\u00ee?sRxg\u00e7\u00b3\u00ee?]\u00acc\u00ed\u00b3\u00ee?<:b:\u00d4\u00b3\u00ee?\u00e8\u00a1q<\u00e7\u00b3\u00ee?\u00b9Z1\u00cb\u00d7\u00b3\u00ee?\u00f7\u00f0\u00e1\u00b3\u00ee?\u008eE\\F\u00ec\u00b3\u00ee?`\u00b1\u00bb\u00ef\u00b3\u00ee?\u0096\u00bd\r\u00d1\u00b3\u00ee?L`\u00f2\u00e2\u00e8\u00b3\u00ee?\u00d9H\u0098T\u00ec\u00b3\u00ee?/\u00c4\u00e9\u00b3\u00ee?TA1\u00fc\u00b3\u00ee?\u009e\r\u008f\u00b7\u00f9\u00b3\u00ee?)b|\u00ff\u00f1\u00b3\u00ee?\u008b\u00ab\u00ec\u00b3\u00ee?\u00c2\u00c3\u00f57\u00ea\u00b3\u00ee?Tbn\u00da\u00fd\u00b3\u00ee?\u00b3\u0085 C\u00fa\u00b3\u00ee?\u00cc\u0097\u0098\u00e0\u00ef\u00b3\u00ee?\u0087S\u00be!\u00ed\u00b3\u00ee?\u00a1D\u00b8\u00e2\u00f2\u00b3\u00ee?\u00b9u\u0090\u00f2\u00b4\u00ee?-7\u0098o\u00eb\u00b3\u00ee?B\u00b6\u00d7\u00ed\u00b3\u00ee?\u00d8\u00d0^\x00\u00b4\u00ee?Y\u00a5\u00e3\u00fa\u00b3\u00ee?E,\u009c\u00ed\u00b3\u00ee?\x00\u00e5\u00f3\u00f2\u00b3\u00ee?\r\u00adF\u009e\u00fa\u00b3\u00ee?\u00c5\r\u00e7\u00d6\u00dc\u00b3\u00ee?[\u008dz\u00da\u00b3\u00ee?\u0098\u00b7"\u00e5\u00f4\u00b3\u00ee?X4P\u00b6\u00d7\u00b3\u00ee?k\u008b\u00cc\u00b9\u00f2\u00b3\u00ee?\u00bbL\u00c4\u0084\u00dc\u00b3\u00ee?\u00dasI8\b\u00b4\u00ee?+\u00d9\u00fc.\u00e8\u00b3\u00ee?\u00fd\u00fe]\r\u00de\u00b3\u00ee?Bm)D\u00ed\u00b3\u00ee?\u008bi\u00dbs\r\u00b4\u00ee?o\u00b8p\u0093\u00d1\u00b3\u00ee?p\u00d6q\f\u00b4\u00ee?\u0098\u00f1\u00c3\u00b3\u00ee?g\u00fd\u00f3\u00b3\u00ee?\u00c7\u00e4\u00eb\u00b3\u00ee?Sc\u00e1\u00b4\u00ee?&N\u00fb\u00b4\u00ee?Y\u00bf\u00d1\u0096\u00f4\u00b3\u00ee?\u00e7\u00c61\u00c4\u00b4\u00ee?83I\u00ef\u00b3\u00ee?\u00b8+\'\u008e\u00b4\u00ee?VM"0\u00ea\u00b3\u00ee?\u00f2\u00f7!\u00f3\u00b3\u00ee?\u00d2Tb\u00a8\u00b3\u00ee?\u00e3~$\u00b4\u00ee?\u00b7l!n\u00b4\u00ee?z\u008c\u0084\u00e6\u00b3\u00ee?\u00f8d\u0092\x00\u00b4\u00ee?\u00ae\u00ce\u00c8\u00b5\u00fe\u00b3\u00ee?#\u00ec \u00b4\u00ee?\u0081*_]\u00b4\u00ee?Q\u00b3\u0091\u00d1\u00b3\u00ee?\u00be6\u00a4\u00fe\u00b3\u00ee?\u0092\u00fc|\u00d8\u00fe\u00b3\u00ee?\u00f7\u00bd\'\u00f5\u00b4\u00ee?\u0091@\u00b5\u00fb\f\u00b4\u00ee?bN\u00d1\u00e9\u00b3\u00ee?"\u00a4f\u00d9\t\u00b4\u00ee?\u00a0nDb\n\u00b4\u00ee?X\u009d\u00b4\u00ee?O\u009bp\u0086\u00b4\u00ee?r\u00b0w\u00b4\u00ee?*\u00edP\u00b4\u00ee?3\b\x00\u00a4\u00b4\u00ee?\u00a1?\u00edA*\u00b4\u00ee?\u00bd\u00df\u00de\u008dr\u00b4\u00ee?\u00965\u00c5\u00e8\u00d9\u00b3\u00ee?\u00b3\u0098j\u00cc1\u00b4\u00ee?\u0083m\u008c\u00b7\u00dc\u00b3\u00ee?\u00b2\u0098\u0096\u00fb\u00b3\u00ee?\u00a4\u00d8\u00f6\u00833\u00b4\u00ee?5\u009e\u00b602\u00b4\u00ee?\u00e1\u00bf\u009e\u009c\u00f6\u00b3\u00ee?\u00d7\u00fe\u00c0z\u00b4\u00ee?\u00ec\u00ed)^\f\u00b4\u00ee?\u00fc\u009c\u008a\u00aa\u00b4\u00ee?\u00fd\\\u00f4\u00a02\u00b4\u00ee?5U\u00cd<\u00b4\u00ee?[;\u00a5\u00dc=\u00b4\u00ee?%\u00d7\u00c9@\u00b4\u00ee?\u0093\u00c4+\u00df\u00f5\u00b3\u00ee?\u00f0\u00bb\u00c4\u00f1(\u00b4\u00ee?\u00a2\u009ecf\u00b4\u00ee?\u0090\u00c7\u0090aU\u00b4\u00ee?\u00d61\u00b0e2\u00b4\u00ee??Q~\u0084"\u00b4\u00ee?#p\u00fd\u0080\u00b4\u00ee?\u00d2\u00fdMM\t\u00b4\u00ee?j\u00af\u0083\u00d0\u00e9\u00b3\u00ee?[w\u0085\u00b4\u00ee?U\u00e2S@\u00b0\u00b3\u00ee?j\u00e3=\u009b\u008f\u00b4\u00ee?F\u008d\u0094f\u00e1\u00b3\u00ee?e\u00d7\u00fd\u00f5\u00b3\u00ee?\u00d8\u00a7\u00c7$\u00be\u00b3\u00ee?\u00b4dX\u00b4\u00ee?\tXIAj\u00b4\u00ee?u\u00e6\u00991\u00d2\u00b3\u00ee?f=\x00\u00a9\u00f2\u00b3\u00ee?\u0082e\u0095\u00a1\u00b3\u00ee?\u00ae\u00de+\u00f9\u0088\u00b4\u00ee?\u00d5\u00e3\u00ecI\u0095\u00b3\u00ee?\u0095 w\u00a2J\u00b4\u00ee?\u008a\u00f6\u00e7\u00b7\u00b4\u00ee?\x00{\u00d6\u009f|\u00b4\u00ee?\u00ec%\u0082\u00b4\u00ee?\u00e3\u00a7\u00ad\u00c4,\u00b4\u00ee?\u009d\u00b70\u00b9\u00af\u00b4\u00ee?O\u00ea\u0084\u00ee\u00b4\u00ee?#T_\u0087q\u00b4\u00ee?4\u0088\u00ee&&\u00b4\u00ee?\u00cb\u00b4\u00ee?\u0090\u008aDu\u00b4\u00ee?TY.7\u00df\u00b4\u00ee?w\u0090\u0090\u00930\u00b4\u00ee?\u0083\u00ec6\u00c3\u00b4\u00ee?*\u00cf\u00b1^\u00b4\u00ee?\u0090\u00d7\u00bd>\u00b3\u00ee?\u0097\u00c6\u00a5CA\u00b4\u00ee?4D\u00e3\u0099\u00b3\u00b4\u00ee?oC\u00f1K!\u00b4\u00ee?2\u0085\u00b4\u00ee?\u00f2ZdH\u00b3\u00b3\u00ee?^;\u00aa\u00d7\u00b3\u00ee?w.\u00a6_\u00e5\u00b3\u00ee?\u00bbd\u0097\u0084\u00fb\u00b3\u00ee?ETS\u0088\u00b4\u00ee?\u009e%W\u00b4\u00ee?7w\u00ed\u00a5\u00e9\u00b3\u00ee?7K\r\u008f\u0093\u00b4\u00ee?\u00ff\u00f8c\u00ef\u00a4\u00b3\u00ee?F7\u00dd<\u00b4\u00ee?\u00cdQ\'\u00d3\u00b5\u00b4\u00ee?\u00c9\u0093\u00b4\u00ee?f)b\u00b5\u00ee?}x{7m\u00b3\u00ee?\u00e5$C\u00ddN\u00b5\u00ee?)\u00fe>*?\u00b3\u00ee?\u00f2\u00c5\u008a\u00b3\u00ee?\u00ee V\u00cf8\u00b3\u00ee?\u00acI\u00da%\u00b4\u00ee?1\u00daz^ \u00b3\u00ee?n=\u00a3x\u0082\u00b2\u00ee?3\u00c6\u0084\u009d\u00b4\u00ee?n\u008c\u00bd\u00f8\u00b3\u00ee?U]\u00bd\x00\u00b3\u00ee?\u00ce\u00a3\u00f6\u00ca\u00b3\u00ee?m\u00c5\u0087\u0087\u00b4\u00ee?!\u00ef,F\u00b3\u00ee?,\u00c8\u00b6Ir\u00b4\u00ee?=\u00fe\u00cd9\u00b3\u00ee?\u009a\u00a6p\u00f9\u00f6\u00b4\u00ee?m\u0099\u00e9\u00e4\u00b5\u00ee?\u0090Pl\u00df\u00f4\u00b3\u00ee?\u00e3\u00ecE\u00d0\u00b4\u00ee?>\u00d1\x00\u00b5\u00ee?\u00ec\u00c8\u0091P\u00d7\u00b3\u00ee?\u00d5seEI\u00b3\u00ee?F0\u0086d\u00b2\u00ee?\u00ed\u0083:?\u00b5\u00ee?\u008c\u00a1\u00a1\u00ef\u0098\u00b5\u00ee?\u008cB\u00c1\u00a9[\u00b3\u00ee?\u008f\u00ef\u009b\u0086\u00b4\u00ee?2\u00ec>\u00e8W\u00b6\u00ee?Y\u0088R\u00ebU\u00b2\u00ee?\u00cb\u00ae\u00f1J)\u00b4\u00ee?\u00e5<\u00f6\n\u00e5\u00b3\u00ee?\u009aNT\tM\u00b4\u00ee?IP|^\u00b3\u00ee?.\u00b9B\u00b4\u00ee?\x00I\u00bf\u00b7h\u00b2\u00ee??k\u00bb,\u0087\u00b5\u00ee?5\u00cbE@\u00e8\u00b4\u00ee?\u00ef\u00e6S\u00c2\u00b3\u00ee?\u00e0E\u0085\u0090K\u00b6\u00ee?\u00c2\u00ec\u00cd\u00b4\u00ee?\u0088:\u00d0,7\u00b2\u00ee?\u00e5\u00bb\u00daI\u00b6\u00ee?\u00f8\u0080e;\n\u00b4\u00ee?\u00d2\u00c3\u0091\u00b6\u00ee?w$M\u00c8S\u00b6\u00ee?\u00f2$G\u00a1\u00b3\u00ee?o\u0083\u0093c\u00b4\u00ee?w<\u009d)m\u00b4\u00ee?q}Em\u0093\u00b6\u00ee?\u008cM\u0091\u00e8V\u00b3\u00ee?f\r\u00b3\u00dc-\u00b3\u00ee?\u00df11\f\u00ce\u00b3\u00ee?+i\u009b\u00b9\u00b3\u00ee?~\u00a5\u00d2\u00b4\u00ee?\u00df\u00a5\u00be\u00f3\u0094\u00b6\u00ee?\u00ce\u00e4\u00b0\u00f7M\u00b3\u00ee?\u00e1\u0085\u00c0E\u00af\u00ee?\u00a4\u00c8O@\u00b4\u00ee?\u00bav\u00f6\u0099\u00b5\u00ee?O\u00876\u00ef\u00bc\u00b7\u00ee?\u00bd\u009f(\u00b0\u00a4\u00b4\u00ee?\u00d3\\\u00f1\u00ba\u00dc\u00b3\u00ee?\u0085\u00ad\u00e8\u00b5\u00ee?\u00e6\u00e7\u00c7!r\u00b0\u00ee?W\u00ca\u00f3C\u00c0\u00b1\u00ee?%}\u00ee\u00b6\u00c3\u00b2\u00ee?\u00b2y\x00K\u00a0\u00b6\u00ee?v\u0095_@\u008f\u00af\u00ee?\u00c2\u00cc\u00dff\u00e9\u00b3\u00ee?\u008c?\u009d\u00e2D\u00b4\u00ee?\u00d7\u00a7\u00c0d\u00a1\u00b2\u00ee?\u008d|\u009b\u00f4\'\u00b5\u00ee?\u0088\u00d3\u00c6\u00c4\u00af\u00ee?\u00d2b\u00b6\u00ad\u00b2\u00ee?\u00daL\u00fa\u00e4\u00b6\u00ee?]\u00e6\u0081\u00a4\u00b8\u00ee?\u00c8\u00a4\u00a5$w\u00b9\u00ee?\u00cam\u00e7\td\u00b4\u00ee?\u0093\u00ef\u00fd\bx\u00ae\u00ee?d"zi\u00b0\u00ee?k?\r\u00b7\u00ee?$\u00f3S\u00a8\u00b6\u00ee?&\u00b6\u009cy\u00c9\u00b6\u00ee?2G\u00ee\u00e2\u00b2\u00ee?A\u0099\u00a9\u00e4Z\u00b3\u00ee?L#.\u00d1\u00ef\u00b9\u00ee?\u00de\u0097{\u00a9\u00b9\u00ee?\u00e6H"\u00860\u00b8\u00ee?\u00d8\u00f4\u0095\u00cf\u00dc\u00b4\u00ee?\u00c2-x\u0099|\u00ba\u00ee?w\u0090\u009c\u00b2\u00b5\u00b8\u00ee?\u00c1\u00c4g\u00fb\u00b7\u00ee?\u00866\u00d9,\u00ac\u00b3\u00ee?\u00fcY\u00ad\u00b6\u00ee?V\u00c4c\u00b3\u00ee?|Q\u00f6\u00d0\u00e6\u00b4\u00ee?U\u00ffz\u00d59\u00b3\u00ee?\u0083Za\u00ac\u00ba\u00ee?#\u00ca\u00af\u0093S\u00b1\u00ee?\u00d9\u0083K\u00ae\u00dd\u00b2\u00ee?\u00bb\u0083pu\u00b3\u00ee?\u00f4H\t9\u00b0\u00ee?(8yJ\u00bc\u00ad\u00ee?\u00b5\u008f\u0098/\u00b3\u00ee?\u00a3\u00dc\u008e\u00c0\u00b3\u00ee?8\u00fb\u0089\u00d78\u00b8\u00ee?>T\u0089Q\u00b9\u00b2\u00ee?\u00ce\u0090~\u00b1\u00bc\u00b7\u00ee??\u00bf\u009cY\u00c6\u00b7\u00ee?%\u009bMc\u00b5\u00ee?\u00b9\u00be\u0090\u00eb\u00b9\u00ee?.cZ\u00b5\u00ee?g\u00f3\u0095\u009a\u0080\u00b4\u00ee?E!0\u008d\u00fc\u00b6\u00ee?x\u00bd]\u0088&\u00b2\u00ee?a\u0084\u00f1\u0099\u00b2\u00ee?2\u00ca\u00f2\u00a0{\u00ba\u00ee?7\r\u00ec\u008c%\u00b2\u00ee?2_G\u00fc+\u00b0\u00ee?\u00d4\u009e\u00ec\u008d\u009d\u00b7\u00ee?@\u00d3\u00ad\u00ed(\u00bd\u00ee?\u008cX\u00c5\u00b1\u00e9\u00b6\u00ee?z\u00ee4\u00f2\u00aa\u00ee?J\u00a9\u0089\u00b2\u00ee?\u0083N\b\u0098_\u00ae\u00ee?$)\u0088\u00d7\u00b7\u00ee?\u00b4xz\u00a7 \u00ba\u00ee?\u00f3U\u008f\u008a\u00f9\u00c1\u00ee?\u00a8\u008cB\u00dea\u00b5\u00ee?\u00dd\u0081C\u00d2P\u00ae\u00ee?\u00c1\u00eb\u00a9\u00a9\u0097\u00ab\u00ee?\u00cb\u00daSn\u00ae\u00ee?\u00f5I\u00d8\u00da4\u00aa\u00ee?s\u00ean\u00cb\u00fb\u00b7\u00ee?\u0089\u00fb3\u00c2\u00a5\u00ee?\u00d0\u00a0\u00ff\u009d\u00b3\u00ee?8\u00d1\u00ea\u00bf\u00ba\u00ee?L\u00f2\u00ee2\u00ac\u00ee?1\u00caT<\u00d7\u00ac\u00ee?@V\u0094\u00872\u00a6\u00ee?\u00909J\u00b7\u00af\u00ac\u00ee?\u00b9\u00e0\u00faJ\u0090\u00a4\u00ee?Z\u00ce\u00a5\u00cb\u00af\u00ee?U\u00d0\u00eaK\u00ad\u00ee?\u0082/6\u00af\u00b3\u00ee?\u00a8a\u00d3\u0098\u0081\u00b1\u00ee?5G\u00eeT\u00b9\u00ee?\u00cd:\\\u00a1\u009c\u00ee?\u00c2^\u00ec\u00d5\u00c1\u00ee?)\u00ae\u009bvi\u00d0\u00ee?\u00b9\u008a\u00ad\u00c5\u00aa\u00ee?@\u00a5\u00eby\u00ce\u00ce\u00ee?N\u00e5\u00af\u00ee?\u00b6\u00ea \u00f8\u00b3\u00be\u00ee?\u00c2\u0080\u00bcK\u0086\u00ba\u00ee?C\u0098\u00db\u008e]\u00b6\u00ee?\u008b$\u00c1 \u00c7\u00ab\u00ee?7Z\u00c8O\'\u00a7\u00ee?n\u008b\t\u00ff\u00d8\u00bd\u00ee?\u00f9\u00bc ;\u00cb\u00ee?\u00ebx\u00b8>\u00e7\u00af\u00ee?R\u009b6`y\u00a8\u00ee?\u00b0~\u00b8\u009f<\u00b0\u00ee?\u00b51@\u00ef\u00af\u00ee?H\u00f1\u00ea(Y\u00ba\u00ee?\u00c2i\u008cx\u00be\u00ee?\u00c4_\u00b4\u00b0\u00ee?"=P9\u00bb\u0085\u00ee?\u00cb\u00c6\u00bcLw\u0093\u00ee?\u00afi"2\u00b6\u00ee?c\u00a0\u00f5\u00d9\u00c9\u00ee?\u00df\u00efp<Z\u009c\u00ee?m\u00a5\u00a3]\u00f1\u00a3\u00ee?L/\u00aapS\u00a8\u00ee?\u00c2Z\u009aX\u00e6\u00a1\u00ee?\u00c92\u00fe_\u00dd\u008c\u00ee?IpP|4\u00ae\u00ee?\u00fb\u0084\u00e7\u00e6K\u00b7\u00ee?w|P\u00c8\u00ee?=yL,\u00cd\u00a8\u00ee?oS(>\u00c4\u00ee?\u00a10\u00b28\u00cc\u00ee?\u00e7Q\u00e2\u0091\u00aa\u00ee?n\u00c5\u00aa\u00feP\u00b7\u00ee?8\u00d4se\r\u0092\u00ee?\u0097c\u0085\u00c8\u00ee?UUUUU\u00d5\u00ee?\u00bcQ\u00860^\u00b5\u00ee?~w\u0093\u00ae\u00d8\u00ee?@\u00edc\u00ba\u00f5\u00a0\u00ee?\u00ea\u00a1\u00ea\u00a1\u00ee?\u00a0L\\\u00e9\u00de\u0080\u00ee?j0\u00ac\u00ce\u00d7\u00af\u00ee?\u00fe\u00dc \u00b2\u009c\u00da\u00ee?\u00c4\u00d5\u00c5nW\u009c\u00ee?\u00b3\u00ea\u009a\u00b0X\u00ef\u00ee?\u00da\u00ca%\u0089\u0081\u00ee\u00ee?Y#*\u00fb\u00ee?\u00d8\fS]9\u00b7\u00ee?\nv<\u00ae\u00ee?q\u00ae9D\u0098\u00ae\u00ee?4\u00d3\u00fa\u00df\u00a0\u00ee?\u00f8F\u0098tj\u00ee?\u00bc\u00bb\u00bb\u00bb\u00bb\u00bb\u00ee?e\u00c9@\u00d5\u00d7\u00ee?\u00c5\u00e3\u00a6\u008fD\u008f\u00ee?\u00e6\u009fq\u00e3}\u00ee?\u00b0+\u0085\u00bdV\u00c9\u00ee?\u00baPp\x00"\u00cb\u00ee?w|\n\u0086\u00bc\u00b7\u00ee?>G\u00deD=m\u00ee?\u00c0\u00fe\u00ecO\u00c0\u00ee?>\u00f9\u00a9\u00c2\u00cbp\u00ee?Mv7\u00ade\u00ee?\u00e9G?\u00fa\u00d1\u008f\u00ee?6\u00cfh\u009c5\u00ef?\u008b\u0097\u00e3\u008b\u00d7\u00ee?\u008a\u00b0\u00ab\u00d6\u00ee?\ts\u00d3\u00c2[v\u00ee?\u0097\u00e50\u0084\u00ee?s\u00f2\u009e\n\u00f9\u0088\u00ee?\u008c\u00d6B<\u00d9\u00ee?\u00bf`/\u00a8\u00ee?\u00b7m\u00db\u00b6m\u00db\u00ee?\u008e\u00e38\u008e\u00e38\u00ee?\u00a2\u00ferD\u008a\u00a1\u00ee?\u00f3R"x\u00a4\u00bf\u00ee?\u0089;\u00e2\u008e\u00b8#\u00ee?\u00ef\u00af\u00831+\u008d\u00ee?GX\u00eei\u0084\u00e5\u00ee?\u0092$I\u0092$\u00c9\u00ee?\u00dfG\u00a9\r\u00e7\u00f5\u00ee?]h\u0096+w\u00ee?\u00eb\u009f(\u00d8\u00b5\u00ee?\u00aa\u00ea\u009f\u00fa\u00a7\u00ee?\u00f9\u00f1\u00e3\u00c7\u008f\u00ef?8qj\u00ef\u00bc\u00ee?\u0098^z\u00e9\u00a5\u0097\u00ee?f5\u008a8t\u00d2\u00ee?\u00c7\u00beG\u00e4\u00e1\u00ee?\u0083\u00ab\u00db\u00c4\u0099\u00d6\u00ee?\u00f5\u00ea\u00d5\u00abW\u00af\u00ee?\u00ea\u00a0\u00ea\u00a0\u00ee?\u00d2\u0095\u00b3[\u00f8\u00ed?\u00c0\u008c\u0082\u0080\u00e6\u00fa\u00ee?$*\u00c86\u00ef?A\u00c3I\u00dd\u0097\u00c7\u00ee?q\u00b4 5\u00bb\u00ee?\u00dd\u00ea\u008cT\u00cc\u00ad\u00ee?<\u009f7c\u00ef?\u0098\u009e\u0085\u00e9Y\u0098\u00ee?\u00e1\u00e5\u00bc\u009c\u0082\u00ef?\u00e1\u00d6\u00deX\u00fd\u0081\u00ee?\u00b2\u0090\u0085,d!\u00ef?c\u00d9\u00f8fh\u00ed\u00ee?A\u00a4\u00f5\u00b69\u00ed?[\u00dc\u0084\u00f9]-\u00ee?\u00c7\\"<)H\u00ee?}g\u00a3\u00be\u00b3Q\u00ef?\u00e6\u00da\u0081\u00b9v`\u00ee?\u00ec\u00ad\r\u00d3\u00dc\u00ef?\u00d0\u00e7\u00f3\u00f9|>\u00ef?\u00b6\u00d6Zk\u00ad\u00b5\u00ee?\u00ee?I\u0092$I\u0092$\u00ef?\u00e9\u00f1]8\u0088\u00ef?W\u00f69\u00a4&\u00ef?\u00cc">\u0081Tr\u00ee?\u00ac\u008d\u00f5\u00a1\u00b1\u00ee?<\u00f5\u009d\u008d\u00fa\u00ee?`\u00fa\u00a5_\u00fa\u00a5\u00ef?\u009f\u00f4I\u009f\u00f4I\u00ef?]t\u00d1E\u00ed?\u00cd\u00cc\u00cc\u00cc\u00cc\u00cc\u00ee?\u00c4Y\u00f9\tqV\u00ee?\u00f2\u00e3\u00c7\u008f?\u00ee?\u00eaMoz\u00d3\u009b\u00ee?\u0084>\u00f8\u00e0\u0083\u00ef?~\u00e0~\u00e0\u00ee?\u008aK\u0086`m\u00ee?#,\u00f74\u00c2r\u00ef?\u00dcGp\u00c1\u00ed?\x00\x00\x00\x00\x00\x00\u00f0?\u00ae\u00ecsHM0\u00ee?\u00b8\u0085\u00ebQ\u00b8\u00ee?\u00ab\u00aa\u00aa\u00aa\u00aa\u00aa\u00ee?\u00eaMoz\u00d3\u009b\u00ee?\x00\x00\x00\x00\x00\x00\u00f0?F]t\u00d1E\u00ef?\u00d0\u00f4}A\u00ef?\u009e\u00e7y\u009e\u00e7y\u00ee?333333\u00ef?\u009e\u00d8\u0089\u009d\u00d8\u0089\u00ed?\u008e\u00e38\u008e\u00e38\u00ee?\u00ef?\b|\u00f0\u00c1\u00ef?\x00\x00\x00\x00\x00\x00\u00ee?\u00ef\u00ee\u00ee\u00ee\u00ee\u00ee\u00ee?GX\u00eei\u0084\u00e5\u00ee?\u00b7m\u00db\u00b6m\u00db\u00ee?\x00\x00\x00\x00\x00\x00\u00f0?\u00daKh/\u00a1\u00ed?\u00b8\u0085\u00ebQ\u00b8\u00ee?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\u00ab\u00aa\u00aa\u00aa\u00aa\u00aa\u00ee?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\u00eaMoz\u00d3\u009b\u00ee?\u008c.\u00ba\u00e8\u00a2\u008b\u00ee?\u009e\u00e7y\u009e\u00e7y\u00ee?\u00cd\u00cc\u00cc\u00cc\u00cc\u00cc\u00ec?\u00ab\u00aa\u00aa\u00aa\u00aa\u00aa\u00ea?\u00bc\u00bb\u00bb\u00bb\u00bb\u00bb\u00eb?\x00\x00\x00\x00\x00\x00\u00f0?\u009e\u00d8\u0089\u009d\u00d8\u0089\u00ed?UUUUUU\u00ed?\x00\x00\x00\x00\x00\x00\u00f0?/\u00ba\u00e8\u00a2\u008b.\u00ea?\u00c7q\u00c7q\u00ec?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00ec?\u00db\u00b6m\u00db\u00b6m\u00eb?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\x00\x00\x00\x00\x00\x00\u00f0?\u00ab\u00aa\u00aa\u00aa\u00aa\u00aa\u00ea?\x00\x00\x00\x00\x00\x00\u00f0?\u009a\u0099\u0099\u0099\u0099\u0099\u00e9?\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00f8R\x00\x00\u00c4=\x00\x00\u00c8=\x00\x00\u00cc=\x00\x00\u00d0=\x00\x00\u00d4=\x00\x00\u00d8=\x00\x00\u00dc=\x00\x00\u00e0=\x00\x00\u00e4=\x00\x00\u00e8=\x00\x00\u00ec=\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00c0T\x00\x00\u00d6T\x00\x00\u00e4T\x00\x00\u00f9T\x00\x00\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00!\x00\x00\x00(\x00\x00\x000\x00\x00\x00)\x00\x00\x00"\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00#\x00\x00\x00*\x00\x00\x001\x00\x00\x008\x00\x00\x009\x00\x00\x002\x00\x00\x00+\x00\x00\x00$\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00%\x00\x00\x00,\x00\x00\x003\x00\x00\x00:\x00\x00\x00;\x00\x00\x004\x00\x00\x00-\x00\x00\x00&\x00\x00\x00\x00\x00\x00\'\x00\x00\x00.\x00\x00\x005\x00\x00\x00<\x00\x00\x00=\x00\x00\x006\x00\x00\x00/\x00\x00\x007\x00\x00\x00>\x00\x00\x00?\x00\x00\x007\x00\x00\x00k\x00\x00O\x00\x00\u00fc\x00\x00\x00\u0082\x00\x00\u00fb\x00\x00\u00f0\x00\x00\u00a8\x00\x00\x00\x00\x00x\x00\x00X!\x00\x00h-\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00(\x00\x00\x003\x00\x00\x00=\x00\x00\x00\f\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00:\x00\x00\x00<\x00\x00\x007\x00\x00\x00\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00(\x00\x00\x009\x00\x00\x00E\x00\x00\x008\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x003\x00\x00\x00W\x00\x00\x00P\x00\x00\x00>\x00\x00\x00\x00\x00\x00\x00\x00\x00%\x00\x00\x008\x00\x00\x00D\x00\x00\x00m\x00\x00\x00g\x00\x00\x00M\x00\x00\x00\x00\x00\x00#\x00\x00\x007\x00\x00\x00@\x00\x00\x00Q\x00\x00\x00h\x00\x00\x00q\x00\x00\x00\\\x00\x00\x001\x00\x00\x00@\x00\x00\x00N\x00\x00\x00W\x00\x00\x00g\x00\x00\x00y\x00\x00\x00x\x00\x00\x00e\x00\x00\x00H\x00\x00\x00\\\x00\x00\x00_\x00\x00\x00b\x00\x00\x00p\x00\x00\x00d\x00\x00\x00g\x00\x00\x00c\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00/\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00B\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00\x00\x00\x00\x00\x00\x008\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00/\x00\x00\x00B\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00c\x00\x00\x00W\x00\x00-W\x00\x00MW\x00\x00rW\x00\x00\u008cW\x00\x00\u00abW\x00\x00\u00c0W\x00\x00\u00ddW\x00\x00X\x00\x00GX\x00\x00fX\x00\x00}X\x00\x00\u0093X\x00\x00\u00a7X\x00\x00\u00e4X\x00\x00Y\x00\x000Y\x00\x00SY\x00\x00\u008aY\x00\x00\u00c1Y\x00\x00\u00d8Y\x00\x00\u00f8Y\x00\x00"Z\x00\x00oZ\x00\x00\u008aZ\x00\x00\u00b5Z\x00\x00\u00d1Z\x00\x00\u00f6Z\x00\x00[\x00\x00A[\x00\x00T[\x00\x00i[\x00\x00|[\x00\x00\u008f[\x00\x00\u00b4[\x00\x00\u00c9[\x00\x00\u00dd[\x00\x00\u00fe[\x00\x00\\\x00\x00C\\\x00\x00k\\\x00\x00\u008c\\\x00\x00\u00ad\\\x00\x00\u00dc\\\x00\x00\u00ed\\\x00\x00\t]\x00\x00G]\x00\x00n]\x00\x00\u0095]\x00\x00\u00a9]\x00\x00\u00d7]\x00\x00\u00ff]\x00\x00^\x00\x00@^\x00\x00b^\x00\x00\u008c^\x00\x00\u00b7^\x00\x00\u00d5^\x00\x00_\x00\x00+_\x00\x00R_\x00\x00}_\x00\x00\u00aa_\x00\x00\u00da_\x00\x00`\x00\x001`\x00\x00T`\x00\x00r`\x00\x00\u0090`\x00\x00\u00c6`\x00\x00\u00f0`\x00\x00a\x00\x002a\x00\x00Ya\x00\x00na\x00\x00\u0082a\x00\x00\u00b7a\x00\x00\u00c7a\x00\x00b\x00\x00Gb\x00\x00qb\x00\x00\u009db\x00\x00\u00c4b\x00\x00\u00e0b\x00\x00c\x00\x00&c\x00\x00:c\x00\x00Qc\x00\x00^c\x00\x00\u0086c\x00\x00\u00bbc\x00\x00\u00f7c\x00\x00%d\x00\x00Fd\x00\x00md\x00\x00\u0086d\x00\x00\u00aed\x00\x00\u00d1d\x00\x00\u00e9d\x00\x00\re\x00\x002e\x00\x008e\x00\x00qe\x00\x00\u00abe\x00\x00\u00cae\x00\x00\u00d9e\x00\x00\u00f6e\x00\x00f\x00\x001f\x00\x00Jf\x00\x00cf\x00\x00\u00a5f\x00\x00\u00dff\x00\x00g\x00\x00Ig\x00\x00]g\x00\x00tg\x00\x00\u009ag\x00\x00\u00c1g\x00\x00h\x00\x00?h\x00\x00ph\x00\x00\u0094h\x00\x00\u00c2h\x00\x00\u00ddh\x00\x00i\x00\x00@i\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00!\x00\x00\x00(\x00\x00\x000\x00\x00\x00)\x00\x00\x00"\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00#\x00\x00\x00*\x00\x00\x001\x00\x00\x008\x00\x00\x009\x00\x00\x002\x00\x00\x00+\x00\x00\x00$\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00%\x00\x00\x00,\x00\x00\x003\x00\x00\x00:\x00\x00\x00;\x00\x00\x004\x00\x00\x00-\x00\x00\x00&\x00\x00\x00\x00\x00\x00\'\x00\x00\x00.\x00\x00\x005\x00\x00\x00<\x00\x00\x00=\x00\x00\x006\x00\x00\x00/\x00\x00\x007\x00\x00\x00>\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00!\x00\x00\x00(\x00\x00\x000\x00\x00\x00)\x00\x00\x00"\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00#\x00\x00\x00*\x00\x00\x001\x00\x00\x002\x00\x00\x00+\x00\x00\x00$\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00%\x00\x00\x00,\x00\x00\x003\x00\x00\x004\x00\x00\x00-\x00\x00\x00&\x00\x00\x00.\x00\x00\x005\x00\x00\x006\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00!\x00\x00\x00(\x00\x00\x00)\x00\x00\x00"\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00#\x00\x00\x00*\x00\x00\x00+\x00\x00\x00$\x00\x00\x00\x00\x00\x00%\x00\x00\x00,\x00\x00\x00-\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00!\x00\x00\x00"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00#\x00\x00\x00$\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\t\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00?\x00\x00\x00@\x00\x00\u0080>\x00\x00\x00\x00\x00\x00\u0088\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\r\x00\x00\x00\t\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00!\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"\x00\x00\x00#\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00&\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00%\x00\x00\x00\'\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00$\x00\x00\x00(\x00\x00\x00-\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00\x00\x00#\x00\x00\x00)\x00\x00\x00,\x00\x00\x00.\x00\x00\x00\x00\x00\x00!\x00\x00\x00"\x00\x00\x00*\x00\x00\x00+\x00\x00\x00/\x00\x00\x000\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00*\x00\x00\x00\x00\x00\x00\b\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00)\x00\x00\x00+\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00(\x00\x00\x00,\x00\x00\x005\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00\x00\x00\'\x00\x00\x00-\x00\x00\x004\x00\x00\x006\x00\x00\x00\x00\x00\x00\x00\x00\x00!\x00\x00\x00&\x00\x00\x00.\x00\x00\x003\x00\x00\x007\x00\x00\x00<\x00\x00\x00\x00\x00\x00"\x00\x00\x00%\x00\x00\x00/\x00\x00\x002\x00\x00\x008\x00\x00\x00;\x00\x00\x00=\x00\x00\x00#\x00\x00\x00$\x00\x00\x000\x00\x00\x001\x00\x00\x009\x00\x00\x00:\x00\x00\x00>\x00\x00\x00?\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00?\x00\x00\x00\x00\x00\x00\u00ff\x00\x00\x00\u00ff\x00\x00\u00ff\x00\x00\u00ff\x00\x00\u00ff\x00\x00\u00ff\x00\x00\u00ff?\x00\x00\u00ff\x00\x00\u0081Z\u0086%\b\u00d8\u00da\u00e5\x00\bo\x00\t6\x00!\n\x00#\r\x00\t\f\x00\n\r\x00\f\r\x00\u008fZ$%?&\u00f2,\'| (\u00b9*\u0082+\u00ef\f-\u00a1\t./0\\134@6\u00b18D9\u00f5\x00;\u00b7\x00< \u008a\x00>!h\x00?"N\x00 #;\x00!\t,\x00\u00a5%\u00e1Z@&LHA\'\r:C(\u00f1.D)&E*3F+\u00a8H,I-wJ.tK/\u00fbM0\u00f8\tN1a\bO203\u00cd24\u00de2536c47\u00d458\\69\u00f87:\u00a48;`9<%:=\u00f6\x00;>\u00cb\x00=?\u00ab\x00= \u008f\x00\u00c1A[PBMQC,ARD\u00d87SE\u00e8/TF<)VGy#WH\u00dfWI\u00a9HJNHK$JL\u009cJMkKNQ\rMO\u00b6M0@\n\u00d0Q2XXRMYS\u008eCZT\u00dd;[U\u00ee4\\V\u00ae.]W\u009a)VG%\u00d8YpU_Z\u00a9L`[\u00d9Da\\">c]$8c^\u00b42]V.\u00df`\u00a8VeaFOfb\u00e5Ggc\u00cfAhd=<c]^7if1RjgLkh9Fgc^A\u00e9j\'Vlk\u00e7Pmg\u0085Knm\u0097UokOP\u00eeoZpm"U\u00f0o\u00ebYqqZ\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\b\x00\x00\u00c0\t\x00\x00\u00c0\n\x00\x00\u00c0\x00\x00\u00c0\f\x00\x00\u00c0\r\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\u00c0\x00\x00\x00\u00b3\x00\x00\u00c3\x00\x00\u00c3\x00\x00\u00c3\x00\x00\u00c3\x00\x00\u00c3\x00\x00\u00c3\x00\x00\u00c3\b\x00\x00\u00c3\t\x00\x00\u00c3\n\x00\x00\u00c3\x00\x00\u00c3\f\x00\x00\u00c3\r\x00\x00\u00d3\x00\x00\u00c3\x00\x00\u00c3\x00\x00\f\u00bb\x00\f\u00c3\x00\f\u00c3\x00\f\u00c3\x00\f\u00d3\u0098P\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00ff\u00ff\u00ff\u00ff\u00ff\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\x00\x00\x00d\x00\x00\x00\u00e8\x00\x00\'\x00\x00\u00a0\u0086\x00@B\x00\u0080\u0096\u0098\x00\x00\u00e1\u00f5\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00fcq\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00ff\u00ff\u00ff\u00ff\u00ff\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00Can\'t allocate memory\x00Too big image\x00Invalid colour space\x00Invalid block size\x00length >= ARCFOUR_MIN_KEY_SIZE\x00arcfour.c\x00nettle_arcfour_set_key\x00length <= ARCFOUR_MAX_KEY_SIZE\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\t\n\x00\x00\x00\x00}\x00!1AQa"q2\u0081\u0091\u00a1\b#B\u00b1\u00c1R\u00d1\u00f0$3br\u0082\t\n%&\'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\u0083\u0084\u0085\u0086\u0087\u0088\u0089\u008a\u0092\u0093\u0094\u0095\u0096\u0097\u0098\u0099\u009a\u00a2\u00a3\u00a4\u00a5\u00a6\u00a7\u00a8\u00a9\u00aa\u00b2\u00b3\u00b4\u00b5\u00b6\u00b7\u00b8\u00b9\u00ba\u00c2\u00c3\u00c4\u00c5\u00c6\u00c7\u00c8\u00c9\u00ca\u00d2\u00d3\u00d4\u00d5\u00d6\u00d7\u00d8\u00d9\u00da\u00e1\u00e2\u00e3\u00e4\u00e5\u00e6\u00e7\u00e8\u00e9\u00ea\u00f1\u00f2\u00f3\u00f4\u00f5\u00f6\u00f7\u00f8\u00f9\u00fa\x00\x00\x00\x00\x00\x00\x00\x00\b\t\n\x00\x00\x00w\x00!1AQaq"2\u0081\bB\u0091\u00a1\u00b1\u00c1\t#3R\u00f0br\u00d1\n$4\u00e1%\u00f1&\'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\u0082\u0083\u0084\u0085\u0086\u0087\u0088\u0089\u008a\u0092\u0093\u0094\u0095\u0096\u0097\u0098\u0099\u009a\u00a2\u00a3\u00a4\u00a5\u00a6\u00a7\u00a8\u00a9\u00aa\u00b2\u00b3\u00b4\u00b5\u00b6\u00b7\u00b8\u00b9\u00ba\u00c2\u00c3\u00c4\u00c5\u00c6\u00c7\u00c8\u00c9\u00ca\u00d2\u00d3\u00d4\u00d5\u00d6\u00d7\u00d8\u00d9\u00da\u00e2\u00e3\u00e4\u00e5\u00e6\u00e7\u00e8\u00e9\u00ea\u00f2\u00f3\u00f4\u00f5\u00f6\u00f7\u00f8\u00f9\u00fa\u00ff\u00d9\x00\x00SOS\x00LSE\x00Bogus message code %d\x00ALIGN_TYPE is wrong, please fix\x00MAX_ALLOC_CHUNK is wrong, please fix\x00Bogus buffer control mode\x00Invalid component ID %d in SOS\x00Invalid crop request\x00DCT coefficient out of range\x00DCT scaled block size %dx%d not supported\x00Component index %d: mismatching sampling ratio %d:%d, %d:%d, %c\x00Bogus Huffman table definition\x00Bogus input colorspace\x00Bogus JPEG colorspace\x00Bogus marker length\x00Wrong JPEG library version: library is %d, caller expects %d\x00Sampling factors too large for interleaved scan\x00Invalid memory pool code %d\x00Unsupported JPEG data precision %d\x00Invalid progressive parameters Ss=%d Se=%d Ah=%d Al=%d\x00Invalid progressive parameters at scan script entry %d\x00Bogus sampling factors\x00Invalid scan script at entry %d\x00Improper call to JPEG library in state %d\x00JPEG parameter struct mismatch: library thinks size is %u, caller expects %u\x00Bogus virtual array access\x00Buffer passed to JPEG library is too small\x00Suspension not allowed here\x00CCIR601 sampling not implemented yet\x00Too many color components: %d, max %d\x00Unsupported color conversion request\x00Bogus DAC index %d\x00Bogus DAC value 0x%x\x00Bogus DHT index %d\x00Bogus DQT index %d\x00Empty JPEG image (DNL not supported)\x00Read from EMS failed\x00Write to EMS failed\x00Didn\'t expect more than one scan\x00Input file read error\x00Output file write error --- out of disk space?\x00Fractional sampling not implemented yet\x00Huffman code size table overflow\x00Missing Huffman code table entry\x00Maximum supported image dimension is %u pixels\x00Empty input file\x00Premature end of input file\x00Cannot transcode due to multiple use of quantization table %d\x00Scan script does not transmit all data\x00Invalid color quantization mode change\x00Not implemented yet\x00Requested feature was omitted at compile time\x00Arithmetic table 0x%02x was not defined\x00Backing store not supported\x00Huffman table 0x%02x was not defined\x00JPEG datastream contains no image\x00Quantization table 0x%02x was not defined\x00Not a JPEG file: starts with 0x%02x 0x%02x\x00Insufficient memory (case %d)\x00Cannot quantize more than %d color components\x00Cannot quantize to fewer than %d colors\x00Cannot quantize to more than %d colors\x00Invalid JPEG file structure: %s before SOF\x00Invalid JPEG file structure: two SOF markers\x00Invalid JPEG file structure: missing SOS marker\x00Unsupported JPEG process: SOF type 0x%02x\x00Invalid JPEG file structure: two SOI markers\x00Failed to create temporary file %s\x00Read failed on temporary file\x00Seek failed on temporary file\x00Write failed on temporary file --- out of disk space?\x00Application transferred too few scanlines\x00Unsupported marker type 0x%02x\x00Virtual array controller messed up\x00Image too wide for this implementation\x00Read from XMS failed\x00Write to XMS failed\x00Copyright (C) 2014, Thomas G. Lane, Guido Vollbeding\x009a  19-Jan-2014\x00Caution: quantization tables are too coarse for baseline JPEG\x00Adobe APP14 marker: version %d, flags 0x%04x 0x%04x, transform %d\x00Unknown APP0 marker (not JFIF), length %u\x00Unknown APP14 marker (not Adobe), length %u\x00Define Arithmetic Table 0x%02x: 0x%02x\x00Define Huffman Table 0x%02x\x00Define Quantization Table %d  precision %d\x00Define Restart Interval %u\x00Freed EMS handle %u\x00Obtained EMS handle %u\x00End Of Image\x00        %3d %3d %3d %3d %3d %3d %3d %3d\x00JFIF APP0 marker: version %d.%02d, density %dx%d  %d\x00Warning: thumbnail image size does not match data length %u\x00JFIF extension marker: type 0x%02x, length %u\x00    with %d x %d thumbnail image\x00Miscellaneous marker 0x%02x, length %u\x00Unexpected marker 0x%02x\x00        %4u %4u %4u %4u %4u %4u %4u %4u\x00Quantizing to %d = %d*%d*%d colors\x00Quantizing to %d colors\x00Selected %d colors for quantization\x00At marker 0x%02x, recovery action %d\x00RST%d\x00Smoothing not supported with nonstandard sampling ratios\x00Start Of Frame 0x%02x: width=%u, height=%u, components=%d\x00    Component %d: %dhx%dv q=%d\x00Start of Image\x00Start Of Scan: %d components\x00    Component %d: dc=%d ac=%d\x00  Ss=%d, Se=%d, Ah=%d, Al=%d\x00Closed temporary file %s\x00Opened temporary file %s\x00JFIF extension marker: JPEG-compressed thumbnail image, length %u\x00JFIF extension marker: palette thumbnail image, length %u\x00JFIF extension marker: RGB thumbnail image, length %u\x00Unrecognized component IDs %d %d %d, assuming YCbCr\x00Freed XMS handle %u\x00Obtained XMS handle %u\x00Unknown Adobe color transform code %d\x00Corrupt JPEG data: bad arithmetic code\x00Inconsistent progression sequence for component %d coefficient %d\x00Corrupt JPEG data: %u extraneous bytes before marker 0x%02x\x00Corrupt JPEG data: premature end of data segment\x00Corrupt JPEG data: bad Huffman code\x00Warning: unknown JFIF revision number %d.%02d\x00Premature end of JPEG file\x00Corrupt JPEG data: found marker 0x%02x instead of RST%d\x00Invalid SOS parameters for sequential JPEG\x00Application transferred too many scanlines\x00%s\n\x00JPEGMEM\x00%ld%c\x00T!"\rK\f\'hnopqb \b($\t\n%#\u0083\u0082}&*+<=>?CGJMXYZ[\\]^_`acdefgijklrstyz{|\x00Illegal byte sequence\x00Domain error\x00Result not representable\x00Not a tty\x00Permission denied\x00Operation not permitted\x00No such file or directory\x00No such process\x00File exists\x00Value too large for data type\x00No space left on device\x00Out of memory\x00Resource busy\x00Interrupted system call\x00Resource temporarily unavailable\x00Invalid seek\x00Cross-device link\x00Read-only file system\x00Directory not empty\x00Connection reset by peer\x00Operation timed out\x00Connection refused\x00Host is down\x00Host is unreachable\x00Address in use\x00Broken pipe\x00I/O error\x00No such device or address\x00Block device required\x00No such device\x00Not a directory\x00Is a directory\x00Text file busy\x00Exec format error\x00Invalid argument\x00Argument list too long\x00Symbolic link loop\x00Filename too long\x00Too many open files in system\x00No file descriptors available\x00Bad file descriptor\x00No child process\x00Bad address\x00File too large\x00Too many links\x00No locks available\x00Resource deadlock would occur\x00State not recoverable\x00Previous owner died\x00Operation canceled\x00Function not implemented\x00No message of desired type\x00Identifier removed\x00Device not a stream\x00No data available\x00Device timeout\x00Out of streams resources\x00Link has been severed\x00Protocol error\x00Bad message\x00File descriptor in bad state\x00Not a socket\x00Destination address required\x00Message too large\x00Protocol wrong type for socket\x00Protocol not available\x00Protocol not supported\x00Socket type not supported\x00Not supported\x00Protocol family not supported\x00Address family not supported by protocol\x00Address not available\x00Network is down\x00Network unreachable\x00Connection reset by network\x00Connection aborted\x00No buffer space available\x00Socket is connected\x00Socket not connected\x00Cannot send after socket shutdown\x00Operation already in progress\x00Operation in progress\x00Stale file handle\x00Remote I/O error\x00Quota exceeded\x00No medium found\x00Wrong medium type\x00No error information\x00\x00\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\x00\b\t\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\n\f\r !"#\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\n\f\r !"#\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\u00ff\x00\x00infinity\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\n\x00\t\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\n\x00\n\x00\x00\x00\t\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\f\x00\x00\x00\x00\f\x00\x00\x00\x00\t\f\x00\x00\x00\x00\x00\f\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x00\x00\x00\r\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\n\x00\x00\x00\x00\n\x00\x00\x00\x00\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\f\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\f\x00\x00\x00\x00\f\x00\x00\x00\x00\t\f\x00\x00\x00\x00\x00\f\x00\x00\f\x00\x000123456789ABCDEF-+   0X0x\x00(null)\x00-0X+0X 0X-0x+0x 0x\x00inf\x00INF\x00nan\x00NAN\x00.';var tempDoublePtr=Runtime.alignMemory(allocate(12,"i8",ALLOC_STATIC),8);assert(tempDoublePtr%8==0);function copyTempFloat(ptr){HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1]=HEAP8[ptr+1];HEAP8[tempDoublePtr+2]=HEAP8[ptr+2];HEAP8[tempDoublePtr+3]=HEAP8[ptr+3]}function copyTempDouble(ptr){HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1]=HEAP8[ptr+1];HEAP8[tempDoublePtr+2]=HEAP8[ptr+2];HEAP8[tempDoublePtr+3]=HEAP8[ptr+3];HEAP8[tempDoublePtr+4]=HEAP8[ptr+4];HEAP8[tempDoublePtr+5]=HEAP8[ptr+5];HEAP8[tempDoublePtr+6]=HEAP8[ptr+6];HEAP8[tempDoublePtr+7]=HEAP8[ptr+7]}Module["_i64Subtract"]=_i64Subtract;function ___setErrNo(value){if(Module["___errno_location"])HEAP32[Module["___errno_location"]()>>2]=value;return value}var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};function _sysconf(name){switch(name){case 30:return PAGE_SIZE;case 85:return totalMemory/PAGE_SIZE;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;case 79:return 0;case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1e3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:{if(typeof navigator==="object")return navigator["hardwareConcurrency"]||1;return 1}}___setErrNo(ERRNO_CODES.EINVAL);return-1}Module["_memset"]=_memset;var _BDtoILow=true;Module["_bitshift64Shl"]=_bitshift64Shl;function _abort(){Module["abort"]()}function ___assert_fail(condition,filename,line,func){ABORT=true;throw"Assertion failed: "+Pointer_stringify(condition)+", at: "+[filename?Pointer_stringify(filename):"unknown filename",line,func?Pointer_stringify(func):"unknown function"]+" at "+stackTrace()}var _emscripten_prep_setjmp=true;var _emscripten_check_longjmp=true;Module["_i64Add"]=_i64Add;var _emscripten_cleanup_setjmp=true;var _fabs=Math_abs;function _realloc(){throw"bad"}Module["_realloc"]=_realloc;Module["_saveSetjmp"]=_saveSetjmp;var _emscripten_get_longjmp_result=true;function __exit(status){Module["exit"](status)}function _exit(status){__exit(status)}Module["_bitshift64Lshr"]=_bitshift64Lshr;Module["_testSetjmp"]=_testSetjmp;function _longjmp(env,value){asm["setThrew"](env,value||1);throw"longjmp"}var _BDtoIHigh=true;function _pthread_cleanup_push(routine,arg){__ATEXIT__.push((function(){Runtime.dynCall("vi",routine,[arg])}));_pthread_cleanup_push.level=__ATEXIT__.length}function _emscripten_longjmp(env,value){_longjmp(env,value)}var _environ=allocate(1,"i32*",ALLOC_STATIC);var ___environ=_environ;function ___buildEnvironment(env){var MAX_ENV_VALUES=64;var TOTAL_ENV_SIZE=1024;var poolPtr;var envPtr;if(!___buildEnvironment.called){___buildEnvironment.called=true;ENV["USER"]=ENV["LOGNAME"]="web_user";ENV["PATH"]="/";ENV["PWD"]="/";ENV["HOME"]="/home/web_user";ENV["LANG"]="C";ENV["_"]=Module["thisProgram"];poolPtr=allocate(TOTAL_ENV_SIZE,"i8",ALLOC_STATIC);envPtr=allocate(MAX_ENV_VALUES*4,"i8*",ALLOC_STATIC);HEAP32[envPtr>>2]=poolPtr;HEAP32[_environ>>2]=envPtr}else{envPtr=HEAP32[_environ>>2];poolPtr=HEAP32[envPtr>>2]}var strings=[];var totalSize=0;for(var key in env){if(typeof env[key]==="string"){var line=key+"="+env[key];strings.push(line);totalSize+=line.length}}if(totalSize>TOTAL_ENV_SIZE){throw new Error("Environment size exceeded TOTAL_ENV_SIZE!")}var ptrSize=4;for(var i=0;i<strings.length;i++){var line=strings[i];writeAsciiToMemory(line,poolPtr);HEAP32[envPtr+i*ptrSize>>2]=poolPtr;poolPtr+=line.length+1}HEAP32[envPtr+strings.length*ptrSize>>2]=0}var ENV={};function _getenv(name){if(name===0)return 0;name=Pointer_stringify(name);if(!ENV.hasOwnProperty(name))return 0;if(_getenv.ret)_free(_getenv.ret);_getenv.ret=allocate(intArrayFromString(ENV[name]),"i8",ALLOC_NORMAL);return _getenv.ret}function _pthread_cleanup_pop(){assert(_pthread_cleanup_push.level==__ATEXIT__.length,"cannot pop if something else added meanwhile!");__ATEXIT__.pop();_pthread_cleanup_push.level=__ATEXIT__.length}function _emscripten_memcpy_big(dest,src,num){HEAPU8.set(HEAPU8.subarray(src,src+num),dest);return dest}Module["_memcpy"]=_memcpy;var SYSCALLS={varargs:0,get:(function(varargs){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret}),getStr:(function(){var ret=Pointer_stringify(SYSCALLS.get());return ret}),get64:(function(){var low=SYSCALLS.get(),high=SYSCALLS.get();if(low>=0)assert(high===0);else assert(high===-1);return low}),getZero:(function(){assert(SYSCALLS.get()===0)})};function ___syscall6(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();FS.close(stream);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}var _emscripten_setjmp=true;var _emscripten_postinvoke=true;function _sbrk(bytes){var self=_sbrk;if(!self.called){DYNAMICTOP=alignMemoryPage(DYNAMICTOP);self.called=true;assert(Runtime.dynamicAlloc);self.alloc=Runtime.dynamicAlloc;Runtime.dynamicAlloc=(function(){abort("cannot dynamically allocate, sbrk now has control")})}var ret=DYNAMICTOP;if(bytes!=0){var success=self.alloc(bytes);if(!success)return-1>>>0}return ret}var _emscripten_preinvoke=true;var _BItoD=true;function _time(ptr){var ret=Date.now()/1e3|0;if(ptr){HEAP32[ptr>>2]=ret}return ret}function _pthread_self(){return 0}function ___syscall140(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),offset_high=SYSCALLS.get(),offset_low=SYSCALLS.get(),result=SYSCALLS.get(),whence=SYSCALLS.get();var offset=offset_low;assert(offset_high===0);FS.llseek(stream,offset,whence);HEAP32[result>>2]=stream.position;if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall146(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.get(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();var ret=0;if(!___syscall146.buffer)___syscall146.buffer=[];var buffer=___syscall146.buffer;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){var curr=HEAPU8[ptr+j];if(curr===0||curr===10){Module["print"](UTF8ArrayToString(buffer,0));buffer.length=0}else{buffer.push(curr)}}ret+=len}return ret}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}___buildEnvironment(ENV);STACK_BASE=STACKTOP=Runtime.alignMemory(STATICTOP);staticSealed=true;STACK_MAX=STACK_BASE+TOTAL_STACK;DYNAMIC_BASE=DYNAMICTOP=Runtime.alignMemory(STACK_MAX);assert(DYNAMIC_BASE<TOTAL_MEMORY,"TOTAL_MEMORY not big enough for stack");var cttz_i8=allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0],"i8",ALLOC_DYNAMIC);function invoke_iiii(index,a1,a2,a3){try{return Module["dynCall_iiii"](index,a1,a2,a3)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_viiiii(index,a1,a2,a3,a4,a5){try{Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_vi(index,a1){try{Module["dynCall_vi"](index,a1)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_vii(index,a1,a2){try{Module["dynCall_vii"](index,a1,a2)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6){try{return Module["dynCall_iiiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_ii(index,a1){try{return Module["dynCall_ii"](index,a1)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_viii(index,a1,a2,a3){try{Module["dynCall_viii"](index,a1,a2,a3)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_iiiii(index,a1,a2,a3,a4){try{return Module["dynCall_iiiii"](index,a1,a2,a3,a4)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_iii(index,a1,a2){try{return Module["dynCall_iii"](index,a1,a2)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_iiiiii(index,a1,a2,a3,a4,a5){try{return Module["dynCall_iiiiii"](index,a1,a2,a3,a4,a5)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}Module.asmGlobalArg={"Math":Math,"Int8Array":Int8Array,"Int16Array":Int16Array,"Int32Array":Int32Array,"Uint8Array":Uint8Array,"Uint16Array":Uint16Array,"Uint32Array":Uint32Array,"Float32Array":Float32Array,"Float64Array":Float64Array,"NaN":NaN,"Infinity":Infinity};Module.asmLibraryArg={"abort":abort,"assert":assert,"invoke_iiii":invoke_iiii,"invoke_viiiii":invoke_viiiii,"invoke_vi":invoke_vi,"invoke_vii":invoke_vii,"invoke_iiiiiii":invoke_iiiiiii,"invoke_ii":invoke_ii,"invoke_viii":invoke_viii,"invoke_iiiii":invoke_iiiii,"invoke_iii":invoke_iii,"invoke_iiiiii":invoke_iiiiii,"_fabs":_fabs,"_pthread_cleanup_pop":_pthread_cleanup_pop,"_longjmp":_longjmp,"___buildEnvironment":___buildEnvironment,"__exit":__exit,"___assert_fail":___assert_fail,"_pthread_self":_pthread_self,"___syscall6":___syscall6,"___setErrNo":___setErrNo,"_abort":_abort,"_sbrk":_sbrk,"_getenv":_getenv,"_emscripten_longjmp":_emscripten_longjmp,"_pthread_cleanup_push":_pthread_cleanup_push,"_emscripten_memcpy_big":_emscripten_memcpy_big,"___syscall140":___syscall140,"_exit":_exit,"_time":_time,"_sysconf":_sysconf,"___syscall146":___syscall146,"STACKTOP":STACKTOP,"STACK_MAX":STACK_MAX,"tempDoublePtr":tempDoublePtr,"ABORT":ABORT,"cttz_i8":cttz_i8};// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer) {
"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.cttz_i8|0;var n=0;var o=0;var p=0;var q=0;var r=global.NaN,s=global.Infinity;var t=0,u=0,v=0,w=0,x=0.0,y=0,z=0,A=0,B=0.0;var C=0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=global.Math.floor;var N=global.Math.abs;var O=global.Math.sqrt;var P=global.Math.pow;var Q=global.Math.cos;var R=global.Math.sin;var S=global.Math.tan;var T=global.Math.acos;var U=global.Math.asin;var V=global.Math.atan;var W=global.Math.atan2;var X=global.Math.exp;var Y=global.Math.log;var Z=global.Math.ceil;var _=global.Math.imul;var $=global.Math.min;var aa=global.Math.clz32;var ba=env.abort;var ca=env.assert;var da=env.invoke_iiii;var ea=env.invoke_viiiii;var fa=env.invoke_vi;var ga=env.invoke_vii;var ha=env.invoke_iiiiiii;var ia=env.invoke_ii;var ja=env.invoke_viii;var ka=env.invoke_iiiii;var la=env.invoke_iii;var ma=env.invoke_iiiiii;var na=env._fabs;var oa=env._pthread_cleanup_pop;var pa=env._longjmp;var qa=env.___buildEnvironment;var ra=env.__exit;var sa=env.___assert_fail;var ta=env._pthread_self;var ua=env.___syscall6;var va=env.___setErrNo;var wa=env._abort;var xa=env._sbrk;var ya=env._getenv;var za=env._emscripten_longjmp;var Aa=env._pthread_cleanup_push;var Ba=env._emscripten_memcpy_big;var Ca=env.___syscall140;var Da=env._exit;var Ea=env._time;var Fa=env._sysconf;var Ga=env.___syscall146;var Ha=0.0;
// EMSCRIPTEN_START_FUNCS
function Sa(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+15&-16;return b|0}function Ta(){return i|0}function Ua(a){a=a|0;i=a}function Va(a,b){a=a|0;b=b|0;i=a;j=b}function Wa(a,b){a=a|0;b=b|0;if(!n){n=a;o=b}}function Xa(b){b=b|0;a[k>>0]=a[b>>0];a[k+1>>0]=a[b+1>>0];a[k+2>>0]=a[b+2>>0];a[k+3>>0]=a[b+3>>0]}function Ya(b){b=b|0;a[k>>0]=a[b>>0];a[k+1>>0]=a[b+1>>0];a[k+2>>0]=a[b+2>>0];a[k+3>>0]=a[b+3>>0];a[k+4>>0]=a[b+4>>0];a[k+5>>0]=a[b+5>>0];a[k+6>>0]=a[b+6>>0];a[k+7>>0]=a[b+7>>0]}function Za(a){a=a|0;C=a}function _a(){return C|0}function $a(a,b){a=a|0;b=b|0;Ac(15680)|0;c[3920]=1;c[3921]=1;return 0}function ab(a){a=a|0;La[c[(c[a>>2]|0)+12>>2]&15](a,21496);pa(15928,1)}function bb(a,b){a=a|0;b=b|0;return}function cb(){c[3964]=0;c[3965]=c[4066];c[3966]=c[4067];c[3967]=c[4064];c[3968]=c[4065];return 15856}function db(){var a=0,b=0,d=0,e=0,f=0;f=4;e=jf(40)|0;c[e>>2]=0;c[2]=15680;f=uf(15928,2,e|0,f|0)|0;e=C;n=0;a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,f|0,e|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;a=C;switch(b|0){case 1:{b=10;break}case 2:{b=3;break}default:{a=0;b=3}}a:while(1)if((b|0)==3){if(a){n=0;fa(2,8);a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,f|0,e|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;a=C;switch(b|0){case 2:{b=3;continue a}case 1:{b=10;continue a}default:{b=5;break a}}}n=0;ja(1,8,90,488);a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,f|0,e|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;a=C;switch(b|0){case 2:{b=3;continue a}case 1:{b=10;continue a}default:{}}n=0;ja(2,8,c[3953]|0,c[3954]|0);a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,f|0,e|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;a=C;switch(b|0){case 2:{b=3;continue a}case 1:{b=10;continue a}default:{}}f=uf(15928,1,f|0,e|0)|0;e=C;n=0;a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,f|0,e|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;a=C;switch(b|0){case 2:{b=3;continue a}case 1:{b=10;continue a}default:{}}a=0;b=10;continue}else if((b|0)==10){if(a){n=0;fa(3,16084);a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,f|0,e|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;a=C;switch(b|0){case 2:{b=3;continue a}case 1:{b=10;continue a}default:{}}n=0;fa(2,8);a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,f|0,e|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;a=C;switch(b|0){case 2:{b=3;continue a}case 1:{b=10;continue a}default:{b=13;break a}}}n=0;a=da(4,16084,8,21240)|0;b=n;n=0;if((b|0)!=0&(o|0)!=0){d=wf(c[b>>2]|0,f|0,e|0)|0;if(!d)pa(b|0,o|0);C=o}else d=-1;b=C;switch(d|0){case 2:{a=b;b=3;continue a}case 1:{a=b;b=10;continue a}default:{}}if((a|0)==(c[4063]|0)){b=18;break}n=0;fa(2,8);b=n;n=0;if((b|0)!=0&(o|0)!=0){d=wf(c[b>>2]|0,f|0,e|0)|0;if(!d)pa(b|0,o|0);C=o}else d=-1;b=C;switch(d|0){case 2:{a=b;b=3;continue a}case 1:{a=b;b=10;continue a}default:{b=17;break a}}}if((b|0)==5)a=21496;else if((b|0)==13)a=21496;else if((b|0)!=17)if((b|0)==18){c[3955]=c[4024];c[3956]=c[4025];c[3957]=c[4026];c[3958]=c[4027];c[3959]=c[4028];c[3960]=16116;c[3961]=16144;c[3962]=16172;c[3963]=16200;a=0}kf(f|0);return a|0}function eb(){var a=0,b=0,d=0,e=0,f=0,g=0,h=0;h=i;i=i+448|0;g=4;f=jf(40)|0;c[f>>2]=0;d=h;e=h+440|0;c[d>>2]=15680;g=uf(15928,1,f|0,g|0)|0;f=C;n=0;a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,g|0,f|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;if((b|0)==1)a=C;else a=0;while(1){if(a){n=0;fa(4,d|0);a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,g|0,f|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;if((b|0)==1){a=C;continue}else{b=5;break}}c[e>>2]=c[3954];n=0;ja(3,d|0,90,440);a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,g|0,f|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;if((b|0)==1){a=C;continue}n=0;ja(4,d|0,15812,e|0);a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,g|0,f|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;if((b|0)==1){a=C;continue}n=0;ga(2,16084,d|0);a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,g|0,f|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;if((b|0)==1){a=C;continue}n=0;fa(5,d|0);a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,g|0,f|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;if((b|0)==1){a=C;continue}c[3954]=c[e>>2];n=0;fa(4,d|0);a=n;n=0;if((a|0)!=0&(o|0)!=0){b=wf(c[a>>2]|0,g|0,f|0)|0;if(!b)pa(a|0,o|0);C=o}else b=-1;if((b|0)==1)a=C;else{b=11;break}}if((b|0)==5)a=21496;else if((b|0)==11)a=0;kf(g|0);i=h;return a|0}function fb(){lb(16084);_b(8);return}function gb(a){a=a|0;return mb(16084,c[3954]|0,c[3953]|0,a)|0}function hb(){nb(16084);return}function ib(){var a=0,b=0,d=0;a=i;i=i+32|0;b=a;c[b>>2]=0;c[b+4>>2]=0;c[b+8>>2]=0;c[b+12>>2]=0;c[b+16>>2]=0;c[b+20>>2]=0;c[b+24>>2]=0;d=c[3953]|0;c[b>>2]=d;d=d+(c[4050]|0)|0;c[b+4>>2]=d;d=d+(c[4051]|0)|0;c[b+8>>2]=d;d=d+(c[4052]|0)|0;c[b+12>>2]=d;d=d+(c[4053]|0)|0;c[b+16>>2]=d;d=d+(c[4054]|0)|0;c[b+20>>2]=d;c[b+24>>2]=d+(c[4055]|0);ob(16084,b);i=a;return}function jb(e,f,g){e=e|0;f=f|0;g=g|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0;Y=i;i=i+432|0;l=Y+152|0;m=Y+148|0;n=Y+144|0;o=Y+140|0;j=Y+136|0;k=Y+132|0;y=Y+128|0;V=Y+124|0;u=Y+120|0;Q=Y+116|0;T=Y+112|0;v=Y+108|0;N=Y+104|0;L=Y+100|0;t=Y+96|0;U=Y+92|0;O=Y+88|0;p=Y+84|0;z=Y+80|0;X=Y+76|0;W=Y+72|0;q=Y+68|0;s=Y+156|0;C=Y+418|0;B=Y+417|0;P=Y+416|0;A=Y+64|0;E=Y+60|0;M=Y+56|0;x=Y+52|0;K=Y+48|0;w=Y+44|0;R=Y+16|0;H=Y+8|0;S=Y;J=Y+40|0;I=Y+36|0;D=Y+32|0;r=Y+158|0;G=Y+28|0;F=Y+24|0;c[m>>2]=e;c[n>>2]=f;c[o>>2]=g;c[c[m>>2]>>2]=c[n>>2];c[(c[m>>2]|0)+144>>2]=0;c[(c[m>>2]|0)+148>>2]=0;c[(c[m>>2]|0)+152>>2]=0;c[(c[m>>2]|0)+156>>2]=0;c[(c[m>>2]|0)+160>>2]=0;c[(c[m>>2]|0)+164>>2]=0;$b(c[n>>2]|0,1)|0;if((c[(c[n>>2]|0)+40>>2]|0)!=3?(c[(c[n>>2]|0)+40>>2]|0)!=1:0){c[l>>2]=c[4066];X=c[l>>2]|0;i=Y;return X|0}if((_(c[(c[n>>2]|0)+428>>2]|0,c[(c[n>>2]|0)+428>>2]|0)|0)!=64){c[l>>2]=c[4067];X=c[l>>2]|0;i=Y;return X|0}c[j>>2]=zc(c[n>>2]|0)|0;c[(c[m>>2]|0)+4>>2]=c[j>>2];c[k>>2]=c[(c[n>>2]|0)+216>>2];c[(c[m>>2]|0)+8>>2]=c[k>>2];c[y>>2]=_((((c[(c[k>>2]|0)+28>>2]|0)+(c[(c[k>>2]|0)+8>>2]|0)-1|0)>>>0)/((c[(c[k>>2]|0)+8>>2]|0)>>>0)|0,c[(c[k>>2]|0)+8>>2]|0)|0;c[V>>2]=_((((c[(c[k>>2]|0)+32>>2]|0)+(c[(c[k>>2]|0)+12>>2]|0)-1|0)>>>0)/((c[(c[k>>2]|0)+12>>2]|0)>>>0)|0,c[(c[k>>2]|0)+12>>2]|0)|0;if((c[V>>2]|0)!=0?(((((4294967295/((c[y>>2]|0)>>>0)|0)>>>0)/((c[V>>2]|0)>>>0)|0)>>>0)/64|0|0)==0:0){c[l>>2]=c[4065];X=c[l>>2]|0;i=Y;return X|0}c[(c[m>>2]|0)+12>>2]=c[y>>2];c[(c[m>>2]|0)+12+4>>2]=c[V>>2];c[u>>2]=(_(c[y>>2]|0,c[V>>2]|0)|0)<<6;c[(c[m>>2]|0)+12+8>>2]=c[u>>2];c[Q>>2]=0;c[T>>2]=0;c[v>>2]=0;c[N>>2]=0;c[L>>2]=0;if((c[u>>2]|0)!=0?(c[Q>>2]=lf(c[u>>2]|0,4)|0,c[T>>2]=lf(((c[u>>2]|0)>>>0)/8|0,1)|0,c[v>>2]=lf(((c[u>>2]|0)>>>0)/8|0,1)|0,c[N>>2]=lf(((c[u>>2]|0)>>>0)/8|0,1)|0,c[L>>2]=lf(((c[u>>2]|0)>>>0)/8|0,1)|0,(c[Q>>2]|0)==0|(c[T>>2]|0)==0|(c[v>>2]|0)==0|(c[N>>2]|0)==0|(c[L>>2]|0)==0):0){kf(c[Q>>2]|0);kf(c[T>>2]|0);kf(c[v>>2]|0);kf(c[N>>2]|0);kf(c[L>>2]|0);c[l>>2]=c[4064];X=c[l>>2]|0;i=Y;return X|0}c[(c[m>>2]|0)+144>>2]=c[Q>>2];c[(c[m>>2]|0)+152>>2]=c[T>>2];c[(c[m>>2]|0)+156>>2]=c[v>>2];c[(c[m>>2]|0)+160>>2]=c[N>>2];c[(c[m>>2]|0)+164>>2]=c[L>>2];c[t>>2]=c[c[j>>2]>>2];c[U>>2]=0;c[O>>2]=0;c[z>>2]=0;c[X>>2]=0;while(1){if((c[X>>2]|0)>>>0>=(c[V>>2]|0)>>>0)break;c[p>>2]=Ra[c[(c[(c[n>>2]|0)+4>>2]|0)+32>>2]&3](c[n>>2]|0,c[t>>2]|0,c[X>>2]|0,1,0)|0;c[W>>2]=0;while(1){if((c[W>>2]|0)>>>0>=(c[y>>2]|0)>>>0)break;c[z>>2]=(c[z>>2]|0)+1;c[q>>2]=0;while(1){if((c[q>>2]|0)>>>0>=63)break;b[s>>1]=b[(c[c[p>>2]>>2]|0)+(c[W>>2]<<7)+(c[16272+(c[q>>2]<<2)>>2]<<1)>>1]|0;a[C>>0]=(b[s>>1]|0)!=0&1;if((b[s>>1]|0)==-1)j=1;else j=(b[s>>1]|0)==1;a[B>>0]=j&1;c[U>>2]=(c[U>>2]|0)+(a[C>>0]&1);c[O>>2]=(c[O>>2]|0)+(a[B>>0]&1);a[P>>0]=(((b[s>>1]|0)%2|0|0)!=0|0)==((b[s>>1]|0)>0|0)&1;g=(c[T>>2]|0)+((c[z>>2]|0)>>>3)|0;a[g>>0]=d[g>>0]|(a[C>>0]&1)<<(c[z>>2]&7);g=(c[v>>2]|0)+((c[z>>2]|0)>>>3)|0;a[g>>0]=d[g>>0]|(a[P>>0]&1)<<(c[z>>2]&7);g=(c[N>>2]|0)+((c[z>>2]|0)>>>3)|0;a[g>>0]=d[g>>0]|(a[B>>0]&1)<<(c[z>>2]&7);c[z>>2]=(c[z>>2]|0)+1;c[q>>2]=(c[q>>2]|0)+1}c[W>>2]=(c[W>>2]|0)+1}c[X>>2]=(c[X>>2]|0)+1}c[(c[m>>2]|0)+12+12>>2]=c[U>>2];c[(c[m>>2]|0)+12+16>>2]=c[O>>2];c[(c[m>>2]|0)+12+20>>2]=(((c[U>>2]|0)-(c[O>>2]|0)|0)>>>0)/8|0;c[(c[m>>2]|0)+12+48>>2]=((c[U>>2]|0)>>>0)/8|0;c[(c[m>>2]|0)+12+76>>2]=(((c[U>>2]|0)-(((c[O>>2]|0)>>>0)/2|0)|0)>>>0)/8|0;c[(c[m>>2]|0)+12+104>>2]=c[(c[m>>2]|0)+12+48>>2];c[A>>2]=1;while(1){if((c[A>>2]|0)>>>0>=7)break;c[E>>2]=(c[A>>2]|0)+1;c[M>>2]=(1<<c[E>>2])-1;c[x>>2]=((_((((c[U>>2]|0)-(c[O>>2]|0)|0)>>>0)/((c[M>>2]|0)>>>0)|0,c[E>>2]|0)|0)>>>0)/8|0;c[K>>2]=((_(((c[U>>2]|0)>>>0)/((c[M>>2]|0)>>>0)|0,c[E>>2]|0)|0)>>>0)/8|0;c[w>>2]=0;h[R>>3]=+((c[O>>2]|0)>>>0)/+((c[U>>2]|0)>>>0);if(+h[R>>3]!=1.0){h[H>>3]=+(c[M>>2]|0);h[S>>3]=1.0;c[J>>2]=c[16524+((c[E>>2]|0)-2<<2)>>2];c[I>>2]=c[16548+((c[E>>2]|0)-2<<2)>>2];c[D>>2]=0;while(1){if((c[D>>2]|0)>>>0>=(c[J>>2]|0)>>>0)break;h[S>>3]=+h[S>>3]*(+h[(c[I>>2]|0)+(c[D>>2]<<3)>>3]*+h[R>>3]);h[H>>3]=+h[H>>3]+ +h[S>>3];c[D>>2]=(c[D>>2]|0)+1}h[H>>3]=+h[H>>3]+ +h[S>>3]*+h[R>>3]/(1.0-+h[R>>3]);c[w>>2]=~~(+((c[U>>2]|0)>>>0)/+h[H>>3]*+(c[E>>2]|0)/8.0)>>>0}if((c[w>>2]|0)>>>0<(c[x>>2]|0)>>>0)c[w>>2]=c[x>>2];if((c[w>>2]|0)>>>0>(c[K>>2]|0)>>>0)c[w>>2]=c[K>>2];c[(c[m>>2]|0)+12+20+(c[A>>2]<<2)>>2]=c[x>>2];c[(c[m>>2]|0)+12+48+(c[A>>2]<<2)>>2]=c[K>>2];c[(c[m>>2]|0)+12+76+(c[A>>2]<<2)>>2]=c[w>>2];c[(c[m>>2]|0)+12+104+(c[A>>2]<<2)>>2]=c[(c[m>>2]|0)+12+48+(c[A>>2]<<2)>>2];c[A>>2]=(c[A>>2]|0)+1}qb(r,256,c[o>>2]|0);pb(r,c[u>>2]|0,c[Q>>2]|0);c[G>>2]=c[(c[m>>2]|0)+12+48>>2];c[F>>2]=0;if((c[G>>2]|0)!=0?(c[F>>2]=lf(c[G>>2]|0,1)|0,(c[F>>2]|0)==0):0){kf(c[Q>>2]|0);kf(c[T>>2]|0);kf(c[v>>2]|0);kf(c[N>>2]|0);kf(c[L>>2]|0);c[l>>2]=c[4064];X=c[l>>2]|0;i=Y;return X|0}rb(r,c[G>>2]|0,c[F>>2]|0,c[F>>2]|0);c[(c[m>>2]|0)+148>>2]=c[F>>2];c[l>>2]=c[4063];X=c[l>>2]|0;i=Y;return X|0}function kb(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;t=i;i=i+64|0;f=t+48|0;g=t+44|0;m=t+40|0;k=t+36|0;n=t+32|0;q=t+28|0;p=t+24|0;h=t+20|0;o=t+16|0;s=t+12|0;r=t+8|0;j=t+4|0;l=t;c[f>>2]=a;c[g>>2]=e;c[m>>2]=c[c[f>>2]>>2];c[k>>2]=c[c[(c[f>>2]|0)+4>>2]>>2];c[n>>2]=c[(c[f>>2]|0)+12>>2];c[q>>2]=c[(c[f>>2]|0)+12+4>>2];c[p>>2]=c[(c[f>>2]|0)+164>>2];c[o>>2]=0;c[s>>2]=0;while(1){e=c[m>>2]|0;if((c[s>>2]|0)>>>0>=(c[q>>2]|0)>>>0)break;c[h>>2]=Ra[c[(c[e+4>>2]|0)+32>>2]&3](c[m>>2]|0,c[k>>2]|0,c[s>>2]|0,1,1)|0;c[r>>2]=0;while(1){if((c[r>>2]|0)>>>0>=(c[n>>2]|0)>>>0)break;c[o>>2]=(c[o>>2]|0)+1;c[j>>2]=0;while(1){if((c[j>>2]|0)>>>0>=63)break;do if(d[(c[p>>2]|0)+((c[o>>2]|0)>>>3)>>0]>>(c[o>>2]&7)&1){e=(c[c[h>>2]>>2]|0)+(c[r>>2]<<7)+(c[16272+(c[j>>2]<<2)>>2]<<1)|0;a=b[e>>1]|0;if((b[(c[c[h>>2]>>2]|0)+(c[r>>2]<<7)+(c[16272+(c[j>>2]<<2)>>2]<<1)>>1]|0)>0){b[e>>1]=a+-1<<16>>16;break}else{b[e>>1]=a+1<<16>>16;break}}while(0);c[o>>2]=(c[o>>2]|0)+1;c[j>>2]=(c[j>>2]|0)+1}c[r>>2]=(c[r>>2]|0)+1}c[s>>2]=(c[s>>2]|0)+1}Vb(e,c[g>>2]|0);if(c[(c[m>>2]|0)+224>>2]|0)Rb(c[g>>2]|0);c[(c[g>>2]|0)+216>>2]=1;Ub(c[g>>2]|0,c[(c[f>>2]|0)+4>>2]|0);c[l>>2]=c[(c[f>>2]|0)+8>>2];s=_((((c[(c[l>>2]|0)+28>>2]|0)+(c[(c[l>>2]|0)+56>>2]|0)-1|0)>>>0)/((c[(c[l>>2]|0)+56>>2]|0)>>>0)|0,c[(c[l>>2]|0)+56>>2]|0)|0;c[(c[(c[g>>2]|0)+84>>2]|0)+28>>2]=s;s=_((((c[(c[l>>2]|0)+32>>2]|0)+(c[(c[l>>2]|0)+60>>2]|0)-1|0)>>>0)/((c[(c[l>>2]|0)+60>>2]|0)>>>0)|0,c[(c[l>>2]|0)+60>>2]|0)|0;c[(c[(c[g>>2]|0)+84>>2]|0)+32>>2]=s;i=t;return}function lb(a){a=a|0;var b=0,d=0;b=i;i=i+16|0;d=b;c[d>>2]=a;kf(c[(c[d>>2]|0)+144>>2]|0);kf(c[(c[d>>2]|0)+148>>2]|0);kf(c[(c[d>>2]|0)+152>>2]|0);kf(c[(c[d>>2]|0)+156>>2]|0);kf(c[(c[d>>2]|0)+160>>2]|0);kf(c[(c[d>>2]|0)+164>>2]|0);i=b;return}function mb(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;L=i;i=i+752|0;M=L+612|0;n=L+608|0;o=L+604|0;p=L+600|0;t=L+596|0;J=L+592|0;D=L+588|0;K=L+584|0;v=L+580|0;H=L+576|0;F=L+572|0;y=L+568|0;u=L+564|0;j=L+560|0;k=L+556|0;h=L+552|0;m=L+743|0;l=L+548|0;G=L+544|0;w=L+540|0;s=L+536|0;E=L+532|0;x=L+528|0;q=L+524|0;r=L+520|0;C=L+12|0;I=L+616|0;A=L+8|0;B=L+4|0;z=L;c[M>>2]=b;c[n>>2]=e;c[o>>2]=f;c[p>>2]=g;c[t>>2]=c[(c[M>>2]|0)+12+8>>2];c[J>>2]=c[(c[M>>2]|0)+144>>2];c[D>>2]=c[(c[M>>2]|0)+148>>2];c[K>>2]=c[(c[M>>2]|0)+152>>2];c[v>>2]=c[(c[M>>2]|0)+156>>2];c[H>>2]=c[(c[M>>2]|0)+160>>2];c[F>>2]=c[(c[M>>2]|0)+164>>2];c[y>>2]=0;c[u>>2]=0;if((c[p>>2]|0)==1){a:while(1){if((c[y>>2]|0)>>>0>=(c[n>>2]|0)>>>0){h=35;break}c[j>>2]=(d[(c[o>>2]|0)+(c[y>>2]|0)>>0]|0)^(d[(c[D>>2]|0)+(c[y>>2]|0)>>0]|0);c[k>>2]=0;while(1){if((c[k>>2]|0)>=8)break;c[h>>2]=c[j>>2]>>c[k>>2]&1;a[m>>0]=1;while(1){if(!(a[m>>0]&1))break;if((c[u>>2]|0)==(c[t>>2]|0)){h=35;break a}M=c[u>>2]|0;c[u>>2]=M+1;c[l>>2]=c[(c[J>>2]|0)+(M<<2)>>2];if(!((d[(c[K>>2]|0)+((c[l>>2]|0)>>>3)>>0]|0)>>(c[l>>2]&7)&1))continue;a[m>>0]=0;if(((d[(c[v>>2]|0)+((c[l>>2]|0)>>>3)>>0]|0)>>(c[l>>2]&7)&1|0)==(c[h>>2]|0))continue;M=(c[F>>2]|0)+((c[l>>2]|0)>>>3)|0;a[M>>0]=d[M>>0]|0|1<<(c[l>>2]&7);a[m>>0]=((d[(c[H>>2]|0)+((c[l>>2]|0)>>>3)>>0]|0)>>(c[l>>2]&7)&1|0)!=0&1}c[k>>2]=(c[k>>2]|0)+1}c[y>>2]=(c[y>>2]|0)+1}if((h|0)==35){M=c[y>>2]|0;i=L;return M|0}}c[G>>2]=(1<<c[p>>2])-1;c[w>>2]=0;c[s>>2]=0;c[E>>2]=0;c[x>>2]=0;b:while(1){if((c[y>>2]|0)>>>0>=(c[n>>2]|0)>>>0){h=35;break}if((c[E>>2]|0)<(c[p>>2]|0)){c[s>>2]=c[s>>2]|((d[(c[o>>2]|0)+(c[w>>2]|0)>>0]|0)^(d[(c[D>>2]|0)+(c[w>>2]|0)>>0]|0))<<c[E>>2];c[w>>2]=(c[w>>2]|0)+1;c[E>>2]=(c[E>>2]|0)+((c[w>>2]|0)==(c[n>>2]|0)?7+(c[p>>2]|0)|0:8)}c[q>>2]=c[s>>2]&c[G>>2];c[r>>2]=0;while(1){if((c[r>>2]|0)<(c[G>>2]|0)){do{if((c[u>>2]|0)==(c[t>>2]|0)){h=35;break b}M=c[u>>2]|0;c[u>>2]=M+1;c[A>>2]=c[(c[J>>2]|0)+(M<<2)>>2]}while(((d[(c[K>>2]|0)+((c[A>>2]|0)>>>3)>>0]|0)>>(c[A>>2]&7)&1|0)==0);c[C+(c[r>>2]<<2)>>2]=c[A>>2];a[I+(c[r>>2]|0)>>0]=((d[(c[v>>2]|0)+((c[A>>2]|0)>>>3)>>0]|0)>>(c[A>>2]&7)&1|0)!=0&1;if(a[I+(c[r>>2]|0)>>0]&1)c[q>>2]=c[q>>2]^(c[r>>2]|0)+1;c[r>>2]=(c[r>>2]|0)+1;continue}if(!(c[q>>2]|0))break;c[B>>2]=c[C+((c[q>>2]|0)-1<<2)>>2];M=(c[F>>2]|0)+((c[B>>2]|0)>>>3)|0;a[M>>0]=d[M>>0]|0|1<<(c[B>>2]&7);if(!((d[(c[H>>2]|0)+((c[B>>2]|0)>>>3)>>0]|0)>>(c[B>>2]&7)&1))break;c[z>>2]=c[q>>2];if(a[I+((c[q>>2]|0)-1)>>0]&1)c[q>>2]=0;while(1){if((c[z>>2]|0)>=(c[r>>2]|0))break;if(a[I+(c[z>>2]|0)>>0]&1)c[q>>2]=c[q>>2]^(c[z>>2]^(c[z>>2]|0)+1);c[C+((c[z>>2]|0)-1<<2)>>2]=c[C+(c[z>>2]<<2)>>2];a[I+((c[z>>2]|0)-1)>>0]=a[I+(c[z>>2]|0)>>0]&1;c[z>>2]=(c[z>>2]|0)+1}c[r>>2]=(c[r>>2]|0)+-1}c[s>>2]=c[s>>2]>>c[p>>2];c[E>>2]=(c[E>>2]|0)-(c[p>>2]|0);c[x>>2]=(c[x>>2]|0)+(c[p>>2]|0);if((c[x>>2]|0)<8)continue;c[y>>2]=(c[y>>2]|0)+1;c[x>>2]=(c[x>>2]|0)-8}if((h|0)==35){M=c[y>>2]|0;i=L;return M|0}return 0}function nb(a){a=a|0;var b=0,d=0;b=i;i=i+16|0;d=b;c[d>>2]=a;rf(c[(c[d>>2]|0)+164>>2]|0,0,((c[(c[d>>2]|0)+12+8>>2]|0)>>>0)/8|0|0)|0;i=b;return}function ob(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;x=i;i=i+176|0;y=x+172|0;f=x+168|0;n=x+164|0;v=x+160|0;t=x+156|0;w=x+152|0;o=x+148|0;p=x+144|0;l=x+140|0;h=x+136|0;q=x+112|0;m=x+88|0;j=x+64|0;k=x+40|0;g=x+16|0;r=x+8|0;s=x+4|0;u=x;c[y>>2]=b;c[f>>2]=e;c[n>>2]=c[(c[y>>2]|0)+12+8>>2];c[v>>2]=c[(c[y>>2]|0)+144>>2];c[t>>2]=c[(c[y>>2]|0)+148>>2];c[w>>2]=c[(c[y>>2]|0)+152>>2];c[o>>2]=c[(c[y>>2]|0)+156>>2];c[p>>2]=0;c[l>>2]=0;c[h>>2]=0;c[q>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;c[q+12>>2]=0;c[q+16>>2]=0;c[q+20>>2]=0;c[m>>2]=0;c[m+4>>2]=0;c[m+8>>2]=0;c[m+12>>2]=0;c[m+16>>2]=0;c[m+20>>2]=0;c[j>>2]=0;c[j+4>>2]=0;c[j+8>>2]=0;c[j+12>>2]=0;c[j+16>>2]=0;c[j+20>>2]=0;c[k>>2]=0;c[k+4>>2]=0;c[k+8>>2]=0;c[k+12>>2]=0;c[k+16>>2]=0;c[k+20>>2]=0;c[g>>2]=c[4143];c[g+4>>2]=c[4144];c[g+8>>2]=c[4145];c[g+12>>2]=c[4146];c[g+16>>2]=c[4147];c[g+20>>2]=c[4148];c[r>>2]=0;while(1){if((c[r>>2]|0)>>>0>=(c[n>>2]|0)>>>0)break;c[s>>2]=c[(c[v>>2]|0)+(c[r>>2]<<2)>>2];if((d[(c[w>>2]|0)+((c[s>>2]|0)>>>3)>>0]|0)>>(c[s>>2]&7)&1){c[u>>2]=(d[(c[o>>2]|0)+((c[s>>2]|0)>>>3)>>0]|0)>>(c[s>>2]&7)&1;c[l>>2]=c[l>>2]|c[u>>2]<<c[h>>2];c[h>>2]=(c[h>>2]|0)+1;if((c[h>>2]|0)==8){a[(c[c[f>>2]>>2]|0)+(c[p>>2]|0)>>0]=c[l>>2]^(d[(c[t>>2]|0)+(c[p>>2]|0)>>0]|0);c[l>>2]=0;c[h>>2]=0;c[p>>2]=(c[p>>2]|0)+1}if((c[u>>2]|0)==1){c[k>>2]=c[k>>2]^c[g>>2];y=k+4|0;c[y>>2]=c[y>>2]^c[g+4>>2];y=k+8|0;c[y>>2]=c[y>>2]^c[g+8>>2];y=k+12|0;c[y>>2]=c[y>>2]^c[g+12>>2];y=k+16|0;c[y>>2]=c[y>>2]^c[g+16>>2];y=k+20|0;c[y>>2]=c[y>>2]^c[g+20>>2]}c[g>>2]=(c[g>>2]|0)+1;y=g+4|0;c[y>>2]=(c[y>>2]|0)+1;y=g+8|0;c[y>>2]=(c[y>>2]|0)+1;y=g+12|0;c[y>>2]=(c[y>>2]|0)+1;y=g+16|0;c[y>>2]=(c[y>>2]|0)+1;y=g+20|0;c[y>>2]=(c[y>>2]|0)+1;if((c[g>>2]|0)==4){c[m>>2]=c[m>>2]|c[k>>2]<<c[j>>2];c[j>>2]=(c[j>>2]|0)+2;if((c[j>>2]|0)>=8){a[(c[(c[f>>2]|0)+4>>2]|0)+(c[q>>2]|0)>>0]=c[m>>2]&255^(d[(c[t>>2]|0)+(c[q>>2]|0)>>0]|0);c[m>>2]=c[m>>2]>>8;c[j>>2]=(c[j>>2]|0)-8;c[q>>2]=(c[q>>2]|0)+1}c[k>>2]=0;c[g>>2]=1}if((c[g+4>>2]|0)==8){y=m+4|0;c[y>>2]=c[y>>2]|c[k+4>>2]<<c[j+4>>2];y=j+4|0;c[y>>2]=(c[y>>2]|0)+3;if((c[j+4>>2]|0)>=8){a[(c[(c[f>>2]|0)+8>>2]|0)+(c[q+4>>2]|0)>>0]=c[m+4>>2]&255^(d[(c[t>>2]|0)+(c[q+4>>2]|0)>>0]|0);y=m+4|0;c[y>>2]=c[y>>2]>>8;y=j+4|0;c[y>>2]=(c[y>>2]|0)-8;y=q+4|0;c[y>>2]=(c[y>>2]|0)+1}c[k+4>>2]=0;c[g+4>>2]=1}if((c[g+8>>2]|0)==16){y=m+8|0;c[y>>2]=c[y>>2]|c[k+8>>2]<<c[j+8>>2];y=j+8|0;c[y>>2]=(c[y>>2]|0)+4;if((c[j+8>>2]|0)>=8){a[(c[(c[f>>2]|0)+12>>2]|0)+(c[q+8>>2]|0)>>0]=c[m+8>>2]&255^(d[(c[t>>2]|0)+(c[q+8>>2]|0)>>0]|0);y=m+8|0;c[y>>2]=c[y>>2]>>8;y=j+8|0;c[y>>2]=(c[y>>2]|0)-8;y=q+8|0;c[y>>2]=(c[y>>2]|0)+1}c[k+8>>2]=0;c[g+8>>2]=1}if((c[g+12>>2]|0)==32){y=m+12|0;c[y>>2]=c[y>>2]|c[k+12>>2]<<c[j+12>>2];y=j+12|0;c[y>>2]=(c[y>>2]|0)+5;if((c[j+12>>2]|0)>=8){a[(c[(c[f>>2]|0)+16>>2]|0)+(c[q+12>>2]|0)>>0]=c[m+12>>2]&255^(d[(c[t>>2]|0)+(c[q+12>>2]|0)>>0]|0);y=m+12|0;c[y>>2]=c[y>>2]>>8;y=j+12|0;c[y>>2]=(c[y>>2]|0)-8;y=q+12|0;c[y>>2]=(c[y>>2]|0)+1}c[k+12>>2]=0;c[g+12>>2]=1}if((c[g+16>>2]|0)==64){y=m+16|0;c[y>>2]=c[y>>2]|c[k+16>>2]<<c[j+16>>2];y=j+16|0;c[y>>2]=(c[y>>2]|0)+6;if((c[j+16>>2]|0)>=8){a[(c[(c[f>>2]|0)+20>>2]|0)+(c[q+16>>2]|0)>>0]=c[m+16>>2]&255^(d[(c[t>>2]|0)+(c[q+16>>2]|0)>>0]|0);y=m+16|0;c[y>>2]=c[y>>2]>>8;y=j+16|0;c[y>>2]=(c[y>>2]|0)-8;y=q+16|0;c[y>>2]=(c[y>>2]|0)+1}c[k+16>>2]=0;c[g+16>>2]=1}if((c[g+20>>2]|0)==128){y=m+20|0;c[y>>2]=c[y>>2]|c[k+20>>2]<<c[j+20>>2];y=j+20|0;c[y>>2]=(c[y>>2]|0)+7;if((c[j+20>>2]|0)>=8){a[(c[(c[f>>2]|0)+24>>2]|0)+(c[q+20>>2]|0)>>0]=c[m+20>>2]&255^(d[(c[t>>2]|0)+(c[q+20>>2]|0)>>0]|0);y=m+20|0;c[y>>2]=c[y>>2]>>8;y=j+20|0;c[y>>2]=(c[y>>2]|0)-8;y=q+20|0;c[y>>2]=(c[y>>2]|0)+1}c[k+20>>2]=0;c[g+20>>2]=1}}c[r>>2]=(c[r>>2]|0)+1}i=x;return}function pb(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;r=i;i=i+8240|0;f=r+36|0;g=r+32|0;h=r+28|0;l=r+24|0;j=r+40|0;p=r+20|0;m=r+16|0;k=r+12|0;o=r+8|0;n=r+4|0;q=r;c[f>>2]=a;c[g>>2]=b;c[h>>2]=e;c[l>>2]=0;while(1){if((c[l>>2]|0)>>>0>=(c[g>>2]|0)>>>0)break;c[(c[h>>2]|0)+(c[l>>2]<<2)>>2]=c[l>>2];c[l>>2]=(c[l>>2]|0)+1}c[p>>2]=c[g>>2];c[m>>2]=0;while(1){if((c[m>>2]|0)>>>0>=(c[g>>2]|0)>>>0)break;c[k>>2]=8192;if(((c[g>>2]|0)-(c[m>>2]|0)|0)>>>0<2048)c[k>>2]=(c[g>>2]|0)-(c[m>>2]|0)<<2;rf(j|0,0,c[k>>2]|0)|0;rb(c[f>>2]|0,c[k>>2]|0,j,j);c[o>>2]=0;while(1){if((c[o>>2]|0)>>>0>=(c[k>>2]|0)>>>0)break;c[n>>2]=(d[j+(c[o>>2]|0)>>0]|0)<<24|(d[j+((c[o>>2]|0)+1)>>0]|0)<<16|(d[j+((c[o>>2]|0)+2)>>0]|0)<<8|(d[j+((c[o>>2]|0)+3)>>0]|0);if((c[p>>2]|0)>>>0<2147483648)c[n>>2]=(c[n>>2]|0)%(c[p>>2]|0)|0;if((c[n>>2]|0)<0)c[n>>2]=(c[n>>2]|0)+(c[p>>2]|0);c[p>>2]=(c[p>>2]|0)+-1;c[q>>2]=c[(c[h>>2]|0)+(c[n>>2]<<2)>>2];c[(c[h>>2]|0)+(c[n>>2]<<2)>>2]=c[(c[h>>2]|0)+(c[p>>2]<<2)>>2];c[(c[h>>2]|0)+(c[p>>2]<<2)>>2]=c[q>>2];c[o>>2]=(c[o>>2]|0)+4}c[m>>2]=(c[m>>2]|0)+2048}i=r;return}function qb(b,c,e){b=b|0;c=c|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0;if(!c)sa(21772,21803,50,21813);if(c>>>0<257)f=0;else sa(21836,21803,51,21813);do{a[b+f>>0]=f;f=f+1|0}while((f|0)!=256);f=0;g=0;h=0;while(1){k=b+f|0;j=a[k>>0]|0;g=(j&255)+g+(d[e+h>>0]|0)&255;i=b+g|0;a[k>>0]=a[i>>0]|0;a[i>>0]=j;f=f+1|0;if((f|0)==256)break;else h=((h+1|0)>>>0)%(c>>>0)|0}a[b+257>>0]=0;a[b+256>>0]=0;return}function rb(b,c,d,e){b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;i=b+256|0;g=a[i>>0]|0;j=b+257|0;f=a[j>>0]|0;if(c){h=g+(c+255&255)<<24>>24;while(1){c=c+-1|0;g=g+1<<24>>24;o=b+(g&255)|0;n=a[o>>0]|0;k=n&255;m=k+(f&255)|0;f=m&255;m=b+(m&255)|0;l=a[m>>0]|0;a[o>>0]=l;a[m>>0]=n;a[d>>0]=a[b+((l&255)+k&255)>>0]^a[e>>0];if(!c)break;else{d=d+1|0;e=e+1|0}}g=h+1<<24>>24}a[i>>0]=g;a[j>>0]=f;return}function sb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;c[a+4>>2]=0;if((b|0)!=90){e=c[a>>2]|0;c[e+20>>2]=13;c[e+24>>2]=90;c[e+28>>2]=b;Ka[c[e>>2]&63](a)}if((d|0)==440)d=a;else{e=c[a>>2]|0;c[e+20>>2]=22;c[e+24>>2]=440;c[e+28>>2]=d;Ka[c[e>>2]&63](a);d=a}f=c[a>>2]|0;e=a+12|0;b=c[e>>2]|0;rf(a|0,0,440)|0;c[a>>2]=f;c[e>>2]=b;c[a+16>>2]=0;Ic(d);c[a+8>>2]=0;c[a+24>>2]=0;c[a+84>>2]=0;c[a+88>>2]=0;c[a+104>>2]=100;c[a+92>>2]=0;c[a+108>>2]=100;c[a+96>>2]=0;c[a+112>>2]=100;c[a+100>>2]=0;c[a+116>>2]=100;e=a+120|0;c[e>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;c[e+16>>2]=0;c[e+20>>2]=0;c[e+24>>2]=0;c[e+28>>2]=0;c[a+380>>2]=8;c[a+384>>2]=17620;c[a+388>>2]=63;c[a+428>>2]=0;h[a+48>>3]=1.0;c[a+20>>2]=100;return}function tb(a){a=a|0;Jb(a);return}function ub(a,b){a=a|0;b=b|0;var d=0,e=0;d=c[a+88>>2]|0;if(d)c[d+128>>2]=b;d=c[a+92>>2]|0;if(d)c[d+128>>2]=b;d=c[a+96>>2]|0;if(d)c[d+128>>2]=b;d=c[a+100>>2]|0;if(!d)e=0;else{c[d+128>>2]=b;e=0}do{d=c[a+120+(e<<2)>>2]|0;if(d)c[d+276>>2]=b;d=c[a+136+(e<<2)>>2]|0;if(d)c[d+276>>2]=b;e=e+1|0}while((e|0)!=4);return}function vb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0;b=c[a+20>>2]|0;switch(b|0){case 102:case 101:{if((c[a+264>>2]|0)>>>0<(c[a+32>>2]|0)>>>0){i=c[a>>2]|0;c[i+20>>2]=69;Ka[c[i>>2]&63](a)}Ka[c[(c[a+392>>2]|0)+8>>2]&63](a);break}case 103:break;default:{i=c[a>>2]|0;c[i+20>>2]=21;c[i+24>>2]=b;Ka[c[i>>2]&63](a)}}f=a+392|0;b=c[f>>2]|0;if(!(c[b+16>>2]|0)){g=a+288|0;h=a+8|0;i=a+404|0;do{Ka[c[b>>2]&63](a);b=c[g>>2]|0;if(b){e=0;do{d=c[h>>2]|0;if(d){c[d+4>>2]=e;c[d+8>>2]=b;Ka[c[d>>2]&63](a)}if(!(Qa[c[(c[i>>2]|0)+4>>2]&31](a,0)|0)){d=c[a>>2]|0;c[d+20>>2]=25;Ka[c[d>>2]&63](a)}e=e+1|0;b=c[g>>2]|0}while(e>>>0<b>>>0)}Ka[c[(c[f>>2]|0)+8>>2]&63](a);b=c[f>>2]|0}while((c[b+16>>2]|0)==0);b=a}else b=a;Ka[c[(c[a+408>>2]|0)+12>>2]&63](a);Ka[c[(c[a+24>>2]|0)+16>>2]&63](a);Ib(b);return}function wb(a){a=a|0;var b=0;b=Ia[c[c[a+4>>2]>>2]&7](a,1,32)|0;c[a+408>>2]=b;c[b>>2]=6;c[b+4>>2]=7;c[b+8>>2]=8;c[b+12>>2]=9;c[b+16>>2]=10;c[b+20>>2]=5;c[b+24>>2]=3;c[b+28>>2]=0;return}function xb(a){a=a|0;var b=0;b=c[a+408>>2]|0;Eb(a,255);Eb(a,216);c[b+28>>2]=0;if(c[a+244>>2]|0){Eb(a,255);Eb(a,224);Eb(a,0);Eb(a,16);Eb(a,74);Eb(a,70);Eb(a,73);Eb(a,70);Eb(a,0);Eb(a,d[a+248>>0]|0);Eb(a,d[a+249>>0]|0);Eb(a,d[a+250>>0]|0);b=e[a+252>>1]|0;Eb(a,b>>>8);Eb(a,b&255);b=e[a+254>>1]|0;Eb(a,b>>>8);Eb(a,b&255);Eb(a,0);Eb(a,0)}a:do if(c[a+256>>2]|0){Eb(a,255);Eb(a,238);Eb(a,0);Eb(a,14);Eb(a,65);Eb(a,100);Eb(a,111);Eb(a,98);Eb(a,101);Eb(a,0);Eb(a,100);Eb(a,0);Eb(a,0);Eb(a,0);Eb(a,0);switch(c[a+80>>2]|0){case 3:{Eb(a,1);break a}case 5:{Eb(a,2);break a}default:{Eb(a,0);break a}}}while(0);return}function yb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;j=a+84|0;k=a+76|0;b=c[k>>2]|0;if((b|0)>0){e=0;f=c[j>>2]|0;b=0;while(1){d=(Fb(a,c[f+16>>2]|0)|0)+b|0;e=e+1|0;b=c[k>>2]|0;if((e|0)>=(b|0)){g=d;break}else{f=f+88|0;b=d}}}else g=0;h=a+212|0;i=a+268|0;d=(c[i>>2]|0)==0;a:do if(c[h>>2]|0)if(d)m=19;else m=18;else{b:do if(d){do if((c[a+72>>2]|0)==8?(c[a+380>>2]|0)==8:0){if((b|0)>0){e=0;f=c[j>>2]|0;d=1;while(1){if(!((c[f+20>>2]|0)<=1?(c[f+24>>2]|0)<=1:0))d=0;e=e+1|0;if((e|0)>=(b|0)){b=d;break}else f=f+88|0}}else b=1;if(!((g|0)!=0&(b|0)!=0)){if(!b)break;Hb(a,192);break a}b=c[a>>2]|0;c[b+20>>2]=77;La[c[b+4>>2]&15](a,0);b=(c[i>>2]|0)!=0;if(!(c[h>>2]|0))if(b)break b;else break;else if(b){m=18;break a}else{m=19;break a}}while(0);Hb(a,193);break a}while(0);Hb(a,194)}while(0);if((m|0)==18)Hb(a,202);else if((m|0)==19)Hb(a,201);switch(c[a+260>>2]|0){case 0:break;case 1:{if((c[k>>2]|0)<3)m=27;else m=28;break}default:m=27}if((m|0)==27){k=c[a>>2]|0;c[k+20>>2]=28;Ka[c[k>>2]&63](a);m=28}if((m|0)==28){Eb(a,255);Eb(a,248);Eb(a,0);Eb(a,24);Eb(a,13);Eb(a,0);Eb(a,255);Eb(a,3);Eb(a,c[(c[j>>2]|0)+88>>2]|0);Eb(a,c[c[j>>2]>>2]|0);Eb(a,c[(c[j>>2]|0)+176>>2]|0);Eb(a,128);Eb(a,0);Eb(a,0);Eb(a,0);Eb(a,0);Eb(a,0);Eb(a,0);Eb(a,1);Eb(a,0);Eb(a,0);Eb(a,0);Eb(a,0);Eb(a,1);Eb(a,0);Eb(a,0)}if((c[i>>2]|0)!=0?(l=a+380|0,(c[l>>2]|0)!=8):0){Eb(a,255);Eb(a,218);Eb(a,0);Eb(a,6);Eb(a,0);Eb(a,0);m=c[l>>2]|0;Eb(a,(_(m,m)|0)+-1|0);Eb(a,0)}return}function zb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0;i=c[a+408>>2]|0;if((c[a+212>>2]|0)==0?(e=a+292|0,(c[e>>2]|0)>0):0){f=a+364|0;g=a+372|0;b=a+368|0;h=0;do{d=c[a+296+(h<<2)>>2]|0;if((c[f>>2]|0)==0?(c[g>>2]|0)==0:0)Gb(a,c[d+20>>2]|0,0);if(c[b>>2]|0)Gb(a,c[d+24>>2]|0,1);h=h+1|0}while((h|0)<(c[e>>2]|0))}d=a+236|0;b=i+28|0;if((c[d>>2]|0)!=(c[b>>2]|0)){Eb(a,255);Eb(a,221);Eb(a,0);Eb(a,4);i=c[d>>2]|0;Eb(a,i>>>8&255);Eb(a,i&255);c[b>>2]=c[d>>2]}Eb(a,255);Eb(a,218);f=a+292|0;i=(c[f>>2]<<1)+6|0;Eb(a,i>>>8&255);Eb(a,i&254);Eb(a,c[f>>2]|0);i=a+364|0;if((c[f>>2]|0)>0){b=a+372|0;d=a+368|0;h=0;do{e=c[a+296+(h<<2)>>2]|0;Eb(a,c[e>>2]|0);if((c[i>>2]|0)==0?(c[b>>2]|0)==0:0)g=c[e+20>>2]|0;else g=0;if(!(c[d>>2]|0))e=0;else e=c[e+24>>2]|0;Eb(a,e+(g<<4)|0);h=h+1|0}while((h|0)<(c[f>>2]|0))}else{d=a+368|0;b=a+372|0}Eb(a,c[i>>2]|0);Eb(a,c[d>>2]|0);Eb(a,(c[b>>2]<<4)+(c[a+376>>2]|0)|0);return}function Ab(a){a=a|0;Eb(a,255);Eb(a,217);return}function Bb(a){a=a|0;var b=0;Eb(a,255);Eb(a,216);if(c[a+88>>2]|0)Fb(a,0)|0;if(c[a+92>>2]|0)Fb(a,1)|0;if(c[a+96>>2]|0)Fb(a,2)|0;if(c[a+100>>2]|0)Fb(a,3)|0;if(!(c[a+212>>2]|0)){b=0;do{if(c[a+120+(b<<2)>>2]|0)Gb(a,b,0);if(c[a+136+(b<<2)>>2]|0)Gb(a,b,1);b=b+1|0}while((b|0)!=4)}Eb(a,255);Eb(a,217);return}function Cb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;if(d>>>0>65533){e=c[a>>2]|0;c[e+20>>2]=12;Ka[c[e>>2]&63](a)}Eb(a,255);Eb(a,b);e=d+2|0;Eb(a,e>>>8&255);Eb(a,e&255);return}function Db(a,b){a=a|0;b=b|0;Eb(a,b);return}function Eb(b,d){b=b|0;d=d|0;var e=0,f=0;e=c[b+24>>2]|0;f=c[e>>2]|0;c[e>>2]=f+1;a[f>>0]=d;f=e+4|0;d=(c[f>>2]|0)+-1|0;c[f>>2]=d;if((d|0)==0?(Na[c[e+12>>2]&15](b)|0)==0:0){f=c[b>>2]|0;c[f+20>>2]=25;Ka[c[f>>2]&63](b)}return}function Fb(a,b){a=a|0;b=b|0;var d=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;k=c[a+88+(b<<2)>>2]|0;if(!k){l=c[a>>2]|0;c[l+20>>2]=54;c[l+24>>2]=b;Ka[c[l>>2]&63](a)}l=a+388|0;g=c[l>>2]|0;if((g|0)<0)d=0;else{f=c[a+384>>2]|0;h=0;d=0;while(1){d=(e[k+(c[f+(h<<2)>>2]<<1)>>1]|0)>255?1:d;if((h|0)<(g|0))h=h+1|0;else break}}i=k+128|0;if(!(c[i>>2]|0)){Eb(a,255);Eb(a,219);j=(d|0)!=0;h=c[l>>2]|0;h=(j?(h<<1)+2|0:h+1|0)+3|0;Eb(a,h>>>8&255);Eb(a,h&255);Eb(a,(d<<4)+b|0);if((c[l>>2]|0)>=0){f=a+384|0;h=0;while(1){g=e[k+(c[(c[f>>2]|0)+(h<<2)>>2]<<1)>>1]|0;if(j)Eb(a,g>>>8);Eb(a,g&255);if((h|0)<(c[l>>2]|0))h=h+1|0;else break}}c[i>>2]=1}return d|0}function Gb(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0;h=(e|0)==0;f=h?b:b+16|0;h=c[(h?a+120+(b<<2)|0:a+136+(b<<2)|0)>>2]|0;if(!h){g=c[a>>2]|0;c[g+20>>2]=52;c[g+24>>2]=f;Ka[c[g>>2]&63](a)}g=h+276|0;if(!(c[g>>2]|0)){Eb(a,255);Eb(a,196);b=1;e=0;do{e=(d[h+b>>0]|0)+e|0;b=b+1|0}while((b|0)!=17);b=e;e=b+19|0;Eb(a,e>>>8&255);Eb(a,e&255);Eb(a,f);e=1;do{Eb(a,d[h+e>>0]|0);e=e+1|0}while((e|0)!=17);if((b|0)>0){e=0;do{Eb(a,d[h+17+e>>0]|0);e=e+1|0}while((e|0)!=(b|0))}c[g>>2]=1}return}function Hb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;Eb(a,255);Eb(a,b);f=a+76|0;e=((c[f>>2]|0)*3|0)+8|0;Eb(a,e>>>8&255);Eb(a,e&255);e=a+68|0;if((c[e>>2]|0)<=65535?(d=a+64|0,(c[d>>2]|0)<=65535):0)b=d;else{b=c[a>>2]|0;c[b+20>>2]=42;c[b+24>>2]=65535;Ka[c[b>>2]&63](a);b=a+64|0}Eb(a,c[a+72>>2]|0);e=c[e>>2]|0;Eb(a,e>>>8&255);Eb(a,e&255);e=c[b>>2]|0;Eb(a,e>>>8&255);Eb(a,e&255);Eb(a,c[f>>2]|0);if((c[f>>2]|0)>0){b=0;d=c[a+84>>2]|0;while(1){Eb(a,c[d>>2]|0);Eb(a,(c[d+8>>2]<<4)+(c[d+12>>2]|0)|0);Eb(a,c[d+16>>2]|0);b=b+1|0;if((b|0)>=(c[f>>2]|0))break;else d=d+88|0}}return}function Ib(a){a=a|0;var b=0;b=c[a+4>>2]|0;do if(b){La[c[b+36>>2]&15](a,1);b=a+20|0;if(!(c[a+16>>2]|0)){c[b>>2]=100;break}else{c[b>>2]=200;c[a+312>>2]=0;break}}while(0);return}function Jb(a){a=a|0;var b=0,d=0;b=a+4|0;d=c[b>>2]|0;if(d)Ka[c[d+40>>2]&63](a);c[b>>2]=0;c[a+20>>2]=0;return}function Kb(a){a=a|0;a=Ia[c[c[a+4>>2]>>2]&7](a,0,132)|0;c[a+128>>2]=0;return a|0}function Lb(a){a=a|0;a=Ia[c[c[a+4>>2]>>2]&7](a,0,280)|0;c[a+276>>2]=0;return a|0}function Mb(a,d,e,f,g){a=a|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0;h=c[a+20>>2]|0;if((h|0)!=100){i=c[a>>2]|0;c[i+20>>2]=21;c[i+24>>2]=h;Ka[c[i>>2]&63](a)}if(d>>>0>3){i=c[a>>2]|0;c[i+20>>2]=32;c[i+24>>2]=d;Ka[c[i>>2]&63](a)}h=a+88+(d<<2)|0;d=c[h>>2]|0;if(!d){a=Kb(a)|0;c[h>>2]=a}else a=d;h=(g|0)!=0;d=0;do{i=((_(c[e+(d<<2)>>2]|0,f)|0)+50|0)/100|0;i=(i|0)<1?1:i;i=(i|0)>32767?32767:i;b[a+(d<<1)>>1]=h&(i|0)>255?255:i&65535;d=d+1|0}while((d|0)!=64);c[a+128>>2]=0;return}function Nb(a,b,c){a=a|0;b=b|0;c=c|0;b=(b|0)<1?1:b;b=(b|0)>100?100:b;if((b|0)<50)b=5e3/(b|0)|0;else b=200-(b<<1)|0;Mb(a,0,16596,b,c);Mb(a,1,16852,b,c);return}function Ob(d){d=d|0;var e=0,f=0;e=c[d+20>>2]|0;if((e|0)!=100){f=c[d>>2]|0;c[f+20>>2]=21;c[f+24>>2]=e;Ka[c[f>>2]&63](d)}e=d+84|0;if(!(c[e>>2]|0))c[e>>2]=Ia[c[c[d+4>>2]>>2]&7](d,0,880)|0;c[d+56>>2]=1;c[d+60>>2]=1;e=d+72|0;c[e>>2]=8;Nb(d,75,1);Sb(d,d+120|0,21867,21884);Sb(d,d+136|0,21896,21913);Sb(d,d+124|0,22075,22092);Sb(d,d+140|0,22104,22121);f=0;do{a[d+152+f>>0]=0;a[d+168+f>>0]=1;a[d+184+f>>0]=5;f=f+1|0}while((f|0)!=16);c[d+204>>2]=0;c[d+200>>2]=0;c[d+208>>2]=0;c[d+212>>2]=(c[e>>2]|0)>8&1;c[d+216>>2]=0;c[d+220>>2]=0;c[d+224>>2]=1;f=d+228|0;c[f>>2]=0;c[f+4>>2]=0;c[f+8>>2]=0;c[f+12>>2]=0;a[d+248>>0]=1;a[d+249>>0]=1;a[d+250>>0]=0;b[d+252>>1]=1;b[d+254>>1]=1;c[d+260>>2]=0;Pb(d);return}function Pb(a){a=a|0;var b=0;switch(c[a+40>>2]|0){case 0:{Qb(a,0);break}case 1:{Qb(a,1);break}case 2:{Qb(a,3);break}case 3:{Qb(a,3);break}case 4:{Qb(a,4);break}case 5:{Qb(a,5);break}case 6:{Qb(a,6);break}case 7:{Qb(a,7);break}default:{b=c[a>>2]|0;c[b+20>>2]=10;Ka[c[b>>2]&63](a)}}return}function Qb(b,d){b=b|0;d=d|0;var e=0,f=0;e=c[b+20>>2]|0;if((e|0)!=100){f=c[b>>2]|0;c[f+20>>2]=21;c[f+24>>2]=e;Ka[c[f>>2]&63](b)}c[b+80>>2]=d;e=b+244|0;c[e>>2]=0;f=b+256|0;c[f>>2]=0;switch(d|0){case 0:{e=c[b+36>>2]|0;f=b+76|0;c[f>>2]=e;if((e+-1|0)>>>0>9){d=c[b>>2]|0;c[d+20>>2]=27;c[d+24>>2]=e;c[d+28>>2]=10;Ka[c[d>>2]&63](b);e=c[f>>2]|0}if((e|0)>0){f=c[b+84>>2]|0;d=0;do{c[f+(d*88|0)>>2]=d;c[f+(d*88|0)+8>>2]=1;c[f+(d*88|0)+12>>2]=1;c[f+(d*88|0)+16>>2]=0;c[f+(d*88|0)+20>>2]=0;c[f+(d*88|0)+24>>2]=0;d=d+1|0}while((d|0)<(e|0))}break}case 1:{c[e>>2]=1;c[b+76>>2]=1;b=c[b+84>>2]|0;c[b>>2]=1;c[b+8>>2]=1;c[b+12>>2]=1;c[b+16>>2]=0;c[b+20>>2]=0;c[b+24>>2]=0;break}case 2:{c[f>>2]=1;c[b+76>>2]=3;d=c[b+84>>2]|0;c[d>>2]=82;c[d+8>>2]=1;c[d+12>>2]=1;c[d+16>>2]=0;b=(c[b+260>>2]|0)==1&1;c[d+20>>2]=b;c[d+24>>2]=b;c[d+88>>2]=71;c[d+96>>2]=1;c[d+100>>2]=1;c[d+104>>2]=0;c[d+108>>2]=0;c[d+112>>2]=0;c[d+176>>2]=66;c[d+184>>2]=1;c[d+188>>2]=1;c[d+192>>2]=0;c[d+196>>2]=b;c[d+200>>2]=b;break}case 3:{c[e>>2]=1;c[b+76>>2]=3;b=c[b+84>>2]|0;c[b>>2]=1;c[b+8>>2]=2;c[b+12>>2]=2;c[b+16>>2]=0;c[b+20>>2]=0;c[b+24>>2]=0;c[b+88>>2]=2;c[b+96>>2]=1;c[b+100>>2]=1;c[b+104>>2]=1;c[b+108>>2]=1;c[b+112>>2]=1;c[b+176>>2]=3;c[b+184>>2]=1;c[b+188>>2]=1;c[b+192>>2]=1;c[b+196>>2]=1;c[b+200>>2]=1;break}case 4:{c[f>>2]=1;c[b+76>>2]=4;b=c[b+84>>2]|0;c[b>>2]=67;c[b+8>>2]=1;c[b+12>>2]=1;c[b+16>>2]=0;c[b+20>>2]=0;c[b+24>>2]=0;c[b+88>>2]=77;c[b+96>>2]=1;c[b+100>>2]=1;c[b+104>>2]=0;c[b+108>>2]=0;c[b+112>>2]=0;c[b+176>>2]=89;c[b+184>>2]=1;c[b+188>>2]=1;c[b+192>>2]=0;c[b+196>>2]=0;c[b+200>>2]=0;c[b+264>>2]=75;c[b+272>>2]=1;c[b+276>>2]=1;c[b+280>>2]=0;c[b+284>>2]=0;c[b+288>>2]=0;break}case 5:{c[f>>2]=1;c[b+76>>2]=4;b=c[b+84>>2]|0;c[b>>2]=1;c[b+8>>2]=2;c[b+12>>2]=2;c[b+16>>2]=0;c[b+20>>2]=0;c[b+24>>2]=0;c[b+88>>2]=2;c[b+96>>2]=1;c[b+100>>2]=1;c[b+104>>2]=1;c[b+108>>2]=1;c[b+112>>2]=1;c[b+176>>2]=3;c[b+184>>2]=1;c[b+188>>2]=1;c[b+192>>2]=1;c[b+196>>2]=1;c[b+200>>2]=1;c[b+264>>2]=4;c[b+272>>2]=2;c[b+276>>2]=2;c[b+280>>2]=0;c[b+284>>2]=0;c[b+288>>2]=0;break}case 6:{c[e>>2]=1;a[b+248>>0]=2;c[b+76>>2]=3;d=c[b+84>>2]|0;c[d>>2]=114;c[d+8>>2]=1;c[d+12>>2]=1;c[d+16>>2]=0;b=(c[b+260>>2]|0)==1&1;c[d+20>>2]=b;c[d+24>>2]=b;c[d+88>>2]=103;c[d+96>>2]=1;c[d+100>>2]=1;c[d+104>>2]=0;c[d+108>>2]=0;c[d+112>>2]=0;c[d+176>>2]=98;c[d+184>>2]=1;c[d+188>>2]=1;c[d+192>>2]=0;c[d+196>>2]=b;c[d+200>>2]=b;break}case 7:{c[e>>2]=1;a[b+248>>0]=2;c[b+76>>2]=3;b=c[b+84>>2]|0;c[b>>2]=1;c[b+8>>2]=2;c[b+12>>2]=2;c[b+16>>2]=0;c[b+20>>2]=0;c[b+24>>2]=0;c[b+88>>2]=34;c[b+96>>2]=1;c[b+100>>2]=1;c[b+104>>2]=1;c[b+108>>2]=1;c[b+112>>2]=1;c[b+176>>2]=35;c[b+184>>2]=1;c[b+188>>2]=1;c[b+192>>2]=1;c[b+196>>2]=1;c[b+200>>2]=1;break}default:{d=c[b>>2]|0;c[d+20>>2]=11;Ka[c[d>>2]&63](b)}}return}function Rb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0;i=c[a+76>>2]|0;b=c[a+20>>2]|0;if((b|0)!=100){g=c[a>>2]|0;c[g+20>>2]=21;c[g+24>>2]=b;Ka[c[g>>2]&63](a)}f=(i|0)==3;if(!f)if((i|0)>4)g=i*6|0;else h=7;else switch(c[a+80>>2]|0){case 7:case 3:{g=10;break}default:h=7}if((h|0)==7)g=i<<2|2;e=a+428|0;b=c[e>>2]|0;d=a+432|0;if(!((b|0)!=0?(c[d>>2]|0)>=(g|0):0)){b=(g|0)>10?g:10;c[d>>2]=b;b=Ia[c[c[a+4>>2]>>2]&7](a,0,b*36|0)|0;c[e>>2]=b}c[a+204>>2]=b;c[a+200>>2]=g;a:do if(!f){b=Tb(b,i,0,1)|0;if((i|0)>0)h=16;else Tb(b,i,1,0)|0}else switch(c[a+80>>2]|0){case 7:case 3:{i=Tb(b,3,0,1)|0;c[i>>2]=1;c[i+4>>2]=0;c[i+20>>2]=1;c[i+24>>2]=5;c[i+28>>2]=0;c[i+32>>2]=2;c[i+36>>2]=1;c[i+40>>2]=2;c[i+56>>2]=1;c[i+60>>2]=63;c[i+64>>2]=0;c[i+68>>2]=1;c[i+72>>2]=1;c[i+76>>2]=1;c[i+92>>2]=1;c[i+96>>2]=63;c[i+100>>2]=0;c[i+104>>2]=1;c[i+108>>2]=1;c[i+112>>2]=0;c[i+128>>2]=6;c[i+132>>2]=63;c[i+136>>2]=0;c[i+140>>2]=2;c[i+144>>2]=1;c[i+148>>2]=0;c[i+164>>2]=1;c[i+168>>2]=63;c[i+172>>2]=2;c[i+176>>2]=1;i=Tb(i+180|0,3,1,0)|0;c[i>>2]=1;c[i+4>>2]=2;c[i+20>>2]=1;c[i+24>>2]=63;c[i+28>>2]=1;c[i+32>>2]=0;c[i+36>>2]=1;c[i+40>>2]=1;c[i+56>>2]=1;c[i+60>>2]=63;c[i+64>>2]=1;c[i+68>>2]=0;c[i+72>>2]=1;c[i+76>>2]=0;c[i+92>>2]=1;c[i+96>>2]=63;c[i+100>>2]=1;c[i+104>>2]=0;break a}default:{b=Tb(b,3,0,1)|0;h=16;break a}}while(0);if((h|0)==16){d=b;e=0;while(1){c[d>>2]=1;c[d+4>>2]=e;c[d+20>>2]=1;c[d+24>>2]=5;c[d+28>>2]=0;c[d+32>>2]=2;e=e+1|0;if((e|0)==(i|0))break;else d=d+36|0}d=b+(i*36|0)|0;e=0;while(1){c[d>>2]=1;c[d+4>>2]=e;c[d+20>>2]=6;c[d+24>>2]=63;c[d+28>>2]=0;c[d+32>>2]=2;e=e+1|0;if((e|0)==(i|0))break;else d=d+36|0}d=b+((i<<1)*36|0)|0;e=0;while(1){c[d>>2]=1;c[d+4>>2]=e;c[d+20>>2]=1;c[d+24>>2]=63;c[d+28>>2]=2;c[d+32>>2]=1;e=e+1|0;if((e|0)==(i|0))break;else d=d+36|0}b=Tb(b+((i*3|0)*36|0)|0,i,1,0)|0;d=0;while(1){c[b>>2]=1;c[b+4>>2]=d;c[b+20>>2]=1;c[b+24>>2]=63;c[b+28>>2]=1;c[b+32>>2]=0;d=d+1|0;if((d|0)==(i|0))break;else b=b+36|0}}return}function Sb(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0;h=c[e>>2]|0;if(!h){h=Lb(b)|0;c[e>>2]=h}i=f;j=h+17|0;do{a[h>>0]=a[i>>0]|0;h=h+1|0;i=i+1|0}while((h|0)<(j|0));i=1;h=0;do{h=(d[f+i>>0]|0)+h|0;i=i+1|0}while((i|0)!=17);if((h+-1|0)>>>0>255){f=c[b>>2]|0;c[f+20>>2]=9;Ka[c[f>>2]&63](b)}xf((c[e>>2]|0)+17|0,g|0,h|0)|0;c[(c[e>>2]|0)+276>>2]=0;return}function Tb(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;if((b|0)<5){c[a>>2]=b;if((b|0)>0){f=0;do{c[a+4+(f<<2)>>2]=f;f=f+1|0}while((f|0)!=(b|0))}c[a+24>>2]=0;c[a+20>>2]=0;c[a+28>>2]=d;c[a+32>>2]=e;f=a+36|0}else{f=a;g=0;while(1){c[f>>2]=1;c[f+4>>2]=g;c[f+20>>2]=0;c[f+24>>2]=0;c[f+28>>2]=d;c[f+32>>2]=e;g=g+1|0;if((g|0)==(b|0))break;else f=f+36|0}f=a+(b*36|0)|0}return f|0}function Ub(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;e=a+20|0;d=c[e>>2]|0;if((d|0)==100)d=a;else{f=c[a>>2]|0;c[f+20>>2]=21;c[f+24>>2]=d;Ka[c[f>>2]&63](a);d=a}ub(a,0);Ka[c[(c[a>>2]|0)+16>>2]&63](d);Ka[c[(c[a+24>>2]|0)+8>>2]&63](a);Dd(a,1);if(!(c[a+212>>2]|0))nd(a);else cd(a);f=a+4|0;g=Ia[c[c[f>>2]>>2]&7](d,1,68)|0;c[a+404>>2]=g;c[g>>2]=4;c[g+4>>2]=1;c[g+24>>2]=b;b=Ia[c[(c[f>>2]|0)+4>>2]&7](d,1,1280)|0;rf(b|0,0,1280)|0;c[g+28>>2]=b;c[g+32>>2]=b+128;c[g+36>>2]=b+256;c[g+40>>2]=b+384;c[g+44>>2]=b+512;c[g+48>>2]=b+640;c[g+52>>2]=b+768;c[g+56>>2]=b+896;c[g+60>>2]=b+1024;c[g+64>>2]=b+1152;wb(a);Ka[c[(c[f>>2]|0)+24>>2]&63](d);Ka[c[c[a+408>>2]>>2]&63](a);c[a+264>>2]=0;c[e>>2]=103;return}function Vb(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;f=c[e+20>>2]|0;if((f|0)==100)n=e;else{n=c[e>>2]|0;c[n+20>>2]=21;c[n+24>>2]=f;Ka[c[n>>2]&63](e);n=e}c[e+28>>2]=c[d+28>>2];c[e+32>>2]=c[d+32>>2];i=d+36|0;c[e+36>>2]=c[i>>2];k=d+40|0;c[e+40>>2]=c[k>>2];c[e+64>>2]=c[d+112>>2];c[e+68>>2]=c[d+116>>2];c[e+280>>2]=c[d+324>>2];c[e+284>>2]=c[d+328>>2];Ob(e);c[e+260>>2]=c[d+304>>2];Qb(e,c[k>>2]|0);c[e+72>>2]=c[d+212>>2];c[e+220>>2]=c[d+308>>2];k=0;do{h=d+164+(k<<2)|0;g=c[h>>2]|0;if(g){j=e+88+(k<<2)|0;f=c[j>>2]|0;if(!f){f=Kb(n)|0;c[j>>2]=f;g=c[h>>2]|0}h=f+128|0;do{a[f>>0]=a[g>>0]|0;f=f+1|0;g=g+1|0}while((f|0)<(h|0));c[(c[j>>2]|0)+128>>2]=0}k=k+1|0}while((k|0)!=4);f=c[i>>2]|0;m=e+76|0;c[m>>2]=f;if((f+-1|0)>>>0>9){l=c[e>>2]|0;c[l+20>>2]=27;c[l+24>>2]=f;c[l+28>>2]=10;Ka[c[l>>2]&63](n);f=c[m>>2]|0}if((f|0)>0){j=0;k=c[d+216>>2]|0;l=c[e+84>>2]|0;while(1){c[l>>2]=c[k>>2];c[l+8>>2]=c[k+8>>2];c[l+12>>2]=c[k+12>>2];i=c[k+16>>2]|0;c[l+16>>2]=i;f=d+164+(i<<2)|0;if(i>>>0<=3?(o=c[f>>2]|0,(o|0)!=0):0)g=o;else{g=c[e>>2]|0;c[g+20>>2]=54;c[g+24>>2]=i;Ka[c[g>>2]&63](n);g=c[f>>2]|0}f=c[k+80>>2]|0;if(f){h=0;do{if((b[f+(h<<1)>>1]|0)!=(b[g+(h<<1)>>1]|0)){p=c[e>>2]|0;c[p+20>>2]=45;c[p+24>>2]=i;Ka[c[p>>2]&63](n)}h=h+1|0}while((h|0)!=64)}j=j+1|0;if((j|0)>=(c[m>>2]|0))break;else{k=k+88|0;l=l+88|0}}}if(c[d+284>>2]|0){f=a[d+288>>0]|0;if((f+-1&255)<2){a[e+248>>0]=f;a[e+249>>0]=a[d+289>>0]|0}a[e+250>>0]=a[d+290>>0]|0;b[e+252>>1]=b[d+292>>1]|0;b[e+254>>1]=b[d+294>>1]|0}return}function Wb(a,b){a=a|0;b=b|0;var d=0;d=c[a+404>>2]|0;if((b|0)!=2){b=c[a>>2]|0;c[b+20>>2]=3;Ka[c[b>>2]&63](a)}c[d+8>>2]=0;Yb(a);return}function Xb(a,d){a=a|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;J=i;i=i+64|0;I=J;H=J+16|0;C=c[a+404>>2]|0;D=a+312|0;E=(c[D>>2]|0)+-1|0;F=(c[a+288>>2]|0)+-1|0;G=a+292|0;if((c[G>>2]|0)>0){d=a+4|0;e=C+24|0;f=C+8|0;g=0;do{z=c[a+296+(g<<2)>>2]|0;B=c[z+12>>2]|0;A=_(B,c[f>>2]|0)|0;c[I+(g<<2)>>2]=Ra[c[(c[d>>2]|0)+32>>2]&3](a,c[(c[e>>2]|0)+(c[z+4>>2]<<2)>>2]|0,A,B,0)|0;g=g+1|0}while((g|0)<(c[G>>2]|0))}A=C+16|0;h=c[A>>2]|0;y=C+20|0;e=c[y>>2]|0;a:do if((h|0)<(e|0)){B=C+12|0;z=a+424|0;d=C+8|0;f=e;e=c[B>>2]|0;g=c[D>>2]|0;b:while(1){if(e>>>0<g>>>0){while(1){v=c[G>>2]|0;if((v|0)>0){w=e>>>0<E>>>0;f=0;x=0;do{g=c[a+296+(x<<2)>>2]|0;p=c[g+56>>2]|0;q=_(p,e)|0;if(w)t=p;else t=c[g+72>>2]|0;r=c[g+60>>2]|0;if((r|0)>0){s=I+(x<<2)|0;u=(t|0)>0;n=g+76|0;o=(c[d>>2]|0)>>>0<F>>>0;m=u^1;l=0;do{if(o)if(u)K=20;else k=0;else if((l+h|0)>=(c[n>>2]|0)|m)k=0;else K=20;if((K|0)==20){K=0;g=f;j=(c[(c[s>>2]|0)+(l+h<<2)>>2]|0)+(q<<7)|0;k=0;while(1){c[H+(g<<2)>>2]=j;k=k+1|0;if((k|0)==(t|0))break;else{g=g+1|0;j=j+128|0}}f=t+f|0;k=t}if((k|0)<(p|0)){j=k+1|0;j=f+((p|0)>(j|0)?p:j)|0;g=k;while(1){L=c[C+28+(f<<2)>>2]|0;c[H+(f<<2)>>2]=L;b[L>>1]=b[c[H+(f+-1<<2)>>2]>>1]|0;g=g+1|0;if((g|0)>=(p|0))break;else f=f+1|0}f=j-k|0}l=l+1|0}while((l|0)<(r|0))}x=x+1|0}while((x|0)<(v|0))}if(!(Qa[c[(c[z>>2]|0)+4>>2]&31](a,H)|0)){d=h;break b}e=e+1|0;f=c[D>>2]|0;if(e>>>0>=f>>>0){e=f;break}}f=c[y>>2]|0;g=e}c[B>>2]=0;h=h+1|0;if((h|0)>=(f|0)){K=31;break a}else e=0}c[A>>2]=d;c[B>>2]=e;d=0}else{d=C+8|0;K=31}while(0);if((K|0)==31){c[d>>2]=(c[d>>2]|0)+1;Yb(a);d=1}i=J;return d|0}function Yb(a){a=a|0;var b=0,d=0;b=c[a+404>>2]|0;do if((c[a+292>>2]|0)<=1){d=c[a+296>>2]|0;if((c[b+8>>2]|0)>>>0<((c[a+288>>2]|0)+-1|0)>>>0){c[b+20>>2]=c[d+12>>2];break}else{c[b+20>>2]=c[d+76>>2];break}}else c[b+20>>2]=1;while(0);c[b+12>>2]=0;c[b+16>>2]=0;return}function Zb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;c[a+4>>2]=0;if((b|0)!=90){e=c[a>>2]|0;c[e+20>>2]=13;c[e+24>>2]=90;c[e+28>>2]=b;Ka[c[e>>2]&63](a)}if((d|0)==488)d=a;else{e=c[a>>2]|0;c[e+20>>2]=22;c[e+24>>2]=488;c[e+28>>2]=d;Ka[c[e>>2]&63](a);d=a}f=c[a>>2]|0;b=a+12|0;e=c[b>>2]|0;rf(a|0,0,488)|0;c[a>>2]=f;c[b>>2]=e;c[a+16>>2]=1;Ic(d);c[a+8>>2]=0;c[a+24>>2]=0;c[a+312>>2]=0;d=a+164|0;b=d+48|0;do{c[d>>2]=0;d=d+4|0}while((d|0)<(b|0));rc(a);lc(a);c[a+20>>2]=200;return}function _b(a){a=a|0;Jb(a);return}function $b(a,b){a=a|0;b=b|0;var d=0,e=0;d=c[a+20>>2]|0;if((d&-2|0)!=200){e=c[a>>2]|0;c[e+20>>2]=21;c[e+24>>2]=d;Ka[c[e>>2]&63](a)}d=ac(a)|0;switch(d|0){case 1:{a=1;break}case 2:{if(b){e=c[a>>2]|0;c[e+20>>2]=53;Ka[c[e>>2]&63](a)}Ib(a);a=2;break}default:a=d}return a|0}function ac(a){a=a|0;var b=0,e=0,f=0,g=0,i=0;i=a+20|0;b=c[i>>2]|0;switch(b|0){case 200:{b=a+460|0;Ka[c[(c[b>>2]|0)+4>>2]&63](a);Ka[c[(c[a+24>>2]|0)+8>>2]&63](a);c[i>>2]=201;e=4;break}case 201:{b=a+460|0;e=4;break}case 202:{b=1;break}case 210:case 208:case 207:case 206:case 205:case 204:case 203:{b=Na[c[c[a+460>>2]>>2]&15](a)|0;break}default:{i=c[a>>2]|0;c[i+20>>2]=21;c[i+24>>2]=b;Ka[c[i>>2]&63](a);b=0}}if((e|0)==4){b=Na[c[c[b>>2]>>2]&15](a)|0;if((b|0)==1){switch(c[a+36>>2]|0){case 1:{c[a+40>>2]=1;c[a+44>>2]=1;break}case 3:{f=c[a+216>>2]|0;b=c[f>>2]|0;e=c[f+88>>2]|0;f=c[f+176>>2]|0;g=(b|0)==1;a:do if(g&(e|0)==2&(f|0)==3)c[a+40>>2]=3;else{if(g&(e|0)==34&(f|0)==35){c[a+40>>2]=7;break}if((b|0)==82&(e|0)==71&(f|0)==66){c[a+40>>2]=2;break}if((b|0)==114&(e|0)==103&(f|0)==98){c[a+40>>2]=6;break}if(c[a+284>>2]|0){c[a+40>>2]=3;break}if(!(c[a+296>>2]|0)){g=c[a>>2]|0;c[g+24>>2]=b;c[g+28>>2]=e;c[g+32>>2]=f;c[g+20>>2]=113;La[c[g+4>>2]&15](a,1);c[a+40>>2]=3;break}b=d[a+300>>0]|0;switch(b|0){case 0:{c[a+40>>2]=2;break a}case 1:{c[a+40>>2]=3;break a}default:{g=c[a>>2]|0;c[g+20>>2]=116;c[g+24>>2]=b;La[c[g+4>>2]&15](a,-1);c[a+40>>2]=3;break a}}}while(0);c[a+44>>2]=2;break}case 4:{b:do if(!(c[a+296>>2]|0))c[a+40>>2]=4;else{b=d[a+300>>0]|0;switch(b|0){case 0:{c[a+40>>2]=4;break b}case 2:{c[a+40>>2]=5;break b}default:{g=c[a>>2]|0;c[g+20>>2]=116;c[g+24>>2]=b;La[c[g+4>>2]&15](a,-1);c[a+40>>2]=5;break b}}}while(0);c[a+44>>2]=4;break}default:{c[a+40>>2]=0;c[a+44>>2]=0}}b=c[a+428>>2]|0;c[a+48>>2]=b;c[a+52>>2]=b;h[a+56>>3]=1.0;c[a+64>>2]=0;c[a+68>>2]=0;c[a+72>>2]=0;c[a+76>>2]=1;c[a+80>>2]=1;c[a+84>>2]=0;c[a+88>>2]=2;c[a+92>>2]=1;c[a+96>>2]=256;c[a+136>>2]=0;c[a+100>>2]=0;c[a+104>>2]=0;c[a+108>>2]=0;c[i>>2]=202;b=1}}return b|0}function bc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;if((b|0)==0|(d|0)==0){h=c[a>>2]|0;c[h+20>>2]=24;Ka[c[h>>2]&63](a)}f=a+24|0;g=c[f>>2]|0;if(!g){g=Ia[c[c[a+4>>2]>>2]&7](a,0,40)|0;c[f>>2]=g}c[g+8>>2]=11;c[g+12>>2]=2;c[g+16>>2]=12;c[g+20>>2]=b;c[g+24>>2]=d;h=g+28|0;c[h>>2]=0;f=c[b>>2]|0;if(!((f|0)!=0?(e=c[d>>2]|0,(e|0)!=0):0)){f=jf(4096)|0;c[b>>2]=f;c[h>>2]=f;if(!f){h=c[a>>2]|0;c[h+20>>2]=56;c[h+24>>2]=10;Ka[c[h>>2]&63](a)}c[d>>2]=4096;f=c[b>>2]|0;e=4096}c[g+32>>2]=f;c[g>>2]=f;c[g+36>>2]=e;c[g+4>>2]=e;return}function cc(a){a=a|0;return}function dc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;e=c[a+24>>2]|0;f=e+36|0;g=c[f>>2]<<1;h=jf(g)|0;if(!h){d=c[a>>2]|0;c[d+20>>2]=56;c[d+24>>2]=10;Ka[c[d>>2]&63](a)}a=e+32|0;xf(h|0,c[a>>2]|0,c[f>>2]|0)|0;b=e+28|0;d=c[b>>2]|0;if(d)kf(d);c[b>>2]=h;d=c[f>>2]|0;c[e>>2]=h+d;c[e+4>>2]=d;c[a>>2]=h;c[f>>2]=g;return 1}function ec(a){a=a|0;a=c[a+24>>2]|0;c[c[a+20>>2]>>2]=c[a+32>>2];c[c[a+24>>2]>>2]=(c[a+36>>2]|0)-(c[a+4>>2]|0);return}function fc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;if((b|0)==0|(d|0)==0){f=c[a>>2]|0;c[f+20>>2]=43;Ka[c[f>>2]&63](a)}f=a+24|0;e=c[f>>2]|0;if(!e){e=Ia[c[c[a+4>>2]>>2]&7](a,0,28)|0;c[f>>2]=e}c[e+8>>2]=13;c[e+12>>2]=3;c[e+16>>2]=5;c[e+20>>2]=2;c[e+24>>2]=14;c[e+4>>2]=d;c[e>>2]=b;return}function gc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;f=c[a+24>>2]|0;if((b|0)>0){g=f+4|0;d=c[g>>2]|0;if((d|0)<(b|0)){e=f+12|0;do{b=b-d|0;Na[c[e>>2]&15](a)|0;d=c[g>>2]|0}while((b|0)>(d|0))}c[f>>2]=(c[f>>2]|0)+b;c[g>>2]=d-b}return}function hc(a){a=a|0;return}function ic(a){a=a|0;return}function jc(a){a=a|0;var b=0;b=c[a>>2]|0;c[b+20>>2]=123;La[c[b+4>>2]&15](a,-1);a=c[a+24>>2]|0;c[a>>2]=22283;c[a+4>>2]=2;return 1}function kc(a){a=a|0;c[a+112>>2]=c[a+28>>2];c[a+116>>2]=c[a+32>>2];return}function lc(a){a=a|0;var b=0;b=Ia[c[c[a+4>>2]>>2]&7](a,0,28)|0;c[a+460>>2]=b;c[b>>2]=4;c[b+4>>2]=15;c[b+8>>2]=16;c[b+12>>2]=17;c[b+16>>2]=0;c[b+20>>2]=0;c[b+24>>2]=1;return}function mc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;E=a+460|0;b=c[E>>2]|0;F=b+20|0;a:do if(!(c[F>>2]|0)){G=a+464|0;I=b+24|0;J=a+340|0;C=b+16|0;D=a+32|0;l=a+212|0;m=a+36|0;n=a+316|0;o=a+320|0;p=a+216|0;q=a+220|0;r=a+224|0;s=a+416|0;t=a+412|0;u=a+420|0;v=a+424|0;k=a+428|0;w=a+432|0;x=a+436|0;y=a+324|0;z=a+328|0;A=a+28|0;B=a+332|0;b:while(1){b=Na[c[(c[G>>2]|0)+4>>2]&15](a)|0;switch(b|0){case 2:{K=57;break b}case 1:break;default:break a}c:do switch(c[I>>2]|0){case 0:{if(!(c[C>>2]|0)){j=c[a>>2]|0;c[j+20>>2]=36;Ka[c[j>>2]&63](a)}if(!(c[J>>2]|0))continue b;else{K=56;break b}}case 1:{if(!((c[D>>2]|0)<=65500?(c[A>>2]|0)<=65500:0)){j=c[a>>2]|0;c[j+20>>2]=42;c[j+24>>2]=65500;Ka[c[j>>2]&63](a)}b=c[l>>2]|0;if((b+-8|0)>>>0>4){j=c[a>>2]|0;c[j+20>>2]=16;c[j+24>>2]=b;Ka[c[j>>2]&63](a)}b=c[m>>2]|0;if((b|0)>10){j=c[a>>2]|0;c[j+20>>2]=27;c[j+24>>2]=b;c[j+28>>2]=10;Ka[c[j>>2]&63](a);b=c[m>>2]|0}c[n>>2]=1;c[o>>2]=1;if((b|0)>0){f=1;h=1;i=0;j=c[p>>2]|0;while(1){d=j+8|0;e=c[d>>2]|0;g=j+12|0;if((e+-1|0)>>>0<=3?(H=c[g>>2]|0,(H+-1|0)>>>0<=3):0)d=H;else{h=c[a>>2]|0;c[h+20>>2]=19;Ka[c[h>>2]&63](a);h=c[n>>2]|0;e=c[d>>2]|0;f=c[o>>2]|0;d=c[g>>2]|0;b=c[m>>2]|0}h=(h|0)>(e|0)?h:e;c[n>>2]=h;f=(f|0)>(d|0)?f:d;c[o>>2]=f;i=i+1|0;if((i|0)>=(b|0)){d=b;break}else j=j+88|0}}else d=b;d:do if(!(c[q>>2]|0)){if((c[r>>2]|0)!=0?(c[J>>2]|0)!=0:0){K=22;break}do switch(c[s>>2]|0){case 0:{c[k>>2]=1;c[w>>2]=17620;c[x>>2]=0;b=1;break d}case 3:{c[k>>2]=2;c[w>>2]=18800;c[x>>2]=3;b=2;break d}case 8:{c[k>>2]=3;c[w>>2]=18700;c[x>>2]=8;b=3;break d}case 15:{c[k>>2]=4;c[w>>2]=18572;c[x>>2]=15;b=4;break d}case 24:{c[k>>2]=5;c[w>>2]=18408;c[x>>2]=24;b=5;break d}case 35:{c[k>>2]=6;c[w>>2]=18200;c[x>>2]=35;b=6;break d}case 48:{c[k>>2]=7;c[w>>2]=17940;c[x>>2]=48;b=7;break d}case 63:{c[k>>2]=8;c[w>>2]=17620;c[x>>2]=63;b=8;break d}case 80:{c[k>>2]=9;c[w>>2]=17620;c[x>>2]=63;b=9;break d}case 99:{c[k>>2]=10;c[w>>2]=17620;c[x>>2]=63;b=10;break d}case 120:{c[k>>2]=11;c[w>>2]=17620;c[x>>2]=63;b=11;break d}case 143:{c[k>>2]=12;c[w>>2]=17620;c[x>>2]=63;b=12;break d}case 168:{c[k>>2]=13;c[w>>2]=17620;c[x>>2]=63;b=13;break d}case 195:{c[k>>2]=14;c[w>>2]=17620;c[x>>2]=63;b=14;break d}case 224:{c[k>>2]=15;c[w>>2]=17620;c[x>>2]=63;b=15;break d}case 255:{c[k>>2]=16;c[w>>2]=17620;c[x>>2]=63;b=16;break d}default:{b=c[a>>2]|0;c[b+20>>2]=17;c[b+24>>2]=c[t>>2];c[b+28>>2]=c[s>>2];c[b+32>>2]=c[u>>2];c[b+36>>2]=c[v>>2];Ka[c[b>>2]&63](a);b=c[k>>2]|0;d=c[m>>2]|0;break d}}while(0)}else K=22;while(0);if((K|0)==22){K=0;c[k>>2]=8;c[w>>2]=17620;c[x>>2]=63;b=8}c[y>>2]=b;c[z>>2]=b;if((d|0)>0){d=0;e=c[p>>2]|0;while(1){c[e+36>>2]=b;c[e+40>>2]=b;i=e+8|0;j=_(c[i>>2]|0,c[A>>2]|0)|0;c[e+28>>2]=Gc(j,_(c[n>>2]|0,b)|0)|0;j=e+12|0;h=_(c[j>>2]|0,c[D>>2]|0)|0;c[e+32>>2]=Gc(h,_(c[k>>2]|0,c[o>>2]|0)|0)|0;i=_(c[i>>2]|0,c[A>>2]|0)|0;c[e+44>>2]=Gc(i,c[n>>2]|0)|0;j=_(c[j>>2]|0,c[D>>2]|0)|0;c[e+48>>2]=Gc(j,c[o>>2]|0)|0;c[e+52>>2]=1;c[e+80>>2]=0;d=d+1|0;if((d|0)>=(c[m>>2]|0))break;b=c[k>>2]|0;e=e+88|0}b=c[k>>2]|0}c[B>>2]=Gc(c[D>>2]|0,_(b,c[o>>2]|0)|0)|0;b=c[J>>2]|0;if((b|0)>=(c[m>>2]|0)?(c[r>>2]|0)==0:0){c[(c[E>>2]|0)+16>>2]=0;break c}c[(c[E>>2]|0)+16>>2]=1;break}default:b=c[J>>2]|0}while(0);if(b){K=52;break}c[I>>2]=2}if((K|0)==52){c[I>>2]=0;b=1;break}else if((K|0)==56){oc(a);b=1;break}else if((K|0)==57){c[F>>2]=1;if(!(c[I>>2]|0)){d=a+152|0;b=c[a+144>>2]|0;if((c[d>>2]|0)<=(b|0)){b=2;break}c[d>>2]=b;b=2;break}else{if(!(c[(c[G>>2]|0)+16>>2]|0)){b=2;break}b=c[a>>2]|0;c[b+20>>2]=62;Ka[c[b>>2]&63](a);b=2;break}}}else b=2;while(0);return b|0}function nc(a){a=a|0;var b=0;b=c[a+460>>2]|0;c[b>>2]=4;c[b+16>>2]=0;c[b+20>>2]=0;c[b+24>>2]=1;Ka[c[(c[a>>2]|0)+16>>2]&63](a);Ka[c[c[a+464>>2]>>2]&63](a);c[a+160>>2]=0;return}function oc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;h=a+340|0;b=c[h>>2]|0;if((b|0)!=1){if((b+-1|0)>>>0>3){f=c[a>>2]|0;c[f+20>>2]=27;c[f+24>>2]=b;c[f+28>>2]=4;Ka[c[f>>2]&63](a)}f=a+428|0;c[a+360>>2]=Gc(c[a+28>>2]|0,_(c[f>>2]|0,c[a+316>>2]|0)|0)|0;c[a+364>>2]=Gc(c[a+32>>2]|0,_(c[f>>2]|0,c[a+320>>2]|0)|0)|0;f=a+368|0;c[f>>2]=0;if((c[h>>2]|0)>0){e=0;d=0;while(1){i=c[a+344+(d<<2)>>2]|0;l=c[i+8>>2]|0;c[i+56>>2]=l;k=c[i+12>>2]|0;c[i+60>>2]=k;b=_(k,l)|0;c[i+64>>2]=b;c[i+68>>2]=_(c[i+36>>2]|0,l)|0;j=((c[i+28>>2]|0)>>>0)%(l>>>0)|0;c[i+72>>2]=(j|0)==0?l:j;j=((c[i+32>>2]|0)>>>0)%(k>>>0)|0;c[i+76>>2]=(j|0)==0?k:j;if((b+e|0)>10){l=c[a>>2]|0;c[l+20>>2]=14;Ka[c[l>>2]&63](a)}if((b|0)>0)while(1){l=c[f>>2]|0;c[f>>2]=l+1;c[a+372+(l<<2)>>2]=d;if((b|0)>1)b=b+-1|0;else break}d=d+1|0;b=c[h>>2]|0;if((d|0)>=(b|0))break;e=c[f>>2]|0}if((b|0)>0)g=14}}else{b=c[a+344>>2]|0;c[a+360>>2]=c[b+28>>2];g=c[b+32>>2]|0;c[a+364>>2]=g;c[b+56>>2]=1;c[b+60>>2]=1;c[b+64>>2]=1;c[b+68>>2]=c[b+36>>2];c[b+72>>2]=1;l=c[b+12>>2]|0;g=(g>>>0)%(l>>>0)|0;c[b+76>>2]=(g|0)==0?l:g;c[a+368>>2]=1;c[a+372>>2]=0;b=1;g=14}if((g|0)==14){g=a+4|0;f=0;do{d=c[a+344+(f<<2)>>2]|0;e=d+80|0;if(!(c[e>>2]|0)){d=c[d+16>>2]|0;b=a+164+(d<<2)|0;if(!(d>>>0<=3?(c[b>>2]|0)!=0:0)){l=c[a>>2]|0;c[l+20>>2]=54;c[l+24>>2]=d;Ka[c[l>>2]&63](a)}l=Ia[c[c[g>>2]>>2]&7](a,1,132)|0;xf(l|0,c[b>>2]|0,132)|0;c[e>>2]=l;b=c[h>>2]|0}f=f+1|0}while((f|0)<(b|0))}Ka[c[c[a+468>>2]>>2]&63](a);l=a+452|0;Ka[c[c[l>>2]>>2]&63](a);c[c[a+460>>2]>>2]=c[(c[l>>2]|0)+4>>2];return}function pc(a){a=a|0;Ka[c[(c[a+468>>2]|0)+8>>2]&63](a);c[c[a+460>>2]>>2]=4;return}function qc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;f=a+440|0;e=c[f>>2]|0;g=c[a>>2]|0;c[g+20>>2]=124;c[g+24>>2]=e;c[g+28>>2]=b;La[c[g+4>>2]&15](a,-1);g=b+1&7|208;h=b+2&7|208;i=b+7&7|208;b=b+6&7|208;a:while(1){d=(e|0)<192;k=d|(e&-8|0)!=208|(e|0)==(g|0);d=k|(e|0)==(h|0)?(k&d?2:3):(e|0)==(i|0)|(e|0)==(b|0)?2:1;b:while(1){k=c[a>>2]|0;c[k+20>>2]=99;c[k+24>>2]=e;c[k+28>>2]=d;La[c[k+4>>2]&15](a,4);switch(d|0){case 3:{b=1;break a}case 1:{j=4;break a}case 2:break b;default:{}}}if(!(sc(a)|0)){b=0;break}e=c[f>>2]|0}if((j|0)==4){c[f>>2]=0;b=1}return b|0}function rc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;d=Ia[c[c[a+4>>2]>>2]&7](a,0,172)|0;e=a+464|0;c[e>>2]=d;c[d>>2]=18;c[d+4>>2]=5;c[d+8>>2]=6;c[d+28>>2]=7;c[d+96>>2]=0;f=d+32|0;b=d+100|0;g=0;do{c[f+(g<<2)>>2]=7;c[b+(g<<2)>>2]=0;g=g+1|0}while((g|0)!=16);c[f>>2]=8;c[d+88>>2]=8;g=c[e>>2]|0;c[a+216>>2]=0;c[a+144>>2]=0;c[a+440>>2]=0;c[g+12>>2]=0;c[g+16>>2]=0;c[g+24>>2]=0;c[g+164>>2]=0;return}function sc(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;j=c[b+24>>2]|0;k=j+4|0;i=j+12|0;l=b+464|0;d=c[k>>2]|0;e=c[j>>2]|0;a:while(1){if(!d){if(!(Na[c[i>>2]&15](b)|0)){d=0;break}f=c[j>>2]|0;d=c[k>>2]|0}else f=e;d=d+-1|0;e=f+1|0;if((a[f>>0]|0)!=-1)do{h=(c[l>>2]|0)+24|0;c[h>>2]=(c[h>>2]|0)+1;c[j>>2]=e;c[k>>2]=d;if(!d){if(!(Na[c[i>>2]&15](b)|0)){d=0;break a}f=c[j>>2]|0;d=c[k>>2]|0}else f=e;d=d+-1|0;e=f+1|0}while((a[f>>0]|0)!=-1);while(1){if(!d){if(!(Na[c[i>>2]&15](b)|0)){d=0;break a}d=c[k>>2]|0;f=c[j>>2]|0}else f=e;d=d+-1|0;e=f+1|0;f=a[f>>0]|0;if(f<<24>>24!=-1){h=f;break}}g=(c[l>>2]|0)+24|0;f=c[g>>2]|0;if(h<<24>>24){g=d;d=h;m=16;break}c[g>>2]=f+2;c[j>>2]=e;c[k>>2]=d}if((m|0)==16){d=d&255;if(f){m=c[b>>2]|0;c[m+20>>2]=119;c[m+24>>2]=f;c[m+28>>2]=d;La[c[m+4>>2]&15](b,-1);c[(c[l>>2]|0)+24>>2]=0}c[b+440>>2]=d;c[j>>2]=e;c[k>>2]=g;d=1}return d|0}function tc(a){a=a|0;var b=0;b=c[a+464>>2]|0;c[a+216>>2]=0;c[a+144>>2]=0;c[a+440>>2]=0;c[b+12>>2]=0;c[b+16>>2]=0;c[b+24>>2]=0;c[b+164>>2]=0;return}function uc(f){f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0;ca=i;i=i+288|0;X=ca+256|0;Y=ca;aa=f+440|0;ba=f+464|0;E=f+24|0;P=f+280|0;R=f+40|0;S=f+304|0;T=f+308|0;U=f+284|0;V=f+288|0;W=f+289|0;u=f+290|0;v=f+292|0;w=f+294|0;x=f+296|0;y=f+300|0;z=X+1|0;A=X+2|0;B=X+3|0;C=X+4|0;D=X+5|0;F=X+6|0;G=X+7|0;H=X+8|0;I=X+9|0;J=X+10|0;K=X+11|0;L=X+12|0;M=X+13|0;N=X+14|0;O=X+15|0;Q=X+16|0;_=f+36|0;$=f+216|0;g=c[aa>>2]|0;a:while(1){do if(!g){if(c[(c[ba>>2]|0)+12>>2]|0){if(!(sc(f)|0)){g=0;break a}g=c[aa>>2]|0;break}m=c[E>>2]|0;n=m+4|0;g=c[n>>2]|0;if(!g){if(!(Na[c[m+12>>2]&15](f)|0)){g=0;break a}g=c[n>>2]|0}k=c[m>>2]|0;g=g+-1|0;h=k+1|0;k=a[k>>0]|0;l=k&255;if(!g){if(!(Na[c[m+12>>2]&15](f)|0)){g=0;break a}j=c[n>>2]|0;h=c[m>>2]|0}else j=g;t=a[h>>0]|0;g=t&255;if(k<<24>>24!=-1|t<<24>>24!=-40){t=c[f>>2]|0;c[t+20>>2]=55;c[t+24>>2]=l;c[t+28>>2]=g;Ka[c[t>>2]&63](f)}c[aa>>2]=g;c[m>>2]=h+1;c[n>>2]=j+-1}while(0);do switch(g|0){case 218:{Z=26;break a}case 217:{Z=73;break a}case 216:{t=c[f>>2]|0;c[t+20>>2]=104;La[c[t+4>>2]&15](f,1);if(!(c[(c[ba>>2]|0)+12>>2]|0))g=0;else{g=c[f>>2]|0;c[g+20>>2]=64;Ka[c[g>>2]&63](f);g=0}do{a[f+232+g>>0]=0;a[f+248+g>>0]=1;a[f+264+g>>0]=5;g=g+1|0}while((g|0)!=16);c[P>>2]=0;c[R>>2]=0;c[S>>2]=0;c[T>>2]=0;c[U>>2]=0;a[V>>0]=1;a[W>>0]=1;a[u>>0]=0;b[v>>1]=1;b[w>>1]=1;c[x>>2]=0;a[y>>0]=0;c[(c[ba>>2]|0)+12>>2]=1;break}case 192:{if(!(yc(f,1,0,0)|0)){g=0;break a}break}case 193:{if(!(yc(f,0,0,0)|0)){g=0;break a}break}case 194:{if(!(yc(f,0,1,0)|0)){g=0;break a}break}case 201:{if(!(yc(f,0,0,1)|0)){g=0;break a}break}case 202:{if(!(yc(f,0,1,1)|0)){g=0;break a}break}case 207:case 206:case 205:case 203:case 200:case 199:case 198:case 197:case 195:{t=c[f>>2]|0;c[t+20>>2]=63;c[t+24>>2]=g;Ka[c[t>>2]&63](f);break}case 204:{if(!(wc(f)|0)){g=0;break a}break}case 196:{p=c[E>>2]|0;q=p+4|0;g=c[q>>2]|0;if(!g){if(!(Na[c[p+12>>2]&15](f)|0)){Z=105;break a}g=c[q>>2]|0}k=c[p>>2]|0;g=g+-1|0;h=k+1|0;k=d[k>>0]<<8;if(!g){if(!(Na[c[p+12>>2]&15](f)|0)){Z=105;break a}g=c[q>>2]|0;h=c[p>>2]|0}j=g+-1|0;g=h+1|0;h=(d[h>>0]|k)+-2|0;if((h|0)>16){o=p+12|0;do{if(!j){if(!(Na[c[o>>2]&15](f)|0)){Z=105;break a}j=c[q>>2]|0;g=c[p>>2]|0}n=d[g>>0]|0;k=c[f>>2]|0;c[k+20>>2]=82;c[k+24>>2]=n;La[c[k+4>>2]&15](f,1);a[X>>0]=0;j=j+-1|0;k=0;l=1;g=g+1|0;do{if(!j){if(!(Na[c[o>>2]&15](f)|0)){Z=105;break a}j=c[q>>2]|0;g=c[p>>2]|0}t=a[g>>0]|0;a[X+l>>0]=t;k=(t&255)+k|0;l=l+1|0;j=j+-1|0;g=g+1|0}while((l|0)<17);m=h+-17|0;t=c[f>>2]|0;c[t+24>>2]=d[z>>0];c[t+28>>2]=d[A>>0];c[t+32>>2]=d[B>>0];c[t+36>>2]=d[C>>0];c[t+40>>2]=d[D>>0];c[t+44>>2]=d[F>>0];c[t+48>>2]=d[G>>0];c[t+52>>2]=d[H>>0];c[t+20>>2]=88;La[c[t+4>>2]&15](f,2);t=c[f>>2]|0;c[t+24>>2]=d[I>>0];c[t+28>>2]=d[J>>0];c[t+32>>2]=d[K>>0];c[t+36>>2]=d[L>>0];c[t+40>>2]=d[M>>0];c[t+44>>2]=d[N>>0];c[t+48>>2]=d[O>>0];c[t+52>>2]=d[Q>>0];c[t+20>>2]=88;La[c[t+4>>2]&15](f,2);if((k|0)>256|(m|0)<(k|0)){t=c[f>>2]|0;c[t+20>>2]=9;Ka[c[t>>2]&63](f)}rf(Y|0,0,256)|0;if((k|0)>0){l=0;do{if(!j){if(!(Na[c[o>>2]&15](f)|0)){Z=105;break a}j=c[q>>2]|0;h=c[p>>2]|0}else h=g;j=j+-1|0;g=h+1|0;a[Y+l>>0]=a[h>>0]|0;l=l+1|0}while((l|0)<(k|0))}h=m-k|0;s=(n&16|0)==0;t=n+-16|0;k=s?n:t;n=s?f+180+(n<<2)|0:f+196+(t<<2)|0;if(k>>>0>3){t=c[f>>2]|0;c[t+20>>2]=31;c[t+24>>2]=k;Ka[c[t>>2]&63](f)}k=c[n>>2]|0;if(!k){k=Lb(f)|0;c[n>>2]=k}l=X;m=k+17|0;do{a[k>>0]=a[l>>0]|0;k=k+1|0;l=l+1|0}while((k|0)<(m|0));xf((c[n>>2]|0)+17|0,Y|0,256)|0}while((h|0)>16)}if(h){t=c[f>>2]|0;c[t+20>>2]=12;Ka[c[t>>2]&63](f)}c[p>>2]=g;c[q>>2]=j;break}case 219:{s=c[E>>2]|0;t=s+4|0;g=c[t>>2]|0;if(!g){if(!(Na[c[s+12>>2]&15](f)|0)){g=0;break a}g=c[t>>2]|0}k=c[s>>2]|0;g=g+-1|0;h=k+1|0;k=d[k>>0]<<8;if(!g){if(!(Na[c[s+12>>2]&15](f)|0)){g=0;break a}g=c[t>>2]|0;h=c[s>>2]|0}j=g+-1|0;g=h+1|0;r=d[h>>0]|k;h=r+-2|0;if(r>>>0>2){r=s+12|0;do{q=h+-1|0;if(!j){if(!(Na[c[r>>2]&15](f)|0)){g=0;break a}j=c[t>>2]|0;g=c[s>>2]|0}k=d[g>>0]|0;m=k>>>4;k=k&15;Z=c[f>>2]|0;c[Z+20>>2]=83;c[Z+24>>2]=k;c[Z+28>>2]=m;La[c[Z+4>>2]&15](f,1);if(k>>>0>3){Z=c[f>>2]|0;c[Z+20>>2]=32;c[Z+24>>2]=k;Ka[c[Z>>2]&63](f)}k=f+164+(k<<2)|0;l=c[k>>2]|0;if(!l){l=Kb(f)|0;c[k>>2]=l}p=(m|0)!=0;if(p)if((h|0)<129){h=0;do{b[l+(h<<1)>>1]=1;h=h+1|0}while((h|0)!=64);h=q>>1;Z=128}else Z=135;else if((h|0)<65){h=0;do{b[l+(h<<1)>>1]=1;h=h+1|0}while((h|0)!=64);h=q;Z=128}else Z=135;b:do if((Z|0)==128){Z=0;switch(h|0){case 4:{h=4;k=18800;break}case 9:{k=18700;break}case 16:{k=18572;break}case 25:{k=18408;break}case 36:{k=18200;break}case 49:{k=17940;break}default:{j=j+-1|0;g=g+1|0;if((h|0)>0){k=17620;Z=137;break b}else{m=h;break b}}}j=j+-1|0;g=g+1|0;Z=137}else if((Z|0)==135){j=j+-1|0;h=64;k=17620;g=g+1|0;Z=137}while(0);if((Z|0)==137){Z=0;o=0;while(1){m=(j|0)==0;if(p){if(m){if(!(Na[c[r>>2]&15](f)|0)){g=0;break a}j=c[t>>2]|0;g=c[s>>2]|0}j=j+-1|0;m=g+1|0;g=d[g>>0]<<8;if(!j){if(!(Na[c[r>>2]&15](f)|0)){g=0;break a}j=c[t>>2]|0;m=c[s>>2]|0}n=m;g=d[m>>0]|g}else{if(m){if(!(Na[c[r>>2]&15](f)|0)){g=0;break a}j=c[t>>2]|0;g=c[s>>2]|0}n=g;g=d[g>>0]|0}b[l+(c[k+(o<<2)>>2]<<1)>>1]=g;o=o+1|0;j=j+-1|0;g=n+1|0;if((o|0)>=(h|0)){m=h;break}}}h=c[f>>2]|0;c:do if((c[h+104>>2]|0)>1){k=0;while(1){c[h+24>>2]=e[l+(k<<1)>>1];c[h+28>>2]=e[l+((k|1)<<1)>>1];c[h+32>>2]=e[l+((k|2)<<1)>>1];c[h+36>>2]=e[l+((k|3)<<1)>>1];c[h+40>>2]=e[l+((k|4)<<1)>>1];c[h+44>>2]=e[l+((k|5)<<1)>>1];c[h+48>>2]=e[l+((k|6)<<1)>>1];c[h+52>>2]=e[l+((k|7)<<1)>>1];c[h+20>>2]=95;La[c[h+4>>2]&15](f,2);k=k+8|0;if((k|0)>=64)break c;h=c[f>>2]|0}}while(0);h=q-m+(p?0-m|0:0)|0}while((h|0)>0)}if(h){r=c[f>>2]|0;c[r+20>>2]=12;Ka[c[r>>2]&63](f)}c[s>>2]=g;c[t>>2]=j;break}case 221:{l=c[E>>2]|0;m=l+4|0;g=c[m>>2]|0;if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0}k=c[l>>2]|0;g=g+-1|0;h=k+1|0;k=d[k>>0]<<8;if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}g=g+-1|0;j=h+1|0;if((d[h>>0]|k|0)!=4){t=c[f>>2]|0;c[t+20>>2]=12;Ka[c[t>>2]&63](f)}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;j=c[l>>2]|0}h=g+-1|0;g=j+1|0;j=d[j>>0]<<8;if(!h){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}h=c[m>>2]|0;g=c[l>>2]|0}t=d[g>>0]|j;s=c[f>>2]|0;c[s+20>>2]=84;c[s+24>>2]=t;La[c[s+4>>2]&15](f,1);c[P>>2]=t;c[l>>2]=g+1;c[m>>2]=h+-1;break}case 248:{l=c[E>>2]|0;h=c[l>>2]|0;m=l+4|0;g=c[m>>2]|0;if(!(c[(c[ba>>2]|0)+16>>2]|0)){t=c[f>>2]|0;c[t+20>>2]=60;ue(t+24|0,22291,80)|0;Ka[c[c[f>>2]>>2]&63](f)}do if((c[_>>2]|0)>=3){if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}g=g+-1|0;j=h+1|0;k=d[h>>0]<<8;if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}else h=j;g=g+-1|0;j=h+1|0;if((d[h>>0]|k|0)!=24){t=c[f>>2]|0;c[t+20>>2]=12;Ka[c[t>>2]&63](f)}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;j=c[l>>2]|0}g=g+-1|0;h=j+1|0;if((a[j>>0]|0)!=13){t=c[f>>2]|0;c[t+20>>2]=70;c[t+24>>2]=c[aa>>2];Ka[c[t>>2]&63](f)}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}g=g+-1|0;j=h+1|0;k=d[h>>0]<<8;if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;j=c[l>>2]|0}g=g+-1|0;h=j+1|0;if((d[j>>0]|k|0)==255){if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}g=g+-1|0;j=h+1|0;if((a[h>>0]|0)==3){if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;k=c[l>>2]|0}else k=j;g=g+-1|0;h=k+1|0;j=c[$>>2]|0;if((d[k>>0]|0)==(c[j+88>>2]|0)){if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}j=c[$>>2]|0;g=c[m>>2]|0;h=c[l>>2]|0}g=g+-1|0;k=h+1|0;if((d[h>>0]|0)==(c[j>>2]|0)){if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}j=c[$>>2]|0;g=c[m>>2]|0;k=c[l>>2]|0}g=g+-1|0;h=k+1|0;if((d[k>>0]|0)!=(c[j+176>>2]|0)){Z=266;break}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}g=g+-1|0;j=h+1|0;if((a[h>>0]|0)!=-128){h=j;Z=266;break}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}else h=j;g=g+-1|0;j=h+1|0;k=d[h>>0]<<8;if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;j=c[l>>2]|0}g=g+-1|0;h=j+1|0;if(d[j>>0]|k){Z=266;break}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}g=g+-1|0;j=h+1|0;k=d[h>>0]<<8;if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;j=c[l>>2]|0}g=g+-1|0;h=j+1|0;if(d[j>>0]|k){Z=266;break}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}g=g+-1|0;j=h+1|0;if(a[h>>0]|0){h=j;Z=266;break}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}else h=j;g=g+-1|0;j=h+1|0;k=d[h>>0]<<8;if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;j=c[l>>2]|0}g=g+-1|0;h=j+1|0;if((d[j>>0]|k|0)!=1){Z=266;break}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}g=g+-1|0;j=h+1|0;k=d[h>>0]<<8;if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;j=c[l>>2]|0}g=g+-1|0;h=j+1|0;if(d[j>>0]|k){Z=266;break}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}g=g+-1|0;j=h+1|0;if(a[h>>0]|0){h=j;Z=266;break}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}else h=j;g=g+-1|0;j=h+1|0;k=d[h>>0]<<8;if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;j=c[l>>2]|0}g=g+-1|0;h=j+1|0;if((d[j>>0]|k|0)!=1){Z=266;break}if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;h=c[l>>2]|0}g=g+-1|0;j=h+1|0;k=d[h>>0]<<8;if(!g){if(!(Na[c[l+12>>2]&15](f)|0)){g=0;break a}g=c[m>>2]|0;j=c[l>>2]|0}g=g+-1|0;h=j+1|0;if(d[j>>0]|k)Z=266}else{h=k;Z=266}}else Z=266}else{h=j;Z=266}}else Z=266}else Z=266;while(0);if((Z|0)==266){Z=0;t=c[f>>2]|0;c[t+20>>2]=28;Ka[c[t>>2]&63](f)}c[S>>2]=1;c[l>>2]=h;c[m>>2]=g;break}case 239:case 238:case 237:case 236:case 235:case 234:case 233:case 232:case 231:case 230:case 229:case 228:case 227:case 226:case 225:case 224:{if(!(Na[c[(c[ba>>2]|0)+32+(g+-224<<2)>>2]&15](f)|0)){g=0;break a}break}case 254:{if(!(Na[c[(c[ba>>2]|0)+28>>2]&15](f)|0)){g=0;break a}break}case 1:case 215:case 214:case 213:case 212:case 211:case 210:case 209:case 208:{t=c[f>>2]|0;c[t+20>>2]=94;c[t+24>>2]=g;La[c[t+4>>2]&15](f,1);break}case 220:{if(!(wc(f)|0)){g=0;break a}break}default:{t=c[f>>2]|0;c[t+20>>2]=70;c[t+24>>2]=g;Ka[c[t>>2]&63](f)}}while(0);c[aa>>2]=0;g=0}d:do if((Z|0)==26){r=c[E>>2]|0;h=c[r>>2]|0;s=r+4|0;g=c[s>>2]|0;if(!(c[(c[ba>>2]|0)+16>>2]|0)){Y=c[f>>2]|0;c[Y+20>>2]=60;ue(Y+24|0,22287,80)|0;Ka[c[c[f>>2]>>2]&63](f)}if(!g){if(!(Na[c[r+12>>2]&15](f)|0)){g=0;break}g=c[s>>2]|0;h=c[r>>2]|0}g=g+-1|0;j=h+1|0;k=d[h>>0]<<8;if(!g){if(!(Na[c[r+12>>2]&15](f)|0)){g=0;break}g=c[s>>2]|0;j=c[r>>2]|0}g=g+-1|0;h=j+1|0;j=d[j>>0]|k;if(!g){if(!(Na[c[r+12>>2]&15](f)|0)){g=0;break}g=c[s>>2]|0;l=c[r>>2]|0}else l=h;k=a[l>>0]|0;q=k&255;Y=c[f>>2]|0;c[Y+20>>2]=105;c[Y+24>>2]=q;La[c[Y+4>>2]&15](f,1);do if(!((k&255)>4|(j|0)!=((q<<1)+6|0))){if(k<<24>>24){c[f+340>>2]=q;h=g+-1|0;g=(h|0)==0;j=l+1|0;Z=43;break}if(c[f+224>>2]|0){c[f+340>>2]=q;h=g+-1|0;if(!h){g=1;Z=62}else{g=1;k=l+1|0}}else Z=42}else Z=42;while(0);if((Z|0)==42){h=c[f>>2]|0;c[h+20>>2]=12;Ka[c[h>>2]&63](f);c[f+340>>2]=q;h=g+-1|0;j=l+1|0;g=(h|0)==0;if(!(k<<24>>24)){k=g;g=1;Z=61}else Z=43}if((Z|0)==43){o=r+12|0;p=f+344|0;n=0;while(1){if(g){if(!(Na[c[o>>2]&15](f)|0)){g=0;break d}h=c[s>>2]|0;j=c[r>>2]|0}l=h+-1|0;m=j+1|0;g=d[j>>0]|0;e:do if((n|0)>0){h=0;while(1){if((g|0)==(c[c[f+344+(h<<2)>>2]>>2]|0))break;h=h+1|0;if((h|0)>=(n|0))break e}g=c[c[p>>2]>>2]|0;if((n|0)>1){h=1;do{Y=c[c[f+344+(h<<2)>>2]>>2]|0;g=(Y|0)>(g|0)?Y:g;h=h+1|0}while((h|0)!=(n|0))}g=g+1|0}while(0);h=c[$>>2]|0;j=c[_>>2]|0;f:do if((j|0)>0){k=0;while(1){if((g|0)==(c[h>>2]|0))break f;k=k+1|0;h=h+88|0;if((k|0)>=(j|0)){Z=56;break}}}else Z=56;while(0);if((Z|0)==56){Z=0;Y=c[f>>2]|0;c[Y+20>>2]=4;c[Y+24>>2]=g;Ka[c[Y>>2]&63](f)}c[f+344+(n<<2)>>2]=h;if(!l){if(!(Na[c[o>>2]&15](f)|0)){g=0;break d}g=c[s>>2]|0;j=c[r>>2]|0}else{g=l;j=m}Y=d[j>>0]|0;W=h+20|0;c[W>>2]=Y>>>4;X=h+24|0;c[X>>2]=Y&15;Y=c[f>>2]|0;c[Y+24>>2]=c[h>>2];c[Y+28>>2]=c[W>>2];c[Y+32>>2]=c[X>>2];c[Y+20>>2]=106;La[c[Y+4>>2]&15](f,1);n=n+1|0;h=g+-1|0;j=j+1|0;g=(h|0)==0;if((n|0)>=(q|0)){k=g;g=0;Z=61;break}}}if((Z|0)==61)if(k)Z=62;else k=j;if((Z|0)==62){if(!(Na[c[r+12>>2]&15](f)|0)){g=0;break}h=c[s>>2]|0;k=c[r>>2]|0}h=h+-1|0;j=k+1|0;m=f+412|0;c[m>>2]=d[k>>0];if(!h){if(!(Na[c[r+12>>2]&15](f)|0)){g=0;break}h=c[s>>2]|0;j=c[r>>2]|0}k=h+-1|0;h=j+1|0;l=f+416|0;c[l>>2]=d[j>>0];if(!k){if(!(Na[c[r+12>>2]&15](f)|0)){g=0;break}k=c[s>>2]|0;h=c[r>>2]|0}$=d[h>>0]|0;Z=f+420|0;c[Z>>2]=$>>>4;_=f+424|0;c[_>>2]=$&15;$=c[f>>2]|0;c[$+24>>2]=c[m>>2];c[$+28>>2]=c[l>>2];c[$+32>>2]=c[Z>>2];c[$+36>>2]=c[_>>2];c[$+20>>2]=107;La[c[$+4>>2]&15](f,1);c[(c[ba>>2]|0)+20>>2]=0;if(!g){f=f+144|0;c[f>>2]=(c[f>>2]|0)+1}c[r>>2]=h+1;c[s>>2]=k+-1;c[aa>>2]=0;g=1}else if((Z|0)==73){g=c[f>>2]|0;c[g+20>>2]=87;La[c[g+4>>2]&15](f,1);c[aa>>2]=0;g=2}else if((Z|0)==105)g=0;while(0);i=ca;return g|0}function vc(a){a=a|0;var b=0,d=0,e=0,f=0;f=a+440|0;b=c[f>>2]|0;if(!b)if(!(sc(a)|0))b=0;else{b=c[f>>2]|0;d=4}else d=4;do if((d|0)==4){d=a+464|0;e=c[(c[d>>2]|0)+20>>2]|0;if((b|0)!=(e+208|0)){if(!(Qa[c[(c[a+24>>2]|0)+20>>2]&31](a,e)|0)){b=0;break}}else{b=c[a>>2]|0;c[b+20>>2]=100;c[b+24>>2]=e;La[c[b+4>>2]&15](a,3);c[f>>2]=0}b=(c[d>>2]|0)+20|0;c[b>>2]=(c[b>>2]|0)+1&7;b=1}while(0);return b|0}function wc(a){a=a|0;var b=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;h=a+24|0;i=c[h>>2]|0;j=i+4|0;b=c[j>>2]|0;if(!b)if(!(Na[c[i+12>>2]&15](a)|0))b=0;else{b=c[j>>2]|0;e=4}else e=4;do if((e|0)==4){g=c[i>>2]|0;b=b+-1|0;e=g+1|0;g=(d[g>>0]|0)<<8;if(!b){if(!(Na[c[i+12>>2]&15](a)|0)){b=0;break}b=c[j>>2]|0;f=c[i>>2]|0}else f=e;g=d[f>>0]|0|g;e=g+-2|0;k=c[a>>2]|0;c[k+20>>2]=93;c[k+24>>2]=c[a+440>>2];c[k+28>>2]=e;La[c[k+4>>2]&15](a,1);c[i>>2]=f+1;c[j>>2]=b+-1;if(g>>>0>2){La[c[(c[h>>2]|0)+16>>2]&15](a,e);b=1}else b=1}while(0);return b|0}function xc(e){e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;z=i;i=i+16|0;v=z;w=e+24|0;x=c[w>>2]|0;y=x+4|0;f=c[y>>2]|0;if(!f)if(!(Na[c[x+12>>2]&15](e)|0))f=0;else{f=c[y>>2]|0;m=4}else m=4;a:do if((m|0)==4){h=c[x>>2]|0;f=f+-1|0;g=h+1|0;h=d[h>>0]<<8;if(!f){if(!(Na[c[x+12>>2]&15](e)|0)){f=0;break}f=c[y>>2]|0;g=c[x>>2]|0}u=d[g>>0]|h;l=u+-2|0;k=(l|0)>13?14:u>>>0>2?l:0;f=f+-1|0;g=g+1|0;if(!k){t=f;s=g}else{j=x+12|0;h=0;while(1){if(!f){if(!(Na[c[j>>2]&15](e)|0)){f=0;break a}f=c[y>>2]|0;g=c[x>>2]|0}a[v+h>>0]=a[g>>0]|0;h=h+1|0;f=f+-1|0;g=g+1|0;if(h>>>0>=k>>>0){t=f;s=g;break}}}r=l-k|0;f=c[e+440>>2]|0;b:do switch(f|0){case 224:{if(k>>>0>13){if((a[v>>0]|0)==74?(a[v+1>>0]|0)==70:0)if(((a[v+2>>0]|0)==73?(a[v+3>>0]|0)==70:0)?(a[v+4>>0]|0)==0:0){c[e+284>>2]=1;f=a[v+5>>0]|0;p=e+288|0;a[p>>0]=f;j=a[v+6>>0]|0;k=e+289|0;a[k>>0]=j;g=a[v+7>>0]|0;o=e+290|0;a[o>>0]=g;l=(d[v+8>>0]<<8|d[v+9>>0])&65535;m=e+292|0;b[m>>1]=l;h=(d[v+10>>0]<<8|d[v+11>>0])&65535;n=e+294|0;b[n>>1]=h;if((f+-1&255)<2){q=e;k=l}else{q=c[e>>2]|0;c[q+20>>2]=122;c[q+24>>2]=f&255;c[q+28>>2]=j&255;La[c[q+4>>2]&15](e,-1);q=e;j=a[k>>0]|0;k=b[m>>1]|0;h=b[n>>1]|0;g=a[o>>0]|0;f=a[p>>0]|0}p=c[e>>2]|0;c[p+24>>2]=f&255;c[p+28>>2]=j&255;c[p+32>>2]=k&65535;c[p+36>>2]=h&65535;c[p+40>>2]=g&255;c[p+20>>2]=89;La[c[p+4>>2]&15](q,1);f=v+12|0;h=a[f>>0]|0;j=v+13|0;g=a[j>>0]|0;if((g|h)<<24>>24){h=c[e>>2]|0;c[h+20>>2]=92;c[h+24>>2]=d[f>>0];c[h+28>>2]=d[j>>0];La[c[h+4>>2]&15](q,1);h=a[f>>0]|0;g=a[j>>0]|0}f=u+-16|0;if((f|0)==(_((g&255)*3|0,h&255)|0))break b;v=c[e>>2]|0;c[v+20>>2]=90;c[v+24>>2]=f;La[c[v+4>>2]&15](q,1);break b}else m=29}else if(k>>>0>5&(a[v>>0]|0)==74?(a[v+1>>0]|0)==70:0)m=29;if((((m|0)==29?(a[v+2>>0]|0)==88:0)?(a[v+3>>0]|0)==88:0)?(a[v+4>>0]|0)==0:0){f=v+5|0;switch(d[f>>0]|0){case 16:{v=c[e>>2]|0;c[v+20>>2]=110;c[v+24>>2]=l;La[c[v+4>>2]&15](e,1);break b}case 17:{v=c[e>>2]|0;c[v+20>>2]=111;c[v+24>>2]=l;La[c[v+4>>2]&15](e,1);break b}case 19:{v=c[e>>2]|0;c[v+20>>2]=112;c[v+24>>2]=l;La[c[v+4>>2]&15](e,1);break b}default:{v=c[e>>2]|0;c[v+20>>2]=91;c[v+24>>2]=d[f>>0];c[v+28>>2]=l;La[c[v+4>>2]&15](e,1);break b}}}v=c[e>>2]|0;c[v+20>>2]=79;c[v+24>>2]=l;La[c[v+4>>2]&15](e,1);break}case 238:{if((((k>>>0>11&(a[v>>0]|0)==65?(a[v+1>>0]|0)==100:0)?(a[v+2>>0]|0)==111:0)?(a[v+3>>0]|0)==98:0)?(a[v+4>>0]|0)==101:0){o=d[v+7>>0]<<8|d[v+8>>0];p=d[v+9>>0]<<8|d[v+10>>0];u=a[v+11>>0]|0;q=c[e>>2]|0;c[q+24>>2]=d[v+5>>0]<<8|d[v+6>>0];c[q+28>>2]=o;c[q+32>>2]=p;c[q+36>>2]=u&255;c[q+20>>2]=78;La[c[q+4>>2]&15](e,1);c[e+296>>2]=1;a[e+300>>0]=u;break b}v=c[e>>2]|0;c[v+20>>2]=80;c[v+24>>2]=l;La[c[v+4>>2]&15](e,1);break}default:{v=c[e>>2]|0;c[v+20>>2]=70;c[v+24>>2]=f;Ka[c[v>>2]&63](e)}}while(0);c[x>>2]=s;c[y>>2]=t;if((r|0)>0){La[c[(c[w>>2]|0)+16>>2]&15](e,r);f=1}else f=1}while(0);i=z;return f|0}function yc(a,b,e,f){a=a|0;b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;p=c[a+24>>2]|0;h=c[p>>2]|0;q=p+4|0;g=c[q>>2]|0;c[a+220>>2]=b;c[a+224>>2]=e;c[a+228>>2]=f;if(!g)if(!(Na[c[p+12>>2]&15](a)|0))g=0;else{g=c[q>>2]|0;h=c[p>>2]|0;i=4}else i=4;a:do if((i|0)==4){g=g+-1|0;f=h+1|0;b=(d[h>>0]|0)<<8;if(!g){if(!(Na[c[p+12>>2]&15](a)|0)){g=0;break}g=c[q>>2]|0;f=c[p>>2]|0}g=g+-1|0;h=f+1|0;j=d[f>>0]|0|b;if(!g){if(!(Na[c[p+12>>2]&15](a)|0)){g=0;break}g=c[q>>2]|0;h=c[p>>2]|0}g=g+-1|0;f=h+1|0;c[a+212>>2]=d[h>>0];if(!g){if(!(Na[c[p+12>>2]&15](a)|0)){g=0;break}g=c[q>>2]|0;f=c[p>>2]|0}h=g+-1|0;b=f+1|0;g=(d[f>>0]|0)<<8;i=a+32|0;c[i>>2]=g;if(!h){if(!(Na[c[p+12>>2]&15](a)|0)){g=0;break}g=c[i>>2]|0;f=c[q>>2]|0;b=c[p>>2]|0}else f=h;f=f+-1|0;h=b+1|0;c[i>>2]=g+(d[b>>0]|0);if(!f){if(!(Na[c[p+12>>2]&15](a)|0)){g=0;break}g=c[q>>2]|0;f=c[p>>2]|0}else{g=f;f=h}h=g+-1|0;b=f+1|0;g=(d[f>>0]|0)<<8;e=a+28|0;c[e>>2]=g;if(!h){if(!(Na[c[p+12>>2]&15](a)|0)){g=0;break}g=c[e>>2]|0;f=c[q>>2]|0;b=c[p>>2]|0}else f=h;f=f+-1|0;h=b+1|0;c[e>>2]=g+(d[b>>0]|0);if(!f){if(!(Na[c[p+12>>2]&15](a)|0)){g=0;break}f=c[q>>2]|0;b=c[p>>2]|0}else b=h;n=a+36|0;c[n>>2]=d[b>>0];h=j+-8|0;o=c[a>>2]|0;c[o+24>>2]=c[a+440>>2];c[o+28>>2]=c[e>>2];c[o+32>>2]=c[i>>2];c[o+36>>2]=c[n>>2];c[o+20>>2]=102;La[c[o+4>>2]&15](a,1);o=a+464|0;if(c[(c[o>>2]|0)+16>>2]|0){m=c[a>>2]|0;c[m+20>>2]=61;Ka[c[m>>2]&63](a)}if(((c[i>>2]|0)!=0?(c[e>>2]|0)!=0:0)?(k=c[n>>2]|0,(k|0)>=1):0)g=k;else{g=c[a>>2]|0;c[g+20>>2]=33;Ka[c[g>>2]&63](a);g=c[n>>2]|0}if((h|0)!=(g*3|0)){m=c[a>>2]|0;c[m+20>>2]=12;Ka[c[m>>2]&63](a)}m=a+216|0;if(!(c[m>>2]|0))c[m>>2]=Ia[c[c[a+4>>2]>>2]&7](a,1,(c[n>>2]|0)*88|0)|0;f=f+-1|0;g=b+1|0;if((c[n>>2]|0)>0){l=p+12|0;k=0;do{if(!f){if(!(Na[c[l>>2]&15](a)|0)){g=0;break a}f=c[q>>2]|0;g=c[p>>2]|0}j=f+-1|0;h=g+1|0;g=d[g>>0]|0;i=c[m>>2]|0;b:do if((k|0)>0){f=i;b=0;while(1){if((g|0)==(c[f>>2]|0))break;b=b+1|0;f=f+88|0;if((b|0)>=(k|0))break b}g=c[i>>2]|0;f=i+88|0;if((k|0)>1){e=i;b=1;while(1){e=c[e+88>>2]|0;g=(e|0)>(g|0)?e:g;b=b+1|0;if((b|0)==(k|0))break;else{e=f;f=f+88|0}}f=i+(k*88|0)|0}g=g+1|0}else f=i;while(0);c[f>>2]=g;c[f+4>>2]=k;if(!j){if(!(Na[c[l>>2]&15](a)|0)){g=0;break a}g=c[q>>2]|0;h=c[p>>2]|0}else g=j;g=g+-1|0;b=h+1|0;j=d[h>>0]|0;e=f+8|0;c[e>>2]=j>>>4;i=f+12|0;c[i>>2]=j&15;if(!g){if(!(Na[c[l>>2]&15](a)|0)){g=0;break a}g=c[q>>2]|0;h=c[p>>2]|0}else h=b;b=f+16|0;c[b>>2]=d[h>>0];j=c[a>>2]|0;c[j+24>>2]=c[f>>2];c[j+28>>2]=c[e>>2];c[j+32>>2]=c[i>>2];c[j+36>>2]=c[b>>2];c[j+20>>2]=103;La[c[j+4>>2]&15](a,1);k=k+1|0;f=g+-1|0;g=h+1|0}while((k|0)<(c[n>>2]|0))}c[(c[o>>2]|0)+16>>2]=1;c[p>>2]=g;c[q>>2]=f;g=1}while(0);return g|0}function zc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;k=a+20|0;b=c[k>>2]|0;switch(b|0){case 202:{c[a+64>>2]=1;kc(a);if(!(c[a+228>>2]|0))ae(a);else Jd(a);Ud(a,1);Ka[c[(c[a+4>>2]|0)+24>>2]&63](a);e=a+460|0;Ka[c[(c[e>>2]|0)+8>>2]&63](a);f=a+8|0;b=c[f>>2]|0;if(b){if(!(c[a+224>>2]|0))if(!(c[(c[e>>2]|0)+16>>2]|0))d=1;else d=c[a+36>>2]|0;else d=((c[a+36>>2]|0)*3|0)+2|0;c[b+4>>2]=0;c[b+8>>2]=_(c[a+332>>2]|0,d)|0;c[b+12>>2]=0;c[b+16>>2]=1}c[k>>2]=209;i=a;j=13;break}case 209:{f=a+8|0;b=c[f>>2]|0;e=a+460|0;i=a;j=13;break}case 207:case 210:{j=21;break}default:j=23}a:do if((j|0)==13){h=a+332|0;b:while(1){if(b)Ka[c[b>>2]&63](i);d=Na[c[c[e>>2]>>2]&15](a)|0;switch(d|0){case 0:{b=0;break a}case 2:break b;default:{}}b=c[f>>2]|0;if(!((d&-3|0)==1&(b|0)!=0))continue;d=b+4|0;l=(c[d>>2]|0)+1|0;c[d>>2]=l;d=b+8|0;g=c[d>>2]|0;if((l|0)<(g|0))continue;c[d>>2]=(c[h>>2]|0)+g}c[k>>2]=210;b=210;j=21}while(0);if((j|0)==21)if(!(c[a+64>>2]|0))j=23;else b=c[(c[a+452>>2]|0)+16>>2]|0;if((j|0)==23){l=c[a>>2]|0;c[l+20>>2]=21;c[l+24>>2]=b;Ka[c[l>>2]&63](a);b=0}return b|0}function Ac(a){a=a|0;c[a>>2]=19;c[a+4>>2]=6;c[a+8>>2]=20;c[a+12>>2]=7;c[a+16>>2]=21;c[a+104>>2]=0;c[a+108>>2]=0;c[a+20>>2]=0;c[a+112>>2]=17108;c[a+116>>2]=126;c[a+120>>2]=0;c[a+124>>2]=0;c[a+128>>2]=0;return a|0}function Bc(a){a=a|0;Ka[c[(c[a>>2]|0)+8>>2]&63](a);Jb(a);Da(1)}function Cc(a,b){a=a|0;b=b|0;var d=0,e=0;d=c[a>>2]|0;if((b|0)>=0){if((c[d+104>>2]|0)>=(b|0))Ka[c[d+8>>2]&63](a)}else{e=d+108|0;b=c[e>>2]|0;if(!((b|0)!=0?(c[d+104>>2]|0)<=2:0)){Ka[c[d+8>>2]&63](a);b=c[e>>2]|0}c[e>>2]=b+1}return}function Dc(a){a=a|0;var b=0,d=0,e=0;b=i;i=i+208|0;d=b;e=b+8|0;La[c[(c[a>>2]|0)+12>>2]&15](a,e);a=c[5108]|0;c[d>>2]=e;Fe(a,26987,d)|0;i=b;return}function Ec(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;k=i;i=i+48|0;j=k+8|0;h=k;g=c[b>>2]|0;f=c[g+20>>2]|0;if((f|0)>0?(f|0)<=(c[g+116>>2]|0):0){b=(c[g+112>>2]|0)+(f<<2)|0;e=8}else{b=c[g+120>>2]|0;if(((b|0)!=0?(e=c[g+124>>2]|0,(f|0)>=(e|0)):0)?(f|0)<=(c[g+128>>2]|0):0){b=b+(f-e<<2)|0;e=8}else e=9}if((e|0)==8){b=c[b>>2]|0;if(!b)e=9;else f=b}if((e|0)==9){c[g+24>>2]=f;f=c[c[g+112>>2]>>2]|0}e=f;a:while(1){b=e+1|0;switch(a[e>>0]|0){case 0:{e=14;break a}case 37:{e=12;break a}default:e=b}}if((e|0)==12)if((a[b>>0]|0)==115){c[h>>2]=g+24;Ae(d,f,h)|0}else e=14;if((e|0)==14){o=c[g+28>>2]|0;n=c[g+32>>2]|0;m=c[g+36>>2]|0;l=c[g+40>>2]|0;b=c[g+44>>2]|0;e=c[g+48>>2]|0;h=c[g+52>>2]|0;c[j>>2]=c[g+24>>2];c[j+4>>2]=o;c[j+8>>2]=n;c[j+12>>2]=m;c[j+16>>2]=l;c[j+20>>2]=b;c[j+24>>2]=e;c[j+28>>2]=h;Ae(d,f,j)|0}i=k;return}function Fc(a){a=a|0;a=c[a>>2]|0;c[a+108>>2]=0;c[a+20>>2]=0;return}function Gc(a,b){a=a|0;b=b|0;return (a+-1+b|0)/(b|0)|0|0}function Hc(a,b){a=a|0;b=b|0;a=a+-1+b|0;return a-((a|0)%(b|0)|0)|0}function Ic(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;k=i;i=i+16|0;j=k;h=k+8|0;g=k+12|0;d=b+4|0;c[d>>2]=0;c[h>>2]=ad(b)|0;e=Wc(b,84)|0;if(!e){bd(b);f=c[b>>2]|0;c[f+20>>2]=56;c[f+24>>2]=0;Ka[c[f>>2]&63](b)}c[e>>2]=5;c[e+4>>2]=6;c[e+8>>2]=1;c[e+12>>2]=2;c[e+16>>2]=1;c[e+20>>2]=2;c[e+24>>2]=22;c[e+28>>2]=1;c[e+32>>2]=2;c[e+36>>2]=8;c[e+40>>2]=23;c[e+48>>2]=1e9;f=e+44|0;c[f>>2]=c[h>>2];c[e+56>>2]=0;c[e+64>>2]=0;c[e+52>>2]=0;c[e+60>>2]=0;c[e+68>>2]=0;c[e+72>>2]=0;c[e+76>>2]=84;c[d>>2]=e;b=ya(26991)|0;if((b|0)!=0?(a[g>>0]=120,c[j>>2]=h,c[j+4>>2]=g,(He(b,26999,j)|0)>0):0){switch(a[g>>0]|0){case 77:case 109:{b=(c[h>>2]|0)*1e3|0;c[h>>2]=b;break}default:b=c[h>>2]|0}c[f>>2]=b*1e3}i=k;return}function Jc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;l=c[a+4>>2]|0;if(d>>>0>999999984){k=c[a>>2]|0;c[k+20>>2]=56;c[k+24>>2]=1;Ka[c[k>>2]&63](a)}k=d&7;k=((k|0)==0?0:8-k|0)+d|0;if(b>>>0>1){j=c[a>>2]|0;c[j+20>>2]=15;c[j+24>>2]=b;Ka[c[j>>2]&63](a)}j=l+52+(b<<2)|0;d=c[j>>2]|0;a:do if(!d){i=0;f=8}else while(1){if((c[d+8>>2]|0)>>>0>=k>>>0)break a;e=c[d>>2]|0;if(!e){i=d;f=8;break}else d=e}while(0);do if((f|0)==8){g=k+16|0;h=(i|0)==0;e=c[(h?18880:18888)+(b<<2)>>2]|0;f=999999984-k|0;e=e>>>0>f>>>0?f:e;f=g+e|0;d=Wc(a,f)|0;if(!d)while(1){b=e>>>1;if(e>>>0<100){f=c[a>>2]|0;c[f+20>>2]=56;c[f+24>>2]=2;Ka[c[f>>2]&63](a)}f=g+b|0;d=Wc(a,f)|0;if(!d)e=b;else{e=b;break}}l=l+76|0;c[l>>2]=(c[l>>2]|0)+f;c[d>>2]=0;c[d+4>>2]=0;c[d+8>>2]=e+k;if(h){c[j>>2]=d;break}else{c[i>>2]=d;break}}while(0);j=d+4|0;l=c[j>>2]|0;c[j>>2]=l+k;j=d+8|0;c[j>>2]=(c[j>>2]|0)-k;return d+16+l|0}function Kc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;g=c[a+4>>2]|0;if(d>>>0>999999984){f=c[a>>2]|0;c[f+20>>2]=56;c[f+24>>2]=3;Ka[c[f>>2]&63](a)}f=d&7;d=((f|0)==0?0:8-f|0)+d|0;if(b>>>0>1){f=c[a>>2]|0;c[f+20>>2]=15;c[f+24>>2]=b;Ka[c[f>>2]&63](a)}e=d+16|0;f=Yc(a,e)|0;if(!f){h=c[a>>2]|0;c[h+20>>2]=56;c[h+24>>2]=4;Ka[c[h>>2]&63](a)}h=g+76|0;c[h>>2]=(c[h>>2]|0)+e;h=g+60+(b<<2)|0;c[f>>2]=c[h>>2];c[f+4>>2]=d;c[f+8>>2]=0;c[h>>2]=f;return f+16|0}function Lc(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;g=c[a+4>>2]|0;f=999999984/(d>>>0)|0;if(!f){n=c[a>>2]|0;c[n+20>>2]=72;Ka[c[n>>2]&63](a)}h=(f|0)<(e|0)?f:e;c[g+80>>2]=h;m=Jc(a,b,e<<2)|0;if(e){n=~e;f=0;do{i=e-f|0;g=h;h=h>>>0<i>>>0?h:i;i=Kc(a,b,_(h,d)|0)|0;if(h){j=f+n|0;l=~g;l=j>>>0>l>>>0?j:l;j=f;k=h;g=i;while(1){c[m+(j<<2)>>2]=g;k=k+-1|0;if(!k)break;else{j=j+1|0;g=g+d|0}}f=f+-1-l|0}}while(f>>>0<e>>>0)}return m|0}function Mc(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;g=c[a+4>>2]|0;o=d<<7;f=999999984/(o>>>0)|0;if(!f){n=c[a>>2]|0;c[n+20>>2]=72;Ka[c[n>>2]&63](a)}h=(f|0)<(e|0)?f:e;c[g+80>>2]=h;m=Jc(a,b,e<<2)|0;if(e){n=~e;f=0;do{i=e-f|0;g=h;h=h>>>0<i>>>0?h:i;i=Kc(a,b,_(o,h)|0)|0;if(h){j=f+n|0;l=~g;l=j>>>0>l>>>0?j:l;j=f;k=h;g=i;while(1){c[m+(j<<2)>>2]=g;k=k+-1|0;if(!k)break;else{j=j+1|0;g=g+(d<<7)|0}}f=f+-1-l|0}}while(f>>>0<e>>>0)}return m|0}function Nc(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0;h=c[a+4>>2]|0;if((b|0)!=1){i=c[a>>2]|0;c[i+20>>2]=15;c[i+24>>2]=b;Ka[c[i>>2]&63](a)}i=Jc(a,b,128)|0;c[i>>2]=0;c[i+4>>2]=f;c[i+8>>2]=e;c[i+12>>2]=g;c[i+32>>2]=d;c[i+40>>2]=0;e=h+68|0;c[i+44>>2]=c[e>>2];c[e>>2]=i;return i|0}function Oc(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0;h=c[a+4>>2]|0;if((b|0)!=1){i=c[a>>2]|0;c[i+20>>2]=15;c[i+24>>2]=b;Ka[c[i>>2]&63](a)}i=Jc(a,b,128)|0;c[i>>2]=0;c[i+4>>2]=f;c[i+8>>2]=e;c[i+12>>2]=g;c[i+32>>2]=d;c[i+40>>2]=0;d=h+72|0;c[i+44>>2]=c[d>>2];c[d>>2]=i;return i|0}function Pc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;j=c[a+4>>2]|0;f=j+68|0;b=c[f>>2]|0;if(!b){d=0;e=0}else{d=0;e=0;do{if(!(c[b>>2]|0)){i=c[b+8>>2]|0;e=(_(i,c[b+12>>2]|0)|0)+e|0;d=(_(c[b+4>>2]|0,i)|0)+d|0}b=c[b+44>>2]|0}while((b|0)!=0)}i=j+72|0;b=c[i>>2]|0;if(b)do{if(!(c[b>>2]|0)){h=c[b+8>>2]|0;e=(_(c[b+12>>2]<<7,h)|0)+e|0;d=(_(h<<7,c[b+4>>2]|0)|0)+d|0}b=c[b+44>>2]|0}while((b|0)!=0);if((e|0)>=1){b=_c(a,e,d,c[j+76>>2]|0)|0;if((b|0)<(d|0)){h=(b|0)/(e|0)|0;h=(h|0)<1?1:h}else h=1e9;b=c[f>>2]|0;if(b){g=j+80|0;do{if(!(c[b>>2]|0)){f=c[b+4>>2]|0;d=c[b+12>>2]|0;if(((((f+-1|0)>>>0)/(d>>>0)|0)+1|0)>(h|0)){k=b+16|0;c[k>>2]=_(d,h)|0;e=b+8|0;$c(a,b+48|0,_(c[e>>2]|0,f)|0);c[b+40>>2]=1;d=c[k>>2]|0}else{c[b+16>>2]=f;e=b+8|0;d=f}c[b>>2]=Lc(a,1,c[e>>2]|0,d)|0;c[b+20>>2]=c[g>>2];c[b+24>>2]=0;c[b+28>>2]=0;c[b+36>>2]=0}b=c[b+44>>2]|0}while((b|0)!=0)}b=c[i>>2]|0;if(b){g=j+80|0;do{if(!(c[b>>2]|0)){f=c[b+4>>2]|0;d=c[b+12>>2]|0;if(((((f+-1|0)>>>0)/(d>>>0)|0)+1|0)>(h|0)){k=b+16|0;c[k>>2]=_(d,h)|0;e=b+8|0;$c(a,b+48|0,_(f<<7,c[e>>2]|0)|0);c[b+40>>2]=1;d=c[k>>2]|0}else{c[b+16>>2]=f;e=b+8|0;d=f}c[b>>2]=Mc(a,1,c[e>>2]|0,d)|0;c[b+20>>2]=c[g>>2];c[b+24>>2]=0;c[b+28>>2]=0;c[b+36>>2]=0}b=c[b+44>>2]|0}while((b|0)!=0)}}return}function Qc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0;j=e+d|0;if(!((j>>>0<=(c[b+4>>2]|0)>>>0?(c[b+12>>2]|0)>>>0>=e>>>0:0)?(c[b>>2]|0)!=0:0)){k=c[a>>2]|0;c[k+20>>2]=23;Ka[c[k>>2]&63](a)}k=b+24|0;h=c[k>>2]|0;if(!(h>>>0<=d>>>0?j>>>0<=((c[b+16>>2]|0)+h|0)>>>0:0)){if(!(c[b+40>>2]|0)){h=c[a>>2]|0;c[h+20>>2]=71;Ka[c[h>>2]&63](a)}e=b+36|0;if(c[e>>2]|0){Vc(a,b,1);c[e>>2]=0}if((c[k>>2]|0)>>>0<d>>>0)e=d;else{e=j-(c[b+16>>2]|0)|0;e=(e|0)<0?0:e}c[k>>2]=e;Vc(a,b,0)}g=b+28|0;h=c[g>>2]|0;do if(h>>>0<j>>>0){e=(f|0)==0;if(h>>>0<d>>>0)if(e){g=0;e=d}else{e=c[a>>2]|0;c[e+20>>2]=23;Ka[c[e>>2]&63](a);e=d;i=19}else if(e){g=0;e=h}else{e=h;i=19}if((i|0)==19){c[g>>2]=j;g=1}if(!(c[b+32>>2]|0)){if(g)break;j=c[a>>2]|0;c[j+20>>2]=23;Ka[c[j>>2]&63](a);break}h=c[b+8>>2]|0;g=c[k>>2]|0;e=e-g|0;g=j-g|0;if(e>>>0<g>>>0)do{rf(c[(c[b>>2]|0)+(e<<2)>>2]|0,0,h|0)|0;e=e+1|0}while((e|0)!=(g|0))}while(0);if(f)c[b+36>>2]=1;return (c[b>>2]|0)+(d-(c[k>>2]|0)<<2)|0}function Rc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0;j=e+d|0;if(!((j>>>0<=(c[b+4>>2]|0)>>>0?(c[b+12>>2]|0)>>>0>=e>>>0:0)?(c[b>>2]|0)!=0:0)){k=c[a>>2]|0;c[k+20>>2]=23;Ka[c[k>>2]&63](a)}k=b+24|0;h=c[k>>2]|0;if(!(h>>>0<=d>>>0?j>>>0<=((c[b+16>>2]|0)+h|0)>>>0:0)){if(!(c[b+40>>2]|0)){h=c[a>>2]|0;c[h+20>>2]=71;Ka[c[h>>2]&63](a)}e=b+36|0;if(c[e>>2]|0){Uc(a,b,1);c[e>>2]=0}if((c[k>>2]|0)>>>0<d>>>0)e=d;else{e=j-(c[b+16>>2]|0)|0;e=(e|0)<0?0:e}c[k>>2]=e;Uc(a,b,0)}g=b+28|0;h=c[g>>2]|0;do if(h>>>0<j>>>0){e=(f|0)==0;if(h>>>0<d>>>0)if(e){g=0;e=d}else{e=c[a>>2]|0;c[e+20>>2]=23;Ka[c[e>>2]&63](a);e=d;i=19}else if(e){g=0;e=h}else{e=h;i=19}if((i|0)==19){c[g>>2]=j;g=1}if(!(c[b+32>>2]|0)){if(g)break;j=c[a>>2]|0;c[j+20>>2]=23;Ka[c[j>>2]&63](a);break}h=c[b+8>>2]<<7;g=c[k>>2]|0;e=e-g|0;g=j-g|0;if(e>>>0<g>>>0)do{rf(c[(c[b>>2]|0)+(e<<2)>>2]|0,0,h|0)|0;e=e+1|0}while((e|0)!=(g|0))}while(0);if(f)c[b+36>>2]=1;return (c[b>>2]|0)+(d-(c[k>>2]|0)<<2)|0}function Sc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;g=c[a+4>>2]|0;if(b>>>0<=1){if((b|0)==1){f=g+68|0;d=c[f>>2]|0;if(d)do{e=d+40|0;if(c[e>>2]|0){c[e>>2]=0;La[c[d+56>>2]&15](a,d+48|0)}d=c[d+44>>2]|0}while((d|0)!=0);c[f>>2]=0;f=g+72|0;d=c[f>>2]|0;if(d)do{e=d+40|0;if(c[e>>2]|0){c[e>>2]=0;La[c[d+56>>2]&15](a,d+48|0)}d=c[d+44>>2]|0}while((d|0)!=0);c[f>>2]=0}}else{f=c[a>>2]|0;c[f+20>>2]=15;c[f+24>>2]=b;Ka[c[f>>2]&63](a)}f=g+60+(b<<2)|0;d=c[f>>2]|0;c[f>>2]=0;if(d){e=g+76|0;do{h=d;d=c[d>>2]|0;f=(c[h+4>>2]|0)+16+(c[h+8>>2]|0)|0;Zc(a,h,f);c[e>>2]=(c[e>>2]|0)-f}while((d|0)!=0)}h=g+52+(b<<2)|0;d=c[h>>2]|0;c[h>>2]=0;if(d){e=g+76|0;do{g=d;d=c[d>>2]|0;h=(c[g+4>>2]|0)+16+(c[g+8>>2]|0)|0;Xc(a,g,h);c[e>>2]=(c[e>>2]|0)-h}while((d|0)!=0)}return}function Tc(a){a=a|0;var b=0;Sc(a,1);Sc(a,0);b=a+4|0;Xc(a,c[b>>2]|0,84);c[b>>2]=0;bd(a);return}function Uc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;m=c[b+8>>2]<<7;n=b+24|0;o=b+20|0;p=b+16|0;f=c[p>>2]|0;a:do if((f|0)>0?(g=c[n>>2]|0,q=b+28|0,i=b+4|0,j=(d|0)==0,k=b+48|0,l=b+52|0,e=c[o>>2]|0,e=(e|0)<(f|0)?e:f,h=(c[q>>2]|0)-g|0,h=(e|0)<(h|0)?e:h,e=(c[i>>2]|0)-g|0,e=(h|0)<(e|0)?h:e,(e|0)>=1):0){g=_(g,m)|0;h=0;while(1){d=_(e,m)|0;if(j)Ja[c[k>>2]&0](a,k,c[(c[b>>2]|0)+(h<<2)>>2]|0,g,d);else Ja[c[l>>2]&0](a,k,c[(c[b>>2]|0)+(h<<2)>>2]|0,g,d);e=c[o>>2]|0;h=e+h|0;f=c[p>>2]|0;if((f|0)<=(h|0))break a;r=f-h|0;r=(e|0)<(r|0)?e:r;e=(c[n>>2]|0)+h|0;f=(c[q>>2]|0)-e|0;f=(r|0)<(f|0)?r:f;e=(c[i>>2]|0)-e|0;e=(f|0)<(e|0)?f:e;if((e|0)<1)break;else g=d+g|0}}while(0);return}function Vc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;i=c[b+8>>2]|0;m=b+24|0;n=b+20|0;o=b+16|0;f=c[o>>2]|0;a:do if((f|0)>0?(g=c[m>>2]|0,p=b+28|0,q=b+4|0,j=(d|0)==0,k=b+48|0,l=b+52|0,e=c[n>>2]|0,e=(e|0)<(f|0)?e:f,h=(c[p>>2]|0)-g|0,h=(e|0)<(h|0)?e:h,e=(c[q>>2]|0)-g|0,e=(h|0)<(e|0)?h:e,(e|0)>=1):0){g=_(g,i)|0;h=0;while(1){d=_(e,i)|0;if(j)Ja[c[k>>2]&0](a,k,c[(c[b>>2]|0)+(h<<2)>>2]|0,g,d);else Ja[c[l>>2]&0](a,k,c[(c[b>>2]|0)+(h<<2)>>2]|0,g,d);e=c[n>>2]|0;h=e+h|0;f=c[o>>2]|0;if((f|0)<=(h|0))break a;r=f-h|0;r=(e|0)<(r|0)?e:r;e=(c[m>>2]|0)+h|0;f=(c[p>>2]|0)-e|0;f=(r|0)<(f|0)?r:f;e=(c[q>>2]|0)-e|0;e=(f|0)<(e|0)?f:e;if((e|0)<1)break;else g=d+g|0}}while(0);return}function Wc(a,b){a=a|0;b=b|0;return jf(b)|0}function Xc(a,b,c){a=a|0;b=b|0;c=c|0;kf(b);return}function Yc(a,b){a=a|0;b=b|0;return jf(b)|0}function Zc(a,b,c){a=a|0;b=b|0;c=c|0;kf(b);return}function _c(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return c|0}function $c(a,b,d){a=a|0;b=b|0;d=d|0;d=c[a>>2]|0;c[d+20>>2]=51;Ka[c[d>>2]&63](a);return}function ad(a){a=a|0;return 0}function bd(a){a=a|0;return}function cd(b){b=b|0;var d=0,e=0,f=0;f=Ia[c[c[b+4>>2]>>2]&7](b,1,208)|0;c[b+424>>2]=f;c[f>>2]=9;c[f+8>>2]=24;b=f+76|0;d=f+140|0;e=0;do{c[b+(e<<2)>>2]=0;c[d+(e<<2)>>2]=0;e=e+1|0}while((e|0)!=16);a[f+204>>0]=113;return}function dd(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;m=c[b+424>>2]|0;if(d){l=c[b>>2]|0;c[l+20>>2]=49;Ka[c[l>>2]&63](b)}do if(c[b+268>>2]|0){d=(c[b+364>>2]|0)==0;e=m+4|0;if(!(c[b+372>>2]|0))if(d){c[e>>2]=3;break}else{c[e>>2]=4;break}else if(d){c[e>>2]=5;break}else{c[e>>2]=6;break}}else c[m+4>>2]=7;while(0);g=b+292|0;if((c[g>>2]|0)>0){h=b+364|0;i=b+372|0;j=b+4|0;k=b+368|0;l=0;do{f=c[b+296+(l<<2)>>2]|0;if((c[h>>2]|0)==0?(c[i>>2]|0)==0:0){d=c[f+20>>2]|0;if(d>>>0>15){e=c[b>>2]|0;c[e+20>>2]=50;c[e+24>>2]=d;Ka[c[e>>2]&63](b)}e=m+76+(d<<2)|0;d=c[e>>2]|0;if(!d){d=Ia[c[c[j>>2]>>2]&7](b,1,64)|0;c[e>>2]=d}e=d+64|0;do{a[d>>0]=0;d=d+1|0}while((d|0)<(e|0));c[m+36+(l<<2)>>2]=0;c[m+52+(l<<2)>>2]=0}if(c[k>>2]|0){d=c[f+24>>2]|0;if(d>>>0>15){f=c[b>>2]|0;c[f+20>>2]=50;c[f+24>>2]=d;Ka[c[f>>2]&63](b)}e=m+140+(d<<2)|0;d=c[e>>2]|0;if(!d){d=Ia[c[c[j>>2]>>2]&7](b,1,256)|0;c[e>>2]=d}rf(d|0,0,256)|0}l=l+1|0}while((l|0)<(c[g>>2]|0))}c[m+12>>2]=0;c[m+16>>2]=65536;c[m+20>>2]=0;c[m+24>>2]=0;c[m+28>>2]=11;c[m+32>>2]=-1;c[m+68>>2]=c[b+236>>2];c[m+72>>2]=0;return}function ed(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;f=c[a+424>>2]|0;g=f+12|0;e=c[g>>2]|0;d=(c[f+16>>2]|0)+-1+e&-65536;d=((d|0)<(e|0)?d|32768:d)<<c[f+28>>2];c[g>>2]=d;e=f+32|0;b=c[e>>2]|0;if(d>>>0<=134217727){if(b){if((b|0)>-1){d=f+24|0;if(c[d>>2]|0){do{fd(0,a);b=(c[d>>2]|0)+-1|0;c[d>>2]=b}while((b|0)!=0);b=c[e>>2]|0}fd(b,a)}}else{e=f+24|0;c[e>>2]=(c[e>>2]|0)+1}b=f+20|0;if(c[b>>2]|0){d=f+24|0;if(c[d>>2]|0)do{fd(0,a);e=(c[d>>2]|0)+-1|0;c[d>>2]=e}while((e|0)!=0);do{fd(255,a);fd(0,a);e=(c[b>>2]|0)+-1|0;c[b>>2]=e}while((e|0)!=0)}}else{d=f+24|0;if((b|0)>-1){if(c[d>>2]|0){do{fd(0,a);b=(c[d>>2]|0)+-1|0;c[d>>2]=b}while((b|0)!=0);b=c[e>>2]|0}fd(b+1|0,a);if((c[e>>2]|0)==254)fd(0,a)}e=f+20|0;c[d>>2]=(c[d>>2]|0)+(c[e>>2]|0);c[e>>2]=0}b=c[g>>2]|0;if(b&134215680){d=f+24|0;if(c[d>>2]|0){do{fd(0,a);f=(c[d>>2]|0)+-1|0;c[d>>2]=f}while((f|0)!=0);b=c[g>>2]|0}fd(b>>>19&255,a);b=c[g>>2]|0;if((b&133693440|0)==133693440){fd(0,a);b=c[g>>2]|0}if((b&522240|0)!=0?(fd(b>>>11&255,a),(c[g>>2]&522240|0)==522240):0)fd(0,a)}return}function fd(b,d){b=b|0;d=d|0;var e=0,f=0;e=c[d+24>>2]|0;f=c[e>>2]|0;c[e>>2]=f+1;a[f>>0]=b;f=e+4|0;b=(c[f>>2]|0)+-1|0;c[f>>2]=b;if((b|0)==0?(Na[c[e+12>>2]&15](d)|0)==0:0){f=c[d>>2]|0;c[f+20>>2]=25;Ka[c[f>>2]&63](d)}return}function gd(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;r=c[a+424>>2]|0;g=a+236|0;if(c[g>>2]|0){h=r+68|0;f=c[h>>2]|0;if(!f){q=r+72|0;ld(a,c[q>>2]|0);f=c[g>>2]|0;c[h>>2]=f;c[q>>2]=(c[q>>2]|0)+1&7}c[h>>2]=f+-1}o=a+320|0;if((c[o>>2]|0)>0){p=a+376|0;q=0;do{j=c[a+324+(q<<2)>>2]|0;m=c[(c[a+296+(j<<2)>>2]|0)+20>>2]|0;f=b[c[e+(q<<2)>>2]>>1]>>c[p>>2];l=r+76+(m<<2)|0;k=c[l>>2]|0;n=r+52+(j<<2)|0;h=c[n>>2]|0;i=k+h|0;j=r+36+(j<<2)|0;s=c[j>>2]|0;g=f-s|0;if((f|0)!=(s|0)){c[j>>2]=f;md(a,i,1);if((g|0)>0){md(a,k+(h+1)|0,0);f=h+2|0;h=4}else{md(a,k+(h+1)|0,1);f=h+3|0;h=8;g=0-g|0}f=k+f|0;c[n>>2]=h;j=g+-1|0;if(j){md(a,f,1);h=(c[l>>2]|0)+20|0;f=j>>1;if(!f){i=1;f=h}else{g=1;do{md(a,h,1);g=g<<1;h=h+1|0;f=f>>1}while((f|0)!=0);i=g;f=h}}else i=0;md(a,f,0);if((i|0)>=(1<<d[a+152+m>>0]>>1|0)){if((i|0)>(1<<d[a+168+m>>0]>>1|0))c[n>>2]=(c[n>>2]|0)+8}else c[n>>2]=0;g=f+14|0;f=i>>1;if(f)do{md(a,g,(f&j|0)!=0&1);f=f>>1}while((f|0)!=0)}else{md(a,i,0);c[n>>2]=0}q=q+1|0}while((q|0)<(c[o>>2]|0))}return 1}function hd(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;t=c[a+424>>2]|0;g=a+236|0;if(c[g>>2]|0){h=t+68|0;f=c[h>>2]|0;if(!f){s=t+72|0;ld(a,c[s>>2]|0);f=c[g>>2]|0;c[h>>2]=f;c[s>>2]=(c[s>>2]|0)+1&7}c[h>>2]=f+-1}q=c[a+384>>2]|0;o=c[e>>2]|0;s=c[(c[a+296>>2]|0)+24>>2]|0;r=a+368|0;g=c[r>>2]|0;p=a+376|0;h=g;while(1){n=b[o+(c[q+(h<<2)>>2]<<1)>>1]|0;f=n<<16>>16;if(n<<16>>16>-1){if(f>>c[p>>2])break}else if(0-f>>c[p>>2])break;h=h+-1|0;if(!h){h=0;break}}n=c[a+364>>2]|0;f=n+-1|0;if((n|0)<=(h|0)){l=t+140+(s<<2)|0;m=t+204|0;n=a+184+s|0;do{i=(c[l>>2]|0)+(f*3|0)|0;md(a,i,0);e=f;while(1){f=e+1|0;k=b[o+(c[q+(f<<2)>>2]<<1)>>1]|0;g=k<<16>>16;if(k<<16>>16>-1){g=g>>c[p>>2];if(g){k=16;break}}else{g=0-g>>c[p>>2];if(g){k=18;break}}md(a,i+1|0,0);e=f;i=i+3|0}if((k|0)==16){md(a,i+1|0,1);md(a,m,0);j=e;e=g}else if((k|0)==18){md(a,i+1|0,1);md(a,m,1);j=e;e=g}g=i+2|0;k=e+-1|0;if(k){md(a,g,1);if(k>>>0>=2){md(a,g,1);i=(c[l>>2]|0)+((j|0)<(d[n>>0]|0|0)?189:217)|0;g=k>>2;if(!g){e=2;g=i}else{e=2;do{md(a,i,1);e=e<<1;i=i+1|0;g=g>>1}while((g|0)!=0);g=i}}else e=1}else e=0;md(a,g,0);i=g+14|0;g=e>>1;if(g)do{md(a,i,(g&k|0)!=0&1);g=g>>1}while((g|0)!=0)}while((f|0)<(h|0));g=c[r>>2]|0}if((f|0)<(g|0))md(a,(c[t+140+(s<<2)>>2]|0)+(f*3|0)|0,1);return 1}function id(a,d){a=a|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;g=c[a+424>>2]|0;f=a+236|0;if(c[f>>2]|0){h=g+68|0;e=c[h>>2]|0;if(!e){i=g+72|0;ld(a,c[i>>2]|0);e=c[f>>2]|0;c[h>>2]=e;c[i>>2]=(c[i>>2]|0)+1&7}c[h>>2]=e+-1}e=g+204|0;f=c[a+376>>2]|0;g=a+320|0;if((c[g>>2]|0)>0){h=0;do{md(a,e,(b[c[d+(h<<2)>>2]>>1]|0)>>>f&1);h=h+1|0}while((h|0)<(c[g>>2]|0))}return 1}function jd(a,d){a=a|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;q=c[a+424>>2]|0;f=a+236|0;if(c[f>>2]|0){g=q+68|0;e=c[g>>2]|0;if(!e){p=q+72|0;ld(a,c[p>>2]|0);e=c[f>>2]|0;c[g>>2]=e;c[p>>2]=(c[p>>2]|0)+1&7}c[g>>2]=e+-1}n=c[a+384>>2]|0;l=c[d>>2]|0;p=c[(c[a+296>>2]|0)+24>>2]|0;o=a+368|0;f=c[o>>2]|0;m=a+376|0;g=f;while(1){k=b[l+(c[n+(g<<2)>>2]<<1)>>1]|0;e=k<<16>>16;if(k<<16>>16>-1){if(e>>c[m>>2]){j=10;break}}else if(0-e>>c[m>>2]){j=10;break}g=g+-1|0;if(!g){k=0;h=0;break}}a:do if((j|0)==10){d=a+372|0;if((g|0)>0){h=g;while(1){k=b[l+(c[n+(h<<2)>>2]<<1)>>1]|0;e=k<<16>>16;if(k<<16>>16>-1){if(e>>c[d>>2]){k=g;break a}}else if(0-e>>c[d>>2]){k=g;break a}e=h+-1|0;if((h|0)>1)h=e;else{k=g;h=e;break}}}else{k=g;h=g}}while(0);j=c[a+364>>2]|0;e=j+-1|0;if((j|0)<=(k|0)){d=q+140+(p<<2)|0;i=q+204|0;do{f=(c[d>>2]|0)+(e*3|0)|0;if((e|0)>=(h|0))md(a,f,0);while(1){e=e+1|0;j=b[l+(c[n+(e<<2)>>2]<<1)>>1]|0;g=j<<16>>16;if(j<<16>>16>-1){g=g>>c[m>>2];if(g){j=21;break}}else{g=0-g>>c[m>>2];if(g){j=25;break}}md(a,f+1|0,0);f=f+3|0}do if((j|0)==21)if(g>>>0>1){md(a,f+2|0,g&1);break}else{md(a,f+1|0,1);md(a,i,0);break}else if((j|0)==25)if(g>>>0>1){md(a,f+2|0,g&1);break}else{md(a,f+1|0,1);md(a,i,1);break}while(0)}while((e|0)<(k|0));f=c[o>>2]|0}if((e|0)<(f|0))md(a,(c[q+140+(p<<2)>>2]|0)+(e*3|0)|0,1);return 1}function kd(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;w=c[a+424>>2]|0;g=a+236|0;if(c[g>>2]|0){h=w+68|0;f=c[h>>2]|0;if(!f){v=w+72|0;ld(a,c[v>>2]|0);f=c[g>>2]|0;c[h>>2]=f;c[v>>2]=(c[v>>2]|0)+1&7}c[h>>2]=f+-1}r=c[a+384>>2]|0;s=a+320|0;if((c[s>>2]|0)>0){t=a+388|0;u=w+204|0;v=0;do{q=c[e+(v<<2)>>2]|0;j=c[a+324+(v<<2)>>2]|0;o=c[a+296+(j<<2)>>2]|0;m=c[o+20>>2]|0;l=w+76+(m<<2)|0;k=c[l>>2]|0;n=w+52+(j<<2)|0;f=c[n>>2]|0;h=k+f|0;i=b[q>>1]|0;j=w+36+(j<<2)|0;p=c[j>>2]|0;g=i-p|0;if((i|0)!=(p|0)){c[j>>2]=i;md(a,h,1);if((g|0)>0){md(a,k+(f+1)|0,0);f=f+2|0;h=4}else{md(a,k+(f+1)|0,1);f=f+3|0;h=8;g=0-g|0}f=k+f|0;c[n>>2]=h;j=g+-1|0;if(j){md(a,f,1);h=(c[l>>2]|0)+20|0;f=j>>1;if(!f){i=1;f=h}else{g=1;do{md(a,h,1);g=g<<1;h=h+1|0;f=f>>1}while((f|0)!=0);i=g;f=h}}else i=0;md(a,f,0);if((i|0)>=(1<<d[a+152+m>>0]>>1|0)){if((i|0)>(1<<d[a+168+m>>0]>>1|0))c[n>>2]=(c[n>>2]|0)+8}else c[n>>2]=0;g=f+14|0;f=i>>1;if(f)do{md(a,g,(f&j|0)!=0&1);f=f>>1}while((f|0)!=0)}else{md(a,h,0);c[n>>2]=0}g=c[t>>2]|0;if(g){p=c[o+24>>2]|0;f=g;while(1){if(b[q+(c[r+(f<<2)>>2]<<1)>>1]|0){o=f;x=25;break}f=f+-1|0;if(!f){f=0;break}}if((x|0)==25){x=0;if((o|0)>0){m=w+140+(p<<2)|0;n=a+184+p|0;j=0;while(1){l=c[m>>2]|0;k=j*3|0;g=l+k|0;md(a,g,0);f=j+1|0;i=b[q+(c[r+(f<<2)>>2]<<1)>>1]|0;h=i<<16>>16;k=l+(k+1)|0;if(!(i<<16>>16)){h=k;k=f;while(1){md(a,h,0);i=g+3|0;f=k+1|0;j=b[q+(c[r+(f<<2)>>2]<<1)>>1]|0;h=g+4|0;if(!(j<<16>>16)){k=f;g=i}else{l=k;g=i;k=h;break}}i=j;h=j<<16>>16;j=l}md(a,k,1);if(i<<16>>16>0)md(a,u,0);else{md(a,u,1);h=0-h|0}g=g+2|0;k=h+-1|0;if(k){md(a,g,1);if(k>>>0>=2){md(a,g,1);i=(c[m>>2]|0)+((j|0)<(d[n>>0]|0)?189:217)|0;g=k>>2;if(!g){h=2;g=i}else{h=2;do{md(a,i,1);h=h<<1;i=i+1|0;g=g>>1}while((g|0)!=0);g=i}}else h=1}else h=0;md(a,g,0);i=g+14|0;g=h>>1;if(g)do{md(a,i,(g&k|0)!=0&1);g=g>>1}while((g|0)!=0);if((f|0)<(o|0))j=f;else break}g=c[t>>2]|0}else f=0}if((f|0)<(g|0))md(a,(c[w+140+(p<<2)>>2]|0)+(f*3|0)|0,1)}v=v+1|0}while((v|0)<(c[s>>2]|0))}return 1}function ld(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;l=c[b+424>>2]|0;ed(b);fd(255,b);fd(d+208|0,b);e=b+292|0;if((c[e>>2]|0)>0){f=b+364|0;g=b+372|0;h=b+368|0;i=0;do{d=c[b+296+(i<<2)>>2]|0;if((c[f>>2]|0)==0?(c[g>>2]|0)==0:0){j=c[l+76+(c[d+20>>2]<<2)>>2]|0;k=j+64|0;do{a[j>>0]=0;j=j+1|0}while((j|0)<(k|0));c[l+36+(i<<2)>>2]=0;c[l+52+(i<<2)>>2]=0}if(c[h>>2]|0)rf(c[l+140+(c[d+24>>2]<<2)>>2]|0,0,256)|0;i=i+1|0}while((i|0)<(c[e>>2]|0))}c[l+12>>2]=0;c[l+16>>2]=65536;c[l+20>>2]=0;c[l+24>>2]=0;c[l+28>>2]=11;c[l+32>>2]=-1;return}function md(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;m=c[b+424>>2]|0;h=d[e>>0]|0;i=c[19772+((h&127)<<2)>>2]|0;j=i>>>8;k=i>>16;n=m+16|0;g=(c[n>>2]|0)-k|0;c[n>>2]=g;if((h>>>7|0)==(f|0)){if((g|0)<=32767){if((g|0)<(k|0)){l=m+12|0;c[l>>2]=(c[l>>2]|0)+g;c[n>>2]=k}g=h&128^j;l=9}}else{if((g|0)>=(k|0)){l=m+12|0;c[l>>2]=(c[l>>2]|0)+g;c[n>>2]=k}g=h&128^i;l=9}if((l|0)==9){a[e>>0]=g;k=m+12|0;f=m+28|0;e=m+32|0;l=m+24|0;j=m+20|0;i=c[n>>2]|0;h=c[k>>2]|0;g=c[f>>2]|0;do{i=i<<1;c[n>>2]=i;h=h<<1;c[k>>2]=h;g=g+-1|0;c[f>>2]=g;if(!g){h=h>>19;do if((h|0)>255){g=c[e>>2]|0;if((g|0)>-1){if(c[l>>2]|0){do{fd(0,b);m=(c[l>>2]|0)+-1|0;c[l>>2]=m}while((m|0)!=0);g=c[e>>2]|0}fd(g+1|0,b);if((c[e>>2]|0)==254)fd(0,b)}c[l>>2]=(c[l>>2]|0)+(c[j>>2]|0);c[j>>2]=0;c[e>>2]=h&255}else{if((h|0)==255){c[j>>2]=(c[j>>2]|0)+1;break}g=c[e>>2]|0;if(g){if((g|0)>-1){if(c[l>>2]|0){do{fd(0,b);m=(c[l>>2]|0)+-1|0;c[l>>2]=m}while((m|0)!=0);g=c[e>>2]|0}fd(g,b)}}else c[l>>2]=(c[l>>2]|0)+1;if(c[j>>2]|0){if(c[l>>2]|0)do{fd(0,b);m=(c[l>>2]|0)+-1|0;c[l>>2]=m}while((m|0)!=0);do{fd(255,b);fd(0,b);m=(c[j>>2]|0)+-1|0;c[j>>2]=m}while((m|0)!=0)}c[e>>2]=h&255}while(0);h=c[k>>2]&524287;c[k>>2]=h;g=(c[f>>2]|0)+8|0;c[f>>2]=g;i=c[n>>2]|0}}while((i|0)<32768)}return}function nd(a){a=a|0;var b=0;b=Ia[c[c[a+4>>2]>>2]&7](a,1,140)|0;c[a+424>>2]=b;c[b>>2]=10;c[b+60>>2]=0;c[b+44>>2]=0;c[b+92>>2]=0;c[b+76>>2]=0;c[b+64>>2]=0;c[b+48>>2]=0;c[b+96>>2]=0;c[b+80>>2]=0;c[b+68>>2]=0;c[b+52>>2]=0;c[b+100>>2]=0;c[b+84>>2]=0;c[b+72>>2]=0;c[b+56>>2]=0;c[b+104>>2]=0;c[b+88>>2]=0;if(c[a+268>>2]|0)c[b+136>>2]=0;return}function od(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;l=c[a+424>>2]|0;m=(b|0)!=0;c[l+8>>2]=m?26:25;do if(!(c[a+268>>2]|0)){b=l+4|0;if(m){c[b>>2]=12;break}else{c[b>>2]=13;break}}else{c[l+120>>2]=a;c[l+108>>2]=b;b=(c[a+364>>2]|0)==0;d=l+4|0;do if(!(c[a+372>>2]|0))if(b){c[d>>2]=8;break}else{c[d>>2]=9;break}else{if(b){c[d>>2]=10;break}c[d>>2]=11;b=l+136|0;if(!(c[b>>2]|0))c[b>>2]=Ia[c[c[a+4>>2]>>2]&7](a,1,1e3)|0}while(0);c[l+124>>2]=c[(c[a+296>>2]|0)+24>>2];c[l+128>>2]=0;c[l+132>>2]=0}while(0);f=a+292|0;if((c[f>>2]|0)>0){g=a+364|0;h=a+372|0;i=a+4|0;j=a+368|0;k=0;do{e=c[a+296+(k<<2)>>2]|0;if((c[g>>2]|0)==0?(c[h>>2]|0)==0:0){b=c[e+20>>2]|0;if(m){if(b>>>0>3){d=c[a>>2]|0;c[d+20>>2]=52;c[d+24>>2]=b;Ka[c[d>>2]&63](a)}d=l+76+(b<<2)|0;b=c[d>>2]|0;if(!b){b=Ia[c[c[i>>2]>>2]&7](a,1,1028)|0;c[d>>2]=b}rf(b|0,0,1028)|0}else xd(a,1,b,l+44+(b<<2)|0);c[l+20+(k<<2)>>2]=0}do if(c[j>>2]|0){b=c[e+24>>2]|0;if(!m){xd(a,0,b,l+60+(b<<2)|0);break}if(b>>>0>3){e=c[a>>2]|0;c[e+20>>2]=52;c[e+24>>2]=b;Ka[c[e>>2]&63](a)}d=l+92+(b<<2)|0;b=c[d>>2]|0;if(!b){b=Ia[c[c[i>>2]>>2]&7](a,1,1028)|0;c[d>>2]=b}rf(b|0,0,1028)|0}while(0);k=k+1|0}while((k|0)<(c[f>>2]|0))}c[l+12>>2]=0;c[l+16>>2]=0;c[l+36>>2]=c[a+236>>2];c[l+40>>2]=0;return}function pd(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;s=i;i=i+32|0;r=s+16|0;q=s;f=c[a+424>>2]|0;if(c[a+268>>2]|0)zd(f);c[r>>2]=0;c[r+4>>2]=0;c[r+8>>2]=0;c[r+12>>2]=0;c[q>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;c[q+12>>2]=0;m=a+292|0;if((c[m>>2]|0)>0){n=a+364|0;o=a+372|0;g=a+368|0;p=0;do{e=c[a+296+(p<<2)>>2]|0;if(((c[n>>2]|0)==0?(c[o>>2]|0)==0:0)?(h=c[e+20>>2]|0,j=r+(h<<2)|0,(c[j>>2]|0)==0):0){d=a+120+(h<<2)|0;b=c[d>>2]|0;if(!b){b=Lb(a)|0;c[d>>2]=b}Cd(a,b,c[f+76+(h<<2)>>2]|0);c[j>>2]=1}if((c[g>>2]|0)!=0?(k=c[e+24>>2]|0,l=q+(k<<2)|0,(c[l>>2]|0)==0):0){d=a+136+(k<<2)|0;b=c[d>>2]|0;if(!b){b=Lb(a)|0;c[d>>2]=b}Cd(a,b,c[f+92+(k<<2)>>2]|0);c[l>>2]=1}p=p+1|0}while((p|0)<(c[m>>2]|0))}i=s;return}function qd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;q=i;i=i+16|0;o=q;l=c[b+424>>2]|0;p=b+24|0;d=c[p>>2]|0;e=c[d>>2]|0;if(!(c[b+268>>2]|0)){f=c[d+4>>2]|0;m=l+12|0;d=c[m>>2]|0;n=l+16|0;g=c[n>>2]|0;l=l+20|0;c[o>>2]=c[l>>2];c[o+4>>2]=c[l+4>>2];c[o+8>>2]=c[l+8>>2];c[o+12>>2]=c[l+12>>2];a:do if((g|0)>0){j=g+7|0;k=127<<17-g|d;while(1){s=k>>>16;h=s&255;r=e;e=r+1|0;a[r>>0]=s;f=f+-1|0;if(!f){f=c[p>>2]|0;if(!(Na[c[f+12>>2]&15](b)|0))break;e=c[f>>2]|0;f=c[f+4>>2]|0}if((h|0)==255){s=e;e=s+1|0;a[s>>0]=0;f=f+-1|0;if(!f){h=c[p>>2]|0;if(!(Na[c[h+12>>2]&15](b)|0))break;f=c[h+4>>2]|0;e=c[h>>2]|0}}j=j+-8|0;if((j|0)<=7){g=0;d=0;break a}else k=k<<8}f=c[b>>2]|0;c[f+20>>2]=25;Ka[c[f>>2]&63](b);f=0}else{g=0;d=0}while(0);s=c[p>>2]|0;c[s>>2]=e;c[s+4>>2]=f;c[m>>2]=d;c[n>>2]=g;c[l>>2]=c[o>>2];c[l+4>>2]=c[o+4>>2];c[l+8>>2]=c[o+8>>2];c[l+12>>2]=c[o+12>>2]}else{b=l+112|0;c[b>>2]=e;k=l+116|0;c[k>>2]=c[d+4>>2];zd(l);if(!(c[l+108>>2]|0)){e=l+16|0;f=c[e>>2]|0;g=f+7|0;d=l+12|0;f=127<<17-f|c[d>>2];if((g|0)>7){j=g;do{h=f>>>16;s=c[b>>2]|0;c[b>>2]=s+1;a[s>>0]=h;s=(c[k>>2]|0)+-1|0;c[k>>2]=s;if(!s)Ad(l);if((h&255|0)==255?(s=c[b>>2]|0,c[b>>2]=s+1,a[s>>0]=0,s=(c[k>>2]|0)+-1|0,c[k>>2]=s,(s|0)==0):0)Ad(l);f=f<<8;j=j+-8|0}while((j|0)>7);g=g&7}c[d>>2]=f;c[e>>2]=g}else{e=l+16|0;d=l+12|0}c[d>>2]=0;c[e>>2]=0;s=c[p>>2]|0;c[s>>2]=c[b>>2];c[s+4>>2]=c[k>>2]}i=q;return}function rd(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;w=c[d+424>>2]|0;m=d+24|0;u=c[m>>2]|0;s=w+112|0;c[s>>2]=c[u>>2];t=w+116|0;c[t>>2]=c[u+4>>2];u=d+236|0;if((c[u>>2]|0)!=0?(c[w+36>>2]|0)==0:0)yd(w,c[w+40>>2]|0);l=d+320|0;if((c[l>>2]|0)>0){n=d+376|0;o=w+108|0;p=w+120|0;q=w+16|0;r=w+12|0;v=0;do{k=c[d+324+(v<<2)>>2]|0;i=c[(c[d+296+(k<<2)>>2]|0)+20>>2]|0;j=b[c[e+(v<<2)>>2]>>1]>>c[n>>2];k=w+20+(k<<2)|0;g=j-(c[k>>2]|0)|0;c[k>>2]=j;k=(g>>31)+g|0;g=(g|0)<0?0-g|0:g;if(g){f=0;while(1){h=f+1|0;g=g>>1;if(!g){g=h;break}else f=h}if((f|0)>10){j=c[d>>2]|0;c[j+20>>2]=6;Ka[c[j>>2]&63](d)}}else g=0;do if(!(c[o>>2]|0)){j=c[w+44+(i<<2)>>2]|0;f=c[j+(g<<2)>>2]|0;j=a[j+1024+g>>0]|0;h=j<<24>>24;if(j<<24>>24==0?(j=c[p>>2]|0,i=c[j>>2]|0,c[i+20>>2]=41,Ka[c[i>>2]&63](j),(c[o>>2]|0)!=0):0)break;j=(c[q>>2]|0)+h|0;f=((1<<h)+-1&f)<<24-j|c[r>>2];if((j|0)>7){i=j;do{h=f>>>16;x=c[s>>2]|0;c[s>>2]=x+1;a[x>>0]=h;x=(c[t>>2]|0)+-1|0;c[t>>2]=x;if(!x)Ad(w);if((h&255|0)==255?(x=c[s>>2]|0,c[s>>2]=x+1,a[x>>0]=0,x=(c[t>>2]|0)+-1|0,c[t>>2]=x,(x|0)==0):0)Ad(w);f=f<<8;i=i+-8|0}while((i|0)>7);h=j&7}else h=j;c[r>>2]=f;c[q>>2]=h}else{x=(c[w+76+(i<<2)>>2]|0)+(g<<2)|0;c[x>>2]=(c[x>>2]|0)+1}while(0);if((g|0)!=0?(c[o>>2]|0)==0:0){i=(c[q>>2]|0)+g|0;f=((1<<g)+-1&k)<<24-i|c[r>>2];if((i|0)>7){h=i;do{g=f>>>16;x=c[s>>2]|0;c[s>>2]=x+1;a[x>>0]=g;x=(c[t>>2]|0)+-1|0;c[t>>2]=x;if(!x)Ad(w);if((g&255|0)==255?(x=c[s>>2]|0,c[s>>2]=x+1,a[x>>0]=0,x=(c[t>>2]|0)+-1|0,c[t>>2]=x,(x|0)==0):0)Ad(w);f=f<<8;h=h+-8|0}while((h|0)>7);g=i&7}else g=i;c[r>>2]=f;c[q>>2]=g}v=v+1|0}while((v|0)<(c[l>>2]|0))}f=c[m>>2]|0;c[f>>2]=c[s>>2];c[f+4>>2]=c[t>>2];f=c[u>>2]|0;if(f){h=w+36|0;g=c[h>>2]|0;if(!g){c[h>>2]=f;x=w+40|0;c[x>>2]=(c[x>>2]|0)+1&7}else f=g;c[h>>2]=f+-1}return 1}function sd(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;B=c[d+424>>2]|0;x=d+24|0;A=c[x>>2]|0;y=B+112|0;c[y>>2]=c[A>>2];z=B+116|0;c[z>>2]=c[A+4>>2];A=d+236|0;if((c[A>>2]|0)!=0?(c[B+36>>2]|0)==0:0)yd(B,c[B+40>>2]|0);u=c[d+368>>2]|0;v=c[d+376>>2]|0;w=c[d+384>>2]|0;n=c[e>>2]|0;e=c[d+364>>2]|0;if((e|0)<=(u|0)){o=B+128|0;p=B+124|0;q=B+108|0;r=B+120|0;s=B+16|0;t=B+12|0;m=e;e=0;while(1){f=b[n+(c[w+(m<<2)>>2]<<1)>>1]|0;g=f<<16>>16;do if(f<<16>>16){if(f<<16>>16<0){l=0-g>>v;f=l;l=~l}else{l=g>>v;f=l}if(!f){e=e+1|0;break}if(c[o>>2]|0)zd(B);if((e|0)>15){k=e;do{g=c[p>>2]|0;do if(!(c[q>>2]|0)){j=c[B+60+(g<<2)>>2]|0;g=c[j+960>>2]|0;j=a[j+1264>>0]|0;h=j<<24>>24;if(j<<24>>24==0?(j=c[r>>2]|0,i=c[j>>2]|0,c[i+20>>2]=41,Ka[c[i>>2]&63](j),(c[q>>2]|0)!=0):0)break;j=(c[s>>2]|0)+h|0;g=((1<<h)+-1&g)<<24-j|c[t>>2];if((j|0)>7){i=j;do{h=g>>>16;C=c[y>>2]|0;c[y>>2]=C+1;a[C>>0]=h;C=(c[z>>2]|0)+-1|0;c[z>>2]=C;if(!C)Ad(B);do if((h&255|0)==255){C=c[y>>2]|0;c[y>>2]=C+1;a[C>>0]=0;C=(c[z>>2]|0)+-1|0;c[z>>2]=C;if(C)break;Ad(B)}while(0);g=g<<8;i=i+-8|0}while((i|0)>7);h=j&7}else h=j;c[t>>2]=g;c[s>>2]=h}else{C=(c[B+92+(g<<2)>>2]|0)+960|0;c[C>>2]=(c[C>>2]|0)+1}while(0);k=k+-16|0}while((k|0)>15);e=e&15}g=1;while(1){f=f>>1;if(!f)break;else g=g+1|0}if((g|0)>10){C=c[d>>2]|0;c[C+20>>2]=6;Ka[c[C>>2]&63](d)}f=c[p>>2]|0;e=g+(e<<4)|0;do if(!(c[q>>2]|0)){C=c[B+60+(f<<2)>>2]|0;f=c[C+(e<<2)>>2]|0;C=a[C+1024+e>>0]|0;e=C<<24>>24;if(C<<24>>24==0?(C=c[r>>2]|0,k=c[C>>2]|0,c[k+20>>2]=41,Ka[c[k>>2]&63](C),(c[q>>2]|0)!=0):0)break;i=(c[s>>2]|0)+e|0;e=((1<<e)+-1&f)<<24-i|c[t>>2];if((i|0)>7){h=i;do{f=e>>>16;C=c[y>>2]|0;c[y>>2]=C+1;a[C>>0]=f;C=(c[z>>2]|0)+-1|0;c[z>>2]=C;if(!C)Ad(B);do if((f&255|0)==255){C=c[y>>2]|0;c[y>>2]=C+1;a[C>>0]=0;C=(c[z>>2]|0)+-1|0;c[z>>2]=C;if(C)break;Ad(B)}while(0);e=e<<8;h=h+-8|0}while((h|0)>7);f=i&7}else f=i;c[t>>2]=e;c[s>>2]=f}else{C=(c[B+92+(f<<2)>>2]|0)+(e<<2)|0;c[C>>2]=(c[C>>2]|0)+1}while(0);if(!g){C=c[r>>2]|0;k=c[C>>2]|0;c[k+20>>2]=41;Ka[c[k>>2]&63](C)}if(!(c[q>>2]|0)){h=(c[s>>2]|0)+g|0;e=((1<<g)+-1&l)<<24-h|c[t>>2];if((h|0)>7){g=h;do{f=e>>>16;C=c[y>>2]|0;c[y>>2]=C+1;a[C>>0]=f;C=(c[z>>2]|0)+-1|0;c[z>>2]=C;if(!C)Ad(B);do if((f&255|0)==255){C=c[y>>2]|0;c[y>>2]=C+1;a[C>>0]=0;C=(c[z>>2]|0)+-1|0;c[z>>2]=C;if(C)break;Ad(B)}while(0);e=e<<8;g=g+-8|0}while((g|0)>7);f=h&7}else f=h;c[t>>2]=e;c[s>>2]=f;e=0}else e=0}else e=e+1|0;while(0);if((m|0)<(u|0))m=m+1|0;else break}if((e|0)>0?(d=B+128|0,C=(c[d>>2]|0)+1|0,c[d>>2]=C,(C|0)==32767):0)zd(B)}e=c[x>>2]|0;c[e>>2]=c[y>>2];c[e+4>>2]=c[z>>2];e=c[A>>2]|0;if(e){g=B+36|0;f=c[g>>2]|0;if(!f){c[g>>2]=e;C=B+40|0;c[C>>2]=(c[C>>2]|0)+1&7}else e=f;c[g>>2]=e+-1}return 1}function td(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;s=c[d+424>>2]|0;o=d+24|0;r=c[o>>2]|0;p=s+112|0;c[p>>2]=c[r>>2];q=s+116|0;c[q>>2]=c[r+4>>2];r=d+236|0;if((c[r>>2]|0)!=0?(c[s+36>>2]|0)==0:0)yd(s,c[s+40>>2]|0);n=c[d+376>>2]|0;j=d+320|0;d=c[j>>2]|0;if((d|0)>0){k=s+108|0;l=s+16|0;m=s+12|0;i=0;do{if(!(c[k>>2]|0)){f=c[l>>2]|0;g=f+1|0;f=((b[c[e+(i<<2)>>2]>>1]|0)>>>n&1)<<23-f|c[m>>2];if((g|0)>7){h=g;d=f;do{f=d>>>16;t=c[p>>2]|0;c[p>>2]=t+1;a[t>>0]=f;t=(c[q>>2]|0)+-1|0;c[q>>2]=t;if(!t)Ad(s);if((f&255|0)==255?(t=c[p>>2]|0,c[p>>2]=t+1,a[t>>0]=0,t=(c[q>>2]|0)+-1|0,c[q>>2]=t,(t|0)==0):0)Ad(s);d=d<<8;h=h+-8|0}while((h|0)>7);f=d;d=c[j>>2]|0;g=g&7}c[m>>2]=f;c[l>>2]=g}i=i+1|0}while((i|0)<(d|0))}d=c[o>>2]|0;c[d>>2]=c[p>>2];c[d+4>>2]=c[q>>2];d=c[r>>2]|0;if(d){g=s+36|0;f=c[g>>2]|0;if(!f){c[g>>2]=d;t=s+40|0;c[t>>2]=(c[t>>2]|0)+1&7}else d=f;c[g>>2]=d+-1}return 1}function ud(d,f){d=d|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;F=i;i=i+256|0;z=F;E=c[d+424>>2]|0;A=d+24|0;D=c[A>>2]|0;B=E+112|0;c[B>>2]=c[D>>2];C=E+116|0;c[C>>2]=c[D+4>>2];D=d+236|0;if((c[D>>2]|0)!=0?(c[E+36>>2]|0)==0:0)yd(E,c[E+40>>2]|0);x=c[d+368>>2]|0;g=c[d+376>>2]|0;y=c[d+384>>2]|0;w=c[f>>2]|0;j=c[d+364>>2]|0;h=(j|0)>(x|0);if(!h){f=0;d=j;while(1){u=b[w+(c[y+(d<<2)>>2]<<1)>>1]|0;v=u<<16>>16;v=(u<<16>>16<0?0-v|0:v)>>g;c[z+(d<<2)>>2]=v;f=(v|0)==1?d:f;if((d|0)<(x|0))d=d+1|0;else{v=f;break}}u=E+136|0;g=E+132|0;if(h){d=0;f=0}else{p=E+124|0;q=E+108|0;r=E+120|0;s=E+16|0;t=E+12|0;d=0;h=(c[u>>2]|0)+(c[g>>2]|0)|0;o=j;f=0;while(1){n=c[z+(o<<2)>>2]|0;do if(!n)f=f+1|0;else{if(!((o|0)>(v|0)|(f|0)<16))while(1){zd(E);j=c[p>>2]|0;do if(!(c[q>>2]|0)){m=c[E+60+(j<<2)>>2]|0;j=c[m+960>>2]|0;m=a[m+1264>>0]|0;k=m<<24>>24;if(m<<24>>24==0?(m=c[r>>2]|0,l=c[m>>2]|0,c[l+20>>2]=41,Ka[c[l>>2]&63](m),(c[q>>2]|0)!=0):0)break;m=(c[s>>2]|0)+k|0;j=((1<<k)+-1&j)<<24-m|c[t>>2];if((m|0)>7){l=m;do{k=j>>>16;G=c[B>>2]|0;c[B>>2]=G+1;a[G>>0]=k;G=(c[C>>2]|0)+-1|0;c[C>>2]=G;if(!G)Ad(E);if((k&255|0)==255?(G=c[B>>2]|0,c[B>>2]=G+1,a[G>>0]=0,G=(c[C>>2]|0)+-1|0,c[C>>2]=G,(G|0)==0):0)Ad(E);j=j<<8;l=l+-8|0}while((l|0)>7);k=m&7}else k=m;c[t>>2]=j;c[s>>2]=k}else{G=(c[E+92+(j<<2)>>2]|0)+960|0;c[G>>2]=(c[G>>2]|0)+1}while(0);f=f+-16|0;Bd(E,h,d);h=c[u>>2]|0;if((f|0)<16){d=0;break}else d=0}if((n|0)>1){a[h+d>>0]=n&1;d=d+1|0;break}zd(E);j=c[p>>2]|0;f=f<<4|1;do if(!(c[q>>2]|0)){G=c[E+60+(j<<2)>>2]|0;j=c[G+(f<<2)>>2]|0;G=a[G+1024+f>>0]|0;f=G<<24>>24;if(G<<24>>24==0?(G=c[r>>2]|0,n=c[G>>2]|0,c[n+20>>2]=41,Ka[c[n>>2]&63](G),(c[q>>2]|0)!=0):0)break;l=(c[s>>2]|0)+f|0;f=((1<<f)+-1&j)<<24-l|c[t>>2];if((l|0)>7){k=l;do{j=f>>>16;G=c[B>>2]|0;c[B>>2]=G+1;a[G>>0]=j;G=(c[C>>2]|0)+-1|0;c[C>>2]=G;if(!G)Ad(E);if((j&255|0)==255?(G=c[B>>2]|0,c[B>>2]=G+1,a[G>>0]=0,G=(c[C>>2]|0)+-1|0,c[C>>2]=G,(G|0)==0):0)Ad(E);f=f<<8;k=k+-8|0}while((k|0)>7);G=c[q>>2]|0;c[t>>2]=f;c[s>>2]=l&7;if(G)break}else{c[t>>2]=f;c[s>>2]=l}f=c[s>>2]|0;l=f+1|0;f=((e[w+(c[y+(o<<2)>>2]<<1)>>1]|0)>>>15&65535^1)<<23-f|c[t>>2];if((l|0)>7){k=l;do{j=f>>>16;G=c[B>>2]|0;c[B>>2]=G+1;a[G>>0]=j;G=(c[C>>2]|0)+-1|0;c[C>>2]=G;if(!G)Ad(E);if((j&255|0)==255?(G=c[B>>2]|0,c[B>>2]=G+1,a[G>>0]=0,G=(c[C>>2]|0)+-1|0,c[C>>2]=G,(G|0)==0):0)Ad(E);f=f<<8;k=k+-8|0}while((k|0)>7);j=l&7}else j=l;c[t>>2]=f;c[s>>2]=j}else{G=(c[E+92+(j<<2)>>2]|0)+(f<<2)|0;c[G>>2]=(c[G>>2]|0)+1}while(0);Bd(E,h,d);d=0;h=c[u>>2]|0;f=0}while(0);if((o|0)<(x|0))o=o+1|0;else break}}}else{g=E+132|0;d=0;f=0}if((f|0)>0|(d|0)!=0?(G=E+128|0,z=(c[G>>2]|0)+1|0,c[G>>2]=z,G=(c[g>>2]|0)+d|0,c[g>>2]=G,(z|0)==32767|G>>>0>937):0)zd(E);f=c[A>>2]|0;c[f>>2]=c[B>>2];c[f+4>>2]=c[C>>2];f=c[D>>2]|0;if(f){g=E+36|0;d=c[g>>2]|0;if(!d){c[g>>2]=f;G=E+40|0;c[G>>2]=(c[G>>2]|0)+1&7}else f=d;c[g>>2]=f+-1}i=F;return 1}function vd(a,d){a=a|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;u=c[a+424>>2]|0;h=a+236|0;f=c[h>>2]|0;if(f){i=u+36|0;e=c[i>>2]|0;if(!e){g=a+292|0;if((c[g>>2]|0)>0){e=0;do{c[u+20+(e<<2)>>2]=0;e=e+1|0}while((e|0)<(c[g>>2]|0));e=c[h>>2]|0}else e=f;c[i>>2]=e}c[i>>2]=e+-1}n=a+320|0;if((c[n>>2]|0)>0){o=a+388|0;p=a+384|0;t=0;do{r=c[a+324+(t<<2)>>2]|0;s=c[a+296+(r<<2)>>2]|0;q=d+(t<<2)|0;k=c[q>>2]|0;r=u+20+(r<<2)|0;h=c[u+76+(c[s+20>>2]<<2)>>2]|0;s=c[u+92+(c[s+24>>2]<<2)>>2]|0;l=c[o>>2]|0;m=c[p>>2]|0;e=(b[k>>1]|0)-(c[r>>2]|0)|0;e=(e|0)<0?0-e|0:e;if(e){f=0;g=e;while(1){e=f+1|0;g=g>>1;if(!g)break;else f=e}if((f|0)>10){j=c[a>>2]|0;c[j+20>>2]=6;Ka[c[j>>2]&63](a)}}else e=0;j=h+(e<<2)|0;c[j>>2]=(c[j>>2]|0)+1;if((l|0)>=1){i=s+960|0;j=1;e=0;while(1){g=b[k+(c[m+(j<<2)>>2]<<1)>>1]|0;h=g<<16>>16;if(!(g<<16>>16))e=e+1|0;else{if((e|0)>15){f=e+-16|0;e=f>>>4;c[i>>2]=e+1+(c[i>>2]|0);e=f-(e<<4)|0}f=1;g=g<<16>>16<0?0-h|0:h;while(1){g=g>>1;if(!g)break;else f=f+1|0}if((f|0)>10){h=c[a>>2]|0;c[h+20>>2]=6;Ka[c[h>>2]&63](a)}e=s+(f+(e<<4)<<2)|0;c[e>>2]=(c[e>>2]|0)+1;e=0}if((j|0)==(l|0))break;else j=j+1|0}if((e|0)>0)c[s>>2]=(c[s>>2]|0)+1}c[r>>2]=b[c[q>>2]>>1];t=t+1|0}while((t|0)<(c[n>>2]|0))}return 1}
function wd(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;J=i;i=i+48|0;H=J;I=c[d+424>>2]|0;D=d+24|0;F=c[D>>2]|0;f=c[F>>2]|0;c[H>>2]=f;E=H+4|0;c[E>>2]=c[F+4>>2];F=H+8|0;G=I+12|0;c[F>>2]=c[G>>2];c[F+4>>2]=c[G+4>>2];c[F+8>>2]=c[G+8>>2];c[F+12>>2]=c[G+12>>2];c[F+16>>2]=c[G+16>>2];c[F+20>>2]=c[G+20>>2];B=H+32|0;c[B>>2]=d;C=d+236|0;a:do if((c[C>>2]|0)!=0?(c[I+36>>2]|0)==0:0){m=c[I+40>>2]|0;k=H+12|0;h=c[k>>2]|0;l=H+8|0;if((h|0)>0){g=h+7|0;j=c[l>>2]|127<<17-h;while(1){A=j>>>16;h=A&255;c[H>>2]=f+1;a[f>>0]=A;A=(c[E>>2]|0)+-1|0;c[E>>2]=A;if(!A){A=c[B>>2]|0;f=c[A+24>>2]|0;if(!(Na[c[f+12>>2]&15](A)|0)){f=0;break a}c[H>>2]=c[f>>2];c[E>>2]=c[f+4>>2]}if((h|0)==255?(A=c[H>>2]|0,c[H>>2]=A+1,a[A>>0]=0,A=(c[E>>2]|0)+-1|0,c[E>>2]=A,(A|0)==0):0){A=c[B>>2]|0;f=c[A+24>>2]|0;if(!(Na[c[f+12>>2]&15](A)|0)){f=0;break a}c[H>>2]=c[f>>2];c[E>>2]=c[f+4>>2]}g=g+-8|0;if((g|0)<=7)break;f=c[H>>2]|0;j=j<<8}f=c[H>>2]|0}c[l>>2]=0;c[k>>2]=0;c[H>>2]=f+1;a[f>>0]=-1;A=(c[E>>2]|0)+-1|0;c[E>>2]=A;if(!A){A=c[B>>2]|0;f=c[A+24>>2]|0;if(!(Na[c[f+12>>2]&15](A)|0)){f=0;break}A=c[f>>2]|0;c[H>>2]=A;c[E>>2]=c[f+4>>2];f=A}else f=c[H>>2]|0;c[H>>2]=f+1;a[f>>0]=m+208;A=(c[E>>2]|0)+-1|0;c[E>>2]=A;f=c[B>>2]|0;if(!A){g=c[f+24>>2]|0;if(!(Na[c[g+12>>2]&15](f)|0)){f=0;break}c[H>>2]=c[g>>2];c[E>>2]=c[g+4>>2]}if((c[f+292>>2]|0)>0){g=0;do{c[H+16+(g<<2)>>2]=0;g=g+1|0;f=c[B>>2]|0}while((g|0)<(c[f+292>>2]|0));n=24}else n=24}else{f=d;n=24}while(0);b:do if((n|0)==24){y=d+320|0;c:do if((c[y>>2]|0)>0){z=H+12|0;A=H+8|0;g=0;while(1){x=c[d+324+(g<<2)>>2]|0;v=c[d+296+(x<<2)>>2]|0;w=e+(g<<2)|0;s=c[w>>2]|0;x=H+16+(x<<2)|0;l=c[I+44+(c[v+20>>2]<<2)>>2]|0;v=c[I+60+(c[v+24>>2]<<2)>>2]|0;t=c[f+388>>2]|0;u=c[f+384>>2]|0;j=(b[s>>1]|0)-(c[x>>2]|0)|0;n=(j>>31)+j|0;j=(j|0)<0?0-j|0:j;if(j){h=0;while(1){k=h+1|0;j=j>>1;if(!j){j=k;break}else h=k}if((h|0)>10){m=c[f>>2]|0;c[m+20>>2]=6;Ka[c[m>>2]&63](f);m=j}else m=j}else m=0;j=c[l+(m<<2)>>2]|0;r=a[l+1024+m>>0]|0;h=r<<24>>24;if(!(r<<24>>24)){r=c[f>>2]|0;c[r+20>>2]=41;Ka[c[r>>2]&63](f)}f=(c[z>>2]|0)+h|0;h=((1<<h)+-1&j)<<24-f|c[A>>2];if((f|0)>7)do{q=h>>>16;j=q&255;r=c[H>>2]|0;c[H>>2]=r+1;a[r>>0]=q;r=(c[E>>2]|0)+-1|0;c[E>>2]=r;if(!r){r=c[B>>2]|0;k=c[r+24>>2]|0;if(!(Na[c[k+12>>2]&15](r)|0)){f=0;break b}c[H>>2]=c[k>>2];c[E>>2]=c[k+4>>2]}if((j|0)==255?(r=c[H>>2]|0,c[H>>2]=r+1,a[r>>0]=0,r=(c[E>>2]|0)+-1|0,c[E>>2]=r,(r|0)==0):0){r=c[B>>2]|0;j=c[r+24>>2]|0;if(!(Na[c[j+12>>2]&15](r)|0)){f=0;break b}c[H>>2]=c[j>>2];c[E>>2]=c[j+4>>2]}h=h<<8;f=f+-8|0}while((f|0)>7);c[A>>2]=h;c[z>>2]=f;if(m){f=f+m|0;h=((1<<m)+-1&n)<<24-f|h;if((f|0)>7)do{q=h>>>16;j=q&255;r=c[H>>2]|0;c[H>>2]=r+1;a[r>>0]=q;r=(c[E>>2]|0)+-1|0;c[E>>2]=r;if(!r){r=c[B>>2]|0;k=c[r+24>>2]|0;if(!(Na[c[k+12>>2]&15](r)|0)){f=0;break b}c[H>>2]=c[k>>2];c[E>>2]=c[k+4>>2]}if((j|0)==255?(r=c[H>>2]|0,c[H>>2]=r+1,a[r>>0]=0,r=(c[E>>2]|0)+-1|0,c[E>>2]=r,(r|0)==0):0){r=c[B>>2]|0;j=c[r+24>>2]|0;if(!(Na[c[j+12>>2]&15](r)|0)){f=0;break b}c[H>>2]=c[j>>2];c[E>>2]=c[j+4>>2]}h=h<<8;f=f+-8|0}while((f|0)>7);c[A>>2]=h;c[z>>2]=f}if((t|0)>=1){q=v+960|0;r=v+1264|0;k=f;p=1;f=0;while(1){n=b[s+(c[u+(p<<2)>>2]<<1)>>1]|0;o=n<<16>>16;if(!(n<<16>>16))f=f+1|0;else{if((f|0)>15)do{j=c[q>>2]|0;m=a[r>>0]|0;l=m<<24>>24;if(!(m<<24>>24)){m=c[B>>2]|0;K=c[m>>2]|0;c[K+20>>2]=41;Ka[c[K>>2]&63](m)}k=k+l|0;h=((1<<l)+-1&j)<<24-k|h;if((k|0)>7)do{m=h>>>16;j=m&255;K=c[H>>2]|0;c[H>>2]=K+1;a[K>>0]=m;K=(c[E>>2]|0)+-1|0;c[E>>2]=K;if(!K){K=c[B>>2]|0;l=c[K+24>>2]|0;if(!(Na[c[l+12>>2]&15](K)|0)){f=0;break b}c[H>>2]=c[l>>2];c[E>>2]=c[l+4>>2]}do if((j|0)==255){K=c[H>>2]|0;c[H>>2]=K+1;a[K>>0]=0;K=(c[E>>2]|0)+-1|0;c[E>>2]=K;if(K)break;K=c[B>>2]|0;j=c[K+24>>2]|0;if(!(Na[c[j+12>>2]&15](K)|0)){f=0;break b}c[H>>2]=c[j>>2];c[E>>2]=c[j+4>>2]}while(0);h=h<<8;k=k+-8|0}while((k|0)>7);c[A>>2]=h;c[z>>2]=k;f=f+-16|0}while((f|0)>15);m=n<<16>>16>>15;l=1;j=n<<16>>16<0?0-o|0:o;while(1){j=j>>1;if(!j){n=l;break}else l=l+1|0}m=(m<<16>>16)+o|0;if((n|0)>10){K=c[B>>2]|0;o=c[K>>2]|0;c[o+20>>2]=6;Ka[c[o>>2]&63](K)}K=n+(f<<4)|0;j=c[v+(K<<2)>>2]|0;K=a[v+1024+K>>0]|0;l=K<<24>>24;if(!(K<<24>>24)){K=c[B>>2]|0;o=c[K>>2]|0;c[o+20>>2]=41;Ka[c[o>>2]&63](K)}f=k+l|0;h=((1<<l)+-1&j)<<24-f|h;if((f|0)>7)do{o=h>>>16;j=o&255;K=c[H>>2]|0;c[H>>2]=K+1;a[K>>0]=o;K=(c[E>>2]|0)+-1|0;c[E>>2]=K;if(!K){K=c[B>>2]|0;k=c[K+24>>2]|0;if(!(Na[c[k+12>>2]&15](K)|0)){f=0;break b}c[H>>2]=c[k>>2];c[E>>2]=c[k+4>>2]}do if((j|0)==255){K=c[H>>2]|0;c[H>>2]=K+1;a[K>>0]=0;K=(c[E>>2]|0)+-1|0;c[E>>2]=K;if(K)break;K=c[B>>2]|0;j=c[K+24>>2]|0;if(!(Na[c[j+12>>2]&15](K)|0)){f=0;break b}c[H>>2]=c[j>>2];c[E>>2]=c[j+4>>2]}while(0);h=h<<8;f=f+-8|0}while((f|0)>7);c[A>>2]=h;c[z>>2]=f;if(!n){K=c[B>>2]|0;o=c[K>>2]|0;c[o+20>>2]=41;Ka[c[o>>2]&63](K)}k=f+n|0;h=((1<<n)+-1&m)<<24-k|h;if((k|0)>7)do{o=h>>>16;f=o&255;K=c[H>>2]|0;c[H>>2]=K+1;a[K>>0]=o;K=(c[E>>2]|0)+-1|0;c[E>>2]=K;if(!K){K=c[B>>2]|0;j=c[K+24>>2]|0;if(!(Na[c[j+12>>2]&15](K)|0)){f=0;break b}c[H>>2]=c[j>>2];c[E>>2]=c[j+4>>2]}do if((f|0)==255){K=c[H>>2]|0;c[H>>2]=K+1;a[K>>0]=0;K=(c[E>>2]|0)+-1|0;c[E>>2]=K;if(K)break;K=c[B>>2]|0;f=c[K+24>>2]|0;if(!(Na[c[f+12>>2]&15](K)|0)){f=0;break b}c[H>>2]=c[f>>2];c[E>>2]=c[f+4>>2]}while(0);h=h<<8;k=k+-8|0}while((k|0)>7);c[A>>2]=h;c[z>>2]=k;f=0}if((p|0)<(t|0))p=p+1|0;else{l=h;break}}if((f|0)>0){j=c[v>>2]|0;K=a[v+1024>>0]|0;h=K<<24>>24;if(!(K<<24>>24)){K=c[B>>2]|0;v=c[K>>2]|0;c[v+20>>2]=41;Ka[c[v>>2]&63](K)}f=k+h|0;h=((1<<h)+-1&j)<<24-f|l;if((f|0)>7)do{v=h>>>16;j=v&255;K=c[H>>2]|0;c[H>>2]=K+1;a[K>>0]=v;K=(c[E>>2]|0)+-1|0;c[E>>2]=K;if(!K){K=c[B>>2]|0;k=c[K+24>>2]|0;if(!(Na[c[k+12>>2]&15](K)|0)){f=0;break b}c[H>>2]=c[k>>2];c[E>>2]=c[k+4>>2]}if((j|0)==255?(K=c[H>>2]|0,c[H>>2]=K+1,a[K>>0]=0,K=(c[E>>2]|0)+-1|0,c[E>>2]=K,(K|0)==0):0){K=c[B>>2]|0;j=c[K+24>>2]|0;if(!(Na[c[j+12>>2]&15](K)|0)){f=0;break b}c[H>>2]=c[j>>2];c[E>>2]=c[j+4>>2]}h=h<<8;f=f+-8|0}while((f|0)>7);c[A>>2]=h;c[z>>2]=f}}c[x>>2]=b[c[w>>2]>>1];g=g+1|0;if((g|0)>=(c[y>>2]|0))break c;f=c[B>>2]|0}}while(0);f=c[D>>2]|0;c[f>>2]=c[H>>2];c[f+4>>2]=c[E>>2];c[G>>2]=c[F>>2];c[G+4>>2]=c[F+4>>2];c[G+8>>2]=c[F+8>>2];c[G+12>>2]=c[F+12>>2];c[G+16>>2]=c[F+16>>2];c[G+20>>2]=c[F+20>>2];f=c[C>>2]|0;if(!f)f=1;else{h=I+36|0;g=c[h>>2]|0;if(!g){c[h>>2]=f;K=I+40|0;c[K>>2]=(c[K>>2]|0)+1&7}else f=g;c[h>>2]=f+-1;f=1}}while(0);i=J;return f|0}function xd(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;r=i;i=i+1296|0;q=r+1028|0;p=r;if(f>>>0>3){o=c[b>>2]|0;c[o+20>>2]=52;c[o+24>>2]=f;Ka[c[o>>2]&63](b)}m=(e|0)!=0;o=c[(m?b+120+(f<<2)|0:b+136+(f<<2)|0)>>2]|0;if(!o){n=c[b>>2]|0;c[n+20>>2]=52;c[n+24>>2]=f;Ka[c[n>>2]&63](b)}e=c[g>>2]|0;if(!e){e=Ia[c[c[b+4>>2]>>2]&7](b,1,1280)|0;c[g>>2]=e;n=b}else n=b;k=1;j=0;while(1){g=a[o+k>>0]|0;h=g&255;f=h+j|0;if((f|0)>256){l=c[b>>2]|0;c[l+20>>2]=9;Ka[c[l>>2]&63](n)}if(!(g<<24>>24))f=j;else rf(q+j|0,k&255|0,h|0)|0;k=k+1|0;if((k|0)==17)break;else j=f}a[q+f>>0]=0;g=a[q>>0]|0;if(g<<24>>24){k=g;h=0;j=0;l=g<<24>>24;while(1){if((k<<24>>24|0)==(l|0)){g=j;while(1){j=g+1|0;c[p+(g<<2)>>2]=h;h=h+1|0;g=a[q+j>>0]|0;if((g<<24>>24|0)==(l|0))g=j;else break}}else g=k;if((h|0)>=(1<<l|0)){k=c[b>>2]|0;c[k+20>>2]=9;Ka[c[k>>2]&63](n)}if(!(g<<24>>24))break;else{k=g;h=h<<1;l=l+1|0}}}rf(e+1024|0,0,256)|0;h=m?15:255;if((f|0)>0){k=0;do{j=d[o+17+k>>0]|0;g=e+1024+j|0;if(!(j>>>0<=h>>>0?(a[g>>0]|0)==0:0)){m=c[b>>2]|0;c[m+20>>2]=9;Ka[c[m>>2]&63](n)}c[e+(j<<2)>>2]=c[p+(k<<2)>>2];a[g>>0]=a[q+k>>0]|0;k=k+1|0}while((k|0)!=(f|0))}i=r;return}function yd(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;zd(b);if(!(c[b+108>>2]|0)){h=b+16|0;f=c[h>>2]|0;e=f+7|0;i=b+12|0;j=b+112|0;k=b+116|0;if((e|0)>7){g=127<<17-f|c[i>>2];while(1){f=g>>>16;l=c[j>>2]|0;c[j>>2]=l+1;a[l>>0]=f;l=(c[k>>2]|0)+-1|0;c[k>>2]=l;if(!l)Ad(b);if((f&255|0)==255?(l=c[j>>2]|0,c[j>>2]=l+1,a[l>>0]=0,l=(c[k>>2]|0)+-1|0,c[k>>2]=l,(l|0)==0):0)Ad(b);e=e+-8|0;if((e|0)<=7)break;else g=g<<8}}c[i>>2]=0;c[h>>2]=0;l=c[j>>2]|0;c[j>>2]=l+1;a[l>>0]=-1;l=(c[k>>2]|0)+-1|0;c[k>>2]=l;if(!l)Ad(b);l=c[j>>2]|0;c[j>>2]=l+1;a[l>>0]=d+208;l=(c[k>>2]|0)+-1|0;c[k>>2]=l;if(!l)Ad(b)}f=b+120|0;e=c[f>>2]|0;if(!(c[e+364>>2]|0)){if((c[e+292>>2]|0)>0){e=0;do{c[b+20+(e<<2)>>2]=0;e=e+1|0}while((e|0)<(c[(c[f>>2]|0)+292>>2]|0))}}else{c[b+128>>2]=0;c[b+132>>2]=0}return}function zd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;n=b+128|0;d=c[n>>2]|0;if(d){e=0;while(1){d=d>>1;if(!d)break;else e=e+1|0}if((e|0)>14){m=c[b+120>>2]|0;l=c[m>>2]|0;c[l+20>>2]=41;Ka[c[l>>2]&63](m)}d=c[b+124>>2]|0;f=e<<4;m=b+108|0;do if(!(c[m>>2]|0)){l=c[b+60+(d<<2)>>2]|0;g=c[l+(f<<2)>>2]|0;l=a[l+1024+f>>0]|0;d=l<<24>>24;if(l<<24>>24==0?(l=c[b+120>>2]|0,k=c[l>>2]|0,c[k+20>>2]=41,Ka[c[k>>2]&63](l),(c[m>>2]|0)!=0):0)break;k=b+16|0;f=(c[k>>2]|0)+d|0;l=b+12|0;d=((1<<d)+-1&g)<<24-f|c[l>>2];if((f|0)>7){h=b+112|0;i=b+116|0;j=f;do{g=d>>>16;o=c[h>>2]|0;c[h>>2]=o+1;a[o>>0]=g;o=(c[i>>2]|0)+-1|0;c[i>>2]=o;if(!o)Ad(b);if((g&255|0)==255?(o=c[h>>2]|0,c[h>>2]=o+1,a[o>>0]=0,o=(c[i>>2]|0)+-1|0,c[i>>2]=o,(o|0)==0):0)Ad(b);d=d<<8;j=j+-8|0}while((j|0)>7);f=f&7}c[l>>2]=d;c[k>>2]=f}else{o=(c[b+92+(d<<2)>>2]|0)+(f<<2)|0;c[o>>2]=(c[o>>2]|0)+1}while(0);if((e|0)!=0?(c[m>>2]|0)==0:0){j=b+16|0;i=(c[j>>2]|0)+e|0;k=b+12|0;d=(c[n>>2]&(1<<e)+-1)<<24-i|c[k>>2];if((i|0)>7){f=b+112|0;g=b+116|0;h=i;do{e=d>>>16;o=c[f>>2]|0;c[f>>2]=o+1;a[o>>0]=e;o=(c[g>>2]|0)+-1|0;c[g>>2]=o;if(!o)Ad(b);if((e&255|0)==255?(o=c[f>>2]|0,c[f>>2]=o+1,a[o>>0]=0,o=(c[g>>2]|0)+-1|0,c[g>>2]=o,(o|0)==0):0)Ad(b);d=d<<8;h=h+-8|0}while((h|0)>7);e=i&7}else e=i;c[k>>2]=d;c[j>>2]=e}c[n>>2]=0;o=b+132|0;Bd(b,c[b+136>>2]|0,c[o>>2]|0);c[o>>2]=0}return}function Ad(a){a=a|0;var b=0,d=0,e=0;b=a+120|0;e=c[b>>2]|0;d=c[e+24>>2]|0;if(!(Na[c[d+12>>2]&15](e)|0)){e=c[b>>2]|0;b=c[e>>2]|0;c[b+20>>2]=25;Ka[c[b>>2]&63](e)}c[a+112>>2]=c[d>>2];c[a+116>>2]=c[d+4>>2];return}function Bd(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;k=b+108|0;a:do if((f|0)!=0&(c[k>>2]|0)==0){l=b+16|0;m=b+12|0;n=b+112|0;o=b+116|0;j=e;e=0;while(1){if(!e){e=c[l>>2]|0;i=e+1|0;e=((d[j>>0]|0)&1)<<23-e|c[m>>2];if((i|0)>7){h=i;do{g=e>>>16;p=c[n>>2]|0;c[n>>2]=p+1;a[p>>0]=g;p=(c[o>>2]|0)+-1|0;c[o>>2]=p;if(!p)Ad(b);if((g&255|0)==255?(p=c[n>>2]|0,c[n>>2]=p+1,a[p>>0]=0,p=(c[o>>2]|0)+-1|0,c[o>>2]=p,(p|0)==0):0)Ad(b);e=e<<8;h=h+-8|0}while((h|0)>7);g=i&7}else g=i;c[m>>2]=e;c[l>>2]=g}f=f+-1|0;if(!f)break a;j=j+1|0;e=c[k>>2]|0}}while(0);return}function Cd(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;q=i;i=i+2096|0;o=q+2056|0;p=q+1028|0;n=q;h=o;j=h+33|0;do{a[h>>0]=0;h=h+1|0}while((h|0)<(j|0));rf(p|0,0,1028)|0;rf(n|0,-1,1028)|0;c[f+1024>>2]=1;m=-1;g=0;h=1e9;a:while(1){if((g|0)<257){l=c[f+(g<<2)>>2]|0;k=(l|0)==0|(l|0)>(h|0);m=k?m:g;g=g+1|0;h=k?h:l;continue}else{g=-1;j=0;l=1e9}while(1){h=c[f+(j<<2)>>2]|0;k=(j|0)==(m|0)|((h|0)==0|(h|0)>(l|0));g=k?g:j;j=j+1|0;if((j|0)==257){j=g;break}else l=k?l:h}if((j|0)<0)break;g=f+(j<<2)|0;h=f+(m<<2)|0;c[h>>2]=(c[h>>2]|0)+(c[g>>2]|0);c[g>>2]=0;g=p+(m<<2)|0;c[g>>2]=(c[g>>2]|0)+1;g=n+(m<<2)|0;h=c[g>>2]|0;if((h|0)>-1)do{g=p+(h<<2)|0;c[g>>2]=(c[g>>2]|0)+1;g=n+(h<<2)|0;h=c[g>>2]|0}while((h|0)>-1);c[g>>2]=j;g=p+(j<<2)|0;c[g>>2]=(c[g>>2]|0)+1;g=c[n+(j<<2)>>2]|0;if((g|0)<=-1){m=-1;g=0;h=1e9;continue}while(1){m=p+(g<<2)|0;c[m>>2]=(c[m>>2]|0)+1;g=c[n+(g<<2)>>2]|0;if((g|0)<=-1){m=-1;g=0;h=1e9;continue a}}}h=0;do{g=c[p+(h<<2)>>2]|0;if(g){if((g|0)>32){n=c[b>>2]|0;c[n+20>>2]=40;Ka[c[n>>2]&63](b)}n=o+g|0;a[n>>0]=(a[n>>0]|0)+1<<24>>24}h=h+1|0}while((h|0)!=257);g=32;do{m=o+g|0;h=a[m>>0]|0;if(!(h<<24>>24))g=g+-1|0;else{f=g+-2|0;g=g+-1|0;l=o+g|0;do{k=f;while(1){j=o+k|0;if(!(a[j>>0]|0))k=k+-1|0;else break}a[m>>0]=(h&255)+254;a[l>>0]=(a[l>>0]|0)+1<<24>>24;b=o+(k+1)|0;a[b>>0]=(d[b>>0]|0)+2;a[j>>0]=(a[j>>0]|0)+-1<<24>>24;h=a[m>>0]|0}while(h<<24>>24!=0)}}while((g|0)>16);j=16;while(1){h=o+j|0;g=a[h>>0]|0;if(!(g<<24>>24))j=j+-1|0;else break}a[h>>0]=g+-1<<24>>24;h=e;g=o;j=h+17|0;do{a[h>>0]=a[g>>0]|0;h=h+1|0;g=g+1|0}while((h|0)<(j|0));g=1;h=0;do{j=0;do{if((c[p+(j<<2)>>2]|0)==(g|0)){a[e+17+h>>0]=j;h=h+1|0}j=j+1|0}while((j|0)!=256);g=g+1|0}while((g|0)!=33);c[e+276>>2]=0;i=q;return}function Dd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;B=i;i=i+2608|0;w=B+2560|0;x=B;A=Ia[c[c[a+4>>2]>>2]&7](a,1,36)|0;c[a+392>>2]=A;c[A>>2]=27;c[A+4>>2]=28;c[A+8>>2]=29;c[A+16>>2]=0;z=(b|0)==0;if(z){c[a+64>>2]=c[a+28>>2];c[a+68>>2]=c[a+32>>2];c[a+280>>2]=8;c[a+284>>2]=8;b=a+380|0;r=b;b=c[b>>2]|0}else{e=a+280|0;b=c[e>>2]|0;d=a+284|0;if((b|0)!=(c[d>>2]|0)){y=c[a>>2]|0;c[y+20>>2]=7;c[y+24>>2]=b;c[y+28>>2]=c[d>>2];Ka[c[y>>2]&63](a);b=c[e>>2]|0}r=a+380|0;c[r>>2]=b}if((b+-1|0)>>>0>15){y=c[a>>2]|0;c[y+20>>2]=7;c[y+24>>2]=b;c[y+28>>2]=c[r>>2];Ka[c[y>>2]&63](a);b=c[r>>2]|0}switch(b|0){case 2:{c[a+384>>2]=18800;break}case 3:{c[a+384>>2]=18700;break}case 4:{c[a+384>>2]=18572;break}case 5:{c[a+384>>2]=18408;break}case 6:{c[a+384>>2]=18200;break}case 7:{c[a+384>>2]=17940;break}default:c[a+384>>2]=17620}b=c[r>>2]|0;q=(_(b,b)|0)+-1|0;y=a+388|0;c[y>>2]=(b|0)<8?q:63;q=a+68|0;b=c[q>>2]|0;if(!(((b|0)!=0?(c[a+64>>2]|0)!=0:0)?(c[a+76>>2]|0)>=1:0)){b=c[a>>2]|0;c[b+20>>2]=33;Ka[c[b>>2]&63](a);b=c[q>>2]|0}if(!((b|0)<=65500?(c[a+64>>2]|0)<=65500:0)){v=c[a>>2]|0;c[v+20>>2]=42;c[v+24>>2]=65500;Ka[c[v>>2]&63](a)}b=c[a+72>>2]|0;if((b+-8|0)>>>0>4){v=c[a>>2]|0;c[v+20>>2]=16;c[v+24>>2]=b;Ka[c[v>>2]&63](a)}v=a+76|0;b=c[v>>2]|0;if((b|0)>10){u=c[a>>2]|0;c[u+20>>2]=27;c[u+24>>2]=b;c[u+28>>2]=10;Ka[c[u>>2]&63](a);b=c[v>>2]|0}o=a+272|0;c[o>>2]=1;p=a+276|0;c[p>>2]=1;n=a+84|0;if((b|0)>0){d=b;b=1;h=1;j=0;k=c[n>>2]|0;while(1){e=k+8|0;f=c[e>>2]|0;g=k+12|0;if((f+-1|0)>>>0<=3?(l=c[g>>2]|0,(l+-1|0)>>>0<=3):0)e=l;else{h=c[a>>2]|0;c[h+20>>2]=19;Ka[c[h>>2]&63](a);h=c[o>>2]|0;f=c[e>>2]|0;b=c[p>>2]|0;e=c[g>>2]|0;d=c[v>>2]|0}h=(h|0)>(f|0)?h:f;c[o>>2]=h;b=(b|0)>(e|0)?b:e;c[p>>2]=b;j=j+1|0;if((j|0)>=(d|0))break;else k=k+88|0}if((d|0)>0){j=a+280|0;k=a+284|0;l=a+64|0;m=0;h=c[n>>2]|0;while(1){c[h+4>>2]=m;b=c[j>>2]|0;e=h+36|0;c[e>>2]=b;f=c[k>>2]|0;g=h+40|0;c[g>>2]=f;d=f<<1;if((b|0)<=(d|0)){b=b<<1;if((f|0)>(b|0))c[g>>2]=b}else c[e>>2]=d;t=h+8|0;u=_(c[t>>2]|0,c[l>>2]|0)|0;c[h+28>>2]=Gc(u,_(c[r>>2]|0,c[o>>2]|0)|0)|0;u=h+12|0;s=_(c[u>>2]|0,c[q>>2]|0)|0;c[h+32>>2]=Gc(s,_(c[r>>2]|0,c[p>>2]|0)|0)|0;t=_(_(c[t>>2]|0,c[l>>2]|0)|0,c[e>>2]|0)|0;c[h+44>>2]=Gc(t,_(c[r>>2]|0,c[o>>2]|0)|0)|0;u=_(_(c[u>>2]|0,c[q>>2]|0)|0,c[g>>2]|0)|0;c[h+48>>2]=Gc(u,_(c[r>>2]|0,c[p>>2]|0)|0)|0;c[h+52>>2]=0;m=m+1|0;if((m|0)>=(c[v>>2]|0))break;else h=h+88|0}b=c[p>>2]|0}}else b=1;c[a+288>>2]=Gc(c[q>>2]|0,_(c[r>>2]|0,b)|0)|0;t=a+204|0;b=c[t>>2]|0;if(b){u=a+200|0;if((c[u>>2]|0)<1){b=c[a>>2]|0;c[b+20>>2]=20;c[b+24>>2]=0;Ka[c[b>>2]&63](a);b=c[t>>2]|0}if((c[b+20>>2]|0)==0?(c[b+24>>2]|0)==63:0){c[a+268>>2]=0;d=c[v>>2]|0;if((d|0)>0){rf(w|0,0,((d|0)>1?d<<2:4)|0)|0;e=0}else e=0}else{c[a+268>>2]=1;d=c[v>>2]|0;if((d|0)>0){rf(x|0,-1,d<<8|0)|0;e=1}else e=1}if((c[u>>2]|0)<1)b=d;else{r=a+268|0;s=1;while(1){q=c[b>>2]|0;if((q+-1|0)>>>0>3){p=c[a>>2]|0;c[p+20>>2]=27;c[p+24>>2]=q;c[p+28>>2]=4;Ka[c[p>>2]&63](a)}f=(q|0)>0;if(f){e=0;do{d=c[b+4+(e<<2)>>2]|0;if(!((d|0)>=0?(d|0)<(c[v>>2]|0):0)){p=c[a>>2]|0;c[p+20>>2]=20;c[p+24>>2]=s;Ka[c[p>>2]&63](a)}do if((e|0)>0){if((d|0)>(c[b+4+(e+-1<<2)>>2]|0))break;p=c[a>>2]|0;c[p+20>>2]=20;c[p+24>>2]=s;Ka[c[p>>2]&63](a)}while(0);e=e+1|0}while((e|0)!=(q|0))}l=c[b+20>>2]|0;m=c[b+24>>2]|0;n=c[b+28>>2]|0;o=c[b+32>>2]|0;do if(!(c[r>>2]|0)){if((m|0)!=63|(n|l|o|0)!=0){p=c[a>>2]|0;c[p+20>>2]=18;c[p+24>>2]=s;Ka[c[p>>2]&63](a)}if(f){e=0;do{d=w+(c[b+4+(e<<2)>>2]<<2)|0;if(c[d>>2]|0){p=c[a>>2]|0;c[p+20>>2]=20;c[p+24>>2]=s;Ka[c[p>>2]&63](a)}c[d>>2]=1;e=e+1|0}while((e|0)!=(q|0))}}else{if(!(l>>>0<=63?!(o>>>0>10|(n>>>0>10|((m|0)<(l|0)|(m|0)>63))):0)){p=c[a>>2]|0;c[p+20>>2]=18;c[p+24>>2]=s;Ka[c[p>>2]&63](a)}p=(l|0)==0;do if(p){if(!m)break;k=c[a>>2]|0;c[k+20>>2]=18;c[k+24>>2]=s;Ka[c[k>>2]&63](a)}else{if((q|0)==1)break;k=c[a>>2]|0;c[k+20>>2]=18;c[k+24>>2]=s;Ka[c[k>>2]&63](a)}while(0);if(!f)break;g=(n|0)==0;h=(o|0)==(n+-1|0);k=0;do{j=c[b+4+(k<<2)>>2]|0;do if(p)d=0;else{if((c[x+(j<<8)>>2]|0)>=0){d=l;break}d=c[a>>2]|0;c[d+20>>2]=18;c[d+24>>2]=s;Ka[c[d>>2]&63](a);d=l}while(0);if((d|0)<=(m|0))while(1){e=x+(j<<8)+(d<<2)|0;f=c[e>>2]|0;do if((f|0)<0){if(g)break;f=c[a>>2]|0;c[f+20>>2]=18;c[f+24>>2]=s;Ka[c[f>>2]&63](a)}else{if(h&(n|0)==(f|0))break;f=c[a>>2]|0;c[f+20>>2]=18;c[f+24>>2]=s;Ka[c[f>>2]&63](a)}while(0);c[e>>2]=o;if((d|0)<(m|0))d=d+1|0;else break}k=k+1|0}while((k|0)!=(q|0))}while(0);if((s|0)<(c[u>>2]|0)){s=s+1|0;b=b+36|0}else break}e=c[r>>2]|0;b=c[v>>2]|0}d=(b|0)>0;if(!e){if(d){d=0;do{if(!(c[w+(d<<2)>>2]|0)){b=c[a>>2]|0;c[b+20>>2]=46;Ka[c[b>>2]&63](a);b=c[v>>2]|0}d=d+1|0}while((d|0)<(b|0))}}else if(d){d=0;do{if((c[x+(d<<8)>>2]|0)<0){b=c[a>>2]|0;c[b+20>>2]=46;Ka[c[b>>2]&63](a);b=c[v>>2]|0}d=d+1|0}while((d|0)<(b|0))}if((c[a+380>>2]|0)<8){g=c[t>>2]|0;if((c[u>>2]|0)>0){h=0;b=0;do{if((h|0)!=(b|0)){d=g+(b*36|0)|0;e=g+(h*36|0)|0;f=d+36|0;do{c[d>>2]=c[e>>2];d=d+4|0;e=e+4|0}while((d|0)<(f|0))}d=c[y>>2]|0;if((c[g+(b*36|0)+20>>2]|0)<=(d|0)){e=g+(b*36|0)+24|0;if((c[e>>2]|0)>(d|0))c[e>>2]=d;b=b+1|0}h=h+1|0}while((h|0)<(c[u>>2]|0))}else b=0;c[u>>2]=b}}else{c[a+268>>2]=0;c[a+200>>2]=1}b=a+216|0;d=c[b>>2]|0;e=a+212|0;do if(!d)if(!(c[e>>2]|0)){if((c[a+268>>2]|0)==0?((c[a+380>>2]|0)+-2|0)>>>0>=6:0){d=0;break}c[b>>2]=1;d=1}else d=0;else c[e>>2]=0;while(0);do if(!z){b=A+20|0;if(!d){c[b>>2]=2;break}else{c[b>>2]=1;break}}else c[A+20>>2]=0;while(0);c[A+32>>2]=0;c[A+24>>2]=0;b=c[a+200>>2]|0;if(!d)c[A+28>>2]=b;else c[A+28>>2]=b<<1;i=B;return}function Ed(a){a=a|0;var b=0,d=0,e=0,f=0;f=c[a+392>>2]|0;b=f+20|0;a:do switch(c[b>>2]|0){case 0:{Hd(a);Id(a);if(!(c[a+208>>2]|0)){Ka[c[c[a+412>>2]>>2]&63](a);Ka[c[c[a+416>>2]>>2]&63](a);La[c[c[a+400>>2]>>2]&15](a,0)}Ka[c[c[a+420>>2]>>2]&63](a);e=a+216|0;La[c[c[a+424>>2]>>2]&15](a,c[e>>2]|0);La[c[c[a+404>>2]>>2]&15](a,(c[f+28>>2]|0)>1?3:0);La[c[c[a+396>>2]>>2]&15](a,0);b=f+12|0;if(!(c[e>>2]|0)){c[b>>2]=1;break a}else{c[b>>2]=0;break a}}case 1:{Hd(a);Id(a);if((c[a+364>>2]|0)==0?(c[a+372>>2]|0)!=0:0){c[b>>2]=2;d=f+24|0;c[d>>2]=(c[d>>2]|0)+1;d=11;break a}La[c[c[a+424>>2]>>2]&15](a,1);La[c[c[a+404>>2]>>2]&15](a,2);c[f+12>>2]=0;break}case 2:{d=11;break}default:{e=c[a>>2]|0;c[e+20>>2]=49;Ka[c[e>>2]&63](a)}}while(0);if((d|0)==11){if(!(c[a+216>>2]|0)){Hd(a);Id(a)}La[c[c[a+424>>2]>>2]&15](a,0);La[c[c[a+404>>2]>>2]&15](a,2);b=a+408|0;if(!(c[f+32>>2]|0))Ka[c[(c[b>>2]|0)+4>>2]&63](a);Ka[c[(c[b>>2]|0)+8>>2]&63](a);c[f+12>>2]=0}d=c[f+24>>2]|0;e=c[f+28>>2]|0;c[f+16>>2]=(d|0)==(e+-1|0)&1;b=c[a+8>>2]|0;if(b){c[b+12>>2]=d;c[b+16>>2]=e}return}function Fd(a){a=a|0;var b=0;c[(c[a+392>>2]|0)+12>>2]=0;b=a+408|0;Ka[c[(c[b>>2]|0)+4>>2]&63](a);Ka[c[(c[b>>2]|0)+8>>2]&63](a);return}function Gd(a){a=a|0;var b=0,d=0;b=c[a+392>>2]|0;Ka[c[(c[a+424>>2]|0)+8>>2]&63](a);d=b+20|0;switch(c[d>>2]|0){case 0:{c[d>>2]=2;if(!(c[a+216>>2]|0)){a=b+32|0;c[a>>2]=(c[a>>2]|0)+1}break}case 1:{c[d>>2]=2;break}case 2:{if(c[a+216>>2]|0)c[d>>2]=1;a=b+32|0;c[a>>2]=(c[a>>2]|0)+1;break}default:{}}a=b+24|0;c[a>>2]=(c[a>>2]|0)+1;return}function Hd(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=c[a+204>>2]|0;if(!b){e=a+76|0;b=c[e>>2]|0;if((b|0)>4){h=c[a>>2]|0;c[h+20>>2]=27;c[h+24>>2]=b;c[h+28>>2]=4;Ka[c[h>>2]&63](a);b=c[e>>2]|0}c[a+292>>2]=b;if((b|0)>0){b=a+84|0;d=0;do{c[a+296+(d<<2)>>2]=(c[b>>2]|0)+(d*88|0);d=d+1|0}while((d|0)<(c[e>>2]|0));h=12}else h=12}else{e=c[(c[a+392>>2]|0)+32>>2]|0;f=c[b+(e*36|0)>>2]|0;c[a+292>>2]=f;if((f|0)>0){d=a+84|0;g=0;do{c[a+296+(g<<2)>>2]=(c[d>>2]|0)+((c[b+(e*36|0)+4+(g<<2)>>2]|0)*88|0);g=g+1|0}while((g|0)<(f|0))}if(!(c[a+268>>2]|0))h=12;else{c[a+364>>2]=c[b+(e*36|0)+20>>2];c[a+368>>2]=c[b+(e*36|0)+24>>2];c[a+372>>2]=c[b+(e*36|0)+28>>2];c[a+376>>2]=c[b+(e*36|0)+32>>2]}}if((h|0)==12){c[a+364>>2]=0;h=c[a+380>>2]|0;c[a+368>>2]=(_(h,h)|0)+-1;c[a+372>>2]=0;c[a+376>>2]=0}return}function Id(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;g=a+292|0;b=c[g>>2]|0;a:do if((b|0)!=1){if((b+-1|0)>>>0>3){f=c[a>>2]|0;c[f+20>>2]=27;c[f+24>>2]=b;c[f+28>>2]=4;Ka[c[f>>2]&63](a)}f=a+380|0;c[a+312>>2]=Gc(c[a+64>>2]|0,_(c[f>>2]|0,c[a+272>>2]|0)|0)|0;c[a+316>>2]=Gc(c[a+68>>2]|0,_(c[f>>2]|0,c[a+276>>2]|0)|0)|0;f=a+320|0;c[f>>2]=0;if((c[g>>2]|0)>0){e=0;b=0;while(1){h=c[a+296+(b<<2)>>2]|0;k=c[h+8>>2]|0;c[h+56>>2]=k;j=c[h+12>>2]|0;c[h+60>>2]=j;d=_(k,j)|0;c[h+64>>2]=d;c[h+68>>2]=_(c[h+36>>2]|0,k)|0;i=((c[h+28>>2]|0)>>>0)%(k>>>0)|0;c[h+72>>2]=(i|0)==0?k:i;i=((c[h+32>>2]|0)>>>0)%(j>>>0)|0;c[h+76>>2]=(i|0)==0?j:i;if((e+d|0)>10){k=c[a>>2]|0;c[k+20>>2]=14;Ka[c[k>>2]&63](a)}if((d|0)>0)while(1){k=c[f>>2]|0;c[f>>2]=k+1;c[a+324+(k<<2)>>2]=b;if((d|0)>1)d=d+-1|0;else break}b=b+1|0;if((b|0)>=(c[g>>2]|0))break a;e=c[f>>2]|0}}}else{k=c[a+296>>2]|0;c[a+312>>2]=c[k+28>>2];j=c[k+32>>2]|0;c[a+316>>2]=j;c[k+56>>2]=1;c[k+60>>2]=1;c[k+64>>2]=1;c[k+68>>2]=c[k+36>>2];c[k+72>>2]=1;i=c[k+12>>2]|0;j=(j>>>0)%(i>>>0)|0;c[k+76>>2]=(j|0)==0?i:j;c[a+320>>2]=1;c[a+324>>2]=0}while(0);b=c[a+240>>2]|0;if((b|0)>0){k=_(c[a+312>>2]|0,b)|0;c[a+236>>2]=(k|0)<65535?k:65535}return}function Jd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0;d=b+4|0;e=Ia[c[c[d>>2]>>2]&7](b,1,192)|0;c[b+468>>2]=e;c[e>>2]=30;c[e+8>>2]=31;f=e+60|0;g=e+124|0;h=0;do{c[f+(h<<2)>>2]=0;c[g+(h<<2)>>2]=0;h=h+1|0}while((h|0)!=16);a[e+188>>0]=113;if((c[b+224>>2]|0)!=0?(i=b+36|0,j=Ia[c[c[d>>2]>>2]&7](b,1,c[i>>2]<<8)|0,c[b+160>>2]=j,(c[i>>2]|0)>0):0){d=0;do{rf(j+(d<<8)|0,-1,256)|0;d=d+1|0}while((d|0)<(c[i>>2]|0))}return}function Kd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;n=c[b+468>>2]|0;o=b+224|0;p=b+412|0;f=c[p>>2]|0;e=(f|0)==0;do if(c[o>>2]|0){m=b+416|0;d=c[m>>2]|0;if(e)if(!d)k=7;else k=11;else if(((d|0)>=(f|0)?(d|0)<=(c[b+436>>2]|0):0)?(c[b+340>>2]|0)==1:0)k=7;else k=11;do if((k|0)==7){d=c[b+420>>2]|0;if(d){d=d+-1|0;if((d|0)!=(c[b+424>>2]|0)){k=11;break}}else d=c[b+424>>2]|0;if((d|0)>13)k=11}while(0);if((k|0)==11){l=c[b>>2]|0;c[l+20>>2]=17;c[l+24>>2]=f;c[l+28>>2]=c[m>>2];c[l+32>>2]=c[b+420>>2];c[l+36>>2]=c[b+424>>2];Ka[c[l>>2]&63](b)}l=b+340|0;d=c[l>>2]|0;if((d|0)>0){i=b+160|0;g=b+420|0;j=b+424|0;k=0;do{f=c[(c[b+344+(k<<2)>>2]|0)+4>>2]|0;h=c[i>>2]|0;d=c[p>>2]|0;if(d){if((c[h+(f<<8)>>2]|0)<0){d=c[b>>2]|0;c[d+20>>2]=118;c[d+24>>2]=f;c[d+28>>2]=0;La[c[d+4>>2]&15](b,-1);d=c[p>>2]|0}}else d=0;if((d|0)<=(c[m>>2]|0))while(1){e=h+(f<<8)+(d<<2)|0;q=c[e>>2]|0;if((c[g>>2]|0)!=(((q|0)<0?0:q)|0)){q=c[b>>2]|0;c[q+20>>2]=118;c[q+24>>2]=f;c[q+28>>2]=d;La[c[q+4>>2]&15](b,-1)}c[e>>2]=c[j>>2];if((d|0)<(c[m>>2]|0))d=d+1|0;else break}k=k+1|0;d=c[l>>2]|0}while((k|0)<(d|0))}else g=b+420|0;e=(c[p>>2]|0)==0;f=n+4|0;if(!(c[g>>2]|0))if(e){c[f>>2]=14;break}else{c[f>>2]=15;break}else if(e){c[f>>2]=16;break}else{c[f>>2]=17;break}}else{if((e?(c[b+420>>2]|0)==0:0)?(c[b+424>>2]|0)==0:0){q=c[b+416>>2]|0;if((q|0)<64?(q|0)!=(c[b+436>>2]|0):0)k=35}else k=35;if((k|0)==35){q=c[b>>2]|0;c[q+20>>2]=125;La[c[q+4>>2]&15](b,-1)}c[n+4>>2]=18;d=b+340|0;l=d;d=c[d>>2]|0}while(0);if((d|0)>0){g=b+4|0;h=b+436|0;i=b+420|0;j=0;do{f=c[b+344+(j<<2)>>2]|0;if(c[o>>2]|0)if(!(c[p>>2]|0))if(!(c[i>>2]|0))k=42;else k=48;else k=49;else k=42;if((k|0)==42){k=0;d=c[f+20>>2]|0;if(d>>>0>15){q=c[b>>2]|0;c[q+20>>2]=50;c[q+24>>2]=d;Ka[c[q>>2]&63](b)}e=n+60+(d<<2)|0;d=c[e>>2]|0;if(!d){d=Ia[c[c[g>>2]>>2]&7](b,1,64)|0;c[e>>2]=d}e=d+64|0;do{a[d>>0]=0;d=d+1|0}while((d|0)<(e|0));c[n+24+(j<<2)>>2]=0;c[n+40+(j<<2)>>2]=0;if(!(c[o>>2]|0)){if(c[h>>2]|0)k=49}else k=48}if((k|0)==48?(k=0,(c[p>>2]|0)!=0):0)k=49;if((k|0)==49){d=c[f+24>>2]|0;if(d>>>0>15){q=c[b>>2]|0;c[q+20>>2]=50;c[q+24>>2]=d;Ka[c[q>>2]&63](b)}e=n+124+(d<<2)|0;d=c[e>>2]|0;if(!d){d=Ia[c[c[g>>2]>>2]&7](b,1,256)|0;c[e>>2]=d}rf(d|0,0,256)|0}j=j+1|0}while((j|0)<(c[l>>2]|0))}c[n+12>>2]=0;c[n+16>>2]=0;c[n+20>>2]=-16;c[n+56>>2]=c[b+280>>2];return}function Ld(a){a=a|0;return}function Md(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;r=c[a+468>>2]|0;if(c[a+280>>2]|0){g=r+56|0;f=c[g>>2]|0;if(!f){Rd(a);f=c[g>>2]|0}c[g>>2]=f+-1}n=r+20|0;a:do if((c[n>>2]|0)!=-1?(s=a+368|0,(c[s>>2]|0)>0):0){o=a+424|0;q=0;b:while(1){p=c[e+(q<<2)>>2]|0;l=c[a+372+(q<<2)>>2]|0;j=c[(c[a+344+(l<<2)>>2]|0)+20>>2]|0;i=r+60+(j<<2)|0;f=c[i>>2]|0;k=r+40+(l<<2)|0;g=c[k>>2]|0;if(!(Sd(a,f+g|0)|0)){c[k>>2]=0;f=c[r+24+(l<<2)>>2]|0}else{m=Sd(a,f+(g+1)|0)|0;h=f+(g+2+m)|0;f=Sd(a,h)|0;if(f){g=(c[i>>2]|0)+20|0;if(!(Sd(a,g)|0))h=g;else while(1){f=f<<1;if((f|0)==32768)break b;g=g+1|0;if(!(Sd(a,g)|0)){h=g;break}}}else f=0;do if((f|0)>=(1<<(d[a+232+j>>0]|0)>>1|0)){g=m<<2;if((f|0)>(1<<(d[a+248+j>>0]|0)>>1|0)){c[k>>2]=g+12;break}else{c[k>>2]=g+4;break}}else c[k>>2]=0;while(0);h=h+14|0;g=f>>1;if(g)do{k=(Sd(a,h)|0)==0;f=(k?0:g)|f;g=g>>1}while((g|0)!=0);l=r+24+(l<<2)|0;f=(c[l>>2]|0)+((m|0)==0?f+1|0:~f)|0;c[l>>2]=f}b[p>>1]=f<<c[o>>2];q=q+1|0;if((q|0)>=(c[s>>2]|0))break a}e=c[a>>2]|0;c[e+20>>2]=117;La[c[e+4>>2]&15](a,-1);c[n>>2]=-1}while(0);return 1}function Nd(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;h=c[a+468>>2]|0;if(c[a+280>>2]|0){g=h+56|0;f=c[g>>2]|0;if(!f){Rd(a);f=c[g>>2]|0}c[g>>2]=f+-1}q=h+20|0;a:do if((c[q>>2]|0)!=-1){p=c[a+432>>2]|0;m=c[e>>2]|0;l=c[(c[a+344>>2]|0)+24>>2]|0;n=h+124+(l<<2)|0;o=a+416|0;j=h+188|0;k=a+424|0;l=a+264+l|0;f=(c[a+412>>2]|0)+-1|0;b:while(1){g=(c[n>>2]|0)+(f*3|0)|0;if(Sd(a,g)|0)break a;while(1){e=f;f=f+1|0;if(Sd(a,g+1|0)|0)break;if((f|0)>=(c[o>>2]|0)){f=10;break b}else g=g+3|0}i=Sd(a,j)|0;h=g+2|0;g=Sd(a,h)|0;if(g){if(Sd(a,h)|0){g=g<<1;e=(c[n>>2]|0)+((e|0)<(d[l>>0]|0|0)?189:217)|0;if(Sd(a,e)|0)do{g=g<<1;if((g|0)==32768){f=15;break b}e=e+1|0}while((Sd(a,e)|0)!=0)}else e=h;h=e+14|0;e=g>>1;if(e)do{r=(Sd(a,h)|0)==0;g=(r?0:e)|g;e=e>>1}while((e|0)!=0)}else g=0;b[m+(c[p+(f<<2)>>2]<<1)>>1]=((i|0)==0?g+1|0:~g)<<c[k>>2];if((f|0)>=(c[o>>2]|0))break a}if((f|0)==10){r=c[a>>2]|0;c[r+20>>2]=117;La[c[r+4>>2]&15](a,-1);c[q>>2]=-1;break}else if((f|0)==15){r=c[a>>2]|0;c[r+20>>2]=117;La[c[r+4>>2]&15](a,-1);c[q>>2]=-1;break}}while(0);return 1}function Od(a,d){a=a|0;d=d|0;var f=0,g=0,h=0,i=0,j=0;g=c[a+468>>2]|0;if(c[a+280>>2]|0){h=g+56|0;f=c[h>>2]|0;if(!f){Rd(a);f=c[h>>2]|0}c[h>>2]=f+-1}f=g+188|0;g=1<<c[a+424>>2];h=a+368|0;if((c[h>>2]|0)>0){i=0;do{if(Sd(a,f)|0){j=c[d+(i<<2)>>2]|0;b[j>>1]=e[j>>1]|0|g}i=i+1|0}while((i|0)<(c[h>>2]|0))}return 1}function Pd(a,d){a=a|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;g=c[a+468>>2]|0;if(c[a+280>>2]|0){f=g+56|0;e=c[f>>2]|0;if(!e){Rd(a);e=c[f>>2]|0}c[f>>2]=e+-1}q=g+20|0;a:do if((c[q>>2]|0)!=-1){r=c[a+432>>2]|0;m=c[d>>2]|0;f=c[(c[a+344>>2]|0)+24>>2]|0;o=c[a+424>>2]|0;n=1<<o;o=-1<<o;p=a+416|0;e=c[p>>2]|0;while(1){if(b[m+(c[r+(e<<2)>>2]<<1)>>1]|0)break;e=e+-1|0;if(!e){e=0;break}}l=g+124+(f<<2)|0;i=g+188|0;j=n&65535;k=o&65535;f=(c[a+412>>2]|0)+-1|0;b:while(1){d=(c[l>>2]|0)+(f*3|0)|0;if((f|0)>=(e|0)?(Sd(a,d)|0)!=0:0)break a;else g=d;while(1){f=f+1|0;d=m+(c[r+(f<<2)>>2]<<1)|0;if(b[d>>1]|0){h=13;break}if(Sd(a,g+1|0)|0){h=18;break}if((f|0)>=(c[p>>2]|0))break b;else g=g+3|0}do if((h|0)==13){if(Sd(a,g+2|0)|0){h=b[d>>1]|0;g=h<<16>>16;if(h<<16>>16<0){b[d>>1]=g+o;break}else{b[d>>1]=g+n;break}}}else if((h|0)==18)if(!(Sd(a,i)|0)){b[d>>1]=j;break}else{b[d>>1]=k;break}while(0);if((f|0)>=(c[p>>2]|0))break a}r=c[a>>2]|0;c[r+20>>2]=117;La[c[r+4>>2]&15](a,-1);c[q>>2]=-1}while(0);return 1}function Qd(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;t=c[a+468>>2]|0;if(c[a+280>>2]|0){g=t+56|0;f=c[g>>2]|0;if(!f){Rd(a);f=c[g>>2]|0}c[g>>2]=f+-1}s=t+20|0;a:do if((c[s>>2]|0)!=-1?(u=c[a+432>>2]|0,v=a+368|0,(c[v>>2]|0)>0):0){o=a+436|0;p=t+188|0;r=0;b:while(1){q=c[e+(r<<2)>>2]|0;l=c[a+372+(r<<2)>>2]|0;n=c[a+344+(l<<2)>>2]|0;j=c[n+20>>2]|0;i=t+60+(j<<2)|0;f=c[i>>2]|0;k=t+40+(l<<2)|0;g=c[k>>2]|0;if(!(Sd(a,f+g|0)|0)){c[k>>2]=0;f=c[t+24+(l<<2)>>2]|0}else{m=Sd(a,f+(g+1)|0)|0;h=f+(g+2+m)|0;f=Sd(a,h)|0;if(f){g=(c[i>>2]|0)+20|0;if(!(Sd(a,g)|0))h=g;else while(1){f=f<<1;if((f|0)==32768){f=13;break b}g=g+1|0;if(!(Sd(a,g)|0)){h=g;break}}}else f=0;do if((f|0)>=(1<<(d[a+232+j>>0]|0)>>1|0)){g=m<<2;if((f|0)>(1<<(d[a+248+j>>0]|0)>>1|0)){c[k>>2]=g+12;break}else{c[k>>2]=g+4;break}}else c[k>>2]=0;while(0);h=h+14|0;g=f>>1;if(g)do{k=(Sd(a,h)|0)==0;f=(k?0:g)|f;g=g>>1}while((g|0)!=0);l=t+24+(l<<2)|0;f=(c[l>>2]|0)+((m|0)==0?f+1|0:~f)|0;c[l>>2]=f}b[q>>1]=f;c:do if(c[o>>2]|0){l=c[n+24>>2]|0;k=t+124+(l<<2)|0;l=a+264+l|0;f=0;do{g=(c[k>>2]|0)+(f*3|0)|0;if(Sd(a,g)|0)break c;while(1){h=f;f=f+1|0;if(Sd(a,g+1|0)|0)break;if((f|0)>=(c[o>>2]|0)){f=28;break b}else g=g+3|0}j=Sd(a,p)|0;i=g+2|0;g=Sd(a,i)|0;if(g){if(Sd(a,i)|0){g=g<<1;h=(c[k>>2]|0)+((h|0)<(d[l>>0]|0|0)?189:217)|0;if(Sd(a,h)|0)do{g=g<<1;if((g|0)==32768){f=33;break b}h=h+1|0}while((Sd(a,h)|0)!=0)}else h=i;i=h+14|0;h=g>>1;if(h)do{n=(Sd(a,i)|0)==0;g=(n?0:h)|g;h=h>>1}while((h|0)!=0)}else g=0;b[q+(c[u+(f<<2)>>2]<<1)>>1]=(j|0)==0?g+1|0:g^65535}while((f|0)<(c[o>>2]|0))}while(0);r=r+1|0;if((r|0)>=(c[v>>2]|0))break a}if((f|0)==13){e=c[a>>2]|0;c[e+20>>2]=117;La[c[e+4>>2]&15](a,-1);c[s>>2]=-1;break}else if((f|0)==28){e=c[a>>2]|0;c[e+20>>2]=117;La[c[e+4>>2]&15](a,-1);c[s>>2]=-1;break}else if((f|0)==33){e=c[a>>2]|0;c[e+20>>2]=117;La[c[e+4>>2]&15](a,-1);c[s>>2]=-1;break}}while(0);return 1}function Rd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=c[b+468>>2]|0;if(!(Na[c[(c[b+464>>2]|0)+8>>2]&15](b)|0)){n=c[b>>2]|0;c[n+20>>2]=25;Ka[c[n>>2]&63](b)}e=b+340|0;if((c[e>>2]|0)>0){f=b+224|0;g=b+436|0;h=b+412|0;i=b+420|0;k=0;do{j=c[b+344+(k<<2)>>2]|0;if(c[f>>2]|0)if(!(c[h>>2]|0))if(!(c[i>>2]|0))m=8;else m=10;else m=11;else m=8;if((m|0)==8){m=0;l=c[d+60+(c[j+20>>2]<<2)>>2]|0;n=l+64|0;do{a[l>>0]=0;l=l+1|0}while((l|0)<(n|0));c[d+24+(k<<2)>>2]=0;c[d+40+(k<<2)>>2]=0;if(!(c[f>>2]|0)){if(c[g>>2]|0)m=11}else m=10}if((m|0)==10?(m=0,(c[h>>2]|0)!=0):0)m=11;if((m|0)==11)rf(c[d+124+(c[j+24>>2]<<2)>>2]|0,0,256)|0;k=k+1|0}while((k|0)<(c[e>>2]|0))}c[d+12>>2]=0;c[d+16>>2]=0;c[d+20>>2]=-16;c[d+56>>2]=c[b+280>>2];return}function Sd(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;g=c[b+468>>2]|0;m=g+16|0;f=c[m>>2]|0;j=g+20|0;if((f|0)<32768){h=b+440|0;i=g+12|0;g=c[j>>2]|0;while(1){f=g+-1|0;c[j>>2]=f;if((g|0)<1){a:do if(!(c[h>>2]|0)){f=Td(b)|0;if((f|0)==255){b:while(1){f=Td(b)|0;switch(f|0){case 0:{f=255;break a}case 255:break;default:break b}}c[h>>2]=f;f=0}}else f=0;while(0);c[i>>2]=c[i>>2]<<8|f;g=c[j>>2]|0;f=g+8|0;c[j>>2]=f;if((g|0)<-8){f=g+9|0;c[j>>2]=f;if(!f){c[m>>2]=32768;f=0}}}g=c[m>>2]<<1;c[m>>2]=g;if((g|0)<32768)g=f;else{h=g;g=f;break}}}else{h=f;i=g+12|0;g=c[j>>2]|0}f=d[e>>0]|0;j=c[19772+((f&127)<<2)>>2]|0;k=j>>8;l=j>>16;b=h-l|0;c[m>>2]=b;g=b<<g;h=c[i>>2]|0;do if((h|0)<(g|0)){if((b|0)<32768){g=f&128;if((b|0)<(l|0)){a[e>>0]=g^j;f=f^128;break}else{a[e>>0]=g^k;break}}}else{c[i>>2]=h-g;c[m>>2]=l;g=f&128;if((b|0)<(l|0)){a[e>>0]=g^k;break}else{a[e>>0]=g^j;f=f^128;break}}while(0);return f>>7|0}function Td(a){a=a|0;var b=0,e=0,f=0;b=c[a+24>>2]|0;e=b+4|0;if((c[e>>2]|0)==0?(Na[c[b+12>>2]&15](a)|0)==0:0){f=c[a>>2]|0;c[f+20>>2]=25;Ka[c[f>>2]&63](a)}c[e>>2]=(c[e>>2]|0)+-1;f=c[b>>2]|0;c[b>>2]=f+1;return d[f>>0]|0|0}function Ud(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;g=a+4|0;h=Ia[c[c[g>>2]>>2]&7](a,1,112)|0;c[a+452>>2]=h;c[h>>2]=32;c[h+8>>2]=33;if(!b){b=Ia[c[(c[g>>2]|0)+4>>2]&7](a,1,1280)|0;c[h+32>>2]=b;c[h+36>>2]=b+128;c[h+40>>2]=b+256;c[h+44>>2]=b+384;c[h+48>>2]=b+512;c[h+52>>2]=b+640;c[h+56>>2]=b+768;c[h+60>>2]=b+896;c[h+64>>2]=b+1024;c[h+68>>2]=b+1152;if(!(c[a+436>>2]|0))rf(b|0,0,1280)|0;c[h+4>>2]=10;c[h+12>>2]=20;c[h+16>>2]=0}else{d=a+36|0;if((c[d>>2]|0)>0){b=h+72|0;e=0;f=c[a+216>>2]|0;while(1){j=f+12|0;i=c[j>>2]|0;l=c[(c[g>>2]|0)+20>>2]|0;k=Hc(c[f+28>>2]|0,c[f+8>>2]|0)|0;j=Hc(c[f+32>>2]|0,c[j>>2]|0)|0;c[b+(e<<2)>>2]=Ma[l&3](a,1,1,k,j,i)|0;e=e+1|0;if((e|0)>=(c[d>>2]|0))break;else f=f+88|0}}else b=h+72|0;c[h+4>>2]=9;c[h+12>>2]=19;c[h+16>>2]=b}return}function Vd(a){a=a|0;c[a+148>>2]=0;$d(a);return}function Wd(a){a=a|0;c[a+156>>2]=0;return}function Xd(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;C=i;i=i+16|0;A=C;y=c[a+452>>2]|0;z=a+340|0;if((c[z>>2]|0)>0){b=a+4|0;d=a+148|0;e=0;do{v=c[a+344+(e<<2)>>2]|0;x=c[v+12>>2]|0;w=_(x,c[d>>2]|0)|0;c[A+(e<<2)>>2]=Ra[c[(c[b>>2]|0)+32>>2]&3](a,c[y+72+(c[v+4>>2]<<2)>>2]|0,w,x,1)|0;e=e+1|0}while((e|0)<(c[z>>2]|0))}w=y+24|0;b=c[w>>2]|0;s=y+28|0;e=c[s>>2]|0;a:do if((b|0)<(e|0)){x=y+20|0;t=a+360|0;u=a+468|0;v=y+32|0;d=c[x>>2]|0;f=c[t>>2]|0;b:while(1){if(d>>>0<f>>>0){while(1){q=c[z>>2]|0;if((q|0)>0){e=0;r=0;do{m=c[a+344+(r<<2)>>2]|0;k=c[m+56>>2]|0;l=_(k,d)|0;m=c[m+60>>2]|0;if((m|0)>0){n=c[A+(r<<2)>>2]|0;o=(k|0)>0;p=(k|0)>1?k:1;j=0;do{if(o){f=e;g=(c[n+(j+b<<2)>>2]|0)+(l<<7)|0;h=0;while(1){c[y+32+(f<<2)>>2]=g;h=h+1|0;if((h|0)>=(k|0))break;else{f=f+1|0;g=g+128|0}}e=e+p|0}j=j+1|0}while((j|0)<(m|0))}r=r+1|0}while((r|0)<(q|0))}if(!(Qa[c[(c[u>>2]|0)+4>>2]&31](a,v)|0))break b;d=d+1|0;e=c[t>>2]|0;if(d>>>0>=e>>>0){d=e;break}}e=c[s>>2]|0;f=d}c[x>>2]=0;b=b+1|0;if((b|0)>=(e|0)){B=21;break a}else d=0}c[w>>2]=b;c[x>>2]=d;b=0}else B=21;while(0);do if((B|0)==21){A=a+148|0;B=(c[A>>2]|0)+1|0;c[A>>2]=B;if(B>>>0<(c[a+332>>2]|0)>>>0){$d(a);b=3;break}else{Ka[c[(c[a+460>>2]|0)+12>>2]&63](a);b=4;break}}while(0);i=C;return b|0}function Yd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;u=c[a+452>>2]|0;v=a+332|0;w=(c[v>>2]|0)+-1|0;f=a+144|0;g=a+152|0;h=a+460|0;i=a+148|0;x=a+156|0;while(1){d=c[f>>2]|0;e=c[g>>2]|0;if((d|0)>=(e|0)){if((d|0)!=(e|0)){j=6;break}if((c[i>>2]|0)>>>0>(c[x>>2]|0)>>>0){j=6;break}}if(!(Na[c[c[h>>2]>>2]&15](a)|0)){d=0;break}}if((j|0)==6){r=a+36|0;d=c[r>>2]|0;if((d|0)>0){s=a+4|0;t=a+472|0;p=0;q=c[a+216>>2]|0;while(1){if(c[q+52>>2]|0){d=q+12|0;o=c[d>>2]|0;n=_(o,c[x>>2]|0)|0;o=Ra[c[(c[s>>2]|0)+32>>2]&3](a,c[u+72+(p<<2)>>2]|0,n,o,0)|0;if((c[x>>2]|0)>>>0<w>>>0)m=c[d>>2]|0;else{n=c[d>>2]|0;m=((c[q+32>>2]|0)>>>0)%(n>>>0)|0;m=(m|0)==0?n:m}h=c[(c[t>>2]|0)+4+(p<<2)>>2]|0;if((m|0)>0){i=q+28|0;j=q+40|0;k=q+36|0;d=c[i>>2]|0;l=0;n=c[b+(p<<2)>>2]|0;while(1){if(!d)d=0;else{e=0;f=c[o+(l<<2)>>2]|0;g=0;while(1){Ja[h&0](a,q,f,n,g);e=e+1|0;d=c[i>>2]|0;if(e>>>0>=d>>>0)break;else{f=f+128|0;g=(c[k>>2]|0)+g|0}}}l=l+1|0;if((l|0)==(m|0))break;else n=n+(c[j>>2]<<2)|0}}d=c[r>>2]|0}p=p+1|0;if((p|0)>=(d|0))break;else q=q+88|0}}d=(c[x>>2]|0)+1|0;c[x>>2]=d;d=d>>>0<(c[v>>2]|0)>>>0?3:4}return d|0}function Zd(a){a=a|0;return 0}function _d(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;F=c[a+452>>2]|0;H=(c[a+360>>2]|0)+-1|0;K=a+332|0;d=c[K>>2]|0;I=d+-1|0;L=F+24|0;h=c[L>>2]|0;G=F+28|0;f=c[G>>2]|0;do if((h|0)<(f|0)){J=F+20|0;z=a+436|0;A=a+468|0;B=F+32|0;C=a+340|0;D=a+472|0;e=a+148|0;E=a+368|0;g=c[J>>2]|0;d=h;a:while(1){if(g>>>0<=H>>>0){do{if(c[z>>2]|0)rf(c[B>>2]|0,0,c[E>>2]<<7|0)|0;if(!(Qa[c[(c[A>>2]|0)+4>>2]&31](a,B)|0)){e=g;M=10;break a}f=c[C>>2]|0;if((f|0)>0){y=g>>>0<H>>>0;h=0;x=0;do{w=c[a+344+(x<<2)>>2]|0;if(c[w+52>>2]|0){j=c[w+4>>2]|0;q=c[(c[D>>2]|0)+4+(j<<2)>>2]|0;r=w+56|0;s=c[(y?r:w+72|0)>>2]|0;t=w+40|0;u=_(c[w+68>>2]|0,g)|0;v=w+60|0;i=c[v>>2]|0;if((i|0)>0){l=c[t>>2]|0;n=w+76|0;o=(s|0)>0;p=w+36|0;m=o^1;k=l;j=(c[b+(j<<2)>>2]|0)+((_(l,d)|0)<<2)|0;l=0;while(1){if((c[e>>2]|0)>>>0<I>>>0)if(o){f=u;i=0;M=18}else f=k;else if((l+d|0)>=(c[n>>2]|0)|m)f=k;else{f=u;i=0;M=18}if((M|0)==18){while(1){M=0;Ja[q&0](a,w,c[F+32+(i+h<<2)>>2]|0,j,f);i=i+1|0;if((i|0)==(s|0))break;else{f=(c[p>>2]|0)+f|0;M=18}}f=c[t>>2]|0;i=c[v>>2]|0}h=(c[r>>2]|0)+h|0;l=l+1|0;if((l|0)>=(i|0))break;else{k=f;j=j+(f<<2)|0}}f=c[C>>2]|0}}else h=(c[w+64>>2]|0)+h|0;x=x+1|0}while((x|0)<(f|0))}g=g+1|0}while(g>>>0<=H>>>0);f=c[G>>2]|0}c[J>>2]=0;d=d+1|0;if((d|0)>=(f|0)){M=26;break}else g=0}if((M|0)==10){c[L>>2]=d;c[J>>2]=e;d=0;break}else if((M|0)==26){d=c[K>>2]|0;M=27;break}}else{e=a+148|0;M=27}while(0);do if((M|0)==27){M=a+156|0;c[M>>2]=(c[M>>2]|0)+1;M=(c[e>>2]|0)+1|0;c[e>>2]=M;if(M>>>0<d>>>0){$d(a);d=3;break}else{Ka[c[(c[a+460>>2]|0)+12>>2]&63](a);d=4;break}}while(0);return d|0}function $d(a){a=a|0;var b=0,d=0;b=c[a+452>>2]|0;do if((c[a+340>>2]|0)<=1){d=c[a+344>>2]|0;if((c[a+148>>2]|0)>>>0<((c[a+332>>2]|0)+-1|0)>>>0){c[b+28>>2]=c[d+12>>2];break}else{c[b+28>>2]=c[d+76>>2];break}}else c[b+28>>2]=1;while(0);c[b+20>>2]=0;c[b+24>>2]=0;return}function ae(a){a=a|0;var b=0,d=0,e=0,f=0;b=a+4|0;f=Ia[c[c[b>>2]>>2]&7](a,1,220)|0;c[a+468>>2]=f;c[f>>2]=34;c[f+8>>2]=35;if(!(c[a+224>>2]|0)){c[f+84>>2]=0;c[f+68>>2]=0;c[f+88>>2]=0;c[f+72>>2]=0;c[f+92>>2]=0;c[f+76>>2]=0;c[f+96>>2]=0;c[f+80>>2]=0}else{e=a+36|0;d=Ia[c[c[b>>2]>>2]&7](a,1,c[e>>2]<<8)|0;c[a+160>>2]=d;if((c[e>>2]|0)>0){b=0;do{rf(d+(b<<8)|0,-1,256)|0;b=b+1|0}while((b|0)<(c[e>>2]|0))}f=f+48|0;c[f>>2]=0;c[f+4>>2]=0;c[f+8>>2]=0;c[f+12>>2]=0}return}function be(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;n=c[a+468>>2]|0;m=a+412|0;f=c[m>>2]|0;d=(f|0)==0;if(!(c[a+224>>2]|0)){if((d?(c[a+420>>2]|0)==0:0)?(c[a+424>>2]|0)==0:0){m=c[a+416>>2]|0;if((c[a+220>>2]|0)!=0|(m|0)<64?(m|0)!=(c[a+436>>2]|0):0)e=44}else e=44;if((e|0)==44){m=c[a>>2]|0;c[m+20>>2]=125;La[c[m+4>>2]&15](a,-1)}g=a+436|0;c[n+4>>2]=(c[g>>2]|0)==63?26:25;b=a+340|0;if((c[b>>2]|0)>0){e=0;do{d=c[a+344+(e<<2)>>2]|0;m=c[d+20>>2]|0;he(a,1,m,n+68+(m<<2)|0);if(c[g>>2]|0){m=c[d+24>>2]|0;he(a,0,m,n+84+(m<<2)|0)}c[n+24+(e<<2)>>2]=0;e=e+1|0}while((e|0)<(c[b>>2]|0))}d=a+368|0;if((c[d>>2]|0)>0){f=0;do{b=c[a+344+(c[a+372+(f<<2)>>2]<<2)>>2]|0;c[n+100+(f<<2)>>2]=c[n+68+(c[b+20>>2]<<2)>>2];c[n+140+(f<<2)>>2]=c[n+84+(c[b+24>>2]<<2)>>2];a:do if(!(c[b+52>>2]|0))c[n+180+(f<<2)>>2]=0;else{e=c[b+40>>2]|0;b=c[b+36>>2]|0;switch(c[g>>2]|0){case 0:{c[n+180+(f<<2)>>2]=1;break a}case 3:{l=e+-1|0;m=b+-1|0;c[n+180+(f<<2)>>2]=(c[18896+((l>>>0>1?1:l)<<3)+((m>>>0>1?1:m)<<2)>>2]|0)+1;break a}case 8:{l=e+-1|0;m=b+-1|0;c[n+180+(f<<2)>>2]=(c[18912+((l>>>0>2?2:l)*12|0)+((m>>>0>2?2:m)<<2)>>2]|0)+1;break a}case 15:{l=e+-1|0;m=b+-1|0;c[n+180+(f<<2)>>2]=(c[18948+((l>>>0>3?3:l)<<4)+((m>>>0>3?3:m)<<2)>>2]|0)+1;break a}case 24:{l=e+-1|0;m=b+-1|0;c[n+180+(f<<2)>>2]=(c[19012+((l>>>0>4?4:l)*20|0)+((m>>>0>4?4:m)<<2)>>2]|0)+1;break a}case 35:{l=e+-1|0;m=b+-1|0;c[n+180+(f<<2)>>2]=(c[19112+((l>>>0>5?5:l)*24|0)+((m>>>0>5?5:m)<<2)>>2]|0)+1;break a}case 48:{l=e+-1|0;m=b+-1|0;c[n+180+(f<<2)>>2]=(c[19256+((l>>>0>6?6:l)*28|0)+((m>>>0>6?6:m)<<2)>>2]|0)+1;break a}default:{l=e+-1|0;m=b+-1|0;c[n+180+(f<<2)>>2]=(c[19452+((l>>>0>7?7:l)<<5)+((m>>>0>7?7:m)<<2)>>2]|0)+1;break a}}}while(0);f=f+1|0}while((f|0)<(c[d>>2]|0))}}else{k=a+416|0;b=c[k>>2]|0;if(d)if(!b)e=7;else e=11;else if(((b|0)>=(f|0)?(b|0)<=(c[a+436>>2]|0):0)?(c[a+340>>2]|0)==1:0)e=7;else e=11;do if((e|0)==7){b=c[a+420>>2]|0;if(b){b=b+-1|0;if((b|0)!=(c[a+424>>2]|0)){e=11;break}}else b=c[a+424>>2]|0;if((b|0)>13)e=11}while(0);if((e|0)==11){l=c[a>>2]|0;c[l+20>>2]=17;c[l+24>>2]=f;c[l+28>>2]=c[k>>2];c[l+32>>2]=c[a+420>>2];c[l+36>>2]=c[a+424>>2];Ka[c[l>>2]&63](a)}l=a+340|0;b=c[l>>2]|0;if((b|0)>0){h=a+160|0;g=a+420|0;i=a+424|0;j=0;do{e=c[(c[a+344+(j<<2)>>2]|0)+4>>2]|0;f=c[h>>2]|0;b=c[m>>2]|0;if(b){if((c[f+(e<<8)>>2]|0)<0){b=c[a>>2]|0;c[b+20>>2]=118;c[b+24>>2]=e;c[b+28>>2]=0;La[c[b+4>>2]&15](a,-1);b=c[m>>2]|0}}else b=0;if((b|0)<=(c[k>>2]|0))while(1){d=f+(e<<8)+(b<<2)|0;o=c[d>>2]|0;if((c[g>>2]|0)!=(((o|0)<0?0:o)|0)){o=c[a>>2]|0;c[o+20>>2]=118;c[o+24>>2]=e;c[o+28>>2]=b;La[c[o+4>>2]&15](a,-1)}c[d>>2]=c[i>>2];if((b|0)<(c[k>>2]|0))b=b+1|0;else break}j=j+1|0;b=c[l>>2]|0}while((j|0)<(b|0))}else g=a+420|0;f=c[m>>2]|0;d=(f|0)==0;e=n+4|0;do if(!(c[g>>2]|0))if(d){c[e>>2]=21;break}else{c[e>>2]=22;break}else if(d){c[e>>2]=23;break}else{c[e>>2]=24;break}while(0);b:do if((b|0)>0){e=n+64|0;b=0;while(1){d=c[a+344+(b<<2)>>2]|0;if(!f){if(!(c[g>>2]|0)){o=c[d+20>>2]|0;he(a,1,o,n+48+(o<<2)|0)}}else{k=c[d+24>>2]|0;o=n+48+(k<<2)|0;he(a,0,k,o);c[e>>2]=c[o>>2]}c[n+24+(b<<2)>>2]=0;b=b+1|0;if((b|0)>=(c[l>>2]|0))break b;f=c[m>>2]|0}}while(0);c[n+20>>2]=0}c[n+16>>2]=0;c[n+12>>2]=0;c[n+40>>2]=0;c[n+44>>2]=c[a+280>>2];return}function ce(a){a=a|0;var b=0;b=(c[a+468>>2]|0)+16|0;a=(c[a+464>>2]|0)+24|0;c[a>>2]=(c[a>>2]|0)+((c[b>>2]|0)/8|0);c[b>>2]=0;return}function de(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;B=i;i=i+48|0;u=B+20|0;A=B;w=c[a+468>>2]|0;s=c[a+424>>2]|0;if(((c[a+280>>2]|0)!=0?(c[w+44>>2]|0)==0:0)?(ke(a)|0)==0:0)f=0;else k=4;a:do if((k|0)==4){if(!(c[w+40>>2]|0)){c[u+16>>2]=a;t=a+24|0;k=c[t>>2]|0;j=c[k>>2]|0;c[u>>2]=j;h=c[k+4>>2]|0;v=u+4|0;c[v>>2]=h;x=w+12|0;f=c[x>>2]|0;y=w+16|0;g=c[y>>2]|0;z=w+20|0;c[A>>2]=c[z>>2];c[A+4>>2]=c[z+4>>2];c[A+8>>2]=c[z+8>>2];c[A+12>>2]=c[z+12>>2];c[A+16>>2]=c[z+16>>2];r=a+368|0;if((c[r>>2]|0)>0){p=u+8|0;q=u+12|0;o=0;do{m=c[e+(o<<2)>>2]|0;n=c[a+372+(o<<2)>>2]|0;l=c[w+48+(c[(c[a+344+(n<<2)>>2]|0)+20>>2]<<2)>>2]|0;if((g|0)<8){if(!(le(u,f,g,0)|0)){f=0;break a}f=c[p>>2]|0;g=c[q>>2]|0;if((g|0)<8){h=1;k=12}else k=10}else k=10;if((k|0)==10){k=0;j=f>>g+-8&255;h=c[l+144+(j<<2)>>2]|0;if(!h){h=9;k=12}else{g=g-h|0;h=d[l+1168+j>>0]|0}}if((k|0)==12){h=me(u,f,g,l,h)|0;if((h|0)<0){f=0;break a}g=c[q>>2]|0;f=c[p>>2]|0}if(!h)h=0;else{if((g|0)<(h|0)){if(!(le(u,f,g,h)|0)){f=0;break a}g=c[q>>2]|0;f=c[p>>2]|0}g=g-h|0;l=c[19708+(h<<2)>>2]|0;k=f>>g&l;h=k-((k|0)>(c[19708+(h+-1<<2)>>2]|0)?0:l)|0}l=A+4+(n<<2)|0;n=(c[l>>2]|0)+h|0;c[l>>2]=n;b[m>>1]=n<<s;o=o+1|0}while((o|0)<(c[r>>2]|0));k=c[t>>2]|0;j=c[u>>2]|0;h=c[v>>2]|0}c[k>>2]=j;c[k+4>>2]=h;c[x>>2]=f;c[y>>2]=g;c[z>>2]=c[A>>2];c[z+4>>2]=c[A+4>>2];c[z+8>>2]=c[A+8>>2];c[z+12>>2]=c[A+12>>2];c[z+16>>2]=c[A+16>>2]}f=w+44|0;c[f>>2]=(c[f>>2]|0)+-1;f=1}while(0);i=B;return f|0}function ee(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;z=i;i=i+32|0;w=z;x=c[a+468>>2]|0;if(((c[a+280>>2]|0)!=0?(c[x+44>>2]|0)==0:0)?(ke(a)|0)==0:0)f=0;else j=4;a:do if((j|0)==4){if(!(c[x+40>>2]|0)){n=c[a+416>>2]|0;o=c[a+424>>2]|0;p=c[a+432>>2]|0;y=x+20|0;f=c[y>>2]|0;if(!f){c[w+16>>2]=a;s=a+24|0;u=c[s>>2]|0;c[w>>2]=c[u>>2];t=w+4|0;c[t>>2]=c[u+4>>2];u=x+12|0;g=c[u>>2]|0;v=x+16|0;h=c[v>>2]|0;l=c[e>>2]|0;m=c[x+64>>2]|0;f=c[a+412>>2]|0;b:do if((f|0)>(n|0))f=0;else{r=w+8|0;q=w+12|0;k=f;c:while(1){if((h|0)<8){if(!(le(w,g,h,0)|0)){f=0;break a}g=c[r>>2]|0;h=c[q>>2]|0;if((h|0)<8){f=1;j=14}else j=12}else j=12;if((j|0)==12){j=0;e=g>>h+-8&255;f=c[m+144+(e<<2)>>2]|0;if(!f){f=9;j=14}else{h=h-f|0;f=d[m+1168+e>>0]|0}}if((j|0)==14){f=me(w,g,h,m,f)|0;if((f|0)<0){f=0;break a}h=c[q>>2]|0;g=c[r>>2]|0}e=f>>4;a=f&15;if(!a){switch(e|0){case 0:{f=0;break b}case 15:break;default:{f=h;break c}}f=k+15|0}else{f=e+k|0;if((h|0)<(a|0)){if(!(le(w,g,h,a)|0)){f=0;break a}h=c[q>>2]|0;g=c[r>>2]|0}h=h-a|0;k=c[19708+(a<<2)>>2]|0;j=g>>h&k;b[l+(c[p+(f<<2)>>2]<<1)>>1]=j-((j|0)>(c[19708+(a+-1<<2)>>2]|0)?0:k)<<o}if((f|0)<(n|0))k=f+1|0;else{f=0;break b}}h=1<<e;if((f|0)<(e|0)){if(!(le(w,g,f,e)|0)){f=0;break a}f=c[q>>2]|0;g=c[r>>2]|0}r=f-e|0;f=h+-1+(g>>r&c[19708+(e<<2)>>2])|0;h=r}while(0);s=c[s>>2]|0;c[s>>2]=c[w>>2];c[s+4>>2]=c[t>>2];c[u>>2]=g;c[v>>2]=h}else f=f+-1|0;c[y>>2]=f}f=x+44|0;c[f>>2]=(c[f>>2]|0)+-1;f=1}while(0);i=z;return f|0}function fe(a,d){a=a|0;d=d|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;s=i;i=i+32|0;o=s;r=c[a+468>>2]|0;if(((c[a+280>>2]|0)!=0?(c[r+44>>2]|0)==0:0)?(ke(a)|0)==0:0)f=0;else g=4;a:do if((g|0)==4){c[o+16>>2]=a;m=a+24|0;k=c[m>>2]|0;j=c[k>>2]|0;c[o>>2]=j;h=c[k+4>>2]|0;n=o+4|0;c[n>>2]=h;p=r+12|0;f=c[p>>2]|0;q=r+16|0;g=c[q>>2]|0;l=1<<c[a+424>>2];a=a+368|0;if((c[a>>2]|0)>0){j=o+8|0;k=o+12|0;h=0;do{if((g|0)<1){if(!(le(o,f,g,1)|0)){f=0;break a}g=c[k>>2]|0;f=c[j>>2]|0}g=g+-1|0;if(1<<g&f){t=c[d+(h<<2)>>2]|0;b[t>>1]=e[t>>1]|0|l}h=h+1|0}while((h|0)<(c[a>>2]|0));k=c[m>>2]|0;j=c[o>>2]|0;h=c[n>>2]|0}c[k>>2]=j;c[k+4>>2]=h;c[p>>2]=f;c[q>>2]=g;f=r+44|0;c[f>>2]=(c[f>>2]|0)+-1;f=1}while(0);i=s;return f|0}function ge(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;H=i;i=i+288|0;G=H;z=H+24|0;A=c[a+468>>2]|0;if(((c[a+280>>2]|0)!=0?(c[A+44>>2]|0)==0:0)?(ke(a)|0)==0:0)e=0;else r=4;a:do if((r|0)==4){do if(!(c[A+40>>2]|0)){s=c[a+416>>2]|0;w=c[a+424>>2]|0;v=1<<w;w=-1<<w;x=c[a+432>>2]|0;c[G+16>>2]=a;B=a+24|0;D=c[B>>2]|0;c[G>>2]=c[D>>2];C=G+4|0;c[C>>2]=c[D+4>>2];D=A+12|0;h=c[D>>2]|0;E=A+16|0;f=c[E>>2]|0;F=A+20|0;g=c[F>>2]|0;y=c[e>>2]|0;m=c[A+64>>2]|0;j=c[a+412>>2]|0;p=G+8|0;q=G+12|0;b:do if(!g){e=0;c:while(1){if((f|0)<8){if(!(le(G,h,f,0)|0))break b;h=c[p>>2]|0;f=c[q>>2]|0;if((f|0)<8){g=1;r=13}else r=11}else r=11;if((r|0)==11){r=0;k=h>>f+-8&255;g=c[m+144+(k<<2)>>2]|0;if(!g){g=9;r=13}else{f=f-g|0;g=d[m+1168+k>>0]|0}}if((r|0)==13){r=0;g=me(G,h,f,m,g)|0;if((g|0)<0)break b;f=c[q>>2]|0;h=c[p>>2]|0}k=g>>4;switch(g&15|0){case 0:{if((k|0)==15){g=h;k=15;l=0}else break c;break}case 1:{r=17;break}default:{r=c[a>>2]|0;c[r+20>>2]=121;La[c[r+4>>2]&15](a,-1);r=17}}if((r|0)==17){r=0;if((f|0)<1){if(!(le(G,h,f,1)|0))break b;f=c[q>>2]|0;h=c[p>>2]|0}l=f+-1|0;f=l;g=h;l=(1<<l&h|0)==0?w:v}h=g;d:while(1){g=y+(c[x+(j<<2)>>2]<<1)|0;do if(!(b[g>>1]|0))if((k|0)<1)break d;else k=k+-1|0;else{if((f|0)<1){if(!(le(G,h,f,1)|0))break b;f=c[q>>2]|0;h=c[p>>2]|0}f=f+-1|0;if((1<<f&h|0)!=0?(n=b[g>>1]|0,o=n<<16>>16,(o&v|0)==0):0)if(n<<16>>16>-1){b[g>>1]=o+v;break}else{b[g>>1]=o+w;break}}while(0);g=j+1|0;if((j|0)<(s|0))j=g;else{j=g;break}}if(l){k=c[x+(j<<2)>>2]|0;b[y+(k<<1)>>1]=l;c[z+(e<<2)>>2]=k;e=e+1|0}if((j|0)<(s|0))j=j+1|0;else{g=0;e=h;r=54;break b}}g=1<<k;if(k){if((f|0)<(k|0)){if(!(le(G,h,f,k)|0))break;f=c[q>>2]|0;h=c[p>>2]|0}f=f-k|0;g=(h>>f&c[19708+(k<<2)>>2])+g|0;if(!g){g=0;e=h;r=54}else r=42}else r=42}else{e=0;r=42}while(0);e:do if((r|0)==42){while(1){k=y+(c[x+(j<<2)>>2]<<1)|0;do if(b[k>>1]|0){if((f|0)<1){if(!(le(G,h,f,1)|0))break e;f=c[q>>2]|0;h=c[p>>2]|0}f=f+-1|0;if((1<<f&h|0)!=0?(t=b[k>>1]|0,u=t<<16>>16,(u&v|0)==0):0)if(t<<16>>16>-1){b[k>>1]=u+v;break}else{b[k>>1]=u+w;break}}while(0);if((j|0)<(s|0))j=j+1|0;else{e=h;break}}g=g+-1|0;r=54}while(0);if((r|0)==54){B=c[B>>2]|0;c[B>>2]=c[G>>2];c[B+4>>2]=c[C>>2];c[D>>2]=e;c[E>>2]=f;c[F>>2]=g;break}if(!e){e=0;break a}while(1){e=e+-1|0;b[y+(c[z+(e<<2)>>2]<<1)>>1]=0;if(!e){e=0;break a}}}while(0);e=A+44|0;c[e>>2]=(c[e>>2]|0)+-1;e=1}while(0);i=H;return e|0}function he(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;u=i;i=i+1296|0;m=u+1028|0;t=u;if(f>>>0>3){s=c[b>>2]|0;c[s+20>>2]=52;c[s+24>>2]=f;Ka[c[s>>2]&63](b)}r=(e|0)!=0;s=c[(r?b+180+(f<<2)|0:b+196+(f<<2)|0)>>2]|0;if(!s){q=c[b>>2]|0;c[q+20>>2]=52;c[q+24>>2]=f;Ka[c[q>>2]&63](b)}e=c[g>>2]|0;if(!e){e=Ia[c[c[b+4>>2]>>2]&7](b,1,1424)|0;c[g>>2]=e;q=b}else q=b;c[e+140>>2]=s;k=1;j=0;while(1){g=a[s+k>>0]|0;h=g&255;f=h+j|0;if((f|0)>256){p=c[b>>2]|0;c[p+20>>2]=9;Ka[c[p>>2]&63](q)}if(!(g<<24>>24))f=j;else rf(m+j|0,k&255|0,h|0)|0;k=k+1|0;if((k|0)==17)break;else j=f}a[m+f>>0]=0;g=a[m>>0]|0;if(!(g<<24>>24)){k=1;j=0}else{k=g;h=0;j=0;l=g<<24>>24;while(1){if((k<<24>>24|0)==(l|0)){g=j;while(1){j=g+1|0;c[t+(g<<2)>>2]=h;h=h+1|0;g=a[m+j>>0]|0;if((g<<24>>24|0)==(l|0))g=j;else break}}else g=k;if((h|0)>=(1<<l|0)){p=c[b>>2]|0;c[p+20>>2]=9;Ka[c[p>>2]&63](q)}if(!(g<<24>>24)){k=1;j=0;break}else{k=g;h=h<<1;l=l+1|0}}}while(1){g=s+k|0;if(!(a[g>>0]|0)){h=-1;g=j}else{c[e+72+(k<<2)>>2]=j-(c[t+(j<<2)>>2]|0);g=(d[g>>0]|0)+j|0;h=c[t+(g+-1<<2)>>2]|0}c[e+(k<<2)>>2]=h;k=k+1|0;if((k|0)==17)break;else j=g}c[e+68>>2]=1048575;rf(e+144|0,0,1024)|0;p=1;g=0;do{l=s+p|0;if(a[l>>0]|0){m=8-p|0;n=1<<m;o=1;while(1){h=s+17+g|0;j=n;k=c[t+(g<<2)>>2]<<m;while(1){c[e+144+(k<<2)>>2]=p;a[e+1168+k>>0]=a[h>>0]|0;if((j|0)>1){j=j+-1|0;k=k+1|0}else break}g=g+1|0;if((o|0)<(d[l>>0]|0))o=o+1|0;else break}}p=p+1|0}while((p|0)!=9);if(r&(f|0)>0){e=0;do{if((d[s+17+e>>0]|0)>15){t=c[b>>2]|0;c[t+20>>2]=9;Ka[c[t>>2]&63](q)}e=e+1|0}while((e|0)!=(f|0))}i=u;return}function ie(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;C=i;i=i+48|0;v=C+20|0;B=C;x=c[a+468>>2]|0;if(((c[a+280>>2]|0)!=0?(c[x+44>>2]|0)==0:0)?(ke(a)|0)==0:0)f=0;else o=4;a:do if((o|0)==4){if(!(c[x+40>>2]|0)){c[v+16>>2]=a;u=a+24|0;j=c[u>>2]|0;k=c[j>>2]|0;c[v>>2]=k;h=c[j+4>>2]|0;w=v+4|0;c[w>>2]=h;y=x+12|0;f=c[y>>2]|0;z=x+16|0;g=c[z>>2]|0;A=x+20|0;c[B>>2]=c[A>>2];c[B+4>>2]=c[A+4>>2];c[B+8>>2]=c[A+8>>2];c[B+12>>2]=c[A+12>>2];c[B+16>>2]=c[A+16>>2];t=a+368|0;if((c[t>>2]|0)>0){r=v+8|0;s=v+12|0;q=0;do{n=c[e+(q<<2)>>2]|0;k=c[x+100+(q<<2)>>2]|0;if((g|0)<8){if(!(le(v,f,g,0)|0)){f=0;break a}f=c[r>>2]|0;g=c[s>>2]|0;if((g|0)<8){h=1;o=12}else o=10}else o=10;if((o|0)==10){o=0;j=f>>g+-8&255;h=c[k+144+(j<<2)>>2]|0;if(!h){h=9;o=12}else{g=g-h|0;h=d[k+1168+j>>0]|0}}if((o|0)==12){h=me(v,f,g,k,h)|0;if((h|0)<0){f=0;break a}g=c[s>>2]|0;f=c[r>>2]|0}p=c[x+140+(q<<2)>>2]|0;m=c[x+180+(q<<2)>>2]|0;j=(h|0)!=0;b:do if(!m)if(j){if((g|0)<(h|0)){if(!(le(v,f,g,h)|0)){f=0;break a}g=c[s>>2]|0;f=c[r>>2]|0}g=g-h|0;k=1;o=42}else{k=1;o=42}else{if(j){if((g|0)<(h|0)){if(!(le(v,f,g,h)|0)){f=0;break a}g=c[s>>2]|0;f=c[r>>2]|0}g=g-h|0;o=c[19708+(h<<2)>>2]|0;l=f>>g&o;h=l-((l|0)>(c[19708+(h+-1<<2)>>2]|0)?0:o)|0}else h=0;l=B+4+(c[a+372+(q<<2)>>2]<<2)|0;o=(c[l>>2]|0)+h|0;c[l>>2]=o;b[n>>1]=o;if((m|0)>1){l=1;while(1){if((g|0)<8){if(!(le(v,f,g,0)|0)){f=0;break a}f=c[r>>2]|0;g=c[s>>2]|0;if((g|0)<8){h=1;o=26}else o=24}else o=24;if((o|0)==24){o=0;j=f>>g+-8&255;h=c[p+144+(j<<2)>>2]|0;if(!h){h=9;o=26}else{g=g-h|0;h=d[p+1168+j>>0]|0}}if((o|0)==26){o=0;h=me(v,f,g,p,h)|0;if((h|0)<0){f=0;break a}g=c[s>>2]|0;f=c[r>>2]|0}j=h>>4;k=h&15;if(!k){if((j|0)!=15)break b;h=l+15|0}else{h=j+l|0;if((g|0)<(k|0)){if(!(le(v,f,g,k)|0)){f=0;break a}g=c[s>>2]|0;f=c[r>>2]|0}g=g-k|0;l=c[19708+(k<<2)>>2]|0;j=f>>g&l;b[n+(c[17620+(h<<2)>>2]<<1)>>1]=j-((j|0)>(c[19708+(k+-1<<2)>>2]|0)?0:l)}h=h+1|0;if((h|0)<(m|0))l=h;else break}if((h|0)<64){k=h;o=42}}else{k=1;o=42}}while(0);c:do if((o|0)==42)while(1){if((g|0)<8){if(!(le(v,f,g,0)|0)){f=0;break a}f=c[r>>2]|0;g=c[s>>2]|0;if((g|0)<8){h=1;o=47}else o=45}else o=45;if((o|0)==45){o=0;j=f>>g+-8&255;h=c[p+144+(j<<2)>>2]|0;if(!h){h=9;o=47}else{g=g-h|0;h=d[p+1168+j>>0]|0}}if((o|0)==47){h=me(v,f,g,p,h)|0;if((h|0)<0){f=0;break a}g=c[s>>2]|0;f=c[r>>2]|0}j=h>>4;h=h&15;if(!h)if((j|0)==15)j=15;else break c;else{if((g|0)<(h|0)){if(!(le(v,f,g,h)|0)){f=0;break a}g=c[s>>2]|0;f=c[r>>2]|0}g=g-h|0}k=k+1+j|0;if((k|0)>=64)break;else o=42}while(0);q=q+1|0}while((q|0)<(c[t>>2]|0));j=c[u>>2]|0;k=c[v>>2]|0;h=c[w>>2]|0}c[j>>2]=k;c[j+4>>2]=h;c[y>>2]=f;c[z>>2]=g;c[A>>2]=c[B>>2];c[A+4>>2]=c[B+4>>2];c[A+8>>2]=c[B+8>>2];c[A+12>>2]=c[B+12>>2];c[A+16>>2]=c[B+16>>2]}f=x+44|0;c[f>>2]=(c[f>>2]|0)+-1;f=1}while(0);i=C;return f|0}function je(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;D=i;i=i+48|0;w=D+20|0;C=D;y=c[a+468>>2]|0;if(((c[a+280>>2]|0)!=0?(c[y+44>>2]|0)==0:0)?(ke(a)|0)==0:0)f=0;else m=4;a:do if((m|0)==4){if(!(c[y+40>>2]|0)){s=c[a+432>>2]|0;t=c[a+436>>2]|0;c[w+16>>2]=a;v=a+24|0;k=c[v>>2]|0;j=c[k>>2]|0;c[w>>2]=j;h=c[k+4>>2]|0;x=w+4|0;c[x>>2]=h;z=y+12|0;f=c[z>>2]|0;A=y+16|0;g=c[A>>2]|0;B=y+20|0;c[C>>2]=c[B>>2];c[C+4>>2]=c[B+4>>2];c[C+8>>2]=c[B+8>>2];c[C+12>>2]=c[B+12>>2];c[C+16>>2]=c[B+16>>2];u=a+368|0;if((c[u>>2]|0)>0){q=w+8|0;r=w+12|0;p=0;do{n=c[e+(p<<2)>>2]|0;k=c[y+100+(p<<2)>>2]|0;if((g|0)<8){if(!(le(w,f,g,0)|0)){f=0;break a}f=c[q>>2]|0;g=c[r>>2]|0;if((g|0)<8){h=1;m=12}else m=10}else m=10;if((m|0)==10){m=0;j=f>>g+-8&255;h=c[k+144+(j<<2)>>2]|0;if(!h){h=9;m=12}else{g=g-h|0;h=d[k+1168+j>>0]|0}}if((m|0)==12){h=me(w,f,g,k,h)|0;if((h|0)<0){f=0;break a}g=c[r>>2]|0;f=c[q>>2]|0}o=c[y+140+(p<<2)>>2]|0;l=c[y+180+(p<<2)>>2]|0;j=(h|0)!=0;b:do if(!l)if(j){if((g|0)<(h|0)){if(!(le(w,f,g,h)|0)){f=0;break a}g=c[r>>2]|0;f=c[q>>2]|0}g=g-h|0;h=1;m=41}else{h=1;m=41}else{if(j){if((g|0)<(h|0)){if(!(le(w,f,g,h)|0)){f=0;break a}g=c[r>>2]|0;f=c[q>>2]|0}g=g-h|0;m=c[19708+(h<<2)>>2]|0;k=f>>g&m;h=k-((k|0)>(c[19708+(h+-1<<2)>>2]|0)?0:m)|0}else h=0;k=C+4+(c[a+372+(p<<2)>>2]<<2)|0;m=(c[k>>2]|0)+h|0;c[k>>2]=m;b[n>>1]=m;if((l|0)>1){h=1;while(1){if((g|0)<8){if(!(le(w,f,g,0)|0)){f=0;break a}f=c[q>>2]|0;g=c[r>>2]|0;if((g|0)<8){j=1;m=26}else m=24}else m=24;if((m|0)==24){m=0;k=f>>g+-8&255;j=c[o+144+(k<<2)>>2]|0;if(!j){j=9;m=26}else{g=g-j|0;j=d[o+1168+k>>0]|0}}if((m|0)==26){m=0;j=me(w,f,g,o,j)|0;if((j|0)<0){f=0;break a}g=c[r>>2]|0;f=c[q>>2]|0}k=j>>4;j=j&15;if(!j){if((k|0)!=15)break b;h=h+15|0}else{h=k+h|0;if((g|0)<(j|0)){if(!(le(w,f,g,j)|0)){f=0;break a}g=c[r>>2]|0;f=c[q>>2]|0}g=g-j|0;m=c[19708+(j<<2)>>2]|0;k=f>>g&m;b[n+(c[s+(h<<2)>>2]<<1)>>1]=k-((k|0)>(c[19708+(j+-1<<2)>>2]|0)?0:m)}h=h+1|0;if((h|0)>=(l|0)){m=41;break}}}else{h=1;m=41}}while(0);c:do if((m|0)==41)if((h|0)<=(t|0)){k=h;do{if((g|0)<8){if(!(le(w,f,g,0)|0)){f=0;break a}f=c[q>>2]|0;g=c[r>>2]|0;if((g|0)<8){h=1;m=47}else m=45}else m=45;if((m|0)==45){m=0;j=f>>g+-8&255;h=c[o+144+(j<<2)>>2]|0;if(!h){h=9;m=47}else{g=g-h|0;h=d[o+1168+j>>0]|0}}if((m|0)==47){h=me(w,f,g,o,h)|0;if((h|0)<0){f=0;break a}g=c[r>>2]|0;f=c[q>>2]|0}j=h>>4;h=h&15;if(!h)if((j|0)==15)j=15;else break c;else{if((g|0)<(h|0)){if(!(le(w,f,g,h)|0)){f=0;break a}g=c[r>>2]|0;f=c[q>>2]|0}g=g-h|0}k=k+1+j|0}while((k|0)<=(t|0))}while(0);p=p+1|0}while((p|0)<(c[u>>2]|0));k=c[v>>2]|0;j=c[w>>2]|0;h=c[x>>2]|0}c[k>>2]=j;c[k+4>>2]=h;c[z>>2]=f;c[A>>2]=g;c[B>>2]=c[C>>2];c[B+4>>2]=c[C+4>>2];c[B+8>>2]=c[C+8>>2];c[B+12>>2]=c[C+12>>2];c[B+16>>2]=c[C+16>>2]}f=y+44|0;c[f>>2]=(c[f>>2]|0)+-1;f=1}while(0);i=D;return f|0}function ke(a){a=a|0;var b=0,d=0,e=0,f=0;b=c[a+468>>2]|0;d=b+16|0;e=c[a+464>>2]|0;f=e+24|0;c[f>>2]=(c[f>>2]|0)+((c[d>>2]|0)/8|0);c[d>>2]=0;if(Na[c[e+8>>2]&15](a)|0){d=a+340|0;if((c[d>>2]|0)>0){e=0;do{c[b+24+(e<<2)>>2]=0;e=e+1|0}while((e|0)<(c[d>>2]|0))}c[b+20>>2]=0;c[b+44>>2]=c[a+280>>2];if(!(c[a+440>>2]|0)){c[b+40>>2]=0;b=1}else b=1}else b=0;return b|0}function le(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;g=c[b>>2]|0;o=b+4|0;h=c[o>>2]|0;n=c[b+16>>2]|0;l=n+440|0;a:do if(!(c[l>>2]|0))if((e|0)<25){k=n+24|0;b:while(1){if(!h){if(!(Na[c[(c[k>>2]|0)+12>>2]&15](n)|0)){g=0;break a}g=c[k>>2]|0;h=c[g+4>>2]|0;g=c[g>>2]|0}h=h+-1|0;j=g+1|0;i=a[g>>0]|0;g=i&255;c:do if(i<<24>>24==-1){g=j;while(1){if(!h){if(!(Na[c[(c[k>>2]|0)+12>>2]&15](n)|0)){g=0;break a}i=c[k>>2]|0;h=c[i+4>>2]|0;i=c[i>>2]|0}else i=g;j=h+-1|0;g=i+1|0;h=a[i>>0]|0;switch(h<<24>>24){case 0:{h=j;i=255;break c}case -1:{h=j;break}default:{i=j;break b}}}}else{i=g;g=j}while(0);d=i|d<<8;e=e+8|0;if((e|0)>=25){m=18;break a}}c[l>>2]=h&255;m=14}else m=18;else{i=h;m=14}while(0);if((m|0)==14)if((e|0)<(f|0)){h=n+468|0;if(!(c[(c[h>>2]|0)+40>>2]|0)){m=c[n>>2]|0;c[m+20>>2]=120;La[c[m+4>>2]&15](n,-1);c[(c[h>>2]|0)+40>>2]=1}d=d<<25-e;e=25;h=i;m=18}else{h=i;m=18}if((m|0)==18){c[b>>2]=g;c[o>>2]=h;c[b+8>>2]=d;c[b+12>>2]=e;g=1}return g|0}function me(a,b,e,f,g){a=a|0;b=b|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0;if((e|0)<(g|0))if(!(le(a,b,e,g)|0))e=-1;else{b=c[a+8>>2]|0;e=c[a+12>>2]|0;h=4}else h=4;a:do if((h|0)==4){e=e-g|0;h=b>>e&c[19708+(g<<2)>>2];i=a+8|0;j=a+12|0;if((h|0)>(c[f+(g<<2)>>2]|0))do{h=h<<1;if((e|0)<1){if(!(le(a,b,e,1)|0)){e=-1;break a}b=c[i>>2]|0;e=c[j>>2]|0}e=e+-1|0;h=b>>>e&1|h;g=g+1|0}while((h|0)>(c[f+(g<<2)>>2]|0));c[i>>2]=b;c[j>>2]=e;if((g|0)>16){e=c[a+16>>2]|0;a=c[e>>2]|0;c[a+20>>2]=121;La[c[a+4>>2]&15](e,-1);e=0;break}else{e=d[(c[f+72+(g<<2)>>2]|0)+h+((c[f+140>>2]|0)+17)>>0]|0;break}}while(0);return e|0}function ne(){var a=0;if(!0)a=20480;else a=c[(ta()|0)+60>>2]|0;return a|0}function oe(b){b=b|0;var c=0,e=0;c=0;while(1){if((d[27005+c>>0]|0)==(b|0)){e=2;break}c=c+1|0;if((c|0)==87){c=87;b=27093;e=5;break}}if((e|0)==2)if(!c)b=27093;else{b=27093;e=5}if((e|0)==5)while(1){e=b;while(1){b=e+1|0;if(!(a[e>>0]|0))break;else e=b}c=c+-1|0;if(!c)break;else e=5}return b|0}function pe(a,b){a=a|0;b=b|0;if(!a)a=0;else a=re(a,b,0)|0;return a|0}function qe(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0;l=i;i=i+16|0;g=l;j=(f|0)==0?20484:f;f=c[j>>2]|0;a:do if(!d)if(!f)f=0;else k=15;else{h=(b|0)==0?g:b;if(!e)f=-2;else{if(!f){f=a[d>>0]|0;g=f&255;if(f<<24>>24>-1){c[h>>2]=g;f=f<<24>>24!=0&1;break}f=g+-194|0;if(f>>>0>50){k=15;break}f=c[20228+(f<<2)>>2]|0;g=e+-1|0;if(g){d=d+1|0;k=9}}else{g=e;k=9}b:do if((k|0)==9){b=a[d>>0]|0;m=(b&255)>>>3;if((m+-16|m+(f>>26))>>>0>7){k=15;break a}while(1){d=d+1|0;f=(b&255)+-128|f<<6;g=g+-1|0;if((f|0)>=0)break;if(!g)break b;b=a[d>>0]|0;if((b&-64)<<24>>24!=-128){k=15;break a}}c[j>>2]=0;c[h>>2]=f;f=e-g|0;break a}while(0);c[j>>2]=f;f=-2}}while(0);if((k|0)==15){c[j>>2]=0;c[(ne()|0)>>2]=84;f=-1}i=l;return f|0}function re(b,d,e){b=b|0;d=d|0;e=e|0;do if(b){if(d>>>0<128){a[b>>0]=d;b=1;break}if(d>>>0<2048){a[b>>0]=d>>>6|192;a[b+1>>0]=d&63|128;b=2;break}if(d>>>0<55296|(d&-8192|0)==57344){a[b>>0]=d>>>12|224;a[b+1>>0]=d>>>6&63|128;a[b+2>>0]=d&63|128;b=3;break}if((d+-65536|0)>>>0<1048576){a[b>>0]=d>>>18|240;a[b+1>>0]=d>>>12&63|128;a[b+2>>0]=d>>>6&63|128;a[b+3>>0]=d&63|128;b=4;break}else{c[(ne()|0)>>2]=84;b=-1;break}}else b=1;while(0);return b|0}function se(a){a=a|0;if(!a)a=1;else a=(c[a>>2]|0)==0;return a&1|0}function te(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;g=d;do if(!((g^b)&3)){f=(e|0)!=0;a:do if(f&(g&3|0)!=0)while(1){g=a[d>>0]|0;a[b>>0]=g;if(!(g<<24>>24))break a;e=e+-1|0;d=d+1|0;b=b+1|0;f=(e|0)!=0;if(!(f&(d&3|0)!=0)){h=5;break}}else h=5;while(0);if((h|0)==5)if(!f){e=0;break}if(a[d>>0]|0){b:do if(e>>>0>3)do{f=c[d>>2]|0;if((f&-2139062144^-2139062144)&f+-16843009)break b;c[b>>2]=f;e=e+-4|0;d=d+4|0;b=b+4|0}while(e>>>0>3);while(0);h=11}}else h=11;while(0);c:do if((h|0)==11)if(!e)e=0;else while(1){h=a[d>>0]|0;a[b>>0]=h;if(!(h<<24>>24))break c;e=e+-1|0;b=b+1|0;if(!e){e=0;break}else d=d+1|0}while(0);rf(b|0,0,e|0)|0;return b|0}function ue(a,b,c){a=a|0;b=b|0;c=c|0;te(a,b,c)|0;return a|0}function ve(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;h=d&255;f=(e|0)!=0;a:do if(f&(b&3|0)!=0){g=d&255;while(1){if((a[b>>0]|0)==g<<24>>24){i=6;break a}b=b+1|0;e=e+-1|0;f=(e|0)!=0;if(!(f&(b&3|0)!=0)){i=5;break}}}else i=5;while(0);if((i|0)==5)if(f)i=6;else e=0;b:do if((i|0)==6){g=d&255;if((a[b>>0]|0)!=g<<24>>24){f=_(h,16843009)|0;c:do if(e>>>0>3)while(1){h=c[b>>2]^f;if((h&-2139062144^-2139062144)&h+-16843009)break;b=b+4|0;e=e+-4|0;if(e>>>0<=3){i=11;break c}}else i=11;while(0);if((i|0)==11)if(!e){e=0;break}while(1){if((a[b>>0]|0)==g<<24>>24)break b;b=b+1|0;e=e+-1|0;if(!e){e=0;break}}}}while(0);return ((e|0)!=0?b:0)|0}function we(a){a=a|0;return ((a|0)==32|(a+-9|0)>>>0<5)&1|0}function xe(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=e+16|0;g=c[f>>2]|0;if(!g)if(!(Oe(e)|0)){g=c[f>>2]|0;h=4}else f=0;else h=4;a:do if((h|0)==4){i=e+20|0;h=c[i>>2]|0;if((g-h|0)>>>0<d>>>0){f=Ia[c[e+36>>2]&7](e,b,d)|0;break}b:do if((a[e+75>>0]|0)>-1){f=d;while(1){if(!f){g=h;f=0;break b}g=f+-1|0;if((a[b+g>>0]|0)==10)break;else f=g}if((Ia[c[e+36>>2]&7](e,b,f)|0)>>>0<f>>>0)break a;d=d-f|0;b=b+f|0;g=c[i>>2]|0}else{g=h;f=0}while(0);xf(g|0,b|0,d|0)|0;c[i>>2]=(c[i>>2]|0)+d;f=f+d|0}while(0);return f|0}function ye(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;g=i;i=i+112|0;e=g;f=e;h=f+112|0;do{c[f>>2]=0;f=f+4|0}while((f|0)<(h|0));c[e+32>>2]=7;c[e+44>>2]=a;c[e+76>>2]=-1;c[e+84>>2]=a;h=Ie(e,b,d)|0;i=g;return h|0}function ze(a){a=a|0;var b=0,e=0;e=i;i=i+16|0;b=e;if((c[a+8>>2]|0)==0?(De(a)|0)!=0:0)b=-1;else if((Ia[c[a+32>>2]&7](a,b,1)|0)==1)b=d[b>>0]|0;else b=-1;i=e;return b|0}function Ae(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;i=i+16|0;f=e;c[f>>2]=d;d=Ge(a,b,f)|0;i=e;return d|0}function Be(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;f=i;i=i+32|0;g=f;e=f+20|0;c[g>>2]=c[a+60>>2];c[g+4>>2]=0;c[g+8>>2]=b;c[g+12>>2]=e;c[g+16>>2]=d;if((Ze(Ca(140,g|0)|0)|0)<0){c[e>>2]=-1;a=-1}else a=c[e>>2]|0;i=f;return a|0}function Ce(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0;n=i;i=i+128|0;g=n+112|0;m=n;h=m;j=20488;k=h+112|0;do{c[h>>2]=c[j>>2];h=h+4|0;j=j+4|0}while((h|0)<(k|0));if((d+-1|0)>>>0>2147483646)if(!d){d=1;l=4}else{c[(ne()|0)>>2]=75;d=-1}else{g=b;l=4}if((l|0)==4){l=-2-g|0;l=d>>>0>l>>>0?l:d;c[m+48>>2]=l;b=m+20|0;c[b>>2]=g;c[m+44>>2]=g;d=g+l|0;g=m+16|0;c[g>>2]=d;c[m+28>>2]=d;d=Je(m,e,f)|0;if(l){e=c[b>>2]|0;a[e+(((e|0)==(c[g>>2]|0))<<31>>31)>>0]=0}}i=n;return d|0}function De(b){b=b|0;var d=0,e=0;d=b+74|0;e=a[d>>0]|0;a[d>>0]=e+255|e;d=b+20|0;e=b+44|0;if((c[d>>2]|0)>>>0>(c[e>>2]|0)>>>0)Ia[c[b+36>>2]&7](b,0,0)|0;c[b+16>>2]=0;c[b+28>>2]=0;c[d>>2]=0;d=c[b>>2]|0;if(d&20)if(!(d&4))d=-1;else{c[b>>2]=d|32;d=-1}else{d=c[e>>2]|0;c[b+8>>2]=d;c[b+4>>2]=d;d=0}return d|0}function Ee(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=a+84|0;g=c[e>>2]|0;h=d+256|0;f=ve(g,0,h)|0;f=(f|0)==0?h:f-g|0;d=f>>>0<d>>>0?f:d;xf(b|0,g|0,d|0)|0;c[a+4>>2]=g+d;b=g+f|0;c[a+8>>2]=b;c[e>>2]=b;return d|0}function Fe(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;i=i+16|0;f=e;c[f>>2]=d;d=Je(a,b,f)|0;i=e;return d|0}function Ge(a,b,c){a=a|0;b=b|0;c=c|0;return Ce(a,2147483647,b,c)|0}function He(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;i=i+16|0;f=e;c[f>>2]=d;d=ye(a,b,f)|0;i=e;return d|0}function Ie(e,f,j){e=e|0;f=f|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0.0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0;P=i;i=i+304|0;H=P+16|0;J=P+8|0;I=P+33|0;K=P;y=P+32|0;if((c[e+76>>2]|0)>-1)O=Ke(e)|0;else O=0;k=a[f>>0]|0;a:do if(k<<24>>24){L=e+4|0;M=e+100|0;G=e+108|0;z=e+8|0;A=I+10|0;B=I+33|0;D=J+4|0;E=I+46|0;F=I+94|0;m=k;k=0;n=f;s=0;l=0;f=0;b:while(1){c:do if(!(we(m&255)|0)){m=(a[n>>0]|0)==37;d:do if(m){q=n+1|0;o=a[q>>0]|0;e:do switch(o<<24>>24){case 37:break d;case 42:{x=0;o=n+2|0;break}default:{o=(o&255)+-48|0;if(o>>>0<10?(a[n+2>>0]|0)==36:0){c[H>>2]=c[j>>2];while(1){x=(c[H>>2]|0)+(4-1)&~(4-1);m=c[x>>2]|0;c[H>>2]=x+4;if(o>>>0>1)o=o+-1|0;else break}x=m;o=n+3|0;break e}o=(c[j>>2]|0)+(4-1)&~(4-1);x=c[o>>2]|0;c[j>>2]=o+4;o=q}}while(0);m=a[o>>0]|0;n=m&255;if((n+-48|0)>>>0<10){m=0;while(1){q=(m*10|0)+-48+n|0;o=o+1|0;m=a[o>>0]|0;n=m&255;if((n+-48|0)>>>0>=10)break;else m=q}}else q=0;if(m<<24>>24==109){o=o+1|0;r=a[o>>0]|0;m=(x|0)!=0&1;l=0;f=0}else{r=m;m=0}n=o+1|0;switch(r&255|0){case 104:{w=(a[n>>0]|0)==104;n=w?o+2|0:n;o=w?-2:-1;break}case 108:{w=(a[n>>0]|0)==108;n=w?o+2|0:n;o=w?3:1;break}case 106:{o=3;break}case 116:case 122:{o=1;break}case 76:{o=2;break}case 110:case 112:case 67:case 83:case 91:case 99:case 115:case 88:case 71:case 70:case 69:case 65:case 103:case 102:case 101:case 97:case 120:case 117:case 111:case 105:case 100:{n=o;o=0;break}default:{N=152;break b}}r=d[n>>0]|0;t=(r&47|0)==3;r=t?r|32:r;t=t?1:o;switch(r|0){case 99:{w=s;v=(q|0)<1?1:q;break}case 91:{w=s;v=q;break}case 110:{if(!x){o=s;break c}switch(t|0){case -2:{a[x>>0]=s;o=s;break c}case -1:{b[x>>1]=s;o=s;break c}case 0:{c[x>>2]=s;o=s;break c}case 1:{c[x>>2]=s;o=s;break c}case 3:{o=x;c[o>>2]=s;c[o+4>>2]=((s|0)<0)<<31>>31;o=s;break c}default:{o=s;break c}}}default:{_e(e,0);do{o=c[L>>2]|0;if(o>>>0<(c[M>>2]|0)>>>0){c[L>>2]=o+1;o=d[o>>0]|0}else o=$e(e)|0}while((we(o)|0)!=0);o=c[L>>2]|0;if(c[M>>2]|0){o=o+-1|0;c[L>>2]=o}w=(c[G>>2]|0)+s+o-(c[z>>2]|0)|0;v=q}}_e(e,v);o=c[L>>2]|0;q=c[M>>2]|0;if(o>>>0<q>>>0)c[L>>2]=o+1;else{if(($e(e)|0)<0){N=152;break b}q=c[M>>2]|0}if(q)c[L>>2]=(c[L>>2]|0)+-1;f:do switch(r|0){case 91:case 99:case 115:{u=(r|0)==99;g:do if((r&239|0)==99){rf(I|0,-1,257)|0;a[I>>0]=0;if((r|0)==115){a[B>>0]=0;a[A>>0]=0;a[A+1>>0]=0;a[A+2>>0]=0;a[A+3>>0]=0;a[A+4>>0]=0}}else{Q=n+1|0;s=(a[Q>>0]|0)==94;o=s&1;r=s?Q:n;n=s?n+2|0:Q;rf(I|0,s&1|0,257)|0;a[I>>0]=0;switch(a[n>>0]|0){case 45:{s=(o^1)&255;a[E>>0]=s;n=r+2|0;break}case 93:{s=(o^1)&255;a[F>>0]=s;n=r+2|0;break}default:s=(o^1)&255}while(1){o=a[n>>0]|0;h:do switch(o<<24>>24){case 0:{N=152;break b}case 93:break g;case 45:{r=n+1|0;o=a[r>>0]|0;switch(o<<24>>24){case 93:case 0:{o=45;break h}default:{}}n=a[n+-1>>0]|0;if((n&255)<(o&255)){n=n&255;do{n=n+1|0;a[I+n>>0]=s;o=a[r>>0]|0}while((n|0)<(o&255|0));n=r}else n=r;break}default:{}}while(0);a[I+((o&255)+1)>>0]=s;n=n+1|0}}while(0);r=u?v+1|0:31;s=(t|0)==1;t=(m|0)!=0;i:do if(s){if(t){f=jf(r<<2)|0;if(!f){l=0;N=152;break b}}else f=x;c[J>>2]=0;c[D>>2]=0;l=0;j:while(1){q=(f|0)==0;do{k:while(1){o=c[L>>2]|0;if(o>>>0<(c[M>>2]|0)>>>0){c[L>>2]=o+1;o=d[o>>0]|0}else o=$e(e)|0;if(!(a[I+(o+1)>>0]|0))break j;a[y>>0]=o;switch(qe(K,y,1,J)|0){case -1:{l=0;N=152;break b}case -2:break;default:break k}}if(!q){c[f+(l<<2)>>2]=c[K>>2];l=l+1|0}}while(!(t&(l|0)==(r|0)));l=r<<1|1;o=mf(f,l<<2)|0;if(!o){l=0;N=152;break b}Q=r;r=l;f=o;l=Q}if(!(se(J)|0)){l=0;N=152;break b}else{q=l;l=0}}else{if(t){l=jf(r)|0;if(!l){l=0;f=0;N=152;break b}else o=0;while(1){do{f=c[L>>2]|0;if(f>>>0<(c[M>>2]|0)>>>0){c[L>>2]=f+1;f=d[f>>0]|0}else f=$e(e)|0;if(!(a[I+(f+1)>>0]|0)){q=o;f=0;break i}a[l+o>>0]=f;o=o+1|0}while((o|0)!=(r|0));f=r<<1|1;o=mf(l,f)|0;if(!o){f=0;N=152;break b}else{Q=r;r=f;l=o;o=Q}}}if(!x){l=q;while(1){f=c[L>>2]|0;if(f>>>0<l>>>0){c[L>>2]=f+1;f=d[f>>0]|0}else f=$e(e)|0;if(!(a[I+(f+1)>>0]|0)){q=0;l=0;f=0;break i}l=c[M>>2]|0}}else{l=0;while(1){f=c[L>>2]|0;if(f>>>0<q>>>0){c[L>>2]=f+1;f=d[f>>0]|0}else f=$e(e)|0;if(!(a[I+(f+1)>>0]|0)){q=l;l=x;f=0;break i}a[x+l>>0]=f;q=c[M>>2]|0;l=l+1|0}}}while(0);o=c[L>>2]|0;if(c[M>>2]|0){o=o+-1|0;c[L>>2]=o}o=o-(c[z>>2]|0)+(c[G>>2]|0)|0;if(!o)break b;if(!((o|0)==(v|0)|u^1))break b;do if(t)if(s){c[x>>2]=f;break}else{c[x>>2]=l;break}while(0);if(!u){if(f)c[f+(q<<2)>>2]=0;if(!l){l=0;break f}a[l+q>>0]=0}break}case 120:case 88:case 112:{o=16;N=134;break}case 111:{o=8;N=134;break}case 117:case 100:{o=10;N=134;break}case 105:{o=0;N=134;break}case 71:case 103:case 70:case 102:case 69:case 101:case 65:case 97:{p=+Ye(e,t,0);if((c[G>>2]|0)==((c[z>>2]|0)-(c[L>>2]|0)|0))break b;if(x)switch(t|0){case 0:{g[x>>2]=p;break f}case 1:{h[x>>3]=p;break f}case 2:{h[x>>3]=p;break f}default:break f}break}default:{}}while(0);l:do if((N|0)==134){N=0;o=Xe(e,o,0,-1,-1)|0;if((c[G>>2]|0)==((c[z>>2]|0)-(c[L>>2]|0)|0))break b;if((x|0)!=0&(r|0)==112){c[x>>2]=o;break}if(x)switch(t|0){case -2:{a[x>>0]=o;break l}case -1:{b[x>>1]=o;break l}case 0:{c[x>>2]=o;break l}case 1:{c[x>>2]=o;break l}case 3:{Q=x;c[Q>>2]=o;c[Q+4>>2]=C;break l}default:break l}}while(0);k=((x|0)!=0&1)+k|0;o=(c[G>>2]|0)+w+(c[L>>2]|0)-(c[z>>2]|0)|0;break c}while(0);n=n+(m&1)|0;_e(e,0);m=c[L>>2]|0;if(m>>>0<(c[M>>2]|0)>>>0){c[L>>2]=m+1;m=d[m>>0]|0}else m=$e(e)|0;if((m|0)!=(d[n>>0]|0)){N=21;break b}o=s+1|0}else{while(1){m=n+1|0;if(!(we(d[m>>0]|0)|0))break;else n=m}_e(e,0);do{m=c[L>>2]|0;if(m>>>0<(c[M>>2]|0)>>>0){c[L>>2]=m+1;m=d[m>>0]|0}else m=$e(e)|0}while((we(m)|0)!=0);m=c[L>>2]|0;if(c[M>>2]|0){m=m+-1|0;c[L>>2]=m}o=(c[G>>2]|0)+s+m-(c[z>>2]|0)|0}while(0);n=n+1|0;m=a[n>>0]|0;if(!(m<<24>>24))break a;else s=o}if((N|0)==21){if(c[M>>2]|0)c[L>>2]=(c[L>>2]|0)+-1;if((k|0)!=0|(m|0)>-1)break;else{k=0;N=153}}else if((N|0)==152)if(!k){k=m;N=153}if((N|0)==153){m=k;k=-1}if(m){kf(l);kf(f)}}else k=0;while(0);if(O)Le(e);i=P;return k|0}function Je(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;s=i;i=i+224|0;o=s+80|0;r=s+96|0;q=s;p=s+136|0;f=r;g=f+40|0;do{c[f>>2]=0;f=f+4|0}while((f|0)<(g|0));c[o>>2]=c[e>>2];if((bf(0,d,o,q,r)|0)<0)e=-1;else{if((c[b+76>>2]|0)>-1)m=Ke(b)|0;else m=0;e=c[b>>2]|0;n=e&32;if((a[b+74>>0]|0)<1)c[b>>2]=e&-33;e=b+48|0;if(!(c[e>>2]|0)){g=b+44|0;h=c[g>>2]|0;c[g>>2]=p;j=b+28|0;c[j>>2]=p;k=b+20|0;c[k>>2]=p;c[e>>2]=80;l=b+16|0;c[l>>2]=p+80;f=bf(b,d,o,q,r)|0;if(h){Ia[c[b+36>>2]&7](b,0,0)|0;f=(c[k>>2]|0)==0?-1:f;c[g>>2]=h;c[e>>2]=0;c[l>>2]=0;c[j>>2]=0;c[k>>2]=0}}else f=bf(b,d,o,q,r)|0;e=c[b>>2]|0;c[b>>2]=e|n;if(m)Le(b);e=(e&32|0)==0?f:-1}i=s;return e|0}function Ke(a){a=a|0;return 0}function Le(a){a=a|0;return}function Me(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;q=i;i=i+48|0;n=q+16|0;m=q;e=q+32|0;o=a+28|0;f=c[o>>2]|0;c[e>>2]=f;p=a+20|0;f=(c[p>>2]|0)-f|0;c[e+4>>2]=f;c[e+8>>2]=b;c[e+12>>2]=d;k=a+60|0;l=a+44|0;b=2;f=f+d|0;while(1){if(!(c[5109]|0)){c[n>>2]=c[k>>2];c[n+4>>2]=e;c[n+8>>2]=b;h=Ze(Ga(146,n|0)|0)|0}else{Aa(36,a|0);c[m>>2]=c[k>>2];c[m+4>>2]=e;c[m+8>>2]=b;h=Ze(Ga(146,m|0)|0)|0;oa(0)}if((f|0)==(h|0)){f=6;break}if((h|0)<0){f=8;break}f=f-h|0;g=c[e+4>>2]|0;if(h>>>0<=g>>>0)if((b|0)==2){c[o>>2]=(c[o>>2]|0)+h;j=g;b=2}else j=g;else{j=c[l>>2]|0;c[o>>2]=j;c[p>>2]=j;j=c[e+12>>2]|0;h=h-g|0;e=e+8|0;b=b+-1|0}c[e>>2]=(c[e>>2]|0)+h;c[e+4>>2]=j-h}if((f|0)==6){n=c[l>>2]|0;c[a+16>>2]=n+(c[a+48>>2]|0);a=n;c[o>>2]=a;c[p>>2]=a}else if((f|0)==8){c[a+16>>2]=0;c[o>>2]=0;c[p>>2]=0;c[a>>2]=c[a>>2]|32;if((b|0)==2)d=0;else d=d-(c[e+4>>2]|0)|0}i=q;return d|0}function Ne(a){a=a|0;var b=0,d=0;b=i;i=i+16|0;d=b;c[d>>2]=c[a+60>>2];a=Ze(ua(6,d|0)|0)|0;i=b;return a|0}function Oe(b){b=b|0;var d=0,e=0;d=b+74|0;e=a[d>>0]|0;a[d>>0]=e+255|e;d=c[b>>2]|0;if(!(d&8)){c[b+8>>2]=0;c[b+4>>2]=0;d=c[b+44>>2]|0;c[b+28>>2]=d;c[b+20>>2]=d;c[b+16>>2]=d+(c[b+48>>2]|0);d=0}else{c[b>>2]=d|32;d=-1}return d|0}function Pe(a,b){a=+a;b=b|0;return +(+Se(a,b))}function Qe(a,b){a=+a;b=+b;return +(+We(a,b))}function Re(a,b){a=+a;b=b|0;return +(+Ve(a,b))}function Se(a,b){a=+a;b=b|0;var d=0,e=0,f=0;h[k>>3]=a;d=c[k>>2]|0;e=c[k+4>>2]|0;f=vf(d|0,e|0,52)|0;f=f&2047;switch(f|0){case 0:{if(a!=0.0){a=+Se(a*18446744073709551616.0,b);d=(c[b>>2]|0)+-64|0}else d=0;c[b>>2]=d;break}case 2047:break;default:{c[b>>2]=f+-1022;c[k>>2]=d;c[k+4>>2]=e&-2146435073|1071644672;a=+h[k>>3]}}return +a}function Te(a,b){a=+a;b=+b;var d=0,e=0,f=0,g=0,i=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0;h[k>>3]=a;d=c[k>>2]|0;m=c[k+4>>2]|0;h[k>>3]=b;n=c[k>>2]|0;o=c[k+4>>2]|0;e=vf(d|0,m|0,52)|0;e=e&2047;j=vf(n|0,o|0,52)|0;j=j&2047;p=m&-2147483648;i=sf(n|0,o|0,1)|0;l=C;a:do if(!((i|0)==0&(l|0)==0)?(g=o&2147483647,!(g>>>0>2146435072|(g|0)==2146435072&n>>>0>0|(e|0)==2047)):0){f=sf(d|0,m|0,1)|0;g=C;if(!(g>>>0>l>>>0|(g|0)==(l|0)&f>>>0>i>>>0))return +((f|0)==(i|0)&(g|0)==(l|0)?a*0.0:a);if(!e){e=sf(d|0,m|0,12)|0;f=C;if((f|0)>-1|(f|0)==-1&e>>>0>4294967295){g=e;e=0;do{e=e+-1|0;g=sf(g|0,f|0,1)|0;f=C}while((f|0)>-1|(f|0)==-1&g>>>0>4294967295)}else e=0;d=sf(d|0,m|0,1-e|0)|0;f=C}else f=m&1048575|1048576;if(!j){g=sf(n|0,o|0,12)|0;i=C;if((i|0)>-1|(i|0)==-1&g>>>0>4294967295){j=0;do{j=j+-1|0;g=sf(g|0,i|0,1)|0;i=C}while((i|0)>-1|(i|0)==-1&g>>>0>4294967295)}else j=0;n=sf(n|0,o|0,1-j|0)|0;m=C}else m=o&1048575|1048576;l=qf(d|0,f|0,n|0,m|0)|0;i=C;g=(i|0)>-1|(i|0)==-1&l>>>0>4294967295;b:do if((e|0)>(j|0)){while(1){if(g)if((d|0)==(n|0)&(f|0)==(m|0))break;else{d=l;f=i}d=sf(d|0,f|0,1)|0;f=C;e=e+-1|0;l=qf(d|0,f|0,n|0,m|0)|0;i=C;g=(i|0)>-1|(i|0)==-1&l>>>0>4294967295;if((e|0)<=(j|0))break b}b=a*0.0;break a}while(0);if(g)if((d|0)==(n|0)&(f|0)==(m|0)){b=a*0.0;break}else{f=i;d=l}if(f>>>0<1048576|(f|0)==1048576&d>>>0<0)do{d=sf(d|0,f|0,1)|0;f=C;e=e+-1|0}while(f>>>0<1048576|(f|0)==1048576&d>>>0<0);if((e|0)>0){o=tf(d|0,f|0,0,-1048576)|0;d=C;e=sf(e|0,0,52)|0;d=d|C;e=o|e}else{e=vf(d|0,f|0,1-e|0)|0;d=C}c[k>>2]=e;c[k+4>>2]=d|p;b=+h[k>>3]}else q=3;while(0);if((q|0)==3){b=a*b;b=b/b}return +b}function Ue(a,b){a=+a;b=+b;return +(+Te(a,b))}function Ve(a,b){a=+a;b=b|0;var d=0;if((b|0)>1023){a=a*8988465674311579538646525.0e283;d=b+-1023|0;if((d|0)>1023){d=b+-2046|0;d=(d|0)>1023?1023:d;a=a*8988465674311579538646525.0e283}}else if((b|0)<-1022){a=a*2.2250738585072014e-308;d=b+1022|0;if((d|0)<-1022){d=b+2044|0;d=(d|0)<-1022?-1022:d;a=a*2.2250738585072014e-308}}else d=b;d=sf(d+1023|0,0,52)|0;b=C;c[k>>2]=d;c[k+4>>2]=b;return +(a*+h[k>>3])}function We(a,b){a=+a;b=+b;var d=0,e=0;h[k>>3]=a;e=c[k>>2]|0;d=c[k+4>>2]|0;h[k>>3]=b;d=c[k+4>>2]&-2147483648|d&2147483647;c[k>>2]=e;c[k+4>>2]=d;return +(+h[k>>3])}function Xe(b,e,f,g,h){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;a:do if(e>>>0>36){c[(ne()|0)>>2]=22;h=0;g=0}else{r=b+4|0;q=b+100|0;do{i=c[r>>2]|0;if(i>>>0<(c[q>>2]|0)>>>0){c[r>>2]=i+1;i=d[i>>0]|0}else i=$e(b)|0}while((we(i)|0)!=0);b:do switch(i|0){case 43:case 45:{j=((i|0)==45)<<31>>31;i=c[r>>2]|0;if(i>>>0<(c[q>>2]|0)>>>0){c[r>>2]=i+1;i=d[i>>0]|0;p=j;break b}else{i=$e(b)|0;p=j;break b}}default:p=0}while(0);j=(e|0)==0;do if((e&-17|0)==0&(i|0)==48){i=c[r>>2]|0;if(i>>>0<(c[q>>2]|0)>>>0){c[r>>2]=i+1;i=d[i>>0]|0}else i=$e(b)|0;if((i|32|0)!=120)if(j){e=8;n=46;break}else{n=32;break}e=c[r>>2]|0;if(e>>>0<(c[q>>2]|0)>>>0){c[r>>2]=e+1;i=d[e>>0]|0}else i=$e(b)|0;if((d[28897+(i+1)>>0]|0)>15){g=(c[q>>2]|0)==0;if(!g)c[r>>2]=(c[r>>2]|0)+-1;if(!f){_e(b,0);h=0;g=0;break a}if(g){h=0;g=0;break a}c[r>>2]=(c[r>>2]|0)+-1;h=0;g=0;break a}else{e=16;n=46}}else{e=j?10:e;if((d[28897+(i+1)>>0]|0)>>>0<e>>>0)n=32;else{if(c[q>>2]|0)c[r>>2]=(c[r>>2]|0)+-1;_e(b,0);c[(ne()|0)>>2]=22;h=0;g=0;break a}}while(0);if((n|0)==32)if((e|0)==10){e=i+-48|0;if(e>>>0<10){i=0;while(1){j=(i*10|0)+e|0;e=c[r>>2]|0;if(e>>>0<(c[q>>2]|0)>>>0){c[r>>2]=e+1;i=d[e>>0]|0}else i=$e(b)|0;e=i+-48|0;if(!(e>>>0<10&j>>>0<429496729)){e=j;break}else i=j}j=0}else{e=0;j=0}f=i+-48|0;if(f>>>0<10){while(1){k=Df(e|0,j|0,10,0)|0;l=C;m=((f|0)<0)<<31>>31;o=~m;if(l>>>0>o>>>0|(l|0)==(o|0)&k>>>0>~f>>>0){k=e;break}e=tf(k|0,l|0,f|0,m|0)|0;j=C;i=c[r>>2]|0;if(i>>>0<(c[q>>2]|0)>>>0){c[r>>2]=i+1;i=d[i>>0]|0}else i=$e(b)|0;f=i+-48|0;if(!(f>>>0<10&(j>>>0<429496729|(j|0)==429496729&e>>>0<2576980378))){k=e;break}}if(f>>>0>9){i=k;e=p}else{e=10;n=72}}else{i=e;e=p}}else n=46;c:do if((n|0)==46){if(!(e+-1&e)){n=a[29154+((e*23|0)>>>5&7)>>0]|0;j=a[28897+(i+1)>>0]|0;f=j&255;if(f>>>0<e>>>0){i=0;while(1){k=f|i<<n;i=c[r>>2]|0;if(i>>>0<(c[q>>2]|0)>>>0){c[r>>2]=i+1;i=d[i>>0]|0}else i=$e(b)|0;j=a[28897+(i+1)>>0]|0;f=j&255;if(!(k>>>0<134217728&f>>>0<e>>>0))break;else i=k}f=0}else{f=0;k=0}l=vf(-1,-1,n|0)|0;m=C;if((j&255)>>>0>=e>>>0|(f>>>0>m>>>0|(f|0)==(m|0)&k>>>0>l>>>0)){j=f;n=72;break}else i=f;while(1){k=sf(k|0,i|0,n|0)|0;f=C;k=j&255|k;i=c[r>>2]|0;if(i>>>0<(c[q>>2]|0)>>>0){c[r>>2]=i+1;i=d[i>>0]|0}else i=$e(b)|0;j=a[28897+(i+1)>>0]|0;if((j&255)>>>0>=e>>>0|(f>>>0>m>>>0|(f|0)==(m|0)&k>>>0>l>>>0)){j=f;n=72;break c}else i=f}}j=a[28897+(i+1)>>0]|0;f=j&255;if(f>>>0<e>>>0){i=0;while(1){k=f+(_(i,e)|0)|0;i=c[r>>2]|0;if(i>>>0<(c[q>>2]|0)>>>0){c[r>>2]=i+1;i=d[i>>0]|0}else i=$e(b)|0;j=a[28897+(i+1)>>0]|0;f=j&255;if(!(k>>>0<119304647&f>>>0<e>>>0))break;else i=k}f=0}else{k=0;f=0}if((j&255)>>>0<e>>>0){n=Ef(-1,-1,e|0,0)|0;o=C;m=f;while(1){if(m>>>0>o>>>0|(m|0)==(o|0)&k>>>0>n>>>0){j=m;n=72;break c}f=Df(k|0,m|0,e|0,0)|0;l=C;j=j&255;if(l>>>0>4294967295|(l|0)==-1&f>>>0>~j>>>0){j=m;n=72;break c}k=tf(j|0,0,f|0,l|0)|0;f=C;i=c[r>>2]|0;if(i>>>0<(c[q>>2]|0)>>>0){c[r>>2]=i+1;i=d[i>>0]|0}else i=$e(b)|0;j=a[28897+(i+1)>>0]|0;if((j&255)>>>0>=e>>>0){j=f;n=72;break}else m=f}}else{j=f;n=72}}while(0);if((n|0)==72)if((d[28897+(i+1)>>0]|0)>>>0<e>>>0){do{i=c[r>>2]|0;if(i>>>0<(c[q>>2]|0)>>>0){c[r>>2]=i+1;i=d[i>>0]|0}else i=$e(b)|0}while((d[28897+(i+1)>>0]|0)>>>0<e>>>0);c[(ne()|0)>>2]=34;j=h;i=g;e=(g&1|0)==0&0==0?p:0}else{i=k;e=p}if(c[q>>2]|0)c[r>>2]=(c[r>>2]|0)+-1;if(!(j>>>0<h>>>0|(j|0)==(h|0)&i>>>0<g>>>0)){if(!((g&1|0)!=0|0!=0|(e|0)!=0)){c[(ne()|0)>>2]=34;g=tf(g|0,h|0,-1,-1)|0;h=C;break}if(j>>>0>h>>>0|(j|0)==(h|0)&i>>>0>g>>>0){c[(ne()|0)>>2]=34;break}}g=((e|0)<0)<<31>>31;g=qf(i^e|0,j^g|0,e|0,g|0)|0;h=C}while(0);C=h;return g|0}function Ye(b,e,f){b=b|0;e=e|0;f=f|0;var g=0.0,h=0,j=0.0,k=0,l=0,m=0.0,n=0,o=0,p=0,q=0.0,t=0.0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0.0;L=i;i=i+512|0;H=L;switch(e|0){case 0:{K=24;J=-149;A=4;break}case 1:{K=53;J=-1074;A=4;break}case 2:{K=53;J=-1074;A=4;break}default:g=0.0}a:do if((A|0)==4){E=b+4|0;D=b+100|0;do{e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0}else e=$e(b)|0}while((we(e)|0)!=0);b:do switch(e|0){case 43:case 45:{h=1-(((e|0)==45&1)<<1)|0;e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0;I=h;break b}else{e=$e(b)|0;I=h;break b}}default:I=1}while(0);h=e;e=0;do{if((h|32|0)!=(a[29163+e>>0]|0))break;do if(e>>>0<7){h=c[E>>2]|0;if(h>>>0<(c[D>>2]|0)>>>0){c[E>>2]=h+1;h=d[h>>0]|0;break}else{h=$e(b)|0;break}}while(0);e=e+1|0}while(e>>>0<8);c:do switch(e|0){case 8:break;case 3:{A=23;break}default:{k=(f|0)!=0;if(k&e>>>0>3)if((e|0)==8)break c;else{A=23;break c}d:do if(!e){e=0;do{if((h|32|0)!=(a[29704+e>>0]|0))break d;do if(e>>>0<2){h=c[E>>2]|0;if(h>>>0<(c[D>>2]|0)>>>0){c[E>>2]=h+1;h=d[h>>0]|0;break}else{h=$e(b)|0;break}}while(0);e=e+1|0}while(e>>>0<3)}while(0);switch(e|0){case 3:{e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0}else e=$e(b)|0;if((e|0)==40)e=1;else{if(!(c[D>>2]|0)){g=r;break a}c[E>>2]=(c[E>>2]|0)+-1;g=r;break a}while(1){h=c[E>>2]|0;if(h>>>0<(c[D>>2]|0)>>>0){c[E>>2]=h+1;h=d[h>>0]|0}else h=$e(b)|0;if(!((h+-48|0)>>>0<10|(h+-65|0)>>>0<26)?!((h|0)==95|(h+-97|0)>>>0<26):0)break;e=e+1|0}if((h|0)==41){g=r;break a}h=(c[D>>2]|0)==0;if(!h)c[E>>2]=(c[E>>2]|0)+-1;if(!k){c[(ne()|0)>>2]=22;_e(b,0);g=0.0;break a}if(!e){g=r;break a}while(1){e=e+-1|0;if(!h)c[E>>2]=(c[E>>2]|0)+-1;if(!e){g=r;break a}}}case 0:{do if((h|0)==48){e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0}else e=$e(b)|0;if((e|32|0)!=120){if(!(c[D>>2]|0)){e=48;break}c[E>>2]=(c[E>>2]|0)+-1;e=48;break}e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0;k=0}else{e=$e(b)|0;k=0}e:while(1){switch(e|0){case 46:{A=74;break e}case 48:break;default:{y=0;l=0;x=0;h=0;n=k;o=0;w=0;m=1.0;k=0;g=0.0;break e}}e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0;k=1;continue}else{e=$e(b)|0;k=1;continue}}if((A|0)==74){e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0}else e=$e(b)|0;if((e|0)==48){k=0;h=0;do{e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0}else e=$e(b)|0;k=tf(k|0,h|0,-1,-1)|0;h=C}while((e|0)==48);y=0;l=0;x=k;n=1;o=1;w=0;m=1.0;k=0;g=0.0}else{y=0;l=0;x=0;h=0;n=k;o=1;w=0;m=1.0;k=0;g=0.0}}while(1){u=e+-48|0;p=e|32;if(u>>>0>=10){v=(e|0)==46;if(!(v|(p+-97|0)>>>0<6)){p=x;u=y;break}if(v)if(!o){v=l;h=y;u=y;o=1;p=w;j=m}else{p=x;u=y;e=46;break}else A=86}else A=86;if((A|0)==86){A=0;e=(e|0)>57?p+-87|0:u;do if(!((y|0)<0|(y|0)==0&l>>>0<8)){if((y|0)<0|(y|0)==0&l>>>0<14){t=m*.0625;p=w;j=t;g=g+t*+(e|0);break}if((w|0)!=0|(e|0)==0){p=w;j=m}else{p=1;j=m;g=g+m*.5}}else{p=w;j=m;k=e+(k<<4)|0}while(0);l=tf(l|0,y|0,1,0)|0;v=x;u=C;n=1}e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;y=u;x=v;e=d[e>>0]|0;w=p;m=j;continue}else{y=u;x=v;e=$e(b)|0;w=p;m=j;continue}}if(!n){e=(c[D>>2]|0)==0;if(!e)c[E>>2]=(c[E>>2]|0)+-1;if(f){if(!e?(z=c[E>>2]|0,c[E>>2]=z+-1,(o|0)!=0):0)c[E>>2]=z+-2}else _e(b,0);g=+(I|0)*0.0;break a}n=(o|0)==0;o=n?l:p;n=n?u:h;if((u|0)<0|(u|0)==0&l>>>0<8){h=u;do{k=k<<4;l=tf(l|0,h|0,1,0)|0;h=C}while((h|0)<0|(h|0)==0&l>>>0<8)}if((e|32|0)==112){h=df(b,f)|0;e=C;if((h|0)==0&(e|0)==-2147483648){if(!f){_e(b,0);g=0.0;break a}if(!(c[D>>2]|0)){h=0;e=0}else{c[E>>2]=(c[E>>2]|0)+-1;h=0;e=0}}}else if(!(c[D>>2]|0)){h=0;e=0}else{c[E>>2]=(c[E>>2]|0)+-1;h=0;e=0}H=sf(o|0,n|0,2)|0;H=tf(H|0,C|0,-32,-1)|0;e=tf(H|0,C|0,h|0,e|0)|0;h=C;if(!k){g=+(I|0)*0.0;break a}if((h|0)>0|(h|0)==0&e>>>0>(0-J|0)>>>0){c[(ne()|0)>>2]=34;g=+(I|0)*1797693134862315708145274.0e284*1797693134862315708145274.0e284;break a}H=J+-106|0;G=((H|0)<0)<<31>>31;if((h|0)<(G|0)|(h|0)==(G|0)&e>>>0<H>>>0){c[(ne()|0)>>2]=34;g=+(I|0)*2.2250738585072014e-308*2.2250738585072014e-308;break a}if((k|0)>-1){do{G=!(g>=.5);H=G&1|k<<1;k=H^1;g=g+(G?g:g+-1.0);e=tf(e|0,h|0,-1,-1)|0;h=C}while((H|0)>-1);l=e;m=g}else{l=e;m=g}e=qf(32,0,J|0,((J|0)<0)<<31>>31|0)|0;e=tf(l|0,h|0,e|0,C|0)|0;J=C;if(0>(J|0)|0==(J|0)&K>>>0>e>>>0)if((e|0)<0){e=0;A=127}else A=125;else{e=K;A=125}if((A|0)==125)if((e|0)<53)A=127;else{h=e;j=+(I|0);g=0.0}if((A|0)==127){g=+(I|0);h=e;j=g;g=+Qe(+Ve(1.0,84-e|0),g)}K=(k&1|0)==0&(m!=0.0&(h|0)<32);g=j*(K?0.0:m)+(g+j*+(((K&1)+k|0)>>>0))-g;if(!(g!=0.0))c[(ne()|0)>>2]=34;g=+Re(g,l);break a}else e=h;while(0);F=J+K|0;G=0-F|0;k=0;f:while(1){switch(e|0){case 46:{A=138;break f}case 48:break;default:{h=0;p=0;o=0;break f}}e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0;k=1;continue}else{e=$e(b)|0;k=1;continue}}if((A|0)==138){e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0}else e=$e(b)|0;if((e|0)==48){h=0;e=0;while(1){h=tf(h|0,e|0,-1,-1)|0;k=C;e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0}else e=$e(b)|0;if((e|0)==48)e=k;else{p=k;k=1;o=1;break}}}else{h=0;p=0;o=1}}c[H>>2]=0;n=e+-48|0;l=(e|0)==46;g:do if(l|n>>>0<10){B=H+496|0;y=0;v=0;w=l;A=p;u=k;z=o;k=0;l=0;o=0;h:while(1){do if(w)if(!z){h=y;p=v;z=1}else{p=A;e=y;n=v;break h}else{w=tf(y|0,v|0,1,0)|0;v=C;x=(e|0)!=48;if((l|0)>=125){if(!x){p=A;y=w;break}c[B>>2]=c[B>>2]|1;p=A;y=w;break}p=H+(l<<2)|0;if(k)n=e+-48+((c[p>>2]|0)*10|0)|0;c[p>>2]=n;k=k+1|0;n=(k|0)==9;p=A;y=w;u=1;k=n?0:k;l=(n&1)+l|0;o=x?w:o}while(0);e=c[E>>2]|0;if(e>>>0<(c[D>>2]|0)>>>0){c[E>>2]=e+1;e=d[e>>0]|0}else e=$e(b)|0;n=e+-48|0;w=(e|0)==46;if(!(w|n>>>0<10)){n=z;A=161;break g}else A=p}u=(u|0)!=0;A=169}else{y=0;v=0;u=k;n=o;k=0;l=0;o=0;A=161}while(0);do if((A|0)==161){B=(n|0)==0;h=B?y:h;p=B?v:p;u=(u|0)!=0;if(!((e|32|0)==101&u))if((e|0)>-1){e=y;n=v;A=169;break}else{e=y;n=v;A=171;break}n=df(b,f)|0;e=C;if((n|0)==0&(e|0)==-2147483648){if(!f){_e(b,0);g=0.0;break}if(!(c[D>>2]|0)){n=0;e=0}else{c[E>>2]=(c[E>>2]|0)+-1;n=0;e=0}}h=tf(n|0,e|0,h|0,p|0)|0;u=y;p=C;n=v;A=173}while(0);if((A|0)==169)if(c[D>>2]|0){c[E>>2]=(c[E>>2]|0)+-1;if(u){u=e;A=173}else A=172}else A=171;if((A|0)==171)if(u){u=e;A=173}else A=172;do if((A|0)==172){c[(ne()|0)>>2]=22;_e(b,0);g=0.0}else if((A|0)==173){e=c[H>>2]|0;if(!e){g=+(I|0)*0.0;break}if(((n|0)<0|(n|0)==0&u>>>0<10)&((h|0)==(u|0)&(p|0)==(n|0))?K>>>0>30|(e>>>K|0)==0:0){g=+(I|0)*+(e>>>0);break}b=(J|0)/-2|0;E=((b|0)<0)<<31>>31;if((p|0)>(E|0)|(p|0)==(E|0)&h>>>0>b>>>0){c[(ne()|0)>>2]=34;g=+(I|0)*1797693134862315708145274.0e284*1797693134862315708145274.0e284;break}b=J+-106|0;E=((b|0)<0)<<31>>31;if((p|0)<(E|0)|(p|0)==(E|0)&h>>>0<b>>>0){c[(ne()|0)>>2]=34;g=+(I|0)*2.2250738585072014e-308*2.2250738585072014e-308;break}if(k){if((k|0)<9){n=H+(l<<2)|0;e=c[n>>2]|0;do{e=e*10|0;k=k+1|0}while((k|0)!=9);c[n>>2]=e}l=l+1|0}if((o|0)<9?(o|0)<=(h|0)&(h|0)<18:0){if((h|0)==9){g=+(I|0)*+((c[H>>2]|0)>>>0);break}if((h|0)<9){g=+(I|0)*+((c[H>>2]|0)>>>0)/+(c[20600+(8-h<<2)>>2]|0);break}b=K+27+(_(h,-3)|0)|0;e=c[H>>2]|0;if((b|0)>30|(e>>>b|0)==0){g=+(I|0)*+(e>>>0)*+(c[20600+(h+-10<<2)>>2]|0);break}}e=(h|0)%9|0;if(!e){k=0;e=0}else{u=(h|0)>-1?e:e+9|0;n=c[20600+(8-u<<2)>>2]|0;if(l){o=1e9/(n|0)|0;k=0;e=0;p=0;do{D=H+(p<<2)|0;E=c[D>>2]|0;b=((E>>>0)/(n>>>0)|0)+e|0;c[D>>2]=b;e=_((E>>>0)%(n>>>0)|0,o)|0;b=(p|0)==(k|0)&(b|0)==0;p=p+1|0;h=b?h+-9|0:h;k=b?p&127:k}while((p|0)!=(l|0));if(e){c[H+(l<<2)>>2]=e;l=l+1|0}}else{k=0;l=0}e=0;h=9-u+h|0}i:while(1){v=(h|0)<18;w=(h|0)==18;x=H+(k<<2)|0;do{if(!v){if(!w)break i;if((c[x>>2]|0)>>>0>=9007199){h=18;break i}}n=0;o=l+127|0;while(1){u=o&127;p=H+(u<<2)|0;o=sf(c[p>>2]|0,0,29)|0;o=tf(o|0,C|0,n|0,0)|0;n=C;if(n>>>0>0|(n|0)==0&o>>>0>1e9){b=Ef(o|0,n|0,1e9,0)|0;o=Ff(o|0,n|0,1e9,0)|0;n=b}else n=0;c[p>>2]=o;b=(u|0)==(k|0);l=(u|0)!=(l+127&127|0)|b?l:(o|0)==0?u:l;if(b)break;else o=u+-1|0}e=e+-29|0}while((n|0)==0);k=k+127&127;if((k|0)==(l|0)){b=l+127&127;l=H+((l+126&127)<<2)|0;c[l>>2]=c[l>>2]|c[H+(b<<2)>>2];l=b}c[H+(k<<2)>>2]=n;h=h+9|0}j:while(1){y=l+1&127;x=H+((l+127&127)<<2)|0;while(1){v=(h|0)==18;w=(h|0)>27?9:1;u=v^1;while(1){o=k&127;p=(o|0)==(l|0);do if(!p){n=c[H+(o<<2)>>2]|0;if(n>>>0<9007199){A=219;break}if(n>>>0>9007199)break;n=k+1&127;if((n|0)==(l|0)){A=219;break}n=c[H+(n<<2)>>2]|0;if(n>>>0<254740991){A=219;break}if(!(n>>>0>254740991|u)){h=o;break j}}else A=219;while(0);if((A|0)==219?(A=0,v):0){A=220;break j}e=e+w|0;if((k|0)==(l|0))k=l;else break}u=(1<<w)+-1|0;v=1e9>>>w;o=k;n=0;p=k;while(1){E=H+(p<<2)|0;b=c[E>>2]|0;k=(b>>>w)+n|0;c[E>>2]=k;n=_(b&u,v)|0;k=(p|0)==(o|0)&(k|0)==0;p=p+1&127;h=k?h+-9|0:h;k=k?p:o;if((p|0)==(l|0))break;else o=k}if(!n)continue;if((y|0)!=(k|0))break;c[x>>2]=c[x>>2]|1}c[H+(l<<2)>>2]=n;l=y}if((A|0)==220)if(p){c[H+(y+-1<<2)>>2]=0;h=l;l=y}else h=o;g=+((c[H+(h<<2)>>2]|0)>>>0);h=k+1&127;if((h|0)==(l|0)){l=k+2&127;c[H+(l+-1<<2)>>2]=0}t=+(I|0);j=t*(g*1.0e9+ +((c[H+(h<<2)>>2]|0)>>>0));v=e+53|0;p=v-J|0;u=(p|0)<(K|0);h=u&1;o=u?((p|0)<0?0:p):K;if((o|0)<53){M=+Qe(+Ve(1.0,105-o|0),j);m=+Ue(j,+Ve(1.0,53-o|0));q=M;g=m;m=M+(j-m)}else{q=0.0;g=0.0;m=j}n=k+2&127;do if((n|0)==(l|0))j=g;else{n=c[H+(n<<2)>>2]|0;do if(n>>>0>=5e8){if(n>>>0>5e8){g=t*.75+g;break}if((k+3&127|0)==(l|0)){g=t*.5+g;break}else{g=t*.75+g;break}}else{if((n|0)==0?(k+3&127|0)==(l|0):0)break;g=t*.25+g}while(0);if((53-o|0)<=1){j=g;break}if(+Ue(g,1.0)!=0.0){j=g;break}j=g+1.0}while(0);g=m+j-q;do if((v&2147483647|0)>(-2-F|0)){if(+N(+g)>=9007199254740992.0){h=u&(o|0)==(p|0)?0:h;e=e+1|0;g=g*.5}if((e+50|0)<=(G|0)?!(j!=0.0&(h|0)!=0):0)break;c[(ne()|0)>>2]=34}while(0);g=+Re(g,e)}while(0);break a}default:{if(c[D>>2]|0)c[E>>2]=(c[E>>2]|0)+-1;c[(ne()|0)>>2]=22;_e(b,0);g=0.0;break a}}}}while(0);if((A|0)==23){h=(c[D>>2]|0)==0;if(!h)c[E>>2]=(c[E>>2]|0)+-1;if((f|0)!=0&e>>>0>3)do{if(!h)c[E>>2]=(c[E>>2]|0)+-1;e=e+-1|0}while(e>>>0>3)}g=+(I|0)*s}while(0);i=L;return +g}function Ze(a){a=a|0;if(a>>>0>4294963200){c[(ne()|0)>>2]=0-a;a=-1}return a|0}function _e(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;c[a+104>>2]=b;d=c[a+4>>2]|0;e=c[a+8>>2]|0;f=e-d|0;c[a+108>>2]=f;if((b|0)!=0&(f|0)>(b|0))c[a+100>>2]=d+b;else c[a+100>>2]=e;return}function $e(b){b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0;f=b+104|0;i=c[f>>2]|0;if((i|0)!=0?(c[b+108>>2]|0)>=(i|0):0)j=4;else{e=ze(b)|0;if((e|0)>=0){h=c[f>>2]|0;f=b+8|0;if(h){g=c[f>>2]|0;i=c[b+4>>2]|0;f=g;h=h-(c[b+108>>2]|0)+-1|0;if((f-i|0)>(h|0))c[b+100>>2]=i+h;else j=9}else{g=c[f>>2]|0;f=g;j=9}if((j|0)==9)c[b+100>>2]=f;f=c[b+4>>2]|0;if(g){b=b+108|0;c[b>>2]=g+1-f+(c[b>>2]|0)}f=f+-1|0;if((d[f>>0]|0|0)!=(e|0))a[f>>0]=e}else j=4}if((j|0)==4){c[b+100>>2]=0;e=-1}return e|0}function af(a,b,c){a=a|0;b=b|0;c=c|0;return Ee(a,b,c)|0}function bf(e,f,g,j,l){e=e|0;f=f|0;g=g|0;j=j|0;l=l|0;var m=0,n=0,o=0,p=0,q=0.0,r=0,s=0,t=0,u=0,v=0.0,w=0,x=0,y=0,z=0,A=0,B=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0;ha=i;i=i+624|0;ca=ha+24|0;ea=ha+16|0;da=ha+588|0;Y=ha+576|0;ba=ha;V=ha+536|0;ga=ha+8|0;fa=ha+528|0;M=(e|0)!=0;N=V+40|0;U=N;V=V+39|0;W=ga+4|0;X=Y+12|0;Y=Y+11|0;Z=da;$=X;aa=$-Z|0;O=-2-Z|0;P=$+2|0;Q=ca+288|0;R=da+9|0;S=R;T=da+8|0;w=f;f=0;n=0;m=0;a:while(1){do if((f|0)>-1)if((n|0)>(2147483647-f|0)){c[(ne()|0)>>2]=75;f=-1;break}else{f=n+f|0;break}while(0);n=a[w>>0]|0;if(!(n<<24>>24)){L=245;break}else o=w;b:while(1){switch(n<<24>>24){case 37:{n=o;L=9;break b}case 0:{n=o;break b}default:{}}K=o+1|0;n=a[K>>0]|0;o=K}c:do if((L|0)==9)while(1){L=0;if((a[n+1>>0]|0)!=37)break c;o=o+1|0;n=n+2|0;if((a[n>>0]|0)==37)L=9;else break}while(0);y=o-w|0;if(M?(c[e>>2]&32|0)==0:0)xe(w,y,e)|0;if((o|0)!=(w|0)){w=n;n=y;continue}r=n+1|0;o=a[r>>0]|0;p=(o<<24>>24)+-48|0;if(p>>>0<10){K=(a[n+2>>0]|0)==36;n=K?n+3|0:r;o=a[n>>0]|0;u=K?p:-1;m=K?1:m}else{u=-1;n=r}p=o<<24>>24;d:do if((p&-32|0)==32){r=0;do{if(!(1<<p+-32&75913))break d;r=1<<(o<<24>>24)+-32|r;n=n+1|0;o=a[n>>0]|0;p=o<<24>>24}while((p&-32|0)==32)}else r=0;while(0);do if(o<<24>>24==42){p=n+1|0;o=(a[p>>0]|0)+-48|0;if(o>>>0<10?(a[n+2>>0]|0)==36:0){c[l+(o<<2)>>2]=10;m=1;n=n+3|0;o=c[j+((a[p>>0]|0)+-48<<3)>>2]|0}else{if(m){f=-1;break a}if(!M){n=p;x=r;m=0;K=0;break}m=(c[g>>2]|0)+(4-1)&~(4-1);o=c[m>>2]|0;c[g>>2]=m+4;m=0;n=p}if((o|0)<0){x=r|8192;K=0-o|0}else{x=r;K=o}}else{p=(o<<24>>24)+-48|0;if(p>>>0<10){o=0;do{o=(o*10|0)+p|0;n=n+1|0;p=(a[n>>0]|0)+-48|0}while(p>>>0<10);if((o|0)<0){f=-1;break a}else{x=r;K=o}}else{x=r;K=0}}while(0);e:do if((a[n>>0]|0)==46){p=n+1|0;o=a[p>>0]|0;if(o<<24>>24!=42){r=(o<<24>>24)+-48|0;if(r>>>0<10){n=p;o=0}else{n=p;r=0;break}while(1){o=(o*10|0)+r|0;n=n+1|0;r=(a[n>>0]|0)+-48|0;if(r>>>0>=10){r=o;break e}}}p=n+2|0;o=(a[p>>0]|0)+-48|0;if(o>>>0<10?(a[n+3>>0]|0)==36:0){c[l+(o<<2)>>2]=10;n=n+4|0;r=c[j+((a[p>>0]|0)+-48<<3)>>2]|0;break}if(m){f=-1;break a}if(M){n=(c[g>>2]|0)+(4-1)&~(4-1);r=c[n>>2]|0;c[g>>2]=n+4;n=p}else{n=p;r=0}}else r=-1;while(0);t=0;while(1){o=(a[n>>0]|0)+-65|0;if(o>>>0>57){f=-1;break a}s=n+1|0;o=a[29180+(t*58|0)+o>>0]|0;p=o&255;if((p+-1|0)>>>0<8){n=s;t=p}else{J=s;s=o;break}}if(!(s<<24>>24)){f=-1;break}o=(u|0)>-1;do if(s<<24>>24==19)if(o){f=-1;break a}else L=52;else{if(o){c[l+(u<<2)>>2]=p;H=j+(u<<3)|0;I=c[H+4>>2]|0;L=ba;c[L>>2]=c[H>>2];c[L+4>>2]=I;L=52;break}if(!M){f=0;break a}ef(ba,p,g)}while(0);if((L|0)==52?(L=0,!M):0){w=J;n=y;continue}u=a[n>>0]|0;u=(t|0)!=0&(u&15|0)==3?u&-33:u;p=x&-65537;I=(x&8192|0)==0?x:p;f:do switch(u|0){case 110:switch(t|0){case 0:{c[c[ba>>2]>>2]=f;w=J;n=y;continue a}case 1:{c[c[ba>>2]>>2]=f;w=J;n=y;continue a}case 2:{w=c[ba>>2]|0;c[w>>2]=f;c[w+4>>2]=((f|0)<0)<<31>>31;w=J;n=y;continue a}case 3:{b[c[ba>>2]>>1]=f;w=J;n=y;continue a}case 4:{a[c[ba>>2]>>0]=f;w=J;n=y;continue a}case 6:{c[c[ba>>2]>>2]=f;w=J;n=y;continue a}case 7:{w=c[ba>>2]|0;c[w>>2]=f;c[w+4>>2]=((f|0)<0)<<31>>31;w=J;n=y;continue a}default:{w=J;n=y;continue a}}case 112:{t=I|8;r=r>>>0>8?r:8;u=120;L=64;break}case 88:case 120:{t=I;L=64;break}case 111:{p=ba;o=c[p>>2]|0;p=c[p+4>>2]|0;if((o|0)==0&(p|0)==0)n=N;else{n=N;do{n=n+-1|0;a[n>>0]=o&7|48;o=vf(o|0,p|0,3)|0;p=C}while(!((o|0)==0&(p|0)==0))}if(!(I&8)){o=I;t=0;s=29660;L=77}else{t=U-n+1|0;o=I;r=(r|0)<(t|0)?t:r;t=0;s=29660;L=77}break}case 105:case 100:{o=ba;n=c[o>>2]|0;o=c[o+4>>2]|0;if((o|0)<0){n=qf(0,0,n|0,o|0)|0;o=C;p=ba;c[p>>2]=n;c[p+4>>2]=o;p=1;s=29660;L=76;break f}if(!(I&2048)){s=I&1;p=s;s=(s|0)==0?29660:29662;L=76}else{p=1;s=29661;L=76}break}case 117:{o=ba;n=c[o>>2]|0;o=c[o+4>>2]|0;p=0;s=29660;L=76;break}case 99:{a[V>>0]=c[ba>>2];w=V;o=1;t=0;u=29660;n=N;break}case 109:{n=oe(c[(ne()|0)>>2]|0)|0;L=82;break}case 115:{n=c[ba>>2]|0;n=(n|0)!=0?n:29670;L=82;break}case 67:{c[ga>>2]=c[ba>>2];c[W>>2]=0;c[ba>>2]=ga;r=-1;L=86;break}case 83:{if(!r){gf(e,32,K,0,I);n=0;L=98}else L=86;break}case 65:case 71:case 70:case 69:case 97:case 103:case 102:case 101:{q=+h[ba>>3];c[ea>>2]=0;h[k>>3]=q;if((c[k+4>>2]|0)>=0)if(!(I&2048)){H=I&1;G=H;H=(H|0)==0?29678:29683}else{G=1;H=29680}else{q=-q;G=1;H=29677}h[k>>3]=q;F=c[k+4>>2]&2146435072;do if(F>>>0<2146435072|(F|0)==2146435072&0<0){v=+Pe(q,ea)*2.0;o=v!=0.0;if(o)c[ea>>2]=(c[ea>>2]|0)+-1;D=u|32;if((D|0)==97){w=u&32;y=(w|0)==0?H:H+9|0;x=G|2;n=12-r|0;do if(!(r>>>0>11|(n|0)==0)){q=8.0;do{n=n+-1|0;q=q*16.0}while((n|0)!=0);if((a[y>>0]|0)==45){q=-(q+(-v-q));break}else{q=v+q-q;break}}else q=v;while(0);o=c[ea>>2]|0;n=(o|0)<0?0-o|0:o;n=ff(n,((n|0)<0)<<31>>31,X)|0;if((n|0)==(X|0)){a[Y>>0]=48;n=Y}a[n+-1>>0]=(o>>31&2)+43;t=n+-2|0;a[t>>0]=u+15;s=(r|0)<1;p=(I&8|0)==0;o=da;while(1){H=~~q;n=o+1|0;a[o>>0]=d[29644+H>>0]|w;q=(q-+(H|0))*16.0;do if((n-Z|0)==1){if(p&(s&q==0.0))break;a[n>>0]=46;n=o+2|0}while(0);if(!(q!=0.0))break;else o=n}r=(r|0)!=0&(O+n|0)<(r|0)?P+r-t|0:aa-t+n|0;p=r+x|0;gf(e,32,K,p,I);if(!(c[e>>2]&32))xe(y,x,e)|0;gf(e,48,K,p,I^65536);n=n-Z|0;if(!(c[e>>2]&32))xe(da,n,e)|0;o=$-t|0;gf(e,48,r-(n+o)|0,0,0);if(!(c[e>>2]&32))xe(t,o,e)|0;gf(e,32,K,p,I^8192);n=(p|0)<(K|0)?K:p;break}n=(r|0)<0?6:r;if(o){o=(c[ea>>2]|0)+-28|0;c[ea>>2]=o;q=v*268435456.0}else{q=v;o=c[ea>>2]|0}F=(o|0)<0?ca:Q;E=F;o=F;do{B=~~q>>>0;c[o>>2]=B;o=o+4|0;q=(q-+(B>>>0))*1.0e9}while(q!=0.0);p=o;o=c[ea>>2]|0;if((o|0)>0){s=F;while(1){t=(o|0)>29?29:o;r=p+-4|0;do if(r>>>0<s>>>0)r=s;else{o=0;do{B=sf(c[r>>2]|0,0,t|0)|0;B=tf(B|0,C|0,o|0,0)|0;o=C;A=Ff(B|0,o|0,1e9,0)|0;c[r>>2]=A;o=Ef(B|0,o|0,1e9,0)|0;r=r+-4|0}while(r>>>0>=s>>>0);if(!o){r=s;break}r=s+-4|0;c[r>>2]=o}while(0);while(1){if(p>>>0<=r>>>0)break;o=p+-4|0;if(!(c[o>>2]|0))p=o;else break}o=(c[ea>>2]|0)-t|0;c[ea>>2]=o;if((o|0)>0)s=r;else break}}else r=F;if((o|0)<0){y=((n+25|0)/9|0)+1|0;z=(D|0)==102;w=r;while(1){x=0-o|0;x=(x|0)>9?9:x;do if(w>>>0<p>>>0){o=(1<<x)+-1|0;s=1e9>>>x;r=0;t=w;do{B=c[t>>2]|0;c[t>>2]=(B>>>x)+r;r=_(B&o,s)|0;t=t+4|0}while(t>>>0<p>>>0);o=(c[w>>2]|0)==0?w+4|0:w;if(!r){r=o;break}c[p>>2]=r;r=o;p=p+4|0}else r=(c[w>>2]|0)==0?w+4|0:w;while(0);o=z?F:r;p=(p-o>>2|0)>(y|0)?o+(y<<2)|0:p;o=(c[ea>>2]|0)+x|0;c[ea>>2]=o;if((o|0)>=0){w=r;break}else w=r}}else w=r;do if(w>>>0<p>>>0){o=(E-w>>2)*9|0;s=c[w>>2]|0;if(s>>>0<10)break;else r=10;do{r=r*10|0;o=o+1|0}while(s>>>0>=r>>>0)}else o=0;while(0);A=(D|0)==103;B=(n|0)!=0;r=n-((D|0)!=102?o:0)+((B&A)<<31>>31)|0;if((r|0)<(((p-E>>2)*9|0)+-9|0)){t=r+9216|0;z=(t|0)/9|0;r=F+(z+-1023<<2)|0;t=((t|0)%9|0)+1|0;if((t|0)<9){s=10;do{s=s*10|0;t=t+1|0}while((t|0)!=9)}else s=10;x=c[r>>2]|0;y=(x>>>0)%(s>>>0)|0;if((y|0)==0?(F+(z+-1022<<2)|0)==(p|0):0)s=w;else L=163;do if((L|0)==163){L=0;v=(((x>>>0)/(s>>>0)|0)&1|0)==0?9007199254740992.0:9007199254740994.0;t=(s|0)/2|0;do if(y>>>0<t>>>0)q=.5;else{if((y|0)==(t|0)?(F+(z+-1022<<2)|0)==(p|0):0){q=1.0;break}q=1.5}while(0);do if(G){if((a[H>>0]|0)!=45)break;v=-v;q=-q}while(0);t=x-y|0;c[r>>2]=t;if(!(v+q!=v)){s=w;break}D=t+s|0;c[r>>2]=D;if(D>>>0>999999999){o=w;while(1){s=r+-4|0;c[r>>2]=0;if(s>>>0<o>>>0){o=o+-4|0;c[o>>2]=0}D=(c[s>>2]|0)+1|0;c[s>>2]=D;if(D>>>0>999999999)r=s;else{w=o;r=s;break}}}o=(E-w>>2)*9|0;t=c[w>>2]|0;if(t>>>0<10){s=w;break}else s=10;do{s=s*10|0;o=o+1|0}while(t>>>0>=s>>>0);s=w}while(0);D=r+4|0;w=s;p=p>>>0>D>>>0?D:p}y=0-o|0;while(1){if(p>>>0<=w>>>0){z=0;D=p;break}r=p+-4|0;if(!(c[r>>2]|0))p=r;else{z=1;D=p;break}}do if(A){n=(B&1^1)+n|0;if((n|0)>(o|0)&(o|0)>-5){u=u+-1|0;n=n+-1-o|0}else{u=u+-2|0;n=n+-1|0}p=I&8;if(p)break;do if(z){p=c[D+-4>>2]|0;if(!p){r=9;break}if(!((p>>>0)%10|0)){s=10;r=0}else{r=0;break}do{s=s*10|0;r=r+1|0}while(((p>>>0)%(s>>>0)|0|0)==0)}else r=9;while(0);p=((D-E>>2)*9|0)+-9|0;if((u|32|0)==102){p=p-r|0;p=(p|0)<0?0:p;n=(n|0)<(p|0)?n:p;p=0;break}else{p=p+o-r|0;p=(p|0)<0?0:p;n=(n|0)<(p|0)?n:p;p=0;break}}else p=I&8;while(0);x=n|p;s=(x|0)!=0&1;t=(u|32|0)==102;if(t){o=(o|0)>0?o:0;u=0}else{r=(o|0)<0?y:o;r=ff(r,((r|0)<0)<<31>>31,X)|0;if(($-r|0)<2)do{r=r+-1|0;a[r>>0]=48}while(($-r|0)<2);a[r+-1>>0]=(o>>31&2)+43;E=r+-2|0;a[E>>0]=u;o=$-E|0;u=E}y=G+1+n+s+o|0;gf(e,32,K,y,I);if(!(c[e>>2]&32))xe(H,G,e)|0;gf(e,48,K,y,I^65536);do if(t){r=w>>>0>F>>>0?F:w;o=r;do{p=ff(c[o>>2]|0,0,R)|0;do if((o|0)==(r|0)){if((p|0)!=(R|0))break;a[T>>0]=48;p=T}else{if(p>>>0<=da>>>0)break;do{p=p+-1|0;a[p>>0]=48}while(p>>>0>da>>>0)}while(0);if(!(c[e>>2]&32))xe(p,S-p|0,e)|0;o=o+4|0}while(o>>>0<=F>>>0);do if(x){if(c[e>>2]&32)break;xe(29712,1,e)|0}while(0);if((n|0)>0&o>>>0<D>>>0){p=o;while(1){o=ff(c[p>>2]|0,0,R)|0;if(o>>>0>da>>>0)do{o=o+-1|0;a[o>>0]=48}while(o>>>0>da>>>0);if(!(c[e>>2]&32))xe(o,(n|0)>9?9:n,e)|0;p=p+4|0;o=n+-9|0;if(!((n|0)>9&p>>>0<D>>>0)){n=o;break}else n=o}}gf(e,48,n+9|0,9,0)}else{t=z?D:w+4|0;if((n|0)>-1){s=(p|0)==0;r=w;do{o=ff(c[r>>2]|0,0,R)|0;if((o|0)==(R|0)){a[T>>0]=48;o=T}do if((r|0)==(w|0)){p=o+1|0;if(!(c[e>>2]&32))xe(o,1,e)|0;if(s&(n|0)<1){o=p;break}if(c[e>>2]&32){o=p;break}xe(29712,1,e)|0;o=p}else{if(o>>>0<=da>>>0)break;do{o=o+-1|0;a[o>>0]=48}while(o>>>0>da>>>0)}while(0);p=S-o|0;if(!(c[e>>2]&32))xe(o,(n|0)>(p|0)?p:n,e)|0;n=n-p|0;r=r+4|0}while(r>>>0<t>>>0&(n|0)>-1)}gf(e,48,n+18|0,18,0);if(c[e>>2]&32)break;xe(u,$-u|0,e)|0}while(0);gf(e,32,K,y,I^8192);n=(y|0)<(K|0)?K:y}else{t=(u&32|0)!=0;s=q!=q|0.0!=0.0;o=s?0:G;r=o+3|0;gf(e,32,K,r,p);n=c[e>>2]|0;if(!(n&32)){xe(H,o,e)|0;n=c[e>>2]|0}if(!(n&32))xe(s?(t?29704:29708):t?29696:29700,3,e)|0;gf(e,32,K,r,I^8192);n=(r|0)<(K|0)?K:r}while(0);w=J;continue a}default:{p=I;o=r;t=0;u=29660;n=N}}while(0);g:do if((L|0)==64){p=ba;o=c[p>>2]|0;p=c[p+4>>2]|0;s=u&32;if(!((o|0)==0&(p|0)==0)){n=N;do{n=n+-1|0;a[n>>0]=d[29644+(o&15)>>0]|s;o=vf(o|0,p|0,4)|0;p=C}while(!((o|0)==0&(p|0)==0));L=ba;if((t&8|0)==0|(c[L>>2]|0)==0&(c[L+4>>2]|0)==0){o=t;t=0;s=29660;L=77}else{o=t;t=2;s=29660+(u>>4)|0;L=77}}else{n=N;o=t;t=0;s=29660;L=77}}else if((L|0)==76){n=ff(n,o,N)|0;o=I;t=p;L=77}else if((L|0)==82){L=0;I=ve(n,0,r)|0;H=(I|0)==0;w=n;o=H?r:I-n|0;t=0;u=29660;n=H?n+r|0:I}else if((L|0)==86){L=0;o=0;n=0;s=c[ba>>2]|0;while(1){p=c[s>>2]|0;if(!p)break;n=pe(fa,p)|0;if((n|0)<0|n>>>0>(r-o|0)>>>0)break;o=n+o|0;if(r>>>0>o>>>0)s=s+4|0;else break}if((n|0)<0){f=-1;break a}gf(e,32,K,o,I);if(!o){n=0;L=98}else{p=0;r=c[ba>>2]|0;while(1){n=c[r>>2]|0;if(!n){n=o;L=98;break g}n=pe(fa,n)|0;p=n+p|0;if((p|0)>(o|0)){n=o;L=98;break g}if(!(c[e>>2]&32))xe(fa,n,e)|0;if(p>>>0>=o>>>0){n=o;L=98;break}else r=r+4|0}}}while(0);if((L|0)==98){L=0;gf(e,32,K,n,I^8192);w=J;n=(K|0)>(n|0)?K:n;continue}if((L|0)==77){L=0;p=(r|0)>-1?o&-65537:o;o=ba;o=(c[o>>2]|0)!=0|(c[o+4>>2]|0)!=0;if((r|0)!=0|o){o=(o&1^1)+(U-n)|0;w=n;o=(r|0)>(o|0)?r:o;u=s;n=N}else{w=N;o=0;u=s;n=N}}s=n-w|0;o=(o|0)<(s|0)?s:o;r=t+o|0;n=(K|0)<(r|0)?r:K;gf(e,32,n,r,p);if(!(c[e>>2]&32))xe(u,t,e)|0;gf(e,48,n,r,p^65536);gf(e,48,o,s,0);if(!(c[e>>2]&32))xe(w,s,e)|0;gf(e,32,n,r,p^8192);w=J}h:do if((L|0)==245)if(!e)if(m){f=1;while(1){m=c[l+(f<<2)>>2]|0;if(!m)break;ef(j+(f<<3)|0,m,g);f=f+1|0;if((f|0)>=10){f=1;break h}}if((f|0)<10)while(1){if(c[l+(f<<2)>>2]|0){f=-1;break h}f=f+1|0;if((f|0)>=10){f=1;break}}else f=1}else f=0;while(0);i=ha;return f|0}function cf(a){a=a|0;if(!(c[a+68>>2]|0))Le(a);return}function df(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0;i=a+4|0;e=c[i>>2]|0;j=a+100|0;if(e>>>0<(c[j>>2]|0)>>>0){c[i>>2]=e+1;e=d[e>>0]|0}else e=$e(a)|0;switch(e|0){case 43:case 45:{f=(e|0)==45&1;e=c[i>>2]|0;if(e>>>0<(c[j>>2]|0)>>>0){c[i>>2]=e+1;e=d[e>>0]|0}else e=$e(a)|0;if((b|0)!=0&(e+-48|0)>>>0>9?(c[j>>2]|0)!=0:0){c[i>>2]=(c[i>>2]|0)+-1;h=f}else h=f;break}default:h=0}if((e+-48|0)>>>0>9)if(!(c[j>>2]|0)){f=-2147483648;e=0}else{c[i>>2]=(c[i>>2]|0)+-1;f=-2147483648;e=0}else{f=0;do{f=e+-48+(f*10|0)|0;e=c[i>>2]|0;if(e>>>0<(c[j>>2]|0)>>>0){c[i>>2]=e+1;e=d[e>>0]|0}else e=$e(a)|0}while((e+-48|0)>>>0<10&(f|0)<214748364);b=((f|0)<0)<<31>>31;if((e+-48|0)>>>0<10){do{b=Df(f|0,b|0,10,0)|0;f=C;e=tf(e|0,((e|0)<0)<<31>>31|0,-48,-1)|0;f=tf(e|0,C|0,b|0,f|0)|0;b=C;e=c[i>>2]|0;if(e>>>0<(c[j>>2]|0)>>>0){c[i>>2]=e+1;e=d[e>>0]|0}else e=$e(a)|0}while((e+-48|0)>>>0<10&((b|0)<21474836|(b|0)==21474836&f>>>0<2061584302));g=f}else g=f;if((e+-48|0)>>>0<10)do{e=c[i>>2]|0;if(e>>>0<(c[j>>2]|0)>>>0){c[i>>2]=e+1;e=d[e>>0]|0}else e=$e(a)|0}while((e+-48|0)>>>0<10);if(c[j>>2]|0)c[i>>2]=(c[i>>2]|0)+-1;a=(h|0)!=0;e=qf(0,0,g|0,b|0)|0;f=a?C:b;e=a?e:g}C=f;return e|0}function ef(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0.0;a:do if(b>>>0<=20)do switch(b|0){case 9:{e=(c[d>>2]|0)+(4-1)&~(4-1);b=c[e>>2]|0;c[d>>2]=e+4;c[a>>2]=b;break a}case 10:{e=(c[d>>2]|0)+(4-1)&~(4-1);b=c[e>>2]|0;c[d>>2]=e+4;e=a;c[e>>2]=b;c[e+4>>2]=((b|0)<0)<<31>>31;break a}case 11:{e=(c[d>>2]|0)+(4-1)&~(4-1);b=c[e>>2]|0;c[d>>2]=e+4;e=a;c[e>>2]=b;c[e+4>>2]=0;break a}case 12:{e=(c[d>>2]|0)+(8-1)&~(8-1);b=e;f=c[b>>2]|0;b=c[b+4>>2]|0;c[d>>2]=e+8;e=a;c[e>>2]=f;c[e+4>>2]=b;break a}case 13:{f=(c[d>>2]|0)+(4-1)&~(4-1);e=c[f>>2]|0;c[d>>2]=f+4;e=(e&65535)<<16>>16;f=a;c[f>>2]=e;c[f+4>>2]=((e|0)<0)<<31>>31;break a}case 14:{f=(c[d>>2]|0)+(4-1)&~(4-1);e=c[f>>2]|0;c[d>>2]=f+4;f=a;c[f>>2]=e&65535;c[f+4>>2]=0;break a}case 15:{f=(c[d>>2]|0)+(4-1)&~(4-1);e=c[f>>2]|0;c[d>>2]=f+4;e=(e&255)<<24>>24;f=a;c[f>>2]=e;c[f+4>>2]=((e|0)<0)<<31>>31;break a}case 16:{f=(c[d>>2]|0)+(4-1)&~(4-1);e=c[f>>2]|0;c[d>>2]=f+4;f=a;c[f>>2]=e&255;c[f+4>>2]=0;break a}case 17:{f=(c[d>>2]|0)+(8-1)&~(8-1);g=+h[f>>3];c[d>>2]=f+8;h[a>>3]=g;break a}case 18:{f=(c[d>>2]|0)+(8-1)&~(8-1);g=+h[f>>3];c[d>>2]=f+8;h[a>>3]=g;break a}default:break a}while(0);while(0);return}
function ff(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;if(c>>>0>0|(c|0)==0&b>>>0>4294967295)while(1){e=Ff(b|0,c|0,10,0)|0;d=d+-1|0;a[d>>0]=e|48;e=Ef(b|0,c|0,10,0)|0;if(c>>>0>9|(c|0)==9&b>>>0>4294967295){b=e;c=C}else{b=e;break}}if(b)while(1){d=d+-1|0;a[d>>0]=(b>>>0)%10|0|48;if(b>>>0<10)break;else b=(b>>>0)/10|0}return d|0}function gf(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0;j=i;i=i+256|0;h=j;do if((d|0)>(e|0)&(f&73728|0)==0){f=d-e|0;rf(h|0,b|0,(f>>>0>256?256:f)|0)|0;b=c[a>>2]|0;g=(b&32|0)==0;if(f>>>0>255){e=d-e|0;do{if(g){xe(h,256,a)|0;b=c[a>>2]|0}f=f+-256|0;g=(b&32|0)==0}while(f>>>0>255);if(g)f=e&255;else break}else if(!g)break;xe(h,f,a)|0}while(0);i=j;return}function hf(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=a+20|0;f=c[e>>2]|0;a=(c[a+16>>2]|0)-f|0;a=a>>>0>d>>>0?d:a;xf(f|0,b|0,a|0)|0;c[e>>2]=(c[e>>2]|0)+a;return d|0}function jf(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;do if(a>>>0<245){o=a>>>0<11?16:a+11&-8;a=o>>>3;i=c[5186]|0;d=i>>>a;if(d&3){a=(d&1^1)+a|0;e=a<<1;d=20784+(e<<2)|0;e=20784+(e+2<<2)|0;f=c[e>>2]|0;g=f+8|0;h=c[g>>2]|0;do if((d|0)!=(h|0)){if(h>>>0<(c[5190]|0)>>>0)wa();b=h+12|0;if((c[b>>2]|0)==(f|0)){c[b>>2]=d;c[e>>2]=h;break}else wa()}else c[5186]=i&~(1<<a);while(0);M=a<<3;c[f+4>>2]=M|3;M=f+(M|4)|0;c[M>>2]=c[M>>2]|1;M=g;return M|0}h=c[5188]|0;if(o>>>0>h>>>0){if(d){e=2<<a;e=d<<a&(e|0-e);e=(e&0-e)+-1|0;j=e>>>12&16;e=e>>>j;f=e>>>5&8;e=e>>>f;g=e>>>2&4;e=e>>>g;d=e>>>1&2;e=e>>>d;a=e>>>1&1;a=(f|j|g|d|a)+(e>>>a)|0;e=a<<1;d=20784+(e<<2)|0;e=20784+(e+2<<2)|0;g=c[e>>2]|0;j=g+8|0;f=c[j>>2]|0;do if((d|0)!=(f|0)){if(f>>>0<(c[5190]|0)>>>0)wa();b=f+12|0;if((c[b>>2]|0)==(g|0)){c[b>>2]=d;c[e>>2]=f;k=c[5188]|0;break}else wa()}else{c[5186]=i&~(1<<a);k=h}while(0);M=a<<3;h=M-o|0;c[g+4>>2]=o|3;i=g+o|0;c[g+(o|4)>>2]=h|1;c[g+M>>2]=h;if(k){f=c[5191]|0;d=k>>>3;b=d<<1;e=20784+(b<<2)|0;a=c[5186]|0;d=1<<d;if(a&d){a=20784+(b+2<<2)|0;b=c[a>>2]|0;if(b>>>0<(c[5190]|0)>>>0)wa();else{l=a;m=b}}else{c[5186]=a|d;l=20784+(b+2<<2)|0;m=e}c[l>>2]=f;c[m+12>>2]=f;c[f+8>>2]=m;c[f+12>>2]=e}c[5188]=h;c[5191]=i;M=j;return M|0}a=c[5187]|0;if(a){d=(a&0-a)+-1|0;L=d>>>12&16;d=d>>>L;K=d>>>5&8;d=d>>>K;M=d>>>2&4;d=d>>>M;a=d>>>1&2;d=d>>>a;e=d>>>1&1;e=c[21048+((K|L|M|a|e)+(d>>>e)<<2)>>2]|0;d=(c[e+4>>2]&-8)-o|0;a=e;while(1){b=c[a+16>>2]|0;if(!b){b=c[a+20>>2]|0;if(!b){j=d;break}}a=(c[b+4>>2]&-8)-o|0;M=a>>>0<d>>>0;d=M?a:d;a=b;e=M?b:e}g=c[5190]|0;if(e>>>0<g>>>0)wa();i=e+o|0;if(e>>>0>=i>>>0)wa();h=c[e+24>>2]|0;d=c[e+12>>2]|0;do if((d|0)==(e|0)){a=e+20|0;b=c[a>>2]|0;if(!b){a=e+16|0;b=c[a>>2]|0;if(!b){n=0;break}}while(1){d=b+20|0;f=c[d>>2]|0;if(f){b=f;a=d;continue}d=b+16|0;f=c[d>>2]|0;if(!f)break;else{b=f;a=d}}if(a>>>0<g>>>0)wa();else{c[a>>2]=0;n=b;break}}else{f=c[e+8>>2]|0;if(f>>>0<g>>>0)wa();b=f+12|0;if((c[b>>2]|0)!=(e|0))wa();a=d+8|0;if((c[a>>2]|0)==(e|0)){c[b>>2]=d;c[a>>2]=f;n=d;break}else wa()}while(0);do if(h){b=c[e+28>>2]|0;a=21048+(b<<2)|0;if((e|0)==(c[a>>2]|0)){c[a>>2]=n;if(!n){c[5187]=c[5187]&~(1<<b);break}}else{if(h>>>0<(c[5190]|0)>>>0)wa();b=h+16|0;if((c[b>>2]|0)==(e|0))c[b>>2]=n;else c[h+20>>2]=n;if(!n)break}a=c[5190]|0;if(n>>>0<a>>>0)wa();c[n+24>>2]=h;b=c[e+16>>2]|0;do if(b)if(b>>>0<a>>>0)wa();else{c[n+16>>2]=b;c[b+24>>2]=n;break}while(0);b=c[e+20>>2]|0;if(b)if(b>>>0<(c[5190]|0)>>>0)wa();else{c[n+20>>2]=b;c[b+24>>2]=n;break}}while(0);if(j>>>0<16){M=j+o|0;c[e+4>>2]=M|3;M=e+(M+4)|0;c[M>>2]=c[M>>2]|1}else{c[e+4>>2]=o|3;c[e+(o|4)>>2]=j|1;c[e+(j+o)>>2]=j;b=c[5188]|0;if(b){g=c[5191]|0;d=b>>>3;b=d<<1;f=20784+(b<<2)|0;a=c[5186]|0;d=1<<d;if(a&d){b=20784+(b+2<<2)|0;a=c[b>>2]|0;if(a>>>0<(c[5190]|0)>>>0)wa();else{p=b;q=a}}else{c[5186]=a|d;p=20784+(b+2<<2)|0;q=f}c[p>>2]=g;c[q+12>>2]=g;c[g+8>>2]=q;c[g+12>>2]=f}c[5188]=j;c[5191]=i}M=e+8|0;return M|0}else q=o}else q=o}else if(a>>>0<=4294967231){a=a+11|0;m=a&-8;l=c[5187]|0;if(l){d=0-m|0;a=a>>>8;if(a)if(m>>>0>16777215)k=31;else{q=(a+1048320|0)>>>16&8;v=a<<q;p=(v+520192|0)>>>16&4;v=v<<p;k=(v+245760|0)>>>16&2;k=14-(p|q|k)+(v<<k>>>15)|0;k=m>>>(k+7|0)&1|k<<1}else k=0;a=c[21048+(k<<2)>>2]|0;a:do if(!a){f=0;a=0;v=86}else{h=d;f=0;i=m<<((k|0)==31?0:25-(k>>>1)|0);j=a;a=0;while(1){g=c[j+4>>2]&-8;d=g-m|0;if(d>>>0<h>>>0)if((g|0)==(m|0)){g=j;a=j;v=90;break a}else a=j;else d=h;v=c[j+20>>2]|0;j=c[j+16+(i>>>31<<2)>>2]|0;f=(v|0)==0|(v|0)==(j|0)?f:v;if(!j){v=86;break}else{h=d;i=i<<1}}}while(0);if((v|0)==86){if((f|0)==0&(a|0)==0){a=2<<k;a=l&(a|0-a);if(!a){q=m;break}a=(a&0-a)+-1|0;n=a>>>12&16;a=a>>>n;l=a>>>5&8;a=a>>>l;p=a>>>2&4;a=a>>>p;q=a>>>1&2;a=a>>>q;f=a>>>1&1;f=c[21048+((l|n|p|q|f)+(a>>>f)<<2)>>2]|0;a=0}if(!f){i=d;j=a}else{g=f;v=90}}if((v|0)==90)while(1){v=0;q=(c[g+4>>2]&-8)-m|0;f=q>>>0<d>>>0;d=f?q:d;a=f?g:a;f=c[g+16>>2]|0;if(f){g=f;v=90;continue}g=c[g+20>>2]|0;if(!g){i=d;j=a;break}else v=90}if((j|0)!=0?i>>>0<((c[5188]|0)-m|0)>>>0:0){f=c[5190]|0;if(j>>>0<f>>>0)wa();h=j+m|0;if(j>>>0>=h>>>0)wa();g=c[j+24>>2]|0;d=c[j+12>>2]|0;do if((d|0)==(j|0)){a=j+20|0;b=c[a>>2]|0;if(!b){a=j+16|0;b=c[a>>2]|0;if(!b){o=0;break}}while(1){d=b+20|0;e=c[d>>2]|0;if(e){b=e;a=d;continue}d=b+16|0;e=c[d>>2]|0;if(!e)break;else{b=e;a=d}}if(a>>>0<f>>>0)wa();else{c[a>>2]=0;o=b;break}}else{e=c[j+8>>2]|0;if(e>>>0<f>>>0)wa();b=e+12|0;if((c[b>>2]|0)!=(j|0))wa();a=d+8|0;if((c[a>>2]|0)==(j|0)){c[b>>2]=d;c[a>>2]=e;o=d;break}else wa()}while(0);do if(g){b=c[j+28>>2]|0;a=21048+(b<<2)|0;if((j|0)==(c[a>>2]|0)){c[a>>2]=o;if(!o){c[5187]=c[5187]&~(1<<b);break}}else{if(g>>>0<(c[5190]|0)>>>0)wa();b=g+16|0;if((c[b>>2]|0)==(j|0))c[b>>2]=o;else c[g+20>>2]=o;if(!o)break}a=c[5190]|0;if(o>>>0<a>>>0)wa();c[o+24>>2]=g;b=c[j+16>>2]|0;do if(b)if(b>>>0<a>>>0)wa();else{c[o+16>>2]=b;c[b+24>>2]=o;break}while(0);b=c[j+20>>2]|0;if(b)if(b>>>0<(c[5190]|0)>>>0)wa();else{c[o+20>>2]=b;c[b+24>>2]=o;break}}while(0);b:do if(i>>>0>=16){c[j+4>>2]=m|3;c[j+(m|4)>>2]=i|1;c[j+(i+m)>>2]=i;b=i>>>3;if(i>>>0<256){a=b<<1;e=20784+(a<<2)|0;d=c[5186]|0;b=1<<b;if(d&b){b=20784+(a+2<<2)|0;a=c[b>>2]|0;if(a>>>0<(c[5190]|0)>>>0)wa();else{s=b;t=a}}else{c[5186]=d|b;s=20784+(a+2<<2)|0;t=e}c[s>>2]=h;c[t+12>>2]=h;c[j+(m+8)>>2]=t;c[j+(m+12)>>2]=e;break}b=i>>>8;if(b)if(i>>>0>16777215)e=31;else{L=(b+1048320|0)>>>16&8;M=b<<L;K=(M+520192|0)>>>16&4;M=M<<K;e=(M+245760|0)>>>16&2;e=14-(K|L|e)+(M<<e>>>15)|0;e=i>>>(e+7|0)&1|e<<1}else e=0;b=21048+(e<<2)|0;c[j+(m+28)>>2]=e;c[j+(m+20)>>2]=0;c[j+(m+16)>>2]=0;a=c[5187]|0;d=1<<e;if(!(a&d)){c[5187]=a|d;c[b>>2]=h;c[j+(m+24)>>2]=b;c[j+(m+12)>>2]=h;c[j+(m+8)>>2]=h;break}b=c[b>>2]|0;c:do if((c[b+4>>2]&-8|0)!=(i|0)){e=i<<((e|0)==31?0:25-(e>>>1)|0);while(1){a=b+16+(e>>>31<<2)|0;d=c[a>>2]|0;if(!d)break;if((c[d+4>>2]&-8|0)==(i|0)){y=d;break c}else{e=e<<1;b=d}}if(a>>>0<(c[5190]|0)>>>0)wa();else{c[a>>2]=h;c[j+(m+24)>>2]=b;c[j+(m+12)>>2]=h;c[j+(m+8)>>2]=h;break b}}else y=b;while(0);b=y+8|0;a=c[b>>2]|0;M=c[5190]|0;if(a>>>0>=M>>>0&y>>>0>=M>>>0){c[a+12>>2]=h;c[b>>2]=h;c[j+(m+8)>>2]=a;c[j+(m+12)>>2]=y;c[j+(m+24)>>2]=0;break}else wa()}else{M=i+m|0;c[j+4>>2]=M|3;M=j+(M+4)|0;c[M>>2]=c[M>>2]|1}while(0);M=j+8|0;return M|0}else q=m}else q=m}else q=-1;while(0);d=c[5188]|0;if(d>>>0>=q>>>0){b=d-q|0;a=c[5191]|0;if(b>>>0>15){c[5191]=a+q;c[5188]=b;c[a+(q+4)>>2]=b|1;c[a+d>>2]=b;c[a+4>>2]=q|3}else{c[5188]=0;c[5191]=0;c[a+4>>2]=d|3;M=a+(d+4)|0;c[M>>2]=c[M>>2]|1}M=a+8|0;return M|0}a=c[5189]|0;if(a>>>0>q>>>0){L=a-q|0;c[5189]=L;M=c[5192]|0;c[5192]=M+q;c[M+(q+4)>>2]=L|1;c[M+4>>2]=q|3;M=M+8|0;return M|0}do if(!(c[5304]|0)){a=Fa(30)|0;if(!(a+-1&a)){c[5306]=a;c[5305]=a;c[5307]=-1;c[5308]=-1;c[5309]=0;c[5297]=0;c[5304]=(Ea(0)|0)&-16^1431655768;break}else wa()}while(0);j=q+48|0;i=c[5306]|0;k=q+47|0;h=i+k|0;i=0-i|0;l=h&i;if(l>>>0<=q>>>0){M=0;return M|0}a=c[5296]|0;if((a|0)!=0?(t=c[5294]|0,y=t+l|0,y>>>0<=t>>>0|y>>>0>a>>>0):0){M=0;return M|0}d:do if(!(c[5297]&4)){a=c[5192]|0;e:do if(a){f=21192;while(1){d=c[f>>2]|0;if(d>>>0<=a>>>0?(r=f+4|0,(d+(c[r>>2]|0)|0)>>>0>a>>>0):0){g=f;a=r;break}f=c[f+8>>2]|0;if(!f){v=174;break e}}d=h-(c[5189]|0)&i;if(d>>>0<2147483647){f=xa(d|0)|0;y=(f|0)==((c[g>>2]|0)+(c[a>>2]|0)|0);a=y?d:0;if(y){if((f|0)!=(-1|0)){w=f;p=a;v=194;break d}}else v=184}else a=0}else v=174;while(0);do if((v|0)==174){g=xa(0)|0;if((g|0)!=(-1|0)){a=g;d=c[5305]|0;f=d+-1|0;if(!(f&a))d=l;else d=l-a+(f+a&0-d)|0;a=c[5294]|0;f=a+d|0;if(d>>>0>q>>>0&d>>>0<2147483647){y=c[5296]|0;if((y|0)!=0?f>>>0<=a>>>0|f>>>0>y>>>0:0){a=0;break}f=xa(d|0)|0;y=(f|0)==(g|0);a=y?d:0;if(y){w=g;p=a;v=194;break d}else v=184}else a=0}else a=0}while(0);f:do if((v|0)==184){g=0-d|0;do if(j>>>0>d>>>0&(d>>>0<2147483647&(f|0)!=(-1|0))?(u=c[5306]|0,u=k-d+u&0-u,u>>>0<2147483647):0)if((xa(u|0)|0)==(-1|0)){xa(g|0)|0;break f}else{d=u+d|0;break}while(0);if((f|0)!=(-1|0)){w=f;p=d;v=194;break d}}while(0);c[5297]=c[5297]|4;v=191}else{a=0;v=191}while(0);if((((v|0)==191?l>>>0<2147483647:0)?(w=xa(l|0)|0,x=xa(0)|0,w>>>0<x>>>0&((w|0)!=(-1|0)&(x|0)!=(-1|0))):0)?(z=x-w|0,A=z>>>0>(q+40|0)>>>0,A):0){p=A?z:a;v=194}if((v|0)==194){a=(c[5294]|0)+p|0;c[5294]=a;if(a>>>0>(c[5295]|0)>>>0)c[5295]=a;h=c[5192]|0;g:do if(h){g=21192;do{a=c[g>>2]|0;d=g+4|0;f=c[d>>2]|0;if((w|0)==(a+f|0)){B=a;C=d;D=f;E=g;v=204;break}g=c[g+8>>2]|0}while((g|0)!=0);if(((v|0)==204?(c[E+12>>2]&8|0)==0:0)?h>>>0<w>>>0&h>>>0>=B>>>0:0){c[C>>2]=D+p;M=(c[5189]|0)+p|0;L=h+8|0;L=(L&7|0)==0?0:0-L&7;K=M-L|0;c[5192]=h+L;c[5189]=K;c[h+(L+4)>>2]=K|1;c[h+(M+4)>>2]=40;c[5193]=c[5308];break}a=c[5190]|0;if(w>>>0<a>>>0){c[5190]=w;a=w}d=w+p|0;g=21192;while(1){if((c[g>>2]|0)==(d|0)){f=g;d=g;v=212;break}g=c[g+8>>2]|0;if(!g){d=21192;break}}if((v|0)==212)if(!(c[d+12>>2]&8)){c[f>>2]=w;n=d+4|0;c[n>>2]=(c[n>>2]|0)+p;n=w+8|0;n=(n&7|0)==0?0:0-n&7;k=w+(p+8)|0;k=(k&7|0)==0?0:0-k&7;b=w+(k+p)|0;m=n+q|0;o=w+m|0;l=b-(w+n)-q|0;c[w+(n+4)>>2]=q|3;h:do if((b|0)!=(h|0)){if((b|0)==(c[5191]|0)){M=(c[5188]|0)+l|0;c[5188]=M;c[5191]=o;c[w+(m+4)>>2]=M|1;c[w+(M+m)>>2]=M;break}i=p+4|0;d=c[w+(i+k)>>2]|0;if((d&3|0)==1){j=d&-8;g=d>>>3;i:do if(d>>>0>=256){h=c[w+((k|24)+p)>>2]|0;e=c[w+(p+12+k)>>2]|0;do if((e|0)==(b|0)){f=k|16;e=w+(i+f)|0;d=c[e>>2]|0;if(!d){e=w+(f+p)|0;d=c[e>>2]|0;if(!d){J=0;break}}while(1){f=d+20|0;g=c[f>>2]|0;if(g){d=g;e=f;continue}f=d+16|0;g=c[f>>2]|0;if(!g)break;else{d=g;e=f}}if(e>>>0<a>>>0)wa();else{c[e>>2]=0;J=d;break}}else{f=c[w+((k|8)+p)>>2]|0;if(f>>>0<a>>>0)wa();a=f+12|0;if((c[a>>2]|0)!=(b|0))wa();d=e+8|0;if((c[d>>2]|0)==(b|0)){c[a>>2]=e;c[d>>2]=f;J=e;break}else wa()}while(0);if(!h)break;a=c[w+(p+28+k)>>2]|0;d=21048+(a<<2)|0;do if((b|0)!=(c[d>>2]|0)){if(h>>>0<(c[5190]|0)>>>0)wa();a=h+16|0;if((c[a>>2]|0)==(b|0))c[a>>2]=J;else c[h+20>>2]=J;if(!J)break i}else{c[d>>2]=J;if(J)break;c[5187]=c[5187]&~(1<<a);break i}while(0);d=c[5190]|0;if(J>>>0<d>>>0)wa();c[J+24>>2]=h;b=k|16;a=c[w+(b+p)>>2]|0;do if(a)if(a>>>0<d>>>0)wa();else{c[J+16>>2]=a;c[a+24>>2]=J;break}while(0);b=c[w+(i+b)>>2]|0;if(!b)break;if(b>>>0<(c[5190]|0)>>>0)wa();else{c[J+20>>2]=b;c[b+24>>2]=J;break}}else{e=c[w+((k|8)+p)>>2]|0;f=c[w+(p+12+k)>>2]|0;d=20784+(g<<1<<2)|0;do if((e|0)!=(d|0)){if(e>>>0<a>>>0)wa();if((c[e+12>>2]|0)==(b|0))break;wa()}while(0);if((f|0)==(e|0)){c[5186]=c[5186]&~(1<<g);break}do if((f|0)==(d|0))F=f+8|0;else{if(f>>>0<a>>>0)wa();a=f+8|0;if((c[a>>2]|0)==(b|0)){F=a;break}wa()}while(0);c[e+12>>2]=f;c[F>>2]=e}while(0);b=w+((j|k)+p)|0;f=j+l|0}else f=l;b=b+4|0;c[b>>2]=c[b>>2]&-2;c[w+(m+4)>>2]=f|1;c[w+(f+m)>>2]=f;b=f>>>3;if(f>>>0<256){a=b<<1;e=20784+(a<<2)|0;d=c[5186]|0;b=1<<b;do if(!(d&b)){c[5186]=d|b;K=20784+(a+2<<2)|0;L=e}else{b=20784+(a+2<<2)|0;a=c[b>>2]|0;if(a>>>0>=(c[5190]|0)>>>0){K=b;L=a;break}wa()}while(0);c[K>>2]=o;c[L+12>>2]=o;c[w+(m+8)>>2]=L;c[w+(m+12)>>2]=e;break}b=f>>>8;do if(!b)e=0;else{if(f>>>0>16777215){e=31;break}K=(b+1048320|0)>>>16&8;L=b<<K;J=(L+520192|0)>>>16&4;L=L<<J;e=(L+245760|0)>>>16&2;e=14-(J|K|e)+(L<<e>>>15)|0;e=f>>>(e+7|0)&1|e<<1}while(0);b=21048+(e<<2)|0;c[w+(m+28)>>2]=e;c[w+(m+20)>>2]=0;c[w+(m+16)>>2]=0;a=c[5187]|0;d=1<<e;if(!(a&d)){c[5187]=a|d;c[b>>2]=o;c[w+(m+24)>>2]=b;c[w+(m+12)>>2]=o;c[w+(m+8)>>2]=o;break}b=c[b>>2]|0;j:do if((c[b+4>>2]&-8|0)!=(f|0)){e=f<<((e|0)==31?0:25-(e>>>1)|0);while(1){a=b+16+(e>>>31<<2)|0;d=c[a>>2]|0;if(!d)break;if((c[d+4>>2]&-8|0)==(f|0)){M=d;break j}else{e=e<<1;b=d}}if(a>>>0<(c[5190]|0)>>>0)wa();else{c[a>>2]=o;c[w+(m+24)>>2]=b;c[w+(m+12)>>2]=o;c[w+(m+8)>>2]=o;break h}}else M=b;while(0);b=M+8|0;a=c[b>>2]|0;L=c[5190]|0;if(a>>>0>=L>>>0&M>>>0>=L>>>0){c[a+12>>2]=o;c[b>>2]=o;c[w+(m+8)>>2]=a;c[w+(m+12)>>2]=M;c[w+(m+24)>>2]=0;break}else wa()}else{M=(c[5189]|0)+l|0;c[5189]=M;c[5192]=o;c[w+(m+4)>>2]=M|1}while(0);M=w+(n|8)|0;return M|0}else d=21192;while(1){a=c[d>>2]|0;if(a>>>0<=h>>>0?(b=c[d+4>>2]|0,e=a+b|0,e>>>0>h>>>0):0)break;d=c[d+8>>2]|0}f=a+(b+-39)|0;a=a+(b+-47+((f&7|0)==0?0:0-f&7))|0;f=h+16|0;a=a>>>0<f>>>0?h:a;b=a+8|0;d=w+8|0;d=(d&7|0)==0?0:0-d&7;M=p+-40-d|0;c[5192]=w+d;c[5189]=M;c[w+(d+4)>>2]=M|1;c[w+(p+-36)>>2]=40;c[5193]=c[5308];d=a+4|0;c[d>>2]=27;c[b>>2]=c[5298];c[b+4>>2]=c[5299];c[b+8>>2]=c[5300];c[b+12>>2]=c[5301];c[5298]=w;c[5299]=p;c[5301]=0;c[5300]=b;b=a+28|0;c[b>>2]=7;if((a+32|0)>>>0<e>>>0)do{M=b;b=b+4|0;c[b>>2]=7}while((M+8|0)>>>0<e>>>0);if((a|0)!=(h|0)){g=a-h|0;c[d>>2]=c[d>>2]&-2;c[h+4>>2]=g|1;c[a>>2]=g;b=g>>>3;if(g>>>0<256){a=b<<1;e=20784+(a<<2)|0;d=c[5186]|0;b=1<<b;if(d&b){b=20784+(a+2<<2)|0;a=c[b>>2]|0;if(a>>>0<(c[5190]|0)>>>0)wa();else{G=b;H=a}}else{c[5186]=d|b;G=20784+(a+2<<2)|0;H=e}c[G>>2]=h;c[H+12>>2]=h;c[h+8>>2]=H;c[h+12>>2]=e;break}b=g>>>8;if(b)if(g>>>0>16777215)e=31;else{L=(b+1048320|0)>>>16&8;M=b<<L;K=(M+520192|0)>>>16&4;M=M<<K;e=(M+245760|0)>>>16&2;e=14-(K|L|e)+(M<<e>>>15)|0;e=g>>>(e+7|0)&1|e<<1}else e=0;d=21048+(e<<2)|0;c[h+28>>2]=e;c[h+20>>2]=0;c[f>>2]=0;b=c[5187]|0;a=1<<e;if(!(b&a)){c[5187]=b|a;c[d>>2]=h;c[h+24>>2]=d;c[h+12>>2]=h;c[h+8>>2]=h;break}b=c[d>>2]|0;k:do if((c[b+4>>2]&-8|0)!=(g|0)){e=g<<((e|0)==31?0:25-(e>>>1)|0);while(1){a=b+16+(e>>>31<<2)|0;d=c[a>>2]|0;if(!d)break;if((c[d+4>>2]&-8|0)==(g|0)){I=d;break k}else{e=e<<1;b=d}}if(a>>>0<(c[5190]|0)>>>0)wa();else{c[a>>2]=h;c[h+24>>2]=b;c[h+12>>2]=h;c[h+8>>2]=h;break g}}else I=b;while(0);b=I+8|0;a=c[b>>2]|0;M=c[5190]|0;if(a>>>0>=M>>>0&I>>>0>=M>>>0){c[a+12>>2]=h;c[b>>2]=h;c[h+8>>2]=a;c[h+12>>2]=I;c[h+24>>2]=0;break}else wa()}}else{M=c[5190]|0;if((M|0)==0|w>>>0<M>>>0)c[5190]=w;c[5298]=w;c[5299]=p;c[5301]=0;c[5195]=c[5304];c[5194]=-1;b=0;do{M=b<<1;L=20784+(M<<2)|0;c[20784+(M+3<<2)>>2]=L;c[20784+(M+2<<2)>>2]=L;b=b+1|0}while((b|0)!=32);M=w+8|0;M=(M&7|0)==0?0:0-M&7;L=p+-40-M|0;c[5192]=w+M;c[5189]=L;c[w+(M+4)>>2]=L|1;c[w+(p+-36)>>2]=40;c[5193]=c[5308]}while(0);b=c[5189]|0;if(b>>>0>q>>>0){L=b-q|0;c[5189]=L;M=c[5192]|0;c[5192]=M+q;c[M+(q+4)>>2]=L|1;c[M+4>>2]=q|3;M=M+8|0;return M|0}}c[(ne()|0)>>2]=12;M=0;return M|0}function kf(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;if(!a)return;b=a+-8|0;i=c[5190]|0;if(b>>>0<i>>>0)wa();d=c[a+-4>>2]|0;e=d&3;if((e|0)==1)wa();o=d&-8;q=a+(o+-8)|0;do if(!(d&1)){b=c[b>>2]|0;if(!e)return;j=-8-b|0;l=a+j|0;m=b+o|0;if(l>>>0<i>>>0)wa();if((l|0)==(c[5191]|0)){b=a+(o+-4)|0;d=c[b>>2]|0;if((d&3|0)!=3){u=l;g=m;break}c[5188]=m;c[b>>2]=d&-2;c[a+(j+4)>>2]=m|1;c[q>>2]=m;return}f=b>>>3;if(b>>>0<256){e=c[a+(j+8)>>2]|0;d=c[a+(j+12)>>2]|0;b=20784+(f<<1<<2)|0;if((e|0)!=(b|0)){if(e>>>0<i>>>0)wa();if((c[e+12>>2]|0)!=(l|0))wa()}if((d|0)==(e|0)){c[5186]=c[5186]&~(1<<f);u=l;g=m;break}if((d|0)!=(b|0)){if(d>>>0<i>>>0)wa();b=d+8|0;if((c[b>>2]|0)==(l|0))h=b;else wa()}else h=d+8|0;c[e+12>>2]=d;c[h>>2]=e;u=l;g=m;break}h=c[a+(j+24)>>2]|0;e=c[a+(j+12)>>2]|0;do if((e|0)==(l|0)){d=a+(j+20)|0;b=c[d>>2]|0;if(!b){d=a+(j+16)|0;b=c[d>>2]|0;if(!b){k=0;break}}while(1){e=b+20|0;f=c[e>>2]|0;if(f){b=f;d=e;continue}e=b+16|0;f=c[e>>2]|0;if(!f)break;else{b=f;d=e}}if(d>>>0<i>>>0)wa();else{c[d>>2]=0;k=b;break}}else{f=c[a+(j+8)>>2]|0;if(f>>>0<i>>>0)wa();b=f+12|0;if((c[b>>2]|0)!=(l|0))wa();d=e+8|0;if((c[d>>2]|0)==(l|0)){c[b>>2]=e;c[d>>2]=f;k=e;break}else wa()}while(0);if(h){b=c[a+(j+28)>>2]|0;d=21048+(b<<2)|0;if((l|0)==(c[d>>2]|0)){c[d>>2]=k;if(!k){c[5187]=c[5187]&~(1<<b);u=l;g=m;break}}else{if(h>>>0<(c[5190]|0)>>>0)wa();b=h+16|0;if((c[b>>2]|0)==(l|0))c[b>>2]=k;else c[h+20>>2]=k;if(!k){u=l;g=m;break}}d=c[5190]|0;if(k>>>0<d>>>0)wa();c[k+24>>2]=h;b=c[a+(j+16)>>2]|0;do if(b)if(b>>>0<d>>>0)wa();else{c[k+16>>2]=b;c[b+24>>2]=k;break}while(0);b=c[a+(j+20)>>2]|0;if(b)if(b>>>0<(c[5190]|0)>>>0)wa();else{c[k+20>>2]=b;c[b+24>>2]=k;u=l;g=m;break}else{u=l;g=m}}else{u=l;g=m}}else{u=b;g=o}while(0);if(u>>>0>=q>>>0)wa();b=a+(o+-4)|0;d=c[b>>2]|0;if(!(d&1))wa();if(!(d&2)){if((q|0)==(c[5192]|0)){t=(c[5189]|0)+g|0;c[5189]=t;c[5192]=u;c[u+4>>2]=t|1;if((u|0)!=(c[5191]|0))return;c[5191]=0;c[5188]=0;return}if((q|0)==(c[5191]|0)){t=(c[5188]|0)+g|0;c[5188]=t;c[5191]=u;c[u+4>>2]=t|1;c[u+t>>2]=t;return}g=(d&-8)+g|0;f=d>>>3;do if(d>>>0>=256){h=c[a+(o+16)>>2]|0;b=c[a+(o|4)>>2]|0;do if((b|0)==(q|0)){d=a+(o+12)|0;b=c[d>>2]|0;if(!b){d=a+(o+8)|0;b=c[d>>2]|0;if(!b){p=0;break}}while(1){e=b+20|0;f=c[e>>2]|0;if(f){b=f;d=e;continue}e=b+16|0;f=c[e>>2]|0;if(!f)break;else{b=f;d=e}}if(d>>>0<(c[5190]|0)>>>0)wa();else{c[d>>2]=0;p=b;break}}else{d=c[a+o>>2]|0;if(d>>>0<(c[5190]|0)>>>0)wa();e=d+12|0;if((c[e>>2]|0)!=(q|0))wa();f=b+8|0;if((c[f>>2]|0)==(q|0)){c[e>>2]=b;c[f>>2]=d;p=b;break}else wa()}while(0);if(h){b=c[a+(o+20)>>2]|0;d=21048+(b<<2)|0;if((q|0)==(c[d>>2]|0)){c[d>>2]=p;if(!p){c[5187]=c[5187]&~(1<<b);break}}else{if(h>>>0<(c[5190]|0)>>>0)wa();b=h+16|0;if((c[b>>2]|0)==(q|0))c[b>>2]=p;else c[h+20>>2]=p;if(!p)break}d=c[5190]|0;if(p>>>0<d>>>0)wa();c[p+24>>2]=h;b=c[a+(o+8)>>2]|0;do if(b)if(b>>>0<d>>>0)wa();else{c[p+16>>2]=b;c[b+24>>2]=p;break}while(0);b=c[a+(o+12)>>2]|0;if(b)if(b>>>0<(c[5190]|0)>>>0)wa();else{c[p+20>>2]=b;c[b+24>>2]=p;break}}}else{e=c[a+o>>2]|0;d=c[a+(o|4)>>2]|0;b=20784+(f<<1<<2)|0;if((e|0)!=(b|0)){if(e>>>0<(c[5190]|0)>>>0)wa();if((c[e+12>>2]|0)!=(q|0))wa()}if((d|0)==(e|0)){c[5186]=c[5186]&~(1<<f);break}if((d|0)!=(b|0)){if(d>>>0<(c[5190]|0)>>>0)wa();b=d+8|0;if((c[b>>2]|0)==(q|0))n=b;else wa()}else n=d+8|0;c[e+12>>2]=d;c[n>>2]=e}while(0);c[u+4>>2]=g|1;c[u+g>>2]=g;if((u|0)==(c[5191]|0)){c[5188]=g;return}}else{c[b>>2]=d&-2;c[u+4>>2]=g|1;c[u+g>>2]=g}b=g>>>3;if(g>>>0<256){d=b<<1;f=20784+(d<<2)|0;e=c[5186]|0;b=1<<b;if(e&b){b=20784+(d+2<<2)|0;d=c[b>>2]|0;if(d>>>0<(c[5190]|0)>>>0)wa();else{r=b;s=d}}else{c[5186]=e|b;r=20784+(d+2<<2)|0;s=f}c[r>>2]=u;c[s+12>>2]=u;c[u+8>>2]=s;c[u+12>>2]=f;return}b=g>>>8;if(b)if(g>>>0>16777215)f=31;else{r=(b+1048320|0)>>>16&8;s=b<<r;q=(s+520192|0)>>>16&4;s=s<<q;f=(s+245760|0)>>>16&2;f=14-(q|r|f)+(s<<f>>>15)|0;f=g>>>(f+7|0)&1|f<<1}else f=0;b=21048+(f<<2)|0;c[u+28>>2]=f;c[u+20>>2]=0;c[u+16>>2]=0;d=c[5187]|0;e=1<<f;a:do if(d&e){b=c[b>>2]|0;b:do if((c[b+4>>2]&-8|0)!=(g|0)){f=g<<((f|0)==31?0:25-(f>>>1)|0);while(1){d=b+16+(f>>>31<<2)|0;e=c[d>>2]|0;if(!e)break;if((c[e+4>>2]&-8|0)==(g|0)){t=e;break b}else{f=f<<1;b=e}}if(d>>>0<(c[5190]|0)>>>0)wa();else{c[d>>2]=u;c[u+24>>2]=b;c[u+12>>2]=u;c[u+8>>2]=u;break a}}else t=b;while(0);b=t+8|0;d=c[b>>2]|0;s=c[5190]|0;if(d>>>0>=s>>>0&t>>>0>=s>>>0){c[d+12>>2]=u;c[b>>2]=u;c[u+8>>2]=d;c[u+12>>2]=t;c[u+24>>2]=0;break}else wa()}else{c[5187]=d|e;c[b>>2]=u;c[u+24>>2]=b;c[u+12>>2]=u;c[u+8>>2]=u}while(0);u=(c[5194]|0)+-1|0;c[5194]=u;if(!u)b=21200;else return;while(1){b=c[b>>2]|0;if(!b)break;else b=b+8|0}c[5194]=-1;return}function lf(a,b){a=a|0;b=b|0;var d=0;if(a){d=_(b,a)|0;if((b|a)>>>0>65535)d=((d>>>0)/(a>>>0)|0|0)==(b|0)?d:-1}else d=0;b=jf(d)|0;if(!b)return b|0;if(!(c[b+-4>>2]&3))return b|0;rf(b|0,0,d|0)|0;return b|0}function mf(a,b){a=a|0;b=b|0;var d=0,e=0;if(!a){a=jf(b)|0;return a|0}if(b>>>0>4294967231){c[(ne()|0)>>2]=12;a=0;return a|0}d=nf(a+-8|0,b>>>0<11?16:b+11&-8)|0;if(d){a=d+8|0;return a|0}d=jf(b)|0;if(!d){a=0;return a|0}e=c[a+-4>>2]|0;e=(e&-8)-((e&3|0)==0?8:4)|0;xf(d|0,a|0,(e>>>0<b>>>0?e:b)|0)|0;kf(a);a=d;return a|0}function nf(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;o=a+4|0;p=c[o>>2]|0;j=p&-8;l=a+j|0;i=c[5190]|0;d=p&3;if(!((d|0)!=1&a>>>0>=i>>>0&a>>>0<l>>>0))wa();e=a+(j|4)|0;f=c[e>>2]|0;if(!(f&1))wa();if(!d){if(b>>>0<256){a=0;return a|0}if(j>>>0>=(b+4|0)>>>0?(j-b|0)>>>0<=c[5306]<<1>>>0:0)return a|0;a=0;return a|0}if(j>>>0>=b>>>0){d=j-b|0;if(d>>>0<=15)return a|0;c[o>>2]=p&1|b|2;c[a+(b+4)>>2]=d|3;c[e>>2]=c[e>>2]|1;of(a+b|0,d);return a|0}if((l|0)==(c[5192]|0)){d=(c[5189]|0)+j|0;if(d>>>0<=b>>>0){a=0;return a|0}n=d-b|0;c[o>>2]=p&1|b|2;c[a+(b+4)>>2]=n|1;c[5192]=a+b;c[5189]=n;return a|0}if((l|0)==(c[5191]|0)){e=(c[5188]|0)+j|0;if(e>>>0<b>>>0){a=0;return a|0}d=e-b|0;if(d>>>0>15){c[o>>2]=p&1|b|2;c[a+(b+4)>>2]=d|1;c[a+e>>2]=d;e=a+(e+4)|0;c[e>>2]=c[e>>2]&-2;e=a+b|0}else{c[o>>2]=p&1|e|2;e=a+(e+4)|0;c[e>>2]=c[e>>2]|1;e=0;d=0}c[5188]=d;c[5191]=e;return a|0}if(f&2){a=0;return a|0}m=(f&-8)+j|0;if(m>>>0<b>>>0){a=0;return a|0}n=m-b|0;g=f>>>3;do if(f>>>0>=256){h=c[a+(j+24)>>2]|0;g=c[a+(j+12)>>2]|0;do if((g|0)==(l|0)){e=a+(j+20)|0;d=c[e>>2]|0;if(!d){e=a+(j+16)|0;d=c[e>>2]|0;if(!d){k=0;break}}while(1){f=d+20|0;g=c[f>>2]|0;if(g){d=g;e=f;continue}f=d+16|0;g=c[f>>2]|0;if(!g)break;else{d=g;e=f}}if(e>>>0<i>>>0)wa();else{c[e>>2]=0;k=d;break}}else{f=c[a+(j+8)>>2]|0;if(f>>>0<i>>>0)wa();d=f+12|0;if((c[d>>2]|0)!=(l|0))wa();e=g+8|0;if((c[e>>2]|0)==(l|0)){c[d>>2]=g;c[e>>2]=f;k=g;break}else wa()}while(0);if(h){d=c[a+(j+28)>>2]|0;e=21048+(d<<2)|0;if((l|0)==(c[e>>2]|0)){c[e>>2]=k;if(!k){c[5187]=c[5187]&~(1<<d);break}}else{if(h>>>0<(c[5190]|0)>>>0)wa();d=h+16|0;if((c[d>>2]|0)==(l|0))c[d>>2]=k;else c[h+20>>2]=k;if(!k)break}e=c[5190]|0;if(k>>>0<e>>>0)wa();c[k+24>>2]=h;d=c[a+(j+16)>>2]|0;do if(d)if(d>>>0<e>>>0)wa();else{c[k+16>>2]=d;c[d+24>>2]=k;break}while(0);d=c[a+(j+20)>>2]|0;if(d)if(d>>>0<(c[5190]|0)>>>0)wa();else{c[k+20>>2]=d;c[d+24>>2]=k;break}}}else{f=c[a+(j+8)>>2]|0;e=c[a+(j+12)>>2]|0;d=20784+(g<<1<<2)|0;if((f|0)!=(d|0)){if(f>>>0<i>>>0)wa();if((c[f+12>>2]|0)!=(l|0))wa()}if((e|0)==(f|0)){c[5186]=c[5186]&~(1<<g);break}if((e|0)!=(d|0)){if(e>>>0<i>>>0)wa();d=e+8|0;if((c[d>>2]|0)==(l|0))h=d;else wa()}else h=e+8|0;c[f+12>>2]=e;c[h>>2]=f}while(0);if(n>>>0<16){c[o>>2]=m|p&1|2;b=a+(m|4)|0;c[b>>2]=c[b>>2]|1;return a|0}else{c[o>>2]=p&1|b|2;c[a+(b+4)>>2]=n|3;p=a+(m|4)|0;c[p>>2]=c[p>>2]|1;of(a+b|0,n);return a|0}return 0}function of(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;q=a+b|0;d=c[a+4>>2]|0;do if(!(d&1)){k=c[a>>2]|0;if(!(d&3))return;n=a+(0-k)|0;m=k+b|0;j=c[5190]|0;if(n>>>0<j>>>0)wa();if((n|0)==(c[5191]|0)){e=a+(b+4)|0;d=c[e>>2]|0;if((d&3|0)!=3){t=n;h=m;break}c[5188]=m;c[e>>2]=d&-2;c[a+(4-k)>>2]=m|1;c[q>>2]=m;return}g=k>>>3;if(k>>>0<256){f=c[a+(8-k)>>2]|0;e=c[a+(12-k)>>2]|0;d=20784+(g<<1<<2)|0;if((f|0)!=(d|0)){if(f>>>0<j>>>0)wa();if((c[f+12>>2]|0)!=(n|0))wa()}if((e|0)==(f|0)){c[5186]=c[5186]&~(1<<g);t=n;h=m;break}if((e|0)!=(d|0)){if(e>>>0<j>>>0)wa();d=e+8|0;if((c[d>>2]|0)==(n|0))i=d;else wa()}else i=e+8|0;c[f+12>>2]=e;c[i>>2]=f;t=n;h=m;break}i=c[a+(24-k)>>2]|0;f=c[a+(12-k)>>2]|0;do if((f|0)==(n|0)){f=16-k|0;e=a+(f+4)|0;d=c[e>>2]|0;if(!d){e=a+f|0;d=c[e>>2]|0;if(!d){l=0;break}}while(1){f=d+20|0;g=c[f>>2]|0;if(g){d=g;e=f;continue}f=d+16|0;g=c[f>>2]|0;if(!g)break;else{d=g;e=f}}if(e>>>0<j>>>0)wa();else{c[e>>2]=0;l=d;break}}else{g=c[a+(8-k)>>2]|0;if(g>>>0<j>>>0)wa();d=g+12|0;if((c[d>>2]|0)!=(n|0))wa();e=f+8|0;if((c[e>>2]|0)==(n|0)){c[d>>2]=f;c[e>>2]=g;l=f;break}else wa()}while(0);if(i){d=c[a+(28-k)>>2]|0;e=21048+(d<<2)|0;if((n|0)==(c[e>>2]|0)){c[e>>2]=l;if(!l){c[5187]=c[5187]&~(1<<d);t=n;h=m;break}}else{if(i>>>0<(c[5190]|0)>>>0)wa();d=i+16|0;if((c[d>>2]|0)==(n|0))c[d>>2]=l;else c[i+20>>2]=l;if(!l){t=n;h=m;break}}f=c[5190]|0;if(l>>>0<f>>>0)wa();c[l+24>>2]=i;d=16-k|0;e=c[a+d>>2]|0;do if(e)if(e>>>0<f>>>0)wa();else{c[l+16>>2]=e;c[e+24>>2]=l;break}while(0);d=c[a+(d+4)>>2]|0;if(d)if(d>>>0<(c[5190]|0)>>>0)wa();else{c[l+20>>2]=d;c[d+24>>2]=l;t=n;h=m;break}else{t=n;h=m}}else{t=n;h=m}}else{t=a;h=b}while(0);j=c[5190]|0;if(q>>>0<j>>>0)wa();d=a+(b+4)|0;e=c[d>>2]|0;if(!(e&2)){if((q|0)==(c[5192]|0)){s=(c[5189]|0)+h|0;c[5189]=s;c[5192]=t;c[t+4>>2]=s|1;if((t|0)!=(c[5191]|0))return;c[5191]=0;c[5188]=0;return}if((q|0)==(c[5191]|0)){s=(c[5188]|0)+h|0;c[5188]=s;c[5191]=t;c[t+4>>2]=s|1;c[t+s>>2]=s;return}h=(e&-8)+h|0;g=e>>>3;do if(e>>>0>=256){i=c[a+(b+24)>>2]|0;f=c[a+(b+12)>>2]|0;do if((f|0)==(q|0)){e=a+(b+20)|0;d=c[e>>2]|0;if(!d){e=a+(b+16)|0;d=c[e>>2]|0;if(!d){p=0;break}}while(1){f=d+20|0;g=c[f>>2]|0;if(g){d=g;e=f;continue}f=d+16|0;g=c[f>>2]|0;if(!g)break;else{d=g;e=f}}if(e>>>0<j>>>0)wa();else{c[e>>2]=0;p=d;break}}else{g=c[a+(b+8)>>2]|0;if(g>>>0<j>>>0)wa();d=g+12|0;if((c[d>>2]|0)!=(q|0))wa();e=f+8|0;if((c[e>>2]|0)==(q|0)){c[d>>2]=f;c[e>>2]=g;p=f;break}else wa()}while(0);if(i){d=c[a+(b+28)>>2]|0;e=21048+(d<<2)|0;if((q|0)==(c[e>>2]|0)){c[e>>2]=p;if(!p){c[5187]=c[5187]&~(1<<d);break}}else{if(i>>>0<(c[5190]|0)>>>0)wa();d=i+16|0;if((c[d>>2]|0)==(q|0))c[d>>2]=p;else c[i+20>>2]=p;if(!p)break}e=c[5190]|0;if(p>>>0<e>>>0)wa();c[p+24>>2]=i;d=c[a+(b+16)>>2]|0;do if(d)if(d>>>0<e>>>0)wa();else{c[p+16>>2]=d;c[d+24>>2]=p;break}while(0);d=c[a+(b+20)>>2]|0;if(d)if(d>>>0<(c[5190]|0)>>>0)wa();else{c[p+20>>2]=d;c[d+24>>2]=p;break}}}else{f=c[a+(b+8)>>2]|0;e=c[a+(b+12)>>2]|0;d=20784+(g<<1<<2)|0;if((f|0)!=(d|0)){if(f>>>0<j>>>0)wa();if((c[f+12>>2]|0)!=(q|0))wa()}if((e|0)==(f|0)){c[5186]=c[5186]&~(1<<g);break}if((e|0)!=(d|0)){if(e>>>0<j>>>0)wa();d=e+8|0;if((c[d>>2]|0)==(q|0))o=d;else wa()}else o=e+8|0;c[f+12>>2]=e;c[o>>2]=f}while(0);c[t+4>>2]=h|1;c[t+h>>2]=h;if((t|0)==(c[5191]|0)){c[5188]=h;return}}else{c[d>>2]=e&-2;c[t+4>>2]=h|1;c[t+h>>2]=h}d=h>>>3;if(h>>>0<256){e=d<<1;g=20784+(e<<2)|0;f=c[5186]|0;d=1<<d;if(f&d){d=20784+(e+2<<2)|0;e=c[d>>2]|0;if(e>>>0<(c[5190]|0)>>>0)wa();else{r=d;s=e}}else{c[5186]=f|d;r=20784+(e+2<<2)|0;s=g}c[r>>2]=t;c[s+12>>2]=t;c[t+8>>2]=s;c[t+12>>2]=g;return}d=h>>>8;if(d)if(h>>>0>16777215)g=31;else{r=(d+1048320|0)>>>16&8;s=d<<r;q=(s+520192|0)>>>16&4;s=s<<q;g=(s+245760|0)>>>16&2;g=14-(q|r|g)+(s<<g>>>15)|0;g=h>>>(g+7|0)&1|g<<1}else g=0;d=21048+(g<<2)|0;c[t+28>>2]=g;c[t+20>>2]=0;c[t+16>>2]=0;e=c[5187]|0;f=1<<g;if(!(e&f)){c[5187]=e|f;c[d>>2]=t;c[t+24>>2]=d;c[t+12>>2]=t;c[t+8>>2]=t;return}d=c[d>>2]|0;a:do if((c[d+4>>2]&-8|0)!=(h|0)){g=h<<((g|0)==31?0:25-(g>>>1)|0);while(1){e=d+16+(g>>>31<<2)|0;f=c[e>>2]|0;if(!f)break;if((c[f+4>>2]&-8|0)==(h|0)){d=f;break a}else{g=g<<1;d=f}}if(e>>>0<(c[5190]|0)>>>0)wa();c[e>>2]=t;c[t+24>>2]=d;c[t+12>>2]=t;c[t+8>>2]=t;return}while(0);e=d+8|0;f=c[e>>2]|0;s=c[5190]|0;if(!(f>>>0>=s>>>0&d>>>0>=s>>>0))wa();c[f+12>>2]=t;c[e>>2]=t;c[t+8>>2]=f;c[t+12>>2]=d;c[t+24>>2]=0;return}function pf(){}function qf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;d=b-d-(c>>>0>a>>>0|0)>>>0;return (C=d,a-c>>>0|0)|0}function rf(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b+e|0;if((e|0)>=20){d=d&255;h=b&3;i=d|d<<8|d<<16|d<<24;g=f&~3;if(h){h=b+4-h|0;while((b|0)<(h|0)){a[b>>0]=d;b=b+1|0}}while((b|0)<(g|0)){c[b>>2]=i;b=b+4|0}}while((b|0)<(f|0)){a[b>>0]=d;b=b+1|0}return b-e|0}function sf(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){C=b<<c|(a&(1<<c)-1<<32-c)>>>32-c;return a<<c}C=a<<c-32;return 0}function tf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;c=a+c>>>0;return (C=b+d+(c>>>0<a>>>0|0)>>>0,c|0)|0}function uf(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;p=p+1|0;c[a>>2]=p;while((f|0)<(e|0)){if(!(c[d+(f<<3)>>2]|0)){c[d+(f<<3)>>2]=p;c[d+((f<<3)+4)>>2]=b;c[d+((f<<3)+8)>>2]=0;C=e;return d|0}f=f+1|0}e=e*2|0;d=mf(d|0,8*(e+1|0)|0)|0;d=uf(a|0,b|0,d|0,e|0)|0;C=e;return d|0}function vf(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){C=b>>>c;return a>>>c|(b&(1<<c)-1)<<32-c}C=0;return b>>>c-32|0}function wf(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;while((f|0)<(d|0)){e=c[b+(f<<3)>>2]|0;if(!e)break;if((e|0)==(a|0))return c[b+((f<<3)+4)>>2]|0;f=f+1|0}return 0}function xf(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;if((e|0)>=4096)return Ba(b|0,d|0,e|0)|0;f=b|0;if((b&3)==(d&3)){while(b&3){if(!e)return f|0;a[b>>0]=a[d>>0]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b>>0]=a[d>>0]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function yf(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){C=b>>c;return a>>>c|(b&(1<<c)-1)<<32-c}C=(b|0)<0?-1:0;return b>>c-32|0}function zf(b){b=b|0;var c=0;c=a[m+(b&255)>>0]|0;if((c|0)<8)return c|0;c=a[m+(b>>8&255)>>0]|0;if((c|0)<8)return c+8|0;c=a[m+(b>>16&255)>>0]|0;if((c|0)<8)return c+16|0;return (a[m+(b>>>24)>>0]|0)+24|0}function Af(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;f=a&65535;e=b&65535;c=_(e,f)|0;d=a>>>16;a=(c>>>16)+(_(e,d)|0)|0;e=b>>>16;b=_(e,f)|0;return (C=(a>>>16)+(_(e,d)|0)+(((a&65535)+b|0)>>>16)|0,a+b<<16|c&65535|0)|0}function Bf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;j=b>>31|((b|0)<0?-1:0)<<1;i=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;f=d>>31|((d|0)<0?-1:0)<<1;e=((d|0)<0?-1:0)>>31|((d|0)<0?-1:0)<<1;h=qf(j^a,i^b,j,i)|0;g=C;a=f^j;b=e^i;return qf((Gf(h,g,qf(f^c,e^d,f,e)|0,C,0)|0)^a,C^b,a,b)|0}function Cf(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;i=i+16|0;j=f|0;h=b>>31|((b|0)<0?-1:0)<<1;g=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;l=e>>31|((e|0)<0?-1:0)<<1;k=((e|0)<0?-1:0)>>31|((e|0)<0?-1:0)<<1;a=qf(h^a,g^b,h,g)|0;b=C;Gf(a,b,qf(l^d,k^e,l,k)|0,C,j)|0;e=qf(c[j>>2]^h,c[j+4>>2]^g,h,g)|0;d=C;i=f;return (C=d,e)|0}function Df(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=a;f=c;c=Af(e,f)|0;a=C;return (C=(_(b,f)|0)+(_(d,e)|0)+a|a&0,c|0|0)|0}function Ef(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return Gf(a,b,c,d,0)|0}function Ff(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;g=i;i=i+16|0;f=g|0;Gf(a,b,d,e,f)|0;i=g;return (C=c[f+4>>2]|0,c[f>>2]|0)|0}function Gf(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;l=a;j=b;k=j;h=d;n=e;i=n;if(!k){g=(f|0)!=0;if(!i){if(g){c[f>>2]=(l>>>0)%(h>>>0);c[f+4>>2]=0}n=0;f=(l>>>0)/(h>>>0)>>>0;return (C=n,f)|0}else{if(!g){n=0;f=0;return (C=n,f)|0}c[f>>2]=a|0;c[f+4>>2]=b&0;n=0;f=0;return (C=n,f)|0}}g=(i|0)==0;do if(h){if(!g){g=(aa(i|0)|0)-(aa(k|0)|0)|0;if(g>>>0<=31){m=g+1|0;i=31-g|0;b=g-31>>31;h=m;a=l>>>(m>>>0)&b|k<<i;b=k>>>(m>>>0)&b;g=0;i=l<<i;break}if(!f){n=0;f=0;return (C=n,f)|0}c[f>>2]=a|0;c[f+4>>2]=j|b&0;n=0;f=0;return (C=n,f)|0}g=h-1|0;if(g&h){i=(aa(h|0)|0)+33-(aa(k|0)|0)|0;p=64-i|0;m=32-i|0;j=m>>31;o=i-32|0;b=o>>31;h=i;a=m-1>>31&k>>>(o>>>0)|(k<<m|l>>>(i>>>0))&b;b=b&k>>>(i>>>0);g=l<<p&j;i=(k<<p|l>>>(o>>>0))&j|l<<m&i-33>>31;break}if(f){c[f>>2]=g&l;c[f+4>>2]=0}if((h|0)==1){o=j|b&0;p=a|0|0;return (C=o,p)|0}else{p=zf(h|0)|0;o=k>>>(p>>>0)|0;p=k<<32-p|l>>>(p>>>0)|0;return (C=o,p)|0}}else{if(g){if(f){c[f>>2]=(k>>>0)%(h>>>0);c[f+4>>2]=0}o=0;p=(k>>>0)/(h>>>0)>>>0;return (C=o,p)|0}if(!l){if(f){c[f>>2]=0;c[f+4>>2]=(k>>>0)%(i>>>0)}o=0;p=(k>>>0)/(i>>>0)>>>0;return (C=o,p)|0}g=i-1|0;if(!(g&i)){if(f){c[f>>2]=a|0;c[f+4>>2]=g&k|b&0}o=0;p=k>>>((zf(i|0)|0)>>>0);return (C=o,p)|0}g=(aa(i|0)|0)-(aa(k|0)|0)|0;if(g>>>0<=30){b=g+1|0;i=31-g|0;h=b;a=k<<i|l>>>(b>>>0);b=k>>>(b>>>0);g=0;i=l<<i;break}if(!f){o=0;p=0;return (C=o,p)|0}c[f>>2]=a|0;c[f+4>>2]=j|b&0;o=0;p=0;return (C=o,p)|0}while(0);if(!h){k=i;j=0;i=0}else{m=d|0|0;l=n|e&0;k=tf(m|0,l|0,-1,-1)|0;d=C;j=i;i=0;do{e=j;j=g>>>31|j<<1;g=i|g<<1;e=a<<1|e>>>31|0;n=a>>>31|b<<1|0;qf(k,d,e,n)|0;p=C;o=p>>31|((p|0)<0?-1:0)<<1;i=o&1;a=qf(e,n,o&m,(((p|0)<0?-1:0)>>31|((p|0)<0?-1:0)<<1)&l)|0;b=C;h=h-1|0}while((h|0)!=0);k=j;j=0}h=0;if(f){c[f>>2]=a;c[f+4>>2]=b}o=(g|0)>>>31|(k|h)<<1|(h<<1|g>>>31)&0|j;p=(g<<1|0>>>31)&-2|i;return (C=o,p)|0}function Hf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return Ia[a&7](b|0,c|0,d|0)|0}function If(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;Ja[a&0](b|0,c|0,d|0,e|0,f|0)}function Jf(a,b){a=a|0;b=b|0;Ka[a&63](b|0)}function Kf(a,b,c){a=a|0;b=b|0;c=c|0;La[a&15](b|0,c|0)}function Lf(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;return Ma[a&3](b|0,c|0,d|0,e|0,f|0,g|0)|0}function Mf(a,b){a=a|0;b=b|0;return Na[a&15](b|0)|0}function Nf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;Oa[a&7](b|0,c|0,d|0)}function Of(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return Pa[a&3](b|0,c|0,d|0,e|0)|0}function Pf(a,b,c){a=a|0;b=b|0;c=c|0;return Qa[a&31](b|0,c|0)|0}function Qf(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;return Ra[a&3](b|0,c|0,d|0,e|0,f|0)|0}function Rf(a,b,c){a=a|0;b=b|0;c=c|0;ba(0);return 0}function Sf(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;ba(1)}function Tf(a){a=a|0;ba(2)}function Uf(a,b){a=a|0;b=b|0;ba(3)}function Vf(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;ba(4);return 0}function Wf(a){a=a|0;ba(5);return 0}function Xf(a,b,c){a=a|0;b=b|0;c=c|0;ba(6)}function Yf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;ba(7);return 0}function Zf(a,b){a=a|0;b=b|0;ba(8);return 0}function _f(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;ba(9);return 0}

// EMSCRIPTEN_END_FUNCS
var Ia=[Rf,hf,Me,Be,jb,Jc,Kc,af];var Ja=[Sf];var Ka=[Tf,ab,_b,lb,tb,vb,xb,yb,zb,Ab,Bb,cc,ec,ic,hc,nc,oc,pc,tc,Bc,Dc,Fc,Pc,Tc,ed,qd,pd,Ed,Fd,Gd,Kd,Ld,Vd,Wd,be,ce,cf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf,Tf];var La=[Uf,bb,kb,Db,Wb,gc,Cc,Ec,Sc,dd,od,Uf,Uf,Uf,Uf,Uf];var Ma=[Vf,Nc,Oc,Vf];var Na=[Wf,Ne,dc,jc,mc,uc,vc,wc,xc,Xd,Zd,Wf,Wf,Wf,Wf,Wf];var Oa=[Xf,Zb,fc,sb,bc,Cb,Xf,Xf];var Pa=[Yf,Lc,Mc,Yf];var Qa=[Zf,Xb,qc,gd,hd,id,jd,kd,rd,sd,td,ud,vd,wd,Md,Nd,Od,Pd,Qd,Yd,_d,de,ee,fe,ge,je,ie,Zf,Zf,Zf,Zf,Zf];var Ra=[_f,Qc,Rc,_f];return{_testSetjmp:wf,_saveSetjmp:uf,_embed:gb,_save:eb,_realloc:mf,_i64Add:tf,_extract:ib,_i64Subtract:qf,_memset:rf,_malloc:jf,_memcpy:xf,_reset:hb,_destroy:fb,_bitshift64Lshr:vf,_free:kf,_export_globals:cb,_bitshift64Shl:sf,_load:db,_main:$a,runPostSets:pf,stackAlloc:Sa,stackSave:Ta,stackRestore:Ua,establishStackSpace:Va,setThrew:Wa,setTempRet0:Za,getTempRet0:_a,dynCall_iiii:Hf,dynCall_viiiii:If,dynCall_vi:Jf,dynCall_vii:Kf,dynCall_iiiiiii:Lf,dynCall_ii:Mf,dynCall_viii:Nf,dynCall_iiiii:Of,dynCall_iii:Pf,dynCall_iiiiii:Qf}})


// EMSCRIPTEN_END_ASM
(Module.asmGlobalArg,Module.asmLibraryArg,buffer);var _main=Module["_main"]=asm["_main"];var _testSetjmp=Module["_testSetjmp"]=asm["_testSetjmp"];var _saveSetjmp=Module["_saveSetjmp"]=asm["_saveSetjmp"];var _embed=Module["_embed"]=asm["_embed"];var _save=Module["_save"]=asm["_save"];var _realloc=Module["_realloc"]=asm["_realloc"];var _i64Add=Module["_i64Add"]=asm["_i64Add"];var runPostSets=Module["runPostSets"]=asm["runPostSets"];var _extract=Module["_extract"]=asm["_extract"];var _i64Subtract=Module["_i64Subtract"]=asm["_i64Subtract"];var _memset=Module["_memset"]=asm["_memset"];var _malloc=Module["_malloc"]=asm["_malloc"];var _memcpy=Module["_memcpy"]=asm["_memcpy"];var _load=Module["_load"]=asm["_load"];var _destroy=Module["_destroy"]=asm["_destroy"];var _bitshift64Lshr=Module["_bitshift64Lshr"]=asm["_bitshift64Lshr"];var _free=Module["_free"]=asm["_free"];var _bitshift64Shl=Module["_bitshift64Shl"]=asm["_bitshift64Shl"];var _reset=Module["_reset"]=asm["_reset"];var _export_globals=Module["_export_globals"]=asm["_export_globals"];var dynCall_iiii=Module["dynCall_iiii"]=asm["dynCall_iiii"];var dynCall_viiiii=Module["dynCall_viiiii"]=asm["dynCall_viiiii"];var dynCall_vi=Module["dynCall_vi"]=asm["dynCall_vi"];var dynCall_vii=Module["dynCall_vii"]=asm["dynCall_vii"];var dynCall_iiiiiii=Module["dynCall_iiiiiii"]=asm["dynCall_iiiiiii"];var dynCall_ii=Module["dynCall_ii"]=asm["dynCall_ii"];var dynCall_viii=Module["dynCall_viii"]=asm["dynCall_viii"];var dynCall_iiiii=Module["dynCall_iiiii"]=asm["dynCall_iiiii"];var dynCall_iii=Module["dynCall_iii"]=asm["dynCall_iii"];var dynCall_iiiiii=Module["dynCall_iiiiii"]=asm["dynCall_iiiiii"];Runtime.stackAlloc=asm["stackAlloc"];Runtime.stackSave=asm["stackSave"];Runtime.stackRestore=asm["stackRestore"];Runtime.establishStackSpace=asm["establishStackSpace"];Runtime.setTempRet0=asm["setTempRet0"];Runtime.getTempRet0=asm["getTempRet0"];if(memoryInitializer)((function(s){var i,n=s.length;for(i=0;i<n;++i){HEAPU8[Runtime.GLOBAL_BASE+i]=s.charCodeAt(i)}}))(memoryInitializer);function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}ExitStatus.prototype=new Error;ExitStatus.prototype.constructor=ExitStatus;var initialStackTop;var preloadStartTime=null;var calledMain=false;dependenciesFulfilled=function runCaller(){if(!Module["calledRun"])run();if(!Module["calledRun"])dependenciesFulfilled=runCaller};Module["callMain"]=Module.callMain=function callMain(args){assert(runDependencies==0,"cannot call main when async dependencies remain! (listen on __ATMAIN__)");assert(__ATPRERUN__.length==0,"cannot call main when preRun functions remain to be called");args=args||[];ensureInitRuntime();var argc=args.length+1;function pad(){for(var i=0;i<4-1;i++){argv.push(0)}}var argv=[allocate(intArrayFromString(Module["thisProgram"]),"i8",ALLOC_NORMAL)];pad();for(var i=0;i<argc-1;i=i+1){argv.push(allocate(intArrayFromString(args[i]),"i8",ALLOC_NORMAL));pad()}argv.push(0);argv=allocate(argv,"i32",ALLOC_NORMAL);try{var ret=Module["_main"](argc,argv,0);exit(ret,true)}catch(e){if(e instanceof ExitStatus){return}else if(e=="SimulateInfiniteLoop"){Module["noExitRuntime"]=true;return}else{if(e&&typeof e==="object"&&e.stack)Module.printErr("exception thrown: "+[e,e.stack]);throw e}}finally{calledMain=true}};function run(args){args=args||Module["arguments"];if(preloadStartTime===null)preloadStartTime=Date.now();if(runDependencies>0){return}preRun();if(runDependencies>0)return;if(Module["calledRun"])return;function doRun(){if(Module["calledRun"])return;Module["calledRun"]=true;if(ABORT)return;ensureInitRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();if(Module["_main"]&&shouldRunNow)Module["callMain"](args);postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout((function(){setTimeout((function(){Module["setStatus"]("")}),1);doRun()}),1)}else{doRun()}}Module["run"]=Module.run=run;function exit(status,implicit){if(implicit&&Module["noExitRuntime"]){return}if(Module["noExitRuntime"]){}else{ABORT=true;EXITSTATUS=status;STACKTOP=initialStackTop;exitRuntime();if(Module["onExit"])Module["onExit"](status)}if(ENVIRONMENT_IS_NODE){process["stdout"]["once"]("drain",(function(){process["exit"](status)}));console.log(" ");setTimeout((function(){process["exit"](status)}),500)}else if(ENVIRONMENT_IS_SHELL&&typeof quit==="function"){quit(status)}throw new ExitStatus(status)}Module["exit"]=Module.exit=exit;var abortDecorators=[];function abort(what){if(what!==undefined){Module.print(what);Module.printErr(what);what=JSON.stringify(what)}else{what=""}ABORT=true;EXITSTATUS=1;var extra="\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";var output="abort("+what+") at "+stackTrace()+extra;if(abortDecorators){abortDecorators.forEach((function(decorator){output=decorator(output,what)}))}throw output}Module["abort"]=Module.abort=abort;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}var shouldRunNow=true;if(Module["noInitialRun"]){shouldRunNow=false}Module["noExitRuntime"]=true;run();var globalNames=["resultOK","resultInvalidColourSpace","resultInvalidBlockSize","resultCantAllocateMemory","resultTooBigImage","key","dataBuffer","dataLength","horizontalBlocksCount","verticalBlocksCount","coefficientsCount","usableCoefficientsCount","oneCoefficientsCount","guaranteedCapacity","maximumCapacity","expectedCapacity","extractableLength"];var globalPointersArray=kernel.ccall("export_globals","number",[],[]);var globalPointers=new Map;for(var i=0;i<globalNames.length;++i){globalPointers.set(globalNames[i],kernel.getValue(globalPointersArray+i*4,"i32"))}var errors=new Map([[globalPointers.get("resultInvalidColourSpace"),invalidColourSpaceError],[globalPointers.get("resultInvalidBlockSize"),invalidBlockSizeError],[globalPointers.get("resultCantAllocateMemory"),cantAllocateMemoryError],[globalPointers.get("resultTooBigImage"),tooBigImageError]]);var getError=(function(pointer){if(errors.has(pointer)){return errors.get(pointer)}else{return new Error(kernel.Pointer_stringify(pointer))}});var bufferLength=0;var buffer=0;var imageProperties=null;var expandBuffer=(function(neededBufferLength){if(neededBufferLength>bufferLength){try{buffer=kernel.ccall("realloc","number",["number","number"],[buffer,neededBufferLength])}catch(exception){throw cantAllocateMemoryError}bufferLength=neededBufferLength}});this.load=(function(image,key){if(imageProperties!==null){kernel.ccall("destroy",null,[],[]);imageProperties=null}expandBuffer(Math.floor(image.length*1.2));kernel.setValue(globalPointers.get("dataBuffer"),buffer,"i32");kernel.setValue(globalPointers.get("dataLength"),image.length,"i32");kernel.HEAPU8.set(image,buffer);kernel.HEAPU8.set(key,globalPointers.get("key"));var result;try{result=kernel.ccall("load","number",[],[])}catch(exception){throw cantAllocateMemoryError}if(result!==globalPointers.get("resultOK")){throw getError(result)}var unpackArrayOfK=(function(pointer){var array=kernel.getValue(pointer,"i32");var result=new Map;for(var i=0;i<7;++i){result.set(i+1,kernel.getValue(array+i*4,"i32"))}return result});imageProperties={"horizontalBlocksCount":kernel.getValue(globalPointers.get("horizontalBlocksCount"),"i32"),"verticalBlocksCount":kernel.getValue(globalPointers.get("verticalBlocksCount"),"i32"),"coefficientsCount":kernel.getValue(globalPointers.get("coefficientsCount"),"i32"),"usableCoefficientsCount":kernel.getValue(globalPointers.get("usableCoefficientsCount"),"i32"),"oneCoefficientsCount":kernel.getValue(globalPointers.get("oneCoefficientsCount"),"i32"),"guaranteedCapacity":unpackArrayOfK(globalPointers.get("guaranteedCapacity")),"maximumCapacity":unpackArrayOfK(globalPointers.get("maximumCapacity")),"expectedCapacity":unpackArrayOfK(globalPointers.get("expectedCapacity")),"extractableLength":unpackArrayOfK(globalPointers.get("extractableLength"))};return imageProperties});this.save=(function(){kernel.setValue(globalPointers.get("dataLength"),bufferLength,"i32");var result;try{result=kernel.ccall("save","number",[],[])}catch(exception){throw cantAllocateMemoryError}if(result!==globalPointers.get("resultOK")){throw getError(result)}buffer=kernel.getValue(globalPointers.get("dataBuffer"),"i32");bufferLength=kernel.getValue(globalPointers.get("dataLength"),"i32");return new Uint8Array(kernel.HEAPU8.subarray(buffer,buffer+bufferLength))});this.embed=(function(data,k){var neededBufferLength=Math.min(data.length,imageProperties.maximumCapacity.get(k));expandBuffer(neededBufferLength);kernel.setValue(globalPointers.get("dataBuffer"),buffer,"i32");kernel.setValue(globalPointers.get("dataLength"),neededBufferLength,"i32");kernel.HEAPU8.set(data.subarray(0,neededBufferLength),buffer);return kernel.ccall("embed","number",["number"],[k])});this.reset=(function(){kernel.ccall("reset",null,[],[])});this.extract=(function(){var neededBufferLength=0;for(var k=1;k<=7;++k){neededBufferLength+=imageProperties.extractableLength.get(k)}expandBuffer(neededBufferLength);kernel.setValue(globalPointers.get("dataBuffer"),buffer,"i32");kernel.ccall("extract",null,[],[]);var result=new Map;var data=buffer;for(var k=1;k<=7;++k){var dataLength=imageProperties.extractableLength.get(k);result.set(k,new Uint8Array(kernel.HEAPU8.subarray(data,data+dataLength)));data+=dataLength}return result})});var Simple=(function(memory){if(arguments.length<1){memory=16*1024*1024}var raw=new Raw(memory);var expandMemory=(function(callback){return(function(){while(true){try{return callback.apply(this,arguments)}catch(exception){if(exception===cantAllocateMemoryError){raw=new Raw(memory*2);memory*=2}else{throw exception}}}})});this.embed=expandMemory((function(data,image,key){var properties=raw.load(image,key);var k=7,embeddedLength=0;for(;k>1;--k){if(properties.expectedCapacity.get(k)>=data.length){break}}while(true){embeddedLength=raw.embed(data,k);if(k>1&&embeddedLength<data.length){--k;raw.reset()}else{break}}return{"containerProperties":properties,"k":k,"embeddedLength":embeddedLength,"image":raw.save()}}));this.extract=expandMemory((function(image,key){raw.load(image,key);return raw.extract()}))});this.invalidColourSpaceError=invalidColourSpaceError;this.invalidBlockSizeError=invalidBlockSizeError;this.cantAllocateMemoryError=cantAllocateMemoryError;this.tooBigImageError=tooBigImageError;this.Raw=Raw;this.Simple=Simple})





/* Zepto v1.1.4 - zepto event ajax form ie - zeptojs.com/license */
var Zepto=function(){function L(t){return null==t?String(t):j[S.call(t)]||"object"}function Z(t){return"function"==L(t)}function $(t){return null!=t&&t==t.window}function _(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function D(t){return"object"==L(t)}function R(t){return D(t)&&!$(t)&&Object.getPrototypeOf(t)==Object.prototype}function M(t){return"number"==typeof t.length}function k(t){return s.call(t,function(t){return null!=t})}function z(t){return t.length>0?n.fn.concat.apply([],t):t}function F(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function q(t){return t in f?f[t]:f[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function H(t,e){return"number"!=typeof e||c[F(t)]?e:e+"px"}function I(t){var e,n;return u[t]||(e=a.createElement(t),a.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),u[t]=n),u[t]}function V(t){return"children"in t?o.call(t.children):n.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function B(n,i,r){for(e in i)r&&(R(i[e])||A(i[e]))?(R(i[e])&&!R(n[e])&&(n[e]={}),A(i[e])&&!A(n[e])&&(n[e]=[]),B(n[e],i[e],r)):i[e]!==t&&(n[e]=i[e])}function U(t,e){return null==e?n(t):n(t).filter(e)}function J(t,e,n,i){return Z(e)?e.call(t,n,i):e}function X(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function W(e,n){var i=e.className,r=i&&i.baseVal!==t;return n===t?r?i.baseVal:i:void(r?i.baseVal=n:e.className=n)}function Y(t){var e;try{return t?"true"==t||("false"==t?!1:"null"==t?null:/^0/.test(t)||isNaN(e=Number(t))?/^[\[\{]/.test(t)?n.parseJSON(t):t:e):t}catch(i){return t}}function G(t,e){e(t);for(var n=0,i=t.childNodes.length;i>n;n++)G(t.childNodes[n],e)}var t,e,n,i,C,N,r=[],o=r.slice,s=r.filter,a=window.document,u={},f={},c={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},l=/^\s*<(\w+|!)[^>]*>/,h=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,p=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,d=/^(?:body|html)$/i,m=/([A-Z])/g,g=["val","css","html","text","data","width","height","offset"],v=["after","prepend","before","append"],y=a.createElement("table"),x=a.createElement("tr"),b={tr:a.createElement("tbody"),tbody:y,thead:y,tfoot:y,td:x,th:x,"*":a.createElement("div")},w=/complete|loaded|interactive/,E=/^[\w-]*$/,j={},S=j.toString,T={},O=a.createElement("div"),P={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},A=Array.isArray||function(t){return t instanceof Array};return T.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var i,r=t.parentNode,o=!r;return o&&(r=O).appendChild(t),i=~T.qsa(r,e).indexOf(t),o&&O.removeChild(t),i},C=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},N=function(t){return s.call(t,function(e,n){return t.indexOf(e)==n})},T.fragment=function(e,i,r){var s,u,f;return h.test(e)&&(s=n(a.createElement(RegExp.$1))),s||(e.replace&&(e=e.replace(p,"<$1></$2>")),i===t&&(i=l.test(e)&&RegExp.$1),i in b||(i="*"),f=b[i],f.innerHTML=""+e,s=n.each(o.call(f.childNodes),function(){f.removeChild(this)})),R(r)&&(u=n(s),n.each(r,function(t,e){g.indexOf(t)>-1?u[t](e):u.attr(t,e)})),s},T.Z=function(t,e){return t=t||[],t.__proto__=n.fn,t.selector=e||"",t},T.isZ=function(t){return t instanceof T.Z},T.init=function(e,i){var r;if(!e)return T.Z();if("string"==typeof e)if(e=e.trim(),"<"==e[0]&&l.test(e))r=T.fragment(e,RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=T.qsa(a,e)}else{if(Z(e))return n(a).ready(e);if(T.isZ(e))return e;if(A(e))r=k(e);else if(D(e))r=[e],e=null;else if(l.test(e))r=T.fragment(e.trim(),RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=T.qsa(a,e)}}return T.Z(r,e)},n=function(t,e){return T.init(t,e)},n.extend=function(t){var e,n=o.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){B(t,n,e)}),t},T.qsa=function(t,e){var n,i="#"==e[0],r=!i&&"."==e[0],s=i||r?e.slice(1):e,a=E.test(s);return _(t)&&a&&i?(n=t.getElementById(s))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:o.call(a&&!i?r?t.getElementsByClassName(s):t.getElementsByTagName(e):t.querySelectorAll(e))},n.contains=a.documentElement.contains?function(t,e){return t!==e&&t.contains(e)}:function(t,e){for(;e&&(e=e.parentNode);)if(e===t)return!0;return!1},n.type=L,n.isFunction=Z,n.isWindow=$,n.isArray=A,n.isPlainObject=R,n.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},n.inArray=function(t,e,n){return r.indexOf.call(e,t,n)},n.camelCase=C,n.trim=function(t){return null==t?"":String.prototype.trim.call(t)},n.uuid=0,n.support={},n.expr={},n.map=function(t,e){var n,r,o,i=[];if(M(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&i.push(n);else for(o in t)n=e(t[o],o),null!=n&&i.push(n);return z(i)},n.each=function(t,e){var n,i;if(M(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(i in t)if(e.call(t[i],i,t[i])===!1)return t;return t},n.grep=function(t,e){return s.call(t,e)},window.JSON&&(n.parseJSON=JSON.parse),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){j["[object "+e+"]"]=e.toLowerCase()}),n.fn={forEach:r.forEach,reduce:r.reduce,push:r.push,sort:r.sort,indexOf:r.indexOf,concat:r.concat,map:function(t){return n(n.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return n(o.apply(this,arguments))},ready:function(t){return w.test(a.readyState)&&a.body?t(n):a.addEventListener("DOMContentLoaded",function(){t(n)},!1),this},get:function(e){return e===t?o.call(this):this[e>=0?e:e+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return r.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return Z(t)?this.not(this.not(t)):n(s.call(this,function(e){return T.matches(e,t)}))},add:function(t,e){return n(N(this.concat(n(t,e))))},is:function(t){return this.length>0&&T.matches(this[0],t)},not:function(e){var i=[];if(Z(e)&&e.call!==t)this.each(function(t){e.call(this,t)||i.push(this)});else{var r="string"==typeof e?this.filter(e):M(e)&&Z(e.item)?o.call(e):n(e);this.forEach(function(t){r.indexOf(t)<0&&i.push(t)})}return n(i)},has:function(t){return this.filter(function(){return D(t)?n.contains(this,t):n(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!D(t)?t:n(t)},last:function(){var t=this[this.length-1];return t&&!D(t)?t:n(t)},find:function(t){var e,i=this;return e=t?"object"==typeof t?n(t).filter(function(){var t=this;return r.some.call(i,function(e){return n.contains(e,t)})}):1==this.length?n(T.qsa(this[0],t)):this.map(function(){return T.qsa(this,t)}):[]},closest:function(t,e){var i=this[0],r=!1;for("object"==typeof t&&(r=n(t));i&&!(r?r.indexOf(i)>=0:T.matches(i,t));)i=i!==e&&!_(i)&&i.parentNode;return n(i)},parents:function(t){for(var e=[],i=this;i.length>0;)i=n.map(i,function(t){return(t=t.parentNode)&&!_(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return U(e,t)},parent:function(t){return U(N(this.pluck("parentNode")),t)},children:function(t){return U(this.map(function(){return V(this)}),t)},contents:function(){return this.map(function(){return o.call(this.childNodes)})},siblings:function(t){return U(this.map(function(t,e){return s.call(V(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return n.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=I(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=Z(t);if(this[0]&&!e)var i=n(t).get(0),r=i.parentNode||this.length>1;return this.each(function(o){n(this).wrapAll(e?t.call(this,o):r?i.cloneNode(!0):i)})},wrapAll:function(t){if(this[0]){n(this[0]).before(t=n(t));for(var e;(e=t.children()).length;)t=e.first();n(t).append(this)}return this},wrapInner:function(t){var e=Z(t);return this.each(function(i){var r=n(this),o=r.contents(),s=e?t.call(this,i):t;o.length?o.wrapAll(s):r.append(s)})},unwrap:function(){return this.parent().each(function(){n(this).replaceWith(n(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var i=n(this);(e===t?"none"==i.css("display"):e)?i.show():i.hide()})},prev:function(t){return n(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return n(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0 in arguments?this.each(function(e){var i=this.innerHTML;n(this).empty().append(J(this,t,e,i))}):0 in this?this[0].innerHTML:null},text:function(t){return 0 in arguments?this.each(function(e){var n=J(this,t,e,this.textContent);this.textContent=null==n?"":""+n}):0 in this?this[0].textContent:null},attr:function(n,i){var r;return"string"!=typeof n||1 in arguments?this.each(function(t){if(1===this.nodeType)if(D(n))for(e in n)X(this,e,n[e]);else X(this,n,J(this,i,t,this.getAttribute(n)))}):this.length&&1===this[0].nodeType?!(r=this[0].getAttribute(n))&&n in this[0]?this[0][n]:r:t},removeAttr:function(t){return this.each(function(){1===this.nodeType&&X(this,t)})},prop:function(t,e){return t=P[t]||t,1 in arguments?this.each(function(n){this[t]=J(this,e,n,this[t])}):this[0]&&this[0][t]},data:function(e,n){var i="data-"+e.replace(m,"-$1").toLowerCase(),r=1 in arguments?this.attr(i,n):this.attr(i);return null!==r?Y(r):t},val:function(t){return 0 in arguments?this.each(function(e){this.value=J(this,t,e,this.value)}):this[0]&&(this[0].multiple?n(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value)},offset:function(t){if(t)return this.each(function(e){var i=n(this),r=J(this,t,e,i.offset()),o=i.offsetParent().offset(),s={top:r.top-o.top,left:r.left-o.left};"static"==i.css("position")&&(s.position="relative"),i.css(s)});if(!this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(t,i){if(arguments.length<2){var r=this[0],o=getComputedStyle(r,"");if(!r)return;if("string"==typeof t)return r.style[C(t)]||o.getPropertyValue(t);if(A(t)){var s={};return n.each(A(t)?t:[t],function(t,e){s[e]=r.style[C(e)]||o.getPropertyValue(e)}),s}}var a="";if("string"==L(t))i||0===i?a=F(t)+":"+H(t,i):this.each(function(){this.style.removeProperty(F(t))});else for(e in t)t[e]||0===t[e]?a+=F(e)+":"+H(e,t[e])+";":this.each(function(){this.style.removeProperty(F(e))});return this.each(function(){this.style.cssText+=";"+a})},index:function(t){return t?this.indexOf(n(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?r.some.call(this,function(t){return this.test(W(t))},q(t)):!1},addClass:function(t){return t?this.each(function(e){i=[];var r=W(this),o=J(this,t,e,r);o.split(/\s+/g).forEach(function(t){n(this).hasClass(t)||i.push(t)},this),i.length&&W(this,r+(r?" ":"")+i.join(" "))}):this},removeClass:function(e){return this.each(function(n){return e===t?W(this,""):(i=W(this),J(this,e,n,i).split(/\s+/g).forEach(function(t){i=i.replace(q(t)," ")}),void W(this,i.trim()))})},toggleClass:function(e,i){return e?this.each(function(r){var o=n(this),s=J(this,e,r,W(this));s.split(/\s+/g).forEach(function(e){(i===t?!o.hasClass(e):i)?o.addClass(e):o.removeClass(e)})}):this},scrollTop:function(e){if(this.length){var n="scrollTop"in this[0];return e===t?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=e}:function(){this.scrollTo(this.scrollX,e)})}},scrollLeft:function(e){if(this.length){var n="scrollLeft"in this[0];return e===t?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=e}:function(){this.scrollTo(e,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),i=this.offset(),r=d.test(e[0].nodeName)?{top:0,left:0}:e.offset();return i.top-=parseFloat(n(t).css("margin-top"))||0,i.left-=parseFloat(n(t).css("margin-left"))||0,r.top+=parseFloat(n(e[0]).css("border-top-width"))||0,r.left+=parseFloat(n(e[0]).css("border-left-width"))||0,{top:i.top-r.top,left:i.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||a.body;t&&!d.test(t.nodeName)&&"static"==n(t).css("position");)t=t.offsetParent;return t})}},n.fn.detach=n.fn.remove,["width","height"].forEach(function(e){var i=e.replace(/./,function(t){return t[0].toUpperCase()});n.fn[e]=function(r){var o,s=this[0];return r===t?$(s)?s["inner"+i]:_(s)?s.documentElement["scroll"+i]:(o=this.offset())&&o[e]:this.each(function(t){s=n(this),s.css(e,J(this,r,t,s[e]()))})}}),v.forEach(function(t,e){var i=e%2;n.fn[t]=function(){var t,o,r=n.map(arguments,function(e){return t=L(e),"object"==t||"array"==t||null==e?e:T.fragment(e)}),s=this.length>1;return r.length<1?this:this.each(function(t,u){o=i?u:u.parentNode,u=0==e?u.nextSibling:1==e?u.firstChild:2==e?u:null;var f=n.contains(a.documentElement,o);r.forEach(function(t){if(s)t=t.cloneNode(!0);else if(!o)return n(t).remove();o.insertBefore(t,u),f&&G(t,function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},n.fn[i?t+"To":"insert"+(e?"Before":"After")]=function(e){return n(e)[t](this),this}}),T.Z.prototype=n.fn,T.uniq=N,T.deserializeValue=Y,n.zepto=T,n}();window.Zepto=Zepto,void 0===window.$&&(window.$=Zepto),function(t){function l(t){return t._zid||(t._zid=e++)}function h(t,e,n,i){if(e=p(e),e.ns)var r=d(e.ns);return(s[l(t)]||[]).filter(function(t){return!(!t||e.e&&t.e!=e.e||e.ns&&!r.test(t.ns)||n&&l(t.fn)!==l(n)||i&&t.sel!=i)})}function p(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function d(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function m(t,e){return t.del&&!u&&t.e in f||!!e}function g(t){return c[t]||u&&f[t]||t}function v(e,i,r,o,a,u,f){var h=l(e),d=s[h]||(s[h]=[]);i.split(/\s/).forEach(function(i){if("ready"==i)return t(document).ready(r);var s=p(i);s.fn=r,s.sel=a,s.e in c&&(r=function(e){var n=e.relatedTarget;return!n||n!==this&&!t.contains(this,n)?s.fn.apply(this,arguments):void 0}),s.del=u;var l=u||r;s.proxy=function(t){if(t=j(t),!t.isImmediatePropagationStopped()){t.data=o;var i=l.apply(e,t._args==n?[t]:[t].concat(t._args));return i===!1&&(t.preventDefault(),t.stopPropagation()),i}},s.i=d.length,d.push(s),"addEventListener"in e&&e.addEventListener(g(s.e),s.proxy,m(s,f))})}function y(t,e,n,i,r){var o=l(t);(e||"").split(/\s/).forEach(function(e){h(t,e,n,i).forEach(function(e){delete s[o][e.i],"removeEventListener"in t&&t.removeEventListener(g(e.e),e.proxy,m(e,r))})})}function j(e,i){return(i||!e.isDefaultPrevented)&&(i||(i=e),t.each(E,function(t,n){var r=i[t];e[t]=function(){return this[n]=x,r&&r.apply(i,arguments)},e[n]=b}),(i.defaultPrevented!==n?i.defaultPrevented:"returnValue"in i?i.returnValue===!1:i.getPreventDefault&&i.getPreventDefault())&&(e.isDefaultPrevented=x)),e}function S(t){var e,i={originalEvent:t};for(e in t)w.test(e)||t[e]===n||(i[e]=t[e]);return j(i,t)}var n,e=1,i=Array.prototype.slice,r=t.isFunction,o=function(t){return"string"==typeof t},s={},a={},u="onfocusin"in window,f={focus:"focusin",blur:"focusout"},c={mouseenter:"mouseover",mouseleave:"mouseout"};a.click=a.mousedown=a.mouseup=a.mousemove="MouseEvents",t.event={add:v,remove:y},t.proxy=function(e,n){var s=2 in arguments&&i.call(arguments,2);if(r(e)){var a=function(){return e.apply(n,s?s.concat(i.call(arguments)):arguments)};return a._zid=l(e),a}if(o(n))return s?(s.unshift(e[n],e),t.proxy.apply(null,s)):t.proxy(e[n],e);throw new TypeError("expected function")},t.fn.bind=function(t,e,n){return this.on(t,e,n)},t.fn.unbind=function(t,e){return this.off(t,e)},t.fn.one=function(t,e,n,i){return this.on(t,e,n,i,1)};var x=function(){return!0},b=function(){return!1},w=/^([A-Z]|returnValue$|layer[XY]$)/,E={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};t.fn.delegate=function(t,e,n){return this.on(e,t,n)},t.fn.undelegate=function(t,e,n){return this.off(e,t,n)},t.fn.live=function(e,n){return t(document.body).delegate(this.selector,e,n),this},t.fn.die=function(e,n){return t(document.body).undelegate(this.selector,e,n),this},t.fn.on=function(e,s,a,u,f){var c,l,h=this;return e&&!o(e)?(t.each(e,function(t,e){h.on(t,s,a,e,f)}),h):(o(s)||r(u)||u===!1||(u=a,a=s,s=n),(r(a)||a===!1)&&(u=a,a=n),u===!1&&(u=b),h.each(function(n,r){f&&(c=function(t){return y(r,t.type,u),u.apply(this,arguments)}),s&&(l=function(e){var n,o=t(e.target).closest(s,r).get(0);return o&&o!==r?(n=t.extend(S(e),{currentTarget:o,liveFired:r}),(c||u).apply(o,[n].concat(i.call(arguments,1)))):void 0}),v(r,e,u,a,s,l||c)}))},t.fn.off=function(e,i,s){var a=this;return e&&!o(e)?(t.each(e,function(t,e){a.off(t,i,e)}),a):(o(i)||r(s)||s===!1||(s=i,i=n),s===!1&&(s=b),a.each(function(){y(this,e,s,i)}))},t.fn.trigger=function(e,n){return e=o(e)||t.isPlainObject(e)?t.Event(e):j(e),e._args=n,this.each(function(){"dispatchEvent"in this?this.dispatchEvent(e):t(this).triggerHandler(e,n)})},t.fn.triggerHandler=function(e,n){var i,r;return this.each(function(s,a){i=S(o(e)?t.Event(e):e),i._args=n,i.target=a,t.each(h(a,e.type||e),function(t,e){return r=e.proxy(i),i.isImmediatePropagationStopped()?!1:void 0})}),r},"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.trigger(e)}}),["focus","blur"].forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.each(function(){try{this[e]()}catch(t){}}),this}}),t.Event=function(t,e){o(t)||(e=t,t=e.type);var n=document.createEvent(a[t]||"Events"),i=!0;if(e)for(var r in e)"bubbles"==r?i=!!e[r]:n[r]=e[r];return n.initEvent(t,i,!0),j(n)}}(Zepto),function(t){function l(e,n,i){var r=t.Event(n);return t(e).trigger(r,i),!r.isDefaultPrevented()}function h(t,e,i,r){return t.global?l(e||n,i,r):void 0}function p(e){e.global&&0===t.active++&&h(e,null,"ajaxStart")}function d(e){e.global&&!--t.active&&h(e,null,"ajaxStop")}function m(t,e){var n=e.context;return e.beforeSend.call(n,t,e)===!1||h(e,n,"ajaxBeforeSend",[t,e])===!1?!1:void h(e,n,"ajaxSend",[t,e])}function g(t,e,n,i){var r=n.context,o="success";n.success.call(r,t,o,e),i&&i.resolveWith(r,[t,o,e]),h(n,r,"ajaxSuccess",[e,n,t]),y(o,e,n)}function v(t,e,n,i,r){var o=i.context;i.error.call(o,n,e,t),r&&r.rejectWith(o,[n,e,t]),h(i,o,"ajaxError",[n,i,t||e]),y(e,n,i)}function y(t,e,n){var i=n.context;n.complete.call(i,e,t),h(n,i,"ajaxComplete",[e,n]),d(n)}function x(){}function b(t){return t&&(t=t.split(";",2)[0]),t&&(t==f?"html":t==u?"json":s.test(t)?"script":a.test(t)&&"xml")||"text"}function w(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function E(e){e.processData&&e.data&&"string"!=t.type(e.data)&&(e.data=t.param(e.data,e.traditional)),!e.data||e.type&&"GET"!=e.type.toUpperCase()||(e.url=w(e.url,e.data),e.data=void 0)}function j(e,n,i,r){return t.isFunction(n)&&(r=i,i=n,n=void 0),t.isFunction(i)||(r=i,i=void 0),{url:e,data:n,success:i,dataType:r}}function T(e,n,i,r){var o,s=t.isArray(n),a=t.isPlainObject(n);t.each(n,function(n,u){o=t.type(u),r&&(n=i?r:r+"["+(a||"object"==o||"array"==o?n:"")+"]"),!r&&s?e.add(u.name,u.value):"array"==o||!i&&"object"==o?T(e,u,i,n):e.add(n,u)})}var i,r,e=0,n=window.document,o=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,s=/^(?:text|application)\/javascript/i,a=/^(?:text|application)\/xml/i,u="application/json",f="text/html",c=/^\s*$/;t.active=0,t.ajaxJSONP=function(i,r){if(!("type"in i))return t.ajax(i);var f,h,o=i.jsonpCallback,s=(t.isFunction(o)?o():o)||"jsonp"+ ++e,a=n.createElement("script"),u=window[s],c=function(e){t(a).triggerHandler("error",e||"abort")},l={abort:c};return r&&r.promise(l),t(a).on("load error",function(e,n){clearTimeout(h),t(a).off().remove(),"error"!=e.type&&f?g(f[0],l,i,r):v(null,n||"error",l,i,r),window[s]=u,f&&t.isFunction(u)&&u(f[0]),u=f=void 0}),m(l,i)===!1?(c("abort"),l):(window[s]=function(){f=arguments},a.src=i.url.replace(/\?(.+)=\?/,"?$1="+s),n.head.appendChild(a),i.timeout>0&&(h=setTimeout(function(){c("timeout")},i.timeout)),l)},t.ajaxSettings={type:"GET",beforeSend:x,success:x,error:x,complete:x,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:u,xml:"application/xml, text/xml",html:f,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0},t.ajax=function(e){var n=t.extend({},e||{}),o=t.Deferred&&t.Deferred();for(i in t.ajaxSettings)void 0===n[i]&&(n[i]=t.ajaxSettings[i]);p(n),n.crossDomain||(n.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(n.url)&&RegExp.$2!=window.location.host),n.url||(n.url=window.location.toString()),E(n);var s=n.dataType,a=/\?.+=\?/.test(n.url);if(a&&(s="jsonp"),n.cache!==!1&&(e&&e.cache===!0||"script"!=s&&"jsonp"!=s)||(n.url=w(n.url,"_="+Date.now())),"jsonp"==s)return a||(n.url=w(n.url,n.jsonp?n.jsonp+"=?":n.jsonp===!1?"":"callback=?")),t.ajaxJSONP(n,o);var j,u=n.accepts[s],f={},l=function(t,e){f[t.toLowerCase()]=[t,e]},h=/^([\w-]+:)\/\//.test(n.url)?RegExp.$1:window.location.protocol,d=n.xhr(),y=d.setRequestHeader;if(o&&o.promise(d),n.crossDomain||l("X-Requested-With","XMLHttpRequest"),l("Accept",u||"*/*"),(u=n.mimeType||u)&&(u.indexOf(",")>-1&&(u=u.split(",",2)[0]),d.overrideMimeType&&d.overrideMimeType(u)),(n.contentType||n.contentType!==!1&&n.data&&"GET"!=n.type.toUpperCase())&&l("Content-Type",n.contentType||"application/x-www-form-urlencoded"),n.headers)for(r in n.headers)l(r,n.headers[r]);if(d.setRequestHeader=l,d.onreadystatechange=function(){if(4==d.readyState){d.onreadystatechange=x,clearTimeout(j);var e,i=!1;if(d.status>=200&&d.status<300||304==d.status||0==d.status&&"file:"==h){s=s||b(n.mimeType||d.getResponseHeader("content-type")),e=d.responseText;try{"script"==s?(1,eval)(e):"xml"==s?e=d.responseXML:"json"==s&&(e=c.test(e)?null:t.parseJSON(e))}catch(r){i=r}i?v(i,"parsererror",d,n,o):g(e,d,n,o)}else v(d.statusText||null,d.status?"error":"abort",d,n,o)}},m(d,n)===!1)return d.abort(),v(null,"abort",d,n,o),d;if(n.xhrFields)for(r in n.xhrFields)d[r]=n.xhrFields[r];var S="async"in n?n.async:!0;d.open(n.type,n.url,S,n.username,n.password);for(r in f)y.apply(d,f[r]);return n.timeout>0&&(j=setTimeout(function(){d.onreadystatechange=x,d.abort(),v(null,"timeout",d,n,o)},n.timeout)),d.send(n.data?n.data:null),d},t.get=function(){return t.ajax(j.apply(null,arguments))},t.post=function(){var e=j.apply(null,arguments);return e.type="POST",t.ajax(e)},t.getJSON=function(){var e=j.apply(null,arguments);return e.dataType="json",t.ajax(e)},t.fn.load=function(e,n,i){if(!this.length)return this;var a,r=this,s=e.split(/\s/),u=j(e,n,i),f=u.success;return s.length>1&&(u.url=s[0],a=s[1]),u.success=function(e){r.html(a?t("<div>").html(e.replace(o,"")).find(a):e),f&&f.apply(r,arguments)},t.ajax(u),this};var S=encodeURIComponent;t.param=function(t,e){var n=[];return n.add=function(t,e){this.push(S(t)+"="+S(e))},T(n,t,e),n.join("&").replace(/%20/g,"+")}}(Zepto),function(t){t.fn.serializeArray=function(){var n,e=[];return t([].slice.call(this.get(0).elements)).each(function(){n=t(this);var i=n.attr("type");"fieldset"!=this.nodeName.toLowerCase()&&!this.disabled&&"submit"!=i&&"reset"!=i&&"button"!=i&&("radio"!=i&&"checkbox"!=i||this.checked)&&e.push({name:n.attr("name"),value:n.val()})}),e},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(e)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.isDefaultPrevented()||this.get(0).submit()}return this}}(Zepto),function(t){"__proto__"in{}||t.extend(t.zepto,{Z:function(e,n){return e=e||[],t.extend(e,t.fn),e.selector=n||"",e.__Z=!0,e},isZ:function(e){return"array"===t.type(e)&&"__Z"in e}});try{getComputedStyle(void 0)}catch(e){var n=getComputedStyle;window.getComputedStyle=function(t){try{return n(t)}catch(e){return null}}}}(Zepto);

var $ = Zepto;

/*
Plugin: Identicon5 v1.0.0

Author: http://FrancisShanahan.com

Description: Draws identicons using HTML5 Canvas instead of the Gravatar image link. 
Is Canvas is not supported, defaults to the standard gravatar link. 

Attribution: Based off the PHP implementation of Don Park's original identicon code for visual representation of MD5 hash values.
Reference: http://sourceforge.net/projects/identicons/

Usage: 
Place Md5 hash values inside a list like so: <ol><li>071e3f61671e790fc492b583a01ae22b</li></ol>
call $('li').identicon5();

Options: {
rotate:true/false  =  whether or not to rotate each tile in place for greater variation of the images
size: int value = size of the images, default is 32px and identicons are always square. 
}

Usage with options: $('li').identicon5({rotate:true, size:100});

*/
(function ($) {
    $.fn.identicon5 = function (options) {
	
		// default options
		 var settings = $.extend(
		 { rotate: true, size:32 }, options);

        // fills a polygon based on a path
        var fillPoly = function (ctx, path) {
            if (path.length >= 2) {
                ctx.beginPath();            
                ctx.moveTo(path[0], path[1]);
                for (var i = 2; i < path.length; i++) {
                    ctx.lineTo(path[i], path[i + 1]);
                    i++;
                }
                ctx.fill();
            }
        };

        /* generate sprite for corners and sides */
        var getsprite = function (shape, size) {
            switch (shape) {
                case 0: // triangle
                    shape = [
				0.5, 1,
				1, 0,
				1, 1];
                    break;
                case 1: // parallelogram
                    shape = [
				0.5, 0,
				1, 0,
				0.5, 1,
				0, 1];
                    break;
                case 2: // mouse ears
                    shape = [
				0.5, 0,
				1, 0,
				1, 1,
				0.5, 1,
				1, 0.5];
                    break;
                case 3: // ribbon
                    shape = [
				0, 0.5,
				0.5, 0,
				1, 0.5,
				0.5, 1,
				0.5, 0.5];
                    break;
                case 4: // sails
                    shape = [
				0, 0.5,
				1, 0,
				1, 1,
				0, 1,
				1, 0.5];
                    break;
                case 5: // fins
                    shape = [
				1, 0,
				1, 1,
				0.5, 1,
				1, 0.5,
				0.5, 0.5];
                    break;
                case 6: // beak
                    shape = [
				0, 0,
				1, 0,
				1, 0.5,
				0, 0,
				0.5, 1,
				0, 1];
                    break;
                case 7: // chevron
                    shape = [
				0, 0,
				0.5, 0,
				1, 0.5,
				0.5, 1,
				0, 1,
				0.5, 0.5];
                    break;
                case 8: // fish
                    shape = [
				0.5, 0,
				0.5, 0.5,
				1, 0.5,
				1, 1,
				0.5, 1,
				0.5, 0.5,
				0, 0.5];
                    break;
                case 9: // kite
                    shape = [
				0, 0,
				1, 0,
				0.5, 0.5,
				1, 0.5,
				0.5, 1,
				0.5, 0.5,
				0, 1];
                    break;
                case 10: // trough
                    shape = [
				0, 0.5,
				0.5, 1,
				1, 0.5,
				0.5, 0,
				1, 0,
				1, 1,
				0, 1];
                    break;
                case 11: // rays
                    shape = [
				0.5, 0,
				1, 0,
				1, 1,
				0.5, 1,
				1, 0.75,
				0.5, 0.5,
				1, 0.25];
                    break;
                case 12: // double rhombus
                    shape = [
				0, 0.5,
				0.5, 0,
				0.5, 0.5,
				1, 0,
				1, 0.5,
				0.5, 1,
				0.5, 0.5,
				0, 1];
                    break;
                case 13: // crown
                    shape = [
				0, 0,
				1, 0,
				1, 1,
				0, 1,
				1, 0.5,
				0.5, 0.25,
				0.5, 0.75,
				0, 0.5,
				0.5, 0.25];
                    break;
                case 14: // radioactive
                    shape = [
				0, 0.5,
				0.5, 0.5,
				0.5, 0,
				1, 0,
				0.5, 0.5,
				1, 0.5,
				0.5, 1,
				0.5, 0.5,
				0, 1];
                    break;
                default: // tiles
                    shape = [
				0, 0,
				1, 0,
				0.5, 0.5,
				0.5, 0,
				0, 0.5,
				1, 0.5,
				0.5, 1,
				0.5, 0.5,
				0, 1];
                    break;
            }

            /* scale up */
            for (var i = 0; i < shape.length; i++) {
                shape[i] = shape[i] * size;
            }

            return shape;
        };

        /* a simple test that draws all regular shapes */
        /* Usage: <li>test</li> */
        var test = function (ctx, size) {
            var sprite;
			// size of each tile
            var sz = size / 5;
			var hs = sz /2;
            var j = 0;
            var k = 0;

            ctx.strokeRect(0, 0, sz, sz);

            for (var i = 0; i < 15; i++) {
                sprite = getsprite(i, sz);
                ctx.save();
                ctx.translate(hs + (j * sz), hs + (k * sz));

                for (var p = 0; p < sprite.length; p++) {
                    sprite[p] -= hs;
                }
                fillPoly(ctx, sprite);
                ctx.strokeRect(-hs, -hs, sz, sz);
                ctx.restore();
				/* move to next line */
                if (j >= 4) { 
                    j = 0;
                    k++;
                }
                else {
                    j++;
                }
            }
        };

        /* Draw a polygon at location x,y and rotated by angle */
        /* assumes polys are square */
        var drawRotatedPolygon = function (ctx, sprite, x, y, shapeangle, angle, size) {
            var halfSize = size / 2;
            ctx.save();

            ctx.translate(x, y);
            ctx.rotate(angle * Math.PI / 180);
            ctx.save();
            ctx.translate(halfSize, halfSize);
            var tmpSprite = [];
            for (var p = 0; p < sprite.length; p++) {
                tmpSprite[p] = sprite[p] - halfSize;
            }            
            ctx.rotate(shapeangle);
			fillPoly(ctx, tmpSprite);
            // black outline for debugging
            //ctx.strokeRect(-halfSize, -halfSize, size, size);
            ctx.restore();
            ctx.restore();
        };




        /* generate sprite for center block */
        var getcenter = function (shape, size) {

            switch (shape) {
                case 0: // empty
                    shape = [];
                    break;
                case 1: // fill
                    shape = [
				0, 0,
				1, 0,
				1, 1,
				0, 1];
                    break;
                case 2: // diamond
                    shape = [
				0.5, 0,
				1, 0.5,
				0.5, 1,
				0, 0.5];
                    break;
                case 3: // reverse diamond
                    shape = [
				0, 0,
				1, 0,
				1, 1,
				0, 1,
				0, 0.5,
				0.5, 1,
				1, 0.5,
				0.5, 0,
				0, 0.5];
                    break;
                case 4: // cross
                    shape = [
				0.25, 0,
				0.75, 0,
				0.5, 0.5,
				1, 0.25,
				1, 0.75,
				0.5, 0.5,
				0.75, 1,
				0.25, 1,
				0.5, 0.5,
				0, 0.75,
				0, 0.25,
				0.5, 0.5];
                    break;
                case 5: // morning star
                    shape = [
				0, 0,
				0.5, 0.25,
				1, 0,
				0.75, 0.5,
				1, 1,
				0.5, 0.75,
				0, 1,
				0.25, 0.5];
                    break;
                case 6: // small square		
                    shape = [
				0.33, 0.33,
				0.67, 0.33,
				0.67, 0.67,
				0.33, 0.67];
                    break;
                case 7: // checkerboard
                    shape = [
				0, 0,
				0.33, 0,
				0.33, 0.33,
				0.66, 0.33,
				0.67, 0,
				1, 0,
				1, 0.33,
				0.67, 0.33,
				0.67, 0.67,
				1, 0.67,
				1, 1,
				0.67, 1,
				0.67, 0.67,
				0.33, 0.67,
				0.33, 1,
				0, 1,
				0, 0.67,
				0.33, 0.67,
				0.33, 0.33,
				0, 0.33];
                    break;
                default: // tiles
                    shape = [
				0, 0,
				1, 0,
				0.5, 0.5,
				0.5, 0,
				0, 0.5,
				1, 0.5,
				0.5, 1,
				0.5, 0.5,
				0, 1];
                    break;
            }
            /* apply ratios */
            for (var i = 0; i < shape.length; i++) {
                shape[i] = shape[i] * size;
            }

            return shape;
        };


        // main drawing function. 
        // Draws a identicon, based off an MD5 hash value of size "width"
        // (identicons are always square)
        var draw = function (ctx, hash, width, rotate) {

            var csh = parseInt(hash.substr(0, 1), 16); // corner sprite shape
            var ssh = parseInt(hash.substr(1, 1), 16); // side sprite shape
            var xsh = parseInt(hash.substr(2, 1), 16) & 7; // center sprite shape

			var halfPi = Math.PI/2;
            var cro = halfPi * (parseInt(hash.substr(3, 1), 16) & 3); // corner sprite rotation			
            var sro = halfPi * (parseInt(hash.substr(4, 1), 16) & 3); // side sprite rotation
            var xbg = parseInt(hash.substr(5, 1), 16) % 2; // center sprite background

            /* corner sprite foreground color */
            var cfr = parseInt(hash.substr(6, 2), 16);
            var cfg = parseInt(hash.substr(8, 2), 16);
            var cfb = parseInt(hash.substr(10, 2), 16);

            /* side sprite foreground color */
            var sfr = parseInt(hash.substr(12, 2), 16);
            var sfg = parseInt(hash.substr(14, 2), 16);
            var sfb = parseInt(hash.substr(16, 2), 16);

            /* final angle of rotation */
            // not used
            // var angle = parseInt(hash.substr(18, 2), 16);

            /* size of each sprite */
            var size = width / 3;
            var totalsize = width;

            /* start with blank 3x3 identicon */

            /* generate corner sprites */
            var corner = getsprite(csh, size);
            ctx.fillStyle = "rgb(" + cfr + "," + cfg + "," + cfb + ")";

            if (rotate === false) {
				cro = 0;
			}
            drawRotatedPolygon(ctx, corner, 0, 0, cro, 0, size);
            drawRotatedPolygon(ctx, corner, totalsize, 0, cro, 90, size);
            drawRotatedPolygon(ctx, corner, totalsize, totalsize, cro, 180, size);
            drawRotatedPolygon(ctx, corner, 0, totalsize, cro, 270, size);

            /* draw sides */
            if (rotate === false) {
				sro = 0;
			}
            var side = getsprite(ssh, size);
            ctx.fillStyle = "rgb(" + sfr + "," + sfg + "," + sfb + ")";
            drawRotatedPolygon(ctx, side, 0, size, sro, 0, size);
            drawRotatedPolygon(ctx, side, 2 * size, 0, sro, 90, size);
            drawRotatedPolygon(ctx, side, 3 * size, 2 * size, sro, 180, size);
            drawRotatedPolygon(ctx, side, size, 3 * size, sro, 270, size);

            var center = getcenter(xsh, size);

            /* make sure there's enough contrast before we use background color of side sprite */
            if (xbg > 0 && (Math.abs(cfr - sfr) > 127 || Math.abs(cfg - sfg) > 127 || Math.abs(cfb - sfb) > 127)) {
                ctx.fillStyle = "rgb(" + sfr + "," + sfg + "," + sfb + ")";
            } else {
                ctx.fillStyle = "rgb(" + cfr + "," + cfg + "," + cfb + ")";
            }

            drawRotatedPolygon(ctx, center, size, size, 0, 0, size);
        };

        // return the object back to the chained call flow
        return this.each(function () {
		
			var key = $(this).html().replace(/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]/g, '');						
            var hash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(bs58.dec(key))));
                       //sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(publicKeyPair)))
			var canvas = document.createElement('canvas');			
									
            if (canvas.getContext) {
				// canvas is supported				
				canvas.width = settings.size;
				canvas.height = settings.size;
				
                var ctx = canvas.getContext("2d");

                ctx.rect(0,0,settings.size,settings.size);
                ctx.fillStyle="white";
                ctx.fill();
                
                if (hash === "test") {
					// draw a test image of all possible shapes. 
                    test(ctx, settings.size);
                } else {
                    draw(ctx, hash, settings.size, settings.rotate);
                }		
				$(this).html('');				
				$(this).append($('<img src="'+canvas.toDataURL()+'" title="'+key+'" alt="'+key+'" style="vertical-align: bottom;"/>'));				
            }			
        });
    };
})(Zepto); 
// Base58 encoding/decoding
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

var bs58 = (function() {

    var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    var ALPHABET_MAP = {}
    for (var i = 0; i < ALPHABET.length; i++) {
        ALPHABET_MAP[ALPHABET.charAt(i)] = i
    }
    var BASE = 58

    function encode(buffer) {
        if (buffer.length === 0) return ''

        var i, j, digits = [0]
        for (i = 0; i < buffer.length; i++) {
            for (j = 0; j < digits.length; j++) digits[j] <<= 8

            digits[0] += buffer[i]

            var carry = 0
            for (j = 0; j < digits.length; ++j) {
                digits[j] += carry

                carry = (digits[j] / BASE) | 0
                digits[j] %= BASE
            }

            while (carry) {
                digits.push(carry % BASE)

                carry = (carry / BASE) | 0
            }
        }

        // deal with leading zeros
        for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0)

        return digits.reverse().map(function(digit) {
            return ALPHABET[digit]
        }).join('')
    }

    function decode(string) {
        if (string.length === 0) return []

        var i, j, bytes = [0]
        for (i = 0; i < string.length; i++) {
            var c = string[i]
            if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character')

            for (j = 0; j < bytes.length; j++) bytes[j] *= BASE
            bytes[0] += ALPHABET_MAP[c]

            var carry = 0
            for (j = 0; j < bytes.length; ++j) {
                bytes[j] += carry

                carry = bytes[j] >> 8
                bytes[j] &= 0xff
            }

            while (carry) {
                bytes.push(carry & 0xff)

                carry >>= 8
            }
        }

        // deal with leading zeros
        for (i = 0; string[i] === '1' && i < string.length - 1; i++) bytes.push(0)

        return bytes.reverse()
    }

    return {enc: encode, dec: decode};
})();

/* pako 0.2.5 nodeca/pako */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.pako=t()}}(function(){return function t(e,a,i){function n(s,o){if(!a[s]){if(!e[s]){var l="function"==typeof require&&require;if(!o&&l)return l(s,!0);if(r)return r(s,!0);throw new Error("Cannot find module '"+s+"'")}var h=a[s]={exports:{}};e[s][0].call(h.exports,function(t){var a=e[s][1][t];return n(a?a:t)},h,h.exports,t,e,a,i)}return a[s].exports}for(var r="function"==typeof require&&require,s=0;s<i.length;s++)n(i[s]);return n}({1:[function(t,e){"use strict";var a=t("./lib/utils/common").assign,i=t("./lib/deflate"),n=t("./lib/inflate"),r=t("./lib/zlib/constants"),s={};a(s,i,n,r),e.exports=s},{"./lib/deflate":2,"./lib/inflate":3,"./lib/utils/common":4,"./lib/zlib/constants":7}],2:[function(t,e,a){"use strict";function i(t,e){var a=new w(e);if(a.push(t,!0),a.err)throw a.msg;return a.result}function n(t,e){return e=e||{},e.raw=!0,i(t,e)}function r(t,e){return e=e||{},e.gzip=!0,i(t,e)}var s=t("./zlib/deflate.js"),o=t("./utils/common"),l=t("./utils/strings"),h=t("./zlib/messages"),d=t("./zlib/zstream"),f=0,_=4,u=0,c=1,b=-1,g=0,m=8,w=function(t){this.options=o.assign({level:b,method:m,chunkSize:16384,windowBits:15,memLevel:8,strategy:g,to:""},t||{});var e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new d,this.strm.avail_out=0;var a=s.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==u)throw new Error(h[a]);e.header&&s.deflateSetHeader(this.strm,e.header)};w.prototype.push=function(t,e){var a,i,n=this.strm,r=this.options.chunkSize;if(this.ended)return!1;i=e===~~e?e:e===!0?_:f,n.input="string"==typeof t?l.string2buf(t):t,n.next_in=0,n.avail_in=n.input.length;do{if(0===n.avail_out&&(n.output=new o.Buf8(r),n.next_out=0,n.avail_out=r),a=s.deflate(n,i),a!==c&&a!==u)return this.onEnd(a),this.ended=!0,!1;(0===n.avail_out||0===n.avail_in&&i===_)&&this.onData("string"===this.options.to?l.buf2binstring(o.shrinkBuf(n.output,n.next_out)):o.shrinkBuf(n.output,n.next_out))}while((n.avail_in>0||0===n.avail_out)&&a!==c);return i===_?(a=s.deflateEnd(this.strm),this.onEnd(a),this.ended=!0,a===u):!0},w.prototype.onData=function(t){this.chunks.push(t)},w.prototype.onEnd=function(t){t===u&&(this.result="string"===this.options.to?this.chunks.join(""):o.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},a.Deflate=w,a.deflate=i,a.deflateRaw=n,a.gzip=r},{"./utils/common":4,"./utils/strings":5,"./zlib/deflate.js":9,"./zlib/messages":14,"./zlib/zstream":16}],3:[function(t,e,a){"use strict";function i(t,e){var a=new _(e);if(a.push(t,!0),a.err)throw a.msg;return a.result}function n(t,e){return e=e||{},e.raw=!0,i(t,e)}var r=t("./zlib/inflate.js"),s=t("./utils/common"),o=t("./utils/strings"),l=t("./zlib/constants"),h=t("./zlib/messages"),d=t("./zlib/zstream"),f=t("./zlib/gzheader"),_=function(t){this.options=s.assign({chunkSize:16384,windowBits:0,to:""},t||{});var e=this.options;e.raw&&e.windowBits>=0&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(e.windowBits>=0&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),e.windowBits>15&&e.windowBits<48&&0===(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new d,this.strm.avail_out=0;var a=r.inflateInit2(this.strm,e.windowBits);if(a!==l.Z_OK)throw new Error(h[a]);this.header=new f,r.inflateGetHeader(this.strm,this.header)};_.prototype.push=function(t,e){var a,i,n,h,d,f=this.strm,_=this.options.chunkSize;if(this.ended)return!1;i=e===~~e?e:e===!0?l.Z_FINISH:l.Z_NO_FLUSH,f.input="string"==typeof t?o.binstring2buf(t):t,f.next_in=0,f.avail_in=f.input.length;do{if(0===f.avail_out&&(f.output=new s.Buf8(_),f.next_out=0,f.avail_out=_),a=r.inflate(f,l.Z_NO_FLUSH),a!==l.Z_STREAM_END&&a!==l.Z_OK)return this.onEnd(a),this.ended=!0,!1;f.next_out&&(0===f.avail_out||a===l.Z_STREAM_END||0===f.avail_in&&i===l.Z_FINISH)&&("string"===this.options.to?(n=o.utf8border(f.output,f.next_out),h=f.next_out-n,d=o.buf2string(f.output,n),f.next_out=h,f.avail_out=_-h,h&&s.arraySet(f.output,f.output,n,h,0),this.onData(d)):this.onData(s.shrinkBuf(f.output,f.next_out)))}while(f.avail_in>0&&a!==l.Z_STREAM_END);return a===l.Z_STREAM_END&&(i=l.Z_FINISH),i===l.Z_FINISH?(a=r.inflateEnd(this.strm),this.onEnd(a),this.ended=!0,a===l.Z_OK):!0},_.prototype.onData=function(t){this.chunks.push(t)},_.prototype.onEnd=function(t){t===l.Z_OK&&(this.result="string"===this.options.to?this.chunks.join(""):s.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},a.Inflate=_,a.inflate=i,a.inflateRaw=n,a.ungzip=i},{"./utils/common":4,"./utils/strings":5,"./zlib/constants":7,"./zlib/gzheader":10,"./zlib/inflate.js":12,"./zlib/messages":14,"./zlib/zstream":16}],4:[function(t,e,a){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;a.assign=function(t){for(var e=Array.prototype.slice.call(arguments,1);e.length;){var a=e.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(var i in a)a.hasOwnProperty(i)&&(t[i]=a[i])}}return t},a.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var n={arraySet:function(t,e,a,i,n){if(e.subarray&&t.subarray)return void t.set(e.subarray(a,a+i),n);for(var r=0;i>r;r++)t[n+r]=e[a+r]},flattenChunks:function(t){var e,a,i,n,r,s;for(i=0,e=0,a=t.length;a>e;e++)i+=t[e].length;for(s=new Uint8Array(i),n=0,e=0,a=t.length;a>e;e++)r=t[e],s.set(r,n),n+=r.length;return s}},r={arraySet:function(t,e,a,i,n){for(var r=0;i>r;r++)t[n+r]=e[a+r]},flattenChunks:function(t){return[].concat.apply([],t)}};a.setTyped=function(t){t?(a.Buf8=Uint8Array,a.Buf16=Uint16Array,a.Buf32=Int32Array,a.assign(a,n)):(a.Buf8=Array,a.Buf16=Array,a.Buf32=Array,a.assign(a,r))},a.setTyped(i)},{}],5:[function(t,e,a){"use strict";function i(t,e){if(65537>e&&(t.subarray&&s||!t.subarray&&r))return String.fromCharCode.apply(null,n.shrinkBuf(t,e));for(var a="",i=0;e>i;i++)a+=String.fromCharCode(t[i]);return a}var n=t("./common"),r=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(o){r=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(o){s=!1}for(var l=new n.Buf8(256),h=0;256>h;h++)l[h]=h>=252?6:h>=248?5:h>=240?4:h>=224?3:h>=192?2:1;l[254]=l[254]=1,a.string2buf=function(t){var e,a,i,r,s,o=t.length,l=0;for(r=0;o>r;r++)a=t.charCodeAt(r),55296===(64512&a)&&o>r+1&&(i=t.charCodeAt(r+1),56320===(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),r++)),l+=128>a?1:2048>a?2:65536>a?3:4;for(e=new n.Buf8(l),s=0,r=0;l>s;r++)a=t.charCodeAt(r),55296===(64512&a)&&o>r+1&&(i=t.charCodeAt(r+1),56320===(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),r++)),128>a?e[s++]=a:2048>a?(e[s++]=192|a>>>6,e[s++]=128|63&a):65536>a?(e[s++]=224|a>>>12,e[s++]=128|a>>>6&63,e[s++]=128|63&a):(e[s++]=240|a>>>18,e[s++]=128|a>>>12&63,e[s++]=128|a>>>6&63,e[s++]=128|63&a);return e},a.buf2binstring=function(t){return i(t,t.length)},a.binstring2buf=function(t){for(var e=new n.Buf8(t.length),a=0,i=e.length;i>a;a++)e[a]=t.charCodeAt(a);return e},a.buf2string=function(t,e){var a,n,r,s,o=e||t.length,h=new Array(2*o);for(n=0,a=0;o>a;)if(r=t[a++],128>r)h[n++]=r;else if(s=l[r],s>4)h[n++]=65533,a+=s-1;else{for(r&=2===s?31:3===s?15:7;s>1&&o>a;)r=r<<6|63&t[a++],s--;s>1?h[n++]=65533:65536>r?h[n++]=r:(r-=65536,h[n++]=55296|r>>10&1023,h[n++]=56320|1023&r)}return i(h,n)},a.utf8border=function(t,e){var a;for(e=e||t.length,e>t.length&&(e=t.length),a=e-1;a>=0&&128===(192&t[a]);)a--;return 0>a?e:0===a?e:a+l[t[a]]>e?a:e}},{"./common":4}],6:[function(t,e){"use strict";function a(t,e,a,i){for(var n=65535&t|0,r=t>>>16&65535|0,s=0;0!==a;){s=a>2e3?2e3:a,a-=s;do n=n+e[i++]|0,r=r+n|0;while(--s);n%=65521,r%=65521}return n|r<<16|0}e.exports=a},{}],7:[function(t,e){e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],8:[function(t,e){"use strict";function a(){for(var t,e=[],a=0;256>a;a++){t=a;for(var i=0;8>i;i++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e}function i(t,e,a,i){var r=n,s=i+a;t=-1^t;for(var o=i;s>o;o++)t=t>>>8^r[255&(t^e[o])];return-1^t}var n=a();e.exports=i},{}],9:[function(t,e,a){"use strict";function i(t,e){return t.msg=I[e],e}function n(t){return(t<<1)-(t>4?9:0)}function r(t){for(var e=t.length;--e>=0;)t[e]=0}function s(t){var e=t.state,a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(A.arraySet(t.output,e.pending_buf,e.pending_out,a,t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))}function o(t,e){Z._tr_flush_block(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,s(t.strm)}function l(t,e){t.pending_buf[t.pending++]=e}function h(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function d(t,e,a,i){var n=t.avail_in;return n>i&&(n=i),0===n?0:(t.avail_in-=n,A.arraySet(e,t.input,t.next_in,n,a),1===t.state.wrap?t.adler=R(t.adler,e,n,a):2===t.state.wrap&&(t.adler=C(t.adler,e,n,a)),t.next_in+=n,t.total_in+=n,n)}function f(t,e){var a,i,n=t.max_chain_length,r=t.strstart,s=t.prev_length,o=t.nice_match,l=t.strstart>t.w_size-he?t.strstart-(t.w_size-he):0,h=t.window,d=t.w_mask,f=t.prev,_=t.strstart+le,u=h[r+s-1],c=h[r+s];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do if(a=e,h[a+s]===c&&h[a+s-1]===u&&h[a]===h[r]&&h[++a]===h[r+1]){r+=2,a++;do;while(h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&_>r);if(i=le-(_-r),r=_-le,i>s){if(t.match_start=e,s=i,i>=o)break;u=h[r+s-1],c=h[r+s]}}while((e=f[e&d])>l&&0!==--n);return s<=t.lookahead?s:t.lookahead}function _(t){var e,a,i,n,r,s=t.w_size;do{if(n=t.window_size-t.lookahead-t.strstart,t.strstart>=s+(s-he)){A.arraySet(t.window,t.window,s,s,0),t.match_start-=s,t.strstart-=s,t.block_start-=s,a=t.hash_size,e=a;do i=t.head[--e],t.head[e]=i>=s?i-s:0;while(--a);a=s,e=a;do i=t.prev[--e],t.prev[e]=i>=s?i-s:0;while(--a);n+=s}if(0===t.strm.avail_in)break;if(a=d(t.strm,t.window,t.strstart+t.lookahead,n),t.lookahead+=a,t.lookahead+t.insert>=oe)for(r=t.strstart-t.insert,t.ins_h=t.window[r],t.ins_h=(t.ins_h<<t.hash_shift^t.window[r+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[r+oe-1])&t.hash_mask,t.prev[r&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=r,r++,t.insert--,!(t.lookahead+t.insert<oe)););}while(t.lookahead<he&&0!==t.strm.avail_in)}function u(t,e){var a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(_(t),0===t.lookahead&&e===N)return we;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var i=t.block_start+a;if((0===t.strstart||t.strstart>=i)&&(t.lookahead=t.strstart-i,t.strstart=i,o(t,!1),0===t.strm.avail_out))return we;if(t.strstart-t.block_start>=t.w_size-he&&(o(t,!1),0===t.strm.avail_out))return we}return t.insert=0,e===D?(o(t,!0),0===t.strm.avail_out?ve:ke):t.strstart>t.block_start&&(o(t,!1),0===t.strm.avail_out)?we:we}function c(t,e){for(var a,i;;){if(t.lookahead<he){if(_(t),t.lookahead<he&&e===N)return we;if(0===t.lookahead)break}if(a=0,t.lookahead>=oe&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+oe-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-he&&(t.match_length=f(t,a)),t.match_length>=oe)if(i=Z._tr_tally(t,t.strstart-t.match_start,t.match_length-oe),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=oe){t.match_length--;do t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+oe-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart;while(0!==--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else i=Z._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(o(t,!1),0===t.strm.avail_out))return we}return t.insert=t.strstart<oe-1?t.strstart:oe-1,e===D?(o(t,!0),0===t.strm.avail_out?ve:ke):t.last_lit&&(o(t,!1),0===t.strm.avail_out)?we:pe}function b(t,e){for(var a,i,n;;){if(t.lookahead<he){if(_(t),t.lookahead<he&&e===N)return we;if(0===t.lookahead)break}if(a=0,t.lookahead>=oe&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+oe-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=oe-1,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-he&&(t.match_length=f(t,a),t.match_length<=5&&(t.strategy===P||t.match_length===oe&&t.strstart-t.match_start>4096)&&(t.match_length=oe-1)),t.prev_length>=oe&&t.match_length<=t.prev_length){n=t.strstart+t.lookahead-oe,i=Z._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-oe),t.lookahead-=t.prev_length-1,t.prev_length-=2;do++t.strstart<=n&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+oe-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart);while(0!==--t.prev_length);if(t.match_available=0,t.match_length=oe-1,t.strstart++,i&&(o(t,!1),0===t.strm.avail_out))return we}else if(t.match_available){if(i=Z._tr_tally(t,0,t.window[t.strstart-1]),i&&o(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return we}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=Z._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<oe-1?t.strstart:oe-1,e===D?(o(t,!0),0===t.strm.avail_out?ve:ke):t.last_lit&&(o(t,!1),0===t.strm.avail_out)?we:pe}function g(t,e){for(var a,i,n,r,s=t.window;;){if(t.lookahead<=le){if(_(t),t.lookahead<=le&&e===N)return we;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=oe&&t.strstart>0&&(n=t.strstart-1,i=s[n],i===s[++n]&&i===s[++n]&&i===s[++n])){r=t.strstart+le;do;while(i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&r>n);t.match_length=le-(r-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=oe?(a=Z._tr_tally(t,1,t.match_length-oe),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=Z._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(o(t,!1),0===t.strm.avail_out))return we}return t.insert=0,e===D?(o(t,!0),0===t.strm.avail_out?ve:ke):t.last_lit&&(o(t,!1),0===t.strm.avail_out)?we:pe}function m(t,e){for(var a;;){if(0===t.lookahead&&(_(t),0===t.lookahead)){if(e===N)return we;break}if(t.match_length=0,a=Z._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(o(t,!1),0===t.strm.avail_out))return we}return t.insert=0,e===D?(o(t,!0),0===t.strm.avail_out?ve:ke):t.last_lit&&(o(t,!1),0===t.strm.avail_out)?we:pe}function w(t){t.window_size=2*t.w_size,r(t.head),t.max_lazy_match=E[t.level].max_lazy,t.good_match=E[t.level].good_length,t.nice_match=E[t.level].nice_length,t.max_chain_length=E[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=oe-1,t.match_available=0,t.ins_h=0}function p(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=J,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new A.Buf16(2*re),this.dyn_dtree=new A.Buf16(2*(2*ie+1)),this.bl_tree=new A.Buf16(2*(2*ne+1)),r(this.dyn_ltree),r(this.dyn_dtree),r(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new A.Buf16(se+1),this.heap=new A.Buf16(2*ae+1),r(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new A.Buf16(2*ae+1),r(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function v(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=W,e=t.state,e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?fe:ge,t.adler=2===e.wrap?0:1,e.last_flush=N,Z._tr_init(e),L):i(t,H)}function k(t){var e=v(t);return e===L&&w(t.state),e}function x(t,e){return t&&t.state?2!==t.state.wrap?H:(t.state.gzhead=e,L):H}function y(t,e,a,n,r,s){if(!t)return H;var o=1;if(e===K&&(e=6),0>n?(o=0,n=-n):n>15&&(o=2,n-=16),1>r||r>Q||a!==J||8>n||n>15||0>e||e>9||0>s||s>G)return i(t,H);8===n&&(n=9);var l=new p;return t.state=l,l.strm=t,l.wrap=o,l.gzhead=null,l.w_bits=n,l.w_size=1<<l.w_bits,l.w_mask=l.w_size-1,l.hash_bits=r+7,l.hash_size=1<<l.hash_bits,l.hash_mask=l.hash_size-1,l.hash_shift=~~((l.hash_bits+oe-1)/oe),l.window=new A.Buf8(2*l.w_size),l.head=new A.Buf16(l.hash_size),l.prev=new A.Buf16(l.w_size),l.lit_bufsize=1<<r+6,l.pending_buf_size=4*l.lit_bufsize,l.pending_buf=new A.Buf8(l.pending_buf_size),l.d_buf=l.lit_bufsize>>1,l.l_buf=3*l.lit_bufsize,l.level=e,l.strategy=s,l.method=a,k(t)}function z(t,e){return y(t,e,J,V,$,X)}function B(t,e){var a,o,d,f;if(!t||!t.state||e>F||0>e)return t?i(t,H):H;if(o=t.state,!t.output||!t.input&&0!==t.avail_in||o.status===me&&e!==D)return i(t,0===t.avail_out?M:H);if(o.strm=t,a=o.last_flush,o.last_flush=e,o.status===fe)if(2===o.wrap)t.adler=0,l(o,31),l(o,139),l(o,8),o.gzhead?(l(o,(o.gzhead.text?1:0)+(o.gzhead.hcrc?2:0)+(o.gzhead.extra?4:0)+(o.gzhead.name?8:0)+(o.gzhead.comment?16:0)),l(o,255&o.gzhead.time),l(o,o.gzhead.time>>8&255),l(o,o.gzhead.time>>16&255),l(o,o.gzhead.time>>24&255),l(o,9===o.level?2:o.strategy>=q||o.level<2?4:0),l(o,255&o.gzhead.os),o.gzhead.extra&&o.gzhead.extra.length&&(l(o,255&o.gzhead.extra.length),l(o,o.gzhead.extra.length>>8&255)),o.gzhead.hcrc&&(t.adler=C(t.adler,o.pending_buf,o.pending,0)),o.gzindex=0,o.status=_e):(l(o,0),l(o,0),l(o,0),l(o,0),l(o,0),l(o,9===o.level?2:o.strategy>=q||o.level<2?4:0),l(o,xe),o.status=ge);else{var _=J+(o.w_bits-8<<4)<<8,u=-1;u=o.strategy>=q||o.level<2?0:o.level<6?1:6===o.level?2:3,_|=u<<6,0!==o.strstart&&(_|=de),_+=31-_%31,o.status=ge,h(o,_),0!==o.strstart&&(h(o,t.adler>>>16),h(o,65535&t.adler)),t.adler=1}if(o.status===_e)if(o.gzhead.extra){for(d=o.pending;o.gzindex<(65535&o.gzhead.extra.length)&&(o.pending!==o.pending_buf_size||(o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),s(t),d=o.pending,o.pending!==o.pending_buf_size));)l(o,255&o.gzhead.extra[o.gzindex]),o.gzindex++;o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),o.gzindex===o.gzhead.extra.length&&(o.gzindex=0,o.status=ue)}else o.status=ue;if(o.status===ue)if(o.gzhead.name){d=o.pending;do{if(o.pending===o.pending_buf_size&&(o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),s(t),d=o.pending,o.pending===o.pending_buf_size)){f=1;break}f=o.gzindex<o.gzhead.name.length?255&o.gzhead.name.charCodeAt(o.gzindex++):0,l(o,f)}while(0!==f);o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),0===f&&(o.gzindex=0,o.status=ce)}else o.status=ce;if(o.status===ce)if(o.gzhead.comment){d=o.pending;do{if(o.pending===o.pending_buf_size&&(o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),s(t),d=o.pending,o.pending===o.pending_buf_size)){f=1;break}f=o.gzindex<o.gzhead.comment.length?255&o.gzhead.comment.charCodeAt(o.gzindex++):0,l(o,f)}while(0!==f);o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),0===f&&(o.status=be)}else o.status=be;if(o.status===be&&(o.gzhead.hcrc?(o.pending+2>o.pending_buf_size&&s(t),o.pending+2<=o.pending_buf_size&&(l(o,255&t.adler),l(o,t.adler>>8&255),t.adler=0,o.status=ge)):o.status=ge),0!==o.pending){if(s(t),0===t.avail_out)return o.last_flush=-1,L}else if(0===t.avail_in&&n(e)<=n(a)&&e!==D)return i(t,M);if(o.status===me&&0!==t.avail_in)return i(t,M);if(0!==t.avail_in||0!==o.lookahead||e!==N&&o.status!==me){var c=o.strategy===q?m(o,e):o.strategy===Y?g(o,e):E[o.level].func(o,e);if((c===ve||c===ke)&&(o.status=me),c===we||c===ve)return 0===t.avail_out&&(o.last_flush=-1),L;if(c===pe&&(e===O?Z._tr_align(o):e!==F&&(Z._tr_stored_block(o,0,0,!1),e===T&&(r(o.head),0===o.lookahead&&(o.strstart=0,o.block_start=0,o.insert=0))),s(t),0===t.avail_out))return o.last_flush=-1,L}return e!==D?L:o.wrap<=0?U:(2===o.wrap?(l(o,255&t.adler),l(o,t.adler>>8&255),l(o,t.adler>>16&255),l(o,t.adler>>24&255),l(o,255&t.total_in),l(o,t.total_in>>8&255),l(o,t.total_in>>16&255),l(o,t.total_in>>24&255)):(h(o,t.adler>>>16),h(o,65535&t.adler)),s(t),o.wrap>0&&(o.wrap=-o.wrap),0!==o.pending?L:U)}function S(t){var e;return t&&t.state?(e=t.state.status,e!==fe&&e!==_e&&e!==ue&&e!==ce&&e!==be&&e!==ge&&e!==me?i(t,H):(t.state=null,e===ge?i(t,j):L)):H}var E,A=t("../utils/common"),Z=t("./trees"),R=t("./adler32"),C=t("./crc32"),I=t("./messages"),N=0,O=1,T=3,D=4,F=5,L=0,U=1,H=-2,j=-3,M=-5,K=-1,P=1,q=2,Y=3,G=4,X=0,W=2,J=8,Q=9,V=15,$=8,te=29,ee=256,ae=ee+1+te,ie=30,ne=19,re=2*ae+1,se=15,oe=3,le=258,he=le+oe+1,de=32,fe=42,_e=69,ue=73,ce=91,be=103,ge=113,me=666,we=1,pe=2,ve=3,ke=4,xe=3,ye=function(t,e,a,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=i,this.func=n};E=[new ye(0,0,0,0,u),new ye(4,4,8,4,c),new ye(4,5,16,8,c),new ye(4,6,32,32,c),new ye(4,4,16,16,b),new ye(8,16,32,32,b),new ye(8,16,128,128,b),new ye(8,32,128,256,b),new ye(32,128,258,1024,b),new ye(32,258,258,4096,b)],a.deflateInit=z,a.deflateInit2=y,a.deflateReset=k,a.deflateResetKeep=v,a.deflateSetHeader=x,a.deflate=B,a.deflateEnd=S,a.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":4,"./adler32":6,"./crc32":8,"./messages":14,"./trees":15}],10:[function(t,e){"use strict";function a(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}e.exports=a},{}],11:[function(t,e){"use strict";var a=30,i=12;e.exports=function(t,e){var n,r,s,o,l,h,d,f,_,u,c,b,g,m,w,p,v,k,x,y,z,B,S,E,A;n=t.state,r=t.next_in,E=t.input,s=r+(t.avail_in-5),o=t.next_out,A=t.output,l=o-(e-t.avail_out),h=o+(t.avail_out-257),d=n.dmax,f=n.wsize,_=n.whave,u=n.wnext,c=n.window,b=n.hold,g=n.bits,m=n.lencode,w=n.distcode,p=(1<<n.lenbits)-1,v=(1<<n.distbits)-1;t:do{15>g&&(b+=E[r++]<<g,g+=8,b+=E[r++]<<g,g+=8),k=m[b&p];e:for(;;){if(x=k>>>24,b>>>=x,g-=x,x=k>>>16&255,0===x)A[o++]=65535&k;else{if(!(16&x)){if(0===(64&x)){k=m[(65535&k)+(b&(1<<x)-1)];continue e}if(32&x){n.mode=i;break t}t.msg="invalid literal/length code",n.mode=a;break t}y=65535&k,x&=15,x&&(x>g&&(b+=E[r++]<<g,g+=8),y+=b&(1<<x)-1,b>>>=x,g-=x),15>g&&(b+=E[r++]<<g,g+=8,b+=E[r++]<<g,g+=8),k=w[b&v];a:for(;;){if(x=k>>>24,b>>>=x,g-=x,x=k>>>16&255,!(16&x)){if(0===(64&x)){k=w[(65535&k)+(b&(1<<x)-1)];continue a}t.msg="invalid distance code",n.mode=a;break t}if(z=65535&k,x&=15,x>g&&(b+=E[r++]<<g,g+=8,x>g&&(b+=E[r++]<<g,g+=8)),z+=b&(1<<x)-1,z>d){t.msg="invalid distance too far back",n.mode=a;break t}if(b>>>=x,g-=x,x=o-l,z>x){if(x=z-x,x>_&&n.sane){t.msg="invalid distance too far back",n.mode=a;break t}if(B=0,S=c,0===u){if(B+=f-x,y>x){y-=x;do A[o++]=c[B++];while(--x);B=o-z,S=A}}else if(x>u){if(B+=f+u-x,x-=u,y>x){y-=x;do A[o++]=c[B++];while(--x);if(B=0,y>u){x=u,y-=x;do A[o++]=c[B++];while(--x);B=o-z,S=A}}}else if(B+=u-x,y>x){y-=x;do A[o++]=c[B++];while(--x);B=o-z,S=A}for(;y>2;)A[o++]=S[B++],A[o++]=S[B++],A[o++]=S[B++],y-=3;y&&(A[o++]=S[B++],y>1&&(A[o++]=S[B++]))}else{B=o-z;do A[o++]=A[B++],A[o++]=A[B++],A[o++]=A[B++],y-=3;while(y>2);y&&(A[o++]=A[B++],y>1&&(A[o++]=A[B++]))}break}}break}}while(s>r&&h>o);y=g>>3,r-=y,g-=y<<3,b&=(1<<g)-1,t.next_in=r,t.next_out=o,t.avail_in=s>r?5+(s-r):5-(r-s),t.avail_out=h>o?257+(h-o):257-(o-h),n.hold=b,n.bits=g}},{}],12:[function(t,e,a){"use strict";function i(t){return(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24)}function n(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new m.Buf16(320),this.work=new m.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function r(t){var e;return t&&t.state?(e=t.state,t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=D,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new m.Buf32(ce),e.distcode=e.distdyn=new m.Buf32(be),e.sane=1,e.back=-1,A):C}function s(t){var e;return t&&t.state?(e=t.state,e.wsize=0,e.whave=0,e.wnext=0,r(t)):C}function o(t,e){var a,i;return t&&t.state?(i=t.state,0>e?(a=0,e=-e):(a=(e>>4)+1,48>e&&(e&=15)),e&&(8>e||e>15)?C:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=a,i.wbits=e,s(t))):C}function l(t,e){var a,i;return t?(i=new n,t.state=i,i.window=null,a=o(t,e),a!==A&&(t.state=null),a):C}function h(t){return l(t,me)}function d(t){if(we){var e;for(b=new m.Buf32(512),g=new m.Buf32(32),e=0;144>e;)t.lens[e++]=8;for(;256>e;)t.lens[e++]=9;for(;280>e;)t.lens[e++]=7;for(;288>e;)t.lens[e++]=8;for(k(y,t.lens,0,288,b,0,t.work,{bits:9}),e=0;32>e;)t.lens[e++]=5;k(z,t.lens,0,32,g,0,t.work,{bits:5}),we=!1}t.lencode=b,t.lenbits=9,t.distcode=g,t.distbits=5}function f(t,e,a,i){var n,r=t.state;return null===r.window&&(r.wsize=1<<r.wbits,r.wnext=0,r.whave=0,r.window=new m.Buf8(r.wsize)),i>=r.wsize?(m.arraySet(r.window,e,a-r.wsize,r.wsize,0),r.wnext=0,r.whave=r.wsize):(n=r.wsize-r.wnext,n>i&&(n=i),m.arraySet(r.window,e,a-i,n,r.wnext),i-=n,i?(m.arraySet(r.window,e,a-i,i,0),r.wnext=i,r.whave=r.wsize):(r.wnext+=n,r.wnext===r.wsize&&(r.wnext=0),r.whave<r.wsize&&(r.whave+=n))),0}function _(t,e){var a,n,r,s,o,l,h,_,u,c,b,g,ce,be,ge,me,we,pe,ve,ke,xe,ye,ze,Be,Se=0,Ee=new m.Buf8(4),Ae=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return C;a=t.state,a.mode===G&&(a.mode=X),o=t.next_out,r=t.output,h=t.avail_out,s=t.next_in,n=t.input,l=t.avail_in,_=a.hold,u=a.bits,c=l,b=h,ye=A;t:for(;;)switch(a.mode){case D:if(0===a.wrap){a.mode=X;break}for(;16>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(2&a.wrap&&35615===_){a.check=0,Ee[0]=255&_,Ee[1]=_>>>8&255,a.check=p(a.check,Ee,2,0),_=0,u=0,a.mode=F;break}if(a.flags=0,a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&_)<<8)+(_>>8))%31){t.msg="incorrect header check",a.mode=fe;break}if((15&_)!==T){t.msg="unknown compression method",a.mode=fe;break}if(_>>>=4,u-=4,xe=(15&_)+8,0===a.wbits)a.wbits=xe;else if(xe>a.wbits){t.msg="invalid window size",a.mode=fe;break}a.dmax=1<<xe,t.adler=a.check=1,a.mode=512&_?q:G,_=0,u=0;break;case F:for(;16>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(a.flags=_,(255&a.flags)!==T){t.msg="unknown compression method",a.mode=fe;break}if(57344&a.flags){t.msg="unknown header flags set",a.mode=fe;break}a.head&&(a.head.text=_>>8&1),512&a.flags&&(Ee[0]=255&_,Ee[1]=_>>>8&255,a.check=p(a.check,Ee,2,0)),_=0,u=0,a.mode=L;case L:for(;32>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.head&&(a.head.time=_),512&a.flags&&(Ee[0]=255&_,Ee[1]=_>>>8&255,Ee[2]=_>>>16&255,Ee[3]=_>>>24&255,a.check=p(a.check,Ee,4,0)),_=0,u=0,a.mode=U;case U:for(;16>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.head&&(a.head.xflags=255&_,a.head.os=_>>8),512&a.flags&&(Ee[0]=255&_,Ee[1]=_>>>8&255,a.check=p(a.check,Ee,2,0)),_=0,u=0,a.mode=H;case H:if(1024&a.flags){for(;16>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.length=_,a.head&&(a.head.extra_len=_),512&a.flags&&(Ee[0]=255&_,Ee[1]=_>>>8&255,a.check=p(a.check,Ee,2,0)),_=0,u=0}else a.head&&(a.head.extra=null);a.mode=j;case j:if(1024&a.flags&&(g=a.length,g>l&&(g=l),g&&(a.head&&(xe=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Array(a.head.extra_len)),m.arraySet(a.head.extra,n,s,g,xe)),512&a.flags&&(a.check=p(a.check,n,g,s)),l-=g,s+=g,a.length-=g),a.length))break t;a.length=0,a.mode=M;case M:if(2048&a.flags){if(0===l)break t;g=0;do xe=n[s+g++],a.head&&xe&&a.length<65536&&(a.head.name+=String.fromCharCode(xe));while(xe&&l>g);if(512&a.flags&&(a.check=p(a.check,n,g,s)),l-=g,s+=g,xe)break t}else a.head&&(a.head.name=null);a.length=0,a.mode=K;case K:if(4096&a.flags){if(0===l)break t;g=0;do xe=n[s+g++],a.head&&xe&&a.length<65536&&(a.head.comment+=String.fromCharCode(xe));while(xe&&l>g);if(512&a.flags&&(a.check=p(a.check,n,g,s)),l-=g,s+=g,xe)break t}else a.head&&(a.head.comment=null);a.mode=P;case P:if(512&a.flags){for(;16>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(_!==(65535&a.check)){t.msg="header crc mismatch",a.mode=fe;break}_=0,u=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),t.adler=a.check=0,a.mode=G;break;case q:for(;32>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}t.adler=a.check=i(_),_=0,u=0,a.mode=Y;case Y:if(0===a.havedict)return t.next_out=o,t.avail_out=h,t.next_in=s,t.avail_in=l,a.hold=_,a.bits=u,R;t.adler=a.check=1,a.mode=G;case G:if(e===S||e===E)break t;case X:if(a.last){_>>>=7&u,u-=7&u,a.mode=le;break}for(;3>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}switch(a.last=1&_,_>>>=1,u-=1,3&_){case 0:a.mode=W;break;case 1:if(d(a),a.mode=ee,e===E){_>>>=2,u-=2;break t}break;case 2:a.mode=V;break;case 3:t.msg="invalid block type",a.mode=fe}_>>>=2,u-=2;break;case W:for(_>>>=7&u,u-=7&u;32>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if((65535&_)!==(_>>>16^65535)){t.msg="invalid stored block lengths",a.mode=fe;break}if(a.length=65535&_,_=0,u=0,a.mode=J,e===E)break t;case J:a.mode=Q;case Q:if(g=a.length){if(g>l&&(g=l),g>h&&(g=h),0===g)break t;m.arraySet(r,n,s,g,o),l-=g,s+=g,h-=g,o+=g,a.length-=g;break}a.mode=G;break;case V:for(;14>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(a.nlen=(31&_)+257,_>>>=5,u-=5,a.ndist=(31&_)+1,_>>>=5,u-=5,a.ncode=(15&_)+4,_>>>=4,u-=4,a.nlen>286||a.ndist>30){t.msg="too many length or distance symbols",a.mode=fe;break}a.have=0,a.mode=$;case $:for(;a.have<a.ncode;){for(;3>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.lens[Ae[a.have++]]=7&_,_>>>=3,u-=3}for(;a.have<19;)a.lens[Ae[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,ze={bits:a.lenbits},ye=k(x,a.lens,0,19,a.lencode,0,a.work,ze),a.lenbits=ze.bits,ye){t.msg="invalid code lengths set",a.mode=fe;break}a.have=0,a.mode=te;case te:for(;a.have<a.nlen+a.ndist;){for(;Se=a.lencode[_&(1<<a.lenbits)-1],ge=Se>>>24,me=Se>>>16&255,we=65535&Se,!(u>=ge);){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(16>we)_>>>=ge,u-=ge,a.lens[a.have++]=we;else{if(16===we){for(Be=ge+2;Be>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(_>>>=ge,u-=ge,0===a.have){t.msg="invalid bit length repeat",a.mode=fe;break}xe=a.lens[a.have-1],g=3+(3&_),_>>>=2,u-=2}else if(17===we){for(Be=ge+3;Be>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}_>>>=ge,u-=ge,xe=0,g=3+(7&_),_>>>=3,u-=3}else{for(Be=ge+7;Be>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}_>>>=ge,u-=ge,xe=0,g=11+(127&_),_>>>=7,u-=7}if(a.have+g>a.nlen+a.ndist){t.msg="invalid bit length repeat",a.mode=fe;break}for(;g--;)a.lens[a.have++]=xe}}if(a.mode===fe)break;if(0===a.lens[256]){t.msg="invalid code -- missing end-of-block",a.mode=fe;break}if(a.lenbits=9,ze={bits:a.lenbits},ye=k(y,a.lens,0,a.nlen,a.lencode,0,a.work,ze),a.lenbits=ze.bits,ye){t.msg="invalid literal/lengths set",a.mode=fe;break}if(a.distbits=6,a.distcode=a.distdyn,ze={bits:a.distbits},ye=k(z,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,ze),a.distbits=ze.bits,ye){t.msg="invalid distances set",a.mode=fe;
break}if(a.mode=ee,e===E)break t;case ee:a.mode=ae;case ae:if(l>=6&&h>=258){t.next_out=o,t.avail_out=h,t.next_in=s,t.avail_in=l,a.hold=_,a.bits=u,v(t,b),o=t.next_out,r=t.output,h=t.avail_out,s=t.next_in,n=t.input,l=t.avail_in,_=a.hold,u=a.bits,a.mode===G&&(a.back=-1);break}for(a.back=0;Se=a.lencode[_&(1<<a.lenbits)-1],ge=Se>>>24,me=Se>>>16&255,we=65535&Se,!(u>=ge);){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(me&&0===(240&me)){for(pe=ge,ve=me,ke=we;Se=a.lencode[ke+((_&(1<<pe+ve)-1)>>pe)],ge=Se>>>24,me=Se>>>16&255,we=65535&Se,!(u>=pe+ge);){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}_>>>=pe,u-=pe,a.back+=pe}if(_>>>=ge,u-=ge,a.back+=ge,a.length=we,0===me){a.mode=oe;break}if(32&me){a.back=-1,a.mode=G;break}if(64&me){t.msg="invalid literal/length code",a.mode=fe;break}a.extra=15&me,a.mode=ie;case ie:if(a.extra){for(Be=a.extra;Be>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.length+=_&(1<<a.extra)-1,_>>>=a.extra,u-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=ne;case ne:for(;Se=a.distcode[_&(1<<a.distbits)-1],ge=Se>>>24,me=Se>>>16&255,we=65535&Se,!(u>=ge);){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(0===(240&me)){for(pe=ge,ve=me,ke=we;Se=a.distcode[ke+((_&(1<<pe+ve)-1)>>pe)],ge=Se>>>24,me=Se>>>16&255,we=65535&Se,!(u>=pe+ge);){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}_>>>=pe,u-=pe,a.back+=pe}if(_>>>=ge,u-=ge,a.back+=ge,64&me){t.msg="invalid distance code",a.mode=fe;break}a.offset=we,a.extra=15&me,a.mode=re;case re:if(a.extra){for(Be=a.extra;Be>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.offset+=_&(1<<a.extra)-1,_>>>=a.extra,u-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){t.msg="invalid distance too far back",a.mode=fe;break}a.mode=se;case se:if(0===h)break t;if(g=b-h,a.offset>g){if(g=a.offset-g,g>a.whave&&a.sane){t.msg="invalid distance too far back",a.mode=fe;break}g>a.wnext?(g-=a.wnext,ce=a.wsize-g):ce=a.wnext-g,g>a.length&&(g=a.length),be=a.window}else be=r,ce=o-a.offset,g=a.length;g>h&&(g=h),h-=g,a.length-=g;do r[o++]=be[ce++];while(--g);0===a.length&&(a.mode=ae);break;case oe:if(0===h)break t;r[o++]=a.length,h--,a.mode=ae;break;case le:if(a.wrap){for(;32>u;){if(0===l)break t;l--,_|=n[s++]<<u,u+=8}if(b-=h,t.total_out+=b,a.total+=b,b&&(t.adler=a.check=a.flags?p(a.check,r,b,o-b):w(a.check,r,b,o-b)),b=h,(a.flags?_:i(_))!==a.check){t.msg="incorrect data check",a.mode=fe;break}_=0,u=0}a.mode=he;case he:if(a.wrap&&a.flags){for(;32>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(_!==(4294967295&a.total)){t.msg="incorrect length check",a.mode=fe;break}_=0,u=0}a.mode=de;case de:ye=Z;break t;case fe:ye=I;break t;case _e:return N;case ue:default:return C}return t.next_out=o,t.avail_out=h,t.next_in=s,t.avail_in=l,a.hold=_,a.bits=u,(a.wsize||b!==t.avail_out&&a.mode<fe&&(a.mode<le||e!==B))&&f(t,t.output,t.next_out,b-t.avail_out)?(a.mode=_e,N):(c-=t.avail_in,b-=t.avail_out,t.total_in+=c,t.total_out+=b,a.total+=b,a.wrap&&b&&(t.adler=a.check=a.flags?p(a.check,r,b,t.next_out-b):w(a.check,r,b,t.next_out-b)),t.data_type=a.bits+(a.last?64:0)+(a.mode===G?128:0)+(a.mode===ee||a.mode===J?256:0),(0===c&&0===b||e===B)&&ye===A&&(ye=O),ye)}function u(t){if(!t||!t.state)return C;var e=t.state;return e.window&&(e.window=null),t.state=null,A}function c(t,e){var a;return t&&t.state?(a=t.state,0===(2&a.wrap)?C:(a.head=e,e.done=!1,A)):C}var b,g,m=t("../utils/common"),w=t("./adler32"),p=t("./crc32"),v=t("./inffast"),k=t("./inftrees"),x=0,y=1,z=2,B=4,S=5,E=6,A=0,Z=1,R=2,C=-2,I=-3,N=-4,O=-5,T=8,D=1,F=2,L=3,U=4,H=5,j=6,M=7,K=8,P=9,q=10,Y=11,G=12,X=13,W=14,J=15,Q=16,V=17,$=18,te=19,ee=20,ae=21,ie=22,ne=23,re=24,se=25,oe=26,le=27,he=28,de=29,fe=30,_e=31,ue=32,ce=852,be=592,ge=15,me=ge,we=!0;a.inflateReset=s,a.inflateReset2=o,a.inflateResetKeep=r,a.inflateInit=h,a.inflateInit2=l,a.inflate=_,a.inflateEnd=u,a.inflateGetHeader=c,a.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":4,"./adler32":6,"./crc32":8,"./inffast":11,"./inftrees":13}],13:[function(t,e){"use strict";var a=t("../utils/common"),i=15,n=852,r=592,s=0,o=1,l=2,h=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],d=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],f=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],_=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(t,e,u,c,b,g,m,w){var p,v,k,x,y,z,B,S,E,A=w.bits,Z=0,R=0,C=0,I=0,N=0,O=0,T=0,D=0,F=0,L=0,U=null,H=0,j=new a.Buf16(i+1),M=new a.Buf16(i+1),K=null,P=0;for(Z=0;i>=Z;Z++)j[Z]=0;for(R=0;c>R;R++)j[e[u+R]]++;for(N=A,I=i;I>=1&&0===j[I];I--);if(N>I&&(N=I),0===I)return b[g++]=20971520,b[g++]=20971520,w.bits=1,0;for(C=1;I>C&&0===j[C];C++);for(C>N&&(N=C),D=1,Z=1;i>=Z;Z++)if(D<<=1,D-=j[Z],0>D)return-1;if(D>0&&(t===s||1!==I))return-1;for(M[1]=0,Z=1;i>Z;Z++)M[Z+1]=M[Z]+j[Z];for(R=0;c>R;R++)0!==e[u+R]&&(m[M[e[u+R]]++]=R);if(t===s?(U=K=m,z=19):t===o?(U=h,H-=257,K=d,P-=257,z=256):(U=f,K=_,z=-1),L=0,R=0,Z=C,y=g,O=N,T=0,k=-1,F=1<<N,x=F-1,t===o&&F>n||t===l&&F>r)return 1;for(var q=0;;){q++,B=Z-T,m[R]<z?(S=0,E=m[R]):m[R]>z?(S=K[P+m[R]],E=U[H+m[R]]):(S=96,E=0),p=1<<Z-T,v=1<<O,C=v;do v-=p,b[y+(L>>T)+v]=B<<24|S<<16|E|0;while(0!==v);for(p=1<<Z-1;L&p;)p>>=1;if(0!==p?(L&=p-1,L+=p):L=0,R++,0===--j[Z]){if(Z===I)break;Z=e[u+m[R]]}if(Z>N&&(L&x)!==k){for(0===T&&(T=N),y+=C,O=Z-T,D=1<<O;I>O+T&&(D-=j[O+T],!(0>=D));)O++,D<<=1;if(F+=1<<O,t===o&&F>n||t===l&&F>r)return 1;k=L&x,b[k]=N<<24|O<<16|y-g|0}}return 0!==L&&(b[y+L]=Z-T<<24|64<<16|0),w.bits=N,0}},{"../utils/common":4}],14:[function(t,e){"use strict";e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],15:[function(t,e,a){"use strict";function i(t){for(var e=t.length;--e>=0;)t[e]=0}function n(t){return 256>t?se[t]:se[256+(t>>>7)]}function r(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function s(t,e,a){t.bi_valid>G-a?(t.bi_buf|=e<<t.bi_valid&65535,r(t,t.bi_buf),t.bi_buf=e>>G-t.bi_valid,t.bi_valid+=a-G):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)}function o(t,e,a){s(t,a[2*e],a[2*e+1])}function l(t,e){var a=0;do a|=1&t,t>>>=1,a<<=1;while(--e>0);return a>>>1}function h(t){16===t.bi_valid?(r(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}function d(t,e){var a,i,n,r,s,o,l=e.dyn_tree,h=e.max_code,d=e.stat_desc.static_tree,f=e.stat_desc.has_stree,_=e.stat_desc.extra_bits,u=e.stat_desc.extra_base,c=e.stat_desc.max_length,b=0;for(r=0;Y>=r;r++)t.bl_count[r]=0;for(l[2*t.heap[t.heap_max]+1]=0,a=t.heap_max+1;q>a;a++)i=t.heap[a],r=l[2*l[2*i+1]+1]+1,r>c&&(r=c,b++),l[2*i+1]=r,i>h||(t.bl_count[r]++,s=0,i>=u&&(s=_[i-u]),o=l[2*i],t.opt_len+=o*(r+s),f&&(t.static_len+=o*(d[2*i+1]+s)));if(0!==b){do{for(r=c-1;0===t.bl_count[r];)r--;t.bl_count[r]--,t.bl_count[r+1]+=2,t.bl_count[c]--,b-=2}while(b>0);for(r=c;0!==r;r--)for(i=t.bl_count[r];0!==i;)n=t.heap[--a],n>h||(l[2*n+1]!==r&&(t.opt_len+=(r-l[2*n+1])*l[2*n],l[2*n+1]=r),i--)}}function f(t,e,a){var i,n,r=new Array(Y+1),s=0;for(i=1;Y>=i;i++)r[i]=s=s+a[i-1]<<1;for(n=0;e>=n;n++){var o=t[2*n+1];0!==o&&(t[2*n]=l(r[o]++,o))}}function _(){var t,e,a,i,n,r=new Array(Y+1);for(a=0,i=0;H-1>i;i++)for(le[i]=a,t=0;t<1<<$[i];t++)oe[a++]=i;for(oe[a-1]=i,n=0,i=0;16>i;i++)for(he[i]=n,t=0;t<1<<te[i];t++)se[n++]=i;for(n>>=7;K>i;i++)for(he[i]=n<<7,t=0;t<1<<te[i]-7;t++)se[256+n++]=i;for(e=0;Y>=e;e++)r[e]=0;for(t=0;143>=t;)ne[2*t+1]=8,t++,r[8]++;for(;255>=t;)ne[2*t+1]=9,t++,r[9]++;for(;279>=t;)ne[2*t+1]=7,t++,r[7]++;for(;287>=t;)ne[2*t+1]=8,t++,r[8]++;for(f(ne,M+1,r),t=0;K>t;t++)re[2*t+1]=5,re[2*t]=l(t,5);de=new ue(ne,$,j+1,M,Y),fe=new ue(re,te,0,K,Y),_e=new ue(new Array(0),ee,0,P,X)}function u(t){var e;for(e=0;M>e;e++)t.dyn_ltree[2*e]=0;for(e=0;K>e;e++)t.dyn_dtree[2*e]=0;for(e=0;P>e;e++)t.bl_tree[2*e]=0;t.dyn_ltree[2*W]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function c(t){t.bi_valid>8?r(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function b(t,e,a,i){c(t),i&&(r(t,a),r(t,~a)),R.arraySet(t.pending_buf,t.window,e,a,t.pending),t.pending+=a}function g(t,e,a,i){var n=2*e,r=2*a;return t[n]<t[r]||t[n]===t[r]&&i[e]<=i[a]}function m(t,e,a){for(var i=t.heap[a],n=a<<1;n<=t.heap_len&&(n<t.heap_len&&g(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!g(e,i,t.heap[n],t.depth));)t.heap[a]=t.heap[n],a=n,n<<=1;t.heap[a]=i}function w(t,e,a){var i,r,l,h,d=0;if(0!==t.last_lit)do i=t.pending_buf[t.d_buf+2*d]<<8|t.pending_buf[t.d_buf+2*d+1],r=t.pending_buf[t.l_buf+d],d++,0===i?o(t,r,e):(l=oe[r],o(t,l+j+1,e),h=$[l],0!==h&&(r-=le[l],s(t,r,h)),i--,l=n(i),o(t,l,a),h=te[l],0!==h&&(i-=he[l],s(t,i,h)));while(d<t.last_lit);o(t,W,e)}function p(t,e){var a,i,n,r=e.dyn_tree,s=e.stat_desc.static_tree,o=e.stat_desc.has_stree,l=e.stat_desc.elems,h=-1;for(t.heap_len=0,t.heap_max=q,a=0;l>a;a++)0!==r[2*a]?(t.heap[++t.heap_len]=h=a,t.depth[a]=0):r[2*a+1]=0;for(;t.heap_len<2;)n=t.heap[++t.heap_len]=2>h?++h:0,r[2*n]=1,t.depth[n]=0,t.opt_len--,o&&(t.static_len-=s[2*n+1]);for(e.max_code=h,a=t.heap_len>>1;a>=1;a--)m(t,r,a);n=l;do a=t.heap[1],t.heap[1]=t.heap[t.heap_len--],m(t,r,1),i=t.heap[1],t.heap[--t.heap_max]=a,t.heap[--t.heap_max]=i,r[2*n]=r[2*a]+r[2*i],t.depth[n]=(t.depth[a]>=t.depth[i]?t.depth[a]:t.depth[i])+1,r[2*a+1]=r[2*i+1]=n,t.heap[1]=n++,m(t,r,1);while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],d(t,e),f(r,h,t.bl_count)}function v(t,e,a){var i,n,r=-1,s=e[1],o=0,l=7,h=4;for(0===s&&(l=138,h=3),e[2*(a+1)+1]=65535,i=0;a>=i;i++)n=s,s=e[2*(i+1)+1],++o<l&&n===s||(h>o?t.bl_tree[2*n]+=o:0!==n?(n!==r&&t.bl_tree[2*n]++,t.bl_tree[2*J]++):10>=o?t.bl_tree[2*Q]++:t.bl_tree[2*V]++,o=0,r=n,0===s?(l=138,h=3):n===s?(l=6,h=3):(l=7,h=4))}function k(t,e,a){var i,n,r=-1,l=e[1],h=0,d=7,f=4;for(0===l&&(d=138,f=3),i=0;a>=i;i++)if(n=l,l=e[2*(i+1)+1],!(++h<d&&n===l)){if(f>h){do o(t,n,t.bl_tree);while(0!==--h)}else 0!==n?(n!==r&&(o(t,n,t.bl_tree),h--),o(t,J,t.bl_tree),s(t,h-3,2)):10>=h?(o(t,Q,t.bl_tree),s(t,h-3,3)):(o(t,V,t.bl_tree),s(t,h-11,7));h=0,r=n,0===l?(d=138,f=3):n===l?(d=6,f=3):(d=7,f=4)}}function x(t){var e;for(v(t,t.dyn_ltree,t.l_desc.max_code),v(t,t.dyn_dtree,t.d_desc.max_code),p(t,t.bl_desc),e=P-1;e>=3&&0===t.bl_tree[2*ae[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}function y(t,e,a,i){var n;for(s(t,e-257,5),s(t,a-1,5),s(t,i-4,4),n=0;i>n;n++)s(t,t.bl_tree[2*ae[n]+1],3);k(t,t.dyn_ltree,e-1),k(t,t.dyn_dtree,a-1)}function z(t){var e,a=4093624447;for(e=0;31>=e;e++,a>>>=1)if(1&a&&0!==t.dyn_ltree[2*e])return I;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return N;for(e=32;j>e;e++)if(0!==t.dyn_ltree[2*e])return N;return I}function B(t){be||(_(),be=!0),t.l_desc=new ce(t.dyn_ltree,de),t.d_desc=new ce(t.dyn_dtree,fe),t.bl_desc=new ce(t.bl_tree,_e),t.bi_buf=0,t.bi_valid=0,u(t)}function S(t,e,a,i){s(t,(T<<1)+(i?1:0),3),b(t,e,a,!0)}function E(t){s(t,D<<1,3),o(t,W,ne),h(t)}function A(t,e,a,i){var n,r,o=0;t.level>0?(t.strm.data_type===O&&(t.strm.data_type=z(t)),p(t,t.l_desc),p(t,t.d_desc),o=x(t),n=t.opt_len+3+7>>>3,r=t.static_len+3+7>>>3,n>=r&&(n=r)):n=r=a+5,n>=a+4&&-1!==e?S(t,e,a,i):t.strategy===C||r===n?(s(t,(D<<1)+(i?1:0),3),w(t,ne,re)):(s(t,(F<<1)+(i?1:0),3),y(t,t.l_desc.max_code+1,t.d_desc.max_code+1,o+1),w(t,t.dyn_ltree,t.dyn_dtree)),u(t),i&&c(t)}function Z(t,e,a){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&a,t.last_lit++,0===e?t.dyn_ltree[2*a]++:(t.matches++,e--,t.dyn_ltree[2*(oe[a]+j+1)]++,t.dyn_dtree[2*n(e)]++),t.last_lit===t.lit_bufsize-1}var R=t("../utils/common"),C=4,I=0,N=1,O=2,T=0,D=1,F=2,L=3,U=258,H=29,j=256,M=j+1+H,K=30,P=19,q=2*M+1,Y=15,G=16,X=7,W=256,J=16,Q=17,V=18,$=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],te=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],ee=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],ae=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],ie=512,ne=new Array(2*(M+2));i(ne);var re=new Array(2*K);i(re);var se=new Array(ie);i(se);var oe=new Array(U-L+1);i(oe);var le=new Array(H);i(le);var he=new Array(K);i(he);var de,fe,_e,ue=function(t,e,a,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=i,this.max_length=n,this.has_stree=t&&t.length},ce=function(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e},be=!1;a._tr_init=B,a._tr_stored_block=S,a._tr_flush_block=A,a._tr_tally=Z,a._tr_align=E},{"../utils/common":4}],16:[function(t,e){"use strict";function a(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}e.exports=a},{}]},{},[1])(1)});
/*!

JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;"undefined"!=typeof window?b=window:"undefined"!=typeof global?b=global:"undefined"!=typeof self&&(b=self),b.JSZip=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,f,g,h,i,j="",k=0;k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),e=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|e>>6,i=63&e,isNaN(c)?h=i=64:isNaN(e)&&(i=64),j=j+d.charAt(f)+d.charAt(g)+d.charAt(h)+d.charAt(i);return j},c.decode=function(a){var b,c,e,f,g,h,i,j="",k=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=d.indexOf(a.charAt(k++)),g=d.indexOf(a.charAt(k++)),h=d.indexOf(a.charAt(k++)),i=d.indexOf(a.charAt(k++)),b=f<<2|g>>4,c=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(b),64!=h&&(j+=String.fromCharCode(c)),64!=i&&(j+=String.fromCharCode(e));return j}},{}],2:[function(a,b){"use strict";function c(){this.compressedSize=0,this.uncompressedSize=0,this.crc32=0,this.compressionMethod=null,this.compressedContent=null}c.prototype={getContent:function(){return null},getCompressedContent:function(){return null}},b.exports=c},{}],3:[function(a,b,c){"use strict";c.STORE={magic:"\x00\x00",compress:function(a){return a},uncompress:function(a){return a},compressInputType:null,uncompressInputType:null},c.DEFLATE=a("./flate")},{"./flate":8}],4:[function(a,b){"use strict";var c=a("./utils"),d=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];b.exports=function(a,b){if("undefined"==typeof a||!a.length)return 0;var e="string"!==c.getTypeOf(a);"undefined"==typeof b&&(b=0);var f=0,g=0,h=0;b=-1^b;for(var i=0,j=a.length;j>i;i++)h=e?a[i]:a.charCodeAt(i),g=255&(b^h),f=d[g],b=b>>>8^f;return-1^b}},{"./utils":21}],5:[function(a,b){"use strict";function c(){this.data=null,this.length=0,this.index=0}var d=a("./utils");c.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<a||0>a)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return d.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1)}},b.exports=c},{"./utils":21}],6:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.createFolders=!1,c.date=null,c.compression=null,c.compressionOptions=null,c.comment=null,c.unixPermissions=null,c.dosPermissions=null},{}],7:[function(a,b,c){"use strict";var d=a("./utils");c.string2binary=function(a){return d.string2binary(a)},c.string2Uint8Array=function(a){return d.transformTo("uint8array",a)},c.uint8Array2String=function(a){return d.transformTo("string",a)},c.string2Blob=function(a){var b=d.transformTo("arraybuffer",a);return d.arrayBuffer2Blob(b)},c.arrayBuffer2Blob=function(a){return d.arrayBuffer2Blob(a)},c.transformTo=function(a,b){return d.transformTo(a,b)},c.getTypeOf=function(a){return d.getTypeOf(a)},c.checkSupport=function(a){return d.checkSupport(a)},c.MAX_VALUE_16BITS=d.MAX_VALUE_16BITS,c.MAX_VALUE_32BITS=d.MAX_VALUE_32BITS,c.pretty=function(a){return d.pretty(a)},c.findCompression=function(a){return d.findCompression(a)},c.isRegExp=function(a){return d.isRegExp(a)}},{"./utils":21}],8:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,e=a("pako");c.uncompressInputType=d?"uint8array":"array",c.compressInputType=d?"uint8array":"array",c.magic="\b\x00",c.compress=function(a,b){return e.deflateRaw(a,{level:b.level||-1})},c.uncompress=function(a){return e.inflateRaw(a)}},{pako:24}],9:[function(a,b){"use strict";function c(a,b){return this instanceof c?(this.files={},this.comment=null,this.root="",a&&this.load(a,b),void(this.clone=function(){var a=new c;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a})):new c(a,b)}var d=a("./base64");c.prototype=a("./object"),c.prototype.load=a("./load"),c.support=a("./support"),c.defaults=a("./defaults"),c.utils=a("./deprecatedPublicUtils"),c.base64={encode:function(a){return d.encode(a)},decode:function(a){return d.decode(a)}},c.compressions=a("./compressions"),b.exports=c},{"./base64":1,"./compressions":3,"./defaults":6,"./deprecatedPublicUtils":7,"./load":10,"./object":13,"./support":17}],10:[function(a,b){"use strict";var c=a("./base64"),d=a("./zipEntries");b.exports=function(a,b){var e,f,g,h;for(b=b||{},b.base64&&(a=c.decode(a)),f=new d(a,b),e=f.files,g=0;g<e.length;g++)h=e[g],this.file(h.fileName,h.decompressed,{binary:!0,optimizedBinaryString:!0,date:h.date,dir:h.dir,comment:h.fileComment.length?h.fileComment:null,unixPermissions:h.unixPermissions,dosPermissions:h.dosPermissions,createFolders:b.createFolders});return f.zipComment.length&&(this.comment=f.zipComment),this}},{"./base64":1,"./zipEntries":22}],11:[function(a,b){(function(a){"use strict";b.exports=function(b,c){return new a(b,c)},b.exports.test=function(b){return a.isBuffer(b)}}).call(this,"undefined"!=typeof Buffer?Buffer:void 0)},{}],12:[function(a,b){"use strict";function c(a){this.data=a,this.length=this.data.length,this.index=0}var d=a("./uint8ArrayReader");c.prototype=new d,c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./uint8ArrayReader":18}],13:[function(a,b){"use strict";var c=a("./support"),d=a("./utils"),e=a("./crc32"),f=a("./signature"),g=a("./defaults"),h=a("./base64"),i=a("./compressions"),j=a("./compressedObject"),k=a("./nodeBuffer"),l=a("./utf8"),m=a("./stringWriter"),n=a("./uint8ArrayWriter"),o=function(a){if(a._data instanceof j&&(a._data=a._data.getContent(),a.options.binary=!0,a.options.base64=!1,"uint8array"===d.getTypeOf(a._data))){var b=a._data;a._data=new Uint8Array(b.length),0!==b.length&&a._data.set(b,0)}return a._data},p=function(a){var b=o(a),e=d.getTypeOf(b);return"string"===e?!a.options.binary&&c.nodebuffer?k(b,"utf-8"):a.asBinary():b},q=function(a){var b=o(this);return null===b||"undefined"==typeof b?"":(this.options.base64&&(b=h.decode(b)),b=a&&this.options.binary?D.utf8decode(b):d.transformTo("string",b),a||this.options.binary||(b=d.transformTo("string",D.utf8encode(b))),b)},r=function(a,b,c){this.name=a,this.dir=c.dir,this.date=c.date,this.comment=c.comment,this.unixPermissions=c.unixPermissions,this.dosPermissions=c.dosPermissions,this._data=b,this.options=c,this._initialMetadata={dir:c.dir,date:c.date}};r.prototype={asText:function(){return q.call(this,!0)},asBinary:function(){return q.call(this,!1)},asNodeBuffer:function(){var a=p(this);return d.transformTo("nodebuffer",a)},asUint8Array:function(){var a=p(this);return d.transformTo("uint8array",a)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var s=function(a,b){var c,d="";for(c=0;b>c;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},t=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},u=function(a){return a=a||{},a.base64!==!0||null!==a.binary&&void 0!==a.binary||(a.binary=!0),a=t(a,g),a.date=a.date||new Date,null!==a.compression&&(a.compression=a.compression.toUpperCase()),a},v=function(a,b,c){var e,f=d.getTypeOf(b);if(c=u(c),"string"==typeof c.unixPermissions&&(c.unixPermissions=parseInt(c.unixPermissions,8)),c.unixPermissions&&16384&c.unixPermissions&&(c.dir=!0),c.dosPermissions&&16&c.dosPermissions&&(c.dir=!0),c.dir&&(a=x(a)),c.createFolders&&(e=w(a))&&y.call(this,e,!0),c.dir||null===b||"undefined"==typeof b)c.base64=!1,c.binary=!1,b=null,f=null;else if("string"===f)c.binary&&!c.base64&&c.optimizedBinaryString!==!0&&(b=d.string2binary(b));else{if(c.base64=!1,c.binary=!0,!(f||b instanceof j))throw new Error("The data of '"+a+"' is in an unsupported format !");"arraybuffer"===f&&(b=d.transformTo("uint8array",b))}var g=new r(a,b,c);return this.files[a]=g,g},w=function(a){"/"==a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},x=function(a){return"/"!=a.slice(-1)&&(a+="/"),a},y=function(a,b){return b="undefined"!=typeof b?b:!1,a=x(a),this.files[a]||v.call(this,a,null,{dir:!0,createFolders:b}),this.files[a]},z=function(a,b,c){var f,g=new j;return a._data instanceof j?(g.uncompressedSize=a._data.uncompressedSize,g.crc32=a._data.crc32,0===g.uncompressedSize||a.dir?(b=i.STORE,g.compressedContent="",g.crc32=0):a._data.compressionMethod===b.magic?g.compressedContent=a._data.getCompressedContent():(f=a._data.getContent(),g.compressedContent=b.compress(d.transformTo(b.compressInputType,f),c))):(f=p(a),(!f||0===f.length||a.dir)&&(b=i.STORE,f=""),g.uncompressedSize=f.length,g.crc32=e(f),g.compressedContent=b.compress(d.transformTo(b.compressInputType,f),c)),g.compressedSize=g.compressedContent.length,g.compressionMethod=b.magic,g},A=function(a,b){var c=a;return a||(c=b?16893:33204),(65535&c)<<16},B=function(a){return 63&(a||0)},C=function(a,b,c,g,h){var i,j,k,m,n=(c.compressedContent,d.transformTo("string",l.utf8encode(b.name))),o=b.comment||"",p=d.transformTo("string",l.utf8encode(o)),q=n.length!==b.name.length,r=p.length!==o.length,t=b.options,u="",v="",w="";k=b._initialMetadata.dir!==b.dir?b.dir:t.dir,m=b._initialMetadata.date!==b.date?b.date:t.date;var x=0,y=0;k&&(x|=16),"UNIX"===h?(y=798,x|=A(b.unixPermissions,k)):(y=20,x|=B(b.dosPermissions,k)),i=m.getHours(),i<<=6,i|=m.getMinutes(),i<<=5,i|=m.getSeconds()/2,j=m.getFullYear()-1980,j<<=4,j|=m.getMonth()+1,j<<=5,j|=m.getDate(),q&&(v=s(1,1)+s(e(n),4)+n,u+="up"+s(v.length,2)+v),r&&(w=s(1,1)+s(this.crc32(p),4)+p,u+="uc"+s(w.length,2)+w);var z="";z+="\n\x00",z+=q||r?"\x00\b":"\x00\x00",z+=c.compressionMethod,z+=s(i,2),z+=s(j,2),z+=s(c.crc32,4),z+=s(c.compressedSize,4),z+=s(c.uncompressedSize,4),z+=s(n.length,2),z+=s(u.length,2);var C=f.LOCAL_FILE_HEADER+z+n+u,D=f.CENTRAL_FILE_HEADER+s(y,2)+z+s(p.length,2)+"\x00\x00\x00\x00"+s(x,4)+s(g,4)+n+u+p;return{fileRecord:C,dirRecord:D,compressedObject:c}},D={load:function(){throw new Error("Load method is not defined. Is the file jszip-load.js included ?")},filter:function(a){var b,c,d,e,f=[];for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],e=new r(d.name,d._data,t(d.options)),c=b.slice(this.root.length,b.length),b.slice(0,this.root.length)===this.root&&a(c,e)&&f.push(e));return f},file:function(a,b,c){if(1===arguments.length){if(d.isRegExp(a)){var e=a;return this.filter(function(a,b){return!b.dir&&e.test(a)})}return this.filter(function(b,c){return!c.dir&&b===a})[0]||null}return a=this.root+a,v.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(d.isRegExp(a))return this.filter(function(b,c){return c.dir&&a.test(b)});var b=this.root+a,c=y.call(this,b),e=this.clone();return e.root=c.name,e},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!=a.slice(-1)&&(a+="/"),b=this.files[a]),b&&!b.dir)delete this.files[a];else for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];return this},generate:function(a){a=t(a||{},{base64:!0,compression:"STORE",compressionOptions:null,type:"base64",platform:"DOS",comment:null,mimeType:"application/zip"}),d.checkSupport(a.type),("darwin"===a.platform||"freebsd"===a.platform||"linux"===a.platform||"sunos"===a.platform)&&(a.platform="UNIX"),"win32"===a.platform&&(a.platform="DOS");var b,c,e=[],g=0,j=0,k=d.transformTo("string",this.utf8encode(a.comment||this.comment||""));for(var l in this.files)if(this.files.hasOwnProperty(l)){var o=this.files[l],p=o.options.compression||a.compression.toUpperCase(),q=i[p];if(!q)throw new Error(p+" is not a valid compression method !");var r=o.options.compressionOptions||a.compressionOptions||{},u=z.call(this,o,q,r),v=C.call(this,l,o,u,g,a.platform);g+=v.fileRecord.length+u.compressedSize,j+=v.dirRecord.length,e.push(v)}var w="";w=f.CENTRAL_DIRECTORY_END+"\x00\x00\x00\x00"+s(e.length,2)+s(e.length,2)+s(j,4)+s(g,4)+s(k.length,2)+k;var x=a.type.toLowerCase();for(b="uint8array"===x||"arraybuffer"===x||"blob"===x||"nodebuffer"===x?new n(g+j+w.length):new m(g+j+w.length),c=0;c<e.length;c++)b.append(e[c].fileRecord),b.append(e[c].compressedObject.compressedContent);for(c=0;c<e.length;c++)b.append(e[c].dirRecord);b.append(w);var y=b.finalize();switch(a.type.toLowerCase()){case"uint8array":case"arraybuffer":case"nodebuffer":return d.transformTo(a.type.toLowerCase(),y);case"blob":return d.arrayBuffer2Blob(d.transformTo("arraybuffer",y),a.mimeType);case"base64":return a.base64?h.encode(y):y;default:return y}},crc32:function(a,b){return e(a,b)},utf8encode:function(a){return d.transformTo("string",l.utf8encode(a))},utf8decode:function(a){return l.utf8decode(a)}};b.exports=D},{"./base64":1,"./compressedObject":2,"./compressions":3,"./crc32":4,"./defaults":6,"./nodeBuffer":11,"./signature":14,"./stringWriter":16,"./support":17,"./uint8ArrayWriter":19,"./utf8":20,"./utils":21}],14:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],15:[function(a,b){"use strict";function c(a,b){this.data=a,b||(this.data=e.string2binary(this.data)),this.length=this.data.length,this.index=0}var d=a("./dataReader"),e=a("./utils");c.prototype=new d,c.prototype.byteAt=function(a){return this.data.charCodeAt(a)},c.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":5,"./utils":21}],16:[function(a,b){"use strict";var c=a("./utils"),d=function(){this.data=[]};d.prototype={append:function(a){a=c.transformTo("string",a),this.data.push(a)},finalize:function(){return this.data.join("")}},b.exports=d},{"./utils":21}],17:[function(a,b,c){(function(a){"use strict";if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer="undefined"!=typeof a,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var b=new ArrayBuffer(0);try{c.blob=0===new Blob([b],{type:"application/zip"}).size}catch(d){try{var e=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,f=new e;f.append(b),c.blob=0===f.getBlob("application/zip").size}catch(d){c.blob=!1}}}}).call(this,"undefined"!=typeof Buffer?Buffer:void 0)},{}],18:[function(a,b){"use strict";function c(a){a&&(this.data=a,this.length=this.data.length,this.index=0)}var d=a("./dataReader");c.prototype=new d,c.prototype.byteAt=function(a){return this.data[a]},c.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f;return-1},c.prototype.readData=function(a){if(this.checkOffset(a),0===a)return new Uint8Array(0);var b=this.data.subarray(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":5}],19:[function(a,b){"use strict";var c=a("./utils"),d=function(a){this.data=new Uint8Array(a),this.index=0};d.prototype={append:function(a){0!==a.length&&(a=c.transformTo("uint8array",a),this.data.set(a,this.index),this.index+=a.length)},finalize:function(){return this.data}},b.exports=d},{"./utils":21}],20:[function(a,b,c){"use strict";for(var d=a("./utils"),e=a("./support"),f=a("./nodeBuffer"),g=new Array(256),h=0;256>h;h++)g[h]=h>=252?6:h>=248?5:h>=240?4:h>=224?3:h>=192?2:1;g[254]=g[254]=1;var i=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;h>f;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=128>c?1:2048>c?2:65536>c?3:4;for(b=e.uint8array?new Uint8Array(i):new Array(i),g=0,f=0;i>g;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),128>c?b[g++]=c:2048>c?(b[g++]=192|c>>>6,b[g++]=128|63&c):65536>c?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},j=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return 0>c?b:0===c?b:c+g[a[c]]>b?c:b},k=function(a){var b,c,e,f,h=a.length,i=new Array(2*h);for(c=0,b=0;h>b;)if(e=a[b++],128>e)i[c++]=e;else if(f=g[e],f>4)i[c++]=65533,b+=f-1;else{for(e&=2===f?31:3===f?15:7;f>1&&h>b;)e=e<<6|63&a[b++],f--;f>1?i[c++]=65533:65536>e?i[c++]=e:(e-=65536,i[c++]=55296|e>>10&1023,i[c++]=56320|1023&e)}return i.length!==c&&(i.subarray?i=i.subarray(0,c):i.length=c),d.applyFromCharCode(i)};c.utf8encode=function(a){return e.nodebuffer?f(a,"utf-8"):i(a)},c.utf8decode=function(a){if(e.nodebuffer)return d.transformTo("nodebuffer",a).toString("utf-8");a=d.transformTo(e.uint8array?"uint8array":"array",a);for(var b=[],c=0,f=a.length,g=65536;f>c;){var h=j(a,Math.min(c+g,f));b.push(e.uint8array?k(a.subarray(c,h)):k(a.slice(c,h))),c=h}return b.join("")}},{"./nodeBuffer":11,"./support":17,"./utils":21}],21:[function(a,b,c){"use strict";function d(a){return a}function e(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function f(a){var b=65536,d=[],e=a.length,f=c.getTypeOf(a),g=0,h=!0;try{switch(f){case"uint8array":String.fromCharCode.apply(null,new Uint8Array(0));break;case"nodebuffer":String.fromCharCode.apply(null,j(0))}}catch(i){h=!1}if(!h){for(var k="",l=0;l<a.length;l++)k+=String.fromCharCode(a[l]);return k}for(;e>g&&b>1;)try{d.push("array"===f||"nodebuffer"===f?String.fromCharCode.apply(null,a.slice(g,Math.min(g+b,e))):String.fromCharCode.apply(null,a.subarray(g,Math.min(g+b,e)))),g+=b}catch(i){b=Math.floor(b/2)}return d.join("")}function g(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];return b}var h=a("./support"),i=a("./compressions"),j=a("./nodeBuffer");c.string2binary=function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(255&a.charCodeAt(c));return b},c.arrayBuffer2Blob=function(a,b){c.checkSupport("blob"),b=b||"application/zip";try{return new Blob([a],{type:b})}catch(d){try{var e=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,f=new e;return f.append(a),f.getBlob(b)}catch(d){throw new Error("Bug : can't construct the Blob.")}}},c.applyFromCharCode=f;var k={};k.string={string:d,array:function(a){return e(a,new Array(a.length))},arraybuffer:function(a){return k.string.uint8array(a).buffer},uint8array:function(a){return e(a,new Uint8Array(a.length))},nodebuffer:function(a){return e(a,j(a.length))}},k.array={string:f,array:d,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(a)}},k.arraybuffer={string:function(a){return f(new Uint8Array(a))},array:function(a){return g(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:d,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(new Uint8Array(a))}},k.uint8array={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:d,nodebuffer:function(a){return j(a)}},k.nodebuffer={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return k.nodebuffer.uint8array(a).buffer},uint8array:function(a){return g(a,new Uint8Array(a.length))},nodebuffer:d},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=k[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":h.nodebuffer&&j.test(a)?"nodebuffer":h.uint8array&&a instanceof Uint8Array?"uint8array":h.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=h[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this browser")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(16>b?"0":"")+b.toString(16).toUpperCase();return d},c.findCompression=function(a){for(var b in i)if(i.hasOwnProperty(b)&&i[b].magic===a)return i[b];return null},c.isRegExp=function(a){return"[object RegExp]"===Object.prototype.toString.call(a)}},{"./compressions":3,"./nodeBuffer":11,"./support":17}],22:[function(a,b){"use strict";function c(a,b){this.files=[],this.loadOptions=b,a&&this.load(a)}var d=a("./stringReader"),e=a("./nodeBufferReader"),f=a("./uint8ArrayReader"),g=a("./utils"),h=a("./signature"),i=a("./zipEntry"),j=a("./support"),k=a("./object");c.prototype={checkSignature:function(a){var b=this.reader.readString(4);if(b!==a)throw new Error("Corrupted zip or bug : unexpected signature ("+g.pretty(b)+", expected "+g.pretty(a)+")")},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2),this.zipComment=this.reader.readString(this.zipCommentLength),this.zipComment=k.utf8decode(this.zipComment)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.versionMadeBy=this.reader.readString(2),this.versionNeeded=this.reader.readInt(2),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;d>e;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readString(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(h.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8(),b.processAttributes()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readString(4)===h.CENTRAL_FILE_HEADER;)a=new i({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(h.CENTRAL_DIRECTORY_END);if(-1===a){var b=!0;try{this.reader.setIndex(0),this.checkSignature(h.LOCAL_FILE_HEADER),b=!1}catch(c){}throw new Error(b?"Can't find end of central directory : is this a zip file ? If it is, see http://stuk.github.io/jszip/documentation/howto/read_zip.html":"Corrupted zip : can't find end of central directory")}if(this.reader.setIndex(a),this.checkSignature(h.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===g.MAX_VALUE_16BITS||this.diskWithCentralDirStart===g.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===g.MAX_VALUE_16BITS||this.centralDirRecords===g.MAX_VALUE_16BITS||this.centralDirSize===g.MAX_VALUE_32BITS||this.centralDirOffset===g.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),-1===a)throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");this.reader.setIndex(a),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}},prepareReader:function(a){var b=g.getTypeOf(a);this.reader="string"!==b||j.uint8array?"nodebuffer"===b?new e(a):new f(g.transformTo("uint8array",a)):new d(a,this.loadOptions.optimizedBinaryString)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=c},{"./nodeBufferReader":12,"./object":13,"./signature":14,"./stringReader":15,"./support":17,"./uint8ArrayReader":18,"./utils":21,"./zipEntry":23}],23:[function(a,b){"use strict";function c(a,b){this.options=a,this.loadOptions=b}var d=a("./stringReader"),e=a("./utils"),f=a("./compressedObject"),g=a("./object"),h=0,i=3;c.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},prepareCompressedContent:function(a,b,c){return function(){var d=a.index;a.setIndex(b);var e=a.readData(c);return a.setIndex(d),e}},prepareContent:function(a,b,c,d,f){return function(){var a=e.transformTo(d.uncompressInputType,this.getCompressedContent()),b=d.uncompress(a);if(b.length!==f)throw new Error("Bug : uncompressed data size mismatch");return b}},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readString(this.fileNameLength),a.skip(c),-1==this.compressedSize||-1==this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if(b=e.findCompression(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+e.pretty(this.compressionMethod)+" unknown (inner file : "+this.fileName+")");if(this.decompressed=new f,this.decompressed.compressedSize=this.compressedSize,this.decompressed.uncompressedSize=this.uncompressedSize,this.decompressed.crc32=this.crc32,this.decompressed.compressionMethod=this.compressionMethod,this.decompressed.getCompressedContent=this.prepareCompressedContent(a,a.index,this.compressedSize,b),this.decompressed.getContent=this.prepareContent(a,a.index,this.compressedSize,b,this.uncompressedSize),this.loadOptions.checkCRC32&&(this.decompressed=e.transformTo("string",this.decompressed.getContent()),g.crc32(this.decompressed)!==this.crc32))throw new Error("Corrupted zip : CRC32 mismatch")},readCentralPart:function(a){if(this.versionMadeBy=a.readInt(2),this.versionNeeded=a.readInt(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4),this.fileNameLength=a.readInt(2),this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");this.fileName=a.readString(this.fileNameLength),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readString(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var a=this.versionMadeBy>>8;this.dir=16&this.externalFileAttributes?!0:!1,a===h&&(this.dosPermissions=63&this.externalFileAttributes),a===i&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileName.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var a=new d(this.extraFields[1].value);this.uncompressedSize===e.MAX_VALUE_32BITS&&(this.uncompressedSize=a.readInt(8)),this.compressedSize===e.MAX_VALUE_32BITS&&(this.compressedSize=a.readInt(8)),this.localHeaderOffset===e.MAX_VALUE_32BITS&&(this.localHeaderOffset=a.readInt(8)),this.diskNumberStart===e.MAX_VALUE_32BITS&&(this.diskNumberStart=a.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index;for(this.extraFields=this.extraFields||{};a.index<e+this.extraFieldsLength;)b=a.readInt(2),c=a.readInt(2),d=a.readString(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){if(this.useUTF8())this.fileName=g.utf8decode(this.fileName),this.fileComment=g.utf8decode(this.fileComment);else{var a=this.findExtraFieldUnicodePath();null!==a&&(this.fileName=a);var b=this.findExtraFieldUnicodeComment();null!==b&&(this.fileComment=b)}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileName)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))
}return null},findExtraFieldUnicodeComment:function(){var a=this.extraFields[25461];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileComment)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null}},b.exports=c},{"./compressedObject":2,"./object":13,"./stringReader":15,"./utils":21}],24:[function(a,b){"use strict";var c=a("./lib/utils/common").assign,d=a("./lib/deflate"),e=a("./lib/inflate"),f=a("./lib/zlib/constants"),g={};c(g,d,e,f),b.exports=g},{"./lib/deflate":25,"./lib/inflate":26,"./lib/utils/common":27,"./lib/zlib/constants":30}],25:[function(a,b,c){"use strict";function d(a,b){var c=new s(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}function f(a,b){return b=b||{},b.gzip=!0,d(a,b)}var g=a("./zlib/deflate.js"),h=a("./utils/common"),i=a("./utils/strings"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=0,m=4,n=0,o=1,p=-1,q=0,r=8,s=function(a){this.options=h.assign({level:p,method:r,chunkSize:16384,windowBits:15,memLevel:8,strategy:q,to:""},a||{});var b=this.options;b.raw&&b.windowBits>0?b.windowBits=-b.windowBits:b.gzip&&b.windowBits>0&&b.windowBits<16&&(b.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=g.deflateInit2(this.strm,b.level,b.method,b.windowBits,b.memLevel,b.strategy);if(c!==n)throw new Error(j[c]);b.header&&g.deflateSetHeader(this.strm,b.header)};s.prototype.push=function(a,b){var c,d,e=this.strm,f=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?m:l,e.input="string"==typeof a?i.string2buf(a):a,e.next_in=0,e.avail_in=e.input.length;do{if(0===e.avail_out&&(e.output=new h.Buf8(f),e.next_out=0,e.avail_out=f),c=g.deflate(e,d),c!==o&&c!==n)return this.onEnd(c),this.ended=!0,!1;(0===e.avail_out||0===e.avail_in&&d===m)&&this.onData("string"===this.options.to?i.buf2binstring(h.shrinkBuf(e.output,e.next_out)):h.shrinkBuf(e.output,e.next_out))}while((e.avail_in>0||0===e.avail_out)&&c!==o);return d===m?(c=g.deflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===n):!0},s.prototype.onData=function(a){this.chunks.push(a)},s.prototype.onEnd=function(a){a===n&&(this.result="string"===this.options.to?this.chunks.join(""):h.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Deflate=s,c.deflate=d,c.deflateRaw=e,c.gzip=f},{"./utils/common":27,"./utils/strings":28,"./zlib/deflate.js":32,"./zlib/messages":37,"./zlib/zstream":39}],26:[function(a,b,c){"use strict";function d(a,b){var c=new m(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}var f=a("./zlib/inflate.js"),g=a("./utils/common"),h=a("./utils/strings"),i=a("./zlib/constants"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=a("./zlib/gzheader"),m=function(a){this.options=g.assign({chunkSize:16384,windowBits:0,to:""},a||{});var b=this.options;b.raw&&b.windowBits>=0&&b.windowBits<16&&(b.windowBits=-b.windowBits,0===b.windowBits&&(b.windowBits=-15)),!(b.windowBits>=0&&b.windowBits<16)||a&&a.windowBits||(b.windowBits+=32),b.windowBits>15&&b.windowBits<48&&0===(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=f.inflateInit2(this.strm,b.windowBits);if(c!==i.Z_OK)throw new Error(j[c]);this.header=new l,f.inflateGetHeader(this.strm,this.header)};m.prototype.push=function(a,b){var c,d,e,j,k,l=this.strm,m=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?i.Z_FINISH:i.Z_NO_FLUSH,l.input="string"==typeof a?h.binstring2buf(a):a,l.next_in=0,l.avail_in=l.input.length;do{if(0===l.avail_out&&(l.output=new g.Buf8(m),l.next_out=0,l.avail_out=m),c=f.inflate(l,i.Z_NO_FLUSH),c!==i.Z_STREAM_END&&c!==i.Z_OK)return this.onEnd(c),this.ended=!0,!1;l.next_out&&(0===l.avail_out||c===i.Z_STREAM_END||0===l.avail_in&&d===i.Z_FINISH)&&("string"===this.options.to?(e=h.utf8border(l.output,l.next_out),j=l.next_out-e,k=h.buf2string(l.output,e),l.next_out=j,l.avail_out=m-j,j&&g.arraySet(l.output,l.output,e,j,0),this.onData(k)):this.onData(g.shrinkBuf(l.output,l.next_out)))}while(l.avail_in>0&&c!==i.Z_STREAM_END);return c===i.Z_STREAM_END&&(d=i.Z_FINISH),d===i.Z_FINISH?(c=f.inflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===i.Z_OK):!0},m.prototype.onData=function(a){this.chunks.push(a)},m.prototype.onEnd=function(a){a===i.Z_OK&&(this.result="string"===this.options.to?this.chunks.join(""):g.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Inflate=m,c.inflate=d,c.inflateRaw=e,c.ungzip=d},{"./utils/common":27,"./utils/strings":28,"./zlib/constants":30,"./zlib/gzheader":33,"./zlib/inflate.js":35,"./zlib/messages":37,"./zlib/zstream":39}],27:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;c.assign=function(a){for(var b=Array.prototype.slice.call(arguments,1);b.length;){var c=b.shift();if(c){if("object"!=typeof c)throw new TypeError(c+"must be non-object");for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}}return a},c.shrinkBuf=function(a,b){return a.length===b?a:a.subarray?a.subarray(0,b):(a.length=b,a)};var e={arraySet:function(a,b,c,d,e){if(b.subarray&&a.subarray)return void a.set(b.subarray(c,c+d),e);for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){var b,c,d,e,f,g;for(d=0,b=0,c=a.length;c>b;b++)d+=a[b].length;for(g=new Uint8Array(d),e=0,b=0,c=a.length;c>b;b++)f=a[b],g.set(f,e),e+=f.length;return g}},f={arraySet:function(a,b,c,d,e){for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){return[].concat.apply([],a)}};c.setTyped=function(a){a?(c.Buf8=Uint8Array,c.Buf16=Uint16Array,c.Buf32=Int32Array,c.assign(c,e)):(c.Buf8=Array,c.Buf16=Array,c.Buf32=Array,c.assign(c,f))},c.setTyped(d)},{}],28:[function(a,b,c){"use strict";function d(a,b){if(65537>b&&(a.subarray&&g||!a.subarray&&f))return String.fromCharCode.apply(null,e.shrinkBuf(a,b));for(var c="",d=0;b>d;d++)c+=String.fromCharCode(a[d]);return c}var e=a("./common"),f=!0,g=!0;try{String.fromCharCode.apply(null,[0])}catch(h){f=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(h){g=!1}for(var i=new e.Buf8(256),j=0;256>j;j++)i[j]=j>=252?6:j>=248?5:j>=240?4:j>=224?3:j>=192?2:1;i[254]=i[254]=1,c.string2buf=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;h>f;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=128>c?1:2048>c?2:65536>c?3:4;for(b=new e.Buf8(i),g=0,f=0;i>g;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),128>c?b[g++]=c:2048>c?(b[g++]=192|c>>>6,b[g++]=128|63&c):65536>c?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},c.buf2binstring=function(a){return d(a,a.length)},c.binstring2buf=function(a){for(var b=new e.Buf8(a.length),c=0,d=b.length;d>c;c++)b[c]=a.charCodeAt(c);return b},c.buf2string=function(a,b){var c,e,f,g,h=b||a.length,j=new Array(2*h);for(e=0,c=0;h>c;)if(f=a[c++],128>f)j[e++]=f;else if(g=i[f],g>4)j[e++]=65533,c+=g-1;else{for(f&=2===g?31:3===g?15:7;g>1&&h>c;)f=f<<6|63&a[c++],g--;g>1?j[e++]=65533:65536>f?j[e++]=f:(f-=65536,j[e++]=55296|f>>10&1023,j[e++]=56320|1023&f)}return d(j,e)},c.utf8border=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return 0>c?b:0===c?b:c+i[a[c]]>b?c:b}},{"./common":27}],29:[function(a,b){"use strict";function c(a,b,c,d){for(var e=65535&a|0,f=a>>>16&65535|0,g=0;0!==c;){g=c>2e3?2e3:c,c-=g;do e=e+b[d++]|0,f=f+e|0;while(--g);e%=65521,f%=65521}return e|f<<16|0}b.exports=c},{}],30:[function(a,b){b.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],31:[function(a,b){"use strict";function c(){for(var a,b=[],c=0;256>c;c++){a=c;for(var d=0;8>d;d++)a=1&a?3988292384^a>>>1:a>>>1;b[c]=a}return b}function d(a,b,c,d){var f=e,g=d+c;a=-1^a;for(var h=d;g>h;h++)a=a>>>8^f[255&(a^b[h])];return-1^a}var e=c();b.exports=d},{}],32:[function(a,b,c){"use strict";function d(a,b){return a.msg=G[b],b}function e(a){return(a<<1)-(a>4?9:0)}function f(a){for(var b=a.length;--b>=0;)a[b]=0}function g(a){var b=a.state,c=b.pending;c>a.avail_out&&(c=a.avail_out),0!==c&&(C.arraySet(a.output,b.pending_buf,b.pending_out,c,a.next_out),a.next_out+=c,b.pending_out+=c,a.total_out+=c,a.avail_out-=c,b.pending-=c,0===b.pending&&(b.pending_out=0))}function h(a,b){D._tr_flush_block(a,a.block_start>=0?a.block_start:-1,a.strstart-a.block_start,b),a.block_start=a.strstart,g(a.strm)}function i(a,b){a.pending_buf[a.pending++]=b}function j(a,b){a.pending_buf[a.pending++]=b>>>8&255,a.pending_buf[a.pending++]=255&b}function k(a,b,c,d){var e=a.avail_in;return e>d&&(e=d),0===e?0:(a.avail_in-=e,C.arraySet(b,a.input,a.next_in,e,c),1===a.state.wrap?a.adler=E(a.adler,b,e,c):2===a.state.wrap&&(a.adler=F(a.adler,b,e,c)),a.next_in+=e,a.total_in+=e,e)}function l(a,b){var c,d,e=a.max_chain_length,f=a.strstart,g=a.prev_length,h=a.nice_match,i=a.strstart>a.w_size-jb?a.strstart-(a.w_size-jb):0,j=a.window,k=a.w_mask,l=a.prev,m=a.strstart+ib,n=j[f+g-1],o=j[f+g];a.prev_length>=a.good_match&&(e>>=2),h>a.lookahead&&(h=a.lookahead);do if(c=b,j[c+g]===o&&j[c+g-1]===n&&j[c]===j[f]&&j[++c]===j[f+1]){f+=2,c++;do;while(j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&m>f);if(d=ib-(m-f),f=m-ib,d>g){if(a.match_start=b,g=d,d>=h)break;n=j[f+g-1],o=j[f+g]}}while((b=l[b&k])>i&&0!==--e);return g<=a.lookahead?g:a.lookahead}function m(a){var b,c,d,e,f,g=a.w_size;do{if(e=a.window_size-a.lookahead-a.strstart,a.strstart>=g+(g-jb)){C.arraySet(a.window,a.window,g,g,0),a.match_start-=g,a.strstart-=g,a.block_start-=g,c=a.hash_size,b=c;do d=a.head[--b],a.head[b]=d>=g?d-g:0;while(--c);c=g,b=c;do d=a.prev[--b],a.prev[b]=d>=g?d-g:0;while(--c);e+=g}if(0===a.strm.avail_in)break;if(c=k(a.strm,a.window,a.strstart+a.lookahead,e),a.lookahead+=c,a.lookahead+a.insert>=hb)for(f=a.strstart-a.insert,a.ins_h=a.window[f],a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+1])&a.hash_mask;a.insert&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+hb-1])&a.hash_mask,a.prev[f&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=f,f++,a.insert--,!(a.lookahead+a.insert<hb)););}while(a.lookahead<jb&&0!==a.strm.avail_in)}function n(a,b){var c=65535;for(c>a.pending_buf_size-5&&(c=a.pending_buf_size-5);;){if(a.lookahead<=1){if(m(a),0===a.lookahead&&b===H)return sb;if(0===a.lookahead)break}a.strstart+=a.lookahead,a.lookahead=0;var d=a.block_start+c;if((0===a.strstart||a.strstart>=d)&&(a.lookahead=a.strstart-d,a.strstart=d,h(a,!1),0===a.strm.avail_out))return sb;if(a.strstart-a.block_start>=a.w_size-jb&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.strstart>a.block_start&&(h(a,!1),0===a.strm.avail_out)?sb:sb}function o(a,b){for(var c,d;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),0!==c&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c)),a.match_length>=hb)if(d=D._tr_tally(a,a.strstart-a.match_start,a.match_length-hb),a.lookahead-=a.match_length,a.match_length<=a.max_lazy_match&&a.lookahead>=hb){a.match_length--;do a.strstart++,a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart;while(0!==--a.match_length);a.strstart++}else a.strstart+=a.match_length,a.match_length=0,a.ins_h=a.window[a.strstart],a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+1])&a.hash_mask;else d=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++;if(d&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function p(a,b){for(var c,d,e;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),a.prev_length=a.match_length,a.prev_match=a.match_start,a.match_length=hb-1,0!==c&&a.prev_length<a.max_lazy_match&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c),a.match_length<=5&&(a.strategy===S||a.match_length===hb&&a.strstart-a.match_start>4096)&&(a.match_length=hb-1)),a.prev_length>=hb&&a.match_length<=a.prev_length){e=a.strstart+a.lookahead-hb,d=D._tr_tally(a,a.strstart-1-a.prev_match,a.prev_length-hb),a.lookahead-=a.prev_length-1,a.prev_length-=2;do++a.strstart<=e&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart);while(0!==--a.prev_length);if(a.match_available=0,a.match_length=hb-1,a.strstart++,d&&(h(a,!1),0===a.strm.avail_out))return sb}else if(a.match_available){if(d=D._tr_tally(a,0,a.window[a.strstart-1]),d&&h(a,!1),a.strstart++,a.lookahead--,0===a.strm.avail_out)return sb}else a.match_available=1,a.strstart++,a.lookahead--}return a.match_available&&(d=D._tr_tally(a,0,a.window[a.strstart-1]),a.match_available=0),a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function q(a,b){for(var c,d,e,f,g=a.window;;){if(a.lookahead<=ib){if(m(a),a.lookahead<=ib&&b===H)return sb;if(0===a.lookahead)break}if(a.match_length=0,a.lookahead>=hb&&a.strstart>0&&(e=a.strstart-1,d=g[e],d===g[++e]&&d===g[++e]&&d===g[++e])){f=a.strstart+ib;do;while(d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&f>e);a.match_length=ib-(f-e),a.match_length>a.lookahead&&(a.match_length=a.lookahead)}if(a.match_length>=hb?(c=D._tr_tally(a,1,a.match_length-hb),a.lookahead-=a.match_length,a.strstart+=a.match_length,a.match_length=0):(c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++),c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function r(a,b){for(var c;;){if(0===a.lookahead&&(m(a),0===a.lookahead)){if(b===H)return sb;break}if(a.match_length=0,c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++,c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function s(a){a.window_size=2*a.w_size,f(a.head),a.max_lazy_match=B[a.level].max_lazy,a.good_match=B[a.level].good_length,a.nice_match=B[a.level].nice_length,a.max_chain_length=B[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=hb-1,a.match_available=0,a.ins_h=0}function t(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=Y,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new C.Buf16(2*fb),this.dyn_dtree=new C.Buf16(2*(2*db+1)),this.bl_tree=new C.Buf16(2*(2*eb+1)),f(this.dyn_ltree),f(this.dyn_dtree),f(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new C.Buf16(gb+1),this.heap=new C.Buf16(2*cb+1),f(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new C.Buf16(2*cb+1),f(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function u(a){var b;return a&&a.state?(a.total_in=a.total_out=0,a.data_type=X,b=a.state,b.pending=0,b.pending_out=0,b.wrap<0&&(b.wrap=-b.wrap),b.status=b.wrap?lb:qb,a.adler=2===b.wrap?0:1,b.last_flush=H,D._tr_init(b),M):d(a,O)}function v(a){var b=u(a);return b===M&&s(a.state),b}function w(a,b){return a&&a.state?2!==a.state.wrap?O:(a.state.gzhead=b,M):O}function x(a,b,c,e,f,g){if(!a)return O;var h=1;if(b===R&&(b=6),0>e?(h=0,e=-e):e>15&&(h=2,e-=16),1>f||f>Z||c!==Y||8>e||e>15||0>b||b>9||0>g||g>V)return d(a,O);8===e&&(e=9);var i=new t;return a.state=i,i.strm=a,i.wrap=h,i.gzhead=null,i.w_bits=e,i.w_size=1<<i.w_bits,i.w_mask=i.w_size-1,i.hash_bits=f+7,i.hash_size=1<<i.hash_bits,i.hash_mask=i.hash_size-1,i.hash_shift=~~((i.hash_bits+hb-1)/hb),i.window=new C.Buf8(2*i.w_size),i.head=new C.Buf16(i.hash_size),i.prev=new C.Buf16(i.w_size),i.lit_bufsize=1<<f+6,i.pending_buf_size=4*i.lit_bufsize,i.pending_buf=new C.Buf8(i.pending_buf_size),i.d_buf=i.lit_bufsize>>1,i.l_buf=3*i.lit_bufsize,i.level=b,i.strategy=g,i.method=c,v(a)}function y(a,b){return x(a,b,Y,$,_,W)}function z(a,b){var c,h,k,l;if(!a||!a.state||b>L||0>b)return a?d(a,O):O;if(h=a.state,!a.output||!a.input&&0!==a.avail_in||h.status===rb&&b!==K)return d(a,0===a.avail_out?Q:O);if(h.strm=a,c=h.last_flush,h.last_flush=b,h.status===lb)if(2===h.wrap)a.adler=0,i(h,31),i(h,139),i(h,8),h.gzhead?(i(h,(h.gzhead.text?1:0)+(h.gzhead.hcrc?2:0)+(h.gzhead.extra?4:0)+(h.gzhead.name?8:0)+(h.gzhead.comment?16:0)),i(h,255&h.gzhead.time),i(h,h.gzhead.time>>8&255),i(h,h.gzhead.time>>16&255),i(h,h.gzhead.time>>24&255),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,255&h.gzhead.os),h.gzhead.extra&&h.gzhead.extra.length&&(i(h,255&h.gzhead.extra.length),i(h,h.gzhead.extra.length>>8&255)),h.gzhead.hcrc&&(a.adler=F(a.adler,h.pending_buf,h.pending,0)),h.gzindex=0,h.status=mb):(i(h,0),i(h,0),i(h,0),i(h,0),i(h,0),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,wb),h.status=qb);else{var m=Y+(h.w_bits-8<<4)<<8,n=-1;n=h.strategy>=T||h.level<2?0:h.level<6?1:6===h.level?2:3,m|=n<<6,0!==h.strstart&&(m|=kb),m+=31-m%31,h.status=qb,j(h,m),0!==h.strstart&&(j(h,a.adler>>>16),j(h,65535&a.adler)),a.adler=1}if(h.status===mb)if(h.gzhead.extra){for(k=h.pending;h.gzindex<(65535&h.gzhead.extra.length)&&(h.pending!==h.pending_buf_size||(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending!==h.pending_buf_size));)i(h,255&h.gzhead.extra[h.gzindex]),h.gzindex++;h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),h.gzindex===h.gzhead.extra.length&&(h.gzindex=0,h.status=nb)}else h.status=nb;if(h.status===nb)if(h.gzhead.name){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.name.length?255&h.gzhead.name.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.gzindex=0,h.status=ob)}else h.status=ob;if(h.status===ob)if(h.gzhead.comment){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.comment.length?255&h.gzhead.comment.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.status=pb)}else h.status=pb;if(h.status===pb&&(h.gzhead.hcrc?(h.pending+2>h.pending_buf_size&&g(a),h.pending+2<=h.pending_buf_size&&(i(h,255&a.adler),i(h,a.adler>>8&255),a.adler=0,h.status=qb)):h.status=qb),0!==h.pending){if(g(a),0===a.avail_out)return h.last_flush=-1,M}else if(0===a.avail_in&&e(b)<=e(c)&&b!==K)return d(a,Q);if(h.status===rb&&0!==a.avail_in)return d(a,Q);if(0!==a.avail_in||0!==h.lookahead||b!==H&&h.status!==rb){var o=h.strategy===T?r(h,b):h.strategy===U?q(h,b):B[h.level].func(h,b);if((o===ub||o===vb)&&(h.status=rb),o===sb||o===ub)return 0===a.avail_out&&(h.last_flush=-1),M;if(o===tb&&(b===I?D._tr_align(h):b!==L&&(D._tr_stored_block(h,0,0,!1),b===J&&(f(h.head),0===h.lookahead&&(h.strstart=0,h.block_start=0,h.insert=0))),g(a),0===a.avail_out))return h.last_flush=-1,M}return b!==K?M:h.wrap<=0?N:(2===h.wrap?(i(h,255&a.adler),i(h,a.adler>>8&255),i(h,a.adler>>16&255),i(h,a.adler>>24&255),i(h,255&a.total_in),i(h,a.total_in>>8&255),i(h,a.total_in>>16&255),i(h,a.total_in>>24&255)):(j(h,a.adler>>>16),j(h,65535&a.adler)),g(a),h.wrap>0&&(h.wrap=-h.wrap),0!==h.pending?M:N)}function A(a){var b;return a&&a.state?(b=a.state.status,b!==lb&&b!==mb&&b!==nb&&b!==ob&&b!==pb&&b!==qb&&b!==rb?d(a,O):(a.state=null,b===qb?d(a,P):M)):O}var B,C=a("../utils/common"),D=a("./trees"),E=a("./adler32"),F=a("./crc32"),G=a("./messages"),H=0,I=1,J=3,K=4,L=5,M=0,N=1,O=-2,P=-3,Q=-5,R=-1,S=1,T=2,U=3,V=4,W=0,X=2,Y=8,Z=9,$=15,_=8,ab=29,bb=256,cb=bb+1+ab,db=30,eb=19,fb=2*cb+1,gb=15,hb=3,ib=258,jb=ib+hb+1,kb=32,lb=42,mb=69,nb=73,ob=91,pb=103,qb=113,rb=666,sb=1,tb=2,ub=3,vb=4,wb=3,xb=function(a,b,c,d,e){this.good_length=a,this.max_lazy=b,this.nice_length=c,this.max_chain=d,this.func=e};B=[new xb(0,0,0,0,n),new xb(4,4,8,4,o),new xb(4,5,16,8,o),new xb(4,6,32,32,o),new xb(4,4,16,16,p),new xb(8,16,32,32,p),new xb(8,16,128,128,p),new xb(8,32,128,256,p),new xb(32,128,258,1024,p),new xb(32,258,258,4096,p)],c.deflateInit=y,c.deflateInit2=x,c.deflateReset=v,c.deflateResetKeep=u,c.deflateSetHeader=w,c.deflate=z,c.deflateEnd=A,c.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":27,"./adler32":29,"./crc32":31,"./messages":37,"./trees":38}],33:[function(a,b){"use strict";function c(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}b.exports=c},{}],34:[function(a,b){"use strict";var c=30,d=12;b.exports=function(a,b){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;e=a.state,f=a.next_in,B=a.input,g=f+(a.avail_in-5),h=a.next_out,C=a.output,i=h-(b-a.avail_out),j=h+(a.avail_out-257),k=e.dmax,l=e.wsize,m=e.whave,n=e.wnext,o=e.window,p=e.hold,q=e.bits,r=e.lencode,s=e.distcode,t=(1<<e.lenbits)-1,u=(1<<e.distbits)-1;a:do{15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=r[p&t];b:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,0===w)C[h++]=65535&v;else{if(!(16&w)){if(0===(64&w)){v=r[(65535&v)+(p&(1<<w)-1)];continue b}if(32&w){e.mode=d;break a}a.msg="invalid literal/length code",e.mode=c;break a}x=65535&v,w&=15,w&&(w>q&&(p+=B[f++]<<q,q+=8),x+=p&(1<<w)-1,p>>>=w,q-=w),15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=s[p&u];c:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,!(16&w)){if(0===(64&w)){v=s[(65535&v)+(p&(1<<w)-1)];continue c}a.msg="invalid distance code",e.mode=c;break a}if(y=65535&v,w&=15,w>q&&(p+=B[f++]<<q,q+=8,w>q&&(p+=B[f++]<<q,q+=8)),y+=p&(1<<w)-1,y>k){a.msg="invalid distance too far back",e.mode=c;break a}if(p>>>=w,q-=w,w=h-i,y>w){if(w=y-w,w>m&&e.sane){a.msg="invalid distance too far back",e.mode=c;break a}if(z=0,A=o,0===n){if(z+=l-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}else if(w>n){if(z+=l+n-w,w-=n,x>w){x-=w;do C[h++]=o[z++];while(--w);if(z=0,x>n){w=n,x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}}else if(z+=n-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}for(;x>2;)C[h++]=A[z++],C[h++]=A[z++],C[h++]=A[z++],x-=3;x&&(C[h++]=A[z++],x>1&&(C[h++]=A[z++]))}else{z=h-y;do C[h++]=C[z++],C[h++]=C[z++],C[h++]=C[z++],x-=3;while(x>2);x&&(C[h++]=C[z++],x>1&&(C[h++]=C[z++]))}break}}break}}while(g>f&&j>h);x=q>>3,f-=x,q-=x<<3,p&=(1<<q)-1,a.next_in=f,a.next_out=h,a.avail_in=g>f?5+(g-f):5-(f-g),a.avail_out=j>h?257+(j-h):257-(h-j),e.hold=p,e.bits=q}},{}],35:[function(a,b,c){"use strict";function d(a){return(a>>>24&255)+(a>>>8&65280)+((65280&a)<<8)+((255&a)<<24)}function e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function f(a){var b;return a&&a.state?(b=a.state,a.total_in=a.total_out=b.total=0,a.msg="",b.wrap&&(a.adler=1&b.wrap),b.mode=K,b.last=0,b.havedict=0,b.dmax=32768,b.head=null,b.hold=0,b.bits=0,b.lencode=b.lendyn=new r.Buf32(ob),b.distcode=b.distdyn=new r.Buf32(pb),b.sane=1,b.back=-1,C):F}function g(a){var b;return a&&a.state?(b=a.state,b.wsize=0,b.whave=0,b.wnext=0,f(a)):F}function h(a,b){var c,d;return a&&a.state?(d=a.state,0>b?(c=0,b=-b):(c=(b>>4)+1,48>b&&(b&=15)),b&&(8>b||b>15)?F:(null!==d.window&&d.wbits!==b&&(d.window=null),d.wrap=c,d.wbits=b,g(a))):F}function i(a,b){var c,d;return a?(d=new e,a.state=d,d.window=null,c=h(a,b),c!==C&&(a.state=null),c):F}function j(a){return i(a,rb)}function k(a){if(sb){var b;for(p=new r.Buf32(512),q=new r.Buf32(32),b=0;144>b;)a.lens[b++]=8;for(;256>b;)a.lens[b++]=9;for(;280>b;)a.lens[b++]=7;for(;288>b;)a.lens[b++]=8;for(v(x,a.lens,0,288,p,0,a.work,{bits:9}),b=0;32>b;)a.lens[b++]=5;v(y,a.lens,0,32,q,0,a.work,{bits:5}),sb=!1}a.lencode=p,a.lenbits=9,a.distcode=q,a.distbits=5}function l(a,b,c,d){var e,f=a.state;return null===f.window&&(f.wsize=1<<f.wbits,f.wnext=0,f.whave=0,f.window=new r.Buf8(f.wsize)),d>=f.wsize?(r.arraySet(f.window,b,c-f.wsize,f.wsize,0),f.wnext=0,f.whave=f.wsize):(e=f.wsize-f.wnext,e>d&&(e=d),r.arraySet(f.window,b,c-d,e,f.wnext),d-=e,d?(r.arraySet(f.window,b,c-d,d,0),f.wnext=d,f.whave=f.wsize):(f.wnext+=e,f.wnext===f.wsize&&(f.wnext=0),f.whave<f.wsize&&(f.whave+=e))),0}function m(a,b){var c,e,f,g,h,i,j,m,n,o,p,q,ob,pb,qb,rb,sb,tb,ub,vb,wb,xb,yb,zb,Ab=0,Bb=new r.Buf8(4),Cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!a||!a.state||!a.output||!a.input&&0!==a.avail_in)return F;c=a.state,c.mode===V&&(c.mode=W),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,o=i,p=j,xb=C;a:for(;;)switch(c.mode){case K:if(0===c.wrap){c.mode=W;break}for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(2&c.wrap&&35615===m){c.check=0,Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0),m=0,n=0,c.mode=L;break}if(c.flags=0,c.head&&(c.head.done=!1),!(1&c.wrap)||(((255&m)<<8)+(m>>8))%31){a.msg="incorrect header check",c.mode=lb;break}if((15&m)!==J){a.msg="unknown compression method",c.mode=lb;break}if(m>>>=4,n-=4,wb=(15&m)+8,0===c.wbits)c.wbits=wb;else if(wb>c.wbits){a.msg="invalid window size",c.mode=lb;break}c.dmax=1<<wb,a.adler=c.check=1,c.mode=512&m?T:V,m=0,n=0;break;case L:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.flags=m,(255&c.flags)!==J){a.msg="unknown compression method",c.mode=lb;break}if(57344&c.flags){a.msg="unknown header flags set",c.mode=lb;break}c.head&&(c.head.text=m>>8&1),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=M;case M:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.time=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,Bb[2]=m>>>16&255,Bb[3]=m>>>24&255,c.check=t(c.check,Bb,4,0)),m=0,n=0,c.mode=N;case N:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.xflags=255&m,c.head.os=m>>8),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=O;case O:if(1024&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length=m,c.head&&(c.head.extra_len=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0}else c.head&&(c.head.extra=null);c.mode=P;case P:if(1024&c.flags&&(q=c.length,q>i&&(q=i),q&&(c.head&&(wb=c.head.extra_len-c.length,c.head.extra||(c.head.extra=new Array(c.head.extra_len)),r.arraySet(c.head.extra,e,g,q,wb)),512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,c.length-=q),c.length))break a;c.length=0,c.mode=Q;case Q:if(2048&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.name+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.name=null);c.length=0,c.mode=R;case R:if(4096&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.comment+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.comment=null);c.mode=S;case S:if(512&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(65535&c.check)){a.msg="header crc mismatch",c.mode=lb;break}m=0,n=0}c.head&&(c.head.hcrc=c.flags>>9&1,c.head.done=!0),a.adler=c.check=0,c.mode=V;break;case T:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}a.adler=c.check=d(m),m=0,n=0,c.mode=U;case U:if(0===c.havedict)return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,E;a.adler=c.check=1,c.mode=V;case V:if(b===A||b===B)break a;case W:if(c.last){m>>>=7&n,n-=7&n,c.mode=ib;break}for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}switch(c.last=1&m,m>>>=1,n-=1,3&m){case 0:c.mode=X;break;case 1:if(k(c),c.mode=bb,b===B){m>>>=2,n-=2;break a}break;case 2:c.mode=$;break;case 3:a.msg="invalid block type",c.mode=lb}m>>>=2,n-=2;break;case X:for(m>>>=7&n,n-=7&n;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if((65535&m)!==(m>>>16^65535)){a.msg="invalid stored block lengths",c.mode=lb;break}if(c.length=65535&m,m=0,n=0,c.mode=Y,b===B)break a;case Y:c.mode=Z;case Z:if(q=c.length){if(q>i&&(q=i),q>j&&(q=j),0===q)break a;r.arraySet(f,e,g,q,h),i-=q,g+=q,j-=q,h+=q,c.length-=q;break}c.mode=V;break;case $:for(;14>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.nlen=(31&m)+257,m>>>=5,n-=5,c.ndist=(31&m)+1,m>>>=5,n-=5,c.ncode=(15&m)+4,m>>>=4,n-=4,c.nlen>286||c.ndist>30){a.msg="too many length or distance symbols",c.mode=lb;break}c.have=0,c.mode=_;case _:for(;c.have<c.ncode;){for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.lens[Cb[c.have++]]=7&m,m>>>=3,n-=3}for(;c.have<19;)c.lens[Cb[c.have++]]=0;if(c.lencode=c.lendyn,c.lenbits=7,yb={bits:c.lenbits},xb=v(w,c.lens,0,19,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid code lengths set",c.mode=lb;break}c.have=0,c.mode=ab;case ab:for(;c.have<c.nlen+c.ndist;){for(;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(16>sb)m>>>=qb,n-=qb,c.lens[c.have++]=sb;else{if(16===sb){for(zb=qb+2;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m>>>=qb,n-=qb,0===c.have){a.msg="invalid bit length repeat",c.mode=lb;break}wb=c.lens[c.have-1],q=3+(3&m),m>>>=2,n-=2}else if(17===sb){for(zb=qb+3;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=3+(7&m),m>>>=3,n-=3}else{for(zb=qb+7;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=11+(127&m),m>>>=7,n-=7}if(c.have+q>c.nlen+c.ndist){a.msg="invalid bit length repeat",c.mode=lb;break}for(;q--;)c.lens[c.have++]=wb}}if(c.mode===lb)break;if(0===c.lens[256]){a.msg="invalid code -- missing end-of-block",c.mode=lb;break}if(c.lenbits=9,yb={bits:c.lenbits},xb=v(x,c.lens,0,c.nlen,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid literal/lengths set",c.mode=lb;break}if(c.distbits=6,c.distcode=c.distdyn,yb={bits:c.distbits},xb=v(y,c.lens,c.nlen,c.ndist,c.distcode,0,c.work,yb),c.distbits=yb.bits,xb){a.msg="invalid distances set",c.mode=lb;break}if(c.mode=bb,b===B)break a;case bb:c.mode=cb;case cb:if(i>=6&&j>=258){a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,u(a,p),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,c.mode===V&&(c.back=-1);
break}for(c.back=0;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(rb&&0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.lencode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,c.length=sb,0===rb){c.mode=hb;break}if(32&rb){c.back=-1,c.mode=V;break}if(64&rb){a.msg="invalid literal/length code",c.mode=lb;break}c.extra=15&rb,c.mode=db;case db:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}c.was=c.length,c.mode=eb;case eb:for(;Ab=c.distcode[m&(1<<c.distbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.distcode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,64&rb){a.msg="invalid distance code",c.mode=lb;break}c.offset=sb,c.extra=15&rb,c.mode=fb;case fb:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.offset+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}if(c.offset>c.dmax){a.msg="invalid distance too far back",c.mode=lb;break}c.mode=gb;case gb:if(0===j)break a;if(q=p-j,c.offset>q){if(q=c.offset-q,q>c.whave&&c.sane){a.msg="invalid distance too far back",c.mode=lb;break}q>c.wnext?(q-=c.wnext,ob=c.wsize-q):ob=c.wnext-q,q>c.length&&(q=c.length),pb=c.window}else pb=f,ob=h-c.offset,q=c.length;q>j&&(q=j),j-=q,c.length-=q;do f[h++]=pb[ob++];while(--q);0===c.length&&(c.mode=cb);break;case hb:if(0===j)break a;f[h++]=c.length,j--,c.mode=cb;break;case ib:if(c.wrap){for(;32>n;){if(0===i)break a;i--,m|=e[g++]<<n,n+=8}if(p-=j,a.total_out+=p,c.total+=p,p&&(a.adler=c.check=c.flags?t(c.check,f,p,h-p):s(c.check,f,p,h-p)),p=j,(c.flags?m:d(m))!==c.check){a.msg="incorrect data check",c.mode=lb;break}m=0,n=0}c.mode=jb;case jb:if(c.wrap&&c.flags){for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(4294967295&c.total)){a.msg="incorrect length check",c.mode=lb;break}m=0,n=0}c.mode=kb;case kb:xb=D;break a;case lb:xb=G;break a;case mb:return H;case nb:default:return F}return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,(c.wsize||p!==a.avail_out&&c.mode<lb&&(c.mode<ib||b!==z))&&l(a,a.output,a.next_out,p-a.avail_out)?(c.mode=mb,H):(o-=a.avail_in,p-=a.avail_out,a.total_in+=o,a.total_out+=p,c.total+=p,c.wrap&&p&&(a.adler=c.check=c.flags?t(c.check,f,p,a.next_out-p):s(c.check,f,p,a.next_out-p)),a.data_type=c.bits+(c.last?64:0)+(c.mode===V?128:0)+(c.mode===bb||c.mode===Y?256:0),(0===o&&0===p||b===z)&&xb===C&&(xb=I),xb)}function n(a){if(!a||!a.state)return F;var b=a.state;return b.window&&(b.window=null),a.state=null,C}function o(a,b){var c;return a&&a.state?(c=a.state,0===(2&c.wrap)?F:(c.head=b,b.done=!1,C)):F}var p,q,r=a("../utils/common"),s=a("./adler32"),t=a("./crc32"),u=a("./inffast"),v=a("./inftrees"),w=0,x=1,y=2,z=4,A=5,B=6,C=0,D=1,E=2,F=-2,G=-3,H=-4,I=-5,J=8,K=1,L=2,M=3,N=4,O=5,P=6,Q=7,R=8,S=9,T=10,U=11,V=12,W=13,X=14,Y=15,Z=16,$=17,_=18,ab=19,bb=20,cb=21,db=22,eb=23,fb=24,gb=25,hb=26,ib=27,jb=28,kb=29,lb=30,mb=31,nb=32,ob=852,pb=592,qb=15,rb=qb,sb=!0;c.inflateReset=g,c.inflateReset2=h,c.inflateResetKeep=f,c.inflateInit=j,c.inflateInit2=i,c.inflate=m,c.inflateEnd=n,c.inflateGetHeader=o,c.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":27,"./adler32":29,"./crc32":31,"./inffast":34,"./inftrees":36}],36:[function(a,b){"use strict";var c=a("../utils/common"),d=15,e=852,f=592,g=0,h=1,i=2,j=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],k=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],m=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];b.exports=function(a,b,n,o,p,q,r,s){var t,u,v,w,x,y,z,A,B,C=s.bits,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=null,O=0,P=new c.Buf16(d+1),Q=new c.Buf16(d+1),R=null,S=0;for(D=0;d>=D;D++)P[D]=0;for(E=0;o>E;E++)P[b[n+E]]++;for(H=C,G=d;G>=1&&0===P[G];G--);if(H>G&&(H=G),0===G)return p[q++]=20971520,p[q++]=20971520,s.bits=1,0;for(F=1;G>F&&0===P[F];F++);for(F>H&&(H=F),K=1,D=1;d>=D;D++)if(K<<=1,K-=P[D],0>K)return-1;if(K>0&&(a===g||1!==G))return-1;for(Q[1]=0,D=1;d>D;D++)Q[D+1]=Q[D]+P[D];for(E=0;o>E;E++)0!==b[n+E]&&(r[Q[b[n+E]]++]=E);if(a===g?(N=R=r,y=19):a===h?(N=j,O-=257,R=k,S-=257,y=256):(N=l,R=m,y=-1),M=0,E=0,D=F,x=q,I=H,J=0,v=-1,L=1<<H,w=L-1,a===h&&L>e||a===i&&L>f)return 1;for(var T=0;;){T++,z=D-J,r[E]<y?(A=0,B=r[E]):r[E]>y?(A=R[S+r[E]],B=N[O+r[E]]):(A=96,B=0),t=1<<D-J,u=1<<I,F=u;do u-=t,p[x+(M>>J)+u]=z<<24|A<<16|B|0;while(0!==u);for(t=1<<D-1;M&t;)t>>=1;if(0!==t?(M&=t-1,M+=t):M=0,E++,0===--P[D]){if(D===G)break;D=b[n+r[E]]}if(D>H&&(M&w)!==v){for(0===J&&(J=H),x+=F,I=D-J,K=1<<I;G>I+J&&(K-=P[I+J],!(0>=K));)I++,K<<=1;if(L+=1<<I,a===h&&L>e||a===i&&L>f)return 1;v=M&w,p[v]=H<<24|I<<16|x-q|0}}return 0!==M&&(p[x+M]=D-J<<24|64<<16|0),s.bits=H,0}},{"../utils/common":27}],37:[function(a,b){"use strict";b.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],38:[function(a,b,c){"use strict";function d(a){for(var b=a.length;--b>=0;)a[b]=0}function e(a){return 256>a?gb[a]:gb[256+(a>>>7)]}function f(a,b){a.pending_buf[a.pending++]=255&b,a.pending_buf[a.pending++]=b>>>8&255}function g(a,b,c){a.bi_valid>V-c?(a.bi_buf|=b<<a.bi_valid&65535,f(a,a.bi_buf),a.bi_buf=b>>V-a.bi_valid,a.bi_valid+=c-V):(a.bi_buf|=b<<a.bi_valid&65535,a.bi_valid+=c)}function h(a,b,c){g(a,c[2*b],c[2*b+1])}function i(a,b){var c=0;do c|=1&a,a>>>=1,c<<=1;while(--b>0);return c>>>1}function j(a){16===a.bi_valid?(f(a,a.bi_buf),a.bi_buf=0,a.bi_valid=0):a.bi_valid>=8&&(a.pending_buf[a.pending++]=255&a.bi_buf,a.bi_buf>>=8,a.bi_valid-=8)}function k(a,b){var c,d,e,f,g,h,i=b.dyn_tree,j=b.max_code,k=b.stat_desc.static_tree,l=b.stat_desc.has_stree,m=b.stat_desc.extra_bits,n=b.stat_desc.extra_base,o=b.stat_desc.max_length,p=0;for(f=0;U>=f;f++)a.bl_count[f]=0;for(i[2*a.heap[a.heap_max]+1]=0,c=a.heap_max+1;T>c;c++)d=a.heap[c],f=i[2*i[2*d+1]+1]+1,f>o&&(f=o,p++),i[2*d+1]=f,d>j||(a.bl_count[f]++,g=0,d>=n&&(g=m[d-n]),h=i[2*d],a.opt_len+=h*(f+g),l&&(a.static_len+=h*(k[2*d+1]+g)));if(0!==p){do{for(f=o-1;0===a.bl_count[f];)f--;a.bl_count[f]--,a.bl_count[f+1]+=2,a.bl_count[o]--,p-=2}while(p>0);for(f=o;0!==f;f--)for(d=a.bl_count[f];0!==d;)e=a.heap[--c],e>j||(i[2*e+1]!==f&&(a.opt_len+=(f-i[2*e+1])*i[2*e],i[2*e+1]=f),d--)}}function l(a,b,c){var d,e,f=new Array(U+1),g=0;for(d=1;U>=d;d++)f[d]=g=g+c[d-1]<<1;for(e=0;b>=e;e++){var h=a[2*e+1];0!==h&&(a[2*e]=i(f[h]++,h))}}function m(){var a,b,c,d,e,f=new Array(U+1);for(c=0,d=0;O-1>d;d++)for(ib[d]=c,a=0;a<1<<_[d];a++)hb[c++]=d;for(hb[c-1]=d,e=0,d=0;16>d;d++)for(jb[d]=e,a=0;a<1<<ab[d];a++)gb[e++]=d;for(e>>=7;R>d;d++)for(jb[d]=e<<7,a=0;a<1<<ab[d]-7;a++)gb[256+e++]=d;for(b=0;U>=b;b++)f[b]=0;for(a=0;143>=a;)eb[2*a+1]=8,a++,f[8]++;for(;255>=a;)eb[2*a+1]=9,a++,f[9]++;for(;279>=a;)eb[2*a+1]=7,a++,f[7]++;for(;287>=a;)eb[2*a+1]=8,a++,f[8]++;for(l(eb,Q+1,f),a=0;R>a;a++)fb[2*a+1]=5,fb[2*a]=i(a,5);kb=new nb(eb,_,P+1,Q,U),lb=new nb(fb,ab,0,R,U),mb=new nb(new Array(0),bb,0,S,W)}function n(a){var b;for(b=0;Q>b;b++)a.dyn_ltree[2*b]=0;for(b=0;R>b;b++)a.dyn_dtree[2*b]=0;for(b=0;S>b;b++)a.bl_tree[2*b]=0;a.dyn_ltree[2*X]=1,a.opt_len=a.static_len=0,a.last_lit=a.matches=0}function o(a){a.bi_valid>8?f(a,a.bi_buf):a.bi_valid>0&&(a.pending_buf[a.pending++]=a.bi_buf),a.bi_buf=0,a.bi_valid=0}function p(a,b,c,d){o(a),d&&(f(a,c),f(a,~c)),E.arraySet(a.pending_buf,a.window,b,c,a.pending),a.pending+=c}function q(a,b,c,d){var e=2*b,f=2*c;return a[e]<a[f]||a[e]===a[f]&&d[b]<=d[c]}function r(a,b,c){for(var d=a.heap[c],e=c<<1;e<=a.heap_len&&(e<a.heap_len&&q(b,a.heap[e+1],a.heap[e],a.depth)&&e++,!q(b,d,a.heap[e],a.depth));)a.heap[c]=a.heap[e],c=e,e<<=1;a.heap[c]=d}function s(a,b,c){var d,f,i,j,k=0;if(0!==a.last_lit)do d=a.pending_buf[a.d_buf+2*k]<<8|a.pending_buf[a.d_buf+2*k+1],f=a.pending_buf[a.l_buf+k],k++,0===d?h(a,f,b):(i=hb[f],h(a,i+P+1,b),j=_[i],0!==j&&(f-=ib[i],g(a,f,j)),d--,i=e(d),h(a,i,c),j=ab[i],0!==j&&(d-=jb[i],g(a,d,j)));while(k<a.last_lit);h(a,X,b)}function t(a,b){var c,d,e,f=b.dyn_tree,g=b.stat_desc.static_tree,h=b.stat_desc.has_stree,i=b.stat_desc.elems,j=-1;for(a.heap_len=0,a.heap_max=T,c=0;i>c;c++)0!==f[2*c]?(a.heap[++a.heap_len]=j=c,a.depth[c]=0):f[2*c+1]=0;for(;a.heap_len<2;)e=a.heap[++a.heap_len]=2>j?++j:0,f[2*e]=1,a.depth[e]=0,a.opt_len--,h&&(a.static_len-=g[2*e+1]);for(b.max_code=j,c=a.heap_len>>1;c>=1;c--)r(a,f,c);e=i;do c=a.heap[1],a.heap[1]=a.heap[a.heap_len--],r(a,f,1),d=a.heap[1],a.heap[--a.heap_max]=c,a.heap[--a.heap_max]=d,f[2*e]=f[2*c]+f[2*d],a.depth[e]=(a.depth[c]>=a.depth[d]?a.depth[c]:a.depth[d])+1,f[2*c+1]=f[2*d+1]=e,a.heap[1]=e++,r(a,f,1);while(a.heap_len>=2);a.heap[--a.heap_max]=a.heap[1],k(a,b),l(f,j,a.bl_count)}function u(a,b,c){var d,e,f=-1,g=b[1],h=0,i=7,j=4;for(0===g&&(i=138,j=3),b[2*(c+1)+1]=65535,d=0;c>=d;d++)e=g,g=b[2*(d+1)+1],++h<i&&e===g||(j>h?a.bl_tree[2*e]+=h:0!==e?(e!==f&&a.bl_tree[2*e]++,a.bl_tree[2*Y]++):10>=h?a.bl_tree[2*Z]++:a.bl_tree[2*$]++,h=0,f=e,0===g?(i=138,j=3):e===g?(i=6,j=3):(i=7,j=4))}function v(a,b,c){var d,e,f=-1,i=b[1],j=0,k=7,l=4;for(0===i&&(k=138,l=3),d=0;c>=d;d++)if(e=i,i=b[2*(d+1)+1],!(++j<k&&e===i)){if(l>j){do h(a,e,a.bl_tree);while(0!==--j)}else 0!==e?(e!==f&&(h(a,e,a.bl_tree),j--),h(a,Y,a.bl_tree),g(a,j-3,2)):10>=j?(h(a,Z,a.bl_tree),g(a,j-3,3)):(h(a,$,a.bl_tree),g(a,j-11,7));j=0,f=e,0===i?(k=138,l=3):e===i?(k=6,l=3):(k=7,l=4)}}function w(a){var b;for(u(a,a.dyn_ltree,a.l_desc.max_code),u(a,a.dyn_dtree,a.d_desc.max_code),t(a,a.bl_desc),b=S-1;b>=3&&0===a.bl_tree[2*cb[b]+1];b--);return a.opt_len+=3*(b+1)+5+5+4,b}function x(a,b,c,d){var e;for(g(a,b-257,5),g(a,c-1,5),g(a,d-4,4),e=0;d>e;e++)g(a,a.bl_tree[2*cb[e]+1],3);v(a,a.dyn_ltree,b-1),v(a,a.dyn_dtree,c-1)}function y(a){var b,c=4093624447;for(b=0;31>=b;b++,c>>>=1)if(1&c&&0!==a.dyn_ltree[2*b])return G;if(0!==a.dyn_ltree[18]||0!==a.dyn_ltree[20]||0!==a.dyn_ltree[26])return H;for(b=32;P>b;b++)if(0!==a.dyn_ltree[2*b])return H;return G}function z(a){pb||(m(),pb=!0),a.l_desc=new ob(a.dyn_ltree,kb),a.d_desc=new ob(a.dyn_dtree,lb),a.bl_desc=new ob(a.bl_tree,mb),a.bi_buf=0,a.bi_valid=0,n(a)}function A(a,b,c,d){g(a,(J<<1)+(d?1:0),3),p(a,b,c,!0)}function B(a){g(a,K<<1,3),h(a,X,eb),j(a)}function C(a,b,c,d){var e,f,h=0;a.level>0?(a.strm.data_type===I&&(a.strm.data_type=y(a)),t(a,a.l_desc),t(a,a.d_desc),h=w(a),e=a.opt_len+3+7>>>3,f=a.static_len+3+7>>>3,e>=f&&(e=f)):e=f=c+5,e>=c+4&&-1!==b?A(a,b,c,d):a.strategy===F||f===e?(g(a,(K<<1)+(d?1:0),3),s(a,eb,fb)):(g(a,(L<<1)+(d?1:0),3),x(a,a.l_desc.max_code+1,a.d_desc.max_code+1,h+1),s(a,a.dyn_ltree,a.dyn_dtree)),n(a),d&&o(a)}function D(a,b,c){return a.pending_buf[a.d_buf+2*a.last_lit]=b>>>8&255,a.pending_buf[a.d_buf+2*a.last_lit+1]=255&b,a.pending_buf[a.l_buf+a.last_lit]=255&c,a.last_lit++,0===b?a.dyn_ltree[2*c]++:(a.matches++,b--,a.dyn_ltree[2*(hb[c]+P+1)]++,a.dyn_dtree[2*e(b)]++),a.last_lit===a.lit_bufsize-1}var E=a("../utils/common"),F=4,G=0,H=1,I=2,J=0,K=1,L=2,M=3,N=258,O=29,P=256,Q=P+1+O,R=30,S=19,T=2*Q+1,U=15,V=16,W=7,X=256,Y=16,Z=17,$=18,_=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ab=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],bb=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],db=512,eb=new Array(2*(Q+2));d(eb);var fb=new Array(2*R);d(fb);var gb=new Array(db);d(gb);var hb=new Array(N-M+1);d(hb);var ib=new Array(O);d(ib);var jb=new Array(R);d(jb);var kb,lb,mb,nb=function(a,b,c,d,e){this.static_tree=a,this.extra_bits=b,this.extra_base=c,this.elems=d,this.max_length=e,this.has_stree=a&&a.length},ob=function(a,b){this.dyn_tree=a,this.max_code=0,this.stat_desc=b},pb=!1;c._tr_init=z,c._tr_stored_block=A,c._tr_flush_block=C,c._tr_tally=D,c._tr_align=B},{"../utils/common":27}],39:[function(a,b){"use strict";function c(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}b.exports=c},{}]},{},[9])(9)});
var hljs=new function(){function j(v){return v.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function t(v){return v.nodeName.toLowerCase()}function h(w,x){var v=w&&w.exec(x);return v&&v.index==0}function r(w){var v=(w.className+" "+(w.parentNode?w.parentNode.className:"")).split(/\s+/);v=v.map(function(x){return x.replace(/^lang(uage)?-/,"")});return v.filter(function(x){return i(x)||x=="no-highlight"})[0]}function o(x,y){var v={};for(var w in x){v[w]=x[w]}if(y){for(var w in y){v[w]=y[w]}}return v}function u(x){var v=[];(function w(y,z){for(var A=y.firstChild;A;A=A.nextSibling){if(A.nodeType==3){z+=A.nodeValue.length}else{if(t(A)=="br"){z+=1}else{if(A.nodeType==1){v.push({event:"start",offset:z,node:A});z=w(A,z);v.push({event:"stop",offset:z,node:A})}}}}return z})(x,0);return v}function q(w,y,C){var x=0;var F="";var z=[];function B(){if(!w.length||!y.length){return w.length?w:y}if(w[0].offset!=y[0].offset){return(w[0].offset<y[0].offset)?w:y}return y[0].event=="start"?w:y}function A(H){function G(I){return" "+I.nodeName+'="'+j(I.value)+'"'}F+="<"+t(H)+Array.prototype.map.call(H.attributes,G).join("")+">"}function E(G){F+="</"+t(G)+">"}function v(G){(G.event=="start"?A:E)(G.node)}while(w.length||y.length){var D=B();F+=j(C.substr(x,D[0].offset-x));x=D[0].offset;if(D==w){z.reverse().forEach(E);do{v(D.splice(0,1)[0]);D=B()}while(D==w&&D.length&&D[0].offset==x);z.reverse().forEach(A)}else{if(D[0].event=="start"){z.push(D[0].node)}else{z.pop()}v(D.splice(0,1)[0])}}return F+j(C.substr(x))}function m(y){function v(z){return(z&&z.source)||z}function w(A,z){return RegExp(v(A),"m"+(y.cI?"i":"")+(z?"g":""))}function x(D,C){if(D.compiled){return}D.compiled=true;D.k=D.k||D.bK;if(D.k){var z={};function E(G,F){if(y.cI){F=F.toLowerCase()}F.split(" ").forEach(function(H){var I=H.split("|");z[I[0]]=[G,I[1]?Number(I[1]):1]})}if(typeof D.k=="string"){E("keyword",D.k)}else{Object.keys(D.k).forEach(function(F){E(F,D.k[F])})}D.k=z}D.lR=w(D.l||/\b[A-Za-z0-9_]+\b/,true);if(C){if(D.bK){D.b="\\b("+D.bK.split(" ").join("|")+")\\b"}if(!D.b){D.b=/\B|\b/}D.bR=w(D.b);if(!D.e&&!D.eW){D.e=/\B|\b/}if(D.e){D.eR=w(D.e)}D.tE=v(D.e)||"";if(D.eW&&C.tE){D.tE+=(D.e?"|":"")+C.tE}}if(D.i){D.iR=w(D.i)}if(D.r===undefined){D.r=1}if(!D.c){D.c=[]}var B=[];D.c.forEach(function(F){if(F.v){F.v.forEach(function(G){B.push(o(F,G))})}else{B.push(F=="self"?D:F)}});D.c=B;D.c.forEach(function(F){x(F,D)});if(D.starts){x(D.starts,C)}var A=D.c.map(function(F){return F.bK?"\\.?("+F.b+")\\.?":F.b}).concat([D.tE,D.i]).map(v).filter(Boolean);D.t=A.length?w(A.join("|"),true):{exec:function(F){return null}};D.continuation={}}x(y)}function c(S,L,J,R){function v(U,V){for(var T=0;T<V.c.length;T++){if(h(V.c[T].bR,U)){return V.c[T]}}}function z(U,T){if(h(U.eR,T)){return U}if(U.eW){return z(U.parent,T)}}function A(T,U){return !J&&h(U.iR,T)}function E(V,T){var U=M.cI?T[0].toLowerCase():T[0];return V.k.hasOwnProperty(U)&&V.k[U]}function w(Z,X,W,V){var T=V?"":b.classPrefix,U='<span class="'+T,Y=W?"":"</span>";U+=Z+'">';return U+X+Y}function N(){if(!I.k){return j(C)}var T="";var W=0;I.lR.lastIndex=0;var U=I.lR.exec(C);while(U){T+=j(C.substr(W,U.index-W));var V=E(I,U);if(V){H+=V[1];T+=w(V[0],j(U[0]))}else{T+=j(U[0])}W=I.lR.lastIndex;U=I.lR.exec(C)}return T+j(C.substr(W))}function F(){if(I.sL&&!f[I.sL]){return j(C)}var T=I.sL?c(I.sL,C,true,I.continuation.top):e(C);if(I.r>0){H+=T.r}if(I.subLanguageMode=="continuous"){I.continuation.top=T.top}return w(T.language,T.value,false,true)}function Q(){return I.sL!==undefined?F():N()}function P(V,U){var T=V.cN?w(V.cN,"",true):"";if(V.rB){D+=T;C=""}else{if(V.eB){D+=j(U)+T;C=""}else{D+=T;C=U}}I=Object.create(V,{parent:{value:I}})}function G(T,X){C+=T;if(X===undefined){D+=Q();return 0}var V=v(X,I);if(V){D+=Q();P(V,X);return V.rB?0:X.length}var W=z(I,X);if(W){var U=I;if(!(U.rE||U.eE)){C+=X}D+=Q();do{if(I.cN){D+="</span>"}H+=I.r;I=I.parent}while(I!=W.parent);if(U.eE){D+=j(X)}C="";if(W.starts){P(W.starts,"")}return U.rE?0:X.length}if(A(X,I)){throw new Error('Illegal lexeme "'+X+'" for mode "'+(I.cN||"<unnamed>")+'"')}C+=X;return X.length||1}var M=i(S);if(!M){throw new Error('Unknown language: "'+S+'"')}m(M);var I=R||M;var D="";for(var K=I;K!=M;K=K.parent){if(K.cN){D+=w(K.cN,D,true)}}var C="";var H=0;try{var B,y,x=0;while(true){I.t.lastIndex=x;B=I.t.exec(L);if(!B){break}y=G(L.substr(x,B.index-x),B[0]);x=B.index+y}G(L.substr(x));for(var K=I;K.parent;K=K.parent){if(K.cN){D+="</span>"}}return{r:H,value:D,language:S,top:I}}catch(O){if(O.message.indexOf("Illegal")!=-1){return{r:0,value:j(L)}}else{throw O}}}function e(y,x){x=x||b.languages||Object.keys(f);var v={r:0,value:j(y)};var w=v;x.forEach(function(z){if(!i(z)){return}var A=c(z,y,false);A.language=z;if(A.r>w.r){w=A}if(A.r>v.r){w=v;v=A}});if(w.language){v.second_best=w}return v}function g(v){if(b.tabReplace){v=v.replace(/^((<[^>]+>|\t)+)/gm,function(w,z,y,x){return z.replace(/\t/g,b.tabReplace)})}if(b.useBR){v=v.replace(/\n/g,"<br>")}return v}function p(z){var y=b.useBR?z.innerHTML.replace(/\n/g,"").replace(/<br>|<br [^>]*>/g,"\n").replace(/<[^>]*>/g,""):z.textContent;var A=r(z);if(A=="no-highlight"){return}var v=A?c(A,y,true):e(y);var w=u(z);if(w.length){var x=document.createElementNS("http://www.w3.org/1999/xhtml","pre");x.innerHTML=v.value;v.value=q(w,u(x),y)}v.value=g(v.value);z.innerHTML=v.value;z.className+=" hljs "+(!A&&v.language||"");z.result={language:v.language,re:v.r};if(v.second_best){z.second_best={language:v.second_best.language,re:v.second_best.r}}}var b={classPrefix:"hljs-",tabReplace:null,useBR:false,languages:undefined};function s(v){b=o(b,v)}function l(){if(l.called){return}l.called=true;var v=document.querySelectorAll("pre code");Array.prototype.forEach.call(v,p)}function a(){addEventListener("DOMContentLoaded",l,false);addEventListener("load",l,false)}var f={};var n={};function d(v,x){var w=f[v]=x(this);if(w.aliases){w.aliases.forEach(function(y){n[y]=v})}}function k(){return Object.keys(f)}function i(v){return f[v]||f[n[v]]}this.highlight=c;this.highlightAuto=e;this.fixMarkup=g;this.highlightBlock=p;this.configure=s;this.initHighlighting=l;this.initHighlightingOnLoad=a;this.registerLanguage=d;this.listLanguages=k;this.getLanguage=i;this.inherit=o;this.IR="[a-zA-Z][a-zA-Z0-9_]*";this.UIR="[a-zA-Z_][a-zA-Z0-9_]*";this.NR="\\b\\d+(\\.\\d+)?";this.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";this.BNR="\\b(0b[01]+)";this.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";this.BE={b:"\\\\[\\s\\S]",r:0};this.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[this.BE]};this.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[this.BE]};this.PWM={b:/\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/};this.CLCM={cN:"comment",b:"//",e:"$",c:[this.PWM]};this.CBCM={cN:"comment",b:"/\\*",e:"\\*/",c:[this.PWM]};this.HCM={cN:"comment",b:"#",e:"$",c:[this.PWM]};this.NM={cN:"number",b:this.NR,r:0};this.CNM={cN:"number",b:this.CNR,r:0};this.BNM={cN:"number",b:this.BNR,r:0};this.CSSNM={cN:"number",b:this.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0};this.RM={cN:"regexp",b:/\//,e:/\/[gim]*/,i:/\n/,c:[this.BE,{b:/\[/,e:/\]/,r:0,c:[this.BE]}]};this.TM={cN:"title",b:this.IR,r:0};this.UTM={cN:"title",b:this.UIR,r:0}}();hljs.registerLanguage("bash",function(b){var a={cN:"variable",v:[{b:/\$[\w\d#@][\w\d_]*/},{b:/\$\{(.*?)\}/}]};var d={cN:"string",b:/"/,e:/"/,c:[b.BE,a,{cN:"variable",b:/\$\(/,e:/\)/,c:[b.BE]}]};var c={cN:"string",b:/'/,e:/'/};return{aliases:["sh","zsh"],l:/-?[a-z\.]+/,k:{keyword:"if then else elif fi for break continue while in do done exit return set declare case esac export exec",literal:"true false",built_in:"printf echo read cd pwd pushd popd dirs let eval unset typeset readonly getopts source shopt caller type hash bind help sudo",operator:"-ne -eq -lt -gt -f -d -e -s -l -a"},c:[{cN:"shebang",b:/^#![^\n]+sh\s*$/,r:10},{cN:"function",b:/\w[\w\d_]*\s*\(\s*\)\s*\{/,rB:true,c:[b.inherit(b.TM,{b:/\w[\w\d_]*/})],r:0},b.HCM,b.NM,d,c,a]}});hljs.registerLanguage("brainfuck",function(b){var a={cN:"literal",b:"[\\+\\-]",r:0};return{aliases:["bf"],c:[{cN:"comment",b:"[^\\[\\]\\.,\\+\\-<> \r\n]",rE:true,e:"[\\[\\]\\.,\\+\\-<> \r\n]",r:0},{cN:"title",b:"[\\[\\]]",r:0},{cN:"string",b:"[\\.,]",r:0},{b:/\+\+|\-\-/,rB:true,c:[a]},a]}});hljs.registerLanguage("clojure",function(l){var e={built_in:"def cond apply if-not if-let if not not= = &lt; < > &lt;= <= >= == + / * - rem quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last drop-while while intern condp case reduced cycle split-at split-with repeat replicate iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter monitor-exit defmacro defn defn- macroexpand macroexpand-1 for dosync and or when when-not when-let comp juxt partial sequence memoize constantly complement identity assert peek pop doto proxy defstruct first rest cons defprotocol cast coll deftype defrecord last butlast sigs reify second ffirst fnext nfirst nnext defmulti defmethod meta with-meta ns in-ns create-ns import refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize"};var f="[a-zA-Z_0-9\\!\\.\\?\\-\\+\\*\\/\\<\\=\\>\\&\\#\\$';]+";var a="[\\s:\\(\\{]+\\d+(\\.\\d+)?";var d={cN:"number",b:a,r:0};var j=l.inherit(l.QSM,{i:null});var o={cN:"comment",b:";",e:"$",r:0};var n={cN:"collection",b:"[\\[\\{]",e:"[\\]\\}]"};var c={cN:"comment",b:"\\^"+f};var b={cN:"comment",b:"\\^\\{",e:"\\}"};var h={cN:"attribute",b:"[:]"+f};var m={cN:"list",b:"\\(",e:"\\)"};var g={eW:true,k:{literal:"true false nil"},r:0};var i={k:e,l:f,cN:"title",b:f,starts:g};m.c=[{cN:"comment",b:"comment"},i,g];g.c=[m,j,c,b,o,h,n,d];n.c=[m,j,c,o,h,n,d];return{aliases:["clj"],i:/\S/,c:[o,m,{cN:"prompt",b:/^=> /,starts:{e:/\n\n|\Z/}}]}});hljs.registerLanguage("coffeescript",function(c){var b={keyword:"in if for while finally new do return else break catch instanceof throw try this switch continue typeof delete debugger super then unless until loop of by when and or is isnt not",literal:"true false null undefined yes no on off",reserved:"case default function var void with const let enum export import native __hasProp __extends __slice __bind __indexOf",built_in:"npm require console print module global window document"};var a="[A-Za-z$_][0-9A-Za-z$_]*";var f=c.inherit(c.TM,{b:a});var e={cN:"subst",b:/#\{/,e:/}/,k:b};var d=[c.BNM,c.inherit(c.CNM,{starts:{e:"(\\s*/)?",r:0}}),{cN:"string",v:[{b:/'''/,e:/'''/,c:[c.BE]},{b:/'/,e:/'/,c:[c.BE]},{b:/"""/,e:/"""/,c:[c.BE,e]},{b:/"/,e:/"/,c:[c.BE,e]}]},{cN:"regexp",v:[{b:"///",e:"///",c:[e,c.HCM]},{b:"//[gim]*",r:0},{b:"/\\S(\\\\.|[^\\n])*?/[gim]*(?=\\s|\\W|$)"}]},{cN:"property",b:"@"+a},{b:"`",e:"`",eB:true,eE:true,sL:"javascript"}];e.c=d;return{aliases:["coffee","cson","iced"],k:b,c:d.concat([{cN:"comment",b:"###",e:"###"},c.HCM,{cN:"function",b:"("+a+"\\s*=\\s*)?(\\(.*\\))?\\s*\\B[-=]>",e:"[-=]>",rB:true,c:[f,{cN:"params",b:"\\(",rB:true,c:[{b:/\(/,e:/\)/,k:b,c:["self"].concat(d)}]}]},{cN:"class",bK:"class",e:"$",i:/[:="\[\]]/,c:[{bK:"extends",eW:true,i:/[:="\[\]]/,c:[f]},f]},{cN:"attribute",b:a+":",e:":",rB:true,eE:true,r:0}])}});hljs.registerLanguage("cpp",function(a){var b={keyword:"false int float while private char catch export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const struct for static_cast|10 union namespace unsigned long throw volatile static protected bool template mutable if public friend do return goto auto void enum else break new extern using true class asm case typeid short reinterpret_cast|10 default double register explicit signed typename try this switch continue wchar_t inline delete alignof char16_t char32_t constexpr decltype noexcept nullptr static_assert thread_local restrict _Bool complex _Complex _Imaginary",built_in:"std string cin cout cerr clog stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap array shared_ptr abort abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf"};return{aliases:["c","h","c++","h++"],k:b,i:"</",c:[a.CLCM,a.CBCM,a.QSM,{cN:"string",b:"'\\\\?.",e:"'",i:"."},{cN:"number",b:"\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)"},a.CNM,{cN:"preprocessor",b:"#",e:"$",k:"if else elif endif define undef warning error line pragma",c:[{b:'include\\s*[<"]',e:'[>"]',k:"include",i:"\\n"},a.CLCM]},{cN:"stl_container",b:"\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",e:">",k:b,c:["self"]},{b:a.IR+"::"}]}});hljs.registerLanguage("cs",function(b){var a="abstract as base bool break byte case catch char checked const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual volatile void while async await ascending descending from get group into join let orderby partial select set value var where yield";return{k:a,i:/::/,c:[{cN:"comment",b:"///",e:"$",rB:true,c:[{cN:"xmlDocTag",v:[{b:"///",r:0},{b:"<!--|-->"},{b:"</?",e:">"}]}]},b.CLCM,b.CBCM,{cN:"preprocessor",b:"#",e:"$",k:"if else elif endif define undef warning error line region endregion pragma checksum"},{cN:"string",b:'@"',e:'"',c:[{b:'""'}]},b.ASM,b.QSM,b.CNM,{bK:"protected public private internal",e:/[{;=]/,k:a,c:[{bK:"class namespace interface",starts:{c:[b.TM]}},{b:b.IR+"\\s*\\(",rB:true,c:[b.TM]}]}]}});hljs.registerLanguage("css",function(a){var b="[a-zA-Z-][a-zA-Z0-9_-]*";var c={cN:"function",b:b+"\\(",rB:true,eE:true,e:"\\("};return{cI:true,i:"[=/|']",c:[a.CBCM,{cN:"id",b:"\\#[A-Za-z0-9_-]+"},{cN:"class",b:"\\.[A-Za-z0-9_-]+",r:0},{cN:"attr_selector",b:"\\[",e:"\\]",i:"$"},{cN:"pseudo",b:":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"},{cN:"at_rule",b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{cN:"at_rule",b:"@",e:"[{;]",c:[{cN:"keyword",b:/\S+/},{b:/\s/,eW:true,eE:true,r:0,c:[c,a.ASM,a.QSM,a.CSSNM]}]},{cN:"tag",b:b,r:0},{cN:"rules",b:"{",e:"}",i:"[^\\s]",r:0,c:[a.CBCM,{cN:"rule",b:"[^\\s]",rB:true,e:";",eW:true,c:[{cN:"attribute",b:"[A-Z\\_\\.\\-]+",e:":",eE:true,i:"[^\\s]",starts:{cN:"value",eW:true,eE:true,c:[c,a.CSSNM,a.QSM,a.ASM,a.CBCM,{cN:"hexcolor",b:"#[0-9A-Fa-f]+"},{cN:"important",b:"!important"}]}}]}]}]}});hljs.registerLanguage("delphi",function(b){var a="exports register file shl array record property for mod while set ally label uses raise not stored class safecall var interface or private static exit index inherited to else stdcall override shr asm far resourcestring finalization packed virtual out and protected library do xorwrite goto near function end div overload object unit begin string on inline repeat until destructor write message program with read initialization except default nil if case cdecl in downto threadvar of try pascal const external constructor type public then implementation finally published procedure";var e={cN:"comment",v:[{b:/\{/,e:/\}/,r:0},{b:/\(\*/,e:/\*\)/,r:10}]};var c={cN:"string",b:/'/,e:/'/,c:[{b:/''/}]};var d={cN:"string",b:/(#\d+)+/};var f={b:b.IR+"\\s*=\\s*class\\s*\\(",rB:true,c:[b.TM]};var g={cN:"function",bK:"function constructor destructor procedure",e:/[:;]/,k:"function constructor|10 destructor|10 procedure|10",c:[b.TM,{cN:"params",b:/\(/,e:/\)/,k:a,c:[c,d]},e]};return{cI:true,k:a,i:/("|\$[G-Zg-z]|\/\*|<\/)/,c:[e,b.CLCM,c,d,b.NM,f,g]}});hljs.registerLanguage("diff",function(a){return{aliases:["patch"],c:[{cN:"chunk",r:10,v:[{b:/^\@\@ +\-\d+,\d+ +\+\d+,\d+ +\@\@$/},{b:/^\*\*\* +\d+,\d+ +\*\*\*\*$/},{b:/^\-\-\- +\d+,\d+ +\-\-\-\-$/}]},{cN:"header",v:[{b:/Index: /,e:/$/},{b:/=====/,e:/=====$/},{b:/^\-\-\-/,e:/$/},{b:/^\*{3} /,e:/$/},{b:/^\+\+\+/,e:/$/},{b:/\*{5}/,e:/\*{5}$/}]},{cN:"addition",b:"^\\+",e:"$"},{cN:"deletion",b:"^\\-",e:"$"},{cN:"change",b:"^\\!",e:"$"}]}});hljs.registerLanguage("erlang-repl",function(a){return{k:{special_functions:"spawn spawn_link self",reserved:"after and andalso|10 band begin bnot bor bsl bsr bxor case catch cond div end fun if let not of or orelse|10 query receive rem try when xor"},c:[{cN:"prompt",b:"^[0-9]+> ",r:10},{cN:"comment",b:"%",e:"$"},{cN:"number",b:"\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)",r:0},a.ASM,a.QSM,{cN:"constant",b:"\\?(::)?([A-Z]\\w*(::)?)+"},{cN:"arrow",b:"->"},{cN:"ok",b:"ok"},{cN:"exclamation_mark",b:"!"},{cN:"function_or_atom",b:"(\\b[a-z'][a-zA-Z0-9_']*:[a-z'][a-zA-Z0-9_']*)|(\\b[a-z'][a-zA-Z0-9_']*)",r:0},{cN:"variable",b:"[A-Z][a-zA-Z0-9_']*",r:0}]}});hljs.registerLanguage("erlang",function(i){var c="[a-z'][a-zA-Z0-9_']*";var o="("+c+":"+c+"|"+c+")";var f={keyword:"after and andalso|10 band begin bnot bor bsl bzr bxor case catch cond div end fun let not of orelse|10 query receive rem try when xor",literal:"false true"};var l={cN:"comment",b:"%",e:"$"};var e={cN:"number",b:"\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)",r:0};var g={b:"fun\\s+"+c+"/\\d+"};var n={b:o+"\\(",e:"\\)",rB:true,r:0,c:[{cN:"function_name",b:o,r:0},{b:"\\(",e:"\\)",eW:true,rE:true,r:0}]};var h={cN:"tuple",b:"{",e:"}",r:0};var a={cN:"variable",b:"\\b_([A-Z][A-Za-z0-9_]*)?",r:0};var m={cN:"variable",b:"[A-Z][a-zA-Z0-9_]*",r:0};var b={b:"#"+i.UIR,r:0,rB:true,c:[{cN:"record_name",b:"#"+i.UIR,r:0},{b:"{",e:"}",r:0}]};var k={bK:"fun receive if try case",e:"end",k:f};k.c=[l,g,i.inherit(i.ASM,{cN:""}),k,n,i.QSM,e,h,a,m,b];var j=[l,g,k,n,i.QSM,e,h,a,m,b];n.c[1].c=j;h.c=j;b.c[1].c=j;var d={cN:"params",b:"\\(",e:"\\)",c:j};return{aliases:["erl"],k:f,i:"(</|\\*=|\\+=|-=|/=|/\\*|\\*/|\\(\\*|\\*\\))",c:[{cN:"function",b:"^"+c+"\\s*\\(",e:"->",rB:true,i:"\\(|#|//|/\\*|\\\\|:|;",c:[d,i.inherit(i.TM,{b:c})],starts:{e:";|\\.",k:f,c:j}},l,{cN:"pp",b:"^-",e:"\\.",r:0,eE:true,rB:true,l:"-"+i.IR,k:"-module -record -undef -export -ifdef -ifndef -author -copyright -doc -vsn -import -include -include_lib -compile -define -else -endif -file -behaviour -behavior -spec",c:[d]},e,i.QSM,b,a,m,h,{b:/\.$/}]}});hljs.registerLanguage("haskell",function(f){var g={cN:"comment",v:[{b:"--",e:"$"},{b:"{-",e:"-}",c:["self"]}]};var e={cN:"pragma",b:"{-#",e:"#-}"};var b={cN:"preprocessor",b:"^#",e:"$"};var d={cN:"type",b:"\\b[A-Z][\\w']*",r:0};var c={cN:"container",b:"\\(",e:"\\)",i:'"',c:[e,g,b,{cN:"type",b:"\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?"},f.inherit(f.TM,{b:"[_a-z][\\w']*"})]};var a={cN:"container",b:"{",e:"}",c:c.c};return{aliases:["hs"],k:"let in if then else case of where do module import hiding qualified type data newtype deriving class instance as default infix infixl infixr foreign export ccall stdcall cplusplus jvm dotnet safe unsafe family forall mdo proc rec",c:[{cN:"module",b:"\\bmodule\\b",e:"where",k:"module where",c:[c,g],i:"\\W\\.|;"},{cN:"import",b:"\\bimport\\b",e:"$",k:"import|0 qualified as hiding",c:[c,g],i:"\\W\\.|;"},{cN:"class",b:"^(\\s*)?(class|instance)\\b",e:"where",k:"class family instance where",c:[d,c,g]},{cN:"typedef",b:"\\b(data|(new)?type)\\b",e:"$",k:"data family type newtype deriving",c:[e,g,d,c,a]},{cN:"default",bK:"default",e:"$",c:[d,c,g]},{cN:"infix",bK:"infix infixl infixr",e:"$",c:[f.CNM,g]},{cN:"foreign",b:"\\bforeign\\b",e:"$",k:"foreign import export ccall stdcall cplusplus jvm dotnet safe unsafe",c:[d,f.QSM,g]},{cN:"shebang",b:"#!\\/usr\\/bin\\/env runhaskell",e:"$"},e,g,b,f.QSM,f.CNM,d,f.inherit(f.TM,{b:"^[_a-z][\\w']*"}),{b:"->|<-"}]}});hljs.registerLanguage("http",function(a){return{i:"\\S",c:[{cN:"status",b:"^HTTP/[0-9\\.]+",e:"$",c:[{cN:"number",b:"\\b\\d{3}\\b"}]},{cN:"request",b:"^[A-Z]+ (.*?) HTTP/[0-9\\.]+$",rB:true,e:"$",c:[{cN:"string",b:" ",e:" ",eB:true,eE:true}]},{cN:"attribute",b:"^\\w",e:": ",eE:true,i:"\\n|\\s|=",starts:{cN:"string",e:"$"}},{b:"\\n\\n",starts:{sL:"",eW:true}}]}});hljs.registerLanguage("ini",function(a){return{cI:true,i:/\S/,c:[{cN:"comment",b:";",e:"$"},{cN:"title",b:"^\\[",e:"\\]"},{cN:"setting",b:"^[a-z0-9\\[\\]_-]+[ \\t]*=[ \\t]*",e:"$",c:[{cN:"value",eW:true,k:"on off true false yes no",c:[a.QSM,a.NM],r:0}]}]}});hljs.registerLanguage("java",function(b){var a="false synchronized int abstract float private char boolean static null if const for true while long throw strictfp finally protected import native final return void enum else break transient new catch instanceof byte super volatile case assert short package default double public try this switch continue throws";return{aliases:["jsp"],k:a,i:/<\//,c:[{cN:"javadoc",b:"/\\*\\*",e:"\\*/",c:[{cN:"javadoctag",b:"(^|\\s)@[A-Za-z]+"}],r:10},b.CLCM,b.CBCM,b.ASM,b.QSM,{bK:"protected public private",e:/[{;=]/,k:a,c:[{cN:"class",bK:"class interface",eW:true,eE:true,i:/[:"<>]/,c:[{bK:"extends implements",r:10},b.UTM]},{b:b.UIR+"\\s*\\(",rB:true,c:[b.UTM]}]},b.CNM,{cN:"annotation",b:"@[A-Za-z]+"}]}});hljs.registerLanguage("javascript",function(a){return{aliases:["js"],k:{keyword:"in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document"},c:[{cN:"pi",b:/^\s*('|")use strict('|")/,r:10},a.ASM,a.QSM,a.CLCM,a.CBCM,a.CNM,{b:"("+a.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[a.CLCM,a.CBCM,a.RM,{b:/</,e:/>;/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,eE:true,c:[a.inherit(a.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,c:[a.CLCM,a.CBCM],i:/["'\(]/}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+a.IR,r:0}]}});hljs.registerLanguage("json",function(a){var e={literal:"true false null"};var d=[a.QSM,a.CNM];var c={cN:"value",e:",",eW:true,eE:true,c:d,k:e};var b={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:true,eE:true,c:[a.BE],i:"\\n",starts:c}],i:"\\S"};var f={b:"\\[",e:"\\]",c:[a.inherit(c,{cN:null})],i:"\\S"};d.splice(d.length,0,b,f);return{c:d,k:e,i:"\\S"}});hljs.registerLanguage("lisp",function(i){var l="[a-zA-Z_\\-\\+\\*\\/\\<\\=\\>\\&\\#][a-zA-Z0-9_\\-\\+\\*\\/\\<\\=\\>\\&\\#!]*";var m="(\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s)(\\+|\\-)?\\d+)?";var k={cN:"shebang",b:"^#!",e:"$"};var b={cN:"literal",b:"\\b(t{1}|nil)\\b"};var e={cN:"number",v:[{b:m,r:0},{b:"#b[0-1]+(/[0-1]+)?"},{b:"#o[0-7]+(/[0-7]+)?"},{b:"#x[0-9a-f]+(/[0-9a-f]+)?"},{b:"#c\\("+m+" +"+m,e:"\\)"}]};var h=i.inherit(i.QSM,{i:null});var n={cN:"comment",b:";",e:"$"};var g={cN:"variable",b:"\\*",e:"\\*"};var o={cN:"keyword",b:"[:&]"+l};var d={b:"\\(",e:"\\)",c:["self",b,h,e]};var a={cN:"quoted",c:[e,h,g,o,d],v:[{b:"['`]\\(",e:"\\)"},{b:"\\(quote ",e:"\\)",k:{title:"quote"}}]};var c={cN:"quoted",b:"'"+l};var j={cN:"list",b:"\\(",e:"\\)"};var f={eW:true,r:0};j.c=[{cN:"title",b:l},f];f.c=[a,c,j,b,e,h,n,g,o];return{i:/\S/,c:[e,k,b,h,n,a,c,j]}});hljs.registerLanguage("lua",function(b){var a="\\[=*\\[";var e="\\]=*\\]";var c={b:a,e:e,c:["self"]};var d=[{cN:"comment",b:"--(?!"+a+")",e:"$"},{cN:"comment",b:"--"+a,e:e,c:[c],r:10}];return{l:b.UIR,k:{keyword:"and break do else elseif end false for if in local nil not or repeat return then true until while",built_in:"_G _VERSION assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall coroutine debug io math os package string table"},c:d.concat([{cN:"function",bK:"function",e:"\\)",c:[b.inherit(b.TM,{b:"([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"}),{cN:"params",b:"\\(",eW:true,c:d}].concat(d)},b.CNM,b.ASM,b.QSM,{cN:"string",b:a,e:e,c:[c],r:10}])}});hljs.registerLanguage("objectivec",function(a){var d={keyword:"int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign self synchronized id nonatomic super unichar IBOutlet IBAction strong weak @private @protected @public @try @property @end @throw @catch @finally @synthesize @dynamic @selector @optional @required",literal:"false true FALSE TRUE nil YES NO NULL",built_in:"NSString NSDictionary CGRect CGPoint UIButton UILabel UITextView UIWebView MKMapView UISegmentedControl NSObject UITableViewDelegate UITableViewDataSource NSThread UIActivityIndicator UITabbar UIToolBar UIBarButtonItem UIImageView NSAutoreleasePool UITableView BOOL NSInteger CGFloat NSException NSLog NSMutableString NSMutableArray NSMutableDictionary NSURL NSIndexPath CGSize UITableViewCell UIView UIViewController UINavigationBar UINavigationController UITabBarController UIPopoverController UIPopoverControllerDelegate UIImage NSNumber UISearchBar NSFetchedResultsController NSFetchedResultsChangeType UIScrollView UIScrollViewDelegate UIEdgeInsets UIColor UIFont UIApplication NSNotFound NSNotificationCenter NSNotification UILocalNotification NSBundle NSFileManager NSTimeInterval NSDate NSCalendar NSUserDefaults UIWindow NSRange NSArray NSError NSURLRequest NSURLConnection UIInterfaceOrientation MPMoviePlayerController dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"};var c=/[a-zA-Z@][a-zA-Z0-9_]*/;var b="@interface @class @protocol @implementation";return{aliases:["m","mm","objc","obj-c"],k:d,l:c,i:"</",c:[a.CLCM,a.CBCM,a.CNM,a.QSM,{cN:"string",b:"'",e:"[^\\\\]'",i:"[^\\\\][^']"},{cN:"preprocessor",b:"#import",e:"$",c:[{cN:"title",b:'"',e:'"'},{cN:"title",b:"<",e:">"}]},{cN:"preprocessor",b:"#",e:"$"},{cN:"class",b:"("+b.split(" ").join("|")+")\\b",e:"({|$)",eE:true,k:b,l:c,c:[a.UTM]},{cN:"variable",b:"\\."+a.UIR,r:0}]}});hljs.registerLanguage("perl",function(c){var d="getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qqfileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmgetsub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedirioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when";var f={cN:"subst",b:"[$@]\\{",e:"\\}",k:d};var g={b:"->{",e:"}"};var a={cN:"variable",v:[{b:/\$\d/},{b:/[\$\%\@](\^\w\b|#\w+(\:\:\w+)*|{\w+}|\w+(\:\:\w*)*)/},{b:/[\$\%\@][^\s\w{]/,r:0}]};var e={cN:"comment",b:"^(__END__|__DATA__)",e:"\\n$",r:5};var h=[c.BE,f,a];var b=[a,c.HCM,e,{cN:"comment",b:"^\\=\\w",e:"\\=cut",eW:true},g,{cN:"string",c:h,v:[{b:"q[qwxr]?\\s*\\(",e:"\\)",r:5},{b:"q[qwxr]?\\s*\\[",e:"\\]",r:5},{b:"q[qwxr]?\\s*\\{",e:"\\}",r:5},{b:"q[qwxr]?\\s*\\|",e:"\\|",r:5},{b:"q[qwxr]?\\s*\\<",e:"\\>",r:5},{b:"qw\\s+q",e:"q",r:5},{b:"'",e:"'",c:[c.BE]},{b:'"',e:'"'},{b:"`",e:"`",c:[c.BE]},{b:"{\\w+}",c:[],r:0},{b:"-?\\w+\\s*\\=\\>",c:[],r:0}]},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{b:"(\\/\\/|"+c.RSR+"|\\b(split|return|print|reverse|grep)\\b)\\s*",k:"split return print reverse grep",r:0,c:[c.HCM,e,{cN:"regexp",b:"(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",r:10},{cN:"regexp",b:"(m|qr)?/",e:"/[a-z]*",c:[c.BE],r:0}]},{cN:"sub",bK:"sub",e:"(\\s*\\(.*?\\))?[;{]",r:5},{cN:"operator",b:"-\\w\\b",r:0}];f.c=b;g.c=b;return{aliases:["pl"],k:d,c:b}});hljs.registerLanguage("php",function(b){var e={cN:"variable",b:"\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*"};var a={cN:"preprocessor",b:/<\?(php)?|\?>/};var c={cN:"string",c:[b.BE,a],v:[{b:'b"',e:'"'},{b:"b'",e:"'"},b.inherit(b.ASM,{i:null}),b.inherit(b.QSM,{i:null})]};var d={v:[b.BNM,b.CNM]};return{aliases:["php3","php4","php5","php6"],cI:true,k:"and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",c:[b.CLCM,b.HCM,{cN:"comment",b:"/\\*",e:"\\*/",c:[{cN:"phpdoc",b:"\\s@[A-Za-z]+"},a]},{cN:"comment",b:"__halt_compiler.+?;",eW:true,k:"__halt_compiler",l:b.UIR},{cN:"string",b:"<<<['\"]?\\w+['\"]?$",e:"^\\w+;",c:[b.BE]},a,e,{cN:"function",bK:"function",e:/[;{]/,eE:true,i:"\\$|\\[|%",c:[b.UTM,{cN:"params",b:"\\(",e:"\\)",c:["self",e,b.CBCM,c,d]}]},{cN:"class",bK:"class interface",e:"{",eE:true,i:/[:\(\$"]/,c:[{bK:"extends implements",r:10},b.UTM]},{bK:"namespace",e:";",i:/[\.']/,c:[b.UTM]},{bK:"use",e:";",c:[b.UTM]},{b:"=>"},c,d]}});hljs.registerLanguage("python",function(a){var f={cN:"prompt",b:/^(>>>|\.\.\.) /};var b={cN:"string",c:[a.BE],v:[{b:/(u|b)?r?'''/,e:/'''/,c:[f],r:10},{b:/(u|b)?r?"""/,e:/"""/,c:[f],r:10},{b:/(u|r|ur)'/,e:/'/,r:10},{b:/(u|r|ur)"/,e:/"/,r:10},{b:/(b|br)'/,e:/'/},{b:/(b|br)"/,e:/"/},a.ASM,a.QSM]};var d={cN:"number",r:0,v:[{b:a.BNR+"[lLjJ]?"},{b:"\\b(0o[0-7]+)[lLjJ]?"},{b:a.CNR+"[lLjJ]?"}]};var e={cN:"params",b:/\(/,e:/\)/,c:["self",f,d,b]};var c={e:/:/,i:/[${=;\n]/,c:[a.UTM,e]};return{aliases:["py","gyp"],k:{keyword:"and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda nonlocal|10 None True False",built_in:"Ellipsis NotImplemented"},i:/(<\/|->|\?)/,c:[f,d,b,a.HCM,a.inherit(c,{cN:"function",bK:"def",r:10}),a.inherit(c,{cN:"class",bK:"class"}),{cN:"decorator",b:/@/,e:/$/},{b:/\b(print|exec)\(/}]}});hljs.registerLanguage("ruby",function(f){var j="[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?";var i="and false then defined module in return redo if BEGIN retry end for true self when next until do begin unless END rescue nil else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor";var b={cN:"yardoctag",b:"@[A-Za-z]+"};var c={cN:"value",b:"#<",e:">"};var k={cN:"comment",v:[{b:"#",e:"$",c:[b]},{b:"^\\=begin",e:"^\\=end",c:[b],r:10},{b:"^__END__",e:"\\n$"}]};var d={cN:"subst",b:"#\\{",e:"}",k:i};var e={cN:"string",c:[f.BE,d],v:[{b:/'/,e:/'/},{b:/"/,e:/"/},{b:"%[qw]?\\(",e:"\\)"},{b:"%[qw]?\\[",e:"\\]"},{b:"%[qw]?{",e:"}"},{b:"%[qw]?<",e:">"},{b:"%[qw]?/",e:"/"},{b:"%[qw]?%",e:"%"},{b:"%[qw]?-",e:"-"},{b:"%[qw]?\\|",e:"\\|"},{b:/\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/}]};var a={cN:"params",b:"\\(",e:"\\)",k:i};var h=[e,c,k,{cN:"class",bK:"class module",e:"$|;",i:/=/,c:[f.inherit(f.TM,{b:"[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?"}),{cN:"inheritance",b:"<\\s*",c:[{cN:"parent",b:"("+f.IR+"::)?"+f.IR}]},k]},{cN:"function",bK:"def",e:" |$|;",r:0,c:[f.inherit(f.TM,{b:j}),a,k]},{cN:"constant",b:"(::)?(\\b[A-Z]\\w*(::)?)+",r:0},{cN:"symbol",b:":",c:[e,{b:j}],r:0},{cN:"symbol",b:f.UIR+"(\\!|\\?)?:",r:0},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{cN:"variable",b:"(\\$\\W)|((\\$|\\@\\@?)(\\w+))"},{b:"("+f.RSR+")\\s*",c:[c,k,{cN:"regexp",c:[f.BE,d],i:/\n/,v:[{b:"/",e:"/[a-z]*"},{b:"%r{",e:"}[a-z]*"},{b:"%r\\(",e:"\\)[a-z]*"},{b:"%r!",e:"![a-z]*"},{b:"%r\\[",e:"\\][a-z]*"}]}],r:0}];d.c=h;a.c=h;var g=[{r:1,cN:"output",b:"^\\s*=> ",e:"$",rB:true,c:[{cN:"status",b:"^\\s*=>"},{b:" ",e:"$",c:h}]},{r:1,cN:"input",b:"^[^ ][^=>]*>+ ",e:"$",rB:true,c:[{cN:"prompt",b:"^[^ ][^=>]*>+"},{b:" ",e:"$",c:h}]}];return{aliases:["rb","gemspec","podspec","thor","irb"],k:i,c:g.concat(h)}});hljs.registerLanguage("sql",function(a){var b={cN:"comment",b:"--",e:"$"};return{cI:true,i:/[<>]/,c:[{cN:"operator",bK:"begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate savepoint release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup",e:/;/,eW:true,k:{keyword:"abs absolute acos action add adddate addtime aes_decrypt aes_encrypt after aggregate all allocate alter analyze and any are as asc ascii asin assertion at atan atan2 atn2 authorization authors avg backup before begin benchmark between bin binlog bit_and bit_count bit_length bit_or bit_xor both by cache call cascade cascaded case cast catalog ceil ceiling chain change changed char_length character_length charindex charset check checksum checksum_agg choose close coalesce coercibility collate collation collationproperty column columns columns_updated commit compress concat concat_ws concurrent connect connection connection_id consistent constraint constraints continue contributors conv convert convert_tz corresponding cos cot count count_big crc32 create cross cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime data database databases datalength date_add date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts datetimeoffsetfromparts day dayname dayofmonth dayofweek dayofyear deallocate declare decode default deferrable deferred degrees delayed delete des_decrypt des_encrypt des_key_file desc describe descriptor diagnostics difference disconnect distinct distinctrow div do domain double drop dumpfile each else elt enclosed encode encrypt end end-exec engine engines eomonth errors escape escaped event eventdata events except exception exec execute exists exp explain export_set extended external extract fast fetch field fields find_in_set first first_value floor flush for force foreign format found found_rows from from_base64 from_days from_unixtime full function get get_format get_lock getdate getutcdate global go goto grant grants greatest group group_concat grouping grouping_id gtid_subset gtid_subtract handler having help hex high_priority hosts hour ident_current ident_incr ident_seed identified identity if ifnull ignore iif ilike immediate in index indicator inet6_aton inet6_ntoa inet_aton inet_ntoa infile initially inner innodb input insert install instr intersect into is is_free_lock is_ipv4 is_ipv4_compat is_ipv4_mapped is_not is_not_null is_used_lock isdate isnull isolation join key kill language last last_day last_insert_id last_value lcase lead leading least leaves left len lenght level like limit lines ln load load_file local localtime localtimestamp locate lock log log10 log2 logfile logs low_priority lower lpad ltrim make_set makedate maketime master master_pos_wait match matched max md5 medium merge microsecond mid min minute mod mode module month monthname mutex name_const names national natural nchar next no no_write_to_binlog not now nullif nvarchar oct octet_length of old_password on only open optimize option optionally or ord order outer outfile output pad parse partial partition password patindex percent_rank percentile_cont percentile_disc period_add period_diff pi plugin position pow power pragma precision prepare preserve primary prior privileges procedure procedure_analyze processlist profile profiles public publishingservername purge quarter query quick quote quotename radians rand read references regexp relative relaylog release release_lock rename repair repeat replace replicate reset restore restrict return returns reverse revoke right rlike rollback rollup round row row_count rows rpad rtrim savepoint schema scroll sec_to_time second section select serializable server session session_user set sha sha1 sha2 share show sign sin size slave sleep smalldatetimefromparts snapshot some soname soundex sounds_like space sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sql_variant_property sqlstate sqrt square start starting status std stddev stddev_pop stddev_samp stdev stdevp stop str str_to_date straight_join strcmp string stuff subdate substr substring subtime subtring_index sum switchoffset sysdate sysdatetime sysdatetimeoffset system_user sysutcdatetime table tables tablespace tan temporary terminated tertiary_weights then time time_format time_to_sec timediff timefromparts timestamp timestampadd timestampdiff timezone_hour timezone_minute to to_base64 to_days to_seconds todatetimeoffset trailing transaction translation trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse ucase uncompress uncompressed_length unhex unicode uninstall union unique unix_timestamp unknown unlock update upgrade upped upper usage use user user_resources using utc_date utc_time utc_timestamp uuid uuid_short validate_password_strength value values var var_pop var_samp variables variance varp version view warnings week weekday weekofyear weight_string when whenever where with work write xml xor year yearweek zon",literal:"true false null",built_in:"array bigint binary bit blob boolean char character date dec decimal float int integer interval number numeric real serial smallint varchar varying int8 serial8 text"},c:[{cN:"string",b:"'",e:"'",c:[a.BE,{b:"''"}]},{cN:"string",b:'"',e:'"',c:[a.BE,{b:'""'}]},{cN:"string",b:"`",e:"`",c:[a.BE]},a.CNM,a.CBCM,b]},a.CBCM,b]}});hljs.registerLanguage("tex",function(a){var d={cN:"command",b:"\\\\[a-zA-Zа-яА-я]+[\\*]?"};var c={cN:"command",b:"\\\\[^a-zA-Zа-яА-я0-9]"};var b={cN:"special",b:"[{}\\[\\]\\&#~]",r:0};return{c:[{b:"\\\\[a-zA-Zа-яА-я]+[\\*]? *= *-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?",rB:true,c:[d,c,{cN:"number",b:" *=",e:"-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?",eB:true}],r:10},d,c,b,{cN:"formula",b:"\\$\\$",e:"\\$\\$",c:[d,c,b],r:0},{cN:"formula",b:"\\$",e:"\\$",c:[d,c,b],r:0},{cN:"comment",b:"%",e:"$",r:0}]}});hljs.registerLanguage("vbnet",function(a){return{aliases:["vb"],cI:true,k:{keyword:"addhandler addressof alias and andalso aggregate ansi as assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into is isfalse isnot istrue join key let lib like loop me mid mod module mustinherit mustoverride mybase myclass namespace narrowing new next not notinheritable notoverridable of off on operator option optional or order orelse overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim rem removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly xor",built_in:"boolean byte cbool cbyte cchar cdate cdec cdbl char cint clng cobj csbyte cshort csng cstr ctype date decimal directcast double gettype getxmlnamespace iif integer long object sbyte short single string trycast typeof uinteger ulong ushort",literal:"true false nothing"},i:"//|{|}|endif|gosub|variant|wend",c:[a.inherit(a.QSM,{c:[{b:'""'}]}),{cN:"comment",b:"'",e:"$",rB:true,c:[{cN:"xmlDocTag",b:"'''|<!--|-->"},{cN:"xmlDocTag",b:"</?",e:">"}]},a.CNM,{cN:"preprocessor",b:"#",e:"$",k:"if else elseif end region externalsource"}]}});hljs.registerLanguage("vbscript",function(a){return{aliases:["vbs"],cI:true,k:{keyword:"call class const dim do loop erase execute executeglobal exit for each next function if then else on error option explicit new private property let get public randomize redim rem select case set stop sub while wend with end to elseif is or xor and not class_initialize class_terminate default preserve in me byval byref step resume goto",built_in:"lcase month vartype instrrev ubound setlocale getobject rgb getref string weekdayname rnd dateadd monthname now day minute isarray cbool round formatcurrency conversions csng timevalue second year space abs clng timeserial fixs len asc isempty maths dateserial atn timer isobject filter weekday datevalue ccur isdate instr datediff formatdatetime replace isnull right sgn array snumeric log cdbl hex chr lbound msgbox ucase getlocale cos cdate cbyte rtrim join hour oct typename trim strcomp int createobject loadpicture tan formatnumber mid scriptenginebuildversion scriptengine split scriptengineminorversion cint sin datepart ltrim sqr scriptenginemajorversion time derived eval date formatpercent exp inputbox left ascw chrw regexp server response request cstr err",literal:"true false null nothing empty"},i:"//",c:[a.inherit(a.QSM,{c:[{b:'""'}]}),{cN:"comment",b:/'/,e:/$/,r:0},a.CNM]}});hljs.registerLanguage("xml",function(a){var c="[A-Za-z0-9\\._:-]+";var d={b:/<\?(php)?(?!\w)/,e:/\?>/,sL:"php",subLanguageMode:"continuous"};var b={eW:true,i:/</,r:0,c:[d,{cN:"attribute",b:c,r:0},{b:"=",r:0,c:[{cN:"value",v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s\/>]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xsl","plist"],cI:true,c:[{cN:"doctype",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},{cN:"comment",b:"<!--",e:"-->",r:10},{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{title:"style"},c:[b],starts:{e:"</style>",rE:true,sL:"css"}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{title:"script"},c:[b],starts:{e:"<\/script>",rE:true,sL:"javascript"}},{b:"<%",e:"%>",sL:"vbscript"},d,{cN:"pi",b:/<\?\w+/,e:/\?>/,r:10},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"title",b:"[^ /><]+",r:0},b]}]}});
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
var fieldSize = 32, ECcrypt = ellipticjs.ec("secp256k1");

var cryptCore = (function(){
	"use strict";

	var keyPair = null, keyPairBroadcast = null, cryptCore = {};

	var getSharedSecret = function (privateKey, publicKey) {
		var sharedSecret = padBytes(privateKey.derive(ECcrypt.keyPair(publicKey).getPublic()).toArray());
		return sjcl.codec.bytes.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(sharedSecret)));
	};

	cryptCore.login = function login(password, salt, fromCfg, key) {
	    var privateKey = null, encKey = null;

	    if(key){
	    	privateKey = bs58.dec(key);
	    }else if(fromCfg){
		    if (ssGet(boardHostName + profileStoreName)) {
		        privateKey = bs58.dec(ssGet(boardHostName + profileStoreName).privateKeyPair);
		    }else{
		    	return false;
		    }
	    }else if(password && salt){
	    	privateKey = sjcl.codec.bytes.fromBits(sjcl.misc.pbkdf2(password, salt, 500017, 256));
	    }else{
	    	privateKey = ECcrypt.genKeyPair().getPrivate().toArray();
	    }

	    encKey = ECcrypt.keyPair(privateKey);

	    try{
	        if(!encKey.validate().result){
	            throw "invalid";
	        }
	    } catch (e) {
	        alert('Bad key generated! Try another salt and/or password.');
	        return false;
	    }

	    var pubEncKey = encKey.getPublic(true, "hex"),
	        publicKeyPair = hexToBytes(pubEncKey),
	        publicKeyPairPrintable = bs58.enc(publicKeyPair),
	        publicKeyPairPrintableHash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(publicKeyPair)));

	    keyPair = {
	    	"privateEnc": encKey,
	        "privateKeyPair": bs58.enc(privateKey),
	        "publicEnc": hexToBytes(pubEncKey),
	        "publicKeyPair": publicKeyPair,
	        "publicKeyPairPrintable": publicKeyPairPrintable,
	        "publicKeyPairPrintableHash": publicKeyPairPrintableHash
	    };

	    ssSet(boardHostName + profileStoreName, {"privateKeyPair": bs58.enc(privateKey)});

	    return {
	        "publicEnc": hexToBytes(pubEncKey),
	        "publicKeyPair": publicKeyPair,
	        "publicKeyPairPrintable": publicKeyPairPrintable,
	        "publicKeyPairPrintableHash": publicKeyPairPrintableHash
	    };
	};

	cryptCore.loginBroadcast = function login(password, salt, key) {
	    var privateKey = null, encKey = null;

	    if(key){
		    if (ssGet(boardHostName + profileStoreName + '2')) {
		        privateKey = bs58.dec(ssGet(boardHostName + profileStoreName + '2').privateKeyPair);
		    }else{
		    	privateKey = bs58.dec('5n24WDyUV5b41fkk8eoocKxZuWTHxpYqDekMwo4MvDv1'); // pass: desu   salt: desu
		    }
	    }else{
	    	privateKey = sjcl.codec.bytes.fromBits(sjcl.misc.pbkdf2(password, salt, 500017, 256));
	    }

	    encKey = ECcrypt.keyPair(privateKey);

	    try{
	        if(!encKey.validate().result){
	            throw "invalid";
	        }
	    } catch (e) {
	        alert('Bad key generated! Try another salt and/or password.');
	        return false;
	    }

	    var pubEncKey = encKey.getPublic(true, "hex"),
	        publicKeyPair = hexToBytes(pubEncKey),
	        publicKeyPairPrintable = bs58.enc(publicKeyPair),
	        publicKeyPairPrintableHash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(publicKeyPair)));

	    keyPairBroadcast = {
	    	"privateEnc": encKey,
	        "privateKeyPair": bs58.enc(privateKey),
	        "publicEnc": hexToBytes(pubEncKey),
	        "publicKeyPair": publicKeyPair,
	        "publicKeyPairPrintable": publicKeyPairPrintable,
	        "publicKeyPairPrintableHash": publicKeyPairPrintableHash
	    };

	    ssSet(boardHostName + profileStoreName + '2', {"privateKeyPair": bs58.enc(privateKey)});

	    return {
	        "publicEnc": hexToBytes(pubEncKey),
	        "publicKeyPair": publicKeyPair,
	        "publicKeyPairPrintable": publicKeyPairPrintable,
	        "publicKeyPairPrintableHash": publicKeyPairPrintableHash
	    };
	};

	cryptCore.encodeMessage = function encodeMessage(msg, contacts, hideSender, hideRecievers) {
	    var msgRaw = strToUTF8Arr(msg),
	        msgCompressed = pako.deflateRaw(msgRaw),
	        codedAt = Math.floor((new Date()).getTime() / 15000) * 15,
	        msgLength = 16 + msgCompressed.byteLength + 8,
	        numContacts = Object.keys(contacts).length, i,
	        ephemeral = ECcrypt.genKeyPair(),
	        sessionKey = sjcl.codec.bytes.fromBits(sjcl.random.randomWords(8, 0)), sessionKeyBits, rp,
	        iv = sjcl.random.randomWords(4, 0),
	        slots = [],
	        msgHash = new sjcl.hash.sha256(),
	        ephemeral_byte = hexToBytes(ephemeral.getPublic(true, "hex"));

	    if(hideSender && numContacts < 3) hideRecievers = true;

	    ephemeral_byte[0] ^= (Math.random() * 0x100 | 0) & 0xfe;

	    sessionKey[31] = 0xAA;
	    sessionKeyBits = sjcl.codec.bytes.toBits(sessionKey);

	    var secret;

	    for (i in contacts) {
	        secret = getSharedSecret(ephemeral, contacts[i].publicEnc);
	        slots.push(xorBytes(secret, sessionKey));
	    }

	    slots = shuffleArray(slots);

	    msgHash.update(sjcl.codec.bytes.toBits(ephemeral_byte));
	    msgHash.update(iv);

	    for (i = 0; i < slots.length; i++) {
	        msgHash.update(sjcl.codec.bytes.toBits(slots[i]));
	    }

	    if(!hideSender){
	        msgLength += 80; // Length of signature here!
	    }

	    if(!hideRecievers){
	        msgLength += 32 + 33 * numContacts;
	    }else if(!hideSender){
	        msgLength += 33; // add sender address
	    }

	    var containerAB = new ArrayBuffer(msgLength - 8),
	        container = new Uint8Array(containerAB), container2sig = container,
	        contPos = 0;

	    if(!hideSender){
	        container2sig = new Uint8Array(containerAB, 0, msgLength - 88);
	    }

	    var addByte = function(byte){
	        container[contPos++] = byte;
	    };

	    var addBytes = function(bytes){
	        for (var i = 0; i < bytes.length; i++) {
	            addByte(bytes[i]);
	        }
	    };

	    addBytes([ 68, 69, 83, 85, // DESU!
	        1, // container version;
	        (hideSender ? 1 : 0) + (hideRecievers ? 2 : 0),  //flags
	        0, // reserved

	        codedAt & 255, //coding unix_timestamp
	        (codedAt >> 8) & 255,
	        (codedAt >> 16) & 255,
	        (codedAt >> 24) & 255,

	        msgLength & 255, //container length
	        (msgLength >> 8) & 255,
	        (msgLength >> 16) & 255,

	        numContacts & 255, //contacts number
	        (numContacts >> 8) & 255
	    ]);

	    var msgContacts = [];

	    if(!hideRecievers){
	        addBytes(padBytes(ephemeral.getPrivate().toArray()));

	        for (i in contacts) {
	            if(contacts[i].publicKeyPairPrintable != keyPair.publicKeyPairPrintable)
	                msgContacts.push(contacts[i].publicKeyPair);
	        }
	        msgContacts = shuffleArray(msgContacts);
	    }

	    if(!hideSender){
	        msgContacts.unshift(keyPair.publicKeyPair);
	    }else{
	        msgContacts.push(keyPair.publicKeyPair);
	        msgContacts = shuffleArray(msgContacts);
	    }

	    if(!hideSender || !hideRecievers){
	        for (i = 0; i < msgContacts.length; i++) {
	            addBytes(msgContacts[i]);
	        }
	    }

	    addBytes(msgCompressed);

	    if(!hideSender){
	        var sig = keyPair.privateEnc.sign(sjcl.codec.bytes.fromBits(msgHash.update(sjcl.codec.bytes.toBits(container2sig)).finalize())).toDER();

	        if(sig.length > 80){
	            throw 'SIGNATURE TO LOONG!!!';
	        }

	        if(sig.length < 80){
	            var add = 80 - sig.length;
	            for (i = 0; i < add; i++) {
	                sig.push( (Math.random() * 0xFF) & 0xFF);
	            }
	        }

	        addBytes(sig);
	    }

	    var aes_cypher = new sjcl.cipher.aes(sessionKeyBits),
	        crypted_msg = sjcl.codec.bytes.fromBits(sjcl.mode.ccm.encrypt(aes_cypher, sjcl.codec.bytes.toBits(container), iv, [], 64)),
	        clearContainer = container,
	        cryptedLength = 33 + 16 + 32 * numContacts + crypted_msg.length,
	        crytpoAB = new ArrayBuffer(cryptedLength);
	    container = new Uint8Array(crytpoAB);

	    contPos = 0;

	    addBytes(ephemeral_byte);
	    addBytes(sjcl.codec.bytes.fromBits(iv));

	    addBytes(crypted_msg.slice(0,32));

	    for (i = 0; i < slots.length; i++) {
	        addBytes(slots[i]);
	    }

	    addBytes(crypted_msg.slice(32));

	    return container;
	};

	cryptCore.decodeMessage = function decodeMessage(msg, forBroadcast) {
	    var ephemAB   = new Uint8Array(msg, 0, 33),
	        iv        = new Uint8Array(msg, 33, 16),
	        contHead  = new Uint8Array(msg, 49, 32),
	        secrets   = new Uint8Array(msg, 81),
	        msgHash   = new sjcl.hash.sha256(),
	        shift = 0, secret, sessionKey = [], ephemeral = [], i, j, aesDecryptor, message = {};

	        msgHash.update(sjcl.codec.bytes.toBits(ephemAB));
	        msgHash.update(sjcl.codec.bytes.toBits(iv));

	        for (i = 0; i < 33; i++) {
	            ephemeral.push(ephemAB[i]);
	        }

	        ephemeral[0] &= 1;
	        ephemeral[0] |= 2;

	        var firstByte = 0xAA;

	        try {
	            secret = getSharedSecret(forBroadcast ? keyPairBroadcast.privateEnc : keyPair.privateEnc, ephemeral);
	            message.ephemeralPub = ephemeral;
	            firstByte ^= secret[31];
	        } catch (exception) {
	            return undefined;
	        }

	        while(shift < secrets.byteLength){

	            if(firstByte != secrets[shift + 31]){
	                shift += 32;
	                continue;
	            }

	            for (i = 0; i < 32; i++) {
	                sessionKey[i] = secrets[i + shift] ^ secret[i];
	            }

	            var aes_decypher = new sjcl.cipher.aes(sjcl.codec.bytes.toBits(sessionKey));
	            var test_head = sjcl.mode.ccm_head.decrypt(aes_decypher, sjcl.codec.bytes.toBits(contHead), sjcl.codec.bytes.toBits(iv), [], 64);
	            var res = sjcl.codec.bytes.fromBits(test_head);

	            // [ 68, 69, 83, 85 ]
	            if(res[0] == 68  && res[1] == 69  && res[2] == 83  && res[3] == 85 && res[4] == 1){
	                message.sessionKey = sessionKey;
	                message.senderHidden = !!(res[5] & 1);
	                message.contactsHidden = !!(res[5] & 2);
	                message.containerVersion = res[4];
	                message.timestamp = res[7] + res[8] * 256 + res[9] * 65536 + res[10] * 16777216;
	                message.msgLength = res[11] + res[12] * 256 + res[13] * 65536;
	                message.contactsNum = res[14] + res[15] * 256;
	                message.msgContacts = [];

	                var crypted_msg = appendBuffer(contHead, new Uint8Array(msg, 81 + 32 * message.contactsNum, message.msgLength - 32));

	                aes_decypher = new sjcl.cipher.aes(sjcl.codec.bytes.toBits(sessionKey));
	                try{
	                	res = sjcl.mode.ccm.decrypt(aes_decypher, sjcl.codec.bytes.toBits(crypted_msg), sjcl.codec.bytes.toBits(iv), [], 64);
	                } catch(e){
	                	return undefined;
	                }

	                msgHash.update(sjcl.codec.bytes.toBits(new Uint8Array(msg, 81, 32 * message.contactsNum)));

	                res = sjcl.codec.bytes.fromBits(res);

	                if(message.senderHidden){
	                    message.text = utf8ArrToStr(pako.inflateRaw(res.slice(16 + (message.contactsHidden?0:(32 + 33*message.contactsNum)))));  //
	                    msgHash.update(sjcl.codec.bytes.toBits(res));
	                }else{
	                    message.text = utf8ArrToStr(pako.inflateRaw(res.slice(16 + (message.contactsHidden?33:(32 + 33*message.contactsNum)), -80)));
	                    msgHash.update(sjcl.codec.bytes.toBits(res.slice(0, -80)));
	                }

	                message.msgHash = sjcl.codec.bytes.fromBits(msgHash.finalize());

	                var pubEncKey, pubSigKey, tmpSecret;

	                if(!message.contactsHidden){
	                    var otherSecrets = [];

	                    message.ephemeralPriv = ECcrypt.keyPair(res.slice(16, 48));

	                    for (i = 0; i < message.contactsNum; i++) {
	                        otherSecrets[i] = [];
	                        for (j = 0; j < 32; j++) {
	                            otherSecrets[i][j] = secrets[j + i*32] ^ message.sessionKey[j];
	                        }
	                         otherSecrets[i] = arrayBufferDataUri(otherSecrets[i]);
	                    }

	                    for (i = 0; i < message.contactsNum; i++) {
	                        pubEncKey = res.slice(     48 + i*33, 33 + 48 + i*33);
	                        tmpSecret = arrayBufferDataUri(getSharedSecret(message.ephemeralPriv, pubEncKey));

	                        if(otherSecrets.indexOf(tmpSecret) == -1){
	                            return undefined;
	                        }

	                        message.msgContacts.push(bs58.enc(res.slice(     48 + i*33, 33 + 48 + i*33)));
	                    }
	                }

	                if(!message.senderHidden){
	                    pubSigKey = ECcrypt.keyPair(res.slice(16 + (message.contactsHidden?0:32), 33 + 16 + (message.contactsHidden?0:32)));
	                    message.sender = bs58.enc(res.slice(16 + (message.contactsHidden?0:32), 33 + 16 + (message.contactsHidden?0:32)));

	                    if(!pubSigKey.verify(message.msgHash, res.slice(-80))){
	                        return undefined;
	                    }
	                    message.signatureOk = true;
	                }

	                message.msgHash = bytesToHex(message.msgHash);

	                return message;
	            }

	            shift += 32;
	        }

	        return null;
	};

	cryptCore.savePKey = function savePKey(){
		if(!keyPair || !keyPair.publicKeyPairPrintable || !keyPair.privateKeyPair){
			alert('Nothing to export. Log In first.');
			return false;
		}

		var blob =
		saveAs(new Blob([keyPair.privateKeyPair], {type: "text/plain;charset=utf-8"}), keyPair.publicKeyPairPrintable+".privateKey", true);
	};

	return cryptCore;
})();

var isGM = typeof GM_setValue === 'function';

var ssGet = function(name, inLocal)    {
	"use strict";

	if(!inLocal) inLocal = false;

	if(isGM && !inLocal){
		/*jshint newcap: false */
		if(GM_getValue(name) === undefined) return null;
		return JSON.parse(GM_getValue(name));
	}

	return JSON.parse(localStorage.getItem(name));
};

var ssSet = function(name, val, inLocal)    {
	"use strict";

	if(!inLocal) inLocal = false;

	if(isGM && !inLocal){
		/*jshint newcap: false  */
		return GM_setValue(name, JSON.stringify(val));
	}

	return localStorage.setItem(name, JSON.stringify(val));
};

function repeat(pattern, count) {
    "use strict";
    if (count < 1) return '';
    var result = '';
    while (count > 0) {
        if (count & 1) result += pattern;
        count >>= 1;
        pattern += pattern;
    }
    return result;
}

// Convert a byte array to a hex string
var bytesToHex = function (bytes) {
    "use strict";
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
};

// Convert a hex string to a byte array
var hexToBytes = function (hex, length) {
    "use strict";

    var str = hex.length % 2 ? "0" + hex : hex;

    if(length){
        str = (repeat("00", length) + str);
        str = str.substr(str.length - length * 2);
    }

    for (var bytes = [], c = 0; c < str.length; c += 2)
        bytes.push(parseInt(str.substr(c, 2), 16));
    return bytes;
};

var dateToStr = function(date, onlyNums) {
    "use strict";

    var z = function(i) {
        if (parseInt(i) < 10) return "0" + i;
        return i;
    };

    if(onlyNums){
        return '' + date.getFullYear() + z(date.getMonth() + 1) + z(date.getDate())+ '_' + z(date.getHours()) + z(date.getMinutes());
    }
    return '' + date.getFullYear() + '-' + z(date.getMonth() + 1) + '-' + z(date.getDate()) + ' ' + z(date.getHours()) + ':' + z(date.getMinutes());
};

var b64tohex = function(b64) {
    "use strict";

    var s = atob(b64),
        ret = '';
    for (var i = 0; i < s.length; i++) {
        var c = s.charCodeAt(i).toString(16);
        if (c.length != 2) c = '0' + c;
        ret += c;
    }
    return ret;
};

var hex2b64 = function(hex) {
    "use strict";

    var ret = '';
    for (var i = 0; i < hex.length; i += 2) {
        ret += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return btoa(ret);
};

var strToDataUri = function(str){
    "use strict";
    return arrayBufferDataUri(stringToByteArray(str));
};

var stringToByteArray = function(str) {
    "use strict";

    var array = makeUin8(str.length), i, il;

    for (i = 0, il = str.length; i < il; ++i) {
        array[i] = str.charCodeAt(i) & 0xff;
    }

    return array;
};

var arrayBufferDataUri = function(raw) {
    "use strict";

    var base64 = '',
        encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        bytes = new Uint8Array(raw),
        byteLength = bytes.byteLength,
        byteRemainder = byteLength % 3,
        mainLength = byteLength - byteRemainder,
        a, b, c, d,
        chunk;

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63; // 63       = 2^6 - 1
        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1
        base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
};

var dataURLtoUint8Array = function(dataURL, dataType) {
    "use strict";

    // Decode the dataURL
    var binary = atob(dataURL.split(',')[1]);
    // Create 8-bit unsigned array
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    // Return our Blob object
    return new Uint8Array(array);
};

var uint8toBlob = function(data, dataType) {
    "use strict";

    return new Blob([data], {
        type: dataType
    });
};


var appendBuffer = function(buffer1, buffer2) {
    "use strict";

    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(buffer1, 0);
    tmp.set(buffer2, buffer1.byteLength);
    return tmp;
};

var ab2Str = function(buffer) {
    "use strict";

    var length = buffer.length;
    var result = '';
    for (var i = 0; i < length; i += 65535) {
        var addition = 65535;
        if (i + 65535 > length) {
            addition = length - i;
        }
        result += String.fromCharCode.apply(null, buffer.subarray(i, i + addition));
    }

    return result;
};

var getHost = function(url){
    "use strict";
    var a = document.createElement('a');
    a.href = url;
    return {href: a.href, host: a.host, crossdomain: location.host.toLowerCase() != a.host.toLowerCase()};
};


var getURLasAB = function(rawURL, cb) {
    "use strict";

    if (rawURL.match(/^blob\:/i) || rawURL.match(/^data\:/i)) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', rawURL, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(oEvent) {cb(xhr.response, new Date(oEvent.target.getResponseHeader('Last-Modified')));};
        xhr.onerror = function(oEvent) {cb(null, new Date());};
        xhr.send();
        return true;
    }

    var url = getHost(rawURL);

    if(["2ch.hk", "2ch.pm", "2ch.re", "2ch.tf", "2ch.wf", "2ch.yt", "2-ch.so"].indexOf(url.host.toLowerCase()) != -1){
        url.href += "?t=" + Math.floor(Math.random()*1000000);
    }

    /*jshint newcap: false  */
    if (typeof GM_xmlhttpRequest === "function") {
        if(navigator.userAgent.match(/Chrome\/([\d.]+)/)){
            GM_xmlhttpRequest({
                method: "GET",
                url: url.href,
                responseType: "arraybuffer",
                onload: function(oEvent) {
                    cb(oEvent.response, new Date(0));
                },
                onerror: function(oEvent) {
                    cb(null, new Date());
                }
            });
        }else{
            GM_xmlhttpRequest({
                method: "GET",
                url: url.href,
                overrideMimeType: "text/plain; charset=x-user-defined",
                onload: function(oEvent) {
                    var ff_buffer = stringToByteArray(oEvent.responseText || oEvent.response);
                    cb(ff_buffer.buffer, new Date());
                },
                onerror: function(oEvent) {
                    cb(null, new Date());
                }
            });
        }
    }else{
        var oReq = new XMLHttpRequest();

        oReq.open("GET", url.href, true);
        oReq.responseType = "arraybuffer";
        oReq.onload = function(oEvent) {
            cb(oReq.response, new Date(oEvent.target.getResponseHeader('Last-Modified')));
        };
        oReq.onerror = function(oEvent) {
            cb(null, new Date());
        };
        oReq.send(null);
    }
};

var padBytes = function (array, length) {
    "use strict";

    if (length === undefined) {
        length = fieldSize;
    }

    for (var i = 0; array.length < length; ++i) {
        array.unshift(0);
    }

    return array;
};

var shuffleArray = function (array) {
    "use strict";

    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
};

var xorBytes = function (a, b) {
    "use strict";

    if (a.length != b.length) {
        throw new Error("Длины не сходятся");
    }

    for (var i in a) {
        a[i] ^= b[i];
    }

    return a;
};

// Thanks, Y0ba!
// Read more: https://github.com/greasemonkey/greasemonkey/issues/2034#issuecomment-70285613
function getUint8Array(data, i, len) {
    "use strict";
    var rv;
    if(typeof i === 'undefined') {
        rv = new Uint8Array(data);
        return rv instanceof Uint8Array ? rv : new unsafeWindow.Uint8Array(data);
    }
    rv = new Uint8Array(data, i, len);
    return rv instanceof Uint8Array ? rv : new unsafeWindow.Uint8Array(data, i, len);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding#Appendix.3A_Decode_a_Base64_string_to_Uint8Array_or_ArrayBuffer
/* UTF-8 array to DOMString and vice versa */

var utf8ArrToStr = function(aBytes) {
	"use strict";

	var sView = "";

	for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
		nPart = aBytes[nIdx];
		sView += String.fromCharCode(
			nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
			/* (nPart - 252 << 32) is not possible in ECMAScript! So...: */
			(nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
			: nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
			(nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
			: nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
			(nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
			: nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
			(nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
			: nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
			(nPart - 192 << 6) + aBytes[++nIdx] - 128
			: /* nPart < 127 ? */ /* one byte */
			nPart
			);
	}

	return sView;

};

var strToUTF8Arr = function(sDOMStr) {
	"use strict";
	var aBytes, nChr, nStrLen = sDOMStr.length, nArrLen = 0;

	/* mapping... */

	for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
		nChr = sDOMStr.charCodeAt(nMapIdx);
		nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
	}

	aBytes = new Uint8Array(nArrLen);

	/* transcription... */

	for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
		nChr = sDOMStr.charCodeAt(nChrIdx);
		if (nChr < 128) {
			/* one byte */
			aBytes[nIdx++] = nChr;
		} else if (nChr < 0x800) {
			/* two bytes */
			aBytes[nIdx++] = 192 + (nChr >>> 6);
			aBytes[nIdx++] = 128 + (nChr & 63);
		} else if (nChr < 0x10000) {
			/* three bytes */
			aBytes[nIdx++] = 224 + (nChr >>> 12);
			aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
			aBytes[nIdx++] = 128 + (nChr & 63);
		} else if (nChr < 0x200000) {
			/* four bytes */
			aBytes[nIdx++] = 240 + (nChr >>> 18);
			aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
			aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
			aBytes[nIdx++] = 128 + (nChr & 63);
		} else if (nChr < 0x4000000) {
			/* five bytes */
			aBytes[nIdx++] = 248 + (nChr >>> 24);
			aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
			aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
			aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
			aBytes[nIdx++] = 128 + (nChr & 63);
		} else /* if (nChr <= 0x7fffffff) */ {
			/* six bytes */
			aBytes[nIdx++] = 252 + /* (nChr >>> 32) is not possible in ECMAScript! So...: */ (nChr / 1073741824);
			aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
			aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
			aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
			aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
			aBytes[nIdx++] = 128 + (nChr & 63);
		}
	}
	return aBytes;
};

var steg_iv = [];
var stegger = null;

var _initIv = function(){
    "use strict";

    if(steg_iv.length === 0){
        steg_iv = sjcl.codec.bytes.fromBits(sjcl.misc.pbkdf2($('#steg_pwd').val(), $('#steg_pwd').val(), 1000, 256 * 8));
    }
};

var allocateStegger = function () {
    "use strict";
	if (stegger === null) {
		stegger = new Eph5.Simple();

		console.log("Stegger allocated");
	}
};

var freeStegger = function () {
    "use strict";
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
		console.log("Used k:", result.k);
		console.log("Embedded length:", result.embeddedLength);

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
        if(exception.message.match(/^Not a JPEG/i)) return false;
		alert(exception.message);
		return false;
	}

    return data;
};

var processedJpegs = {}, process_images = [], isJpegLoading = false, totalJpegs2Process = 0;

var processJpgUrl = function(jpgURL, thumbURL, post_id, reRead, cb){
    "use strict";

    if(processedJpegs[jpgURL] && !reRead){
        if(processedJpegs[jpgURL].id != 'none'){
            $("#msg_" + processedJpegs[jpgURL].id).addClass('hidbord_msg_new');
        }

        console.log('from cache');

        if (typeof(cb) == "function") {
            cb();
        }
        return;
    }

    getURLasAB(jpgURL +(reRead ? '?t='+Math.random():''), function(arrayBuffer, date) {
        if(arrayBuffer !== null){
            processedJpegs[jpgURL] = {'id': 'none', 'src': jpgURL};
            idxdbPutLink(processedJpegs[jpgURL]);
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
                processedJpegs[jpgURL] = {id: do_decode(p, null, thumbURL, date, post_id, jpgURL).id, 'src': jpgURL};
                idxdbPutLink(processedJpegs[jpgURL]);
            }
        }
    });
};

var process_olds = function() {
    "use strict";

    var jpgURL;

    if (process_images.length > 0) {
        jpgURL = process_images.shift();

        $('#hidbord_btn_getold').val('Stop fetch! ['+(totalJpegs2Process-process_images.length)+'/'+totalJpegs2Process+']');
        processJpgUrl(jpgURL[0], jpgURL[1], jpgURL[2], jpgURL[3], function(){setTimeout(process_olds, 0);});
    } else {
	   stopReadJpeg();
	}
};


function readJpeg(url, thumb, post_id, skipReaded, forceReread){
    "use strict";

    totalJpegs2Process++;

    if(!skipReaded || !processedJpegs[url] || forceReread)
        process_images.push([url, thumb, post_id, forceReread]);

    if(!isJpegLoading){
        isJpegLoading = true;
        setTimeout(process_olds, 0);
    }
}

function stopReadJpeg(){
    "use strict";

    freeStegger();
    process_images = [];
    isJpegLoading = false;
    totalJpegs2Process = 0;
    $('#hidbord_btn_getold').val('Get posts');
}

function isJpegReading(){
    "use strict";

    return isJpegLoading;
}

var upload_handler = (new Date()).getTime() * 10000;

var TinyBoardFields = ["name","email","subject","post","spoiler","body","file","file_url","password","thread","board", "recaptcha_challenge_field", "recaptcha_response_field", "user_flag", "huehuehue", "derpibooruAPIKey", "embed"];

ParseUrl = function(url){
    "use strict";
    var m = (url || document.location.href).match( /https?:\/\/([^\/]+)\/([^\/]+)\/((\d+)|res\/(\d+)|\w+)(\.x?html)?(#i?(\d+))?/);
    return m?{host:m[1], board:m[2], page:m[4], thread:m[5], pointer:m[8]}:{};
};
var Hanabira={URL:ParseUrl()};

var sendBoardForm = function(file) {
    "use strict";
    replyForm.find("#do_encode").val('..Working...').attr("disabled", "disabled");

    if(location.hostname == '127.0.0.1'){
        var ta = $('textarea.reply-body, textarea#reply');

        if(ta.length === 0){
            alert('Can\'t find reply form.');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            return;
        }

        var out = '\n[img=' + arrayBufferDataUri(file) + ']';
        if(out.length < 64518){
            ta.first().val(ta.first().val() + out);
            replyForm.remove();
            replyForm = null;
            container_image = null;
            container_data = null;
            return;
        }else{
            alert('File is too big!');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            return;
        }
    }

    if(["dmirrgetyojz735v.onion", "2-chru.net", "mirror.2-chru.net", "bypass.2-chru.net", "2chru.cafe", "2-chru.cafe"].indexOf(document.location.host.toLowerCase()) != -1){
        $('body').append('<iframe class="ninja" id="csstest" src="../csstest.foo"></iframe>');
        $('iframe.ninja#csstest').on('load', function(e){
            $(e.target).remove();
            _sendBoardForm(file, []);
        });
        return;
    }

    if(["syn-ch.com", "syn-ch.org", "syn-ch.ru", "syn-ch.com.ua"].indexOf(document.location.host.toLowerCase()) != -1 && $('#de-pform form').length === 0){
        _sendBoardSync(file);
        return;
    }

    if (document.location.host === "ech.su") {
        _sendBoardEch(file);
        return;
    }

    if ($('form[name*="postcontrols"]').length !==0) {
        var successFunc = function(data, textStatus, jqXHR) {
            if(!jqXHR) data = data.responseText || data.response;

            var doc = document.implementation.createHTMLDocument('');
            doc.documentElement.innerHTML = data;

            var l = $("form[action*=post]", doc).serializeArray();
            l = l.filter(function(a){
                if(TinyBoardFields.indexOf(a.name) > -1) return false;
                return true;
            });

            l.push({"name": "post", "value": $('form[name=post] input[type=submit]').val()});

            //console.log("fresh post form: ", l);

            _sendBoardForm(file, l);
        },
            errorFunc = function(jqXHR, textStatus, errorThrown) {
            alert('failed to get fresh form. Try again!');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            upload_handler = (new Date()).getTime() * 10000;
        };

        if (typeof GM_xmlhttpRequest === "function") {
            GM_xmlhttpRequest({
                url: location.href,
                method: "GET",
                headers: {'content-type': 'multipart/form-data',
                'referer': location.href},
                onload: successFunc,
                onerror: errorFunc
            });
        }else{
            $.ajax({
                url: location.href,
                type: 'GET',
                processData: false,
                contentType: false,
                success: successFunc,
                error: errorFunc
            });
        }
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

    $('form noscript').remove();

    if($('#de-pform form').length !== 0){
        formData = $('#de-pform form').serializeArray();
        fileInputName = $("#de-pform form input[type=file]")[0].name;
        formAction = $("#de-pform form")[0].action; //+ "?X-Progress-ID=" + upload_handler,
    }else if(($('form#yukipostform').length !== 0)){
        formData = $('form#yukipostform').serializeArray();
        fileInputName = 'file_1';
        fd.append('file_1_rating', 'SFW');
        formAction = '/' + Hanabira.URL.board + '/post/new.xhtml' + "?X-Progress-ID=" + upload_handler;
    }else if(($('form[name=post]').length !== 0)){
        formData = $('form[name=post]').first().serializeArray();
        fileInputName = $("form[name=post] input[type=file]").length ? $("form[name=post] input[type=file]")[0].name : 'file';
        formAction = $("form[name=post]")[0].action;
    }else if(($('form#qr-postform').length !== 0)){
        formData = $('form#qr-postform').first().serializeArray();
        fileInputName = 'image1';
        formAction = $("form#qr-postform")[0].action;
    }else if(($('form#postform').length !== 0)){
        formData = $('form#postform').first().serializeArray();
        fileInputName = 'image1';
        formAction = $("form#postform")[0].action;
    }

    if(is4chan){
        var forForm = $('form[name=post]');
        if($('form[name=qrPost], div#qr form').length !==0){
            forForm = $('form[name=qrPost], div#qr form');
        }

        fileInputName = forForm.find("input[type=file]")[0].name;
        formAction = forForm[0].action;

        formData = forForm.serializeArray();

        if($('div#qr form').length !==0){
            if(!window.passEnabled){
                formData.push({"name": "recaptcha_response_field", "value": $('div#qr .captcha-input.field').val()});
                formData.push({"name": "recaptcha_challenge_field", "value": $('div#qr .captcha-img img').attr('alt')});
            }

            formData.push({"name": "com", "value": $('div#qr textarea').val()});

            formData.push({"name": "MAX_FILE_SIZE", "value": $('form[name=post] input[name=MAX_FILE_SIZE]').val()});
            formData.push({"name": "mode", "value": $('form[name=post] input[name=mode]').val()});
            formData.push({"name": "pwd", "value": $('form[name=post] input[name=pwd]').val()});
            formData.push({"name": "resto", "value": $('form[name=post] input[name=resto]').val()});

            formAction = $('form[name=post]')[0].action;
            fileInputName = $("form[name=post] input[type=file]")[0].name;
        }

//        console.log(formData);
    }

    if(formAddon.length > 0){
        formData = formData.filter(function(a){
            if(TinyBoardFields.indexOf(a.name) > -1) return true;
            return false;
        });
        formData.push.apply(formData, formAddon);
    }

    for (var i = 0; i < formData.length; i++) {
        if (formData[i].name && formData[i].name != fileInputName && formData[i].name !== "") {
            fd.append(formData[i].name, formData[i].value);
        }
    }

    var fnme = Math.floor((new Date()).getTime() / 10 - Math.random() * 100000000) + '.jpg';

    fd.append(fileInputName, uint8toBlob(file, 'image/jpeg'), fnme);

    var successFunc = function(data, textStatus, jqXHR) {
            if(!jqXHR) {
                jqXHR = data;
                data = data.responseText || data.response;
            }
            var doc = document.implementation.createHTMLDocument(''),
                p, errMsg;
            doc.documentElement.innerHTML = data;

            try{data = JSON.parse(data);}catch(err){}

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

            if(typeof data == "string" && data.match(/<h1>Ошибка!<\/h1>/)) p = 0;
            if(typeof data == "string" && data.match(/<title>(Error|Ошибка)<\/title>/)){
                p = 0;
                errMsg = $('h2', doc).text();
            }

            if (p !== 0 || (data.Status && data.Status == "OK")) {
                $('#de-pform textarea').val('');
                $('form#yukipostform textarea').val('');
                $('form[name=post] textarea').val('');
                $('#de-pform img[src*=captcha]').click();
                $('#hidbord_replyform #c_file').val('');
                $('.de-thread-updater .de-abtn').click();
                $('#de-thrupdbtn').click();
                $('a#yukiForceUpdate').click();
                $('a#update_thread').click();
                $('#recaptcha_response_field').val('');
                $('#recaptcha_challenge_image').click();
                $('input[name=recaptcha_response_field]').val('');
                $('.recaptcha_image').click();
                $('#ABU-getnewposts a').first().click();
                $('.captcha-reload-button').click();
                $('#qr-shampoo, #shampoo, #qr-captcha-value').val('');
                $('#imgcaptcha').click();
                $('#recaptcha_reload').click();
                $('#captchainput').val('');
                $('a#updateThread').click();
                if(is4chan){
                    setTimeout(function() {$('a[data-cmd=update]').first().click(); $('.thread-refresh-shortcut.fa.fa-refresh').first().click();}, 2500);
                    $('#qrCapField').val('');
                    $('#qrCaptcha').click();
                    $('textarea[name=com]').val('');
                    $('div#qr .captcha-input.field').val('');
                    $('div#qr .captcha-img img').click();
                    $('div#qr textarea').val('');
                }
                replyForm.remove();
                replyForm = null;
                container_image = null;
                container_data = null;

            } else {
                if(errMsg){
                    alert('Can\'t post.\n\n' + errMsg);
                }else{
                    alert('Can\'t post. Wrong capch? Fucked up imageboard software?.');
                }

                replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            }
            upload_handler = (new Date()).getTime() * 10000;
        },
        errorFunc = function(jqXHR, textStatus, errorThrown) {
            alert('Error while posting. Something in network or so.\n[' + jqXHR.status + ' ' + jqXHR.statusText + ']');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            upload_handler = (new Date()).getTime() * 10000;
        };

    if (typeof GM_xmlhttpRequest === "function") {
        GM_xmlhttpRequest({
            url: formAction,
            method: "POST",
            data: fd,
            headers: {'referer': location.href},
            onload: successFunc,
            onerror: errorFunc
        });
    }else{
        $.ajax({
            url: formAction,
            type: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            success: successFunc,
            error: errorFunc
        });
    }
};

var _sendBoardSync = function(file) {
 "use strict";

    var formData, fileInputName, formAction,
        fd = new FormData();

    formData = $('form[name=post]').first().serializeArray();
    formData.push({"name": "json_response", "value": 1});
    formData.push({"name": "post", "value": $('form[name=post] input[type=submit]').val()});
    fileInputName = 'file';
    formAction = $("form[name=post]")[0].action;

    for (var i = 0; i < formData.length; i++) {
        if (formData[i].name && formData[i].name != fileInputName && formData[i].name !== "") {
            fd.append(formData[i].name, formData[i].value);
        }
    }

    var fnme = Math.floor((new Date()).getTime() / 10 - Math.random() * 100000000) + '.jpg';

    fd.append(fileInputName, uint8toBlob(file, 'image/jpeg'), fnme);

    var successFunc = function(data, textStatus, jqXHR) {
            if(!jqXHR) {
                jqXHR = data;
                data = data.responseText || data.response;
            }
            var resp = JSON.parse(data);
            if (resp.redirect) {
                $('a#updateThread').click();
                $('form[name=post] textarea').val('');
                $('form[name=post] input[name=embed]').val('');
                replyForm.remove();
                replyForm = null;
                container_image = null;
                container_data = null;
            } else {
                alert(resp.error);
                replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            }
        },
        errorFunc = function(jqXHR, textStatus, errorThrown) {
            alert('Error while posting. Something in network or so.\n[' + jqXHR.status + ' ' + jqXHR.statusText + ']');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
        };

    if (typeof GM_xmlhttpRequest === "function") {
        GM_xmlhttpRequest({
            url: formAction,
            method: "POST",
            data: fd,
            headers: {'referer': location.href},
            onload: successFunc,
            onerror: errorFunc
        });
    }else{
        $.ajax({
            url: formAction,
            type: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            success: successFunc,
            error: errorFunc
        });
    }
};

var _sendBoardEch = function (file) {
    "use strict";

    var form, formData, fileInputName, formAction,
        fd = new FormData();

    form = $('form[id=postform]').first();
    formData = form.serializeArray();
    fileInputName = 'image';
    formAction = form.action;

    for (var i = 0; i < formData.length; i++) {
        if (formData[i].name && formData[i].name != fileInputName && formData[i].name !== "") {
            fd.append(formData[i].name, formData[i].value);
        }
    }

    var fnme = Math.floor((new Date()).getTime() / 10 - Math.random() * 100000000) + '.jpg';

    fd.append(fileInputName, uint8toBlob(file, 'image/jpeg'), fnme);

    var successFunc = function(data, textStatus, jqXHR) {
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            replyForm.remove();
            replyForm = null;
            container_image = null;
            container_data = null;
            $('#updt-link').click();
            $('#message').val('');
        },
        errorFunc = function(jqXHR, textStatus, errorThrown) {
            alert('Error while posting. Something in network or so.\n[' + jqXHR.status + ' ' + jqXHR.statusText + ']');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
        };

    if (typeof GM_xmlhttpRequest === "function") {
        GM_xmlhttpRequest({
            url: formAction,
            method: "POST",
            data: fd,
            headers: {'referer': location.href},
            onload: successFunc,
            onerror: errorFunc
        });
    }else{
        $.ajax({
            url: formAction,
            type: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            success: successFunc,
            error: errorFunc
        });
    }
};

var rsaProfile = {},
    rsa = null,
    rsa_hash, rsa_hashB64, broadProfile = {}, broad_hashB64;

var do_login = function(e, fromCfg, key, rnd) {
    "use strict";
    var lf = document.loginform,
        pwd = lf.passwd.value,
        slt = lf.magik_num.value;

    lf.magik_num.value = lf.passwd.value = '';

    if(key){
        rsaProfile = cryptCore.login(null, null, false, key);
    }else if(rnd){
        rsaProfile = cryptCore.login();
    }else if(!fromCfg){
        rsaProfile = cryptCore.login(pwd, slt, false);
    }else{
        rsaProfile = cryptCore.login(null, null, true);
    }

    if(!rsaProfile) {
        rsaProfile = {};
        return false;
    }

    rsa_hash = rsaProfile.publicKeyPairPrintableHash;
    rsa_hashB64 = rsaProfile.publicKeyPairPrintable;

    $('#identi').html(rsa_hashB64).identicon5({
        rotate: true,
        size: 64
    });
    $('#identi').append('<br/><br/><i style="color: #009;">'+rsa_hashB64+'</i>');
};

var do_loginBroadcast = function(e, key) {
    "use strict";
    var lf = document.broadcastform;
    if(!key){
        broadProfile = cryptCore.loginBroadcast(lf.passwd.value, lf.magik_num.value, false);
    }else{
        broadProfile = cryptCore.loginBroadcast(null, null, true);
    }
    lf.magik_num.value = lf.passwd.value = '';

    broad_hashB64 = broadProfile.publicKeyPairPrintable;

    $('#identi_broad').html(broad_hashB64).identicon5({
        rotate: true,
        size: 64
    });
    $('#identi_broad').append('<br/><br/><i style="color: #009;">'+broad_hashB64+'</i>');
};


var do_encode = function() {
    "use strict";

    prev_to = $('#hidbord_cont_type').val();
    prev_cont = $('#hidbord_cont_direct').val();

    ssSet(boardHostNameSection + '_prev_to', prev_to);
    ssSet(boardHostNameSection + '_prev_cont', prev_cont);

    var to_group = null;

    if(prev_to.indexOf('group_') === 0){
        to_group = prev_to.substring(6);
    }

    var payLoad = {};

    if(!container_data){
        alert('Image needed. Please select one.');
        return false;
    }

    if(!("publicKeyPairPrintable" in rsaProfile)){
        alert('Please log in.');
        return false;
    }

    payLoad.text = $('#hidbord_reply_text').val();
    payLoad.ts = Math.floor((new Date()).getTime() / 1000);

    var keys = {};

    if(prev_to == 'broadcast'){
        keys[broad_hashB64] = broadProfile;
        if (!hidboard_hide_sender) {
             keys[rsa_hashB64] = rsaProfile;
        }
    }else{
        keys[rsa_hashB64] = rsaProfile;

        for (var c in contacts) {
            if(c == rsa_hashB64) continue;

            if(prev_to == 'direct' && c == prev_cont){
                keys[c] = contacts[c];
                continue;
            }

            if('hide' in contacts[c] && contacts[c].hide == 1){
                continue;
            }

            if(to_group !== null && contacts[c].groups && $.isArray(contacts[c].groups) && contacts[c].groups.indexOf(to_group) != -1){
                keys[c] = contacts[c];
            }

            if(prev_to == 'direct' || to_group !== null){
                continue;
            }

            keys[c] = contacts[c];
        }
    }

    var p = encodeMessage(payLoad,keys, 0);
    var testEncode = decodeMessage([0,p]);

    if(!testEncode){
        alert('Error in crypt module!');
        return false;
    }

    var lastRand = stringToByteArray(String(Math.round(Math.random() * 1e6)));

    var final_container = jpegEmbed(container_data, p);

	if (process_images.length === 0) {
		freeStegger();
	}

    if(!final_container) return false;

    //var out_file = appendBuffer(final_container, lastRand);

    //var compressedB64 = arrayBufferDataUri(out_file);

    sendBoardForm(final_container);
};

var do_decode = function(message, msgPrepend, thumb, fdate, post_id, jpgURL) {
    "use strict";
    var msg = JSON.parse(message.text);
    var out_msg = {
        post_id: post_id,
        id: message.msgHash,
        txt: {
            ts: message.timestamp,
            msg: msg.text
        },
        keyid: message.sender || '',
        pubkey: message.sender || '',
        status: 'OK',
        to: message.msgContacts.sort(),
        contactsHidden: message.contactsHidden,
        contactsNum: message.contactsNum,
        senderHidden: message.senderHidden,
        isBroad: message.isBroad,
        src: jpgURL,
        thumb: thumb
    };

    idxdbPutPost(out_msg);
    push_msg(out_msg, msgPrepend, thumb);
    return out_msg;
};

var contacts = {}, cont_groups = [];


var add_contact_key = function(contactStr) {
    "use strict";

    contactStr = contactStr.replace(/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]/g, '');
    var words  = bs58.dec(contactStr);

    if(words.length != 33) return false;

    var pubEncKey = words;

    try{
        if(!ECcrypt.keyPair(pubEncKey).validate()){
            return false;
        }
    } catch(e) {
        return false;
    }

    var name = contactStr.substring(0,3) + "-" + contactStr.substring(3,6) + "-" + contactStr.substring(6,9);

    if (ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage));
    }

    contacts[contactStr] = {
        key: contactStr,
        name: name,
        hide: 0,
        groups: [boardHostName, boardHostName+'/'+board_section],
        "publicEnc": pubEncKey,
        "publicKeyPair": words,
        "publicKeyPairPrintable": contactStr,
        "publicKeyPairPrintableHash": sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(words)))        
    };

    ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);

    return contactStr;
};

var add_contact = function(e) {
    "use strict";

    var key = $(e.target).attr('alt');
    var rsa_hash = key;
    var temp_name = rsa_hash.substring(0,3) + "-" + rsa_hash.substring(3,6) + "-" + rsa_hash.substring(6,9);

    if(!add_contact_key(key)){
        alert('Invalid key!');
        return false;
    }

    var name = prompt("Name this contact:", temp_name);
    if(!name) return false;

    if (ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage));
    }

    contacts[rsa_hash].name = '' + name;

    ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);
    render_contact();
    $('em[alt="'+rsa_hash+'"]').text('' + name).css({"color": '', "font-weight": "bold", "font-style": 'normal'});
};

var add_contact_string = function(e) {
    "use strict";

    var key = $('#contact_address').val();
    var rsa_hash = key;
    var temp_name = rsa_hash.substring(0,3) + "-" + rsa_hash.substring(3,6) + "-" + rsa_hash.substring(6,9);

    if(!add_contact_key(key)){
        alert('Invalid key!');
        return false;
    }

    var name = prompt("Name this contact:", temp_name);
    if(!name) return false;

    if (ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage));
    }

    contacts[rsa_hash].name = '' + name;

    ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);
    render_contact();
    $('em[alt="'+rsa_hash+'"]').text('' + name).css({"color": '', "font-weight": "bold", "font-style": 'normal'});
};

function safe_tags(str) {
    "use strict";

    if(str && typeof str === 'string'){
        return str.replace(/&/g,'&amp;')
          .replace(/</g,'&lt;')
          .replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;')
          .replace(/'/g,'&#x27;')
          .replace(/`/g,'&grave;')
          .replace(/\//g,'&#x2F;');
    }

    return "";
}

var getContactHTML = function(hash, key) {
    "use strict";

    if(isSavedThread){
        return '<strong class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">' + safe_tags(hash.substring(0,3) + "-" + hash.substring(3,6) + "-" + hash.substring(6,9)) + '</strong>';
    }

    if (hash == rsa_hashB64) {
        return '<strong style="color: #090; font-style: italic" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">Me</strong>';
    }

    if (hash == broad_hashB64) {
        return '<strong style="color: #900; font-style: italic" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">BROADCAST</strong>';
    }

    if (!(hash in contacts)) {
        return '<em style="color: #00f" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">Unknown</em> [<a href="javascript:;" alt="' + hash + '" class="hidbord_addcntct_link">add</a>]';
    }

    if ('hide' in contacts[hash] && contacts[hash].hide == 1) {
        return '<strike class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">' + safe_tags(contacts[hash].name) + '</strike>';
    }

    return '<strong class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">' + safe_tags(contacts[hash].name) + '</strong>';

};

var contactsSelector = function(){
    "use strict";
    var code = '<div id="hidbord_contacts_select"><strong>to:</strong>&nbsp;<select id="hidbord_cont_type" style="float: none !important;"><option selected="selected" value="broadcast">Broadcast</option><option value="all">All contacts</option><option value="direct">Direct</option><option disabled="disabled">Groups:</option>';

    for (var i = 0; i < cont_groups.length; i++) {
        code += '<option value="group_'+safe_tags(cont_groups[i])+'">'+safe_tags(cont_groups[i])+'</option>';
    }
    
    code += '</select>&nbsp;<select id="hidbord_cont_direct" style="float: none !important; display: none;">';
    
    for (var c in contacts) {
        code += '<option value="'+c+'">'+safe_tags(contacts[c].name)+'</option>';
    }

    code += '</select>';

    return code + '</div>';
};

var render_contact = function() {
    "use strict";

    if (ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage));
    //    console.log(contacts);
    }


    cont_groups = {};

    var code = '<br><a href="data:text/plain;base64,' + strToDataUri(encodeURIComponent(JSON.stringify(contacts))) + 
               '" download="[DDT] Contacts - ' + document.location.host + ' - ' + dateToStr(new Date(), true) + 
               '.txt">Download contacts as file</a> or import from file: <input type="file" id="cont_import_file" name="cont_import_file"><br/>' +
               '<p><label>Address: <input name="contact_address" type="text" length=90 id="contact_address" style="width: 400px;"/></label><input type="button" value="Add" id="add_contact_key"/></p>', cnt = 1;

    for (var c in contacts) {
        var ren_action = ('hide' in contacts[c] && contacts[c].hide == 1) ? 'enable' : 'disable';
        var groups_list = '';

        if(contacts[c].groups && $.isArray(contacts[c].groups) && contacts[c].groups.length > 0){
            groups_list = '<div style="float:right; color: #999;">['+safe_tags(contacts[c].groups.join('; '))+']</div>';
            for (var i = 0; i < contacts[c].groups.length; i++) {
                var grp = contacts[c].groups[i].trim().toLowerCase();
                cont_groups[grp] = grp;
            }
        }


        code += '<div class="hidbord_msg">' +
            '<div style="float: right; color: #ccc;"><sup>#'+(cnt++)+'</sup></div>' + groups_list +
            '<div class="cont_identi" style="float: left">' + c + '</div>' +
            '<div  style="float: left; padding: 5px;">' + getContactHTML(c) + '<br/><i style="color: #009">' + c + '</i><br/>' +
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">delete</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">' + ren_action + '</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">rename</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">groups</a>]</sub></div><br style="clear: both;"/></div>';
    }

    var cont_list = $(code);
    cont_list.find('.cont_identi').identicon5({
        rotate: true,
        size: 48
    });
    cont_list.find('a.hidbord_cont_action').on('click', manage_contact);
    //cont_list.find('#cont_import_file').on('change', import_contact);

    $('.hidbord_contacts').empty().append(cont_list);
    $('.hidbord_contacts #cont_import_file').on('change', import_contact);
    $('#add_contact_key').on('click', add_contact_string);

    cont_groups = Object.keys(cont_groups).sort();
};

var manage_contact = function(e) {
    "use strict";

    if (ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + contactStoreName, contactsInLocalStorage));
    }

    var action = $(e.target).text(),
        key = $(e.target).attr('alt'), name, prmpt;
    
    if (action == 'delete' && confirm('Really delete?')) {
        delete contacts[key];
    }

    if (action == 'disable' && confirm('Are you sure?')) {
        contacts[key].hide = 1;
    }

    if (action == 'enable' && confirm('Are you sure?')) {
        contacts[key].hide = 0;
    }

    if (action == 'rename') {
        prmpt = prompt("Name this contact:", contacts[key].name);
        if(prmpt !== null) {
            contacts[key].name = '' + prmpt;
            $('strong[alt="'+key+'"]').text('' + prmpt);
            $('em[alt="'+key+'"]').text('' + prmpt).css({"color": '', "font-weight": "bold", "font-style": 'normal'});
        }
    }

    if (action == 'groups') {
        prmpt = prompt("Groups separated by semicolon (;)", $.isArray(contacts[key].groups) ? contacts[key].groups.join('; ') : "");
        if(prmpt !== null){
            if(prmpt === ''){
                contacts[key].groups = [];
            }else{
                contacts[key].groups = prmpt.split(';').map(function(s){return s.trim().toLowerCase();}).sort();
            }
        }
    }

    ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);
    render_contact();
};

var import_contact = function(evt) {
    "use strict";
    var files = evt.target.files; // FileList object

    if (files[0] && files[0].type.match('text.*')) {
        var reader = new FileReader();

//        console.log(files[0]);

        reader.onload = (function(theFile) {
            return function(e) {
                // result e.target.result;                
                try{
//                    console.log(decodeURIComponent(e.target.result));
                    var in_data = JSON.parse(decodeURIComponent(e.target.result));
//                    console.log(in_data);
                    for(var c in in_data){
                        if(!(c in contacts)){
                            contacts[c] = in_data[c];
                        }
                    }
                    ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);
                    render_contact();
                }catch(err){
//                    console.log(err);
                    alert('Can\'t import!');
                }
            };
        })(files[0]);
        reader.readAsText(files[0]);
    }
};


var CODEC_VERSION = 1, MESSAGE_NORMAL = 0, MESSAGE_DIRECT = 1;

var hidboard_hide_sender = false, hidboard_hide_contacts = false;

var encodeMessage = function(message, keys, msg_type, hideSender, hideContacts){
    'use strict';

    return cryptCore.encodeMessage(JSON.stringify(message), keys, hidboard_hide_sender, hidboard_hide_contacts);
};

var decodeMessage = function(hidData){
    'use strict';
    var m = null, i;

    for (i = 1; i < 8; i++) {
        if(!hidData[i]) continue;
        m = cryptCore.decodeMessage(hidData[i].buffer, true);
        if(m) {
        	m.isBroad = true;
        	return m;
        }
    }

    for (i = 1; i < 8; i++) {
    	if(!hidData[i]) continue;
        m = cryptCore.decodeMessage(hidData[i].buffer);
        if(m) {
        	m.isBroad = false;
        	return m;
        }
    }
    return false;
};
// крестики, сердечки и цветочки (для красоты)
// †♥♥♥♥♥✿♥✿♥✿♥✿♥✿♥✿♥✿♥✿♥✿♥✿♥✿✿✿✿✿✿†

var desudesuicon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAADAFBMVEUYAAAoEhUXHBxKGhgVKxgQMgdUHRYpLS1OKx1pJyFGMTFhLCR0LSY3PT0fSix0MS08QTYtRjRuNix/PTWGPDdKTU4hXSx7QjReTEs7YCmASkZdVj4YbDKNSUJ0UE0xaDtZWVyIT0B6VD5JZUYdeDqcVU6YWE+QW1FkaW4kgUE9eUuKZ2GRaFGCbG6gZWCqY1tGhiqlZVpSgjlxdXkwjU5ue3BjgWhwg0+pcl2QfE9PjmKzcGWucXi7cGiCgXmvdW9/gog7m1mifGOKhF+me3O4dnBWlWlgllK/e29CqiBUpDa4gm+BlF+RjXijiHyKk11Ypkp0n0LLgHZIqmSkjmyxi3FarC9+nV6pkGRppkhGthd8oFK5jGVfp2eRk5pHtyZppnl3oYN3pV2gl3CjmGOcl5CMn4vCkoRVt3BWvjSroGlpuEyeoKdfvj3Km3OJrYO1oIN3uE/BnYGrpICopJFruXjHnnywpnS6oJKMs1+CtXCspJ1qvmylp6RgwXl+u2O9oqabsnBpxkl9uY+nqbJnykGZt4Bzx1V1w3iqs4B9xlzWqYGPv32HwIy8soCntam7sKrRrJHVrInGsI61tJ6JwpV+x4SPwoizs7uttbmExoqRwZfNr5+0tbK9to7Ct3uiu7LYraV41U/Gtp+OzW+nw6F+2FrgtpLKwI3fuZzOwYaYz5y+wMeW0ZWqzYLLwpWjzpXdu6nTwK2jz6rGw7ul0oyj0aPMxaLDxcKN32mR3XO4zpexz6jKyLGv0LTFyNDnw6Wd3ZGj26LYzZnXz6Gh4Jztx7ej4ojX0Kqh5X+32bzO0Nqj45+z3qXP0dXuzLCx36uz3rKq46Dk0L3G2cbB28PX1b6+3riq5qnh2Kqz5qvU2NXd2bfV2c+y6Zyy6LPW2eD+0cHi27P21cLU4cG77Kq/6r297Ljc4szo4rnW5szS59XH7br23sjf4ujF78LI8bT938/24dHN7srU7NDf6Nzr58TQ8MTh6OPs6s7n6+/M+MvW99b+69zx9+b19fnl0Av3AAAAAXRSTlMAQObYZgAADKBJREFUWEfFlPt3HOV9xp+57szOzGrvu7rsSquLhSy7WMYWSLKDa+zEQG0IxeXSNtx6ISUNB3IICaVQSEvSQxIgjQttSsHEoQ4Q7uZyCrWxsTGxAUvyVXetVtLeZm+zszM7s7PTH1ack/wF+f70njnv+5n3+zzP+wX+0EUAd65H7fc/0opzZaUKgCqoAirgAYD+/Y2fPwMaWH/dQaGl3aI0HjoAcNVcF6ylT/6U+p2t0wzadEDnABFlETXQ/6v2rCBf2zr/4e0mCJ2zCUBUf1uc/+hts76nHBQd8m1/ZlEW0DHXuRCuUgw41MDVaFrXF2+emwRooGbLwzo4DdBZk6uy/3JI5iWqyZnyZGXRuce/1aIAqyNBJpt1itNhURZFo6Z14ZgPIAGMOH+5aOkswdsGV32579VKV0gJOishQbMrkO7+grIsABLTYnCWDlCgrBqNTPDTLhdAAnT7ucHrKY7idIJQn3i4mWuxKhJVISm1RPnTVPs3XgIsQDIOe7IcNFjQKOiI5mQZjRtgBMk4LNicPX7AnyasFBlyIrA8HWtJV5xU5w9uAQC09FfbDZPXAJ4DEG9ate1LwNF4PV4wQOjBZzOa2JUmoBx3ns5Jf/X1DDEOJ/f2GKCMQZuBh14kKE3La5h/M1794EsA19mRcBOw7dznFlefXazUzwvz8m57921UOWFlQtSJpSUAvDgDTz9t8TzPA+GtMXwJiM48T8c5nSDGl3nYkzoRV5Haqv6xhD8vsnOpCvWaJCmxMaBqAioPcMDS8Iuv/8lKDqwoGw2w4HTmKaqEnEXJNSrtfeia7Q90dwdLOWcZpxQ2y3q0jKJ7M13VvBcchrRBoAGoUVz4kwlhgPETc5aFCouaT+ZGH+t8ilHNqZcKvG0Z714Tq+YRUPDeFR6IdbOG+MQIr9MADdDQP/FvfXadkQ3Mg83CYCNF+hc4+yoDYemG8fkiKOs/rgRQG/1N0/NNV474OjuY6dxVn/qitUYLGq8ubuglwOmAwRqUt+/Dh68+cIVwdv8RN3p798NiM8kA3iiRwdK1xREffpveRgDTenSlBULDtYdmV/OaVANlgP3RPbd+C7j4H/YnCODyO/aKFqXPBs79dWoSCwn63TsvyvRp0fjspiau4QINYtMhdSN0AmBhkOsevfFhAgOp48/t9dj+9ZkaWIYT87tC6zaFYpv7nc+4eJtL4twUr6+4oHPYpBfTQR5NVcpue2qmSbTRNLxd7PTpqwf2CRqtRifCJYpsTsmIxY488mMdTZfwnM41AJPXKdwkV2qe6hF9hUzg6hu1RwAIAsjtQ/lLm86KuSq7tjCppIe9oZLsPwV3ldafvS7hWKWvBClnKidiF85GgFCqfvmL3PKtAICycu/QzQOfSbIN33A//Rl5/NPjck06BQH6zEjHqK2vaMA0A1fPhgsn+eoEZR376k4BB6CWy8i7XPXCLzXY7FbPJzUTkDHV8wJD4zjXGvrpxf1cvtECOeMgHfpqo6jJ/3k9xXylfBFiZRQAuAuLe+MVOnBVHzILy+ig0WEUgfmdumGuc5TBNwDzzWq1GlkKBNHq54zMJV2DmHG53UChsLh3NBSJbEzkW3Am37aASM+LDAKcEuaxgdN4qwFQRvurWCguYYPtajGLXjtSb7wxEpE7Ea1kJ9DSYfryZ5qKVs9U0Ak1Nl4Mvd06qLErNg4tSUBAwclN5mPf1BYBd5sKAC6gCWb2PLgB97rjyKNp+xEPaDjc5ZBgqBRrNESUnrGW5fSUO9uuW5cPSJMA1MMjI6seE2s10wSANhR6vRLRGyNnGQC5bGuqFtukm+UGoF+ou1jnBCPqnFl78da9i24CqenTqbMFN41KvAg0u3nwDL7nL1aAwOvv+yeisy3QdanUsPEtvVJmdyphV4oDtv1RP2xhNyJr19OFGlBczpzIF+ZJX/XSn1yzPw0nCip6XBeHFI5TGlOZ/5uFEMvqF8wTk7rGIfqmSKjCd6OuO2oAsstIxPX8cr32jd3s/zwupZu/KBa+WJg9rSuKwpQACti84/Veujzj0LlLCdSp7MdkK1XZ5PRuAirn58iFKWttPsHd25rftd97Iuo+Z5SN7aa7JtaJ+rkPQAEDaxzOvD9QtDTeZ7mpDPOxyfjt7hGyHq/M4ViJnw+6ejN/1yc4m0Znus7IquEWVi0HbLKeLRwACcSapvLrS2hVhVYdRZ6LsR/9fG8JtZk4zqcPIDKEKcxtvP9w+0vrUWfGnWsxs+5YN+nQsSJiSek+VWNh92pnwRlOfXU3iFP37YujuPcXJ7zdG9MbNjYvvbPNCWn64sBRsqLY+fmL6rrJGmzDRlem0zipg0vs6JvUyzLH9/lYh3d8z1/ueLPFy20ubib4I+uS5lXTOJ9ylWza8KpDlM7qUFINQMlXZ1N9ILlfzaZs0ZYc63dKhsGWZ81hL3ft4uZ8yHeF+8rvtpyvo35pe3OWJ/G6TzXYlCO0Mg+M0vbJol7Pt6V6yiwxcfrlo96eYWle+vcqSO5q8Z21XW2BJ6pxAEAipFtO5mlIMDzVMgAK2Bbm+VfZIdmTTG5gx9/ybSsyRw7OrfbpH8ZH9Z++gztbmQtPqm08AGTrY3ahebnwr4t8wVExEx+AArZdnhIlD/zp3u589amNXzVnZr3u+kcHxYmyHrnbuIt0nN9DqYRHyAjk4RZjqR4tl0SfGtBsfuwwKGAgHDCIvYSrydI67+vb0E2rpjJmSIxYv2lK2H0LiaffYKA6/a68XomVMFPVmNLUPUWNpqvJD0ACMQlouz2ZN1T2Z0SHYlYVGp4gQmNy1z2vb3Dk/vEgA+fQ9MIXHttimWCEk4NInHHUqqqjMQ9KrKEE9Im7Mmzbx+3kQQlZoKkS7BrcQdbjff92xvSkO6Jj/q8D8obMDDa/SOuhhV//bShFo9xwQWZ9y2u+smc+dEj07OLKhfFaogjXpcMlhPD9U04G3dEx59WiePT8Q3dpZzTGmm6nDtApGqrYmEg+QwnJW/azyc5rdhx68Ofenb9qq3RdZrtR2Ccjj6bm/GnBvWPfayrCdzgyJwVTm+uc/HigcZgGYCgOg3WbRza3rH78gQcST98bTPRfj9T7GZlhzI4oxiqtoP5+cvC2CXt8LYGklCZF59Mv6Kh9mQOJglLbeeyy6WVybPq5/xIGQqszzx42y1Q6EKuUZgYrlDRgvJLds+bYBvvBC1nTrNaC09eBJM8eBgHcdwOrQEI+uJ/0rn3i297bXvmOADAm40Qzky56aMx/ze2fMLMjE/aOlvLyQ7nJrOhRcVSuHvkeKGDXRZA0kuLpkQ8uUjcO/+Cy8EEXRTlFR8j7yuSmoCZbwTWBicqN3j7OVeiiw++RbalKrSlvramePwwaACvDJ6vh5cQJOxJ9R9r1T0MMAPNcelmfps8Z6B7GshD1BESIAIOnBy7fPLqsCW9t7WyIKMsSK/vkjPvJfA4LiBx25o1cbooJIz3oOkX4elcPLMRhAgCQ98BxsxnsfyUZSRwWRIAEfBIMyUDgyU/vbwciGbQoVbtnBEpURxi+y1b7MQ4MIgMAJTOPEWi43pPzvRBcCRI7qdTzsR8eGUwgF0FgHoAIQI0DSXfv2oHICVOFDIqhgAwzbUbOnDyS3u7hqPsbN0Bqra/ov/64ewv472QcjijHwkYc4W2ca01sdQQLSxAwDa/pBZAPLEVGk5MXIIc6jjIACciiblg/coS9W15r/oicmzsTNdh0GIKSxNreDr9lJdHSrE4BjKsMlHIZ6ArnPbkqRa5/qaGBAOZBobf9zVz/41NhfhUmWazzr5H6bxn0DXVGoNgtgWVhFi5TBACLqlASRlVFLqDhgktuedTI4AXyv29z/RoQvm8KH7f6AchndpElCxPomQBa82JZFIEMZXke+bZLQgFaJdAYqgFzUe1cZpa2HMVLd9/w8qo+3s8AUVewf6vpx2fEJdVl1GMvM2AAoBgwt1ybXFxkYJczDQ30ignlSmDXyJYL/vBnR9vbEMpWXW/PxP9vBtn2nmwcaG0+jpJJAZAz2PcoVS4nqGAFAAnElPZ25d2ZcsuS2H7JJV/b8ReA/Ebv5+joPPPDvazmqGpLaCZqF+Zd8JYBH+r+WZewgUgVOhoaLA0//xsDsyhnAKBr2n161h49Eg5vefKfYcb7eGkBQODo6UM3l10igECyVy45Jy9LFtIRgARasvueY3ETVipAHp+aU/CtQOeu8W8+2FPLZr9Qm4P518p7MI1GxkR5yFtJzPJBAARw7eafCapwD4wcACB8lFzMJPje3cnsiUXhdgC5ZBh4L+G/yZtb+cnMpwZMoTPjfh9/+Pp/8JfWm1VQBz4AAAAASUVORK5CYII=';

var injectCSS = function(css) {
	"use strict";

    $('<style type="text/css">' + css + '</style>').appendTo("head");
};

var inject_ui = function() {
	"use strict";

    var ui = '<div class="hidbord_main" style="display: none">'+
            '    <div class="hidbord_thread hidbord_maincontent">'+
            '        <p style="text-align: center; display: none;" id="allgetter_button">'+
            '        </p>'+
            '        <p style="text-align: center; display: none;" id="hidbord_reply_button">'+
            '        </p><p style="text-align: center; height: 80%;">'+
            '        </p>'+
            '    </div>'+
            '    <div class="hidbord_contacts hidbord_maincontent" style="display: none"></div>'+
            '    <div class="hidbord_config hidbord_maincontent" style="display: none">'+
            '    <div class="hidbord_msg"><h3 style="text-align: center;">Your key:</h3><p id="identi" style="text-align: center;"></p>'+
            '<p style="text-align: center; font-size: x-small;"><a href="javascript:;" id="hidboard_key_random">generate random</a> | <a href="javascript:;" id="hidboard_key_export">export private key</a> | <a href="javascript:;" id="hidboard_key_import">import private key</a></p>'+
            '<input type="file" style="display:none" id="hidboard_key_import_file">'+
            '        <form name="loginform" style="margin: 0;">'+
            '                    <table style="margin-left:auto; margin-right:auto; text-align: right;"><tr><td>Password: </td><td><input name="passwd" type="text" value=""  style="width: 300px; color: rgb(221, 221, 221); max-width: none;"></td></tr><tr><td>Salt: </td>'+
            '                    <td><input name="magik_num" type="text" value="" style="width: 300px; color: rgb(221, 221, 221); max-width: none;"></td></tr>'+
            '                    <tr><td>&nbsp;</td><td style="text-align: left;"><input type="button" value="log in" id="do_login"></td></tr></table>'+
            '            </p>'+
            '        </form></div>'+

            '    <div class="hidbord_msg"><p id="identi" style="text-align: center;"></p>'+

            '            <p  style="text-align: center;">'+
            '                    <a href="https://github.com/desudesutalk/desudesutalk/raw/master/ddt.user.js" target="_blank">Reinstall/update Script</a>'+
            '            </p>'+

            '            <p  style="text-align: center;">'+
            '                    <label>Font size: <input type="number" step="any" value="14" style="width: 30px;" id="hidboard_option_fontsize"/>px</label>'+
            '            </p>'+


            '            <p  style="text-align: center;">'+
            '                    <label>Use global contacts: <input type="checkbox" id="hidboard_option_globalcontacts" style="vertical-align:middle;" checked></label>'+
            '            </p>'+

            '            <p  style="text-align: center;">'+
            '                    <label>Store contacts in public: <input type="checkbox" id="hidboard_option_pubstore" style="vertical-align:middle;" checked></label><br/>'+
            '                     (Should be used with Scriptish. Also this will disable "Global contacts")'+
            '            </p>'+

            '            <p  style="text-align: center;">'+
            '                    <label>Autoscan is on by default: <input type="checkbox" id="hidboard_option_autoscanison" style="vertical-align:middle;" checked></label>'+
            '            </p>'+


            '        </div>'+

            '    <div class="hidbord_msg">'+
            '        <p style="text-align: center; background: #f00; color: #fff;"><b>DANGER ZONE!!!</b></p>'+
            '        <p style="text-align: center; border-bottom: 1px solid #ddd;padding-bottom: 5px;">Change this only when you know what you\'re doing!</p>'+
            '        <h3 style="text-align: center;">Broadcast address:</h3><p id="identi_broad" style="text-align: center;"></p>'+
            '        <form name="broadcastform" style="margin: 0;">'+
            '                    <table style="margin-left:auto; margin-right:auto; text-align: right;"><tr><td>Password: </td><td><input name="passwd" type="text" value=""  style="width: 300px; color: rgb(221, 221, 221); max-width: none;"></td></tr><tr><td>Salt: </td>'+
            '                    <td><input name="magik_num" type="text" value="" style="width: 300px; color: rgb(221, 221, 221); max-width: none;"></td></tr>'+
            '                    <tr><td>&nbsp;</td><td style="text-align: left;"><input type="button" value="set" id="do_login_broadcast"></td></tr></table>'+
            '            <p style="border-bottom: 1px solid #ddd;padding-bottom: 5px;"></p>'+
            '            <p  style="text-align: center;">'+
            '                    Steg Password: <input name="steg_pwd" type="text" value="desu" size=10 id="steg_pwd">'+
            '            </p>'+
            '        </form></div>'+


            '    </div>'+
            '    <div class="hidbord_head">'+
            '        <img alt="Moshi moshi!" title="Moshi moshi!" src="' + desudesuicon +'" width="64" style="float:left;" class="hidbord_clickable" id="hidbord_headicon">'+
            '        <h3 class="hidbord_clickable" style="text-shadow: 0 1px 0 #fff;">'+
                        '<span style="color: #900">De</span>'+
                        '<span style="color: #090">su</span> '+
                        '<span style="color: #900">De</span>'+ /*jshint newcap: false  */
                        '<span style="color: #090">su</span> Talk!<span style="font-size: x-small;">&nbsp;(v'+(typeof GM_info !== 'undefined' ? GM_info.script.version : '')+')</span></h3>'+
                    '<div class="hidbord_nav">'+
            '            <div class="hidbord_clickable active" id="hidbord_show_msgs">Messages</div>'+
            '            <div class="hidbord_clickable" id="hidbord_show_cntc">Contacts</div>'+
            '            <div class="hidbord_clickable" id="hidbord_show_cfg">Log in!</div>'+
            '        </div>'+
            '    </div>'+
                '<div style="position: absolute;left: 0;right: 0;bottom: 0;background-color: rgb(217,225,229);border-top: 1px solid #fff;  box-shadow: 0 0 10px #000;height: 27px;text-align: center;padding: 0 5px;">'+
                '<input type="button" value="Write reply" style="font-weight: bold;float: left;font-size: 12px;" id="hidbord_btn_reply">'+
                '<input type="button" value="Get posts" style="font-size: 12px;" id="hidbord_btn_getold" title="shift+click - reverse scan&#13;ctrl+click - force images rescan">&nbsp;<label><input type="checkbox" id="hidboard_option_autofetch" style="vertical-align:middle;" checked>autoscan</label>'+
                '<a href="javascript:;" style="float: right;line-height: 27px;" id="hidbord_btn_checknew">check for new</a>'+
                '<a href="javascript:;" style="float: right;line-height: 27px; padding-right: 15px;" id="hidbord_btn_save_thread" title="Save DDT thread as a file">save</a> '+
                '<span style="float: right;line-height: 27px; padding-right: 15px; display:none" id="hidbord_btn_save_thread_info">Saving..</span> '+
                '</div>'+
            '</div>'+
            '<div class="hidbord_notifer">'+
            '    <img id="hidbord_show" class="hidbord_clickable" alt="Moshi moshi!" title="Moshi moshi!" src="' + desudesuicon +'" width="32" style="margin:0; z-index:1050;vertical-align: bottom;"/>'+
            '<span id="hidbord_notify_counter" class="hidbord_clickable" style="position: absolute;background: #f00;z-index: 100;bottom: 4px;right: 4px;font-weight: bold;padding: 2px 7px;border-radius: 30px; color: #fff;box-shadow: 0 0 1px #f00;font-size: 15px;display: none;">1</span>'+
            '</div>';

    injectCSS('.hidbord_popup a, .hidbord_main a {color: #ff6600;} .hidbord_popup a:hover, .hidbord_main a:hover {color: #0066ff;}'+
            '.hidbord_msg, .hidbord_msg div {float: none; clear: none; display: block;} .hidbord_msg_header {display: block;} .hidbord_msg_header div{display: block} .hidbord_nav div {float: none;}'+
            '.hidbord_notifer{ z-index: 1000; font-size: smaller !important;padding: 0;font-family: calibri;position: fixed;bottom: 25px;right: 25px;box-shadow: 0 0 10px #999;display: block;border: 3px solid #fff;border-radius: 5px;background-color: rgb(217,225,229);overflow: hidden;} '+
            '.hidbord_msg code { padding: 0 4px; font-size: 90%; color: #c7254e; background-color: #f9f2f4; white-space: nowrap; border-radius: 4px; } '+
            '.hidbord_msg code, .hidbord_msg kbd, .hidbord_msg pre, .hidbord_msg samp { font-family: Menlo,Monaco,Consolas,"Courier New",monospace; white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word; } '+
            '.hidbord_spoiler code { padding: 0; } '+
            '.hidbord_msg pre { clear: left; display: block; padding: 9.5px; margin: 10px; font-size: 13px; line-height: 1.42857143; word-wrap: break-word; border-radius: 4px; white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word; } '+
            '.hidbord_spoiler, .hidbord_spoiler code { background-color: #CCCCCC; } '+
            '.hidbord_spoiler:not(:hover) pre{ background-color: #CCCCCC; } '+
            '.hidbord_spoiler:not(:hover) img{ opacity: 0; } '+
            '.hidbord_spoiler:not(:hover), .hidbord_spoiler:not(:hover) * { color: #CCCCCC !important; } '+
            '.hidbord_quot1 { color: #789922; }'+
            '.hidbord_quot2 { color: #546c18; } '+
            '.hidbord_main { z-index: 1000; color: #800000 !important; font-size: small !important; font-family: \'open sans\', sans-serif; position: fixed; bottom: 25px; right: 25px; box-shadow: 0 0 10px #999; display: block; width: 650px; border: 3px solid #fff; border-radius: 5px; background-color: rgb(217,225,229); overflow: hidden; top: 25px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAEAgMAAADUn3btAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gQIFQEfWioE/wAAAAlQTFRF0Njc2eHl////72WY8QAAAAFiS0dEAmYLfGQAAAAQSURBVAgdY2BlEGEIYHAEAAHAAKtr/oOEAAAAAElFTkSuQmCC); } '+
            '.hidbord_maincontent{ padding: 5px; overflow-y: scroll; overflow-x: hidden; position: absolute; top: 65px; width: 640px; bottom: 28px; } '+
            '.hidbord_head{ height: 64px; border-bottom: 1px solid #fff; box-shadow: 0 0 10px #000; position: absolute; top: 0; left: 0; right: 0; text-align: center; background-color: rgb(217,225,229); } '+
            '.hidbord_head h3{ margin-top: 5px; padding-left: 0; font-family: comic sans ms; font-style: italic; font-size: x-large; } '+
            '.hidbord_nav{ position: absolute; bottom: 0; margin: auto; width: 370px; left: 0; right: 0; } '+
            '.hidbord_nav div{ display: inline-block; background: #eee; width: 120px; } '+
            '.hidbord_nav .active{ background: #fff; box-shadow: 0 0 5px #999; } '+
            '.hidbord_msg { font-family: \'open sans\', verdana, sans-serif; font-size: 105%; display: block; border-right: 1px solid #999; border-bottom: 1px solid #999; border-left: 1px solid #fafafa; border-top: 0; margin: 2px 10px 10px 2px; background-color: #fafafa; padding: 5px; word-wrap: break-word;} '+
            '.hidbord_msg_focused { border: 1px dashed #e00; } '+
            '.hidbord_msg_new { background-color: #ffe; } '+
            '.hidbord_main hr, .hidbord_popup hr { background:#ddd; border:0; height:1px } '+
            '.hidbord_mnu{ visibility: hidden; font-size: x-small; float:right !important; } '+
            '.hidbord_msg:hover .hidbord_mnu { visibility: visible; } '+
            '.hidbord_msg ol, .hidbord_msg ul { clear: both; } '+
            '.hidbord_mnu a { color: #999; padding: 0.2em 0.4em; text-decoration: none; border: 1px solid #fff; } '+
            '.hidbord_mnu a:hover { background: #fe8; border: 1px solid #db4; } '+
            '.hidbord_clickable { cursor: pointer; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: -moz-none; -ms-user-select: none; user-select: none; }'+
            '.hidbord_hidden { display: none !important; } .hidbord_main h3 {background: none}'+
            '.hidbord_popup {z-index: 2000; font-size: small !important; font-family: \'open sans\', sans-serif; color: #800000 !important;}');

    //Highlight.js
    injectCSS('.hljs { display: block; padding: 0.5em; background: #002b36; color: #839496; } .hljs-comment, .hljs-template_comment, .diff .hljs-header, .hljs-doctype, .hljs-pi, .lisp .hljs-string, .hljs-javadoc { color: #586e75; }  .hljs-keyword, .hljs-winutils, .method, .hljs-addition, .css .hljs-tag, .hljs-request, .hljs-status, .nginx .hljs-title { color: #859900; }  .hljs-number, .hljs-command, .hljs-string, .hljs-tag .hljs-value, .hljs-rules .hljs-value, .hljs-phpdoc, .tex .hljs-formula, .hljs-regexp, .hljs-hexcolor, .hljs-link_url { color: #2aa198; }  .hljs-title, .hljs-localvars, .hljs-chunk, .hljs-decorator, .hljs-built_in, .hljs-identifier, .vhdl .hljs-literal, .hljs-id, .css .hljs-function { color: #268bd2; }  .hljs-attribute, .hljs-variable, .lisp .hljs-body, .smalltalk .hljs-number, .hljs-constant, .hljs-class .hljs-title, .hljs-parent, .haskell .hljs-type, .hljs-link_reference { color: #b58900; }  .hljs-preprocessor, .hljs-preprocessor .hljs-keyword, .hljs-pragma, .hljs-shebang, .hljs-symbol, .hljs-symbol .hljs-string, .diff .hljs-change, .hljs-special, .hljs-attr_selector, .hljs-subst, .hljs-cdata, .clojure .hljs-title, .css .hljs-pseudo, .hljs-header { color: #cb4b16; }  .hljs-deletion, .hljs-important { color: #dc322f; }  .hljs-link_label { color: #6c71c4; } .tex .hljs-formula { background: #073642; } ');

      if ($('form[name*="postcontrols"]').length !==0) {
            $('header').first().before(ui);
      }else{
            $('body').prepend(ui);
      }

    $('.hidbord_notifer .hidbord_clickable').on('click', function() {
        $('.hidbord_notifer').hide();
        $('body').css('margin-right', '680px');
        $('.hidbord_main').show();
    });

    $('.hidbord_head h3, .hidbord_head #hidbord_headicon').on('click', function() {
        $('.hidbord_main').hide();
        $('.hidbord_msg_new').removeClass('hidbord_msg_new');
        $('body').css('margin-right', '0');
        $('#hidbord_notify_counter').hide();
        new_messages = 0;
        $('.hidbord_notifer').show();
    });

    $('#hidbord_show_msgs').on('click', function() {
        $('.hidbord_maincontent').hide();
        $('.hidbord_thread').show();
        $('.hidbord_nav div').removeClass('active');
        $('#hidbord_show_msgs').addClass('active');
    });

    $('#hidbord_show_cntc').on('click', function() {
        $('.hidbord_maincontent').hide();
        $('.hidbord_contacts').show();
        $('.hidbord_nav div').removeClass('active');
        $('#hidbord_show_cntc').addClass('active');
    });

    $('#hidbord_show_cfg').on('click', function() {
        $('.hidbord_maincontent').hide();
        $('.hidbord_config').show();
        $('.hidbord_nav div').removeClass('active');
        $('#hidbord_show_cfg').addClass('active');
    });

    $('#hidboard_option_autofetch').on('change', function() {
        autoscanNewJpegs = $('#hidboard_option_autofetch').attr('checked');
    });

    $('#hidboard_option_pubstore').on('change', function() {
        contactsInLocalStorage = !!$('#hidboard_option_pubstore').attr('checked');
        ssSet('magic_desu_contactsInLocalStorage', !!$('#hidboard_option_pubstore').attr('checked'));
        render_contact();
    });

    if(!useGlobalContacts){
        $('#hidboard_option_globalcontacts').attr('checked', null);
    }else{
        $('#hidboard_option_pubstore').attr('checked', null);
    }

    if(!contactsInLocalStorage){
        $('#hidboard_option_pubstore').attr('checked', null);
    }

    if(!autoscanNewJpegs){
        $('#hidboard_option_autofetch').attr('checked', null);
        $('#hidboard_option_autoscanison').attr('checked', null);
    }

    $('#hidboard_option_globalcontacts').on('change', function() {
        ssSet('magic_desu_useGlobalContacts', !!$('#hidboard_option_globalcontacts').attr('checked'));
        if(ssGet('magic_desu_useGlobalContacts')){
            useGlobalContacts = true;
            contactsInLocalStorage = false;
            $('#hidboard_option_pubstore').attr('checked', null);
            ssSet((useGlobalContacts?'':boardHostName) + contactStoreName, JSON.stringify(contacts), contactsInLocalStorage);
            render_contact();
        }else{
            useGlobalContacts = false;
            render_contact();
        }
    });

    $('#hidboard_option_fontsize').val(uiFontSize);
    $('.hidbord_maincontent').css('font-size', uiFontSize + 'px !important');

    $('#hidboard_option_fontsize').on('change', function() {
        ssSet('magic_desu_fontsize', $('#hidboard_option_fontsize').val());
        $('.hidbord_maincontent').css('font-size', $('#hidboard_option_fontsize').val() + 'px !important');
    });


    $('#hidbord_btn_save_thread').on('click', function() {
        $('#hidbord_btn_save_thread').hide();
        $('#hidbord_btn_save_thread_info').show();
        ddtSaveThread();
    });


    $('#hidboard_option_autoscanison').on('change', function() {
        ssSet(boardHostName + 'autoscanDefault', !!$('#hidboard_option_autoscanison').attr('checked'));
    });

    $('#hidbord_btn_reply').on('click', function() {
        $('.hidbord_maincontent').hide();
        $('.hidbord_thread').show();
        $('.hidbord_nav div').removeClass('active');
        $('#hidbord_show_msgs').addClass('active');
        showReplyform('#hidbord_reply_button');
    });

    $('#hidbord_btn_checknew').on('click', function() {
        $('#de-updater-btn').click();
        $('a#yukiForceUpdate').click();
        $('a#update_thread').click();
        if(is4chan){
            $('a[data-cmd=update]').first().click();
        }
    });

    $('#do_login').on('click', do_login);
    $('#do_login_broadcast').on('click', do_loginBroadcast);

    $('#hidbord_btn_getold').on('click', read_old_messages);

    $('#steg_pwd').on('change', function() {
        ssSet(boardHostName + 'magic_desu_pwd', $('#steg_pwd').val());
        steg_iv = [];
    });

    $('#hidboard_key_random').on('click', function(){do_login(false, false, false, true);});
    $('#hidboard_key_export').on('click', function(){cryptCore.savePKey();});
    $('#hidboard_key_import').on('click', function(){$('#hidboard_key_import_file').click();});

    $('#hidboard_key_import_file').on('change', handleKeySelect);
};

function handleKeySelect(evt) {
    "use strict";

    var files = evt.target.files,
        reader = new FileReader();

    reader.onload = function(e) {
        var pKey = e.target.result;

        if(pKey.length > 100) {
            alert('Inkorrect key file!');
            return;
        }
        do_login(false, false, pKey);

    };

    reader.readAsText(files[0]);
}

var popup_del_timer;

var do_popup = function(e) {
    "use strict";

    var msgid = $(e.target).attr('alt'),
        fromId = $(e.target).closest('.hidbord_msg').first().attr('id').replace(/^msg_/, '');

    if(all_messages[msgid]){
        _do_popup(e, all_messages[msgid], msgid, fromId);
    }else{
        idxdbGetPostById(msgid, function(msg){
            _do_popup(e, msg, msgid, fromId);
        });
    }
};


var _do_popup = function(e, msg, msgid, fromId) {
	"use strict";

    var msgClone, oMsg, oMsgH;

    $('#hidbord_popup_' + msgid).remove();
    $('body').append('<div class="hidbord_popup" id="hidbord_popup_' + msgid + '" style="position: fixed; top: 0; right: -1250px; width: 611px;"></div');

    if(!msg){
        oMsg = msgClone = $('<div style="padding: 10px; background: #fee; border: 1px solid #f00; font-weight: bold; text-align:center;">NOT FOUND</div>');
        $('#hidbord_popup_' + msgid).append(msgClone);
        oMsgH = 50;
    } else{
        var txt, person, msgTimeTxt,
            msgDate = new Date();

        msgDate.setTime(parseInt(msg.txt.ts) * 1000);

        if (msg.status == 'OK') {
            txt = wkbmrk(msg.txt.msg, msgid);
        } else {
            txt = '<p><strong style="color: #f00; font-size: x-large;">NOT FOR YOU! CAN\'T BE DECODED!</strong></p>';
        }

        msgTimeTxt = dateToStr(msgDate);

        if(msg.senderHidden){
            person = '<b>Anonymous</b>';
        }else{
            person = getContactHTML(msg.keyid, msg.pubkey);
        }

        var code = '<div class="hidbord_msg" id="msg_' + msg.id + '" style="margin: 0;">'+
                   '    <div style="overflow: hidden" class="hidbord_msg_header" >'+
                   (msg.keyid !=='' ? '<span style="background: #fff;" class="idntcn2">' + msg.keyid + '</span>&nbsp;' : '') + person +
                   ' <i style="color: #999;">(' + msgTimeTxt + ') <span href="javascript:;" class="hidbord_mnu_reply hidbord_clickable">#'+msg.id.substr(0, 8)+'</span></i>'+
                   '    </div>'+
                   '    <hr style="clear:both;">'+
                   '    <div style="overflow: hidden;"><img src="'+msg.thumb+'" class="hidbord_post_img hidbord_clickable" style="max-width: 100px; max-height:100px; float: left; padding: 5px 15px 5px 5px;"/>' + txt + '</div>'+
                   '<span class="msgrefs" style="font-size: 11px;font-style: italic;"></span>'+
                   '</div>';

        $('#hidbord_popup_' + msgid).append(code).css('box-shadow', ' 0 0 10px #555');

        msgClone = $('#hidbord_popup_' + msgid).css('margin', '0');
        oMsgH = msgClone.height();
    }

    var opy = $(e.target).offset().top - window.scrollY,
        px = e.clientX,
        py = 10 + opy + $(e.target).height(),
        height_css = null;

    if (py > $(window).height() / 2) {
        py -= oMsgH + 20 + $(e.target).height();
        if(py < 10 ){
            height_css = (opy- 25);
            py = 10;
            msgClone.css({"overflow-y":"scroll", height: height_css+'px'});
        }
    }else{
        if(py + oMsgH + 20 > $(window).height()){
            height_css = ($(window).height() - py - 20);
            msgClone.css({"overflow-y":"scroll", height: height_css+'px'});
        }
    }

    msgAppendListeners('#hidbord_popup_' + msgid);

    renderRefs(msgid, '#hidbord_popup_' + msgid);

    $('#hidbord_popup_' + msgid).css({'right': '50px', 'top': py+'px'});

    $('#hidbord_popup_' + msgid + ' .hidbord_msglink[alt="'+fromId+'"]').css({'text-decoration': 'none', 'border-bottom':'1px dashed', 'font-weight': 'bold' });

    var local_popup_del_timer;

    $('#hidbord_popup_' + msgid ).on('mouseover', function() {
        clearTimeout(local_popup_del_timer);
        clearTimeout(msgPopupTimers[msgid]);
    }).on('mouseout', function(){
        local_popup_del_timer = setTimeout(function() {
            $('#hidbord_popup_' + msgid).remove();
        }, 200);
    });
};

var msgPopupTimers = {};

var del_popup = function(e) {
	"use strict";

    var msgid = $(e.target).attr('alt');

    clearTimeout(msgPopupTimers[msgid]);

    if(msgid == 'file_selector'){
        $('#file_selector').remove();
        return;
    }

    msgPopupTimers[msgid] = setTimeout(function() {
        if(msgid == 'msg_preview'){
            $('#prev_popup').remove();
        }else{
            $('#hidbord_popup_' + msgid).remove();
        }
    }, 200);
};

var msgAppendListeners = function(msgQuery){
    "use strict";

    $(msgQuery + ' .idntcn').identicon5({
        rotate: true,
        size: 40
    });

    $(msgQuery + ' .hidbord_addcntct_link').on('click', add_contact);
    $(msgQuery + ' .hidbord_mnu_reply').on('click', replytoMsg);
    $(msgQuery + ' .hidbord_usr_reply').on('click', replytoUsr);
    $(msgQuery + ' .hidbord_mnu_replydirect').on('click', replytoMsgDirect);

    $(msgQuery + ' #hidbord_mnu_info').on('click', function(e){
        var msg_id = $(e.target).closest('.hidbord_msg').first().attr('id');
        var headrs = $(e.target).closest('.hidbord_msg').first().find('#' + msg_id + ' .hidbord_msg_header');
        for (var i = 0; i < headrs.length; i++) {
            var elm = $(headrs[i]);
            if(elm.css('display') == 'none'){
                elm.removeClass('hidbord_hidden');
            }else{
                elm.addClass('hidbord_hidden');
            }

        }
    });

    $(msgQuery + ' .hidbord_post_img').on('click', function(e){
        var imgname = e.target.src.replace(/.+?\/([^\/]+)$/, '$1');
        window.scrollTo(0, $('a img[src*="' + imgname + '"]').offset().top);
    });

    var new_msg = $(msgQuery);

    new_msg.on('mouseout', function() {
        $(this).removeClass('hidbord_msg_new');
    });


    new_msg.find('pre').each(function(i, e) {
        hljs.highlightBlock(e);
    });

    new_msg.find('.hidbord_msglink').on('mouseover', function(e){
        var msgid = $(e.target).attr('alt');
        msgPopupTimers[msgid] = setTimeout(function() {
            do_popup(e);
        }, 200);

    }).on('mouseout', del_popup)
        .on('click', function(e) {
            var to_msg = $('#msg_' + $(e.target).attr('alt'));
            $('.hidbord_msg_focused').removeClass('hidbord_msg_focused');
            to_msg.addClass('hidbord_msg_focused').children().one('click', function(e) {
                $(e.target).parent().removeClass('hidbord_msg_focused');
            });
            $('.hidbord_thread')[0].scrollTop += to_msg.offset().top - 100 - window.scrollY;
        });

    new_msg.find('.idntcn2').identicon5({
        rotate: true,
        size: 18
    });
};

var renderRefs = function(msgId, elm){
    "use strict";

    if(!ref_map[msgId]){
        return false;
    }

    if(!elm){
        elm = '#msg_' + msgId;
    }

    ref_map[msgId].sort(function(m1, m2) {
        var a = messages_list.indexOf(m1),
            b = messages_list.indexOf(m2);
        return b - a;
    });

    var links = '';

    for (var i = 0; i < ref_map[msgId].length; i++) {
        links += '<a href="javascript:;" alt="' + ref_map[msgId][i] + '" class="hidbord_msglink">&gt;&gt;' + ref_map[msgId][i].substr(0, 8) + '</a> &nbsp; ';
    }

    if(links !== ''){
        $(elm + ' .msgrefs').empty().append('replies: ' + links);
    }

    msgAppendListeners(elm + ' .msgrefs');

};

var messages_list = [], new_messages = 0, all_messages = {}, ref_map = {};

var push_msg = function(msg, msgPrepend, thumb, isOld) {
	"use strict";
/*var out_msg = {
    post_id: post_id,
    id: '',
    txt: {
        msg:
        ts:
    },
    keyid: '',
    pubkey: '',
    status: 'OK',
    to: []
  },*/

  msg.thumb = thumb;

  //console.log(msg);

    var prependTo = '#allgetter_button',
        txt, person = '', recipients = '',
        msgDate = new Date(),
        msgTimeTxt, i;

    if (all_messages[msg.id]) {
        $("#msg_" + msg.id).addClass('hidbord_msg_new');
        return;
    }

    all_messages[msg.id] = msg;

     if(messages_list.length > 0){
        for (i = 0; i < messages_list.length; i++) {
            if(msg.post_id !==0){
                if(all_messages[messages_list[i]].post_id <= msg.post_id){
                    prependTo = '#msg_' + all_messages[messages_list[i]].id;
                    break;
                }
            }else{
                if(all_messages[messages_list[i]].txt.ts <= msg.txt.ts){
                    prependTo = '#msg_' + all_messages[messages_list[i]].id;
                    break;
                }
            }
        }
    }

    messages_list.push(msg.id);

    if(messages_list.length > 0){
        messages_list.sort(function(m1, m2) {
            var a = all_messages[m1],
                b = all_messages[m2];
            if(b.post_id != a.post_id){
                return b.post_id - a.post_id;
            }

            if(b.txt.ts != a.txt.ts){
                return b.txt.ts - a.txt.ts;
            }else{
                if(b.txt.id < a.txt.id){
                    return -1;
                }else{
                    return 1;
                }

            }
        });
    }

    msgDate.setTime(parseInt(msg.txt.ts) * 1000);

    if (msg.status == 'OK') {
        txt = wkbmrk(msg.txt.msg, msg.id);
    } else {
        txt = '<p><strong style="color: #f00; font-size: x-large;">NOT FOR YOU! CAN\'T BE DECODED!</strong></p>';
    }

    for (i = 0; i < msg.to.length; i++) {
        recipients += '<span style="background: #fff;" class="idntcn2">' + msg.to[i] + '</span>&nbsp;' + getContactHTML(msg.to[i]) + '; ';
    }

    if(msg.contactsHidden){
        recipients = msg.contactsNum + ' hidden contacts.';
    }

    msgTimeTxt = dateToStr(msgDate);

    if(msg.senderHidden){
        person = '<b>Anonymous</b>';
    }else{
        person = getContactHTML(msg.keyid, msg.pubkey);
    }

    var isDirect = msg.contactsNum == 2;
    if(msg.isBroad) isDirect = false;

    var code = '<div class="hidbord_msg hidbord_msgfrom_' + msg.pubkey + (isOld? '' : ' hidbord_msg_new') +
            '" id="msg_' + msg.id + '" ' + (isDirect? '  style="border-left: 8px solid #090;"' : '') + (msg.isBroad? '  style="border-left: 8px solid #900;"' : '') + '>'+
            '    <div class="hidbord_mnu"><a href="javascript:;" id="hidbord_mnu_info">info</a> <a href="javascript:;" class="hidbord_mnu_replydirect">' + (msg.isBroad? 'BROADCAST' : 'direct') + '</a>'+ ((isDirect || msg.isBroad)? '': '<a href="javascript:;" class="hidbord_mnu_reply">reply</a>')+'</div>'+
            '    <div class="hidbord_msg_header hidbord_hidden" >'+
            (msg.keyid !=='' ? '        <div style="float:left; width:40px; background: #fff;" class="idntcn">' + msg.keyid + '</div>' : '')+
            '        <div style="float:left;padding-left: 5px;">' + person + ' <i style="color: #999;">(' + msgTimeTxt + ')  <span href="javascript:;" class="hidbord_mnu_reply hidbord_clickable">#'+msg.id.substr(0, 8)+'</span></i>'+
            '            <br/><i style="color: #009; font-size: x-small;" class="hidbord_clickable hidbord_usr_reply" alt="'+msg.keyid+'">' + msg.keyid + '</i>'+
            '        </div>'+
            '        <div style="clear: both; padding: 5px;"><strong>Sent to:</strong> ' + recipients + '</div>'+
            '    </div>'+
            '    <div style="overflow: hidden" class="hidbord_msg_header" >'+
            (msg.keyid !=='' ? '<span style="background: #fff;" class="idntcn2">' + msg.keyid + '</span>&nbsp;' : '') + person +
            ' <i style="color: #999;">(' + msgTimeTxt + ') <span href="javascript:;" class="hidbord_mnu_reply hidbord_clickable">#'+msg.id.substr(0, 8)+'</span></i>'+
            '    </div>'+
            '    <hr style="clear:both;">'+
            '    <div style="overflow: hidden;"><img src="'+thumb+'" class="hidbord_post_img hidbord_clickable" style="max-width: 100px; max-height:100px; float: left; padding: 5px 15px 5px 5px;"/>' + txt + '</div>'+
            '<span class="msgrefs" style="font-size: 11px;font-style: italic;"></span>'+
            '</div>';

    $(prependTo).after($(code));

    msgAppendListeners('#msg_' + msg.id);

    $('#msg_' + msg.id + ' .hidbord_msglink').each(function(i, e){
        var refTo = $(e).attr('alt');

        if(!ref_map[refTo]){
            ref_map[refTo] = [];
        }

        if(ref_map[refTo].indexOf(msg.id) == -1){
            ref_map[refTo].push(msg.id);
        }

        renderRefs(refTo);
    });

    renderRefs(msg.id);

    if(!isOld){
        new_messages++;
        $('#hidbord_notify_counter').text(new_messages).show();
    }
};

var read_old_messages = function(e) {
	"use strict";

    if (isJpegReading()) {
        stopReadJpeg();
        return true;
    }

    var i, urls = [];

    $('a[href*=jpg] img, a[href*=jpe] img, a[href^=blob] img').each(function(i, e) {
        var url = $(e).closest('a').attr('href');
        var post_el = $(e).closest('.reply');
        var post_id = 0;

        if(post_el.length === 1){
            post_id = parseInt(post_el.attr('id').replace(/[^0-9]/g, ''));
            if(isNaN(post_id)){
                post_id = i;
            }
        }

        if (url.match(/(^blob\:|\.jpe?g(\?.*)?$)/i)) {
            urls.push({url:url, thumb:$(e).attr('src'), post_id: post_id});
        }
    });

    // Support for NanoBoard
    if(location.hostname == '127.0.0.1'){
        $('img[src*=";base64,/9j/"]').each(function(i, e) {
            var url = $(e).attr('src');
            var post_el = $(e).closest('.postinner');
            var post_id = i;

            urls.push({url:url, thumb:url, post_id: post_id});
        });
    }

    if(e.shiftKey){
       urls.reverse();
    }

    for (i = 0; i < urls.length; i++) {
        readJpeg(urls[i].url, urls[i].thumb, urls[i].post_id, true, e.ctrlKey);
    }
};

var replyForm = null,
    container_data = null, container_image = null, quotedText;

function handleFileSelect(evt) {
	"use strict";

    var files = evt.target.files; // FileList object

    if (files[0] && files[0].type.match('image.*')) {
        var reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {
                  var inAB = getUint8Array(e.target.result);

                if(theFile.type != "image/jpeg" || isDobro){
                    var img = new Image();

                    img.onload = function() {
                        var o1 = 0, o2 = 0, o3 = 0, o4 = 0, q = 0.9;
                        if(isDobro){
                            o1 = Math.round(Math.random() * 10);
                            o2 = Math.round(Math.random() * 10);
                            o3 = Math.round(Math.random() * 10);
                            o4 = Math.round(Math.random() * 10);
                            q  = (85 + Math.random() * 10) / 100;
                        }

                        var buffer = document.createElement('canvas'),
                            ctxB = buffer.getContext('2d');
                        buffer.width = img.width - o1 - o2;
                        buffer.height = img.height - o3 - o4;

                        ctxB.beginPath();
                        ctxB.fillStyle = "white";
                        ctxB.rect(0, 0, buffer.width, buffer.height);
                        ctxB.fill();

                        ctxB.drawImage(img, -o1, -o3);
                        container_data = dataURLtoUint8Array(buffer.toDataURL("image/jpeg", q));
                        container_image= "data:image/Jpeg;base64," + arrayBufferDataUri(container_data);
                    };
                    img.src = "data:image/Jpeg;base64," +arrayBufferDataUri(inAB);
                }else{
                    container_data = inAB;
                    container_image= "data:"+theFile.type+";base64," + arrayBufferDataUri(container_data);
                }
            };
        })(files[0]);
        reader.readAsArrayBuffer(files[0]);
    }else{
        container_image = null;
        container_data = null;
        alert('Please select image.');
    }

}

var replytoMsg = function(e) {
	"use strict";

    var msg_id = $(e.target).closest('.hidbord_msg').first().attr('id').replace(/^msg\_/, '');
//    console.log(msg_id);
    showReplyform('#msg_' + msg_id, '>>' + msg_id);
};

var replytoMsgDirect = function(e) {
    "use strict";

    var msg_id = $(e.target).closest('.hidbord_msg').first().attr('id').replace(/^msg\_/, ''),
        usr_id = $(e.target).closest('.hidbord_msg').first().find('.hidbord_usr_reply').attr('alt');

    if($(e.target).text() == 'BROADCAST'){
        showReplyform('#msg_' + msg_id, '>>' + msg_id);
        $('#hidbord_cont_type').val('broadcast').trigger('change');
        return true;
    }

    if(rsa_hashB64 == usr_id){
        alert('So ronery?');
        return false;
    }

    if(!(usr_id in contacts)){
        alert('Unknow contact!');
        return false;
    }


    showReplyform('#msg_' + msg_id, '>>' + msg_id);
    $('#hidbord_cont_type').val('direct').trigger('change');
    $('#hidbord_cont_direct').val(usr_id);
};



var replytoUsr = function(e) {
	"use strict";

    var msg_id = $(e.target).closest('.hidbord_msg').first().attr('id').replace(/^msg\_/, '');
    var usr_id = $(e.target).attr('alt').replace(/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]/, '');
//    console.log(msg_id);
    showReplyform('#msg_' + msg_id, '{' + usr_id + '}');
};

var do_preview_popup = function(e) {
    "use strict";


    var img_thumb = '';

    if (container_image){
        img_thumb = '<img src="'+container_image+'" class="hidbord_post_img hidbord_clickable" style="max-width: 100px; max-height:100px; float: left; padding: 5px 15px 5px 5px;"/>';
    }else{
        img_thumb = '<div style="width: 98px; height:98px; float: left; margin: 5px 15px 5px 5px; border: 2px dashed #999;"/>';
    }

    $('#prev_popup').remove();
    var txt = '<div class="hidbord_msg" style="box-shadow: 0 0 10px #555;overflow-y: scroll;" alt="msg_preview">' + img_thumb + wkbmrk($('#hidbord_reply_text').val(), "00") + '</div>';

//    console.log(txt);

    $('body').append('<div class="hidbord_popup" id="prev_popup" style="position: fixed; top: -2000px; right: -2000px; width: 611px;"></div');
    $('#prev_popup').append(txt);
    $('#prev_popup .idntcn2').identicon5({
        rotate: true,
        size: 18
    });
    $('#prev_popup pre').each(function(i, e) {
        hljs.highlightBlock(e);
    });

    var px = e.clientX,
        py = e.clientY + 10;

    if (px > $(window).width() / 2) {
        px -= $('#prev_popup').width();
    }

    if (py > $(window).height() / 2) {
        py -= $('#prev_popup').height() + 20;
        if(py < 10 ){
            $('#prev_popup').find('.hidbord_msg').css('height', (e.clientY - 50) + 'px');
            py = 10;
        }
    }else{
        if(py + $('#prev_popup').height() + 10 > $(window).height()){
            $('#prev_popup').find('.hidbord_msg').css('height', ($(window).height() - py - 50) + 'px');
        }
    }

    $('#prev_popup').css('right', '50px').css('top', py + 'px');

    $('#prev_popup .hidbord_msg').on('mouseover', function() {
        clearTimeout(msgPopupTimers.msg_preview);
    }).on('mouseout', del_popup);

};

var bytesMagnitude = function(bytes){
    "use strict";
    if(bytes < 1024){
        return bytes + ' B';
    }else if (bytes < 1024 * 1024){
        return (bytes / 1024).toFixed(2) + ' KB';
    }else{
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    }
};

var do_imgpreview_popup = function(e) {
	"use strict";

    $('#file_selector').remove();
    if (!container_image) return;
    var txt = '<div class="hidbord_msg" style="box-shadow: 0 0 10px #555;"><img style="max-width: 200px; max-height: 200px;" src="' + container_image +
              '"><p style="text-align: center; margin: 0; font-size: x-small;">' + bytesMagnitude(container_data.length) + '</p></div>';
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    $('body').append('<div class="hidbord_popup" id="file_selector" style="position: fixed; bottom: -2000px; left: -2000px;"></div');
    $('#file_selector').append(txt);

    var px = $(e.target).offset().left,
        py = $(window).height() - ($(e.target).offset().top - window.scrollY);

    $('#file_selector').css('left', px + 'px').css('bottom', py + 'px');

    $('#file_selector .hidbord_msg').on('mouseover', function() {
        clearTimeout(popup_del_timer);
    }).on('mouseout', del_popup);

};

var prev_to = null, prev_cont = null;

var showReplyform = function(msg_id, textInsert) {
	"use strict";

//    console.log(msg_id, $(msg_id));
    if (!replyForm) {
        $(msg_id).after('<div class="hidbord_msg" id="hidbord_replyform"><div style="height: 40px;">' +
            '  <div style="float:left; width:40px; background: #fff;" class="idntcn">' + rsa_hashB64 + '</div>' +
            '  <div style="float:left;padding-left: 5px;">' +
            '    <strong style="color: #090; font-style: italic">Me</strong><br/>' +
            '    <i style="color: #009; font-size: x-small;">' + rsa_hashB64 + '</i>' +
            '  </div>' +
            '  <div class="hidbord_mnu"><a href="javascript:;" id="hidbordform_hide">hide</a></div>' +
            '  </div>' +
            '  <hr style="clear:both;">' +
            contactsSelector()+
            '  <div>' +
            '    <div style="margin:  3px;">' +
            '      <div style="width: 590px;">' +
            '        <input type="file" id="c_file" name="c_file" style="max-width: 300px;" alt="file_selector">' +
            '            <span style="float: right;" id="hidbordTextControls">' +
            '              <span title="Bold"><input value="B" style="font-weight: bold;" type="button" id="hidbordBtBold"></span>' +
            '              <span title="Italic"><input value="i" style="font-weight: bold; font-style: italic;" type="button" id="hidbordBtItalic"></span>' +
            '              <span title="Strike"><input value="S" style="font-weight: bold; text-decoration: line-through" type="button" id="hidbordBtStrike"></span>' +
            '              <span title="Spoiler"><input value="%" style="font-weight: bold;" type="button" id="hidbordBtSpoiler"></span>' +
            '              <span title="Code"><input value="C" style="font-weight: bold;" type="button" id="hidbordBtCode"></span>' +
            '              <span title="irony"><input value=":)" style="font-weight: bold;" type="button" id="hidbordBtCode"></span>' +
            '              <span title="Quote selected"><input value=">" style="font-weight: bold;" type="button" id="hidbordBtQuote"></span>' +
            '            </span>  ' +
            '      </div>  ' +
            '      <textarea style="font-family: monospace; max-width: none; margin: 2px; width: 580px; height: 136px; resize: vertical; background-image: none; background-position: 0% 0%; background-repeat: repeat repeat;" id="hidbord_reply_text"></textarea>  ' +
            '      <div style="width: 590px;">' +
            '        <span>Hide: <label><input id="hidboard_hide_sender" type="checkbox" checked/> sender</label>; <label><input id="hidboard_hide_contacts" type="checkbox"  checked/> contacts</label></span><br>'+
            '        <input type="button" value="crypt and send" id="do_encode">  ' +
            '        <span style="float: right;"><a href="javascript:;" id="hidbordform_preview" alt="msg_preview">message preview</a></span>  ' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>');
        replyForm = $('#hidbord_replyform');

//        console.log('ddd', $('#hidbord_replyform'));


        if(!hidboard_hide_sender){
            $('#hidboard_hide_sender').attr('checked', null);
        }

        if(!hidboard_hide_contacts){
            $('#hidboard_hide_contacts').attr('checked', null);
        }

        $('#hidboard_hide_sender').on('change', function() {
            hidboard_hide_sender = !!$('#hidboard_hide_sender').attr('checked');
            ssSet(boardHostNameSection + '_hidboard_hide_sender', hidboard_hide_sender);

        });

        $('#hidboard_hide_contacts').on('change', function() {
            hidboard_hide_contacts = !!$('#hidboard_hide_contacts').attr('checked');
            ssSet(boardHostNameSection + '_hidboard_hide_contacts', hidboard_hide_contacts);
        });

        $('#hidbord_cont_type').on('change',function(){
            $('#hidbord_replyform').css('border-left', 'none');

            if($('#hidbord_cont_type').val()=='direct'){
                $('#hidbord_cont_direct').show();
                $('#hidbord_replyform').css('border-left', '8px solid #090');
            }else{
                $('#hidbord_cont_direct').hide();
            }

            if($('#hidbord_cont_type').val()=='broadcast')
                $('#hidbord_replyform').css('border-left', '8px solid #900');

        });

        if(prev_to !== null){
            $('#hidbord_cont_type').val(prev_to).trigger('change');
            $('#hidbord_cont_direct').val(prev_cont);
        }

        $('#hidbord_replyform .idntcn').identicon5({
            rotate: true,
            size: 40
        });
        $('#hidbord_replyform #c_file').on('change', handleFileSelect);
        $('#hidbord_replyform #do_encode').on('click', do_encode);

        $('#hidbord_replyform #hidbordform_preview').on('mouseover', function(e){
            var evt = e;

            msgPopupTimers.msg_preview = setTimeout((function(e){ return function(){
                do_preview_popup(evt);
            };})(e), 200);
        })
            .on('mouseout', del_popup);

        $('#hidbord_replyform #c_file').on('mouseover', do_imgpreview_popup)
            .on('mouseout', del_popup)
            .on('click', function() {
                $('#hidbord_popup').remove();
            });

        $('#hidbord_replyform #hidbordform_hide').on('click', function() {
            $('#hidbord_replyform').hide();
        });

        $('#hidbordTextControls').on('mouseover', function(e) {
            //quotedText = window.getSelection().toString();
            quotedText = quoteSelection(window.getSelection().getRangeAt(0).cloneContents());
        });

        $('#hidbordTextControls input').on('click', function(e) {
            var mode = $(this).val(),
                ta = $('#hidbord_reply_text'),
                taStart = ta[0].selectionStart,
                taEnd = ta[0].selectionEnd,
                taPost = ta.val().length - taEnd, tag, selected, parts;

            if (mode == '>') {
                if (taStart !== taEnd && quotedText.length === 0) {
                    quotedText = ta.val().substring(taStart, taEnd);
                }
                if (quotedText.length > 0) {
                    //quotedText = '> ' + quotedText.replace(/\n/gm, "\n> ") + "\n";
                    ta.val(ta.val().substring(0, taStart) + quotedText + ta.val().substring(taEnd));
                }
            }

            if (mode == 'B' || mode == 'i' || mode == 'S' || mode == ':)') {
                tag = mode == 'B' ? '**' : '*';
                tag = mode == 'S' ? '--' : tag;
                tag = mode == ':)' ? '++' : tag;
                 selected = ta.val().substring(taStart, taEnd).split("\n");
                for (var i = 0; i < selected.length; i++) {
                    parts = selected[i].match(/^(\s*)(.*?)(\s*)$/);
                    selected[i] = parts[1] + tag + parts[2] + tag + parts[3];
                }
                ta.val(ta.val().substring(0, taStart) + selected.join("\n") + ta.val().substring(taEnd));
            }

            if (mode == '%' || mode == 'C') {
                tag = mode == '%' ? _spoilerTag : '`';
                var tagmultiline = mode == '%' ? _spoilerTag : '``';
                selected = ta.val().substring(taStart, taEnd).split("\n");

                if (selected.length > 1) {
                    selected = "\n" + tagmultiline + "\n" + selected.join("\n") + "\n" + tagmultiline + "\n";
                } else {
                    parts = selected[0].match(/^(\s*)(.*?)(\s*)$/);
                    selected = parts[1] + tag + parts[2] + tag + parts[3];
                }
                ta.val(ta.val().substring(0, taStart) + selected + ta.val().substring(taEnd));
            }

            ta[0].selectionStart = ta.val().length - taPost;
            ta[0].selectionEnd = ta.val().length - taPost;
            ta.focus();
        });
    }

    $('.hidbord_thread')[0].scrollTop += $('#hidbord_replyform').offset().top - window.scrollY - $(window).height() + $('#hidbord_replyform').height() + 50;

    if (textInsert) {
        insertInto(document.getElementById('hidbord_reply_text'), textInsert + "\n");
    }

    $(msg_id).after($('#hidbord_replyform'));
    $('#hidbord_replyform').show();
    $('#hidbord_reply_text').focus();
};

var insertInto = function(textarea, text) {
      "use strict";

      if(window.getSelection().focusNode !== null){
            quotedText = quoteSelection(window.getSelection().getRangeAt(0).cloneContents());
      }else{
            quotedText = '';
      }

      if (quotedText.length > 0 && quotedText != '> \n'){
            text += quotedText;
      }

      if (textarea.createTextRange && textarea.caretPos) {
            var caretPos = textarea.caretPos;
            caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == " " ? text + " " : text;
      } else if (textarea.setSelectionRange) {
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;
            textarea.value = textarea.value.substr(0, start) + text + textarea.value.substr(end);
            textarea.setSelectionRange(start + text.length, start + text.length);
      } else {
            textarea.value += text + " ";
      }

};

var imoticons = {                                                                        
    // Dolls
    "gin":  '<img class="hidbord_imtc_gin"  style="vertical-align:bottom;" alt="Suigintou"   title="Suigintou"   src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUA2XIAAAAICBggICAgIECAIEBAQEBQUHDAQIBgYICYmKCwsLDwqIDIyMj40KDg4OD48LD///9BGnM4AAAAAXRSTlMAQObYZgAAAT1JREFUOI2Vk4GOhCAMRLdQrFQF+f+fvWnxorC3m1xXSTbzOi1YXq9/BCG+ymlNgT5RRAE6CFbVPxAKzAJdmDkY8q4LiySx1ZGJIDYCTxBnZgIGWnsoGwSPEdBW79AggUOgp15ra850I+g6AD3RIG1GalAeAfVf7ateFuEBZJN+VX+sy3D3kHPNWOGRHcg6bIOyqRvtMNozoecJAGFAKiXv+FSbOWoeDwImbT0LIrWGnmbA2jjTabGmhhIg6BVvPQIorp8pndWBTDcQ44M4S1VUjBqXGAcLKj0sOUNdniUiNsLcp6HrC/IfBCyEjtQMEIrQ4zJ9ccZQNJsa6gSaGI7qIJsUvBgEaahB80lZA4fPbOACYgY2gXc7RKyC343pJE0/2kUc/HYxPMlTvct34NrI5fXx9l3Vvt1gJ4Z/P5jeENMXpCU2AAAAAElFTkSuQmCC"/>',
    "kana": '<img class="hidbord_imtc_kana" style="vertical-align:bottom;" alt="Kanaria"     title="Kanaria"     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAARVBMVEUAAFsAAADAACBAMBAoSDiwOBggYEDwIGBwYDBYeGjggDBQwFDgoIDQsCCwsLCouLDwwJDIyMj/0HDw4KD46EDg//D///+VBTP8AAAAAXRSTlMAQObYZgAAAUJJREFUOE99k4uOhCAMRadOdQWtDg/7/5+6t5DJgMNuY2LMOS0F6uPRBr3jMQ7yMUa1Z6jUXO9Vow4UIudOCwcFBpSeV1oMNzAabkYsBnW8M7x12pagyp1rjLYEuYuNXRcU1VNDLFvxb4PAmGu65qxZgu/WIKu6786ckGUSCFaiEZwJRdFt+pm2ULroBN5TKoqiQsBZgH96cHwyUapKALd9oI3PNiAcJiS7DvATZ9ULjo/FhJ3owNddsEV0MyEtqm7HxcWOm5BKhbQtml749DC62+JXqhUWcGbMju+447eRXuiA/V04zaiB0/ousNLJ8vRrFrF8cLpxTBzlNecsln+fawhKJDqriBDL90gTBHCMaxaSnAdDTxJmDyMIPdc1DGrMoGTGoTrgxZjJDHsPuPWBRCjz33/m0wiNFygCNd5/0fNfXQoanYE5/8sAAAAASUVORK5CYII="/>',
    "desu": '<img class="hidbord_imtc_desu" style="vertical-align:bottom;" alt="Suiseiseki"  title="Suiseiseki"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAP1BMVEUAAAAAAAAgICAgcDBQUFBQsFBwMBiAACCgUCiggFCwsLDIACDIyMjQgEjQwJDgoIDwwJDw4KD/0JD//9D///+7VQVaAAAAAXRSTlMAQObYZgAAATVJREFUOMuNk41uwyAQg+s7uEFG29Dy/s86HyRr/qTNrRIp/mIfQdxu/xc+urZLKW2oXCDI1MPFOxmc/MfbfxRvOU8Hwv336mde8jTtCPTkXuCYh5SCrZ9zurtSeuQO7Qnk1/0jh7zkQ4BvpxflbkeMdRsCy3OnrHNObOYEU50x/p82MnypvzMQsNWvg0is2MyYjADgfn12wrY+CaM5wX3fqjPAnUo2fVUXMHnlAeAY1r47oK0ZKy+AOhKiNg57BpLNdSRovV8AJLAQdeaKrgDDPMQGGDfv0GHQElqLqkStf5hDhEJIxKjdT8kOBAokBBGBRif4PXcEZqjEoKqsaqPDdgBUI9WJucI7dr7w/bgSFCP2myEaQwgLIYTsuIgeEFxCX85nC0tAzxBcn10JSwT+Ot+bZz9jXxTtNyme7QAAAABJRU5ErkJggg=="/>',
    "boku": '<img class="hidbord_imtc_boku" style="vertical-align:bottom;" alt="Souseiseki"  title="Souseiseki"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEUAee4AAAAQEECAACAgICAgIHDIACBAMBBgMBhAQLBQUFAgcDCQUCjAgEhQsFDgoICwsLDwwJDIyMj/0JDw4KD///+Dfr0YAAAAAXRSTlMAQObYZgAAARJJREFUOE9909F2gyAQBFBGoQEKVRH+/1e7u0Qrce2c+BDnCpizMeYMjhg1QIzRSlQDa0+gEVgXQnAcXcCdoJNPARePdDICPuCxvRUzDeBaH2aacOnlbqakdBp7AfQ9pX1PWdIN8CfAPTd533e50ihAvYCu+Ep++M1BN+RuOlUXJ0ieALCQ8Cz444f39Mh+xUKCH3wvYS4BLbJ+17r4BVhxB7xL+6kk6twab/TRM6i0AuVrVgGJTfo6zzVnf+t5ibeo2+0AAui1th5lfRFwLbZGgwO1p5GBbbEUFmq/wlmZC5SmDXWBCzZEnsuiCwKBB1dE1QRv3kf74c8FbpwArTZyDt7psTd4cYVWHlfAxf2Xsf8FygMQo/h1y8kAAAAASUVORK5CYII="/>',
    "dawa": '<img class="hidbord_imtc_dawa" style="vertical-align:bottom;" alt="Shinku"      title="Shinku"      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAP1BMVEVQFIoAAABIABiAACDAACBAMBAIQBggSJAgcDBwYDDgQFCgcBCAkOhQsFDgoIDQsCCwsLDwwJDw4KD46ED///9aMd6UAAAAAXRSTlMAQObYZgAAAUtJREFUOMt9k9F2wyAMQ5HJElZG3AD//62ToUsgW6fTvKCLbWrbuSa85N4Iy+I9f/KGMZ82JbJ0Zg4HL/TUFGUJgabnHYwBaBeqESkEsZwDQL+81AlmFMGQ4fSN8ImEXAEIoAxSCzGWQEIrz08i+hCYYgRKqVqrIe0TAxAxAuaQqe0TH/wMaAd+IigBgQ5AnIEiwccRIBEjMACr1xmAxif23TAYvYqiTO9EfG457/sOPFH0wb7egfqVTVutseiqv4G8NeBrIxBWuBFgTMQj9whbjkrfDUWa704iH82fCf5rrP/o0j5LPDwJNCKkR0g2e3YOC4srBe9bC1PiXDbfbIwpIhYEnzhG4pcegT3B9Urs5thg28DiVdjQC5hvsuU48vzMFqH7fTks+61XDv1+Z9pAT0RfjguRXsRt/z4/WF9P9PcSo72uce4/3exvFKwVxEkt3zgAAAAASUVORK5CYII="/>',
    "hina": '<img class="hidbord_imtc_hina" style="vertical-align:bottom;" alt="Hinaichigo"  title="Hinaichigo"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUAAAAAAACAACDAACCwIECwOCBQYCDgUIDggED/gLCgsCDgoICwsLDwwJDIyMj/4Fjw4KD///9e6IJJAAAAAXRSTlMAQObYZgAAAShJREFUOMt9k4GSgyAMRF0hBioK+f+fvQ1Or5bSZoQR97GBMVmWZwDLz4DqhWBOQnN2BAQVX/QcNSlf8oRA9O/9YcSETyBGjVmjO2j8IODfEqfYDcgOBGKqPVL00BFAMmr1yVCv6Y1ArZbMHOnD9RFwhYz14as3AukC6v8YAUkTQPDSISLADZCa5GUBwkkK9t0xh4X7b0mYgR5la23fdye4W4YcBOzRPDYrqDLoTChoWwceG6/pKeR+CBI42uWwNQLiHvd74kW0w29AaPhdPP9xBaQ7jCWBrKuG4PUAt/8sGYWuOQcvyYm8YKV+rtSRp0W7s2yDBS/YPCeY/LTTRc3rgWndWzECawhl1jooZwFOs7OUeRNShU/la5MiuAI7vwK4cT/7/G31B+WEEQqkVXnPAAAAAElFTkSuQmCC"/>',
    "kira": '<img class="hidbord_imtc_kira" style="vertical-align:bottom;" alt="Kirakishou"  title="Kirakishou"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEUTkgAAAABQUBBQYCCgSGCQUNDgYMCgoCDAkPCgsCDgoLCwsLDwqID/oPDIyMj40KD/4OD/4P/48LD////MJAo5AAAAAXRSTlMAQObYZgAAASxJREFUOI2Nk4FyhCAMRG8l0jOKBvj/f20CnorUtnF0RvexZAFfr/8W8Ie+zrjUTwaOWax4cmvuEbBMIlSRvJKg002RWuz0Hb1+1MS4WUBuxcRoDPLpXwG0gEjmnHlvw+4OsK/K5HL3AFfg2YFYnKWbPkDbg74Q0Ti604FagACmeR0XItsI0pS4rIPBCqz5nZZlAWYU4LRQAwPG9Z20hpy1I12n1kIBN5qevgaLSXwlag9b0dMwpA4oMQ4ibVS2QnAPiq0W6fBicEmqkxAWH0JIaYERqoq0OQJiijEgRJ2v6Aew6z74GIIvhF62nB9Ada96jL5Y7AS1Z0oHemOCEluy5PdjG712oaNtFsvUHjojNt0HbJoEddb+1yhK9I//ICLKMzwRu2flfqtW/wYUCRWXoJ+EwQAAAABJRU5ErkJggg=="/>',
    "bara": '<img class="hidbord_imtc_bara" style="vertical-align:bottom;" alt="Barasuishou" title="Barasuishou" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEUT7wEAAAAwEGBIIHBgKMhQUBBQUJCQUNCQYP+goCDAkPCoqOCwsLDwqIDIyMjwwMD40KDg4P/48LD///+GZc+gAAAAAXRSTlMAQObYZgAAAS1JREFUOI2Nk4F6gyAMhD1kYTNIhbz/uy4BXQ3d+i1W+un9XA6VZflvAe9VxIBbzbqUDDBXK2YOcYb0sqs0kBhyEfFE14eF/qPMDpd0I3yIWmfCdQDL038UHKEGwiJ8xrATBA9UzlUZ6acB7FvYtOwcPEBsd9XkAtgBekFE9qzyBZAHTKSMfadRlQkVd4PFgI/W9hxDzOjA00INDJCv1loJMRRNRDxZKNDUoclniMUy8J0YGY5mJVLaC9CXcRGtHRbS6YMAjlGk07vBtNAtpbDpsG2wBvyyjoStJQVSUsD0+tPk1Ndk+oqkFnrY47yAU9cG+kM6CfIfXdcf5oF0NAs1ffsw/dGJddWXZ0Gcrs4PQAlLKdb1ZfdoDh229ZeddTVBH9Nfu/ScN7h35fVvme0V/RH1ka4AAAAASUVORK5CYII="/>',

    // Other
    "meat": '<img class="hidbord_imtc_meat" style="vertical-align:bottom;" alt="MEAT" title="MEAT" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUAAAAaGhpQPCeEQCJlSzJ9XD6xVCx9ZDWJYTjsT0/vcHC1km//jIzTvpbqtrb/xsbu5Mj///8aEgzRAAAAAXRSTlMAQObYZgAAAQ5JREFUOMvdkkF2AjEMQzGBzEjR2OL+l+0ilGYecIFqGf2nJLYul/+pmPpue+oLEnalqLQdH/1KEUA66xMRnj5M5gcgXIRI0gTfI8IlAiJZIt4inj4gKUXiDES4JJIklKLIFYiwi5QkkVkktV4RdiUAzfyqmsNav0/O90GSCKadC5AkHvaxkyIFgHaP5fnC43rbtmMXCYqks8Ua4OsYwDbuxCTcF0CAtwEA406SoOov4BJOYDvGAMZtJwGw3FagCGzHcYzbXe/+JeQksW23631PklluJ6Cnk0+5spytt3XOvacrCYCyneqtnxfVO/LZxWm386ajd0z1Lvbe2ltVXgAotg+NjvgFOr8V/qXz+Q8AHxMKCeGrDgAAAABJRU5ErkJggg=="/>',
    "cake": '<img class="hidbord_imtc_cake" style="vertical-align:bottom;" alt="Delicious Cake" title="Delicious Cake" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAArlBMVEUAAAAAAAA4GRQ5GRRBHBtUIyqlJRSmJhSmJxV5OS6oLx1rQDerNiXUOyt9VkzZQzXfQzXiQzXlQzTmQzTmRDXnRDXjRziNal+rZETkVkesaEnhbF3CejXCejbEfDXAe2u4gmf+b125g2n/cF6th3iuiHmviXrChHSxjX63loe7m4zhn1jkolnlo1r/mrrWtqfSvK3Tvq/Vv7DVwLHe0L3e0rvg08Dz89j09Nn09O0mCXiuAAAAAXRSTlMAQObYZgAAASZJREFUOE/tkNlWwzAMRGuDG/ZdEDZDG8TasA1Q+/9/DElN2oTTwxtvzEsSzc2M7MHgX3+jEMLvPtFwKREaFamaLCNCMqGoqvpwGMKq933Aw3wUVNOk2PhIqU94oCxZESY64vsveeU+wTGWqStGH4h1HVkCzPxkhtR1CU8UBSh5ap6qoB4gC5JCU/Gv1vdIgKoDOEmgVIH45gx32zQiUsC1toOPSRKAdzrFye7ouSKtgDPEIWdfR0Po+AE7+wbIkjlDCMfytFPIBng5x9YBVZrm5cfMzgKQvSLCvD4Ca5vqw2dYhAHaosjkctycktkDTYcRDfJ03dpzX5bQMh1nv3Ixxq26ATbk2TEWyJs3obUXN6E3nDvSlrk9Q2ZQu6F+D37KdbSYfgM6VkDcNJNUdAAAAABJRU5ErkJggg=="/>',
    "tea":  '<img class="hidbord_imtc_tea"  style="vertical-align:bottom;" alt="A cup of Tea" title="A cup of Tea" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAM1BMVEX4WBgAAQBDRUL/GgBUVVN2eHX/ZDSHiYb/mAD/mTSpq6i5u7j/zAbKzMnc3tvt7+v+//ytxHIVAAAAAXRSTlMAQObYZgAAAPpJREFUOMvtktluxDAIRU1qjx3wwv9/bS/eklTpQ997pZESnSMGCM7958+hld+orrw4ndaV7jy5aillC3juZbZFhi9jvGisVWgJgpyfldNeVSJCU2DgrytQWA/nZAlF653DUJWb4Cij813jc6LnBO42p5qydT5TmFM6qM4C2IGPtcAoGc1lAU3xqJtra81juJyS/SQnZo5e4uY2uh/j23zSufdcKs0Cl7F5YPCqNP+hmSHTuHi7BIR9EBM4BnDDbQisQymF/Qhw55i3N8FFV5V7bB1z0ZH7kp4UOO6vDYVvi7TjQKf3myFC24+En1eH6wlxJbwfLtHbWX8D14kVhZIALoUAAAAASUVORK5CYII="/>',
 "sarcasm": '<img class="hidbord_imtc_sarcasm" style="vertical-align:bottom;" alt="SARCASM!" title="SARCASM!" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAuBAMAAACoiUZDAAAALVBMVEUAAAAQEBD/AACDWgCUWhAAqQB7e3vmpFLetFL/1Ur23ove3t7/5qT/7r3///8MKkFGAAAAAXRSTlMAQObYZgAAAbpJREFUKM9t071q40AQB/BdzrjWkIOVD/wKByaF7wIJDhEYN3mEAz3CgmBwKdwsBhciAjOQxqQxgXR5iQM1xk0QbBO4KuBnuP3QSrr4pvzt/PdjkBjrV8qGEftcKUvPEYbAzpGfNzKeDtN/IDHFI+jlB7NkSbRN+sYW5WNVEVHSj9Kiqqrfprc7aEAleSTZhWlBPk5FiyP6as9xFXXpm9PcHm6WAnIq3r+/EmUns5S1W3q8//PrleQsbFncfNxNHG5vyxYfYPw2yk4f89uyOV9QUdS6XokkyYpwKYHy+qif1rmJlLT1m3KcaK3Vpl6h7F56oS3qN4Giw2/a1Q7lyGDz/LHHHITpxAbjF2smjfNli3xjcW8RMSADo/scfTU4WIJSufiERADBMApjMhUM2snb2rostJOnnnq75A1Si18ux0C91swOievrA/VbAWZssrnSPwPKKaLAjMWxevGn04TGR4uScaXWR2cP+kIfLEYW1c59HoUZygEz96RYqedpg/UKpu5JNi/QYW1Swt8+Vusnd229N7OSfh6mdefRNEL4wEDlAHOUJp33fh+zPAD4odT5bxSr//xvPNhf1sQYU21hKHsAAAAASUVORK5CYII="/>',
    "slow": '<img class="hidbord_imtc_slow" style="vertical-align:bottom;" alt="Slow Poke" title="Slow Poke" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAgCAMAAACB1hBXAAAAM1BMVEWUcoIAAAAQEBB7ITH/AACtQlKMWhlrY2MAqQDeY3v/hJTepWP/paXvxYzWzs7/5rX///8p8wWNAAAAAXRSTlMAQObYZgAAAbNJREFUOMudlYGSgyAMRCU02MBJ8/9fe5sgSq0619tpRws8NgnRTpOLmeP0vThD1O5l15+wnKNTuPlpyiJ8z0kDBeGGDWso33KwkbY+gwyBhVcQvy+5gIDiHl0Q9+5gvgFpjw4Oa7or1hK/MOzVyGum+FDuugo1aJU8SCIh5Z0DGM7OhVXfuOinF4cR9ngOaNDHo58EjgLEkcNwSySPJNfOiapWC1H8u1Eiezw8cGVZSsGCqgbCjojkXfwBlrK8TKXA7vlU5eb2oW7fwJWClnLH8Qpa5sDShgFMPU5b9cltApiKre9kSlRZzjWMs3GL6dV8UR5KN1xn0UCUTIZ6bQBecFH6yXqgUbQuSzI/uJV0yYU3DkWiYrEmp8j9cHx8xm2DwbicLLyCmpBfqXX0geTAcd9jsi6U5IDWhuWxvzbRXLOM6fkClMZNC1E+5YDVuttN3Zu8rlT1vZ03zQoubxjOwW/R0ZWwJy6nxfSZlVuffm99exIqWZvpESHTrJ0bXho2YcTs9CEvf43P3rgAP/4OsOU8zTN2iHE0arPNDnO37+8YB6TtCgz7fi1S+gdlWRwGfgHYqi1M874NxAAAAABJRU5ErkJggg=="/>',
    "shit": '<img class="hidbord_imtc_shit"  style="vertical-align:bottom;" alt="Shit"   title="Shit"   src="data:image/gif;base64,R0lGODlhEAAQAKIFAAAAAHspCJxCGL1jOf///////wAAAP///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAFACwAAAAAEAAQAAADRli63ArPLTgHpLKAES742CSAQ1mGmqAKXMCiWiDLgIqCeG1PgbmuHR6rNaM9ZMMcLjYyOUs2gOv5FHSkvyzwU+x2PUplIQEAIfkECQoABQAsAAAAABAAEAAAA0hYutwNDsYhHQMjQMB5FN0gipUCCKiQBWppBjB8gsvW3WkFBCM6C5oaSxQrSnZDyu1W2KFGUJHPGY0COaxcaqtBFr8x23IMSQAAIfkECQoABQAsAAAAABAAEAAAA0dYutwNCjoGhpyrBgh6d4DgDSR5RUIqDEGwnlErh+Lj3eoFBKWqbpLdiiWbxUKm260gHJpKg1THBa1GgS6fNoUteoscpfiTAAAh+QQJCgAFACwAAAAAEAAQAAADR1hasP6rOQnBoDCO0ID3zCR8Q1lijKAKW8CiTCDLgIp+eG1HgbmOAg6P1ZrRFAAZMYeLqUzQki1JjPo4VN3vhzV6vR2muJAAACH5BAkKAAUALAAAAAAQABAAAANHWLrcDQw+BYZ0cQQIeneA4A0keVFCKmjBykVBHIfi493qBQSlqm6L3Yolm1Fiw5uyIKyUnoNUpwWFCjZCn9SHLXq9HKX4kwAAIfkEBQoABQAsAAAAABAAEAAAA0hYutwNwEkwYmRX0WAhdIDgDSSZWUIqDEGwZgvQzqH4eLh6BqWqcjEXaUa8yIQVHK4gS5WepBQESYEOBJymb5vKEr/fjnIcSQAAOw=="/>',
    "flagofsouthkoreaalsoknownasthetaegukgi": '<img class="hidbord_imtc_flagofsouthkoreaalsoknownasthetaegukgi" alt="Flag of South Korea, also known as the Taegukgi"   title="Flag of South Korea, also known as the Taegukgi"   src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHCSURBVChTTVFLS+tAFM401bSJbdOHkSRX8FENik/qwrWiLf4A8e7uD/De61ZEC+5duLB/QsVVF4L4XBV8oOKii4io1D4STK9KrZmb8SRR8WPOzBnm++acj4OqtRfqGyzLcnY3+4hPYAgPPAd9LKzCze3V2XkDQUEfx7NsiOPCXMBP05fHJ3eq2hwKCXwEBF7340qlks1mjUcjJgid7e1EVQnGJB4vFEubmxt8OByNRH60tmK3AiHEMAzTNIdHEp2SSFZWyNwc+TNLlhbahObJqSlN0x6KRaBBBQQeAowfZOVymQ0E0M6+b22VmOYz9tTrb/yvmX8zP6sVTZIlhNBN4d7rugR1LBaDZFsLJjBtevzLw38LdWbh7nSQYThZAgKFELQEApsN0HW9iWNflP7fyjzd2HDLCMZrXU1MKrUnTa+KoohAY3uwLGDn8/lMJgO+U0P+rtH4PR2haq/jfY0TY/Lu7l46nc7lcq4Hr90QRbEsC/eDw6Oe3p7F6e6LEQb/J/1tzPV1fn1jKxqN8jwPBLclu4Isy8lkslQqCYII+oEOWw9oaZFSqRQIFEVx5kqhB13/Psivg8JO4gyawhg7bIh3hTEZN0YoEVIAAAAASUVORK5CYII="/>',

   // Text
   "elita": '<span class="hidbord_imtc_elita" style="font-family: comic sans ms; font-style: italic;"><font style="font-size:32px" color="#ff0000">YA</font><font style="font-size:33px"> </font><font style="font-size:33px" color="#ff2b00">e</font><font style="font-size:26px" color="#ff5500">l</font><font style="font-size:40px" color="#ff8000">i</font><font style="font-size:20px" color="#ffaa00">t</font><font style="font-size:33px" color="#ffd500">a</font><font style="font-size:31px" color="#ffff00">,</font><font style="font-size:45px"> </font><font style="font-size:41px" color="#d4ff00">a</font><font style="font-size:25px"> </font><font style="font-size:28px" color="#aaff00">t</font><font style="font-size:33px" color="#7fff00">i</font><font style="font-size:50px"> </font><font style="font-size:21px" color="#55ff00">h</font><font style="font-size:24px" color="#2aff00">u</font><font style="font-size:47px" color="#00ff00">i</font><font style="font-size:39px" color="#00ff2b">!</font><font style="font-size:33px"> </font><font style="font-size:22px" color="#00ff55">S</font><font style="font-size:46px" color="#00ff80">a</font><font style="font-size:27px" color="#00ffaa">s</font><font style="font-size:41px" color="#00ffd5">a</font><font style="font-size:48px" color="#00ffff">i</font><font style="font-size:27px"> </font><font style="font-size:44px" color="#00d4ff">r</font><font style="font-size:38px" color="#00aaff">a</font><font style="font-size:47px" color="#007fff">i</font><font style="font-size:24px" color="#0055ff">n</font><font style="font-size:27px" color="#002aff">b</font><font style="font-size:39px" color="#0000ff">ow</font><font style="font-size:37px" color="#2400ff">,</font><font style="font-size:40px"> </font><font style="font-size:21px" color="#4900ff">l</font><font style="font-size:44px" color="#6d00ff">a</font><font style="font-size:29px" color="#9200ff">l</font><font style="font-size:21px" color="#b600ff">k</font><font style="font-size:26px" color="#db00ff">a</font><font style="font-size:41px" color="#ff00ff">!</font></span>',
   "not4u": '<p class="hidbord_imtc_not4u" ><strong style="color: #f00; font-size: x-large;">NOT FOR YOU! CAN\'T BE DECODED!</strong></p>'
};

var the8ball = [
    '<span class="hidbord_imtc_8ball" alt="It is certain" title="It is certain">Бесспорно. </span>',
    '<span class="hidbord_imtc_8ball" alt="It is decidedly so" title="It is decidedly so">Предрешено. </span>',
    '<span class="hidbord_imtc_8ball" alt="Without a doubt" title="Without a doubt">Никаких сомнений. </span>',
    '<span class="hidbord_imtc_8ball" alt="Yes - definitely" title="Yes - definitely">Определённо да. </span>',
    '<span class="hidbord_imtc_8ball" alt="You may rely on it" title="You may rely on it">Можешь быть уверен в этом. </span>',
    '<span class="hidbord_imtc_8ball" alt="As I see it, yes" title="As I see it, yes">Мне кажется - &quot;да&quot;. </span>',
    '<span class="hidbord_imtc_8ball" alt="Most likely" title="Most likely">Вероятнее всего. </span>',
    '<span class="hidbord_imtc_8ball" alt="Outlook good" title="Outlook good">Хорошие перспективы. </span>',
    '<span class="hidbord_imtc_8ball" alt="Signs point to yes" title="Signs point to yes">Знаки говорят - &quot;да&quot;. </span>',
    '<span class="hidbord_imtc_8ball" alt="Yes" title="Yes">Да. </span>',
    '<span class="hidbord_imtc_8ball" alt="Reply hazy, try again" title="Reply hazy, try again">Пока не ясно, попробуй снова. </span>',
    '<span class="hidbord_imtc_8ball" alt="Ask again later" title="Ask again later">Спроси позже. </span>',
    '<span class="hidbord_imtc_8ball" alt="Better not tell you now" title="Better not tell you now">Лучше не рассказывать. </span>',
    '<span class="hidbord_imtc_8ball" alt="Cannot predict now" title="Cannot predict now">Сейчас нельзя предсказать. </span>',
    '<span class="hidbord_imtc_8ball" alt="Concentrate and ask again" title="Concentrate and ask again">Сконцентрируйся и спроси опять. </span>',
    '<span class="hidbord_imtc_8ball" alt="Don’t count on it" title="Don’t count on it">Даже не думай. </span>',
    '<span class="hidbord_imtc_8ball" alt="My reply is no " title="My reply is no ">Мой ответ - &quot;нет&quot;. </span>',
    '<span class="hidbord_imtc_8ball" alt="My sources say no " title="My sources say no ">По моим данным - &quot;нет&quot;. </span>',
    '<span class="hidbord_imtc_8ball" alt="Outlook not so good" title="Outlook not so good">Перспективы не очень хорошие. </span>',
    '<span class="hidbord_imtc_8ball" alt="Very doubtful" title="Very doubtful">Весьма сомнительно. </span>'
];

var imRegEx = new RegExp('\\[(' + Object.keys(imoticons).join('|') + ')\\]', 'gi'),
    fix_rand;

function get8ball(){
    "use strict";
    fix_rand = sjcl.codec.bytes.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(fix_rand)));
    return the8ball[fix_rand[0] % 20];
}

function cleanUrl(url){
    "use strict";
    return url.replace(/\"/g, '%22').replace(/</g, '%3C').replace(/\>/g, '%3E').replace(/\'/g, '%27');
}

var wkbmrk = function(in_text, for_id) {
    "use strict";

    savedURLs = [];
    savedCode = [];

    fix_rand = sjcl.codec.bytes.fromBits(sjcl.hash.sha256.hash(sjcl.codec.hex.toBits(for_id)));

    var lines = in_text.split(/\n|\r|\n\r|\r\n/),
        i;

    for (i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(/\s+$/, '');
    }

    while (lines[0] === '') {
        lines.shift();
    }

    while (lines[lines.length - 1] === '') {
        lines.pop();
    }

    var res = '',
        is_pre = false,
        is_spoil = false,
        num_pre = 0,
        num_spoil = 0; //   return lines.join("<br/>\n");

    for (i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(/\s+$/, '');

        if (lines[i] == _spoilerTag) num_spoil++;
        if (lines[i] == '``') num_pre++;
    }

    num_pre = Math.floor(num_pre / 2) * 2;
    num_spoil = Math.floor(num_spoil / 2) * 2;

    var listel = [],
        laslist = '',
        needbr = "<br/>";

    for (i = 0; i < lines.length; i++) {
        if (lines[i] == '``' && !is_pre && num_pre > 0) {
            res += '<pre>';
            is_pre = true;
            num_pre--;
            continue;
        }

        if (lines[i] == '``' && is_pre) {
            res += '</pre>';
            is_pre = false;
            num_pre--;
            continue;
        }

        if (is_pre) {
            res += safe_tags(lines[i]) + "\n";
            continue;
        }

        if (lines[i] == _spoilerTag && !is_spoil && num_spoil > 0) {
            res += '<div class="hidbord_spoiler">';
            is_spoil = true;
            num_spoil--;
            continue;
        }

        if (lines[i] == _spoilerTag && is_spoil) {
            res += '</div>';
            is_spoil = false;
            num_spoil--;
            continue;
        }

        //save lists
        var list_pre, list_text;
        if (lines[i].match(/^(\*+|\#+)\s/)) {
            var p = lines[i].match(/^(\*+|\#+)(.*)$/);
            list_pre = p[1];
            list_text = p[2];
        } else {
            list_pre = '';
            list_text = lines[i];
        }

        var parsed = list_pre + parseOneLineTags(null, null, list_text);

        /*jshint loopfunc: true */
        //implying
        parsed = parsed.replace(/^((\&gt\;\s*)+)(.*)$/ig, function(match, q, a, text) {
            var quots = q.replace(/\&gt\;\s*/g, '>'),
                style = 'hidbord_quot' + (2 - (quots.length & 1)),
                prep = quots.replace(/\>/g, '&gt;') + ' ';
            return '<span class="' + style + '">' + prep + text + '</span>';
        });

        needbr = "<br/>";

        if (parsed.match(/^(\*+|\#+)\s/)) {
            var workon = parsed.match(/^(\*+|\#+)/)[0];

            parsed = parsed.replace(/^(\*+|\#+)(.*)$/ig, function(match, li, text) {
                var tclose = '</ol>',
                    topen = '<ol>',
                    p;

                if (li[0] == '*') {
                    tclose = '</ul>';
                    topen = '<ul>';
                }
                if (laslist != li) {
                    if (!laslist || laslist.length <= li.length) {
                        if (laslist && laslist[0] != li[0]) res += listel.pop().close;
                        res += topen;
                        listel.push({
                            close: tclose,
                            li: li
                        });
                    } else {
                        while (listel.length > 0) {
                            p = listel.pop();
                            if (p.li == li) {
                                listel.push(p);
                                break;
                            } else {
                                res += p.close;
                            }
                        }
                        if (listel.length === 0) {
                            res += topen;
                            listel.push({
                                close: tclose,
                                li: li
                            });
                        }
                    }
                    laslist = '' + li;
                }
                return '<li>' + text + '</li>';
            });
            needbr = '';
        } else {
            laslist = null;
            for (var j = 0; j < listel.length; j++) {
                res += listel[j].close;
                needbr = '';
            }
            listel = [];
        }


        res += parsed + needbr;

    }

    if (is_pre) {
        res += '</pre>';
    }

    if (is_spoil) {
        res += '</div>';
    }

    //console.log(res);
    return res;
};

var savedURLs = [],
    savedCode = [];

var saveURLs = function(str) {
    "use strict";

    str = str.replace(/(\[[^\]]+\]\([a-z]{3,6}\:[^\s\"><\`\]\)\(\[]+\))/ig, function(match, a) {
        savedURLs.push(a);
        return '`URL2:' + (savedURLs.length - 1) + '`';
    });

    return str.replace(/([a-z]{3,6}\:\/\/[^\s\"><\`]+)($|\s)/ig, function(match, a, b) {
        savedURLs.push(a+b);
        return '`URL:' + (savedURLs.length - 1) + '`';
    });
};

var restoreURLs = function(str) {
    "use strict";
    var txt, url, b = '';
    
    str = str.replace(/`URL2:(\d+)`/ig, function(match, a) {
        url = savedURLs[parseInt(a)].match(/\[([^\]]+)\]\(([a-z]{3,6}\:[^\s\"><\`\]\)\(\[]+)\)/);
        return url ? '<a href="' + cleanUrl(url[2]) + '" target="_blank" rel="noreferrer">' + safe_tags(url[1]) + '</a>' : '';
    });

    return str.replace(/`URL:(\d+)`/ig, function(match, a) {        
        url = savedURLs[parseInt(a)];

        if(url[url.length-1] == ' '){
            url = url.trim();
            b = ' ';
        }

        txt = url;        

        // 
        try{
            //Wikipedia
            if (url.match(/^https?:\/\/[a-z]+\.wikipedia\.org\/wiki\//)) {
                txt = url.replace(/^https?:\/\/([a-z]+)\.wikipedia\.org\/wiki\/(.+)/, function(match, lang, title) {
                    return lang.toUpperCase() + ' wiki: ' + decodeURIComponent(title);
                });
                url = url.replace(/^http:\/\//, 'https://');
            }

            //Lurkmore
            if (url.match(/^https?:\/\/lurkmore\.to\//)) {
                txt = url.replace(/^https?:\/\/lurkmore\.to\/(.+)/, function(match, title) {
                    return 'Лурк: ' + decodeURIComponent(title);
                });
                url = url.replace(/^http:\/\//, 'https://');
            }

            //Google
            if (url.match(/^https?:\/\/(www\.)?google\.[a-z]{2,3}\/search\?/)) {
                txt = url.replace(/^https?:\/\/(www\.)?google\.[a-z]{2,3}\/search\?.*?q\=([^\&]+).*/, function(match, www, query) {
                    return 'Гугл: ' + decodeURIComponent(query.replace(/\+/g, ' '));
                });
                url = url.replace(/^http:\/\//, 'https://');
            }
        }catch(e){
            // decodeURIComponent is so strange function...
        }

        if (txt.length > 63) {
            txt = txt.substring(0, 30) + '...' + txt.substring(txt.length - 30);
        }
        return '<a href="' + cleanUrl(url) + '" target="_blank" rel="noreferrer">' + safe_tags(txt) + '</a> ' + b;
    });
};

var saveCode = function(str) {
    "use strict";

    return str.replace(/(\`{1,2})([^\s]|[^\s].*?[^\s])\1(?=[^\`]|$)/ig, function(match, a, b) {
        savedCode.push(b);
        return '`COD:' + (savedCode.length - 1) + '`';
    });
};

var restoreCode = function(str) {
    "use strict";

    return str.replace(/`COD:(\d+)`/ig, function(match, a) {
        return '<code>' + safe_tags(savedCode[parseInt(a)]) + '</code>';
    });
};

var parseOneLineTags = function(match, tag, str) {
    "use strict";

    var tags = {
        "*":  ["<em>", "</em>"],
        "**": ["<strong>", "</strong>"],
        "_":  ["<em>", "</em>"],
        "__": ["<strong>", "</strong>"],
        "--": ["<strike>", "</strike>"],
        "++": ['<span style="color: #ee0000; font-style: italic;" class="hidbord_irony">', "</span>"]
    }, res;

    // fix escaping of %
    tags[_spoilerTag] = ['<span class="hidbord_spoiler">', "</span>"];

    res = tag === null ? saveURLs(saveCode(str)).replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;') : str;

    res = res.replace(/(\*\*|\*|\_\_|\_|\%\%|\-\-|\+\+)(([^\s]|[^\s].*?[^\s])[\*\_]?)\1/g, parseOneLineTags);

    if (tag === null) {
        //imoticons
        res = res.replace(imRegEx, function(match, a, b) {
            return imoticons[a.toLowerCase()];
        });

        // Magic 8 ball
        res = res.replace(/\[8ball\]/gi, function(match, a, b) {
            return get8ball();
        });

        //reflinks
        res = res.replace(/(\&gt\;\&gt\;)([0-9a-f]{64})/ig, function(match, a, b) {
            return '<a href="javascript:;" alt="' + b + '" class="hidbord_msglink">&gt;&gt;' + b.substr(0, 8) + '</a>';
        });

        //userlinks
        res = res.replace(/(\{)([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{40,50})\}/ig, function(match, a, b) {
            return '<span class="usr_' + b + '"><span style="vertical-align:middle;" class="idntcn2">' + b + '</span>&nbsp;' + getContactHTML(b)+"</span>";
        });
    }

    res = tag === null ? restoreURLs(restoreCode(res)) : res;

    if (tag !== null) {
        return tags[tag][0] + res + tags[tag][1];
    } else {
        return res;
    }
};

function unHtml(el){
    "use strict";
    var tag = '', text = '', i;

    if(el.nodeName == 'BR') return "\n";
    if(el.nodeType == 3) return el.textContent;
    if(el.nodeName == 'PRE') return el.textContent;

    if(el.nodeName == 'STRIKE') tag = "--";
    if(el.nodeName == 'STRONG') tag = '**';
    if(el.nodeName == 'EM') tag = '*';
    if(el.nodeName == 'CODE') tag = '`';

    if(el.nodeName == 'SPAN'){
        if(el.className.match(/usr\_[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{40,50}/i)){
            return "{" + el.className.substr(4) + "}";
        }

        if(el.className == 'hidbord_spoiler') tag = _spoilerTag; 
        if(el.className == 'hidbord_irony') tag = "++";
        if(el.className == 'hidbord_imtc_elita') return "[elita]";
        if(el.className == 'hidbord_imtc_8ball') return "[8ball]";
    }

    if(el.nodeName == 'P' && el.className == 'hidbord_imtc_not4u'){
        return "[not4u]";
    }
    
    if(el.nodeName == 'IMG'){
        if(el.className.match(/hidbord\_imtc\_/i)){
            return "[" + el.className.replace('hidbord_imtc_','') + "]";
        }
        return '';
    }

    if(el.nodeName == 'A'){
        if(el.className == 'hidbord_msglink') 
            return '>>' + $(el).attr('alt');

        return '['+el.textContent+']('+el.href+')';
    }

    for (i = 0; i < el.childNodes.length; i++) {
        text += unHtml(el.childNodes[i]);       
    }

    var parts = text.match(/^(\s*)(.*?)(\s*)$/);
    text = parts[1] + tag + parts[2] + tag + parts[3];

    return text;    
}


function quoteSelection(df){
    "use strict";

    var text = '';

    for (var i = 0; i < df.childNodes.length; i++) {
        text += unHtml(df.childNodes[i]);
    }

    text = text.replace(/^/gm, "> ");
    return text + "\n";
}

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
		'<script language="JavaScript" type="text/javascript" src="data/'+fname+'.js"></script>\n'+
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
					data.file(fname+".js", "var ddtThread = " + JSON.stringify(msgs, null, 2));
					saveAs(zip.generate({type:"blob", compression: "DEFLATE"}), fname + ".zip");
					$('#hidbord_btn_save_thread').show();
					$('#hidbord_btn_save_thread_info').hide().text('Saving...');      
				});
			}
		}
	};

	processThumbs();
}

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

var isDobro = !!document.URL.match(/\/dobrochan\.[comrgu]+\//);
var is4chan = !!document.URL.match(/\/boards\.4chan\.org\//);

var autoscanNewJpegs = true;
var contactsInLocalStorage = false;
var useGlobalContacts = true;

var uiFontSize = ssGet('magic_desu_fontsize');
if(!uiFontSize) uiFontSize = 13;

contactsInLocalStorage = ssGet('magic_desu_contactsInLocalStorage');
useGlobalContacts = ssGet('magic_desu_useGlobalContacts');

if(useGlobalContacts !== false && useGlobalContacts !== true){
    useGlobalContacts = true;
    ssSet('magic_desu_useGlobalContacts', true);
}

if(useGlobalContacts && contactsInLocalStorage) useGlobalContacts = false;

autoscanNewJpegs = ssGet(boardHostName + 'autoscanDefault');

if(autoscanNewJpegs !== false && autoscanNewJpegs !== true){
    autoscanNewJpegs = true;
    ssSet(boardHostName + 'autoscanDefault', true);
}

// Dirty hack (i really start to forget how this script works)
prev_to = ssGet(boardHostNameSection + '_prev_to');
prev_cont = ssGet(boardHostNameSection + '_prev_cont');
hidboard_hide_sender = ssGet(boardHostNameSection + '_hidboard_hide_sender');
hidboard_hide_contacts = ssGet(boardHostNameSection + '_hidboard_hide_contacts');

var jpegInserted = function(event) {
    "use strict";

    if(!autoscanNewJpegs) return false;

    if (event.animationName == 'hidbordNodeInserted') {
        var jpgURL = $(event.target).closest('a').attr('href');
        var thumbURL = $(event.target).attr('src');
        var post_el = $(event.target).closest('.reply');
        var post_id = 0;

/*        if(jpgURL.match(/\?/) && (jpgURL.match(/iqdb/) || jpgURL.match(/google/))){
            return false;
        }*/

        if(processedJpegs[jpgURL]) return;

        if(post_el.length === 1){
            post_id = parseInt(post_el.attr('id').replace(/[^0-9]/g, ''));
            if(isNaN(post_id)){
                post_id = 0;
            }
        }

        readJpeg(jpgURL, thumbURL, post_id);
    }
};

var ArrayPrototypeEvery = Array.prototype.every;

function startAnimeWatch(){
    "use strict";

    if(document.hidden || window.document.readyState != 'complete'){
        setTimeout(startAnimeWatch, 1000);
    }else{
        setTimeout(function(){
            $(document).bind('animationstart', jpegInserted).bind('MSAnimationStart', jpegInserted).bind('webkitAnimationStart', jpegInserted);
        }, 0);
    }
}

$(function($) {
    "use strict";

    Array.prototype.every = ArrayPrototypeEvery;

    sjcl.random.startCollectors();



    $('.hidbord_main').remove();

    inject_ui();

    do_login(false, true);
    do_loginBroadcast(false, true);

    if (ssGet(boardHostName + 'magic_desu_pwd')) {
        $('#steg_pwd').val(ssGet(boardHostName + 'magic_desu_pwd'));
    }

    render_contact();

    if(isSavedThread){
        for(var m in ddtThread){
            push_msg(ddtThread[m], null, ddtThread[m].thumb);
        }

        $('.hidbord_notifer .hidbord_clickable').click();
    }else{
        $('a[href*=jpg] img, a[href*=jpe] img, a[href^=blob] img ').each(function(){
            var e = $(this),
                jpgURL = e.closest('a').attr('href'),
                thumbURL = e.attr('src'),
                post_el = e.closest('.reply'),
                post_id = 0;

            if(post_el.length === 1){
                post_id = parseInt(post_el.attr('id').replace(/[^0-9]/g, ''));
                if(isNaN(post_id)){
                    post_id = 0;
                }
            }

            idxdbGetPostBySrc(jpgURL, function(post){
                push_msg(post, jpgURL, post.thumb, true);
                processedJpegs[jpgURL] = jpgURL;
            });
        });
    }

    idxdbGetLinks(function(url){
        processedJpegs[url.src] = url;
    });

    /*idxdbGetPosts(function(post){
        push_msg(post, null, post.thumb, true);
    });*/

    var insertAnimation = ' hidbordNodeInserted{from{clip:rect(1px,auto,auto,auto);}to{clip:rect(0px,auto,auto,auto);}}',
        animationTrigger = '{animation-duration:0.001s;-o-animation-duration:0.001s;-ms-animation-duration:0.001s;-moz-animation-duration:0.001s;-webkit-animation-duration:0.001s;animation-name:hidbordNodeInserted;-o-animation-name:hidbordNodeInserted;-ms-animation-name:hidbordNodeInserted;-moz-animation-name:hidbordNodeInserted;-webkit-animation-name:hidbordNodeInserted;}';

    $('<style type="text/css">@keyframes ' + insertAnimation + '@-moz-keyframes ' + insertAnimation + '@-webkit-keyframes ' +
        insertAnimation + '@-ms-keyframes ' + insertAnimation + '@-o-keyframes ' + insertAnimation +
        'a[href*=jpg] img, a[href*=jpe] img, a[href^=blob] img ' + animationTrigger + '</style>').appendTo('head');

    setTimeout(startAnimeWatch, 1000);
});

if(window.location.href.match(/\.jpe?g$/i)){
    process_images.push([window.location.href, window.location.href, 0, true]);
    process_olds();
}

}

ddtMainFunction();
