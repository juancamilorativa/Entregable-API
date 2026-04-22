const input = document.getElementById("search-input");
const btnBuscar = document.getElementById("search-btn");
const btnRandom = document.getElementById("random-btn");
const btnOtro = document.getElementById("another-btn");
const btnSelect = document.getElementById("btnSelect");

const selectHero = document.getElementById("hero-select");

const contenedor = document.getElementById("hero-container");
const contenedorFav = document.getElementById("favorites-container");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");

let heroes = [];
let resultados = [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

/* 
   CARGAR API
 */
async function cargarHeroes(){
  const res = await fetch("https://akabab.github.io/superhero-api/api/all.json");
  heroes = await res.json();

  heroes.sort((a,b)=>a.name.localeCompare(b.name)); // ordenar

  llenarSelect();
}
cargarHeroes();

/* 
   LLENAR SELECT
*/
function llenarSelect(){
  selectHero.innerHTML = '<option value="">Selecciona un personaje</option>';

  heroes.forEach(hero=>{
    const option = document.createElement("option");
    option.value = hero.id;
    option.textContent = hero.name;
    selectHero.appendChild(option);
  });
}

/* 
   MOSTRAR SELECCIONADO
 */
function mostrarSeleccionado(){
  const id = parseInt(selectHero.value);

  if(!id){
    contenedor.innerHTML = "<p>Selecciona un personaje</p>";
    return;
  }

  const hero = heroes.find(h=>h.id===id);
  render([hero]);
}

/* 
   BUSCAR
 */
function buscar(){
  const texto = input.value.toLowerCase();
  resultados = heroes.filter(h => h.name.toLowerCase().includes(texto));
  render(resultados);
}

/* 
   FILTRAR MARVEL
 */
function filtrarMarvel(){
  resultados = heroes.filter(h => h.biography.publisher === "Marvel Comics");
  render(resultados);
}

/* =
   ORDENAR
= */
function ordenarAZ(){
  resultados.sort((a,b)=>a.name.localeCompare(b.name));
  render(resultados);
}

/* 
   ALEATORIO
 */
function aleatorio(){
  const random = heroes[Math.floor(Math.random()*heroes.length)];
  render([random]);
}

/* 
   OTRO
 */
function otro(){
  if(resultados.length===0){
    contenedor.innerHTML="<p>Primero busca</p>";
    return;
  }
  const random = resultados[Math.floor(Math.random()*resultados.length)];
  render([random]);
}

/* 
   RENDER
 */
function render(lista){
  contenedor.innerHTML="";

  lista.slice(0,6).forEach(hero=>{
    const card=document.createElement("div");
    card.classList.add("card");

    card.innerHTML=`
      <img src="${hero.images.md}">
      <h3>${hero.name}</h3>
      <p>${hero.biography.publisher}</p>
      <button onclick="verDetalle(${hero.id})">Ver más</button>
      <button onclick="agregarFav(${hero.id})">Favorito</button>
    `;

    contenedor.appendChild(card);
  });
}

/* 
   MODAL
*/
function verDetalle(id){
  const hero = heroes.find(h=>h.id===id);

  modalBody.innerHTML=`
    <h2>${hero.name}</h2>
    <img src="${hero.images.md}" width="100%">
    <p><b>Editorial:</b> ${hero.biography.publisher}</p>
    <p><b>Altura:</b> ${hero.appearance.height[0]}</p>
    <p><b>Peso:</b> ${hero.appearance.weight[0]}</p>
  `;

  modal.style.display="block";
}

closeBtn.onclick = ()=> modal.style.display="none";
window.onclick = e => { if(e.target==modal) modal.style.display="none"; };

/* 
   FAVORITOS
 */
function agregarFav(id){
  const hero = heroes.find(h=>h.id===id);
  if(favoritos.some(f=>f.id===id)) return;

  favoritos.push(hero);
  localStorage.setItem("favoritos",JSON.stringify(favoritos));
  renderFav();
}

function renderFav(){
  contenedorFav.innerHTML="";

  favoritos.forEach(hero=>{
    const card=document.createElement("div");
    card.classList.add("card");

    card.innerHTML=`
      <img src="${hero.images.md}">
      <h3>${hero.name}</h3>
      <button onclick="eliminarFav(${hero.id})">Eliminar</button>
    `;

    contenedorFav.appendChild(card);
  });
}

function eliminarFav(id){
  favoritos=favoritos.filter(f=>f.id!==id);
  localStorage.setItem("favoritos",JSON.stringify(favoritos));
  renderFav();
}

/*
   EVENTOS
 */
btnBuscar.onclick=buscar;
btnRandom.onclick=aleatorio;
btnOtro.onclick=otro;
btnSelect.onclick=mostrarSeleccionado;

/* INICIO */
renderFav();