import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import useThinkify from "./useThinkify";

const AUTH0_API_AUDIENCE = "https://smartpost-api";

/**
 * Shared "Continue with Google" logic for both Login and Registration.
 * Handles: kicking off the Auth0 redirect, exchanging the resulting Auth0 session
 * for our own app JWT via /users/auth0-registration, and surfacing any failure
 * to the user instead of failing silently.
 */
const useGoogleAuth = () => {
  const navigate = useNavigate();
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity, setLoadingStatus } =
    useThinkify();
  const { loginWithRedirect, user, isAuthenticated, getAccessTokenSilently, isLoading, error: auth0Error } =
    useAuth0();

  // Guards against firing the exchange twice (e.g. React StrictMode double-effect in dev).
  const hasAttemptedExchange = useRef(false);

  // If Auth0 itself failed to initialize (bad domain/clientId, network block, etc.),
  // or bounced back from a redirect with an error, the SDK surfaces it here.
  useEffect(() => {
    if (auth0Error) {
      console.error(
        "[Google Sign-In] Auth0 SDK reported an error (often from a failed/rejected redirect):",
        "error:", auth0Error.error,
        "description:", auth0Error.error_description || auth0Error.message
      );
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(
        `Google sign-in failed: ${auth0Error.error_description || auth0Error.message || "unknown Auth0 error"}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth0Error]);

  const handleGoogleLogin = async () => {
    console.log("[Google Sign-In] Button clicked. isLoading:", isLoading);

    if (isLoading) {
      // The Auth0 SDK hasn't finished initializing yet — calling loginWithRedirect now
      // would silently do nothing. This is exactly the "click and nothing happens" symptom.
      console.warn("[Google Sign-In] Auth0 SDK is still loading — ignoring click.");
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Still loading sign-in — please wait a second and try again.");
      return;
    }

    try {
      console.log("[Google Sign-In] Redirecting to Auth0...");
      await loginWithRedirect({
        appState: {
          returnTo: "/profile",
        },
        authorizationParams: {
          connection: "google-oauth2",
        },
      });
    } catch (error) {
      console.error("[Google Sign-In] loginWithRedirect threw before redirecting:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Couldn't start Google sign-in. Please try again.");
    }
  };

  useEffect(() => {
    const exchangeAuth0SessionForAppToken = async () => {
      if (!isAuthenticated || !user || hasAttemptedExchange.current) return;
      hasAttemptedExchange.current = true;

      setLoadingStatus(true);

      // --- Step 1: get an access token for our API from Auth0 ---------------------
      let auth0Token;
      try {
        auth0Token = await getAccessTokenSilently({
          authorizationParams: {
            audience: AUTH0_API_AUDIENCE,
            scope: "openid profile email",
          },
        });
      } catch (error) {
        console.error(
          "[Google Sign-In] Step 1 failed — could not get an Auth0 access token.",
          "error code:", error?.error,
          "description:", error?.error_description || error?.message
        );
        hasAttemptedExchange.current = false;
        setLoadingStatus(false);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");

        if (error?.error === "consent_required" || error?.error === "login_required") {
          setAlertMessage(
            "Google sign-in needs one more permission step. Please try the button again — a consent popup should appear."
          );
        } else if (error?.message?.includes("Service not found") || error?.error === "access_denied") {
          setAlertMessage(
            `Auth0 rejected the API audience "${AUTH0_API_AUDIENCE}". In the Auth0 Dashboard, make sure an API with exactly this Identifier exists and this app is authorized for it.`
          );
        } else {
          setAlertMessage(
            `Google sign-in couldn't get a token from Auth0 (${error?.error || error?.message || "unknown error"}). Check the browser console for details.`
          );
        }
        return;
      }

      // --- Step 2: exchange that Auth0 token for our own app JWT -------------------
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/users/auth0-registration`,
          {
            fullName: user.name,
            email: user.email,
            auth0Id: user.sub,
            picture: user.picture,
          },
          {
            headers: {
              Authorization: `Bearer ${auth0Token}`,
            },
          }
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

          if (response.data.user.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/profile");
          }
        } else {
          setAlertBoxOpenStatus(true);
          setAlertSeverity("error");
          setAlertMessage(response.data.message || "Google sign-in failed. Please try again.");
        }
      } catch (error) {
        hasAttemptedExchange.current = false; // allow retry on next render if the user tries again
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");

        if (error.response) {
          console.error(
            "[Google Sign-In] Step 2 failed — server rejected the request.",
            "status:", error.response.status,
            "body:", error.response.data
          );
          setAlertMessage(
            error.response.data?.message ||
              `Server rejected the sign-in request (HTTP ${error.response.status}).`
          );
        } else if (error.request) {
          console.error(
            "[Google Sign-In] Step 2 failed — no response from server. Check that the backend is",
            "running and reachable at:", import.meta.env.VITE_SERVER_ENDPOINT
          );
          setAlertMessage(
            `Couldn't reach the server at ${import.meta.env.VITE_SERVER_ENDPOINT}. Make sure the backend is running and VITE_SERVER_ENDPOINT is correct.`
          );
        } else {
          console.error("[Google Sign-In] Step 2 failed — request setup error:", error.message);
          setAlertMessage("Something went wrong finishing Google sign-in. Please try again.");
        }
      } finally {
        setLoadingStatus(false);
      }
    };

    exchangeAuth0SessionForAppToken();
  }, [isAuthenticated, user, getAccessTokenSilently, navigate]);

  return { handleGoogleLogin, isAuth0Loading: isLoading };
};

export default useGoogleAuth;