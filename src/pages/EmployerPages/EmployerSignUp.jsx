import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
   
  
} from "@mui/material";
import axios from "../../axios"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEmployer } from "../../app/features/employerSlice";
 function EmployerSignUp(){
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [errorMessage,setErrorMessage] = useState("");
  
  const [alert,setAlert]=useState(false) 
  const[name,setName]=useState('')
  const[companyName,setCompanyName]=useState('')
  const[companySize,setCompanySize]=useState('')
  const[phone,setPhone]=useState('')
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState('')
  const[verificationCode,setVerificationCode]=useState('')

  


  const [verifying,setVerifying]=useState(false)
  const [timer,setTimer]=useState(600)
  const [resendEnabled,setResendEnabled]=useState(false)




  const startTimer = () => {
    setResendEnabled(false)
    setTimer(600)
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval);
          setResendEnabled(true)
          return 
        }
        return prevTimer - 1
      });
    }, 1000);
  };


  const handleEmailVerification=()=> {

     const data={
      email
      }
      axios.post('employer/verify-email',data,{withCredentials:true}).then(()=>{
       setAlert(true)
      setVerifying(true)
      startTimer()
      }).catch((err)=>{
        if(err.response){
          setErrorMessage(err.response.data)
        }
       })


  }




  const handleValidation=()=>{
    const nameRegex=/^[a-zA-Z\s]+$/
    const companyNameRegex=/^[a-zA-Z]+$/;
    const emailRegex=/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex=/.{8,}/;
    const phoneRegex=/^\d{10}$/
 
    // Check if input values are valid
    
    if (!name.trim().match(nameRegex)) {
      setErrorMessage("First name should contain only alphabets")
      return false
    } 
    if (!companyName.match(companyNameRegex)) {
      setErrorMessage("Last name should contain only alphabets")
      return false
    }
    if (!email.match(emailRegex)){
      setErrorMessage("Invalid email address")
      return false
    }
    if (!phone.match(phoneRegex)){
      setErrorMessage("Please Enter a valid phone number")
      return false
      }
    if (!password.match(passwordRegex)) {
      setErrorMessage("Password should contain at least 8 characters")
      return false
    }
    if (companySize==="") {
       setErrorMessage("Invalid credential")
       return false
    }

    if(verifying){
      if(verificationCode.trim().length<6){
        setErrorMessage("Please enter a valid code")
        return false
      }
    }

    setErrorMessage('')
    return true
  }



  const handleRegister=()=>{
    if(handleValidation()){
      
      const data={
        name,
        email,
        companyName,
        companySize,
        phone,
        password,
        verificationCode
      }
      axios
      .post(`/employer/signup`,data,{withCredentials:true})
      .then((res)=>{
        dispatch(setEmployer(res.data.user))
         navigate("/employer");
       })
       .catch((error) => {
        if (error.response && error.response.status === 422){
        console.log(error.response.data.errors,'errors')
        } else {
          setErrorMessage(error.response.data);
        }  
      });
    }
  }


  const handleSubmit=(e) =>{

    // Define validation rules
    if(handleValidation()){
      handleEmailVerification()
     } 

    
  };

   
  return (
    <div className="signUp">
      <Snackbar  anchorOrigin={{vertical:'top',horizontal:'center'}}  onClose={()=>setAlert(false)} open={alert} autoHideDuration={7000} >
      <Alert onClose={()=>setAlert(false)} severity="success" sx={{ width: '100%' }}>
    Enter the verification code sent to your Email
  </Alert>
</Snackbar> 
      <Container maxWidth="xs">
        <img src="" alt="" />
        <Box
          padding={8}
          marginTop={12}
          sx={{
            bordercolor: "blue",
            border:1,
            padding:2,
            boxShadow:2,
            borderRadius:2,
            borderColor:"lightgray",
          }}
        >
          <Typography color={"red"} textAlign={"center"}>
            {errorMessage}
          </Typography>
    
          <Typography variant="h5" marginBottom={2} gutterBottom color={"secondary"}>
            Employer Sign Up
          </Typography>
        
            <TextField
              className="input"
              label="Enter Your Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }

   
              margin="normal"
              size="small"
              fullWidth
              required
 
            />

            <TextField
              size="small"
              label="Your Company Name"
              value={companyName}
              onChange={(e) =>
                setCompanyName(e.target.value)
              }
              margin="normal"
              fullWidth
              required
             />
            <TextField
              size="small"
              label=" Company Size"
              value={companySize}
              onChange={(e) =>
                setCompanySize(e.target.value)
              }
              margin="normal"
              fullWidth
              required
               type='number'
            />
            <TextField
              size="small"
              label="Email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              margin="normal"
              fullWidth
               required
            />
            <TextField
              size="small"
              label="Your Phone Number"
              type="number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              margin="normal"
              fullWidth
               required
            />

            <TextField
              size="small"
              label="Password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              margin="normal"
              fullWidth
              required
             />

{verifying&& 
           <> 
            <TextField
              size="small"
              label="Enter your 6 digit verification code"
              type="number"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(e.target.value)
              }
              margin="normal"
              fullWidth
                required
            />
            <Box display={'flex'} justifyContent={'space-between'}>
             {resendEnabled?<Button size="small" onClick={handleEmailVerification}>Resend code</Button>:
            <Typography color={'error'} variant="caption">Expires in {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60} 
      </Typography>}
            </Box>
              
            </>}
            {!verifying&& <Button onClick={()=>navigate('/employerLogin')} sx={{textTransform:'none'}}>
               <Typography>already have an account?</Typography>  
            </Button>}

             {!verifying&&<Button
              sx={{marginTop:2}}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              Continue
            </Button>}
           
           {verifying&&
            <Button
              sx={{marginTop:2}}
              variant="contained"
              color="primary"
              
              fullWidth
              onClick={handleRegister}
              disabled={verificationCode.trim().length!==6}
            >
              Sign up
            </Button>}
        </Box>
      </Container>
    </div>
  );
}
export default EmployerSignUp