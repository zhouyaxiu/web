export {
  CanvasClick,
  Drag,
  StopDrag,
  Reset
}

// var flag = false
function CanvasClick (x, y) {
  return {
    x: x,
    y: y,
    flag: true
  }
}

function Drag (x, y, res, left, top) {
  if (res !== null && res.flag) {
    var lefti = x - res.x + left
    var topi = y - res.y + top
    return {
      left: lefti,
      top: topi
    }
  }
  return null
}

function StopDrag () {

}

function Reset () {

}
