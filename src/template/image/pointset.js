export {
  Set,
  GetPoints,
  GetPointsets,
  GetPointseti,
  Draw,
  CanvasClick,
  Drag,
  Complete,
  Delpt,
  Delset,
  GetResult,
  PTseter,
  Clear,
  LoadPTs,
  Undo,
  CursorStyle
}

var points = []
var pointsets = []
function GetPoints () {
  return points
}
function GetPointsets () {
  return pointsets
}
function LoadPTs (pts) {
  pointsets = pts
}
function GetPointseti (i) {
  if (i > -1 && i < pointsets.length) {
    return pointsets[i]
  } else if (i < 0 && i + pointsets.length >= 0) {
    return pointsets[i + pointsets.length]
  } else {
    return null
  }
}

function PTer (x, y, index) {
  this.x = x
  this.y = y
  this.index = index
}

function PTseter (pointset, color) {
  this.pointset = pointset
  this.color = color
}

function Draw (ctx, pointset, color, selectpt, selectcolor, radius, scalei) {
  if (pointset.length < 1) {
    return
  }
  for (var i = 0; i < pointset.length; i++) {
    ctx.beginPath()
    if (i === selectpt) {
      ctx.fillStyle = selectcolor
      ctx.strokeStyle = selectcolor
      ctx.arc(pointset[i].x * scalei, pointset[i].y * scalei, radius, 0, 2 * Math.PI)
    } else {
      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.arc(pointset[i].x * scalei, pointset[i].y * scalei, radius, 0, 2 * Math.PI)
    }
    ctx.fill()
    ctx.stroke()
  }
}

function dis (x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

function IsPointOnPath (x, y, radius) {
  for (var k = 0; k < points.length; k++) {
    if (dis(x, y, points[k].x, points[k].y) < radius) {
      return {
        selectset: -1,
        selectpt: k
      }
    }
  }
  for (var i = 0; i < pointsets.length; i++) {
    for (var j = 0; j < pointsets[i].pointset.length; j++) {
      if (dis(x, y, pointsets[i].pointset[j].x, pointsets[i].pointset[j].y) < radius) {
        return {
          selectset: i,
          selectpt: j
        }
      }
    }
  }
  return {
    selectset: -1,
    selectpt: -1
  }
}

function CursorStyle (x, y, radius) {
  var res = IsPointOnPath(x, y, radius)
  if (res.selectpt > -1) {
    return 'auto'
  } else {
    return 'crosshair'
  }
}

// 依据点击位置触发点击模式 1.移动点 2.添加点
function CanvasClick (x, y, radius, index) {
  var res = IsPointOnPath(x, y, radius)
  var i = res.selectset
  var j = res.selectpt
  var point = null
  // 选中点 j
  if (j < 0) {
    point = new PTer(x, y, index)
    points.push(point)
    point = null
    // 未选中任何点 i=-1
  }
  return {
    selectset: i,
    selectpt: j,
    point: point
  }
}

function Drag (x, y, res) {
  var i = res.selectset
  var j = res.selectpt
  if (j > -1) {
    if (i > -1) {
      pointsets[i].pointset[j].x = x
      pointsets[i].pointset[j].y = y
    } else {
      points[j].x = x
      points[j].y = y
    }
  }
}

function Complete (color) {
  var len1 = points.length
  if (len1 > 0) {
    var newsets = new PTseter(points, color)
    pointsets.push(newsets)
    points = []
  }
  return len1
}

function Delpt (res) {
  var i = res.selectset
  var j = res.selectpt
  if (j > -1) {
    if (i > -1) {
      var sept = pointsets[i].pointset
      if (sept.length < 2) {
        pointsets.splice(i, 1)
        return 0
      }
    } else {
      sept = points
    }
    sept.splice(j, 1)
  }
  return -1
}

function Delset (res) {
  var i = res.selectset
  if (i < 0) {
    points = []
  } else {
    pointsets.splice(i, 1)
  }
}

function Undo () {
  if (points.length > 0) {
    points.pop()
  }
}

function GetResult (rate) {
  var res = []
  for (var i = 0; i < pointsets.length; i++) {
    var ptset = []
    for (var j = 0; j < pointsets[i].pointset.length; j++) {
      var newpt = new PTer(pointsets[i].pointset[j].x * rate, pointsets[i].pointset[j].y * rate, pointsets[i].pointset[j].index)
      ptset.push(newpt)
    }
    var newptset = new PTseter(ptset, pointsets[i].color)
    res.push(newptset)
  }
  return res
}

function Clear () {
  points = []
  pointsets = []
}
