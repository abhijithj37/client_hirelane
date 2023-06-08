import { Avatar, Badge, Box, Typography } from "@mui/material";
import axios from "../../axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChatUser } from "../../app/features/employerSlice";
import { StyledBadge } from "../userComponents/SeekerConversation";

function EmployerConversation({ conversation, onlineUsers,searchQuery }) {
  const { employer,chatUser} = useSelector((state) => state.employer);
  const [user, setUser] = useState("");
  const [unreadMessages,setUnreadMessages]=useState([])
  
  const dispatch = useDispatch();
   
  useEffect(() => {
    if (conversation) {
      const id = conversation.chatUsers.find((id) => id !== employer?._id);
      axios
        .get(`/employer/user-details/${id}`, { withCredentials: true })
        .then(({ data }) => {
           setUser(data);
         })
        .catch((err)=>{
         console.log(err);
        })
    }
  },[conversation,employer?._id])



  useEffect(()=>{
  if(conversation){
    axios.get(`/chat/emp-unreadMessages/${conversation._id}`,{withCredentials:true}).then(({data})=>{
     setUnreadMessages(data.filter((mesg)=>mesg.from!==employer?._id))
    }).catch((err)=>{
    console.log(err);
    })
  } 
  },[conversation,employer?._id])

   

  return (
    <>
    {`${user?.fName} ${user?.lName}`.toLowerCase().includes(searchQuery?.toLowerCase()) || searchQuery === "" ? (
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
        bgcolor={user?._id===chatUser?._id&&'#eceff1'}
        onClick={() => {
          dispatch(
            setChatUser({
              _id: user?._id,
              name: user?.fName + " " + user?.lName,
              image:user?.image
            })
          );
        }}
      >
        {/* ############################################################################## */}
        {onlineUsers?.includes(user?._id) ? (
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar src={`http://localhost:4001/image/${user?.image}`} alt="Remy Sharp"></Avatar>
          </StyledBadge>
        ) : (
          <Avatar src={`http://localhost:4001/image/${user?.image}`}></Avatar>
        )}
        <div  style={{ marginLeft: "10px",display:'flex',justifyContent:'space-between',width:'100%', alignItems:'center' }}>
          <Box>
            <Typography  variant="subtitle1">{user?.fName+' '+user?.lName}</Typography>
           {unreadMessages.length!==0&&<Typography variant="caption">{unreadMessages[unreadMessages.length-1].message}</Typography>}  
          </Box>
          { unreadMessages.length!==0&&<Box  marginRight={2}><Badge badgeContent={unreadMessages.length} color="success"></Badge></Box>}
           
         </div>
      </Box>
    ) : null}
  </>
        
  );
}

export default EmployerConversation;
