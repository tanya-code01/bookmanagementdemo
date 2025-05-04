const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    author:{
        type: String,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    inStock:{
        type: Boolean,
        default: true
    }

},{timestamps : true})

module.exports = mongoose.model('Book',productSchema)