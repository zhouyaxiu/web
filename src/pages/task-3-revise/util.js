export {formatTime, randomColor}

function formatTime (seconds) {
  var minutes, secs, result
  minutes = parseInt(seconds / 60, 10) % 60
  secs = seconds % 60
  secs = secs.toFixed(3)
  result = (minutes < 10 ? '0' + minutes : minutes) + ':' + (secs < 10 ? '0' + secs : secs)
  return result
}

function randomColor (alpha) {
  console.log(alpha)
  return (
    'rgba(' +
    [
      ~~(Math.random() * 255),
      ~~(Math.random() * 255),
      ~~(Math.random() * 255),
      alpha || 1
    ] +
    ')'
  )
}
