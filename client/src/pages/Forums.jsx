import { Box, Typography, Container, Button } from "@mui/material";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { Link } from "react-router-dom";

const Forums = () => {
  return (
    <Box sx={{ backgroundColor: "#f7f9fa", minHeight: "70vh", py: { xs: 8, md: 12 } }}>
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <ForumOutlinedIcon sx={{ fontSize: 70, color: "#59e3a7" }} />
        <Typography variant="h4" fontWeight={700} sx={{ color: "#1b2e35", mt: 2 }}>
          Forums are coming soon
        </Typography>
        <Typography sx={{ color: "#6b7280", mt: 2, lineHeight: 1.8 }}>
          A dedicated discussion forum isn&apos;t built yet — but you don&apos;t have to wait to
          start a conversation. Every post on Smart Post already supports public comments and
          reactions right on the post page.
        </Typography>
        <Button
          component={Link}
          to="/registration"
          variant="contained"
          sx={{ mt: 4, backgroundColor: "#59e3a7", "&:hover": { backgroundColor: "#4bcf95" } }}
        >
          Publish a Post & Start the Conversation
        </Button>
      </Container>
    </Box>
  );
};

export default Forums;
