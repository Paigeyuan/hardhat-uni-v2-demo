require("@nomicfoundation/hardhat-toolbox");
require("hardhat-laika");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {version: "0.5.16", settings: { optimizer: { enabled: true, runs: 200 } }},
      {version: "0.6.6", settings: { optimizer: { enabled: true, runs: 200 } }},
      {version: "0.8.17"},
    ]
  }
};
