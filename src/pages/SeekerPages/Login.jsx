import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  
 } from "@mui/material";
import axios from "../../axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSeeker } from "../../app/features/seekerSlice";
 

function Login(){
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState({});
  const [formData, setFormdata] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /.{8,}/;

    const errors = {};
    if (!formData.email.match(emailRegex)) {
       errors.email = "Invalid email address";
    }
    if (!formData.password.match(passwordRegex)) {
      errors.password = "Password should contain at least 8 characters";
    }

 
    setFormError(errors);
    if(Object.keys(errors).length !== 0) {
    return;
    }

    axios
      .post(`/seeker/login`,formData,{ withCredentials: true })
      .then(({ data })=>{
        dispatch(setSeeker(data.user));
        navigate("/");
      })
      .catch((error) => {
        if(error.response&&error.response.status === 422) {
          setFormError(error.response.data.errors);
        }else{
          setErrorMessage(error.response.data);
        }
      });
  };

 
   const  handleCallbackResponse = useCallback((response)=> {
    const token = response.credential;
    axios
      .post(`/seeker/googleSignIn`,{token},{withCredentials:true})
      .then(({data}) => {
        dispatch(setSeeker(data.seeker));
        navigate("/");
      })
      .catch((error) => {
        if(error.response&&error.response.status === 422){
          setFormError(error.response.data.errors);
        }else{
          setErrorMessage(error.response.data);
        }
      });
  },[dispatch,navigate])



  useEffect(() => {
    const google = window.google;
    google?.accounts?.id.initialize({
      client_id:process.env.REACT_APP_CLIENT_ID,
      callback:handleCallbackResponse,
    });
    google?.accounts?.id.renderButton(document.getElementById("signInButton"), {
      theme:"outline",
      size:"large",
    });
  }, [handleCallbackResponse]);

  return (
    <div>
      <Container maxWidth="xs">
        <Box
          padding={3}
          marginTop={15}

          sx={{
            bordercolor:"blue",
            border:1,
            boxShadow:2,
            borderRadius:2,
            borderColor:"lightgray",
          }}
        >
          <Typography textAlign={"center"} color={"red"}>
            {errorMessage}
          </Typography>
          <Typography
            marginBottom={3}
            variant="h5"
            gutterBottom
            color={"primary"}
          >
            Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormdata({ ...formData, email: e.target.value })
              }
              margin="normal"
              fullWidth
              required
              error={!!formError.email}
              helperText={formError.email || " "}
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e)=>
                setFormdata({...formData, password: e.target.value})
              }
              margin="normal"
              fullWidth
              required
              error={!!formError.password}
              helperText={formError.password || " "}
            />
            <Button sx={{textTransform:'none'}} onClick={()=>navigate('/signup')} >
              <Typography>
              Dont have an account?
              </Typography>
              
            </Button>
            <Button
              sx={{ marginTop: 2 }}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              login
            </Button>
          </form>

          <Button id="signInButton" sx={{ marginTop: 1 }} fullWidth></Button>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
