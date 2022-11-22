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
