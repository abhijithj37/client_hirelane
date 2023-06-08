import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import JobPostSkeleton from "../../Skeletons/JobPostSkeleton";
import { useSelector } from "react-redux";

function JobPost({post}) {
const {postId}=useSelector((state)=>state.posts)
  return (
    <> 
    {post?<Paper
      
      sx={{ minHeight:200,maxHeight:300,padding: 2,borderRadius:2,marginBottom:2,borderColor:post?._id===postId&&'blue'}}
      variant="outlined"
      
      
    >

      <Typography component={Link} sx={{textDecoration:'none'}} variant="h6">{post.jobTitle}</Typography>
      <Typography variant="body1">{post.companyName}</Typography>
      <Typography variant="body1">{post.jobLocation}</Typography>
      <Box
        textAlign={"center"}
        bgcolor={"lightgray"}
        marginTop={1}
        borderRadius={1}
        fontFamily={"initial"} 
        width={100}
        border={1}
        borderColor={"lightgray"}
      >
        {post.jobType}{" "}
      </Box>
      <Box sx={{wordWrap:"break-word"}} width={500}>
      <Typography  marginTop={2} variant="subtitle2" color={'gray'}>
      {post.description.substring(0,500)}
     </Typography>
      </Box>
       
    </Paper>:(
      <JobPostSkeleton/>
    )
    }
   </>  
  );
}

export default JobPost;
