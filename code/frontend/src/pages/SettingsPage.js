import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
// @mui
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Grid,
  TextField,
  CardHeader,
} from "@mui/material";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

// ----------------------------------------------------------------------

export default function SettingsPage() {
  const { user, updateUserDetails } = useOutletContext();

  useEffect(() => {
  }, []);

  const handleSubmitUser = async () => {
    const updatedUser = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      phone: document.getElementById("phone").value,
    };

    axios
      .put("http://43.205.113.198:3001/me/", updatedUser, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log("Successfully updated");
        updateUserDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Helmet>
        <title> Settings | LabEnv </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" marginBottom={5}>
          Settings
        </Typography>
        <Grid container spacing={3}>
          {user && (
            <Grid item xs={12} md={6} lg={9}>
              <Card id="user_form">
                <CardHeader
                  title="User Information"
                  subheader="Add the basic information of you here."
                />
                <Stack spacing={3} padding={3}>
                  <TextField
                    name="firstName"
                    id="firstName"
                    label="First Name"
                    defaultValue={user.firstName}
                  />
                  <TextField
                    name="lastName"
                    id="lastName"
                    label="Last Name"
                    defaultValue={user.lastName}
                  />
                  <TextField
                    name="email"
                    id="email"
                    label="Email"
                    defaultValue={user.email}
                    disabled
                  />
                  <TextField
                    name="phone"
                    id="phone"
                    label="Phone"
                    defaultValue={user.phone}
                  />

                  <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={handleSubmitUser}
                  >
                    Submit
                  </Button>
                </Stack>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
