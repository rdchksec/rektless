# rektless
Rektless is an MEV-powered solution, that allows owners of pre-exploited DeFi protocols to securely migrate funds in a decentralized maner, maintain community and prevent their brand from “rekt”.


## 4 steps to use Rektless approach: 
1. Pause your DeFi protocol (>30% of DeFi protcols has this option in smart contract)
2. Deploy a new version of DeFi protocol with fixed vulnerabilities 
3. Implement and deploy [IRektlessMigrator](demo-contracts/contracts/interfaces/IRektlessMigrator.sol)
4. Create [Rektless Profile](http://159.223.20.135/admin) and share the migration link with your community

Rektless platform will agregate signed users migration requests and send it as private MEV bundle wrapped with *unpause* and *pause* DeFi protcol transaction.

It will ensure that vulnarabale DeFi protcol will always be frozen, while funds will be migrated to a the brand new fixed version. 


## Admin Flow: 
![image](https://user-images.githubusercontent.com/15015250/138572088-f8823987-e430-45f6-9e9e-6d29a193c41e.png)
![image](https://user-images.githubusercontent.com/15015250/138572091-a5d19442-b1a8-405d-948e-9b7cd3526f17.png)
![image](https://user-images.githubusercontent.com/15015250/138572094-39481ab7-876a-4612-90aa-7b6e7c7650c3.png)
![image](https://user-images.githubusercontent.com/15015250/138572104-32242276-e7a5-4826-8308-d1174c437c3b.png)



## User Flow: 
![image](https://user-images.githubusercontent.com/15015250/138572114-64b1d429-aa1e-4bd9-b6b1-7cbdc8a16963.png)
![image](https://user-images.githubusercontent.com/15015250/138572118-a7f84295-8986-4517-bdca-1aa39bff92f6.png)
![image](https://user-images.githubusercontent.com/15015250/138572123-36d4ad02-b7a6-4894-98d9-a22cc1d3cd2f.png)



## Examples:
[Rektless Block](https://goerli.etherscan.io/txs?block=5723441) - users migrations request are bundled and wrapped with unpause/pause methods<br />
[Vulnarable DeFi protcol](https://goerli.etherscan.io/address/0xe5610f67b67dddb13c7219593ffc6d95f84a4a0e) <br />
[Fixed DeFi protcol](https://goerli.etherscan.io/address/0xee335d35025ed49d097c3a74ce1059d1decc3a54) <br />
[IRektlessMigrator implementation](https://goerli.etherscan.io/address/0x5d5a4eb196392b17989a6830a4e47dff49acd349) <br />

[Rektless Platform](http://159.223.20.135/admin) <br />



 
