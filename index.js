const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

app.use(express.json()); 

//Serve frontend
//app.use(express.static(path.join(__dirname, 'FE')));
app.use(express.static(path.join(__dirname,'FE')));


//Get pokemons
var pokemons = JSON.parse(fs.readFileSync('pokedexcopy.json'));
app.get('/allpokemons', (req,res)=> {
    res.json(pokemons);
});

//Get 5 random Pokemons
// app.get('/five', (req,res)=> {
//     let fivePokemons = pokemons.slice(0,5);
//     res.json(fivePokemons);
// });

//Get Pokemon details
app.get('/pokemon/:id', (req,res)=> {
    //res.status(200).json({msg: `${pokemons[0].moves}` })
    var id = req.params.id;
    res.json(pokemons.filter(p => p.id === parseInt(id) ));
});

//Update Pokemon based on capture status
app.put('/pokemon/:id',(req , res)=>{
    const found = pokemons.some(pokemon => pokemon.id === parseInt(req.params.id));
    if(found){
        const updatedPokemon = req.body;
        
        pokemons.forEach(pokemon =>{
            if(pokemon.id === parseInt(req.params.id)){
                pokemon.captured = updatedPokemon.captured ;
                res.json({msg:"Pokemon updated successfully!" , pokemon});
            }
        })
        fs.writeFile('pokedexcopy.json',JSON.stringify(pokemons,null,2),
        (err)=>{
            console.log(err);
        });
    }else{
        res.status(400);
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> console.log('Server started'));
