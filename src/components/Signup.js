import React,{useState} from 'react'
import { useHistory } from 'react-router-dom'

const Signup = (props) => {
    const [credentials, setcredentials] = useState({Name:"",email:"",password: "",cpassword:""})
    let history = useHistory()
    const handleSubmit= async(e)=>{
        e.preventDefault();
        const{Name,email,password} = credentials;
       
         //API CALL
            const response = await fetch("http://localhost:5000/api/auth/createuser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                
              },
               body: JSON.stringify({Name,email,password}) 
            });
            const json = await response.json()
            console.log(json);
            if(json.success){
                //save the auth token and redirect
                localStorage.setItem('token',json.authtoken);
                history.push("/");
                props.showAlert("Account created successfully","success")
            }
            else{
               props.showAlert("Invalid credentials","danger")
            }
       }
         const onChange=(e)=>{
        setcredentials({...credentials,[e.target.name]:e.target.value})
        //spread operator
       }
   
  return (
    <div className= "container mx-3, my-3">
        <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="Name" className="form-label">Name</label>
    <input type="text" className="form-control" id="name" name ="Name"onChange={onChange} aria-describedby="emailHelp"/>
 </div>
 <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name="email"onChange={onChange} aria-describedby="emailHelp"/>
 </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password"name="password" onChange={onChange}minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label"> Confirm Password</label>
    <input type="password" className="form-control" id="cpassword"name="cpassword"onChange={onChange}minLength={5} required/>
  </div>

  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Signup
