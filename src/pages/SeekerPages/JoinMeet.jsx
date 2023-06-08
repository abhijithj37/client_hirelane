import React, { useCallback, useEffect, useState } from 'react'
import TopBar from '../meetings/TopBar'
import {Container,Grid,Typography,TextField,Button,Box} from '@mui/material'
import { useSocket } from '../../Context/SocketProvider'
import { useNavigate } from 'react-router-dom'
 import { useDispatch, useSelector } from 'react-redux'
 import { setMystream } from '../../app/features/seekerSlice'
function Join() {

  const socket=useSocket()
  const [meetId,setMeetId]=useState()
   const [err,setErr]=useState(null)
  const {seeker}=useSelector((state)=>state.seeker)
  const navigate=useNavigate()
  const dispatch=useDispatch()
  


  
  const createMyStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio:true,
      video:true,
    });
     dispatch(setMystream(stream))

    };

  const handleStartMeet=useCallback(()=>{
     


  const user={name:seeker?.fName+' '+seeker?.lName,userId:seeker?._id} 
  const meet=meetId
  socket.emit('join:meet',{user,meet})
  createMyStream()

  },[meetId,socket,seeker?._id])




  const handleJoinMeet=useCallback((data)=>{
  const {user,meet}=data 
  navigate(`/meet/${meet}`)
  },[navigate])


 
  

   
  



  useEffect(()=>{

  socket.on('join:meet',handleJoinMeet)

  return ()=>{

  socket.off('join:meet',handleJoinMeet)
 
  }

  },[socket,handleJoinMeet])

   return(
    <div>
      <TopBar></TopBar>
      <Container>
        <Grid minHeight={'60vh'} alignContent={'center'}alignItems={'center'} justifyContent={'center'} container  >
<Grid  alignItems={'center'} justifyContent={'center'} alignContent={'center'}   item lg={4}>
    <Box display={'flex'} justifyContent={'center'}><Typography gutterBottom variant='h4' >Join Meeting</Typography></Box>
    <Box marginTop={4}> 
<Typography variant='body2' color={'gray'} >Enter your meeting id</Typography>
<TextField error={!!err} helperText={err||" "} value={meetId} onChange={(e)=>setMeetId(e.target.value)} sx={{borderRadius:3}}  margin='dense' fullWidth size='small' label='Meeting Id'></TextField>
 </Box>
 <Box marginTop={2}>
<Button sx={{borderRadius:4}} disabled={meetId===""} onClick={handleStartMeet} fullWidth variant='contained'>Join</Button>
</Box>
</Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Join 
