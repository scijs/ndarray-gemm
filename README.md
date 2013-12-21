ndgemm
======
[General matrix multiply](http://en.wikipedia.org/wiki/General_Matrix_Multiply) for [ndarrays](https://github.com/mikolalysenko/ndarray).  This is analogous to the [BLAS level 3](http://en.wikipedia.org/wiki/Basic_Linear_Algebra_Subprograms) routine xGEMM.

WORK IN PROGRESS

# Example

```javascript
var zeros = require("zeros")


```

# Install

    npm install ndgemm

# API

### `require("ndgemm")(c, a, b[, alpha, beta])`
Computes a generalized matrix multiplication.  This sets:

```javascript
c = alpha * a * b + beta * c
```

* `c` is a `[n,m]` shape ndarray
* `a` is a `[n,p]` shape ndarray
* `b` is a `[p,m]` shape ndarray
* `alpha` is a scalar weight which is applied to the product `a * b`
* `beta` is a scalar weight applied to `c` when added back in

## Credits
(c) 2013 Mikola Lysenko. MIT License