import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  ButtonGroup,
} from "@mui/material";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import AlertBox from "../components/common/AlertBox";

export default function NavBar() {
  const cookie = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "transparent",
          borderBottom: "1px solid #59e3a7",
          padding: "5px 0",
        }}
        elevation={0}
      >
        <Toolbar>
          <Box
            sx={{
              maxWidth: "1280px",
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <img src="./images/favicon.ico" width="55" alt="Smart Post" />
                  <Typography
                    sx={{
                      fontFamily: "Platypi",
                      color: "#1b2e35",
                    }}
                    variant="h3"
                    component="h3"
                  >
                    Smart Post
                  </Typography>
                </Box>
              </Link>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Button
                  component={Link}
                  to="/registration"
                  sx={{
                    backgroundColor: "#1b2e35",
                    color: "white",
                    borderRadius: "5px",
                    "&:hover": { backgroundColor: "#28483a" },
                  }}
                >
                  Join
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    backgroundColor: "#59e3a7",
                    color: "#1b2e35",
                    borderRadius: "5px",
                    "&:hover": { backgroundColor: "#4bcf95" },
                  }}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <AlertBox />
    </Box>
  );
}
