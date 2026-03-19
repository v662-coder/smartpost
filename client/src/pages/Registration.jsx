import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useEffect } from "react";
import Cookies from "js-cookie";
import useThinkify from "../hooks/useThinkify";
import AlertBox from "../../components/common/AlertBox";
import { useAuth0 } from "@auth0/auth0-react";

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const Registration = () => {
  const navigate = useNavigate();
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } = useThinkify();
  const { loginWithRedirect, user, isAuthenticated, getIdTokenClaims,getAccessTokenSilently    } = useAuth0();

  // form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const handleGoogleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: {
          returnTo: "/profile"
        },
        authorizationParams: {
          connection: "google-oauth2"
        }
      });
    } catch (error) {
      console.error("Google login error:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Google login failed");
    }
  };

  useEffect(() => {
    const checkAuth0User = async () => {
      if (isAuthenticated && user) {
        try {
          // const tokenClaims = await getIdTokenClaims();
      const auth0Token = await getAccessTokenSilently({
      authorizationParams: {
        audience: "https://smartpost-api",
        scope: "openid profile email"
      }
    });

          // const auth0Token = tokenClaims.__raw;
          
          // console.log("🚀 ~ :73 ~ checkAuth0User ~ auth0Token:", auth0Token);
              // console.log("🚀 ~ :80 ~ checkAuth0User ~ user:", user);

          const response = await axios.post(
            `${import.meta.env.VITE_SERVER_ENDPOINT}/users/auth0-registration`,
            {
              fullName: user.name,

              email: user.email,
              auth0Id: user.sub,
              picture: user.picture
            },
            {
              headers: {
                Authorization: `Bearer ${auth0Token}`
              }
            }
          );
          
          // console.debug("🚀 ~ :87 ~ checkAuth0User ~ response:", response);

          
          if (response.data.status) {
            Cookies.set(import.meta.env.VITE_TOKEN_KEY, response.data.token, {
              expires: Number(import.meta.env.VITE_COOKIE_EXPIRES),
              path: "/",
            });
            Cookies.set(import.meta.env.VITE_USER_ROLE, response.data.user.role, {
              expires: Number(import.meta.env.VITE_COOKIE_EXPIRES),
              path: "/",
            });
            if (response.data.user.role === "user") {
              navigate("/profile");
            } else if (response.data.user.role === "admin") {
              navigate("/dashboard");
            }
          }
        } catch (error) {
          console.error("Auth0 integration error:", error);
        }
      }
    };

    checkAuth0User();
  }, [isAuthenticated, user, navigate, getIdTokenClaims]);
  useEffect(() => {
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    const role = Cookies.get(import.meta.env.VITE_USER_ROLE);
    
    if (token && role && !isAuthenticated) {
      if (role === "user") {
        navigate("/profile");
      } else if (role === "admin") {
        navigate("/dashboard");
      }
    } else if (!token && !isAuthenticated) {
      Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "/" });
      Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "/" });
    }
  }, [navigate, isAuthenticated]);

  const onSubmit = async (data) => {
    try {
      console.log(data,"join data @@@@@@");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users/registration`,
        data
      );
      if (response.data.status) {
        Cookies.set(import.meta.env.VITE_TOKEN_KEY, response.data.token, {
          expires: Number(import.meta.env.VITE_COOKIE_EXPIRES),
          path: "/",
        });
        Cookies.set(import.meta.env.VITE_USER_ROLE, response.data.user.role, {
          expires: Number(import.meta.env.VITE_COOKIE_EXPIRES),
          path: "/",
        });
        if (response.data.user.role === "user") {
          navigate("/profile");
        } else if (response.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          setAlertBoxOpenStatus(true);
          setAlertSeverity("error");
          setAlertMessage("Something Went Wrong");
        }
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      error.response?.data?.message
        ? setAlertMessage(error.response.data.message)
        : setAlertMessage("Something Went Wrong");
    }
  };

  return (
    <>
      <Box height="100vh" sx={{ display: "flex" }}>
        <Box
          sx={{
            flex: "1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <img src="/images/auth.jpg" alt="" />
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#1b2e35",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <AlertBox />
          <Box width={1 / 2} mx="auto" my="auto">
            <Typography
              variant="h2"
              component="h2"
              sx={{ color: "white", fontSize: "2.25rem", fontWeight: "bold" }}
            >
              Join Now
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 4 }}
            >
              <TextField
                fullWidth
                placeholder="Enter Full Name"
                sx={{
                  mb: 1,
                  color: "white",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                    "&::placeholder": {
                      color: "#cccccc",
                    },
                  },
                }}
                {...register("fullName")}
              />
              {errors.fullName && (
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: "red", mb: 2 }}
                >
                  {errors.fullName.message}
                </Typography>
              )}
              <TextField
                fullWidth
                placeholder="Enter Email"
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                    "&::placeholder": {
                      color: "#cccccc",
                    },
                  },
                }}
                {...register("email")}
              />
              {errors.email && (
                <Typography
                  variant="p"
                  component="p"
                  sx={{ color: "red", mb: 2 }}
                >
                  {errors.email.message}
                </Typography>
              )}
              <TextField
                fullWidth
                placeholder="Enter Password"
                type="password"
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                    "&::placeholder": {
                      color: "#cccccc",
                    },
                  },
                }}
                {...register("password")}
              />
              {errors.password && (
                <Typography variant="p" component="p" sx={{ color: "red" }}>
                  {errors.password.message}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 4 }}
              >
                Join
              </Button>
            </Box>
            <Divider sx={{ my: 3, color: "white", "&::before, &::after": { borderColor: "white" } }}>
              OR
            </Divider>
            <Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                sx={{
                  backgroundColor: "#DB4437",
                  "&:hover": {
                    backgroundColor: "#C33C2E",
                  },
                }}
              >
                Continue With Google
              </Button>
            </Box>
            <Box>
              <Typography variant="body2" color="white" sx={{ mt: 4 }}>
                Already Have an Account ?
                <Link to="/login" style={{ color: "#4FC3F7", marginLeft: "5px", textDecoration: "none" }}>
                  Log In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Registration;