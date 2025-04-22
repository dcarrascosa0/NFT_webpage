# My NFT Certificate Collection

### Author
**David Carrascosa Victori**


A full‑stack dApp for turning PDF certificates into ERC‑721 NFTs on the **Polygon Mumbai** testnet. The front‑end is built with React; storage is handled by [Web3 Storage](https://web3.storage) (IPFS/Filecoin); blockchain interactions use **Alchemy** and an on‑chain contract `MyNFT.sol`.

---
## ✨ Features

| | |
|---|---|
| **Mint certificates as NFTs** | Upload a PDF, store it on IPFS, and mint a token that records the document CID, name, and issuing institution. |
| **Wallet‑scoped gallery** | Load and display every certificate owned by the connected address. |
| **Inline PDF preview** | First page of each PDF is rendered to a canvas thumbnail; clicking opens a modal with all pages. |
| **Gas‑efficient contract** | Single transaction to store metadata on‑chain; no off‑chain metadata server required. |

---
## 🗂 Project structure

```text
├── public/
│   └── pdf.worker.js               # pdf.js worker copied here by index.js
├── src/
│   ├── AddNftForm.js               # Upload form – PDF ➜ IPFS ➜ mint
│   ├── App.js                      # Layout & routing
│   ├── Card.js                     # Thumbnail + modal preview
│   ├── NFTList.js                  # Fetch & render owned NFTs
│   ├── MyWeb3Helper.js             # Ethers/Alchemy helpers
│   ├── MyWeb3Storage.js            # Web3.Storage helpers
│   ├── MyNFT.json                  # ABI (deployed at `0x3C32…DEF1`)
│   └── …                           # assets, CSS, tests
└── README.md                       # <— you are here
```

---
## 🚀 Quick start

1. **Clone & install**
   ```bash
   git clone https://github.com/your‑org/nft‑certificates.git
   cd nft‑certificates
   npm install
   ```
2. **Add environment variables** (create `.env` in project root):
   ```env
   REACT_APP_ALCHEMY_URL=https://polygon-mumbai.g.alchemy.com/v2/xxxxxxxxxxxxxxxx
   REACT_APP_WEB3STORAGE_TOKEN=YOUR_WEB3_STORAGE_API_TOKEN
   REACT_APP_CONTRACT_ADDRESS=0x3C32Dcc02c2737a84F89046532958eE0e750DEF1
   ```
   *The sample code uses hard‑coded values; moving them to env vars is recommended for production.*

3. **Run the front‑end**
   ```bash
   npm start
   ```
   The app opens at **http://localhost:3000**. Metamask will prompt you to connect; switch to the *Mumbai* test network.

---
## 🔍 How it works

1. **Upload & store (AddNftForm.js)**
   ```mermaid
   graph LR
   A[Select PDF] --> B[Web3Storage.storeFiles]
   B -->|CID| C[MyWeb3Helper.mintNFT]
   C -->|tx hash| D[Blockchain]
   ```
   * Only `application/pdf` files are accepted.
   * The returned `cid` is stored directly on‑chain – no JSON metadata layer.

2. **Smart contract (MyNFT.sol)**
   ```solidity
   struct Certificate {
       uint256 tokenId;
       string name;
       string pdf;         // CID from IPFS
       string institution;
   }

   function mint(address to, string memory name, string memory pdf, string memory institution) external;
   function getAllCertificates(address owner) external view returns (Certificate[] memory);
   ```
   *OpenZeppelin ERC‑721* under the hood; only the owner/minter can call `mint` in this implementation.

3. **Load gallery (NFTList.js)**
   * `MyWeb3Helper.loadNFTs()` calls `getAllCertificates`, builds an array of JS objects, and stores it in local state.
   * Each NFT becomes a `<Card>` component.

4. **Render preview (Card.js)**
   * `MyWeb3Storage.retrieveFiles(cid)` fetches the PDF from IPFS.
   * `pdf.js` rasterises each page to a `<canvas>`; the first canvas is converted to a JPEG data URL for the card background.
   * Clicking the card opens a modal showing every page as an `<img>`.

---
## 🛠 Scripts

| Command            | Purpose                          |
|--------------------|----------------------------------|
| `npm start`        | Start React dev server           |
| `npm run build`    | Production build                 |
| `npm test`         | Jest tests (if added)            |

---
## ⚙️ Configuration options

| Name                           | Default (demo)                                                          | Description |
|--------------------------------|---------------------------------------------------------------------------|-------------|
| `REACT_APP_ALCHEMY_URL`        | Hard‑coded in `MyWeb3Helper.js`                                          | JSON‑RPC endpoint for Polygon Mumbai |
| `REACT_APP_WEB3STORAGE_TOKEN`  | Hard‑coded in `MyWeb3Storage.js` ("testToken")                           | API key to upload/retrieve files |
| `REACT_APP_CONTRACT_ADDRESS`   | `0x3C32Dcc02c2737a84F89046532958eE0e750DEF1`                             | Deployed `MyNFT` address |

> **Security tip:** never commit real API keys or private keys; use `.env` + `.gitignore`.

---
## 🧪 Testing guidance

*Write unit tests with* **react‑testing‑library** *and* **jest‑mock‑axios** *to stub Alchemy & Web3.Storage.* Focus on:

- `AddNftForm` ➜ validates file type, calls helpers in correct order.
- `MyWeb3Helper.mintNFT` ➜ re‑throw on tx failure.
- `Card` ➜ renders canvas thumbnail once all pages resolved.

---
## ⚡ Roadmap ideas

- Move metadata off‑chain (ERC‑721 metadata JSON + on‑chain tokenURI).
- Add role‑based minting (only authorised institutions).
- Support other file types (e.g. images, ZIP) by detecting MIME.
- Pin CID via nft.storage for permanence.
- Progressive rendering while pages convert.

---
## 🤝 Contributing

1. Fork ➜ feature branch ➜ PR.
2. Commit messages: `feat: …`, `fix: …`, `docs: …`.
3. Run `npm run lint` before pushing.

---
## 📄 License

MIT © 2025 David Carrascosa Victori

---
## 🙏 Acknowledgements

- [web3.storage](https://web3.storage) for decentralized file storage
- [Alchemy](https://www.alchemy.com) for developer tooling
- [pdf.js](https://mozilla.github.io/pdf.js/) for client‑side PDF rendering
- [OpenZeppelin](https://openzeppelin.com) for secure Solidity libraries

