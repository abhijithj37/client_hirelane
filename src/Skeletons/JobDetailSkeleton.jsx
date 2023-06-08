



import { Box, Divider, Skeleton, Typography } from '@mui/material'
import React from 'react'

function JobDetailSkeleton() {
  return (
    <Box
  sx={{
    height: 725,
    overflow: "auto",
    borderRadius: 3,
    boxShadow: "0px 3px 5px rgba(0,0,0,0.1)",
    border: 1,
    borderColor: "lightgray",
  }}
>
  <Box
    sx={{
      position: "sticky",
      top: 0,
      backgroundColor: "white",
      padding: 2,
      boxShadow: "0px 3px 5px rgba(0,0,0,0.1)",
    }}
  >
    <Skeleton variant="text" width={200} height={30} />
    <Skeleton variant="text" width={300} height={20} />
    <Skeleton variant="text" width={200} height={20} />
    <Skeleton variant="text" width={150} height={20} />
    <Skeleton variant="rectangular" animation="wave" width={100} height={40} />
  </Box>
  <Box sx={{ paddingTop: "10px" }}>
    <Typography marginLeft={1} variant="h6">
      <Skeleton variant="text" width={150} height={30} />
    </Typography>
    <Box padding={1}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontSize={17} variant="h6">
          <Skeleton variant="text" width={150} height={30} />
        </Typography>
        <Skeleton variant="text" width={100} height={20} />
      </Box>
      <Skeleton variant="text" width={150} height={20} />
      <Divider sx={{ margin: 1 }}></Divider>
      <Box padding={2}>
        <Typography variant="h6">
          <Skeleton variant="text" width={150} height={30} />
        </Typography>
        <Box
          textAlign={"center"}
          bgcolor={"lightgray"}
          borderRadius={1}
          fontFamily={"initial"}
          width={120}
          border={1}
          borderColor={"lightgray"}
        >
          <Skeleton variant="text" width={80} height={30} />
        </Box>
      </Box>
      <Divider sx={{ margin: 1 }}></Divider>
      <Box padding={1} sx={{ wordWrap: "break-word" }}>
        <Typography variant="h6">
          <Skeleton variant="text" width={150} height={30} />
        </Typography>
        <Skeleton variant="text" width={500} height={100} />
      </Box>
      <Divider sx={{ margin: 1 }}></Divider>
      <Box padding={1}>
        <Typography variant="h6">
          <Skeleton variant="text" width={150} height={30} />
        </Typography>
        <Typography fontSize={17} variant="h6">
          <Skeleton variant="text" width={150} height={30} />
        </Typography>
      </Box>
      <Divider sx={{ margin: 1 }}></Divider>
    </Box>
  </Box>
</Box>
  )
}

export default JobDetailSkeleton




 
