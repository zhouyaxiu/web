export {getOrientation}
function getStringFromCharCode (dataView, start, length) {
  var str = ''
  var i
  for (i = start, length += start; i < length; i++) {
    str += String.fromCharCode(dataView.getUint8(i))
  }
  // console.log(str)
  return str
}

function getOrientation (arrayBuffer) {
  var dataView = new DataView(arrayBuffer)
  var length = dataView.byteLength
  var orientation
  var exifIDCode
  var tiffOffset
  var firstIFDOffset
  var littleEndian
  var endianness
  var app1Start
  var ifdStart
  var offset
  var i
  // Only handle JPEG image (start by 0xFFD8)
  if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
    offset = 2
    while (offset < length) {
      if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
        app1Start = offset
        break
      }
      offset++
    }
  }
  if (app1Start) {
    exifIDCode = app1Start + 4
    tiffOffset = app1Start + 10
    if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
      endianness = dataView.getUint16(tiffOffset)
      littleEndian = endianness === 0x4949
      if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
        if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
          firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian)
          if (firstIFDOffset >= 0x00000008) {
            ifdStart = tiffOffset + firstIFDOffset
          }
        }
      }
    }
  }
  if (ifdStart) {
    length = dataView.getUint16(ifdStart, littleEndian)

    for (i = 0; i < length; i++) {
      offset = ifdStart + i * 12 + 2
      if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
        // 8 is the offset of the current tag's value
        offset += 8
        // Get the original orientation value
        orientation = dataView.getUint16(offset, littleEndian)
        // // Override the orientation
        // if () {
        //   dataView.setUint16(offset, 1, littleEndian)
        // }
        break
      }
    }
  }
  if (orientation) {
    return orientation
  } else {
    return 1
  }
}
