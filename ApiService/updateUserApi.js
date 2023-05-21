import { decryptedData, encryptedData } from "../genericFunction.js";
import User from "../models/userModel.js";

export const updateUserDetails = async (req, res) => {
    try {
        const { fullName, emailId, mobileNum, password } = req.body;
        let updatedEncryptName, updatedEncryptEmail, updatedEncryptPhoneNo;

        const getUserData = await User.findOne({ _id: req.body.userId });
        if (getUserData) {
            // const encryptedUserData = encryptedData(fullName, emailId, mobileNum);   
            const decryptedName = await decryptedData(getUserData.fullName, 'name');
            const decryptedEmail = await decryptedData(getUserData.emailId, 'email');
            const decryptedPhoneNo = await decryptedData(getUserData.mobileNum, 'mobile');

            if (decryptedName !== fullName) {
                updatedEncryptName = await encryptedData(fullName, 'name');
            }
            else if (decryptedEmail !== emailId) {
                updatedEncryptEmail = await encryptedData(emailId, 'email');
            }
            else if (decryptedPhoneNo !== mobileNum) {
                updatedEncryptPhoneNo = await encryptedData(mobileNum, 'mobile');
            }

            getUserData.fullName = updatedEncryptName || getUserData.fullName,
            getUserData.emailId = updatedEncryptEmail || getUserData.emailId,
            getUserData.mobileNum = updatedEncryptPhoneNo || getUserData.mobileNum,
            getUserData.password = password || getUserData.password

            const updateUserData = await getUserData.save();
            res.status(200).send({ msg: "User Profie has been updated successfully", success: true, data: updateUserData })
        }
        else {
            res.send({ msg: "User not found" })
        }

    } catch (err) {
        res.send({ msg: err })
    }
}