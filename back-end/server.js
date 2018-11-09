// Import express app. 
var app = require(__dirname + '/app.js'); 
var config = require(__dirname + '/config.js')


// Set port. 
var port = process.env.PORT || config.port; 
// Start server. 
app.listen(port);
console.log("server running on port 3000");  