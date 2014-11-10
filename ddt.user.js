// ==UserScript==
// @name         DesuDesuTalk
// @namespace    udp://desushelter/*
// @version      0.3.32
// @description  Write something useful!
// @include      http://dobrochan.com/*/*
// @include      http://dobrochan.ru/*/*
// @include      http://dobrochan.org/*/*
// @include      http://inach.org/*/*
// @include      https://8chan.co/*/*
// @include      https://lainchan.org/*/*
// @include      http://iichan.hk/*/*
// @include      http://2-ch.su/*/*
// @include      http://syn-ch.com/*/*
// @include      http://syn-ch.org/*/*
// @include      http://syn-ch.ru/*/*
// @include      http://krautchan.net/*/*
// @include      https://boards.4chan.org/*/thread/*
// @include      http://boards.4chan.org/*/thread/*
// @include      https://2ch.hk/*/*
// @include      https://2ch.re/*/*
// @include      https://2ch.tf/*/*
// @include      https://2ch.wf/*/*
// @include      https://2ch.yt/*/*
// @include      https://2-ch.so/*/*
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

(function(){
//fix for % escaping.
var _spoilerTag = '%' + '%';

var boardHostName = location.hostname.toLowerCase();

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+this.DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return (this.s<0)?-r:r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Extended JavaScript BN functions, required for RSA private ops.

// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix

// (public)
function bnClone() { var r = nbi(); this.copyTo(r); return r; }

// (public) return value as integer
function bnIntValue() {
  if(this.s < 0) {
    if(this.t == 1) return this[0]-this.DV;
    else if(this.t == 0) return -1;
  }
  else if(this.t == 1) return this[0];
  else if(this.t == 0) return 0;
  // assumes 16 < DB < 32
  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
}

// (public) return value as byte
function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

// (public) return value as short (assumes DB>=16)
function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if(this.s < 0) return -1;
  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
  else return 1;
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if(b == null) b = 10;
  if(this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b,cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = "";
  this.divRemTo(d,y,z);
  while(y.signum() > 0) {
    r = (a+z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d,y,z);
  }
  return z.intValue().toString(b) + r;
}

// (protected) convert from radix string
function bnpFromRadix(s,b) {
  this.fromInt(0);
  if(b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
  for(var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b*w+x;
    if(++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w,0);
      j = 0;
      w = 0;
    }
  }
  if(j > 0) {
    this.dMultiply(Math.pow(b,j));
    this.dAddOffset(w,0);
  }
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) alternate constructor
function bnpFromNumber(a,b,c) {
  if("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if(a < 2) this.fromInt(1);
    else {
      this.fromNumber(a,c);
      if(!this.testBit(a-1))	// force MSB set
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
      if(this.isEven()) this.dAddOffset(1,0); // force odd
      while(!this.isProbablePrime(b)) {
        this.dAddOffset(2,0);
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
      }
    }
  }
  else {
    // new BigInteger(int,RNG)
    var x = new Array(), t = a&7;
    x.length = (a>>3)+1;
    b.nextBytes(x);
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
    this.fromString(x,256);
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB-(i*this.DB)%8, d, k = 0;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
      r[k++] = d|(this.s<<(this.DB-p));
    while(i >= 0) {
      if(p < 8) {
        d = (this[i]&((1<<p)-1))<<(8-p);
        d |= this[--i]>>(p+=this.DB-8);
      }
      else {
        d = (this[i]>>(p-=8))&0xff;
        if(p <= 0) { p += this.DB; --i; }
      }
      if((d&0x80) != 0) d |= -256;
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
      if(k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
}

function bnEquals(a) { return(this.compareTo(a)==0); }
function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a,op,r) {
  var i, f, m = Math.min(a.t,this.t);
  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
  if(a.t < this.t) {
    f = a.s&this.DM;
    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
    r.t = this.t;
  }
  else {
    f = this.s&this.DM;
    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
    r.t = a.t;
  }
  r.s = op(this.s,a.s);
  r.clamp();
}

// (public) this & a
function op_and(x,y) { return x&y; }
function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

// (public) this | a
function op_or(x,y) { return x|y; }
function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

// (public) this ^ a
function op_xor(x,y) { return x^y; }
function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

// (public) this & ~a
function op_andnot(x,y) { return x&~y; }
function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

// (public) ~this
function bnNot() {
  var r = nbi();
  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}

// (public) this << n
function bnShiftLeft(n) {
  var r = nbi();
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
  return r;
}

// (public) this >> n
function bnShiftRight(n) {
  var r = nbi();
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
  return r;
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if(x == 0) return -1;
  var r = 0;
  if((x&0xffff) == 0) { x >>= 16; r += 16; }
  if((x&0xff) == 0) { x >>= 8; r += 8; }
  if((x&0xf) == 0) { x >>= 4; r += 4; }
  if((x&3) == 0) { x >>= 2; r += 2; }
  if((x&1) == 0) ++r;
  return r;
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for(var i = 0; i < this.t; ++i)
    if(this[i] != 0) return i*this.DB+lbit(this[i]);
  if(this.s < 0) return this.t*this.DB;
  return -1;
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0;
  while(x != 0) { x &= x-1; ++r; }
  return r;
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0, x = this.s&this.DM;
  for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
  return r;
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n/this.DB);
  if(j >= this.t) return(this.s!=0);
  return((this[j]&(1<<(n%this.DB)))!=0);
}

// (protected) this op (1<<n)
function bnpChangeBit(n,op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r,op,r);
  return r;
}

// (public) this | (1<<n)
function bnSetBit(n) { return this.changeBit(n,op_or); }

// (public) this & ~(1<<n)
function bnClearBit(n) { return this.changeBit(n,op_andnot); }

// (public) this ^ (1<<n)
function bnFlipBit(n) { return this.changeBit(n,op_xor); }

// (protected) r = this + a
function bnpAddTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]+a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c += a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c += a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c<0)?-1:0;
  if(c > 0) r[i++] = c;
  else if(c < -1) r[i++] = this.DV+c;
  r.t = i;
  r.clamp();
}

// (public) this + a
function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

// (public) this - a
function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

// (public) this * a
function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

// (public) this^2
function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

// (public) this / a
function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

// (public) this % a
function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a,q,r);
  return new Array(q,r);
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0,n-1,this,0,0,this.t);
  ++this.t;
  this.clamp();
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n,w) {
  if(n == 0) return;
  while(this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while(this[w] >= this.DV) {
    this[w] -= this.DV;
    if(++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
}

// A "null" reducer
function NullExp() {}
function nNop(x) { return x; }
function nMulTo(x,y,r) { x.multiplyTo(y,r); }
function nSqrTo(x,r) { x.squareTo(r); }

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

// (public) this^e
function bnPow(e) { return this.exp(e,new NullExp()); }

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a,n,r) {
  var i = Math.min(this.t+a.t,n);
  r.s = 0; // assumes a,this >= 0
  r.t = i;
  while(i > 0) r[--i] = 0;
  var j;
  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
  r.clamp();
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a,n,r) {
  --n;
  var i = r.t = this.t+a.t-n;
  r.s = 0; // assumes a,this >= 0
  while(--i >= 0) r[i] = 0;
  for(i = Math.max(n-this.t,0); i < a.t; ++i)
    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
  r.clamp();
  r.drShiftTo(1,r);
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}

function barrettConvert(x) {
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
  else if(x.compareTo(this.m) < 0) return x;
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
}

function barrettRevert(x) { return x; }

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  x.drShiftTo(this.m.t-1,this.r2);
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
  x.subTo(this.r2,x);
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = x^2 mod m; x != r
function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = x*y mod m; x,y != r
function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e,m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if(i <= 0) return r;
  else if(i < 18) k = 1;
  else if(i < 48) k = 3;
  else if(i < 144) k = 4;
  else if(i < 768) k = 5;
  else k = 6;
  if(i < 8)
    z = new Classic(m);
  else if(m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);

  // precomputation
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
  g[1] = z.convert(this);
  if(k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1],g2);
    while(n <= km) {
      g[n] = nbi();
      z.mulTo(g2,g[n-2],g[n]);
      n += 2;
    }
  }

  var j = e.t-1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e[j])-1;
  while(j >= 0) {
    if(i >= k1) w = (e[j]>>(i-k1))&km;
    else {
      w = (e[j]&((1<<(i+1))-1))<<(k1-i);
      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
    }

    n = k;
    while((w&1) == 0) { w >>= 1; --n; }
    if((i -= n) < 0) { i += this.DB; --j; }
    if(is1) {	// ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2,g[w],r);
    }

    while(j >= 0 && (e[j]&(1<<i)) == 0) {
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
      if(--i < 0) { i = this.DB-1; --j; }
    }
  }
  return z.revert(r);
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s<0)?this.negate():this.clone();
  var y = (a.s<0)?a.negate():a.clone();
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if(g < 0) return x;
  if(i < g) g = i;
  if(g > 0) {
    x.rShiftTo(g,x);
    y.rShiftTo(g,y);
  }
  while(x.signum() > 0) {
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
    if(x.compareTo(y) >= 0) {
      x.subTo(y,x);
      x.rShiftTo(1,x);
    }
    else {
      y.subTo(x,y);
      y.rShiftTo(1,y);
    }
  }
  if(g > 0) y.lShiftTo(g,y);
  return y;
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if(n <= 0) return 0;
  var d = this.DV%n, r = (this.s<0)?n-1:0;
  if(this.t > 0)
    if(d == 0) r = this[0]%n;
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
  return r;
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven();
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while(u.signum() != 0) {
    while(u.isEven()) {
      u.rShiftTo(1,u);
      if(ac) {
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
        a.rShiftTo(1,a);
      }
      else if(!b.isEven()) b.subTo(m,b);
      b.rShiftTo(1,b);
    }
    while(v.isEven()) {
      v.rShiftTo(1,v);
      if(ac) {
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
        c.rShiftTo(1,c);
      }
      else if(!d.isEven()) d.subTo(m,d);
      d.rShiftTo(1,d);
    }
    if(u.compareTo(v) >= 0) {
      u.subTo(v,u);
      if(ac) a.subTo(c,a);
      b.subTo(d,b);
    }
    else {
      v.subTo(u,v);
      if(ac) c.subTo(a,c);
      d.subTo(b,d);
    }
  }
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if(d.compareTo(m) >= 0) return d.subtract(m);
  if(d.signum() < 0) d.addTo(m,d); else return d;
  if(d.signum() < 0) return d.add(m); else return d;
}

var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
var lplim = (1<<26)/lowprimes[lowprimes.length-1];

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs();
  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
    for(i = 0; i < lowprimes.length; ++i)
      if(x[0] == lowprimes[i]) return true;
    return false;
  }
  if(x.isEven()) return false;
  i = 1;
  while(i < lowprimes.length) {
    var m = lowprimes[i], j = i+1;
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while(i < j) if(m%lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if(k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t+1)>>1;
  if(t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for(var i = 0; i < t; ++i) {
    //Pick bases at random, instead of starting at 2
    a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
    var y = a.modPow(r,this);
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while(j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2,this);
        if(y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if(y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}

// protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

// public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

// JSBN-specific extension
BigInteger.prototype.square = bnSquare;

// BigInteger interfaces not implemented in jsbn:

// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)

// prng4.js - uses Arcfour as a PRNG

function Arcfour() {
  this.i = 0;
  this.j = 0;
  this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
  var i, j, t;
  for(i = 0; i < 256; ++i)
    this.S[i] = i;
  j = 0;
  for(i = 0; i < 256; ++i) {
    j = (j + this.S[i] + key[i % key.length]) & 255;
    t = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = t;
  }
  this.i = 0;
  this.j = 0;
}

function ARC4next() {
  var t;
  this.i = (this.i + 1) & 255;
  this.j = (this.j + this.S[this.i]) & 255;
  t = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = t;
  return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
  return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

var rng_state;
var rng_pool;
var rng_pptr;
var rng_prefetch = 0;

// Mix in a 32-bit integer into the pool
function rng_seed_int(x) {
  rng_pool[rng_pptr++] ^= x & 255;
  rng_pool[rng_pptr++] ^= (x >> 8) & 255;
  rng_pool[rng_pptr++] ^= (x >> 16) & 255;
  rng_pool[rng_pptr++] ^= (x >> 24) & 255;
  if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}

// Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
  rng_seed_int(new Date().getTime());
}

// Initialize the pool with junk if needed.
if(rng_pool == null) {
  rng_pool = new Array();
  rng_pptr = 0;
  var t;
  if(window.crypto && window.crypto.getRandomValues) {
    // Use webcrypto if available
    var ua = new Uint8Array(32);
    window.crypto.getRandomValues(ua);
    for(t = 0; t < 32; ++t)
      rng_pool[rng_pptr++] = ua[t];
  }
  if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
    // Extract entropy (256 bits) from NS4 RNG if available
    var z = window.crypto.random(32);
    for(t = 0; t < z.length; ++t)
      rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
  }  
  while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
    t = Math.floor(65536 * Math.random());
    rng_pool[rng_pptr++] = t >>> 8;
    rng_pool[rng_pptr++] = t & 255;
  }
  rng_pptr = 0;
  rng_seed_time();
  //rng_seed_int(window.screenX);
  //rng_seed_int(window.screenY);
}

function rng_get_byte() {
  if(rng_state == null) {
    //rng_seed_time();
    rng_state = prng_newstate();
    rng_state.init(rng_pool);
    for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
      rng_pool[rng_pptr] = 0;
    rng_pptr = 0;
    //rng_pool = null;

    for (var i = 0; i < rng_prefetch; i++) {
      rng_state.next();
    };

  }
  // TODO: allow reseeding after first request
  return rng_state.next();
}

function rng_get_bytes(ba) {
  var i;
  for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
}

function SecureRandom() {}

SecureRandom.prototype.nextBytes = rng_get_bytes;

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s)    { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
function b64_sha1(s)    { return rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
function any_sha1(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
function hex_hmac_sha1(k, d)
  { return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_sha1(k, d)
  { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_sha1(k, d, e)
  { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA1 of a raw string
 */
function rstr_sha1(s)
{
  return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}

/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */
function rstr_hmac_sha1(key, data)
{
  var bkey = rstr2binb(key);
  if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
  return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var remainders = Array();
  var i, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. We stop when the dividend is zero.
   * All remainders are stored for later use.
   */
  while(dividend.length > 0)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[remainders.length] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  /* Append leading zero equivalents */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)))
  for(i = output.length; i < full_length; i++)
    output = encoding[0] + output;

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
  return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = bit_rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

var SHA256 = function(input1, byteOffset, byteLength) {
	"use strict";
	var input = input1;

	if(Object.prototype.toString.call(input1) == "[object Uint8Array]"){
		byteOffset = input1.byteOffset;
		byteLength = input1.byteLength;
		input = input1.buffer;
	}

	if (Object.prototype.toString.call(input) !== "[object ArrayBuffer]")
		throw new TypeError("First argument must be an ArrayBuffer");

	byteOffset >>>= 0;
	byteLength = (byteLength != null ? byteLength >>> 0 : input.byteLength - byteOffset);

	var
		  checksum_h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19])
		, input_trailing = byteLength & 0x3f
		, block_offset = byteOffset
		, block_num = (byteLength + 8) / 64 + 1 | 0
		, fill = 64
		, i, i_uint8, b
		, digest
		, tmp = new Uint32Array(2)
	;

	while (block_num--) {

		i = new DataView(new ArrayBuffer(256));
		i_uint8 = new Uint8Array(i.buffer);

		if (block_offset + 64 > byteLength) {
			if (input_trailing >= 0) {
				i_uint8.set(new Uint8Array(input, block_offset, input_trailing));
				i.setUint8(input_trailing, 0x80);
			}

			if (!block_num) {
				i.setUint32(64 - 4, byteLength << 3);
			} else {
				input_trailing -= 64;
			}

		} else {
			i_uint8.set(new Uint8Array(input, block_offset, 64));
		}

		b = new Uint32Array(checksum_h);
		block_offset += 64;

		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0x428A2F98 >>> 0) + i.getUint32(0); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0x71374491 >>> 0) + i.getUint32(4); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0xB5C0FBCF >>> 0) + i.getUint32(8); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0xE9B5DBA5 >>> 0) + i.getUint32(12); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x3956C25B >>> 0) + i.getUint32(16); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0x59F111F1 >>> 0) + i.getUint32(20); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x923F82A4 >>> 0) + i.getUint32(24); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0xAB1C5ED5 >>> 0) + i.getUint32(28); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0xD807AA98 >>> 0) + i.getUint32(32); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0x12835B01 >>> 0) + i.getUint32(36); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0x243185BE >>> 0) + i.getUint32(40); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0x550C7DC3 >>> 0) + i.getUint32(44); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x72BE5D74 >>> 0) + i.getUint32(48); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0x80DEB1FE >>> 0) + i.getUint32(52); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x9BDC06A7 >>> 0) + i.getUint32(56); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0xC19BF174 >>> 0) + i.getUint32(60); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0xE49B69C1 >>> 0) + (i.setUint32(64, ((((((i.getUint32(64 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(64 - 8) << (32 - 17))) ^ (((i.getUint32(64 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(64 - 8) << (32 - 19))) ^ ((i.getUint32(64 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(64 - 28) >>> 0) + ((((i.getUint32(64 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(64 - 60) << (32 - 7))) ^ (((i.getUint32(64 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(64 - 60) << (32 - 18))) ^ ((i.getUint32(64 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(64 - 64)), i.getUint32(64)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0xEFBE4786 >>> 0) + (i.setUint32(68, ((((((i.getUint32(68 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(68 - 8) << (32 - 17))) ^ (((i.getUint32(68 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(68 - 8) << (32 - 19))) ^ ((i.getUint32(68 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(68 - 28) >>> 0) + ((((i.getUint32(68 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(68 - 60) << (32 - 7))) ^ (((i.getUint32(68 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(68 - 60) << (32 - 18))) ^ ((i.getUint32(68 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(68 - 64)), i.getUint32(68)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0x0FC19DC6 >>> 0) + (i.setUint32(72, ((((((i.getUint32(72 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(72 - 8) << (32 - 17))) ^ (((i.getUint32(72 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(72 - 8) << (32 - 19))) ^ ((i.getUint32(72 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(72 - 28) >>> 0) + ((((i.getUint32(72 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(72 - 60) << (32 - 7))) ^ (((i.getUint32(72 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(72 - 60) << (32 - 18))) ^ ((i.getUint32(72 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(72 - 64)), i.getUint32(72)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0x240CA1CC >>> 0) + (i.setUint32(76, ((((((i.getUint32(76 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(76 - 8) << (32 - 17))) ^ (((i.getUint32(76 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(76 - 8) << (32 - 19))) ^ ((i.getUint32(76 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(76 - 28) >>> 0) + ((((i.getUint32(76 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(76 - 60) << (32 - 7))) ^ (((i.getUint32(76 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(76 - 60) << (32 - 18))) ^ ((i.getUint32(76 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(76 - 64)), i.getUint32(76)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x2DE92C6F >>> 0) + (i.setUint32(80, ((((((i.getUint32(80 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(80 - 8) << (32 - 17))) ^ (((i.getUint32(80 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(80 - 8) << (32 - 19))) ^ ((i.getUint32(80 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(80 - 28) >>> 0) + ((((i.getUint32(80 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(80 - 60) << (32 - 7))) ^ (((i.getUint32(80 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(80 - 60) << (32 - 18))) ^ ((i.getUint32(80 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(80 - 64)), i.getUint32(80)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0x4A7484AA >>> 0) + (i.setUint32(84, ((((((i.getUint32(84 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(84 - 8) << (32 - 17))) ^ (((i.getUint32(84 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(84 - 8) << (32 - 19))) ^ ((i.getUint32(84 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(84 - 28) >>> 0) + ((((i.getUint32(84 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(84 - 60) << (32 - 7))) ^ (((i.getUint32(84 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(84 - 60) << (32 - 18))) ^ ((i.getUint32(84 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(84 - 64)), i.getUint32(84)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x5CB0A9DC >>> 0) + (i.setUint32(88, ((((((i.getUint32(88 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(88 - 8) << (32 - 17))) ^ (((i.getUint32(88 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(88 - 8) << (32 - 19))) ^ ((i.getUint32(88 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(88 - 28) >>> 0) + ((((i.getUint32(88 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(88 - 60) << (32 - 7))) ^ (((i.getUint32(88 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(88 - 60) << (32 - 18))) ^ ((i.getUint32(88 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(88 - 64)), i.getUint32(88)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0x76F988DA >>> 0) + (i.setUint32(92, ((((((i.getUint32(92 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(92 - 8) << (32 - 17))) ^ (((i.getUint32(92 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(92 - 8) << (32 - 19))) ^ ((i.getUint32(92 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(92 - 28) >>> 0) + ((((i.getUint32(92 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(92 - 60) << (32 - 7))) ^ (((i.getUint32(92 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(92 - 60) << (32 - 18))) ^ ((i.getUint32(92 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(92 - 64)), i.getUint32(92)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0x983E5152 >>> 0) + (i.setUint32(96, ((((((i.getUint32(96 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(96 - 8) << (32 - 17))) ^ (((i.getUint32(96 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(96 - 8) << (32 - 19))) ^ ((i.getUint32(96 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(96 - 28) >>> 0) + ((((i.getUint32(96 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(96 - 60) << (32 - 7))) ^ (((i.getUint32(96 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(96 - 60) << (32 - 18))) ^ ((i.getUint32(96 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(96 - 64)), i.getUint32(96)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0xA831C66D >>> 0) + (i.setUint32(100, ((((((i.getUint32(100 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(100 - 8) << (32 - 17))) ^ (((i.getUint32(100 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(100 - 8) << (32 - 19))) ^ ((i.getUint32(100 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(100 - 28) >>> 0) + ((((i.getUint32(100 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(100 - 60) << (32 - 7))) ^ (((i.getUint32(100 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(100 - 60) << (32 - 18))) ^ ((i.getUint32(100 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(100 - 64)), i.getUint32(100)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0xB00327C8 >>> 0) + (i.setUint32(104, ((((((i.getUint32(104 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(104 - 8) << (32 - 17))) ^ (((i.getUint32(104 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(104 - 8) << (32 - 19))) ^ ((i.getUint32(104 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(104 - 28) >>> 0) + ((((i.getUint32(104 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(104 - 60) << (32 - 7))) ^ (((i.getUint32(104 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(104 - 60) << (32 - 18))) ^ ((i.getUint32(104 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(104 - 64)), i.getUint32(104)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0xBF597FC7 >>> 0) + (i.setUint32(108, ((((((i.getUint32(108 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(108 - 8) << (32 - 17))) ^ (((i.getUint32(108 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(108 - 8) << (32 - 19))) ^ ((i.getUint32(108 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(108 - 28) >>> 0) + ((((i.getUint32(108 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(108 - 60) << (32 - 7))) ^ (((i.getUint32(108 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(108 - 60) << (32 - 18))) ^ ((i.getUint32(108 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(108 - 64)), i.getUint32(108)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0xC6E00BF3 >>> 0) + (i.setUint32(112, ((((((i.getUint32(112 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(112 - 8) << (32 - 17))) ^ (((i.getUint32(112 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(112 - 8) << (32 - 19))) ^ ((i.getUint32(112 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(112 - 28) >>> 0) + ((((i.getUint32(112 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(112 - 60) << (32 - 7))) ^ (((i.getUint32(112 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(112 - 60) << (32 - 18))) ^ ((i.getUint32(112 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(112 - 64)), i.getUint32(112)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0xD5A79147 >>> 0) + (i.setUint32(116, ((((((i.getUint32(116 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(116 - 8) << (32 - 17))) ^ (((i.getUint32(116 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(116 - 8) << (32 - 19))) ^ ((i.getUint32(116 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(116 - 28) >>> 0) + ((((i.getUint32(116 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(116 - 60) << (32 - 7))) ^ (((i.getUint32(116 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(116 - 60) << (32 - 18))) ^ ((i.getUint32(116 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(116 - 64)), i.getUint32(116)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x06CA6351 >>> 0) + (i.setUint32(120, ((((((i.getUint32(120 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(120 - 8) << (32 - 17))) ^ (((i.getUint32(120 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(120 - 8) << (32 - 19))) ^ ((i.getUint32(120 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(120 - 28) >>> 0) + ((((i.getUint32(120 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(120 - 60) << (32 - 7))) ^ (((i.getUint32(120 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(120 - 60) << (32 - 18))) ^ ((i.getUint32(120 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(120 - 64)), i.getUint32(120)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0x14292967 >>> 0) + (i.setUint32(124, ((((((i.getUint32(124 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(124 - 8) << (32 - 17))) ^ (((i.getUint32(124 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(124 - 8) << (32 - 19))) ^ ((i.getUint32(124 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(124 - 28) >>> 0) + ((((i.getUint32(124 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(124 - 60) << (32 - 7))) ^ (((i.getUint32(124 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(124 - 60) << (32 - 18))) ^ ((i.getUint32(124 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(124 - 64)), i.getUint32(124)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0x27B70A85 >>> 0) + (i.setUint32(128, ((((((i.getUint32(128 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(128 - 8) << (32 - 17))) ^ (((i.getUint32(128 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(128 - 8) << (32 - 19))) ^ ((i.getUint32(128 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(128 - 28) >>> 0) + ((((i.getUint32(128 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(128 - 60) << (32 - 7))) ^ (((i.getUint32(128 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(128 - 60) << (32 - 18))) ^ ((i.getUint32(128 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(128 - 64)), i.getUint32(128)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0x2E1B2138 >>> 0) + (i.setUint32(132, ((((((i.getUint32(132 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(132 - 8) << (32 - 17))) ^ (((i.getUint32(132 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(132 - 8) << (32 - 19))) ^ ((i.getUint32(132 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(132 - 28) >>> 0) + ((((i.getUint32(132 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(132 - 60) << (32 - 7))) ^ (((i.getUint32(132 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(132 - 60) << (32 - 18))) ^ ((i.getUint32(132 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(132 - 64)), i.getUint32(132)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0x4D2C6DFC >>> 0) + (i.setUint32(136, ((((((i.getUint32(136 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(136 - 8) << (32 - 17))) ^ (((i.getUint32(136 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(136 - 8) << (32 - 19))) ^ ((i.getUint32(136 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(136 - 28) >>> 0) + ((((i.getUint32(136 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(136 - 60) << (32 - 7))) ^ (((i.getUint32(136 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(136 - 60) << (32 - 18))) ^ ((i.getUint32(136 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(136 - 64)), i.getUint32(136)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0x53380D13 >>> 0) + (i.setUint32(140, ((((((i.getUint32(140 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(140 - 8) << (32 - 17))) ^ (((i.getUint32(140 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(140 - 8) << (32 - 19))) ^ ((i.getUint32(140 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(140 - 28) >>> 0) + ((((i.getUint32(140 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(140 - 60) << (32 - 7))) ^ (((i.getUint32(140 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(140 - 60) << (32 - 18))) ^ ((i.getUint32(140 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(140 - 64)), i.getUint32(140)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x650A7354 >>> 0) + (i.setUint32(144, ((((((i.getUint32(144 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(144 - 8) << (32 - 17))) ^ (((i.getUint32(144 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(144 - 8) << (32 - 19))) ^ ((i.getUint32(144 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(144 - 28) >>> 0) + ((((i.getUint32(144 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(144 - 60) << (32 - 7))) ^ (((i.getUint32(144 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(144 - 60) << (32 - 18))) ^ ((i.getUint32(144 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(144 - 64)), i.getUint32(144)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0x766A0ABB >>> 0) + (i.setUint32(148, ((((((i.getUint32(148 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(148 - 8) << (32 - 17))) ^ (((i.getUint32(148 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(148 - 8) << (32 - 19))) ^ ((i.getUint32(148 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(148 - 28) >>> 0) + ((((i.getUint32(148 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(148 - 60) << (32 - 7))) ^ (((i.getUint32(148 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(148 - 60) << (32 - 18))) ^ ((i.getUint32(148 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(148 - 64)), i.getUint32(148)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x81C2C92E >>> 0) + (i.setUint32(152, ((((((i.getUint32(152 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(152 - 8) << (32 - 17))) ^ (((i.getUint32(152 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(152 - 8) << (32 - 19))) ^ ((i.getUint32(152 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(152 - 28) >>> 0) + ((((i.getUint32(152 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(152 - 60) << (32 - 7))) ^ (((i.getUint32(152 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(152 - 60) << (32 - 18))) ^ ((i.getUint32(152 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(152 - 64)), i.getUint32(152)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0x92722C85 >>> 0) + (i.setUint32(156, ((((((i.getUint32(156 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(156 - 8) << (32 - 17))) ^ (((i.getUint32(156 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(156 - 8) << (32 - 19))) ^ ((i.getUint32(156 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(156 - 28) >>> 0) + ((((i.getUint32(156 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(156 - 60) << (32 - 7))) ^ (((i.getUint32(156 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(156 - 60) << (32 - 18))) ^ ((i.getUint32(156 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(156 - 64)), i.getUint32(156)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0xA2BFE8A1 >>> 0) + (i.setUint32(160, ((((((i.getUint32(160 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(160 - 8) << (32 - 17))) ^ (((i.getUint32(160 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(160 - 8) << (32 - 19))) ^ ((i.getUint32(160 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(160 - 28) >>> 0) + ((((i.getUint32(160 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(160 - 60) << (32 - 7))) ^ (((i.getUint32(160 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(160 - 60) << (32 - 18))) ^ ((i.getUint32(160 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(160 - 64)), i.getUint32(160)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0xA81A664B >>> 0) + (i.setUint32(164, ((((((i.getUint32(164 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(164 - 8) << (32 - 17))) ^ (((i.getUint32(164 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(164 - 8) << (32 - 19))) ^ ((i.getUint32(164 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(164 - 28) >>> 0) + ((((i.getUint32(164 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(164 - 60) << (32 - 7))) ^ (((i.getUint32(164 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(164 - 60) << (32 - 18))) ^ ((i.getUint32(164 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(164 - 64)), i.getUint32(164)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0xC24B8B70 >>> 0) + (i.setUint32(168, ((((((i.getUint32(168 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(168 - 8) << (32 - 17))) ^ (((i.getUint32(168 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(168 - 8) << (32 - 19))) ^ ((i.getUint32(168 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(168 - 28) >>> 0) + ((((i.getUint32(168 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(168 - 60) << (32 - 7))) ^ (((i.getUint32(168 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(168 - 60) << (32 - 18))) ^ ((i.getUint32(168 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(168 - 64)), i.getUint32(168)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0xC76C51A3 >>> 0) + (i.setUint32(172, ((((((i.getUint32(172 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(172 - 8) << (32 - 17))) ^ (((i.getUint32(172 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(172 - 8) << (32 - 19))) ^ ((i.getUint32(172 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(172 - 28) >>> 0) + ((((i.getUint32(172 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(172 - 60) << (32 - 7))) ^ (((i.getUint32(172 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(172 - 60) << (32 - 18))) ^ ((i.getUint32(172 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(172 - 64)), i.getUint32(172)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0xD192E819 >>> 0) + (i.setUint32(176, ((((((i.getUint32(176 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(176 - 8) << (32 - 17))) ^ (((i.getUint32(176 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(176 - 8) << (32 - 19))) ^ ((i.getUint32(176 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(176 - 28) >>> 0) + ((((i.getUint32(176 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(176 - 60) << (32 - 7))) ^ (((i.getUint32(176 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(176 - 60) << (32 - 18))) ^ ((i.getUint32(176 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(176 - 64)), i.getUint32(176)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0xD6990624 >>> 0) + (i.setUint32(180, ((((((i.getUint32(180 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(180 - 8) << (32 - 17))) ^ (((i.getUint32(180 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(180 - 8) << (32 - 19))) ^ ((i.getUint32(180 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(180 - 28) >>> 0) + ((((i.getUint32(180 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(180 - 60) << (32 - 7))) ^ (((i.getUint32(180 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(180 - 60) << (32 - 18))) ^ ((i.getUint32(180 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(180 - 64)), i.getUint32(180)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0xF40E3585 >>> 0) + (i.setUint32(184, ((((((i.getUint32(184 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(184 - 8) << (32 - 17))) ^ (((i.getUint32(184 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(184 - 8) << (32 - 19))) ^ ((i.getUint32(184 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(184 - 28) >>> 0) + ((((i.getUint32(184 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(184 - 60) << (32 - 7))) ^ (((i.getUint32(184 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(184 - 60) << (32 - 18))) ^ ((i.getUint32(184 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(184 - 64)), i.getUint32(184)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0x106AA070 >>> 0) + (i.setUint32(188, ((((((i.getUint32(188 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(188 - 8) << (32 - 17))) ^ (((i.getUint32(188 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(188 - 8) << (32 - 19))) ^ ((i.getUint32(188 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(188 - 28) >>> 0) + ((((i.getUint32(188 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(188 - 60) << (32 - 7))) ^ (((i.getUint32(188 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(188 - 60) << (32 - 18))) ^ ((i.getUint32(188 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(188 - 64)), i.getUint32(188)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0x19A4C116 >>> 0) + (i.setUint32(192, ((((((i.getUint32(192 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(192 - 8) << (32 - 17))) ^ (((i.getUint32(192 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(192 - 8) << (32 - 19))) ^ ((i.getUint32(192 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(192 - 28) >>> 0) + ((((i.getUint32(192 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(192 - 60) << (32 - 7))) ^ (((i.getUint32(192 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(192 - 60) << (32 - 18))) ^ ((i.getUint32(192 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(192 - 64)), i.getUint32(192)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0x1E376C08 >>> 0) + (i.setUint32(196, ((((((i.getUint32(196 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(196 - 8) << (32 - 17))) ^ (((i.getUint32(196 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(196 - 8) << (32 - 19))) ^ ((i.getUint32(196 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(196 - 28) >>> 0) + ((((i.getUint32(196 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(196 - 60) << (32 - 7))) ^ (((i.getUint32(196 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(196 - 60) << (32 - 18))) ^ ((i.getUint32(196 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(196 - 64)), i.getUint32(196)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0x2748774C >>> 0) + (i.setUint32(200, ((((((i.getUint32(200 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(200 - 8) << (32 - 17))) ^ (((i.getUint32(200 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(200 - 8) << (32 - 19))) ^ ((i.getUint32(200 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(200 - 28) >>> 0) + ((((i.getUint32(200 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(200 - 60) << (32 - 7))) ^ (((i.getUint32(200 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(200 - 60) << (32 - 18))) ^ ((i.getUint32(200 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(200 - 64)), i.getUint32(200)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0x34B0BCB5 >>> 0) + (i.setUint32(204, ((((((i.getUint32(204 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(204 - 8) << (32 - 17))) ^ (((i.getUint32(204 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(204 - 8) << (32 - 19))) ^ ((i.getUint32(204 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(204 - 28) >>> 0) + ((((i.getUint32(204 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(204 - 60) << (32 - 7))) ^ (((i.getUint32(204 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(204 - 60) << (32 - 18))) ^ ((i.getUint32(204 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(204 - 64)), i.getUint32(204)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x391C0CB3 >>> 0) + (i.setUint32(208, ((((((i.getUint32(208 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(208 - 8) << (32 - 17))) ^ (((i.getUint32(208 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(208 - 8) << (32 - 19))) ^ ((i.getUint32(208 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(208 - 28) >>> 0) + ((((i.getUint32(208 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(208 - 60) << (32 - 7))) ^ (((i.getUint32(208 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(208 - 60) << (32 - 18))) ^ ((i.getUint32(208 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(208 - 64)), i.getUint32(208)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0x4ED8AA4A >>> 0) + (i.setUint32(212, ((((((i.getUint32(212 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(212 - 8) << (32 - 17))) ^ (((i.getUint32(212 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(212 - 8) << (32 - 19))) ^ ((i.getUint32(212 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(212 - 28) >>> 0) + ((((i.getUint32(212 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(212 - 60) << (32 - 7))) ^ (((i.getUint32(212 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(212 - 60) << (32 - 18))) ^ ((i.getUint32(212 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(212 - 64)), i.getUint32(212)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x5B9CCA4F >>> 0) + (i.setUint32(216, ((((((i.getUint32(216 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(216 - 8) << (32 - 17))) ^ (((i.getUint32(216 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(216 - 8) << (32 - 19))) ^ ((i.getUint32(216 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(216 - 28) >>> 0) + ((((i.getUint32(216 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(216 - 60) << (32 - 7))) ^ (((i.getUint32(216 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(216 - 60) << (32 - 18))) ^ ((i.getUint32(216 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(216 - 64)), i.getUint32(216)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0x682E6FF3 >>> 0) + (i.setUint32(220, ((((((i.getUint32(220 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(220 - 8) << (32 - 17))) ^ (((i.getUint32(220 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(220 - 8) << (32 - 19))) ^ ((i.getUint32(220 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(220 - 28) >>> 0) + ((((i.getUint32(220 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(220 - 60) << (32 - 7))) ^ (((i.getUint32(220 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(220 - 60) << (32 - 18))) ^ ((i.getUint32(220 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(220 - 64)), i.getUint32(220)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0x748F82EE >>> 0) + (i.setUint32(224, ((((((i.getUint32(224 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(224 - 8) << (32 - 17))) ^ (((i.getUint32(224 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(224 - 8) << (32 - 19))) ^ ((i.getUint32(224 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(224 - 28) >>> 0) + ((((i.getUint32(224 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(224 - 60) << (32 - 7))) ^ (((i.getUint32(224 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(224 - 60) << (32 - 18))) ^ ((i.getUint32(224 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(224 - 64)), i.getUint32(224)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0x78A5636F >>> 0) + (i.setUint32(228, ((((((i.getUint32(228 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(228 - 8) << (32 - 17))) ^ (((i.getUint32(228 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(228 - 8) << (32 - 19))) ^ ((i.getUint32(228 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(228 - 28) >>> 0) + ((((i.getUint32(228 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(228 - 60) << (32 - 7))) ^ (((i.getUint32(228 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(228 - 60) << (32 - 18))) ^ ((i.getUint32(228 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(228 - 64)), i.getUint32(228)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0x84C87814 >>> 0) + (i.setUint32(232, ((((((i.getUint32(232 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(232 - 8) << (32 - 17))) ^ (((i.getUint32(232 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(232 - 8) << (32 - 19))) ^ ((i.getUint32(232 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(232 - 28) >>> 0) + ((((i.getUint32(232 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(232 - 60) << (32 - 7))) ^ (((i.getUint32(232 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(232 - 60) << (32 - 18))) ^ ((i.getUint32(232 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(232 - 64)), i.getUint32(232)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0x8CC70208 >>> 0) + (i.setUint32(236, ((((((i.getUint32(236 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(236 - 8) << (32 - 17))) ^ (((i.getUint32(236 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(236 - 8) << (32 - 19))) ^ ((i.getUint32(236 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(236 - 28) >>> 0) + ((((i.getUint32(236 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(236 - 60) << (32 - 7))) ^ (((i.getUint32(236 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(236 - 60) << (32 - 18))) ^ ((i.getUint32(236 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(236 - 64)), i.getUint32(236)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x90BEFFFA >>> 0) + (i.setUint32(240, ((((((i.getUint32(240 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(240 - 8) << (32 - 17))) ^ (((i.getUint32(240 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(240 - 8) << (32 - 19))) ^ ((i.getUint32(240 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(240 - 28) >>> 0) + ((((i.getUint32(240 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(240 - 60) << (32 - 7))) ^ (((i.getUint32(240 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(240 - 60) << (32 - 18))) ^ ((i.getUint32(240 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(240 - 64)), i.getUint32(240)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0xA4506CEB >>> 0) + (i.setUint32(244, ((((((i.getUint32(244 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(244 - 8) << (32 - 17))) ^ (((i.getUint32(244 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(244 - 8) << (32 - 19))) ^ ((i.getUint32(244 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(244 - 28) >>> 0) + ((((i.getUint32(244 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(244 - 60) << (32 - 7))) ^ (((i.getUint32(244 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(244 - 60) << (32 - 18))) ^ ((i.getUint32(244 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(244 - 64)), i.getUint32(244)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0xBEF9A3F7 >>> 0) + (i.setUint32(248, ((((((i.getUint32(248 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(248 - 8) << (32 - 17))) ^ (((i.getUint32(248 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(248 - 8) << (32 - 19))) ^ ((i.getUint32(248 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(248 - 28) >>> 0) + ((((i.getUint32(248 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(248 - 60) << (32 - 7))) ^ (((i.getUint32(248 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(248 - 60) << (32 - 18))) ^ ((i.getUint32(248 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(248 - 64)), i.getUint32(248)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0xC67178F2 >>> 0) + (i.setUint32(252, ((((((i.getUint32(252 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(252 - 8) << (32 - 17))) ^ (((i.getUint32(252 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(252 - 8) << (32 - 19))) ^ ((i.getUint32(252 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(252 - 28) >>> 0) + ((((i.getUint32(252 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(252 - 60) << (32 - 7))) ^ (((i.getUint32(252 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(252 - 60) << (32 - 18))) ^ ((i.getUint32(252 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(252 - 64)), i.getUint32(252)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];

		checksum_h[0] += b[0];
		checksum_h[1] += b[1];
		checksum_h[2] += b[2];
		checksum_h[3] += b[3];
		checksum_h[4] += b[4];
		checksum_h[5] += b[5];
		checksum_h[6] += b[6];
		checksum_h[7] += b[7];
	}

	digest = new DataView(new ArrayBuffer(32));
	digest.setUint32(0, checksum_h[0]);
	digest.setUint32(4, checksum_h[1]);
	digest.setUint32(8, checksum_h[2]);
	digest.setUint32(12, checksum_h[3]);
	digest.setUint32(16, checksum_h[4]);
	digest.setUint32(20, checksum_h[5]);
	digest.setUint32(24, checksum_h[6]);
	digest.setUint32(28, checksum_h[7]);

	return bytesToHex(new Uint8Array(digest.buffer));
};

// Depends on jsbn.js and rng.js

// Version 1.1: support utf-8 encoding in pkcs1pad2

// convert a (hex) string to a bignum object
function parseBigInt(str,r) {
  return new BigInteger(str,r);
}

function linebrk(s,n) {
  var ret = "";
  var i = 0;
  while(i + n < s.length) {
    ret += s.substring(i,i+n) + "\n";
    i += n;
  }
  return ret + s.substring(i,s.length);
}

function byte2Hex(b) {
  if(b < 0x10)
    return "0" + b.toString(16);
  else
    return b.toString(16);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s,n) {
  if(n < s.length + 11) { // TODO: fix for utf-8
    alert("Message too long for RSA");
    return null;
  }
  var ba = new Array();
  var i = s.length - 1;
  while(i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    if(c < 128) { // encode using utf-8
      ba[--n] = c;
    }
    else if((c > 127) && (c < 2048)) {
      ba[--n] = (c & 63) | 128;
      ba[--n] = (c >> 6) | 192;
    }
    else {
      ba[--n] = (c & 63) | 128;
      ba[--n] = ((c >> 6) & 63) | 128;
      ba[--n] = (c >> 12) | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while(n > 2) { // random non-zero pad
    x[0] = 0;
    while(x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}

// "empty" RSA key constructor
function RSAKey() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N,E) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N,16);
    this.e = parseInt(E,16);
  }
  else
    alert("Invalid RSA public key");
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
  return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
  var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
  if(m == null) return null;
  var c = this.doPublic(m);
  if(c == null) return null;
  var h = c.toString(16);
  if((h.length & 1) == 0) return h; else return "0" + h;
}

// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

// Depends on rsa.js and jsbn2.js

// Version 1.1: support utf-8 decoding in pkcs1unpad2

// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
function pkcs1unpad2(d,n) {
  var b = d.toByteArray();
  var i = 0;
  while(i < b.length && b[i] == 0) ++i;
  if(b.length-i != n-1 || b[i] != 2)
    return null;
  ++i;
  while(b[i] != 0)
    if(++i >= b.length) return null;
  var ret = "";
  while(++i < b.length) {
    var c = b[i] & 255;
    if(c < 128) { // utf-8 decode
      ret += String.fromCharCode(c);
    }
    else if((c > 191) && (c < 224)) {
      ret += String.fromCharCode(((c & 31) << 6) | (b[i+1] & 63));
      ++i;
    }
    else {
      ret += String.fromCharCode(((c & 15) << 12) | ((b[i+1] & 63) << 6) | (b[i+2] & 63));
      i += 2;
    }
  }
  return ret;
}

// Set the private key fields N, e, and d from hex strings
function RSASetPrivate(N,E,D) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N,16);
    this.e = parseInt(E,16);
    this.d = parseBigInt(D,16);
  }
  else
    alert("Invalid RSA private key");
}

// Set the private key fields N, e, d and CRT params from hex strings
function RSASetPrivateEx(N,E,D,P,Q,DP,DQ,C) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N,16);
    this.e = parseInt(E,16);
    this.d = parseBigInt(D,16);
    this.p = parseBigInt(P,16);
    this.q = parseBigInt(Q,16);
    this.dmp1 = parseBigInt(DP,16);
    this.dmq1 = parseBigInt(DQ,16);
    this.coeff = parseBigInt(C,16);
  }
  else
    alert("Invalid RSA private key");
}

// Generate a new random private key B bits long, using public expt E
function RSAGenerate(B,E) {
  var rng = new SecureRandom();
  var qs = B>>1;
  this.e = parseInt(E,16);
  var ee = new BigInteger(E,16);
  for(;;) {
    for(;;) {
      this.p = new BigInteger(B-qs,1,rng);
      if(this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break;
    }
    for(;;) {
      this.q = new BigInteger(qs,1,rng);
      if(this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break;
    }
    if(this.p.compareTo(this.q) <= 0) {
      var t = this.p;
      this.p = this.q;
      this.q = t;
    }
    var p1 = this.p.subtract(BigInteger.ONE);
    var q1 = this.q.subtract(BigInteger.ONE);
    var phi = p1.multiply(q1);
    if(phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
      this.n = this.p.multiply(this.q);
      this.d = ee.modInverse(phi);
      this.dmp1 = this.d.mod(p1);
      this.dmq1 = this.d.mod(q1);
      this.coeff = this.q.modInverse(this.p);
      break;
    }
  }
}

// Perform raw private operation on "x": return x^d (mod n)
function RSADoPrivate(x) {
  if(this.p == null || this.q == null)
    return x.modPow(this.d, this.n);

  // TODO: re-calculate any missing CRT params
  var xp = x.mod(this.p).modPow(this.dmp1, this.p);
  var xq = x.mod(this.q).modPow(this.dmq1, this.q);

  while(xp.compareTo(xq) < 0)
    xp = xp.add(this.p);
  return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
}

// Return the PKCS#1 RSA decryption of "ctext".
// "ctext" is an even-length hex string and the output is a plain string.
function RSADecrypt(ctext) {
  var c = parseBigInt(ctext, 16);
  var m = this.doPrivate(c);
  if(m == null) return null;
  return pkcs1unpad2(m, (this.n.bitLength()+7)>>3);
}

// Return the PKCS#1 RSA decryption of "ctext".
// "ctext" is a Base64-encoded string and the output is a plain string.
//function RSAB64Decrypt(ctext) {
//  var h = b64tohex(ctext);
//  if(h) return this.decrypt(h); else return null;
//}

// protected
RSAKey.prototype.doPrivate = RSADoPrivate;

// public
RSAKey.prototype.setPrivate = RSASetPrivate;
RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
RSAKey.prototype.generate = RSAGenerate;
RSAKey.prototype.decrypt = RSADecrypt;
//RSAKey.prototype.b64_decrypt = RSAB64Decrypt;

//
// rsa-sign.js - adding signing functions to RSAKey class.
//
//
// version: 1.0 (2010-Jun-03)
//
// Copyright (c) 2010 Kenji Urushima (kenji.urushima@gmail.com)
//
// This software is licensed under the terms of the MIT License.
// http://www.opensource.org/licenses/mit-license.php
//
// The above copyright and license notice shall be 
// included in all copies or substantial portions of the Software.
//
// Depends on:
//   function sha1.hex(s) of sha1.js
//   jsbn.js
//   jsbn2.js
//   rsa.js
//   rsa2.js
//
// keysize / pmstrlen
//  512 /  128
// 1024 /  256
// 2048 /  512
// 4096 / 1024
// As for _RSASGIN_DIHEAD values for each hash algorithm, see PKCS#1 v2.1 spec (p38).
var _RSASIGN_DIHEAD = [];
_RSASIGN_DIHEAD['sha1'] = "3021300906052b0e03021a05000414";
_RSASIGN_DIHEAD['sha256'] = "3031300d060960864801650304020105000420";
//_RSASIGN_DIHEAD['md2'] = "3020300c06082a864886f70d020205000410";
//_RSASIGN_DIHEAD['md5'] = "3020300c06082a864886f70d020505000410";
//_RSASIGN_DIHEAD['sha384'] = "3041300d060960864801650304020205000430";
//_RSASIGN_DIHEAD['sha512'] = "3051300d060960864801650304020305000440";
var _RSASIGN_HASHHEXFUNC = [];
_RSASIGN_HASHHEXFUNC['sha1'] = hex_sha1;
_RSASIGN_HASHHEXFUNC['sha256'] = SHA256;

// ========================================================================
// Signature Generation
// ========================================================================

function _rsasign_getHexPaddedDigestInfoForString(s, keySize, hashAlg)
{
    var pmStrLen = keySize / 4;
    var hashFunc = _RSASIGN_HASHHEXFUNC[hashAlg];
    var sHashHex = hashFunc(s);

    var sHead = "0001";
    var sTail = "00" + _RSASIGN_DIHEAD[hashAlg] + sHashHex;
    var sMid = "";
    var fLen = pmStrLen - sHead.length - sTail.length;
    for (var i = 0; i < fLen; i += 2)
    {
        sMid += "ff";
    }
    return sHead + sMid + sTail;
}

function _rsasign_signString(s, hashAlg)
{
    var hPM = _rsasign_getHexPaddedDigestInfoForString(s, this.n.bitLength(), hashAlg);
    var biPaddedMessage = parseBigInt(hPM, 16);
    var biSign = this.doPrivate(biPaddedMessage);
    var hexSign = biSign.toString(16);
    return hexSign;
}

function _rsasign_signStringWithSHA1(s)
{
    var hPM = _rsasign_getHexPaddedDigestInfoForString(s, this.n.bitLength(), 'sha1');
    var biPaddedMessage = parseBigInt(hPM, 16);
    var biSign = this.doPrivate(biPaddedMessage);
    var hexSign = biSign.toString(16);
    return hexSign;
}

function _rsasign_signStringWithSHA256(s)
{
    var hPM = _rsasign_getHexPaddedDigestInfoForString(s, this.n.bitLength(), 'sha256');
    var biPaddedMessage = parseBigInt(hPM, 16);
    var biSign = this.doPrivate(biPaddedMessage);
    var hexSign = biSign.toString(16);
    return hexSign;
}

// ========================================================================
// Signature Verification
// ========================================================================

function _rsasign_getDecryptSignatureBI(biSig, hN, hE)
{
    var rsa = new RSAKey();
    rsa.setPublic(hN, hE);
    var biDecryptedSig = rsa.doPublic(biSig);
    return biDecryptedSig;
}

function _rsasign_getHexDigestInfoFromSig(biSig, hN, hE)
{
    var biDecryptedSig = _rsasign_getDecryptSignatureBI(biSig, hN, hE);
    var hDigestInfo = biDecryptedSig.toString(16).replace(/^\s*1f+00/, '');
    return hDigestInfo;
}

function _rsasign_getAlgNameAndHashFromHexDisgestInfo(hDigestInfo)
{
    for (var algName in _RSASIGN_DIHEAD)
    {
        var head = _RSASIGN_DIHEAD[algName];
        var len = head.length;
        if (hDigestInfo.substring(0, len) == head)
        {
            var a = [algName, hDigestInfo.substring(len)];
            return a;
        }
    }
    return [];
}

function _rsasign_verifySignatureWithArgs(sMsg, biSig, hN, hE)
{
    var hDigestInfo = _rsasign_getHexDigestInfoFromSig(biSig, hN, hE);
    var digestInfoAry = _rsasign_getAlgNameAndHashFromHexDisgestInfo(hDigestInfo);

    if (digestInfoAry.length == 0) return false;
    var algName = digestInfoAry[0];
    var diHashValue = digestInfoAry[1];
    var ff = _RSASIGN_HASHHEXFUNC[algName];
    var msgHashValue = ff(sMsg);
    return (diHashValue == msgHashValue);
}

function _rsasign_verifyHexSignatureForMessage(hSig, sMsg)
{
    var biSig = parseBigInt(hSig, 16);
    var result = _rsasign_verifySignatureWithArgs(sMsg, biSig, this.n.toString(16), this.e.toString(16));
    return result;
}

function _rsasign_verifyString(sMsg, hSig)
{
    hSig = hSig.replace(/[ \n]+/g, "");
    var biSig = parseBigInt(hSig, 16);
    var biDecryptedSig = this.doPublic(biSig);
    var hDigestInfo = biDecryptedSig.toString(16).replace(/^\s*1f+00/, '');
    var digestInfoAry = _rsasign_getAlgNameAndHashFromHexDisgestInfo(hDigestInfo);

    if (digestInfoAry.length == 0) return false;
    var algName = digestInfoAry[0];
    var diHashValue = digestInfoAry[1];
    var ff = _RSASIGN_HASHHEXFUNC[algName];
    var msgHashValue = ff(sMsg);
    return (diHashValue == msgHashValue);
}

RSAKey.prototype.signString = _rsasign_signString;
RSAKey.prototype.signStringWithSHA1 = _rsasign_signStringWithSHA1;
RSAKey.prototype.signStringWithSHA256 = _rsasign_signStringWithSHA256;

RSAKey.prototype.verifyString = _rsasign_verifyString;
RSAKey.prototype.verifyHexSignatureForMessage = _rsasign_verifyHexSignatureForMessage;

"use strict";var sjcl={cipher:{},hash:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
sjcl.cipher.aes=function(a){this.h[0][0][0]||this.z();var b,c,d,e,f=this.h[0][4],g=this.h[1];b=a.length;var h=1;if(b!==4&&b!==6&&b!==8)throw new sjcl.exception.invalid("invalid aes key size");this.a=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(a%b===0||b===8&&a%b===4){c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255];if(a%b===0){c=c<<8^c>>>24^h<<24;h=h<<1^(h>>7)*283}}d[a]=d[a-b]^c}for(b=0;a;b++,a--){c=d[b&3?a:a-4];e[b]=a<=4||b<4?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^
g[3][f[c&255]]}};
sjcl.cipher.aes.prototype={encrypt:function(a){return this.I(a,0)},decrypt:function(a){return this.I(a,1)},h:[[[],[],[],[],[]],[[],[],[],[],[]]],z:function(){var a=this.h[0],b=this.h[1],c=a[4],d=b[4],e,f,g,h=[],i=[],k,j,l,m;for(e=0;e<0x100;e++)i[(h[e]=e<<1^(e>>7)*283)^e]=e;for(f=g=0;!c[f];f^=k||1,g=i[g]||1){l=g^g<<1^g<<2^g<<3^g<<4;l=l>>8^l&255^99;c[f]=l;d[l]=f;j=h[e=h[k=h[f]]];m=j*0x1010101^e*0x10001^k*0x101^f*0x1010100;j=h[l]*0x101^l*0x1010100;for(e=0;e<4;e++){a[e][f]=j=j<<24^j>>>8;b[e][l]=m=m<<24^m>>>8}}for(e=
0;e<5;e++){a[e]=a[e].slice(0);b[e]=b[e].slice(0)}},I:function(a,b){if(a.length!==4)throw new sjcl.exception.invalid("invalid aes block size");var c=this.a[b],d=a[0]^c[0],e=a[b?3:1]^c[1],f=a[2]^c[2];a=a[b?1:3]^c[3];var g,h,i,k=c.length/4-2,j,l=4,m=[0,0,0,0];g=this.h[b];var n=g[0],o=g[1],p=g[2],q=g[3],r=g[4];for(j=0;j<k;j++){g=n[d>>>24]^o[e>>16&255]^p[f>>8&255]^q[a&255]^c[l];h=n[e>>>24]^o[f>>16&255]^p[a>>8&255]^q[d&255]^c[l+1];i=n[f>>>24]^o[a>>16&255]^p[d>>8&255]^q[e&255]^c[l+2];a=n[a>>>24]^o[d>>16&
255]^p[e>>8&255]^q[f&255]^c[l+3];l+=4;d=g;e=h;f=i}for(j=0;j<4;j++){m[b?3&-j:j]=r[d>>>24]<<24^r[e>>16&255]<<16^r[f>>8&255]<<8^r[a&255]^c[l++];g=d;d=e;e=f;f=a;a=g}return m}};
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.P(a.slice(b/32),32-(b&31)).slice(1);return c===undefined?a:sjcl.bitArray.clamp(a,c-b)},concat:function(a,b){if(a.length===0||b.length===0)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return d===32?a.concat(b):sjcl.bitArray.P(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;if(b===0)return 0;return(b-1)*32+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(a.length*32<b)return a;a=a.slice(0,Math.ceil(b/
32));var c=a.length;b&=31;if(c>0&&b)a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1);return a},partial:function(a,b,c){if(a===32)return b;return(c?b|0:b<<32-a)+a*0x10000000000},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return false;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return c===0},P:function(a,b,c,d){var e;e=0;if(d===undefined)d=[];for(;b>=32;b-=32){d.push(c);c=0}if(b===0)return d.concat(a);
for(e=0;e<a.length;e++){d.push(c|a[e]>>>b);c=a[e]<<32-b}e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,b+a>32?c:d.pop(),1));return d},k:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++){if((d&3)===0)e=a[d/4];b+=String.fromCharCode(e>>>24);e<<=8}return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++){d=d<<8|a.charCodeAt(c);if((c&3)===3){b.push(d);d=0}}c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,d*4)}};
sjcl.codec.base64={F:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b){var c="",d,e=0,f=sjcl.codec.base64.F,g=0,h=sjcl.bitArray.bitLength(a);for(d=0;c.length*6<h;){c+=f.charAt((g^a[d]>>>e)>>>26);if(e<6){g=a[d]<<6-e;e+=26;d++}else{g<<=6;e-=6}}for(;c.length&3&&!b;)c+="=";return c},toBits:function(a){a=a.replace(/\s|=/g,"");var b=[],c,d=0,e=sjcl.codec.base64.F,f=0,g;for(c=0;c<a.length;c++){g=e.indexOf(a.charAt(c));if(g<0)throw new sjcl.exception.invalid("this isn't base64!");
if(d>26){d-=26;b.push(f^g>>>d);f=g<<32-d}else{d+=6;f^=g<<32-d}}d&56&&b.push(sjcl.bitArray.partial(d&56,f,1));return b}};sjcl.hash.sha256=function(a){this.a[0]||this.z();if(a){this.n=a.n.slice(0);this.i=a.i.slice(0);this.e=a.e}else this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.n=this.N.slice(0);this.i=[];this.e=0;return this},update:function(a){if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);var b,c=this.i=sjcl.bitArray.concat(this.i,a);b=this.e;a=this.e=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)this.D(c.splice(0,16));return this},finalize:function(){var a,b=this.i,c=this.n;b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.e/
4294967296));for(b.push(this.e|0);b.length;)this.D(b.splice(0,16));this.reset();return c},N:[],a:[],z:function(){function a(e){return(e-Math.floor(e))*0x100000000|0}var b=0,c=2,d;a:for(;b<64;c++){for(d=2;d*d<=c;d++)if(c%d===0)continue a;if(b<8)this.N[b]=a(Math.pow(c,0.5));this.a[b]=a(Math.pow(c,1/3));b++}},D:function(a){var b,c,d=a.slice(0),e=this.n,f=this.a,g=e[0],h=e[1],i=e[2],k=e[3],j=e[4],l=e[5],m=e[6],n=e[7];for(a=0;a<64;a++){if(a<16)b=d[a];else{b=d[a+1&15];c=d[a+14&15];b=d[a&15]=(b>>>7^b>>>18^
b>>>3^b<<25^b<<14)+(c>>>17^c>>>19^c>>>10^c<<15^c<<13)+d[a&15]+d[a+9&15]|0}b=b+n+(j>>>6^j>>>11^j>>>25^j<<26^j<<21^j<<7)+(m^j&(l^m))+f[a];n=m;m=l;l=j;j=k+b|0;k=i;i=h;h=g;g=b+(h&i^k&(h^i))+(h>>>2^h>>>13^h>>>22^h<<30^h<<19^h<<10)|0}e[0]=e[0]+g|0;e[1]=e[1]+h|0;e[2]=e[2]+i|0;e[3]=e[3]+k|0;e[4]=e[4]+j|0;e[5]=e[5]+l|0;e[6]=e[6]+m|0;e[7]=e[7]+n|0}};
sjcl.mode.ccm={name:"ccm",encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,i=h.bitLength(c)/8,k=h.bitLength(g)/8;e=e||64;d=d||[];if(i<7)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(f=2;f<4&&k>>>8*f;f++);if(f<15-i)f=15-i;c=h.clamp(c,8*(15-f));b=sjcl.mode.ccm.H(a,b,c,d,e,f);g=sjcl.mode.ccm.J(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),i=f.clamp(b,h-e),k=f.bitSlice(b,
h-e);h=(h-e)/8;if(g<7)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(b=2;b<4&&h>>>8*b;b++);if(b<15-g)b=15-g;c=f.clamp(c,8*(15-b));i=sjcl.mode.ccm.J(a,i,c,k,e,b);a=sjcl.mode.ccm.H(a,i.data,c,d,e,b);if(!f.equal(i.tag,a))throw new sjcl.exception.corrupt("ccm: tag doesn't match");return i.data},H:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,i=h.k;e/=8;if(e%2||e<4||e>16)throw new sjcl.exception.invalid("ccm: invalid tag length");if(d.length>0xffffffff||b.length>0xffffffff)throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");
f=[h.partial(8,(d.length?64:0)|e-2<<2|f-1)];f=h.concat(f,c);f[3]|=h.bitLength(b)/8;f=a.encrypt(f);if(d.length){c=h.bitLength(d)/8;if(c<=65279)g=[h.partial(16,c)];else if(c<=0xffffffff)g=h.concat([h.partial(16,65534)],[c]);g=h.concat(g,d);for(d=0;d<g.length;d+=4)f=a.encrypt(i(f,g.slice(d,d+4).concat([0,0,0])))}for(d=0;d<b.length;d+=4)f=a.encrypt(i(f,b.slice(d,d+4).concat([0,0,0])));return h.clamp(f,e*8)},J:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.k;var i=b.length,k=h.bitLength(b);c=h.concat([h.partial(8,
f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!i)return{tag:d,data:[]};for(g=0;g<i;g+=4){c[3]++;e=a.encrypt(c);b[g]^=e[0];b[g+1]^=e[1];b[g+2]^=e[2];b[g+3]^=e[3]}return{tag:d,data:h.clamp(b,k)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){if(sjcl.bitArray.bitLength(c)!==128)throw new sjcl.exception.invalid("ocb iv must be 128 bits");var g,h=sjcl.mode.ocb2.B,i=sjcl.bitArray,k=i.k,j=[0,0,0,0];c=h(a.encrypt(c));var l,m=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4){l=b.slice(g,g+4);j=k(j,l);m=m.concat(k(c,a.encrypt(k(c,l))));c=h(c)}l=b.slice(g);b=i.bitLength(l);g=a.encrypt(k(c,[0,0,0,b]));l=i.clamp(k(l.concat([0,0,0]),g),b);j=k(j,k(l.concat([0,0,0]),g));j=a.encrypt(k(j,k(c,h(c))));
if(d.length)j=k(j,f?d:sjcl.mode.ocb2.pmac(a,d));return m.concat(i.concat(l,i.clamp(j,e)))},decrypt:function(a,b,c,d,e,f){if(sjcl.bitArray.bitLength(c)!==128)throw new sjcl.exception.invalid("ocb iv must be 128 bits");e=e||64;var g=sjcl.mode.ocb2.B,h=sjcl.bitArray,i=h.k,k=[0,0,0,0],j=g(a.encrypt(c)),l,m,n=sjcl.bitArray.bitLength(b)-e,o=[];d=d||[];for(c=0;c+4<n/32;c+=4){l=i(j,a.decrypt(i(j,b.slice(c,c+4))));k=i(k,l);o=o.concat(l);j=g(j)}m=n-c*32;l=a.encrypt(i(j,[0,0,0,m]));l=i(l,h.clamp(b.slice(c),
m).concat([0,0,0]));k=i(k,l);k=a.encrypt(i(k,i(j,g(j))));if(d.length)k=i(k,f?d:sjcl.mode.ocb2.pmac(a,d));if(!h.equal(h.clamp(k,e),h.bitSlice(b,n)))throw new sjcl.exception.corrupt("ocb: tag doesn't match");return o.concat(h.clamp(l,m))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.B,e=sjcl.bitArray,f=e.k,g=[0,0,0,0],h=a.encrypt([0,0,0,0]);h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4){h=d(h);g=f(g,a.encrypt(f(h,b.slice(c,c+4))))}b=b.slice(c);if(e.bitLength(b)<128){h=f(h,d(h));b=e.concat(b,[2147483648|0,0,
0,0])}g=f(g,b);return a.encrypt(f(d(f(h,d(h))),g))},B:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^(a[0]>>>31)*135]}};sjcl.misc.hmac=function(a,b){this.M=b=b||sjcl.hash.sha256;var c=[[],[]],d=b.prototype.blockSize/32;this.l=[new b,new b];if(a.length>d)a=b.hash(a);for(b=0;b<d;b++){c[0][b]=a[b]^909522486;c[1][b]=a[b]^1549556828}this.l[0].update(c[0]);this.l[1].update(c[1])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){a=(new this.M(this.l[0])).update(a).finalize();return(new this.M(this.l[1])).update(a).finalize()};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;if(d<0||c<0)throw sjcl.exception.invalid("invalid params to pbkdf2");if(typeof a==="string")a=sjcl.codec.utf8String.toBits(a);e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,i,k=[],j=sjcl.bitArray;for(i=1;32*k.length<(d||1);i++){e=f=a.encrypt(j.concat(b,[i]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}k=k.concat(e)}if(d)k=j.clamp(k,d);return k};
sjcl.random={randomWords:function(a,b){var c=[];b=this.isReady(b);var d;if(b===0)throw new sjcl.exception.notReady("generator isn't seeded");else b&2&&this.U(!(b&1));for(b=0;b<a;b+=4){(b+1)%0x10000===0&&this.L();d=this.w();c.push(d[0],d[1],d[2],d[3])}this.L();return c.slice(0,a)},setDefaultParanoia:function(a){this.t=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=(new Date).valueOf(),g=this.q[c],h=this.isReady(),i=0;d=this.G[c];if(d===undefined)d=this.G[c]=this.R++;if(g===undefined)g=this.q[c]=
0;this.q[c]=(this.q[c]+1)%this.b.length;switch(typeof a){case "number":if(b===undefined)b=1;this.b[g].update([d,this.u++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if(c==="[object Uint32Array]"){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else{if(c!=="[object Array]")i=1;for(c=0;c<a.length&&!i;c++)if(typeof a[c]!="number")i=1}if(!i){if(b===undefined)for(c=b=0;c<a.length;c++)for(e=a[c];e>0;){b++;e>>>=1}this.b[g].update([d,this.u++,2,b,f,a.length].concat(a))}break;case "string":if(b===
undefined)b=a.length;this.b[g].update([d,this.u++,3,b,f,a.length]);this.b[g].update(a);break;default:i=1}if(i)throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");this.j[g]+=b;this.f+=b;if(h===0){this.isReady()!==0&&this.K("seeded",Math.max(this.g,this.f));this.K("progress",this.getProgress())}},isReady:function(a){a=this.C[a!==undefined?a:this.t];return this.g&&this.g>=a?this.j[0]>80&&(new Date).valueOf()>this.O?3:1:this.f>=a?2:0},getProgress:function(a){a=
this.C[a?a:this.t];return this.g>=a?1:this.f>a?1:this.f/a},startCollectors:function(){if(!this.m){if(window.addEventListener){window.addEventListener("load",this.o,false);window.addEventListener("mousemove",this.p,false)}else if(document.attachEvent){document.attachEvent("onload",this.o);document.attachEvent("onmousemove",this.p)}else throw new sjcl.exception.bug("can't attach event");this.m=true}},stopCollectors:function(){if(this.m){if(window.removeEventListener){window.removeEventListener("load",
this.o,false);window.removeEventListener("mousemove",this.p,false)}else if(window.detachEvent){window.detachEvent("onload",this.o);window.detachEvent("onmousemove",this.p)}this.m=false}},addEventListener:function(a,b){this.r[a][this.Q++]=b},removeEventListener:function(a,b){var c;a=this.r[a];var d=[];for(c in a)a.hasOwnProperty(c)&&a[c]===b&&d.push(c);for(b=0;b<d.length;b++){c=d[b];delete a[c]}},b:[new sjcl.hash.sha256],j:[0],A:0,q:{},u:0,G:{},R:0,g:0,f:0,O:0,a:[0,0,0,0,0,0,0,0],d:[0,0,0,0],s:undefined,
t:6,m:false,r:{progress:{},seeded:{}},Q:0,C:[0,48,64,96,128,192,0x100,384,512,768,1024],w:function(){for(var a=0;a<4;a++){this.d[a]=this.d[a]+1|0;if(this.d[a])break}return this.s.encrypt(this.d)},L:function(){this.a=this.w().concat(this.w());this.s=new sjcl.cipher.aes(this.a)},T:function(a){this.a=sjcl.hash.sha256.hash(this.a.concat(a));this.s=new sjcl.cipher.aes(this.a);for(a=0;a<4;a++){this.d[a]=this.d[a]+1|0;if(this.d[a])break}},U:function(a){var b=[],c=0,d;this.O=b[0]=(new Date).valueOf()+3E4;for(d=
0;d<16;d++)b.push(Math.random()*0x100000000|0);for(d=0;d<this.b.length;d++){b=b.concat(this.b[d].finalize());c+=this.j[d];this.j[d]=0;if(!a&&this.A&1<<d)break}if(this.A>=1<<this.b.length){this.b.push(new sjcl.hash.sha256);this.j.push(0)}this.f-=c;if(c>this.g)this.g=c;this.A++;this.T(b)},p:function(a){sjcl.random.addEntropy([a.x||a.clientX||a.offsetX||0,a.y||a.clientY||a.offsetY||0],2,"mouse")},o:function(){sjcl.random.addEntropy((new Date).valueOf(),2,"loadtime")},K:function(a,b){var c;a=sjcl.random.r[a];
var d=[];for(c in a)a.hasOwnProperty(c)&&d.push(a[c]);for(c=0;c<d.length;c++)d[c](b)}};try{var s=new Uint32Array(32);crypto.getRandomValues(s);sjcl.random.addEntropy(s,1024,"crypto['getRandomValues']")}catch(t){}
sjcl.json={defaults:{v:1,iter:1E3,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},encrypt:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.c({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.c(f,c);c=f.adata;if(typeof f.salt==="string")f.salt=sjcl.codec.base64.toBits(f.salt);if(typeof f.iv==="string")f.iv=sjcl.codec.base64.toBits(f.iv);if(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||typeof a==="string"&&f.iter<=100||f.ts!==64&&f.ts!==96&&f.ts!==128||f.ks!==128&&f.ks!==192&&f.ks!==0x100||f.iv.length<
2||f.iv.length>4)throw new sjcl.exception.invalid("json encrypt: invalid parameters");if(typeof a==="string"){g=sjcl.misc.cachedPbkdf2(a,f);a=g.key.slice(0,f.ks/32);f.salt=g.salt}if(typeof b==="string")b=sjcl.codec.utf8String.toBits(b);if(typeof c==="string")c=sjcl.codec.utf8String.toBits(c);g=new sjcl.cipher[f.cipher](a);e.c(d,f);d.key=a;f.ct=sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},decrypt:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.c(e.c(e.c({},e.defaults),b),
c,true);var f;c=b.adata;if(typeof b.salt==="string")b.salt=sjcl.codec.base64.toBits(b.salt);if(typeof b.iv==="string")b.iv=sjcl.codec.base64.toBits(b.iv);if(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||typeof a==="string"&&b.iter<=100||b.ts!==64&&b.ts!==96&&b.ts!==128||b.ks!==128&&b.ks!==192&&b.ks!==0x100||!b.iv||b.iv.length<2||b.iv.length>4)throw new sjcl.exception.invalid("json decrypt: invalid parameters");if(typeof a==="string"){f=sjcl.misc.cachedPbkdf2(a,b);a=f.key.slice(0,b.ks/32);b.salt=f.salt}if(typeof c===
"string")c=sjcl.codec.utf8String.toBits(c);f=new sjcl.cipher[b.cipher](a);c=sjcl.mode[b.mode].decrypt(f,b.ct,b.iv,c,b.ts);e.c(d,b);d.key=a;return sjcl.codec.bytes.fromBits(c)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b)){if(!b.match(/^[a-z0-9]+$/i))throw new sjcl.exception.invalid("json encode: invalid property name");c+=d+'"'+b+'":';d=",";switch(typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+
sjcl.codec.base64.fromBits(a[b],1)+'"';break;default:throw new sjcl.exception.bug("json encode: unsupported type");}}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");if(!a.match(/^\{.*\}$/))throw new sjcl.exception.invalid("json decode: this isn't json!");a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++){if(!(d=a[c].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i)))throw new sjcl.exception.invalid("json decode: this isn't json!");b[d[2]]=
d[3]?parseInt(d[3],10):d[2].match(/^(ct|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4])}return b},c:function(a,b,c){if(a===undefined)a={};if(b===undefined)return a;var d;for(d in b)if(b.hasOwnProperty(d)){if(c&&a[d]!==undefined&&a[d]!==b[d])throw new sjcl.exception.invalid("required parameter overridden");a[d]=b[d]}return a},V:function(a,b){var c={},d;for(d=0;d<b.length;d++)if(a[b[d]]!==undefined)c[b[d]]=a[b[d]];return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;
sjcl.misc.S={};sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.S,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=b.salt===undefined?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};

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

/* Zepto v1.1.3 - zepto event ajax form ie - zeptojs.com/license */
var Zepto=function(){function L(t){return null==t?String(t):j[T.call(t)]||"object"}function Z(t){return"function"==L(t)}function $(t){return null!=t&&t==t.window}function _(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function D(t){return"object"==L(t)}function R(t){return D(t)&&!$(t)&&Object.getPrototypeOf(t)==Object.prototype}function M(t){return"number"==typeof t.length}function k(t){return s.call(t,function(t){return null!=t})}function z(t){return t.length>0?n.fn.concat.apply([],t):t}function F(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function q(t){return t in f?f[t]:f[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function H(t,e){return"number"!=typeof e||c[F(t)]?e:e+"px"}function I(t){var e,n;return u[t]||(e=a.createElement(t),a.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),u[t]=n),u[t]}function V(t){return"children"in t?o.call(t.children):n.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function U(n,i,r){for(e in i)r&&(R(i[e])||A(i[e]))?(R(i[e])&&!R(n[e])&&(n[e]={}),A(i[e])&&!A(n[e])&&(n[e]=[]),U(n[e],i[e],r)):i[e]!==t&&(n[e]=i[e])}function B(t,e){return null==e?n(t):n(t).filter(e)}function J(t,e,n,i){return Z(e)?e.call(t,n,i):e}function X(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function W(e,n){var i=e.className,r=i&&i.baseVal!==t;return n===t?r?i.baseVal:i:void(r?i.baseVal=n:e.className=n)}function Y(t){var e;try{return t?"true"==t||("false"==t?!1:"null"==t?null:/^0/.test(t)||isNaN(e=Number(t))?/^[\[\{]/.test(t)?n.parseJSON(t):t:e):t}catch(i){return t}}function G(t,e){e(t);for(var n in t.childNodes)G(t.childNodes[n],e)}var t,e,n,i,C,N,r=[],o=r.slice,s=r.filter,a=window.document,u={},f={},c={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},l=/^\s*<(\w+|!)[^>]*>/,h=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,p=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,d=/^(?:body|html)$/i,m=/([A-Z])/g,g=["val","css","html","text","data","width","height","offset"],v=["after","prepend","before","append"],y=a.createElement("table"),x=a.createElement("tr"),b={tr:a.createElement("tbody"),tbody:y,thead:y,tfoot:y,td:x,th:x,"*":a.createElement("div")},w=/complete|loaded|interactive/,E=/^[\w-]*$/,j={},T=j.toString,S={},O=a.createElement("div"),P={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},A=Array.isArray||function(t){return t instanceof Array};return S.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var i,r=t.parentNode,o=!r;return o&&(r=O).appendChild(t),i=~S.qsa(r,e).indexOf(t),o&&O.removeChild(t),i},C=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},N=function(t){return s.call(t,function(e,n){return t.indexOf(e)==n})},S.fragment=function(e,i,r){var s,u,f;return h.test(e)&&(s=n(a.createElement(RegExp.$1))),s||(e.replace&&(e=e.replace(p,"<$1></$2>")),i===t&&(i=l.test(e)&&RegExp.$1),i in b||(i="*"),f=b[i],f.innerHTML=""+e,s=n.each(o.call(f.childNodes),function(){f.removeChild(this)})),R(r)&&(u=n(s),n.each(r,function(t,e){g.indexOf(t)>-1?u[t](e):u.attr(t,e)})),s},S.Z=function(t,e){return t=t||[],t.__proto__=n.fn,t.selector=e||"",t},S.isZ=function(t){return t instanceof S.Z},S.init=function(e,i){var r;if(!e)return S.Z();if("string"==typeof e)if(e=e.trim(),"<"==e[0]&&l.test(e))r=S.fragment(e,RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=S.qsa(a,e)}else{if(Z(e))return n(a).ready(e);if(S.isZ(e))return e;if(A(e))r=k(e);else if(D(e))r=[e],e=null;else if(l.test(e))r=S.fragment(e.trim(),RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=S.qsa(a,e)}}return S.Z(r,e)},n=function(t,e){return S.init(t,e)},n.extend=function(t){var e,n=o.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){U(t,n,e)}),t},S.qsa=function(t,e){var n,i="#"==e[0],r=!i&&"."==e[0],s=i||r?e.slice(1):e,a=E.test(s);return _(t)&&a&&i?(n=t.getElementById(s))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:o.call(a&&!i?r?t.getElementsByClassName(s):t.getElementsByTagName(e):t.querySelectorAll(e))},n.contains=function(t,e){return t!==e&&t.contains(e)},n.type=L,n.isFunction=Z,n.isWindow=$,n.isArray=A,n.isPlainObject=R,n.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},n.inArray=function(t,e,n){return r.indexOf.call(e,t,n)},n.camelCase=C,n.trim=function(t){return null==t?"":String.prototype.trim.call(t)},n.uuid=0,n.support={},n.expr={},n.map=function(t,e){var n,r,o,i=[];if(M(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&i.push(n);else for(o in t)n=e(t[o],o),null!=n&&i.push(n);return z(i)},n.each=function(t,e){var n,i;if(M(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(i in t)if(e.call(t[i],i,t[i])===!1)return t;return t},n.grep=function(t,e){return s.call(t,e)},window.JSON&&(n.parseJSON=JSON.parse),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){j["[object "+e+"]"]=e.toLowerCase()}),n.fn={forEach:r.forEach,reduce:r.reduce,push:r.push,sort:r.sort,indexOf:r.indexOf,concat:r.concat,map:function(t){return n(n.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return n(o.apply(this,arguments))},ready:function(t){return w.test(a.readyState)&&a.body?t(n):a.addEventListener("DOMContentLoaded",function(){t(n)},!1),this},get:function(e){return e===t?o.call(this):this[e>=0?e:e+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return r.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return Z(t)?this.not(this.not(t)):n(s.call(this,function(e){return S.matches(e,t)}))},add:function(t,e){return n(N(this.concat(n(t,e))))},is:function(t){return this.length>0&&S.matches(this[0],t)},not:function(e){var i=[];if(Z(e)&&e.call!==t)this.each(function(t){e.call(this,t)||i.push(this)});else{var r="string"==typeof e?this.filter(e):M(e)&&Z(e.item)?o.call(e):n(e);this.forEach(function(t){r.indexOf(t)<0&&i.push(t)})}return n(i)},has:function(t){return this.filter(function(){return D(t)?n.contains(this,t):n(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!D(t)?t:n(t)},last:function(){var t=this[this.length-1];return t&&!D(t)?t:n(t)},find:function(t){var e,i=this;return e="object"==typeof t?n(t).filter(function(){var t=this;return r.some.call(i,function(e){return n.contains(e,t)})}):1==this.length?n(S.qsa(this[0],t)):this.map(function(){return S.qsa(this,t)})},closest:function(t,e){var i=this[0],r=!1;for("object"==typeof t&&(r=n(t));i&&!(r?r.indexOf(i)>=0:S.matches(i,t));)i=i!==e&&!_(i)&&i.parentNode;return n(i)},parents:function(t){for(var e=[],i=this;i.length>0;)i=n.map(i,function(t){return(t=t.parentNode)&&!_(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return B(e,t)},parent:function(t){return B(N(this.pluck("parentNode")),t)},children:function(t){return B(this.map(function(){return V(this)}),t)},contents:function(){return this.map(function(){return o.call(this.childNodes)})},siblings:function(t){return B(this.map(function(t,e){return s.call(V(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return n.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=I(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=Z(t);if(this[0]&&!e)var i=n(t).get(0),r=i.parentNode||this.length>1;return this.each(function(o){n(this).wrapAll(e?t.call(this,o):r?i.cloneNode(!0):i)})},wrapAll:function(t){if(this[0]){n(this[0]).before(t=n(t));for(var e;(e=t.children()).length;)t=e.first();n(t).append(this)}return this},wrapInner:function(t){var e=Z(t);return this.each(function(i){var r=n(this),o=r.contents(),s=e?t.call(this,i):t;o.length?o.wrapAll(s):r.append(s)})},unwrap:function(){return this.parent().each(function(){n(this).replaceWith(n(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var i=n(this);(e===t?"none"==i.css("display"):e)?i.show():i.hide()})},prev:function(t){return n(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return n(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0===arguments.length?this.length>0?this[0].innerHTML:null:this.each(function(e){var i=this.innerHTML;n(this).empty().append(J(this,t,e,i))})},text:function(e){return 0===arguments.length?this.length>0?this[0].textContent:null:this.each(function(){this.textContent=e===t?"":""+e})},attr:function(n,i){var r;return"string"==typeof n&&i===t?0==this.length||1!==this[0].nodeType?t:"value"==n&&"INPUT"==this[0].nodeName?this.val():!(r=this[0].getAttribute(n))&&n in this[0]?this[0][n]:r:this.each(function(t){if(1===this.nodeType)if(D(n))for(e in n)X(this,e,n[e]);else X(this,n,J(this,i,t,this.getAttribute(n)))})},removeAttr:function(t){return this.each(function(){1===this.nodeType&&X(this,t)})},prop:function(e,n){return e=P[e]||e,n===t?this[0]&&this[0][e]:this.each(function(t){this[e]=J(this,n,t,this[e])})},data:function(e,n){var i=this.attr("data-"+e.replace(m,"-$1").toLowerCase(),n);return null!==i?Y(i):t},val:function(t){return 0===arguments.length?this[0]&&(this[0].multiple?n(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value):this.each(function(e){this.value=J(this,t,e,this.value)})},offset:function(t){if(t)return this.each(function(e){var i=n(this),r=J(this,t,e,i.offset()),o=i.offsetParent().offset(),s={top:r.top-o.top,left:r.left-o.left};"static"==i.css("position")&&(s.position="relative"),i.css(s)});if(0==this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(t,i){if(arguments.length<2){var r=this[0],o=getComputedStyle(r,"");if(!r)return;if("string"==typeof t)return r.style[C(t)]||o.getPropertyValue(t);if(A(t)){var s={};return n.each(A(t)?t:[t],function(t,e){s[e]=r.style[C(e)]||o.getPropertyValue(e)}),s}}var a="";if("string"==L(t))i||0===i?a=F(t)+":"+H(t,i):this.each(function(){this.style.removeProperty(F(t))});else for(e in t)t[e]||0===t[e]?a+=F(e)+":"+H(e,t[e])+";":this.each(function(){this.style.removeProperty(F(e))});return this.each(function(){this.style.cssText+=";"+a})},index:function(t){return t?this.indexOf(n(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?r.some.call(this,function(t){return this.test(W(t))},q(t)):!1},addClass:function(t){return t?this.each(function(e){i=[];var r=W(this),o=J(this,t,e,r);
o.split(/\s+/g).forEach(function(t){n(this).hasClass(t)||i.push(t)},this),i.length&&W(this,r+(r?" ":"")+i.join(" "))}):this},removeClass:function(e){return this.each(function(n){return e===t?W(this,""):(i=W(this),J(this,e,n,i).split(/\s+/g).forEach(function(t){i=i.replace(q(t)," ")}),void W(this,i.trim()))})},toggleClass:function(e,i){return e?this.each(function(r){var o=n(this),s=J(this,e,r,W(this));s.split(/\s+/g).forEach(function(e){(i===t?!o.hasClass(e):i)?o.addClass(e):o.removeClass(e)})}):this},scrollTop:function(e){if(this.length){var n="scrollTop"in this[0];return e===t?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=e}:function(){this.scrollTo(this.scrollX,e)})}},scrollLeft:function(e){if(this.length){var n="scrollLeft"in this[0];return e===t?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=e}:function(){this.scrollTo(e,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),i=this.offset(),r=d.test(e[0].nodeName)?{top:0,left:0}:e.offset();return i.top-=parseFloat(n(t).css("margin-top"))||0,i.left-=parseFloat(n(t).css("margin-left"))||0,r.top+=parseFloat(n(e[0]).css("border-top-width"))||0,r.left+=parseFloat(n(e[0]).css("border-left-width"))||0,{top:i.top-r.top,left:i.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||a.body;t&&!d.test(t.nodeName)&&"static"==n(t).css("position");)t=t.offsetParent;return t})}},n.fn.detach=n.fn.remove,["width","height"].forEach(function(e){var i=e.replace(/./,function(t){return t[0].toUpperCase()});n.fn[e]=function(r){var o,s=this[0];return r===t?$(s)?s["inner"+i]:_(s)?s.documentElement["scroll"+i]:(o=this.offset())&&o[e]:this.each(function(t){s=n(this),s.css(e,J(this,r,t,s[e]()))})}}),v.forEach(function(t,e){var i=e%2;n.fn[t]=function(){var t,o,r=n.map(arguments,function(e){return t=L(e),"object"==t||"array"==t||null==e?e:S.fragment(e)}),s=this.length>1;return r.length<1?this:this.each(function(t,a){o=i?a:a.parentNode,a=0==e?a.nextSibling:1==e?a.firstChild:2==e?a:null,r.forEach(function(t){if(s)t=t.cloneNode(!0);else if(!o)return n(t).remove();G(o.insertBefore(t,a),function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},n.fn[i?t+"To":"insert"+(e?"Before":"After")]=function(e){return n(e)[t](this),this}}),S.Z.prototype=n.fn,S.uniq=N,S.deserializeValue=Y,n.zepto=S,n}();window.Zepto=Zepto,void 0===window.$&&(window.$=Zepto),function(t){function l(t){return t._zid||(t._zid=e++)}function h(t,e,n,i){if(e=p(e),e.ns)var r=d(e.ns);return(s[l(t)]||[]).filter(function(t){return!(!t||e.e&&t.e!=e.e||e.ns&&!r.test(t.ns)||n&&l(t.fn)!==l(n)||i&&t.sel!=i)})}function p(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function d(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function m(t,e){return t.del&&!u&&t.e in f||!!e}function g(t){return c[t]||u&&f[t]||t}function v(e,i,r,o,a,u,f){var h=l(e),d=s[h]||(s[h]=[]);i.split(/\s/).forEach(function(i){if("ready"==i)return t(document).ready(r);var s=p(i);s.fn=r,s.sel=a,s.e in c&&(r=function(e){var n=e.relatedTarget;return!n||n!==this&&!t.contains(this,n)?s.fn.apply(this,arguments):void 0}),s.del=u;var l=u||r;s.proxy=function(t){if(t=j(t),!t.isImmediatePropagationStopped()){t.data=o;var i=l.apply(e,t._args==n?[t]:[t].concat(t._args));return i===!1&&(t.preventDefault(),t.stopPropagation()),i}},s.i=d.length,d.push(s),"addEventListener"in e&&e.addEventListener(g(s.e),s.proxy,m(s,f))})}function y(t,e,n,i,r){var o=l(t);(e||"").split(/\s/).forEach(function(e){h(t,e,n,i).forEach(function(e){delete s[o][e.i],"removeEventListener"in t&&t.removeEventListener(g(e.e),e.proxy,m(e,r))})})}function j(e,i){return(i||!e.isDefaultPrevented)&&(i||(i=e),t.each(E,function(t,n){var r=i[t];e[t]=function(){return this[n]=x,r&&r.apply(i,arguments)},e[n]=b}),(i.defaultPrevented!==n?i.defaultPrevented:"returnValue"in i?i.returnValue===!1:i.getPreventDefault&&i.getPreventDefault())&&(e.isDefaultPrevented=x)),e}function T(t){var e,i={originalEvent:t};for(e in t)w.test(e)||t[e]===n||(i[e]=t[e]);return j(i,t)}var n,e=1,i=Array.prototype.slice,r=t.isFunction,o=function(t){return"string"==typeof t},s={},a={},u="onfocusin"in window,f={focus:"focusin",blur:"focusout"},c={mouseenter:"mouseover",mouseleave:"mouseout"};a.click=a.mousedown=a.mouseup=a.mousemove="MouseEvents",t.event={add:v,remove:y},t.proxy=function(e,n){if(r(e)){var i=function(){return e.apply(n,arguments)};return i._zid=l(e),i}if(o(n))return t.proxy(e[n],e);throw new TypeError("expected function")},t.fn.bind=function(t,e,n){return this.on(t,e,n)},t.fn.unbind=function(t,e){return this.off(t,e)},t.fn.one=function(t,e,n,i){return this.on(t,e,n,i,1)};var x=function(){return!0},b=function(){return!1},w=/^([A-Z]|returnValue$|layer[XY]$)/,E={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};t.fn.delegate=function(t,e,n){return this.on(e,t,n)},t.fn.undelegate=function(t,e,n){return this.off(e,t,n)},t.fn.live=function(e,n){return t(document.body).delegate(this.selector,e,n),this},t.fn.die=function(e,n){return t(document.body).undelegate(this.selector,e,n),this},t.fn.on=function(e,s,a,u,f){var c,l,h=this;return e&&!o(e)?(t.each(e,function(t,e){h.on(t,s,a,e,f)}),h):(o(s)||r(u)||u===!1||(u=a,a=s,s=n),(r(a)||a===!1)&&(u=a,a=n),u===!1&&(u=b),h.each(function(n,r){f&&(c=function(t){return y(r,t.type,u),u.apply(this,arguments)}),s&&(l=function(e){var n,o=t(e.target).closest(s,r).get(0);return o&&o!==r?(n=t.extend(T(e),{currentTarget:o,liveFired:r}),(c||u).apply(o,[n].concat(i.call(arguments,1)))):void 0}),v(r,e,u,a,s,l||c)}))},t.fn.off=function(e,i,s){var a=this;return e&&!o(e)?(t.each(e,function(t,e){a.off(t,i,e)}),a):(o(i)||r(s)||s===!1||(s=i,i=n),s===!1&&(s=b),a.each(function(){y(this,e,s,i)}))},t.fn.trigger=function(e,n){return e=o(e)||t.isPlainObject(e)?t.Event(e):j(e),e._args=n,this.each(function(){"dispatchEvent"in this?this.dispatchEvent(e):t(this).triggerHandler(e,n)})},t.fn.triggerHandler=function(e,n){var i,r;return this.each(function(s,a){i=T(o(e)?t.Event(e):e),i._args=n,i.target=a,t.each(h(a,e.type||e),function(t,e){return r=e.proxy(i),i.isImmediatePropagationStopped()?!1:void 0})}),r},"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.trigger(e)}}),["focus","blur"].forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.each(function(){try{this[e]()}catch(t){}}),this}}),t.Event=function(t,e){o(t)||(e=t,t=e.type);var n=document.createEvent(a[t]||"Events"),i=!0;if(e)for(var r in e)"bubbles"==r?i=!!e[r]:n[r]=e[r];return n.initEvent(t,i,!0),j(n)}}(Zepto),function(t){function l(e,n,i){var r=t.Event(n);return t(e).trigger(r,i),!r.isDefaultPrevented()}function h(t,e,i,r){return t.global?l(e||n,i,r):void 0}function p(e){e.global&&0===t.active++&&h(e,null,"ajaxStart")}function d(e){e.global&&!--t.active&&h(e,null,"ajaxStop")}function m(t,e){var n=e.context;return e.beforeSend.call(n,t,e)===!1||h(e,n,"ajaxBeforeSend",[t,e])===!1?!1:void h(e,n,"ajaxSend",[t,e])}function g(t,e,n,i){var r=n.context,o="success";n.success.call(r,t,o,e),i&&i.resolveWith(r,[t,o,e]),h(n,r,"ajaxSuccess",[e,n,t]),y(o,e,n)}function v(t,e,n,i,r){var o=i.context;i.error.call(o,n,e,t),r&&r.rejectWith(o,[n,e,t]),h(i,o,"ajaxError",[n,i,t||e]),y(e,n,i)}function y(t,e,n){var i=n.context;n.complete.call(i,e,t),h(n,i,"ajaxComplete",[e,n]),d(n)}function x(){}function b(t){return t&&(t=t.split(";",2)[0]),t&&(t==f?"html":t==u?"json":s.test(t)?"script":a.test(t)&&"xml")||"text"}function w(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function E(e){e.processData&&e.data&&"string"!=t.type(e.data)&&(e.data=t.param(e.data,e.traditional)),!e.data||e.type&&"GET"!=e.type.toUpperCase()||(e.url=w(e.url,e.data),e.data=void 0)}function j(e,n,i,r){return t.isFunction(n)&&(r=i,i=n,n=void 0),t.isFunction(i)||(r=i,i=void 0),{url:e,data:n,success:i,dataType:r}}function S(e,n,i,r){var o,s=t.isArray(n),a=t.isPlainObject(n);t.each(n,function(n,u){o=t.type(u),r&&(n=i?r:r+"["+(a||"object"==o||"array"==o?n:"")+"]"),!r&&s?e.add(u.name,u.value):"array"==o||!i&&"object"==o?S(e,u,i,n):e.add(n,u)})}var i,r,e=0,n=window.document,o=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,s=/^(?:text|application)\/javascript/i,a=/^(?:text|application)\/xml/i,u="application/json",f="text/html",c=/^\s*$/;t.active=0,t.ajaxJSONP=function(i,r){if(!("type"in i))return t.ajax(i);var f,h,o=i.jsonpCallback,s=(t.isFunction(o)?o():o)||"jsonp"+ ++e,a=n.createElement("script"),u=window[s],c=function(e){t(a).triggerHandler("error",e||"abort")},l={abort:c};return r&&r.promise(l),t(a).on("load error",function(e,n){clearTimeout(h),t(a).off().remove(),"error"!=e.type&&f?g(f[0],l,i,r):v(null,n||"error",l,i,r),window[s]=u,f&&t.isFunction(u)&&u(f[0]),u=f=void 0}),m(l,i)===!1?(c("abort"),l):(window[s]=function(){f=arguments},a.src=i.url.replace(/\?(.+)=\?/,"?$1="+s),n.head.appendChild(a),i.timeout>0&&(h=setTimeout(function(){c("timeout")},i.timeout)),l)},t.ajaxSettings={type:"GET",beforeSend:x,success:x,error:x,complete:x,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:u,xml:"application/xml, text/xml",html:f,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0},t.ajax=function(e){var n=t.extend({},e||{}),o=t.Deferred&&t.Deferred();for(i in t.ajaxSettings)void 0===n[i]&&(n[i]=t.ajaxSettings[i]);p(n),n.crossDomain||(n.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(n.url)&&RegExp.$2!=window.location.host),n.url||(n.url=window.location.toString()),E(n),n.cache===!1&&(n.url=w(n.url,"_="+Date.now()));var s=n.dataType,a=/\?.+=\?/.test(n.url);if("jsonp"==s||a)return a||(n.url=w(n.url,n.jsonp?n.jsonp+"=?":n.jsonp===!1?"":"callback=?")),t.ajaxJSONP(n,o);var j,u=n.accepts[s],f={},l=function(t,e){f[t.toLowerCase()]=[t,e]},h=/^([\w-]+:)\/\//.test(n.url)?RegExp.$1:window.location.protocol,d=n.xhr(),y=d.setRequestHeader;if(o&&o.promise(d),n.crossDomain||l("X-Requested-With","XMLHttpRequest"),l("Accept",u||"*/*"),(u=n.mimeType||u)&&(u.indexOf(",")>-1&&(u=u.split(",",2)[0]),d.overrideMimeType&&d.overrideMimeType(u)),(n.contentType||n.contentType!==!1&&n.data&&"GET"!=n.type.toUpperCase())&&l("Content-Type",n.contentType||"application/x-www-form-urlencoded"),n.headers)for(r in n.headers)l(r,n.headers[r]);if(d.setRequestHeader=l,d.onreadystatechange=function(){if(4==d.readyState){d.onreadystatechange=x,clearTimeout(j);var e,i=!1;if(d.status>=200&&d.status<300||304==d.status||0==d.status&&"file:"==h){s=s||b(n.mimeType||d.getResponseHeader("content-type")),e=d.responseText;try{"script"==s?(1,eval)(e):"xml"==s?e=d.responseXML:"json"==s&&(e=c.test(e)?null:t.parseJSON(e))}catch(r){i=r}i?v(i,"parsererror",d,n,o):g(e,d,n,o)}else v(d.statusText||null,d.status?"error":"abort",d,n,o)}},m(d,n)===!1)return d.abort(),v(null,"abort",d,n,o),d;if(n.xhrFields)for(r in n.xhrFields)d[r]=n.xhrFields[r];var T="async"in n?n.async:!0;d.open(n.type,n.url,T,n.username,n.password);for(r in f)y.apply(d,f[r]);return n.timeout>0&&(j=setTimeout(function(){d.onreadystatechange=x,d.abort(),v(null,"timeout",d,n,o)},n.timeout)),d.send(n.data?n.data:null),d},t.get=function(){return t.ajax(j.apply(null,arguments))},t.post=function(){var e=j.apply(null,arguments);return e.type="POST",t.ajax(e)},t.getJSON=function(){var e=j.apply(null,arguments);return e.dataType="json",t.ajax(e)},t.fn.load=function(e,n,i){if(!this.length)return this;var a,r=this,s=e.split(/\s/),u=j(e,n,i),f=u.success;return s.length>1&&(u.url=s[0],a=s[1]),u.success=function(e){r.html(a?t("<div>").html(e.replace(o,"")).find(a):e),f&&f.apply(r,arguments)},t.ajax(u),this};var T=encodeURIComponent;t.param=function(t,e){var n=[];return n.add=function(t,e){this.push(T(t)+"="+T(e))},S(n,t,e),n.join("&").replace(/%20/g,"+")}}(Zepto),function(t){t.fn.serializeArray=function(){var n,e=[];return t([].slice.call(this.get(0).elements)).each(function(){n=t(this);var i=n.attr("type");"fieldset"!=this.nodeName.toLowerCase()&&!this.disabled&&"submit"!=i&&"reset"!=i&&"button"!=i&&("radio"!=i&&"checkbox"!=i||this.checked)&&e.push({name:n.attr("name"),value:n.val()})}),e},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(e)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.isDefaultPrevented()||this.get(0).submit()}return this}}(Zepto),function(t){"__proto__"in{}||t.extend(t.zepto,{Z:function(e,n){return e=e||[],t.extend(e,t.fn),e.selector=n||"",e.__Z=!0,e},isZ:function(e){return"array"===t.type(e)&&"__Z"in e}});try{getComputedStyle(void 0)}catch(e){var n=getComputedStyle;window.getComputedStyle=function(t){try{return n(t)}catch(e){return null}}}}(Zepto);

$ = Zepto;
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
		
			var hash = $(this).html().replace(/[^a-f0-9]/i, '');						
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
				$(this).append($('<img src="'+canvas.toDataURL()+'" title="'+hash+'" alt="'+hash+'" style="vertical-align: bottom;"/>'));				
            }			
        });
    };
})(Zepto); 
/* pako 0.2.1 nodeca/pako */
!function(t){this.pako=t()}(function(){return function t(e,a,i){function n(s,o){if(!a[s]){if(!e[s]){var l="function"==typeof require&&require;if(!o&&l)return l(s,!0);if(r)return r(s,!0);throw new Error("Cannot find module '"+s+"'")}var h=a[s]={exports:{}};e[s][0].call(h.exports,function(t){var a=e[s][1][t];return n(a?a:t)},h,h.exports,t,e,a,i)}return a[s].exports}for(var r="function"==typeof require&&require,s=0;s<i.length;s++)n(i[s]);return n}({1:[function(t,e){"use strict";var a=t("./lib/utils/common").assign,i=t("./lib/deflate"),n=t("./lib/inflate"),r=t("./lib/zlib/constants"),s={};a(s,i,n,r),e.exports=s},{"./lib/deflate":2,"./lib/inflate":3,"./lib/utils/common":4,"./lib/zlib/constants":7}],2:[function(t,e,a){"use strict";function i(t,e){var a=new w(e);if(a.push(t,!0),a.err)throw a.msg;return a.result}function n(t,e){return e=e||{},e.raw=!0,i(t,e)}function r(t,e){return e=e||{},e.gzip=!0,i(t,e)}var s=t("./zlib/deflate.js"),o=t("./utils/common"),l=t("./utils/strings"),h=t("./zlib/messages"),d=t("./zlib/zstream"),f=0,_=4,u=0,c=1,b=-1,g=0,m=8,w=function(t){this.options=o.assign({level:b,method:m,chunkSize:16384,windowBits:15,memLevel:8,strategy:g,to:""},t||{});var e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new d,this.strm.avail_out=0;var a=s.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==u)throw new Error(h[a]);e.header&&s.deflateSetHeader(this.strm,e.header)};w.prototype.push=function(t,e){var a,i,n=this.strm,r=this.options.chunkSize;if(this.ended)return!1;i=e===~~e?e:e===!0?_:f,n.input="string"==typeof t?l.string2buf(t):t,n.next_in=0,n.avail_in=n.input.length;do{if(0===n.avail_out&&(n.output=new o.Buf8(r),n.next_out=0,n.avail_out=r),a=s.deflate(n,i),a!==c&&a!==u)return this.onEnd(a),this.ended=!0,!1;(0===n.avail_out||0===n.avail_in&&i===_)&&this.onData("string"===this.options.to?l.buf2binstring(o.shrinkBuf(n.output,n.next_out)):o.shrinkBuf(n.output,n.next_out))}while((n.avail_in>0||0===n.avail_out)&&a!==c);return i===_?(a=s.deflateEnd(this.strm),this.onEnd(a),this.ended=!0,a===u):!0},w.prototype.onData=function(t){this.chunks.push(t)},w.prototype.onEnd=function(t){t===u&&(this.result="string"===this.options.to?this.chunks.join(""):o.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},a.Deflate=w,a.deflate=i,a.deflateRaw=n,a.gzip=r},{"./utils/common":4,"./utils/strings":5,"./zlib/deflate.js":9,"./zlib/messages":14,"./zlib/zstream":16}],3:[function(t,e,a){"use strict";function i(t,e){var a=new _(e);if(a.push(t,!0),a.err)throw a.msg;return a.result}function n(t,e){return e=e||{},e.raw=!0,i(t,e)}var r=t("./zlib/inflate.js"),s=t("./utils/common"),o=t("./utils/strings"),l=t("./zlib/constants"),h=t("./zlib/messages"),d=t("./zlib/zstream"),f=t("./zlib/gzheader"),_=function(t){this.options=s.assign({chunkSize:16384,windowBits:0,to:""},t||{});var e=this.options;e.raw&&e.windowBits>=0&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(e.windowBits>=0&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),e.windowBits>15&&e.windowBits<48&&0===(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new d,this.strm.avail_out=0;var a=r.inflateInit2(this.strm,e.windowBits);if(a!==l.Z_OK)throw new Error(h[a]);this.header=new f,r.inflateGetHeader(this.strm,this.header)};_.prototype.push=function(t,e){var a,i,n,h,d,f=this.strm,_=this.options.chunkSize;if(this.ended)return!1;i=e===~~e?e:e===!0?l.Z_FINISH:l.Z_NO_FLUSH,f.input="string"==typeof t?o.binstring2buf(t):t,f.next_in=0,f.avail_in=f.input.length;do{if(0===f.avail_out&&(f.output=new s.Buf8(_),f.next_out=0,f.avail_out=_),a=r.inflate(f,l.Z_NO_FLUSH),a!==l.Z_STREAM_END&&a!==l.Z_OK)return this.onEnd(a),this.ended=!0,!1;f.next_out&&(0===f.avail_out||a===l.Z_STREAM_END||0===f.avail_in&&i===l.Z_FINISH)&&("string"===this.options.to?(n=o.utf8border(f.output,f.next_out),h=f.next_out-n,d=o.buf2string(f.output,n),f.next_out=h,f.avail_out=_-h,h&&s.arraySet(f.output,f.output,n,h,0),this.onData(d)):this.onData(s.shrinkBuf(f.output,f.next_out)))}while((f.avail_in>0||0===f.avail_out)&&a!==l.Z_STREAM_END);return a===l.Z_STREAM_END&&(i=l.Z_FINISH),i===l.Z_FINISH?(a=r.inflateEnd(this.strm),this.onEnd(a),this.ended=!0,a===l.Z_OK):!0},_.prototype.onData=function(t){this.chunks.push(t)},_.prototype.onEnd=function(t){t===l.Z_OK&&(this.result="string"===this.options.to?this.chunks.join(""):s.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},a.Inflate=_,a.inflate=i,a.inflateRaw=n,a.ungzip=i},{"./utils/common":4,"./utils/strings":5,"./zlib/constants":7,"./zlib/gzheader":10,"./zlib/inflate.js":12,"./zlib/messages":14,"./zlib/zstream":16}],4:[function(t,e,a){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;a.assign=function(t){for(var e=Array.prototype.slice.call(arguments,1);e.length;){var a=e.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(var i in a)a.hasOwnProperty(i)&&(t[i]=a[i])}}return t},a.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var n={arraySet:function(t,e,a,i,n){if(e.subarray&&t.subarray)return void t.set(e.subarray(a,a+i),n);for(var r=0;i>r;r++)t[n+r]=e[a+r]},flattenChunks:function(t){var e,a,i,n,r,s;for(i=0,e=0,a=t.length;a>e;e++)i+=t[e].length;for(s=new Uint8Array(i),n=0,e=0,a=t.length;a>e;e++)r=t[e],s.set(r,n),n+=r.length;return s}},r={arraySet:function(t,e,a,i,n){for(var r=0;i>r;r++)t[n+r]=e[a+r]},flattenChunks:function(t){return[].concat.apply([],t)}};a.setTyped=function(t){t?(a.Buf8=Uint8Array,a.Buf16=Uint16Array,a.Buf32=Int32Array,a.assign(a,n)):(a.Buf8=Array,a.Buf16=Array,a.Buf32=Array,a.assign(a,r))},a.setTyped(i)},{}],5:[function(t,e,a){"use strict";var i=t("./common"),n=!0;try{String.fromCharCode.apply(null,[0])}catch(r){n=!1}for(var s=new i.Buf8(256),o=0;256>o;o++)s[o]=o>=252?6:o>=248?5:o>=240?4:o>=224?3:o>=192?2:1;s[254]=s[254]=1,a.string2buf=function(t){var e,a,n,r,s,o=t.length,l=0;for(r=0;o>r;r++)a=t.charCodeAt(r),55296===(64512&a)&&o>r+1&&(n=t.charCodeAt(r+1),56320===(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),r++)),l+=128>a?1:2048>a?2:65536>a?3:4;for(e=new i.Buf8(l),s=0,r=0;l>s;r++)a=t.charCodeAt(r),55296===(64512&a)&&o>r+1&&(n=t.charCodeAt(r+1),56320===(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),r++)),128>a?e[s++]=a:2048>a?(e[s++]=192|a>>>6,e[s++]=128|63&a):65536>a?(e[s++]=224|a>>>12,e[s++]=128|a>>>6&63,e[s++]=128|63&a):(e[s++]=240|a>>>18,e[s++]=128|a>>>12&63,e[s++]=128|a>>>6&63,e[s++]=128|63&a);return e},a.buf2binstring=function(t){if(n&&t.length<65537)return String.fromCharCode.apply(null,t);for(var e="",a=0,i=t.length;i>a;a++)e+=String.fromCharCode(t[a]);return e},a.binstring2buf=function(t){for(var e=new i.Buf8(t.length),a=0,n=e.length;n>a;a++)e[a]=t.charCodeAt(a);return e},a.buf2string=function(t,e){var a,r,o,l,h,d=e||t.length,f=new Array(2*d);for(o=0,r=0;d>r;)if(l=t[r++],128>l)f[o++]=l;else if(h=s[l],h>4)f[o++]=65533,r+=h-1;else{for(l&=2===h?31:3===h?15:7;h>1&&d>r;)l=l<<6|63&t[r++],h--;h>1?f[o++]=65533:65536>l?f[o++]=l:(l-=65536,f[o++]=55296|l>>10&1023,f[o++]=56320|1023&l)}if(n)return String.fromCharCode.apply(null,i.shrinkBuf(f,o));for(a="",r=0,d=o;d>r;r++)a+=String.fromCharCode(f[r]);return a},a.utf8border=function(t,e){var a;for(e=e||t.length,e>t.length&&(e=t.length),a=e-1;a>=0&&128===(192&t[a]);)a--;return 0>a?e:0===a?e:a+s[t[a]]>e?a:e}},{"./common":4}],6:[function(t,e){"use strict";function a(t,e,a,i){for(var n=65535&t|0,r=t>>>16&65535|0,s=0;0!==a;){s=a>2e3?2e3:a,a-=s;do n=n+e[i++]|0,r=r+n|0;while(--s);n%=65521,r%=65521}return n|r<<16|0}e.exports=a},{}],7:[function(t,e){e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],8:[function(t,e){"use strict";function a(){for(var t,e=[],a=0;256>a;a++){t=a;for(var i=0;8>i;i++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e}function i(t,e,a,i){var r=n,s=i+a;t=-1^t;for(var o=i;s>o;o++)t=t>>>8^r[255&(t^e[o])];return-1^t}var n=a();e.exports=i},{}],9:[function(t,e,a){"use strict";function i(t,e){return t.msg=I[e],e}function n(t){return(t<<1)-(t>4?9:0)}function r(t){for(var e=t.length;--e>=0;)t[e]=0}function s(t){var e=t.state,a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(A.arraySet(t.output,e.pending_buf,e.pending_out,a,t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))}function o(t,e){Z._tr_flush_block(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,s(t.strm)}function l(t,e){t.pending_buf[t.pending++]=e}function h(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function d(t,e,a,i){var n=t.avail_in;return n>i&&(n=i),0===n?0:(t.avail_in-=n,A.arraySet(e,t.input,t.next_in,n,a),1===t.state.wrap?t.adler=R(t.adler,e,n,a):2===t.state.wrap&&(t.adler=C(t.adler,e,n,a)),t.next_in+=n,t.total_in+=n,n)}function f(t,e){var a,i,n=t.max_chain_length,r=t.strstart,s=t.prev_length,o=t.nice_match,l=t.strstart>t.w_size-he?t.strstart-(t.w_size-he):0,h=t.window,d=t.w_mask,f=t.prev,_=t.strstart+le,u=h[r+s-1],c=h[r+s];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do if(a=e,h[a+s]===c&&h[a+s-1]===u&&h[a]===h[r]&&h[++a]===h[r+1]){r+=2,a++;do;while(h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&_>r);if(i=le-(_-r),r=_-le,i>s){if(t.match_start=e,s=i,i>=o)break;u=h[r+s-1],c=h[r+s]}}while((e=f[e&d])>l&&0!==--n);return s<=t.lookahead?s:t.lookahead}function _(t){var e,a,i,n,r,s=t.w_size;do{if(n=t.window_size-t.lookahead-t.strstart,t.strstart>=s+(s-he)){A.arraySet(t.window,t.window,s,s,0),t.match_start-=s,t.strstart-=s,t.block_start-=s,a=t.hash_size,e=a;do i=t.head[--e],t.head[e]=i>=s?i-s:0;while(--a);a=s,e=a;do i=t.prev[--e],t.prev[e]=i>=s?i-s:0;while(--a);n+=s}if(0===t.strm.avail_in)break;if(a=d(t.strm,t.window,t.strstart+t.lookahead,n),t.lookahead+=a,t.lookahead+t.insert>=oe)for(r=t.strstart-t.insert,t.ins_h=t.window[r],t.ins_h=(t.ins_h<<t.hash_shift^t.window[r+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[r+oe-1])&t.hash_mask,t.prev[r&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=r,r++,t.insert--,!(t.lookahead+t.insert<oe)););}while(t.lookahead<he&&0!==t.strm.avail_in)}function u(t,e){var a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(_(t),0===t.lookahead&&e===N)return we;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var i=t.block_start+a;if((0===t.strstart||t.strstart>=i)&&(t.lookahead=t.strstart-i,t.strstart=i,o(t,!1),0===t.strm.avail_out))return we;if(t.strstart-t.block_start>=t.w_size-he&&(o(t,!1),0===t.strm.avail_out))return we}return t.insert=0,e===D?(o(t,!0),0===t.strm.avail_out?ve:ke):t.strstart>t.block_start&&(o(t,!1),0===t.strm.avail_out)?we:we}function c(t,e){for(var a,i;;){if(t.lookahead<he){if(_(t),t.lookahead<he&&e===N)return we;if(0===t.lookahead)break}if(a=0,t.lookahead>=oe&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+oe-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-he&&(t.match_length=f(t,a)),t.match_length>=oe)if(i=Z._tr_tally(t,t.strstart-t.match_start,t.match_length-oe),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=oe){t.match_length--;do t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+oe-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart;while(0!==--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else i=Z._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(o(t,!1),0===t.strm.avail_out))return we}return t.insert=t.strstart<oe-1?t.strstart:oe-1,e===D?(o(t,!0),0===t.strm.avail_out?ve:ke):t.last_lit&&(o(t,!1),0===t.strm.avail_out)?we:pe}function b(t,e){for(var a,i,n;;){if(t.lookahead<he){if(_(t),t.lookahead<he&&e===N)return we;if(0===t.lookahead)break}if(a=0,t.lookahead>=oe&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+oe-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=oe-1,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-he&&(t.match_length=f(t,a),t.match_length<=5&&(t.strategy===P||t.match_length===oe&&t.strstart-t.match_start>4096)&&(t.match_length=oe-1)),t.prev_length>=oe&&t.match_length<=t.prev_length){n=t.strstart+t.lookahead-oe,i=Z._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-oe),t.lookahead-=t.prev_length-1,t.prev_length-=2;do++t.strstart<=n&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+oe-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart);while(0!==--t.prev_length);if(t.match_available=0,t.match_length=oe-1,t.strstart++,i&&(o(t,!1),0===t.strm.avail_out))return we}else if(t.match_available){if(i=Z._tr_tally(t,0,t.window[t.strstart-1]),i&&o(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return we}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=Z._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<oe-1?t.strstart:oe-1,e===D?(o(t,!0),0===t.strm.avail_out?ve:ke):t.last_lit&&(o(t,!1),0===t.strm.avail_out)?we:pe}function g(t,e){for(var a,i,n,r,s=t.window;;){if(t.lookahead<=le){if(_(t),t.lookahead<=le&&e===N)return we;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=oe&&t.strstart>0&&(n=t.strstart-1,i=s[n],i===s[++n]&&i===s[++n]&&i===s[++n])){r=t.strstart+le;do;while(i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&r>n);t.match_length=le-(r-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=oe?(a=Z._tr_tally(t,1,t.match_length-oe),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=Z._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(o(t,!1),0===t.strm.avail_out))return we}return t.insert=0,e===D?(o(t,!0),0===t.strm.avail_out?ve:ke):t.last_lit&&(o(t,!1),0===t.strm.avail_out)?we:pe}function m(t,e){for(var a;;){if(0===t.lookahead&&(_(t),0===t.lookahead)){if(e===N)return we;break}if(t.match_length=0,a=Z._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(o(t,!1),0===t.strm.avail_out))return we}return t.insert=0,e===D?(o(t,!0),0===t.strm.avail_out?ve:ke):t.last_lit&&(o(t,!1),0===t.strm.avail_out)?we:pe}function w(t){t.window_size=2*t.w_size,r(t.head),t.max_lazy_match=E[t.level].max_lazy,t.good_match=E[t.level].good_length,t.nice_match=E[t.level].nice_length,t.max_chain_length=E[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=oe-1,t.match_available=0,t.ins_h=0}function p(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=J,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new A.Buf16(2*re),this.dyn_dtree=new A.Buf16(2*(2*ie+1)),this.bl_tree=new A.Buf16(2*(2*ne+1)),r(this.dyn_ltree),r(this.dyn_dtree),r(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new A.Buf16(se+1),this.heap=new A.Buf16(2*ae+1),r(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new A.Buf16(2*ae+1),r(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function v(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=W,e=t.state,e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?fe:ge,t.adler=2===e.wrap?0:1,e.last_flush=N,Z._tr_init(e),L):i(t,H)}function k(t){var e=v(t);return e===L&&w(t.state),e}function x(t,e){return t&&t.state?2!==t.state.wrap?H:(t.state.gzhead=e,L):H}function z(t,e,a,n,r,s){if(!t)return H;var o=1;if(e===K&&(e=6),0>n?(o=0,n=-n):n>15&&(o=2,n-=16),1>r||r>Q||a!==J||8>n||n>15||0>e||e>9||0>s||s>G)return i(t,H);8===n&&(n=9);var l=new p;return t.state=l,l.strm=t,l.wrap=o,l.gzhead=null,l.w_bits=n,l.w_size=1<<l.w_bits,l.w_mask=l.w_size-1,l.hash_bits=r+7,l.hash_size=1<<l.hash_bits,l.hash_mask=l.hash_size-1,l.hash_shift=~~((l.hash_bits+oe-1)/oe),l.window=new A.Buf8(2*l.w_size),l.head=new A.Buf16(l.hash_size),l.prev=new A.Buf16(l.w_size),l.lit_bufsize=1<<r+6,l.pending_buf_size=4*l.lit_bufsize,l.pending_buf=new A.Buf8(l.pending_buf_size),l.d_buf=l.lit_bufsize>>1,l.l_buf=3*l.lit_bufsize,l.level=e,l.strategy=s,l.method=a,k(t)}function y(t,e){return z(t,e,J,V,$,X)}function B(t,e){var a,o,d,f;if(!t||!t.state||e>F||0>e)return t?i(t,H):H;if(o=t.state,!t.output||!t.input&&0!==t.avail_in||o.status===me&&e!==D)return i(t,0===t.avail_out?M:H);if(o.strm=t,a=o.last_flush,o.last_flush=e,o.status===fe)if(2===o.wrap)t.adler=0,l(o,31),l(o,139),l(o,8),o.gzhead?(l(o,(o.gzhead.text?1:0)+(o.gzhead.hcrc?2:0)+(o.gzhead.extra?4:0)+(o.gzhead.name?8:0)+(o.gzhead.comment?16:0)),l(o,255&o.gzhead.time),l(o,o.gzhead.time>>8&255),l(o,o.gzhead.time>>16&255),l(o,o.gzhead.time>>24&255),l(o,9===o.level?2:o.strategy>=q||o.level<2?4:0),l(o,255&o.gzhead.os),o.gzhead.extra&&o.gzhead.extra.length&&(l(o,255&o.gzhead.extra.length),l(o,o.gzhead.extra.length>>8&255)),o.gzhead.hcrc&&(t.adler=C(t.adler,o.pending_buf,o.pending,0)),o.gzindex=0,o.status=_e):(l(o,0),l(o,0),l(o,0),l(o,0),l(o,0),l(o,9===o.level?2:o.strategy>=q||o.level<2?4:0),l(o,xe),o.status=ge);else{var _=J+(o.w_bits-8<<4)<<8,u=-1;u=o.strategy>=q||o.level<2?0:o.level<6?1:6===o.level?2:3,_|=u<<6,0!==o.strstart&&(_|=de),_+=31-_%31,o.status=ge,h(o,_),0!==o.strstart&&(h(o,t.adler>>>16),h(o,65535&t.adler)),t.adler=1}if(o.status===_e)if(o.gzhead.extra){for(d=o.pending;o.gzindex<(65535&o.gzhead.extra.length)&&(o.pending!==o.pending_buf_size||(o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),s(t),d=o.pending,o.pending!==o.pending_buf_size));)l(o,255&o.gzhead.extra[o.gzindex]),o.gzindex++;o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),o.gzindex===o.gzhead.extra.length&&(o.gzindex=0,o.status=ue)}else o.status=ue;if(o.status===ue)if(o.gzhead.name){d=o.pending;do{if(o.pending===o.pending_buf_size&&(o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),s(t),d=o.pending,o.pending===o.pending_buf_size)){f=1;break}f=o.gzindex<o.gzhead.name.length?255&o.gzhead.name.charCodeAt(o.gzindex++):0,l(o,f)}while(0!==f);o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),0===f&&(o.gzindex=0,o.status=ce)}else o.status=ce;if(o.status===ce)if(o.gzhead.comment){d=o.pending;do{if(o.pending===o.pending_buf_size&&(o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),s(t),d=o.pending,o.pending===o.pending_buf_size)){f=1;break}f=o.gzindex<o.gzhead.comment.length?255&o.gzhead.comment.charCodeAt(o.gzindex++):0,l(o,f)}while(0!==f);o.gzhead.hcrc&&o.pending>d&&(t.adler=C(t.adler,o.pending_buf,o.pending-d,d)),0===f&&(o.status=be)}else o.status=be;if(o.status===be&&(o.gzhead.hcrc?(o.pending+2>o.pending_buf_size&&s(t),o.pending+2<=o.pending_buf_size&&(l(o,255&t.adler),l(o,t.adler>>8&255),t.adler=0,o.status=ge)):o.status=ge),0!==o.pending){if(s(t),0===t.avail_out)return o.last_flush=-1,L}else if(0===t.avail_in&&n(e)<=n(a)&&e!==D)return i(t,M);if(o.status===me&&0!==t.avail_in)return i(t,M);if(0!==t.avail_in||0!==o.lookahead||e!==N&&o.status!==me){var c=o.strategy===q?m(o,e):o.strategy===Y?g(o,e):E[o.level].func(o,e);if((c===ve||c===ke)&&(o.status=me),c===we||c===ve)return 0===t.avail_out&&(o.last_flush=-1),L;if(c===pe&&(e===O?Z._tr_align(o):e!==F&&(Z._tr_stored_block(o,0,0,!1),e===T&&(r(o.head),0===o.lookahead&&(o.strstart=0,o.block_start=0,o.insert=0))),s(t),0===t.avail_out))return o.last_flush=-1,L}return e!==D?L:o.wrap<=0?U:(2===o.wrap?(l(o,255&t.adler),l(o,t.adler>>8&255),l(o,t.adler>>16&255),l(o,t.adler>>24&255),l(o,255&t.total_in),l(o,t.total_in>>8&255),l(o,t.total_in>>16&255),l(o,t.total_in>>24&255)):(h(o,t.adler>>>16),h(o,65535&t.adler)),s(t),o.wrap>0&&(o.wrap=-o.wrap),0!==o.pending?L:U)}function S(t){var e;return t&&t.state?(e=t.state.status,e!==fe&&e!==_e&&e!==ue&&e!==ce&&e!==be&&e!==ge&&e!==me?i(t,H):(t.state=null,e===ge?i(t,j):L)):H}var E,A=t("../utils/common"),Z=t("./trees"),R=t("./adler32"),C=t("./crc32"),I=t("./messages"),N=0,O=1,T=3,D=4,F=5,L=0,U=1,H=-2,j=-3,M=-5,K=-1,P=1,q=2,Y=3,G=4,X=0,W=2,J=8,Q=9,V=15,$=8,te=29,ee=256,ae=ee+1+te,ie=30,ne=19,re=2*ae+1,se=15,oe=3,le=258,he=le+oe+1,de=32,fe=42,_e=69,ue=73,ce=91,be=103,ge=113,me=666,we=1,pe=2,ve=3,ke=4,xe=3,ze=function(t,e,a,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=i,this.func=n};E=[new ze(0,0,0,0,u),new ze(4,4,8,4,c),new ze(4,5,16,8,c),new ze(4,6,32,32,c),new ze(4,4,16,16,b),new ze(8,16,32,32,b),new ze(8,16,128,128,b),new ze(8,32,128,256,b),new ze(32,128,258,1024,b),new ze(32,258,258,4096,b)],a.deflateInit=y,a.deflateInit2=z,a.deflateReset=k,a.deflateResetKeep=v,a.deflateSetHeader=x,a.deflate=B,a.deflateEnd=S,a.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":4,"./adler32":6,"./crc32":8,"./messages":14,"./trees":15}],10:[function(t,e){"use strict";function a(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}e.exports=a},{}],11:[function(t,e){"use strict";var a=30,i=12;e.exports=function(t,e){var n,r,s,o,l,h,d,f,_,u,c,b,g,m,w,p,v,k,x,z,y,B,S,E,A;n=t.state,r=t.next_in,E=t.input,s=r+(t.avail_in-5),o=t.next_out,A=t.output,l=o-(e-t.avail_out),h=o+(t.avail_out-257),d=n.dmax,f=n.wsize,_=n.whave,u=n.wnext,c=n.window,b=n.hold,g=n.bits,m=n.lencode,w=n.distcode,p=(1<<n.lenbits)-1,v=(1<<n.distbits)-1;t:do{15>g&&(b+=E[r++]<<g,g+=8,b+=E[r++]<<g,g+=8),k=m[b&p];e:for(;;){if(x=k>>>24,b>>>=x,g-=x,x=k>>>16&255,0===x)A[o++]=65535&k;else{if(!(16&x)){if(0===(64&x)){k=m[(65535&k)+(b&(1<<x)-1)];continue e}if(32&x){n.mode=i;break t}t.msg="invalid literal/length code",n.mode=a;break t}z=65535&k,x&=15,x&&(x>g&&(b+=E[r++]<<g,g+=8),z+=b&(1<<x)-1,b>>>=x,g-=x),15>g&&(b+=E[r++]<<g,g+=8,b+=E[r++]<<g,g+=8),k=w[b&v];a:for(;;){if(x=k>>>24,b>>>=x,g-=x,x=k>>>16&255,!(16&x)){if(0===(64&x)){k=w[(65535&k)+(b&(1<<x)-1)];continue a}t.msg="invalid distance code",n.mode=a;break t}if(y=65535&k,x&=15,x>g&&(b+=E[r++]<<g,g+=8,x>g&&(b+=E[r++]<<g,g+=8)),y+=b&(1<<x)-1,y>d){t.msg="invalid distance too far back",n.mode=a;break t}if(b>>>=x,g-=x,x=o-l,y>x){if(x=y-x,x>_&&n.sane){t.msg="invalid distance too far back",n.mode=a;break t}if(B=0,S=c,0===u){if(B+=f-x,z>x){z-=x;do A[o++]=c[B++];while(--x);B=o-y,S=A}}else if(x>u){if(B+=f+u-x,x-=u,z>x){z-=x;do A[o++]=c[B++];while(--x);if(B=0,z>u){x=u,z-=x;do A[o++]=c[B++];while(--x);B=o-y,S=A}}}else if(B+=u-x,z>x){z-=x;do A[o++]=c[B++];while(--x);B=o-y,S=A}for(;z>2;)A[o++]=S[B++],A[o++]=S[B++],A[o++]=S[B++],z-=3;z&&(A[o++]=S[B++],z>1&&(A[o++]=S[B++]))}else{B=o-y;do A[o++]=A[B++],A[o++]=A[B++],A[o++]=A[B++],z-=3;while(z>2);z&&(A[o++]=A[B++],z>1&&(A[o++]=A[B++]))}break}}break}}while(s>r&&h>o);z=g>>3,r-=z,g-=z<<3,b&=(1<<g)-1,t.next_in=r,t.next_out=o,t.avail_in=s>r?5+(s-r):5-(r-s),t.avail_out=h>o?257+(h-o):257-(o-h),n.hold=b,n.bits=g}},{}],12:[function(t,e,a){"use strict";function i(t){return(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24)}function n(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new m.Buf16(320),this.work=new m.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function r(t){var e;return t&&t.state?(e=t.state,t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=D,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new m.Buf32(ce),e.distcode=e.distdyn=new m.Buf32(be),e.sane=1,e.back=-1,A):C}function s(t){var e;return t&&t.state?(e=t.state,e.wsize=0,e.whave=0,e.wnext=0,r(t)):C}function o(t,e){var a,i;return t&&t.state?(i=t.state,0>e?(a=0,e=-e):(a=(e>>4)+1,48>e&&(e&=15)),e&&(8>e||e>15)?C:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=a,i.wbits=e,s(t))):C}function l(t,e){var a,i;return t?(i=new n,t.state=i,i.window=null,a=o(t,e),a!==A&&(t.state=null),a):C}function h(t){return l(t,me)}function d(t){if(we){var e;for(b=new m.Buf32(512),g=new m.Buf32(32),e=0;144>e;)t.lens[e++]=8;for(;256>e;)t.lens[e++]=9;for(;280>e;)t.lens[e++]=7;for(;288>e;)t.lens[e++]=8;for(k(z,t.lens,0,288,b,0,t.work,{bits:9}),e=0;32>e;)t.lens[e++]=5;k(y,t.lens,0,32,g,0,t.work,{bits:5}),we=!1}t.lencode=b,t.lenbits=9,t.distcode=g,t.distbits=5}function f(t,e,a,i){var n,r=t.state;return null===r.window&&(r.wsize=1<<r.wbits,r.wnext=0,r.whave=0,r.window=new m.Buf8(r.wsize)),i>=r.wsize?(m.arraySet(r.window,e,a-r.wsize,r.wsize,0),r.wnext=0,r.whave=r.wsize):(n=r.wsize-r.wnext,n>i&&(n=i),m.arraySet(r.window,e,a-i,n,r.wnext),i-=n,i?(m.arraySet(r.window,e,a-i,i,0),r.wnext=i,r.whave=r.wsize):(r.wnext+=n,r.wnext===r.wsize&&(r.wnext=0),r.whave<r.wsize&&(r.whave+=n))),0}function _(t,e){var a,n,r,s,o,l,h,_,u,c,b,g,ce,be,ge,me,we,pe,ve,ke,xe,ze,ye,Be,Se=0,Ee=new m.Buf8(4),Ae=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return C;a=t.state,a.mode===G&&(a.mode=X),o=t.next_out,r=t.output,h=t.avail_out,s=t.next_in,n=t.input,l=t.avail_in,_=a.hold,u=a.bits,c=l,b=h,ze=A;t:for(;;)switch(a.mode){case D:if(0===a.wrap){a.mode=X;break}for(;16>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(2&a.wrap&&35615===_){a.check=0,Ee[0]=255&_,Ee[1]=_>>>8&255,a.check=p(a.check,Ee,2,0),_=0,u=0,a.mode=F;break}if(a.flags=0,a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&_)<<8)+(_>>8))%31){t.msg="incorrect header check",a.mode=fe;break}if((15&_)!==T){t.msg="unknown compression method",a.mode=fe;break}if(_>>>=4,u-=4,xe=(15&_)+8,0===a.wbits)a.wbits=xe;else if(xe>a.wbits){t.msg="invalid window size",a.mode=fe;break}a.dmax=1<<xe,t.adler=a.check=1,a.mode=512&_?q:G,_=0,u=0;break;case F:for(;16>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(a.flags=_,(255&a.flags)!==T){t.msg="unknown compression method",a.mode=fe;break}if(57344&a.flags){t.msg="unknown header flags set",a.mode=fe;break}a.head&&(a.head.text=_>>8&1),512&a.flags&&(Ee[0]=255&_,Ee[1]=_>>>8&255,a.check=p(a.check,Ee,2,0)),_=0,u=0,a.mode=L;case L:for(;32>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.head&&(a.head.time=_),512&a.flags&&(Ee[0]=255&_,Ee[1]=_>>>8&255,Ee[2]=_>>>16&255,Ee[3]=_>>>24&255,a.check=p(a.check,Ee,4,0)),_=0,u=0,a.mode=U;case U:for(;16>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.head&&(a.head.xflags=255&_,a.head.os=_>>8),512&a.flags&&(Ee[0]=255&_,Ee[1]=_>>>8&255,a.check=p(a.check,Ee,2,0)),_=0,u=0,a.mode=H;case H:if(1024&a.flags){for(;16>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.length=_,a.head&&(a.head.extra_len=_),512&a.flags&&(Ee[0]=255&_,Ee[1]=_>>>8&255,a.check=p(a.check,Ee,2,0)),_=0,u=0}else a.head&&(a.head.extra=null);a.mode=j;case j:if(1024&a.flags&&(g=a.length,g>l&&(g=l),g&&(a.head&&(xe=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Array(a.head.extra_len)),m.arraySet(a.head.extra,n,s,g,xe)),512&a.flags&&(a.check=p(a.check,n,g,s)),l-=g,s+=g,a.length-=g),a.length))break t;a.length=0,a.mode=M;case M:if(2048&a.flags){if(0===l)break t;g=0;do xe=n[s+g++],a.head&&xe&&a.length<65536&&(a.head.name+=String.fromCharCode(xe));while(xe&&l>g);if(512&a.flags&&(a.check=p(a.check,n,g,s)),l-=g,s+=g,xe)break t}else a.head&&(a.head.name=null);a.length=0,a.mode=K;case K:if(4096&a.flags){if(0===l)break t;g=0;do xe=n[s+g++],a.head&&xe&&a.length<65536&&(a.head.comment+=String.fromCharCode(xe));while(xe&&l>g);if(512&a.flags&&(a.check=p(a.check,n,g,s)),l-=g,s+=g,xe)break t}else a.head&&(a.head.comment=null);a.mode=P;case P:if(512&a.flags){for(;16>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(_!==(65535&a.check)){t.msg="header crc mismatch",a.mode=fe;break}_=0,u=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),t.adler=a.check=0,a.mode=G;break;case q:for(;32>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}t.adler=a.check=i(_),_=0,u=0,a.mode=Y;case Y:if(0===a.havedict)return t.next_out=o,t.avail_out=h,t.next_in=s,t.avail_in=l,a.hold=_,a.bits=u,R;t.adler=a.check=1,a.mode=G;case G:if(e===S||e===E)break t;case X:if(a.last){_>>>=7&u,u-=7&u,a.mode=le;break}for(;3>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}switch(a.last=1&_,_>>>=1,u-=1,3&_){case 0:a.mode=W;break;case 1:if(d(a),a.mode=ee,e===E){_>>>=2,u-=2;break t}break;case 2:a.mode=V;break;case 3:t.msg="invalid block type",a.mode=fe}_>>>=2,u-=2;break;case W:for(_>>>=7&u,u-=7&u;32>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if((65535&_)!==(_>>>16^65535)){t.msg="invalid stored block lengths",a.mode=fe;break}if(a.length=65535&_,_=0,u=0,a.mode=J,e===E)break t;case J:a.mode=Q;case Q:if(g=a.length){if(g>l&&(g=l),g>h&&(g=h),0===g)break t;m.arraySet(r,n,s,g,o),l-=g,s+=g,h-=g,o+=g,a.length-=g;break}a.mode=G;break;case V:for(;14>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(a.nlen=(31&_)+257,_>>>=5,u-=5,a.ndist=(31&_)+1,_>>>=5,u-=5,a.ncode=(15&_)+4,_>>>=4,u-=4,a.nlen>286||a.ndist>30){t.msg="too many length or distance symbols",a.mode=fe;break}a.have=0,a.mode=$;case $:for(;a.have<a.ncode;){for(;3>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.lens[Ae[a.have++]]=7&_,_>>>=3,u-=3}for(;a.have<19;)a.lens[Ae[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,ye={bits:a.lenbits},ze=k(x,a.lens,0,19,a.lencode,0,a.work,ye),a.lenbits=ye.bits,ze){t.msg="invalid code lengths set",a.mode=fe;break}a.have=0,a.mode=te;case te:for(;a.have<a.nlen+a.ndist;){for(;Se=a.lencode[_&(1<<a.lenbits)-1],ge=Se>>>24,me=Se>>>16&255,we=65535&Se,!(u>=ge);){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(16>we)_>>>=ge,u-=ge,a.lens[a.have++]=we;else{if(16===we){for(Be=ge+2;Be>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(_>>>=ge,u-=ge,0===a.have){t.msg="invalid bit length repeat",a.mode=fe;break}xe=a.lens[a.have-1],g=3+(3&_),_>>>=2,u-=2}else if(17===we){for(Be=ge+3;Be>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}_>>>=ge,u-=ge,xe=0,g=3+(7&_),_>>>=3,u-=3}else{for(Be=ge+7;Be>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}_>>>=ge,u-=ge,xe=0,g=11+(127&_),_>>>=7,u-=7}if(a.have+g>a.nlen+a.ndist){t.msg="invalid bit length repeat",a.mode=fe;break}for(;g--;)a.lens[a.have++]=xe}}if(a.mode===fe)break;if(0===a.lens[256]){t.msg="invalid code -- missing end-of-block",a.mode=fe;break}if(a.lenbits=9,ye={bits:a.lenbits},ze=k(z,a.lens,0,a.nlen,a.lencode,0,a.work,ye),a.lenbits=ye.bits,ze){t.msg="invalid literal/lengths set",a.mode=fe;break}if(a.distbits=6,a.distcode=a.distdyn,ye={bits:a.distbits},ze=k(y,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,ye),a.distbits=ye.bits,ze){t.msg="invalid distances set",a.mode=fe;
break}if(a.mode=ee,e===E)break t;case ee:a.mode=ae;case ae:if(l>=6&&h>=258){t.next_out=o,t.avail_out=h,t.next_in=s,t.avail_in=l,a.hold=_,a.bits=u,v(t,b),o=t.next_out,r=t.output,h=t.avail_out,s=t.next_in,n=t.input,l=t.avail_in,_=a.hold,u=a.bits,a.mode===G&&(a.back=-1);break}for(a.back=0;Se=a.lencode[_&(1<<a.lenbits)-1],ge=Se>>>24,me=Se>>>16&255,we=65535&Se,!(u>=ge);){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(me&&0===(240&me)){for(pe=ge,ve=me,ke=we;Se=a.lencode[ke+((_&(1<<pe+ve)-1)>>pe)],ge=Se>>>24,me=Se>>>16&255,we=65535&Se,!(u>=pe+ge);){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}_>>>=pe,u-=pe,a.back+=pe}if(_>>>=ge,u-=ge,a.back+=ge,a.length=we,0===me){a.mode=oe;break}if(32&me){a.back=-1,a.mode=G;break}if(64&me){t.msg="invalid literal/length code",a.mode=fe;break}a.extra=15&me,a.mode=ie;case ie:if(a.extra){for(Be=a.extra;Be>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.length+=_&(1<<a.extra)-1,_>>>=a.extra,u-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=ne;case ne:for(;Se=a.distcode[_&(1<<a.distbits)-1],ge=Se>>>24,me=Se>>>16&255,we=65535&Se,!(u>=ge);){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(0===(240&me)){for(pe=ge,ve=me,ke=we;Se=a.distcode[ke+((_&(1<<pe+ve)-1)>>pe)],ge=Se>>>24,me=Se>>>16&255,we=65535&Se,!(u>=pe+ge);){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}_>>>=pe,u-=pe,a.back+=pe}if(_>>>=ge,u-=ge,a.back+=ge,64&me){t.msg="invalid distance code",a.mode=fe;break}a.offset=we,a.extra=15&me,a.mode=re;case re:if(a.extra){for(Be=a.extra;Be>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}a.offset+=_&(1<<a.extra)-1,_>>>=a.extra,u-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){t.msg="invalid distance too far back",a.mode=fe;break}a.mode=se;case se:if(0===h)break t;if(g=b-h,a.offset>g){if(g=a.offset-g,g>a.whave&&a.sane){t.msg="invalid distance too far back",a.mode=fe;break}g>a.wnext?(g-=a.wnext,ce=a.wsize-g):ce=a.wnext-g,g>a.length&&(g=a.length),be=a.window}else be=r,ce=o-a.offset,g=a.length;g>h&&(g=h),h-=g,a.length-=g;do r[o++]=be[ce++];while(--g);0===a.length&&(a.mode=ae);break;case oe:if(0===h)break t;r[o++]=a.length,h--,a.mode=ae;break;case le:if(a.wrap){for(;32>u;){if(0===l)break t;l--,_|=n[s++]<<u,u+=8}if(b-=h,t.total_out+=b,a.total+=b,b&&(t.adler=a.check=a.flags?p(a.check,r,b,o-b):w(a.check,r,b,o-b)),b=h,(a.flags?_:i(_))!==a.check){t.msg="incorrect data check",a.mode=fe;break}_=0,u=0}a.mode=he;case he:if(a.wrap&&a.flags){for(;32>u;){if(0===l)break t;l--,_+=n[s++]<<u,u+=8}if(_!==(4294967295&a.total)){t.msg="incorrect length check",a.mode=fe;break}_=0,u=0}a.mode=de;case de:ze=Z;break t;case fe:ze=I;break t;case _e:return N;case ue:default:return C}return t.next_out=o,t.avail_out=h,t.next_in=s,t.avail_in=l,a.hold=_,a.bits=u,(a.wsize||b!==t.avail_out&&a.mode<fe&&(a.mode<le||e!==B))&&f(t,t.output,t.next_out,b-t.avail_out)?(a.mode=_e,N):(c-=t.avail_in,b-=t.avail_out,t.total_in+=c,t.total_out+=b,a.total+=b,a.wrap&&b&&(t.adler=a.check=a.flags?p(a.check,r,b,t.next_out-b):w(a.check,r,b,t.next_out-b)),t.data_type=a.bits+(a.last?64:0)+(a.mode===G?128:0)+(a.mode===ee||a.mode===J?256:0),(0===c&&0===b||e===B)&&ze===A&&(ze=O),ze)}function u(t){if(!t||!t.state)return C;var e=t.state;return e.window&&(e.window=null),t.state=null,A}function c(t,e){var a;return t&&t.state?(a=t.state,0===(2&a.wrap)?C:(a.head=e,e.done=!1,A)):C}var b,g,m=t("../utils/common"),w=t("./adler32"),p=t("./crc32"),v=t("./inffast"),k=t("./inftrees"),x=0,z=1,y=2,B=4,S=5,E=6,A=0,Z=1,R=2,C=-2,I=-3,N=-4,O=-5,T=8,D=1,F=2,L=3,U=4,H=5,j=6,M=7,K=8,P=9,q=10,Y=11,G=12,X=13,W=14,J=15,Q=16,V=17,$=18,te=19,ee=20,ae=21,ie=22,ne=23,re=24,se=25,oe=26,le=27,he=28,de=29,fe=30,_e=31,ue=32,ce=852,be=592,ge=15,me=ge,we=!0;a.inflateReset=s,a.inflateReset2=o,a.inflateResetKeep=r,a.inflateInit=h,a.inflateInit2=l,a.inflate=_,a.inflateEnd=u,a.inflateGetHeader=c,a.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":4,"./adler32":6,"./crc32":8,"./inffast":11,"./inftrees":13}],13:[function(t,e){"use strict";var a=t("../utils/common"),i=15,n=852,r=592,s=0,o=1,l=2,h=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],d=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],f=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],_=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(t,e,u,c,b,g,m,w){var p,v,k,x,z,y,B,S,E,A=w.bits,Z=0,R=0,C=0,I=0,N=0,O=0,T=0,D=0,F=0,L=0,U=null,H=0,j=new a.Buf16(i+1),M=new a.Buf16(i+1),K=null,P=0;for(Z=0;i>=Z;Z++)j[Z]=0;for(R=0;c>R;R++)j[e[u+R]]++;for(N=A,I=i;I>=1&&0===j[I];I--);if(N>I&&(N=I),0===I)return b[g++]=20971520,b[g++]=20971520,w.bits=1,0;for(C=1;I>C&&0===j[C];C++);for(C>N&&(N=C),D=1,Z=1;i>=Z;Z++)if(D<<=1,D-=j[Z],0>D)return-1;if(D>0&&(t===s||1!==I))return-1;for(M[1]=0,Z=1;i>Z;Z++)M[Z+1]=M[Z]+j[Z];for(R=0;c>R;R++)0!==e[u+R]&&(m[M[e[u+R]]++]=R);switch(t){case s:U=K=m,y=19;break;case o:U=h,H-=257,K=d,P-=257,y=256;break;default:U=f,K=_,y=-1}if(L=0,R=0,Z=C,z=g,O=N,T=0,k=-1,F=1<<N,x=F-1,t===o&&F>n||t===l&&F>r)return 1;for(var q=0;;){q++,B=Z-T,m[R]<y?(S=0,E=m[R]):m[R]>y?(S=K[P+m[R]],E=U[H+m[R]]):(S=96,E=0),p=1<<Z-T,v=1<<O,C=v;do v-=p,b[z+(L>>T)+v]=B<<24|S<<16|E|0;while(0!==v);for(p=1<<Z-1;L&p;)p>>=1;if(0!==p?(L&=p-1,L+=p):L=0,R++,0===--j[Z]){if(Z===I)break;Z=e[u+m[R]]}if(Z>N&&(L&x)!==k){for(0===T&&(T=N),z+=C,O=Z-T,D=1<<O;I>O+T&&(D-=j[O+T],!(0>=D));)O++,D<<=1;if(F+=1<<O,t===o&&F>n||t===l&&F>r)return 1;k=L&x,b[k]=N<<24|O<<16|z-g|0}}return 0!==L&&(b[z+L]=Z-T<<24|64<<16|0),w.bits=N,0}},{"../utils/common":4}],14:[function(t,e){"use strict";e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],15:[function(t,e,a){"use strict";function i(t){for(var e=t.length;--e>=0;)t[e]=0}function n(t){return 256>t?se[t]:se[256+(t>>>7)]}function r(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function s(t,e,a){t.bi_valid>G-a?(t.bi_buf|=e<<t.bi_valid&65535,r(t,t.bi_buf),t.bi_buf=e>>G-t.bi_valid,t.bi_valid+=a-G):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)}function o(t,e,a){s(t,a[2*e],a[2*e+1])}function l(t,e){var a=0;do a|=1&t,t>>>=1,a<<=1;while(--e>0);return a>>>1}function h(t){16===t.bi_valid?(r(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}function d(t,e){var a,i,n,r,s,o,l=e.dyn_tree,h=e.max_code,d=e.stat_desc.static_tree,f=e.stat_desc.has_stree,_=e.stat_desc.extra_bits,u=e.stat_desc.extra_base,c=e.stat_desc.max_length,b=0;for(r=0;Y>=r;r++)t.bl_count[r]=0;for(l[2*t.heap[t.heap_max]+1]=0,a=t.heap_max+1;q>a;a++)i=t.heap[a],r=l[2*l[2*i+1]+1]+1,r>c&&(r=c,b++),l[2*i+1]=r,i>h||(t.bl_count[r]++,s=0,i>=u&&(s=_[i-u]),o=l[2*i],t.opt_len+=o*(r+s),f&&(t.static_len+=o*(d[2*i+1]+s)));if(0!==b){do{for(r=c-1;0===t.bl_count[r];)r--;t.bl_count[r]--,t.bl_count[r+1]+=2,t.bl_count[c]--,b-=2}while(b>0);for(r=c;0!==r;r--)for(i=t.bl_count[r];0!==i;)n=t.heap[--a],n>h||(l[2*n+1]!==r&&(t.opt_len+=(r-l[2*n+1])*l[2*n],l[2*n+1]=r),i--)}}function f(t,e,a){var i,n,r=new Array(Y+1),s=0;for(i=1;Y>=i;i++)r[i]=s=s+a[i-1]<<1;for(n=0;e>=n;n++){var o=t[2*n+1];0!==o&&(t[2*n]=l(r[o]++,o))}}function _(){var t,e,a,i,n,r=new Array(Y+1);for(a=0,i=0;H-1>i;i++)for(le[i]=a,t=0;t<1<<$[i];t++)oe[a++]=i;for(oe[a-1]=i,n=0,i=0;16>i;i++)for(he[i]=n,t=0;t<1<<te[i];t++)se[n++]=i;for(n>>=7;K>i;i++)for(he[i]=n<<7,t=0;t<1<<te[i]-7;t++)se[256+n++]=i;for(e=0;Y>=e;e++)r[e]=0;for(t=0;143>=t;)ne[2*t+1]=8,t++,r[8]++;for(;255>=t;)ne[2*t+1]=9,t++,r[9]++;for(;279>=t;)ne[2*t+1]=7,t++,r[7]++;for(;287>=t;)ne[2*t+1]=8,t++,r[8]++;for(f(ne,M+1,r),t=0;K>t;t++)re[2*t+1]=5,re[2*t]=l(t,5);de=new ue(ne,$,j+1,M,Y),fe=new ue(re,te,0,K,Y),_e=new ue(new Array(0),ee,0,P,X)}function u(t){var e;for(e=0;M>e;e++)t.dyn_ltree[2*e]=0;for(e=0;K>e;e++)t.dyn_dtree[2*e]=0;for(e=0;P>e;e++)t.bl_tree[2*e]=0;t.dyn_ltree[2*W]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function c(t){t.bi_valid>8?r(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function b(t,e,a,i){c(t),i&&(r(t,a),r(t,~a)),R.arraySet(t.pending_buf,t.window,e,a,t.pending),t.pending+=a}function g(t,e,a,i){var n=2*e,r=2*a;return t[n]<t[r]||t[n]===t[r]&&i[e]<=i[a]}function m(t,e,a){for(var i=t.heap[a],n=a<<1;n<=t.heap_len&&(n<t.heap_len&&g(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!g(e,i,t.heap[n],t.depth));)t.heap[a]=t.heap[n],a=n,n<<=1;t.heap[a]=i}function w(t,e,a){var i,r,l,h,d=0;if(0!==t.last_lit)do i=t.pending_buf[t.d_buf+2*d]<<8|t.pending_buf[t.d_buf+2*d+1],r=t.pending_buf[t.l_buf+d],d++,0===i?o(t,r,e):(l=oe[r],o(t,l+j+1,e),h=$[l],0!==h&&(r-=le[l],s(t,r,h)),i--,l=n(i),o(t,l,a),h=te[l],0!==h&&(i-=he[l],s(t,i,h)));while(d<t.last_lit);o(t,W,e)}function p(t,e){var a,i,n,r=e.dyn_tree,s=e.stat_desc.static_tree,o=e.stat_desc.has_stree,l=e.stat_desc.elems,h=-1;for(t.heap_len=0,t.heap_max=q,a=0;l>a;a++)0!==r[2*a]?(t.heap[++t.heap_len]=h=a,t.depth[a]=0):r[2*a+1]=0;for(;t.heap_len<2;)n=t.heap[++t.heap_len]=2>h?++h:0,r[2*n]=1,t.depth[n]=0,t.opt_len--,o&&(t.static_len-=s[2*n+1]);for(e.max_code=h,a=t.heap_len>>1;a>=1;a--)m(t,r,a);n=l;do a=t.heap[1],t.heap[1]=t.heap[t.heap_len--],m(t,r,1),i=t.heap[1],t.heap[--t.heap_max]=a,t.heap[--t.heap_max]=i,r[2*n]=r[2*a]+r[2*i],t.depth[n]=(t.depth[a]>=t.depth[i]?t.depth[a]:t.depth[i])+1,r[2*a+1]=r[2*i+1]=n,t.heap[1]=n++,m(t,r,1);while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],d(t,e),f(r,h,t.bl_count)}function v(t,e,a){var i,n,r=-1,s=e[1],o=0,l=7,h=4;for(0===s&&(l=138,h=3),e[2*(a+1)+1]=65535,i=0;a>=i;i++)n=s,s=e[2*(i+1)+1],++o<l&&n===s||(h>o?t.bl_tree[2*n]+=o:0!==n?(n!==r&&t.bl_tree[2*n]++,t.bl_tree[2*J]++):10>=o?t.bl_tree[2*Q]++:t.bl_tree[2*V]++,o=0,r=n,0===s?(l=138,h=3):n===s?(l=6,h=3):(l=7,h=4))}function k(t,e,a){var i,n,r=-1,l=e[1],h=0,d=7,f=4;for(0===l&&(d=138,f=3),i=0;a>=i;i++)if(n=l,l=e[2*(i+1)+1],!(++h<d&&n===l)){if(f>h){do o(t,n,t.bl_tree);while(0!==--h)}else 0!==n?(n!==r&&(o(t,n,t.bl_tree),h--),o(t,J,t.bl_tree),s(t,h-3,2)):10>=h?(o(t,Q,t.bl_tree),s(t,h-3,3)):(o(t,V,t.bl_tree),s(t,h-11,7));h=0,r=n,0===l?(d=138,f=3):n===l?(d=6,f=3):(d=7,f=4)}}function x(t){var e;for(v(t,t.dyn_ltree,t.l_desc.max_code),v(t,t.dyn_dtree,t.d_desc.max_code),p(t,t.bl_desc),e=P-1;e>=3&&0===t.bl_tree[2*ae[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}function z(t,e,a,i){var n;for(s(t,e-257,5),s(t,a-1,5),s(t,i-4,4),n=0;i>n;n++)s(t,t.bl_tree[2*ae[n]+1],3);k(t,t.dyn_ltree,e-1),k(t,t.dyn_dtree,a-1)}function y(t){var e,a=4093624447;for(e=0;31>=e;e++,a>>>=1)if(1&a&&0!==t.dyn_ltree[2*e])return I;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return N;for(e=32;j>e;e++)if(0!==t.dyn_ltree[2*e])return N;return I}function B(t){be||(_(),be=!0),t.l_desc=new ce(t.dyn_ltree,de),t.d_desc=new ce(t.dyn_dtree,fe),t.bl_desc=new ce(t.bl_tree,_e),t.bi_buf=0,t.bi_valid=0,u(t)}function S(t,e,a,i){s(t,(T<<1)+(i?1:0),3),b(t,e,a,!0)}function E(t){s(t,D<<1,3),o(t,W,ne),h(t)}function A(t,e,a,i){var n,r,o=0;t.level>0?(t.strm.data_type===O&&(t.strm.data_type=y(t)),p(t,t.l_desc),p(t,t.d_desc),o=x(t),n=t.opt_len+3+7>>>3,r=t.static_len+3+7>>>3,n>=r&&(n=r)):n=r=a+5,n>=a+4&&-1!==e?S(t,e,a,i):t.strategy===C||r===n?(s(t,(D<<1)+(i?1:0),3),w(t,ne,re)):(s(t,(F<<1)+(i?1:0),3),z(t,t.l_desc.max_code+1,t.d_desc.max_code+1,o+1),w(t,t.dyn_ltree,t.dyn_dtree)),u(t),i&&c(t)}function Z(t,e,a){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&a,t.last_lit++,0===e?t.dyn_ltree[2*a]++:(t.matches++,e--,t.dyn_ltree[2*(oe[a]+j+1)]++,t.dyn_dtree[2*n(e)]++),t.last_lit===t.lit_bufsize-1}var R=t("../utils/common"),C=4,I=0,N=1,O=2,T=0,D=1,F=2,L=3,U=258,H=29,j=256,M=j+1+H,K=30,P=19,q=2*M+1,Y=15,G=16,X=7,W=256,J=16,Q=17,V=18,$=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],te=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],ee=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],ae=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],ie=512,ne=new Array(2*(M+2));i(ne);var re=new Array(2*K);i(re);var se=new Array(ie);i(se);var oe=new Array(U-L+1);i(oe);var le=new Array(H);i(le);var he=new Array(K);i(he);var de,fe,_e,ue=function(t,e,a,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=i,this.max_length=n,this.has_stree=t&&t.length},ce=function(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e},be=!1;a._tr_init=B,a._tr_stored_block=S,a._tr_flush_block=A,a._tr_tally=Z,a._tr_align=E},{"../utils/common":4}],16:[function(t,e){"use strict";function a(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}e.exports=a},{}]},{},[1])(1)});
var hljs=new function(){function j(v){return v.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function t(v){return v.nodeName.toLowerCase()}function h(w,x){var v=w&&w.exec(x);return v&&v.index==0}function r(w){var v=(w.className+" "+(w.parentNode?w.parentNode.className:"")).split(/\s+/);v=v.map(function(x){return x.replace(/^lang(uage)?-/,"")});return v.filter(function(x){return i(x)||x=="no-highlight"})[0]}function o(x,y){var v={};for(var w in x){v[w]=x[w]}if(y){for(var w in y){v[w]=y[w]}}return v}function u(x){var v=[];(function w(y,z){for(var A=y.firstChild;A;A=A.nextSibling){if(A.nodeType==3){z+=A.nodeValue.length}else{if(t(A)=="br"){z+=1}else{if(A.nodeType==1){v.push({event:"start",offset:z,node:A});z=w(A,z);v.push({event:"stop",offset:z,node:A})}}}}return z})(x,0);return v}function q(w,y,C){var x=0;var F="";var z=[];function B(){if(!w.length||!y.length){return w.length?w:y}if(w[0].offset!=y[0].offset){return(w[0].offset<y[0].offset)?w:y}return y[0].event=="start"?w:y}function A(H){function G(I){return" "+I.nodeName+'="'+j(I.value)+'"'}F+="<"+t(H)+Array.prototype.map.call(H.attributes,G).join("")+">"}function E(G){F+="</"+t(G)+">"}function v(G){(G.event=="start"?A:E)(G.node)}while(w.length||y.length){var D=B();F+=j(C.substr(x,D[0].offset-x));x=D[0].offset;if(D==w){z.reverse().forEach(E);do{v(D.splice(0,1)[0]);D=B()}while(D==w&&D.length&&D[0].offset==x);z.reverse().forEach(A)}else{if(D[0].event=="start"){z.push(D[0].node)}else{z.pop()}v(D.splice(0,1)[0])}}return F+j(C.substr(x))}function m(y){function v(z){return(z&&z.source)||z}function w(A,z){return RegExp(v(A),"m"+(y.cI?"i":"")+(z?"g":""))}function x(D,C){if(D.compiled){return}D.compiled=true;D.k=D.k||D.bK;if(D.k){var z={};function E(G,F){if(y.cI){F=F.toLowerCase()}F.split(" ").forEach(function(H){var I=H.split("|");z[I[0]]=[G,I[1]?Number(I[1]):1]})}if(typeof D.k=="string"){E("keyword",D.k)}else{Object.keys(D.k).forEach(function(F){E(F,D.k[F])})}D.k=z}D.lR=w(D.l||/\b[A-Za-z0-9_]+\b/,true);if(C){if(D.bK){D.b="\\b("+D.bK.split(" ").join("|")+")\\b"}if(!D.b){D.b=/\B|\b/}D.bR=w(D.b);if(!D.e&&!D.eW){D.e=/\B|\b/}if(D.e){D.eR=w(D.e)}D.tE=v(D.e)||"";if(D.eW&&C.tE){D.tE+=(D.e?"|":"")+C.tE}}if(D.i){D.iR=w(D.i)}if(D.r===undefined){D.r=1}if(!D.c){D.c=[]}var B=[];D.c.forEach(function(F){if(F.v){F.v.forEach(function(G){B.push(o(F,G))})}else{B.push(F=="self"?D:F)}});D.c=B;D.c.forEach(function(F){x(F,D)});if(D.starts){x(D.starts,C)}var A=D.c.map(function(F){return F.bK?"\\.?("+F.b+")\\.?":F.b}).concat([D.tE,D.i]).map(v).filter(Boolean);D.t=A.length?w(A.join("|"),true):{exec:function(F){return null}};D.continuation={}}x(y)}function c(S,L,J,R){function v(U,V){for(var T=0;T<V.c.length;T++){if(h(V.c[T].bR,U)){return V.c[T]}}}function z(U,T){if(h(U.eR,T)){return U}if(U.eW){return z(U.parent,T)}}function A(T,U){return !J&&h(U.iR,T)}function E(V,T){var U=M.cI?T[0].toLowerCase():T[0];return V.k.hasOwnProperty(U)&&V.k[U]}function w(Z,X,W,V){var T=V?"":b.classPrefix,U='<span class="'+T,Y=W?"":"</span>";U+=Z+'">';return U+X+Y}function N(){if(!I.k){return j(C)}var T="";var W=0;I.lR.lastIndex=0;var U=I.lR.exec(C);while(U){T+=j(C.substr(W,U.index-W));var V=E(I,U);if(V){H+=V[1];T+=w(V[0],j(U[0]))}else{T+=j(U[0])}W=I.lR.lastIndex;U=I.lR.exec(C)}return T+j(C.substr(W))}function F(){if(I.sL&&!f[I.sL]){return j(C)}var T=I.sL?c(I.sL,C,true,I.continuation.top):e(C);if(I.r>0){H+=T.r}if(I.subLanguageMode=="continuous"){I.continuation.top=T.top}return w(T.language,T.value,false,true)}function Q(){return I.sL!==undefined?F():N()}function P(V,U){var T=V.cN?w(V.cN,"",true):"";if(V.rB){D+=T;C=""}else{if(V.eB){D+=j(U)+T;C=""}else{D+=T;C=U}}I=Object.create(V,{parent:{value:I}})}function G(T,X){C+=T;if(X===undefined){D+=Q();return 0}var V=v(X,I);if(V){D+=Q();P(V,X);return V.rB?0:X.length}var W=z(I,X);if(W){var U=I;if(!(U.rE||U.eE)){C+=X}D+=Q();do{if(I.cN){D+="</span>"}H+=I.r;I=I.parent}while(I!=W.parent);if(U.eE){D+=j(X)}C="";if(W.starts){P(W.starts,"")}return U.rE?0:X.length}if(A(X,I)){throw new Error('Illegal lexeme "'+X+'" for mode "'+(I.cN||"<unnamed>")+'"')}C+=X;return X.length||1}var M=i(S);if(!M){throw new Error('Unknown language: "'+S+'"')}m(M);var I=R||M;var D="";for(var K=I;K!=M;K=K.parent){if(K.cN){D+=w(K.cN,D,true)}}var C="";var H=0;try{var B,y,x=0;while(true){I.t.lastIndex=x;B=I.t.exec(L);if(!B){break}y=G(L.substr(x,B.index-x),B[0]);x=B.index+y}G(L.substr(x));for(var K=I;K.parent;K=K.parent){if(K.cN){D+="</span>"}}return{r:H,value:D,language:S,top:I}}catch(O){if(O.message.indexOf("Illegal")!=-1){return{r:0,value:j(L)}}else{throw O}}}function e(y,x){x=x||b.languages||Object.keys(f);var v={r:0,value:j(y)};var w=v;x.forEach(function(z){if(!i(z)){return}var A=c(z,y,false);A.language=z;if(A.r>w.r){w=A}if(A.r>v.r){w=v;v=A}});if(w.language){v.second_best=w}return v}function g(v){if(b.tabReplace){v=v.replace(/^((<[^>]+>|\t)+)/gm,function(w,z,y,x){return z.replace(/\t/g,b.tabReplace)})}if(b.useBR){v=v.replace(/\n/g,"<br>")}return v}function p(z){var y=b.useBR?z.innerHTML.replace(/\n/g,"").replace(/<br>|<br [^>]*>/g,"\n").replace(/<[^>]*>/g,""):z.textContent;var A=r(z);if(A=="no-highlight"){return}var v=A?c(A,y,true):e(y);var w=u(z);if(w.length){var x=document.createElementNS("http://www.w3.org/1999/xhtml","pre");x.innerHTML=v.value;v.value=q(w,u(x),y)}v.value=g(v.value);z.innerHTML=v.value;z.className+=" hljs "+(!A&&v.language||"");z.result={language:v.language,re:v.r};if(v.second_best){z.second_best={language:v.second_best.language,re:v.second_best.r}}}var b={classPrefix:"hljs-",tabReplace:null,useBR:false,languages:undefined};function s(v){b=o(b,v)}function l(){if(l.called){return}l.called=true;var v=document.querySelectorAll("pre code");Array.prototype.forEach.call(v,p)}function a(){addEventListener("DOMContentLoaded",l,false);addEventListener("load",l,false)}var f={};var n={};function d(v,x){var w=f[v]=x(this);if(w.aliases){w.aliases.forEach(function(y){n[y]=v})}}function k(){return Object.keys(f)}function i(v){return f[v]||f[n[v]]}this.highlight=c;this.highlightAuto=e;this.fixMarkup=g;this.highlightBlock=p;this.configure=s;this.initHighlighting=l;this.initHighlightingOnLoad=a;this.registerLanguage=d;this.listLanguages=k;this.getLanguage=i;this.inherit=o;this.IR="[a-zA-Z][a-zA-Z0-9_]*";this.UIR="[a-zA-Z_][a-zA-Z0-9_]*";this.NR="\\b\\d+(\\.\\d+)?";this.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";this.BNR="\\b(0b[01]+)";this.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";this.BE={b:"\\\\[\\s\\S]",r:0};this.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[this.BE]};this.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[this.BE]};this.PWM={b:/\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/};this.CLCM={cN:"comment",b:"//",e:"$",c:[this.PWM]};this.CBCM={cN:"comment",b:"/\\*",e:"\\*/",c:[this.PWM]};this.HCM={cN:"comment",b:"#",e:"$",c:[this.PWM]};this.NM={cN:"number",b:this.NR,r:0};this.CNM={cN:"number",b:this.CNR,r:0};this.BNM={cN:"number",b:this.BNR,r:0};this.CSSNM={cN:"number",b:this.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0};this.RM={cN:"regexp",b:/\//,e:/\/[gim]*/,i:/\n/,c:[this.BE,{b:/\[/,e:/\]/,r:0,c:[this.BE]}]};this.TM={cN:"title",b:this.IR,r:0};this.UTM={cN:"title",b:this.UIR,r:0}}();hljs.registerLanguage("bash",function(b){var a={cN:"variable",v:[{b:/\$[\w\d#@][\w\d_]*/},{b:/\$\{(.*?)\}/}]};var d={cN:"string",b:/"/,e:/"/,c:[b.BE,a,{cN:"variable",b:/\$\(/,e:/\)/,c:[b.BE]}]};var c={cN:"string",b:/'/,e:/'/};return{aliases:["sh","zsh"],l:/-?[a-z\.]+/,k:{keyword:"if then else elif fi for break continue while in do done exit return set declare case esac export exec",literal:"true false",built_in:"printf echo read cd pwd pushd popd dirs let eval unset typeset readonly getopts source shopt caller type hash bind help sudo",operator:"-ne -eq -lt -gt -f -d -e -s -l -a"},c:[{cN:"shebang",b:/^#![^\n]+sh\s*$/,r:10},{cN:"function",b:/\w[\w\d_]*\s*\(\s*\)\s*\{/,rB:true,c:[b.inherit(b.TM,{b:/\w[\w\d_]*/})],r:0},b.HCM,b.NM,d,c,a]}});hljs.registerLanguage("brainfuck",function(b){var a={cN:"literal",b:"[\\+\\-]",r:0};return{aliases:["bf"],c:[{cN:"comment",b:"[^\\[\\]\\.,\\+\\-<> \r\n]",rE:true,e:"[\\[\\]\\.,\\+\\-<> \r\n]",r:0},{cN:"title",b:"[\\[\\]]",r:0},{cN:"string",b:"[\\.,]",r:0},{b:/\+\+|\-\-/,rB:true,c:[a]},a]}});hljs.registerLanguage("clojure",function(l){var e={built_in:"def cond apply if-not if-let if not not= = &lt; < > &lt;= <= >= == + / * - rem quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last drop-while while intern condp case reduced cycle split-at split-with repeat replicate iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter monitor-exit defmacro defn defn- macroexpand macroexpand-1 for dosync and or when when-not when-let comp juxt partial sequence memoize constantly complement identity assert peek pop doto proxy defstruct first rest cons defprotocol cast coll deftype defrecord last butlast sigs reify second ffirst fnext nfirst nnext defmulti defmethod meta with-meta ns in-ns create-ns import refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize"};var f="[a-zA-Z_0-9\\!\\.\\?\\-\\+\\*\\/\\<\\=\\>\\&\\#\\$';]+";var a="[\\s:\\(\\{]+\\d+(\\.\\d+)?";var d={cN:"number",b:a,r:0};var j=l.inherit(l.QSM,{i:null});var o={cN:"comment",b:";",e:"$",r:0};var n={cN:"collection",b:"[\\[\\{]",e:"[\\]\\}]"};var c={cN:"comment",b:"\\^"+f};var b={cN:"comment",b:"\\^\\{",e:"\\}"};var h={cN:"attribute",b:"[:]"+f};var m={cN:"list",b:"\\(",e:"\\)"};var g={eW:true,k:{literal:"true false nil"},r:0};var i={k:e,l:f,cN:"title",b:f,starts:g};m.c=[{cN:"comment",b:"comment"},i,g];g.c=[m,j,c,b,o,h,n,d];n.c=[m,j,c,o,h,n,d];return{aliases:["clj"],i:/\S/,c:[o,m,{cN:"prompt",b:/^=> /,starts:{e:/\n\n|\Z/}}]}});hljs.registerLanguage("coffeescript",function(c){var b={keyword:"in if for while finally new do return else break catch instanceof throw try this switch continue typeof delete debugger super then unless until loop of by when and or is isnt not",literal:"true false null undefined yes no on off",reserved:"case default function var void with const let enum export import native __hasProp __extends __slice __bind __indexOf",built_in:"npm require console print module global window document"};var a="[A-Za-z$_][0-9A-Za-z$_]*";var f=c.inherit(c.TM,{b:a});var e={cN:"subst",b:/#\{/,e:/}/,k:b};var d=[c.BNM,c.inherit(c.CNM,{starts:{e:"(\\s*/)?",r:0}}),{cN:"string",v:[{b:/'''/,e:/'''/,c:[c.BE]},{b:/'/,e:/'/,c:[c.BE]},{b:/"""/,e:/"""/,c:[c.BE,e]},{b:/"/,e:/"/,c:[c.BE,e]}]},{cN:"regexp",v:[{b:"///",e:"///",c:[e,c.HCM]},{b:"//[gim]*",r:0},{b:"/\\S(\\\\.|[^\\n])*?/[gim]*(?=\\s|\\W|$)"}]},{cN:"property",b:"@"+a},{b:"`",e:"`",eB:true,eE:true,sL:"javascript"}];e.c=d;return{aliases:["coffee","cson","iced"],k:b,c:d.concat([{cN:"comment",b:"###",e:"###"},c.HCM,{cN:"function",b:"("+a+"\\s*=\\s*)?(\\(.*\\))?\\s*\\B[-=]>",e:"[-=]>",rB:true,c:[f,{cN:"params",b:"\\(",rB:true,c:[{b:/\(/,e:/\)/,k:b,c:["self"].concat(d)}]}]},{cN:"class",bK:"class",e:"$",i:/[:="\[\]]/,c:[{bK:"extends",eW:true,i:/[:="\[\]]/,c:[f]},f]},{cN:"attribute",b:a+":",e:":",rB:true,eE:true,r:0}])}});hljs.registerLanguage("cpp",function(a){var b={keyword:"false int float while private char catch export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const struct for static_cast|10 union namespace unsigned long throw volatile static protected bool template mutable if public friend do return goto auto void enum else break new extern using true class asm case typeid short reinterpret_cast|10 default double register explicit signed typename try this switch continue wchar_t inline delete alignof char16_t char32_t constexpr decltype noexcept nullptr static_assert thread_local restrict _Bool complex _Complex _Imaginary",built_in:"std string cin cout cerr clog stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap array shared_ptr abort abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf"};return{aliases:["c","h","c++","h++"],k:b,i:"</",c:[a.CLCM,a.CBCM,a.QSM,{cN:"string",b:"'\\\\?.",e:"'",i:"."},{cN:"number",b:"\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)"},a.CNM,{cN:"preprocessor",b:"#",e:"$",k:"if else elif endif define undef warning error line pragma",c:[{b:'include\\s*[<"]',e:'[>"]',k:"include",i:"\\n"},a.CLCM]},{cN:"stl_container",b:"\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",e:">",k:b,c:["self"]},{b:a.IR+"::"}]}});hljs.registerLanguage("cs",function(b){var a="abstract as base bool break byte case catch char checked const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual volatile void while async await ascending descending from get group into join let orderby partial select set value var where yield";return{k:a,i:/::/,c:[{cN:"comment",b:"///",e:"$",rB:true,c:[{cN:"xmlDocTag",v:[{b:"///",r:0},{b:"<!--|-->"},{b:"</?",e:">"}]}]},b.CLCM,b.CBCM,{cN:"preprocessor",b:"#",e:"$",k:"if else elif endif define undef warning error line region endregion pragma checksum"},{cN:"string",b:'@"',e:'"',c:[{b:'""'}]},b.ASM,b.QSM,b.CNM,{bK:"protected public private internal",e:/[{;=]/,k:a,c:[{bK:"class namespace interface",starts:{c:[b.TM]}},{b:b.IR+"\\s*\\(",rB:true,c:[b.TM]}]}]}});hljs.registerLanguage("css",function(a){var b="[a-zA-Z-][a-zA-Z0-9_-]*";var c={cN:"function",b:b+"\\(",rB:true,eE:true,e:"\\("};return{cI:true,i:"[=/|']",c:[a.CBCM,{cN:"id",b:"\\#[A-Za-z0-9_-]+"},{cN:"class",b:"\\.[A-Za-z0-9_-]+",r:0},{cN:"attr_selector",b:"\\[",e:"\\]",i:"$"},{cN:"pseudo",b:":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"},{cN:"at_rule",b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{cN:"at_rule",b:"@",e:"[{;]",c:[{cN:"keyword",b:/\S+/},{b:/\s/,eW:true,eE:true,r:0,c:[c,a.ASM,a.QSM,a.CSSNM]}]},{cN:"tag",b:b,r:0},{cN:"rules",b:"{",e:"}",i:"[^\\s]",r:0,c:[a.CBCM,{cN:"rule",b:"[^\\s]",rB:true,e:";",eW:true,c:[{cN:"attribute",b:"[A-Z\\_\\.\\-]+",e:":",eE:true,i:"[^\\s]",starts:{cN:"value",eW:true,eE:true,c:[c,a.CSSNM,a.QSM,a.ASM,a.CBCM,{cN:"hexcolor",b:"#[0-9A-Fa-f]+"},{cN:"important",b:"!important"}]}}]}]}]}});hljs.registerLanguage("delphi",function(b){var a="exports register file shl array record property for mod while set ally label uses raise not stored class safecall var interface or private static exit index inherited to else stdcall override shr asm far resourcestring finalization packed virtual out and protected library do xorwrite goto near function end div overload object unit begin string on inline repeat until destructor write message program with read initialization except default nil if case cdecl in downto threadvar of try pascal const external constructor type public then implementation finally published procedure";var e={cN:"comment",v:[{b:/\{/,e:/\}/,r:0},{b:/\(\*/,e:/\*\)/,r:10}]};var c={cN:"string",b:/'/,e:/'/,c:[{b:/''/}]};var d={cN:"string",b:/(#\d+)+/};var f={b:b.IR+"\\s*=\\s*class\\s*\\(",rB:true,c:[b.TM]};var g={cN:"function",bK:"function constructor destructor procedure",e:/[:;]/,k:"function constructor|10 destructor|10 procedure|10",c:[b.TM,{cN:"params",b:/\(/,e:/\)/,k:a,c:[c,d]},e]};return{cI:true,k:a,i:/("|\$[G-Zg-z]|\/\*|<\/)/,c:[e,b.CLCM,c,d,b.NM,f,g]}});hljs.registerLanguage("diff",function(a){return{aliases:["patch"],c:[{cN:"chunk",r:10,v:[{b:/^\@\@ +\-\d+,\d+ +\+\d+,\d+ +\@\@$/},{b:/^\*\*\* +\d+,\d+ +\*\*\*\*$/},{b:/^\-\-\- +\d+,\d+ +\-\-\-\-$/}]},{cN:"header",v:[{b:/Index: /,e:/$/},{b:/=====/,e:/=====$/},{b:/^\-\-\-/,e:/$/},{b:/^\*{3} /,e:/$/},{b:/^\+\+\+/,e:/$/},{b:/\*{5}/,e:/\*{5}$/}]},{cN:"addition",b:"^\\+",e:"$"},{cN:"deletion",b:"^\\-",e:"$"},{cN:"change",b:"^\\!",e:"$"}]}});hljs.registerLanguage("erlang-repl",function(a){return{k:{special_functions:"spawn spawn_link self",reserved:"after and andalso|10 band begin bnot bor bsl bsr bxor case catch cond div end fun if let not of or orelse|10 query receive rem try when xor"},c:[{cN:"prompt",b:"^[0-9]+> ",r:10},{cN:"comment",b:"%",e:"$"},{cN:"number",b:"\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)",r:0},a.ASM,a.QSM,{cN:"constant",b:"\\?(::)?([A-Z]\\w*(::)?)+"},{cN:"arrow",b:"->"},{cN:"ok",b:"ok"},{cN:"exclamation_mark",b:"!"},{cN:"function_or_atom",b:"(\\b[a-z'][a-zA-Z0-9_']*:[a-z'][a-zA-Z0-9_']*)|(\\b[a-z'][a-zA-Z0-9_']*)",r:0},{cN:"variable",b:"[A-Z][a-zA-Z0-9_']*",r:0}]}});hljs.registerLanguage("erlang",function(i){var c="[a-z'][a-zA-Z0-9_']*";var o="("+c+":"+c+"|"+c+")";var f={keyword:"after and andalso|10 band begin bnot bor bsl bzr bxor case catch cond div end fun let not of orelse|10 query receive rem try when xor",literal:"false true"};var l={cN:"comment",b:"%",e:"$"};var e={cN:"number",b:"\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)",r:0};var g={b:"fun\\s+"+c+"/\\d+"};var n={b:o+"\\(",e:"\\)",rB:true,r:0,c:[{cN:"function_name",b:o,r:0},{b:"\\(",e:"\\)",eW:true,rE:true,r:0}]};var h={cN:"tuple",b:"{",e:"}",r:0};var a={cN:"variable",b:"\\b_([A-Z][A-Za-z0-9_]*)?",r:0};var m={cN:"variable",b:"[A-Z][a-zA-Z0-9_]*",r:0};var b={b:"#"+i.UIR,r:0,rB:true,c:[{cN:"record_name",b:"#"+i.UIR,r:0},{b:"{",e:"}",r:0}]};var k={bK:"fun receive if try case",e:"end",k:f};k.c=[l,g,i.inherit(i.ASM,{cN:""}),k,n,i.QSM,e,h,a,m,b];var j=[l,g,k,n,i.QSM,e,h,a,m,b];n.c[1].c=j;h.c=j;b.c[1].c=j;var d={cN:"params",b:"\\(",e:"\\)",c:j};return{aliases:["erl"],k:f,i:"(</|\\*=|\\+=|-=|/=|/\\*|\\*/|\\(\\*|\\*\\))",c:[{cN:"function",b:"^"+c+"\\s*\\(",e:"->",rB:true,i:"\\(|#|//|/\\*|\\\\|:|;",c:[d,i.inherit(i.TM,{b:c})],starts:{e:";|\\.",k:f,c:j}},l,{cN:"pp",b:"^-",e:"\\.",r:0,eE:true,rB:true,l:"-"+i.IR,k:"-module -record -undef -export -ifdef -ifndef -author -copyright -doc -vsn -import -include -include_lib -compile -define -else -endif -file -behaviour -behavior -spec",c:[d]},e,i.QSM,b,a,m,h,{b:/\.$/}]}});hljs.registerLanguage("haskell",function(f){var g={cN:"comment",v:[{b:"--",e:"$"},{b:"{-",e:"-}",c:["self"]}]};var e={cN:"pragma",b:"{-#",e:"#-}"};var b={cN:"preprocessor",b:"^#",e:"$"};var d={cN:"type",b:"\\b[A-Z][\\w']*",r:0};var c={cN:"container",b:"\\(",e:"\\)",i:'"',c:[e,g,b,{cN:"type",b:"\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?"},f.inherit(f.TM,{b:"[_a-z][\\w']*"})]};var a={cN:"container",b:"{",e:"}",c:c.c};return{aliases:["hs"],k:"let in if then else case of where do module import hiding qualified type data newtype deriving class instance as default infix infixl infixr foreign export ccall stdcall cplusplus jvm dotnet safe unsafe family forall mdo proc rec",c:[{cN:"module",b:"\\bmodule\\b",e:"where",k:"module where",c:[c,g],i:"\\W\\.|;"},{cN:"import",b:"\\bimport\\b",e:"$",k:"import|0 qualified as hiding",c:[c,g],i:"\\W\\.|;"},{cN:"class",b:"^(\\s*)?(class|instance)\\b",e:"where",k:"class family instance where",c:[d,c,g]},{cN:"typedef",b:"\\b(data|(new)?type)\\b",e:"$",k:"data family type newtype deriving",c:[e,g,d,c,a]},{cN:"default",bK:"default",e:"$",c:[d,c,g]},{cN:"infix",bK:"infix infixl infixr",e:"$",c:[f.CNM,g]},{cN:"foreign",b:"\\bforeign\\b",e:"$",k:"foreign import export ccall stdcall cplusplus jvm dotnet safe unsafe",c:[d,f.QSM,g]},{cN:"shebang",b:"#!\\/usr\\/bin\\/env runhaskell",e:"$"},e,g,b,f.QSM,f.CNM,d,f.inherit(f.TM,{b:"^[_a-z][\\w']*"}),{b:"->|<-"}]}});hljs.registerLanguage("http",function(a){return{i:"\\S",c:[{cN:"status",b:"^HTTP/[0-9\\.]+",e:"$",c:[{cN:"number",b:"\\b\\d{3}\\b"}]},{cN:"request",b:"^[A-Z]+ (.*?) HTTP/[0-9\\.]+$",rB:true,e:"$",c:[{cN:"string",b:" ",e:" ",eB:true,eE:true}]},{cN:"attribute",b:"^\\w",e:": ",eE:true,i:"\\n|\\s|=",starts:{cN:"string",e:"$"}},{b:"\\n\\n",starts:{sL:"",eW:true}}]}});hljs.registerLanguage("ini",function(a){return{cI:true,i:/\S/,c:[{cN:"comment",b:";",e:"$"},{cN:"title",b:"^\\[",e:"\\]"},{cN:"setting",b:"^[a-z0-9\\[\\]_-]+[ \\t]*=[ \\t]*",e:"$",c:[{cN:"value",eW:true,k:"on off true false yes no",c:[a.QSM,a.NM],r:0}]}]}});hljs.registerLanguage("java",function(b){var a="false synchronized int abstract float private char boolean static null if const for true while long throw strictfp finally protected import native final return void enum else break transient new catch instanceof byte super volatile case assert short package default double public try this switch continue throws";return{aliases:["jsp"],k:a,i:/<\//,c:[{cN:"javadoc",b:"/\\*\\*",e:"\\*/",c:[{cN:"javadoctag",b:"(^|\\s)@[A-Za-z]+"}],r:10},b.CLCM,b.CBCM,b.ASM,b.QSM,{bK:"protected public private",e:/[{;=]/,k:a,c:[{cN:"class",bK:"class interface",eW:true,eE:true,i:/[:"<>]/,c:[{bK:"extends implements",r:10},b.UTM]},{b:b.UIR+"\\s*\\(",rB:true,c:[b.UTM]}]},b.CNM,{cN:"annotation",b:"@[A-Za-z]+"}]}});hljs.registerLanguage("javascript",function(a){return{aliases:["js"],k:{keyword:"in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document"},c:[{cN:"pi",b:/^\s*('|")use strict('|")/,r:10},a.ASM,a.QSM,a.CLCM,a.CBCM,a.CNM,{b:"("+a.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[a.CLCM,a.CBCM,a.RM,{b:/</,e:/>;/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,eE:true,c:[a.inherit(a.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,c:[a.CLCM,a.CBCM],i:/["'\(]/}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+a.IR,r:0}]}});hljs.registerLanguage("json",function(a){var e={literal:"true false null"};var d=[a.QSM,a.CNM];var c={cN:"value",e:",",eW:true,eE:true,c:d,k:e};var b={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:true,eE:true,c:[a.BE],i:"\\n",starts:c}],i:"\\S"};var f={b:"\\[",e:"\\]",c:[a.inherit(c,{cN:null})],i:"\\S"};d.splice(d.length,0,b,f);return{c:d,k:e,i:"\\S"}});hljs.registerLanguage("lisp",function(i){var l="[a-zA-Z_\\-\\+\\*\\/\\<\\=\\>\\&\\#][a-zA-Z0-9_\\-\\+\\*\\/\\<\\=\\>\\&\\#!]*";var m="(\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s)(\\+|\\-)?\\d+)?";var k={cN:"shebang",b:"^#!",e:"$"};var b={cN:"literal",b:"\\b(t{1}|nil)\\b"};var e={cN:"number",v:[{b:m,r:0},{b:"#b[0-1]+(/[0-1]+)?"},{b:"#o[0-7]+(/[0-7]+)?"},{b:"#x[0-9a-f]+(/[0-9a-f]+)?"},{b:"#c\\("+m+" +"+m,e:"\\)"}]};var h=i.inherit(i.QSM,{i:null});var n={cN:"comment",b:";",e:"$"};var g={cN:"variable",b:"\\*",e:"\\*"};var o={cN:"keyword",b:"[:&]"+l};var d={b:"\\(",e:"\\)",c:["self",b,h,e]};var a={cN:"quoted",c:[e,h,g,o,d],v:[{b:"['`]\\(",e:"\\)"},{b:"\\(quote ",e:"\\)",k:{title:"quote"}}]};var c={cN:"quoted",b:"'"+l};var j={cN:"list",b:"\\(",e:"\\)"};var f={eW:true,r:0};j.c=[{cN:"title",b:l},f];f.c=[a,c,j,b,e,h,n,g,o];return{i:/\S/,c:[e,k,b,h,n,a,c,j]}});hljs.registerLanguage("lua",function(b){var a="\\[=*\\[";var e="\\]=*\\]";var c={b:a,e:e,c:["self"]};var d=[{cN:"comment",b:"--(?!"+a+")",e:"$"},{cN:"comment",b:"--"+a,e:e,c:[c],r:10}];return{l:b.UIR,k:{keyword:"and break do else elseif end false for if in local nil not or repeat return then true until while",built_in:"_G _VERSION assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall coroutine debug io math os package string table"},c:d.concat([{cN:"function",bK:"function",e:"\\)",c:[b.inherit(b.TM,{b:"([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"}),{cN:"params",b:"\\(",eW:true,c:d}].concat(d)},b.CNM,b.ASM,b.QSM,{cN:"string",b:a,e:e,c:[c],r:10}])}});hljs.registerLanguage("objectivec",function(a){var d={keyword:"int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign self synchronized id nonatomic super unichar IBOutlet IBAction strong weak @private @protected @public @try @property @end @throw @catch @finally @synthesize @dynamic @selector @optional @required",literal:"false true FALSE TRUE nil YES NO NULL",built_in:"NSString NSDictionary CGRect CGPoint UIButton UILabel UITextView UIWebView MKMapView UISegmentedControl NSObject UITableViewDelegate UITableViewDataSource NSThread UIActivityIndicator UITabbar UIToolBar UIBarButtonItem UIImageView NSAutoreleasePool UITableView BOOL NSInteger CGFloat NSException NSLog NSMutableString NSMutableArray NSMutableDictionary NSURL NSIndexPath CGSize UITableViewCell UIView UIViewController UINavigationBar UINavigationController UITabBarController UIPopoverController UIPopoverControllerDelegate UIImage NSNumber UISearchBar NSFetchedResultsController NSFetchedResultsChangeType UIScrollView UIScrollViewDelegate UIEdgeInsets UIColor UIFont UIApplication NSNotFound NSNotificationCenter NSNotification UILocalNotification NSBundle NSFileManager NSTimeInterval NSDate NSCalendar NSUserDefaults UIWindow NSRange NSArray NSError NSURLRequest NSURLConnection UIInterfaceOrientation MPMoviePlayerController dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"};var c=/[a-zA-Z@][a-zA-Z0-9_]*/;var b="@interface @class @protocol @implementation";return{aliases:["m","mm","objc","obj-c"],k:d,l:c,i:"</",c:[a.CLCM,a.CBCM,a.CNM,a.QSM,{cN:"string",b:"'",e:"[^\\\\]'",i:"[^\\\\][^']"},{cN:"preprocessor",b:"#import",e:"$",c:[{cN:"title",b:'"',e:'"'},{cN:"title",b:"<",e:">"}]},{cN:"preprocessor",b:"#",e:"$"},{cN:"class",b:"("+b.split(" ").join("|")+")\\b",e:"({|$)",eE:true,k:b,l:c,c:[a.UTM]},{cN:"variable",b:"\\."+a.UIR,r:0}]}});hljs.registerLanguage("perl",function(c){var d="getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qqfileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmgetsub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedirioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when";var f={cN:"subst",b:"[$@]\\{",e:"\\}",k:d};var g={b:"->{",e:"}"};var a={cN:"variable",v:[{b:/\$\d/},{b:/[\$\%\@](\^\w\b|#\w+(\:\:\w+)*|{\w+}|\w+(\:\:\w*)*)/},{b:/[\$\%\@][^\s\w{]/,r:0}]};var e={cN:"comment",b:"^(__END__|__DATA__)",e:"\\n$",r:5};var h=[c.BE,f,a];var b=[a,c.HCM,e,{cN:"comment",b:"^\\=\\w",e:"\\=cut",eW:true},g,{cN:"string",c:h,v:[{b:"q[qwxr]?\\s*\\(",e:"\\)",r:5},{b:"q[qwxr]?\\s*\\[",e:"\\]",r:5},{b:"q[qwxr]?\\s*\\{",e:"\\}",r:5},{b:"q[qwxr]?\\s*\\|",e:"\\|",r:5},{b:"q[qwxr]?\\s*\\<",e:"\\>",r:5},{b:"qw\\s+q",e:"q",r:5},{b:"'",e:"'",c:[c.BE]},{b:'"',e:'"'},{b:"`",e:"`",c:[c.BE]},{b:"{\\w+}",c:[],r:0},{b:"-?\\w+\\s*\\=\\>",c:[],r:0}]},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{b:"(\\/\\/|"+c.RSR+"|\\b(split|return|print|reverse|grep)\\b)\\s*",k:"split return print reverse grep",r:0,c:[c.HCM,e,{cN:"regexp",b:"(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",r:10},{cN:"regexp",b:"(m|qr)?/",e:"/[a-z]*",c:[c.BE],r:0}]},{cN:"sub",bK:"sub",e:"(\\s*\\(.*?\\))?[;{]",r:5},{cN:"operator",b:"-\\w\\b",r:0}];f.c=b;g.c=b;return{aliases:["pl"],k:d,c:b}});hljs.registerLanguage("php",function(b){var e={cN:"variable",b:"\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*"};var a={cN:"preprocessor",b:/<\?(php)?|\?>/};var c={cN:"string",c:[b.BE,a],v:[{b:'b"',e:'"'},{b:"b'",e:"'"},b.inherit(b.ASM,{i:null}),b.inherit(b.QSM,{i:null})]};var d={v:[b.BNM,b.CNM]};return{aliases:["php3","php4","php5","php6"],cI:true,k:"and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",c:[b.CLCM,b.HCM,{cN:"comment",b:"/\\*",e:"\\*/",c:[{cN:"phpdoc",b:"\\s@[A-Za-z]+"},a]},{cN:"comment",b:"__halt_compiler.+?;",eW:true,k:"__halt_compiler",l:b.UIR},{cN:"string",b:"<<<['\"]?\\w+['\"]?$",e:"^\\w+;",c:[b.BE]},a,e,{cN:"function",bK:"function",e:/[;{]/,eE:true,i:"\\$|\\[|%",c:[b.UTM,{cN:"params",b:"\\(",e:"\\)",c:["self",e,b.CBCM,c,d]}]},{cN:"class",bK:"class interface",e:"{",eE:true,i:/[:\(\$"]/,c:[{bK:"extends implements",r:10},b.UTM]},{bK:"namespace",e:";",i:/[\.']/,c:[b.UTM]},{bK:"use",e:";",c:[b.UTM]},{b:"=>"},c,d]}});hljs.registerLanguage("python",function(a){var f={cN:"prompt",b:/^(>>>|\.\.\.) /};var b={cN:"string",c:[a.BE],v:[{b:/(u|b)?r?'''/,e:/'''/,c:[f],r:10},{b:/(u|b)?r?"""/,e:/"""/,c:[f],r:10},{b:/(u|r|ur)'/,e:/'/,r:10},{b:/(u|r|ur)"/,e:/"/,r:10},{b:/(b|br)'/,e:/'/},{b:/(b|br)"/,e:/"/},a.ASM,a.QSM]};var d={cN:"number",r:0,v:[{b:a.BNR+"[lLjJ]?"},{b:"\\b(0o[0-7]+)[lLjJ]?"},{b:a.CNR+"[lLjJ]?"}]};var e={cN:"params",b:/\(/,e:/\)/,c:["self",f,d,b]};var c={e:/:/,i:/[${=;\n]/,c:[a.UTM,e]};return{aliases:["py","gyp"],k:{keyword:"and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda nonlocal|10 None True False",built_in:"Ellipsis NotImplemented"},i:/(<\/|->|\?)/,c:[f,d,b,a.HCM,a.inherit(c,{cN:"function",bK:"def",r:10}),a.inherit(c,{cN:"class",bK:"class"}),{cN:"decorator",b:/@/,e:/$/},{b:/\b(print|exec)\(/}]}});hljs.registerLanguage("ruby",function(f){var j="[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?";var i="and false then defined module in return redo if BEGIN retry end for true self when next until do begin unless END rescue nil else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor";var b={cN:"yardoctag",b:"@[A-Za-z]+"};var c={cN:"value",b:"#<",e:">"};var k={cN:"comment",v:[{b:"#",e:"$",c:[b]},{b:"^\\=begin",e:"^\\=end",c:[b],r:10},{b:"^__END__",e:"\\n$"}]};var d={cN:"subst",b:"#\\{",e:"}",k:i};var e={cN:"string",c:[f.BE,d],v:[{b:/'/,e:/'/},{b:/"/,e:/"/},{b:"%[qw]?\\(",e:"\\)"},{b:"%[qw]?\\[",e:"\\]"},{b:"%[qw]?{",e:"}"},{b:"%[qw]?<",e:">"},{b:"%[qw]?/",e:"/"},{b:"%[qw]?%",e:"%"},{b:"%[qw]?-",e:"-"},{b:"%[qw]?\\|",e:"\\|"},{b:/\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/}]};var a={cN:"params",b:"\\(",e:"\\)",k:i};var h=[e,c,k,{cN:"class",bK:"class module",e:"$|;",i:/=/,c:[f.inherit(f.TM,{b:"[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?"}),{cN:"inheritance",b:"<\\s*",c:[{cN:"parent",b:"("+f.IR+"::)?"+f.IR}]},k]},{cN:"function",bK:"def",e:" |$|;",r:0,c:[f.inherit(f.TM,{b:j}),a,k]},{cN:"constant",b:"(::)?(\\b[A-Z]\\w*(::)?)+",r:0},{cN:"symbol",b:":",c:[e,{b:j}],r:0},{cN:"symbol",b:f.UIR+"(\\!|\\?)?:",r:0},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{cN:"variable",b:"(\\$\\W)|((\\$|\\@\\@?)(\\w+))"},{b:"("+f.RSR+")\\s*",c:[c,k,{cN:"regexp",c:[f.BE,d],i:/\n/,v:[{b:"/",e:"/[a-z]*"},{b:"%r{",e:"}[a-z]*"},{b:"%r\\(",e:"\\)[a-z]*"},{b:"%r!",e:"![a-z]*"},{b:"%r\\[",e:"\\][a-z]*"}]}],r:0}];d.c=h;a.c=h;var g=[{r:1,cN:"output",b:"^\\s*=> ",e:"$",rB:true,c:[{cN:"status",b:"^\\s*=>"},{b:" ",e:"$",c:h}]},{r:1,cN:"input",b:"^[^ ][^=>]*>+ ",e:"$",rB:true,c:[{cN:"prompt",b:"^[^ ][^=>]*>+"},{b:" ",e:"$",c:h}]}];return{aliases:["rb","gemspec","podspec","thor","irb"],k:i,c:g.concat(h)}});hljs.registerLanguage("sql",function(a){var b={cN:"comment",b:"--",e:"$"};return{cI:true,i:/[<>]/,c:[{cN:"operator",bK:"begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate savepoint release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup",e:/;/,eW:true,k:{keyword:"abs absolute acos action add adddate addtime aes_decrypt aes_encrypt after aggregate all allocate alter analyze and any are as asc ascii asin assertion at atan atan2 atn2 authorization authors avg backup before begin benchmark between bin binlog bit_and bit_count bit_length bit_or bit_xor both by cache call cascade cascaded case cast catalog ceil ceiling chain change changed char_length character_length charindex charset check checksum checksum_agg choose close coalesce coercibility collate collation collationproperty column columns columns_updated commit compress concat concat_ws concurrent connect connection connection_id consistent constraint constraints continue contributors conv convert convert_tz corresponding cos cot count count_big crc32 create cross cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime data database databases datalength date_add date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts datetimeoffsetfromparts day dayname dayofmonth dayofweek dayofyear deallocate declare decode default deferrable deferred degrees delayed delete des_decrypt des_encrypt des_key_file desc describe descriptor diagnostics difference disconnect distinct distinctrow div do domain double drop dumpfile each else elt enclosed encode encrypt end end-exec engine engines eomonth errors escape escaped event eventdata events except exception exec execute exists exp explain export_set extended external extract fast fetch field fields find_in_set first first_value floor flush for force foreign format found found_rows from from_base64 from_days from_unixtime full function get get_format get_lock getdate getutcdate global go goto grant grants greatest group group_concat grouping grouping_id gtid_subset gtid_subtract handler having help hex high_priority hosts hour ident_current ident_incr ident_seed identified identity if ifnull ignore iif ilike immediate in index indicator inet6_aton inet6_ntoa inet_aton inet_ntoa infile initially inner innodb input insert install instr intersect into is is_free_lock is_ipv4 is_ipv4_compat is_ipv4_mapped is_not is_not_null is_used_lock isdate isnull isolation join key kill language last last_day last_insert_id last_value lcase lead leading least leaves left len lenght level like limit lines ln load load_file local localtime localtimestamp locate lock log log10 log2 logfile logs low_priority lower lpad ltrim make_set makedate maketime master master_pos_wait match matched max md5 medium merge microsecond mid min minute mod mode module month monthname mutex name_const names national natural nchar next no no_write_to_binlog not now nullif nvarchar oct octet_length of old_password on only open optimize option optionally or ord order outer outfile output pad parse partial partition password patindex percent_rank percentile_cont percentile_disc period_add period_diff pi plugin position pow power pragma precision prepare preserve primary prior privileges procedure procedure_analyze processlist profile profiles public publishingservername purge quarter query quick quote quotename radians rand read references regexp relative relaylog release release_lock rename repair repeat replace replicate reset restore restrict return returns reverse revoke right rlike rollback rollup round row row_count rows rpad rtrim savepoint schema scroll sec_to_time second section select serializable server session session_user set sha sha1 sha2 share show sign sin size slave sleep smalldatetimefromparts snapshot some soname soundex sounds_like space sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sql_variant_property sqlstate sqrt square start starting status std stddev stddev_pop stddev_samp stdev stdevp stop str str_to_date straight_join strcmp string stuff subdate substr substring subtime subtring_index sum switchoffset sysdate sysdatetime sysdatetimeoffset system_user sysutcdatetime table tables tablespace tan temporary terminated tertiary_weights then time time_format time_to_sec timediff timefromparts timestamp timestampadd timestampdiff timezone_hour timezone_minute to to_base64 to_days to_seconds todatetimeoffset trailing transaction translation trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse ucase uncompress uncompressed_length unhex unicode uninstall union unique unix_timestamp unknown unlock update upgrade upped upper usage use user user_resources using utc_date utc_time utc_timestamp uuid uuid_short validate_password_strength value values var var_pop var_samp variables variance varp version view warnings week weekday weekofyear weight_string when whenever where with work write xml xor year yearweek zon",literal:"true false null",built_in:"array bigint binary bit blob boolean char character date dec decimal float int integer interval number numeric real serial smallint varchar varying int8 serial8 text"},c:[{cN:"string",b:"'",e:"'",c:[a.BE,{b:"''"}]},{cN:"string",b:'"',e:'"',c:[a.BE,{b:'""'}]},{cN:"string",b:"`",e:"`",c:[a.BE]},a.CNM,a.CBCM,b]},a.CBCM,b]}});hljs.registerLanguage("tex",function(a){var d={cN:"command",b:"\\\\[a-zA-Zа-яА-я]+[\\*]?"};var c={cN:"command",b:"\\\\[^a-zA-Zа-яА-я0-9]"};var b={cN:"special",b:"[{}\\[\\]\\&#~]",r:0};return{c:[{b:"\\\\[a-zA-Zа-яА-я]+[\\*]? *= *-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?",rB:true,c:[d,c,{cN:"number",b:" *=",e:"-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?",eB:true}],r:10},d,c,b,{cN:"formula",b:"\\$\\$",e:"\\$\\$",c:[d,c,b],r:0},{cN:"formula",b:"\\$",e:"\\$",c:[d,c,b],r:0},{cN:"comment",b:"%",e:"$",r:0}]}});hljs.registerLanguage("vbnet",function(a){return{aliases:["vb"],cI:true,k:{keyword:"addhandler addressof alias and andalso aggregate ansi as assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into is isfalse isnot istrue join key let lib like loop me mid mod module mustinherit mustoverride mybase myclass namespace narrowing new next not notinheritable notoverridable of off on operator option optional or order orelse overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim rem removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly xor",built_in:"boolean byte cbool cbyte cchar cdate cdec cdbl char cint clng cobj csbyte cshort csng cstr ctype date decimal directcast double gettype getxmlnamespace iif integer long object sbyte short single string trycast typeof uinteger ulong ushort",literal:"true false nothing"},i:"//|{|}|endif|gosub|variant|wend",c:[a.inherit(a.QSM,{c:[{b:'""'}]}),{cN:"comment",b:"'",e:"$",rB:true,c:[{cN:"xmlDocTag",b:"'''|<!--|-->"},{cN:"xmlDocTag",b:"</?",e:">"}]},a.CNM,{cN:"preprocessor",b:"#",e:"$",k:"if else elseif end region externalsource"}]}});hljs.registerLanguage("vbscript",function(a){return{aliases:["vbs"],cI:true,k:{keyword:"call class const dim do loop erase execute executeglobal exit for each next function if then else on error option explicit new private property let get public randomize redim rem select case set stop sub while wend with end to elseif is or xor and not class_initialize class_terminate default preserve in me byval byref step resume goto",built_in:"lcase month vartype instrrev ubound setlocale getobject rgb getref string weekdayname rnd dateadd monthname now day minute isarray cbool round formatcurrency conversions csng timevalue second year space abs clng timeserial fixs len asc isempty maths dateserial atn timer isobject filter weekday datevalue ccur isdate instr datediff formatdatetime replace isnull right sgn array snumeric log cdbl hex chr lbound msgbox ucase getlocale cos cdate cbyte rtrim join hour oct typename trim strcomp int createobject loadpicture tan formatnumber mid scriptenginebuildversion scriptengine split scriptengineminorversion cint sin datepart ltrim sqr scriptenginemajorversion time derived eval date formatpercent exp inputbox left ascw chrw regexp server response request cstr err",literal:"true false null nothing empty"},i:"//",c:[a.inherit(a.QSM,{c:[{b:'""'}]}),{cN:"comment",b:/'/,e:/$/,r:0},a.CNM]}});hljs.registerLanguage("xml",function(a){var c="[A-Za-z0-9\\._:-]+";var d={b:/<\?(php)?(?!\w)/,e:/\?>/,sL:"php",subLanguageMode:"continuous"};var b={eW:true,i:/</,r:0,c:[d,{cN:"attribute",b:c,r:0},{b:"=",r:0,c:[{cN:"value",v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s\/>]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xsl","plist"],cI:true,c:[{cN:"doctype",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},{cN:"comment",b:"<!--",e:"-->",r:10},{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{title:"style"},c:[b],starts:{e:"</style>",rE:true,sL:"css"}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{title:"script"},c:[b],starts:{e:"<\/script>",rE:true,sL:"javascript"}},{b:"<%",e:"%>",sL:"vbscript"},d,{cN:"pi",b:/<\?\w+/,e:/\?>/,r:10},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"title",b:"[^ /><]+",r:0},b]}]}});
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

    var array = new Uint8Array(str.length), i, il;

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
        GM_xmlhttpRequest({
            method: "GET",
            url: url.href,
            overrideMimeType: "text/plain; charset=x-user-defined",
            onload: function(oEvent) {
                var ff_buffer = stringToByteArray(oEvent.responseText || oEvent.response);
                cb(ff_buffer.buffer, new Date(0));
            }
        });
    }else{
        var oReq = new XMLHttpRequest();

        oReq.open("GET", url.href, true);
        oReq.responseType = "arraybuffer";
        oReq.onload = function(oEvent) {
            cb(oReq.response, new Date(oEvent.target.getResponseHeader('Last-Modified')));
        };
        oReq.send(null);        
    }
};

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

var steg_iv = [];

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

  	function decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive) {
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
				    throw "unexpected marker: " + ((bitsData << 8) | nextByte).toString(16) + " at " + offset.toString(16);
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
          			throw "invalid huffman sequence";
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

    	function decodeDCFirst(component, zz, pos) {
      		var t = decodeHuffman(component.huffmanTableDC);
      		var diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
      		zz[pos] = (component.pred += diff);
    	}

    	function decodeDCSuccessive(component, zz, pos) {
      		zz[pos] |= readBit() << successive;
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
                            if (s !== 1) throw "invalid ACn encoding";
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
        		decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
      		else
        		decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
    	} else {
      		decodeFn = decodeBaseline;
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
        		throw "marker was not found";
      		}

      		if (marker >= 0xFFD0 && marker <= 0xFFD7) { // RSTx
        		offset += 2;
      		} else break;
    	}

    	return offset - startOffset;
  	}

	var constructor = function(){
	};

	constructor.prototype.parse = function(fileAB){
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
                var blocksBufferSize = 64 * blocksPerColumnForMcu * (blocksPerLineForMcu + 1);
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
	      	throw "SOI not found";
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
	            	var componentsCount = data[offset++], componentId;
	            	var maxH = 0, maxV = 0;
	            	for (i = 0; i < componentsCount; i++) {
	            		componentId = data[offset];
	            		var h = data[offset + 1] >> 4;
	            		var v = data[offset + 1] & 15;
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
	          			successiveApproximation >> 4, successiveApproximation & 15);
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
	          		throw "unknown JPEG marker " + fileMarker.toString(16);
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
		if(self.frames[0].components.length != 1){
            writeWord(0x01A2); // length
        }else{
            writeWord(0x0D2); // length
        }

		writeByte(0); // HTYDCinfo
		for (var i=0; i<16; i++) {
			writeByte(std_dc_luminance_nrcodes[i+1]);
		}
		for (var j=0; j<=11; j++) {
			writeByte(std_dc_luminance_values[j]);
		}

		writeByte(0x10); // HTYACinfo
		for (var k=0; k<16; k++) {
			writeByte(std_ac_luminance_nrcodes[k+1]);
		}
		for (var l=0; l<=161; l++) {
			writeByte(std_ac_luminance_values[l]);
		}
        if(self.frames[0].components.length != 1){
    		writeByte(1); // HTUDCinfo
    		for (var m=0; m<16; m++) {
    			writeByte(std_dc_chrominance_nrcodes[m+1]);
    		}
    		for (var n=0; n<=11; n++) {
    			writeByte(std_dc_chrominance_values[n]);
    		}

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
		if ( bytepos >= 0 && bytepos !=7) {
			var fillbits = [];
			fillbits[1] = bytepos+1;
			fillbits[0] = (1<<(bytepos+1))-1;
			writeBits(fillbits);
		}

		writeWord(0xFFD9); //EOI
		
		return byteout;
	};

    var Permutaion = function(prng, size){
        var i;
        this.prng = prng;
        this.ids = new Array(size);

        for (i = 0; i < size; i++) this.ids[i] = i;

        var max_random = this.ids.length;
        for (i = 0; i < this.ids.length; i++) {
            var random_index = this.get_next(max_random);
            max_random--;
            var tmp = this.ids[random_index];
            this.ids[random_index] = this.ids[max_random];
            this.ids[max_random] = tmp;
        }
    };

    Permutaion.prototype.get_next = function(max){
        var ret_val = this.prng.next() | this.prng.next() << 8 | 
                this.prng.next() << 16 | this.prng.next() << 24;
        ret_val %= max;
        if(ret_val < 0) ret_val += max;
        return ret_val;
    };

    Permutaion.prototype.get_shuffled = function(i){
        return this.ids[i];
    };

    constructor.prototype.f5embed = function(embedAB, iv){
        var data = new Uint8Array(embedAB);
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
            var prng = prng_newstate();
            prng.init(iv);
            var pm = new Permutaion(prng, coeff_count);

            var next_bit_to_embed = 0,
                byte_to_embed = data.length,
                data_idx = 0,
                available_bits_to_embed = 0;

            console.log('Embedding of '+byte_to_embed+'+4 bytes');

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
                //n = 1;
            }
            
            if(n == 1){
                console.log('using default code');
            }else{
                console.log('using (1, '+n+', '+k+') code');
            }

            byte_to_embed |= k << 24;
            byte_to_embed ^= prng.next();
            byte_to_embed ^= prng.next() << 8;
            byte_to_embed ^= prng.next() << 16;
            byte_to_embed ^= prng.next() << 24;

            next_bit_to_embed = byte_to_embed & 1;
            byte_to_embed >>= 1;
            available_bits_to_embed = 31;
            _embedded += 1;

            for (ii = 0; ii < coeff_count; ii++) {
                shuffled_index = pm.get_shuffled(ii);

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
                        if(n > 1 || data_idx >= data.length) break;
                        byte_to_embed = data[data_idx++];
                        byte_to_embed ^= prng.next();
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

            if(n > 1){
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
                            byte_to_embed ^= prng.next();
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
                            ci = pm.get_shuffled(ii);
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
                                ci = pm.get_shuffled(ii);
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
        var coeff_count = coeff.length;

        console.log('permutation starts');
        var prng = prng_newstate();
        prng.init(iv);
        var pm = new Permutaion(prng, coeff_count);
        console.log(coeff_count + ' indices shuffled');

        var extracted_byte = 0,
            available_extracted_bits = 0,
            n_bytes_extracted = 0,
            extracted_bit = 0;

        console.log('extraction starts');

        var extracted_file_length = 0,
            pos = -1, i = 0, cc = 0, shuffled_index = 0;

        while(i < 32){
            pos++;
            shuffled_index = pm.get_shuffled(pos);
            if(shuffled_index % 64 === 0) continue;

            cc = coeff[shuffled_index];
            
            if(cc === 0){
                continue;
            }else if(cc > 0){
                extracted_bit = cc & 1;
            }else{
                extracted_bit = 1 - (cc & 1);
            }

            extracted_file_length |= extracted_bit << i;
            i++;
        }

        extracted_file_length ^= prng.next();
        extracted_file_length ^= prng.next() << 8;
        extracted_file_length ^= prng.next() << 16;
        extracted_file_length ^= prng.next() << 24;

        var k = (extracted_file_length >> 24) % 32,
            n = (1 << k) - 1;
        extracted_file_length &= 0x007fffff;

        if(extracted_file_length > coeff_count){
            throw 'embeded data is bigger than container';
        }

        console.log('length of embedded file: ' + extracted_file_length + ' bytes');
        var data = new Uint8Array(extracted_file_length),
            data_idx = 0, keep_extracting = true;

        if(n > 1){
            var vhash = 0, code;
            console.log('(1, '+n+', '+k+') code used');

            while(keep_extracting){
                vhash = 0;
                code = 1;
                while(code <= n){
                    pos++;
                    if(pos >= coeff_count)
                        throw 'end of coefficients';

                    shuffled_index = pm.get_shuffled(pos);
                    if(shuffled_index % 64 === 0) continue;

                    cc = coeff[shuffled_index];

                    if(cc === 0){
                        continue;
                    }else if(cc > 0){
                        extracted_bit = cc & 1;
                    }else{
                        extracted_bit = 1 - (cc & 1);
                    }

                    if(extracted_bit == 1)
                        vhash ^= code;
                    code++;
                }

                for (i = 0; i < k; i++) {
                    extracted_byte |= (vhash >> i & 1) << available_extracted_bits;
                    available_extracted_bits++;
                    if(available_extracted_bits == 8){
                        data[data_idx++] = extracted_byte ^ prng.next();
                        extracted_byte = 0;
                        available_extracted_bits = 0;
                        n_bytes_extracted++;

                        if(data_idx >= extracted_file_length){
                            keep_extracting = false;
                            break;
                        }
                    }
                }
            }

        }else{
            console.log('default code used');

            while(pos < coeff_count){
                pos++;
                shuffled_index = pm.get_shuffled(pos);
                if(shuffled_index % 64 === 0) continue;

                cc = coeff[shuffled_index];

                if(cc === 0){
                    continue;
                }else if(cc > 0){
                    extracted_bit = cc & 1;
                }else{
                    extracted_bit = 1 - (cc & 1);
                }

                extracted_byte |= extracted_bit << available_extracted_bits;
                available_extracted_bits++;

                if(available_extracted_bits == 8){
                    data[data_idx++] = extracted_byte ^ prng.next();
                    extracted_byte = 0;
                    available_extracted_bits = 0;
                    n_bytes_extracted++;

                    if(data_idx >= extracted_file_length){
                        break;
                    }
                }
            }
        }

        return data;
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

var _jpegEmbed = function(img_container, data_array){
    "use strict";

    var finalLength = img_container.byteLength + Math.ceil(data_array.byteLength / 65533) * 65537,
        jfif_header = [0xFF,0xE0, 0, 16, 0x4A, 0x46, 0x49, 0x46, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
        i, l, posO = 2, posT = 2,
        orig = img_container,
        outData = new ArrayBuffer(finalLength),
        output = new Uint8Array(outData),
        posE = 0, embedL = data_array.byteLength;

    output[0] = orig[0];
    output[1] = orig[1];

    for (i = 0; i < jfif_header.length; i++) {
        output[posT++] = jfif_header[i];
    }

    while (!(orig[posO] === 0xFF && orig[posO + 1] === 0xD9) && posO <= orig.byteLength) {
        if (orig[posO] === 0xFF && orig[posO + 1] === 0xFE) {
            l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
            for (i = 0; i < l; i++) {
                output[posT++] = orig[posO++];
            }
        } else if (orig[posO] === 0xFF && (orig[posO + 1] >> 4) === 0xE) {
            posO += 2 + orig[posO + 2] * 256 + orig[posO + 3];
        } else if (orig[posO] === 0xFF && orig[posO + 1] === 0xDA) {
            while(embedL > 65533){
                output[posT++] = 0xFF; output[posT++] = 0xE9; output[posT++] = 0xFF; output[posT++] = 0xFF;
                for (i = 0; i < 65533; i++) {
                    output[posT++] = data_array[posE++];                        
                }
                embedL -= 65533;
            }
            embedL += 2;
            if(embedL > 0){
                output[posT++] = 0xFF; output[posT++] = 0xE9; output[posT++] = embedL >> 8; output[posT++] = embedL & 255;
                for (i = 0; i < embedL - 2; i++) {
                    output[posT++] = data_array[posE++];                        
                }
            }

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

var _jpegExtract = function(inArBuf) {
    "use strict";
    var l, i, posO = 2, posE = 0,
        orig = new Uint8Array(inArBuf),
        embdAB = new ArrayBuffer(orig.byteLength),
        embd = new Uint8Array(embdAB);

    if(!(orig[0] === 0xFF && orig[1] === 0xD8)){
        return false;
    }

    while (!(orig[posO] === 0xFF && orig[posO + 1] === 0xD9) && posO <= orig.byteLength) {
        if (orig[posO] === 0xFF && orig[posO + 1] === 0xFE) {
            posO += 2 + orig[posO + 2] * 256 + orig[posO + 3];
        } else if (orig[posO] === 0xFF && (orig[posO + 1] >> 4) === 0xE) {
            if((orig[posO + 1] & 15) == 9){
                l = (orig[posO + 2] * 256 + orig[posO + 3]) - 2; 
                posO += 4;
                for (i = 0; i < l; i++) {
                    embd[posE++] = orig[posO++];
                }
            }else{
                posO += 2 + orig[posO + 2] * 256 + orig[posO + 3];
            }
        } else if (orig[posO] === 0xFF && orig[posO + 1] === 0xDA) {
            l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
            for (i = 0; i < l; i++) {
                posO++;
            }
            while (!(orig[posO] === 0xFF && orig[posO + 1] === 0xD9) && posO <= orig.byteLength) {
                posO++;
            }
        } else {
            l = (2 + orig[posO + 2] * 256 + orig[posO + 3]);
            for (i = 0; i < l; i++) {
                posO++;
            }
        }
    }
   
    if(posE > 0){
        return new Uint8Array(embdAB, 0, posE);
    }else{
        return false;
    }
};


var stegger = new jsf5steg();

var _initIv = function(){
    "use strict";
    if(steg_iv.length === 0){
        var buffer = new ArrayBuffer(256);
        var int32View = new Int32Array(buffer);
        var Uint8View = new Uint8Array(buffer);

        var key_from_pass = sjcl.misc.pbkdf2($('#steg_pwd').val(), $('#steg_pwd').val(), 1000, 256 * 8);

        int32View.set(key_from_pass);

        for (var i = 0; i < 256; i++) {
            steg_iv[i] = Uint8View[i];
        }
    }
};

var jpegEmbed = function(img_container, data_array){
    "use strict";

    _initIv();

    try{
        stegger.parse(img_container);
    } catch(e){
        alert('Unsupported container image. chuse another.');
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
        return false;
    }

    var data;
    try{
        data = stegger.f5extract(steg_iv);
    } catch(e){
        return false;
    }

    return data;
};

var upload_handler = (new Date()).getTime() * 10000;
ParseUrl = function(url){
    "use strict";
    var m = (url || document.location.href).match( /https?:\/\/([^\/]+)\/([^\/]+)\/((\d+)|res\/(\d+)|\w+)(\.x?html)?(#i?(\d+))?/);
    return m?{host:m[1], board:m[2], page:m[4], thread:m[5], pointer:m[8]}:{};
};
var Hanabira={URL:ParseUrl()};

var sendBoardForm = function(file) {
    "use strict";
    replyForm.find("#do_encode").val('..Working...').attr("disabled", "disabled");

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
                    if(["name","email","subject","post","spoiler","body","file","file_url","password","thread","board", "recaptcha_challenge_field", "recaptcha_response_field"].indexOf(a.name) > -1) return false;
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

var getRandPhrase = function(){
    "use strict";
    var wl = [["time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand", "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government", "company", "number", "group", "problem", "fact"],
            ["be", "have", "do", "say", "get", "make", "go", "know", "take", "see", "come", "think", "look", "want", "give", "use", "find", "tell", "ask", "work", "seem", "feel", "try", "leave", "call"],
            ["good", "new", "first", "last", "long", "great", "little", "own", "other", "old", "right", "big", "high", "different", "small", "large", "next", "early", "young", "important", "few", "public", "bad", "same", "able"],
            ["to", "of", "in", "for", "on", "with", "at", "by", "from", "up", "about", "into", "over", "after", "beneath", "under", "above"],
            ["the", "and", "a", "that", "I", "it", "not", "he", "as", "you", "this", "but", "his", "they", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their"],
            ["information", "back", "parent", "face", "others", "level", "office", "door", "health", "person", "art", "war", "history", "party", "result", "change", "morning", "reason", "research", "girl", "guy", "food", "moment", "air", "teacher"]],
        res = [];       


    for (var i = 0; i < wl.length; i++) {
        res.push(wl[i][Math.floor(Math.random() * wl[i].length)]);
    }

    return '**' + res.join(' ') + '**';
};

var _sendBoardForm = function(file, formAddon) {
    "use strict";
    
    var formData, fileInputName, formAction,
        fd = new FormData();

    if($('a#yukiForceUpdate').length !== 0 && $('form#yukipostform').length === 0){
        $('a.reply_.icon').last().click();
        $('form#yukipostform textarea').val('');
    }

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
        fileInputName = $("form[name=post] input[type=file]")[0].name;
        formAction = $("form[name=post]")[0].action; 
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
            if(["name","email","subject","post","spoiler","body","file","file_url","password","thread","board", "recaptcha_challenge_field", "recaptcha_response_field"].indexOf(a.name) > -1) return true;
            return false;
        });
        formData.push.apply(formData, formAddon);
    }

    for (var i = 0; i < formData.length; i++) {
        if (formData[i].name != fileInputName) {
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

            if (p !== 0) {
                $('#de-pform textarea').val('');
                $('form#yukipostform textarea').val('');
                $('form[name=post] textarea').val('');
                $('#de-pform img[src*=captcha]').click();
                $('#hidbord_replyform #c_file').val('');
                $('#de-updater-btn').click();
                $('#de-thrupdbtn').click();
                $('a#yukiForceUpdate').click();
                $('a#update_thread').click();
                $('#recaptcha_response_field').val('');
                $('#recaptcha_challenge_image').click();
                $('input[name=recaptcha_response_field]').val('');
                $('.recaptcha_image').click();
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
            alert('Error while posting. Something in network or so.');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
            upload_handler = (new Date()).getTime() * 10000;
        }
    });
};

var rsaProfile = {},
    rsa = new RSAKey(),
    rsa_hash, rsa_hashB64;

var do_login = function() {
    "use strict";

    var lf = document.loginform;

    rng_state = null;

    var buffer = new ArrayBuffer(256);
    var int32View = new Int32Array(buffer);
    var Uint8View = new Uint8Array(buffer);

    var key_from_pass = sjcl.misc.pbkdf2(lf.passwd.value, parseInt(lf.magik_num.value) + "_salt", 10000, 256 * 8);

    int32View.set(key_from_pass);

    for (var i = 0; i < rng_psize; i++) {
        rng_pool[i] = Uint8View[i];
    }

    rng_prefetch = parseInt(lf.magik_num.value);

    rsa.generate(1024, '10001');

    rsaProfile = {
        n: rsa.n.toString(16),
        d: rsa.d.toString(16),
        p: rsa.p.toString(16),
        q: rsa.q.toString(16),
        dmp1: rsa.dmp1.toString(16),
        dmq1: rsa.dmq1.toString(16),
        coeff: rsa.coeff.toString(16)
    };

    rsa_hash = hex_sha1(rsaProfile.n);
    rsa_hashB64 = hex2b64(rsa_hash);

    ssSet(boardHostName + 'magic_desu_numbers', rsaProfile);

    $('#identi').html(rsa_hash).identicon5({
        rotate: true,
        size: 64
    });
    $('#identi').append('<br/><br/><i style="color: #090;">'+rsa_hash+'</i>');
    $('#pub_key_info').val(linebrk(rsa.n.toString(16), 64));
    lf.magik_num.value = lf.passwd.value = '';
};

var do_encode = function() {
    "use strict";

    prev_to = $('#hidbord_cont_type').val();
    prev_cont = $('#hidbord_cont_direct').val();

    var to_group = null;

    if(prev_to.indexOf('group_') === 0){
        to_group = prev_to.substring(6);
    }

    var payLoad = {};

    if(!container_data){
        alert('Image needed. Please select one.');
        return false;
    }

    if(!("n" in rsaProfile)){
        alert('Please log in.');
        return false;   
    }

    payLoad.text = $('#hidbord_reply_text').val();
    payLoad.ts = Math.floor((new Date()).getTime() / 1000);

    var keys = {};
    keys[rsa_hash] = rsaProfile.n;

    for (var c in contacts) {
        if(prev_to == 'direct' && c == prev_cont){
            keys[c] = contacts[c].key;
            continue;
        }
        
        if('hide' in contacts[c] && contacts[c].hide == 1){
            continue;
        }

        if(to_group !== null && contacts[c].groups && $.isArray(contacts[c].groups) && contacts[c].groups.indexOf(to_group) != -1){
            keys[c] = contacts[c].key;
        }

        if(prev_to == 'direct' || to_group !== null){
            continue;
        }

        keys[c] = contacts[c].key;
    }

    var p = encodeMessage(payLoad,keys, 0);
    var testEncode = decodeMessage(p);

    if(!testEncode || testEncode.status != "OK"){
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

    var out_msg = {
        post_id: post_id,
        id: message.id,
        txt: {
            ts: message.ts,
            msg: message.message.text
        },
        keyid: message.keyhash,
        pubkey: message.key,
        status: message.status,
        to: message.keys,
    };

    push_msg(out_msg, msgPrepend, thumb);
    return out_msg;
};


var processedJpegs = {};

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

    processedJpegs[jpgURL] = {'id': 'none'};
    
    getURLasAB(jpgURL, function(arrayBuffer, date) {
        var arc = jpegExtract(arrayBuffer);
        if(arc){
            var p = decodeMessage(arc);
            if(p) processedJpegs[jpgURL].id = do_decode(p, null, thumbURL, date, post_id).id;
        }

        if (typeof(cb) == "function") {
            cb();
        }

    });
};

var contacts = {}, cont_groups = [];

var add_contact = function(e) {
    "use strict";

    var key = $(e.target).attr('alt');
    var rsa_hash = hex_sha1(key);
    var temp_name = rsa_hash.substring(0,3) + "-" + rsa_hash.substring(3,6) + "-" + rsa_hash.substring(6,9);

    var name = prompt("Name this contact:", temp_name);

    if (ssGet(boardHostName + 'magic_desu_contacts', contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + 'magic_desu_contacts', contactsInLocalStorage));
    }

    contacts[rsa_hash] = {
        key: key,
        name: '' + name,
        hide: 0,
        groups: []
    };

    ssSet((useGlobalContacts?'':boardHostName) + 'magic_desu_contacts', JSON.stringify(contacts), contactsInLocalStorage);
    render_contact();
    $('em[alt="'+rsa_hash+'"]').text('' + name).css({"color": '', "font-weight": "bold", "font-style": 'normal'});
};

function safe_tags(str) {
    "use strict";

    if(str && typeof str === 'string'){
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    return "";
}

var getContactHTML = function(hash, key) {
    "use strict";

    if (hash == rsa_hash) {
        return '<strong style="color: #090; font-style: italic" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">Me</strong>';
    }

    if (!(hash in contacts) && key) {
        return '<em style="color: #00f" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">Unknown</em> [<a href="javascript:;" alt="' + key + '" class="hidbord_addcntct_link">add</a>]';
    }

    if (!(hash in contacts)) {
        return '<em style="color: #00f" class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">Unknown</em>';
    }

    if ('hide' in contacts[hash] && contacts[hash].hide == 1) {
        return '<strike class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">' + safe_tags(contacts[hash].name) + '</strike>';
    }

    return '<strong class="hidbord_clickable hidbord_usr_reply" alt="'+hash+'">' + safe_tags(contacts[hash].name) + '</strong>';

};

var contactsSelector = function(){
    "use strict";
    var code = '<div id="hidbord_contacts_select"><strong>to:</strong>&nbsp;<select id="hidbord_cont_type"><option selected="selected" value="all">All</option><option value="direct">Direct</option><option disabled="disabled">Groups:</option>';

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

    if (ssGet(boardHostName + 'magic_desu_contacts', contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + 'magic_desu_contacts', contactsInLocalStorage));
    //    console.log(contacts);
    }


    cont_groups = {};

    var code = '<br><a href="data:text/plain;base64,' + strToDataUri(encodeURIComponent(JSON.stringify(contacts))) + 
               '" download="[DDT] Contacts - ' + document.location.host + ' - ' + dateToStr(new Date(), true) + 
               '.txt">Download contacts as file</a> or import from file: <input type="file" id="cont_import_file" name="cont_import_file"><br/><br/>', cnt = 1;

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
            '<div class="cont_identi" style="float: left">' + c + '</div>' +
            '<div  style="float: left; padding: 5px;">' + getContactHTML(c) + '<br/><i style="color: #090">' + c + '</i><br/>' +
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">delete</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">' + ren_action + '</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">rename</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">groups</a>]</sub></div>'+groups_list+'<div style="float: right; color: #ccc;"><sup>#'+(cnt++)+'</sup></div><br style="clear: both;"/></div>';
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

    cont_groups = Object.keys(cont_groups).sort();
};

var manage_contact = function(e) {
    "use strict";

    if (ssGet(boardHostName + 'magic_desu_contacts', contactsInLocalStorage)) {
        contacts = JSON.parse(ssGet((useGlobalContacts?'':boardHostName) + 'magic_desu_contacts', contactsInLocalStorage));
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

    ssSet((useGlobalContacts?'':boardHostName) + 'magic_desu_contacts', JSON.stringify(contacts), contactsInLocalStorage);
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
                    ssSet(boardHostName + 'magic_desu_contacts', JSON.stringify(contacts), contactsInLocalStorage);
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

var encodeMessage = function(message, keys, msg_type){
    'use strict';

    var i, pwd,salt,iv,preIter, arrTemp, keyshift, rp, p, sig,
        //deflate = new Zlib.RawDeflate(strToUTF8Arr(JSON.stringify(message))),
        compressed = pako.deflateRaw(strToUTF8Arr(JSON.stringify(message))),
        compressedAt = Math.floor((new Date()).getTime() / 1000),
        finalLength = 316 + 148 * Object.keys(keys).length + compressed.byteLength + 8,
        containerAB = new ArrayBuffer(finalLength),
        container = new Uint8Array(containerAB), crypted,
        signedPart = new Uint8Array(containerAB, 261);

    preIter = Math.random()*20;for (i = 0; i < preIter; i++){sjcl.random.randomWords(8, 0);}
    pwd = sjcl.codec.hex.fromBits(sjcl.random.randomWords(8, 0));
    
    preIter = Math.random()*20;for (i = 0; i < preIter; i++) {sjcl.random.randomWords(8, 0);}
    salt = sjcl.random.randomWords(8, 0);
    
    preIter = Math.random()*20;for (i = 0; i < preIter; i++) {sjcl.random.randomWords(8, 0);}
    iv = sjcl.random.randomWords(4, 0);

    p = {
        iv: iv,
        iter: 1000,
        mode: "ccm",
        ts: 64,
        ks: 256,
        salt: salt
    };

    p = sjcl.encrypt(pwd, sjcl.codec.bytes.toBits(compressed), p, rp);

    crypted = sjcl.codec.bytes.fromBits(p.ct);

    container[0] = CODEC_VERSION; // version

    container[1] = finalLength & 255; //data size
    container[2] = (finalLength >> 8) & 255;
    container[3] = (finalLength >> 16) & 255;
    container[4] = (finalLength >> 24) & 255;

    arrTemp = hexToBytes(rsaProfile.n, 128); // our publick key
    for (i = 0; i < arrTemp.length; i++) {
        container[5 + i] = arrTemp[i];
    }

    container[261] = msg_type; //type of message
    container[262] = compressedAt & 255; //coding unix_timestamp
    container[263] = (compressedAt >> 8) & 255;
    container[264] = (compressedAt >> 16) & 255;
    container[265] = (compressedAt >> 24) & 255;

    arrTemp = sjcl.codec.bytes.fromBits(iv); // iv
    for (i = 0; i < arrTemp.length; i++) {
        container[266 + i] = arrTemp[i];
    }
    var iv2 = arrayBufferDataUri(arrTemp);

    arrTemp = sjcl.codec.bytes.fromBits(salt); // iv
    for (i = 0; i < arrTemp.length; i++) {
        container[282 + i] = arrTemp[i];
    }
    var salt2 = arrayBufferDataUri(arrTemp);

    container[314] = Object.keys(keys).length & 255; // number of keys
    container[315] = (Object.keys(keys).length >> 8) & 255; // number of keys

    keyshift = 0;
    for (var c in keys) {

        arrTemp = hexToBytes(c, 20); // keyhash
        for (i = 0; i < arrTemp.length; i++) {
            container[316 + i + keyshift*148] = arrTemp[i];
        }

        var testRsa = new RSAKey();
        testRsa.setPublic(keys[c], '10001');

        arrTemp = hexToBytes(testRsa.encrypt(pwd), 128); // crypted password
        for (i = 0; i < arrTemp.length; i++) {
            container[336 + i + keyshift*148] = arrTemp[i];
        }

        keyshift++;
    }

    keyshift = 316 + 148 * Object.keys(keys).length;
    for (i = 0; i < crypted.length; i++) {
        container[keyshift + i] = crypted[i];
    }

    sig = rsa.signStringWithSHA256(signedPart);

    arrTemp = hexToBytes(sig, 128); // keyhash
    for (i = 0; i < arrTemp.length; i++) {
        container[133 + i] = arrTemp[i];
    }

    return container;
};

var decodeMessage = function(data){
    'use strict';

    if(data[0] != CODEC_VERSION) return false;
    var msgType = data[261],
        keyNum = data[314] + data[315] * 256,
        dataLength = data[1] + data[2] * 256 + data[3] * 65536 + data[4] * 16777216,
        compressedAt = data[262] + data[263] * 256 + data[264] * 65536 + data[265] * 16777216,
        cryptedPart = data.subarray(316 + 148 * keyNum),
        signedPart = data.subarray(261), keys = {}, i, j, message;

    if(dataLength != data.byteLength) return false;
    if(keyNum * 148 > data.byteLength) return false;

    var key = [], sig = [], iv = [], salt = [];

    for (i = 0; i < 128; i++) {
        key.push(data[5+i]);
        sig.push(data[133+i]);
    }

    key = bytesToHex(key);
    sig = bytesToHex(sig);

    try{
        var testRsa = new RSAKey();
        testRsa.setPublic(key, '10001');
        if (!testRsa.verifyString(signedPart, sig)) {
            return false;
        }
    } catch (e) {
        return false;
    }

    for (i = 0; i < 16; i++) {
        iv.push(data[266+i]);
    }
    
    for (i = 0; i < 32; i++) {
        salt.push(data[282+i]);
    }

    for (j = 0; j < keyNum; j++) {
        var keyhas = [], keyval = [];

        for (i = 0; i < 20; i++) {
            keyhas.push(data[316 + i + j*148]);
        }

        for (i = 0; i < 128; i++) {
            keyval.push(data[336 + i + j*148]);
        }

        keyhas = bytesToHex(keyhas);
        keyval = bytesToHex(keyval);

        keys[keyhas] = keyval;
    }


    var container = {
        id: SHA256(signedPart),
        ts: compressedAt,
        key: key,
        keyhash: hex_sha1(key),
        type: msgType,
        keys: Object.keys(keys),
        message: {text:""}
    };

    if (!(rsa_hash in keys)) {
        container.status = 'NOKEY';
        return container;
    }

    var aesmsg = {
        "iv": sjcl.codec.bytes.toBits(iv),
        "v": 1,
        "iter": 1000,
        "ks": 256,
        "ts": 64,
        "mode": "ccm",
        "cipher": "aes",
        "salt": sjcl.codec.bytes.toBits(salt),
        "ct": sjcl.codec.bytes.toBits(cryptedPart)
    };

    try {
        var password = rsa.decrypt(keys[rsa_hash]);
        var om = sjcl.decrypt(password, aesmsg);
        //var inflate = new Zlib.RawInflate(om);
        var plain = pako.inflateRaw(om);
        container.status = 'OK';
        container.message = JSON.parse(utf8ArrToStr(plain));
        return container;
    } catch (e) {
        console.log(e);
        return false;
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
            '    <div class="hidbord_msg"><p id="identi" style="text-align: center;"></p>'+
            '        <form name="loginform">'+
            '            <p  style="text-align: center;">'+
            '                    Password: <input name="passwd" type="text" value="" size=10> Magic number:'+
            '                    <input name="magik_num" type="text" value="" size=10>'+
            '                    <input type="button" value="log in" id="do_login">'+
            '            </p>'+
            '        </form></div>'+

            '    <div class="hidbord_msg"><p id="identi" style="text-align: center;"></p>'+
            '            <p  style="text-align: center;">'+
            '                    Steg Password: <input name="steg_pwd" type="text" value="desu" size=10 id="steg_pwd">'+
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


            '    </div>'+
            '    <div class="hidbord_head">'+
            '        <img alt="Moshi moshi!" title="Moshi moshi!" src="' + desudesuicon +'" width="64" style="float:left;" class="hidbord_clickable" id="hidbord_headicon">'+
            '        <h3 class="hidbord_clickable" style="text-shadow: 0 1px 0 #fff;">'+
                        '<span style="color: #900">De</span>'+
                        '<span style="color: #090">su</span> '+
                        '<span style="color: #900">De</span>'+
                        '<span style="color: #090">su</span> Talk!</h3>'+
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
            '.hidbord_main { z-index: 1000; color: #800000 !important; font-size: medium !important; font-family: calibri; position: fixed; bottom: 25px; right: 25px; box-shadow: 0 0 10px #999; display: block; width: 650px; border: 3px solid #fff; border-radius: 5px; background-color: rgb(217,225,229); overflow: hidden; top: 25px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAEAgMAAADUn3btAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gQIFQEfWioE/wAAAAlQTFRF0Njc2eHl////72WY8QAAAAFiS0dEAmYLfGQAAAAQSURBVAgdY2BlEGEIYHAEAAHAAKtr/oOEAAAAAElFTkSuQmCC); } '+
            '.hidbord_maincontent{ padding: 5px; overflow-y: scroll; overflow-x: hidden; position: absolute; top: 65px; width: 640px; bottom: 28px; } '+
            '.hidbord_head{ height: 64px; border-bottom: 1px solid #fff; box-shadow: 0 0 10px #000; position: absolute; top: 0; left: 0; right: 0; text-align: center; background-color: rgb(217,225,229); } '+
            '.hidbord_head h3{ margin-top: 5px; padding-left: 0; font-family: comic sans ms; font-style: italic; font-size: x-large; } '+
            '.hidbord_nav{ position: absolute; bottom: 0; margin: auto; width: 370px; left: 0; right: 0; } '+
            '.hidbord_nav div{ display: inline-block; background: #eee; width: 120px; } '+
            '.hidbord_nav .active{ background: #fff; box-shadow: 0 0 5px #999; } '+
            '.hidbord_msg { font-family: calibri; display: block; border-right: 1px solid #999; border-bottom: 1px solid #999; border-left: 1px solid #fafafa; border-top: 1px solid #fafafa; margin: 2px 10px 10px 2px; background-color: #fafafa; padding: 5px; word-wrap: break-word;} '+
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
            '.hidbord_popup {z-index: 2000; font-size: medium !important; font-family: calibri; color: #800000 !important;}');
    
    //Highlight.js
    injectCSS('.hljs { display: block; padding: 0.5em; background: #002b36; color: #839496; } .hljs-comment, .hljs-template_comment, .diff .hljs-header, .hljs-doctype, .hljs-pi, .lisp .hljs-string, .hljs-javadoc { color: #586e75; }  .hljs-keyword, .hljs-winutils, .method, .hljs-addition, .css .hljs-tag, .hljs-request, .hljs-status, .nginx .hljs-title { color: #859900; }  .hljs-number, .hljs-command, .hljs-string, .hljs-tag .hljs-value, .hljs-rules .hljs-value, .hljs-phpdoc, .tex .hljs-formula, .hljs-regexp, .hljs-hexcolor, .hljs-link_url { color: #2aa198; }  .hljs-title, .hljs-localvars, .hljs-chunk, .hljs-decorator, .hljs-built_in, .hljs-identifier, .vhdl .hljs-literal, .hljs-id, .css .hljs-function { color: #268bd2; }  .hljs-attribute, .hljs-variable, .lisp .hljs-body, .smalltalk .hljs-number, .hljs-constant, .hljs-class .hljs-title, .hljs-parent, .haskell .hljs-type, .hljs-link_reference { color: #b58900; }  .hljs-preprocessor, .hljs-preprocessor .hljs-keyword, .hljs-pragma, .hljs-shebang, .hljs-symbol, .hljs-symbol .hljs-string, .diff .hljs-change, .hljs-special, .hljs-attr_selector, .hljs-subst, .hljs-cdata, .clojure .hljs-title, .css .hljs-pseudo, .hljs-header { color: #cb4b16; }  .hljs-deletion, .hljs-important { color: #dc322f; }  .hljs-link_label { color: #6c71c4; } .tex .hljs-formula { background: #073642; } ');
    
    $('body').append(ui);

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
            ssSet((useGlobalContacts?'':boardHostName) + 'magic_desu_contacts', JSON.stringify(contacts), contactsInLocalStorage);
            render_contact();
        }else{
            useGlobalContacts = false;
            render_contact();
        }
    });

    $('#hidboard_option_autoscanison').on('change', function() {
        ssSet(boardHostName + 'autoscanDefault', !!$('#hidboard_option_autoscanison').attr('checked'));
    });

    if ("n" in rsaProfile) {
        $('#identi').html(rsa_hash).identicon5({
            rotate: true,
            size: 64
        });
        $('#identi').append('<br/><br/><i style="color: #090;">'+rsa_hash+'</i>');
        $('#pub_key_info').val(linebrk(rsa.n.toString(16), 64));
    }

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
            txt = wkbmrk(msg.txt.msg);        
        } else {
            txt = '<p><strong style="color: #f00; font-size: x-large;">NOT FOR YOU! CAN\'T BE DECODED!</strong></p>';
        }

        msgTimeTxt = dateToStr(msgDate);

        person = getContactHTML(msg.keyid, msg.pubkey);

        var code = '<div class="hidbord_msg" id="msg_' + msg.id + '" style="margin: 0;">'+
                   '    <div style="overflow: hidden" class="hidbord_msg_header" >'+ 
                   '<span style="background: #fff;" class="idntcn2">' + msg.keyid + '</span>&nbsp;' + person +
                   ' <i style="color: #999;">(' + msgTimeTxt + ') <span href="javascript:;" class="hidbord_mnu_reply hidbord_clickable">#'+msg.id.substr(0, 8)+'</span></i>'+
                   '    </div>'+
                   '    <hr style="clear:both;">'+
                   '    <div style="overflow: hidden;"><img src="'+msg.thumb+'" class="hidbord_post_img hidbord_clickable" style="max-width: 150px; max-height:150px; float: left; padding: 5px 15px 5px 5px;"/>' + txt + '</div>'+
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
        txt = wkbmrk(msg.txt.msg);        
    } else {
        txt = '<p><strong style="color: #f00; font-size: x-large;">NOT FOR YOU! CAN\'T BE DECODED!</strong></p>';
    }

    for (i = 0; i < msg.to.length; i++) {
        recipients += '<span style="background: #fff;" class="idntcn2">' + msg.to[i] + '</span>&nbsp;' + getContactHTML(msg.to[i]) + '; ';
    }

    msgTimeTxt = dateToStr(msgDate);

    person = getContactHTML(msg.keyid, msg.pubkey);

    var code = '<div class="hidbord_msg hidbord_msg_new" id="msg_' + msg.id + '">'+
            '    <div class="hidbord_mnu"><a href="javascript:;" id="hidbord_mnu_info">info</a> <a href="javascript:;" class="hidbord_mnu_replydirect">direct</a> <a href="javascript:;" class="hidbord_mnu_reply">reply</a></div>'+
            '    <div class="hidbord_msg_header hidbord_hidden" >'+
            '        <div style="float:left; width:40px; background: #fff;" class="idntcn">' + msg.keyid + '</div>'+
            '        <div style="float:left;padding-left: 5px;">' + person + ' <i style="color: #999;">(' + msgTimeTxt + ')  <span href="javascript:;" class="hidbord_mnu_reply hidbord_clickable">#'+msg.id.substr(0, 8)+'</span></i>'+
            '            <br/><i style="color: #090; font-size: x-small;" class="hidbord_clickable hidbord_usr_reply" alt="'+msg.keyid+'">' + msg.keyid + '</i>'+
            '        </div>'+
            '        <div style="clear: both; padding: 5px;"><strong>Sent to:</strong> ' + recipients + '</div>'+
            '    </div>'+
            '    <div style="overflow: hidden" class="hidbord_msg_header" >'+ 
            '<span style="background: #fff;" class="idntcn2">' + msg.keyid + '</span>&nbsp;' + person +
            ' <i style="color: #999;">(' + msgTimeTxt + ') <span href="javascript:;" class="hidbord_mnu_reply hidbord_clickable">#'+msg.id.substr(0, 8)+'</span></i>'+
            '    </div>'+
            '    <hr style="clear:both;">'+
            '    <div style="overflow: hidden;"><img src="'+thumb+'" class="hidbord_post_img hidbord_clickable" style="max-width: 150px; max-height:150px; float: left; padding: 5px 15px 5px 5px;"/>' + txt + '</div>'+
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

    new_messages++;
    $('#hidbord_notify_counter').text(new_messages).show();

};

var process_images = [];

var read_old_messages = function() {
	"use strict";

    if (process_images.length !== 0) {
        process_images = [];
        $('#hidbord_btn_getold').val('Get old messages');
        return true;
    }
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

        if (url.indexOf('?') == -1 && url.match(/\.jpe?g$/)) process_images.push([url, $(e).attr('src'), post_id]);
    });

//    console.log(process_images);
    $('#hidbord_btn_getold').val('Stop fetch! ['+process_images.length+']');
    setTimeout(process_olds, 0);//500 + Math.round(500 * Math.random()));
};

var process_olds = function() {
	"use strict";

    var jpgURL;

    if (process_images.length > 0) {
        jpgURL = process_images.pop();

        if (process_images.length !== 0) {
            $('#hidbord_btn_getold').val('Stop fetch! ['+process_images.length+']');
            //setTimeout(process_olds, 0); //500 + Math.round(500 * Math.random()));
            processJpgUrl(jpgURL[0], jpgURL[1], jpgURL[2], function(){setTimeout(process_olds, 0);});
        }else{
            $('#hidbord_btn_getold').val('Get old messages');
            processJpgUrl(jpgURL[0], jpgURL[1], jpgURL[2]);
        }
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
                    img.src = "data:image/Jpeg;base64," +arrayBufferDataUri(e.target.result);
                }else{
                    container_data = jpegClean(e.target.result);
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

    if(rsa_hash == usr_id){
        alert('So ronery?');
        return false;
    }

    if(!(usr_id in contacts)){
        alert('Unknow contact!');
        return false;
    }

    console.log(usr_id);
    showReplyform('#msg_' + msg_id, '>>' + msg_id);
    $('#hidbord_cont_type').val('direct').trigger('change');
    $('#hidbord_cont_direct').val(usr_id);
};



var replytoUsr = function(e) {
	"use strict";

    var msg_id = $(e.target).closest('.hidbord_msg').first().attr('id').replace(/^msg\_/, '');
    var usr_id = $(e.target).attr('alt').replace(/[^0-9a-f]/, '');
//    console.log(msg_id);
    showReplyform('#msg_' + msg_id, '{' + usr_id + '}');
};

var do_preview_popup = function(e) {
    "use strict";


    var img_thumb = '';

    if (container_image){
        img_thumb = '<img src="'+container_image+'" class="hidbord_post_img hidbord_clickable" style="max-width: 150px; max-height:150px; float: left; padding: 5px 15px 5px 5px;"/>';
    }else{
        img_thumb = '<div style="width: 148px; height:148px; float: left; margin: 5px 15px 5px 5px; border: 2px dashed #999;"/>';
    }

    $('#prev_popup').remove();
    var txt = '<div class="hidbord_msg" style="box-shadow: 0 0 10px #555;overflow-y: scroll;" alt="msg_preview">' + img_thumb + wkbmrk($('#hidbord_reply_text').val()) + '</div>';

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

var do_imgpreview_popup = function(e) {
	"use strict";

    $('#file_selector').remove();
    if (!container_image) return;
    var txt = '<div class="hidbord_msg" style="box-shadow: 0 0 10px #555;"><img style="max-width: 200px; max-height: 200px;" src="' + container_image + '"></div>';
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
            '  <div style="float:left; width:40px; background: #fff;" class="idntcn">' + rsa_hash + '</div>' +
            '  <div style="float:left;padding-left: 5px;">' +
            '    <strong style="color: #090; font-style: italic">Me</strong><br/>' +
            '    <i style="color: #090; font-size: x-small;">' + rsa_hash + '</i>' +
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
            '      <textarea style="max-width: none; margin: 2px; width: 580px; height: 136px; resize: vertical; background-image: none; background-position: 0% 0%; background-repeat: repeat repeat;" id="hidbord_reply_text"></textarea>  ' +
            '      <div style="width: 590px;">' +
            '        <input type="button" value="crypt and send" id="do_encode">  ' +
            '        <span style="float: right;"><a href="javascript:;" id="hidbordform_preview" alt="msg_preview">message preview</a></span>  ' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>');
        replyForm = $('#hidbord_replyform');

//        console.log('ddd', $('#hidbord_replyform'));


        $('#hidbord_cont_type').on('change',function(){
            if($('#hidbord_cont_type').val()=='direct'){
                $('#hidbord_cont_direct').show();
            }else{
                $('#hidbord_cont_direct').hide();
            }
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
            quotedText = window.getSelection().toString();
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
                    quotedText = '> ' + quotedText.replace(/\n/gm, "\n> ") + "\n";
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
    $(msg_id).after($('#hidbord_replyform'));
    $('#hidbord_replyform').show();

    $('.hidbord_thread')[0].scrollTop += $('#hidbord_replyform').offset().top - window.scrollY - $(window).height() + $('#hidbord_replyform').height() + 50;

    if (textInsert) {
        insertInto(document.getElementById('hidbord_reply_text'), textInsert + "\n");
    }
};

var insertInto = function(textarea, text) {
	"use strict";

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
    "gin":  '<img style="vertical-align:bottom;" alt="Suigintou"   title="Suigintou"   src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUA2XIAAAAICBggICAgIECAIEBAQEBQUHDAQIBgYICYmKCwsLDwqIDIyMj40KDg4OD48LD///9BGnM4AAAAAXRSTlMAQObYZgAAAT1JREFUOI2Vk4GOhCAMRLdQrFQF+f+fvWnxorC3m1xXSTbzOi1YXq9/BCG+ymlNgT5RRAE6CFbVPxAKzAJdmDkY8q4LiySx1ZGJIDYCTxBnZgIGWnsoGwSPEdBW79AggUOgp15ra850I+g6AD3RIG1GalAeAfVf7ateFuEBZJN+VX+sy3D3kHPNWOGRHcg6bIOyqRvtMNozoecJAGFAKiXv+FSbOWoeDwImbT0LIrWGnmbA2jjTabGmhhIg6BVvPQIorp8pndWBTDcQ44M4S1VUjBqXGAcLKj0sOUNdniUiNsLcp6HrC/IfBCyEjtQMEIrQ4zJ9ccZQNJsa6gSaGI7qIJsUvBgEaahB80lZA4fPbOACYgY2gXc7RKyC343pJE0/2kUc/HYxPMlTvct34NrI5fXx9l3Vvt1gJ4Z/P5jeENMXpCU2AAAAAElFTkSuQmCC"/>',
    "kana": '<img style="vertical-align:bottom;" alt="Kanaria"     title="Kanaria"     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAARVBMVEUAAFsAAADAACBAMBAoSDiwOBggYEDwIGBwYDBYeGjggDBQwFDgoIDQsCCwsLCouLDwwJDIyMj/0HDw4KD46EDg//D///+VBTP8AAAAAXRSTlMAQObYZgAAAUJJREFUOE99k4uOhCAMRadOdQWtDg/7/5+6t5DJgMNuY2LMOS0F6uPRBr3jMQ7yMUa1Z6jUXO9Vow4UIudOCwcFBpSeV1oMNzAabkYsBnW8M7x12pagyp1rjLYEuYuNXRcU1VNDLFvxb4PAmGu65qxZgu/WIKu6786ckGUSCFaiEZwJRdFt+pm2ULroBN5TKoqiQsBZgH96cHwyUapKALd9oI3PNiAcJiS7DvATZ9ULjo/FhJ3owNddsEV0MyEtqm7HxcWOm5BKhbQtml749DC62+JXqhUWcGbMju+447eRXuiA/V04zaiB0/ousNLJ8vRrFrF8cLpxTBzlNecsln+fawhKJDqriBDL90gTBHCMaxaSnAdDTxJmDyMIPdc1DGrMoGTGoTrgxZjJDHsPuPWBRCjz33/m0wiNFygCNd5/0fNfXQoanYE5/8sAAAAASUVORK5CYII="/>',
    "desu": '<img style="vertical-align:bottom;" alt="Suiseiseki"  title="Suiseiseki"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAP1BMVEUAAAAAAAAgICAgcDBQUFBQsFBwMBiAACCgUCiggFCwsLDIACDIyMjQgEjQwJDgoIDwwJDw4KD/0JD//9D///+7VQVaAAAAAXRSTlMAQObYZgAAATVJREFUOMuNk41uwyAQg+s7uEFG29Dy/s86HyRr/qTNrRIp/mIfQdxu/xc+urZLKW2oXCDI1MPFOxmc/MfbfxRvOU8Hwv336mde8jTtCPTkXuCYh5SCrZ9zurtSeuQO7Qnk1/0jh7zkQ4BvpxflbkeMdRsCy3OnrHNObOYEU50x/p82MnypvzMQsNWvg0is2MyYjADgfn12wrY+CaM5wX3fqjPAnUo2fVUXMHnlAeAY1r47oK0ZKy+AOhKiNg57BpLNdSRovV8AJLAQdeaKrgDDPMQGGDfv0GHQElqLqkStf5hDhEJIxKjdT8kOBAokBBGBRif4PXcEZqjEoKqsaqPDdgBUI9WJucI7dr7w/bgSFCP2myEaQwgLIYTsuIgeEFxCX85nC0tAzxBcn10JSwT+Ot+bZz9jXxTtNyme7QAAAABJRU5ErkJggg=="/>',
    "boku": '<img style="vertical-align:bottom;" alt="Souseiseki"  title="Souseiseki"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEUAee4AAAAQEECAACAgICAgIHDIACBAMBBgMBhAQLBQUFAgcDCQUCjAgEhQsFDgoICwsLDwwJDIyMj/0JDw4KD///+Dfr0YAAAAAXRSTlMAQObYZgAAARJJREFUOE9909F2gyAQBFBGoQEKVRH+/1e7u0Qrce2c+BDnCpizMeYMjhg1QIzRSlQDa0+gEVgXQnAcXcCdoJNPARePdDICPuCxvRUzDeBaH2aacOnlbqakdBp7AfQ9pX1PWdIN8CfAPTd533e50ihAvYCu+Ep++M1BN+RuOlUXJ0ieALCQ8Cz444f39Mh+xUKCH3wvYS4BLbJ+17r4BVhxB7xL+6kk6twab/TRM6i0AuVrVgGJTfo6zzVnf+t5ibeo2+0AAui1th5lfRFwLbZGgwO1p5GBbbEUFmq/wlmZC5SmDXWBCzZEnsuiCwKBB1dE1QRv3kf74c8FbpwArTZyDt7psTd4cYVWHlfAxf2Xsf8FygMQo/h1y8kAAAAASUVORK5CYII="/>',
    "dawa": '<img style="vertical-align:bottom;" alt="Shinku"      title="Shinku"      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAP1BMVEVQFIoAAABIABiAACDAACBAMBAIQBggSJAgcDBwYDDgQFCgcBCAkOhQsFDgoIDQsCCwsLDwwJDw4KD46ED///9aMd6UAAAAAXRSTlMAQObYZgAAAUtJREFUOMt9k9F2wyAMQ5HJElZG3AD//62ToUsgW6fTvKCLbWrbuSa85N4Iy+I9f/KGMZ82JbJ0Zg4HL/TUFGUJgabnHYwBaBeqESkEsZwDQL+81AlmFMGQ4fSN8ImEXAEIoAxSCzGWQEIrz08i+hCYYgRKqVqrIe0TAxAxAuaQqe0TH/wMaAd+IigBgQ5AnIEiwccRIBEjMACr1xmAxif23TAYvYqiTO9EfG457/sOPFH0wb7egfqVTVutseiqv4G8NeBrIxBWuBFgTMQj9whbjkrfDUWa704iH82fCf5rrP/o0j5LPDwJNCKkR0g2e3YOC4srBe9bC1PiXDbfbIwpIhYEnzhG4pcegT3B9Urs5thg28DiVdjQC5hvsuU48vzMFqH7fTks+61XDv1+Z9pAT0RfjguRXsRt/z4/WF9P9PcSo72uce4/3exvFKwVxEkt3zgAAAAASUVORK5CYII="/>',
    "hina": '<img style="vertical-align:bottom;" alt="Hinaichigo"  title="Hinaichigo"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUAAAAAAACAACDAACCwIECwOCBQYCDgUIDggED/gLCgsCDgoICwsLDwwJDIyMj/4Fjw4KD///9e6IJJAAAAAXRSTlMAQObYZgAAAShJREFUOMt9k4GSgyAMRF0hBioK+f+fvQ1Or5bSZoQR97GBMVmWZwDLz4DqhWBOQnN2BAQVX/QcNSlf8oRA9O/9YcSETyBGjVmjO2j8IODfEqfYDcgOBGKqPVL00BFAMmr1yVCv6Y1ArZbMHOnD9RFwhYz14as3AukC6v8YAUkTQPDSISLADZCa5GUBwkkK9t0xh4X7b0mYgR5la23fdye4W4YcBOzRPDYrqDLoTChoWwceG6/pKeR+CBI42uWwNQLiHvd74kW0w29AaPhdPP9xBaQ7jCWBrKuG4PUAt/8sGYWuOQcvyYm8YKV+rtSRp0W7s2yDBS/YPCeY/LTTRc3rgWndWzECawhl1jooZwFOs7OUeRNShU/la5MiuAI7vwK4cT/7/G31B+WEEQqkVXnPAAAAAElFTkSuQmCC"/>',
    "kira": '<img style="vertical-align:bottom;" alt="Kirakishou"  title="Kirakishou"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEUTkgAAAABQUBBQYCCgSGCQUNDgYMCgoCDAkPCgsCDgoLCwsLDwqID/oPDIyMj40KD/4OD/4P/48LD////MJAo5AAAAAXRSTlMAQObYZgAAASxJREFUOI2Nk4FyhCAMRG8l0jOKBvj/f20CnorUtnF0RvexZAFfr/8W8Ie+zrjUTwaOWax4cmvuEbBMIlSRvJKg002RWuz0Hb1+1MS4WUBuxcRoDPLpXwG0gEjmnHlvw+4OsK/K5HL3AFfg2YFYnKWbPkDbg74Q0Ti604FagACmeR0XItsI0pS4rIPBCqz5nZZlAWYU4LRQAwPG9Z20hpy1I12n1kIBN5qevgaLSXwlag9b0dMwpA4oMQ4ibVS2QnAPiq0W6fBicEmqkxAWH0JIaYERqoq0OQJiijEgRJ2v6Aew6z74GIIvhF62nB9Ada96jL5Y7AS1Z0oHemOCEluy5PdjG712oaNtFsvUHjojNt0HbJoEddb+1yhK9I//ICLKMzwRu2flfqtW/wYUCRWXoJ+EwQAAAABJRU5ErkJggg=="/>',
    "bara": '<img style="vertical-align:bottom;" alt="Barasuishou" title="Barasuishou" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEUT7wEAAAAwEGBIIHBgKMhQUBBQUJCQUNCQYP+goCDAkPCoqOCwsLDwqIDIyMjwwMD40KDg4P/48LD///+GZc+gAAAAAXRSTlMAQObYZgAAAS1JREFUOI2Nk4F6gyAMhD1kYTNIhbz/uy4BXQ3d+i1W+un9XA6VZflvAe9VxIBbzbqUDDBXK2YOcYb0sqs0kBhyEfFE14eF/qPMDpd0I3yIWmfCdQDL038UHKEGwiJ8xrATBA9UzlUZ6acB7FvYtOwcPEBsd9XkAtgBekFE9qzyBZAHTKSMfadRlQkVd4PFgI/W9hxDzOjA00INDJCv1loJMRRNRDxZKNDUoclniMUy8J0YGY5mJVLaC9CXcRGtHRbS6YMAjlGk07vBtNAtpbDpsG2wBvyyjoStJQVSUsD0+tPk1Ndk+oqkFnrY47yAU9cG+kM6CfIfXdcf5oF0NAs1ffsw/dGJddWXZ0Gcrs4PQAlLKdb1ZfdoDh229ZeddTVBH9Nfu/ScN7h35fVvme0V/RH1ka4AAAAASUVORK5CYII="/>',
    "meat": '<img style="vertical-align:bottom;" alt="MEAT" title="MEAT" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUAAAAaGhpQPCeEQCJlSzJ9XD6xVCx9ZDWJYTjsT0/vcHC1km//jIzTvpbqtrb/xsbu5Mj///8aEgzRAAAAAXRSTlMAQObYZgAAAQ5JREFUOMvdkkF2AjEMQzGBzEjR2OL+l+0ilGYecIFqGf2nJLYul/+pmPpue+oLEnalqLQdH/1KEUA66xMRnj5M5gcgXIRI0gTfI8IlAiJZIt4inj4gKUXiDES4JJIklKLIFYiwi5QkkVkktV4RdiUAzfyqmsNav0/O90GSCKadC5AkHvaxkyIFgHaP5fnC43rbtmMXCYqks8Ua4OsYwDbuxCTcF0CAtwEA406SoOov4BJOYDvGAMZtJwGw3FagCGzHcYzbXe/+JeQksW23631PklluJ6Cnk0+5spytt3XOvacrCYCyneqtnxfVO/LZxWm386ajd0z1Lvbe2ltVXgAotg+NjvgFOr8V/qXz+Q8AHxMKCeGrDgAAAABJRU5ErkJggg=="/>',
    "cake": '<img style="vertical-align:bottom;" alt="Delicious Cake" title="Delicious Cake" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAArlBMVEUAAAAAAAA4GRQ5GRRBHBtUIyqlJRSmJhSmJxV5OS6oLx1rQDerNiXUOyt9VkzZQzXfQzXiQzXlQzTmQzTmRDXnRDXjRziNal+rZETkVkesaEnhbF3CejXCejbEfDXAe2u4gmf+b125g2n/cF6th3iuiHmviXrChHSxjX63loe7m4zhn1jkolnlo1r/mrrWtqfSvK3Tvq/Vv7DVwLHe0L3e0rvg08Dz89j09Nn09O0mCXiuAAAAAXRSTlMAQObYZgAAASZJREFUOE/tkNlWwzAMRGuDG/ZdEDZDG8TasA1Q+/9/DElN2oTTwxtvzEsSzc2M7MHgX3+jEMLvPtFwKREaFamaLCNCMqGoqvpwGMKq933Aw3wUVNOk2PhIqU94oCxZESY64vsveeU+wTGWqStGH4h1HVkCzPxkhtR1CU8UBSh5ap6qoB4gC5JCU/Gv1vdIgKoDOEmgVIH45gx32zQiUsC1toOPSRKAdzrFye7ouSKtgDPEIWdfR0Po+AE7+wbIkjlDCMfytFPIBng5x9YBVZrm5cfMzgKQvSLCvD4Ca5vqw2dYhAHaosjkctycktkDTYcRDfJ03dpzX5bQMh1nv3Ixxq26ATbk2TEWyJs3obUXN6E3nDvSlrk9Q2ZQu6F+D37KdbSYfgM6VkDcNJNUdAAAAABJRU5ErkJggg=="/>',
    "tea":  '<img style="vertical-align:bottom;" alt="A cup of Tea" title="A cup of Tea" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAM1BMVEX4WBgAAQBDRUL/GgBUVVN2eHX/ZDSHiYb/mAD/mTSpq6i5u7j/zAbKzMnc3tvt7+v+//ytxHIVAAAAAXRSTlMAQObYZgAAAPpJREFUOMvtktluxDAIRU1qjx3wwv9/bS/eklTpQ997pZESnSMGCM7958+hld+orrw4ndaV7jy5aillC3juZbZFhi9jvGisVWgJgpyfldNeVSJCU2DgrytQWA/nZAlF653DUJWb4Cij813jc6LnBO42p5qydT5TmFM6qM4C2IGPtcAoGc1lAU3xqJtra81juJyS/SQnZo5e4uY2uh/j23zSufdcKs0Cl7F5YPCqNP+hmSHTuHi7BIR9EBM4BnDDbQisQymF/Qhw55i3N8FFV5V7bB1z0ZH7kp4UOO6vDYVvi7TjQKf3myFC24+En1eH6wlxJbwfLtHbWX8D14kVhZIALoUAAAAASUVORK5CYII="/>',
    "sarcasm": '<img style="vertical-align:bottom;" alt="SARCASM!" title="SARCASM!" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAuBAMAAACoiUZDAAAALVBMVEUAAAAQEBD/AACDWgCUWhAAqQB7e3vmpFLetFL/1Ur23ove3t7/5qT/7r3///8MKkFGAAAAAXRSTlMAQObYZgAAAbpJREFUKM9t071q40AQB/BdzrjWkIOVD/wKByaF7wIJDhEYN3mEAz3CgmBwKdwsBhciAjOQxqQxgXR5iQM1xk0QbBO4KuBnuP3QSrr4pvzt/PdjkBjrV8qGEftcKUvPEYbAzpGfNzKeDtN/IDHFI+jlB7NkSbRN+sYW5WNVEVHSj9Kiqqrfprc7aEAleSTZhWlBPk5FiyP6as9xFXXpm9PcHm6WAnIq3r+/EmUns5S1W3q8//PrleQsbFncfNxNHG5vyxYfYPw2yk4f89uyOV9QUdS6XokkyYpwKYHy+qif1rmJlLT1m3KcaK3Vpl6h7F56oS3qN4Giw2/a1Q7lyGDz/LHHHITpxAbjF2smjfNli3xjcW8RMSADo/scfTU4WIJSufiERADBMApjMhUM2snb2rostJOnnnq75A1Si18ux0C91swOievrA/VbAWZssrnSPwPKKaLAjMWxevGn04TGR4uScaXWR2cP+kIfLEYW1c59HoUZygEz96RYqedpg/UKpu5JNi/QYW1Swt8+Vusnd229N7OSfh6mdefRNEL4wEDlAHOUJp33fh+zPAD4odT5bxSr//xvPNhf1sQYU21hKHsAAAAASUVORK5CYII="/>',
    "elita": '<span style="font-family: comic sans ms; font-style: italic;"><font style="font-size:32px" color="#ff0000">YA</font><font style="font-size:33px"> </font><font style="font-size:33px" color="#ff2b00">e</font><font style="font-size:26px" color="#ff5500">l</font><font style="font-size:40px" color="#ff8000">i</font><font style="font-size:20px" color="#ffaa00">t</font><font style="font-size:33px" color="#ffd500">a</font><font style="font-size:31px" color="#ffff00">,</font><font style="font-size:45px"> </font><font style="font-size:41px" color="#d4ff00">a</font><font style="font-size:25px"> </font><font style="font-size:28px" color="#aaff00">t</font><font style="font-size:33px" color="#7fff00">i</font><font style="font-size:50px"> </font><font style="font-size:21px" color="#55ff00">h</font><font style="font-size:24px" color="#2aff00">u</font><font style="font-size:47px" color="#00ff00">i</font><font style="font-size:39px" color="#00ff2b">!</font><font style="font-size:33px"> </font><font style="font-size:22px" color="#00ff55">S</font><font style="font-size:46px" color="#00ff80">a</font><font style="font-size:27px" color="#00ffaa">s</font><font style="font-size:41px" color="#00ffd5">a</font><font style="font-size:48px" color="#00ffff">i</font><font style="font-size:27px"> </font><font style="font-size:44px" color="#00d4ff">r</font><font style="font-size:38px" color="#00aaff">a</font><font style="font-size:47px" color="#007fff">i</font><font style="font-size:24px" color="#0055ff">n</font><font style="font-size:27px" color="#002aff">b</font><font style="font-size:39px" color="#0000ff">ow</font><font style="font-size:37px" color="#2400ff">,</font><font style="font-size:40px"> </font><font style="font-size:21px" color="#4900ff">l</font><font style="font-size:44px" color="#6d00ff">a</font><font style="font-size:29px" color="#9200ff">l</font><font style="font-size:21px" color="#b600ff">k</font><font style="font-size:26px" color="#db00ff">a</font><font style="font-size:41px" color="#ff00ff">!</font></span>'
};

var wkbmrk = function(in_text) {
    "use strict";

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
        needbr = "<br/>\n";

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
            res += lines[i].replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;') + "\n";
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

        needbr = "<br/>\n";

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

    return str.replace(/([a-z]{3,6}\:\/\/[^\s\"><\`]+)($|\s)/ig, function(match, a, b) {
        return '`URL:' + safeStr2B64(a+b) + '`';
    });
};

var restoreURLs = function(str) {
    "use strict";

    return str.replace(/`URL:([a-zA-Z0-9\/\#\=]+)`/ig, function(match, a) {
        var txt, url, b = '';
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
        return '<a href="' + url + '" target="_blank">' + safe_tags(txt) + '</a> ' + b;
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
        return '<code>' + safeB642Str(a).replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;') + '</code>';
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
        "++": ["<span style='color: #ee0000; font-style: italic;'>", "</span>"]
    }, res;

    // fix escaping of %
    tags[_spoilerTag] = ['<span class="hidbord_spoiler">', "</span>"];

    res = tag === null ? saveURLs(saveCode(str)).replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;') : str;

    res = res.replace(/(\*\*|\*|\_\_|\_|\%\%|\-\-|\+\+)(([^\s]|[^\s].*?[^\s])[\*\_]?)\1/g, parseOneLineTags);

    if (tag === null) {
        //imoticons
        res = res.replace(/\[(gin|kana|desu|boku|dawa|hina|kira|bara|meat|cake|tea|sarcasm|elita)\]/ig, function(match, a, b) {
            return imoticons[a.toLowerCase()];
        });

        //reflinks
        res = res.replace(/(\&gt\;\&gt\;)([0-9a-f]{64})/ig, function(match, a, b) {
            return '<a href="javascript:;" alt="' + b + '" class="hidbord_msglink">&gt;&gt;' + b.substr(0, 8) + '</a>';
        });

        //userlinks
        res = res.replace(/(\{)([0-9a-f]{40})\}/ig, function(match, a, b) {
            return '<span style="background: #fff; vertical-align:middle;" class="idntcn2">' + b + '</span>&nbsp;' + getContactHTML(b);
        });
    }

    res = tag === null ? restoreCode(restoreURLs(res)) : res;

    if (tag !== null) {
        return tags[tag][0] + res + tags[tag][1];
    } else {
        return res;
    }
};

var isDobro = !!document.URL.match(/\/dobrochan\.[comrgu]+\//);
var is4chan = !!document.URL.match(/\/boards\.4chan\.org\//);

var autoscanNewJpegs = true;
var contactsInLocalStorage = false;
var useGlobalContacts = false;

contactsInLocalStorage = ssGet('magic_desu_contactsInLocalStorage');
useGlobalContacts = ssGet('magic_desu_useGlobalContacts');

if(useGlobalContacts && contactsInLocalStorage) useGlobalContacts = false;

autoscanNewJpegs = ssGet(boardHostName + 'autoscanDefault');

if(autoscanNewJpegs !== false && autoscanNewJpegs !== true){
    autoscanNewJpegs = true;
    ssSet(boardHostName + 'autoscanDefault', true);
}
console.log(contactsInLocalStorage, autoscanNewJpegs);

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

        processJpgUrl(jpgURL, thumbURL, post_id);
    }
};

var ArrayPrototypeEvery = Array.prototype.every;

$(function($) {
    "use strict";

    Array.prototype.every = ArrayPrototypeEvery;

    sjcl.random.startCollectors();

    var insertAnimation = ' hidbordNodeInserted{from{clip:rect(1px,auto,auto,auto);}to{clip:rect(0px,auto,auto,auto);}}',
        animationTrigger = '{animation-duration:0.001s;-o-animation-duration:0.001s;-ms-animation-duration:0.001s;-moz-animation-duration:0.001s;-webkit-animation-duration:0.001s;animation-name:hidbordNodeInserted;-o-animation-name:hidbordNodeInserted;-ms-animation-name:hidbordNodeInserted;-moz-animation-name:hidbordNodeInserted;-webkit-animation-name:hidbordNodeInserted;}';

    $('<style type="text/css">@keyframes ' + insertAnimation + '@-moz-keyframes ' + insertAnimation + '@-webkit-keyframes ' +
        insertAnimation + '@-ms-keyframes ' + insertAnimation + '@-o-keyframes ' + insertAnimation +
        'a[href*=jpg] img, a[href*=jpeg] img ' + animationTrigger + '</style>').appendTo('head');

    setTimeout(function() {
        $(document).bind('animationstart', jpegInserted).bind('MSAnimationStart', jpegInserted).bind('webkitAnimationStart', jpegInserted);
    }, 10000);

    if (ssGet(boardHostName + 'magic_desu_numbers')) {
        rsaProfile = ssGet(boardHostName + 'magic_desu_numbers');
        rsa.setPrivateEx(rsaProfile.n, '10001', rsaProfile.d, rsaProfile.p, rsaProfile.q, rsaProfile.dmp1, rsaProfile.dmq1, rsaProfile.coeff);
        rsa_hash = hex_sha1(rsaProfile.n);
        rsa_hashB64 = hex2b64(rsa_hash);
    }

    inject_ui();

    if (ssGet(boardHostName + 'magic_desu_pwd')) {
        $('#steg_pwd').val(ssGet(boardHostName + 'magic_desu_pwd'));
    }

    render_contact();

});

})();
