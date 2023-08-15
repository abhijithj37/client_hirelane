import { Box, Container, Toolbar ,Typography,Grid} from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EmployerSingleNotification from '../../Components/EmployerComponents/EmployerSingleNotification'
import axios from '../../axios'
import { setEmployerNotifications } from '../../app/features/employerSlice'

function EmployerNotifications() {

    const dispatch=useDispatch()
    const {notifications}=useSelector((state)=>state.employer)
    const handleDeleteNotification=(id)=>{
        axios.delete(`employer/my-notification/${id}`,{withCredentials:true}).then(()=>{
           dispatch(setEmployerNotifications(notifications?.filter((n)=>n._id!==id)))
        }).catch((err)=>{
           console.log(err.message)
        })
      }
  
  return (
    <Box  
          component="main"
          sx={{
            backgroundColor:(theme)=>theme.palette.common.white,
            flexGrow:1,
            height:"100vh",
            overflow:"auto",
            background: "#f5f5f5"
          }}
        >
          <Toolbar/>
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
            
            <EmployerSingleNotification handleDeleteNotification={handleDeleteNotification} e={e}/>
              ) }):
              <Box alignItems={'center'} width={'100%'} display={'flex'} justifyContent={'center'}>
            <Typography variant="h6">No new Notifications</Typography>
          </Box>
          }
          
          </Grid>
         
           


        </Grid>
      </Container>

          </Box>
  )
}

export default EmployerNotifications
