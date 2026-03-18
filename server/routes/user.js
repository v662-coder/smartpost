import express from 'express';
import { getUserData, login, registration, changePassword, getUsers, removeUser, getUserActivity,auth0Registration } from '../controller/user.js';
import userAuthentication from '../middleware/userAuthentication.js';
import adminAuthentication from '../middleware/adminAuthentication.js';
import { auth0VerifyToken } from "../middleware/userAuthentication.js";
const user = express.Router();

user.post("/registration", registration);
user.post("/login", login);
user.get("/profile", userAuthentication, getUserData);
user.get("/activity", userAuthentication, getUserActivity);
user.put("/change-password", userAuthentication, changePassword);
user.get("", adminAuthentication, getUsers);
user.delete("/:userId", adminAuthentication, removeUser);
// user.get("/log-out", logOut);
user.post("/auth0-registration", auth0VerifyToken, auth0Registration);



export default user;