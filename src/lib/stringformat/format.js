export {format}
function format (old, args) {
  let formatted = old
  for (var i = 0; i < args.length; i++) {
    var regexp = new RegExp('\\%\\%' + i + '\\%\\%', 'gi')
    formatted = formatted.replace(regexp, args[i])
  }
  return formatted
}
