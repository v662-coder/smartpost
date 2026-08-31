import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

const fieldSx = {
  mb: 1,
  color: "white",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "white" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
  "& .MuiInputBase-input": {
    color: "white",
    "&::placeholder": { color: "#cccccc" },
  },
  "& .MuiSvgIcon-root": { color: "white" },
};

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleMouseDownPassword = (event) => event.preventDefault();

  const validateNewPassword = (value) => {
    if (!value || value.length < 8) return "Password must be at least 8 characters long";
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    return (
      regex.test(value) ||
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  };

  const validateRetypePassword = (value) =>
    value === watch("newPassword") || "Passwords do not match";

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setErrorMessage("");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users/reset-password/${token}`,
        { newPassword: data.newPassword }
      );
      if (response.data.status) {
        setSuccessMessage(response.data.message);
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "This reset link is invalid or has expired."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box height="100vh" sx={{ display: "flex" }}>
      <Box
        sx={{
          flex: "1",
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src="/images/auth.jpg" alt="" />
      </Box>
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#1b2e35",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box width={{ xs: "90%", md: 1 / 2 }} mx="auto" my="auto">
          <Typography
            variant="h2"
            component="h2"
            sx={{ color: "white", fontSize: "2.25rem", fontWeight: "bold" }}
          >
            Reset Password
          </Typography>
          <Typography sx={{ color: "#cccccc", mt: 1, mb: 3 }}>
            Choose a new password for your account.
          </Typography>

          {successMessage ? (
            <Typography sx={{ color: "#59e3a7" }}>
              {successMessage} Redirecting you to login...
            </Typography>
          ) : (
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                placeholder="New Password"
                type={showNewPassword ? "text" : "password"}
                sx={fieldSx}
                {...register("newPassword", {
                  required: "New password is required",
                  validate: validateNewPassword,
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errors.newPassword && (
                <Typography variant="body2" sx={{ color: "red", mb: 2 }}>
                  {errors.newPassword.message}
                </Typography>
              )}

              <TextField
                fullWidth
                placeholder="Retype New Password"
                type={showRetypePassword ? "text" : "password"}
                sx={fieldSx}
                {...register("retypePassword", {
                  required: "Please retype your new password",
                  validate: validateRetypePassword,
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowRetypePassword(!showRetypePassword)}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showRetypePassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errors.retypePassword && (
                <Typography variant="body2" sx={{ color: "red", mb: 2 }}>
                  {errors.retypePassword.message}
                </Typography>
              )}

              {errorMessage && (
                <Typography variant="body2" sx={{ color: "red", mb: 2 }}>
                  {errorMessage}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
                sx={{
                  mt: 2,
                  backgroundColor: "#59e3a7",
                  "&:hover": { backgroundColor: "#4bcf95" },
                }}
              >
                {submitting ? "Resetting..." : "Reset Password"}
              </Button>
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Link to="/login" style={{ color: "white" }}>
                  <Typography variant="body2">Back to Login</Typography>
                </Link>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
