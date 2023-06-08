
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from '../../axios'
import TimeAgo from 'react-timeago'
function SeekerSingleMessage({message,scrollRef}) {

    const {seeker}=useSelector((state)=>state.seeker)
    
    useEffect(()=>{
    if(message&&message.from!==seeker?._id&&!message.read){
      console.log(message,'this is going to update');
    const data={
    messageId:message._id
     }
     axios.put(`/chat/update-msg`,data,{withCredentials:true}).then(({data})=>{
     console.log(data);
     }).catch((err)=>{
     console.log(err.message);
     })
    }
    },[message,seeker?._id])

  return (
    <div
    ref={scrollRef}
    
        style={{
        display:"flex",
        justifyContent:
        message.from===`${seeker?._id}`?"flex-end":"flex-start",
        marginBottom:"10px",
      }}
    >

      <div
        style={{
          backgroundColor: 
          message.from === `${seeker?._id}`? "#3f51b5" : "#f5f5f5",
          color: message.from ===`${seeker?._id}` ? "#fff" : "#000",
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

export default SeekerSingleMessage
