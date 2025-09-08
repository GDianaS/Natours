const mongoose = require('mongoose');
const slugify = require('slugify'); //npm i slugify

// Estrutura do documento
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    slug: String,
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
    startDates:[Date], // array de datas
    secretTour:{
        type: Boolean,
        default: false
    }
}, {
    // Ativando as virtuals na saída JSON e Object
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// VIRTUAL PROPERTIES
// Não são armazenadas no banco de dados (MongoDB).
// Não pode ser usada em uma query
// São úteis para valores derivados
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});


//DOCUMENT MIDDLEWARE: 
// pre: runs before .save() and .create()
tourSchema.pre('save', function(next) {
    //console.log(this); // this : current process document/document being safe
    this.slug = slugify(this.name, {lower: true});
    next();
});

// tourSchema.pre('save', function(next){
//     console.log('Will save the document...');
//     next();
// });

// // post: runs after the middlewares
// tourSchema.post('save', function(doc, next){
//     console.log(doc);
//     next();
// });


// QUERY MIDDLEWARE
// pre: runs before commands starting with .find
tourSchema.pre(/^find/, function(next){
    // this: current query
    this.find({secretTour: {$ne: true}}) //secret Tour is not true
    this.start = Date.now()
    next();
});

tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    // tem acesso a docs, pois já terminou
    //console.log(docs);
    next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next){
    // this: current aggregate object
    this.pipeline().unshift({
        $match: {secretTour: {$ne : true}}
    })// add at the beginning of the array --: new stage in the aggregation pipeline
    //console.log(this.pipeline());
    next();
});


// Model a partir do schema
// Mongoose automaticamente cria a coleção com o nome em minúsculas e plural
// modelo: Trour --> coleção no MongoDB: tours
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

//MOONGOSE MIDDLEWARE:
// 1. documento
// 2. query
// 3. aggregation
// 4. model