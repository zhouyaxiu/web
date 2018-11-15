export {fit}
var pts = []
// var segments = []
function Pter (x, y) {
  this.x = x
  this.y = y
}

function Segment (pt, ctin, ctout) {
  this.pt = pt
  this.ctin = ctin
  this.ctout = ctout
}

function dis (pt1, pt2) {
  return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y))
}

function dot (pt1, pt2) {
  return pt1.x * pt2.x + pt1.y * pt2.y
}

function add (pt1, pt2) {
  var pt = new Pter(0, 0)
  pt.x = pt1.x + pt2.x
  pt.y = pt1.y + pt2.y
  return pt
}

function sub (pt1, pt2) {
  var pt = new Pter(0, 0)
  pt.x = pt1.x - pt2.x
  pt.y = pt1.y - pt2.y
  return pt
}
function normalize (p, dist) {
  var pt = new Pter(0, 0)
  var len = Math.sqrt(p.x * p.x + p.y * p.y)
  if (len === 0) {
    return pt
  }
  pt.x = p.x * dist / len
  pt.y = p.y * dist / len
  return pt
}

function Paramize (pts, first, last) {
  var u = [0]
  for (var i = first + 1; i <= last; i++) {
    u[i - first] = u[i - first - 1] + dis(pts[i], pts[i - 1])
  }
  var m = last - first
  for (i = 1; i <= m; i++) {
    u[i] /= u[m]
  }
  return u
}

function addCurve (segments, curve) {
  var prev = segments[segments.length - 1]
  prev.ctout = sub(curve[1], curve[0])
  var segment = new Segment(curve[3], sub(curve[2], curve[3]), null)
  segments.push(segment)
}

function findRoot (curve, point, u) {
  var curve1 = []
  var curve2 = []
  for (var i = 0; i <= 2; i++) {
    var tmp1 = sub(curve[i + 1], curve[i])
    curve1[i] = new Pter(tmp1.x * 3, tmp1.y * 3)
  }
  for (i = 0; i <= 1; i++) {
    var tmp2 = sub(curve1[i + 1], curve1[i])
    curve2[i] = new Pter(tmp2.x * 2, tmp2.y * 2)
  }
  var pt = evaluate(3, curve, u)
  var pt1 = evaluate(2, curve1, u)
  var pt2 = evaluate(1, curve2, u)
  var diff = sub(pt, point)
  var df = dot(pt1, pt1) + dot(diff, pt2)
  return ((df > 0 - 1e-12) && (df < 1e-12)) ? u : u - dot(diff, pt1) / df
}

function reparamize (pts, first, last, u, curve) {
  for (var i = first; i <= last; i++) {
    u[i - first] = findRoot(curve, pts[i], u[i - first])
  }
  var l = u.length
  for (i = 1; i < l; i++) {
    if (u[i] <= u[i - 1]) {
      return false
    }
  }
  return true
}

function generateBezier (pts, first, last, uPrime, tan1, tan2) {
  var epsilon = 0.00000001
  var abs = Math.abs
  var pt1 = pts[first] // new Pter(pts[first].x, pts[first].y)
  var pt2 = pts[last] // new Pter(pts[last].x, pts[last].y)
  var C = [[0, 0], [0, 0]]
  var X = [0, 0]

  for (var i = 0, l = last - first + 1; i < l; i++) {
    var u = uPrime[i]
    var t = 1 - u
    var b = 3 * u * t
    var b0 = t * t * t
    var b1 = b * t
    var b2 = b * u
    var b3 = u * u * u
    var a1 = normalize(tan1, b1)
    var a2 = normalize(tan2, b2)
    var tmp1 = new Pter((b0 + b1) * pt1.x, (b0 + b1) * pt1.y)
    var tmp2 = new Pter((b2 + b3) * pt2.x, (b2 + b3) * pt2.y)
    var tmp = sub(sub(pts[first + i], tmp1), tmp2)
    C[0][0] += dot(a1, a1)
    C[0][1] += dot(a1, a2)
    C[1][0] = C[0][1]
    C[1][1] += dot(a2, a2)
    X[0] += dot(a1, tmp)
    X[1] += dot(a2, tmp)
  }

  var detC0C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1]
  var alpha1
  var alpha2
  if (abs(detC0C1) > epsilon) {
    var detC0X = C[0][0] * X[1] - C[1][0] * X[0]
    var detXC1 = X[0] * C[1][1] - X[1] * C[0][1]
    alpha1 = detXC1 / detC0C1
    alpha2 = detC0X / detC0C1
  } else {
    var c0 = C[0][0] + C[0][1]
    var c1 = C[1][0] + C[1][1]
    alpha1 = alpha2 = abs(c0) > epsilon ? X[0] / c0 : abs(c1) > epsilon ? X[1] / c1 : 0
  }
  var segLength = dis(pt1, pt2)
  var eps = epsilon * segLength
  var handle1
  var handle2
  if (alpha1 < eps || alpha2 < eps) {
    alpha1 = alpha2 = segLength / 3
  } else {
    var line = sub(pt2, pt1)
    handle1 = normalize(tan1, alpha1)
    handle2 = normalize(tan2, alpha2)
    if (dot(handle1, line) - dot(handle2, line) > segLength * segLength) {
      alpha1 = alpha2 = segLength / 3
      handle1 = handle2 = null
    }
  }
  return [pt1, add(pt1, handle1 || normalize(tan1, alpha1)), add(pt2, handle2 || normalize(tan2, alpha2)), pt2]
}

function evaluate (degree, curve, t) {
  var tmp = []
  for (var i = 0; i < curve.length; i++) {
    var newpt = new Pter(curve[i].x, curve[i].y)
    tmp.push(newpt)
  }
  // var tmp = curve.slice()
  for (i = 1; i <= degree; i++) {
    for (var j = 0; j <= degree - i; j++) {
      tmp[j].x = (tmp[j].x * (1 - t) + tmp[j + 1].x * t)
      tmp[j].y = (tmp[j].y * (1 - t) + tmp[j + 1].y * t)
    }
  }
  return tmp[0]
}

function findMaxError (pts, first, last, curve, u) {
  var index = Math.floor((last - first + 1) / 2)
  var maxDist = 0
  for (var i = first + 1; i < last; i++) {
    var P = evaluate(3, curve, u[i - first])
    var v = sub(P, pts[i])
    var dist = v.x * v.x + v.y * v.y
    if (dist >= maxDist) {
      maxDist = dist
      index = i
    }
  }
  return {
    error: maxDist,
    index: index
  }
}

function fitBezier (segments, pts, first, last, error, tan1, tan2) {
  if (last - first === 1) {
    var pt1 = pts[first]
    var pt2 = pts[last]
    var dist = dis(pt1, pt2) / 3
    addCurve(segments, [pt1, add(pt1, normalize(tan1, dist)), add(pt2, normalize(tan2, dist)), pt2])
    return
  }
  var uPrime = Paramize(pts, first, last)
  var maxError = Math.max(error, error * error)
  var split
  var paramInOrder = true
  for (var i = 0; i <= 4; i++) {
    var curve = generateBezier(pts, first, last, uPrime, tan1, tan2)
    var max = findMaxError(pts, first, last, curve, uPrime)
    if (max.error < error && paramInOrder) {
      addCurve(segments, curve)
      return
    }
    split = max.index
    if (max.error >= maxError) {
      break
    }
    paramInOrder = reparamize(pts, first, last, uPrime, curve)
    maxError = max.error
  }
  var tanCenter = sub(pts[split - 1], pts[split + 1])
  fitBezier(segments, pts, first, split, error, tan1, tanCenter)
  var tanCenterINTE = new Pter(0 - tanCenter.x, 0 - tanCenter.y)
  fitBezier(segments, pts, split, last, error, tanCenterINTE, tan2)
}

function fit (polygon, error) {
  pts = []
  for (var i = 0; i < polygon.length; i++) {
    let pt = new Pter(polygon[i].x, polygon[i].y)
    pts.push(pt)
  }
  var length = pts.length
  var segments = []
  if (length > 0) {
    var segment = new Segment(pts[0], null, null)
    segments.push(segment)
    if (length > 1) {
      fitBezier(segments, pts, 0, length - 1, error, sub(pts[1], pts[0]), sub(pts[length - 2], pts[length - 1]))
    }
  }
  return segments
}
