const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')

dotenv.config({path:'./config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
  .then(() =>{
    console.log('DB connection successfull!');
  })
  .catch(err => console.log('DB connection error:', err));

//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//IMPORT DATA INTO DB
const importData = async() =>{
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');
    } catch (error) {
        console.log(error);
    }

    process.exit();
}

//DELETE ALL EXISTING DATA FROM DB
const deleteData = async() =>{
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
        
    } catch (error) {
        console.log(error);
    } 

    process.exit();
}

// USING THE TERMINAL TO IMPORT OR DELETE
if(process.argv[2] === '--import'){
    importData()
} else if (process.argv[2] === '--delete'){
    deleteData();
}
// node dev-data/data/import-dev-data.js --delete
// node dev-data/data/import-dev-data.js --import