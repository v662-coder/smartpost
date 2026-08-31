import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

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
};

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setErrorMessage("");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/users/forgot-password`,
        data
      );
      if (response.data.status) {
        setSubmitted(true);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "Something went wrong."
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
            Forgot Password
          </Typography>
          <Typography sx={{ color: "#cccccc", mt: 1, mb: 3 }}>
            Enter the email on your account and we&apos;ll send you a link to reset your
            password.
          </Typography>

          {submitted ? (
            <Box>
              <Typography sx={{ color: "#59e3a7", mb: 3 }}>
                If an account exists for that email, a password reset link is on its way.
                Check your inbox (and spam folder).
              </Typography>
              <Link to="/login" style={{ color: "white" }}>
                <Typography variant="body2">Back to Login</Typography>
              </Link>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                placeholder="Enter Email"
                sx={fieldSx}
                {...register("email")}
              />
              {errors.email && (
                <Typography variant="body2" sx={{ color: "red", mb: 2 }}>
                  {errors.email.message}
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
                {submitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
