"use strict"

var zeros = require("zeros")
var ops = require("ndarray-ops")
var ndgemm = require("../gemm.js")

//Initialize matrix
console.log("initializing...")
var a = zeros([300, 300])
var b = zeros([300, 300])
var c = zeros([300, 300])
ops.random(a)
ops.random(b)
ops.random(c)

//Warm up run
console.log("warm up...")
for(var i=0; i<10; ++i) {
  ndgemm(c, a, b)
}

//Run main loop
console.log("starting loop")
var start = Date.now()
for(var i=0; i<100; ++i) {
  ndgemm(c, a, b)
}
var stop = Date.now()
console.log("ndgemm time: ", stop - start)