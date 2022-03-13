// Import mongoose
const mongoose = require('mongoose')

// connect to mongodb
const dburl = "mongodb://localhost:27017/node-js-mongodb";
mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

// design schema
let productSchema = mongoose.Schema({
    name: String,
    detail: String,
    image: String,
    price: Number
})

// create model
let Product = mongoose.model("products", productSchema)


// create insert method 
function saveProduct(model, data) {
    model.save(data)
}


// export model
module.exports = Product
module.exports.saveProduct = saveProduct