const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public/'))

app.listen(8080, () => {
    console.log('Listening on PORT: 3333, http://localhost:3333');
})
