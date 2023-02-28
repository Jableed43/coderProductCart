import fs from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts () {
        try {
            const contenido = await fs.promises.readFile(this.path, 'utf-8')
            if (contenido.length > 0) {
                const productos = JSON.parse(contenido)
                return productos
            } else {
                return []
            }
        } catch (error) {
            return 'El archivo no puede ser leido'
        }
    }

    async addProduct (producto) {
        try {
    
            if (fs.existsSync(this.path)) {
                const productos = await this.getProducts();
                if (productos.length > 0) {
                    const ultimoId = productos[productos.length - 1].id + 1
                    producto.id = ultimoId
                    productos.push(producto)
                    await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 2))
                } else {
                    producto.id = 1
                    await fs.promises.writeFile(this.path, JSON.stringify([producto], null, 2))
                }
            } else {
                producto.id = 1
                await fs.promises.writeFile(this.path, JSON.stringify([producto], null, 2))
            }
        } catch (error) {
            return "El producto no pudo ser guardado";
        }
    }

    async getProductById (id) {
        try {
            const productos = await this.getProducts();
            const producto = productos.find(elemento => elemento.id === id);
            return producto
        } catch (error) {
            return 'No es posible encontrar el producto indicado'
        }
    }

    async updateById (id, nuevoValor) {
       const products = await this.getProducts();
        
        try {
            const updateProducts = products.map((product) => {
                if (product.id === id) {
                    product = nuevoValor
                    return { ...product, id};
                }
                else {
                    return { ...product }
                }
            });
            await fs.promises.writeFile(
                this.path, JSON.stringify(updateProducts)
            )

        } catch (error) {
            console.log(error)
        }
        }
   

    async deleteById (id) {
        try {
            const productos = await this.getProducts()
            const newProductos = productos.filter(elemento => elemento.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(newProductos, null, 2));
            return `El producto ${id} fue eliminado`
        } catch (error) {
            console.log(error)
        }
    }

    async deleteAll () {
        await fs.promises.writeFile(this.path, JSON.stringify([], null, 2));
    }
}
