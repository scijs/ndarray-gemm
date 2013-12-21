"use strict"

var BLOCK_SIZE = 64

function unpackShape(name, type) {
  if(type[0] === "native") {
    return [
      name, "r=", name, ".length,",
      name, "c=", name, "[0].length,"
    ].join("")
  } else {
    return [
      name, "d0=", name, ".shape[0],",
      name, "d1=", name, ".shape[1],",
      name, "s0=", name, ".stride[0],",
      name, "s1=", name, ".stride[1],",
      name, "o=", name, ".offset,",
      name, "d=", name, ".data,"
    ].join("")
  }
}

function start(order, name, type, i, j, w) {
  var code = []
  if(type[1] === "native") {
    if(order[0] === 0) {
      code.push("var ", name, "p=", name, "d[", (!!i ? i : "0"), "];")
    }
  } else {
    if(i && j) {
      code.push(
        "var ", name, "t0=", name, "s", order[0], ",",
                name, "t1=", name, "s", order[1], "-", name, "s", order[0], "*", name, "d", order[0],
                name, "p=", name, "o+", i, "*", name, "s0+", j, "*", name, "s1;")
    } else {
      code.push(
        "var ", name, "t0=", name, "s", order[0], ",",
                name, "t1=", name, "s", order[1], "-", name, "s", order[0], "*", name, "d", order[0],
                name, "p=", name, "o;")
    }
  }
  return code
}

function walk(order, name, type, d, i) {
  var code = []
  if(type[1] === "native") {
    if(order[0] === 0 && d === 1) {
      code.push(name, "p=", name, "d[", i, "]")
    }
  } else {
    code.push(name, "p+=", name, "t", d, ";")
  }
  return code
}

function write(order, name, type, i, j, w) {
  var code = []
  if(type[1] === "native") {
    if(order[0] === 0) {
      code.push(name, "p[", j, "]=", w, ";")
    } else {
      code.push(name, "d[", i, "][", j, "]=", w, ";")
    }
  } else if(type[1] === "generic") {
    code.push(name, "d.set(", name, "p,", w, ");")
  } else {
    code.push(name, "d[", name, "p]=", w, ";")
  }
  return code
}

function read(order, name, type, i, j) {
  var code = []
  if(type[1] === "native") {
    if(order[0] === 0) {
      code.push(name, "p[", j, "]")
    } else {
      code.push(name, "d[", i, "][", j, "]")
    }
  } else if(type[1] === "generic") {
    code.push(name, "d.get(", name, "p)")
  } else {
    code.push(name, "d[", name, "p]")
  }
  return code.join("")
}

function generateRowColumnLoop(oType, aType, bType, useAlpha, useBeta) {
  var code = []
  var oOrd = otype === "r" ? [0,1] : [1,0], aOrd = [0, 1], bOrd = [1, 0]
  var symbols = ["i", "j"]

  code.push.apply(start(oOrd, "o", oType))
  code.push.apply(start(aOrd, "a", aType))
  code.push.apply(start(bOrd, "b", bType))

  if(oOrd[0]) {
    code.push("for(j=0;j<od1;++j){")
    code.push("for(i=0;i<od0;++i){")
  } else {
    code.push("for(i=0;i<od0;++i){")
    code.push("for(j=0;j<od1;++j){")
    symbols = ["j", "i"]
  }

  code.push(
      "var r=0.0;",
      "for(k=0;k<ad1;++k){",
      "r+=", 
        read(aOrd, "a", aType, "i", "k"), "*", 
        read(bOrd, "b", bType, "k", "j"), ";")

  //Terminate k loop
  code.push.apply(code, walk(aOrd, "a", aType, 1, "k"))
  code.push.apply(code, walk(bOrd, "b", bType, 0, "k"))
  code.push("}")

  //Write r to output
  if(useAlpha) {
    code.push("r*=A;")
  }
  if(useBeta) {
    code.push("r+=B*", read(oOrd, "o", oType, "i", "j"), ";")
  }
  code.push.apply(code, write(oOrd, "o", oType, "i", "j", "r"))
  
  //Terminate outer loop
  if(oOrd[0]) {
    code.push.apply(code, walk(aOrd, "a", aType, 0, "i"))
  } else {
    code.push.apply(code, walk(bOrd, "b", bType, 1, "j"))
  }
  code.push.apply(code, walk(oOrd, "o", oType, oOrd[1], symbols[oOrd[1]]))
  code.push("}")

  //Terminate inner loop
  if(oOrd[0]) {
    code.push.apply(code, walk(bOrd, "b", bType, 1, "j"))
  } else {
    code.push.apply(code, walk(aOrd, "a", aType, 0, "i"))
  }
  code.push.apply(code, walk(oOrd, "o", oType, oOrd[0], symbols[oOrd[0]]))
  code.push("}")

  return code
}

function generateColumnRowLoop() {
  var code = []

  //Do pass over output to zero it out
  code.push.apply(code, generateBetaPass(oType, useBeta))

  return code[]
}

function generateBetaPass(oType, useBeta) {

}

function generateBlockLoop(oType, aType, bType, useAlpha, useBeta) {
  var code = []
  var shapes = [ "od0", "od1", "ad0" ]

  //Do pass over output to zero it out
  code.push.apply(code, generateBetaPass(oType, useBeta))

  for(var i=0; i<3; ++i) {
    code.push(
      "for(var i", i, "=", shapes[i], ";i", i, ">0;){",
        "var w", i, "=", BLOCK_SIZE, ";",
        "if(i", i, "<", BLOCK_SIZE, "){",
          "w", i, "=i", i, ";",
          "i", i, "=0;",
        "}else{",
          "i", i, "-=", BLOCK_SIZE, ";",
        "}")
  }

  code.push.apply(code, start(oOrd, "o", oType, "i0", "i1", "w1"))
  code.push.apply(code, start(aOrd, "a", aType, "i0", "i2", "w2"))
  code.push.apply(code, start(bOrd, "b", bType, "i2", "i1", "w2"))

  code.push(
    "for(i=0;i<w0;++i){\
for(j=0;j<w1;++j){\
var r=0.0;\
for(k=0;k<w2;++k){")

  code.push("r+=", read(aOrd, "a", aType, "i", "k"), "*", read(bOrd, "b", bType, "k", "j"), ";")

  //Close off k-loop
  code.push.apply(code, walk(aOrd, "a", aType, 1, "k"))
  code.push.apply(code, walk(bOrd, "b", bType, 0, "k"))
  code.push("}")

  //Write r back to output array
  if(useAlpha) {
    code.push("r*=A;")
  }
  code.push("r+=", read(oOrd, "o", oType, "i", "j"), ";")
  code.push.apply(code, write(oOrd, "o", oType, "i", "j", "r"))

  //Close off j-loop
  code.push.apply(code, walk(bOrd, "b", bType, 1, "j"))
  code.push.apply(code, walk(oOrd, "o", oType, 1, "j"))
  code.push("}")

  //Close off i-loop
  code.push.apply(code, walk(aOrd, "a", aType, 0, "i"))
  code.push.apply(code, walk(oOrd, "o", oType, 0, "i"))
  code.push("}}}}")

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
            "i,j,k;"
  ]

  if(aType === "r" && bType === "c") {
    code.push.apply(code, generateRowColumnLoop(outType, aType, bType, useAlpha, useBeta))
  } else if(aType === "c" && bType === "r") {
    code.push.apply(code, generateColumnRowLoop(outType, aType, bType, useAlpha, useBeta))
  } else {
    code.push.apply(code, generateBlockLoop(outType, aType, bType, useAlpha, useBeta))
  }

  code.push("}return ", funcName)

  //Compile function
  var proc = new Function(code.join(""))
  return proc()
}