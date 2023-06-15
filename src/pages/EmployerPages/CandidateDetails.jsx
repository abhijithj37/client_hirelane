import { Avatar, Box, Button, Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import React, {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
 import { useNavigate } from "react-router-dom";
import { setChatUser, setJobApplications } from "../../app/features/employerSlice";
import { MoreVert } from "@mui/icons-material";
import axios from "../../axios";
import { handleSendNotification } from "../../Utils/api";
import { useSocket } from "../../Context/SocketProvider";


 
function CandidateDetails({setIndex, jobApplication}){
   

  const {employer}=useSelector((state)=>state.employer)
  const socket=useSocket()
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [anchorEl,setAnchorEl] = useState(null);
   

  const handleMenuClose=()=>{
  setAnchorEl(null);
  }; 
  
  
  const handleOptionClick=(e)=>{
  setAnchorEl(e.currentTarget);
  };

   
  
   

  const handleUpdateStatus=(status)=>{

    const data={
    status,
    applicationId:jobApplication?._id,
    jobId:jobApplication?.jobId
    }
  
     
    axios.put('/applications/update-status',data,{withCredentials:true}).then(({data})=>{
    const content=`Your Job application for ${jobApplication?.jobTitle} was ${status}`
    setIndex(0)
    dispatch(setJobApplications(data))
     
    window.alert(`Candidate${status}`)
    handleSendNotification(employer?.companyName,jobApplication?.candidateId,content,socket)
    }).catch((err)=>{
    console.log(err.message);
    })
    
    }
   
  return (
    <Grid lg={7.7} item>
      <Box
        border={1}
        borderRadius={2}
        sx={{ borderColor:"lightgray"}}
        padding={2}
      >
        <Box display={'flex'}>
          <Box>
            <Avatar sx={{width:56,height:56}} src={`https://fashionbytes.online/seeker/image/${jobApplication?.image}`}></Avatar>
          </Box>
          <Box marginLeft={1}> 
          <Typography variant="h5">
            {jobApplication?.fName + " " + jobApplication?.lName}'s application
          </Typography>
          <Typography variant="body2" color={"gray"}>
            Applied on {new Date(jobApplication?.createdAt).toLocaleDateString('en-US',{
              day:'numeric',
              month:'long',
              year:'numeric'
            })}
          </Typography>
          </Box>

           
        </Box>
        <Box display={'flex'} padding={0} marginTop={1}>
          <Button
            target="_blank"
            href={jobApplication?.cvUrl}
            size="small"
            sx={{ borderRadius: 5}}
            variant="contained"
          >
            View CV
          </Button>
          <Button
            size="small"
            sx={{ borderRadius:5,marginLeft:1}}
            variant="outlined"
            onClick={()=>{
              dispatch(setChatUser({ 
               name: jobApplication?.fName+' '+jobApplication?.lName,
              _id:jobApplication?.candidateId,
              image:jobApplication?.image
            }))
            navigate('/employer/employerChat')
            }}
          >
            Message
          </Button>
     {/* ********************************************** */}

        <Box>
      <IconButton

                    aria-controls="options-menu"
                    aria-haspopup="true"
                    onClick={(e)=>handleOptionClick(e)}
                  >
                    <MoreVert/>
                  </IconButton>
                  <Menu
                  
                    id="options-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >            
                    <MenuItem onClick={()=>{
                      handleUpdateStatus('Shortlisted')
                      setAnchorEl(null);
                      }}>
                    Shortlist Candidate
                    </MenuItem >
                    <MenuItem onClick={()=>{handleUpdateStatus('Rejected')}}>
                      {" "}
                     Reject Application
                    </MenuItem>
                     
                    <MenuItem  onClick={()=>{handleUpdateStatus('Reviewing')}} >
                     Save Application
                    </MenuItem>
                  </Menu>
         </Box>

     {/* ********************************************** */}
         </Box>
      </Box>

      <Box
        padding={2}
        border={1}
        borderRadius={2}
        sx={{borderColor:"lightgray"}}
        marginTop={1}
      >
        <Box>
          <Typography variant="h6">Application Details</Typography>
          <Typography color={"gray"} fontWeight={500}>
          Contact information
          </Typography>
        </Box>
        <Box
          boxShadow={1}
          marginTop={1}
          border={1}
          borderRadius={1}
          sx={{borderColor:"lightgray"}}
        >
          <Box padding={1} borderBottom={1} sx={{ borderColor: "lightgray" }}>
            <Typography color={"gray"}>Full Name</Typography>
            <Typography sx={{opacity:0.9}} fontWeight={600}>
              {jobApplication?.fName} {jobApplication?.lName}
            </Typography>
          </Box>
          <Box
            marginTop={1}
            padding={1}
            borderBottom={1}
            sx={{borderColor:"lightgray"}}
          >
            <Typography sx={{opacity:0.9}} color={"gray"}>
            Email address
            </Typography>
            <Typography sx={{opacity:0.9}} fontWeight={600}>
              {jobApplication?.email}
            </Typography>
          </Box>
          <Box
            marginTop={1}
            padding={1}
            borderBottom={0}
            sx={{borderColor:"lightgray"}}
          >
            <Typography color={"gray"}>Phone</Typography>
            <Typography fontWeight={600}>{jobApplication?.phone}</Typography>
          </Box>
        </Box>

        <Box marginTop={1.5}>
          <Box>
            <Typography color={"black"} fontSize={"18px"} fontWeight={500}>
              Screening Questions Responses
            </Typography>
          </Box>

          <Box
            
            borderRadius={1}
            sx={{borderColor:"lightgray"}}
            padding={1}
          >
            {jobApplication &&
              jobApplication.questions.map((ques,idx)=>{
                return(
                   
                  <Box key={idx} marginTop={1} sx={{borderColor:"lightgray"}} borderBottom={1}>
                    <Typography>
                      {idx + 1}.{ques.question}
                    </Typography>
                    <Typography fontWeight={600}>{ques.answer}</Typography>
                  </Box>
                );
              })}
          </Box>
        </Box>
      </Box>
    </Grid>
    
  );
}


export default CandidateDetails;
