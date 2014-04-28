// ==UserScript==
// @name         DesuDesuTalk
// @namespace    udp://desushelter/*
// @version      0.1.3
// @description  Write something useful!
// @match        http://dobrochan.com/*/res/*
// @include      http://dobrochan.com/*/res/*
// @match        http://dobrochan.ru/*/res/*
// @include      http://dobrochan.ru/*/res/*
// @match        http://dobrochan.org/*/res/*
// @include      http://dobrochan.org/*/res/*
// @match        http://inach.org/*/res/*
// @include      http://inach.org/*/res/*
// @match        https://8chan.co/*/res/*
// @include      https://8chan.co/*/res/*
// @match        http://2ch.hk/*/res/*
// @include      http://2ch.hk/*/res/*
// @match        http://iichan.hk/*/res/*
// @include      http://iichan.hk/*/res/*
// @match        http://2-ch.su/*/res/*
// @include      http://2-ch.su/*/res/*
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
/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function() {'use strict';var n=void 0,u=!0,aa=this;function ba(e,d){var c=e.split("."),f=aa;!(c[0]in f)&&f.execScript&&f.execScript("var "+c[0]);for(var a;c.length&&(a=c.shift());)!c.length&&d!==n?f[a]=d:f=f[a]?f[a]:f[a]={}};var C="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array&&"undefined"!==typeof DataView;function K(e,d){this.index="number"===typeof d?d:0;this.d=0;this.buffer=e instanceof(C?Uint8Array:Array)?e:new (C?Uint8Array:Array)(32768);if(2*this.buffer.length<=this.index)throw Error("invalid index");this.buffer.length<=this.index&&ca(this)}function ca(e){var d=e.buffer,c,f=d.length,a=new (C?Uint8Array:Array)(f<<1);if(C)a.set(d);else for(c=0;c<f;++c)a[c]=d[c];return e.buffer=a}
K.prototype.a=function(e,d,c){var f=this.buffer,a=this.index,b=this.d,k=f[a],m;c&&1<d&&(e=8<d?(L[e&255]<<24|L[e>>>8&255]<<16|L[e>>>16&255]<<8|L[e>>>24&255])>>32-d:L[e]>>8-d);if(8>d+b)k=k<<d|e,b+=d;else for(m=0;m<d;++m)k=k<<1|e>>d-m-1&1,8===++b&&(b=0,f[a++]=L[k],k=0,a===f.length&&(f=ca(this)));f[a]=k;this.buffer=f;this.d=b;this.index=a};K.prototype.finish=function(){var e=this.buffer,d=this.index,c;0<this.d&&(e[d]<<=8-this.d,e[d]=L[e[d]],d++);C?c=e.subarray(0,d):(e.length=d,c=e);return c};
var ga=new (C?Uint8Array:Array)(256),M;for(M=0;256>M;++M){for(var R=M,S=R,ha=7,R=R>>>1;R;R>>>=1)S<<=1,S|=R&1,--ha;ga[M]=(S<<ha&255)>>>0}var L=ga;function ja(e){this.buffer=new (C?Uint16Array:Array)(2*e);this.length=0}ja.prototype.getParent=function(e){return 2*((e-2)/4|0)};ja.prototype.push=function(e,d){var c,f,a=this.buffer,b;c=this.length;a[this.length++]=d;for(a[this.length++]=e;0<c;)if(f=this.getParent(c),a[c]>a[f])b=a[c],a[c]=a[f],a[f]=b,b=a[c+1],a[c+1]=a[f+1],a[f+1]=b,c=f;else break;return this.length};
ja.prototype.pop=function(){var e,d,c=this.buffer,f,a,b;d=c[0];e=c[1];this.length-=2;c[0]=c[this.length];c[1]=c[this.length+1];for(b=0;;){a=2*b+2;if(a>=this.length)break;a+2<this.length&&c[a+2]>c[a]&&(a+=2);if(c[a]>c[b])f=c[b],c[b]=c[a],c[a]=f,f=c[b+1],c[b+1]=c[a+1],c[a+1]=f;else break;b=a}return{index:e,value:d,length:this.length}};function ka(e,d){this.e=ma;this.f=0;this.input=C&&e instanceof Array?new Uint8Array(e):e;this.c=0;d&&(d.lazy&&(this.f=d.lazy),"number"===typeof d.compressionType&&(this.e=d.compressionType),d.outputBuffer&&(this.b=C&&d.outputBuffer instanceof Array?new Uint8Array(d.outputBuffer):d.outputBuffer),"number"===typeof d.outputIndex&&(this.c=d.outputIndex));this.b||(this.b=new (C?Uint8Array:Array)(32768))}var ma=2,T=[],U;
for(U=0;288>U;U++)switch(u){case 143>=U:T.push([U+48,8]);break;case 255>=U:T.push([U-144+400,9]);break;case 279>=U:T.push([U-256+0,7]);break;case 287>=U:T.push([U-280+192,8]);break;default:throw"invalid literal: "+U;}
ka.prototype.h=function(){var e,d,c,f,a=this.input;switch(this.e){case 0:c=0;for(f=a.length;c<f;){d=C?a.subarray(c,c+65535):a.slice(c,c+65535);c+=d.length;var b=d,k=c===f,m=n,g=n,p=n,v=n,x=n,l=this.b,h=this.c;if(C){for(l=new Uint8Array(this.b.buffer);l.length<=h+b.length+5;)l=new Uint8Array(l.length<<1);l.set(this.b)}m=k?1:0;l[h++]=m|0;g=b.length;p=~g+65536&65535;l[h++]=g&255;l[h++]=g>>>8&255;l[h++]=p&255;l[h++]=p>>>8&255;if(C)l.set(b,h),h+=b.length,l=l.subarray(0,h);else{v=0;for(x=b.length;v<x;++v)l[h++]=
b[v];l.length=h}this.c=h;this.b=l}break;case 1:var q=new K(C?new Uint8Array(this.b.buffer):this.b,this.c);q.a(1,1,u);q.a(1,2,u);var t=na(this,a),w,da,z;w=0;for(da=t.length;w<da;w++)if(z=t[w],K.prototype.a.apply(q,T[z]),256<z)q.a(t[++w],t[++w],u),q.a(t[++w],5),q.a(t[++w],t[++w],u);else if(256===z)break;this.b=q.finish();this.c=this.b.length;break;case ma:var B=new K(C?new Uint8Array(this.b.buffer):this.b,this.c),ra,J,N,O,P,Ia=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],W,sa,X,ta,ea,ia=Array(19),
ua,Q,fa,y,va;ra=ma;B.a(1,1,u);B.a(ra,2,u);J=na(this,a);W=oa(this.j,15);sa=pa(W);X=oa(this.i,7);ta=pa(X);for(N=286;257<N&&0===W[N-1];N--);for(O=30;1<O&&0===X[O-1];O--);var wa=N,xa=O,F=new (C?Uint32Array:Array)(wa+xa),r,G,s,Y,E=new (C?Uint32Array:Array)(316),D,A,H=new (C?Uint8Array:Array)(19);for(r=G=0;r<wa;r++)F[G++]=W[r];for(r=0;r<xa;r++)F[G++]=X[r];if(!C){r=0;for(Y=H.length;r<Y;++r)H[r]=0}r=D=0;for(Y=F.length;r<Y;r+=G){for(G=1;r+G<Y&&F[r+G]===F[r];++G);s=G;if(0===F[r])if(3>s)for(;0<s--;)E[D++]=0,
H[0]++;else for(;0<s;)A=138>s?s:138,A>s-3&&A<s&&(A=s-3),10>=A?(E[D++]=17,E[D++]=A-3,H[17]++):(E[D++]=18,E[D++]=A-11,H[18]++),s-=A;else if(E[D++]=F[r],H[F[r]]++,s--,3>s)for(;0<s--;)E[D++]=F[r],H[F[r]]++;else for(;0<s;)A=6>s?s:6,A>s-3&&A<s&&(A=s-3),E[D++]=16,E[D++]=A-3,H[16]++,s-=A}e=C?E.subarray(0,D):E.slice(0,D);ea=oa(H,7);for(y=0;19>y;y++)ia[y]=ea[Ia[y]];for(P=19;4<P&&0===ia[P-1];P--);ua=pa(ea);B.a(N-257,5,u);B.a(O-1,5,u);B.a(P-4,4,u);for(y=0;y<P;y++)B.a(ia[y],3,u);y=0;for(va=e.length;y<va;y++)if(Q=
e[y],B.a(ua[Q],ea[Q],u),16<=Q){y++;switch(Q){case 16:fa=2;break;case 17:fa=3;break;case 18:fa=7;break;default:throw"invalid code: "+Q;}B.a(e[y],fa,u)}var ya=[sa,W],za=[ta,X],I,Aa,Z,la,Ba,Ca,Da,Ea;Ba=ya[0];Ca=ya[1];Da=za[0];Ea=za[1];I=0;for(Aa=J.length;I<Aa;++I)if(Z=J[I],B.a(Ba[Z],Ca[Z],u),256<Z)B.a(J[++I],J[++I],u),la=J[++I],B.a(Da[la],Ea[la],u),B.a(J[++I],J[++I],u);else if(256===Z)break;this.b=B.finish();this.c=this.b.length;break;default:throw"invalid compression type";}return this.b};
function qa(e,d){this.length=e;this.g=d}
var Fa=function(){function e(a){switch(u){case 3===a:return[257,a-3,0];case 4===a:return[258,a-4,0];case 5===a:return[259,a-5,0];case 6===a:return[260,a-6,0];case 7===a:return[261,a-7,0];case 8===a:return[262,a-8,0];case 9===a:return[263,a-9,0];case 10===a:return[264,a-10,0];case 12>=a:return[265,a-11,1];case 14>=a:return[266,a-13,1];case 16>=a:return[267,a-15,1];case 18>=a:return[268,a-17,1];case 22>=a:return[269,a-19,2];case 26>=a:return[270,a-23,2];case 30>=a:return[271,a-27,2];case 34>=a:return[272,
a-31,2];case 42>=a:return[273,a-35,3];case 50>=a:return[274,a-43,3];case 58>=a:return[275,a-51,3];case 66>=a:return[276,a-59,3];case 82>=a:return[277,a-67,4];case 98>=a:return[278,a-83,4];case 114>=a:return[279,a-99,4];case 130>=a:return[280,a-115,4];case 162>=a:return[281,a-131,5];case 194>=a:return[282,a-163,5];case 226>=a:return[283,a-195,5];case 257>=a:return[284,a-227,5];case 258===a:return[285,a-258,0];default:throw"invalid length: "+a;}}var d=[],c,f;for(c=3;258>=c;c++)f=e(c),d[c]=f[2]<<24|
f[1]<<16|f[0];return d}(),Ga=C?new Uint32Array(Fa):Fa;
function na(e,d){function c(a,c){var b=a.g,d=[],f=0,e;e=Ga[a.length];d[f++]=e&65535;d[f++]=e>>16&255;d[f++]=e>>24;var g;switch(u){case 1===b:g=[0,b-1,0];break;case 2===b:g=[1,b-2,0];break;case 3===b:g=[2,b-3,0];break;case 4===b:g=[3,b-4,0];break;case 6>=b:g=[4,b-5,1];break;case 8>=b:g=[5,b-7,1];break;case 12>=b:g=[6,b-9,2];break;case 16>=b:g=[7,b-13,2];break;case 24>=b:g=[8,b-17,3];break;case 32>=b:g=[9,b-25,3];break;case 48>=b:g=[10,b-33,4];break;case 64>=b:g=[11,b-49,4];break;case 96>=b:g=[12,b-
65,5];break;case 128>=b:g=[13,b-97,5];break;case 192>=b:g=[14,b-129,6];break;case 256>=b:g=[15,b-193,6];break;case 384>=b:g=[16,b-257,7];break;case 512>=b:g=[17,b-385,7];break;case 768>=b:g=[18,b-513,8];break;case 1024>=b:g=[19,b-769,8];break;case 1536>=b:g=[20,b-1025,9];break;case 2048>=b:g=[21,b-1537,9];break;case 3072>=b:g=[22,b-2049,10];break;case 4096>=b:g=[23,b-3073,10];break;case 6144>=b:g=[24,b-4097,11];break;case 8192>=b:g=[25,b-6145,11];break;case 12288>=b:g=[26,b-8193,12];break;case 16384>=
b:g=[27,b-12289,12];break;case 24576>=b:g=[28,b-16385,13];break;case 32768>=b:g=[29,b-24577,13];break;default:throw"invalid distance";}e=g;d[f++]=e[0];d[f++]=e[1];d[f++]=e[2];var k,m;k=0;for(m=d.length;k<m;++k)l[h++]=d[k];t[d[0]]++;w[d[3]]++;q=a.length+c-1;x=null}var f,a,b,k,m,g={},p,v,x,l=C?new Uint16Array(2*d.length):[],h=0,q=0,t=new (C?Uint32Array:Array)(286),w=new (C?Uint32Array:Array)(30),da=e.f,z;if(!C){for(b=0;285>=b;)t[b++]=0;for(b=0;29>=b;)w[b++]=0}t[256]=1;f=0;for(a=d.length;f<a;++f){b=
m=0;for(k=3;b<k&&f+b!==a;++b)m=m<<8|d[f+b];g[m]===n&&(g[m]=[]);p=g[m];if(!(0<q--)){for(;0<p.length&&32768<f-p[0];)p.shift();if(f+3>=a){x&&c(x,-1);b=0;for(k=a-f;b<k;++b)z=d[f+b],l[h++]=z,++t[z];break}0<p.length?(v=Ha(d,f,p),x?x.length<v.length?(z=d[f-1],l[h++]=z,++t[z],c(v,0)):c(x,-1):v.length<da?x=v:c(v,0)):x?c(x,-1):(z=d[f],l[h++]=z,++t[z])}p.push(f)}l[h++]=256;t[256]++;e.j=t;e.i=w;return C?l.subarray(0,h):l}
function Ha(e,d,c){var f,a,b=0,k,m,g,p,v=e.length;m=0;p=c.length;a:for(;m<p;m++){f=c[p-m-1];k=3;if(3<b){for(g=b;3<g;g--)if(e[f+g-1]!==e[d+g-1])continue a;k=b}for(;258>k&&d+k<v&&e[f+k]===e[d+k];)++k;k>b&&(a=f,b=k);if(258===k)break}return new qa(b,d-a)}
function oa(e,d){var c=e.length,f=new ja(572),a=new (C?Uint8Array:Array)(c),b,k,m,g,p;if(!C)for(g=0;g<c;g++)a[g]=0;for(g=0;g<c;++g)0<e[g]&&f.push(g,e[g]);b=Array(f.length/2);k=new (C?Uint32Array:Array)(f.length/2);if(1===b.length)return a[f.pop().index]=1,a;g=0;for(p=f.length/2;g<p;++g)b[g]=f.pop(),k[g]=b[g].value;m=Ja(k,k.length,d);g=0;for(p=b.length;g<p;++g)a[b[g].index]=m[g];return a}
function Ja(e,d,c){function f(a){var b=g[a][p[a]];b===d?(f(a+1),f(a+1)):--k[b];++p[a]}var a=new (C?Uint16Array:Array)(c),b=new (C?Uint8Array:Array)(c),k=new (C?Uint8Array:Array)(d),m=Array(c),g=Array(c),p=Array(c),v=(1<<c)-d,x=1<<c-1,l,h,q,t,w;a[c-1]=d;for(h=0;h<c;++h)v<x?b[h]=0:(b[h]=1,v-=x),v<<=1,a[c-2-h]=(a[c-1-h]/2|0)+d;a[0]=b[0];m[0]=Array(a[0]);g[0]=Array(a[0]);for(h=1;h<c;++h)a[h]>2*a[h-1]+b[h]&&(a[h]=2*a[h-1]+b[h]),m[h]=Array(a[h]),g[h]=Array(a[h]);for(l=0;l<d;++l)k[l]=c;for(q=0;q<a[c-1];++q)m[c-
1][q]=e[q],g[c-1][q]=q;for(l=0;l<c;++l)p[l]=0;1===b[c-1]&&(--k[0],++p[c-1]);for(h=c-2;0<=h;--h){t=l=0;w=p[h+1];for(q=0;q<a[h];q++)t=m[h+1][w]+m[h+1][w+1],t>e[l]?(m[h][q]=t,g[h][q]=d,w+=2):(m[h][q]=e[l],g[h][q]=l,++l);p[h]=0;1===b[h]&&f(h)}return k}
function pa(e){var d=new (C?Uint16Array:Array)(e.length),c=[],f=[],a=0,b,k,m,g;b=0;for(k=e.length;b<k;b++)c[e[b]]=(c[e[b]]|0)+1;b=1;for(k=16;b<=k;b++)f[b]=a,a+=c[b]|0,a<<=1;b=0;for(k=e.length;b<k;b++){a=f[e[b]];f[e[b]]+=1;m=d[b]=0;for(g=e[b];m<g;m++)d[b]=d[b]<<1|a&1,a>>>=1}return d};ba("Zlib.RawDeflate",ka);ba("Zlib.RawDeflate.prototype.compress",ka.prototype.h);var Ka={NONE:0,FIXED:1,DYNAMIC:ma},V,La,$,Ma;if(Object.keys)V=Object.keys(Ka);else for(La in V=[],$=0,Ka)V[$++]=La;$=0;for(Ma=V.length;$<Ma;++$)La=V[$],ba("Zlib.RawDeflate.CompressionType."+La,Ka[La]);}).call(this); //@ sourceMappingURL=rawdeflate.min.js.map

/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function() {'use strict';var l=this;function p(b,e){var a=b.split("."),c=l;!(a[0]in c)&&c.execScript&&c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)!a.length&&void 0!==e?c[d]=e:c=c[d]?c[d]:c[d]={}};var q="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array&&"undefined"!==typeof DataView;function t(b){var e=b.length,a=0,c=Number.POSITIVE_INFINITY,d,f,g,h,k,m,r,n,s,J;for(n=0;n<e;++n)b[n]>a&&(a=b[n]),b[n]<c&&(c=b[n]);d=1<<a;f=new (q?Uint32Array:Array)(d);g=1;h=0;for(k=2;g<=a;){for(n=0;n<e;++n)if(b[n]===g){m=0;r=h;for(s=0;s<g;++s)m=m<<1|r&1,r>>=1;J=g<<16|n;for(s=m;s<d;s+=k)f[s]=J;++h}++g;h<<=1;k<<=1}return[f,a,c]};function u(b,e){this.g=[];this.h=32768;this.c=this.f=this.d=this.k=0;this.input=q?new Uint8Array(b):b;this.l=!1;this.i=v;this.q=!1;if(e||!(e={}))e.index&&(this.d=e.index),e.bufferSize&&(this.h=e.bufferSize),e.bufferType&&(this.i=e.bufferType),e.resize&&(this.q=e.resize);switch(this.i){case w:this.a=32768;this.b=new (q?Uint8Array:Array)(32768+this.h+258);break;case v:this.a=0;this.b=new (q?Uint8Array:Array)(this.h);this.e=this.v;this.m=this.s;this.j=this.t;break;default:throw Error("invalid inflate mode");
}}var w=0,v=1;
u.prototype.u=function(){for(;!this.l;){var b=x(this,3);b&1&&(this.l=!0);b>>>=1;switch(b){case 0:var e=this.input,a=this.d,c=this.b,d=this.a,f=e.length,g=void 0,h=void 0,k=c.length,m=void 0;this.c=this.f=0;if(a+1>=f)throw Error("invalid uncompressed block header: LEN");g=e[a++]|e[a++]<<8;if(a+1>=f)throw Error("invalid uncompressed block header: NLEN");h=e[a++]|e[a++]<<8;if(g===~h)throw Error("invalid uncompressed block header: length verify");if(a+g>e.length)throw Error("input buffer is broken");switch(this.i){case w:for(;d+
g>c.length;){m=k-d;g-=m;if(q)c.set(e.subarray(a,a+m),d),d+=m,a+=m;else for(;m--;)c[d++]=e[a++];this.a=d;c=this.e();d=this.a}break;case v:for(;d+g>c.length;)c=this.e({o:2});break;default:throw Error("invalid inflate mode");}if(q)c.set(e.subarray(a,a+g),d),d+=g,a+=g;else for(;g--;)c[d++]=e[a++];this.d=a;this.a=d;this.b=c;break;case 1:this.j(y,z);break;case 2:A(this);break;default:throw Error("unknown BTYPE: "+b);}}return this.m()};
var B=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],C=q?new Uint16Array(B):B,D=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],E=q?new Uint16Array(D):D,F=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],G=q?new Uint8Array(F):F,H=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],I=q?new Uint16Array(H):H,K=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,
13],L=q?new Uint8Array(K):K,M=new (q?Uint8Array:Array)(288),N,O;N=0;for(O=M.length;N<O;++N)M[N]=143>=N?8:255>=N?9:279>=N?7:8;var y=t(M),P=new (q?Uint8Array:Array)(30),Q,R;Q=0;for(R=P.length;Q<R;++Q)P[Q]=5;var z=t(P);function x(b,e){for(var a=b.f,c=b.c,d=b.input,f=b.d,g=d.length,h;c<e;){if(f>=g)throw Error("input buffer is broken");a|=d[f++]<<c;c+=8}h=a&(1<<e)-1;b.f=a>>>e;b.c=c-e;b.d=f;return h}
function S(b,e){for(var a=b.f,c=b.c,d=b.input,f=b.d,g=d.length,h=e[0],k=e[1],m,r;c<k&&!(f>=g);)a|=d[f++]<<c,c+=8;m=h[a&(1<<k)-1];r=m>>>16;b.f=a>>r;b.c=c-r;b.d=f;return m&65535}
function A(b){function e(a,b,c){var e,d=this.p,f,g;for(g=0;g<a;)switch(e=S(this,b),e){case 16:for(f=3+x(this,2);f--;)c[g++]=d;break;case 17:for(f=3+x(this,3);f--;)c[g++]=0;d=0;break;case 18:for(f=11+x(this,7);f--;)c[g++]=0;d=0;break;default:d=c[g++]=e}this.p=d;return c}var a=x(b,5)+257,c=x(b,5)+1,d=x(b,4)+4,f=new (q?Uint8Array:Array)(C.length),g,h,k,m;for(m=0;m<d;++m)f[C[m]]=x(b,3);if(!q){m=d;for(d=f.length;m<d;++m)f[C[m]]=0}g=t(f);h=new (q?Uint8Array:Array)(a);k=new (q?Uint8Array:Array)(c);b.p=0;
b.j(t(e.call(b,a,g,h)),t(e.call(b,c,g,k)))}u.prototype.j=function(b,e){var a=this.b,c=this.a;this.n=b;for(var d=a.length-258,f,g,h,k;256!==(f=S(this,b));)if(256>f)c>=d&&(this.a=c,a=this.e(),c=this.a),a[c++]=f;else{g=f-257;k=E[g];0<G[g]&&(k+=x(this,G[g]));f=S(this,e);h=I[f];0<L[f]&&(h+=x(this,L[f]));c>=d&&(this.a=c,a=this.e(),c=this.a);for(;k--;)a[c]=a[c++-h]}for(;8<=this.c;)this.c-=8,this.d--;this.a=c};
u.prototype.t=function(b,e){var a=this.b,c=this.a;this.n=b;for(var d=a.length,f,g,h,k;256!==(f=S(this,b));)if(256>f)c>=d&&(a=this.e(),d=a.length),a[c++]=f;else{g=f-257;k=E[g];0<G[g]&&(k+=x(this,G[g]));f=S(this,e);h=I[f];0<L[f]&&(h+=x(this,L[f]));c+k>d&&(a=this.e(),d=a.length);for(;k--;)a[c]=a[c++-h]}for(;8<=this.c;)this.c-=8,this.d--;this.a=c};
u.prototype.e=function(){var b=new (q?Uint8Array:Array)(this.a-32768),e=this.a-32768,a,c,d=this.b;if(q)b.set(d.subarray(32768,b.length));else{a=0;for(c=b.length;a<c;++a)b[a]=d[a+32768]}this.g.push(b);this.k+=b.length;if(q)d.set(d.subarray(e,e+32768));else for(a=0;32768>a;++a)d[a]=d[e+a];this.a=32768;return d};
u.prototype.v=function(b){var e,a=this.input.length/this.d+1|0,c,d,f,g=this.input,h=this.b;b&&("number"===typeof b.o&&(a=b.o),"number"===typeof b.r&&(a+=b.r));2>a?(c=(g.length-this.d)/this.n[2],f=258*(c/2)|0,d=f<h.length?h.length+f:h.length<<1):d=h.length*a;q?(e=new Uint8Array(d),e.set(h)):e=h;return this.b=e};
u.prototype.m=function(){var b=0,e=this.b,a=this.g,c,d=new (q?Uint8Array:Array)(this.k+(this.a-32768)),f,g,h,k;if(0===a.length)return q?this.b.subarray(32768,this.a):this.b.slice(32768,this.a);f=0;for(g=a.length;f<g;++f){c=a[f];h=0;for(k=c.length;h<k;++h)d[b++]=c[h]}f=32768;for(g=this.a;f<g;++f)d[b++]=e[f];this.g=[];return this.buffer=d};
u.prototype.s=function(){var b,e=this.a;q?this.q?(b=new Uint8Array(e),b.set(this.b.subarray(0,e))):b=this.b.subarray(0,e):(this.b.length>e&&(this.b.length=e),b=this.b);return this.buffer=b};p("Zlib.RawInflate",u);p("Zlib.RawInflate.prototype.decompress",u.prototype.u);var T={ADAPTIVE:v,BLOCK:w},U,V,W,X;if(Object.keys)U=Object.keys(T);else for(V in U=[],W=0,T)U[W++]=V;W=0;for(X=U.length;W<X;++W)V=U[W],p("Zlib.RawInflate.BufferType."+V,T[V]);}).call(this); //@ sourceMappingURL=rawinflate.min.js.map

var hljs=new function(){function j(v){return v.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function t(v){return v.nodeName.toLowerCase()}function h(w,x){var v=w&&w.exec(x);return v&&v.index==0}function r(w){var v=(w.className+" "+(w.parentNode?w.parentNode.className:"")).split(/\s+/);v=v.map(function(x){return x.replace(/^lang(uage)?-/,"")});return v.filter(function(x){return i(x)||x=="no-highlight"})[0]}function o(x,y){var v={};for(var w in x){v[w]=x[w]}if(y){for(var w in y){v[w]=y[w]}}return v}function u(x){var v=[];(function w(y,z){for(var A=y.firstChild;A;A=A.nextSibling){if(A.nodeType==3){z+=A.nodeValue.length}else{if(t(A)=="br"){z+=1}else{if(A.nodeType==1){v.push({event:"start",offset:z,node:A});z=w(A,z);v.push({event:"stop",offset:z,node:A})}}}}return z})(x,0);return v}function q(w,y,C){var x=0;var F="";var z=[];function B(){if(!w.length||!y.length){return w.length?w:y}if(w[0].offset!=y[0].offset){return(w[0].offset<y[0].offset)?w:y}return y[0].event=="start"?w:y}function A(H){function G(I){return" "+I.nodeName+'="'+j(I.value)+'"'}F+="<"+t(H)+Array.prototype.map.call(H.attributes,G).join("")+">"}function E(G){F+="</"+t(G)+">"}function v(G){(G.event=="start"?A:E)(G.node)}while(w.length||y.length){var D=B();F+=j(C.substr(x,D[0].offset-x));x=D[0].offset;if(D==w){z.reverse().forEach(E);do{v(D.splice(0,1)[0]);D=B()}while(D==w&&D.length&&D[0].offset==x);z.reverse().forEach(A)}else{if(D[0].event=="start"){z.push(D[0].node)}else{z.pop()}v(D.splice(0,1)[0])}}return F+j(C.substr(x))}function m(y){function v(z){return(z&&z.source)||z}function w(A,z){return RegExp(v(A),"m"+(y.cI?"i":"")+(z?"g":""))}function x(D,C){if(D.compiled){return}D.compiled=true;D.k=D.k||D.bK;if(D.k){var z={};function E(G,F){if(y.cI){F=F.toLowerCase()}F.split(" ").forEach(function(H){var I=H.split("|");z[I[0]]=[G,I[1]?Number(I[1]):1]})}if(typeof D.k=="string"){E("keyword",D.k)}else{Object.keys(D.k).forEach(function(F){E(F,D.k[F])})}D.k=z}D.lR=w(D.l||/\b[A-Za-z0-9_]+\b/,true);if(C){if(D.bK){D.b="\\b("+D.bK.split(" ").join("|")+")\\b"}if(!D.b){D.b=/\B|\b/}D.bR=w(D.b);if(!D.e&&!D.eW){D.e=/\B|\b/}if(D.e){D.eR=w(D.e)}D.tE=v(D.e)||"";if(D.eW&&C.tE){D.tE+=(D.e?"|":"")+C.tE}}if(D.i){D.iR=w(D.i)}if(D.r===undefined){D.r=1}if(!D.c){D.c=[]}var B=[];D.c.forEach(function(F){if(F.v){F.v.forEach(function(G){B.push(o(F,G))})}else{B.push(F=="self"?D:F)}});D.c=B;D.c.forEach(function(F){x(F,D)});if(D.starts){x(D.starts,C)}var A=D.c.map(function(F){return F.bK?"\\.?("+F.b+")\\.?":F.b}).concat([D.tE,D.i]).map(v).filter(Boolean);D.t=A.length?w(A.join("|"),true):{exec:function(F){return null}};D.continuation={}}x(y)}function c(S,L,J,R){function v(U,V){for(var T=0;T<V.c.length;T++){if(h(V.c[T].bR,U)){return V.c[T]}}}function z(U,T){if(h(U.eR,T)){return U}if(U.eW){return z(U.parent,T)}}function A(T,U){return !J&&h(U.iR,T)}function E(V,T){var U=M.cI?T[0].toLowerCase():T[0];return V.k.hasOwnProperty(U)&&V.k[U]}function w(Z,X,W,V){var T=V?"":b.classPrefix,U='<span class="'+T,Y=W?"":"</span>";U+=Z+'">';return U+X+Y}function N(){if(!I.k){return j(C)}var T="";var W=0;I.lR.lastIndex=0;var U=I.lR.exec(C);while(U){T+=j(C.substr(W,U.index-W));var V=E(I,U);if(V){H+=V[1];T+=w(V[0],j(U[0]))}else{T+=j(U[0])}W=I.lR.lastIndex;U=I.lR.exec(C)}return T+j(C.substr(W))}function F(){if(I.sL&&!f[I.sL]){return j(C)}var T=I.sL?c(I.sL,C,true,I.continuation.top):e(C);if(I.r>0){H+=T.r}if(I.subLanguageMode=="continuous"){I.continuation.top=T.top}return w(T.language,T.value,false,true)}function Q(){return I.sL!==undefined?F():N()}function P(V,U){var T=V.cN?w(V.cN,"",true):"";if(V.rB){D+=T;C=""}else{if(V.eB){D+=j(U)+T;C=""}else{D+=T;C=U}}I=Object.create(V,{parent:{value:I}})}function G(T,X){C+=T;if(X===undefined){D+=Q();return 0}var V=v(X,I);if(V){D+=Q();P(V,X);return V.rB?0:X.length}var W=z(I,X);if(W){var U=I;if(!(U.rE||U.eE)){C+=X}D+=Q();do{if(I.cN){D+="</span>"}H+=I.r;I=I.parent}while(I!=W.parent);if(U.eE){D+=j(X)}C="";if(W.starts){P(W.starts,"")}return U.rE?0:X.length}if(A(X,I)){throw new Error('Illegal lexeme "'+X+'" for mode "'+(I.cN||"<unnamed>")+'"')}C+=X;return X.length||1}var M=i(S);if(!M){throw new Error('Unknown language: "'+S+'"')}m(M);var I=R||M;var D="";for(var K=I;K!=M;K=K.parent){if(K.cN){D+=w(K.cN,D,true)}}var C="";var H=0;try{var B,y,x=0;while(true){I.t.lastIndex=x;B=I.t.exec(L);if(!B){break}y=G(L.substr(x,B.index-x),B[0]);x=B.index+y}G(L.substr(x));for(var K=I;K.parent;K=K.parent){if(K.cN){D+="</span>"}}return{r:H,value:D,language:S,top:I}}catch(O){if(O.message.indexOf("Illegal")!=-1){return{r:0,value:j(L)}}else{throw O}}}function e(y,x){x=x||b.languages||Object.keys(f);var v={r:0,value:j(y)};var w=v;x.forEach(function(z){if(!i(z)){return}var A=c(z,y,false);A.language=z;if(A.r>w.r){w=A}if(A.r>v.r){w=v;v=A}});if(w.language){v.second_best=w}return v}function g(v){if(b.tabReplace){v=v.replace(/^((<[^>]+>|\t)+)/gm,function(w,z,y,x){return z.replace(/\t/g,b.tabReplace)})}if(b.useBR){v=v.replace(/\n/g,"<br>")}return v}function p(z){var y=b.useBR?z.innerHTML.replace(/\n/g,"").replace(/<br>|<br [^>]*>/g,"\n").replace(/<[^>]*>/g,""):z.textContent;var A=r(z);if(A=="no-highlight"){return}var v=A?c(A,y,true):e(y);var w=u(z);if(w.length){var x=document.createElementNS("http://www.w3.org/1999/xhtml","pre");x.innerHTML=v.value;v.value=q(w,u(x),y)}v.value=g(v.value);z.innerHTML=v.value;z.className+=" hljs "+(!A&&v.language||"");z.result={language:v.language,re:v.r};if(v.second_best){z.second_best={language:v.second_best.language,re:v.second_best.r}}}var b={classPrefix:"hljs-",tabReplace:null,useBR:false,languages:undefined};function s(v){b=o(b,v)}function l(){if(l.called){return}l.called=true;var v=document.querySelectorAll("pre code");Array.prototype.forEach.call(v,p)}function a(){addEventListener("DOMContentLoaded",l,false);addEventListener("load",l,false)}var f={};var n={};function d(v,x){var w=f[v]=x(this);if(w.aliases){w.aliases.forEach(function(y){n[y]=v})}}function k(){return Object.keys(f)}function i(v){return f[v]||f[n[v]]}this.highlight=c;this.highlightAuto=e;this.fixMarkup=g;this.highlightBlock=p;this.configure=s;this.initHighlighting=l;this.initHighlightingOnLoad=a;this.registerLanguage=d;this.listLanguages=k;this.getLanguage=i;this.inherit=o;this.IR="[a-zA-Z][a-zA-Z0-9_]*";this.UIR="[a-zA-Z_][a-zA-Z0-9_]*";this.NR="\\b\\d+(\\.\\d+)?";this.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";this.BNR="\\b(0b[01]+)";this.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";this.BE={b:"\\\\[\\s\\S]",r:0};this.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[this.BE]};this.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[this.BE]};this.PWM={b:/\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/};this.CLCM={cN:"comment",b:"//",e:"$",c:[this.PWM]};this.CBCM={cN:"comment",b:"/\\*",e:"\\*/",c:[this.PWM]};this.HCM={cN:"comment",b:"#",e:"$",c:[this.PWM]};this.NM={cN:"number",b:this.NR,r:0};this.CNM={cN:"number",b:this.CNR,r:0};this.BNM={cN:"number",b:this.BNR,r:0};this.CSSNM={cN:"number",b:this.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0};this.RM={cN:"regexp",b:/\//,e:/\/[gim]*/,i:/\n/,c:[this.BE,{b:/\[/,e:/\]/,r:0,c:[this.BE]}]};this.TM={cN:"title",b:this.IR,r:0};this.UTM={cN:"title",b:this.UIR,r:0}}();hljs.registerLanguage("bash",function(b){var a={cN:"variable",v:[{b:/\$[\w\d#@][\w\d_]*/},{b:/\$\{(.*?)\}/}]};var d={cN:"string",b:/"/,e:/"/,c:[b.BE,a,{cN:"variable",b:/\$\(/,e:/\)/,c:[b.BE]}]};var c={cN:"string",b:/'/,e:/'/};return{aliases:["sh","zsh"],l:/-?[a-z\.]+/,k:{keyword:"if then else elif fi for break continue while in do done exit return set declare case esac export exec",literal:"true false",built_in:"printf echo read cd pwd pushd popd dirs let eval unset typeset readonly getopts source shopt caller type hash bind help sudo",operator:"-ne -eq -lt -gt -f -d -e -s -l -a"},c:[{cN:"shebang",b:/^#![^\n]+sh\s*$/,r:10},{cN:"function",b:/\w[\w\d_]*\s*\(\s*\)\s*\{/,rB:true,c:[b.inherit(b.TM,{b:/\w[\w\d_]*/})],r:0},b.HCM,b.NM,d,c,a]}});hljs.registerLanguage("brainfuck",function(b){var a={cN:"literal",b:"[\\+\\-]",r:0};return{aliases:["bf"],c:[{cN:"comment",b:"[^\\[\\]\\.,\\+\\-<> \r\n]",rE:true,e:"[\\[\\]\\.,\\+\\-<> \r\n]",r:0},{cN:"title",b:"[\\[\\]]",r:0},{cN:"string",b:"[\\.,]",r:0},{b:/\+\+|\-\-/,rB:true,c:[a]},a]}});hljs.registerLanguage("clojure",function(l){var e={built_in:"def cond apply if-not if-let if not not= = &lt; < > &lt;= <= >= == + / * - rem quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last drop-while while intern condp case reduced cycle split-at split-with repeat replicate iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter monitor-exit defmacro defn defn- macroexpand macroexpand-1 for dosync and or when when-not when-let comp juxt partial sequence memoize constantly complement identity assert peek pop doto proxy defstruct first rest cons defprotocol cast coll deftype defrecord last butlast sigs reify second ffirst fnext nfirst nnext defmulti defmethod meta with-meta ns in-ns create-ns import refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize"};var f="[a-zA-Z_0-9\\!\\.\\?\\-\\+\\*\\/\\<\\=\\>\\&\\#\\$';]+";var a="[\\s:\\(\\{]+\\d+(\\.\\d+)?";var d={cN:"number",b:a,r:0};var j=l.inherit(l.QSM,{i:null});var o={cN:"comment",b:";",e:"$",r:0};var n={cN:"collection",b:"[\\[\\{]",e:"[\\]\\}]"};var c={cN:"comment",b:"\\^"+f};var b={cN:"comment",b:"\\^\\{",e:"\\}"};var h={cN:"attribute",b:"[:]"+f};var m={cN:"list",b:"\\(",e:"\\)"};var g={eW:true,k:{literal:"true false nil"},r:0};var i={k:e,l:f,cN:"title",b:f,starts:g};m.c=[{cN:"comment",b:"comment"},i,g];g.c=[m,j,c,b,o,h,n,d];n.c=[m,j,c,o,h,n,d];return{aliases:["clj"],i:/\S/,c:[o,m,{cN:"prompt",b:/^=> /,starts:{e:/\n\n|\Z/}}]}});hljs.registerLanguage("coffeescript",function(c){var b={keyword:"in if for while finally new do return else break catch instanceof throw try this switch continue typeof delete debugger super then unless until loop of by when and or is isnt not",literal:"true false null undefined yes no on off",reserved:"case default function var void with const let enum export import native __hasProp __extends __slice __bind __indexOf",built_in:"npm require console print module global window document"};var a="[A-Za-z$_][0-9A-Za-z$_]*";var f=c.inherit(c.TM,{b:a});var e={cN:"subst",b:/#\{/,e:/}/,k:b};var d=[c.BNM,c.inherit(c.CNM,{starts:{e:"(\\s*/)?",r:0}}),{cN:"string",v:[{b:/'''/,e:/'''/,c:[c.BE]},{b:/'/,e:/'/,c:[c.BE]},{b:/"""/,e:/"""/,c:[c.BE,e]},{b:/"/,e:/"/,c:[c.BE,e]}]},{cN:"regexp",v:[{b:"///",e:"///",c:[e,c.HCM]},{b:"//[gim]*",r:0},{b:"/\\S(\\\\.|[^\\n])*?/[gim]*(?=\\s|\\W|$)"}]},{cN:"property",b:"@"+a},{b:"`",e:"`",eB:true,eE:true,sL:"javascript"}];e.c=d;return{aliases:["coffee","cson","iced"],k:b,c:d.concat([{cN:"comment",b:"###",e:"###"},c.HCM,{cN:"function",b:"("+a+"\\s*=\\s*)?(\\(.*\\))?\\s*\\B[-=]>",e:"[-=]>",rB:true,c:[f,{cN:"params",b:"\\(",rB:true,c:[{b:/\(/,e:/\)/,k:b,c:["self"].concat(d)}]}]},{cN:"class",bK:"class",e:"$",i:/[:="\[\]]/,c:[{bK:"extends",eW:true,i:/[:="\[\]]/,c:[f]},f]},{cN:"attribute",b:a+":",e:":",rB:true,eE:true,r:0}])}});hljs.registerLanguage("cpp",function(a){var b={keyword:"false int float while private char catch export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const struct for static_cast|10 union namespace unsigned long throw volatile static protected bool template mutable if public friend do return goto auto void enum else break new extern using true class asm case typeid short reinterpret_cast|10 default double register explicit signed typename try this switch continue wchar_t inline delete alignof char16_t char32_t constexpr decltype noexcept nullptr static_assert thread_local restrict _Bool complex _Complex _Imaginary",built_in:"std string cin cout cerr clog stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap array shared_ptr abort abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf"};return{aliases:["c","h","c++","h++"],k:b,i:"</",c:[a.CLCM,a.CBCM,a.QSM,{cN:"string",b:"'\\\\?.",e:"'",i:"."},{cN:"number",b:"\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)"},a.CNM,{cN:"preprocessor",b:"#",e:"$",k:"if else elif endif define undef warning error line pragma",c:[{b:'include\\s*[<"]',e:'[>"]',k:"include",i:"\\n"},a.CLCM]},{cN:"stl_container",b:"\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",e:">",k:b,c:["self"]},{b:a.IR+"::"}]}});hljs.registerLanguage("cs",function(b){var a="abstract as base bool break byte case catch char checked const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual volatile void while async await ascending descending from get group into join let orderby partial select set value var where yield";return{k:a,i:/::/,c:[{cN:"comment",b:"///",e:"$",rB:true,c:[{cN:"xmlDocTag",v:[{b:"///",r:0},{b:"<!--|-->"},{b:"</?",e:">"}]}]},b.CLCM,b.CBCM,{cN:"preprocessor",b:"#",e:"$",k:"if else elif endif define undef warning error line region endregion pragma checksum"},{cN:"string",b:'@"',e:'"',c:[{b:'""'}]},b.ASM,b.QSM,b.CNM,{bK:"protected public private internal",e:/[{;=]/,k:a,c:[{bK:"class namespace interface",starts:{c:[b.TM]}},{b:b.IR+"\\s*\\(",rB:true,c:[b.TM]}]}]}});hljs.registerLanguage("css",function(a){var b="[a-zA-Z-][a-zA-Z0-9_-]*";var c={cN:"function",b:b+"\\(",rB:true,eE:true,e:"\\("};return{cI:true,i:"[=/|']",c:[a.CBCM,{cN:"id",b:"\\#[A-Za-z0-9_-]+"},{cN:"class",b:"\\.[A-Za-z0-9_-]+",r:0},{cN:"attr_selector",b:"\\[",e:"\\]",i:"$"},{cN:"pseudo",b:":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"},{cN:"at_rule",b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{cN:"at_rule",b:"@",e:"[{;]",c:[{cN:"keyword",b:/\S+/},{b:/\s/,eW:true,eE:true,r:0,c:[c,a.ASM,a.QSM,a.CSSNM]}]},{cN:"tag",b:b,r:0},{cN:"rules",b:"{",e:"}",i:"[^\\s]",r:0,c:[a.CBCM,{cN:"rule",b:"[^\\s]",rB:true,e:";",eW:true,c:[{cN:"attribute",b:"[A-Z\\_\\.\\-]+",e:":",eE:true,i:"[^\\s]",starts:{cN:"value",eW:true,eE:true,c:[c,a.CSSNM,a.QSM,a.ASM,a.CBCM,{cN:"hexcolor",b:"#[0-9A-Fa-f]+"},{cN:"important",b:"!important"}]}}]}]}]}});hljs.registerLanguage("delphi",function(b){var a="exports register file shl array record property for mod while set ally label uses raise not stored class safecall var interface or private static exit index inherited to else stdcall override shr asm far resourcestring finalization packed virtual out and protected library do xorwrite goto near function end div overload object unit begin string on inline repeat until destructor write message program with read initialization except default nil if case cdecl in downto threadvar of try pascal const external constructor type public then implementation finally published procedure";var e={cN:"comment",v:[{b:/\{/,e:/\}/,r:0},{b:/\(\*/,e:/\*\)/,r:10}]};var c={cN:"string",b:/'/,e:/'/,c:[{b:/''/}]};var d={cN:"string",b:/(#\d+)+/};var f={b:b.IR+"\\s*=\\s*class\\s*\\(",rB:true,c:[b.TM]};var g={cN:"function",bK:"function constructor destructor procedure",e:/[:;]/,k:"function constructor|10 destructor|10 procedure|10",c:[b.TM,{cN:"params",b:/\(/,e:/\)/,k:a,c:[c,d]},e]};return{cI:true,k:a,i:/("|\$[G-Zg-z]|\/\*|<\/)/,c:[e,b.CLCM,c,d,b.NM,f,g]}});hljs.registerLanguage("diff",function(a){return{aliases:["patch"],c:[{cN:"chunk",r:10,v:[{b:/^\@\@ +\-\d+,\d+ +\+\d+,\d+ +\@\@$/},{b:/^\*\*\* +\d+,\d+ +\*\*\*\*$/},{b:/^\-\-\- +\d+,\d+ +\-\-\-\-$/}]},{cN:"header",v:[{b:/Index: /,e:/$/},{b:/=====/,e:/=====$/},{b:/^\-\-\-/,e:/$/},{b:/^\*{3} /,e:/$/},{b:/^\+\+\+/,e:/$/},{b:/\*{5}/,e:/\*{5}$/}]},{cN:"addition",b:"^\\+",e:"$"},{cN:"deletion",b:"^\\-",e:"$"},{cN:"change",b:"^\\!",e:"$"}]}});hljs.registerLanguage("erlang-repl",function(a){return{k:{special_functions:"spawn spawn_link self",reserved:"after and andalso|10 band begin bnot bor bsl bsr bxor case catch cond div end fun if let not of or orelse|10 query receive rem try when xor"},c:[{cN:"prompt",b:"^[0-9]+> ",r:10},{cN:"comment",b:"%",e:"$"},{cN:"number",b:"\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)",r:0},a.ASM,a.QSM,{cN:"constant",b:"\\?(::)?([A-Z]\\w*(::)?)+"},{cN:"arrow",b:"->"},{cN:"ok",b:"ok"},{cN:"exclamation_mark",b:"!"},{cN:"function_or_atom",b:"(\\b[a-z'][a-zA-Z0-9_']*:[a-z'][a-zA-Z0-9_']*)|(\\b[a-z'][a-zA-Z0-9_']*)",r:0},{cN:"variable",b:"[A-Z][a-zA-Z0-9_']*",r:0}]}});hljs.registerLanguage("erlang",function(i){var c="[a-z'][a-zA-Z0-9_']*";var o="("+c+":"+c+"|"+c+")";var f={keyword:"after and andalso|10 band begin bnot bor bsl bzr bxor case catch cond div end fun let not of orelse|10 query receive rem try when xor",literal:"false true"};var l={cN:"comment",b:"%",e:"$"};var e={cN:"number",b:"\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)",r:0};var g={b:"fun\\s+"+c+"/\\d+"};var n={b:o+"\\(",e:"\\)",rB:true,r:0,c:[{cN:"function_name",b:o,r:0},{b:"\\(",e:"\\)",eW:true,rE:true,r:0}]};var h={cN:"tuple",b:"{",e:"}",r:0};var a={cN:"variable",b:"\\b_([A-Z][A-Za-z0-9_]*)?",r:0};var m={cN:"variable",b:"[A-Z][a-zA-Z0-9_]*",r:0};var b={b:"#"+i.UIR,r:0,rB:true,c:[{cN:"record_name",b:"#"+i.UIR,r:0},{b:"{",e:"}",r:0}]};var k={bK:"fun receive if try case",e:"end",k:f};k.c=[l,g,i.inherit(i.ASM,{cN:""}),k,n,i.QSM,e,h,a,m,b];var j=[l,g,k,n,i.QSM,e,h,a,m,b];n.c[1].c=j;h.c=j;b.c[1].c=j;var d={cN:"params",b:"\\(",e:"\\)",c:j};return{aliases:["erl"],k:f,i:"(</|\\*=|\\+=|-=|/=|/\\*|\\*/|\\(\\*|\\*\\))",c:[{cN:"function",b:"^"+c+"\\s*\\(",e:"->",rB:true,i:"\\(|#|//|/\\*|\\\\|:|;",c:[d,i.inherit(i.TM,{b:c})],starts:{e:";|\\.",k:f,c:j}},l,{cN:"pp",b:"^-",e:"\\.",r:0,eE:true,rB:true,l:"-"+i.IR,k:"-module -record -undef -export -ifdef -ifndef -author -copyright -doc -vsn -import -include -include_lib -compile -define -else -endif -file -behaviour -behavior -spec",c:[d]},e,i.QSM,b,a,m,h,{b:/\.$/}]}});hljs.registerLanguage("haskell",function(f){var g={cN:"comment",v:[{b:"--",e:"$"},{b:"{-",e:"-}",c:["self"]}]};var e={cN:"pragma",b:"{-#",e:"#-}"};var b={cN:"preprocessor",b:"^#",e:"$"};var d={cN:"type",b:"\\b[A-Z][\\w']*",r:0};var c={cN:"container",b:"\\(",e:"\\)",i:'"',c:[e,g,b,{cN:"type",b:"\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?"},f.inherit(f.TM,{b:"[_a-z][\\w']*"})]};var a={cN:"container",b:"{",e:"}",c:c.c};return{aliases:["hs"],k:"let in if then else case of where do module import hiding qualified type data newtype deriving class instance as default infix infixl infixr foreign export ccall stdcall cplusplus jvm dotnet safe unsafe family forall mdo proc rec",c:[{cN:"module",b:"\\bmodule\\b",e:"where",k:"module where",c:[c,g],i:"\\W\\.|;"},{cN:"import",b:"\\bimport\\b",e:"$",k:"import|0 qualified as hiding",c:[c,g],i:"\\W\\.|;"},{cN:"class",b:"^(\\s*)?(class|instance)\\b",e:"where",k:"class family instance where",c:[d,c,g]},{cN:"typedef",b:"\\b(data|(new)?type)\\b",e:"$",k:"data family type newtype deriving",c:[e,g,d,c,a]},{cN:"default",bK:"default",e:"$",c:[d,c,g]},{cN:"infix",bK:"infix infixl infixr",e:"$",c:[f.CNM,g]},{cN:"foreign",b:"\\bforeign\\b",e:"$",k:"foreign import export ccall stdcall cplusplus jvm dotnet safe unsafe",c:[d,f.QSM,g]},{cN:"shebang",b:"#!\\/usr\\/bin\\/env runhaskell",e:"$"},e,g,b,f.QSM,f.CNM,d,f.inherit(f.TM,{b:"^[_a-z][\\w']*"}),{b:"->|<-"}]}});hljs.registerLanguage("http",function(a){return{i:"\\S",c:[{cN:"status",b:"^HTTP/[0-9\\.]+",e:"$",c:[{cN:"number",b:"\\b\\d{3}\\b"}]},{cN:"request",b:"^[A-Z]+ (.*?) HTTP/[0-9\\.]+$",rB:true,e:"$",c:[{cN:"string",b:" ",e:" ",eB:true,eE:true}]},{cN:"attribute",b:"^\\w",e:": ",eE:true,i:"\\n|\\s|=",starts:{cN:"string",e:"$"}},{b:"\\n\\n",starts:{sL:"",eW:true}}]}});hljs.registerLanguage("ini",function(a){return{cI:true,i:/\S/,c:[{cN:"comment",b:";",e:"$"},{cN:"title",b:"^\\[",e:"\\]"},{cN:"setting",b:"^[a-z0-9\\[\\]_-]+[ \\t]*=[ \\t]*",e:"$",c:[{cN:"value",eW:true,k:"on off true false yes no",c:[a.QSM,a.NM],r:0}]}]}});hljs.registerLanguage("java",function(b){var a="false synchronized int abstract float private char boolean static null if const for true while long throw strictfp finally protected import native final return void enum else break transient new catch instanceof byte super volatile case assert short package default double public try this switch continue throws";return{aliases:["jsp"],k:a,i:/<\//,c:[{cN:"javadoc",b:"/\\*\\*",e:"\\*/",c:[{cN:"javadoctag",b:"(^|\\s)@[A-Za-z]+"}],r:10},b.CLCM,b.CBCM,b.ASM,b.QSM,{bK:"protected public private",e:/[{;=]/,k:a,c:[{cN:"class",bK:"class interface",eW:true,eE:true,i:/[:"<>]/,c:[{bK:"extends implements",r:10},b.UTM]},{b:b.UIR+"\\s*\\(",rB:true,c:[b.UTM]}]},b.CNM,{cN:"annotation",b:"@[A-Za-z]+"}]}});hljs.registerLanguage("javascript",function(a){return{aliases:["js"],k:{keyword:"in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document"},c:[{cN:"pi",b:/^\s*('|")use strict('|")/,r:10},a.ASM,a.QSM,a.CLCM,a.CBCM,a.CNM,{b:"("+a.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[a.CLCM,a.CBCM,a.RM,{b:/</,e:/>;/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,eE:true,c:[a.inherit(a.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,c:[a.CLCM,a.CBCM],i:/["'\(]/}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+a.IR,r:0}]}});hljs.registerLanguage("json",function(a){var e={literal:"true false null"};var d=[a.QSM,a.CNM];var c={cN:"value",e:",",eW:true,eE:true,c:d,k:e};var b={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:true,eE:true,c:[a.BE],i:"\\n",starts:c}],i:"\\S"};var f={b:"\\[",e:"\\]",c:[a.inherit(c,{cN:null})],i:"\\S"};d.splice(d.length,0,b,f);return{c:d,k:e,i:"\\S"}});hljs.registerLanguage("lisp",function(i){var l="[a-zA-Z_\\-\\+\\*\\/\\<\\=\\>\\&\\#][a-zA-Z0-9_\\-\\+\\*\\/\\<\\=\\>\\&\\#!]*";var m="(\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s)(\\+|\\-)?\\d+)?";var k={cN:"shebang",b:"^#!",e:"$"};var b={cN:"literal",b:"\\b(t{1}|nil)\\b"};var e={cN:"number",v:[{b:m,r:0},{b:"#b[0-1]+(/[0-1]+)?"},{b:"#o[0-7]+(/[0-7]+)?"},{b:"#x[0-9a-f]+(/[0-9a-f]+)?"},{b:"#c\\("+m+" +"+m,e:"\\)"}]};var h=i.inherit(i.QSM,{i:null});var n={cN:"comment",b:";",e:"$"};var g={cN:"variable",b:"\\*",e:"\\*"};var o={cN:"keyword",b:"[:&]"+l};var d={b:"\\(",e:"\\)",c:["self",b,h,e]};var a={cN:"quoted",c:[e,h,g,o,d],v:[{b:"['`]\\(",e:"\\)"},{b:"\\(quote ",e:"\\)",k:{title:"quote"}}]};var c={cN:"quoted",b:"'"+l};var j={cN:"list",b:"\\(",e:"\\)"};var f={eW:true,r:0};j.c=[{cN:"title",b:l},f];f.c=[a,c,j,b,e,h,n,g,o];return{i:/\S/,c:[e,k,b,h,n,a,c,j]}});hljs.registerLanguage("lua",function(b){var a="\\[=*\\[";var e="\\]=*\\]";var c={b:a,e:e,c:["self"]};var d=[{cN:"comment",b:"--(?!"+a+")",e:"$"},{cN:"comment",b:"--"+a,e:e,c:[c],r:10}];return{l:b.UIR,k:{keyword:"and break do else elseif end false for if in local nil not or repeat return then true until while",built_in:"_G _VERSION assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall coroutine debug io math os package string table"},c:d.concat([{cN:"function",bK:"function",e:"\\)",c:[b.inherit(b.TM,{b:"([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"}),{cN:"params",b:"\\(",eW:true,c:d}].concat(d)},b.CNM,b.ASM,b.QSM,{cN:"string",b:a,e:e,c:[c],r:10}])}});hljs.registerLanguage("objectivec",function(a){var d={keyword:"int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign self synchronized id nonatomic super unichar IBOutlet IBAction strong weak @private @protected @public @try @property @end @throw @catch @finally @synthesize @dynamic @selector @optional @required",literal:"false true FALSE TRUE nil YES NO NULL",built_in:"NSString NSDictionary CGRect CGPoint UIButton UILabel UITextView UIWebView MKMapView UISegmentedControl NSObject UITableViewDelegate UITableViewDataSource NSThread UIActivityIndicator UITabbar UIToolBar UIBarButtonItem UIImageView NSAutoreleasePool UITableView BOOL NSInteger CGFloat NSException NSLog NSMutableString NSMutableArray NSMutableDictionary NSURL NSIndexPath CGSize UITableViewCell UIView UIViewController UINavigationBar UINavigationController UITabBarController UIPopoverController UIPopoverControllerDelegate UIImage NSNumber UISearchBar NSFetchedResultsController NSFetchedResultsChangeType UIScrollView UIScrollViewDelegate UIEdgeInsets UIColor UIFont UIApplication NSNotFound NSNotificationCenter NSNotification UILocalNotification NSBundle NSFileManager NSTimeInterval NSDate NSCalendar NSUserDefaults UIWindow NSRange NSArray NSError NSURLRequest NSURLConnection UIInterfaceOrientation MPMoviePlayerController dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"};var c=/[a-zA-Z@][a-zA-Z0-9_]*/;var b="@interface @class @protocol @implementation";return{aliases:["m","mm","objc","obj-c"],k:d,l:c,i:"</",c:[a.CLCM,a.CBCM,a.CNM,a.QSM,{cN:"string",b:"'",e:"[^\\\\]'",i:"[^\\\\][^']"},{cN:"preprocessor",b:"#import",e:"$",c:[{cN:"title",b:'"',e:'"'},{cN:"title",b:"<",e:">"}]},{cN:"preprocessor",b:"#",e:"$"},{cN:"class",b:"("+b.split(" ").join("|")+")\\b",e:"({|$)",eE:true,k:b,l:c,c:[a.UTM]},{cN:"variable",b:"\\."+a.UIR,r:0}]}});hljs.registerLanguage("perl",function(c){var d="getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qqfileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmgetsub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedirioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when";var f={cN:"subst",b:"[$@]\\{",e:"\\}",k:d};var g={b:"->{",e:"}"};var a={cN:"variable",v:[{b:/\$\d/},{b:/[\$\%\@](\^\w\b|#\w+(\:\:\w+)*|{\w+}|\w+(\:\:\w*)*)/},{b:/[\$\%\@][^\s\w{]/,r:0}]};var e={cN:"comment",b:"^(__END__|__DATA__)",e:"\\n$",r:5};var h=[c.BE,f,a];var b=[a,c.HCM,e,{cN:"comment",b:"^\\=\\w",e:"\\=cut",eW:true},g,{cN:"string",c:h,v:[{b:"q[qwxr]?\\s*\\(",e:"\\)",r:5},{b:"q[qwxr]?\\s*\\[",e:"\\]",r:5},{b:"q[qwxr]?\\s*\\{",e:"\\}",r:5},{b:"q[qwxr]?\\s*\\|",e:"\\|",r:5},{b:"q[qwxr]?\\s*\\<",e:"\\>",r:5},{b:"qw\\s+q",e:"q",r:5},{b:"'",e:"'",c:[c.BE]},{b:'"',e:'"'},{b:"`",e:"`",c:[c.BE]},{b:"{\\w+}",c:[],r:0},{b:"-?\\w+\\s*\\=\\>",c:[],r:0}]},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{b:"(\\/\\/|"+c.RSR+"|\\b(split|return|print|reverse|grep)\\b)\\s*",k:"split return print reverse grep",r:0,c:[c.HCM,e,{cN:"regexp",b:"(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",r:10},{cN:"regexp",b:"(m|qr)?/",e:"/[a-z]*",c:[c.BE],r:0}]},{cN:"sub",bK:"sub",e:"(\\s*\\(.*?\\))?[;{]",r:5},{cN:"operator",b:"-\\w\\b",r:0}];f.c=b;g.c=b;return{aliases:["pl"],k:d,c:b}});hljs.registerLanguage("php",function(b){var e={cN:"variable",b:"\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*"};var a={cN:"preprocessor",b:/<\?(php)?|\?>/};var c={cN:"string",c:[b.BE,a],v:[{b:'b"',e:'"'},{b:"b'",e:"'"},b.inherit(b.ASM,{i:null}),b.inherit(b.QSM,{i:null})]};var d={v:[b.BNM,b.CNM]};return{aliases:["php3","php4","php5","php6"],cI:true,k:"and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",c:[b.CLCM,b.HCM,{cN:"comment",b:"/\\*",e:"\\*/",c:[{cN:"phpdoc",b:"\\s@[A-Za-z]+"},a]},{cN:"comment",b:"__halt_compiler.+?;",eW:true,k:"__halt_compiler",l:b.UIR},{cN:"string",b:"<<<['\"]?\\w+['\"]?$",e:"^\\w+;",c:[b.BE]},a,e,{cN:"function",bK:"function",e:/[;{]/,eE:true,i:"\\$|\\[|%",c:[b.UTM,{cN:"params",b:"\\(",e:"\\)",c:["self",e,b.CBCM,c,d]}]},{cN:"class",bK:"class interface",e:"{",eE:true,i:/[:\(\$"]/,c:[{bK:"extends implements",r:10},b.UTM]},{bK:"namespace",e:";",i:/[\.']/,c:[b.UTM]},{bK:"use",e:";",c:[b.UTM]},{b:"=>"},c,d]}});hljs.registerLanguage("python",function(a){var f={cN:"prompt",b:/^(>>>|\.\.\.) /};var b={cN:"string",c:[a.BE],v:[{b:/(u|b)?r?'''/,e:/'''/,c:[f],r:10},{b:/(u|b)?r?"""/,e:/"""/,c:[f],r:10},{b:/(u|r|ur)'/,e:/'/,r:10},{b:/(u|r|ur)"/,e:/"/,r:10},{b:/(b|br)'/,e:/'/},{b:/(b|br)"/,e:/"/},a.ASM,a.QSM]};var d={cN:"number",r:0,v:[{b:a.BNR+"[lLjJ]?"},{b:"\\b(0o[0-7]+)[lLjJ]?"},{b:a.CNR+"[lLjJ]?"}]};var e={cN:"params",b:/\(/,e:/\)/,c:["self",f,d,b]};var c={e:/:/,i:/[${=;\n]/,c:[a.UTM,e]};return{aliases:["py","gyp"],k:{keyword:"and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda nonlocal|10 None True False",built_in:"Ellipsis NotImplemented"},i:/(<\/|->|\?)/,c:[f,d,b,a.HCM,a.inherit(c,{cN:"function",bK:"def",r:10}),a.inherit(c,{cN:"class",bK:"class"}),{cN:"decorator",b:/@/,e:/$/},{b:/\b(print|exec)\(/}]}});hljs.registerLanguage("ruby",function(f){var j="[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?";var i="and false then defined module in return redo if BEGIN retry end for true self when next until do begin unless END rescue nil else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor";var b={cN:"yardoctag",b:"@[A-Za-z]+"};var c={cN:"value",b:"#<",e:">"};var k={cN:"comment",v:[{b:"#",e:"$",c:[b]},{b:"^\\=begin",e:"^\\=end",c:[b],r:10},{b:"^__END__",e:"\\n$"}]};var d={cN:"subst",b:"#\\{",e:"}",k:i};var e={cN:"string",c:[f.BE,d],v:[{b:/'/,e:/'/},{b:/"/,e:/"/},{b:"%[qw]?\\(",e:"\\)"},{b:"%[qw]?\\[",e:"\\]"},{b:"%[qw]?{",e:"}"},{b:"%[qw]?<",e:">"},{b:"%[qw]?/",e:"/"},{b:"%[qw]?%",e:"%"},{b:"%[qw]?-",e:"-"},{b:"%[qw]?\\|",e:"\\|"},{b:/\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/}]};var a={cN:"params",b:"\\(",e:"\\)",k:i};var h=[e,c,k,{cN:"class",bK:"class module",e:"$|;",i:/=/,c:[f.inherit(f.TM,{b:"[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?"}),{cN:"inheritance",b:"<\\s*",c:[{cN:"parent",b:"("+f.IR+"::)?"+f.IR}]},k]},{cN:"function",bK:"def",e:" |$|;",r:0,c:[f.inherit(f.TM,{b:j}),a,k]},{cN:"constant",b:"(::)?(\\b[A-Z]\\w*(::)?)+",r:0},{cN:"symbol",b:":",c:[e,{b:j}],r:0},{cN:"symbol",b:f.UIR+"(\\!|\\?)?:",r:0},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{cN:"variable",b:"(\\$\\W)|((\\$|\\@\\@?)(\\w+))"},{b:"("+f.RSR+")\\s*",c:[c,k,{cN:"regexp",c:[f.BE,d],i:/\n/,v:[{b:"/",e:"/[a-z]*"},{b:"%r{",e:"}[a-z]*"},{b:"%r\\(",e:"\\)[a-z]*"},{b:"%r!",e:"![a-z]*"},{b:"%r\\[",e:"\\][a-z]*"}]}],r:0}];d.c=h;a.c=h;var g=[{r:1,cN:"output",b:"^\\s*=> ",e:"$",rB:true,c:[{cN:"status",b:"^\\s*=>"},{b:" ",e:"$",c:h}]},{r:1,cN:"input",b:"^[^ ][^=>]*>+ ",e:"$",rB:true,c:[{cN:"prompt",b:"^[^ ][^=>]*>+"},{b:" ",e:"$",c:h}]}];return{aliases:["rb","gemspec","podspec","thor","irb"],k:i,c:g.concat(h)}});hljs.registerLanguage("sql",function(a){var b={cN:"comment",b:"--",e:"$"};return{cI:true,i:/[<>]/,c:[{cN:"operator",bK:"begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate savepoint release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup",e:/;/,eW:true,k:{keyword:"abs absolute acos action add adddate addtime aes_decrypt aes_encrypt after aggregate all allocate alter analyze and any are as asc ascii asin assertion at atan atan2 atn2 authorization authors avg backup before begin benchmark between bin binlog bit_and bit_count bit_length bit_or bit_xor both by cache call cascade cascaded case cast catalog ceil ceiling chain change changed char_length character_length charindex charset check checksum checksum_agg choose close coalesce coercibility collate collation collationproperty column columns columns_updated commit compress concat concat_ws concurrent connect connection connection_id consistent constraint constraints continue contributors conv convert convert_tz corresponding cos cot count count_big crc32 create cross cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime data database databases datalength date_add date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts datetimeoffsetfromparts day dayname dayofmonth dayofweek dayofyear deallocate declare decode default deferrable deferred degrees delayed delete des_decrypt des_encrypt des_key_file desc describe descriptor diagnostics difference disconnect distinct distinctrow div do domain double drop dumpfile each else elt enclosed encode encrypt end end-exec engine engines eomonth errors escape escaped event eventdata events except exception exec execute exists exp explain export_set extended external extract fast fetch field fields find_in_set first first_value floor flush for force foreign format found found_rows from from_base64 from_days from_unixtime full function get get_format get_lock getdate getutcdate global go goto grant grants greatest group group_concat grouping grouping_id gtid_subset gtid_subtract handler having help hex high_priority hosts hour ident_current ident_incr ident_seed identified identity if ifnull ignore iif ilike immediate in index indicator inet6_aton inet6_ntoa inet_aton inet_ntoa infile initially inner innodb input insert install instr intersect into is is_free_lock is_ipv4 is_ipv4_compat is_ipv4_mapped is_not is_not_null is_used_lock isdate isnull isolation join key kill language last last_day last_insert_id last_value lcase lead leading least leaves left len lenght level like limit lines ln load load_file local localtime localtimestamp locate lock log log10 log2 logfile logs low_priority lower lpad ltrim make_set makedate maketime master master_pos_wait match matched max md5 medium merge microsecond mid min minute mod mode module month monthname mutex name_const names national natural nchar next no no_write_to_binlog not now nullif nvarchar oct octet_length of old_password on only open optimize option optionally or ord order outer outfile output pad parse partial partition password patindex percent_rank percentile_cont percentile_disc period_add period_diff pi plugin position pow power pragma precision prepare preserve primary prior privileges procedure procedure_analyze processlist profile profiles public publishingservername purge quarter query quick quote quotename radians rand read references regexp relative relaylog release release_lock rename repair repeat replace replicate reset restore restrict return returns reverse revoke right rlike rollback rollup round row row_count rows rpad rtrim savepoint schema scroll sec_to_time second section select serializable server session session_user set sha sha1 sha2 share show sign sin size slave sleep smalldatetimefromparts snapshot some soname soundex sounds_like space sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sql_variant_property sqlstate sqrt square start starting status std stddev stddev_pop stddev_samp stdev stdevp stop str str_to_date straight_join strcmp string stuff subdate substr substring subtime subtring_index sum switchoffset sysdate sysdatetime sysdatetimeoffset system_user sysutcdatetime table tables tablespace tan temporary terminated tertiary_weights then time time_format time_to_sec timediff timefromparts timestamp timestampadd timestampdiff timezone_hour timezone_minute to to_base64 to_days to_seconds todatetimeoffset trailing transaction translation trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse ucase uncompress uncompressed_length unhex unicode uninstall union unique unix_timestamp unknown unlock update upgrade upped upper usage use user user_resources using utc_date utc_time utc_timestamp uuid uuid_short validate_password_strength value values var var_pop var_samp variables variance varp version view warnings week weekday weekofyear weight_string when whenever where with work write xml xor year yearweek zon",literal:"true false null",built_in:"array bigint binary bit blob boolean char character date dec decimal float int integer interval number numeric real serial smallint varchar varying int8 serial8 text"},c:[{cN:"string",b:"'",e:"'",c:[a.BE,{b:"''"}]},{cN:"string",b:'"',e:'"',c:[a.BE,{b:'""'}]},{cN:"string",b:"`",e:"`",c:[a.BE]},a.CNM,a.CBCM,b]},a.CBCM,b]}});hljs.registerLanguage("tex",function(a){var d={cN:"command",b:"\\\\[a-zA-Zа-яА-я]+[\\*]?"};var c={cN:"command",b:"\\\\[^a-zA-Zа-яА-я0-9]"};var b={cN:"special",b:"[{}\\[\\]\\&#~]",r:0};return{c:[{b:"\\\\[a-zA-Zа-яА-я]+[\\*]? *= *-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?",rB:true,c:[d,c,{cN:"number",b:" *=",e:"-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?",eB:true}],r:10},d,c,b,{cN:"formula",b:"\\$\\$",e:"\\$\\$",c:[d,c,b],r:0},{cN:"formula",b:"\\$",e:"\\$",c:[d,c,b],r:0},{cN:"comment",b:"%",e:"$",r:0}]}});hljs.registerLanguage("vbnet",function(a){return{aliases:["vb"],cI:true,k:{keyword:"addhandler addressof alias and andalso aggregate ansi as assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into is isfalse isnot istrue join key let lib like loop me mid mod module mustinherit mustoverride mybase myclass namespace narrowing new next not notinheritable notoverridable of off on operator option optional or order orelse overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim rem removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly xor",built_in:"boolean byte cbool cbyte cchar cdate cdec cdbl char cint clng cobj csbyte cshort csng cstr ctype date decimal directcast double gettype getxmlnamespace iif integer long object sbyte short single string trycast typeof uinteger ulong ushort",literal:"true false nothing"},i:"//|{|}|endif|gosub|variant|wend",c:[a.inherit(a.QSM,{c:[{b:'""'}]}),{cN:"comment",b:"'",e:"$",rB:true,c:[{cN:"xmlDocTag",b:"'''|<!--|-->"},{cN:"xmlDocTag",b:"</?",e:">"}]},a.CNM,{cN:"preprocessor",b:"#",e:"$",k:"if else elseif end region externalsource"}]}});hljs.registerLanguage("vbscript",function(a){return{aliases:["vbs"],cI:true,k:{keyword:"call class const dim do loop erase execute executeglobal exit for each next function if then else on error option explicit new private property let get public randomize redim rem select case set stop sub while wend with end to elseif is or xor and not class_initialize class_terminate default preserve in me byval byref step resume goto",built_in:"lcase month vartype instrrev ubound setlocale getobject rgb getref string weekdayname rnd dateadd monthname now day minute isarray cbool round formatcurrency conversions csng timevalue second year space abs clng timeserial fixs len asc isempty maths dateserial atn timer isobject filter weekday datevalue ccur isdate instr datediff formatdatetime replace isnull right sgn array snumeric log cdbl hex chr lbound msgbox ucase getlocale cos cdate cbyte rtrim join hour oct typename trim strcomp int createobject loadpicture tan formatnumber mid scriptenginebuildversion scriptengine split scriptengineminorversion cint sin datepart ltrim sqr scriptenginemajorversion time derived eval date formatpercent exp inputbox left ascw chrw regexp server response request cstr err",literal:"true false null nothing empty"},i:"//",c:[a.inherit(a.QSM,{c:[{b:'""'}]}),{cN:"comment",b:/'/,e:/$/,r:0},a.CNM]}});hljs.registerLanguage("xml",function(a){var c="[A-Za-z0-9\\._:-]+";var d={b:/<\?(php)?(?!\w)/,e:/\?>/,sL:"php",subLanguageMode:"continuous"};var b={eW:true,i:/</,r:0,c:[d,{cN:"attribute",b:c,r:0},{b:"=",r:0,c:[{cN:"value",v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s\/>]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xsl","plist"],cI:true,c:[{cN:"doctype",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},{cN:"comment",b:"<!--",e:"-->",r:10},{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{title:"style"},c:[b],starts:{e:"</style>",rE:true,sL:"css"}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{title:"script"},c:[b],starts:{e:"<\/script>",rE:true,sL:"javascript"}},{b:"<%",e:"%>",sL:"vbscript"},d,{cN:"pi",b:/<\?\w+/,e:/\?>/,r:10},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"title",b:"[^ /><]+",r:0},b]}]}});
var sendBoardForm = function(file) {
    "use strict";
    
    var formData = $('#de-pform form').serializeArray(),
        fileInputName = $("#de-pform form input[type=file]")[0].name,
        fd = new FormData();

    for (var i = 0; i < formData.length; i++) {
        if (formData[i].name != fileInputName) {
            fd.append(formData[i].name, formData[i].value);
        }
    }

    if (document.URL.match(/\/8chan.co\//)) {
        fd.append('post', $('#de-pform input[type=submit]').val());
    }

    var fnme = Math.floor((new Date()).getTime() / 10 - Math.random() * 100000000) + '.jpg';

    fd.append(fileInputName, uint8toBlob(file, 'image/jpeg'), fnme);

    replyForm.find("#do_encode").val('..Working...').attr("disabled", "disabled");

    $.ajax({
        url: $("#de-pform form")[0].action, //+ "?X-Progress-ID=" + upload_handler,
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        success: function(data, textStatus, jqXHR) {
            var doc = document.implementation.createHTMLDocument(''),
                p;
            doc.documentElement.innerHTML = data;

//            console.log(data, textStatus, jqXHR);

            if (jqXHR.status === 200 && jqXHR.readyState === 4) {
                p = $('form[action*="delete"]', doc).length +
                    $('form[action*="delete"]', doc).length +
                    $('#posts_form, #delform', doc).length +
                    $('form:not([enctype])', doc).length +
                    $('form[name="postcontrols"]', doc).length +
                    $('form[name="postcontrols"]', doc).length +
                    $('#delform, form[name="delform"]', doc).length;
            } else {
                p = 1;
            }

            if (p !== 0) {
                $('#de-pform textarea').val('');
                $('#de-pform img[src*=captcha]').click();
                $('#hidbord_replyform #c_file').val('');
                $('#de-updater-btn').click();
                replyForm.remove();
                replyForm = null;
                container_image = null;
                container_data = null;

            } else {
                replyForm.find("input[type=submit]").attr("disabled", null);
                alert('Can\'t post. Wrong capch? Fucked up imageboard software?.');
                replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
//                console.log(data, textStatus, jqXHR, doc, doc.find('#delform, form[name="delform"]'));
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
//            console.log(jqXHR, textStatus, errorThrown);
            alert('Error while posting. Something in network or so.');
            replyForm.find("#do_encode").val('crypt and send').removeAttr("disabled");
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

    var key_from_pass = sjcl.misc.pbkdf2(lf.passwd.value, "salt", 10000, 256 * 8);

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

    ssSet('magic_desu_numbers', rsaProfile);

    $('#identi').html(rsa_hash).identicon5({
        rotate: true,
        size: 64
    });
    $('#pub_key_info').val(linebrk(rsa.n.toString(16), 64));
    lf.magik_num.value = lf.passwd.value = '';
};

var do_encode = function() {
    "use strict";

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
        if('hide' in contacts[c] && contacts[c].hide == 1){
            continue;
        }
        keys[c] = contacts[c].key;
    }

    var p = encodeMessage(payLoad,keys);
    var testEncode = decodeMessage(p);

    if(!testEncode || testEncode.status != "OK"){
        alert('Error in crypt module!');
        return false;
    }

    var lastRand = stringToByteArray(String(Math.round(Math.random() * 1e6)));

    var out_file = appendBuffer(jpegEmbed(container_data, p),lastRand);
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
    return true;
};

var contacts = {};

var add_contact = function(e) {
    "use strict";

    var name = prompt("Name this contact:");
    var key = $(e.target).attr('alt');
    var rsa_hash = hex_sha1(key);

    contacts[rsa_hash] = {
        key: key,
        name: name,
        hide: 0
    };

    localStorage.setItem('magic_desu_contacts', JSON.stringify(contacts));
    render_contact();
};

function safe_tags(str) {
    "use strict";
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
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

var render_contact = function() {
    "use strict";

    var code = '<br><a href="data:text/plain;base64,' + strToDataUri(encodeURIComponent(JSON.stringify(contacts))) + 
               '" download="[DDT] Contacts - ' + document.location.host + ' - ' + dateToStr(new Date(), true) + 
               '.txt">Download contacts as file</a> or import from file: <input type="file" id="cont_import_file" name="cont_import_file"><br/><br/>';

    for (var c in contacts) {
        var ren_action = ('hide' in contacts[c] && contacts[c].hide == 1) ? 'enable' : 'disable';
        code += '<div class="hidbord_msg">' +
            '<div class="cont_identi" style="float: left">' + c + '</div>' +
            '<div  style="float: left; padding: 5px;">' + getContactHTML(c) + '<br/><i style="color: #090">' + c + '</i><br/>' +
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">delete</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">' + ren_action + '</a>]</sub> '+
            '<sub>[<a href="javascript:;" alt="' + c + '" class="hidbord_cont_action">rename</a>]</sub></div><br style="clear: both;"/></div>';
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

};

var manage_contact = function(e) {
    "use strict";

    var action = $(e.target).text(),
        key = $(e.target).attr('alt'), name;
    
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
        contacts[key].name = '' + prompt("Name this contact:", contacts[key].name);
    }

    localStorage.setItem('magic_desu_contacts', JSON.stringify(contacts));
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
                    localStorage.setItem('magic_desu_contacts', JSON.stringify(contacts));
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

if (localStorage.getItem('magic_desu_contacts')) {
    contacts = JSON.parse(localStorage.getItem('magic_desu_contacts'));
//    console.log(contacts);
}

var CODEC_VERSION = 1;

var encodeMessage = function(message, keys){
    'use strict';

    var i, pwd,salt,iv,preIter, arrTemp, keyshift, rp, p, sig,
        deflate = new Zlib.RawDeflate(strToUTF8Arr(JSON.stringify(message))),
        compressed = deflate.compress(),
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

    arrTemp = hexToBytes(rsaProfile.n); // our publick key
    for (i = 0; i < arrTemp.length; i++) {
        container[5 + i] = arrTemp[i];
    }

    container[261] = 0; //type of message
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

        arrTemp = hexToBytes(c); // keyhash
        for (i = 0; i < arrTemp.length; i++) {
            container[316 + i + keyshift*148] = arrTemp[i];
        }

        var testRsa = new RSAKey();
        testRsa.setPublic(keys[c], '10001');

        arrTemp = hexToBytes(testRsa.encrypt(pwd)); // crypted password
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

    arrTemp = hexToBytes(sig); // keyhash
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
        var inflate = new Zlib.RawInflate(om);
        var plain = inflate.decompress();
        container.status = 'OK';
        container.message = JSON.parse(utf8ArrToStr(plain));
        return container;
    } catch (e) {
        return false;
    }

    return false;
};
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
var hexToBytes = function (hex) {
    "use strict";

    var str = hex.length % 2 ? "0" + hex : hex;
    
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

var getURLasAB = function(URL, cb) {
    "use strict";
    
    var oReq = new XMLHttpRequest();

    oReq.open("GET", URL, true);
    oReq.responseType = "arraybuffer";
    oReq.onload = function(oEvent) {
        var arrayBuffer = oReq.response; // Note: not oReq.responseText
        var byteArray = new Uint8Array(arrayBuffer);
        if (arrayBuffer) {
            cb(arrayBuffer, new Date(oEvent.target.getResponseHeader('Last-Modified')));
        }
    };
    oReq.send(null);
};

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

var jpegEmbed = function(img_container, data_array){
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

var jpegExtract = function(inArBuf) {
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
            '        <form name="loginform">'+
            '            <div style="border: 1px solid #999; background-color: #eee; padding: 5px;">'+
            '                <div id="identi" style="float: left"></div>'+
            '                <div style="float: left; padding: 5px;">Password:'+
            '                    <input name="passwd" type="text" value="" size=10>Magic number:'+
            '                    <input name="magik_num" type="text" value="" size=10>'+
            '                    <input type="button" value="log in" id="do_login">'+
            '                </div>'+
            '                <br style="clear: both;" />'+
            '            </div>'+
            '        </form>'+
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
                '<input type="button" value="Get old messages" style="font-size: 12px;" id="hidbord_btn_getold">'+
                '<a href="javascript:;" style="float: right;line-height: 27px;" id="hidbord_btn_checknew">check for new</a>'+
                '</div>'+
            '</div>'+
            '<div class="hidbord_notifer">'+
            '    <img id="hidbord_show" class="hidbord_clickable" alt="Moshi moshi!" title="Moshi moshi!" src="' + desudesuicon +'" width="64" style="margin:0; z-index:50;vertical-align: bottom;"/>'+
            '<span id="hidbord_notify_counter" class="hidbord_clickable" style="position: absolute;background: #f00;z-index: 100;bottom: 4px;right: 4px;font-weight: bold;padding: 2px 7px;border-radius: 30px; color: #fff;box-shadow: 0 0 1px #f00;font-size: 15px;display: none;">1</span>'+
            '</div>';
    
    injectCSS('.hidbord_notifer{font-size: smaller !important;padding: 0;font-family: calibri;position: fixed;bottom: 25px;right: 25px;box-shadow: 0 0 10px #999;display: block;border: 3px solid #fff;border-radius: 5px;background-color: rgb(217,225,229);overflow: hidden;} '+
            '.hidbord_msg code { padding: 0 4px; font-size: 90%; color: #c7254e; background-color: #f9f2f4; white-space: nowrap; border-radius: 4px; } '+
            '.hidbord_msg code, .hidbord_msg kbd, .hidbord_msg pre, .hidbord_msg samp { font-family: Menlo,Monaco,Consolas,"Courier New",monospace; white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word; } '+
            '.hidbord_spoiler code { padding: 0; } '+
            '.hidbord_msg pre { clear: left; display: block; padding: 9.5px; margin: 10px; font-size: 13px; line-height: 1.42857143; word-break: break-all; word-wrap: break-word; border-radius: 4px; white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word; } '+
            '.hidbord_spoiler, .hidbord_spoiler code { background-color: #CCCCCC; } '+
            '.hidbord_spoiler:not(:hover) pre{ background-color: #CCCCCC; } '+
            '.hidbord_spoiler:not(:hover) img{ opacity: 0; } '+
            '.hidbord_spoiler:not(:hover), .hidbord_spoiler:not(:hover) * { color: #CCCCCC; } '+
            '.hidbord_quot1 { color: #789922; }'+
            '.hidbord_quot2 { color: #546c18; } '+
            '.hidbord_main { font-size: medium !important; font-family: calibri; position: fixed; bottom: 25px; right: 25px; box-shadow: 0 0 10px #999; display: block; width: 650px; border: 3px solid #fff; border-radius: 5px; background-color: rgb(217,225,229); overflow: hidden; top: 25px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAEAgMAAADUn3btAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gQIFQEfWioE/wAAAAlQTFRF0Njc2eHl////72WY8QAAAAFiS0dEAmYLfGQAAAAQSURBVAgdY2BlEGEIYHAEAAHAAKtr/oOEAAAAAElFTkSuQmCC); } '+
            '.hidbord_maincontent{ padding: 5px; overflow-y: scroll; overflow-x: hidden; position: absolute; top: 65px; width: 640px; bottom: 28px; } '+
            '.hidbord_head{ height: 64px; border-bottom: 1px solid #fff; box-shadow: 0 0 10px #000; position: absolute; top: 0; left: 0; right: 0; text-align: center; background-color: rgb(217,225,229); } '+
            '.hidbord_head h3{ margin-top: 5px; padding-left: 0; font-family: comic sans ms; font-style: italic; font-size: x-large; } '+
            '.hidbord_nav{ position: absolute; bottom: 0; margin: auto; width: 370px; left: 0; right: 0; } '+
            '.hidbord_nav div{ display: inline-block; background: #eee; width: 120px; } '+
            '.hidbord_nav .active{ background: #fff; box-shadow: 0 0 5px #999; } '+
            '.hidbord_msg { font-family: calibri; display: block; border-right: 1px solid #999; border-bottom: 1px solid #999; border-left: 1px solid #fafafa; border-top: 1px solid #fafafa; margin: 2px 10px 10px 2px; background-color: #fafafa; padding: 5px; word-wrap: break-word;} '+
            '.hidbord_msg_focused { border: 1px dashed #e00; } '+
            '.hidbord_msg_new { background-color: #ffe; } '+
            '.hidbord_main hr { background:#ddd; border:0; height:1px } '+
            '.hidbord_mnu{ visibility: hidden; font-size: x-small; float:right; } '+
            '.hidbord_msg:hover .hidbord_mnu { visibility: visible; } '+
            '.hidbord_mnu a { color: #999; padding: 0.2em 0.4em; text-decoration: none; border: 1px solid #fff; } '+
            '.hidbord_mnu a:hover { background: #fe8; border: 1px solid #db4; } '+
            '.hidbord_clickable { cursor: pointer; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: -moz-none; -ms-user-select: none; user-select: none; }'+
            '.hidbord_hidden { display: none; } '+
            '#hidbord_popup {font-size: medium !important; font-family: calibri;}');
    
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

    if ("n" in rsaProfile) {
        $('#identi').html(rsa_hash).identicon5({
            rotate: true,
            size: 64
        });
        $('#pub_key_info').val(linebrk(rsa.n.toString(16), 64));
    }

    $('#hidbord_btn_reply').on('click', function() {
        showReplyform('#hidbord_reply_button');
    });

    $('#hidbord_btn_checknew').on('click', function() {
        $('#de-updater-btn').click();
    });

    $('#do_login').on('click', do_login);
    $('#hidbord_btn_getold').on('click', read_old_messages);


};

var popup_del_timer;

var do_popup = function(e) {
	"use strict";

    $('#hidbord_popup').remove();
    var msgid = '#msg_' + $(e.target).attr('alt'),
        msgClone, oMsg, oMsgH;

    if ($(msgid).length !== 0) {
        oMsg = $(msgid);
        msgClone = $(msgid).clone().css('margin', '0');
        msgClone.removeClass('hidbord_msg_focused').find('.hidbord_mnu').remove();
        oMsgH = oMsg.height();
    } else {
        oMsg = msgClone = $('<div style="padding: 10px; background: #fee; border: 1px solid #f00; font-weight: bold; text-align:center;">NOT FOUND</div>');
        oMsgH = 50;
    }

    var opy = $(e.target).offset().top - window.scrollY,
        px = e.clientX,
        py = 10 + opy + $(e.target).height(); //e.clientY + 10;

/*    if (px > $(window).width() / 2) {
        px -= oMsg.width();
    }*/

    var height_css = null;

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

    $('body').append('<div id="hidbord_popup" style="position: fixed; top: ' + py + 'px; right: 50px; width: 611px;"></div');
    $('#hidbord_popup').append(msgClone).css('box-shadow', ' 0 0 10px #555');

    $('#hidbord_popup .hidbord_msg').on('mouseover', function() {
        clearTimeout(popup_del_timer);
    }).on('mouseout', del_popup);

};

var del_popup = function() {
	"use strict";

    popup_del_timer = setTimeout(function() {
        $('#hidbord_popup').remove();
    }, 200);
};

var messages_list = [], new_messages = 0;

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

  //console.log(msg);

    var prependTo = '#allgetter_button',
        txt, person = '', recipients = '',
        msgDate = new Date(),
        msgTimeTxt, i;

    if ($("#msg_" + msg.id).length == 1) {
        $("#msg_" + msg.id).addClass('hidbord_msg_new');
        return;
    }

    if(messages_list.length > 0){
        messages_list.sort(function(a, b) {
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
        for (i = 0; i < messages_list.length; i++) {
            if(msg.post_id !==0){
                if(messages_list[i].post_id <= msg.post_id){
                    prependTo = '#msg_' + messages_list[i].id;
                    break;
                }
            }else{
                if(messages_list[i].txt.ts <= msg.txt.ts){
                    prependTo = '#msg_' + messages_list[i].id;
                    break;
                }
            }
        }
    }
    messages_list.push(msg);


    msgDate.setTime(parseInt(msg.txt.ts) * 1000);
    
    if (msg.status == 'OK') {
        txt = wkbmrk(msg.txt.msg);        
    } else {
        txt = '<p><strong style="color: #f00; font-size: x-large;">NO KEY! CAN NOT DECODE!</strong></p>';
    }

    for (i = 0; i < msg.to.length; i++) {
        recipients += '<span style="background: #fff;" class="idntcn2">' + msg.to[i] + '</span>&nbsp;' + getContactHTML(msg.to[i]) + '; ';
    }

    msgTimeTxt = dateToStr(msgDate);

    person = getContactHTML(msg.keyid, msg.pubkey);

    var code = '<div class="hidbord_msg hidbord_msg_new" id="msg_' + msg.id + '">'+
            '    <div class="hidbord_mnu"><a href="javascript:;" id="hidbord_mnu_info">info</a> <a href="javascript:;" class="hidbord_mnu_reply">reply</a></div>'+
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
            '</div>';

    //if (msgPrepend) {
        $(prependTo).after($(code));
    //} else {
    //    $('.hidbord_thread #hidbord_reply_button').before($(code));
    //}

    $("#msg_" + msg.id + ' .idntcn').identicon5({
        rotate: true,
        size: 40
    });

    $("#msg_" + msg.id + ' .hidbord_addcntct_link').on('click', add_contact);

    $("#msg_" + msg.id + ' .hidbord_mnu_reply').on('click', replytoMsg);
    $("#msg_" + msg.id + ' .hidbord_usr_reply').on('click', replytoUsr);

    $("#msg_" + msg.id + ' #hidbord_mnu_info').on('click', function(e){
        var msg_id = $(e.target).closest('.hidbord_msg').first().attr('id');
        $(e.target).closest('.hidbord_msg').first().find('#' + msg_id + ' .hidbord_msg_header').toggleClass('hidbord_hidden');
    });

    $("#msg_" + msg.id + ' .hidbord_post_img').on('click', function(e){
        var imgname = e.target.src.replace(/.+?\/([^\/]+)$/, '$1');
//        console.log(imgname, $('a img[src*="' + imgname + '"]').offset().top);
        window.scrollTo(0, $('a img[src*="' + imgname + '"]').offset().top);
    });    


//    console.log($("#msg_" + msg.id + ' .hidbord_addcntct_link'));

    var new_msg = $("#msg_" + msg.id);

    new_msg.on('mouseout', function() {
        $(this).removeClass('hidbord_msg_new');
    });


    new_msg.find('pre').each(function(i, e) {
        hljs.highlightBlock(e);
    });

    new_msg.find('.hidbord_msglink').on('mouseover', do_popup)
        .on('mouseout', del_popup)
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
        getURLasAB(jpgURL[0], function(arrayBuffer, date) {
            var byteArray = new Uint8Array(arrayBuffer);
            if (byteArray) {
                var arc = jpegExtract(arrayBuffer);
                if(arc){
                    var p = decodeMessage(arc);
                    if(p) do_decode(p, true, jpgURL[1], date, jpgURL[2]);
                }                   
            }
            if (process_images.length !== 0) {
                $('#hidbord_btn_getold').val('Stop fetch! ['+process_images.length+']');
                setTimeout(process_olds, 0); //500 + Math.round(500 * Math.random()));
            }else{
                $('#hidbord_btn_getold').val('Get old messages');
            }
        });
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

var replytoUsr = function(e) {
	"use strict";

    var msg_id = $(e.target).closest('.hidbord_msg').first().attr('id').replace(/^msg\_/, '');
    var usr_id = $(e.target).attr('alt').replace(/[^0-9a-f]/, '');
//    console.log(msg_id);
    showReplyform('#msg_' + msg_id, '{' + usr_id + '}');
};

var do_preview_popup = function(e) {
	"use strict";

    $('#hidbord_popup').remove();
    var txt = '<div class="hidbord_msg" style="box-shadow: 0 0 10px #555;overflow-y: scroll;">' + wkbmrk($('#hidbord_reply_text').val()) + '</div>';

//    console.log(txt);

    $('body').append('<div id="hidbord_popup" style="position: fixed; top: -2000px; right: -2000px; width: 611px;"></div');
    $('#hidbord_popup').append(txt);
    $('#hidbord_popup .idntcn2').identicon5({
        rotate: true,
        size: 18
    });
    $('#hidbord_popup pre').each(function(i, e) {
        hljs.highlightBlock(e);
    });

    var px = e.clientX,
        py = e.clientY + 10;

    if (px > $(window).width() / 2) {
        px -= $('#hidbord_popup').width();
    }

    if (py > $(window).height() / 2) {
        py -= $('#hidbord_popup').height() + 20;
        if(py < 10 ){
            $('#hidbord_popup').find('.hidbord_msg').css('height', (e.clientY - 50) + 'px');
            py = 10;
        }        
    }else{
        if(py + $('#hidbord_popup').height() + 10 > $(window).height()){
            $('#hidbord_popup').find('.hidbord_msg').css('height', ($(window).height() - py - 10) + 'px');
        }
    }

    $('#hidbord_popup').css('right', '50px').css('top', py + 'px');

    $('#hidbord_popup .hidbord_msg').on('mouseover', function() {
        clearTimeout(popup_del_timer);
    }).on('mouseout', del_popup);

};

var do_imgpreview_popup = function(e) {
	"use strict";

    $('#hidbord_popup').remove();
    if (!container_image) return;
    var txt = '<div class="hidbord_msg" style="box-shadow: 0 0 10px #555;"><img style="max-width: 200px; max-height: 200px;" src="' + container_image + '"></div>';
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    $('body').append('<div id="hidbord_popup" style="position: fixed; bottom: -2000px; left: -2000px;"></div');
    $('#hidbord_popup').append(txt);

    var px = $(e.target).offset().left,
        py = $(window).height() - ($(e.target).offset().top - window.scrollY);

    $('#hidbord_popup').css('left', px + 'px').css('bottom', py + 'px');

    $('#hidbord_popup .hidbord_msg').on('mouseover', function() {
        clearTimeout(popup_del_timer);
    }).on('mouseout', del_popup);

};

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
            '  <div>' +
            '    <div style="margin:  3px;">' +
            '      <div style="width: 590px;">' +
            '        <input type="file" id="c_file" name="c_file">' +
            '            <span style="float: right;" id="hidbordTextControls">' +
            '              <span title="Bold"><input value="B" style="font-weight: bold;" type="button" id="hidbordBtBold"></span>' +
            '              <span title="Italic"><input value="i" style="font-weight: bold; font-style: italic;" type="button" id="hidbordBtItalic"></span>' +
            '              <span title="Strike"><input value="S" style="font-weight: bold; text-decoration: line-through" type="button" id="hidbordBtStrike"></span>' +
            '              <span title="Spoiler"><input value="%" style="font-weight: bold;" type="button" id="hidbordBtSpoiler"></span>' +
            '              <span title="Code"><input value="C" style="font-weight: bold;" type="button" id="hidbordBtCode"></span>' +
            '              <span title="Quote selected"><input value=">" style="font-weight: bold;" type="button" id="hidbordBtQuote"></span>' +
            '            </span>  ' +
            '      </div>  ' +
            '      <textarea style="margin: 2px; width: 580px; height: 136px; resize: vertical; background-image: none; background-position: 0% 0%; background-repeat: repeat repeat;" id="hidbord_reply_text"></textarea>  ' +
            '      <div style="width: 590px;">' +
            '        <input type="button" value="crypt and send" id="do_encode">  ' +
            '        <span style="float: right;"><a href="javascript:;" id="hidbordform_preview">message preview</a></span>  ' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>');
        replyForm = $('#hidbord_replyform');

//        console.log('ddd', $('#hidbord_replyform'));

        $('#hidbord_replyform .idntcn').identicon5({
            rotate: true,
            size: 40
        });
        $('#hidbord_replyform #c_file').on('change', handleFileSelect);
        $('#hidbord_replyform #do_encode').on('click', do_encode);

        $('#hidbord_replyform #hidbordform_preview').on('mouseover', do_preview_popup)
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

            if (mode == 'B' || mode == 'i' || mode == 'S') {
                 tag = mode == 'B' ? '**' : '*';
                tag = mode == 'S' ? '--' : tag;
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
    "cake": '<img style="vertical-align:bottom;" alt="Delicious Cake" title="Delicious Cake" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAArlBMVEUAAAAAAAA4GRQ5GRRBHBtUIyqlJRSmJhSmJxV5OS6oLx1rQDerNiXUOyt9VkzZQzXfQzXiQzXlQzTmQzTmRDXnRDXjRziNal+rZETkVkesaEnhbF3CejXCejbEfDXAe2u4gmf+b125g2n/cF6th3iuiHmviXrChHSxjX63loe7m4zhn1jkolnlo1r/mrrWtqfSvK3Tvq/Vv7DVwLHe0L3e0rvg08Dz89j09Nn09O0mCXiuAAAAAXRSTlMAQObYZgAAASZJREFUOE/tkNlWwzAMRGuDG/ZdEDZDG8TasA1Q+/9/DElN2oTTwxtvzEsSzc2M7MHgX3+jEMLvPtFwKREaFamaLCNCMqGoqvpwGMKq933Aw3wUVNOk2PhIqU94oCxZESY64vsveeU+wTGWqStGH4h1HVkCzPxkhtR1CU8UBSh5ap6qoB4gC5JCU/Gv1vdIgKoDOEmgVIH45gx32zQiUsC1toOPSRKAdzrFye7ouSKtgDPEIWdfR0Po+AE7+wbIkjlDCMfytFPIBng5x9YBVZrm5cfMzgKQvSLCvD4Ca5vqw2dYhAHaosjkctycktkDTYcRDfJ03dpzX5bQMh1nv3Ixxq26ATbk2TEWyJs3obUXN6E3nDvSlrk9Q2ZQu6F+D37KdbSYfgM6VkDcNJNUdAAAAABJRU5ErkJggg=="/>'
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

var saveURLs = function(str) {
    "use strict";

    return str.replace(/([a-z]{3,6}\:\/\/[^\s]+)(\s[\*\_\%\-]|$|\s)/ig, function(match, a, b) {
        var safeurl = encodeURIComponent(a).replace(/\*/g, "%2A").replace(/\-/g, "%2D").replace(/\_/g, "%5F");
        var ending = b.length == 2 ? b.replace(" ", "") : b;
        return safeurl + ']' + ending;
    });
};

var restoreURLs = function(str) {
    "use strict";

    return str.replace(/([a-z]{3,6}\%3A\%2F\%2F[^\s<\*\_\-]+)](.?)/ig, function(match, a, b) {
        var txt, url;
        txt = decodeURIComponent(a);
        url = decodeURIComponent(a);

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

        if (txt.length > 63) {
            txt = txt.substring(0, 30) + '...' + txt.substring(txt.length - 30);
        }
        return '<a href="' + url + '" target="_blank">' + txt + '</a> ' + b;
    });
};

var saveCode = function(str) {
    "use strict";

    return str.replace(/(\`{1,2})([^\s]|[^\s].*?[^\s])\1/ig, function(match, a, b) {
        return '`' + encodeURIComponent(encodeURIComponent(b)).replace(/\*/g, "%2A").replace(/\-/g, "%2D").replace(/\_/g, "%5F") + '`';
    });
};

var restoreCode = function(str) {
    "use strict";

    return str.replace(/(\`)([^\s]|[^\s].*?[^\s])\`/ig, function(match, a, b) {
        return '<code>' + decodeURIComponent(decodeURIComponent(b)).replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;') + '</code>';
    });
};

var parseOneLineTags = function(match, tag, str) {
    "use strict";

    var tags = {
        "*":  ["<em>", "</em>"],
        "**": ["<strong>", "</strong>"],
        "_":  ["<em>", "</em>"],
        "__": ["<strong>", "</strong>"],
        "--": ["<strike>", "</strike>"]
    }, res;

    // fix escaping of %
    tags[_spoilerTag] = ['<span class="hidbord_spoiler">', "</span>"];

    res = tag === null ? saveURLs(saveCode(str)).replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;') : str;

    res = res.replace(/(\*\*|\*|\_\_|\_|\%\%|\-\-)(([^\s]|[^\s].*?[^\s])[\*\_]?)\1/g, parseOneLineTags);

    if (tag === null) {
        //imoticons
        res = res.replace(/\[(gin|kana|desu|boku|dawa|hina|kira|bara|meat|cake)\]/ig, function(match, a, b) {
            return imoticons[a.toLowerCase()];
        });
    }

    if (tag === null) {
        //reflinks
        res = res.replace(/(\&gt\;\&gt\;)([0-9a-f]{64})/ig, function(match, a, b) {
            return '<a href="javascript:;" alt="' + b + '" class="hidbord_msglink">&gt;&gt;' + b.substr(0, 8) + '</a>';
        });
    }

    if (tag === null) {
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

var jpegInserted = function(event) {
    "use strict";
    if (event.animationName == 'hidbordNodeInserted') {
        var jpgURL = $(event.target).closest('a').attr('href');
        var thumbURL = $(event.target).attr('src');
        var post_el = $(event.target).closest('.reply');
        var post_id = 0;

        if(post_el.length === 1){
            post_id = parseInt(post_el.attr('id').replace(/[^0-9]/g, ''));
            if(isNaN(post_id)){
                post_id = 0;
            }
        }

        getURLasAB(jpgURL, function(arrayBuffer, date) {
            var arc = jpegExtract(arrayBuffer);
//            console.log(arc);
            if(arc){
                var p = decodeMessage(arc);
//                console.log(p);
                if(p) do_decode(p, null, thumbURL, date, post_id);
            }            
        });
    }
};

$(function($) {
    "use strict";
    sjcl.random.startCollectors();

    var insertAnimation = ' hidbordNodeInserted{from{clip:rect(1px,auto,auto,auto);}to{clip:rect(0px,auto,auto,auto);}}',
        animationTrigger = '{animation-duration:0.001s;-o-animation-duration:0.001s;-ms-animation-duration:0.001s;-moz-animation-duration:0.001s;-webkit-animation-duration:0.001s;animation-name:hidbordNodeInserted;-o-animation-name:hidbordNodeInserted;-ms-animation-name:hidbordNodeInserted;-moz-animation-name:hidbordNodeInserted;-webkit-animation-name:hidbordNodeInserted;}';

    $('<style type="text/css">@keyframes ' + insertAnimation + '@-moz-keyframes ' + insertAnimation + '@-webkit-keyframes ' +
        insertAnimation + '@-ms-keyframes ' + insertAnimation + '@-o-keyframes ' + insertAnimation +
        'a[href*=jpg] img, a[href*=jpeg] img ' + animationTrigger + '</style>').appendTo('head');

    setTimeout(function() {
        $(document).bind('animationstart', jpegInserted).bind('MSAnimationStart', jpegInserted).bind('webkitAnimationStart', jpegInserted);
    }, 3000);

    if (ssGet('magic_desu_numbers')) {
        rsaProfile = ssGet('magic_desu_numbers');
        rsa.setPrivateEx(rsaProfile.n, '10001', rsaProfile.d, rsaProfile.p, rsaProfile.q, rsaProfile.dmp1, rsaProfile.dmq1, rsaProfile.coeff);
        rsa_hash = hex_sha1(rsaProfile.n);
        rsa_hashB64 = hex2b64(rsa_hash);
    }


    inject_ui();

    render_contact();

});

})();
