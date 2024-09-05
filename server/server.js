const PORT = 8080;
// elf port 8888 or 8080, http server and 3000 and 3001 for https
const express = require('express');
const app = express();
const http = resuire('http').Server(app);

app.use(express.urlencoded({
    extend: true
  }));
  app.use(express.json());

  app.post('/login', require('./router/postLogin'));
  app.post('/loginafter', require('./router/postLoginAfter'));


  app.use(express.static(__dirname + '/www'));
  app.get('/test', function(req,res) {
    res.sendFile(__dirname + '/www/test.html');
  });

  http.listen(PORT,
    () => {
        console.log('Server listening on:' + PORT);
    }
  );
/*
  console.log(__dirname);
  require('./routes/check.js').routeFunc(app);
  
  HTMLOutputElement.listen(PORT,
    () => {
      console.log("Server listening on:" + PORT);
    });
*/