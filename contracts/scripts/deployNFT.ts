import { ethers } from "hardhat";

async function main() {
  const punk = await ethers.deployContract("ZK_Punk", ["0x0BfB5066FF44cb822405E9840938d0d54cCd0694"]);

  await punk.waitForDeployment();

  console.log("Address: ", punk.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
