import { Box, Typography, Container } from "@mui/material";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";

const CaseStudies = () => {
  return (
    <Box sx={{ backgroundColor: "#f7f9fa", minHeight: "70vh", py: { xs: 8, md: 12 } }}>
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <InsightsOutlinedIcon sx={{ fontSize: 70, color: "#59e3a7" }} />
        <Typography variant="h4" fontWeight={700} sx={{ color: "#1b2e35", mt: 2 }}>
          Case Studies — coming soon
        </Typography>
        <Typography sx={{ color: "#6b7280", mt: 2, lineHeight: 1.8 }}>
          We&apos;re collecting real stories from people using Smart Post to manage their posts,
          products, and tasks. Check back soon, or{" "}
          <a href="/contact" style={{ color: "#1b7a52" }}>
            get in touch
          </a>{" "}
          if you&apos;d like to share yours.
        </Typography>
      </Container>
    </Box>
  );
};

export default CaseStudies;
