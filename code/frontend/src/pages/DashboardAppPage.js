import { Helmet } from "react-helmet-async";
// @mui
import {
  Grid,
  Container,
  Typography,
  Stack,
  Button,
  CardHeader,
  TextField,
  Card,
} from "@mui/material";
// sections
import {
  AppBarChart,
  AppDataRecords,
  AppWidgetSummary,
} from "../sections/@dashboard/app";
import {
  Bedtime,
  MonitorHeart,
  Straighten,
  Sync,
  Thermostat,
} from "@mui/icons-material";
import AppMap from "src/sections/@dashboard/app/AppMap";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const { user } = useOutletContext();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    getTableData();
    getOverview();
  }, []);

  const getTableData = () => {};

  const getOverview = () => {};

  return (
    <>
      <Helmet>
        <title> Dashboard | Lab Monitoring System </title>
      </Helmet>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="column">
            <Typography variant="h4">Hello, {user.firstName}</Typography>
            <Typography
              variant="subtitle1"
              sx={{ mb: 5, color: "text.secondary" }}
            >
              Welcome to LabEnv Dashboard!
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Temperature"
              value={overview ? overview.vital.temperature + " ℃" : "0 ℃"}
              icon={<Thermostat />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Humidity"
              value={overview ? overview.vital.heartRate + " mm" : "0 mm"}
              color="info"
              icon={<MonitorHeart />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Air Pressure"
              value={overview ? overview.sleep.duration + " Pa" : "0 Pa"}
              color="warning"
              icon={<Bedtime />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Fan Speed"
              value={overview ? overview.location.distance + " rpm" : "0 rpm"}
              color="error"
              icon={<Straighten />}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppBarChart
              title="Chart Title"
              subheader="Subheader"
              chartLabels={[
                "12/11/2022",
                "12/12/2022",
                "12/13/2022",
                "12/14/2022",
                "12/15/2022",
                "12/16/2022",
                "12/17/2022",
                "12/18/2022",
                "12/19/2022",
                "12/20/2022",
                "12/21/2022",
              ]}
              chartData={[
                {
                  name: "Name",
                  type: "column",
                  fill: "solid",
                  data: [300, 250, 360, 300, 450, 350, 640, 520, 590, 360, 390],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppMap
              title={"Title"}
              subheader={"Subheader"}
              location={overview?.location}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
