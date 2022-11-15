/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
'use strict';

const searchInput = document.querySelector(".js_form_input");
const searchBtn = document.querySelector(".js_form_button");
const form = document.querySelector(".js-form");
const charactersList = document.querySelector(".js_characters_list");
const favouriteSection = document.querySelector(".js-favourite");
const favoutitesList = document.querySelector(".js_favourite_list");
const resetBtn = document.querySelector(".js-remove");

let listCharacters = [];
let listFavourites = [];

// Creación de cada uno de los articulos con los datos de la API
function renderOneCharacter(oneCharacter){

    const charactersFavouritesIndex = listFavourites.findIndex((eachCharacterObj) => eachCharacterObj.char_id === oneCharacter.char_id);

    let classFav = "";

    if(charactersFavouritesIndex === -1){
        classFav = "";
    } else{
        classFav = "fav";
    }

    let html = `<li class="card"> <article class="js_card_article card_article ${classFav}" id="${oneCharacter.char_id}">
    <img class="card_article-img"src="${oneCharacter.img}">
     <h2 class="card_article-name">${oneCharacter.name}</h2>
     <p class="card_article-status">${oneCharacter.status}</p>
     </article></li>`;
    
    return html;
}

// Pintar la lista de todos los personajes
function renderAllCharacters(character) {
    let html ='';
  
    for (let i = 0; i < character.length; i++) {
      html += renderOneCharacter(character[i]);
    }
    charactersList.innerHTML = html;
    charactersListeners();
  }

  // Pintar la lista de los favoritos
  function renderFavouritesCharacters() {
    let html = '';
  
    for (let i = 0; i < listFavourites.length; i++) {
      html += renderOneCharacter(listFavourites[i]);
    }

/*  Aparece o se esconde Favoritos (No lo  activo por falta de maquetación) ;
    if(listFavourites <= 0){
      favouriteSection.classList.add('hidden');
    } else {
      favouriteSection.classList.remove('hidden');
    }*/
  
    favoutitesList.innerHTML = html;
  }

// Añadir listeners a cada articulo de personaje.
  function charactersListeners() {
    const allArticles = document.querySelectorAll('.js_card_article');
  
    for (const eachArticle of allArticles) {
      eachArticle.addEventListener('click', handleClickArticle);
    }
  }

// Añade a favoritos el personaje seleccionado.
  function handleClickArticle(event){
    event.currentTarget.classList.toggle('fav');

    const selectedCharacter = listCharacters.find((eachCharacterObj) => eachCharacterObj.char_id === parseInt(event.currentTarget.id));

    const charactersFavouritesIndex = listFavourites.findIndex((eachCharacterObj) => eachCharacterObj.char_id === parseInt(event.currentTarget.id));
  
    if (charactersFavouritesIndex === -1) {
      listFavourites.push(selectedCharacter);
    } else {
      listFavourites.splice(charactersFavouritesIndex, 1);
    }
  
    localStorage.setItem('fav', JSON.stringify(listFavourites));

    renderFavouritesCharacters();
  }

  function resetFav(){
    listFavourites= [];
    localStorage.removeItem('fav');
    const favCharacter = document.querySelectorAll('.js_card_article');
    for(const article of favCharacter){
      article.classList.remove('fav');
    }
    renderFavouritesCharacters();
    renderAllCharacters();
  }

  // Eventos
  
  resetBtn.addEventListener(`click`, resetFav);

  form.addEventListener(`submit`, (event) => {
    event.preventDefault();
  });
  
  searchBtn.addEventListener('click', () => {
    const userSearch = searchInput.value.toLowerCase();
  
    console.log(userSearch);
  
    const filteredCharacters = listCharacters.filter((character) => character.name.toLowerCase().includes(userSearch));
  
    renderAllCharacters(filteredCharacters);
  });


// Codigo que se ejecuta cuando carga la pagina

renderAllCharacters(listCharacters);

fetch('https://breakingbadapi.com/api/characters')
.then((response) => response.json())
  .then((data) => {
    listCharacters = data;
    renderAllCharacters(listCharacters);
  });

const savedFavourites = JSON.parse(localStorage.getItem('fav'));

console.log(savedFavourites);

if (savedFavourites !== null) {
  listFavourites = savedFavourites;
  renderFavouritesCharacters();
}
