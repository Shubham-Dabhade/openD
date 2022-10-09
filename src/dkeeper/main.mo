import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";


actor OpenD{

  //creating a private type to store items Owner and Price info

  private type Listing={
    itemOwner:Principal;
    itemPrice:Nat;
  };


//creating a new data store to keep track of newly minted nfts
  var mapOfNFts = HashMap.HashMap<Principal,NFTActorClass.NFT>(1,Principal.equal,Principal.hash);
//creating the store for storing the owner of nfts
var mapOfOwners= HashMap.HashMap<Principal,List.List<Principal>>(1,Principal.equal,Principal.hash);//unlike the hashmap of nfts for owner we need to create a list of nfts linked to a single key of the user as a user can own multiple nft's

//creating a hashmap which will keep track of listings of the nfts to be sold
var mapOfListings=HashMap.HashMap<Principal,Listing>(1,Principal.equal,Principal.hash);


//creating a function to mint nfts taking in the required data
  public shared(msg) func mint( imgData: [Nat8],name:Text): async Principal{
    let owner: Principal = msg.caller;


    Debug.print(debug_show(Cycles.balance()));
    //adding the cycles for creating and keeping the newly created canister running,locally it don't mind if we don't put any cycles but when we upload it on live icp blockchain it will require these cycles
    Cycles.add(100_500_000_000);
    let newNFT = await NFTActorClass.NFT(name, owner, imgData);
    Debug.print(debug_show(Cycles.balance()));

    let newNFTPrincipal = await newNFT.getCanisterId();

    //here we put the newly generated nft with its principal  id as the key and NFT as the value
    mapOfNFts.put(newNFTPrincipal,newNFT);
    addToOwnerShipMap(owner,newNFTPrincipal);
    
    return newNFTPrincipal;
  };
  


  //creating a function to add the ownership of the nft's

  private func addToOwnerShipMap(owner:Principal,nftId:Principal){

    var ownedNFTs:List.List<Principal> = switch (mapOfOwners.get(owner)){
      case null List.nil<Principal>();
      case (?result) result;
    };

    //setting the newly minted nfts principal id to the ownedNFT's list

    ownedNFTs:=List.push(nftId,ownedNFTs);

    mapOfOwners.put(owner,ownedNFTs);


  };


  //creating a query function to convert the list of principal ids to an array which can be shown in the frontend

    public query func getOwnedNFTs(user:Principal): async [Principal]{

      var userNFTs: List.List<Principal> = switch (mapOfOwners.get(user)){

        case null List.nil<Principal>();
        case (?result) result;
      }; 

      return List.toArray(userNFTs);
    };


    //creating a function for nfts to be sold in a list
    public shared(msg) func listItem(id:Principal,price:Nat): async Text{
      var item: NFTActorClass.NFT= switch (mapOfNFts.get(id)){
        case null return "NFT does not exist";
        case (?result) result;
      };

      //checking whether the user making the request to list nft is present in mapOwner if not means he/she is not the owner
      let owner = await item.getOwner();
      if(Principal.equal(owner,msg.caller)){
        let newListing:Listing={
          itemOwner=owner;
          itemPrice=price;
        };
        mapOfListings.put(id,newListing);
        return "Success";
      }else{
        return "Your don't own the nft";

      }

    };


    //getting the canister id of this opend actor

    public query func getOpenDCanisterID() : async Principal{
      return Principal.fromActor(OpenD);
    };
}
