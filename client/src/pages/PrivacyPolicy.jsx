import {
  Box,
  Typography,
  Container,
  Divider,
} from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f7f9fa",
        minHeight: "70vh",
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
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
            Privacy Policy
          </Typography>

         
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Introduction */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            1. Introduction
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            Welcome to Smart Post. We respect your privacy and are committed
            to protecting your personal information. This Privacy Policy
            explains how we collect, use, and protect your information when
            you use our website and services.
          </Typography>
        </Box>

        {/* Information */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            2. Information We Collect
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            We may collect information that you provide directly to us,
            including your name, email address, contact information, and
            other information submitted through our website.
          </Typography>
        </Box>

        {/* Usage */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            3. How We Use Your Information
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            We may use the information we collect to provide and improve our
            services, communicate with you, respond to inquiries, and
            maintain the security and functionality of our platform.
          </Typography>
        </Box>

        {/* Security */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            4. Data Security
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            We take reasonable technical and organizational measures to
            protect your personal information from unauthorized access,
            disclosure, alteration, or destruction.
          </Typography>
        </Box>

        {/* Third Party */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            5. Third-Party Services
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            Our website may use third-party services or platforms. These
            services may collect information according to their own privacy
            policies.
          </Typography>
        </Box>

        {/* Contact */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            6. Contact Us
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            If you have any questions regarding this Privacy Policy, please
            contact us at:
          </Typography>

          <Typography
            sx={{
              color: "#1b2e35",
              fontWeight: 600,
              mt: 1,
            }}
          >
            vishnuchaurasiya1101@gmail.com
          </Typography>

          <Typography
            sx={{
              color: "#1b2e35",
              mt: 0.5,
            }}
          >
            Sahasi, Post Hardi Chak, Khajni, Gorakhpur,
            Uttar Pradesh - 273406, India
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;