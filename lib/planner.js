"use strict"


function unpackShape(name, type) {
  if(type[0] === "native") {
    return [
      name, "r=", name, ".length,",
      name, "c=", name, "[0].length,"
    ].join("")
  } else {
    return [
      name, "r=", name, ".shape[0],",
      name, "c=", name, ".shape[1],",
      name, "sr=", name, ".stride[0],",
      name, "sc=", name, ".stride[1],",
      name, "o=", name, ".offset,",
      name, "d=", name, ".data,"
    ].join("")
  }
}

function generateRowColumnLoop(outType, aType, bType, useAlpha, useBeta) {
  var code = []

  return code
}


function generateBlockedLoop(outType, aType, bType, useAlpha, useBeta) {
  var code = []
  return code
}

function generateMatrixProduct(outType, aType, bType, useAlpha, useBeta) {
  var funcName = ["gemm", outType[0], outType[1], 
                     "a", aType[0], aType[1],
                     "b", bType[0], bType[1],
                     useAlpha ? "alpha" : "",
                     useBeta ? "beta" : "" ].join("")
  var code = [
    "function ", funcName, "(o,a,b,A,B){",
    "var ", unpackShape("o", outType), 
            unpackShape("a", aType),
            unpackShape("b", bType),
            "i,j,k"
  ]

  if(aType === "r" && bType === "c") {
    code.push.apply(code, generateRowColumnLoop(outType, aType, bType, useAlpha, useBeta))
  } else {
    code.push.apply(code, generateBlockedLoop(outType, aType, bType, useAlpha, useBeta))
  }

  code.push("}return ", funcName)

  //Compile function
  var proc = new Function(code.join(""))
  return proc()
}