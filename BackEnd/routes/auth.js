const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = "Shashankgotjobwithhighpackages"


// ROUTE1: create a user using: POST "/api/auth/createuser". Dose not require auth.

router.post('/createuser',[
    body('Name','Enter a valid name').isLength({ min:3}),
    body('email','Enter a valid mail').isEmail(),
    body('password','password must be atleast 5 characters').isLength({ min: 5 }),
] , async (req,res)=>{
    let success = false;
    // if there are errors , return bad request and errors
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    //check whether the user with this email exists already
    try {
        
   
    let user = await User.findOne({email:req.body.email});
    
    if (user){
        return res.status(400).json({success,error: "sorry a user with this mail already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt)
    //create a new user
    user = await User.create({
        Name : req.body.Name,
        password:secPass,
        email: req.body.email,
       })
   // .then(user=> res.json(user))
    //   .catch(err=>{console.log(err)
    // res.json({error:"enter valid value",message:err.message})})
      const data = {
          user:{
              id: user.id
          }
      }
    //   const jwtData= jwt.sign(data,JWT_SECRET);
    //   console.log(jwtData);
      const authtoken= jwt.sign(data,JWT_SECRET);

      success = true;
      res.json({success,authtoken})
   
    // res.json({user})
    //catch error
   } catch (error) {
     console.error(error.message);
     res.status(500).send("Internal server error");
     //when find error it will show 500 status with error. 
        
   }
 })
  
//ROUTE2: Authenticate a user using: POST "/api/auth/login".No login required.
router.post('/login',[
   
    body('email','Enter a valid mail').isEmail(),
    body('password','password can not be blank').exists (),

] , async (req,res)=>{
    let success = false;

     // if there are errors , return bad request and errors
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            success = false
            return res.status(400).json({ errors:"please try to login with correct credentials" });
        }
        const passwordComapre = await bcrypt.compare(password,user.password);
        if(!passwordComapre){
            success = false
            return res.status(400).json({success, errors:"please try to login with correct credentials" });
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken= jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authtoken})

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
         
     }

})
//ROUTE3: Get loggedin user details using: POST "/api/auth/getuser". login required.
router.post('/getuser',fetchuser, async (req,res)=>{
  
try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
}
})
 module.exports = router


  //webtoken is use for verify the users

  
