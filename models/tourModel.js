const mongoose = require('mongoose');

// Estrutura do documento
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});
// Model a partir do schema
// Mongoose automaticamente cria a coleção com o nome em minúsculas e plural
// modelo: Trour --> coleção no MongoDB: tours
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;