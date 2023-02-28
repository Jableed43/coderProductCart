import { Router } from "express";
import ProductManager from "../manager/productManager.js";
const productsRouter = new Router()

const productManager = new ProductManager('productos.txt')

productsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    const limit = Number(req.query.limit)
    if (!limit || limit > products.length) {
        return res.send({products})
    }
    const arrLimit = products.slice(products[0], limit)
    res.send(arrLimit)
})

productsRouter.get('/:pid', async (req, res) => {
    const idProducts = Number(req.params.pid)
    const products = await productManager.getProductById(idProducts)
    res.send({products})
})

productsRouter.post('/', async (req, res) => {
    const newProduct = req.body
    if (!newProduct.titulo || !newProduct.descripcion || !newProduct.codigo || !newProduct.precio || !newProduct.estado || !newProduct.stock || !newProduct.categoria) {
        return res.status(400).send({status: 'error', message: 'Valores incompletos'})
    }
    const products = await productManager.addProduct(newProduct)
    res.send({status: 'correcto', message: 'Producto creado', products})
})

productsRouter.put('/:pid', async (req, res) => {
    const productId = Number(req.params.pid)
    const newProduct = req.body
    await productManager.updateById(productId, newProduct)
    res.send({message: 'Producto actualizado', producto: newProduct, id: productId})
})

productsRouter.delete('/:pid', async (req, res) => {
    const productId = Number(req.params.pid)
    const deleteProduct = await productManager.deleteById(productId)
    res.send({status: 'correcto', message: 'Producto eliminado', deleteProduct})
})

export default productsRouter