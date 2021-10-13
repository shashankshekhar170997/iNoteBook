const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// ROUTE1: Get all the notes using: POST "/api/notes/createuser". Dose not require auth.

router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try {
        const notes = await Note.find({user:req.user.id});
        res.json(notes)
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
        //when find error it will show 500 status with error. 
           
      }
   
})
// ROUTE2: Add a new notes using: POST "/api/notes/addnote". Dose not require auth.

router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({ min:5 }),
    body('description','Description must be atleast 5 character').isLength({ min: 5 }),],
async(req,res)=>{

    try {
        
    
    const{title,description,tag}= req.body;
     // if there are errors , return bad request and errors
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note({
        title,description,tag,user:req.user.id

    })
    const savedNote = await note.save()

   
    
    res.json(savedNote)
 } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
    //when find error it will show 500 status with error. 
       
  }
})
// ROUTE3: Update a existing notes using: PUT "/api/notes/updatenote". login required.
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
const {title,description,tag} = req.body;
try {
    

//Create newNote object
const newNote = {};
if(title){newNote.title=title};
if(description){newNote.description=description};
if(tag){newNote.tag=tag};

//Find the note to be updated and update it.
let note = await Note.findById(req.params.id);
if(!note){return res.status(404).send("not found")}
if(note.user.toString() !== req.user.id){
    //note.user.toString() will return id.
  return res.status(401).send("not allowed");

}
 note = await Note.findByIdAndUpdate(req.params.id, {$set:newNote},{new:true})
res.json({note});
 
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
    //when find error it will show 500 status with error. 
       
  }
}) 


// ROUTE4: Delete an existing notes using: DELETE "/api/notes/updatenote". login required.
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
   try {
       
  
   
    //Find the note to be deleted and delete it.
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("not found")}
    if(note.user.toString() !== req.user.id){
        //Allow deletion only if user owns this note.
      return res.status(401).send("not allowed");
    
    }
     note = await Note.findByIdAndDelete(req.params.id)
    res.json({"sucess":"Note has been deleted",note:note});
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
    //when find error it will show 500 status with error. 
       
  }
    }) 
    
    
    
module.exports = router