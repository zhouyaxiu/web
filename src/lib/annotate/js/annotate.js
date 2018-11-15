
class Annotate {
  constructor (element, opts) {
    this.element = element

    this.options = {
      prompt: {
        width: 200,
        height: 50,
        text: 'Adding notes',
        className: 'annotation-prompt'
      },
      content: {
        className: 'annotation-content'
      }
    }

    if (typeof opts === 'object') {
      this.options = Object.assign(this.options, opts)
    }

    this.annotations = []
    this.itemCheckBoxLen = this.options.itemCheckBoxLen
    this.vueRoot = this.options.vueRoot

    this.selection = {
      selection: null,
      text: '',
      start: null,
      end: null,
      off: true
    }

    this.data = {
      arrow: null
    }

    this.init()
    this.bindEvents()
  }

  resizeCanvas () {
    this.DOM.content = this.element.querySelector('.' + this.options.content.className)
    this.DOM.canvas.width = this.DOM.content.clientWidth
    this.DOM.canvas.height = this.DOM.content.clientHeight
    var children = this.DOM.content.childNodes
    for (let i = 0; i < children.length; i++) {
      if (children[i].getBoundingClientRect) {
        var rect = children[i].getBoundingClientRect()
        this.data.lineHeight = rect.height
        break
      }
    }
  }
  changeContent (text) {
    this.data.content = text.replace(/\t|\n/g, '').trim()
    this.DOM.content.innerHTML = this.data.content
  }

  init () {
    this.element.style.position = 'relative'

    this.DOM = {}

    this.data.content = this.element.innerHTML.replace(/\t|\n/g, '').trim()

    this.element.innerHTML = '<div class="' + this.options.content.className + '">' + this.data.content + '</div>'

    this.DOM.content = this.element.querySelector('.' + this.options.content.className)

    // prompt
    this.DOM.prompt = document.createElement('div')

    this.DOM.prompt.style.width = this.options.prompt.width + 'px'
    this.DOM.prompt.style.minWidth = this.options.prompt.width + 'px'
    this.DOM.prompt.style.minHeight = this.options.prompt.height + 'px'
    this.DOM.prompt.style.backgroundColor = 'red'

    this.DOM.prompt.style.display = 'none'
    this.DOM.prompt.style.position = 'absolute'

    this.DOM.prompt.className = this.options.prompt.className

    // annotate button
    this.DOM.btnAnnotate = document.createElement('button')
    this.DOM.btnAnnotate.textContent = this.options.prompt.text

    this.DOM.prompt.appendChild(this.DOM.btnAnnotate)

    // canvas
    this.DOM.canvas = document.createElement('canvas')
    this.DOM.canvas.width = this.DOM.content.clientWidth
    this.DOM.canvas.height = this.DOM.content.clientHeight
    this.DOM.canvas.className = 'annotation-canvas'
    this.DOM.canvas = this.element.appendChild(this.DOM.canvas)

    this.DOM.prompt = this.element.appendChild(this.DOM.prompt)

    // detect line height
    var children = this.DOM.content.childNodes
    for (let i = 0; i < children.length; i++) {
      if (children[i].getBoundingClientRect) {
        var rect = children[i].getBoundingClientRect()
        this.data.lineHeight = rect.height
        break
      }
    }

    // detect element offset
    this.data.offset = {
      left: 0,
      top: 0
    }
    rect = this.element.getBoundingClientRect()
    this.data.offset.top = rect.top
    this.data.offset.left = rect.left
    // load arrow img
    this.data.arrow = document.createElement('img')
    this.data.arrow.src = '/static/img/arrow.png'

    if (!this.data.lineHeight) {
      console.log('failed detecting line height')
    }
    var $this = this
    var node = this.element
    do {
      if (typeof node.scrollTop === 'number') {
        node.addEventListener('scroll', function (e) {
          e.stopPropagation()
          if ($this.isClickArea(e.clientX, e.clientY) !== false) {
            // arrow
            $this.DOM.content.style.cursor = 'pointer'
          } else {
            $this.DOM.content.style.cursor = ''
          }
        }, false)

        node.scrollTop = 0
      }
      node = node.parentNode
    } while (node.tagName !== 'BODY')
  }
  bindEvents () {
    var $this = this

    document.addEventListener('selectionchange', function (e) {
      $this.setSelection(window.getSelection())
    }, false)

    this.element.addEventListener('mouseup', function (e) {
      e.stopPropagation()
      // console.log(this)
      // console.log($this)
      $this.annotationPrompt()
    }, false)

    this.element.addEventListener('mousedown', function (e) {
      $this.DOM.prompt.style.display = 'none'

      /*
			 * remove old selection tags before new selection
			if ($this.selection.off === true && ! /Firefox/.test(navigator.userAgent)) {
				$this.DOM.content.innerHTML = $this.data.content;
			} */
    }, false)
    this.element.addEventListener('click', function (e) {
      e.stopPropagation()
      // console.log('element click')

      if ($this.selection.off === true) {
        $this.DOM.prompt.style.display = 'none'
        $this.DOM.content.innerHTML = $this.data.content
      }
    }, false)

    // this.element.addEventListener('mousemove', function (e) {
    //   e.stopPropagation()
    //   console.log('mousemove')
    //   if ($this.isClickArea(e.clientX, e.clientY) !== false) {
    //     // arrow
    //     $this.DOM.content.style.cursor = 'pointer'
    //   } else {
    //     $this.DOM.content.style.cursor = ''
    //   }
    // }, false)

    this.DOM.prompt.addEventListener('mousedown', function (e) {
      e.stopPropagation()
    }, false)

    this.DOM.btnAnnotate.addEventListener('click', function (e) {
      e.stopPropagation()
      $this.annotate()
    }, false)
    // update annotations on resize
    window.addEventListener('resize', function () {
      setTimeout(function () {
        // $this.onResize.call($this)
        $this.onResize()
      }, 100)
    }, false)
  }

  setSelection (selection) {
    // console.log('setSelection')
    if (selection.type !== 'Range') {
      this.selection.off = true
      return false
    } else {
      this.selection.off = false
    }

    this.selection.selection = selection

    this.selection.anchorNode = selection.anchorNode
    this.selection.focusNode = selection.focusNode

    var offset = {
      start: 0,
      end: 0,
      length: 0,
      startFound: false
    }

    for (let i = 0; i < this.DOM.content.childNodes.length; i++) {
      // skip comments
      if (this.DOM.content.childNodes[i].nodeType === 8) {
        continue
      }

      var nodeContents
      if (this.DOM.content.childNodes[i].nodeType === 1) {
        nodeContents = this.DOM.content.childNodes[i].outerHTML
      } else {
        nodeContents = this.DOM.content.childNodes[i].textContent
      }

      var isEndnode = (
        selection.focusNode === this.DOM.content.childNodes[i] || selection.anchorNode === this.DOM.content.childNodes[i] ||
				selection.focusNode.parentNode === this.DOM.content.childNodes[i] || selection.anchorNode.parentNode === this.DOM.content.childNodes[i]
      )

      if (offset.startFound === false && !isEndnode) {
        offset.start += nodeContents.length
      }

      if (offset.startFound === true && !isEndnode) {
        offset.length += nodeContents.length
      }

      var tags
      if (this.DOM.content.childNodes[i].nodeType === 1) {
        tags = this.DOM.content.childNodes[i].outerHTML.split((this.DOM.content.childNodes[i].firstChild === null ? this.DOM.content.childNodes[i].textContent : this.DOM.content.childNodes[i].firstChild.textContent))
        if (tags.length === 1) {
          tags[1] = ''
        }
      } else {
        tags = ['', '']
      }

      if (isEndnode) {
        let selOffset = selection.anchorNode === this.DOM.content.childNodes[i] ? selection.anchorOffset : selection.focusOffset

        if (offset.startFound === false) {
          // found the beginning of selection

          offset.startFound = true

          // this could be the end too
          if (selection.anchorNode === selection.focusNode) {
            // the end too
            if (selection.anchorOffset < selection.focusOffset) {
              offset.start += selection.anchorOffset
            } else {
              offset.start += selection.focusOffset
            }

            offset.start += tags[0].length

            if (selOffset === this.DOM.content.childNodes[i].textContent.length) {
              offset.length += tags[1].length
            }

            offset.length += Math.max(selection.anchorOffset, selection.focusOffset) - Math.min(selection.anchorOffset, selection.focusOffset)
            break
          } else {
            // start but not the end
            if (selection.anchorNode === this.DOM.content.childNodes[i] || selection.anchorNode.parentNode === this.DOM.content.childNodes[i]) {
              offset.start += selection.anchorOffset
              offset.start += tags[0].length
              offset.length += (nodeContents.length - selection.anchorOffset - tags[0].length - tags[1].length)
            } else {
              offset.start += selection.focusOffset + tags[0].length
              offset.length += (nodeContents.length - selection.focusOffset - tags[0].length - tags[1].length)
            }

            offset.length += tags[1].length
          }
        } else {
          // end found
          // console.log('end', selOffset, this.DOM.content.childNodes[i])
          offset.length += tags[0].length
          offset.length += this.DOM.content.childNodes[i] === selection.anchorNode || this.DOM.content.childNodes[i] === selection.anchorNode.parentNode ? selection.anchorOffset : selection.focusOffset

          break
        }
      }
    }

    offset.end = offset.start + offset.length

    this.selection.start = offset.start
    this.selection.end = offset.end
    this.selection.text = this.DOM.content.innerHTML.substring(this.selection.start, this.selection.end)
    // console.log(this.selection.text)
  }

  annotationPrompt (nocheck) {
    // console.log('annotationPrompt', nocheck)
    if (typeof nocheck === 'undefined' || nocheck === true) {
      if (this.selection.start === null || this.selection.end === null) { return false }

      var sel = window.getSelection()
      if (sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset) {
        return false
      }
      sel.removeAllRanges()
    }

    this.DOM.content.innerHTML = this.data.content
    this.DOM.prompt.style.display = 'none'

    // good for debugging the selection
    // console.log(this.DOM.content.innerHTML.substring(this.selection.start, this.selection.end))

    // highlight selection

    this.wrap(this.selection.start, this.selection.end)

    // calculate offset left
    var offset = {
      top: 0,
      left: 0
    }
    var node = this.element.querySelector('.annotation-selection')
    if (!node) {
      // console.log(node)
    }
    do {
      if (getComputedStyle(node).position !== 'static') {
        offset.left += node.offsetLeft
        offset.top += node.offsetTop
      }
      node = node.parentNode
    } while (node !== this.element)

    // offset center
    var size = this.DOM.content.querySelector('.annotation-selection').getBoundingClientRect()
    offset.left += Math.round(size.width / 2)

    // remove tmp span
    // this.DOM.content.innerHTML = html;

    // annotation prompt display
    var left = offset.left - this.options.prompt.width / 2
    if (left + this.options.prompt.width / 2 > this.element.clientWidth) {
      left = this.element.clientWidth - this.options.prompt.width
    } else if (left < 0) {
      left = 0
    }
    var top = offset.top - this.options.prompt.height
    // console.log(top)
    if (top < 0) {
      top = this.data.lineHeight + 15
    }

    this.DOM.prompt.style.left = left + 'px'
    this.DOM.prompt.style.top = top + 'px'
    this.DOM.prompt.style.display = 'block'
  }

  annotate (annotation) {
    if (typeof annotation !== 'object') {
      annotation = {
        id: this.annotations.length + 1,
        start: this.selection.start,
        end: this.selection.end,
        bounds: [],
        itemRadioContents: [],
        itemCheckBoxContents: [],
        itemInputContents: []
      }
      for (let num = 0; num < this.annotations.length; num++) {
        let start = this.annotations[num].start
        let end = this.annotations[num].end
        if ((annotation.start < start && annotation.end > start) || (annotation.end > end && annotation.start < end)) {
          console.log('re annotate')
          return
        }
      }
      for (let num = 0; num < this.itemCheckBoxLen; num++) {
        if (!Array.isArray(annotation.itemCheckBoxContents[num])) {
          // 将itemCheckBoxContents变成三维数组
          this.vueRoot.$set(annotation.itemCheckBoxContents, num, [])
        }
      }
    } else {
      annotation.bounds = []
    }

    var ctx = this.DOM.canvas.getContext('2d')

    // calculate bounds and draw to canvas
    var parts = document.querySelectorAll('.annotation-selection')
    for (let i = 0; i < parts.length; i++) {
      var rect = parts[i].getBoundingClientRect()

      if (!this.data.lineHeight) {
        this.data.lineHeight = rect.height
      }

      var rows = Math.round(rect.height / this.data.lineHeight)

      if (rows === 0) { rows = 1 }

      if (rows <= 1) {
        // one row
        var bounds = {
          left: rect.left - this.data.offset.left,
          top: rect.top - this.data.offset.top + this.scrollTop(),
          width: rect.width,
          height: rect.height
        }
        annotation.bounds.push(bounds)
      } else {
        // part spans more than 1 row

        var currentRow = 0
        var offset = 0
        bounds = false
        var tagOpening = false
        var tag = ''
        var openTags = []
        do {
          this.DOM.content.innerHTML = this.data.content.substring(0, this.selection.start + offset) + '<span class="annotation-tmp">' + this.data.content.substring(this.selection.start + offset, this.selection.start + offset + 1) + '</span>' + openTags.map(function (tag) { return tag.replace('<', '</') }).join('') + this.data.content.substring(this.selection.start + offset + 1)

          if (this.data.content.substring(this.selection.start + offset, this.selection.start + offset + 1) === '<') {
            tagOpening = true
            offset++
            tag = '<'
            continue
          }

          if (tagOpening === true) {
            if (this.data.content.substring(this.selection.start + offset, this.selection.start + offset + 1) === '>') {
              tagOpening = false
              var closingTag = false
              for (let j = 0; j < openTags.length; j++) {
                if (openTags[j].replace('<', '</') === tag) {
                  closingTag = true
                  openTags.splice(j, 1)
                  break
                }
              }
              tag += '>'
              if (!closingTag) {
                openTags.push(tag)
              }

              tag = ''
              offset++
              continue
            } else {
              tag += this.data.content.substring(this.selection.start + offset, this.selection.start + offset + 1)
              offset++
              continue
            }
          }

          rect = this.DOM.content.querySelector('.annotation-tmp').getBoundingClientRect()

          if (bounds !== false) {
            var top = (rect.top - this.data.offset.top + this.scrollTop()) - (annotation.bounds.length > 0 ? annotation.bounds[0].top : bounds.top)
            var rowH = (annotation.bounds.length > 0 ? annotation.bounds[0].height : bounds.height) + 16
            var cRow = Math.round(top / rowH)
          } else {
            top = 0
            rowH = rect.height + 16
            cRow = 0

            bounds = {
              left: rect.left - this.data.offset.left,
              top: rect.top - this.data.offset.top + this.scrollTop(),
              width: rect.width,
              height: rect.height
            }

            offset++

            continue
          }

          if (cRow !== currentRow) {
            annotation.bounds.push(bounds)

            bounds = {
              left: rect.left - this.data.offset.left,
              top: rect.top - this.data.offset.top + this.scrollTop(),
              width: rect.width,
              height: rect.height
            }

            currentRow = cRow
          } else {
            // in the same row
            bounds.width += rect.width
          }

          // next
          offset++
        } while (this.selection.start + offset < this.selection.end)

        annotation.bounds.push(bounds)
      }
    }

    ctx.fillStyle = 'rgba(255, 0, 0, 1)'

    for (let i = 0; i < annotation.bounds.length; i++) {
      let bounds = annotation.bounds[i]
      ctx.fillRect(bounds.left, bounds.top + bounds.height - 1, bounds.width, 1)
    }

    // reset HTML
    this.DOM.content.innerHTML = this.data.content

    // hide prompt
    this.DOM.prompt.style.display = 'none'

    this.annotations.push(annotation)

    this.drawArrow(annotation)
  }

  drawArrow (annotation) {
    var ctx = this.DOM.canvas.getContext('2d')

    var bounds = annotation.bounds[annotation.bounds.length - 1]

    // draw arrow
    let arrowX = bounds.left + bounds.width - this.data.arrow.width
    let arrowY = bounds.top - this.data.arrow.height
    // console.log(arrowX, arrowY)
    // if (arrowY < 0) {
    //   arrowY = 0
    // }
    ctx.drawImage(this.data.arrow, arrowX, arrowY)

    // draw id
    var fs = 11
    var ts = ctx.measureText(annotation.id)
    ctx.fontStyle = fs + 'px arial'
    ctx.fillStyle = 'black'
    ctx.textBaseline = 'bottom'

    ctx.fillText(annotation.id, bounds.left + bounds.width - ts.width - this.data.arrow.height, bounds.top)

    // store/update click area
    annotation.clickArea = {
      left: bounds.left + bounds.width - ts.width - this.data.arrow.height,
      top: bounds.top - this.data.arrow.height,
      width: ts.width + this.data.arrow.width,
      height: this.data.arrow.height
    }
  }

  annotateAll (annotations) {
    var sel = Object.assign({}, this.selection)

    for (let i = 0; i < annotations.length; i++) {
      this.selection.start = annotations[i].start
      this.selection.end = annotations[i].end
      this.wrap(annotations[i].start, annotations[i].end)
      this.annotate(annotations[i])
    }

    this.selection = sel
  }

  getResult () {
    var annotations = []
    for (let i = 0; i < this.annotations.length; i++) {
      let annotation = {
        id: this.annotations[i].id,
        start: this.annotations[i].start,
        end: this.annotations[i].end,
        itemRadioContents: this.annotations[i].itemRadioContents,
        itemCheckBoxContents: this.annotations[i].itemCheckBoxContents,
        itemInputContents: this.annotations[i].itemInputContents
      }
      annotations.push(annotation)
    }
    return annotations
  }

  Load (annotations) {
    // this.annotations = annotations
    this.annotateAll(annotations)
  }

  HideAll () {
    var annotations = document.querySelectorAll('.annotation')
    if (annotations == null) { return true }
    for (var i = 0; i < annotations.length; i++) {
      annotations[i].className = 'annotation annotation-hidden'
    }
  }

  ShowAll () {
    var annotations = document.querySelectorAll('.annotation')
    if (annotations == null) { return true }
    for (var i = 0; i < annotations.length; i++) {
      annotations[i].className = 'annotation'
    }
  }

  Reset () {
    this.annotations.splice(0, this.annotations.length)
    this.annotations.length = 0
    this.DOM.content.innerHTML = this.data.content

    var ctx = this.DOM.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.DOM.canvas.width, this.DOM.canvas.height)
  }

  getById (annotationId) {
    for (var i = 0; i < this.annotations.length; i++) {
      if (this.annotations[i].id + '' === annotationId) {
        return this.annotations[i]
      }
    }
    return false
  }

  wrap (sStart, sEnd) {
    var offset = 0
    var nodes = Array.from(this.DOM.content.childNodes)
    for (let i = 0; i < nodes.length; i++) {
      // skip comments
      if (nodes[i].nodeType === 8) {
        continue
      }
      var nodeContents
      if (nodes[i].nodeType !== 3) {
        nodeContents = nodes[i].outerHTML
      } else {
        nodeContents = nodes[i].textContent
      }

      var offsetStart = offset
      offset += nodeContents.length

      // check if this element should be affected
      if (
        (offsetStart >= sStart && offsetStart < sEnd) ||
				(offsetStart <= sStart && offset > sStart)
      ) {
        var start = Math.max(0, sStart - offsetStart)
        var end = Math.min(sEnd - offsetStart, nodeContents.length)

        if (nodes[i].nodeType === 1) {
          var tags = nodes[i].outerHTML.split(nodes[i].firstChild === null ? nodes[i].textContent : nodes[i].firstChild.textContent)

          if (tags.length > 2) { continue }

          if (sEnd < offset) {
            // end -= tags[1].length;
          } else {
            end -= tags[1].length
          }

          if (sStart > offsetStart) {

          } else {
            // start += tags[0].length;
          }

          if (nodes[i].tagName === 'BR') { continue }

          var replacement = (
            nodes[i].outerHTML.substring(0, start) +
						'<div class="annotation-selection">' + nodes[i].outerHTML.substring(start, end) + '</div>' +
						nodes[i].outerHTML.substring(end)
          )

          nodes[i].insertAdjacentHTML('beforebegin', replacement)

          nodes[i].parentNode.removeChild(nodes[i])
        } else {
          // var oldLen = nodes[i].textContent.length

          var pre = nodes[i].textContent.substring(0, start)
          var suf = nodes[i].textContent.substring(end)

          var content = document.createElement('div')

          content.className = 'annotation-selection'
          content.textContent = nodes[i].textContent.substring(start, end)

          content = nodes[i].parentNode.insertBefore(content, nodes[i])

          var html = pre + content.outerHTML + suf

          content.insertAdjacentHTML('beforebegin', html)

          nodes[i].parentNode.removeChild(content)
          nodes[i].parentNode.removeChild(nodes[i])
        }
      }
    }
  }

  deleteAnnotation (annotationId) {
    for (let i = 0; i < this.annotations.length; i++) {
      if (this.annotations[i].id === annotationId) {
        var ctx = this.DOM.canvas.getContext('2d')
        ctx.clearRect(0, 0, this.DOM.canvas.width, this.DOM.canvas.height)

        this.annotations.splice(i, 1)

        let annotations = this.getResult()

        this.annotations.length = 0

        for (let j = 0; j < annotations.length; j++) {
          if (annotations[j].id > annotationId) {
            annotations[j].id--
            // console.log(annotations[j])
          }
        }
        this.annotateAll(annotations)

        return true
      }
    }

    return false
  }

  scrollTop () {
    var top = 0
    var node = this.element
    do {
      if (typeof node.scrollTop === 'number') {
        top += node.scrollTop
      }
      node = node.parentNode
    } while (node.tagName !== 'BODY')
    return top
  }
  isClickArea (x, y) {
    // calculate offset left
    var offset = {
      top: 0,
      left: 0
    }
    var node = this.element

    do {
      if (getComputedStyle(node).position !== 'static') {
        offset.left += node.offsetLeft
        offset.top += node.offsetTop
      }
      node = node.parentNode
    } while (node !== document.body)

    x -= offset.left
    y -= offset.top

    for (let i = 0; i < this.annotations.length; i++) {
      var ca = this.annotations[i].clickArea

      if (typeof ca === 'undefined') { continue }

      var xIn = x > ca.left && x < ca.left + ca.width
      var yIn = y > ca.top && y < ca.top + ca.height

      if (xIn && yIn) {
        return true
      }
    }
    return false
  }

  getClickArea (x, y) {
    // calculate offset left
    var offset = {
      top: 0,
      left: 0
    }
    var node = this.element

    do {
      if (getComputedStyle(node).position !== 'static') {
        offset.left += node.offsetLeft
        offset.top += node.offsetTop
      }
      node = node.parentNode
    } while (node !== document.body)

    x -= offset.left
    y -= offset.top - this.scrollTop()

    for (let i = 0; i < this.annotations.length; i++) {
      var ca = this.annotations[i].clickArea

      if (typeof ca === 'undefined') { continue }

      var xIn = x > ca.left && x < ca.left + ca.width
      var yIn = y > ca.top && y < ca.top + ca.height

      if (xIn && yIn) {
        return this.annotations[i]
      }
    }
    return false
  }

  onResize () {
    // console.log('onResize')
    // console.log(this.DOM.content)
    this.DOM.canvas.width = this.DOM.content.clientWidth
    this.DOM.canvas.height = this.DOM.content.clientHeight

    let annotations = this.getResult()
    this.annotations.length = 0
    this.annotateAll(annotations)
  }
}

export default Annotate
