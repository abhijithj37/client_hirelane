import { useEffect } from 'react';
import axios from '../axios'
import { useSocket } from '../Context/SocketProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setNotifications } from '../app/features/seekerSlice';
import { setEmployerNotifications, setEmployerUnreadNotifications } from '../app/features/employerSlice';


export const verifyEmployer = () => {

  return axios
    .get("/employer/verifyEmployer", { withCredentials: true })
    .then(({ data }) => {
    
       return data.user;
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized");
      }
      throw new Error("Something went wrong");
    });
};

export const verifySeeker=()=>{
    return axios
    .get("/seeker/verifyUser", { withCredentials: true })
    .then(({ data }) => {
     return data.user[0];
    })
    .catch((error) => {
    if (error.response && error.response.status === 401) {
    throw new Error("Unauthorized");
    }
    throw new Error("Something went wrong")
    });
};

export const useConnectUser=()=>{
  const socket=useSocket()
  const dispatch=useDispatch()
  const {seeker,notifications}=useSelector((state)=>state.seeker)
  
 
  useEffect(()=>{
    if(seeker){
      socket?.emit("connect-user",seeker?._id)
    }
   },[seeker?._id,socket,seeker])

   useEffect(()=>{
    axios.get('/seeker/my-notifications',{withCredentials:true}).then(({data})=>{
      dispatch(setNotifications(data))
    }).catch((err)=>{
      console.log(err.message);
    })
    },[dispatch])
    

    useEffect(()=>{
    socket.on('arriving-notification',(data)=>{
    dispatch(setNotifications([data,...notifications]))
    })
    },[dispatch,notifications,socket])


}


 
export const useConnectEmployer=()=>{
  const socket=useSocket()
  const dispatch=useDispatch()
  const {employer,notifications,updated}=useSelector((state)=>state.employer)
  
 

  useEffect(()=>{
    if(employer){
      socket?.emit("connect-user",employer?._id)
    }
   },[employer?._id,socket,employer])


   useEffect(()=>{
    console.log('calll iiiinnnnn');
    axios.get('/employer/my-notifications',{withCredentials:true}).then(({data})=>{
      dispatch(setEmployerNotifications(data))
    }).catch((err)=>{
      console.log(err.message);
    })
    },[dispatch,updated])
    

    useEffect(()=>{
    socket.on('arriving-notification',(data)=>{
    dispatch(setEmployerNotifications([data,...notifications]))
    })
    },[dispatch,notifications,socket])

       useEffect(()=>{
      dispatch(setEmployerUnreadNotifications(notifications?.filter((n)=>n.read===false)))
    },[dispatch,notifications])
  



}


export const handleSendNotification=(from,to,content,socket)=>{
const notification={
  from,
  to,
  content,
  createdAt:new Date()
}
 
axios.post('/employer/send-notification',notification,{withCredentials:true}).then(({data})=>{ 
socket?.emit('send-notification',data)

}).catch((err)=>{
   console.log(err.message)
})

}

export const handleUpdateNotification=(id,user)=>{
  const data={
    id
  }
  axios.put(`/${user}/my-notification`,data,{withCredentials:true}).then(({data})=>{
    console.log('updated sucessfully');
    
  }).catch((err)=>{
    console.log(err.message)
  })

}

 
  
