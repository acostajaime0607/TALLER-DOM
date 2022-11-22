const app = document.getElementById("productos");

document.addEventListener("DOMContentLoaded", (e) => {
  fetchData();
  document.getElementById("editar").hidden = true;
  document.getElementById("idproducto").hidden = true;
  document.getElementById("labelid").hidden = true;
});

const fetchData = async () => {
  const res = await fetch(
    "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=81a950c980fc1ddaf786565707f64517&page=1"
  );

  const data = await res.json();
  formatterData(data.results);
};

const formatterData = async (data) => {
  for (const iterator of data) {
    const formatter = {
      id: iterator.id,
      name: iterator.original_title,
      precio: getRandomInt(1000, 10000),
      image: `https://image.tmdb.org/t/p/w1280${iterator.poster_path}`,
    };

    arrayTemp.push(formatter);
  }

  pintarCard(arrayTemp);
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const pintarCard = (data) => {
  data.forEach((element) => {
    templateProductos.querySelector("h5").textContent = element.name;
    templateProductos.querySelector("p").textContent = element.precio;
    templateProductos.querySelector("img").setAttribute("src", element.image);
    templateProductos.querySelector("button").dataset.id = element.id;
    templateProductos.querySelector(".btn-danger").dataset.id = element.id;
    templateProductos.querySelector(".btn-info").dataset.id = element.id;
    const clone = templateProductos.cloneNode(true);
    fragment.appendChild(clone);
  });
  app.appendChild(fragment);
};

const agregarCarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCarriro(e.target.parentElement);
  }
};

const setCarriro = (data) => {
  llenarCarrito(data);
};

const llenarCarrito = (data) => {
  const producto = {
    id: data.querySelector("button").dataset.id,
    name: data.querySelector("h5").textContent,
    precio: data.querySelector("p").textContent,
    cantidad: 1,
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = { ...producto };
  pintarCarro();
};

const pintarCarro = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((data) => {
    templateItems.querySelector("th").textContent = data.id;
    templateItems.querySelectorAll("td")[0].textContent = data.name;
    templateItems.querySelectorAll("td")[1].textContent = data.cantidad;
    templateItems.querySelector("span").textContent =
      data.precio * data.cantidad;

    templateItems.querySelector(".btn-info").dataset.id = data.id;
    templateItems.querySelector(".btn-danger").dataset.id = data.id;
    const clone = templateItems.cloneNode(true);
    fragment.appendChild(clone);
  });

  items.appendChild(fragment);
  pintarFooter();
};

const pintarFooter = () => {
  footer.innerHTML = "";

  const cantidad_productos = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );

  const valor_total = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = cantidad_productos;
  templateFooter.querySelectorAll("span")[0].textContent = valor_total;

  const boton = document.querySelector("vaciar-todo");
  //   boton.addEventListener("click", () => {
  //     carrito = {};
  //   });

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);
};

const btnActions = (e) => {
  if (e.target.classList.contains("btn-info")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = { ...producto };
  }

  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];

    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    } else {
      carrito[e.target.dataset.id] = { ...producto };
    }
  }

  pintarCarro();
};
