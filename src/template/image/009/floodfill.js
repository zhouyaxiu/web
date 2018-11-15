export {floodFill}

/*
    imageData 图片
    x, y 起始点位置
*/
var stack = []
function Line (Y, L, R, PL, PR, dir) {
  this.Y = Y
  this.L = L
  this.R = R
  this.PL = PL
  this.PR = PR
  this.dir = dir
}

function Dir (dir, L, R) {
  this.dir = dir
  this.L = L
  this.R = R
}

function floodFill (img, curX, curY, threshold) {
  let width = img.width
  let height = img.height
  var result = new Array(width * height)
  for (var r = 0; r < result.length; r++) {
    result[r] = false
  }
  let L = curX
  let R = curX
  let Y = curY
  let CR = img.data[4 * (curY * width + curX)]
  let CG = img.data[4 * (curY * width + curX) + 1]
  let CB = img.data[4 * (curY * width + curX) + 2]
  while (++R < width && dist(img, R, Y, curX, curY, threshold)) {
    img.data[4 * (Y * width + R)] = CR
    img.data[4 * (Y * width + R) + 1] = CG
    img.data[4 * (Y * width + R) + 2] = CB
    result[Y * width + R] = true
  }
  while (--L >= 0 && dist(img, L, Y, curX, curY, threshold)) {
    img.data[4 * (Y * width + L)] = CR
    img.data[4 * (Y * width + L) + 1] = CG
    img.data[4 * (Y * width + L) + 2] = CB
    result[Y * width + L] = true
  }
  R--
  L++
  let line = new Line(Y, L, R, R + 1, R, 1)
  stack.push(line)
  while (stack.length > 0) {
    let tmp = stack.pop()
    let D = new Array(3)
    D[0] = new Dir(0 - tmp.dir, tmp.L - 1, tmp.R + 1)
    D[1] = new Dir(tmp.dir, tmp.L - 1, tmp.PL - 1)
    D[2] = new Dir(tmp.dir, tmp.PR + 1, tmp.R + 1)
    for (var d = 0; d < 3; d++) {
      let dir = D[d].dir
      let left = D[d].L
      let right = D[d].R
      if (left > right) {
        continue
      }
      let tmpY = tmp.Y + dir
      if (tmpY < 0 || tmpY > height) {
        continue
      }
      for (var i = left; i <= right; i++) {
        if (i < width && i >= 0 && !result[tmpY * width + i] && dist(img, i, tmpY, curX, curY, threshold)) {
          let j = i
          result[tmpY * width + i] = true
          // 判断左右边界
          while (!result[tmpY * width + (--j)] && dist(img, j, tmpY, curX, curY, threshold)) {
            if (j >= 0 && j < width) {
              img.data[4 * (tmpY * width + j)] = CR
              img.data[4 * (tmpY * width + j) + 1] = CG
              img.data[4 * (tmpY * width + j) + 2] = CB
              result[tmpY * width + j] = true
            }
          }
          while (!result[tmpY * width + (++i)] && dist(img, i, tmpY, curX, curY, threshold)) {
            if (i >= 0 && i < width) {
              img.data[4 * (tmpY * width + i)] = CR
              img.data[4 * (tmpY * width + i) + 1] = CG
              img.data[4 * (tmpY * width + i) + 2] = CB
              result[tmpY * width + i] = true
            }
          }
          var newline
          newline = new Line(tmpY, j + 1, i - 1, tmp.L, tmp.R, -dir)
          stack.push(newline)
        }
      }
    }
  }
  return result
}

function dist (imgData, x1, y1, x2, y2, threshold) {
  let i1 = (y1 * imgData.width + x1) * 4
  let i2 = (y2 * imgData.width + x2) * 4
  let sq = 0
  // 只算RGB
  for (let k = 0; k < 3; k++) {
    // sq += (imgData.data[i1 + k] - imgData.data[i2 + k]) * (imgData.data[i1 + k] - imgData.data[i2 + k])
    if (Math.abs(imgData.data[i1 + k] - imgData.data[i2 + k]) < threshold) {
      sq = sq + 1
    }
  }
  if (sq === 3) {
    return true
  } else {
    return false
  }
}
