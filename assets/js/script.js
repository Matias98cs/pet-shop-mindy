let home = document.querySelector("#home")
let juguetes = document.querySelector('#juguetes')

const getData = async() => {
    await fetch('https://apipetshop.herokuapp.com/api/articulos')
    .then((res) =>res.json())
    .then((json) => data = json)
    .catch((error) => console.log(error))
    mapeoJuguetes(data.response, juguetes)
}

getData()

const mapeoJuguetes = (array, donde) => {
  array.map((item) => {
    if(item.tipo === 'Juguete'){
      let card = document.createElement('div')
      card.className = 'card m-3'
      card.style.width = '20rem'
      card.style.height = 'auto'
      card.innerHTML = `
      <img class="card-img" src="${item.imagen}" style="width: auto; height: 18rem" alt="Vans">
      <div class="card-img d-flex justify-content-end">
        <a href="#" class="card-link text-danger like">
          <i class="fas fa-heart"></i>
        </a>
      </div>
      <div class="card-body d-flex flex-column justify-content-between" style="width: auto; height: auto">
        <h4 class="card-title">${item.nombre}</h4>
        ${item.stock < 3 ? `<div class="alert alert-danger" role="alert">
        Bajo stock! ${item.stock} unidades restantes.
        </div>` : `<h6 class="card-subtitle mb-2 text-muted">Stock: ${item.stock}</h6>`}
        <p class="card-text">${item.descripcion}</p>
      <div class="buy d-flex justify-content-between flex-column align-items-start">
      <label for="quantity">Cantidad:</label>
      <input type="number" id="cantidad" name="cantidad" min="1" max="${item.stock}"><br><br>
      <div class="d-flex align-items-center justify-content-evenly w-100">
          <div class="price text-success d-flex"><h5 class="mt-4">$${item.precio}</h5></div>
          <a href="#" class="btn mt-3" ><i class="fas fa-shopping-cart"></i> Agregar al carrito</a>
      </div>
      </div>
      </div>`
      donde.appendChild(card)
    }
  })
}

      

