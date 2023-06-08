import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Divider,
  Toolbar,
  Typography,
  MenuItem,
  Menu,
  Snackbar,
  Alert
} from "@mui/material";
import axios from "../../axios";
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessIcon from "@mui/icons-material/Business";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import { setPostedJobs } from "../../app/features/employerSlice";
import { useDispatch, useSelector } from "react-redux";
import EmpJobSkeleton from "../../Skeletons/EmpJobSkeleton";

function PostedJobs() {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({
    isOpen:false,
    message:"",
    severity:"",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const[selectedJob,setSelectedJob]=useState(null)

  const {postedJobs}=useSelector((state)=>state.employer);
  
  const handleOptionClick=(e,job)=>{
  setSelectedJob(job)
  setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    axios
      .get("/posts/employerJobs",{withCredentials:true})
      .then(({data}) => {
        dispatch(setPostedJobs(data.jobs));
      })
      .catch((err)=>{
       console.log(err.message);
      });
  }, [dispatch]);

  const handleDeletePost=()=>{
    const jobId=selectedJob._id
    axios.delete(`posts/deletePost/${jobId}`,{withCredentials:true}).then(({data})=>{

    dispatch(setPostedJobs(data.jobs))
    setSnackbar({
    isOpen: true,
    message: "Post deleted successfully!",
    severity: "success",
    });
  setAnchorEl(null)
  }).catch((err)=>{ 
    console.log(err.message);
  })
  }
  const handleCloseSnackbar = () => {
    setSnackbar({
      isOpen:false,
      message:"",
      severity:"",
    });
  };

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
      <Snackbar
        open={snackbar.isOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{width:"100%"}}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Toolbar />
      <Container  maxWidth="lg" sx={{mt:4,mb:4}}>
      <Typography gutterBottom  variant="h5" fontWeight={500}>
       Posted jobs 
      </Typography>
               
      <Divider sx={{marginBottom:2,color:"black"}}></Divider>
        {postedJobs?(
        <Grid container sx={{backgroundColor:"white"}} spacing={1}>
          {postedJobs.length===0&&<><Box
            width={"100%"}
            height={"60vh"}
            justifyContent={"center"}
            sx={{ display:"flex",alignItems:"center" }}
          > <Typography>No Jobs Posted Yet</Typography></Box> </>}
          {postedJobs.map((job,index)=>{
           return(
           <Grid key={index} item xs={12} lg={12}>
              <Grid
                sx={{
                  p:2,
                  display:"flex",
                  height:150,
                  border:1,
                  borderColor:"lightgray",
                  "&:hover":{
                  borderColor:"lightblue",
                  },
                  borderRadius:1,
                }}
              >
                <Grid item lg={1.3}>
                <BusinessIcon color="disabled" fontSize="large" />
                </Grid>
                <Grid item lg={6}>
                  <Typography gutterBottom  to={`jobDetails/${job._id}`} component={Link} variant="h6">
                  {job.jobTitle}
                  </Typography>
                  <Typography color={"secondary"}>{job.companyName}</Typography>
                  <Typography gutterBottom>{job.jobLocation}</Typography>
                  <Typography color={"gray"}>Posted on:{new Date(job.createdAt).toLocaleDateString('en-us',{day:'numeric',month:'short',year:'numeric'})}</Typography>
                </Grid>
                <Grid display={'flex'} alignItems={'center'} alignContent={'center'} item lg={4}>
                  {/* <Box padding={.5} borderRadius={2} bgcolor={'#dd2c00'}> */}
                    
                    <Typography variant="body2" color={job.status==='Approved'?'green':'error'}>{job.status}</Typography>
                   {/* </Box> */}
                  </Grid>
                <Grid item lg={0.7}>
                  <IconButton
                    aria-controls="options-menu"
                    aria-haspopup="true"
                    onClick={(e)=>handleOptionClick(e,job)}
                  >
                    <MoreVertIcon/>
                  </IconButton>
                  <Menu
                    id="options-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={()=>navigate(`editJob/${selectedJob._id}`)}>
                      <EditNoteIcon/>
                      Edit Post{" "}
                      </MenuItem >
                    <MenuItem onClick={handleDeletePost}>
                      {" "}
                      <DeleteIcon/>
                      Delete Post
                    </MenuItem>
                    <MenuItem onClick={()=>{navigate(`jobDetails/${selectedJob._id}`)}} >
                      
                      <VisibilityIcon/>
                      View{" "}
                    </MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            </Grid>)
              })} 

 

          </Grid>
          
          
        ) : (
          <EmpJobSkeleton />
        )}
      </Container>
    </Box>
  );    
}

export default PostedJobs;
