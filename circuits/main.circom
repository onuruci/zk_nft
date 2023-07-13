pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom";

template SecretNFT () {
    // private input
    signal input secret;
    // public inputs
    signal input address;
    signal input hash;
    signal output nullifier;
        
    component hashSecret = Poseidon(1);
    hashSecret.inputs[0] <== secret;

    hash === hashSecret.out;

    component nullifierHash = Poseidon(2);
    nullifierHash.inputs[0] <== secret;
    nullifierHash.inputs[1] <== address;

    nullifier <== nullifierHash.out;
}

component main { public [address, hash] } = SecretNFT();

/* INPUT = {
    "secret": "0x5468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
    "address": "0xBB17C136AbA99c03Ea7cc04d61105D8870DdDD3C",
    "hash": "15816790041894035629812969348918251598434796263086720583354417805817603431710"
} */
