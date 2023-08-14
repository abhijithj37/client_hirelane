import axios from "../../axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  Toolbar,
  
  
} from "@mui/material";
import { useDispatch} from "react-redux";
import { setChatUser } from "../../app/features/employerSlice";

function CandidateInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const { id } = useParams();
  const [application, setApplication] = useState(null);
  useEffect(() => {
    axios
      .get(`applications/emp-getApplication/${id}`, { withCredentials: true })
      .then(({ data }) => {
        setApplication(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [id]);

  
  return (
    
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) => theme.palette.common.white,
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      

      <Container sx={{paddingTop:2}}>
        <Box
          border={1}
          borderRadius={2}
          sx={{ borderColor: "lightgray" }}
          padding={2}
          display={"flex"}
          justifyContent={"space-between"}
        >
          {/* ********************************************** */}
          <Box>
            <Box marginTop={1} display={"flex"}>
              <Box>
                <Avatar
                  sx={{ width: 56, height: 56 }}
                  src={`https://fashionbytes.online/seeker/image/${application?.image}`}
                ></Avatar>
              </Box>
              <Box marginLeft={1}>
                <Typography variant="h5">
                  {application?.fName + " " + application?.lName}
                </Typography>

                <Typography variant="body2" color={"gray"}>
                  Applied on {application?.createdAt}
                </Typography>
              </Box>
            </Box>
            <Box display={"flex"} padding={0} marginTop={1}>
              <Button
                target="_blank"
                href={application?.cvUrl}
                size="small"
                sx={{ borderRadius: 5 }}
                variant="contained"
              >
                View CV
              </Button>
              <Button
                size="small"
                sx={{ borderRadius: 5, marginLeft: 1 }}
                variant="outlined"
                onClick={() => {
                  dispatch(
                    setChatUser({
                      name: application?.fName + " " + application?.lName,
                      _id: application?.candidateId,
                      image: application?.image,
                    })
                  );
                  navigate("/emp/employerChat");
                }}
              >
                Message
              </Button>
            </Box>
          </Box>
          <Box width={'15%'}>
          <Box
            borderRadius={1}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            bgcolor={
              application?.status === "Shortlisted" ? "lightgreen" : "#e1f5fe"
            }
            maxWidth={80}
            maxHeight={30}
            padding={0.5}
          >
            <Typography fontWeight={600} variant="body2" color={"white"}>
              {application?.status}
            </Typography>
          </Box>
        </Box>
        </Box>
        {/* ********************************************** */}

        <Box
          padding={2}
          border={1}
          borderRadius={2}
          sx={{ borderColor: "lightgray" }}
          marginTop={1}
        >
          <Box>
            <Typography variant="h6">Application Details</Typography>
            <Typography color={"gray"} fontWeight={500}>
              Contact information
            </Typography>
          </Box>
          <Box
            boxShadow={1}
            marginTop={1}
            border={1}
            borderRadius={1}
            sx={{ borderColor: "lightgray" }}
          >
            <Box padding={1} borderBottom={1} sx={{ borderColor: "lightgray" }}>
              <Typography color={"gray"}>Full Name</Typography>
              <Typography sx={{ opacity: 0.9 }} fontWeight={600}>
                {application?.fName} {application?.lName}
              </Typography>
            </Box>
            <Box
              marginTop={1}
              padding={1}
              borderBottom={1}
              sx={{ borderColor: "lightgray" }}
            >
              <Typography sx={{ opacity: 0.9 }} color={"gray"}>
                Email address
              </Typography>
              <Typography sx={{ opacity: 0.9 }} fontWeight={600}>
                {application?.email}
              </Typography>
            </Box>
            <Box
              marginTop={1}
              padding={1}
              borderBottom={1}
              sx={{ borderColor: "lightgray" }}
            >
              <Typography color={"gray"}>Phone</Typography>
              <Typography fontWeight={600}>{application?.phone}</Typography>
            </Box>
            <Box
              marginTop={1}
              padding={1}
              borderBottom={0}
              sx={{ borderColor: "lightgray" }}
            >
              <Typography color={"gray"}>Applied Post</Typography>
              <Typography fontWeight={600}>{application?.jobTitle}</Typography>
            </Box>
          </Box>

          <Box marginTop={1.5}>
            <Box>
              <Typography color={"black"} fontSize={"18px"} fontWeight={500}>
                Screening Questions Responses
              </Typography>
            </Box>

            <Box borderRadius={1} sx={{ borderColor: "lightgray" }} padding={1}>
              {application &&
                application?.questions.map((ques, idx) => {
                  return (
                    <Box
                      key={idx}
                      marginTop={1}
                      sx={{ borderColor: "lightgray" }}
                      borderBottom={1}
                    >
                      <Typography>
                        {idx + 1}.{ques.question}
                      </Typography>
                      <Typography fontWeight={600}>{ques.answer}</Typography>
                    </Box>
                  );
                })}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default CandidateInfo;
