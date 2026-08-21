import {
  Grid,
  Typography,
  Box,
  Divider,
  Button,
  ListItemButton,
  ListItemText,
  List,
} from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#1b2e35",
        color: "white",
        paddingTop: "4rem",
        paddingBottom: "1rem",
      }}
    >
      <Box
        maxWidth="1280px"
        mx="auto"
        px={{ xs: 2, sm: 3, md: 4 }}
      >
        {/* Logo Section */}
        <Grid container>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <img
                src="/images/favicon.ico"
                width="55"
                alt="Smart Post"
              />

              <Typography
                sx={{
                  fontFamily: "Platypi",
                  color: "#59e3a7",
                }}
                variant="h3"
                component="h3"
              >
                Smart Post
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mt: 1 }}>
              Connecting Ideas, Inspiring Perspectives
            </Typography>
          </Grid>
        </Grid>

        {/* Footer Links */}
        <Grid container spacing={3} my={6}>
          {/* Social Media */}
        {/* Connect With Us */}
<Grid item xs={12} sm={6} md={2}>
  <Typography variant="subtitle1" fontWeight="bold">
    Connect With Us
  </Typography>

  <List>
    {/* LinkedIn */}
    <ListItemButton
      component="a"
      href="https://www.linkedin.com/in/vishnu-chaurasiya-1210-"
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        padding: 0,
        color: "#ddd",
        "&:hover": {
          backgroundColor: "transparent",
          color: "#59e3a7",
        },
      }}
    >
      <ListItemText
        primary="LinkedIn"
        sx={{ margin: 0 }}
      />
    </ListItemButton>

    {/* GitHub */}
    <ListItemButton
      component="a"
      href="https://github.com/v662-coder"
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        padding: 0,
        color: "#ddd",
        "&:hover": {
          backgroundColor: "transparent",
          color: "#59e3a7",
        },
      }}
    >
      <ListItemText
        primary="GitHub"
        sx={{ margin: 0 }}
      />
    </ListItemButton>

    {/* Instagram */}
    <ListItemButton
      component="a"
      href="https://www.instagram.com/vishnu__chaurasiya__/"
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        padding: 0,
        color: "#ddd",
        "&:hover": {
          backgroundColor: "transparent",
          color: "#59e3a7",
        },
      }}
    >
      <ListItemText
        primary="Instagram"
        sx={{ margin: 0 }}
      />
    </ListItemButton>

    {/* Twitter / X */}
    <ListItemButton
      component="a"
      href="https://x.com/Vishnu_1210_"
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        padding: 0,
        color: "#ddd",
        "&:hover": {
          backgroundColor: "transparent",
          color: "#59e3a7",
        },
      }}
    >
      <ListItemText
        primary="Twitter / X"
        sx={{ margin: 0 }}
      />
    </ListItemButton>
  </List>
</Grid>

          {/* Products */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Products
            </Typography>

            <List>
              <ListItemButton
                component={Link}
                to="/community"
                sx={{
                  padding: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <ListItemText
                  primary="Community"
                  sx={{ margin: 0, color: "#ddd" }}
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/forums"
                sx={{
                  padding: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <ListItemText
                  primary="Forums"
                  sx={{ margin: 0, color: "#ddd" }}
                />
              </ListItemButton>
            </List>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Resources
            </Typography>

            <List>
              <ListItemButton
                component={Link}
                to="/case-studies"
                sx={{
                  padding: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <ListItemText
                  primary="Case Studies"
                  sx={{ margin: 0, color: "#ddd" }}
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/blogs"
                sx={{
                  padding: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <ListItemText
                  primary="Blogs"
                  sx={{ margin: 0, color: "#ddd" }}
                />
              </ListItemButton>
            </List>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Company
            </Typography>

            <List>
              <ListItemButton
                component={Link}
                to="/about"
                sx={{
                  padding: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <ListItemText
                  primary="About Us"
                  sx={{ margin: 0, color: "#ddd" }}
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/career"
                sx={{
                  padding: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <ListItemText
                  primary="Careers"
                  sx={{ margin: 0, color: "#ddd" }}
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/contact"
                sx={{
                  padding: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <ListItemText
                  primary="Contact Us"
                  sx={{ margin: 0, color: "#ddd" }}
                />
              </ListItemButton>
            </List>
          </Grid>

          {/* Contact Details */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                borderRadius: "2px",
                borderTopLeftRadius: "50px",
                padding: "20px",
                backgroundColor: "#59e3a7",
                color: "#1b2e35",
                height: "100%",
                boxSizing: "border-box",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Contact Information
              </Typography>

              <Typography>
                Phone: +91 7991510913
              </Typography>

         
              <Typography>
                Email: vishnuchaurasiya1101@gmail.com
              </Typography>

              <Typography sx={{ mt: 2 }}>
              Vill-Sahasi, Post Hardi Chak
              </Typography>

              <Typography>
                Khajni, Gorakhpur
              </Typography>

              <Typography>
                Uttar Pradesh - 273406, India
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            marginBottom: "1rem",
            borderColor: "rgba(255,255,255,0.2)",
          }}
        />

        {/* Bottom Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Smart Post. All rights reserved.
          </Typography>

          <Box>
          <Button
  component={Link}
  to="/privacy-policy"
  sx={{
    color: "#59e3a7",
    "&:hover": {
      backgroundColor: "transparent",
    },
  }}
>
  Privacy Policy
</Button>

<Button
  component={Link}
  to="/terms-of-service"
  sx={{
    color: "#59e3a7",
    "&:hover": {
      backgroundColor: "transparent",
    },
  }}
>
  Terms of Service
</Button>
          </Box>
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;