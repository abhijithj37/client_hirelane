import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "../../axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setEmployerApplications } from "../../app/features/employerSlice";

function EmployerApplication() {
    const navigate=useNavigate()
  const dispatch = useDispatch();
  const { employerApplications } = useSelector((state) => state.employer);

  useEffect(() => {
    axios
      .get("/applications/emp-app-details",{ withCredentials: true })
      .then(({data})=>{
       dispatch(setEmployerApplications(data.applications));
      })
      .catch((err) =>{
      console.log(err.message);
      });
  }, [dispatch]);


  return (
    <Box
      component="main"
      sx={{
        backgroundColor:(theme)=>theme.palette.common.white,
        flexGrow:1,
        height:"100vh",
        overflow:"auto",
      }}
    >
      <Toolbar />

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Grid container paddingTop={3}>
          <Box width={"100%"}>
            <Typography letterSpacing={1.3} fontWeight={500} variant="h4">
              Applications
            </Typography>
            <Divider sx={{marginTop:1,bgcolor:"black"}}></Divider>
          </Box>


        {employerApplications.length?
          employerApplications.map((element, indx) => {
              return (
                <Grid   lg={12} marginTop={3} item container>
                  <Grid lg={4}  item>
                    <Box>
                      <Typography variant="h6" color={"black"} component={Link}>
                      {element.jobTitle}
                      </Typography>
                      <Typography>{element.location}</Typography>
                    </Box>

                  </Grid>
                  <Grid item lg={6}>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color={"primary"}
                      >
                        {element.count} Active Candidates
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item lg={2}>
                    <Box>
                      <Button onClick={()=>navigate(`/emp/applicationdetails/${element._id}`)} size="small" variant={"outlined"}>
                        View Details
                      </Button>
                    </Box>
                  </Grid>
                  <Grid marginTop={1} lg={12}><Divider></Divider></Grid>
                </Grid>
              );
          }):<Box marginTop={5} width={'100%'} justifyContent={'center'} textAlign={'center'} display={'flex'} alignContent={'center'}>
            <Typography variant="body1" fontWeight={500} color={'gray'} textAlign={'center'}>No Active Applications Yet</Typography>
            </Box>}

        </Grid>
      </Container>
    </Box>
  );
}

export default EmployerApplication;
