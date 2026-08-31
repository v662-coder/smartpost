import { Box, Typography, Container } from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

const Blogs = () => {
  return (
    <Box sx={{ backgroundColor: "#f7f9fa", minHeight: "70vh", py: { xs: 8, md: 12 } }}>
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <ArticleOutlinedIcon sx={{ fontSize: 70, color: "#59e3a7" }} />
        <Typography variant="h4" fontWeight={700} sx={{ color: "#1b2e35", mt: 2 }}>
          Our Blog — coming soon
        </Typography>
        <Typography sx={{ color: "#6b7280", mt: 2, lineHeight: 1.8 }}>
          We&apos;re working on official Smart Post articles about product updates, writing tips,
          and community highlights. In the meantime, every public post written on Smart Post is
          effectively a blog post of its own — browse one by visiting a shared post link.
        </Typography>
      </Container>
    </Box>
  );
};

export default Blogs;
