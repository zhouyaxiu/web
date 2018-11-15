export {created, updated, removeEnd, dblclick}

function created (region) {
  console.log('region-created')
  region.drag = false
  // region.color = randomColor(0.1)
  // region.data.valid = true
  // region.data.role = ''
  // region.data.note = ''
}

function updated (region) {
  console.log('region-updated')
  var regions = region.wavesurfer.regions.list
  var index = regions.indexOf(region)
  // 首尾相接
  if (index > 0) {
    var prevRegion = regions[index - 1]
    prevRegion.end = region.start
    prevRegion.updateRender()
  }
  if (index === 0) {
    region.start = 0
  } else {
    if (region.start <= regions[index - 1].start) {
      region.start = regions[index - 1].start
    }
  }
  if (index === regions.length - 1) {
    if (region.start >= region.end) {
      region.start = region.end
    }
  } else {
    if (region.start >= regions[index + 1].start) {
      region.start = regions[index + 1].start
    }
  }
}

// function updateEnd(region) {
//   console.log('region-update-end')
// }

function removeEnd (index, region) {
  console.log('region-remove-end')
  var regions = region.wavesurfer.regions.list
  regions[index].start = region.start
  regions[index].updateRender()
}

function dblclick (region, e) {
  console.log('region-dblclick')
  region.wavesurfer.play(region.start, region.end)
}
