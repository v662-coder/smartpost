import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Divider,
} from "@mui/material";

const About = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f7f9fa",
        minHeight: "70vh",
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            fontWeight="700"
            sx={{
              color: "#1b2e35",
              fontSize: {
                xs: "2rem",
                md: "3rem",
              },
            }}
          >
            About Smart Post
          </Typography>

          <Typography
            sx={{
              color: "#6b7280",
              maxWidth: "700px",
              mx: "auto",
              mt: 2,
              lineHeight: 1.8,
            }}
          >
            Connecting Ideas, Inspiring Perspectives. Smart Post is a social
            platform designed to help people share ideas, connect with
            communities, and discover meaningful content.
          </Typography>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* Mission */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              fontWeight="700"
              sx={{ color: "#1b2e35", mb: 2 }}
            >
              Our Mission
            </Typography>

            <Typography
              sx={{
                color: "#4b5563",
                lineHeight: 1.9,
              }}
            >
              Our mission is to create a simple and engaging platform where
              users can express their thoughts, share knowledge, discover new
              perspectives, and build meaningful connections with others.
            </Typography>

            <Typography
              sx={{
                color: "#4b5563",
                lineHeight: 1.9,
                mt: 2,
              }}
            >
              We believe technology should make communication easier,
              communities stronger, and information more accessible.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                backgroundColor: "#1b2e35",
                color: "white",
                p: { xs: 3, md: 5 },
                borderRadius: "30px",
                borderTopLeftRadius: "80px",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{ color: "#59e3a7", mb: 2 }}
              >
                Connecting Ideas
              </Typography>

              <Typography sx={{ lineHeight: 1.8, color: "#e5e7eb" }}>
                Smart Post brings together people, ideas, discussions, and
                experiences in one place.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* What We Offer */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              color: "#1b2e35",
              textAlign: "center",
              mb: 4,
            }}
          >
            What We Offer
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: "15px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="700"
                  sx={{ color: "#1b2e35", mb: 1 }}
                >
                  Community
                </Typography>

                <Typography sx={{ color: "#6b7280", lineHeight: 1.7 }}>
                  Connect with people who share your interests and
                  perspectives.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: "15px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="700"
                  sx={{ color: "#1b2e35", mb: 1 }}
                >
                  Content Sharing
                </Typography>

                <Typography sx={{ color: "#6b7280", lineHeight: 1.7 }}>
                  Share posts, ideas, experiences, and useful information with
                  the community.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: "15px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="700"
                  sx={{ color: "#1b2e35", mb: 1 }}
                >
                  Meaningful Discussions
                </Typography>

                <Typography sx={{ color: "#6b7280", lineHeight: 1.7 }}>
                  Participate in discussions and discover different
                  perspectives.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Contact */}
        <Box
          sx={{
            mt: 8,
            backgroundColor: "#59e3a7",
            p: { xs: 3, md: 5 },
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1 }}
          >
            Have Questions?
          </Typography>

          <Typography sx={{ color: "#1b2e35" }}>
            We'd love to hear from you. Get in touch with the Smart Post team.
          </Typography>

          <Typography
            fontWeight="600"
            sx={{
              color: "#1b2e35",
              mt: 2,
            }}
          >
            vishnuchaurasiya1101@gmail.com
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;