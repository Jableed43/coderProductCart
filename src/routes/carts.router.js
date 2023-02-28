import { Router } from "express";
import CartManager from "../manager/cartManager.js";
const cartManager = new CartManager('carts.txt');
const routerCarts = new Router();

routerCarts.post('/', async (req, res) => {
    const newCart = {
        products: [],
        id: req.body.id
    }
    try {
        await cartManager.addCarts(newCart)
        res.send({status: 'correcto', message: 'Producto creado', data: {newCart}})
    } catch (error) {
        return res.status(400).send({status: error, message: 'Valores incompletos'})
    } 
})

routerCarts.get('/:cid', async (req, res) => {
    const idCarts = Number(req.params.cid)
    const cart = await cartManager.getCartById(idCarts)
    res.send({cart})
})


routerCarts.post('/:cid/products/:pid', async (req, res) => {
    try {
        const idCart = Number(req.params.cid)
        const idProduct = Number(req.params.pid)
        // const allCarts = await cartManager.getCarts()
     
        await cartManager.addProductToCart(idCart, idProduct)
        res.status(200).send({status:"Ok", message:"Producto agregado"})

    } catch (error) {
        console.log(error)
    }
})

export default routerCarts