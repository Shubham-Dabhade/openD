import List "mo:base/List";
import Debug "mo:base/Debug";

actor DKeeper{

  //creating a new data type to say the type of data to store
  public type Note={
    title:Text;
    content:Text;
  };

  ///creating a List to mention what to store in it
  var notes : List.List<Note> = List.nil<Note>();
  //we are mentioning here to create a varible which is a list to store Note objects and at start the list should be empty(i.e nil<Note>())


  public func createNote(titleText:Text,contentText:Text){

    //create a new note with type Note
    let newNote:Note={
      title=titleText;
      content=contentText;
    };

    notes := List.push(newNote,notes);
    Debug.print(debug_show(notes));
  }
}
