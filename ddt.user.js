// ==UserScript==
// @name         DesuDesuTalk
// @namespace    udp://desushelter/*
// @version      0.4.61
// @description  Write something useful!
// @include      *://dobrochan.com/*/*
// @include      *://dobrochan.ru/*/*
// @include      *://dobrochan.org/*/*
// @include      *://inach.org/*/*
// @include      *://8chan.co/*/*
// @include      *://hatechan.co/*/*
// @include      *://8ch.net/*/*
// @include      *://www.8ch.net/*/*
// @include      *://lainchan.org/*/*
// @include      *://iichan.hk/*/*
// @include      *://2-ch.su/*/*
// @include      *://syn-ch.com/*/*
// @include      *://syn-ch.org/*/*
// @include      *://syn-ch.ru/*/*
// @include      *://krautchan.net/*/*
// @include      *://boards.4chan.org/*/*
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
var saveAs=saveAs||"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob&&navigator.msSaveOrOpenBlob.bind(navigator)||function(e){"use strict";if("undefined"==typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var t=e.document,n=function(){return e.URL||e.webkitURL||e},o=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in o,i=function(n){var o=t.createEvent("MouseEvents");o.initMouseEvent("click",!0,!1,e,0,0,0,0,0,!1,!1,!1,!1,0,null),n.dispatchEvent(o)},a=e.webkitRequestFileSystem,c=e.requestFileSystem||a||e.mozRequestFileSystem,s=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},u="application/octet-stream",f=0,d=500,l=function(t){var o=function(){"string"==typeof t?n().revokeObjectURL(t):t.remove()};e.chrome?o():setTimeout(o,d)},v=function(e,t,n){t=[].concat(t);for(var o=t.length;o--;){var r=e["on"+t[o]];if("function"==typeof r)try{r.call(e,n||e)}catch(i){s(i)}}},p=function(t,s){var d,p,w,y=this,m=t.type,S=!1,h=function(){v(y,"writestart progress write writeend".split(" "))},O=function(){if((S||!d)&&(d=n().createObjectURL(t)),p)p.location.href=d;else{var o=e.open(d,"_blank");void 0==o&&"undefined"!=typeof safari&&(e.location.href=d)}y.readyState=y.DONE,h(),l(d)},b=function(e){return function(){return y.readyState!==y.DONE?e.apply(this,arguments):void 0}},g={create:!0,exclusive:!1};return y.readyState=y.INIT,s||(s="download"),r?(d=n().createObjectURL(t),o.href=d,o.download=s,i(o),y.readyState=y.DONE,h(),void l(d)):(/^\s*(?:text\/(?:plain|xml)|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)&&(t=new Blob(["﻿",t],{type:t.type})),e.chrome&&m&&m!==u&&(w=t.slice||t.webkitSlice,t=w.call(t,0,t.size,u),S=!0),a&&"download"!==s&&(s+=".download"),(m===u||a)&&(p=e),c?(f+=t.size,void c(e.TEMPORARY,f,b(function(e){e.root.getDirectory("saved",g,b(function(e){var n=function(){e.getFile(s,g,b(function(e){e.createWriter(b(function(n){n.onwriteend=function(t){p.location.href=e.toURL(),y.readyState=y.DONE,v(y,"writeend",t),l(e)},n.onerror=function(){var e=n.error;e.code!==e.ABORT_ERR&&O()},"writestart progress write abort".split(" ").forEach(function(e){n["on"+e]=y["on"+e]}),n.write(t),y.abort=function(){n.abort(),y.readyState=y.DONE},y.readyState=y.WRITING}),O)}),O)};e.getFile(s,{create:!1},b(function(e){e.remove(),n()}),b(function(e){e.code===e.NOT_FOUND_ERR?n():O()}))}),O)}),O)):void O())},w=p.prototype,y=function(e,t){return new p(e,t)};return w.abort=function(){var e=this;e.readyState=e.DONE,v(e,"abort")},w.readyState=w.INIT=0,w.WRITING=1,w.DONE=2,w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null,y}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);"undefined"!=typeof module&&module.exports?module.exports.saveAs=saveAs:"undefined"!=typeof define&&null!==define&&null!=define.amd&&define([],function(){return saveAs});
var fieldSize = 32, ECcrypt = ellipticjs.ec("secp256k1");

var cryptCore = (function(){
	"use strict";

	var keyPair = null, keyPairBroadcast = null, cryptCore = {};

	var getSharedSecret = function (privateKey, publicKey) {
		var sharedSecret = padBytes(privateKey.derive(ECcrypt.keyPair(publicKey).getPublic()).toArray());
		return sjcl.codec.bytes.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(sharedSecret)));
	};

	cryptCore.login = function login(password, salt, key) {
	    var privateKey = null, encKey = null;

	    if(key){
		    if (ssGet(boardHostName + profileStoreName)) {
		        privateKey = bs58.dec(ssGet(boardHostName + profileStoreName).privateKeyPair);
		    }else{
		    	return false;
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
	        numContacts = Object.keys(contacts).length + 1, i,
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

	    var secret = getSharedSecret(ephemeral, keyPair.publicEnc);

	    slots.push(xorBytes(secret, sessionKey));

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

// jpeg decoder license:
// Modified JPEG decoder for Steganography by Owen Campbell-Moore, based on one released by Adobe.
// Copyright (c) 2008, Adobe Systems Incorporated All rights reserved.
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
// Neither the name of Adobe Systems Incorporated nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// jpeg encoder license:
// JPEG encoder ported to JavaScript, optimized by Andreas Ritter (www.bytestrom.eu, 11/2009) and made suitable for steganography by Owen Campbell-Moore (www.owencampbellmoore.com, 03/13)
// Based on v 0.9a
// Licensed under the MIT License
// Copyright (c) 2009 Andreas Ritter
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// Copyright 2011 notmasteryet
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

var jsf5steg = (function(){
	"use strict";

	function buildHuffmanTable(codeLengths, values) {
    	var k = 0, code = [], i, j, length = 16;
    	while (length > 0 && !codeLengths[length - 1])
      		length--;
    	code.push({children: [], index: 0});
    	var p = code[0], q;
    	for (i = 0; i < length; i++) {
      		for (j = 0; j < codeLengths[i]; j++) {
        		p = code.pop();
        		p.children[p.index] = values[k];
        		while (p.index > 0) {
          			p = code.pop();
        		}
        		p.index++;
        		code.push(p);
        		while (code.length <= i) {
          			code.push(q = {children: [], index: 0});
          			p.children[p.index] = q.children;
          			p = q;
        		}
        		k++;
      		}
      		if (i + 1 < length) {
	        	// p here points to last code
	        	code.push(q = {children: [], index: 0});
	        	p.children[p.index] = q.children;
	        	p = q;
      		}
    	}
   		return code[0].children;
  	}

  	function decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive, forExtract) {
    	var precision = frame.precision;
    	var samplesPerLine = frame.samplesPerLine;
    	var scanLines = frame.scanLines;
    	var mcusPerLine = frame.mcusPerLine;
    	var progressive = frame.progressive;
    	var maxH = frame.maxH, maxV = frame.maxV;

    	var startOffset = offset, bitsData = 0, bitsCount = 0;
    	
    	function readBit() {
      		if (bitsCount > 0) {
        		bitsCount--;
        		return (bitsData >> bitsCount) & 1;
      		}
      		bitsData = data[offset++];
      		if (bitsData == 0xFF) {
        		var nextByte = data[offset++];
        		if (nextByte) {          			
				    throw "Bad jpeg. (unexpected marker: " + ((bitsData << 8) | nextByte).toString(16) + " at " + offset.toString(16) + ")";
        		}
        		// unstuff 0
      		}
      		bitsCount = 7;
      		return bitsData >>> 7;
    	}

    	function decodeHuffman(tree) {
      		var node = tree, bit;
      		while ((bit = readBit()) !== null) {
        		node = node[bit];
        		if (typeof node === 'number')
          			return node;
        		if (typeof node !== 'object')
          			throw "Bad jpeg. (invalid huffman sequence)";
      		}
      		return null;
    	}

    	function receive(length) {
      		var n = 0;
      		while (length > 0) {
        		var bit = readBit();
        		if (bit === null) return;
        		n = (n << 1) | bit;
        		length--;
      		}
      		return n;
    	}
    
    	function receiveAndExtend(length) {
      		var n = receive(length);
      		if (n >= 1 << (length - 1))
        		return n;
      		return n + (-1 << length) + 1;
    	}

    	function decodeBaseline(component, zz, pos) {
      		var t = decodeHuffman(component.huffmanTableDC);
      		var diff = t === 0 ? 0 : receiveAndExtend(t);
      		zz[pos]= (component.pred += diff);
      		var k = 1;
      		while (k < 64) {
        		var rs = decodeHuffman(component.huffmanTableAC);
        		var s = rs & 15, r = rs >> 4;
        		if (s === 0) {
          			if (r < 15) break;
          			k += 16;
          			continue;
        		}
        		k += r;
        		//var z = dctZigZag[k];
        		zz[pos + k] = receiveAndExtend(s);
        		k++;
      		}
    	}

        function decodeBaselineExt(component, zz, pos) {
            var t = decodeHuffman(component.huffmanTableDC);
            var diff = t === 0 ? 0 : receiveAndExtend(t);
            zz[pos] = 0; //(component.pred += diff);
            var k = 1;
            while (k < 64) {
                var rs = decodeHuffman(component.huffmanTableAC);
                var s = rs & 15, r = rs >> 4;
                if (s === 0) {
                    if (r < 15) break;
                    k += 16;
                    continue;
                }
                k += r;
                //var z = dctZigZag[k];
                zz[pos + k] = receiveAndExtend(s);
                k++;
            }
        }

    	function decodeDCFirst(component, zz, pos) {
      		var t = decodeHuffman(component.huffmanTableDC);
      		var diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
      		zz[pos] = (component.pred += diff);
    	}

    	function decodeDCSuccessive(component, zz, pos) {
      		zz[pos] |= readBit() << successive;
    	}

        function decodeDCFirstExt(component, zz, pos) {
            var t = decodeHuffman(component.huffmanTableDC);
            var diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
            zz[pos] = 0; //(component.pred += diff);
        }

        function decodeDCSuccessiveExt(component, zz, pos) {
            readBit();
            //zz[pos] |= readBit() << successive;
        }

    	var eobrun = 0;
    
    	function decodeACFirst(component, zz, pos) {
      		if (eobrun > 0) {
        		eobrun--;
        		return;
      		}
      		
      		var k = spectralStart, e = spectralEnd;
      		
      		while (k <= e) {
        		var rs = decodeHuffman(component.huffmanTableAC);
        		var s = rs & 15, r = rs >> 4;
        		if (s === 0) {
          			if (r < 15) {
            			eobrun = receive(r) + (1 << r) - 1;
            			break;
          			}
	          		k += 16;
	          		continue;
	        	}
	        	
	        	k += r;
	        	//var z = dctZigZag[k];
	        	zz[pos + k] = receiveAndExtend(s) * (1 << successive);
	        	k++;
	      	}
	    }

    	var successiveACState = 0, successiveACNextValue;
    
    	function decodeACSuccessive(component, zz, pos) {
      		var k = spectralStart, e = spectralEnd, r = 0;
      		while (k <= e) {
        		//var z = dctZigZag[k];
        		switch (successiveACState) {
        			case 0: // initial state
          				var rs = decodeHuffman(component.huffmanTableAC);
          				var s = rs & 15; 
                        r = rs >> 4;
          				if (s === 0) {
            				if (r < 15) {
              					eobrun = receive(r) + (1 << r);
              					successiveACState = 4;
            				} else {
              					r = 16;
              					successiveACState = 1;
            				}
          				} else {
            				if (s !== 1) throw "Bad jpeg. (invalid ACn encoding)";
            				successiveACNextValue = receive(s);
                            if(!successiveACNextValue)
                                successiveACNextValue = -1;                            
            				successiveACState = r ? 2 : 3;
          				}
          				continue;
        			case 1: // skipping r zero items
        			case 2:
          				if (zz[pos + k])
            				zz[pos + k] += (readBit() << successive) * (zz[pos + k] >= 0 ? 1 : -1);
          				else {
            				r--;
            				if (r === 0)
              					successiveACState = successiveACState == 2 ? 3 : 0;
          				}
          				break;
        			case 3: // set value for a zero item
          				if (zz[pos + k])
            				zz[pos + k] += (readBit() << successive) * (zz[pos + k] >= 0 ? 1 : -1);
          				else {
            				zz[pos + k] = successiveACNextValue << successive;
            				successiveACState = 0;
          				}
          				break;
        			case 4: // eob
          				if (zz[pos + k])
            				zz[pos + k] += (readBit() << successive) * (zz[pos + k] >= 0 ? 1 : -1);
          				break;
        		}
        		k++;
      		}

      		if (successiveACState === 4) {
        		eobrun--;
        		if (eobrun === 0)
          			successiveACState = 0;
      		}
    	}

    	function decodeMcu(component, decode, mcu, row, col) {
      		var mcuRow = (mcu / mcusPerLine) | 0;
      		var mcuCol = mcu % mcusPerLine;
      		var blockRow = mcuRow * component.v + row;
      		var blockCol = mcuCol * component.h + col;
      		decode(component, component.blocks, (blockRow * mcusPerLine * component.h  + blockCol) * 64);
    	}

    	function decodeBlock(component, decode, mcu) {
      		var blockRow = (mcu / component.blocksPerLine) | 0;
      		var blockCol = mcu % component.blocksPerLine;
      		decode(component, component.blocks, (blockRow * mcusPerLine * component.h  + blockCol) * 64 );
     	}

    	var componentsLength = components.length;
    	var component, i, j, k, n;
    	var decodeFn;
    	if (progressive) {
      		if (spectralStart === 0)
                if(forExtract)
        		    decodeFn = successivePrev === 0 ? decodeDCFirstExt : decodeDCSuccessiveExt;
                else
                    decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
      		else
        		decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
    	} else {
      		decodeFn = forExtract? decodeBaselineExt : decodeBaseline;
    	}

    	var mcu = 0, marker;
    	var mcuExpected;
    	if (componentsLength == 1) {
      		mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
    	} else {
      		mcuExpected = mcusPerLine * frame.mcusPerColumn;
    	}
    	if (!resetInterval) resetInterval = mcuExpected;

    	var h, v;
    	while (mcu < mcuExpected -1) {
      		// reset interval stuff
      		for (i = 0; i < componentsLength; i++)
        		components[i].pred = 0;
      		eobrun = 0;

      		if (componentsLength == 1) {
        		component = components[0];
        		for (n = 0; n < resetInterval; n++) {
          			decodeBlock(component, decodeFn, mcu);
          			mcu++;
        		}
      		} else {
        		for (n = 0; n < resetInterval; n++) {
          			for (i = 0; i < componentsLength; i++) {
            			component = components[i];
            			h = component.h;
            			v = component.v;
            			for (j = 0; j < v; j++) {
              				for (k = 0; k < h; k++) {
                				decodeMcu(component, decodeFn, mcu, j, k);
              				}
            			}
          			}
          			mcu++;
        		}
      		}

      		// find marker
      		bitsCount = 0;
      		marker = (data[offset] << 8) | data[offset + 1];
      		if (marker <= 0xFF00) {
        		throw "Bad jpeg. (marker was not found)";
      		}

      		if (marker >= 0xFFD0 && marker <= 0xFFD7) { // RSTx
        		offset += 2;
      		} else break;
    	}

    	return offset - startOffset;
  	}

	var constructor = function(){
	};

	constructor.prototype.parse = function(fileAB, preserveDC){
		var data = new Uint8Array(fileAB), offset = 0, length = data.length;
		
		function readUint16() {
			var value = (data[offset] << 8) | data[offset + 1];
			offset += 2;
			return value;
		}
		
		function readDataBlock() {
			var length = readUint16();
			var array = data.subarray(offset, offset + length - 2);
			offset += array.length;
			return array;
		}
		
		function prepareComponents(frame) {
            var mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / frame.maxH);
            var mcusPerColumn = Math.ceil(frame.scanLines / 8 / frame.maxV);
            for (var i = 0; i < frame.components.length; i++) {
                component = frame.components[i];
                var blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / frame.maxH);
                var blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines  / 8) * component.v / frame.maxV);
                var blocksPerLineForMcu = mcusPerLine * component.h;
                var blocksPerColumnForMcu = mcusPerColumn * component.v;

                var blocksBufferSize = 64 * blocksPerColumnForMcu * blocksPerLineForMcu;
                component.blocks = new Int16Array(blocksBufferSize);
                component.blocksPerLine = blocksPerLine;
                component.blocksPerColumn = blocksPerColumn;
            }
            frame.mcusPerLine = mcusPerLine;
            frame.mcusPerColumn = mcusPerColumn;
        }
		
		var jfif = null;
		var adobe = null;
		var pixels = null;
		var frame, resetInterval;
		var frames = [];
		var huffmanTablesAC = [], huffmanTablesDC = [];
		var fileMarker = readUint16();

		this.quantizationTables = [];
	    
	    if (fileMarker != 0xFFD8) { // SOI (Start of Image)
	      	throw "Bad jpeg. (SOI not found)";
	    }

	    fileMarker = readUint16();
	    while (fileMarker != 0xFFD9) { // EOI (End of image)
	      	var i, j, l;
	      	switch(fileMarker) {
				case 0xFFE0: // APP0 (Application Specific)
				case 0xFFE1: // APP1
				case 0xFFE2: // APP2
				case 0xFFE3: // APP3
				case 0xFFE4: // APP4
				case 0xFFE5: // APP5
				case 0xFFE6: // APP6
				case 0xFFE7: // APP7
				case 0xFFE8: // APP8
				case 0xFFE9: // APP9
				case 0xFFEA: // APP10
				case 0xFFEB: // APP11
				case 0xFFEC: // APP12
				case 0xFFED: // APP13
				case 0xFFEE: // APP14
				case 0xFFEF: // APP15
				case 0xFFFE: // COM (Comment)
					//offset += readUint16() - 2;
					readDataBlock();
	            	break;

	          	case 0xFFDB: // DQT (Define Quantization Tables)
	          		this.quantizationTables[this.quantizationTables.length] = readDataBlock();
					break;

	          	case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
                case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
	          	case 0xFFC2: // SOF2 (Start of Frame, Progressive DCT)
                    if (frame) {
                        throw "Only single frame JPEGs supported";
                    }
	            	readUint16(); // skip data length
	            	frame = {};
                    frame.extended = (fileMarker === 0xFFC1);
	            	frame.progressive = (fileMarker === 0xFFC2);
	            	frame.precision = data[offset++];
	            	frame.scanLines = readUint16();
	            	frame.samplesPerLine = readUint16();
	            	frame.components = [];
	            	frame.componentIds = {};

                    if(frame.scanLines * frame.samplesPerLine > 16777216){
                        throw "Image is too big.";
                    }

	            	var componentsCount = data[offset++], componentId;
	            	var maxH = 0, maxV = 0;
	            	for (i = 0; i < componentsCount; i++) {
	            		componentId = data[offset];
	            		var h = data[offset + 1] >> 4;
	            		var v = data[offset + 1] & 15;
                        if(componentsCount == 1){
                            v = 1;
                            h = 1;
                        }
                        if (maxH < h) maxH = h;
                        if (maxV < v) maxV = v;
	            		var qId = data[offset + 2];
	            		l = frame.components.push({
		            		componentId: componentId,
	            			h: h,
	            			v: v,
	            			quantizationTable: qId
	            		});
                        frame.componentIds[componentId] = l - 1;
	            		offset += 3;
	            	}
                    frame.maxH = maxH;
                    frame.maxV = maxV;
	            	prepareComponents(frame);
	            	frames.push(frame);
	            	break;

	          	case 0xFFC4: // DHT (Define Huffman Tables)
	          		var huffmanLength = readUint16();
	          		for (i = 2; i < huffmanLength;) {
	          			var huffmanTableSpec = data[offset++];
	          			var codeLengths = new Uint8Array(16);
	          			var codeLengthSum = 0;
	          			for (j = 0; j < 16; j++, offset++)
	          				codeLengthSum += (codeLengths[j] = data[offset]);
	          			var huffmanValues = new Uint8Array(codeLengthSum);
	          			for (j = 0; j < codeLengthSum; j++, offset++)
	          				huffmanValues[j] = data[offset];
	          			i += 17 + codeLengthSum;
	          			((huffmanTableSpec >> 4) === 0 ? 
	          			huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
	          		}
	          		break;

	          	case 0xFFDD: // DRI (Define Restart Interval)
		            readUint16(); // skip data length
	            	resetInterval = readUint16();
	            	break;

	          	case 0xFFDA: // SOS (Start of Scan)
	          		var scanLength = readUint16();
	          		var selectorsCount = data[offset++];
	          		var components = [], component;
	          		for (i = 0; i < selectorsCount; i++) {
	          			var componentIndex = frame.componentIds[data[offset++]];
                        component = frame.components[componentIndex];
	          			var tableSpec = data[offset++];
	          			component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
	          			component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
	          			components.push(component);
	          		}
	          		var spectralStart = data[offset++];
	          		var spectralEnd = data[offset++];
	          		var successiveApproximation = data[offset++];
	          		
                    var processed = decodeScan(data, offset,
	          			frame, components, resetInterval,
	          			spectralStart, spectralEnd,
	          			successiveApproximation >> 4, successiveApproximation & 15, !preserveDC);
	          		offset += processed;
	          		break;
	          	
	          	default:
                    if (data[offset - 3] == 0xFF &&
                        data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) {
                        // could be incorrect encoding -- last 0xFF byte of the previous
                        // block was eaten by the encoder
                        offset -= 3;
                        break;
                    }
	          		throw "Bad jpeg. (unknown JPEG marker " + fileMarker.toString(16) + ")";
	      	}
	      	fileMarker = readUint16();
	  	}
		
		if (frames.length != 1)
			throw "only single frame JPEGs supported";

		this.frames = frames;

		return true;
	};

	var self = this;
	var fround = Math.round;
	var ffloor = Math.floor;
	var YTable = new Array(64);
	var UVTable = new Array(64);
	var fdtbl_Y = new Array(64);
	var fdtbl_UV = new Array(64);
	var YDC_HT;
	var UVDC_HT;
	var YAC_HT;
	var UVAC_HT;
	
	var bitcode = new Array(65535);
	var category = new Array(65535);
	var outputfDCTQuant = new Array(64);
	var DU = new Array(64);
	var byteout = [];
	var bytenew = 0;
	var bytepos = 7;
	
	var YDU = new Array(64);
	var UDU = new Array(64);
	var VDU = new Array(64);
	var clt = new Array(256);
	var RGB_YUV_TABLE = new Array(2048);
	var currentQuality;

	var std_dc_luminance_nrcodes = [0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0];
	var std_dc_luminance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
	var std_ac_luminance_nrcodes = [0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,0x7d];
	var std_ac_luminance_values = [
			0x01,0x02,0x03,0x00,0x04,0x11,0x05,0x12,
			0x21,0x31,0x41,0x06,0x13,0x51,0x61,0x07,
			0x22,0x71,0x14,0x32,0x81,0x91,0xa1,0x08,
			0x23,0x42,0xb1,0xc1,0x15,0x52,0xd1,0xf0,
			0x24,0x33,0x62,0x72,0x82,0x09,0x0a,0x16,
			0x17,0x18,0x19,0x1a,0x25,0x26,0x27,0x28,
			0x29,0x2a,0x34,0x35,0x36,0x37,0x38,0x39,
			0x3a,0x43,0x44,0x45,0x46,0x47,0x48,0x49,
			0x4a,0x53,0x54,0x55,0x56,0x57,0x58,0x59,
			0x5a,0x63,0x64,0x65,0x66,0x67,0x68,0x69,
			0x6a,0x73,0x74,0x75,0x76,0x77,0x78,0x79,
			0x7a,0x83,0x84,0x85,0x86,0x87,0x88,0x89,
			0x8a,0x92,0x93,0x94,0x95,0x96,0x97,0x98,
			0x99,0x9a,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,
			0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,0xb5,0xb6,
			0xb7,0xb8,0xb9,0xba,0xc2,0xc3,0xc4,0xc5,
			0xc6,0xc7,0xc8,0xc9,0xca,0xd2,0xd3,0xd4,
			0xd5,0xd6,0xd7,0xd8,0xd9,0xda,0xe1,0xe2,
			0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,0xea,
			0xf1,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
			0xf9,0xfa
		];
	
	var std_dc_chrominance_nrcodes = [0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0];
	var std_dc_chrominance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
	var std_ac_chrominance_nrcodes = [0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,0x77];
	var std_ac_chrominance_values = [
			0x00,0x01,0x02,0x03,0x11,0x04,0x05,0x21,
			0x31,0x06,0x12,0x41,0x51,0x07,0x61,0x71,
			0x13,0x22,0x32,0x81,0x08,0x14,0x42,0x91,
			0xa1,0xb1,0xc1,0x09,0x23,0x33,0x52,0xf0,
			0x15,0x62,0x72,0xd1,0x0a,0x16,0x24,0x34,
			0xe1,0x25,0xf1,0x17,0x18,0x19,0x1a,0x26,
			0x27,0x28,0x29,0x2a,0x35,0x36,0x37,0x38,
			0x39,0x3a,0x43,0x44,0x45,0x46,0x47,0x48,
			0x49,0x4a,0x53,0x54,0x55,0x56,0x57,0x58,
			0x59,0x5a,0x63,0x64,0x65,0x66,0x67,0x68,
			0x69,0x6a,0x73,0x74,0x75,0x76,0x77,0x78,
			0x79,0x7a,0x82,0x83,0x84,0x85,0x86,0x87,
			0x88,0x89,0x8a,0x92,0x93,0x94,0x95,0x96,
			0x97,0x98,0x99,0x9a,0xa2,0xa3,0xa4,0xa5,
			0xa6,0xa7,0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,
			0xb5,0xb6,0xb7,0xb8,0xb9,0xba,0xc2,0xc3,
			0xc4,0xc5,0xc6,0xc7,0xc8,0xc9,0xca,0xd2,
			0xd3,0xd4,0xd5,0xd6,0xd7,0xd8,0xd9,0xda,
			0xe2,0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,
			0xea,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
			0xf9,0xfa
		];

	function computeHuffmanTbl(nrcodes, std_table){
		var codevalue = 0;
		var pos_in_table = 0;
		var HT = [];
		for (var k = 1; k <= 16; k++) {
			for (var j = 1; j <= nrcodes[k]; j++) {
				HT[std_table[pos_in_table]] = [];
				HT[std_table[pos_in_table]][0] = codevalue;
				HT[std_table[pos_in_table]][1] = k;
				pos_in_table++;
				codevalue++;
			}
			codevalue*=2;
		}
		return HT;
	}
	
	function initHuffmanTbl(){
		YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes,std_dc_luminance_values);
		UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes,std_dc_chrominance_values);
		YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes,std_ac_luminance_values);
		UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes,std_ac_chrominance_values);
	}

	function initCategoryNumber(){
		var nrlower = 1;
		var nrupper = 2;
		for (var cat = 1; cat <= 15; cat++) {
			//Positive numbers
			for (var nr = nrlower; nr<nrupper; nr++) {
				category[32767+nr] = cat;
				bitcode[32767+nr] = [];
				bitcode[32767+nr][1] = cat;
				bitcode[32767+nr][0] = nr;
			}
			//Negative numbers
			for (var nrneg =-(nrupper-1); nrneg<=-nrlower; nrneg++) {
				category[32767+nrneg] = cat;
				bitcode[32767+nrneg] = [];
				bitcode[32767+nrneg][1] = cat;
				bitcode[32767+nrneg][0] = nrupper-1+nrneg;
			}
			nrlower <<= 1;
			nrupper <<= 1;
		}
	}

	// IO functions
	function writeBits(bs){
		var value = bs[0];
		var posval = bs[1]-1;
		while ( posval >= 0 ) {
			if (value & (1 << posval) ) {
				bytenew |= (1 << bytepos);
			}
			posval--;
			bytepos--;
			if (bytepos < 0) {
				if (bytenew == 0xFF) {
					writeByte(0xFF);
					writeByte(0);
				}
				else {
					writeByte(bytenew);
				}
				bytepos=7;
				bytenew=0;
			}
		}
	}

	function writeByte(value)	{
		byteout.push(value);
	}

	function writeWord(value){
		writeByte((value>>8)&0xFF);
		writeByte((value   )&0xFF);
	}

	function writeAPP0(){
		writeWord(0xFFE0); // marker
		writeWord(16); // length
		writeByte(0x4A); // J
		writeByte(0x46); // F
		writeByte(0x49); // I
		writeByte(0x46); // F
		writeByte(0); // = "JFIF",'\0'
		writeByte(1); // versionhi
		writeByte(1); // versionlo
		writeByte(0); // xyunits
		writeWord(1); // xdensity
		writeWord(1); // ydensity
		writeByte(0); // thumbnwidth
		writeByte(0); // thumbnheight
	}

	function writeDQT(self){
		for (var i = 0; i < self.quantizationTables.length; i++) {
			writeWord(0xFFDB); // marker
			writeWord(self.quantizationTables[i].length + 2); // length
			for (var j = 0; j < self.quantizationTables[i].length; j++) {
				writeByte(self.quantizationTables[i][j]);
			}
		}
	}

	function writeSOF0(self){
		writeWord(0xFFC0); // marker
		writeWord(8 + self.frames[0].components.length * 3);   // length
		writeByte(self.frames[0].precision);    // precision
		writeWord(self.frames[0].scanLines);
		writeWord(self.frames[0].samplesPerLine);
		writeByte(self.frames[0].components.length);    // nrofcomponents

		for (var i = 0; i < self.frames[0].components.length; i++) {
			var c = self.frames[0].components[i];
			writeByte(c.componentId);
			writeByte(c.h << 4 | c.v);
			writeByte(c.quantizationTable);
		}
	}

	function writeDHT(self){
        writeWord(0xFFC4); // marker
        writeWord(31); // length
        writeByte(0); // HTYDCinfo
        for (var i=0; i<16; i++) {
            writeByte(std_dc_luminance_nrcodes[i+1]);
        }
        for (var j=0; j<=11; j++) {
            writeByte(std_dc_luminance_values[j]);
        }

        writeWord(0xFFC4); // marker
        writeWord(181); // length
        writeByte(0x10); // HTYACinfo
        for (var k=0; k<16; k++) {
            writeByte(std_ac_luminance_nrcodes[k+1]);
        }
        for (var l=0; l<=161; l++) {
            writeByte(std_ac_luminance_values[l]);
        }

        if(self.frames[0].components.length != 1){
            writeWord(0xFFC4); // marker
            writeWord(31); // length
    		writeByte(1); // HTUDCinfo
    		for (var m=0; m<16; m++) {
    			writeByte(std_dc_chrominance_nrcodes[m+1]);
    		}
    		for (var n=0; n<=11; n++) {
    			writeByte(std_dc_chrominance_values[n]);
    		}

            writeWord(0xFFC4); // marker
            writeWord(181); // length
    		writeByte(0x11); // HTUACinfo
    		for (var o=0; o<16; o++) {
    			writeByte(std_ac_chrominance_nrcodes[o+1]);
    		}
    		for (var p=0; p<=161; p++) {
    			writeByte(std_ac_chrominance_values[p]);
    		}
        }
	}

	function writeSOS(self){
		writeWord(0xFFDA); // marker
		writeWord(6 + self.frames[0].components.length * 2);   // length
		writeByte(self.frames[0].components.length); // nrofcomponents

		for (var i = 0; i < self.frames[0].components.length; i++) {
			var c = self.frames[0].components[i];
			writeByte(c.componentId);
			if(i === 0){
                writeByte(0);
            }else{
                writeByte(0x11);
            }
		}

		writeByte(0); // Ss
		writeByte(0x3f); // Se
		writeByte(0); // Bf
	}

	function processDU(DU_DCT, POS, DC, HTDC, HTAC){
		var EOB = HTAC[0x00];
		var M16zeroes = HTAC[0xF0];
		var pos;
		var I16 = 16;
		var I63 = 63;
		var I64 = 64;

		//ZigZag reorder
		for (var j=0;j<I64;++j) {
			DU[j]=DU_DCT[POS + j];
		}
		var Diff = DU[0] - DC; DC = DU[0];
		//Encode DC
		if (Diff===0) {
			writeBits(HTDC[0]); // Diff might be 0
		} else {
			pos = 32767+Diff;
			writeBits(HTDC[category[pos]]);
			writeBits(bitcode[pos]);
		}
		//Encode ACs
		var end0pos = 63; // was const... which is crazy
		for (; (end0pos>0)&&(DU[end0pos]===0); end0pos--) {}
		//end0pos = first element in reverse order !=0
		if ( end0pos === 0) {
			writeBits(EOB);
			return DC;
		}
		var i = 1;
		var lng;
		while ( i <= end0pos ) {
			var startpos = i;
			for (; (DU[i]===0) && (i<=end0pos); ++i) {}
			var nrzeroes = i-startpos;
			if ( nrzeroes >= I16 ) {
				lng = nrzeroes>>4;
				for (var nrmarker=1; nrmarker <= lng; ++nrmarker)
					writeBits(M16zeroes);
				nrzeroes = nrzeroes&0xF;
			}
			pos = 32767+DU[i];
			writeBits(HTAC[(nrzeroes<<4)+category[pos]]);
			writeBits(bitcode[pos]);
			i++;
		}
		if ( end0pos != I63 ) {
			writeBits(EOB);
		}
		return DC;
	}


	constructor.prototype.pack = function(){
		initHuffmanTbl();
		initCategoryNumber();
		
		// Initialize bit writer
		byteout = [];
		bytenew=0;
		bytepos=7;

		// Add JPEG headers
		writeWord(0xFFD8); // SOI
		writeAPP0();
		writeDQT(this);
		writeSOF0(this);
		writeDHT(this);
		writeSOS(this);

		// Encode 8x8 macroblocks
		var DCY=0;
		var DCU=0;
		var DCV=0;
		
		bytenew=0;
		bytepos=7;

		var x, y = 0;
		var j = 0;
		var r, g, b;
		var start,p, col,row,pos;

		var DCdiff = new Array(this.frames[0].components.length);
		for (var i = 0; i < this.frames[0].components.length; i++) {
			DCdiff[i] = 0;
		}

		for (var mcu = 0; mcu < this.frames[0].mcusPerLine * this.frames[0].mcusPerColumn; mcu++){
			for (i = 0; i < this.frames[0].components.length; i++) {
				var c = this.frames[0].components[i];
				for (var v = 0; v < c.v; v++) {
					for (var h = 0; h < c.h; h++) {
						var mcuRow = (mcu / this.frames[0].mcusPerLine) | 0;
						var mcuCol = mcu % this.frames[0].mcusPerLine;
						var blockRow = mcuRow * c.v + v;
						var blockCol = mcuCol * c.h + h;
						if(i===0){
							DCdiff[i] = processDU(c.blocks, (blockRow * this.frames[0].mcusPerLine * c.h + blockCol) * 64, DCdiff[i], YDC_HT, YAC_HT);
						}else{
							DCdiff[i] = processDU(c.blocks, (blockRow * this.frames[0].mcusPerLine * c.h + blockCol) * 64, DCdiff[i], UVDC_HT, UVAC_HT);
						}
					}
				}
			}
		}

		// Do the bit alignment of the EOI marker
		if ( bytepos >= 0 && bytepos != 7) {
			var fillbits = [];
			fillbits[1] = bytepos+1;
			fillbits[0] = (1<<(bytepos+1))-1;
			writeBits(fillbits);
		}

		writeWord(0xFFD9); //EOI
		
		return byteout;
	};

    function stegShuffle(key, data){
        var i = 0, j = 0, t = 0, k = 0,
            S = makeUin8(256),
            max_random = data.length | 0, random_index = 0,
            gamma = makeUin8(math_ceil(data.length / 8));
        
        // init state from key
        for(i = 0; i < 256; ++i) S[i] = i;

        for(i = 0; i < 256; ++i) {
            j = (j + S[i] + key[i % key.length]) & 255;
            t = S[i];
            S[i] = S[j];
            S[j] = t;
        }
        i = 0;
        j = 0;

        // shuffle data
        for(k = 0; k < data.length; ++k) {
            
            i = (i + 1) & 255;
            j = (j + S[i]) & 255;
            t = S[i];
            S[i] = S[j];
            S[j] = t;
            random_index = S[(t + S[i]) & 255] << 24;

            i = (i + 1) & 255;
            j = (j + S[i]) & 255;
            t = S[i];
            S[i] = S[j];
            S[j] = t;
            random_index |= S[(t + S[i]) & 255] << 16;

            i = (i + 1) & 255;
            j = (j + S[i]) & 255;
            t = S[i];
            S[i] = S[j];
            S[j] = t;
            random_index |= S[(t + S[i]) & 255] << 8;

            i = (i + 1) & 255;
            j = (j + S[i]) & 255;
            t = S[i];
            S[i] = S[j];
            S[j] = t;
            random_index |= S[(t + S[i]) & 255];

            random_index %= max_random;
            if(random_index < 0) random_index += max_random;

            max_random--;

            t = data[random_index];
            data[random_index] = data[max_random];
            data[max_random] = t;
        }

        // prepare gamma
        for(k = 0; k < gamma.length; ++k) {
            i = (i + 1) & 255;
            j = (j + S[i]) & 255;
            t = S[i];
            S[i] = S[j];
            S[j] = t;
            gamma[k] = S[(t + S[i]) & 255];
        }

        return gamma;
    }

    constructor.prototype.f5embed = function(embedAB, iv){
        var data = new Uint8Array(embedAB.buffer);
        var coeff = this.frames[0].components[0].blocks;
        var coeff_count = coeff.length;
        console.log('got ' + coeff_count + ' DCT AC/DC coefficients');

        var _changed = 0, _embedded = 0, _examined = 0, _expected = 0, _one = 0, _large = 0, _thrown = 0, _zero = 0, shuffled_index = 0,
            changed, usable, i, n, k, ii;
        
        for (i = 0; i < coeff.length; i++) {
            if(i % 64 === 0) continue;

            if(coeff[i] == 1 || coeff[i] == -1){
                _one++;
            }

            if(coeff[i] === 0){
                _zero++;
            }
        }

        _large = coeff_count - _zero - _one - coeff_count / 64;
        _expected = Math.floor(_large + (0.49 * _one));

        console.log('one=' + _one);
        console.log('large=' + _large);

        console.log('expected capacity: '+Math.floor(_expected / 8)+' bytes');
        console.log('expected capacity with');

        for (i = 1; i < 8; i++) {
            n = (1 << i) - 1;
            changed = _large - _large % (n + 1);
            changed = (changed + _one + _one / 2 - _one / (n + 1)) / (n + 1);
            
            usable = (_expected * i / n - _expected * i / n % n) / 8;
            if(usable === 0) break;
            console.log( (i==1 ? 'default' : '(1, '+n+', '+i+')') + ' code: ' + Math.floor(usable) + ' bytes (efficiency: '+(usable * 8 / changed).toFixed(2)+' bits per change)');
        }
        
        if(data && data.length !== 0){
            console.log('permutation starts');
            var pm = new Uint32Array(coeff_count); 
            for (i = 1; i < coeff_count; i++) pm[i] = i;
            var gamma = stegShuffle(iv, pm), gammaI = 0;

            var next_bit_to_embed = 0,
                byte_to_embed = data.length,
                data_idx = 0,
                available_bits_to_embed = 0;

            console.log('Embedding of '+byte_to_embed+' bytes');

            if(byte_to_embed > 0x007fffff) byte_to_embed = 0x007ffff;

            for (i = 1; i < 8; i++) {
                n = (1 << i) - 1;
                usable = (_expected * i / n - _expected * i / n % n) / 8;
                if(usable < byte_to_embed + 4) break;
            }                

            k = i - 1;
            n = (1 << k) - 1;

            if(n === 0){
                throw 'data will not fit';
            }
            
            if(n == 1){
                console.log('using default code');
            }else{
                console.log('using (1, '+n+', '+k+') code');
            }

            if(n == 1){

                byte_to_embed = data[data_idx++];
                byte_to_embed ^= gamma[gammaI++];
                next_bit_to_embed = byte_to_embed & 1;
                byte_to_embed >>= 1;
                available_bits_to_embed = 7;
                _embedded += 1;
                
                for (ii = 0; ii < coeff_count; ii++) {
                    shuffled_index = pm[ii];

                    if(shuffled_index % 64 === 0 || coeff[shuffled_index] === 0) continue;

                    var cc = coeff[shuffled_index];
                    _examined++;

                    if(cc > 0 && (cc & 1) != next_bit_to_embed){
                        coeff[shuffled_index]--;
                        _changed++;
                    }else if(cc < 0 && (cc & 1) == next_bit_to_embed){
                        coeff[shuffled_index]++;
                        _changed++;
                    }

                    if(coeff[shuffled_index] !== 0){
                        if(available_bits_to_embed === 0){
                            if(data_idx >= data.length) break;
                            byte_to_embed = data[data_idx++];
                            byte_to_embed ^= gamma[gammaI++];
                            available_bits_to_embed = 8;
                        }
                        next_bit_to_embed = byte_to_embed & 1;
                        byte_to_embed >>= 1;
                        available_bits_to_embed--;
                        _embedded++;
                    }else{
                        _thrown++;
                    }
                }
            }else{
                ii = -1;
                var is_last_byte = false;
                while(!is_last_byte || (available_bits_to_embed !== 0 && is_last_byte)){
                    var k_bits_to_embed = 0;
                    for (i = 0; i < k; i++) {
                        if(available_bits_to_embed === 0){
                            if(data_idx >= data.length){
                                is_last_byte = true;
                                break;
                            }
                            byte_to_embed = data[data_idx++];
                            byte_to_embed ^= gamma[gammaI++];
                            available_bits_to_embed = 8;
                        }
                        next_bit_to_embed = byte_to_embed & 1;
                        byte_to_embed >>= 1;
                        available_bits_to_embed--;
                        k_bits_to_embed |= next_bit_to_embed << i;
                        _embedded++;
                    }

                    var code_word = [];
                    var ci = null;

                    for (i = 0; i < n; i++) {     
                        while(true){
                            if(++ii >= coeff_count){
                                throw 'capacity exceeded';
                            }
                            ci = pm[ii];
                            _examined++;
                            if(ci % 64 !== 0 && coeff[ci] !== 0) break;
                        }
                        code_word.push(ci);
                    }

                    while(true){
                        var vhash = 0, extracted_bit;
                        
                        for (i = 0; i < code_word.length; i++) {
                            if(coeff[code_word[i]] > 0){
                                extracted_bit = coeff[code_word[i]] & 1;
                            }else{
                                extracted_bit = 1 - (coeff[code_word[i]] & 1);
                            }

                            if(extracted_bit == 1)
                                vhash ^= i + 1;
                        }

                        i = vhash ^ k_bits_to_embed;
                        if(!i) break;

                        i--;
                        coeff[code_word[i]] += coeff[code_word[i]] < 0 ? 1 : -1;
                        _changed++;

                        if(coeff[code_word[i]] === 0){
                            _thrown++;
                            code_word.splice(i,1);
                            
                            while(true){
                                if(++ii >= coeff_count){
                                    throw 'capacity exceeded';
                                }
                                ci = pm[ii];
                                _examined++;
                                if(ci % 64 !== 0 && coeff[ci] !== 0) break;
                            }
                            code_word.push(ci);
                        }else{
                            break;
                        }
                    }
                }
            }    

            if(_examined > 0)
                console.log(_examined + ' coefficients examined');
            if(_changed > 0)
                console.log(_changed + ' coefficients changed (efficiency: '+(_embedded / _changed).toFixed(2)+' bits per change)');
            console.log(_thrown + ' coefficients thrown (zeroed)');
            console.log((_embedded / 8) + '  bytes embedded');
        }
    };



    constructor.prototype.f5extract = function(iv){
        var coeff = this.frames[0].components[0].blocks;

        var gamma = stegShuffle(iv, coeff);

        var pos = 0,
            extrBit = 0,
            cCount = coeff.length;

        var out = new Uint8Array((cCount / 8) | 0),
            extrByte = 0, outPos = 0, bitsAvail = 0;

        var out2 = new Uint8Array((cCount / 8 / 3 * 2) | 0),
            extrByte2 = 0, outPos2 = 0, bitsAvail2 = 0, code2 = 1, hash2 = 0;

        var out3 = new Uint8Array((cCount / 8 / 7 * 3) | 0),
            extrByte3 = 0, outPos3 = 0, bitsAvail3 = 0, code3 = 1, hash3 = 0;

        var out4 = new Uint8Array((cCount / 8 / 15 * 4) | 0),
            extrByte4 = 0, outPos4 = 0, bitsAvail4 = 0, code4 = 1, hash4 = 0;

        var out5 = new Uint8Array((cCount / 8 / 31 * 5) | 0),
            extrByte5 = 0, outPos5 = 0, bitsAvail5 = 0, code5 = 1, hash5 = 0;

        var out6 = new Uint8Array((cCount / 8 / 63 * 6) | 0),
            extrByte6 = 0, outPos6 = 0, bitsAvail6 = 0, code6 = 1, hash6 = 0;

        var out7 = new Uint8Array((cCount / 8 / 127 * 7) | 0),
            extrByte7 = 0, outPos7 = 0, bitsAvail7 = 0, code7 = 1, hash7 = 0;


        for(pos = 0; pos < cCount; pos++){
            if(coeff[pos] === 0){
                continue;
            }

            extrBit = coeff[pos] & 1;

            if(coeff[pos] < 0){
                extrBit = 1 - extrBit;
            }

            // Default code
            extrByte |= extrBit << bitsAvail;
            bitsAvail++;

            if(bitsAvail == 8){
                out[outPos] = extrByte ^ gamma[outPos++];
                extrByte = 0;
                bitsAvail = 0;
            }

            // code 2 3
            hash2 ^= extrBit * code2++;

            if(code2 == 4){
                extrByte2 |= hash2 << bitsAvail2;
                bitsAvail2 += 2;
                code2 = 1;
                hash2 = 0;

                if(bitsAvail2 >= 8){
                    out2[outPos2] = (extrByte2 & 0xFF) ^ gamma[outPos2++];
                    bitsAvail2 -= 8;
                    extrByte2 = extrByte2 >> 8;
                }
            }

            // code 3 7
            hash3 ^= extrBit * code3++;

            if(code3 == 8){
                extrByte3 |= hash3 << bitsAvail3;
                bitsAvail3 += 3;
                code3 = 1;
                hash3 = 0;

                if(bitsAvail3 >= 8){
                    out3[outPos3] = (extrByte3 & 0xFF) ^ gamma[outPos3++];
                    bitsAvail3 -= 8;
                    extrByte3 = extrByte3 >> 8;
                }
            }

            // code 4 15
            hash4 ^= extrBit * code4++;

            if(code4 == 16){
                extrByte4 |= hash4 << bitsAvail4;
                bitsAvail4 += 4;
                code4 = 1;
                hash4 = 0;

                if(bitsAvail4 >= 8){
                    out4[outPos4] = (extrByte4 & 0xFF) ^ gamma[outPos4++];
                    bitsAvail4 -= 8;
                    extrByte4 = extrByte4 >> 8;
                }
            }

            // code 5 31
            hash5 ^= extrBit * code5++;

            if(code5 == 32){
                extrByte5 |= hash5 << bitsAvail5;
                bitsAvail5 += 5;
                code5 = 1;
                hash5 = 0;

                if(bitsAvail5 >= 8){
                    out5[outPos5] = (extrByte5 & 0xFF) ^ gamma[outPos5++];
                    bitsAvail5 -= 8;
                    extrByte5 = extrByte5 >> 8;
                }
            }

            // code 6 63
            hash6 ^= extrBit * code6++;

            if(code6 == 64){
                extrByte6 |= hash6 << bitsAvail6;
                bitsAvail6 += 6;
                code6 = 1;
                hash6 = 0;

                if(bitsAvail6 >= 8){
                    out6[outPos6] = (extrByte6 & 0xFF) ^ gamma[outPos6++];
                    bitsAvail6 -= 8;
                    extrByte6 = extrByte6 >> 8;
                }
            }
            
            // code 7 127
            hash7 ^= extrBit * code7++;

            if(code7 == 128){
                extrByte7 |= hash7 << bitsAvail7;
                bitsAvail7 += 7;
                code7 = 1;
                hash7 = 0;

                if(bitsAvail7 >= 8){
                    out7[outPos7] = (extrByte7 & 0xFF) ^ gamma[outPos7++];
                    bitsAvail7 -= 8;
                    extrByte7 = extrByte7 >> 8;
                }
            }

        }

        if(bitsAvail > 0)  out[outPos]   = (extrByte  & 0xFF) ^ gamma[outPos];
        if(bitsAvail2 > 0 || hash2 !== 0) {extrByte2 |= hash2 << bitsAvail2; out2[outPos2] = (extrByte2 & 0xFF) ^ gamma[outPos2++];}
        if(bitsAvail3 > 0 || hash3 !== 0) {extrByte3 |= hash3 << bitsAvail3; out3[outPos3] = (extrByte3 & 0xFF) ^ gamma[outPos3++];}
        if(bitsAvail4 > 0 || hash3 !== 0) {extrByte4 |= hash4 << bitsAvail4; out4[outPos4] = (extrByte4 & 0xFF) ^ gamma[outPos4++];}
        if(bitsAvail5 > 0 || hash5 !== 0) {extrByte5 |= hash5 << bitsAvail5; out5[outPos5] = (extrByte5 & 0xFF) ^ gamma[outPos5++];}
        if(bitsAvail6 > 0 || hash6 !== 0) {extrByte6 |= hash6 << bitsAvail6; out6[outPos6] = (extrByte6 & 0xFF) ^ gamma[outPos6++];}
        if(bitsAvail7 > 0 || hash2 !== 0) {extrByte7 |= hash7 << bitsAvail7; out7[outPos7] = (extrByte7 & 0xFF) ^ gamma[outPos7++];}

        return [null,
            new Uint8Array(out.buffer, 0, outPos),
            new Uint8Array(out2.buffer, 0, outPos2),
            new Uint8Array(out3.buffer, 0, outPos3),
            new Uint8Array(out4.buffer, 0, outPos4),
            new Uint8Array(out5.buffer, 0, outPos5),
            new Uint8Array(out6.buffer, 0, outPos6),
            new Uint8Array(out7.buffer, 0, outPos7)
        ];
    };

	return constructor;

})();

var jpegClean = function(origAB) {
    "use strict";
    var i, l, posO = 2, posT = 2,
        orig = new Uint8Array(origAB),
        outData = new ArrayBuffer(orig.byteLength),
        output = new Uint8Array(outData);
    

    output[0] = orig[0];
    output[1] = orig[1];

    while (!(orig[posO] === 0xFF && orig[posO + 1] === 0xD9) && posO <= orig.byteLength) {
        if (orig[posO] === 0xFF && orig[posO + 1] === 0xFE) {
            l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
            for (i = 0; i < l; i++) {
                output[posT++] = orig[posO++];
            }
        } else if (orig[posO] === 0xFF && (orig[posO + 1] >> 4) === 0xE) {
            posO += 2 + orig[posO + 2] * 256 + orig[posO + 3];

            while(orig[posO] !== 0xFF){
                posO++;
            }

        } else if (orig[posO] === 0xFF && orig[posO + 1] === 0xDA) {
            l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
            for (i = 0; i < l; i++) {
                output[posT++] = orig[posO++];
            }
            while (!(orig[posO] === 0xFF && orig[posO + 1] === 0xD9) && posO <= orig.byteLength) {
                output[posT++] = orig[posO++];
            }
        } else {
            l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
            for (i = 0; i < l; i++) {
                output[posT++] = orig[posO++];
            }
        }


    }

    output[posT] = orig[posO];
    output[posT + 1] = orig[posO + 1];

    return new Uint8Array(outData, 0, posT + 2);
};

var steg_iv = [];
var stegger = new jsf5steg();

var _initIv = function(){
    "use strict";

    if(steg_iv.length === 0){
        steg_iv = sjcl.codec.bytes.fromBits(sjcl.misc.pbkdf2($('#steg_pwd').val(), $('#steg_pwd').val(), 1000, 256 * 8));
    }  
};

var jpegEmbed = function(img_container, data_array){
    "use strict";

    _initIv();

    try{
        stegger.parse(img_container, true);
    } catch(e){
        alert('Unsupported container image. Choose another.\n' + e);
        return false;
    }

    try{
        stegger.f5embed(data_array, steg_iv);
    } catch(e){
        alert('Capacity exceeded. Select bigger/more complex image.');
        return false;
    }

    return new Uint8Array(stegger.pack());
};

var jpegExtract = function(inArBuf) {
    "use strict";

    _initIv();

    try{
        stegger.parse(inArBuf);
    } catch(e){
        console.log('JPEG decode fail: ' + e);
        return false;
    }

    var data;
    try{
        data = stegger.f5extract(steg_iv);
    } catch(e){
        console.log('Steg extraction fail: ' + e);
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
            processJpgUrl(jpgURL[0], jpgURL[1], jpgURL[2]);
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
}

function isJpegReading(){
    "use strict";

    return isJpegLoading;
}
var upload_handler = (new Date()).getTime() * 10000;

var TinyBoardFields = ["name","email","subject","post","spoiler","body","file","file_url","password","thread","board", "recaptcha_challenge_field", "recaptcha_response_field", "user_flag"];

ParseUrl = function(url){
    "use strict";
    var m = (url || document.location.href).match( /https?:\/\/([^\/]+)\/([^\/]+)\/((\d+)|res\/(\d+)|\w+)(\.x?html)?(#i?(\d+))?/);
    return m?{host:m[1], board:m[2], page:m[4], thread:m[5], pointer:m[8]}:{};
};
var Hanabira={URL:ParseUrl()};

var sendBoardForm = function(file) {
    "use strict";
    replyForm.find("#do_encode").val('..Working...').attr("disabled", "disabled");

    if(["dmirrgetyojz735v.onion", "2-chru.net", "mirror.2-chru.net", "bypass.2-chru.net", "2chru.cafe", "2-chru.cafe"].indexOf(document.location.host.toLowerCase()) != -1){
        $('body').append('<iframe class="ninja" id="csstest" src="../csstest.foo"></iframe>');
        $('iframe.ninja#csstest').on('load', function(e){
            $(e.target).remove();
            _sendBoardForm(file, []);
        });
        return;
    }

    if ($('form[name*="postcontrols"]').length !==0) {
        $.ajax({
            url: location.href,
            type: 'GET',
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR) {
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
            error: function(jqXHR, textStatus, errorThrown) {
                alert('failed to get fresh form. Try again!');
                replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
                upload_handler = (new Date()).getTime() * 10000;
            }
        });
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
            formData.push({"name": "recaptcha_response_field", "value": $('div#qr .captcha-input.field').val()});
            formData.push({"name": "recaptcha_challenge_field", "value": $('div#qr .captcha-img img').attr('alt')});
            formData.push({"name": "com", "value": $('div#qr textarea').val()});

            formData.push({"name": "MAX_FILE_SIZE", "value": $('form[name=post] input[name=MAX_FILE_SIZE]').val()});
            formData.push({"name": "mode", "value": $('form[name=post] input[name=mode]').val()});
            formData.push({"name": "pwd", "value": $('form[name=post] input[name=pwd]').val()});
            formData.push({"name": "resto", "value": $('form[name=post] input[name=resto]').val()});

            formData.push({"name": "recaptcha_response_field", "value": $('div#qr .captcha-input.field').val()});
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

    $.ajax({
        url: formAction,
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        success: function(data, textStatus, jqXHR) {
            var doc = document.implementation.createHTMLDocument(''),
                p;
            doc.documentElement.innerHTML = data;

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
                $('#qr-shampoo, #shampoo').val('');
                $('#imgcaptcha').click();
                $('#recaptcha_reload').click();                
                $('#captchainput').val('');
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
                alert('Can\'t post. Wrong capch? Fucked up imageboard software?.');
                replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            }
            upload_handler = (new Date()).getTime() * 10000;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Error while posting. Something in network or so.\n[' + jqXHR.status + ' ' + jqXHR.statusText + ']');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            upload_handler = (new Date()).getTime() * 10000;
        }
    });
};

var rsaProfile = {},
    rsa = null,
    rsa_hash, rsa_hashB64, broadProfile = {}, broad_hashB64;

var do_login = function(e, key) {
    "use strict";
    var lf = document.loginform;
    if(!key){     
        rsaProfile = cryptCore.login(lf.passwd.value, lf.magik_num.value, false);
    }else{
        rsaProfile = cryptCore.login(null, null, true);
    }
    if(!rsaProfile) {
        rsaProfile = {};
        return false;
    }
    lf.magik_num.value = lf.passwd.value = '';

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
    }else{
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
    if(!final_container) return false;

    var out_file = appendBuffer(final_container, lastRand);
    
    var compressedB64 = arrayBufferDataUri(out_file);

    sendBoardForm(out_file);
};

var do_decode = function(message, msgPrepend, thumb, fdate, post_id) {
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
        isBroad: message.isBroad
    };

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
    var code = '<div id="hidbord_contacts_select"><strong>to:</strong>&nbsp;<select id="hidbord_cont_type"><option selected="selected" value="broadcast">Broadcast</option><option value="all">All contacts</option><option value="direct">Direct</option><option disabled="disabled">Groups:</option>';

    for (var i = 0; i < cont_groups.length; i++) {
        code += '<option value="group_'+safe_tags(cont_groups[i])+'">'+safe_tags(cont_groups[i])+'</option>';
    }
    
    code += '</select>&nbsp;<select id="hidbord_cont_direct" style="display: none;">';
    
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
                        '<span style="color: #090">su</span> Talk!<span style="font-size: x-small;">&nbsp;(v'+(typeof GM_info !== 'undefined' ? GM_info.script.version : GM_getMetadata("version"))+')</span></h3>'+
                    '<div class="hidbord_nav">'+
            '            <div class="hidbord_clickable active" id="hidbord_show_msgs">Messages</div>'+
            '            <div class="hidbord_clickable" id="hidbord_show_cntc">Contacts</div>'+
            '            <div class="hidbord_clickable" id="hidbord_show_cfg">Log in!</div>'+
            '        </div>'+
            '    </div>'+
                '<div style="position: absolute;left: 0;right: 0;bottom: 0;background-color: rgb(217,225,229);border-top: 1px solid #fff;  box-shadow: 0 0 10px #000;height: 27px;text-align: center;padding: 0 5px;">'+
                '<input type="button" value="Write reply" style="font-weight: bold;float: left;font-size: 12px;" id="hidbord_btn_reply">'+
                '<input type="button" value="Get old messages" style="font-size: 12px;" id="hidbord_btn_getold">&nbsp;<label><input type="checkbox" id="hidboard_option_autofetch" style="vertical-align:middle;" checked>autoscan</label>'+
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
            '.hidbord_mnu{ visibility: hidden; font-size: x-small; float:right; } '+
            '.hidbord_msg:hover .hidbord_mnu { visibility: visible; } '+
            '.hidbord_msg ol, .hidbord_msg ul { clear: both; } '+
            '.hidbord_mnu a { color: #999; padding: 0.2em 0.4em; text-decoration: none; border: 1px solid #fff; } '+
            '.hidbord_mnu a:hover { background: #fe8; border: 1px solid #db4; } '+
            '.hidbord_clickable { cursor: pointer; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: -moz-none; -ms-user-select: none; user-select: none; }'+
            '.hidbord_hidden { display: none; } .hidbord_main h3 {background: none}'+
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


};

var popup_del_timer;

var do_popup = function(e) {
	"use strict";

    var msgid = $(e.target).attr('alt'),
        fromId = $(e.target).closest('.hidbord_msg').first().attr('id').replace(/^msg_/, ''),
        msgClone, oMsg, oMsgH;

    $('#hidbord_popup_' + msgid).remove();
    $('body').append('<div class="hidbord_popup" id="hidbord_popup_' + msgid + '" style="position: fixed; top: 0; right: -1250px; width: 611px;"></div');

    if(!all_messages[msgid]){
        oMsg = msgClone = $('<div style="padding: 10px; background: #fee; border: 1px solid #f00; font-weight: bold; text-align:center;">NOT FOUND</div>');
        $('#hidbord_popup_' + msgid).append(msgClone);
        oMsgH = 50;
    } else{
        var msg = all_messages[msgid], txt, person, msgTimeTxt,
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

var push_msg = function(msg, msgPrepend, thumb) {
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

    var code = '<div class="hidbord_msg hidbord_msg_new" id="msg_' + msg.id + '" ' + (isDirect? '  style="border-left: 8px solid #090;"' : '') + (msg.isBroad? '  style="border-left: 8px solid #900;"' : '') + '>'+
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
    var endP = $('.hidbord_thread p').last()[0],
        pbbox1 = endP.getBoundingClientRect(), pbbox2; 

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
    
    var mbbox = $('#msg_' + msg.id)[0].getBoundingClientRect();
    if(mbbox.top < 0){
        pbbox2 = endP.getBoundingClientRect(); 
        $('.hidbord_thread')[0].scrollTop += Math.floor(pbbox2.top - pbbox1.top);
    }  

    new_messages++;
    $('#hidbord_notify_counter').text(new_messages).show();

};

var read_old_messages = function() {
	"use strict";

    if (isJpegReading()) {
        stopReadJpeg();
        return true;
    }
    var first = null;

    $('a[href*=jpg] img, a[href*=jpeg] img').each(function(i, e) {
        var url = $(e).closest('a').attr('href');
        var post_el = $(e).closest('.reply');
        var post_id = 0;

        if(post_el.length === 1){
            post_id = parseInt(post_el.attr('id').replace(/[^0-9]/g, ''));
            if(isNaN(post_id)){
                post_id = 0;
            }
        }

        if (url.indexOf('?') == -1 && url.match(/\.jpe?g$/)) {
            if(!first){
                first = [url+'', $(e).attr('src')+'', post_id+0];                
            }else{
                readJpeg(url, $(e).attr('src'), post_id);
            }
        }
    });

    if(first){
        readJpeg(first[0], first[1], first[2]);
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
                        container_data = jpegClean(dataURLtoUint8Array(buffer.toDataURL("image/jpeg", q)));
                        container_image= "data:image/Jpeg;base64," + arrayBufferDataUri(container_data);
                    };
                    img.src = "data:image/Jpeg;base64," +arrayBufferDataUri(inAB);
                }else{
                    container_data = jpegClean(inAB);
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

var safeStr2B64 = function(str){
    "use strict";
    return arrayBufferDataUri(strToUTF8Arr(str)).replace(/\+/g, '#');
};

var safeB642Str = function(str){
    "use strict";
    return utf8ArrToStr(dataURLtoUint8Array(',' + str.replace(/\#/g, '+')));
};

var saveURLs = function(str) {
    "use strict";

    str = str.replace(/(\[[^\]]+\]\([a-z]{3,6}\:[^\s\"><\`\]\)\(\[]+\))/ig, function(match, a) {
        return '`URL2:' + safeStr2B64(a) + '`';
    });

    return str.replace(/([a-z]{3,6}\:\/\/[^\s\"><\`]+)($|\s)/ig, function(match, a, b) {
        return '`URL:' + safeStr2B64(a+b) + '`';
    });
};

var restoreURLs = function(str) {
    "use strict";
    var txt, url, b = '';
    
    str = str.replace(/`URL2:([a-zA-Z0-9\/\#\=]+)`/ig, function(match, a) {
        url = safeB642Str(a).match(/\[([^\]]+)\]\(([a-z]{3,6}\:[^\s\"><\`\]\)\(\[]+)\)/);
        return '<a href="' + cleanUrl(url[2]) + '" target="_blank" rel="noreferrer">' + safe_tags(url[1]) + '</a>';
    });

    return str.replace(/`URL:([a-zA-Z0-9\/\#\=]+)`/ig, function(match, a) {        
        url = safeB642Str(a);

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
        return '`COD:' + safeStr2B64(b) + '`';
    });
};

var restoreCode = function(str) {
    "use strict";

    return str.replace(/`COD:([a-zA-Z0-9\/\#\=]+)`/ig, function(match, a) {
        return '<code>' + safe_tags(safeB642Str(a)) + '</code>';
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

        if(jpgURL.match(/\?/) && (jpgURL.match(/iqdb/) || jpgURL.match(/google/))){
            return false;
        }

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

    var insertAnimation = ' hidbordNodeInserted{from{clip:rect(1px,auto,auto,auto);}to{clip:rect(0px,auto,auto,auto);}}',
        animationTrigger = '{animation-duration:0.001s;-o-animation-duration:0.001s;-ms-animation-duration:0.001s;-moz-animation-duration:0.001s;-webkit-animation-duration:0.001s;animation-name:hidbordNodeInserted;-o-animation-name:hidbordNodeInserted;-ms-animation-name:hidbordNodeInserted;-moz-animation-name:hidbordNodeInserted;-webkit-animation-name:hidbordNodeInserted;}';

    $('<style type="text/css">@keyframes ' + insertAnimation + '@-moz-keyframes ' + insertAnimation + '@-webkit-keyframes ' +
        insertAnimation + '@-ms-keyframes ' + insertAnimation + '@-o-keyframes ' + insertAnimation +
        'a[href*=jpg] img, a[href*=jpeg] img ' + animationTrigger + '</style>').appendTo('head');

    setTimeout(startAnimeWatch, 1000);

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
    }

});

}

ddtMainFunction();
