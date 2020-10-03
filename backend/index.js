const express = require('express');
const bodyParser = require('body-parser');

//create express app
const app = express();
const port = process.env.PORT || 5000;

//parse requests of content-type - application/x-www-for-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//parse requests of content-type - application/json
app.use(bodyParser.json());

//define a root route
app.get('/', (req, res) => {
    res.send("hello world");
});

//Require routes
const routes = require('./src/routes')

//using as middleware
app.use('/api', routes);

//listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})