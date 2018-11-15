import * as FIT from './pathfit.js'

export {
  CanvasClick,
  Drag,
  StopDrag,
  Getpoints,
  GetBezierline,
  GetBezierlines,
  GetSplinei,
  Complete,
  Undo,
  Delpt,
  Delset,
  CursorStyle,
  Clear,
  LoadSplines,
  Loadpoints
}

var points = []
var bezierline = []
var segments = []
var bezierlines = []

function Pointer (x, y) {
  this.x = x
  this.y = y
}

function Bezierliner (pointset, color, flag) {
  this.pointset = pointset
  this.color = color
  this.flag = flag
}

function Getpoints () {
  return points
}

function Loadpoints (pts) {
  points = pts
}

function GetSplinei (i) {
  if (i > -1 && i < bezierlines.length) {
    return bezierlines[i]
  } else if (i < 0 && i + bezierlines.length >= 0) {
    return bezierlines[i + bezierlines.length]
  } else {
    return null
  }
}

function GetBezierlines () {
  return bezierlines
}
function GetBezierline () {
  var bezierline = []
  for (var i = 0; i < segments.length; i++) {
    var newppp2 = new Pointer(segments[i].pt.x, segments[i].pt.y)
    bezierline.push(newppp2)
    if (i !== segments.length - 1) {
      var newppp1 = new Pointer(segments[i].pt.x + segments[i].ctout.x, segments[i].pt.y + segments[i].ctout.y)
      bezierline.push(newppp1)
    }
    if (i !== segments.length - 1) {
      var newppp3 = new Pointer(segments[i + 1].pt.x + segments[i + 1].ctin.x, segments[i + 1].pt.y + segments[i + 1].ctin.y)
      bezierline.push(newppp3)
    }
  }
  return bezierline
}

function LoadSplines (pts) {
  bezierlines = pts
}

function Dis (x, y, x1, y1) {
  return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1))
}

function IsPointOnPath (x, y, radius) {
  for (var k = 0; k < bezierline.length; k++) {
    if (Dis(x, y, bezierline[k].x, bezierline[k].y) < radius) {
      return {
        selectset: -1,
        selectpt: k
      }
    }
  }
  for (var i = 0; i < bezierlines.length; i++) {
    for (var j = 0; j < bezierlines[i]['pointset'].length; j++) {
      if (Dis(x, y, bezierlines[i]['pointset'][j].x, bezierlines[i]['pointset'][j].y) < radius) {
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

function CanvasClick (x, y, radius) {
  var res = IsPointOnPath(x, y, radius)
  var point = null
  if (res.selectpt < 0) {
    point = new Pointer(x, y)
  }
  return {
    selectset: res.selectset,
    selectpt: res.selectpt,
    point: point
  }
}

function Drag (x, y, res) {
  var i = res.selectset
  var j = res.selectpt
  if (j > -1) {
    if (i < 0) {
      // nothing
    } else {
      bezierlines[i]['pointset'][j].x = x
      bezierlines[i]['pointset'][j].y = y
    }
  } else {
    res.point = null
    var point = new Pointer(x, y)
    points.push(point)
  }
}

function StopDrag (res) {
  if (res === null) {
    return
  }
  if (res.point !== null) {
    points.push(res.point)
  }
  segments = FIT.fit(points, 0.5)
  bezierline = GetBezierline()
}

function Complete (color, flag) {
  var len1 = points.length
  if (points.length > 0) {
    if (flag) {
      points.push(points[0])
      segments = FIT.fit(points, 0.5)
      var ptset = GetBezierline()
      // 弹出重复入栈的末尾点（起止点重合）
      ptset.pop()
    } else {
      segments = FIT.fit(points, 0.5)
      ptset = GetBezierline()
    }
    var newbezierline = new Bezierliner(ptset, color, flag)
    bezierlines.push(newbezierline)
    points = []
    bezierline = []
    segments = []
  }
  return len1
}

function Undo () {
  if (points.length > 0) {
    points.pop()
  }
  segments = FIT.fit(points, 0.5)
  bezierline = GetBezierline()
}

function Clear () {
  segments = []
  points = []
  bezierline = []
  bezierlines = []
}

function Delpt (res) {
  var i = res.selectset
  var j = res.selectpt
  if (j > -1 && j % 3 === 0) {
    if (i > -1) {
      var sept = bezierlines[i].pointset
      if (sept.length < 4) {
        bezierlines.splice(i, 1)
        return 0
      }
    } else {
      sept = bezierline
      if (sept.length < 4) {
        bezierline = []
        return -1
      }
    }
    var len1 = sept.length
    // 闭合曲线
    if (len1 % 3 === 0) {
      if (j === 0) {
        sept.splice(0, 2)
        sept.pop()
        return -1
      }
    } else {
      if (j === 0) {
        sept.splice(0, 3)
        return -1
      }
      if (j === len1 - 1) {
        sept.splice(j - 2, 3)
        return -1
      }
    }
    sept.splice(j - 1, 3)
  }
  return -1
}

function Delset (res) {
  var i = res.selectset
  if (i < 0) {
    bezierline = []
  } else {
    bezierlines.splice(i, 1)
  }
}
