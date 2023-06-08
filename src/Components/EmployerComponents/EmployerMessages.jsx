import { Box, } from "@mui/material";
 import React, { useEffect, useRef } from "react";
  import EmployerSingleMessage from "./EmployerSingleMessage";
function EmployerMessages({messages}) {
     const scrollRef = useRef();
      
     

   useEffect(()=>{
   scrollRef.current?.scrollIntoView({ behavior: "smooth" });
   
  },[messages])

   
  return(
    <Box
            padding={3}
            style={{
              flex: 1,
              overflowY: "scroll",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {messages.map((message, index) => (

              <EmployerSingleMessage scrollRef={scrollRef} key={index} message={message}/>

    //           <div
    //           ref={scrollRef}
    //              key={index}
    //               style={{
    //               display:"flex",
    //               justifyContent:
    //               message.from ==`${employer?._id}` ? "flex-end" : "flex-start",
    //               marginBottom: "10px",
    //             }}
    //           >

    //             <div
    //               style={{
    //                 backgroundColor: 
    //                 message.from === `${employer?._id}`? "#3f51b5" : "#f5f5f5",
    //                 color: message.from ===`${employer?._id}` ? "#fff" : "#000",
    //                 borderRadius:"17px",
    //                 padding:"10px",
    //                 maxWidth:"70%",
    //                 wordBreak:"break-word",
    //               }}
    //             >
    //               {message?.message}
    //             </div>
    //             <div
    //   style={{
    //     alignSelf: "flex-end",
    //     fontSize: "12px",
    //     color: "#999",
    //     marginTop: "5px",
    //   }}
    // >
    //   {format(message.createdAt)}

    //   </div>
    //           </div>
            ))}
          </Box>
      
        
  );
}

export default EmployerMessages;
