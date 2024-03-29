import React,{useContext} from 'react'
import noteContext from "../context api/notes/noteContext";


const Noteitem = (props) => {
    const context = useContext(noteContext);
    const {deleteNote} = context;
    const {note,updateNote} = props;
  return (
    <div className="col-md-3">
      {/* {note.title}
      {note.description} */}
      <div className="card my-2" >
  
  <div className="card-body">
    <h5 className="card-title">{note.title}</h5>
    
    <i className="far fa-trash-alt mx-2" onClick={()=>{deleteNote(note._id);props.showAlert("Deleted successfully","success")}}></i>
    <i className="far fa-edit mx-2"onClick={()=>{updateNote(note)}}></i>
  </div>
  <p className="card-text">{note.description} </p>
</div>
    </div>
    
  )
}

export default Noteitem
