import Product from '../models/productModel.js';
import {isAdmin, isCustomer} from './userController.js';

export async function addProduct(req, res) {

    try{
        if(isAdmin(req)) {
        const data = req.body
        const newProduct = new Product(data)
        await newProduct.save()
        res.status(201).json({
            message: "Product added successfully",
            product: newProduct
        })
        return
        } else {
            res.status(403).json({
                message: "You are Unauthorized access",
                error: "Product addition failed"
            })
            return
        }
    } catch(err){
        res.status(500).json({
            error: "Product addition failed"
        })
    }
    
}

export async function getProducts(req, res) {
    
    try {
        if(isAdmin(req)) {
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
            return
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch products"
            })
    }
}

export async function updateProduct(req, res) {
    try {
        if (isAdmin(req)) {
            const key = req.params.key
            const data = req.body
            const updatedProduct = await Product.findOneAndUpdate({ key }, data, { new: true })
            res.status(200).json({
                message: "Product updated successfully",
                product: updatedProduct
            })
            return
        } else {
            res.status(403).json({
                message: "You are Unauthorized access"
            })
            return
        }
    } catch (err) {
        res.status(500).json({
            error: "Product update failed"
        })
    }
}
    
    

export async function deleteProduct(req, res) {
    try {
        if (isAdmin(req)) {
            const key = req.params.key
            await Product.findOneAndDelete({ key })
            res.status(200).json({
                message: "Product deleted successfully"
            })
            return
        } else {
            res.status(403).json({
                message: "You are Unauthorized access"
            })
            return
        }
    } catch (err) {
        res.status(500).json({
            error: "Product deletion failed"
        })
    }
}



