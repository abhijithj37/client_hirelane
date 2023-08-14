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

            ))}
          </Box>
      
        
  );
}

export default EmployerMessages;
