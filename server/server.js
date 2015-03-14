var     express = require('express');
var     bodyParser     = require('body-parser');
var     methodOverride = require('method-override');
var     sessions = require('./routes/sessions');
var     users = require('./routes/users');
var     presentations = require('./routes/presentations');
var     app = express();

app.use(bodyParser());          // pull information from html in POST
app.use(methodOverride());      // simulate DELETE and PUT

app.use(express.static('../conference/www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/sessions', sessions.findAll);
app.get('/sessions/:id', sessions.findById);
app.use('/api',users);
app.use('/api',presentations);

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
