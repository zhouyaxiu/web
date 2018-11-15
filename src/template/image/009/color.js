export {GetColor}

var Tables = []
var thresholds = []
var ratios = []
var TABLE = {'name': 'Grayscale', 'data': [[0, 0, 0, 0], [1, 1, 1, 1]]}
Tables.push(TABLE)
TABLE = {'name': 'Spectrum',
  'data': [[0, 0, 0, 0], [0.1, 0, 0, 1], [0.33, 0, 1, 1],
    [0.5, 0, 1, 0], [0.66, 1, 1, 0], [0.9, 1, 0, 0], [1, 1, 1, 1]]}
Tables.push(TABLE)
TABLE = {'name': 'Overlay (Positives)', 'data': [[0, 1, 0, 0], [1, 1, 1, 0]]}
Tables.push(TABLE)
TABLE = {'name': 'Overlay (Negatives)', 'data': [[0, 0, 0, 1], [1, 0, 1, 0]]}
Tables.push(TABLE)
TABLE = {'name': 'Hot-and-Cold',
  'data': [[0, 0, 0, 1], [0.15, 0, 1, 1],
    [0.3, 0, 1, 0], [0.45, 0, 0, 0], [0.5, 0, 0, 0], [0.55, 0, 0, 0], [0.7, 1, 1, 0], [0.85, 1, 0, 0], [1, 1, 1, 1]]}
Tables.push(TABLE)
TABLE = {'name': 'Gold',
  'data': [[0, 0, 0, 0], [0.13, 0.19, 0.03, 0],
    [0.25, 0.39, 0.12, 0], [0.38, 0.59, 0.26, 0], [0.50, 0.80, 0.46, 0.08], [0.63, 0.99, 0.71, 0.21],
    [0.75, 0.99, 0.88, 0.34], [0.88, 0.99, 0.99, 0.48], [1, 0.90, 0.95, 0.61]]}
Tables.push(TABLE)
TABLE = {'name': 'Red Overlay',
  'data': [[0, 0.75, 0, 0], [0.5, 1, 0.5, 0],
    [0.95, 1, 1, 0], [1, 1, 1, 1]]}
Tables.push(TABLE)
TABLE = {'name': 'Green Overlay',
  'data': [[0, 0, 0.75, 0], [0.5, 0.5, 1, 0],
    [0.95, 1, 1, 0], [1, 1, 1, 1]]}
Tables.push(TABLE)
TABLE = {'name': 'Blue Overlay',
  'data': [[0, 0, 0, 1], [0.5, 0, 0.5, 1],
    [0.95, 0, 1, 1], [1, 1, 1, 1]]}
Tables.push(TABLE)
TABLE = {'name': 'Spectrum',
  'data': [[0, 1, 0, 0], [0.5, 0, 1, 0], [1, 0, 0, 1]],
  'gradation': true}
Tables.push(TABLE)
TABLE = {'name': 'Fire',
  'data': [[0, 0, 0, 0], [0.06, 0, 0, 0.36], [0.16, 0.29, 0, 0.75],
    [0.22, 0.48, 0, 0.89], [0.31, 0.68, 0, 0.6], [0.37, 0.76, 0, 0.36], [0.5, 0.94, 0.31, 0], [0.56, 1, 0.45, 0],
    [0.81, 1, 0.91, 0], [0.88, 1, 1, 0.38], [1, 1, 1, 1]]}
Tables.push(TABLE)

function GetLutByName (name) {
  for (var i = 0; i < Tables.length; i++) {
    if (Tables[i]['name'] === name) {
      return Tables[i]['data']
    }
  }
  return null
}

function GetKnot (min, max, lut) {
  var thresholds = []
  var ratios = []
  var len = max - min
  for (var i = 0; i < lut.length; i++) {
    thresholds.push(len * lut[i][0] + min)
  }
  for (i = 0; i < thresholds.length - 1; i++) {
    ratios.push(255 / (thresholds[i + 1] - thresholds[i]))
  }
  return {
    thresholds: thresholds,
    ratios: ratios
  }
}

function GetColor (min, max, colortable) {
  var lut = GetLutByName(colortable)
  var r, g, b
  // var lut = []
  // for (var i = 0; i < Tables.length; i++) {
  //   lut.push(Tables[i]['data'])
  // }
  var LUT_C = []
  var res = GetKnot(min, max, lut)
  thresholds = res.thresholds
  ratios = res.ratios
  for (var n = -2048; n < 2048; n++) {
    var co = {r: 0, g: 0, b: 0}
    for (var i = 0; i < thresholds.length; i++) {
      if (n <= -1278) {
        r = lut[0][1] * 255
        g = lut[0][2] * 255
        b = lut[0][3] * 255
        break
      }
      if (n >= 502) {
        r = lut[lut.length - 1][1] * 255
        g = lut[lut.length - 1][2] * 255
        b = lut[lut.length - 1][3] * 255
        break
      }
      if (n > thresholds[i] && n <= thresholds[i + 1]) {
        var value = (n - thresholds[i]) * ratios[i] / 255
        r = Math.round(((1 - value) * lut[i][1] + value * lut[i + 1][1]) * 255)
        g = Math.round(((1 - value) * lut[i][2] + value * lut[i + 1][2]) * 255)
        b = Math.round(((1 - value) * lut[i][3] + value * lut[i + 1][3]) * 255)
        break
      }
    }
    co.r = r
    co.g = g
    co.b = b
    LUT_C.push(co)
  }
  return LUT_C
}
