import Debug "mo:base/Debug";
import Principal "mo:base/Principal";


actor class NFT(name:Text,owner:Principal,content:[Nat8]){

    let itemName=name;
    let nftOwner=owner;
    let imageBytes = content;


    //creating a query function to get the name of the nft
    public query func getName(): async Text{
        return itemName;
    };

    //creating a query function to get the owner of the nft
    public query func getOwner(): async Principal{
        return nftOwner;
    };

    //creating a query function to get the image/asset of the nft
    public query func getAsset(): async [Nat8] {
        return imageBytes;
    };


};