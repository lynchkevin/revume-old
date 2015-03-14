var express = require('express');
var router = express.Router();

var entries = [
{"firstName":"Kevin", "lastName":"Lynch", "email":"klynch@volerro.com", "company":"Volerro"},
{"firstName":"Kathy", "lastName":"Lynch", "email":"kevkathboys@yahoo.com", "company":"Volerro"},    
{"firstName":"Tom", "lastName":"Vettel", "email":"tvettel@acpartners.us", "company":"Atlas Capital"},
{"firstName":"Jason", "lastName":"Sundby", "email":"jsundnby@acpartners.us", "company":"Atlas Capital"}
];
 
var callCount = 0;

var nextUser = function() {
    callCount = callCount < (entries.length - 1)? callCount+1 : 0;  
    return callCount;
}

var getUsers = function() {
    return entries;
}
 
var getUser = function(id) {
    if(id<entries.length.toString()) {
        console.log("getUser",callCount);
        return entries[id];
    }
}

var assignUser= function() {
    var usr = getUser(callCount);
    nextUser();
    return usr;
}

/* GET users listing. */
router.get('/user', function(req, res, next) {
    res.send(assignUser());
});

module.exports = router;
