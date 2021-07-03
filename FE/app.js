let thePokemons = [];
const pokedex = document.getElementById('pokedex');
const searchtext = document.getElementById('search-txt');
const fetchPokemon = () => {
    const promises = [];

    const usedIndexes = new Set();    
    function getUniqueRandomNumber(max, min = 1) {
        const newNumber = Math.floor(Math.random() * (max - min) + min);
        if (usedIndexes.has(newNumber)) {
            return this.getUniqueRandomNumber(max, min);
        } else { 
            usedIndexes.add(newNumber);
            return newNumber;
        }
    }
    
    for (let i=1; i<= 5; i++) {
        const index = getUniqueRandomNumber(898,1);
        const url = `/pokemon/${index}`;
        promises.push(fetch(url).then((res) => res.json()));
    }

    Promise.all(promises).then((results) => {
        const pokemon = results.map((data) => ({
            name: data[0].name.english,
            id: data[0].id,
            image : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data[0].id}.png`,
            type: data[0].type.join(", "),
            hp: data[0].base["HP"],
            attack: data[0].base["Attack"],
            defense: data[0].base["Defense"],
            special_attack: data[0].base["Sp. Attack"],
            special_defense: data[0].base["Sp. Defense"],
            speed: data[0].base["Speed"],
            //moves: data[0].moves,//.map((m)=> m.move.name),
            captured: data[0].captured
            
        }));
        thePokemons = pokemon;
        displayPokemon(pokemon);
    });
};

const displayPokemon = (pokemon) => {
    console.log(pokemon.moves);
    const pokemonHTMLString = pokemon
      .map(
        (pokeman) => 
        `
    <li class="card" >
        <p class="card-id"> ${pokeman.id} </p>
        <img class="card-image" src="${pokeman.image}" onclick="selectPokemon(${pokeman.id})">
        <h2 class="card-title">${pokeman.name}</h2>
        <p class="card-subtitle"> ${pokeman.type} </p>
        
    <label class="switch">
    <input type="checkbox" onclick="switcherFunction(${pokeman.id})" id="${pokeman.id}">
    <span class="slider round"></span>
</label>
    </li>
    `
      )
      .join("");
    pokedex.innerHTML = pokemonHTMLString;
    pokemon.map((pokeman)=> getCaptureValuesFromStorage(pokeman.id));
};

function getCaptureValuesFromStorage(id){
    if (localStorage.getItem(id) == "true") { 
        document.getElementById(id).checked = true;
    }else{
        document.getElementById(id).checked = false;
    }
}

function switcherFunction(id){
    const url = `/pokemon/${id}`;
    if(document.getElementById(id).checked){
        localStorage.setItem(id, "true");//
        fetch(url, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'PUT',
            body: JSON.stringify({
             captured:true,
            })
          }).catch(function(error) {                        // catch
            console.log('Request failed', error);
          });
    }
    else{
        localStorage.setItem(id, "false");//
        fetch(url, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'PUT',
            body: JSON.stringify({
              captured:false,
            })
          })
   }
}

let filteredPokemons;
searchtext.addEventListener("keyup", (e) => {
    const searchString = e.target.value.toLowerCase();
    filteredPokemons = thePokemons.filter((p)=>{
        return (p.name.includes(searchString));
    });
    displayPokemon(filteredPokemons);


});

const selectPokemon = async (id) => {
    for (var i=0; i < thePokemons.length; i++) {
        if (thePokemons[i].id === id) {
            //console.log(id);
            displayPopup(thePokemons[i]);
            //return myArray[i];
        }
    }
};

let displayedPokemons;
const displayPopup = (pokeman) => {
    
    displayedPokemons = pokedex.innerHTML;
    let htmlString = `
        <div class="popup">
            <button id="closeBtn" onclick="closePopup()">X</button>
            <div class="card">
            <img class="card-imagepop" src="${pokeman.image}">
            <h2 class="card-title">${pokeman.name}</h2>
            <hr>
            <h3> Type(s) </h3>
            <p class="card-subtitle"> ${pokeman.type} </p>
            <hr>
            <h3> Stats </h3>
            
            <p> HP: </p> <div id="theBar">
                         <div id="bar" style="width: ${pokeman.hp > 100? '100': pokeman.hp}%"><br></div>
                         <div id="textbar"> ${pokeman.hp}%</div>
                        </div>

            <p> Attack: </p> <div id="theBar">
                                                <div id="bar" style="width: ${pokeman.attack > 100? '100': pokeman.attack}%"><br></div>
                                                <div id="textbar"> ${pokeman.attack}%</div>
                                                </div>
            <p> Defense: </p> 
                                                <div id="theBar">
                                                <div id="bar" style="width: ${pokeman.defense > 100? '100': pokeman.defense}%"><br></div>
                                                <div id="textbar"> ${pokeman.defense}%</div>
                                                </div>
            <p> Special Attack:</p>
                                                <div id="theBar">
                                                <div id="bar" style="width: ${pokeman.special_attack > 100? '100': pokeman.special_attack}%"><br></div>
                                                <div id="textbar"> ${pokeman.special_attack}%</div>
                                                </div>
            <p> Special Defense:</p>
                                                <div id="theBar">
                                                <div id="bar" style="width: ${pokeman.special_defense > 100? '100': pokeman.special_defense}%"><br></div>
                                                <div id="textbar"> ${pokeman.special_defense}%</div>
                                                </div>
            <p> Speed:</p>
                                                <div id="theBar">
                                                <div id="bar" style="width: ${pokeman.speed > 100? '100': pokeman.speed}%"><br></div>
                                                <div id="textbar"> ${pokeman.speed}%</div>
                                                </div>
            <br><hr>
            <!--<h3> Moves</h3>-->
            <!--<ul class="moves">-->
            
    `;
    // pokeman.moves.forEach((p)=>{
    //     //console.log(p);
    //     htmlString=htmlString + '<li class="move">'+p+'</li>';
    // })
    pokedex.innerHTML = htmlString + '</div></div>';
};

const closePopup = () => {
    const popup = document.querySelector('.popup');
    popup.parentElement.removeChild(popup);
    pokedex.innerHTML = displayedPokemons;
};

fetchPokemon();
