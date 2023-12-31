import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import  config  from "./src/config/index.js";
import crypto from "crypto";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: ["true", "name is required"],
        maxLength: [50, "name must be less than 50 chars"]

    },
    email:{ type: String,
        required: ["true","email must be required"]

    },
    password: {type: String,
        required: ["true","email must be required"],
        minLength: [8,"password must be atleast 8 words"],
        select: false
    },
    role:{
        type:String ,
        enum: Object.values(AuthRoles),
        default: AuthRoles.USER
    }, forgotPasswordToken: String,
    forgotPasswordExpiry: Date

}, { timestamps: true } )


//encrypt the password before saving,hooks//
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
} )
userSchema.methods = {
    comparepassword: async function (enteredpassword) {
    return  await  bcrypt.compare(enteredpassword,this.password)
    },
    //generate JWTToken

    getJWTtoken: function () {
        JWT.sign({_id: this._id , role: this.role},config.JWT_SECRET,{
            expiresIn: config.JWT_EXPIRY
        })
    } ,

    //generate forgot password

    generateForgotPasswordToken: function () {
        const ForgotToken = crypto.randomBytes(20).toString("hex")
        // to encrypt the token generated by crypto
        this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(ForgotToken)
        .digest("hex")

        // time for token to expire
        this.forgotPasswordExpiry = Date.now() + 20*60*1000

        return ForgotToken

    
    }

}



export default mongoose.model('user', userSchema);