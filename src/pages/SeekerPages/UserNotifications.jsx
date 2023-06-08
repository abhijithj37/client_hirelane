import React from "react";
import Header from "../../Components/userComponents/Header";
import { Box, Container, Grid,Typography } from "@mui/material";
 import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { setNotifications } from "../../app/features/seekerSlice";
import UserSingleNotification from "../../Components/userComponents/userSingleNotification";

function UserNotifications() {
  const dispatch=useDispatch()
  const { notifications } = useSelector((state) => state.seeker);

  

  const handleDeleteNotification=(id)=>{
    axios.delete(`seeker/my-notification/${id}`,{withCredentials:true}).then(()=>{
        dispatch(setNotifications(notifications?.filter((n)=>n._id!==id)))
    }).catch((err)=>{
        console.log(err.message);
    })

  }
  

   
  return (
    <div style={{ background: "#f5f5f5", height: "105vh" }}>
      <Header></Header>
      <Container
        sx={{
          background: "white",
          marginTop: 2,
          height: "93vh",
          paddingTop: 2,
          borderRadius: 1,
           
        }}
        maxWidth="md"
      >
        <Box>
          <Typography
            gutterBottom
            letterSpacing={1.7}
            fontWeight={700}
            variant="h4"
          >
            Notifications
          </Typography>
        </Box>
        <Grid height={'83vh'} sx={{overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display:"none",
          },}} container>

           
          <Grid
            padding={1}
            marginTop={1}
            item
        
            lg={12}
        
          >
              {notifications.length!==0?
            notifications.map((e)=>{
          return(
            
            <UserSingleNotification handleDeleteNotification={handleDeleteNotification} e={e}/>
              ) }):
              <Box alignItems={'center'} width={'100%'} display={'flex'} justifyContent={'center'}>
            <Typography variant="h6">No new Notifications</Typography>
          </Box>
          }
          
          </Grid>
         
           


        </Grid>
      </Container>
    </div>
  );
}

export default UserNotifications;
