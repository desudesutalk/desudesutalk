var contacts = {}, keyPair = null;

var ECcrypt = ellipticjs.ec("ed25519"), 
    fieldSize = Math.ceil(ECcrypt.curve.red.prime.n / 8),
	ephemeral = [], i, j, res;



for (j = 0; j < 50; j++) {
	for (i = 0; i < 33; i++) {
		ephemeral.push( Math.floor(Math.random() * 256));
	}

	ephemeral[0] &= 1;
	ephemeral[0] |= 2;

	try{
		res = ECcrypt.keyPair(ephemeral).validate();
	}catch(E) {
		console.log('exception');
		res = {result: false};
	}
	if(!res.result) console.log(res, ephemeral);
		
}



