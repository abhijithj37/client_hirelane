
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import TimeAgo from 'react-timeago'
import axios from '../../axios'
function EmployerSingleMessage({message,scrollRef}) {

    const {employer}=useSelector((state)=>state.employer)
   

    useEffect(()=>{

    if(message&&message.from!==employer._id&&!message.read){
     const data={
     messageId:message._id
    }
     axios.put(`/chat/emp-update-msg`,data,{withCredentials:true}).then(({data})=>{
     
     }).catch((err)=>{
     console.log(err.message);
     })
    }

    },[message,employer?._id])

  return (
    <div
    ref={scrollRef}
    
        style={{
        display:"flex",
        justifyContent:
        message.from===`${employer?._id}`?"flex-end":"flex-start",
        marginBottom:"10px",
      }}
    >

      <div
        style={{
          backgroundColor: 
          message.from === `${employer?._id}`? "#3f51b5" : "#f5f5f5",
          color: message.from ===`${employer?._id}` ? "#fff" : "#000",
          borderRadius:"17px",
          padding:"10px",
          maxWidth:"70%",
          wordBreak:"break-word",
        }}
      > 
        {message?.message}
      </div>
      <div
style={{
alignSelf:"flex-end",
fontSize:"12px",
color:"#999",
marginTop:"5px",
}}
>
{<TimeAgo date={message.createdAt}/>  }
</div>
 </div>
  )
}

export default EmployerSingleMessage
