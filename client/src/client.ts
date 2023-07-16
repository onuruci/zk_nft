import builder from './witness_calculator';
import { BigNumber, BigNumberish } from "ethers";

const snarkjs = window.snarkjs;

export const makeProof = async (_proofInput: any, _wasm: string, _zkey: string) => {
  console.log("a")
  const wasmFile = await fetch("https://zk-nft-server-5905033477fe.herokuapp.com/main.wasm").then(res => res.arrayBuffer());
  console.log("b");
  const wasmCalc = await builder(wasmFile);
  console.log("c");
  console.log("input: ", _proofInput);
  console.log(wasmCalc);
  const wtns = await wasmCalc.calculateWTNSBin(_proofInput, 0);
  console.log("d");

  const res = await fetch("https://zk-nft-server-5905033477fe.herokuapp.com/main_0001.zkey");
  console.log("e");
  let buf = await res.arrayBuffer();
  console.log("f");
  console.log("Buf: ", buf);
  let { proof, publicSignals } = await snarkjs.groth16.prove("https://zk-nft-server-5905033477fe.herokuapp.com/main_0001.zkey", wtns);

  //const { proof, publicSignals } = await snarkjs.groth16.prove(await fetch("https://zk-nft-server-5905033477fe.herokuapp.com/main_0001.zkey"), wtns);

  console.log("e");

  console.log("Proof: ", proof);
  console.log("Public Signals:  ", publicSignals);

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

