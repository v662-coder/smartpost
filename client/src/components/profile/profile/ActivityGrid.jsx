import { Container, Box, Typography, Paper, Grid, Skeleton } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import useThinkify from "../../../hooks/useThinkify";

const ActivityGrid = () => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/users/activity`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(
                import.meta.env.VITE_TOKEN_KEY
              )}`,
            },
          }
        );
        if (response.data.status) {
          const formattedData = response.data.userActivity
            .map((entry) => ({
              date: new Date(entry.date),
              activity: entry.activity,
            }))
            .sort((a, b) => a.date - b.date);
          setActivityData(formattedData);
        } else {
          setAlertBoxOpenStatus(true);
          setAlertSeverity("error");
          setAlertMessage(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(
          error.response?.data?.message || error.message || "Unable to load activity."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Last 30 days, formatted for the bar chart.
  const last30Days = activityData.slice(-30).map((day) => ({
    label: day.date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    fullDate: day.date.toDateString(),
    activity: day.activity,
  }));

  // Simple, honest summary stats computed from the same real data — no invented numbers.
  const totalThisMonth = activityData
    .filter((day) => {
      const now = new Date();
      return day.date.getMonth() === now.getMonth() && day.date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, day) => sum + day.activity, 0);

  const activeDaysLast30 = last30Days.filter((day) => day.activity > 0).length;

  let currentStreak = 0;
  for (let i = activityData.length - 1; i >= 0; i--) {
    if (activityData[i].activity > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ margin: "30px auto" }}>
        <Skeleton variant="rounded" height={220} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ margin: "30px auto" }}>
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e5e7eb", borderRadius: "10px" }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: "#1b2e35", mb: 2 }}>
          Recent Activity
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: "center", p: 1.5, backgroundColor: "#f0fdf6", borderRadius: "8px" }}>
              <Typography variant="h5" fontWeight={700} color="#1b7a52">
                {totalThisMonth}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Actions this month
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: "center", p: 1.5, backgroundColor: "#f0fdf6", borderRadius: "8px" }}>
              <Typography variant="h5" fontWeight={700} color="#1b7a52">
                {activeDaysLast30}/30
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active days
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: "center", p: 1.5, backgroundColor: "#f0fdf6", borderRadius: "8px" }}>
              <Typography variant="h5" fontWeight={700} color="#1b7a52">
                {currentStreak}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Day streak
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {activeDaysLast30 === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            No activity in the last 30 days yet — create a post, product, or task to see it here.
          </Typography>
        ) : (
          <Box sx={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last30Days} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  interval={Math.max(0, Math.floor(last30Days.length / 8))}
                  tick={{ fontSize: 11 }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${value} action${value === 1 ? "" : "s"}`, ""]}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                />
                <Bar dataKey="activity" fill="#59e3a7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ActivityGrid;
