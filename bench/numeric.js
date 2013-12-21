"use strict"

var numeric = require("numeric")

//Initializing data
console.log("initializing...")
var a = numeric.random([300,300])
var b = numeric.random([300,300])

//Warm up
console.log("warm up...")
for(var i=0; i<10; ++i) {
  var c = numeric.dot(a, b)
}

//Run main loop
console.log("starting loop")
var start = Date.now()
for(var i=0; i<100; ++i) {
  var c = numeric.dot(a, b)
}
var stop = Date.now()
console.log("numericjs time: ", stop - start)