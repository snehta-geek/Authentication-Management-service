import mongoose from "mongoose";
import bcrypt from "bcrypt";

/* Create Schema to define structure of the document */
const userSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    fullName: { type: String, required: true, trim: true },
    emailId: { type: String, unique: true, trim: true, lowercase: true },    // match : /^\S+@\S+\.\S+$/,
    mobileNum: { type: String, required: true },
    //  validate : {
    //     validator : function(number){
    //             return /^[0-9]*$/.test(number);
    //         },
    //         message : (props) => `${props.value} is not a valid mobile number!`               

    password: { type: String, required: true }
})

/* Convert Pwd into hashed format */
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        console.log("befor--hash---", this.password);
        this.password = await bcrypt.hash(this.password, 10);
        console.log("after--hash---", this.password);
        next();
    }

})

/* Model is a wrapper of mongoose schema, provides an interface to the database for manipulating data like create,update,delete etc. */
const User = mongoose.model('User', userSchema);
export default User;