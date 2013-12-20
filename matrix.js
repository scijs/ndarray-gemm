"use strict"

module.exports = matrixProduct

var generatePlan = require("./lib/planner.js")

function classifyShape(m) {
  if(Array.isArray(m)) {
    if(Array.isArray(m)) {
      return [ "r", "native" ]
    }
  } else if(m.shape.length === 2) {
    if(m.order[0]) {
      return [ "r", m.dtype ]
    } else {
      return [ "c", m.dtype ]
    }
  }
  throw new Error("Unrecognized data type")
}

var CACHE = {}

function matrixProduct(out, a, b, alpha, beta) {
  if(alpha === undefined) {
    alpha = 1.0
  }
  if(beta === undefined) {
    beta = 0.0
  }
  var useAlpha = (alpha !== 1.0)
  var useBeta  = (beta !== 0.0)
  var outType  = classifyType(out)
  var aType    = classifyType(a)
  var bType    = classifyType(b)
  var typeSig  = [ outType, aType, bType, useAlpha, useBeta ].join(":")
  var proc     = CACHE[typeSig]
  if(!proc) {
    proc = CACHE[typeSig] = generatePlan(outType, aType, bType, useAlpha, useBeta)
  }
  return proc(out, a, b, alpha, beta)
}