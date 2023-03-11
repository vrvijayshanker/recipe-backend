const express = require ('express')
const mongoose = require ('mongoose')
const cors = require('cors');

const app = express()

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://vijayvr:mongo123@cluster1.zt8bq.mongodb.net/recipedb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to DB"))
.catch(console.error)

const Recipe = require('./models/Recipe')

//View All Recipes
app.get('/allrecipe', async(req, res) => {
    const recipes = await Recipe.find();
    res.json(recipes);
});

//Add a Recipe
app.post('/addrecipe', (req,res) => {
    const addrecipe = new Recipe({
        title: req.body.title,
        cuisine: req.body.cuisine,
        duration: req.body.duration,
        servings: req.body.servings,
        image: req.body.image,
        imageurl: req.body.imageurl

    });

    addrecipe.save();

    res.json(addrecipe);
    res.status(201).json(addrecipe);
    console.log(addrecipe);    
});

//Select Recipe based on Cuisine
app.get('/recipebycuisine/:cuisine', async(req, res) => {
    console.log(req.params.cuisine)
    const recipe = await Recipe.find({
        "$or":[
            {cuisine:{$regex:req.params.cuisine}}
        ]
    })
    res.json(recipe);
});

//get a RECIPE by ID
app.get('/getarecipe/:id', async(req, res) => {
    const recipe = await Recipe.findById(req.params.id)
    res.json(recipe);
});

//Update Recipe
app.patch("/update/:_id", async (req, res) => {
    let id = req.params._id;
    let updatedData = req.body;
    let options = {new: true};

    try{
        const newdata = await Recipe.findByIdAndUpdate(id,updatedData, options);
        res.send(updatedData);

    }
    catch (error) {
        res.send(error.message);
    }

    

    //     const edited = await Recipe.findByIdAndUpdate(id,req.body);
    // try{
    //     const {id} = req.params;
    //     const edited = await Recipe.findByIdAndUpdate(id,req.body);
    //     if(!edited){
    //         return res.status(404).json({message: `Can't find Recipe with ID ${id}`})
    //     }
    //     else{
    //         const updatedRecipe = await Recipe.findById(id);
    //         res.status(200).json(editedRecipe);
    //     }
        
    // }
    // catch (error) {
    //     res.status(500).json({message: error.message})
    // }
    
    // let data = await Recipe.updateOne(
    //     req.params,
    //     {$set: req.body}
    // );
    
    // res.send(data);

})

//Delete Recipe
app.delete('/delete/:id', async(req,res) => {
    const result = await Recipe.findByIdAndDelete(req.params.id);
    res.json(result);
});

app.listen(5000, () => { 
    console.log("Server started on Port 5000") 
});