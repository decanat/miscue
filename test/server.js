var express = require('express');

var app = express();


app.use(express.static(__dirname));


var port = process.env.PORT || 8000;

app.listen(port);

console.info('Test server running on 127.0.0.1:' + port);
