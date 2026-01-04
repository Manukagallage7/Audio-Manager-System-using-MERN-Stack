import express from 'express';
import {addProduct, deleteProduct, getProducts, updateProduct} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/', addProduct)
productRouter.get('/', getProducts)
productRouter.put('/:id', updateProduct)
productRouter.delete('/:id', deleteProduct)

export default productRouter;