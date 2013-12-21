var zeros = require("zeros")
var ops = require("ndarray-ops")
var gemm = require("../gemm.js")

//Create 3 random matrices
var a = zeros([300, 400]) // a is 300 x 400
var b = zeros([400, 500]) // b is 400 x 500
var c = zeros([300, 500]) // c is 300 x 500

ops.random(a)
ops.random(b)
ops.random(c)

//Set c = a * b
gemm(c, a, b)