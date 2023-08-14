import React, { useEffect } from "react";
import {
  Box,
  Toolbar,
  Container,
  Divider,
  Grid,
  Typography,
  Button,
} from "@mui/material";
 import LocalAtmIcon from "@mui/icons-material/LocalAtm";
 import { ApartmentRounded } from "@mui/icons-material";
import TimelineIcon from "@mui/icons-material/Timeline";
import WorkIcon from "@mui/icons-material/Work";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setEmpJobDetails } from "../../app/features/employerSlice";
import JobDetailSkeleton from "../../Skeletons/JobDetailSkeleton";
 function EmployerJobDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { jobDetails } = useSelector((state) => state.employer);
  const navigate = useNavigate();

  useEffect(()=>{
    axios
      .get(`/posts/getJob/${id}`, { withCredentials: true })
      .then(({ data }) => {
        dispatch(setEmpJobDetails(data.job));
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [dispatch, id]);
  return (
    <>
      {jobDetails ? (
        <Box
          component="main"
          sx={{
            backgroundColor:(theme)=>theme.palette.common.white,
            flexGrow:1,
            height:"100vh",
            overflow:"auto",
          }}
        >
          <Toolbar/>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography gutterBottom variant="h5" fontWeight={500}></Typography>
          <Divider></Divider>

            <Grid container sx={{ backgroundColor:"white" }} spacing={1}>
              <Grid item xs={12} lg={12}>
              

                <>
                  <Grid
                    sx={{
                      minHeight: 725,
                      overflow: "none",
                      borderRadius: 2,
                      // border: 1,
                      borderColor: "lightgray",
                    }}
                  >
                    <Box
                      sx={{
                        position: "",
                        top: 0,
                        backgroundColor: "white",
                        padding: 2,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="h6">
                        {jobDetails && jobDetails.jobTitle}
                        </Typography>
                        <Typography color={"purple"} variant="body2">
                        {jobDetails && jobDetails.companyName}
                        </Typography>
                        <Typography
                          marginTop={1}
                          color={"gray"}
                          variant="p"
                        ></Typography>
                        <Typography marginTop={1}>
                          {jobDetails && jobDetails.jobLocation}
                        </Typography>
                      </Box>
                      <Button
                        sx={{ marginTop: 1, height: 40 }}
                        variant="contained"
                        onClick={() =>
                          navigate(`/emp/editJob/${jobDetails._id}`)
                        }
                      > 
                        Edit Post
                      </Button>
                    </Box>

                    <Box sx={{ padding: 2 }}>
                      <Typography marginLeft={1} variant="h6">
                        Job Details
                      </Typography>
                      <Box padding={1}>
                        {" "}
                        <Typography
                          sx={{ opacity: 0.9 }}
                          fontSize={15}
                          variant="h6"
                        >
                          No of Openings:{" "}
                          {jobDetails && jobDetails.noOfOpenings}
                        </Typography>
                      </Box>
                      <Divider sx={{ margin: 0 }}></Divider>
                       <Box padding={1}>
                        <Box display={"flex"}>
                          <WorkIcon
                            fontSize="small"
                            sx={{ color: "gray", marginTop: 0.4 }}
                          />
                          <Typography fontSize={17} variant="h6">
                            Job Type
                          </Typography>
                        </Box>

                        <Box
                          textAlign={"center"}
                          bgcolor={"#e3f2fd"}
                          borderRadius={1}
                          fontFamily={"initial"}
                          width={120}
                          border={1}
                          borderColor={"lightgray"}
                        >
                          {jobDetails&&jobDetails.jobType}
                        </Box>
                      </Box>
                       <Box padding={1}>
                        <Box display={"flex"}>
                          <ApartmentRounded sx={{ color: "gray" }} />
                          <Typography fontSize={17} variant="h6">
                            Work Place Type
                          </Typography>
                        </Box>
                        <Box
                          textAlign={"center"}
                          bgcolor={"#e3f2fd"}
                          borderRadius={1}
                          fontFamily={"initial"}
                          width={120}
                          border={1}
                          borderColor={"lightgray"}
                        >
                          {jobDetails&&jobDetails.workPlaceType}
                        </Box>
                      </Box>
                      
                      <Divider sx={{margin:0}}></Divider>


                      <Box display={'flex'}> 
                      <Box padding={1}>
                        <Box display={"flex"}>
                          <LocalAtmIcon sx={{ color: "gray" }} />
                          <Typography fontSize={17} variant="h6">
                            Salary Range
                          </Typography>
                        </Box>
                        <Box
                          textAlign={"center"}
                          bgcolor={"#f5f5f5 "}
                          borderRadius={1}
                          fontFamily={"initial"}
                          width={120}
                          border={1}
                          borderColor={"lightgray"}
                        >
                          {jobDetails && jobDetails.salaryFrom+"₹-"+jobDetails.salaryTo+'₹'}
                        </Box>
                      </Box>
                      <Box padding={1}>
                        <Box display={"flex"}>
                          <TimelineIcon sx={{ color: "gray" }} />
                          <Typography fontSize={17} variant="h6">
                            Experience
                          </Typography>
                        </Box>
                        <Box
                          textAlign={"center"}
                          bgcolor={"#f5f5f5"}
                          borderRadius={1}
                          fontFamily={"initial"}
                          width={120}
                          border={1}
                          borderColor={"lightgray"}
                        >
                          {jobDetails && jobDetails.experience}
                        </Box>
                      </Box>
                      </Box> 

                      <Divider sx={{ margin: 0 }}></Divider>
                      <Box padding={1} sx={{ wordWrap: "break-word" }}>
                        <Typography variant="h6">
                          Full Job Description
                        </Typography>

                        <Typography sx={{opacity:0.8}} variant="subtitle2">
                          {jobDetails&&jobDetails.description}
                        </Typography>
                      </Box>
                      <Divider sx={{margin:0}}></Divider>

                      <Box padding={1}>
                        <Typography variant="h6">Hiring Insights </Typography>
                        <Typography fontSize={17} variant="h6">
                          Job Activity
                        </Typography>
                        <Typography variant="body2">
                          Posted on:{jobDetails&&jobDetails.createdAt}
                        </Typography>
                      </Box>
                      <Divider sx={{margin:0}}></Divider>
                       

                      {jobDetails.screeningQuestions.length?(
                        <Box>
                          <Typography variant="h6">
                            Screening Questions{" "}
                          </Typography>
                          {jobDetails.screeningQuestions.map((ques,index)=>{
                            return (
                              <Typography key={index}>
                                {index+1} {ques.question}
                              </Typography>
                            );
                          })}
                        </Box>
                      ) : (
                        ""
                      )}
                    </Box>
                  </Grid>
                </>
              </Grid>
            </Grid>
          </Container>
        </Box>
      ) : (
      <JobDetailSkeleton />
      )}
    </>
  );
}

export default EmployerJobDetails;
