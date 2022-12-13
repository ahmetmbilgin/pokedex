let sayac = 0;
const MOBIL_LIMIT = 5;
const MASAUSTU_LIMIT = 30;

const getPokemons = async (link, nextLink) => {
    if (nextLink) {
        const pokemonsData = await (await fetch(nextLink)).json();
        return pokemonsData
    } else {
        const pokemonsData = await (await fetch(link)).json();
        return pokemonsData
    }
}

const catchPokemon = async (pokeUrl) => {
    const pokemonData = await (await fetch(pokeUrl)).json();
    return pokemonData;
}

const pokemonText = async (textUrl) => {
    const pokemonTextData = await (await fetch(textUrl)).json()
    return pokemonTextData.flavor_text_entries[1].flavor_text
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

const renderCards = pokemonData => {
    const cardList = document.querySelector("main .card-list")
    pokemonText(pokemonData.species.url).then(res => {
        let typeNames = ``
        pokemonData.types.forEach(obj => {
            const typeName = ` #${obj.type.name[0].toUpperCase() + obj.type.name.substring(1)}`
            typeNames += typeName
        })
        const spanTextTypes = `<span>${typeNames}</span>`

        let abilities = ``
        pokemonData.abilities.forEach(obj => {
            const abilityName = ` #${obj.ability.name[0].toUpperCase() + obj.ability.name.substring(1)}`
            abilities += abilityName
        })
        const spanTextAbilities = `<span>${abilities}</span>`

        cardList.innerHTML += `
        <div class="card" style="width: 18rem;">
        <img src="${pokemonData.sprites.other['official-artwork'].front_default}"
          class="card-img-top" alt="pokemon-img">
        <div class="card-body">
          <h5 class="card-title">${pokemonData.id} - ${pokemonData.name[0].toUpperCase() + pokemonData.name.substring(1)}</h5>
          <p class="card-text">${res}</p>
        </div>
        <ul class="list-group list-group-flush">
        <li class="list-group-item">Types: ${spanTextTypes}</li>
        <li class="list-group-item">Abilities: ${spanTextAbilities}</li>
        </ul>
      </div>`
        --sayac
    })
}

const toDoCards = (first, second) => {
    getPokemons(first, second).then(res => {
        shuffle(res.results).forEach(pokeObj => {
            catchPokemon(pokeObj.url).then(pokemonData => {
                renderCards(pokemonData);
            })
        })
    })
}

function myFunction(x) {
    if (x.matches) {
        sayac = MOBIL_LIMIT;
        toDoCards(`https://pokeapi.co/api/v2/pokemon?limit=5`);
        let value = 0
        window.onscroll = function (ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight && sayac == 0) {
                value += MOBIL_LIMIT
                sayac = MOBIL_LIMIT;
                toDoCards(``, `https://pokeapi.co/api/v2/pokemon?offset=${value}&limit=${MOBIL_LIMIT}`)
            }
        };
    } else {
        sayac = MASAUSTU_LIMIT
        toDoCards(`https://pokeapi.co/api/v2/pokemon?limit=30`);
        let value = 0
        window.onscroll = function (ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight && sayac == 0) {
                value += MASAUSTU_LIMIT
                sayac += MASAUSTU_LIMIT
                toDoCards(``, `https://pokeapi.co/api/v2/pokemon?offset=${value}&limit=${MASAUSTU_LIMIT}`)
            }
        };
    }
}

const mediaQueryList = window.matchMedia('(max-width: 991px)');
myFunction(mediaQueryList);
mediaQueryList.addEventListener("change", myFunction) // mediaQueryList.addListener(myFunction);