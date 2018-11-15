<template>
  <div id="drag">
    <div class="title">
        <h2>{{ title }}</h2>
        <div>
          <a class="min" href="javascript:;" title="最小化"></a>
        </div>
    </div>
    <div class="resizeL"></div>
    <div class="resizeT"></div>
    <div class="resizeR"></div>
    <div class="resizeB"></div>
    <div class="resizeLT"></div>
    <div class="resizeTR"></div>
    <div class="resizeBR"></div>
    <div class="resizeLB"></div>
    <div class="content drag-content" id="dragcontent">
      <div class="drag-content-in">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    // 初始高度
    dragHeight: {
      type: Number,
      default: 115
    },
    // 初始宽度
    dragWidth: {
      type: Number,
      default: 350
    },
    // 最小宽度
    // dragMinWidth: {
    //   type: Number,
    //   default: 300
    // },
    // 最小高度
    dragMinHeight: {
      type: Number,
      default: 115
    },
    // 最小Y坐标
    minY: {
      type: Number,
      default: 0
    },
    // 下端最低位置
    bottom: {
      type: Number,
      default: 0
    },
    // 起始x坐标
    startX: {
      type: Number,
      default: 50
    },
    // 起始y坐标
    startY: {
      type: Number,
      default: 100
    }
  },
  mounted: function () {
    let vm = this
    window.onload = window.onresize = function () {
      let oDrag = document.getElementById('drag')
      let oTitle = vm.getByClass('title', oDrag)[0]
      let oL = vm.getByClass('resizeL', oDrag)[0]
      let oT = vm.getByClass('resizeT', oDrag)[0]
      let oR = vm.getByClass('resizeR', oDrag)[0]
      let oB = vm.getByClass('resizeB', oDrag)[0]
      let oLT = vm.getByClass('resizeLT', oDrag)[0]
      let oTR = vm.getByClass('resizeTR', oDrag)[0]
      let oBR = vm.getByClass('resizeBR', oDrag)[0]
      let oLB = vm.getByClass('resizeLB', oDrag)[0]

      vm.drag(oDrag, oTitle)
      // 四角
      vm.resize(oDrag, oLT, true, true, false, false)
      vm.resize(oDrag, oTR, false, true, false, false)
      vm.resize(oDrag, oBR, false, false, false, false)
      vm.resize(oDrag, oLB, true, false, false, false)
      // 四边
      vm.resize(oDrag, oL, true, false, false, true)
      vm.resize(oDrag, oT, false, true, true, false)
      vm.resize(oDrag, oR, false, false, false, true)
      vm.resize(oDrag, oB, false, false, true, false)

      // 初始化时的位置
      oDrag.style.left = vm.startX + 'px'
      oDrag.style.top = vm.startY + 'px'
      // oDrag.style.minWidth = vm.dragMinWidth + 'px'
      oDrag.style.minHeight = vm.dragMinHeight + 'px'
      oDrag.style.height = vm.dragHeight + 'px'
      oDrag.style.width = vm.dragWidth + 'px'
    }
  },
  methods: {
    getById (id) {
      return typeof id === 'string' ? document.getElementById(id) : id
    },
    getByClass (sClass, oParent) {
      let aClass = []
      let reClass = new RegExp('(^| )' + sClass + '( |$)')
      let aElem = this.getByTagName('*', oParent)
      for (let i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i])
      return aClass
    },
    getByTagName (elem, obj) {
      return (obj || document).getElementsByTagName(elem)
    },
    /* -------------------------- +
        拖拽函数
    +-------------------------- */
    drag (oDrag, handle) {
      let vm = this
      let disX = 0
      let disY = 0
      let oMin = this.getByClass('min', oDrag)[0]
      // let oMax = this.getByClass('max', oDrag)[0]
      // let oRevert = this.getByClass('revert', oDrag)[0]
      // let oClose = this.getByClass('close', oDrag)[0]
      handle = handle || oDrag
      handle.style.cursor = 'move'
      handle.onmousedown = function (e) {
        let event = e || window.event
        disX = event.clientX - oDrag.offsetLeft
        disY = event.clientY - oDrag.offsetTop

        document.onmousemove = function (e) {
          let event = e || window.event
          let iL = event.clientX - disX
          let iT = event.clientY - disY
          let maxL = document.documentElement.clientWidth - oDrag.offsetWidth
          // let maxT = document.documentElement.clientHeight - oDrag.offsetHeight
          // 父组件边界
          let pW = oDrag.parentNode.clientWidth - oDrag.offsetWidth
          // let pH = oDrag.parentNode.clientHeight - oDrag.offsetHeight
          maxL >= pW && (maxL = pW)
          // maxT >= pH && (maxT = pH)

          let parentY = oDrag.parentNode.offsetTop
          let parentH = oDrag.parentNode.offsetHeight
          let maxT = parentY + parentH - oDrag.offsetHeight
          // let parentX = oDrag.parentNode.style.left

          iL <= 0 && (iL = 0)
          iT <= parentY && (iT = parentY)
          iT <= vm.minY && (iT = vm.minY)

          iL >= maxL && (iL = maxL)
          iT >= maxT && (iT = maxT)

          oDrag.style.left = iL + 'px'
          oDrag.style.top = iT + 'px'

          return false
        }

        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
          this.releaseCapture && this.releaseCapture()
        }
        this.setCapture && this.setCapture()
        return false
      }
      // 最小化按钮
      oMin.onclick = function () {
        oDrag.style.display = 'none'
        let parent = document.getElementById('drag').parentNode
        let oA = document.createElement('a')
        oA.className = 'open'
        oA.href = 'javascript:;'
        oA.title = '还原'
        parent.appendChild(oA)
        oA.onclick = function () {
          oDrag.style.display = 'block'
          parent.removeChild(this)
          this.onclick = null
        }
      }
      // 阻止冒泡
      oMin.onmousedown = function (event) {
        this.onfocus = function () { this.blur() };
        (event || window.event).cancelBubble = true
      }
    },
    /* -------------------------- +
        改变大小函数
    +-------------------------- */
    resize (oParent, handle, isLeft, isTop, lockX, lockY) {
      let vm = this
      handle.onmousedown = function (e) {
        let event = e || window.event
        let disX = event.clientX - handle.offsetLeft
        let disY = event.clientY - handle.offsetTop
        let iParentTop = oParent.offsetTop
        let iParentLeft = oParent.offsetLeft
        let iParentWidth = oParent.offsetWidth
        let iParentHeight = oParent.offsetHeight

        document.onmousemove = function (e) {
          let event = e || window.event
          let parentY = oParent.parentNode.offsetTop
          let parentH = oParent.parentNode.offsetHeight

          let iL = event.clientX - disX
          let iT = event.clientY - disY
          let maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2
          // let maxH = document.documentElement.clientHeight - oParent.offsetTop - vm.bottom
          let maxH = parentY + parentH - oParent.offsetTop

          let iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL
          let iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT

          let pW = oParent.parentNode.clientWidth - oParent.offsetLeft - 2
          // let pH = oParent.parentNode.clientHeight - oParent.offsetTop
          maxW >= pW && (maxW = pW)
          // maxH >= pH && (maxH = pH)

          if (isLeft) {
            let left = iParentLeft + iL
            left <= 0 && (left = 0)
            oParent.style.left = left + 'px'
          }
          if (isTop) {
            let top = iParentTop + iT
            top < parentY && (top = parentY)
            oParent.style.top = top + 'px'
          }
          iW < vm.dragMinWidth && (iW = vm.dragMinWidth)
          iW > maxW && (iW = maxW)
          lockX || (oParent.style.width = iW + 'px')

          iH < vm.dragMinHeight && (iH = vm.dragMinHeight)
          iH > maxH && (iH = maxH)
          lockY || (oParent.style.height = iH + 'px')

          if ((isLeft && iW === vm.dragMinWidth) || (isTop && iH === vm.dragMinHeight)) document.onmousemove = null

          return false
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
        return false
      }
    }
  }
}
</script>
<style>
/* body,div,h2{margin:0;padding:0;}
body{font:12px/1.5 \5fae\8f6f\96c5\9ed1;color:#333;} */

/* drag */
#drag{
  z-index:2000;
  position:absolute;
  top:100px;
  left:100px;
  border-radius: 5px;
  background:#e9e9e9;
  border-radius:5px;
  box-shadow:0 1px 3px 2px #999;
  overflow: hidden;
}
#drag .title{position:relative;height:27px;margin:5px;}
#drag .title h2{font-size:14px;height:27px;line-height:24px;border-bottom:1px solid #A1B4B0;}
#drag .title div{position:absolute;height:19px;top:2px;right:0;}
#drag .title a,a.open{float:left;width:21px;height:19px;display:block;margin-left:5px;background:url(img/tool.png) no-repeat;}
a.open{position:absolute;top:101px;left:10%;margin-left:-10px;background-position:0 0; z-index:2000;}
a.open:hover{background-position:0 -29px;}
#drag .title a.min{background-position:-29px 0;}
#drag .title a.min:hover{background-position:-29px -29px;}
#drag .title a.max{background-position:-60px 0;}
#drag .title a.max:hover{background-position:-60px -29px;}
#drag .title a.revert{background-position:-149px 0;display:none;}
#drag .title a.revert:hover{background-position:-149px -29px;}
#drag .title a.close{background-position:-89px 0;}
#drag .title a.close:hover{background-position:-89px -29px;}
#drag .content{overflow:auto;margin:0 5px;}
#drag .resizeBR{position:absolute;width:14px;height:14px;right:0;bottom:0;overflow:hidden;cursor:nw-resize;}
#drag .resizeL,#drag .resizeT,#drag .resizeR,#drag .resizeB,#drag .resizeLT,#drag .resizeTR,#drag .resizeLB{position:absolute;background:#000;overflow:hidden;opacity:0;filter:alpha(opacity=0);}
#drag .resizeL,#drag .resizeR{top:0;width:5px;height:100%;cursor:w-resize;}
#drag .resizeR{right:0;}
#drag .resizeT,#drag .resizeB{width:100%;height:5px;cursor:n-resize;}
#drag .resizeT{top:0;}
#drag .resizeB{bottom:0;}
#drag .resizeLT,#drag .resizeTR,#drag .resizeLB{width:8px;height:8px;background:#FF0;}
#drag .resizeLT{top:0;left:0;cursor:nw-resize;}
#drag .resizeTR{top:0;right:0;cursor:ne-resize;}
#drag .resizeLB{left:0;bottom:0;cursor:ne-resize;}
.drag-content{
  height: 90%;
  overflow: auto;
  background-color: #fff;
  padding-bottom: 20px;
}
.drag-content-in{
  padding:20px;
  /* overflow: auto; */
}
</style>
