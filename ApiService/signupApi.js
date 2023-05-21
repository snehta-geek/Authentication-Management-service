import { encryptedData } from "../genericFunction.js";
import User from "../models/userModel.js";


export const userSignup = async(req,res) =>{
    try{
        
        /* Convert plain text into encrypted format */
        const encryptedName = await encryptedData(req.body.fullName,'name');
        const encryptedEmail = await encryptedData(req.body.emailId, 'email');
        const encryptedPhoneNo = await encryptedData(req.body.mobileNum,'mobile');

       // const encryptedUserData = encryptedData(req.body.fullName, req.body.emailId, req.body.mobileNum)
        console.log("encryptedUserData------",encryptedName);

        const registerUser = new User({
            fullName : encryptedName,
            emailId : encryptedEmail,
            mobileNum : encryptedPhoneNo,
            password : req.body.password
        })
        console.log("registerUser------",registerUser);

        /* Save encrypted data & create new record in DB */
        const registeredUser = await registerUser.save();
        // console.log("registeredUser----",registeredUser);

        res.status(201).send({msg : "user data is registered successfully"})
    

    }catch(error){
        console.log("err---",error);
        res.send({msg : error})
    }
}