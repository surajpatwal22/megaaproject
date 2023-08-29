import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
    code:{
        type: String,
        required:true,
        unique: true
    },
    discount:{
        type:Number,
        required: true,
        default:0,
        min:0,
        max:100
    },
    active:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

export default mongoose.model("coupon",couponSchema)