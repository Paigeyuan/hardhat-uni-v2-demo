const hre = require("hardhat");

// change the pragma version from >=0.5.0 to ^0.6.6
// node_modules/@uniswap/lib/contracts/libraries/BitMath.sol
// node_modules/@uniswap/lib/contracts/libraries/FullMath.sol

async function main() {
  const [deployer, ...rest] = await hre.ethers.getSigners(); //เครื่องเราคือ 1 โหนด

  // Define Tokens
  const ERC20 = await hre.ethers.getContractFactory("ERC20");
  const tokenA = await ERC20.deploy(hre.ethers.utils.parseEther("1000"));
  const tokenB = await ERC20.deploy(hre.ethers.utils.parseEther("1000"));
  const weth = await ERC20.deploy(hre.ethers.utils.parseEther("1000")); // Mock purpose only

  // Deploy Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.deploy(deployer.address); //you address

  // Deploy Router
  const UniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router02 = await UniswapV2Router02.deploy(factory.address, weth.address);

  // approve
  await tokenA.approve(router02.address, hre.ethers.utils.parseEther("99999"))
  await tokenB.approve(router02.address, hre.ethers.utils.parseEther("99999"))

  // add liquidity
  await router02.addLiquidity(
    tokenA.address,
    tokenB.address,
    hre.ethers.utils.parseEther("5"),
    hre.ethers.utils.parseEther("5"),
    0,
    0,
    deployer.address,
    999999999999,
    { gasLimit: 9999999 }
  );

  // balance before swap
  console.log({
    tokenA: await tokenA.balanceOf(deployer.address),
    tokenB: await tokenB.balanceOf(deployer.address),
  })

  // swap
  await router02.swapExactTokensForTokens(
    hre.ethers.utils.parseEther("1"),
    hre.ethers.utils.parseEther("0.1"),
    [tokenA.address, tokenB.address],
    deployer.address,
    999999999999,
    { gasLimit: 9999999 }
  );

  // balance after swap
  console.log({
    tokenA: await tokenA.balanceOf(deployer.address),
    tokenB: await tokenB.balanceOf(deployer.address),
  })

  // get address of all contracts
  console.log({
    tokenA: tokenA.address,
    tokenB: tokenB.address,
    factory: factory.address,
    router02: router02.address,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});