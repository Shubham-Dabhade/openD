import Debug "mo:base/Debug";
import Principal "mo:base/Principal";


actor class NFT(name:Text,owner:Principal,content:[Nat8])=this{

    private let itemName=name;
    private var nftOwner=owner;
    private let imageBytes = content;


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

    //for getting the principal id of this nft actor
    public query func getCanisterId(): async Principal{
        return Principal.fromActor(this);
        //if it was a normal actor we could have just provided the actor name(i.e fromActor(NFT)) but as it is a class we binded it to "this" and provided it

    };



    //creating a transfer function 

    public shared(msg) func transferOwnership(newOwner:Principal): async Text{
        if(msg.caller == nftOwner){
            nftOwner:=newOwner;
            return "Success";
        }
        else{
            return "Error: Not initiated by NFT owner";
        }
    }

};