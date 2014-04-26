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
