import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import {  encryptedData, generateToken } from "../genericFunction.js";


export const login = async (req, res) => {
    try {
        const encryptedName = await encryptedData(req.body.emailId)
        // console.log("decryptedEmail-----",encryptedName);

        const getUserData = await User.findOne({ emailId: encryptedName });
        // console.log("userData----", getUserData);

        if (getUserData) {
            const isPwdMatch = await bcrypt.compare(req.body.password, getUserData.password);

            if (isPwdMatch) {
               const token = await generateToken(getUserData._id,getUserData.emailId);
               res.send({success: true, data : {getUserData,token}})
            }
            else {
                res.status(200).send({ msg: "password is wrong" })

            }
        }
        else {
            res.status(200).send({ msg: "User dosen't exist" })
        }

    } catch (err) {
        console.log("err---",err);
        res.send({ errorMsg: err })
    }
}