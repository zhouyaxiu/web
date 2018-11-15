export {
  // Set,
  GetPolygon,
  GetPolygons,
  GetPolygoni,
  Draw,
  CanvasClick,
  Drag,
  IsPointInPath,
  Complete,
  Delpt,
  Delset,
  Undo,
  GetResult,
  Clear,
  CursorStyle,
  Polygoner,
  LoadPolygons
}

var polygon = []
var polygons = []

function GetPolygon () {
  return polygon
}

function GetPolygons () {
  return polygons
}

function LoadPolygons (pts) {
  polygons = pts
}

function GetPolygoni (i) {
  if (i > -1 && i < polygons.length) {
    return polygons[i]
  } else if (i < 0 && polygons.length + i >= 0) {
    return polygons[polygons.length + i]
  } else {
    return null
  }
}

function Pointer (x, y) {
  this.x = x
  this.y = y
}

function dis (x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

function Polygoner (pointset, color, flag) {
  this.pointset = pointset
  this.color = color
  this.flag = flag
}

function IsPointOnPath (x, y, radius) {
  for (var k = 0; k < polygon.length; k++) {
    if (dis(x, y, polygon[k].x, polygon[k].y) < radius) {
      return {
        selectset: -1,
        selectpt: k
      }
    }
  }
  for (var i = 0; i < polygons.length; i++) {
    for (var j = 0; j < polygons[i].pointset.length; j++) {
      if (dis(x, y, polygons[i].pointset[j].x, polygons[i].pointset[j].y) < radius) {
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

function IsPointInPath (ctx, x, y, pointset) {
  ctx.beginPath()
  ctx.moveTo(pointset[0].x, pointset[0].y)
  for (var i = 1; i < pointset.length; i++) {
    ctx.lineTo(pointset[i].x, pointset[i].y)
  }
  ctx.closePath()
  return ctx.isPointInPath(x, y)
}

function Draw (ctx, pointset, strokestyle, fillstyle, selpt, selsty, radius, linewidth, flag) {
  if (pointset.length < 1) {
    return
  }
  for (var i = 0; i < pointset.length; i++) {
    ctx.beginPath()
    if (selpt === i) {
      ctx.fillStyle = selsty
      ctx.strokeStyle = selsty
    } else {
      ctx.fillStyle = strokestyle
      ctx.strokeStyle = strokestyle
    }
    ctx.arc(pointset[i].x, pointset[i].y, radius, 0, 2 * Math.PI)
    ctx.save()
    ctx.globalAlpha = 1
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
  ctx.beginPath()
  ctx.strokeStyle = strokestyle
  ctx.fillStyle = fillstyle
  ctx.lineWidth = linewidth
  ctx.moveTo(pointset[0].x, pointset[0].y)
  for (i = 1; i < pointset.length; i++) {
    ctx.lineTo(pointset[i].x, pointset[i].y)
  }
  if (flag) {
    ctx.closePath()
  }
  ctx.save()
  ctx.globalAlpha = 1
  ctx.stroke()
  ctx.restore()
  if (linewidth < 0) {
    ctx.fill()
  }
}
// 点击触发事件 1. 移动点 2.添加点
function CanvasClick (x, y, radius) {
  var res = IsPointOnPath(x, y, radius)
  var i = res.selectset
  var j = res.selectpt
  var point = null
  if (j === -1) {
    point = new Pointer(x, y)
    polygon.push(point)
    point = null
  }
  return {
    selectset: i,
    selectpt: j
  }
}

function Drag (x, y, res) {
  var i = res.selectset
  var j = res.selectpt
  if (j > -1) {
    if (i > -1) {
      polygons[i].pointset[j].x = x
      polygons[i].pointset[j].y = y
    } else {
      polygon[j].x = x
      polygon[j].y = y
    }
  }
}

function Complete (color, flag) {
  var len1 = polygon.length
  if (len1 > 0) {
    var newpolygon = new Polygoner(polygon, color, flag)
    polygons.push(newpolygon)
    polygon = []
  }
  return len1
}

function Delpt (res) {
  var i = res.selectset
  var j = res.selectpt
  if (j > -1) {
    if (i > -1) {
      var sept = polygons[i].pointset
      if (sept.length < 2) {
        polygons.splice(i, 1)
        return 0
      }
    } else {
      sept = polygon
    }
    sept.splice(i, 1)
  }
  return -1
}

function Delset (res) {
  var i = res.selectset
  if (i < 0) {
    polygon = []
  } else {
    polygons.splice(i, 1)
  }
}
function Undo () {
  if (polygon.length > 0) {
    polygon.pop()
  }
}

function GetResult (rate) {
  var res = []
  for (var i = 0; i < polygons.length; i++) {
    var ptset = []
    for (var j = 0; j < polygons[i].pointset.length; j++) {
      var newpt = new Pointer(polygons[i].pointset[j].x * rate, polygons[i].pointset[j].y * rate)
      ptset.push(newpt)
    }
    var newptset = new Polygoner(ptset, polygons[i].color)
    res.push(newptset)
  }
  return res
}

function Clear () {
  polygons = []
  polygon = []
}
