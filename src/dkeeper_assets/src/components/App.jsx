// import React, { useEffect, useState } from "react";
// import Header from "./Header";
// import Footer from "./Footer";
// import Note from "./Note";
// import CreateArea from "./CreateArea";
// import { dkeeper } from "../../../declarations/dkeeper";

// function App() {
//   const [notes, setNotes] = useState([]);

//   function addNote(newNote) {
//     setNotes(prevNotes => {
//       dkeeper.createNote(newNote.title, newNote.content )
//       return [ newNote,...prevNotes];
//     });
//   }


//   useEffect(()=>{
//     console.log("UseEffect is triggered");
//     fetchData();
//   },[]);


//   async function fetchData(){
//     const notesArray=await dkeeper.readNotes();
//     setNotes(notesArray);
//   }

//   function deleteNote(id) {
//     dkeeper.removeNote(id);
//     setNotes(prevNotes => {
//       return prevNotes.filter((noteItem, index) => {
//         return index !== id;
//       });
//     });
//   }

//   return (
//     <div>
//       <Header />
//       <CreateArea onAdd={addNote} />
//       {notes.map((noteItem, index) => {
//         return (
//           <Note
//             key={index}
//             id={index}
//             title={noteItem.title}
//             content={noteItem.content}
//             onDelete={deleteNote}
//           />
//         );
//       })}
//       <Footer />
//     </div>
//   );
// }

// export default App;



import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import homeImage from "../../assets/home-img.png";
import Item from "./Item";

function App() {

  //canister id of nft
  const NFTID = "r7inp-6aaaa-aaaaa-aaabq-cai";


  return (
    <div className="App">
      <Header />
      <Item id={NFTID}/>
      // <img className="bottom-space" src={homeImage} />
      <Footer />
    </div>
  );
}

export default App;
