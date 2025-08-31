const app = require('./app');

// START THE SERVER
const port = 3000;
app.listen(port, ()=>{
    console.log(`App running on port ${port}...`);
});

//STATUS
// 200: OK
// 201: Created
// 204: No Content
// 404: Not found
// 500: Internal Server Error