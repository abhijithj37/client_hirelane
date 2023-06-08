import React from 'react'
import Header from '../../Components/userComponents/Header'
import { Box, Button, Container, Divider, Grid, Typography } from '@mui/material';
import { ApartmentRounded, LocalAtm, Timeline, Work } from '@mui/icons-material';
import JobDetailSkeleton from '../../Skeletons/JobDetailSkeleton';
import { useSelector } from 'react-redux';

function JobDetails() {

 const {jobDetails}=useSelector((state)=>state.posts)    
  return (
    <>
    <Header></Header>

      {jobDetails ? (
         
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
                          ''
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
                          <Work
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
                          <LocalAtm sx={{ color: "gray" }} />
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
                          <Timeline sx={{ color: "gray" }} />
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
                        <Typography variant="h6">Hiring Insights</Typography>
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
        
      ) : (
      <JobDetailSkeleton />
      )}
    </>
  )
}

export default JobDetails
