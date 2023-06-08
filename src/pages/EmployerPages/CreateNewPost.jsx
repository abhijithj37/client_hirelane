import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
  
} from "@mui/material";
import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import server from "../../axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function CreateNewPost() {
  const navigate = useNavigate();
  const {employer}=useSelector((state)=>state.employer)
  const [screeningQuestions, setScreeningQuestions] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [jobLocation, setJobLocation] = useState("");
  const [workPlaceType, setWorkPlaceType] = useState("On-Site");
  const [noOfOpenings, setNoOfOpenings] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState({});
  const [jobSuggessions, setJobsuggessions] = useState([]);
  const [locationError, setJobLocationError] = useState("");
  const [salaryFrom,setSalaryFrom]=useState('')
  const [salaryTo,setSalaryTo]=useState('')
  const [experience,setExperience]=useState('Entry-Level')
 


  const addScreeningQuestions=()=>{
    setScreeningQuestions([
      ...screeningQuestions,
      {question:"",responseType:"yesNo"},
    ]);
  };
  const handleQuestionChange = (index, question) => {
    const updatedScreeningQuestions = [...screeningQuestions];
    updatedScreeningQuestions[index].question = question;
    setScreeningQuestions(updatedScreeningQuestions);
  };

  const handleResponseTypeChange = (index, responseType) => {
    const updatedScreeningQuestions = [...screeningQuestions];
    updatedScreeningQuestions[index].responseType = responseType;
    setScreeningQuestions(updatedScreeningQuestions);
  };

  const handleDeleteQuestions = (index) => {
    setScreeningQuestions(screeningQuestions.filter((ques, i) => i !== index));
  };

  const handleJobPost = (e) => {
    e.preventDefault();
    const jobTitleRegex = /^[A-Za-z\s]+$/;
    const openingRegex = /^0*?[1-9]\d*$/;

    const errors = {};
    if (!jobTitle.match(jobTitleRegex)) {
      errors.jobTitle = "Job title should only contains alphabets";
    }
    if (!noOfOpenings.match(openingRegex)) {
      errors.noOfOpenings = "Invalid input";
    }

    if (description.length < 100) {
      errors.description = "Minimum 100 Characters Required";
    }
    if(screeningQuestions.length<3){
      errors.screeningQuestions="Please Add atleast 3 Screening Questions"
    }
    setFormError(errors);
    if (Object.keys(errors).length !== 0 || locationError) {
      return;
    }
    const data={
      screeningQuestions,
      jobTitle,
      jobType,
      jobLocation,
      workPlaceType,
      noOfOpenings,
      description,
      companyName:employer.companyName,
      experience,
      salaryFrom,
      salaryTo
    };
    server
      .post("/posts/postJob",data,{withCredentials:true})
      .then(()=>{
          navigate("/employer");
          window.alert('Job Posted  Successfully')
      })
      .catch((error) => { 
        console.log(error.message);
      });
  };
  const handleJobLocationChange = (value) => {
    const input=value;
    setJobLocation(input);

    if(input==="")return setJobsuggessions([]);
    server
      .get(`/posts/locations?input=${input}`,{
          withCredentials:true,
      }) 
      .then(({data})=>{
        setJobsuggessions(data);
      })
      .catch((error)=>{
      console.log(error.message);
      });

      if(!jobSuggessions.includes(jobLocation)) {
      setJobLocationError("Please Enter a valid location");
      }
  };
  const handleSelectSuggession = (suggession) => {
    const city = suggession.city;
    const state = suggession.state;
    setJobLocation(`${city},${state}`);
    setJobLocationError(null);
    setJobsuggessions([]);
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor:(theme)=>theme.palette.common.white,
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
   
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Grid container>
          {/*Chart*/}
          <Grid item xs={12} md={8} lg={12}>
            <form onSubmit={handleJobPost}>
              <Box
                sx={{
                  p: 2,
                  display:"flex",
                  flexDirection:"column",
                  minHeight:600,
                  position:"relative",
                }}
              >
                <Box sx={{ position: "" }}>
                  <Typography gutterBottom variant="h5">
                    Post a New Job
                  </Typography>
                  <Divider></Divider>
                </Box>
                <Grid container paddingBottom={3} paddingTop={3} spacing={1}>
                  <Grid item xs={12} lg={4} md={4}>
                    <TextField
                      fullWidth
                      variant="standard"
                      label="Job Title"
                      type="text"
                      size="small"
                      required
                      value={jobTitle}
                      onChange={(e)=>setJobTitle(e.target.value)}
                      error={!!formError.jobTitle}
                      helperText={formError.jobTitle || " "}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} lg={4} md={4}>
                    <TextField
                      fullWidth
                      select
                      variant="standard"
                      label="Work Place Type"
                      size="small"
                      value={workPlaceType}
                      onChange={(e) => setWorkPlaceType(e.target.value)}
                      required
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="On-Site">On-Site</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} lg={4} md={4}>
                    <div style={{ position: "relative" }}>
                      <TextField
                        fullWidth
                        variant="standard"
                        label="Job Location"
                        size="small"
                        value={jobLocation}
                        required
                        onChange={(e)=>
                          handleJobLocationChange(e.target.value)
                        }
                        placeholder="city,state"
                        error={!!locationError}
                        helperText={locationError || ""}
                      ></TextField>

                      {jobSuggessions.length > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            backgroundColor: "#fff",
                            zIndex: "999",
                          }}
                        >
                          {jobSuggessions.map((location) => (
                            <MenuItem
                              key={location._id}
                              onClick={()=>handleSelectSuggession(location)}
                            >
                              {location.city},{location.state}
                            </MenuItem>
                          ))}
                        </Box>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={4} md={4}>
                    <TextField
                      fullWidth
                      variant="standard"
                      label="Job Type"
                      size="small"
                      value={jobType}
                      required
                      select
                      SelectProps={{
                        native: true,
                      }}
                      onChange={(e) =>setJobType(e.target.value)}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Other">    Other</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="Internship">Internship</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} lg={4} md={4}>
                    <TextField
                      fullWidth
                      variant="standard"
                      label="No Of Openings"
                      size="small"
                      type="number"
                      value={noOfOpenings}
                      required
                      onChange={(e)=>setNoOfOpenings(e.target.value)}
                      error={!!formError.noOfOpenings}
                      helperText={formError.noOfOpenings||" "}
                    ></TextField>
                  </Grid>
        {/* *********************************************************************************Experience*********************************************************************** */}
                  <Grid item xs={12} lg={4} md={4}>
                    <TextField
                    
                      fullWidth
                      variant="standard"
                      label="Experience"
                      size="small"
                      select
                      value={experience}
                      required
                      onChange={(e)=>setExperience(e.target.value)}
                      error={!!formError.experience}
                      SelectProps={{
                      native: true,
                      }}
                      
                    >
                      <option value={'Entry-Level'}>Entry-Level</option>
                      <option value={'3-5 Years' }>3-5 Years</option>
                      <option value={'5-7 Years'}>5-7 Years</option>
                      <option value={'7-10 Years'}>7-10 Years</option>
                      <option value={'10+ Years'}>10+ Years </option>
                      <option value={'Fresher'}>Fresher</option>

                    </TextField>
                  </Grid>
                  <Grid  item lg={12}>
               <Typography fontWeight={'small'}>
                Salary Range
               </Typography>
               <Divider/>

                  </Grid>
                  <Grid item xs={12} lg={4} md={4}>
                    <TextField
                      fullWidth
                      
                      label="From"
                      size="small"
                      type="number"
                      value={salaryFrom}
                      required
                      onChange={(e)=>setSalaryFrom(e.target.value)}
                      error={!!formError.noOfOpenings}
                      helperText={formError.noOfOpenings || " "}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} lg={4} md={4}>
                    <TextField
                      fullWidth
                      
                      label="To"
                      size="small"
                      type="number"
                      value={salaryTo}
                      required
                      onChange={(e)=>setSalaryTo(e.target.value)}
                      error={!!formError.salaryTo}
                      helperText={formError.salaryTo || " "}
                    ></TextField>
                  </Grid>


                  <Grid item lg={12}>
                    <Typography variant="h6">Discription</Typography>
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <TextField
                      id="description"
                      label="Job Description"
                      multiline
                      rows={7}
                      variant="outlined"
                      fullWidth
                      value={description}
                      required
                      onChange={(e) => setDescription(e.target.value)}
                      error={!!formError.description}
                      helperText={formError.description || " "}
                    />
                  </Grid>
                  <Grid item lg={12}>
                    <Typography variant="h6">Screening Questions</Typography>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ borderRadius: 4, marginTop: 1 }}
                      color="success"
                      onClick={addScreeningQuestions}
                    >
                      Add Screening Questions
                    </Button>
                    <Typography color={'error'}>{formError.screeningQuestions}</Typography>
                  </Grid>

                  {screeningQuestions.map((questions, index) => (
                    <Grid item xs={12} lg={12}>
                      <Box
                        borderRadius={1}
                        sx={{
                          border: 1,
                          borderColor: "lightgray",
                          minHeight: 101,
                        }}
                      >
                        <Box
                          borderBottom={1}
                          borderColor={"lightgray"}
                          justifyContent={"space-between"}
                          display={"flex"}
                        >
                          <Typography variant="body2">
                            Write a Custom Screening Question
                          </Typography>
                          <Button onClick={() => handleDeleteQuestions(index)}>
                            {" "}
                            <CancelIcon sx={{ width: 18 }}></CancelIcon>
                          </Button>
                        </Box>
                        <TextField
                          sx={{ width: "80%", marginTop: 1.5, marginLeft: 1.5 }}
                          required
                          label={`Question No ${index + 1}`}
                          size="small"
                          placeholder="Try asking a question like,'Will you able to bring your own device?'"
                          value={questions.question}
                          onChange={(e) =>
                            handleQuestionChange(index, e.target.value)
                          }
                        ></TextField>
                        <TextField
                          size="small"
                          select
                          label="Response Type"
                          SelectProps={{
                            native: true,
                          }}
                          sx={{ width: "15%", marginLeft: 1.5, marginTop: 1.5 }}
                          onChange={(e) =>
                            handleResponseTypeChange(index, e.target.value)
                          }
                          required
                        >
                          <option value="yesNo">Yes/No</option>
                          <option value="numeric">Numeric</option>
                          <option value="text">Text</option>

                        </TextField>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ bottom: 0, width: "100%" }} width={"50%"}>
                  <Button type="submit" variant="contained" color="primary">
                    Post Job
                  </Button>
                </Box>
              </Box>
            </form>
          </Grid>
          {/*Recent Deposits*/}
        </Grid>
      </Container>
    </Box>
  );
}

export default CreateNewPost;
