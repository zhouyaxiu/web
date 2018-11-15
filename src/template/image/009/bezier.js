export {
  Set,
  GetBezierline,
  GetBezierlines,
  Draw,
  CanvasClick,
  Drag,
  Complete,
  Delpt,
  Delset,
  Undo,
  GetResult,
  CursorStyle,
  Clear,
  IsPointOnStroke,
  Bezierliner,
  LoadBezierlines,
  GetBezierlinei
}

var bezierline = []
var bezierlines = []

function GetBezierline () {
  return bezierline
}

function GetBezierlines () {
  return bezierlines
}

function GetBezierlinei (i) {
  if (i > -1 && i < bezierlines.length) {
    return bezierlines[i]
  } else if (i < 0 && i + bezierlines.length >= 0) {
    return bezierlines[i + bezierlines.length]
  } else {
    return null
  }
}

function LoadBezierlines (pts) {
  bezierlines = pts
}

function dis (x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

function Pointer (x, y) {
  this.x = x
  this.y = y
}

function Bezierliner (pointset, color, flag) {
  this.pointset = pointset
  this.color = color
  this.flag = flag
}

function IsPointOnStroke (ctx, x, y, lefti, topi, scalei) {
  if (bezierline.length < 3) {
    return
  }
  ctx.beginPath()
  ctx.moveTo(bezierline[0].x, bezierline[0].y)
  for (var k = 1; k < bezierline.length - 3; k = k + 3) {
    ctx.bezierCurveTo(bezierline[k].x, bezierline[k].y, bezierline[k + 1].x, bezierline[k + 1].y, bezierline[k + 2].x, bezierline[k + 2].y)
  }
  ctx.closePath()
  if (ctx.isPointInStroke(x, y)) {
    ctx.beginPath()
    ctx.arc((x + lefti) / scalei, (y + topi) / scalei, 7, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()
    ctx.closePath()
  }
}

function IsPointOnPath (x, y, radius) {
  for (var k = 0; k < bezierline.length; k++) {
    if (dis(x, y, bezierline[k].x, bezierline[k].y) < radius) {
      return {
        selectset: -1,
        selectpt: k
      }
    }
  }
  for (var i = 0; i < bezierlines.length; i++) {
    for (var j = 0; j < bezierlines[i].pointset.length; j++) {
      if (dis(x, y, bezierlines[i].pointset[j].x, bezierlines[i].pointset[j].y) < radius) {
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

function Draw (ctx, pointset, strokestyle, fillstyle, radius, linewidth, num, colorpt) {
  if (pointset.length < 1) {
    return
  }
  ctx.lineWidth = linewidth
  var ptnum = -1
  for (var i = 0; i < pointset.length; i = i + 3) {
    ctx.beginPath()
    ctx.strokeStyle = strokestyle
    ctx.fillStyle = strokestyle
    ctx.arc(pointset[i].x, pointset[i].y, radius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()
    // console.log(num, i, ptnum)
    if ((num > -1 && Math.abs(i - num) < 2) || (i === 0 && num === pointset.length - 1 && pointset.length % 3 === 0)) {
      if (num === pointset.length - 1 && pointset.length % 3 === 0) {
        ptnum = 0
      } else {
        ptnum = i
      }
      // 非闭合曲线，首点无入控制线
      if (i - 1 > 0) {
        ctx.beginPath()
        ctx.fillStyle = colorpt
        ctx.strokeStyle = colorpt
        ctx.arc(pointset[i - 1].x, pointset[i - 1].y, radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
      }
      // 闭合曲线的首点
      if (ptnum === 0 && pointset.length % 3 === 0) {
        ctx.beginPath()
        ctx.fillStyle = colorpt
        ctx.strokeStyle = colorpt
        ctx.arc(pointset[pointset.length - 1].x, pointset[pointset.length - 1].y, radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
      }
      if (i + 1 < pointset.length) {
        ctx.beginPath()
        ctx.fillStyle = colorpt
        ctx.strokeStyle = colorpt
        ctx.arc(pointset[i + 1].x, pointset[i + 1].y, radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fill()
      }
    }
  }
  // 若选中某一点则绘制相关控制线
  if (ptnum > -1) {
    ctx.beginPath()
    ctx.strokeStyle = colorpt
    ctx.fillStyle = fillstyle
    ctx.setLineDash([4, 2])
    if (ptnum - 1 > -1) {
      ctx.moveTo(pointset[ptnum].x, pointset[ptnum].y)
      ctx.lineTo(pointset[ptnum - 1].x, pointset[ptnum - 1].y)
    } else if (pointset.length % 3 === 0) {
      ctx.moveTo(pointset[0].x, pointset[0].y)
      ctx.lineTo(pointset[pointset.length - 1].x, pointset[pointset.length - 1].y)
    }
    if (ptnum + 1 < pointset.length) {
      ctx.moveTo(pointset[ptnum].x, pointset[ptnum].y)
      ctx.lineTo(pointset[ptnum + 1].x, pointset[ptnum + 1].y)
    }
    ctx.stroke()
    ctx.strokeStyle = strokestyle
    ctx.fillStyle = fillstyle
    ctx.setLineDash([4, 0])
  }
  ctx.beginPath()
  ctx.strokeStyle = strokestyle
  ctx.fillStyle = fillstyle
  ctx.moveTo(pointset[0].x, pointset[0].y)
  for (i = 0; i < pointset.length - 3; i = i + 3) {
    ctx.bezierCurveTo(pointset[i + 1].x, pointset[i + 1].y, pointset[i + 2].x, pointset[i + 2].y, pointset[i + 3].x, pointset[i + 3].y)
  }
  if (i === pointset.length - 3) {
    ctx.bezierCurveTo(pointset[i + 1].x, pointset[i + 1].y, pointset[i + 2].x, pointset[i + 2].y, pointset[0].x, pointset[0].y)
  }
  ctx.stroke()
  if (linewidth < 0) {
    ctx.fill()
  }
}

function CanvasClick (x, y, radius) {
  var res = IsPointOnPath(x, y, radius)
  var i = res.selectset
  var j = res.selectpt
  var point = null
  if (j < 0) {
    point = new Pointer(x, y)
    var len1 = bezierline.length
    if (len1 > 0) {
      var ctpt1 = new Pointer(bezierline[len1 - 1].x + (point.x - bezierline[len1 - 1].x) / 3, bezierline[len1 - 1].y + (point.y - bezierline[len1 - 1].y) / 3)
      var ctpt2 = new Pointer(bezierline[len1 - 1].x + (point.x - bezierline[len1 - 1].x) * 2 / 3, bezierline[len1 - 1].y + (point.y - bezierline[len1 - 1].y) * 2 / 3)
      bezierline.push(ctpt1)
      bezierline.push(ctpt2)
    }
    bezierline.push(point)
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
      var sept = bezierlines[i].pointset
    } else {
      sept = bezierline
    }
    var len1 = sept.length
    var ptnum = -1
    for (var k = 0; k < len1; k = k + 3) {
      if (Math.abs(j - k) < 2) {
        ptnum = k
        break
      }
    }
    if (i > -1 && bezierlines[i].flag) {
      if (j === sept.length - 1) {
        ptnum = 0
      }
    }
    if (j === ptnum) {
      var deltx = x - sept[ptnum].x
      var delty = y - sept[ptnum].y
      sept[j].x = x
      sept[j].y = y
      if (j - 1 > -1) {
        sept[j - 1].x = sept[j - 1].x + deltx
        sept[j - 1].y = sept[j - 1].y + delty
      }
      if (j + 1 < len1) {
        sept[j + 1].x = sept[j + 1].x + deltx
        sept[j + 1].y = sept[j + 1].y + delty
      }
      if (j === 0 && i > -1 && bezierlines[i].flag) {
        sept[sept.length - 1].x = sept[sept.length - 1].x + deltx
        sept[sept.length - 1].y = sept[sept.length - 1].y + delty
      }
    } else {
      var othnum = ptnum + ptnum - j
      // 判断首尾点，防止越界
      if (othnum > sept.length - 1 || othnum < 0) {
        if (i < 0 || !bezierlines[i].flag) {
          othnum = -1
        } else {
          if (ptnum === 0) {
            if (j === 1) {
              othnum = sept.length - 1
            }
            if (j === sept.length - 1) {
              othnum = 1
            }
          }
        }
      }
      sept[j].x = x
      sept[j].y = y
      if (othnum > -1) {
        var linelen1 = dis(sept[ptnum].x, sept[ptnum].y, sept[othnum].x, sept[othnum].y)
        var linelen2 = dis(x, y, sept[ptnum].x, sept[ptnum].y)
        if (linelen2 > 0.1) {
          sept[othnum].x = sept[ptnum].x - linelen1 * (sept[j].x - sept[ptnum].x) / linelen2
          sept[othnum].y = sept[ptnum].y - linelen1 * (sept[j].y - sept[ptnum].y) / linelen2
        }
      }
    }
  }
}

function Complete (color, flag) {
  var len1 = bezierline.length
  if (len1 > 1) {
    // 闭合需要添加两个控制点
    if (flag) {
      var ctpt1 = new Pointer(bezierline[len1 - 1].x + (bezierline[0].x - bezierline[len1 - 1].x) / 3, bezierline[len1 - 1].y + (bezierline[0].y - bezierline[len1 - 1].y) / 3)
      var ctpt2 = new Pointer(bezierline[len1 - 1].x + (bezierline[0].x - bezierline[len1 - 1].x) * 2 / 3, bezierline[len1 - 1].y + (bezierline[0].y - bezierline[len1 - 1].y) * 2 / 3)
      bezierline.push(ctpt1)
      bezierline.push(ctpt2)
    }
    var newbezierline = new Bezierliner(bezierline, color, flag)
    bezierlines.push(newbezierline)
    bezierline = []
  }
  return len1
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
        sept.splice(j - 3, 3)
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

function Undo () {
  if (bezierline.length > 3) {
    bezierline.pop()
    bezierline.pop()
    bezierline.pop()
  } else {
    bezierline = []
  }
}

function Clear () {
  bezierline = []
  bezierlines = []
}

function GetResult (rate) {
  var res = []
  for (var i = 0; i < bezierlines.length; i++) {
    var ptset = []
    for (var j = 0; j < bezierlines[i].pointset.length; j++) {
      var newpt = new Pointer(bezierlines[i].pointset[j].x * rate, bezierlines[i].pointset[j].y * rate)
      ptset.push(newpt)
    }
    var newptset = new Bezierliner(ptset, bezierlines[i].color, bezierlines[i].flag)
    res.push(newptset)
  }
  return res
}
