import User from "../models/userModel.js";
import bcrypt from "bcrypt";


export const resetPassword = async (req, res) => {
    try {
        const getUserData = await User.findOne({ _id: req.body.userId });
        // console.log("userData----", getUserData);
        if (getUserData) {
            const isPwdMatch = await bcrypt.compare(req.body.password, getUserData.password);
            // console.log("isPwdMatch-----",isPwdMatch);
            if (isPwdMatch) {
                getUserData.password = req.body.newPassword;
                const updatePwd = await getUserData.save();
                res.status(200).send({ success: true, msg: "Password has been updated succcessfully" })
            }
            else {
                res.status(200).send({ msg: "Current password is wrong" })

            }
        }
        else {
            res.status(200).send({ msg: "User not found" })
        }

    } catch (err) {
        res.send({ errorMsg: err })
    }
}