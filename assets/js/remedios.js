//querySelector
const contenedorRemedios = document.querySelector("#containerRemedios");
const liquidacion = document.querySelector('#destacados');
const contenedorCarrito = document.querySelector('#contenedorCarrito');
const cart = document.querySelector('.offcanvas-body')
console.log(cart)
let carrito = [];


const getData = async () => {
    await fetch("https://apipetshop.herokuapp.com/api/articulos")
        .then((res) => res.json())
        .then((json) => (data = json))
        .catch((error) => console.log(error));
    pintarProductos(filtrosRemedios(data.response), contenedorRemedios);
    pintarLiquidacion(filtrarStock(filtrosRemedios(data.response)), liquidacion)
};

getData();

function filtrosRemedios(array) {
    let remedios = array.filter((producto) => producto.tipo === "Medicamento");
    return remedios;
}

function pintarProductos(array, contenedor) {
    array.forEach((item) => {
        let card = document.createElement("div");
        card.className = "card m-3";
        card.style.width = "20rem";
        card.style.height = "auto";
        card.innerHTML = `
        <img class="card-img" src="${item.imagen}" style="width: auto; height: 18rem" alt="Vans">
        <div class="card-img d-flex justify-content-end">
            <a href="#" class="card-link text-danger like">
                <i class="fas fa-heart"></i>
            </a>
        </div>
        <div class="card-body d-flex flex-column justify-content-between" style="width: auto; height: auto">
            <h4 class="card-title">${item.nombre}</h4>
            <h6 class="card-subtitle mb-2 text-muted">Stock: ${item.stock}</h6>
            <p class="card-text">${item.descripcion}</p>
        <div class="buy d-flex justify-content-between flex-column align-items-start">
        <div class="d-flex align-items-center justify-content-evenly w-100">
            <div class="price text-success d-flex"><h5 class="mt-4">$${item.precio}</h5></div>
            <button id="producto-${item._id}" class="btn btnColor mt-3"> Agregar al carrito</button>
        </div>
        </div>
        </div>`;
        contenedor.appendChild(card);

        const btnComprar = document.querySelector(`#producto-${item._id}`);
        btnComprar.addEventListener('click', () => {
            agregarCompras(item._id, array);
        })
    });
}

function filtrarStock(array) {
    let stockBajo = array.filter(item => item.stock <= 3);
    return stockBajo;
}

function pintarLiquidacion(array, contenedor) {
    array.forEach((item) => {
        let card = document.createElement("div");
        card.className = "card m-3";
        card.style.width = "20rem";
        card.style.height = "auto";
        card.innerHTML = `
            <img class="card-img" src="${item.imagen}" style="width: auto; height: 18rem" alt="Vans">
            <div class="card-img d-flex justify-content-end">
                <a href="#" class="card-link text-danger like">
                    <i class="fas fa-heart"></i>
                </a>
            </div>
            <div class="card-body d-flex flex-column justify-content-between" style="width: auto; height: auto">
                <h4 class="card-title">${item.nombre}</h4>
                <h6 class="card-subtitle mb-2 text-muted">Stock: ${item.stock}</h6>
            <div class="buy d-flex justify-content-between flex-column align-items-start">
            <div class="d-flex align-items-center justify-content-evenly w-100">
                <div class="price text-success d-flex"><h5 class="mt-4">$${item.precio}</h5></div>
                <button id="producto-${item._id}" class="btn mt-3 btnColor"> Agregar al carrito</button>
            </div>
            </div>
            </div>`;
        contenedor.appendChild(card);

        const btnComprar = document.querySelector(`#producto-${item._id}`);
        btnComprar.addEventListener('click', () => {
            agregarCompras(item._id, array);
        })
    });
}

function agregarCompras(nroId, array) {
    let nuevoObj;

    array.forEach((personaje) => {
        const { _id, nombre, precio, stock, imagen, tipo } = personaje;
        if (personaje._id === nroId) {
            nuevoObj = {
                id: _id,
                nombre: nombre,
                precio: precio,
                stock: stock,
                imagen: imagen,
                tipo: tipo,
                cantidad: 1
            };
        }
    });

    if (carrito.some(producto => producto.id === nuevoObj.id)) {
        const cantidadProducto = carrito.map(producto => {
            if (producto.id === nuevoObj.id) {
                let cantidad = producto.cantidad;
                let precio = producto.precio;
                if (!(producto.stock === producto.cantidad)) {
                    precio += producto.precio
                    cantidad++
                    producto.cantidad = cantidad;
                    producto.precio = precio;
                    return producto;
                } else {
                    return producto
                }
            } else {
                return producto;
            }
        })

        carrito = [...cantidadProducto];
    } else {
        carrito = [...carrito, nuevoObj];
    }

    console.log(carrito)
    pintarCarrito(carrito, contenedorCarrito)
    let carritoString = JSON.stringify(carrito)
    localStorage.setItem('carrito', carritoString);
}

function pintarCarrito(array, contenedor) {

    contenedor.innerHTML = ""
    array.forEach(ele => {
        let div = document.createElement('div');
        div.style.width = "20rem";
        div.style.height = "auto";
        div.classList.add('d-flex', 'justify-content-center')
        div.innerHTML = `
        <div class="card mb-3" style="max-width: 90%;">
            <div class="row g-0">
            <div class="col-md-4 d-flex justify-content-center align-items-center">
                <img src="${ele.imagen}" class="img-fluid rounded-start" style="width: auto; height: 10rem" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${ele.nombre}</h5>
                    <p class="card-text">Cantidad: ${ele.cantidad}</p>
                    <p class="card-text"><small class="text-muted">Precio: ${ele.precio}</small></p>
                <div class="d-flex justify-content-evenly">
                    <button type="button" style="width:2.5rem" class="btn btn-light">+</button>
                    <button type="button" style="width:2.5rem" class="btn btn-light">-</button>
                </div>
                </div>
                </div>
            </div>
        </div>
        `
        contenedor.appendChild(div)
    })
}

document.addEventListener("DOMContentLoaded", ()=>{
    let carritoJSON = JSON.parse(localStorage.getItem("carrito"))
    console.log(carritoJSON)
    pintarCarrito(carritoJSON, contenedorCarrito)
})


