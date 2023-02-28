import fs from 'fs';

export default class CartManager {
    constructor(path) {
        this.path = path;
    }


    writeFile = async (data) => {
        try {
            await fs.promises.writeFile(
                this.path, JSON.stringify(data)
            )
        }

        catch (err) {
            console.log(err.message);
        }
    }

async getCarts () {
    try {
        const contenido = await fs.promises.readFile(this.path, 'utf-8')
        if (contenido.length > 0) {
            const cart = JSON.parse(contenido)
            return cart
        } else {
            return []
        }
    } catch (error) {
        return 'El archivo no puede ser leido'
    }
}

async getCartById (id) {
    try {
        const carts = await this.getCarts();
        const cart = carts.find(elemento => elemento.id === id);
        return cart
    } catch (error) {
        return 'No es posible encontrar el carrito indicado'
    }
}

async addCarts (cart) {
    try {
        if (fs.existsSync(this.path)) {
            const carts = await this.getCarts();
            if (carts.length > 0) {
                const ultimoId = carts[carts.length - 1].id + 1
                cart.id = ultimoId
                carts.push(cart)
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
            } else {
                cart.id = 1
                await fs.promises.writeFile(this.path, JSON.stringify([cart], null, 2))
            }
        } else {
            cart.id = 1
            await fs.promises.writeFile(this.path, JSON.stringify([cart], null, 2))
        }
    } catch (error) {
        return "El producto no pudo ser guardado";
    }
}

addProductToCart = async (cartId, productId) => {
    const carritos = await this.getCarts();
    try {
        let carritoIndex = carritos.findIndex((cart) => cart.id === cartId);
        //Si encuentra al carrito
        if(carritoIndex != -1) {
            let productoIndex = carritos[carritoIndex].products.findIndex((p) => p.product === productId); 
            //si encuentra que existe el producto que está agregando, agrega a cantidad + 1
            if(productoIndex != -1) {
                carritos[carritoIndex].products[productoIndex].quantity++
            }
            else {
            //si encuentra que en el carrito actual no existe el producto que está agregando pone su cantidad en 1
                carritos[carritoIndex].products.push({
                    product:productId,
                    quantity:1
                })
            }
        }
        //Si NO encuentra al carrito
        else{
            console.log("El carrito no existe");
        }
      
        await this.writeFile(carritos);
    }

    catch (err) {
        console.log(err.message);
    }
}

}