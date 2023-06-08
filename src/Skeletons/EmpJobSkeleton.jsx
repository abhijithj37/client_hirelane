import React from 'react'
import {Grid,Skeleton} from'@mui/material'
function EmpJobSkeleton() {
  return (
    <div>
      <Grid container sx={{ backgroundColor: "white" }} spacing={1}>
  {[...Array(10)].map((_, index) => (
    <Grid key={index} item xs={12} lg={12}>
      <Grid
        sx={{
          p: 2,
          display: "flex",
          height: 150,
          border: 1,  
          borderColor: "lightgray",
          "&:hover": {
            borderColor: "lightblue",
          },
          borderRadius: 1,
        }}
      >
        <Grid item lg={1.3}>
          <Skeleton variant="circular" width={50} height={50} />
        </Grid>
        <Grid item lg={10}>
          <Skeleton variant="text" width={200} height={30} />
          <Skeleton variant="text" width={150} height={20} />
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={70} height={20} />
        </Grid>
        <Grid item lg={0.7}>
          <Skeleton variant="rectangular" width={30} height={30} />
        </Grid>
      </Grid>
    </Grid>
  ))}
</Grid>

    </div>
  )
}

export default EmpJobSkeleton
