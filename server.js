var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/api', function (req, res) {
    res.send({mess:'world'});
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});