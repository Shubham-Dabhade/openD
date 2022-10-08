import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";


actor OpenD{

  public shared(msg) func mint( imgData: [Nat8],name:Text): async Principal{
    let owner: Principal = msg.caller;


    Debug.print(debug_show(Cycles.balance()));
    //adding the cycles for creating and keeping the newly created canister running,locally it don't mind if we don't put any cycles but when we upload it on live icp blockchain it will require these cycles
    Cycles.add(100_500_000_000);
    let newNFT = await NFTActorClass.NFT(name, owner, imgData);
    Debug.print(debug_show(Cycles.balance()));

    let newNFTPrincipal = await newNFT.getCanisterId();
    
    return newNFTPrincipal;
  }
  
}
