import builder from './witness_calculator';

const snarkjs = require("snarkjs");

export const makeProof = async (_proofInput: any, _wasm: string, _zkey: string) => {
  console.log("1");
  const wasmFile = await fetch("http://localhost:3000/main.wasm").then(res => res.arrayBuffer());
  console.log("2");
  const wasmCalc = await builder(wasmFile);
  console.log("3");
  console.log(_proofInput);
  console.log(wasmCalc);

  const wtns = await wasmCalc.calculateWTNSBin(_proofInput, 0);
  console.log("4");



  const { proof, publicSignals } = await snarkjs.groth16.prove("http://localhost:3000/main_0001.zkey", wtns);
  console.log("5");
  return { proof, publicSignals };
};


// export const makeProof = async (_proofInput: any, _wasm: string, _zkey: string) => {
//   const { proof, publicSignals } = await snarkjs.groth16.fullProve(_proofInput, _wasm, _zkey);
//   return { proof, publicSignals };
// };

export const verifyProof = async (_verificationkey: string, signals: any, proof: any) => {
  const vkey = await fetch(_verificationkey).then(function (res) {
    return res.json();
  });

  const res = await snarkjs.groth16.verify(vkey, signals, proof);
  return res;
};


