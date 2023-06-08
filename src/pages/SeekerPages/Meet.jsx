import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  TextField,
  Badge
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import peer from   "../../Service/Peer";
import ReactPlayer from "react-player";
import { useSocket } from "../../Context/SocketProvider";
 import TopBar from "../meetings/TopBar";
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { Send as SendIcon } from "@mui/icons-material";

function Meet() {
  const socket = useSocket()
  const { seeker,myStream } = useSelector((state) => state.seeker);
  const { id } = useParams();
   const [remoteStream,setRemoteStream]=useState(null)
  const [remoteSocketId,setRemoteSocketId]=useState(null)
  const [joined,setJoined]=useState(false)
  const [remoteUser,setRemoteUser]=useState(null)
  const [openChat,setOpenChat]=useState(false)
  const [newMessage,setNewMessage]=useState('')
  const [videoEnabled,setVideoEnabled]=useState(true)
  const [audioEnabled,setAudioEnabled]=useState(true)
  const [messages,setMessages]=useState([])
  const [readMesg,setReadMsg]=useState(true)

  const scrollRef=useRef()
  


  

  

    const sendStreams = useCallback(() => {
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
    }, [myStream]);



    const handleIncommingCall = useCallback(
      async ({from,offer,userData})=>{
        setRemoteUser(userData)
        setRemoteSocketId(from);

         const ans=await peer.getAnswer(offer);
         socket.emit("call:accepted",{to:from,ans});

      },
      [socket]
    );

    const handleNegoNeeded =useCallback(async () => {
      const offer = await peer.getOffer();
      socket.emit("peer:nego:needed",{offer,to:remoteSocketId });
    }, [remoteSocketId, socket]);
  
    const handleNegoNeedIncomming = useCallback(
      async ({ from, offer })=>{
        const ans = await peer.getAnswer(offer);
        socket.emit("peer:nego:done",{to:from,ans});
      },
      [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
      await peer.setLocalDescription(ans);
      }, []);

      const handleMessages=(message)=>{
        if(openChat===false){
          setReadMsg(false)
        }else{
          setReadMsg(true)
        }
        setMessages((prevMessages)=>[...prevMessages,message])
      }
  
      const handleSendMessage=(e)=>{
      e.preventDefault()
      const message={
        senderId:seeker?._id,
        senderName:seeker?.fName,
        createdAt:new Date(),
        content:newMessage
      }
  
      socket.emit("chat:message", message);
      setMessages((prevMessages)=>[...prevMessages,message]);
      setNewMessage("");
  
  
      }
      const handleLeaveMeeting=()=>{
        window.location.reload()
      }
      const handleToggleVideo = ()=>{
        setVideoEnabled((prev)  =>!prev);
        myStream.getVideoTracks()[0].enabled=!videoEnabled;
        };
      
        const handleToggleAudio =()=>{
          setAudioEnabled((prev) => !prev);
          myStream.getAudioTracks()[0].enabled = !audioEnabled;
        };

        
// *****************************************************************************************************************************************

useEffect(() => {
  peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
  return () => {
    peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
  };
}, [handleNegoNeeded]);


useEffect(()=>{

  peer.peer.addEventListener("track", async(ev)=>{
    const remoteStream = ev.streams;
    console.log("GOT TRACKS!!");
    setRemoteStream(remoteStream[0]);
  });

}, []);


    useEffect(()=>{

    socket.on("incomming:call",handleIncommingCall);
    socket.on("peer:nego:needed",handleNegoNeedIncomming);
    socket.on("peer:nego:final",handleNegoNeedFinal);
    socket.on('chat:message',handleMessages)

     return ()=>{

      socket.off("incomming:call",handleIncommingCall);
      socket.off("peer:nego:needed",handleNegoNeedIncomming);
      socket.off("peer:nego:final",handleNegoNeedFinal);
      socket.off('chat:message',handleMessages)

    }
    },[socket,handleIncommingCall,handleNegoNeedIncomming,handleNegoNeedFinal])

 
  return (
    <div style={{ background: joined?"black":''}}>
   {!joined&&   <TopBar></TopBar>}
      <Container sx={{ border:0}}>
        <Grid alignContent={'center'} justifyContent={'center'} border={0} borderColor={"blue"}  height={'88vh'} spacing={1}  container>
         <Grid sx={{ width: '100%', height: '100%' }} item lg={5.5}>
           {joined? <Box
            width="100%"
            height="100%" 
            alignItems="center"
            position={'relative'}
           > 
            <ReactPlayer
              width="100%"
              height="100%"
              style={{objectFit:"cover"}}
              muted
              playing
              url={remoteStream}
            ></ReactPlayer>
            <Box position="absolute" top="20%" left="0%" transform="translate(-50%, -50%)" zIndex={1}>
    <Typography variant="h6" color="white">
      {remoteUser?.name}
    </Typography>
   </Box>
            </Box>: 
            <Box  display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} alignContent={'center'} border={0} width={'100%'} height={'100%'}>
             
               
          {remoteUser&& <Box ><Avatar sx={{bgcolor:'darkgreen'}}>{remoteUser?.name[0]}</Avatar></Box>}

              <Box>
             {remoteUser?<Typography gutterBottom variant="h5">{remoteUser?.name} is in this call</Typography>:<Typography gutterBottom variant="h5">No one is in this meeting</Typography>} 
              <Box display={'flex'} justifyContent={'center'}> 
           {remoteUser? <Button onClick={()=>{
                setJoined(true)
                sendStreams()           
              }} sx={{marginTop:3,borderRadius:5,padding:1.5}}   variant="contained">Join now</Button>:<Button variant="contained" onClick={()=>window.location.reload()}>Return</Button>}
              </Box>
             </Box>
              
               
            </Box> 
            }
          </Grid>

         
            
          <Grid borderRadius={5}  sx={{ width: '100%', height: '100%' }} item lg={5.5}>
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
                <Avatar sx={{bgcolor:'violet',width:80,height:80}}><Typography fontSize={45} >{seeker?.fName[0].toUpperCase()}</Typography> </Avatar>
               </Box>
            ) : (
              <Box
              width="100%"
              height="100%" 
              alignItems="center"
              position={'relative'}
  
              > 
 
               <ReactPlayer

                width="100%"
                height="100%"
                style={{ objectFit: "cover" }}
                playing
                url={myStream}
              >
 
              </ReactPlayer>

              <Box position="absolute" top="20%" left="0%" transform="translate(-50%, -50%)" zIndex={1}>
    <Typography variant="h6" color="white">
      You 
    </Typography>

  </Box>
              </Box>
              
            )}
             
           </Grid>
          
          
          <Grid item></Grid>
        </Grid>
      </Container>

      {openChat&&   <Box
      position="absolute"
      bottom={70}
      right={0}
      margin={2}
      zIndex={999}
      border={1}
      borderColor={'lightgray'}
      borderRadius={2}
      width={'20%'} 
      bgcolor={'white'}
      height={'75%'}
      style={{
        
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
      }}
       
      
      p={2}
    >

      {/* Your chat box content */}

      <Box  style={{
                position:"sticky",
                top:0,
                backgroundColor:"#fff",
                zIndex:1,
                }} display={'flex'}justifyContent={'space-between'}>
      <Typography  variant="body1">In-call messages</Typography>
       <IconButton onClick={() => {
              
              setOpenChat(false)
              setReadMsg(true)
              }} size="small" ><CloseIcon fontSize="small"/></IconButton>
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

          {messages.map((msg)=>{
            return(
              <div
              ref={scrollRef}
              
                  style={{
                  display:"flex",
                  justifyContent:
                  msg.senderId===`${seeker?._id}`?"flex-end":"flex-start",
                  marginBottom:"10px",
                }}
              >
          
                <div
                  style={{
                    backgroundColor: 
                    msg.senderId === `${seeker?._id}`? "#bdbdbd" : "#f5f5f5",
                    color: msg.senderId ===`${seeker?._id}` ? "#fff" : "#000",
                    borderRadius:"17px",
                    padding:"10px",
                    maxWidth:"70%",
                    wordBreak:"break-word",
                  }}
                >
                  {msg?.content}
                </div>
                <div
          style={{
          alignSelf:"flex-end",
          fontSize:"12px",
          color:"#999",
          marginTop:"5px",
          }}
          >
          {msg.senderId===seeker?._id?'You':msg.senderName}
          </div> 
           </div>
            )
          })}
            </Box>

            <Box padding={1} style={{ display: "flex", alignItems: "center" }}>
            <TextField
            value={newMessage}
            onChange={(e) =>setNewMessage(e.target.value)}
            label="Type a message"
            fullWidth            
            margin="normal"      
            size="small"
            sx={{borderRadius:5}}     
            />
            <IconButton onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>

      </Box>}

     {joined&&<Box
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
          border={0}
          borderColor={" "}
          width={"35%"}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            alignContent={"center"}
            justifyContent={"space-around"}
            border={0}
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
        <Box border={0} borderColor={" "}  display={"flex"}
            alignItems={"center"}
            alignContent={"center"}
            justifyContent={"space-around"} width={"35%"}>
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
      </Box>}
    </div>
  );
}

export default Meet;
