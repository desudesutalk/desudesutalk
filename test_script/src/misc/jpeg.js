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
        stegger.parse(img_container);
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
