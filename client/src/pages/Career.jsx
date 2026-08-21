import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Divider,
} from "@mui/material";

const Career = () => {
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
            Careers at Smart Post
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
            Join us in building a platform that connects people, ideas, and
            communities. We're always looking for passionate and talented
            people to grow with us.
          </Typography>
        </Box>

        {/* Why Join */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#1b2e35",
            color: "white",
            p: { xs: 3, md: 5 },
            borderRadius: "20px",
            mb: 6,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              color: "#59e3a7",
              mb: 2,
            }}
          >
            Why Join Smart Post?
          </Typography>

          <Typography
            sx={{
              color: "#e5e7eb",
              lineHeight: 1.9,
            }}
          >
            At Smart Post, you'll have the opportunity to work on meaningful
            products, solve real-world problems, learn modern technologies,
            and contribute to a growing digital community.
          </Typography>
        </Paper>

        {/* Open Positions */}
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{
            color: "#1b2e35",
            mb: 4,
          }}
        >
          Open Positions
        </Typography>

        <Grid container spacing={3}>
          {/* Developer */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "15px",
                border: "1px solid #e5e7eb",
                height: "100%",
                boxSizing: "border-box",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{
                  color: "#1b2e35",
                  mb: 1,
                }}
              >
                Full Stack Developer
              </Typography>

              <Typography
                sx={{
                  color: "#59a887",
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                React.js • Node.js • MongoDB
              </Typography>

              <Typography
                sx={{
                  color: "#6b7280",
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                Work on scalable web applications, APIs, databases, and
                user-facing features using modern JavaScript technologies.
              </Typography>

              <Button
                variant="contained"
                href="mailto:vishnuchaurasiya1101@gmail.com?subject=Application%20for%20Full%20Stack%20Developer"
                sx={{
                  backgroundColor: "#1b2e35",
                  color: "#59e3a7",
                  "&:hover": {
                    backgroundColor: "#243e47",
                  },
                }}
              >
                Apply Now
              </Button>
            </Paper>
          </Grid>

          {/* Frontend */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "15px",
                border: "1px solid #e5e7eb",
                height: "100%",
                boxSizing: "border-box",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{
                  color: "#1b2e35",
                  mb: 1,
                }}
              >
                Frontend Developer
              </Typography>

              <Typography
                sx={{
                  color: "#59a887",
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                React.js • JavaScript • Material UI
              </Typography>

              <Typography
                sx={{
                  color: "#6b7280",
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                Build responsive, accessible, and user-friendly interfaces
                that provide a great experience across devices.
              </Typography>

              <Button
                variant="contained"
                href="mailto:vishnuchaurasiya1101@gmail.com?subject=Application%20for%20Frontend%20Developer"
                sx={{
                  backgroundColor: "#1b2e35",
                  color: "#59e3a7",
                  "&:hover": {
                    backgroundColor: "#243e47",
                  },
                }}
              >
                Apply Now
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        {/* General Application */}
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "#59e3a7",
            p: { xs: 3, md: 5 },
            borderRadius: "20px",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1 }}
          >
            Don't See Your Role?
          </Typography>

          <Typography sx={{ color: "#1b2e35", mb: 3 }}>
            Send us your resume and tell us how you can contribute to Smart
            Post.
          </Typography>

          <Button
            variant="contained"
            href="mailto:vishnuchaurasiya1101@gmail.com?subject=General%20Job%20Application"
            sx={{
              backgroundColor: "#1b2e35",
              color: "#59e3a7",
              "&:hover": {
                backgroundColor: "#243e47",
              },
            }}
          >
            Send Your Resume
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Career;