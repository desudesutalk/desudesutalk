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
