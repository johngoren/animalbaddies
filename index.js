const express = require('express')
const app = express()
const path = require('path')
const port = 3000

app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'));
app.use("/dist", express.static(__dirname + '/dist'));
app.use("/styles", express.static(__dirname + '/styles'));

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
