import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Modal,
} from "@mui/material";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { setJobDetails } from "../../app/features/jobSlice";
import JobDetailSkeleton from "../../Skeletons/JobDetailSkeleton";
import { useNavigate } from "react-router-dom";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { ApartmentRounded } from "@mui/icons-material";
import TimelineIcon from "@mui/icons-material/Timeline";
import WorkIcon from "@mui/icons-material/Work";

const JobDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postId, jobDetails } = useSelector((state) => state.posts);
  const { seeker } = useSelector((state) => state.seeker);
  
  useEffect(() => {
    axios
      .get(`posts/getJob/${postId}`,{withCredentials:true})
      .then(({data}) => {
        dispatch(setJobDetails(data.job));
      });
  }, [postId,dispatch]);

  const [open,setOpen]=React.useState(false);
  const handleOpen =()=>setOpen(true);
  const handleClose=()=> setOpen(false);
         

  const style = {
    position:"absolute",
    top:"50%",
    left:"50%",
    transform:"translate(-50%, -50%)",
    width:400,
    bgcolor:"background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  const handleApply = () => {
    if (!seeker) return handleOpen();
    navigate(`/apply/${postId}`)
    
  }
  

   
  return (
    <>
      <Modal 
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
 
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            You Are Not Signed in !
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please Sign In For Apply For Jobs
          </Typography>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </Box>
      </Modal>
       

       
 
      

      {/* ************************************************************************************************************* */}
      {jobDetails ? (
        <Box
          sx={{
            height: 725,
            overflow: "auto",
            borderRadius: 3,
            boxShadow: "0px 3px 5px rgba(0,0,0,0.1)",
            border: 1,
            borderColor: "lightgray",
          }}
        >
          <Box
            sx={{
              position:"sticky",
              top:0,
              backgroundColor:"white",
              padding:2,
              boxShadow:"0px 3px 5px rgba(0,0,0,0.1)",
            }}

          >
            <Typography variant="h6">{jobDetails.jobTitle}</Typography>
            <Typography fontSize={18} color={"purple"}>
              {jobDetails.companyName}

            </Typography>
            <Typography marginTop={1} color={"gray"} variant="p"></Typography>
            <Typography marginTop={1}>{jobDetails.jobLocation}</Typography>
            <Button
              onClick={handleApply}
              sx={{ marginTop:1}}
              variant="contained"
            >
              Apply Now
            </Button>
             
          </Box>
          <Box sx={{padding:2}}>
            <Typography marginLeft={1} variant="h6">
              Job Details
            </Typography>
            <Box padding={1}>
              {" "}
              <Typography fontSize={15} color='GrayText' variant="h6">
                No of Openings:{jobDetails&&jobDetails.noOfOpenings}
              </Typography>
            </Box>

            <Divider sx={{ margin: 0 }}></Divider>
            <Box padding={1}>
              <Box display={"flex"}>
                <WorkIcon
                  fontSize="small"
                  sx={{color:"gray",marginTop:0.4}}
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
                {jobDetails && jobDetails.jobType}
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
                {jobDetails && jobDetails.workPlaceType}
              </Box>
            </Box>

            <Divider sx={{ margin: 0 }}></Divider>

            <Box display={"flex"}>
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
                  {jobDetails &&
                    jobDetails.salaryFrom + "₹-" + jobDetails.salaryTo + "₹"}
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
              <Typography variant="h6">Full Job Description</Typography>

              <Typography  variant="subtitle2">
                {jobDetails && jobDetails.description}
              </Typography>
            </Box>
            <Divider sx={{ margin: 0 }}></Divider>

            <Box padding={1}>
              <Typography variant="h6">Hiring Insights </Typography>
              <Typography fontSize={17} variant="h6">
                Job Activity
              </Typography>
              <Typography variant="body2">
                Posted on:{jobDetails && jobDetails.createdAt}
              </Typography>
            </Box>
            <Divider sx={{ margin: 0 }}></Divider>
          </Box>
        </Box>
      ) : (
        <>
          <JobDetailSkeleton />
        </>
      )}
    </>
  );
};

export default JobDetails;
