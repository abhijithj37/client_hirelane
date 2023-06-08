import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios";
import BusinessIcon from "@mui/icons-material/Business";
import CandidateDetails from "./CandidateDetails";
import { setJobApplications } from "../../app/features/employerSlice";
import { useDispatch, useSelector } from "react-redux";
 
function ApplicationDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { jobApplications }=useSelector((state) => state.employer);
  const [index,setIndex]=useState(0)
 
                    
  useEffect(() => {
    let status='Applied'
    axios
      .get(`applications/jobApplications/${id}/${status}`,{withCredentials:true})
      .then(({ data }) => {
        dispatch(setJobApplications(data.applications));
      })
      .catch((err) =>{
        console.log(err.message);
      });
  }, [id,dispatch]);

  
  return (
    
    
    <Box
      component="main"
      sx={{
        backgroundColor:(theme)=>theme.palette.common.white,
        flexGrow:1,
        height:"100vh",
        overflow:"auto",
      }}
    >
      <Toolbar />
    {jobApplications.length?
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* ********************************************************************************************* */}
        
        <Grid container lg={12}>
          <Grid item lg={0.5}></Grid>
          <Grid lg={1} item>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              width={50}
              height={50}
              bgcolor={"#eeeeee"}
              borderRadius={2}
            >
              <BusinessIcon color="action" />
            </Box>
          </Grid>
          <Grid item lg={10}>
            <Box>
              <Typography variant="h6">{jobApplications[0]?.jobTitle}</Typography>
              <Typography color={"secondary"} fontWeight={500} variant="body1">
              {jobApplications[0]?.companyName}
              </Typography>
              <Typography>{jobApplications[0]?.location}</Typography>
              <Typography variant="body2" color={"gray"}>
               Posted on :{jobApplications[0]?.jobPostDate}
              </Typography>
            </Box>
          </Grid>

          <Grid item marginTop={1} lg={12}>
          <Divider></Divider>
          </Grid>

        </Grid>
        {/******************************************************************************************************************************************************************************************/}

        {/* ****************************************************************************************************************************************************************************************************/}
        <Grid marginTop={2} container>
          <Grid lg={4} item>
            <Box borderRadius={2} sx={{ borderColor: "lightgray" }} border={1}>
              <Box
                padding={1}
                sx={{ borderColor: "lightgray" }}
                borderBottom={1}
              >
                {jobApplications?.length} Applicants
              </Box>
              {jobApplications &&
                jobApplications?.map((element, idx) => {
                  return (
                    <Box
                    onClick={()=>{setIndex(idx)}}
                    key={element._id}
                      marginTop={2}
                      sx={{ borderColor: "lightgray",
                       cursor: "pointer", 
              
                      ":hover": {
                        backgroundColor: "#e0e0e0",
                      }, }}
                      borderBottom={1}
                      padding={1}
                      justifyContent={"space-between"}
                      display={"flex"}
                      bgcolor={element._id===jobApplications[index]?._id&&'#eceff1'}
                      

                    >
                      <Box display={'flex'}>
                        <Box><Avatar src={`http://localhost:4001/image/${element.image}`}/></Box>
                         <Box marginLeft={1}>
                        <Typography fontWeight={500}>{element.fName} {element.lName}</Typography>
                        <Typography variant="body2" >{element.email}</Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" color={"gray"}>
                         Applied on {new Date(element.createdAt).toLocaleDateString('en-US',{
                          day:'numeric',
                          month:'short',
                          year:'numeric' 
                         }) }
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          </Grid>

          <Grid item lg={0.3}></Grid>
   
          <CandidateDetails setIndex={setIndex}  jobApplication={jobApplications[index]} />

          
        </Grid>
        
      </Container>:
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

      <Box marginTop={4} paddingTop={4} display={'flex'} justifyContent={'center'} alignItems={'center '} alignContent={'center'}>
      <Typography fontWeight={500} color={"gray"}>No New Applications</Typography>
      </Box> 
      </Container>}
    </Box>

  
  );
}

export default ApplicationDetails;
