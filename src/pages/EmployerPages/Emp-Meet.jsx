import React, { useCallback, useEffect, useReducer, useRef } from "react";
import { useState } from "react";
import {  useSelector } from "react-redux";
import {   useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  IconButton,
  TextField,
  Backdrop,
  CircularProgress,
  Avatar, 
  Badge
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import peer from "../../Service/Peer";
import ReactPlayer from "react-player";
import { useSocket } from "../../Context/SocketProvider";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { Send as SendIcon } from "@mui/icons-material";
 
function EmpMeet() {
  const socket = useSocket();
  const { employer, myStream } = useSelector((state) => state.employer);
  const { id } = useParams();
   const [remoteStream, setRemoteStream] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [readMesg,setReadMsg]=useState(true)
   

  const scrollRef = useRef();
  const navigate = useNavigate();
   
  

   
  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleUserJoined = useCallback(async ({ user, id }) => {
    const userData = {
      name: employer?.name,
      userId: employer?._id,
    };

    setRemoteSocketId(id);
    setRemoteUser(user);

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: id, offer, userData });
  }, []);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      
      console.log("Call Accepted!");
      sendStreams();
      socket.emit("send:stream");
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );
  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const handleMessages = (message) => {
    if(openChat===false){
      setReadMsg(false)
    }else{
      setReadMsg(true)

    }
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message ={
      senderId: employer?._id,
      senderName: employer?.name,
      createdAt: new Date(),
      content: newMessage,
    };
   
    socket.emit("chat:message", message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage("");
  };

  const handleLeaveMeeting = () => {
      remoteStream?.getTracks().forEach((track) => track.stop());
      myStream?.getTracks().forEach((track) => track.stop());
      navigate('/start-meet')
    
    
    
    
 
  };

  const handleToggleVideo = () => {
    setVideoEnabled((prev)=>!prev);
    const videoTrack = myStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
  }; 

  const handleToggleAudio = () => {
    setAudioEnabled((prev) => !prev);
    const audioTrack = myStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
  };

  //************************************************************************************************************************************************************

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      
      setRemoteStream(remoteStream[0])
     });
  }, []);

  // **************************************************************************************************
   


 // ***************************************************************************************************


  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("chat:message", handleMessages);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("chat:message", handleMessages);
    };
  }, [
    handleUserJoined,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);


  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages, openChat]);


  return(
    <div style={{background:"black"}}>
      <Backdrop
        open={myStream ? false : true}
        style={{
          zIndex: 9999,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          alignContent={"center"}
          justifyContent={"center"}
          display={"flex"}
          flexDirection={"column"}
        >
          <Typography gutterBottom variant="h6" color={"white"}>
            Joining...
          </Typography>
          <CircularProgress sx={{ marginLeft: 2 }} color="primary" />
        </Box>
      </Backdrop>
      <Container sx={{ border: 0 }}>
        <Grid
          alignContent={"center"}
          justifyContent={"center"}
          border={0}
          borderColor={"blue"}
          height={"88vh"}
          container
          spacing={1}
        >
          <Grid
            sx={{ width: "100%", height: "100%" }}
            item
            lg={remoteStream ? 5.5 : 12}
          >
            {myStream && !videoEnabled ? (
                <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="100%"
                bgcolor="black"
                color="white"
              >
                <Avatar sx={{bgcolor:'darkgreen',width:80,height:80}}><Typography fontSize={45} >{employer?.name[0].toUpperCase()}</Typography> </Avatar>
               </Box>
            ) : (
              <Box position={'relative'}
              alignItems={'center'}
              width={'100%'}
              height={'100%'}
              > 
              <ReactPlayer
                width="100%"
                height="100%"
                style={{ objectFit: "cover" }}
                playing
                url={myStream}
              ></ReactPlayer>
              {remoteStream&& <Box position="absolute" top="20%" left="0%" transform="translate(-50%, -50%)" zIndex={1}>
    <Typography variant="h6" color="white">
      You
    </Typography>
  </Box>}
              </Box>
            )}
          </Grid>

          {remoteStream && (
            <Grid sx={{ width: "100%", height: "100%" }} item lg={5.5}>
               <Box position={'relative'}
              alignItems={'center'}
              width={'100%'}
              height={'100%'}
              > 
              <ReactPlayer
                width="100%"
                height="100%"
                style={{ objectFit: "cover", borderRadius: "10px" }}
                muted
                playing
                url={remoteStream}
              ></ReactPlayer>
               
      
               { remoteStream &&   <Box position="absolute" bottom="20%" left="50%" display={'flex'}   zIndex={1}>
          {!remoteStream.getAudioTracks()[0]?.enabled && <MicOffIcon  sx={{color:'white'}}  />}
          {!remoteStream.getVideoTracks()[0]?.enabled  && <VideocamOffIcon sx={{color:'white'}} />
          
           }   

        </Box>}
      
               <Box position="absolute" top="20%" left="0%" transform="translate(-50%, -50%)" zIndex={1}>
    <Typography variant="h6" color="white">
      {remoteUser?.name}
    </Typography>
  </Box>
              </Box>
            </Grid>
          )}

          <Grid item></Grid>
        </Grid>
      </Container>

      {openChat && (
        <Box
          position="absolute"
          bottom={70}
          right={0}
          margin={2}
          zIndex={999}
          border={1}
          borderColor={"lightgray"}
          borderRadius={2}
          width={"20%"}
          bgcolor={"white"}
          height={"75%"}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          p={2}
        >
          {/* Your chat box content */}
          <Box
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#fff",
              zIndex: 1,
            }}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Typography variant="body1">In-call messages</Typography>
            <IconButton onClick={() => {
              
              setOpenChat(false)
              setReadMsg(true)
              }} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box
            padding={3}
            style={{
              flex: 1,
              overflowY: "scroll",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {messages.map((msg) => {
              return (
                <div
                  ref={scrollRef}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.senderId ===`${employer?._id}`
                        ? "flex-end"
                        : "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div 
                    style={{
                      backgroundColor:
                        msg.senderId === `${employer?._id}`
                          ? "#bdbdbd"
                          : "#f5f5f5",
                      color:
                        msg.senderId === `${employer?._id}` ? "#fff" : "#000",
                      borderRadius: "17px",
                      padding: "10px",
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg?.content}
                  </div>
                  <div
                    style={{
                      alignSelf: "flex-end",
                      fontSize: "12px",
                      color: "#999",
                      marginTop: "5px",
                    }}
                  >
                    {msg.senderId === employer?._id ? "You" : msg.senderName}
                  </div>
                </div>
              );
            })}
          </Box>

          <Box padding={1} style={{ display: "flex", alignItems: "center" }}>
            <TextField
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              label="Type a message"
              fullWidth
              margin="normal"
              size="small"
              sx={{ borderRadius: 5 }}
            />
            <IconButton onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
      <Box
        display={"flex"}
        height={"12vh"}
        alignSelf={"end"}
        border={0}
        borderColor={" "}
        width={"100%"}
      >
        {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
        <Box
          display={"flex"}
          padding={2}
          border={0}
          borderColor={" "}
          width={"30%"}
        >
          <Typography fontWeight={500} color={"white"}>
            {new Date().toLocaleTimeString()}
          </Typography>
          <Typography marginLeft={1} color={"white"}>
            |
          </Typography>
          <Typography marginLeft={1} fontWeight={500} color={"white"}>
            {id}
          </Typography>
        </Box>
        <Box
          display={"flex"}
          alignContent={"center"}
          justifyContent={"center"}
          border={1}
          borderColor={" "}
          width={"35%"}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            alignContent={"center"}
            justifyContent={"space-around"}
            border={1}
            borderColor={" "}
            width={"60%"}
          >
            <IconButton
              onClick={handleToggleAudio}
              sx={{
                color: "white",
                bgcolor: audioEnabled && myStream ? "dimgrey" : "#c62828",
                width: 40,
                height: 40,
              }}
            >
              {audioEnabled && myStream ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
            <IconButton
              onClick={handleToggleVideo}
              sx={{
                color: "white",
                bgcolor: videoEnabled && myStream ? "dimgrey" : "#c62828",
                width: 40,
                height: 40,
              }}
            >
              {videoEnabled && myStream ? (
                <VideocamIcon />
              ) : (
                <VideocamOffIcon />
              )}
            </IconButton>
            <Button
              sx={{ height: 40, borderRadius: 4 }}
              color="error"
              variant="contained"
              onClick={() => handleLeaveMeeting()}
            >
              <CallEndIcon sx={{ color: "white" }} />
            </Button>
          </Box>
        </Box>
        <Box
          border={0}
          borderColor={" "}
          display={"flex"}
          alignItems={"center"}
          alignContent={"center"}
          justifyContent={"space-around"}
          width={"35%"}
        >
        {readMesg? <IconButton
            onClick={() => setOpenChat(!openChat)}
            sx={{ color: "white", bgcolor: "", width: 40, height:40}}
          >

            <ChatIcon />
          </IconButton>:<IconButton
            onClick={() => {
              setOpenChat(!openChat)
              setReadMsg(true) 
               }}
            sx={{ color: "white", bgcolor: "", width: 40, height:40}}
          >
            <Badge variant="dot" color='warning'> 
            <ChatIcon />
            </Badge>
          </IconButton>}
        </Box>
  
        {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
      </Box>
    </div>
  );
}

export default EmpMeet;
