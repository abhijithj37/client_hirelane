import { Close } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { handleUpdateNotification } from '../../Utils/api'
import { useDispatch } from 'react-redux'
import { setUnreadNotifications } from '../../app/features/seekerSlice'

function UserSingleNotification({handleDeleteNotification,e}) {
const dispatch=useDispatch()  

useEffect(()=>{
 if (e&&!e.read) {
    handleUpdateNotification(e._id,'seeker')
    dispatch(setUnreadNotifications([]))
 }

},[e,dispatch]) 

  return (
    <Box border={1}
            padding={1}
            marginTop={1}
             sx={{ borderColor: "lightgray", borderRadius: 2 }}
            >

             
            
            <Box
              width={"100%"}
              justifyContent={"space-between"}
              display={"flex"}
            >
              <Typography variant="h6">{e.from}</Typography>
              <IconButton onClick={()=>handleDeleteNotification(e._id)}>
                <Close />
              </IconButton>
            </Box>
            <Box>
              <Typography>
                {" "}
                {e.content}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color={"gray"}>
                {new Date(e.createdAt).toLocaleDateString('en-us',{day:'numeric',month:'short',year:'numeric'})}
              </Typography>{" "}
              <Typography variant="caption" color={"gray"}>
                {new Date(e.createdAt).toLocaleTimeString()} 
              </Typography>
            </Box> 
            </Box>
  )
}

export default UserSingleNotification
