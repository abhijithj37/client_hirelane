import React, { useEffect, useState } from "react";
import Linkify from 'linkify-react';


import {
  Typography,
  Box,
  Grid,
  TextField,
  Toolbar,
  Container,
  Avatar,
  IconButton,

} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import EmployerConversation from "../../Components/EmployerComponents/EmployerConversation";
import EmployerMessages from "../../Components/EmployerComponents/EmployerMessages";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { StyledBadge } from "../../Components/userComponents/SeekerConversation";
import Logo from '../../images/logo.png'
import { setNewMessage } from "../../app/features/employerSlice";
import { useSocket } from "../../Context/SocketProvider";

function EmployerChat() {

 const dispatch=useDispatch()
 const {newMessage}=useSelector((state)=>state.employer)
 const [conversations,setConversations]=useState([])
 const {employer,chatUser}=useSelector((state)=>state.employer)
 const [messages, setMessages] = useState([]);
 //  const [newMessage, setNewMessage] = useState("");
 const [arrivalMessage,setArrivalMessage]=useState(null)
 const [onlineUsers,setOnlineUsers]=useState([])
 const [searchQuery,setSearchQuery]=useState('')
 const socket=useSocket()
 
 useEffect(()=>{
         socket?.emit("addUser",employer?._id)
        socket.on("onlineUsers",(onlineUsers)=>{
        console.log(onlineUsers,'its the online users');
        setOnlineUsers(onlineUsers)
        })
          return ()=>{
          socket.emit('removeFromOnline',employer?._id)
          }
        },[employer?._id])
 

   
  const handleSendMessage=()=>{

  if(newMessage.trim()==="") return null

    const message={
    from:employer?._id,
    to:chatUser?._id,
    message:newMessage,

    };

    socket.emit("send-msg",{
        to:chatUser._id,
        from:employer._id, 
        message:newMessage,
        createdAt:new Date(),
        read:false
    })


    axios
       .post("/chat/emp-msg",message,{withCredentials:true})
       .then(({ data })=>{
       data.message=formatMessageContent(data)
       setMessages([...messages,data]);
       dispatch(setNewMessage(""))  
       })
       .catch((err) => {
       console.log(err.message);
      })
   };
   

   function formatMessageContent(data){
    const { message }=data;
    
    return (
      <Linkify options={{target:'_blank'}}
      >
        {message}
      </Linkify>
    );
  }


  useEffect(() => {
   if(chatUser){
    axios
    .get(`/chat/emp-msg?user1=${chatUser._id}&user2=${employer?._id}`,{withCredentials:true})
    .then(({ data }) => {
      data.map((d)=>d.message=formatMessageContent(d))
    setMessages(data);
    })
    .catch((err) => {
    console.log(err.message);
    });
    }
  },[chatUser,arrivalMessage]);
  
   
  useEffect(()=>{
  axios.get(`/chat/emp-conversations/${employer?._id}`,{withCredentials:true}).then(({data})=>{
   console.log(data);
  setConversations(data)
  }).catch((err)=>{
   console.log(err);
  })
  },[messages])



  useEffect(()=>{
  if(socket){
    socket.on("msg-receive",(data)=>{
    setArrivalMessage(data)
    })
  }
  },[arrivalMessage])
  


  useEffect(()=>{
   arrivalMessage&&
   setMessages((prev)=>[...prev,arrivalMessage])
   },[arrivalMessage])
  



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
      <Container sx={{mt:4,mb:4}}>
        <Grid columnGap={3} justifyContent={"center"} container>
          <Grid
            item
            sx={{ borderColor:"lightgray"}}
            borderRadius={2.5}
            border={1}
            xs={4}
          >
            {/*Conversation component*/}
            <Box
              height={"80vh"}
              style={{
                flex:1,
                overflowY:"scroll",
                "&::-webkit-scrollbar":{
                display:"none",
                },
              }}
            >  
            
              <Box
                borderRadius={2.5}
                style={{
                position:"sticky",
                top:0,
                backgroundColor:"#fff",
                zIndex:1,
                }}
                padding={1}
              >  
                <Typography gutterBottom color={"primary"} variant="h6">
                  Messages
                </Typography>
               <TextField size="small" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} label="Search conversations" fullWidth />
              </Box>
              {/* Conversations list */}
              {conversations.length!==0&&conversations.map((c,index)=>{
                return(
                <EmployerConversation  key={index} searchQuery={searchQuery} onlineUsers={onlineUsers} conversation={c} />
                )
              })}
                
  
            </Box>
          </Grid>
          <Grid
            item 
            sx={{borderColor:"lightgray"}}
            borderRadius={2.5}
            border={1}
            xs={7}
          >
 {/* Chat Container */}
 
{chatUser?
  
      <Box
          style={{
            height:"85vh",
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-between",
          }}
        >
          <Box
            boxShadow={"0 1px 2px rgba(0, 0, 0, 0.1)"}
            style={{
              position:"sticky",
              top:0,
              backgroundColor:"#fff",
              zIndex:1,
              borderRadius:"10px 10px 0 0",
            }}
            padding={1}
          >

   
            <Box
              padding={1}
              width={"30%"}
              justifyContent={"space-between"}
              display={"flex"}
            >
              <Box> 
              {onlineUsers.includes(chatUser?._id) ? (
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                    >
                      <Avatar src={`http://localhost:4001/image/${chatUser?.image}`} alt="Remy Sharp" >
                        
                      </Avatar>
                    </StyledBadge>
                  ) : (
                    <Avatar src={`http://localhost:4001/image/${chatUser?.image}`} >
                    
                    </Avatar>
                  )}
                  </Box>
                <Box > 
              <Typography  variant="h6">

                {chatUser&&chatUser?.name} 

              </Typography>

            {onlineUsers.includes(chatUser?._id)&&<Typography fontSize={'small'} color={'gray'}>online</Typography>}   

            </Box>
            </Box>
               

           </Box>
          {/* Chat container */}
           
            <EmployerMessages  messages={messages}/> 


          {/* New message input */}
          <Box padding={1} style={{ display: "flex", alignItems: "center" }}>
            <TextField
            value={newMessage}
            onChange={(e) =>dispatch( setNewMessage(e.target.value))}
            label="Type a message"
            fullWidth            
            margin="normal"      
            size="medium"         
            />
            <IconButton onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
     : <Box height={'75vh'} display="flex" alignItems="center" justifyContent="center">
     <Box textAlign="center">
       <img style={{ filter: "grayscale(100%)" }} width={100} src={Logo} alt="" />
       <Typography color="lightgray" variant="h4">
         Start messaging with Hirelane
       </Typography>
     </Box>
     </Box>}


          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default EmployerChat;
