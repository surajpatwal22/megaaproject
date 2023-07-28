import mongoose, { Schema } from "mongoose";
const schema = mongoose.Schema;

const CollectionSchema = new schema(
    {
        name: {
        type: String,
        required: ["true","plss provide a name"],
        trim: true ,
        maxLength: [120,"collection name should not be more than 120 chars"]

        }
    } , {timestamps: true}
);

export default mongoose.model("collection",CollectionSchema);