import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { BrowserRouter as Router ,Link ,Routes ,Route} from "react-router-dom";
import homeImage from "../../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { dkeeper } from "../../../declarations/dkeeper";
import CURRENT_USER_ID from "../index";

function Header() {

  const [useOwnedGallery,setOwnedGallery]=useState();

  async function getNFTs(){
    console.log(CURRENT_USER_ID);
    const userNFTIds=await dkeeper.getOwnedNFTs(CURRENT_USER_ID);
    console.log(userNFTIds);
    setOwnedGallery(<Gallery title="My NFT's" ids={userNFTIds}/>)
  };


  useEffect(()=>{
    getNFTs();
    console.log("inside use effect");
  },[])



  return (
    <Router forceRefresh={true}>
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
          <h5 className="Typography-root header-logo-text">
          <Link to="/">
            OpenD
          </Link>
          </h5>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/discover">
            Discover  
          </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/minter">
            Minter
          </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/collection">
            My NFTs
          </Link>
          </button>
        </div>
      </header>
    </div>
    <Routes>
      <Route exact path="/" element={<img className="bottom-space" src={homeImage} />}/>
      <Route exact path="/discover" element={ <h1>Discover</h1>}/>
      <Route exact path="/minter" element={<Minter/>}/>
      <Route exact path="/collection" element={useOwnedGallery}/>
    </Routes>
    </Router>
  );
}

export default Header;
