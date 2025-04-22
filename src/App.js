import { React, useState } from 'react';
import './App.css';
import AddNftForm from './AddNftForm';
import MyWeb3Helper from './MyWeb3Helper';
import NFTList from './NFTList';
import pdf1 from './eTitolUniversitari.pdf';
import pdf2 from "./Impresió d'expedient.pdf";
import pdf3 from './sample.pdf';
import avatar from './avatar.png';

function App() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-container">
          <div className="header-user">
            <div className="header-user-avatar">
              <img src={avatar} alt="User Avatar" />
            </div>
            <div className="header-user-details">
              <div className="header-user-name">John Doe</div>
              <div className="header-user-address">
                0xeC1....F08A
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="main">
        <div className="main-container">
          <h1 className="main-title">My NFT Collection</h1>
          <div className="content-container">
            <div
              className={`slide-bar ${showForm ? "active" : ""}`}
              style={{ width: showForm ? "30%" : "0", height: "100%" }}
            >
              <AddNftForm />
            </div>
            <div className="user-nfts">
              <NFTList />
            </div>
          </div>
          <div className="add-nft-btn-container">
            <button
              className="add-nft-btn"
              onClick={toggleForm}
              style={{ order: showForm ? -1 : 1 }}
            >
              Add NFT
            </button>
          </div>

        </div>
      </main>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-text">
            © 2023 My NFT Collection. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}


export default App;
