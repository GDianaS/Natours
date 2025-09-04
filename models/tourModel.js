const mongoose = require('mongoose');

// Estrutura do documento
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    duration:{
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize:{
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficult']
    },
    ratingAverage: {
        type: Number,
        default: 4.5,
    },
    ratingQuantity:{
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        required: [true, 'A tour must have a summary'],
        trim: true
    },
    description:{
        type: String,
        trim: true
    },
    imageCover:{
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images:[String], // array de strings
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false //hide from the output(cliente side)
    },
    startDates:[Date] // array de datas
});
// Model a partir do schema
// Mongoose automaticamente cria a coleção com o nome em minúsculas e plural
// modelo: Trour --> coleção no MongoDB: tours
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;