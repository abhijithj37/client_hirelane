import React, { useEffect, useState } from "react";
import Header from "../../Components/userComponents/Header";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import JobDetails from "../../Components/userComponents/JobDetails";
import JobPost from "../../Components/userComponents/JobPost";
import { useDispatch, useSelector } from "react-redux";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import axios from "../../axios";
import { setPostId, setPosts } from "../../app/features/jobSlice";
import server from "../../axios";
import { Form } from "react-router-dom";

function Home() {
  const [searchError, setSearchError] = useState(false);
  const [jobLocation, setJobLocation] = useState("");
  const [locationSuggessions, setLocationSuggessions] = useState([]);
  const [jobSuggessions, setJobsuggessions] = useState([]);
  const [jobKeyWord, setJobKeyword] = useState("");
  const dispatch=useDispatch();
  const { posts }=useSelector((state) =>state.posts);



  useEffect(() => {
    axios.get("/posts/verified-jobs",{withCredentials:true}).then(({ data }) => {
      dispatch(setPosts(data));
      dispatch(setPostId(data[0]?._id));
    });
  }, [dispatch]);





  const handleJobLocationChange = (value) => {
    const input = value;
    setJobLocation(input);

    if (input==="")return setLocationSuggessions([]);

    server
      .get(`/posts/locations?input=${input}`, {
        withCredentials:true,
      })
      .then(({ data }) => {
        setLocationSuggessions(data);
      })
      .catch((error)=>{
       console.log(error.message);
      });
  };



  const handleSelectSuggession=(suggession) => {
    const city = suggession.city;
    const state =suggession.state;
    setJobLocation(`${city},${state}`);
    setLocationSuggessions([]);
  };
  const handleJobKeyWordChange = (val) => {
    const input = val;
    setJobKeyword(val);
    if (input === "") return setJobsuggessions([]) 
    server
      .get(`posts/jobSuggessions?input=${input}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
         setJobsuggessions(data.jobs);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const handleSelectJobKeyoword=(suggession)=>{
    setJobKeyword(suggession);  
    setJobsuggessions([]);
  };
  const handleSearch=(e)=>{
    e.preventDefault();
    if (jobLocation === "" && jobKeyWord === "") return;
    const data = {
      jobKeyWord,
      jobLocation,
    };
    server
      .post("/posts/searchJob",data,{withCredentials:true})
      .then(({ data }) => {
         if(!data.jobs.length) return setSearchError(true);
        setSearchError(false)
        dispatch(setPosts(data.jobs));
        dispatch(setPostId(data.jobs[0]._id));
      })
      .catch((error)=>{
      console.log(error.message);
      });
  };

  return (
    <div>
      <Header></Header>

      <Form onSubmit={handleSearch}>
        <Container sx={{ padding: 2 }}>
          <Grid justifyContent={"center"} spacing={2} container>
            <Grid item xs={5}>
              <div style={{ position: "relative" }}>
                <TextField
                  placeholder="Job title,company or key word"
                  size="small"
                  fullWidth
                  value={jobKeyWord}
                  onChange={(e) => handleJobKeyWordChange(e.target.value)}
                ></TextField>
                {jobSuggessions.length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      backgroundColor: "#fff",
                      zIndex: "999",
                    }}
                  >
                    {jobSuggessions?.map((suggession) => (
                      <MenuItem
                        key={suggession._id}
                        onClick={() =>
                          handleSelectJobKeyoword(suggession.jobTitle)
                        }
                      >
                        {suggession.jobTitle}
                      </MenuItem>
                    ))}
                  </Box>
                )}
              </div>
            </Grid>
            <Grid item xs={5}>
              <div style={{ position: "relative" }}>
                <TextField
                  placeholder="city,state or pincode"
                  size="small"
                  fullWidth
                  value={jobLocation}
                  onChange={(e) => handleJobLocationChange(e.target.value)}
                ></TextField>
                {locationSuggessions.length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      backgroundColor: "#fff",
                      zIndex: "999",
                    }}
                  >
                    {locationSuggessions.map((location) => (
                      <MenuItem
                        key={location._id}
                        onClick={() => handleSelectSuggession(location)}
                      >
                        {location.city},{location.state}
                      </MenuItem>
                    ))}
                  </Box>
                )}
              </div>
            </Grid>
            <Grid item xs={2}>
              <Button type="submit" variant="contained">
                Find jobs
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Form>
      

      <Divider sx={{ marginTop: 2 }}></Divider>
      {searchError ? (
        <>
          <Box
            width={"100%"}
            height={"100vh"}
            justifyContent={"center"}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography
              marginBottom={20}
              variant="h5"
              gutterBottom
              textAlign={"center"}
            >
              Your Search Did Not Match any Jobs
            </Typography>
            <ErrorOutlineIcon
              sx={{ width: 50, height: 50, marginBottom: 21 }}
            />
          </Box>
        </>
      ) : (
        <Container>
        <Grid marginTop={4} container spacing={2}>
          <Grid item xs={6}>
            <Box
              sx={{
                borderRadius: 2,
                boxShadow: "0px 3px 5px rgba(0,0,0,0.1)",
                padding: 2,
                maxHeight: "700px",
                overflowY: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Typography fontSize={15} variant="h6">
                Post your resume and find your next job!
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }}></Divider>

              {posts?.map((post, idx) => (
                <Box
                  onClick={() => {
                    dispatch(setPostId(post._id));
                  }}
                >
                  <JobPost key={post._id} post={post}></JobPost>
                </Box>
              ))}
            </Box>

            <Divider sx={{ marginTop: 2 }}></Divider>
          </Grid>

          <Grid item xs={6}>
            <JobDetails></JobDetails>
          </Grid>
        </Grid>
      </Container>
      )}
      
    </div>
  );
}
export default Home;
