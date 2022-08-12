//querySelector
const contenedorJuguetes = document.querySelector("#containerJuguetes");
const liquidacion = document.querySelector('#destacados');
const contenedorCarrito = document.querySelector('#contenedorCarrito');
const cart = document.querySelector('.offcanvas-body')
const btnVaciar = document.querySelector('#vaciarCarrito');
const comprar = document.querySelector('#comprar')

let carrito = [];
let restarClick = 0;
let sumarClick = 0;

const getData = async () => {
    await fetch("https://apipetshop.herokuapp.com/api/articulos")
        .then((res) => res.json())
        .then((json) => (data = json))
        .catch((error) => console.log(error));
    pintarProductos(filtrosJuguetes(data.response), contenedorJuguetes);
    pintarLiquidacion(filtrarStock(filtrosJuguetes(data.response)), liquidacion)
};

getData();

function filtrosJuguetes(array) {
    let juguetes = array.filter((producto) => producto.tipo === "Juguete");
    return juguetes;
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
            console.log(item._id)
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

    array.forEach((producto) => {
        const { _id, nombre, precio, stock, imagen, tipo } = producto;
        if (producto._id === nroId) {
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
                    // precio += producto.precio
                    // cantidad++
                    // producto.cantidad = cantidad;
                    // producto.precio = precio;
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

    pintarCarrito(carrito, contenedorCarrito);
    let carritoString = JSON.stringify(carrito);
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
                <img src="${ele.imagen}" class="img-fluid rounded-start object-fit " style="width: auto; height: auto" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${ele.nombre}</h5>
                    <p class="card-text"><small class="text-muted">Stock: </small><strong>${ele.stock}</strong></p>
                    <p class="card-text">Cantidad: ${ele.cantidad}</p>
                    <p class="card-text"><small class="text-muted">Precio: $${ele.precio}</small></p>

                <div class="d-flex justify-content-evenly">
                    <button id="mas-${ele.id}" type="button" style="width:2.5rem" class="btn btn-light">+</button>
                    <button id="menos-${ele.id}" style="width:2.5rem" class="btn btn-light">-</button>
                </div>
                </div>
                </div>
            </div>
        </div>
        `
        contenedor.appendChild(div)
        const btnSumar = document.querySelectorAll(`#mas-${ele.id}`);
        const btnResta = document.querySelectorAll(`#menos-${ele.id}`);
        btnSumar.forEach(boton => boton.addEventListener('click', () => {
            sumarCantidad(ele.id, ele.stock)
        }))

        btnResta.forEach( boton => boton.addEventListener('click', () => {
            restarCantidad(ele.id, ele.stock)
        }))
    })
}

btnVaciar.addEventListener('click', ()=>{
    contenedorCarrito.innerHTML = ''
    localStorage.clear()
})

document.addEventListener("DOMContentLoaded", ()=>{
    let carritoJSON = JSON.parse(localStorage.getItem("carrito"))
    pintarCarrito(carritoJSON, contenedorCarrito)
})


function sumarCantidad(idProducto, stock){
    let carrito = JSON.parse(localStorage.getItem('carrito'));

    carrito = carrito.map( ele => {
            if(ele.id === idProducto && ele.cantidad < stock){
                ele.cantidad +=1
            }else{
                console.log('ya se agoto no hay mas!!!!');
            }
            return ele;
    })
    localStorage.setItem('carrito', JSON.stringify(carrito));
    pintarCarrito(carrito, contenedorCarrito);
}

function restarCantidad(idProducto, stock){
    let carrito = JSON.parse(localStorage.getItem('carrito'));

    carrito = carrito.map( ele => {
            if(ele.id === idProducto && ele.cantidad > 1){
                ele.cantidad -=1
            }
            return ele;
    })
    localStorage.setItem('carrito', JSON.stringify(carrito));
    pintarCarrito(carrito, contenedorCarrito);
}

comprar.addEventListener('click', () => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn m-1',
            cancelButton: 'btn m-1'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: '¿Quieres realizar la compra?',
        text: "Estas por comprar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            contenedorCarrito.innerHTML = ''
            localStorage.clear()
            swalWithBootstrapButtons.fire(
            'Comprado!',
            'Su compra ha sido exitosa :)',
            'success',
        )
        } else if (
          /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
            'Cancelado',
            'Su compra ha sido cancelada',
            'error'
            )
        }

    })
})