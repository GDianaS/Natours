const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path:'./config.env'}); //variáveis de ambiente
//console.log(process.env); // variáveis de ambiente

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Conecting to DB
mongoose.connect(DB)
  .then(() =>{
    console.log('DB connection successfull!');
  })
  .catch(err => console.log('DB connection error:', err));

// START THE SERVER
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`App running on port ${port}...`);
});

//STATUS
// 200: OK
// 201: Created
// 204: No Content
// 400: Bad Request
// 404: Not found
// 500: Internal Server Error