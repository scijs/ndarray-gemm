"use strict"

var gemm = require("../gemm.js")
var zeros = require("zeros")
var tape = require("tape")
var ops = require("ndarray-ops")

tape("big-matrix", function(t) {

  var a = zeros([100, 200])
  var b = zeros([200, 300])
  var c = zeros([100, 300])

  ops.random(a)
  ops.random(b)
  ops.random(c)

  gemm(c, a, b)

  for(var i=0; i<c.shape[0]; ++i) {
    for(var j=0; j<c.shape[1]; ++j) {
      var r = 0.0
      for(var k=0; k<a.shape[1]; ++k) {
        r += a.get(i,k) * b.get(k,j)
      }
      t.ok(Math.abs(r - c.get(i,j)) < 1e-6, "Checking big product. expect: " + r + " got: " + c.get(i,j))
    }
  }

  t.end()
})

tape("big-matrix-row-column", function(t) {
  var a = zeros([100, 200])
  var b = zeros([300, 200]).transpose(1,0)
  var c = zeros([100, 300])

  ops.random(a)
  ops.random(b)
  ops.random(c)

  gemm(c, a, b)

  for(var i=0; i<c.shape[0]; ++i) {
    for(var j=0; j<c.shape[1]; ++j) {
      var r = 0.0
      for(var k=0; k<a.shape[1]; ++k) {
        r += a.get(i,k) * b.get(k,j)
      }
      t.ok(Math.abs(r - c.get(i,j)) < 1e-6, "Checking big product. expect: " + r + " got: " + c.get(i,j))
    }
  }

  t.end()
})
