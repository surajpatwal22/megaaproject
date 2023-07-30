import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    product:{
        type:[
            {
                productId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Product"
                },
                count:Number,
                price:Number
            }
        ],
        required:true

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    address:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    coupon: String,
    transactionId: String,
    status:{
        type: String,
        enum:["ORDERED","SHIPPED","DELIVERED","CANCELLED"],
        default:"ORDERED"
// another way 
        //enum:object.value(StatusRoles),
        //default:StatusRoles.ORDERED
    }
},{timestamps: true})

export default mongoose.model("Order",OrderSchema)