import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
} from "@mui/material";

const Contact = () => {
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
            Contact Us
          </Typography>

          <Typography
            sx={{
              color: "#6b7280",
              mt: 2,
            }}
          >
            Have a question or need assistance? We'd love to hear from you.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                backgroundColor: "#1b2e35",
                color: "white",
                p: { xs: 3, md: 5 },
                borderRadius: "20px",
                height: "100%",
                boxSizing: "border-box",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{
                  color: "#59e3a7",
                  mb: 4,
                }}
              >
                Get In Touch
              </Typography>

              <Typography fontWeight="700" sx={{ mb: 1 }}>
                Email
              </Typography>

              <Typography sx={{ color: "#d1d5db", mb: 3 }}>
                vishnuchaurasiya1101@gmail.com
              </Typography>

              <Typography fontWeight="700" sx={{ mb: 1 }}>
                Phone
              </Typography>

              <Typography sx={{ color: "#d1d5db", mb: 3 }}>
                +91 7991510913
              </Typography>

              <Typography fontWeight="700" sx={{ mb: 1 }}>
                Address
              </Typography>

              <Typography sx={{ color: "#d1d5db", lineHeight: 1.8 }}>
                Vill-Sahasi, Post Hardi Chak
                <br />
                Khajni, Gorakhpur
                <br />
                Uttar Pradesh - 273406
                <br />
                India
              </Typography>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: "20px",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{
                  color: "#1b2e35",
                  mb: 3,
                }}
              >
                Send Us a Message
              </Typography>

              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                }}
              >
                <TextField
                  label="Full Name"
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Subject"
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Message"
                  fullWidth
                  multiline
                  rows={5}
                  variant="outlined"
                />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#1b2e35",
                    color: "#59e3a7",
                    py: 1.5,
                    fontWeight: 700,
                    "&:hover": {
                      backgroundColor: "#243e47",
                    },
                  }}
                >
                  Send Message
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;