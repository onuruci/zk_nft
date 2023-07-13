import builder from './witness_calculator';
import { BigNumber, BigNumberish } from "ethers";

const snarkjs = require("snarkjs");

export const makeProof = async (_proofInput: any, _wasm: string, _zkey: string) => {
  const wasmFile = await fetch("http://localhost:3000/main.wasm").then(res => res.arrayBuffer());
  const wasmCalc = await builder(wasmFile);

  const wtns = await wasmCalc.calculateWTNSBin(_proofInput, 0);

  const { proof, publicSignals } = await snarkjs.groth16.prove("http://localhost:3000/main_0001.zkey", wtns);

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


export const generateCall = async (_proof: any, _publicSignals: any) => {
  let res = {
    a: [_proof.pi_a[0], _proof.pi_a[1]],
    b: [_proof.pi_b[0].reverse(), _proof.pi_b[1].reverse()] as [
      [bigint, bigint],
      [bigint, bigint]
    ],
    c: [_proof.pi_c[0], _proof.pi_c[1]],
    _publicSignals
  };
  return res;
}

