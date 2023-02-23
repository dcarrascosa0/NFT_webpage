import React, { useEffect, useState } from 'react';
import MyWeb3Helper from './MyWeb3Helper';
import Card from './Card';


function NFTList() {
    const [nfts, setNfts] = useState([]);
  
    useEffect(() => {
      async function fetchNFTs() {
        const web3Helper = new MyWeb3Helper();
        await web3Helper.connect();
        setNfts(await web3Helper.loadNFTs());
      }
      fetchNFTs();
    }, []);

    if (nfts.length === 0) {
      return <div>Loading...</div>;
    }
  
    return (
      <>
        {nfts.map((nft) => (
          <Card
            key={nft.id}
            pdfUrl={nft.pdf}
            name={nft.name}
            image={nft.image}
            institution={nft.institution}
          />
        ))}
      </>
    );
  }
  


export default NFTList;

