// This is the BlankVoucher component.
// It is the page-level component so it is being rendered based on its specified route.

import Head from 'next/head'
import { useState } from 'react';
import { ethers } from 'ethers';
import BlankLazyMinter from '../lib/BlankLazyMinter'
import { BlankArt } from '../contracts'
import {
  BlankButton,
  BlankLayout,
  TWCenteredContent
} from '../components'

const BlankVoucher = () => {
  const [voucher, setVoucher] = useState(null)
  
  const generateVoucher = async () => {
    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    
    const contractAddress = BlankArt.address;
  
    const contractAbi = BlankArt.abi;
  
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  
    const lazyMinter = new BlankLazyMinter({ contract, signer })
  
    try {
      await contract.name()
    } catch (e) {
      alert(`Contract not found. Please make sure you are on the correct network, ${BlankArt.network}`)
      return;
    }
  
    const name = await contract.name()
    const symbol = await contract.symbol()
    const voucherInput = document.getElementById('voucherAddress');
    const voucherAddress = voucherInput.value;
    let voucher = await lazyMinter.createVoucher(
      voucherAddress, 
      Math.round(Date.now() / 1000) + (60 * 60 * 24 * 14), 
      0, 
      55
    )
  
    setVoucher(voucher);
  
    document.querySelector("#content").innerHTML = `
      <div><b>Contract:</b> ${name} (${symbol})</div>
      <div><b>Address:</b> ${contractAddress}</div>
      <div><b>Signer:</b> ${voucherAddress}</div>
      <div><b>Voucher:</b> ${JSON.stringify(voucher || "N/A", null, "<br/>  ")}</div>
    `;
  }

  const mint = async () => {
    const voucherInput = document.getElementById('voucherAddress');
    const voucherAddress = voucherInput.value;
    const voucher = vouchers[voucherAddress]
    
    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const recipient = provider.getSigner();  
    const amount = 55;
    const contractAddress = BlankArt.address;
    const contractAbi = BlankArt.abi;
  
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
    const signer = contract.connect(recipient)
    
    try {
      const info = await signer.redeemVoucher(amount, voucher)
      const receipt = await info.wait();
      console.log(receipt)
    } catch (error) {
      if (error.error) {
        console.log(error.error.message)
      } else {
        console.log(error.message);
      }
    }
  }

  return (
    <div>
      <Head>
        <title>Blank.Foundation</title>
        <meta name="description" content="United by a blank canvas." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <BlankLayout>
        <TWCenteredContent>
          {voucher && 
            <div className="break-all max-w-md" id="content">
            </div>
          }
          {!voucher &&
            <div className='text-center'>
              <h1 className='text-xl mb-6'>Generate Voucher</h1>
              <div>
                <input id="voucherAddress" placeholder="Voucher Address" className="border px-3 py-1 w-64" />
              </div>
              <BlankButton
                onClick={mint}
              >
                Generate Voucher
              </BlankButton>
            </div>
          }
        </TWCenteredContent>
      </BlankLayout>
    </div>
  );
}

export default BlankVoucher;

const vouchers = {
  "0x670198F3526f1077C4ECDf5f837865FCde4D789F": {
    "redeemerAddress": "0x670198F3526f1077C4ECDf5f837865FCde4D789F",
    "expiration": 1639857783,
    "minPrice": 0,
    "tokenCount": 55,
    "signature": "0x96132e4531ea58f85c22d4c147d9d8ee3e66688be2fc80ea5bd0a8b6d33515a4496992ac80f3ac3d6067d3f63ec368a6a3dbdb559eea69948ebd6f7b0b8316be1c" 
  },
  "0x263Ea7Aeb309B7DA0eE2679B5b8DD76D56AB455e": {
    "redeemerAddress": "0x263Ea7Aeb309B7DA0eE2679B5b8DD76D56AB455e",
    "expiration": 1639858004,
    "minPrice": 0,
    "tokenCount": 55,
    "signature": "0xa0b433d35b76b4bda3bc9b3b4b5a527eb6e419bf406f1995acf4b32dede778f073c9053a43335fb96121260982e5684ef1e39c1aac92bc5345bed28ebfa56aa31b" 
  },
  "0xFBbA8ceA4e9835B9f304d6E69905cD9403F2b606": {
    "redeemerAddress": "0xFBbA8ceA4e9835B9f304d6E69905cD9403F2b606",
    "expiration": 1639858807,
    "minPrice": 0,
    "tokenCount": 55,
    "signature": "0x36a1982bbbcdae3487e09d3179e18bec9d0926701d92429fb09d0fcce2b50d4f4395a4fed99190feea625488145c551fa0fc822f81742671850b085ca039bd961b" 
  },
  "0xE722017542e2Bd6335C7A9877c2001ed2ffd0bf7": {
    "redeemerAddress": "0xE722017542e2Bd6335C7A9877c2001ed2ffd0bf7",
    "expiration": 1639858966,
    "minPrice": 0,
    "tokenCount": 55,
    "signature": "0xc223cd178d57ad63197e8bcc5bc4dbef16c3fe617036b1c1446863bebb825d9642a68ee953999e04b978695dea50e8a30bbf6199ed401d40cd13865869be3b561b" 
  },
  "0xc48097d7001f36f2646c812FBaaab3CC4f90DCEc": {
    "redeemerAddress": "0xc48097d7001f36f2646c812FBaaab3CC4f90DCEc",
    "expiration": 1639859039,
    "minPrice": 0,
    "tokenCount": 55,
    "signature": "0x50444c709fa54a565fe7766d76eeb19078909dc7ab24c4812f52d057888620524b685757023f03e7071728846f64c96fa77788dff722756cb1b90f02650cad551c" 
  },
  "0x143fb7d3Dd8a8c06c8Db1e94846e0f6B32497a7D": {
    "redeemerAddress": "0x143fb7d3Dd8a8c06c8Db1e94846e0f6B32497a7D",
    "expiration": 1639860139,
    "minPrice": 0,
    "tokenCount": 55,
    "signature": "0x132ef5c45b836aa304fecaa651d92b6413cbb11c98c47aa5b03324cd349dcba519acbef9e450f0d4fae6c47f5a3fc390458f1a5d0f01299d63615488cb769ac31b" 
  },
  "0x09527E337F3cCCc1bd688037A66B8516B319E31D": {
    "redeemerAddress": "0x09527E337F3cCCc1bd688037A66B8516B319E31D",
    "expiration": 1639860176,
    "minPrice": 0,
    "tokenCount": 55,
    "signature": "0xeea92010d78ef9432badbf783183bc730a8be6865d0556c44c2ee1b845f0329848c30fc38ae2e8ec2d41b30d110af2dc474c0e82cf975503ca867be7145ed73f1c" 
  },
  "0x31F10eF3B9D4A5DF6a0be39802aDB2C2625Acdee": {
    "redeemerAddress": "0x31F10eF3B9D4A5DF6a0be39802aDB2C2625Acdee",
    "expiration": 1639861740,
    "minPrice": 0,
    "tokenCount": 55,
    "signature": "0x3002be786596cb2d6f9c8fbe9cfd380731b72bd880a9dc51acc37739a0f680bb5f49fecc7957e11c925faaa37c5cb5782f8c5f2c24149fb5bf026ba9454f04851c" 
  },
  "0x5a6e005690B2C9a112e57c728d431c56c57e40D3": {
    "redeemerAddress": "0x5a6e005690B2C9a112e57c728d431c56c57e40D3",
    "expiration": 1639861833,
    "minPrice": 0,
    "tokenCount": 55,
    "signature": "0xb5fec6fa821dc3a4e3226d9e9ae9601603ff8ce8045ed893d015a6e058715f7475a4d20d966d93a2b065dcc34c692c32ba480b0fb179240bf6b6ac3757f8d2811c" 
  },
  "0x53FF400ACa8877A26f75f2A768c1DdabDa00eC8d": {
    "redeemerAddress": "0x53FF400ACa8877A26f75f2A768c1DdabDa00eC8d",
    "expiration": 1639869404,
    "minPrice": 0,
    "tokenCount": 55,
    "signature": "0x1f73c48924159401b63eb6af7211992ef85ce8b0720affa96e65488baf7bf4e1061a6c6ccc6ac839ce662062775bb87dd67d99816a651b67d077a338ad4629ca1b" 
  },
  "0x8fEb6AD42CDd39081803bbD9b058d65807aC1362": {
    "redeemerAddress": "0x8fEb6AD42CDd39081803bbD9b058d65807aC1362",
    "expiration": 1639869438,
    "minPrice": 0,
    "tokenCount": 55,
    "signature": "0xb29cf63a2c4c807d162c08b347ac2d0ebdf638456858124a8511a28331487a1e5d2d502fd089fb07bd947c800f78380732333cb2ccb53ca7b3a0c6efab8aa9651c" 
  },
  "": {},
  "": {}
}