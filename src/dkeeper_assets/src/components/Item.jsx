import React, { useEffect,useState } from "react";
import logo from "../../assets/logo.png";
import { Actor,HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { dkeeper } from "../../../declarations/dkeeper";
import CURRENT_USER_ID from "../index";
import PriceLable from "./PriceLabel";

function Item(props) {

  const[name,setName]=useState();
  const[owner,setOwner]=useState();
  const [image,setImage]=useState();
  const [button,setButton]=useState();
  const [priceInput,setPriceInput]=useState();
  const [loaderHidden,setLoaderHidden]=useState(true);
  const [blur,setBlur]=useState();
  const [sellStatus,setSellStatus]=useState("");
  const [priceLable,setPriceLabel]=useState();

  

  const id=props.id;

  //creating http to fetch the nft canister on frontend
  const localHost="http://localhost:8080/";
  const agent = new HttpAgent({host:localHost}); //so we created a new HttpAgent to make request using localhost

  //TODO: When deploying, remove the following line
  agent.fetchRootKey();


  let NFTActor;

  //bringing in the nft canister
  async function loadNFT(){
    NFTActor = await Actor.createActor(idlFactory,{
      agent,
      canisterId:id,
    });
    const name = await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer],{type: "image/png"})
    );
    setName(name);
    setOwner(owner.toText());
    setImage(image);
    if(props.role=="collection"){
      const nftIsListed = await dkeeper.isListed(props.id);
      if(nftIsListed){
        setOwner("OpenD");
        setBlur({filter:"blur(4px)"});
        setSellStatus("Listed");
      }else{
        setButton(<Button handleClick={handleSale} text={"Sell"}/>)
      }
    }else if(props.role=="discover"){
      const originalOwner= await dkeeper.getOriginalOwner(props.id);
      if(originalOwner.toText() != CURRENT_USER_ID.toText()){
        setButton(<Button handleClick={handleBuy} text={"Buy"}/>)
      }

      const price= await dkeeper.getNFTPrice(props.id);
      console.log(price);
      setPriceLabel(<PriceLable sellPrice={price.toString()}/>);


    }

  };


  //creating a function to buy nfts
  async function handleBuy(){

    console.log("Buy");
  }



  let price;

  //creating a function to be sent as a prop in the button for handeling sell
  function handleSale(){
    console.log("Sale clicked");
    setPriceInput(<input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={price}
      onChange={(e)=>price=e.target.value} 
    />);

    setButton(<Button handleClick={sellItem} text={"Confirm"}/>);
  }

  //creating a function to sell item
  async function sellItem(){
    setBlur({filter:"blur(4px)"});
    setLoaderHidden(false);
    console.log("confirm clicked"); 
   const listingResult= await dkeeper.listItem(props.id,Number(price));
   console.log("Listing: "+listingResult);
   if(listingResult=="Success"){
    const openDId= await dkeeper.getOpenDCanisterID();
    const transferResult=await NFTActor.transferOwnership(openDId);
    console.log(transferResult);
    if(transferResult=="Success"){
      setLoaderHidden(true);
      setButton();
      setPriceInput();
      setOwner("OpenD");
      setSellStatus("Listed");
    }
   }

  }



  useEffect(()=>{
    loadNFT();
    console.log("inside load nft");
  },[])

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
        {priceLable}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
