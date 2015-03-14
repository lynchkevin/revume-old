var attendees = [
    {"firstName":"Kevin", "lastName":"Lynch", "email":"klynch@volerro.com", "company":"Volerro",role:"organizer"},
    {"firstName":"Kathy", "lastName":"Lynch", "email":"kevkathboys@yahoo.com", "company":"Volerro",role:"attendee"},    
    {"firstName":"Tom", "lastName":"Vettel", "email":"tvettel@acpartners.us", "company":"Atlas Capital",role:"attendee"},
    {"firstName":"Jason", "lastName":"Sundby", "email":"jsundnby@acpartners.us", "company":"Atlas Capital",role:"attendee"}    
];


var sessions = [
    {id:0, uuid:111222333 , title:"Introduction to Ionic", organizer:"CHRISTOPHE COENRAETS", date:"March 15,2015",time:"9:00am", description: "In this session, you'll learn how to build a native-like mobile application using the Ionic Framework, AngularJS, and Cordova.",attendees:attendees,presentations:[0],cover:"content/slide1.png"},
    {id:1, uuid:222333444 , title:"AngularJS in 50 Minutes", organizer:"LISA SMITH", date:"March 19,2015",time:"10:00am", description: "In this session, you'll learn everything you need to know to start building next-gen JavaScript applications using AngularJS.",attendees:attendees,presentations:[2],cover:"content/slide21.png"},
    {id:2, uuid:333444555 , title:"Contributing to Apache Cordova", organizer:"JOHN SMITH", date:"March 21,2015",time:"11:00am", description: "In this session, John will tell you all you need to know to start contributing to Apache Cordova and become an Open Source Rock Star.",attendees:attendees,presentations:[1,2],cover:"content/slide10.png"},
    {id:3,uuid:444555666 , title:"Mobile Performance Techniques", organizer:"JESSICA WONG", date:"March 30,2015",time:"3:00Pm", description: "In this session, you will learn performance techniques to speed up your mobile application.",attendees:attendees,presentations:[2],cover:"content/slide21.png"},
    {id:4,uuid:555666777 , title:"Building Modular Applications", organizer:"LAURA TAYLOR", date:"March 14,2015",time:"2:00pm", description: "Join Laura to learn different approaches to build modular JavaScript applications.",attendees:attendees,presentations:[1,0],cover:"content/slide10.png"}
];

exports.findAll = function (req, res, next) {
    res.send(sessions);
};

exports.findById = function (req, res, next) {
    var key = req.params.id;
    res.send(sessions[key]);
};

