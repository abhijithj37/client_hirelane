import { Avatar, Box, Typography } from "@mui/material";
import axios from "../../axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChatEmployer } from "../../app/features/seekerSlice";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";

function SeekerConversation({ conversation, onlineUsers, searchQuery }) {
  const { seeker,chatUser } = useSelector((state) => state.seeker);
  const [employer, setEmployer] = useState("");
  const [unreadMessages, setUnreadMessages] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (conversation) {
      const id = conversation.chatUsers.find((id) => id !== seeker?._id);
      axios
        .get(`/seeker/company-details/${id}`, { withCredentials: true })
        .then(({ data }) => {
           setEmployer(data);
        })
        .catch((err) => { 
          console.log(err);
        });
    }
  }, [conversation,seeker?._id]);

  useEffect(() => {
    if (conversation) {
      axios
        .get(`/chat/unreadMessages/${conversation?._id}`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          console.log(data, "its the unread seeker message");
          setUnreadMessages(data.filter((mesg)=>mesg.from!==seeker?._id))
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [conversation,seeker?._id]);

  return (
    <div>
      {employer?.companyName
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()) || searchQuery === "" ? (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
          }}
          sx={{
            cursor: "pointer",

            ":hover": {
              backgroundColor: "#e0e0e0",
            },
          
          }}
          bgcolor={employer?._id===chatUser?._id&&'#eceff1'}
          
          onClick={() => {
            dispatch(
              setChatEmployer({
                _id: employer?._id,
                name: employer?.companyName,
              })
            );
          }}
        >
          {onlineUsers.includes(employer._id) ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt="Remy Sharp" sx={{ bgcolor: "darkgreen" }}>
                {employer && employer.companyName[0]}
              </Avatar>
            </StyledBadge>
          ) : (
            <Avatar sx={{bgcolor:"darkblue"}}>
              {employer && employer.companyName[0]}
            </Avatar>
          )}
          <div style={{marginLeft:"10px",display:'flex',justifyContent:'space-between',width:'100%', alignItems:'center'}}>
            <Box>
              <Typography variant="subtitle1">{employer?.companyName}</Typography>
               
              {unreadMessages.length!==0&&<Typography variant="caption">{unreadMessages[unreadMessages.length-1].message}</Typography>}  

            </Box>
            {unreadMessages.length!==0&&<Box  marginRight={2}><Badge badgeContent={unreadMessages.length} color="success"></Badge></Box>}
          </div>
        </Box>
      ) : null}
    </div>
  );
}

export default SeekerConversation;

export const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));
