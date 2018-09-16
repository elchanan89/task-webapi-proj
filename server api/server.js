var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router('db.json')
var middlewares = jsonServer.defaults()

function simpleAuth(req, res, next) {

  if (req.headers.authorization) {

    // user and password are stored in the authorization header:token
    var user_and_password = JSON.parse(new Buffer(req.headers.authorization, 'base64').toString('ascii'));

    // get the username & password
    var user = user_and_password.user_name;
    var pass = user_and_password.password;

    if (user == 'admin' && pass =='Aa123456'){

        // continue doing json-server 
        next();
    } 

    else{
        res.status(402).send({error: 'unauthorized:' + user_and_password})
    }

  } else {
    
    // Unauthorized
    res.status(401).send({error: 'unauthorized'})
  }
}

// start setting up json-server middlewares
server.use(middlewares)

// before proceeding with any request, run `simpleAuth` function
// which should check for basic authentication header .. etc
server.use(simpleAuth);

// Continue 
server.use(router);

// Start listening to port 3001
server.listen(3001, function () {
  console.log('JSON Server is running on port 3001');
})