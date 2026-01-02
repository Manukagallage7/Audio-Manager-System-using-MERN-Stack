import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {

    }
})

const productModel = mongoose.model("Product", productSchema)

export default productModel;