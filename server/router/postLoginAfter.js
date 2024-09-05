var fs = require('fs');

module.exports = funstion(req, res) {
    var u = req.body.username;
    var p = req.body.pwd;
    c = u + p;
    console.log(c);
    fs.readFile('./data/users.json', 'utf8', function(err, data) {
    //    if
    })
}