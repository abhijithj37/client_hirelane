import { Box} from "@mui/material";
 import React, { useEffect, useRef } from "react";
 import SeekerSingleMessage from "./SeekerSingleMessage";
  
function SeekerMessages({messages}) {
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

              <SeekerSingleMessage scrollRef={scrollRef} key={index} message={message}/>
        
              
            ))} 
          </Box>
      
        
  );
}

export default SeekerMessages;
