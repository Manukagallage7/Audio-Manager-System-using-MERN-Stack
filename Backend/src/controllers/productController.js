import Product from '../models/productModel.js';

export async function addProduct(req, res) {

    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }

    if(req.user.type !== "admin"){
        res.status(403).json({
            message: "You are not authorized to perform this action"
        })
        return
    }

    const data = req.body
    const newProduct = new Product(data)

    try{
        await newProduct.save()
        res.status(201).json({
            message: "Product added successfully",
            product: newProduct
        })
    } catch(err){
        res.status(500).json({
            error: "Product addition failed"
        })
    }
    
}

export async function getProducts(req, res) {
    
    try {
        if(isAdmin) {
            const products = await Product.find()
            res.status(200).json({
                message: "Products fetched successfully",
                products
            })
            return
        } else {
            const products = await Product.find({availability: true})
            res.status(200).json({
                message: "Products fetched successfully",
                products
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch products"
            })
    }
}

export async function updateProduct(req,res) {
    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }

    if(req.user.type !== "admin"){
        res.status(403).json({
            message: "You are not authorized to perform this action"
        })
        return
    }

    const productId = req.params.id
    const data = req.body

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, data, { new: true })
        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        })
    } catch (err) {
        res.status(500).json({
            error: "Product update failed"
            })
    }
}

export async function deleteProduct(req,res) {
    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }

    if(req.user.type !== "admin"){
        res.status(403).json({
            message: "You are not authorized to perform this action"
        })
        return
    }

    const productId = req.params.id

    try {
        await Product.findByIdAndDelete(productId)
        res.status(200).json({
            message: "Product deleted successfully"
        })
    } catch (err) {
        res.status(500).json({
            error: "Product deletion failed"
            })
    }
}


function isAdmin(req) {
    let isAdmin = false
    if(req.user !== null) {
        if(req.user.type === "admin") {
            isAdmin = true
        }
    }
    return isAdmin
}