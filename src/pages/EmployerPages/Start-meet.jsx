 import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import backGroudImg from "../../images/interview-image2.jpg";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import TopBar from "../meetings/TopBar";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../Context/SocketProvider";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmpStream } from "../../app/features/employerSlice";

 
function EmpInterviewPage() {
  const socket=useSocket()
  const meet=uuid()
  const dispatch=useDispatch()
  const {employer}=useSelector((state)=>state.employer)
  const navigate=useNavigate()
  


  const createMyStream = useCallback(
    async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      dispatch(setEmpStream(stream))
    },
    [dispatch]
  );
  const handleStartMeet=useCallback(()=>{
  const user={name:employer?._id,userId:employer?._id }
  socket.emit('join:meet',{user,meet})
  createMyStream()
  },[meet,socket,employer?._id,createMyStream])

  const handleJoinMeet=useCallback((data)=>{
  const {meet}=data
  
  navigate(`/emp-meet/${meet}`)
  },[navigate])



  useEffect(()=>{
  socket.on('join:meet',handleJoinMeet)
  return ()=>{
    socket.off('join:meet',handleJoinMeet)
  }
  },[socket,handleJoinMeet])
  return (
    <div>
      <TopBar></TopBar>

      <Container>
        <Grid container minHeight={"80vh"}>
          <Grid
            item
            display={"flex"}
            alignItems={"center"}
            alignContent={"center"}
            lg={6}
          >
            <Box>
              <Typography variant="h4">Conduct Interviews Through</Typography>
              <Typography variant="h4"> Hirelane </Typography>
              <Typography color={"gray"}>
                Start the meeting and share the meeting id to the candidates
              </Typography>
              <Box marginTop={3}>
                <Button
                  startIcon={<VideoCallIcon />}
                  size="large"      
                  variant="contained"
                  onClick={handleStartMeet}
                >
                  Start Meeting
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid
            alignContent={"center"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            item
            lg={6}
          >
            <Box>
              <img alt="cover" width={650} height={500} src={backGroudImg} />
              <Typography variant="body2" color={"gray"}>
              Conduct interview and pick the right candidate with Hirelane
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default EmpInterviewPage;
