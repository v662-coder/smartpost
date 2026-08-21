import {
  Box,
  Typography,
  Container,
  Divider,
} from "@mui/material";

const TermsOfService = () => {
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
            Terms of Service
          </Typography>

          
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Acceptance */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            1. Acceptance of Terms
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            By accessing or using Smart Post, you agree to be bound by these
            Terms of Service. If you do not agree with these terms, please do
            not use our website or services.
          </Typography>
        </Box>

        {/* Services */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            2. Use of Our Services
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            You agree to use Smart Post only for lawful purposes and in a way
            that does not violate applicable laws, regulations, or the rights
            of other users.
          </Typography>
        </Box>

        {/* Responsibilities */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            3. User Responsibilities
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            Users are responsible for the information and content they submit
            through the platform. You agree not to submit content that is
            unlawful, harmful, misleading, or infringes the rights of others.
          </Typography>
        </Box>

        {/* Intellectual Property */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            4. Intellectual Property
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            Unless otherwise stated, the content, design, branding, and
            materials available on Smart Post are owned by or licensed to
            Smart Post and may not be reproduced or distributed without
            permission.
          </Typography>
        </Box>

        {/* Availability */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            5. Service Availability
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            We may modify, suspend, or discontinue any part of our services
            at any time. We do not guarantee that the website will always be
            available or free from errors.
          </Typography>
        </Box>

        {/* Liability */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            6. Limitation of Liability
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            To the extent permitted by applicable law, Smart Post shall not
            be liable for indirect, incidental, or consequential damages
            arising from the use of our website or services.
          </Typography>
        </Box>

        {/* Contact */}
        <Box>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#1b2e35", mb: 1.5 }}
          >
            7. Contact Us
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            If you have questions about these Terms of Service, please
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

export default TermsOfService;