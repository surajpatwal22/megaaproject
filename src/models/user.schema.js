import mongoose from "mongoose";

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

}, { timestamps: true }
);

export default mongoose.model('collection', userSchema);