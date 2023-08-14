import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSeeker } from "../../app/features/seekerSlice";
import logo from '../../images/logo.png'
 function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage,setErrorMessage] = useState("");
  const [formData,setFormdata] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    verificationCode:''
  });
  const [formError, setFormError] = useState({});
  const [verifying,setVerifying]=useState(false)
  const [timer,setTimer]=useState(600)
  const [resendEnabled,setResendEnabled]=useState(false)
  const [alert,setAlert]=useState(false)
  
  

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
      email:formData.email
      }
      axios.post('seeker/verify-email',data,{withCredentials:true}).then(()=>{
      setAlert(true)
      setVerifying(true)
      startTimer()
      }).catch((err)=>{
        setErrorMessage(err.response.data);
      })


  }

  

  const handleValidation=()=>{
    const fNameRegex = /^[a-zA-Z]+$/;
    const lNameRegex = /^[a-zA-Z]+$/;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /.{8,}/;

    // Check if input values are valid
    const errors = {};
    if (!formData.fName.match(fNameRegex)) {
      errors.fName = "First name should contain only alphabets";
    }
    if (!formData.lName.match(lNameRegex)) {
       errors.lName = "Last name should contain only alphabets";
    }
    if (!formData.email.match(emailRegex)) {
       errors.email = "Invalid email address";
    }
    if (!formData.password.match(passwordRegex)) {
       errors.password = "Password should contain at least 8 characters";
    }
    if(verifying){
      if(formData.verificationCode.trim().length<6){
        errors.verificationCode="Please enter a valid code"
      }
    }

 
    setFormError(errors);
    if (Object.keys(errors).length !== 0) {
        return false
    }
    return true
  }




  const handleRegister=()=>{

    if(handleValidation()){
    axios
      .post(`/seeker/signup`,formData,{ withCredentials: true })
      .then(({ data }) =>{
        console.log(data);
        dispatch(setSeeker( data.seeker ));
        navigate("/");
      })
      .catch((error) =>{
        if (error.response&&error.response.status === 422) {
          setFormError(error.response.data.errors);
        } else {
          setErrorMessage(error.response.data);
        }
      });
    }
  }




  const handleSubmit = async(e) => {
    e.preventDefault();
    
    
     if(handleValidation()){
      handleEmailVerification()
     } 
 
  };



  const handleCallbackResponse =useCallback((response)=>{
    const token = response.credential;
    axios
      .post(`/seeker/googleSignIn`,{ token },{ withCredentials: true })
      .then(({data}) => {
        dispatch(setSeeker(data.seeker));
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  },[dispatch,navigate])


  useEffect(() => {
    const google = window.google;
    google?.accounts?.id.initialize({
      client_id: process.env.REACT_APP_CLIENT_ID,
      callback: handleCallbackResponse,
    });
    google?.accounts?.id.renderButton(document.getElementById("signInButton"),{
      theme:"outline",
      size:"large",
    });
  },[handleCallbackResponse]);


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
           <Box marginBottom={3} display={"flex"} justifyContent={'center'} width='100%'> 
            <img width={100} src={logo} alt="logo" />
            </Box>
          <Typography color={"red"} textAlign={"center"}>
            {errorMessage}
          </Typography>

          <Typography variant="h6" gutterBottom color={"primary"}>
           Sign up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              className="input"
              label="First Name"
              value={formData.fName}
              onChange={(e) =>
                setFormdata({ ...formData, fName: e.target.value })
              }
              margin="small"
              size="medium"
              fullWidth
              required
              error={!!formError.fName}
              helperText={formError.fName || " "}
            />
            {formError.lName && <p>{formError.lName}</p>}
            <TextField
              size="medium"
              label="Last Name"
              value={formData.lName}
              onChange={(e) =>
                setFormdata({ ...formData, lName: e.target.value })
              }
              margin="small"
              fullWidth
              required
              error={!!formError.lName}
              helperText={formError.lName || " "}
            />

           <TextField
              size="medium"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormdata({ ...formData, email: e.target.value })
              }
              margin="small"
              fullWidth
              error={!!formError.email}
              helperText={formError.email || " "}
              required
            />

           <TextField
              size="medium"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormdata({ ...formData, password: e.target.value })
              }
              margin="small"
              fullWidth
              required
              error={!!formError.password}
              helperText={formError.password||" "}
            />
              
           {verifying&& 
           <> 
            <TextField
              size="medium"
              label="Enter your 6 digit verification code"
              type="number"
              value={formData.verificationCode}
              onChange={(e) =>
                setFormdata({ ...formData, verificationCode: e.target.value })
              }
              margin="small"
              fullWidth
              error={!!formError.verificationCode}
              helperText={formError.verificationCode || " "}
              required
            />
            <Box display={'flex'} justifyContent={'space-between'}>
             {resendEnabled?<Button size="small" onClick={handleEmailVerification}>Resend code</Button>:
            <Typography color={'error'} variant="caption">Expires in {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60} 
      </Typography>}
            </Box>
              
            </>}
 
           {!verifying&& <Button onClick={()=>navigate('/login')} sx={{textTransform:'none'}}>
               <Typography>already have an account?</Typography>  
            </Button>}
          {!verifying&&<Button
              sx={{marginTop:2}}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Continue
            </Button>}
            </form>
           
          {verifying&&
            <Button
              sx={{marginTop:2}}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              onClick={handleRegister}
              disabled={formData.verificationCode.trim().length!==6}
            >
              Sign up
            </Button>}
            <Button id="signInButton" sx={{ marginTop: 1 }} fullWidth></Button>

        </Box>
      </Container>
    </div>
  );
}

export default Register;
