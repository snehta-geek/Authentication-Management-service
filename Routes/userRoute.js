import express from "express"
import { login } from "../ApiService/loginApi.js";
import { resetPassword } from "../ApiService/resetPwdApi.js";
import { userSignup } from "../ApiService/signupApi.js";
import { updateUserDetails } from "../ApiService/updateUserApi.js";

const userRoute = express.Router();

userRoute.post('/signup',userSignup);
userRoute.post('/resetPassword',resetPassword);
userRoute.post('/updateUser',updateUserDetails);
userRoute.post('/login',login);




export default userRoute;