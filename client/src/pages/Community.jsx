import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ForumIcon from "@mui/icons-material/Forum";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Link } from "react-router-dom";

const perks = [
  {
    icon: <GroupsIcon sx={{ fontSize: 40, color: "#59e3a7" }} />,
    title: "Public Posts",
    text: "Every post you publish gets its own shareable link, so anyone — logged in or not — can read it, react to it, and leave a comment.",
    link: "/registration",
    linkText: "Create your first post",
  },
  {
    icon: <ForumIcon sx={{ fontSize: 40, color: "#59e3a7" }} />,
    title: "Reactions & Comments",
    text: "Readers can react (like, love, or flag as disappointing) and leave comments directly on your published post — no separate app needed.",
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#59e3a7" }} />,
    title: "Growing Together",
    text: "Smart Post is actively growing. Follow our progress and get involved as the community features expand.",
  },
];

const Community = () => {
  return (
    <Box sx={{ backgroundColor: "#f7f9fa", minHeight: "70vh", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            fontWeight="700"
            sx={{ color: "#1b2e35", fontSize: { xs: "2rem", md: "3rem" } }}
          >
            The Smart Post Community
          </Typography>
          <Typography sx={{ color: "#6b7280", maxWidth: "700px", mx: "auto", mt: 2, lineHeight: 1.8 }}>
            Every post you write on Smart Post is public by default — connect with readers,
            get reactions, and start conversations in the comments.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {perks.map((perk, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Paper elevation={0} sx={{ p: 4, height: "100%", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
                {perk.icon}
                <Typography variant="h6" fontWeight={700} sx={{ mt: 2, color: "#1b2e35" }}>
                  {perk.title}
                </Typography>
                <Typography sx={{ color: "#6b7280", mt: 1, lineHeight: 1.7 }}>{perk.text}</Typography>
                {perk.link && (
                  <Link to={perk.link} style={{ color: "#1b7a52", fontWeight: 600, display: "inline-block", marginTop: "12px" }}>
                    {perk.linkText} →
                  </Link>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Community;
