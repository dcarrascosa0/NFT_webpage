import { Contract } from '@ethersproject/contracts';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import Card from './Card';
import MyNFT from './MyNFT.json'



class MyWeb3Helper {
  constructor() {
    this.alchemyApiKey = "https://polygon-mumbai.g.alchemy.com/v2/Wpo_uP_sn4DEZ7W3EyOBLlZUrjM98ELi";
    this.web3 = createAlchemyWeb3(this.alchemyApiKey);
    this.address = null;
    this.contractAddress = "0x3C32Dcc02c2737a84F89046532958eE0e750DEF1";
    this.contractAbi = require("./MyNFT.json");
  }
  
  async loadNFTs() {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const certificates = await contract.methods.getAllCertificates(this.address).call();
      const nfts = [];
      
      for (let i = 0; i < certificates.length; i++) {
        const certificate = certificates[i];
        const nft = {
          id: certificate.tokenId,
          name: certificate.name,
          pdf: certificate.pdf,
          institution: certificate.institution,
        };
        nfts.push(nft);
      }
      
      return nfts;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  


  async mintNFT(name, pdf, institution) {
    const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
    try {
      const result = await contract.methods.mint(this.address, name, pdf, institution).send({ from: this.address });
      console.log(`Transaction successful. Transaction hash: ${result.transactionHash}`);
      return result;
    } catch (error) {
      console.error(`Transaction failed: ${error.message}`);
      throw error;
    }
  }  

  async connect() {
    const [address] = await this.web3.eth.getAccounts();
    this.address = address;
  }

  renderCards() {
    return this.nfts.map((nft) => <Card key={nft.id} nft={nft} />);
  }
}

export default MyWeb3Helper;
