import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ["true", "provide a name"],
        trim: true,
        maxLength: [120, "not more than 120 chars"]
    },
    price: {
        type: Number,
        required: ["true", "provide a price"],
        maxLength: [5, "not more than 5"]
    },
    photos: [
        {
            secure_url: {
                type: String,
                required: true
            }
        }
    ],
    description: {
        type: String,
        required: true,
        maxLength:[120, " not more than 120 chars"]
    },
    stock: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    collection_id:{
        ref:"collection",
        type: mongoose.Schema.Types.ObjectId
    }
}, { timestamps: true })

export default mongoose.model("Product", productSchema)