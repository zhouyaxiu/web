export {
  Set,
  GetRect,
  GetRects,
  GetRecti,
  Draw,
  Recter,
  DrawCrossline,
  CanvasClick,
  Drag,
  StopDrag,
  Del,
  GetResult,
  Clear,
  LoadRects,
  CursorStyle
}
var minwidth = 2
var minheight = 2
var rect = null
var rects = []

function LoadRects (loadrects) {
  rects = loadrects
}

function Set (w, h) {
  minwidth = w
  minheight = h
}
function GetRect () {
  return rect
}
function GetRects () {
  return rects
}
function GetRecti (i) {
  if (i > -1 && i < rects.length) {
    return rects[i]
  } else if (i < 0 && i + rects.length >= 0) {
    return rects[i + rects.length]
  } else {
    return null
  }
}

function Dis (x, y, x1, y1) {
  return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1))
}
function RectDrag (x, y, rect, radius) {
  if (Dis(x, y, rect.x, rect.y) < radius) {
    return 1
  }
  if (Dis(x, y, rect.x, rect.y + rect.height) < radius) {
    return 3
  }
  if (Dis(x, y, rect.x + rect.width, rect.y) < radius) {
    return 2
  }
  if (Dis(x, y, rect.x + rect.width, rect.y + rect.height) < radius) {
    return 4
  }
  return 0
}
// 矩形生成
function Recter (x, y, width, height, color) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.color = color
}

function DrawCrossline (ctx, x, y, w, h, strokestyle) {
  ctx.beginPath()
  ctx.strokeStyle = strokestyle
  ctx.moveTo(x, 0)
  ctx.lineTo(x, h)
  ctx.stroke()
  ctx.moveTo(0, y)
  ctx.lineTo(w, y)
  ctx.stroke()
}

function Draw (ctx, rect, strokestyle, fillstyle, linewidth, radius) {
  if (rect === null) {
    return false
  }
  ctx.lineWidth = linewidth
  ctx.strokeStyle = strokestyle
  ctx.beginPath()
  ctx.fillStyle = strokestyle
  ctx.arc(rect.x, rect.y, radius, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
  ctx.beginPath()
  ctx.fillStyle = strokestyle
  ctx.arc(rect.x + rect.width, rect.y, radius, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
  ctx.beginPath()
  ctx.fillStyle = strokestyle
  ctx.arc(rect.x + rect.width, rect.y + rect.height, radius, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
  ctx.beginPath()
  ctx.fillStyle = strokestyle
  ctx.arc(rect.x, rect.y + rect.height, radius, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
  ctx.beginPath()
  ctx.fillStyle = fillstyle
  ctx.rect(rect.x, rect.y, rect.width, rect.height)
  ctx.stroke()
  if (linewidth < 0) {
    ctx.fill()
  }
}

function IsPointInRecti (x, y, i, radius) {
  if ((x > rects[i].x && x < rects[i].x + rects[i].width && y > rects[i].y && y < rects[i].y + rects[i].height) || RectDrag(x, y, rects[i], radius) > 0) {
    return true
  }
  return false
}

function IsPointInRect (x, y, radius) {
  var select = -1
  var dragrect = 0
  for (var i = rects.length - 1; i >= 0; i--) {
    if ((x > rects[i].x && x < rects[i].x + rects[i].width && y > rects[i].y && y < rects[i].y + rects[i].height) || RectDrag(x, y, rects[i], radius) > 0) {
      select = i
      dragrect = RectDrag(x, y, rects[i], radius)
      break
    }
  }
  return {
    select: select,
    dragrect: dragrect
  }
}

// 依据点击位置进入不同操作模式 1.移动矩形  2.更改矩形  3.新建矩形
function CanvasClick (x, y, radius, res) {
  var dragres = IsPointInRect(x, y, radius)
  var dragrect = dragres.dragrect
  var i = dragres.select
  if (res !== null && res.i > -1 && IsPointInRecti(x, y, res.i, radius)) {
    i = res.i
    dragrect = RectDrag(x, y, rects[i], radius)
  }
  return {
    x: x,
    y: y,
    // 存储以便drag
    x0: x,
    y0: y,
    dragrect: dragrect,
    i: i
  }
}

// 拖拽动作，从(x0,y0)到(x,y)，依据点击事件选择不同动作
function Drag (x, y, color, res) {
  var i = res.i
  var drag = res.dragrect
  // 移动矩形
  if (i > -1 && drag === 0) {
    rects[i].x = rects[i].x + x - res.x0
    rects[i].y = rects[i].y + y - res.y0
  }
  // 修改矩形
  if (i > -1 && drag > 0) {
    if (drag === 1) {
      rects[i].width = rects[i].x + rects[i].width - x
      rects[i].x = x
      rects[i].height = rects[i].y + rects[i].height - y
      rects[i].y = y
      // window.cursor.style = 'e-move'
    } else if (drag === 2) {
      rects[i].width = x - rects[i].x
      rects[i].height = rects[i].y + rects[i].height - y
      rects[i].y = y
    } else if (drag === 3) {
      rects[i].height = y - rects[i].y
      rects[i].width = rects[i].x + rects[i].width - x
      rects[i].x = x
      rects[i].y = y - rects[i].height
    } else if (drag === 4) {
      rects[i].width = x - rects[i].x
      rects[i].height = y - rects[i].y
    }
  }
  // 新建矩形
  if (i < 0) {
    var rx, ry
    var x0 = res.x
    var y0 = res.y
    rx = x > x0 ? x0 : x
    ry = y > y0 ? y0 : y
    if (Math.abs(x - x0) >= minwidth && Math.abs(y - y0) >= minheight) {
      rect = new Recter(rx, ry, Math.abs(x - x0), Math.abs(y - y0), color)
    }
  }
  res.x0 = x
  res.y0 = y
}

function CursorStyle (x, y, angle, radius, selectres) {
  var res = IsPointInRect(x, y, radius)
  if (selectres && selectres.i > -1 && IsPointInRecti(x, y, selectres.i, radius)) {
    res.i = selectres.i
    res.dragrect = RectDrag(x, y, rects[selectres.i], radius)
  }
  if (res.select > -1 && res.dragrect === 0) {
    return 'move'
  }
  if (res.dragrect === 0) {
    return 'crosshair'
  } else if (res.dragrect === 1) {
    if (angle === 0 || angle === 2) {
      return 'se-resize'
    } else {
      return 'sw-resize'
    }
  } else if (res.dragrect === 2) {
    if (angle === 0 || angle === 2) {
      return 'sw-resize'
    } else {
      return 'se-resize'
    }
  } else if (res.dragrect === 3) {
    if (angle === 0 || angle === 2) {
      return 'ne-resize'
    } else {
      return 'nw-resize'
    }
  } else if (res.dragrect === 4) {
    if (angle === 0 || angle === 2) {
      return 'nw-resize'
    } else {
      return 'ne-resize'
    }
  } else {
    return 'auto'
  }
}

function StopDrag (res) {
  if (rect !== null) {
    rects.push(rect)
    rect = null
    return true
  }
  if (res === null) {
    // nothing
  } else {
    var i = res.i
    if (i > -1 && rects[i].width < 0) {
      rects[i].x = rects[i].x + rects[i].width
      rects[i].width = Math.abs(rects[i].width)
    }
    if (i > -1 && rects[i].height < 0) {
      rects[i].y = rects[i].y + rects[i].height
      rects[i].height = Math.abs(rects[i].height)
    }
  }
  return false
}

function Del (res) {
  var i = res.i
  if (i > -1) {
    rects.splice(i, 1)
  }
}

function GetResult (rate) {
  var res = []
  // var rectpoint = []
  for (var i = 0; i < rects.length; i++) {
    var newrect = new Recter(rects[i].x * rate, rects[i].y * rate, rects[i].width * rate, rects[i].height * rate, rects[i].color)
    res.push(newrect)
    // var pt1 = new Pointer(rects[i].x * rate, rects[i].y * rate)
    // var pt2 = new Pointer(rects[i].x + rects[i].width, rects[i].y + rects[i].height)
    // rectpoint.push(pt1)
    // rectpoint.push(pt2)
    // res.push(rectpoint)
  }
  return res
}

function Clear () {
  rects = []
}
