import { Box, Skeleton } from '@mui/material'
import React from 'react'

function JobPostSkeleton() {
  return (
    <>
    <Skeleton variant="rectangular" animation="wave" height={200} />
<Box sx={{ minHeight:100,maxHeight:150, padding: 2, borderRadius: 2 ,marginBottom:2}}>
  <Skeleton variant="text" animation="wave" height={40} />
  <Skeleton variant="text" animation="wave" height={20} />
  <Skeleton variant="text" animation="wave" height={20} />
  <Box
    textAlign={"center"}
    bgcolor={"lightgray"}
    marginTop={1}
    borderRadius={1}
    fontFamily={"initial"}
    width={100}
    border={1}
    borderColor={"lightgray"}
  >
    <Skeleton variant="text" animation="wave" height={20} />
  </Box>
  <Box  sx={{wordWrap:"break-word"}} width={500}>
  <Skeleton variant="text" animation="wave" height={100}/>
  </Box>
</Box>
</>

  )
}

export default JobPostSkeleton
