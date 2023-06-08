import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  TextField,
  Container,
  Avatar,
  IconButton,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import Logo from '../../images/logo.png'
import axios from "../../axios";
import { useSelector } from "react-redux";
import SeekerConversation from "../../Components/userComponents/SeekerConversation";
import SeekerMessages from "../../Components/userComponents/SeekerMessages";
import Header from "../../Components/userComponents/Header";
import { StyledBadge } from "../../Components/userComponents/SeekerConversation";
import Linkify from 'linkify-react';
import { useSocket } from "../../Context/SocketProvider";


function Chat() {
  const [conversations, setConversations] = useState([]);
  const { seeker, chatUser } = useSelector((state) => state.seeker);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery,setSearchQuery]=useState('')
  const socket=useSocket()


  useEffect(() => {
    socket.emit("addUser",seeker?._id);
    socket.on("onlineUsers",(onlineUsers) => {
    setOnlineUsers(onlineUsers);
    });

    return ()=>{
     socket.emit('removeFromOnline',seeker?._id)

    }
       
  }, [seeker?._id,socket]);

  function formatMessageContent(data) {
    const { message } = data;
  
    return (
      <Linkify options={{target:'_blank'}}>
        {message}
      </Linkify>
    );
  }

  const handleSendMessage = () => {
    if(newMessage.trim()==="") return null
      
     
    const message = {
      from: seeker?._id,
      to: chatUser?._id,
      message: newMessage,
    };

 
    socket.emit("send-msg", {
      to: chatUser?._id,
      from: seeker?._id,
      message: newMessage,
      createdAt: new Date(),
      read:false
    });

    axios
      .post("/chat/msg", message, { withCredentials: true })
      .then(({ data }) => {
        data.message=formatMessageContent(data)
        setMessages([...messages, data]);
        setNewMessage("");
      })

      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (chatUser) {
      axios
        .get(`/chat/msg?user1=${chatUser?._id}&user2=${seeker?._id}`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          data.map((d)=>d.message=formatMessageContent(d))
          setMessages(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [chatUser,arrivalMessage,seeker?._id]);

  useEffect(() => {
    axios
      .get(`/chat/conversations/${seeker?._id}`, { withCredentials: true })
      .then(({ data }) => {
        console.log(data);
        setConversations(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [messages,seeker?._id]);

  useEffect(() => {
    if (socket){
      socket.on("msg-receive", (data) => {
      setArrivalMessage(data);
      });
    }
  }, [arrivalMessage,socket]);
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  return (
    <>
      <Header></Header>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid columnGap={3} justifyContent={"center"} container>
          <Grid
            item
            sx={{ borderColor: "lightgray" }}
            borderRadius={2.5}
            border={1}
            xs={4}
          >
            {/*Conversation component*/}
            <Box
              height={"80vh"}
              style={{
                flex: 1,
                overflowY: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Box
                borderRadius={2.5}
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#fff",
                  zIndex: 1,
                }}
                padding={1}
              >
                <Typography gutterBottom color={"primary"} variant="h6">
                  Messages
                </Typography>
                <TextField size="small" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} label="Search" fullWidth />
              </Box>
              {/* Conversations list */}
              {conversations.length!==0 &&
                conversations.map((c,index) => {
                  return (
                    <SeekerConversation
                    searchQuery={searchQuery}
                      onlineUsers={onlineUsers}
                      conversation={c}
                      key={index}
                    />
                  );
                })}
            </Box>
          </Grid>
          <Grid
            item
            sx={{ borderColor: "lightgray" }}
            borderRadius={2.5}
            border={1}
            xs={7}
          >
            {/* Chat Container */}

 {chatUser?           <Box
              style={{
                height: "85vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                boxShadow={"0 1px 2px rgba(0, 0, 0, 0.1)"}
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#fff",
                  zIndex: 1,
                  borderRadius: "10px 10px 0 0",
                }}
                padding={1}
              >
                <Box
                  padding={1}
                  width={"25%"}
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
                      <Avatar alt="Remy Sharp" sx={{ bgcolor: "darkgreen" }}>
                        {chatUser && chatUser.name[0]}
                      </Avatar>
                    </StyledBadge>
                  ) : (
                    <Avatar sx={{ bgcolor: "darkblue" }}>
                      {chatUser && chatUser.name[0]}
                    </Avatar>
                  )}{" "}
                  </Box>
                  <Box>
                  <Typography  variant="h6">
                    {chatUser && chatUser?.name}
                  </Typography>
                  {onlineUsers.includes(chatUser?._id)&&<Typography fontSize={'small'} color={'gray'}>online</Typography>}   
                  </Box>

                </Box>
              </Box>
              {/* Chat container */}
              <SeekerMessages messages={messages} />
              {/* New message input */}
              <Box
                padding={1}
                style={{ display: "flex", alignItems: "center" }}
              >
                <TextField
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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
    </>
  );
}

export default Chat;
