import Product from '../models/productModel.js';

export function addProduct(req, res) {

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
    newProduct.save()
    .then(()=> {
        res.status(201).json({
            message: "Product added successfully"
        })
        .catch((err)=> {
            res.status(500).json({
                error: "Product addition failed"
            })
        })
    })
}

export function getProducts(req, res) {
    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }

    if(req.user.type !== "admin") {
        res.status(403).json({
            message : "You are not authorized to perform this action"
        })
        return
    }
}

export function getProduct(req, res) {

    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }

    if(req.user.type !== "customer") {
        res.status(403).json({
            message : "You are not authorized to perform this action"
        })
        return
    }
}


export function updateProduct(req, res) {
    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }

    if(req.user.type !== "admin") {
        res.status(403).json({
            message : "You are not authorized to perform this action"
        })
        return
    }
    const data = req.body

}

export function deleteProduct(req, res) {
    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }

    if(req.user.type !== "admin") {
        res.status(403).json({
            message : "You are not authorized to perform this action"
        })
        return
    }

}