import React,{useState}from 'react'
import { useHistory } from 'react-router-dom'

const Login = (props) => {
    const [credentials, setcredentials] = useState({email:"",password: ""})
    //const [password, setpassword] = useState("")
    let history = useHistory()
    const handleSubmit= async(e)=>{
        e.preventDefault();
       
         //API CALL
            const response = await fetch("http://localhost:5000/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                
              },
               body: JSON.stringify({email:credentials.email,password:credentials.password}) 
            });
            const json = await response.json()
            console.log(json);
            if(json.success){
                //save the auth token and redirect
                localStorage.setItem('token',json.authtoken);
                props.showAlert("Account created successfully","success")
                history.push("/");
               
            }
            else{
                props.showAlert("Invalid Details","danger")
            }
       }
         const onChange=(e)=>{
        setcredentials({...credentials,[e.target.Name]:e.target.value})
        //spread operator
       }
   



  return (
    <div className= "container mx-3 , my-3">
        <h2>Login to continue in iNoteBook</h2>
     <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name ="email" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control"value={credentials.password} onChange={onChange}  name="password" id="password"/>
  </div>
  <div className="mb-3 form-check">
    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
   
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Login
