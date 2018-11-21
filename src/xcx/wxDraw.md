wxDraw

## 配置项目

注意: 以下教程都是假定你有一定的小程序开发经验基础上的

### [创建目录](http://project.ueflat.xyz/#/config?id=%e5%88%9b%e5%bb%ba%e7%9b%ae%e5%bd%95)

首先你得有一个小程序项目（什么！😱你连小程序项目怎么搭都不知道 [😒点这里](https://mp.weixin.qq.com/debug/wxadoc/dev/api/)

目录就像这样（其实就是小程序的starter项目）

![img](http://project.ueflat.xyz/image/%E5%BC%80%E5%8F%91%E7%9B%AE%E5%BD%95.png)

### [引入文件](http://project.ueflat.xyz/#/config?id=%e5%bc%95%e5%85%a5%e6%96%87%e4%bb%b6)

将**wxdraw.min.js**或者**wxdraw.js**放到utils目录下 [下载压缩版](https://github.com/bobiscool/wxDraw/releases)

注意 **小程序** 对于有过多的中文注释以及过多的log的代码解析有点问题 ,会导致小程序即使在pc端模拟运行没有问题，但在手机上运行时加载失败。所以建议发布时使用min版本。

![img](http://project.ueflat.xyz/image/addJs.png)

### [添加canvas标签](http://project.ueflat.xyz/#/config?id=%e6%b7%bb%e5%8a%a0canvas%e6%a0%87%e7%ad%be)

打开你要添加canvas的页面，添加上的canvas

![img](http://project.ueflat.xyz/image/addCanvas.png)

wxml文件内部这样写

```html
<!--index.wxml-->
<view class="container">
 <canvas
  style="width: 400px; height: 500px;border:1px;position:absolute;top:0;left:0; solid black;"
  canvas-id="first"
  disable-scroll=true
  bindtouchstart="bindtouchstart"
  bindtouchmove="bindtouchmove"
  bindtouchend="bindtouchend"
  bindtap="bindtap"
  bindlongpress="bindlongpress"
  ></canvas>

</view>
<!--  为了省时间 我就写行间样式了-->
<!--  小程序所有标签都 不能进行DOM操作，绑定事件需要行间绑定-->
```

### [添加必要的js](http://project.ueflat.xyz/#/config?id=%e6%b7%bb%e5%8a%a0%e5%bf%85%e8%a6%81%e7%9a%84js)

![img](http://project.ueflat.xyz/image/addCanvasjs.png)

在js文件开头写上,引入wxDraw对象以及Shape对象

```js
var  wxDraw= require("../../../../util/wxdraw.js").wxDraw;
var Shape = require("../../../../util/wxdraw.js").Shape;
```

然后在Page函数里面添加与上述 对应的几个事件

如果 你需要canvas里面的图形可以响应事件，请你务必加上以下几个函数

```js
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    wxCanvas:null //    需要创建一个对象来接受wxDraw对象

  },
  bindtouchstart:function(e){
    // 检测手指点击开始事件
    this.wxCanvas.touchstartDetect(e);

  },
  bindtouchmove:function(e){
    // 检测手指点击 之后的移动事件
    this.wxCanvas.touchmoveDetect(e);
  },
  bindtouchend:function(){
     //检测手指点击 移出事件
    this.wxCanvas.touchendDetect();
  },
  bindtap:function(e){
    // 检测tap事件
    this.wxCanvas.tapDetect(e);
  },
  bindlongpress:function(e){
       // 检测longpress事件
    this.wxCanvas.longpressDetect(e);
  },
  onLoad:function(){
     ...
  }
```

## 快速开始

按照上述配置之后，我们得到了如下的index.js

```js
  //index.js
  const app = getApp()
  var wxDraw = require("../../utils/wxdraw.min.js").wxDraw;
  var Shape = require("../../utils/wxdraw.min.js").Shape;


  Page({
    data: {
      userInfo: {},
      hasUserInfo: false,
      wxCanvas:null// 注意这里 需要创建一个对象来接受wxDraw对象

    },
    //事件处理函数
    bindtouchstart:function(e){
      this.wxCanvas.touchstartDetect(e);

    },
    bindtouchmove:function(e){
      this.wxCanvas.touchmoveDetect(e);
    },
    bindtouchend:function(){
      this.wxCanvas.touchendDetect();
    },
    bindtap:function(e){
      this.wxCanvas.tapDetect(e);
    },
    bindlongpress:function(e){
      this.wxCanvas.longpressDetect(e);
    },
    onLoad: function () {

    }

  })
```

### [拿到canvas](http://project.ueflat.xyz/#/quick-start?id=%e6%8b%bf%e5%88%b0canvas)

现在 我们需要接收到自己的canvas对象并用于创建wxDraw对象, 在上述的页面onLoad周期里面，加上

```js
      var context = wx.createCanvasContext('first');//还记得 在wxml里面canvas的id叫first吗
      this.wxCanvas = new wxDraw(context,0,0,400,500);
      //初始化wxDraw对象 注意这里除了context的四个参数 就是canvas的位置以及长宽，😏还记得吗？
```

### [画一个矩形](http://project.ueflat.xyz/#/quick-start?id=%e7%94%bb%e4%b8%80%e4%b8%aa%e7%9f%a9%e5%bd%a2)

我们准备在canvas上画一个 位于(0,60)位置上，长宽均为40，颜色为`#2FB8AC` 旋转了 90度的的矩形

```js
 var rect = new Shape('rect', {x: 60, y: 60, w: 40, h: 40, fillStyle: "#2FB8AC", rotate: Math.PI/2 },'mix', true);
```

### [添加到canvas上](http://project.ueflat.xyz/#/quick-start?id=%e6%b7%bb%e5%8a%a0%e5%88%b0canvas%e4%b8%8a)

```js
 this.wxCanvas.add(rect);//添加到canvas上面
```

效果如图所示

![img](http://project.ueflat.xyz/image/rect.png)

### [让矩形动起来](http://project.ueflat.xyz/#/quick-start?id=%e8%ae%a9%e7%9f%a9%e5%bd%a2%e5%8a%a8%e8%b5%b7%e6%9d%a5)

我们想让它在两秒内向右移动100像素，同时y方向也移动100像素，然后3秒内原地打转5π,并且重复这个动画三次怎么办？

那就这么写

```js
    rect.animate({"x":"+=100","y":"+=100"},{duration:1000}).animate("rotate",Math.PI*5,{duration:1000}).start(3);
```

![img](http://project.ueflat.xyz/image/a1.gif)

还想做出更多效果 请看[详细文档](http://project.ueflat.xyz/#/api/wxDraw)





## [wxDraw对象](http://project.ueflat.xyz/#/api/wxDraw?id=wxdraw%e5%af%b9%e8%b1%a1)

> 用于创建wxDraw画布

参数说明：

| 参数    | 类型   | 必填 | 说明                     |
| ------- | ------ | ---- | ------------------------ |
| context | Object | 是   | canvas标签context        |
| x       | Number | 是   | canvas标签的绝对位置left |
| y       | Number | 是   | canvas标签的绝对位置top  |
| w       | Number | 是   | canvas标签的宽           |
| h       | Number | 是   | canvas标签的长           |

小程序所有标签都 不能进行DOM操作，所以**不能**用js直接获取canvas的位置以及大小，所以必须在初始化时候设置好准确的位置以及大小。

```js
    this.wxCanvas = new wxDraw(context,0,0,400,500);
```

## [方法](http://project.ueflat.xyz/#/api/wxDraw?id=%e6%96%b9%e6%b3%95)

### [add](http://project.ueflat.xyz/#/api/wxDraw?id=add)

添加图形对象

| 参数  | 类型   | 必填 | 说明     |
| ----- | ------ | ---- | -------- |
| shape | Object | 是   | 图形对象 |

### [clear](http://project.ueflat.xyz/#/api/wxDraw?id=clear)

清除画布

在页面不加载的时候 请一定要使用这方法 我也不知道为啥页面不加载了，但是小程序里面的变量都还在，所以一定要用这个来清除变量。

# [Shape对象](http://project.ueflat.xyz/#/api/Shape?id=shape%e5%af%b9%e8%b1%a1)

> 用于创建形状的时候使用

### [属性](http://project.ueflat.xyz/#/api/Shape?id=%e5%b1%9e%e6%80%a7)

| 参数      | 类型    | 必填 | 说明                                                         |
| --------- | ------- | ---- | ------------------------------------------------------------ |
| type      | String  | 是   | 创建形状类型  目前支持rect「矩形」，circle「圆形 包括扇形」，ellipse「椭圆」，polygon「正多边形」，cshape『这是一个生造词』「用户自定义的图形」，line「线段」 |
| option    | Object  | 是   | 所有关于形状的属性 详细说明在后面每一个形状里面              |
| way       | string  | 否   | 图形的绘制方式 填充 'fill',描边 'stroke',混合绘制 'mix'，默认fill |
| draggable | Bealoon | 否   | 是否可以拖拽，true 是可以，false是不可以，默认 false         |

### [方法](http://project.ueflat.xyz/#/api/Shape?id=%e6%96%b9%e6%b3%95)

#### [animate](http://project.ueflat.xyz/#/api/Shape?id=animate)

动画方法 将在animate里面详述

------

#### [start](http://project.ueflat.xyz/#/api/Shape?id=start)

同上

------

#### [setOrigin](http://project.ueflat.xyz/#/api/Shape?id=setorigin)

特别注意 设置了 draggable 为 true 之后 没法设置 rotateOrigin 为自身中心以外的点！！

设置形状的旋转中心

| 参数   | 类型  | 必填 | 说明                                         |
| ------ | ----- | ---- | -------------------------------------------- |
| origin | Array | 是   | 旋转中心设置 用于设置形状旋转的时候 围绕的点 |

在没有设置旋转中心时，形状是围绕自身质心旋转的

```js
rect.animate("rotate", Math.PI * 5, { duration: 5000 }).start(1);
```

![没有设置旋转中心](http://project.ueflat.xyz/image/a2.gif)

```js
rect.setOrigin([100,100]);//设置旋转中心为 （100 ，100）
rect.animate("rotate", Math.PI * 5, { duration: 5000 }).start(3);
```

![img](http://project.ueflat.xyz/image/roateWithOrigin.gif)

------

#### [updateOption](http://project.ueflat.xyz/#/api/Shape?id=updateoption)

更新形状的属性 几乎所有属性，具体属性将在每一个形状上单独讲解

| 参数   | 类型   | 必填 | 说明 |
| ------ | ------ | ---- | ---- |
| option | Object | 是   | 属性 |

##### [示例](http://project.ueflat.xyz/#/api/Shape?id=%e7%a4%ba%e4%be%8b)

创建了一个rect添加到画布上

```js
 var rect = new Shape('rect', { x: 60, y: 60, w: 40, h: 40, fillStyle: "#2FB8AC", rotate: Math.PI / 2 }, 'mix', true);
 this.wxCanvas.add(rect);
```

![img](http://project.ueflat.xyz/image/wgxzq.png)

再在后面加上

```js
    rect.updateOption({ fillStyle:"#E6324B"});
```

![img](http://project.ueflat.xyz/image/zhihou.png)

#### [clone](http://project.ueflat.xyz/#/api/Shape?id=clone)

从当前图形对象 clone出一个新的对象

现在在上面代码上作如下改变

```js
    let rect = ...//如上
    this.wxCanvas.add(rect);


    let rect2 = rect.clone();

    this.wxCanvas.add(rect2);

    rect.updateOption({ fillStyle:"#E6324B",x:100,y:200});
```

![img](http://project.ueflat.xyz/image/clone.png)

#### [bind](http://project.ueflat.xyz/#/api/Shape?id=bind)

绑定事件

事件类方法将在 事件里面说明

#### [unbind](http://project.ueflat.xyz/#/api/Shape?id=unbind)

取消绑定

同上

#### [updateLayer](http://project.ueflat.xyz/#/api/Shape?id=updatelayer)

就像CSS一样,wxDraw里面每一个图形 都有自己的图层，这会影响到他们之间的互相覆盖，以及当同时点击到了两个及其以上图形时只有最上层的图形才会响应事件。 各个图形最初的层级 与他们添加到wxDraw里面的先后顺序有关，简单地说就是「后来居上」，但是这个层级并不是就这样固定了，可以通过这个updateLayer来更改自己的层级。

| 参数  | 类型               | 必填 | 说明                                                         |
| ----- | ------------------ | ---- | ------------------------------------------------------------ |
| layer | String 或者 Number | 是   | 「层级」可以直接 设置具体的层级数字，但是如果大于最大层级或者小于零 那么当前物体层级只会按照 最大层级或者最小层级来设置 也可以设置相对增减 来移动层级比如 "+2" 那就是向上升2层，同理"-2"就是向下减两层，同样的 如果所设置的层级大于最大层级或者小于零 那么当前物体层级只会按照 最大层级或者最小层级来设置 |

示例

```js
    let rect2 = rect.clone();
    let rect3 = rect.clone();
    let rect4 = rect.clone();
    let rect5 = rect.clone();
    let rect6 = rect.clone();
    let rect7 = rect.clone();
    let rect8 = rect.clone();
    let rect9 = rect.clone();
    let rect10 = rect.clone();
    let rect11 = rect.clone();

    this.wxCanvas.add(rect2);
    this.wxCanvas.add(rect3);
    this.wxCanvas.add(rect4);
    this.wxCanvas.add(rect5);
    this.wxCanvas.add(rect6);
    this.wxCanvas.add(rect7);
    this.wxCanvas.add(rect8);
    this.wxCanvas.add(rect9);
    this.wxCanvas.add(rect10);

    rect2.updateOption({ fillStyle:"#F8DB9A",x:100,y:200});
    rect3.updateOption({ fillStyle:"#F3A358",x:110,y:200});
    rect4.updateOption({ fillStyle:"#933C60",x:120,y:200});
    rect5.updateOption({ fillStyle:"#37324A",x:130,y:200});
    rect6.updateOption({ fillStyle:"#329996",x:140,y:200});
    rect7.updateOption({ fillStyle:"#302C5B",x:150,y:200});
    rect8.updateOption({ fillStyle:"#3C6C84",x:160,y:200});
    rect9.updateOption({ fillStyle:"#92AD9F",x:170,y:200});
    rect10.updateOption({ fillStyle:"#E1D5A3",x:180,y:200});
```

![img](http://project.ueflat.xyz/image/layer.png)

再执行

```js
rect2.updateLayer("+2");
```

![img](http://project.ueflat.xyz/image/layer2.png)

#### [destroy](http://project.ueflat.xyz/#/api/Shape?id=destroy)

销毁 图形，将图形在wxDraw画布上 消除 没有参数，执行只要已经被添加到wxDraw画布里面就会被清除掉，不会影响其他的图形。

接着以上的代码

如果我执行

```js
rect2.destroy();
```

### [updateText](http://project.ueflat.xyz/#/api/Shape?id=updatetext)

参数 text !> 仅用于 text更新text用的 这里没设计好 后期会调整

![img](http://project.ueflat.xyz/image/destroy.png)





## [公共参数](http://project.ueflat.xyz/#/api/Shapes?id=%e5%85%ac%e5%85%b1%e5%8f%82%e6%95%b0)

| 参数        | 类型    | 必填 | 说明                                                         |
| ----------- | ------- | ---- | ------------------------------------------------------------ |
| lineWidth   | Number  | 否   | 线宽 默认0.5                                                 |
| shadow      | Object  | 否   | 阴影 内部参数在后面说明                                      |
| fillStyle   | Number  | 否   | 填充颜色 现在只支持 16进制颜色                               |
| strokeStyle | Number  | 否   | 边框颜色 只支持16进制颜色                                    |
| rotate      | Number  | 否   | 旋转角度                                                     |
| lineDash    | Array   | 否   | 设置虚线属性 具体参数后面说明                                |
| lineCap     | String  | 否   | 设置线条的端点样式。范围 'butt'、'round'、'square'           |
| lineJoin    | String  | 否   | 设置线条的交点样式。 范围 'bevel'、'round'、'miter'          |
| miterLimit  | Number  | 否   | 最大斜接长度 仅在 设置lineJoin为miter时生效                  |
| gra         | Array   | 否   | 渐变的 colorStop                                             |
| isLineDash  | Bealoon | 否   | 边框是否是 虚线                                              |
| needShadow  | Bealoon | 否   | 是否需要阴影 true时shadow项才会生效                          |
| needGra     | String  | 否   | 是否需要渐变 哪种渐变？ 'no'不渐变 'line' 线性'circle' 径向  true时上面的gra项才会生效 |

此处不再赘述说明 lineCap,lineJoin,miterLimit 如有不明白请看 「只是理解大概意思即可 小程序环境与浏览器环境有所不同 有些地方还是有些出入」

- [canvas lineCap](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap)
- [canvas lineJoin](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin)
- [miterLimit](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/miterLimit)

### [shadow参数说明](http://project.ueflat.xyz/#/api/Shapes?id=shadow%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

shadow内部有

| 参数    | 类型   | 说明                                 |
| ------- | ------ | ------------------------------------ |
| offsetX | Number | 阴影相对于形状在水平方向的偏移       |
| offsetY | Number | 阴影相对于形状在竖直方向的偏移       |
| blur    | Number | 0~100 阴影的模糊级别，数值越大越模糊 |
| color   | Color  | 阴影的颜色                           |

假设已经创建了一个rect

```js
 rect.updateOption({needShadow:true,shadow:{offsetX:5,offsetY:5,blur:5,color:"#000000"});
```

得到

![img](http://project.ueflat.xyz/image/shadow.png)

### [gra参数说明](http://project.ueflat.xyz/#/api/Shapes?id=gra%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

在needGra设为line或者circle时候，gra便会起作用， gra里面的参数为一个带有一个小于1的数值外加一个颜色值的数组的集合组成。 如

```
gra:[[0, '#00A0B0'], [0.2, '#6A4A3C'], [0.4, '#CC333F'], [0.6, '#EB6841'], [1, '#EDC951']]
```

小于最小 stop 的部分会按最小 stop 的 color 来渲染，大于最大 stop 的部分会按最大 stop 的 color 来渲染。

颜色组数至少为两组。

正如上图设置

needGra 为line时

![img](http://project.ueflat.xyz/image/line.png)

为 circle时候

![img](http://project.ueflat.xyz/image/circleGra.png)

w(ーー゛)我去 这颜色怎么这么恶心

### [lineDash 参数说明](http://project.ueflat.xyz/#/api/Shapes?id=linedash-%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

这是设置虚线的细节用的 是一个Array数组。一组描述交替绘制线段和间距（坐标空间单位）长度的数字。 如果数组元素的数量是奇数， 数组的元素会被复制并重复。例如， [5, 15, 25] 会变成 [5, 15, 25, 5, 15, 25]。[详细](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash)

```js
 var rect = new Shape('rect', { x: 60, y: 60, w: 40, h: 40, 
                         lineWidth: 20, fillStyle: "#2FB8AC", rotate: Math.PI / 2, 
                         needShadow: true, isLineDash: true, lineDash:[[5, 5], 5] }, 'stroke', true);
```

![img](http://project.ueflat.xyz/image/lineDash.png)

------

# [图形元素](http://project.ueflat.xyz/#/api/Shapes?id=%e5%9b%be%e5%bd%a2%e5%85%83%e7%b4%a0)

以下代码只写了创建图形部分 创建wxDraw对象以及添加到画布上部分代码全部略去

## [Circle](http://project.ueflat.xyz/#/api/Shapes?id=circle)

option参数

| 参数      | 类型    | 必填 | 说明                                                       |
| --------- | ------- | ---- | ---------------------------------------------------------- |
| x         | Number  | 是   | 圆形中心 x坐标                                             |
| y         | Number  | 是   | 圆中心 y坐标                                               |
| r         | Number  | 是   | 圆半径                                                     |
| sA        | Number  | 否   | 起始弧度，单位弧度（12点钟方向开始）                       |
| eA        | Number  | 否   | 终止弧度                                                   |
| closePath | Bealoon | 否   | 是否闭合路径，用于 stroke 的时候 是否绘制闭合线 **新功能** |

公共参数已经在最上方 说明

创建一个Cirle

```js
 let circle = new Shape('circle', { x: 100, y: 100, r: 40, sA: Math.PI/4, 
                             fillStyle: "#C0D860",
                            strokeStyle: "#CC333F", rotate: 20, lineWidth: 0, needGra: 'line', 
                              gra: [[0, '#00A0B0'], [0.2, '#6A4A3C'], [0.4, '#CC333F'], [0.6, '#EB6841'], [1, '#EDC951']]}, 
                           'fill', true)
```

得到「注意这个地方 rotate是20 所以给人感觉其实角度不是 12点钟方向」

![img](http://project.ueflat.xyz/image/sA.png)

## [Rect](http://project.ueflat.xyz/#/api/Shapes?id=rect)

option参数

| 参数 | 类型   | 必填 | 说明           |
| ---- | ------ | ---- | -------------- |
| x    | Number | 是   | 矩形中心 x坐标 |
| y    | Number | 是   | 矩形中心 y坐标 |
| w    | Number | 是   | 矩形宽         |
| h    | Number | 否   | 矩形高         |

公共参数已经在最上方 说明

> 到处都是rect的示例 这里就不再演示

## [Ellipse](http://project.ueflat.xyz/#/api/Shapes?id=ellipse)

option参数

| 参数 | 类型   | 必填 | 说明                                 |
| ---- | ------ | ---- | ------------------------------------ |
| x    | Number | 是   | 椭圆中心 x坐标                       |
| y    | Number | 是   | 椭圆中心 y坐标                       |
| a    | Number | 是   | 椭圆x方向轴 长轴短轴 得看a b谁大谁小 |
| b    | Number | 是   | 椭圆y方向轴                          |

公共参数已经在最上方 说明

```js
  let ellipse = new Shape('ellipse', { x: 200, y: 200, a: 40, b: 100, 
                             fillStyle: "#00A0B0", rotate: Math.PI / 7 }, 'mix', true)
```

![img](http://project.ueflat.xyz/image/ellipse.png)

## [polygon](http://project.ueflat.xyz/#/api/Shapes?id=polygon)

正多边形 option参数

| 参数  | 类型   | 必填 | 说明                      |
| ----- | ------ | ---- | ------------------------- |
| x     | Number | 是   | 正多边形中心 x坐标        |
| y     | Number | 是   | 正多边形中心 y坐标        |
| r     | Number | 是   | 正多边形 中心到各顶点距离 |
| sides | Number | 是   | 是多少边形状 最少为3      |

公共参数已经在最上方 说明

示例

```js
let polygon = new Shape('polygon', { x: 200, y: 200, r: 40, sides: 9, //9边形
                          fillStyle: "#FC354C", rotate: Math.PI / 4 }, 'mix', true)
```

![img](http://project.ueflat.xyz/image/polygon.png)

## [image](http://project.ueflat.xyz/#/api/Shapes?id=image)

图形对象 option参数

| 参数 | 类型   | 必填 | 说明                              |
| ---- | ------ | ---- | --------------------------------- |
| x    | Number | 是   | 图形中心 x坐标                    |
| y    | Number | 是   | 图形中心 y坐标                    |
| w    | Number | 是   | 图形宽                            |
| h    | Number | 是   | 图形高                            |
| file | string | 是   | 图形相对地址 「支持图片 png jpg」 |

示例

```js
let img = new Shape('image', { x: 100, y: 300,w:100,h:100, file:"./1.png"}, 'fill', true)
```

![img](http://project.ueflat.xyz/image/image.png)

## [cshape](http://project.ueflat.xyz/#/api/Shapes?id=cshape)

自定义形状 option参数

| 参数                         | 类型    | 必填 | 说明                 |
| ---------------------------- | ------- | ---- | -------------------- |
| points                       | Array   | 是   | 自定义形状的所有顶点 |
| smooth                       | Bealoon | 是   | 是否光滑             |
| ?> 公共参数已经在最上方 说明 |         |      |                      |

示例

```js
  let cshape = new Shape('cshape', {
      rotate: Math.PI / 2,
      points: [[70, 85], [40, 20], [24, 46], [2, 4], [14, 6], [4, 46]],
      lineWidth: 5,
      fillStyle: "#00A0B0",
      rotate: Math.PI / 7,
      needGra: 'circle',
      smooth:false,
      gra: [[0, '#00A0B0'], [0.2, '#6A4A3C'], [0.4, '#CC333F'], [0.6, '#EB6841'], [1, '#EDC951']]
    }, 'fill', true)
```

![img](http://project.ueflat.xyz/image/cshapeNs.png)

## [line](http://project.ueflat.xyz/#/api/Shapes?id=line)

自定义线段

| 参数   | 类型    | 必填 | 说明                                     |
| ------ | ------- | ---- | ---------------------------------------- |
| points | Array   | 是   | 自定义线段的所有顶点                     |
| smooth | Bealoon | 是   | 是否光滑 也就是是否是光滑的线段 默认true |

示例

不光滑

```js
let line = new Shape('line', { points:[[240,373],[11,32],[28,423],[12,105],[203,41],[128,0.06]], 
               strokeStyle: "#2FB8AC",lineWidth:1, rotate: 0, needShadow: true,smooth:false },  
               'fill', true)
```

![img](http://project.ueflat.xyz/image/lineNs.png)

光滑

![img](http://project.ueflat.xyz/image/lineS.png)

line的填充方式 无论是 fill还是stroke 还是mix 都是一样的 !> 由于小程序一些重要的api缺失「比如 isPointInPath」在点击的判断上 我

## [text](http://project.ueflat.xyz/#/api/Shapes?id=text)

文字

| 参数         | 类型   | 必填 | 说明                                                         |
| ------------ | ------ | ---- | ------------------------------------------------------------ |
| x            | Number | 是   | 字体x坐标                                                    |
| y            | Number | 是   | 字体y坐标                                                    |
| text         | String | 是   | 文字正文                                                     |
| fontSize     | Number | 否   | 字号                                                         |
| align        | String | 否   | 左右对齐方式 可选值 'left'、'center'、'right' 「别告诉我你不懂」 |
| textBaseline | String | 否   | 上下对齐方式 可选值 'top'、'bottom'、'middle'、'normal'      |

------

##### [align](http://project.ueflat.xyz/#/api/Shapes?id=align)

![img](http://project.ueflat.xyz/image/align.png)

------

##### [textBaseline](http://project.ueflat.xyz/#/api/Shapes?id=textbaseline)

![img](http://project.ueflat.xyz/image/textBaseline.png)

------

示例

```js
  let text = new Shape('text', { x: 200, y: 200, text: "我是测试文字", 
                      fillStyle: "#E6781E", rotate: Math.PI / 3}
                      'fill', true)
```

![img](http://project.ueflat.xyz/image/text.png)





# [动画](http://project.ueflat.xyz/#/api/Animation?id=%e5%8a%a8%e7%94%bb)

几乎所有的是数字的属性都可以进行动画

## [公共参数](http://project.ueflat.xyz/#/api/Animation?id=%e5%85%ac%e5%85%b1%e5%8f%82%e6%95%b0)

| 参数        | 类型    | 必填 | 是否支持动画 |
| ----------- | ------- | ---- | ------------ |
| lineWidth   | Number  | 否   | 是           |
| shadow      | Object  | 否   | 是           |
| fillStyle   | Number  | 否   | 是           |
| strokeStyle | Number  | 否   | 是           |
| rotate      | Number  | 否   | 是           |
| lineDash    | Array   | 否   | 是           |
| lineCap     | String  | 否   | 否           |
| lineJoin    | String  | 否   | 否           |
| miterLimit  | Number  | 否   | 是           |
| gra         | Array   | 否   | 否           |
| isLineDash  | Bealoon | 否   | 否           |
| needShadow  | Bealoon | 否   | 否           |
| needGra     | String  | 否   | 否           |

示例

创建了矩形线框 如图

```js
 var rect = new Shape('rect', { x: 60, y: 60, w: 40, h: 40, lineWidth: 20, fillStyle: "#2FB8AC", 
                                rotate: Math.PI / 2, needShadow: true}, 'stroke', true);
```

![img](http://project.ueflat.xyz/image/strokeRect.png)

然后执行

```js
rect.animate("shadow", { color:"#F56218",offsetX:100,offsetY:100}, { duration: 1000 })
              .animate({ "lineWidth": "-=10", "y": "-=30", "rotate": "10", "fillStyle": "#1BB0CE" },
               { duration: 1000 }).start(3);
```

![img](http://project.ueflat.xyz/image/a5.gif)

从这里就可以看出 Shape对象的animate方法支持链式调用

### [animate 方法](http://project.ueflat.xyz/#/api/Animation?id=animate-%e6%96%b9%e6%b3%95)

#### [单属性变化动画](http://project.ueflat.xyz/#/api/Animation?id=%e5%8d%95%e5%b1%9e%e6%80%a7%e5%8f%98%e5%8c%96%e5%8a%a8%e7%94%bb)

| 参数   | 类型              | 必填 | 说明                                                         |
| ------ | ----------------- | ---- | ------------------------------------------------------------ |
| whitch | String            | 是   | 哪个属性变化                                                 |
| exe    | String 或者Number | 是   | 怎么变化 支持直接设定目标值,也支持 "+=100" "-=100" 这种相对的形式 |
| option | Object            | 否   | 后面详解                                                     |

```js
rect.animate("x", "+=100", { duration: 1000 })
            .start(3);
```

#### [多属性变化动画](http://project.ueflat.xyz/#/api/Animation?id=%e5%a4%9a%e5%b1%9e%e6%80%a7%e5%8f%98%e5%8c%96%e5%8a%a8%e7%94%bb)

| 参数   | 类型   | 必填 | 说明         |
| ------ | ------ | ---- | ------------ |
| whitch | Object | 否   | 哪些属性变化 |
| option | Object | 否   | 后面详解     |

```js
rect.animate({ "lineWidth": "-=10", "y": "-=30", "rotate": "10", "fillStyle": "#1BB0CE" },
               { duration: 1000 }).start(3);
```

特别注意 `shadow` `lineDash` `fillStyle` `strokeStyle` 这类特殊值只能设置目标值而不能像`x`,`y`一样设置"+=100"这种相对目标，即使shadow里面有offsetX这类接收纯数字的值

##### [option参数详解](http://project.ueflat.xyz/#/api/Animation?id=option%e5%8f%82%e6%95%b0%e8%af%a6%e8%a7%a3)

| 参数      | 类型     | 必填 | 说明                                                         |
| --------- | -------- | ---- | ------------------------------------------------------------ |
| duration  | Number   | 否   | 动画持续时间单位ms 默认 1000ms                               |
| onStart   | Function | 否   | 动画开始的时候得回调函数                                     |
| onLooping | Function | 否   | 动画循环的时候得回调函数                                     |
| onEnd     | Function | 否   | 动画结束的时候得回调函数                                     |
| easing    | String   | 否   | 缓动动画类型 默认'linear'[看这里easing的图示](http://easings.net/zh-cn) |

###### [支持的easing](http://project.ueflat.xyz/#/api/Animation?id=%e6%94%af%e6%8c%81%e7%9a%84easing)

- linear
- easeOutQuad
- easeInOutQuad
- easeInCubic
- easeOutCubic
- easeInOutCubic
- easeInQuart
- easeOutQuart
- easeInOutQuart
- easeInQuint
- easeOutQuint
- easeInOutQuint
- easeInSine
- easeOutSine
- easeInOutSine
- easeInExpo
- easeOutExpo
- easeInOutExpo
- easeInCirc
- easeOutCirc
- easeInOutCirc
- easeOutBounce
- easeInBack
- easeOutBack
- easeInOutBack
- elastic
- swingFromTo
- swingFrom
- swingTo
- bounce
- bouncePast
- easeFromTo
- easeFrom
- easeTo

### [start方法](http://project.ueflat.xyz/#/api/Animation?id=start%e6%96%b9%e6%b3%95)

start是与animate一起使用的，animate执行之后，使用start变会立即开始动画。

- `start()` 一个参数不加 便是执行一次
- `start(true)` 加true 便是一直重复这段动画
- `start(n)` 加大于0的整数n 便是重复这段动画n次

------

## [circle](http://project.ueflat.xyz/#/api/Animation?id=circle)

option参数

| 参数 | 类型   | 必填 | 支持动画否 |
| ---- | ------ | ---- | ---------- |
| x    | Number | 是   | 是         |
| y    | Number | 是   | 是         |
| r    | Number | 是   | 是         |
| sA   | Number | 否   | 是         |
| eA   | Number | 否   | 是         |

示例

```js
let circle = new Shape('circle', { x: 160, y: 160, r: 40, sA: 0 fillStyle: "#C0D860",
                         strokeStyle: "#CC333F", rotate: 20, lineWidth: 0, 
                            needGra: 'line', gra: [[0, '#00A0B0'], [0.2, '#6A4A3C'], [0.4, '#CC333F'], 
                            [0.6, '#EB6841'], [1, '#EDC951']]}, 'fill', true);
```

执行

```js
circle.animate("sA", Math.PI*3/2, { duration: 1500, easing:"bouncePast" }).start(1);
```

![img](http://project.ueflat.xyz/image/cAa1.gif)

## [rect](http://project.ueflat.xyz/#/api/Animation?id=rect)

option参数

| 参数 | 类型   | 必填 | 事都支持动画 |
| ---- | ------ | ---- | ------------ |
| x    | Number | 是   | 是           |
| y    | Number | 是   | 是           |
| w    | Number | 是   | 是           |
| h    | Number | 否   | 是           |

创建矩形

```js
    var rect = new Shape('rect', { x: 160, y: 160, w: 40, h: 40, lineWidth: 20, 
                             fillStyle: "#2FB8AC", rotate: Math.PI / 2, 
                              needShadow: true, isLineDash: true, 
                              lineDash: [[5, 5], 5], lineJoin:"miter",miterLimit:100 }, 'mix', true);
```

动画

```js
rect.animate({ lineWidth: 10, w: "+=100", h: "+=50" }, { duration: 1000 })
    .animate({ x: "+=100", "rotate": "+10"}, { duration: 1000 })
    .animate({ lineDash: [[8, 6], 5] }, { duration: 1000 }).start(2)
```

![img](http://project.ueflat.xyz/image/rectA1.gif)

## [ellipse](http://project.ueflat.xyz/#/api/Animation?id=ellipse)

| 参数 | 类型   | 必填 | 是否支持动画 |
| ---- | ------ | ---- | ------------ |
| x    | Number | 是   | 是           |
| y    | Number | 是   | 是           |
| a    | Number | 是   | 是           |
| b    | Number | 是   | 是           |

图形

```js
let ellipse = new Shape('ellipse', { x: 200, y: 200, a: 40, b: 100, 
                          fillStyle: "#00A0B0", rotate: Math.PI / 7, shadow:{blur:2}}, 'mix', true)
```

动画

```js
    ellipse.animate({ a: "+=100", b: "-=20" }).animate({a: "-=100", b:"+=20"}).start(3)
```

![img](http://project.ueflat.xyz/image/ellipse.gif)

## [polygon](http://project.ueflat.xyz/#/api/Animation?id=polygon)

正多边形 option参数

| 参数  | 类型   | 必填 | 是否支持动画 |
| ----- | ------ | ---- | ------------ |
| x     | Number | 是   | 是           |
| y     | Number | 是   | 是           |
| r     | Number | 是   | 是           |
| sides | Number | 是   | 否           |

示例

```js
let polygon = new Shape('polygon', { x: 200, y: 200, r: 40, sides: 9, //9边形
                          fillStyle: "#FC354C", rotate: Math.PI / 4 }, 'mix', true)
```

执行

```js
    polygon.animate({ r: "+=100", rotate: "-=20" })
            .animate({r: "-=100", lineWidth:"+=20"}).start(3)// 这里没有加duration 还有easing是因为它们都有默认的参数 一个是1000ms 一个是'linear'
```

![img](http://project.ueflat.xyz/image/polygon.gif)

## [line](http://project.ueflat.xyz/#/api/Animation?id=line)

自定义线段

| 参数   | 类型    | 必填 | 是都支持动画 |
| ------ | ------- | ---- | ------------ |
| points | Array   | 是   | 否           |
| smooth | Bealoon | 是   | 否           |

虽然线段没有设置x,y这个属性，但实际上一旦点位给出，那么所有顶点的质心就已经确定，而线段的移动旋转都是以质心为动画对象来实现的。

创建

```js
let line = new Shape('line', { points:[[240,373],[11,32],[28,423],[12,105],[203,41],[128,0.06]], 
               strokeStyle: "#2FB8AC",lineWidth:1, rotate: 0, needShadow: true,smooth:false },  
               'fill', true)
```

动画

```js
    line.animate({ x: "+=100", y: "-=20" }).
         animate({rotate: "-=1"}).start(3)
```

![img](http://project.ueflat.xyz/image/lineRo.gif)

## [cshape](http://project.ueflat.xyz/#/api/Animation?id=cshape)

与line类似也是如此

```js
let cshape = new Shape('cshape', {
      rotate: Math.PI / 2,
      points: [[70, 85], [40, 20], [24, 46], [2, 4], [14, 6], [4, 46]],
      lineWidth: 5,
      fillStyle: "#00A0B0",
      rotate: Math.PI / 7,
      needGra: 'circle',
      smooth:false,
      gra: [[0, '#00A0B0'], [0.2, '#6A4A3C'], [0.4, '#CC333F'], [0.6, '#EB6841'], [1, '#EDC951']]
    }, 'fill', true)


    this.wxCanvas.add(cshape);



    cshape.animate({ x: "+=100", y: "+=120" }).animate({
      rotate: "-=10"}).start(3)
```

![img](http://project.ueflat.xyz/image/cshapeRo.gif)

## [text](http://project.ueflat.xyz/#/api/Animation?id=text)

| 参数                                                         | 类型   | 必填 | 是否支持动画 |
| ------------------------------------------------------------ | ------ | ---- | ------------ |
| x                                                            | Number | 是   | 是           |
| y                                                            | Number | 是   | 是           |
| text                                                         | String | 是   | 否           |
| fontSize                                                     | Number | 否   | 是           |
| ... 其余属性都是不支持动画的「除了公共属性里面 支持动画的 比如颜色 旋转 以及阴影」 |        |      |              |

```js
let text = new Shape('text', { x: 100, y: 100, text: "我是测试文字", fillStyle: "#E6781E", rotate: Math.PI / 3, needGra: 'no', gra: [[0, '#00A0B0'], [0.2, '#6A4A3C'], [0.4, '#CC333F'], [0.6, '#EB6841'], [1, '#EDC951']]}, 'fill', true)

this.wxCanvas.add(text)

text.animate({ x: "+=40", y: "+=20", fillStyle: "#2B4E72" },{duration:2000}).animate({
      rotate: "-=10",
      fontSize:"+=30"
    }, { duration: 2000 }).start(1)
```

![img](http://project.ueflat.xyz/image/textA.gif)





## [事件绑定](http://project.ueflat.xyz/#/api/Event?id=%e4%ba%8b%e4%bb%b6%e7%bb%91%e5%ae%9a)

事件的绑定

要想绑定事件 首先必须按照项目基本设置里面一样将一些感应事件的函数绑定到canvas标签上[看这里](http://project.ueflat.xyz/#/config?id=%e6%b7%bb%e5%8a%a0%e5%bf%85%e8%a6%81%e7%9a%84js)

然后就特别简单了

支持的事件有

- drag 「这不是原生事件」
- touchstart
- touchmove
- touchend
- tap
- longpress
- tap

[详细解释看这里](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/event.html)

譬如我已经创建好了一个ellipse，我要他点击后a轴变成100,填充色变为灰色

```js
 ellipse.bind('tap',function(){
      ellipse.updateOption({a:100,fillStyle:"#cccddd"})
    });
```

![img](http://project.ueflat.xyz/image/tap.gif)

同理其他

示例 longpress

```js
ellipse.bind('longpress',function(){

      rect.destroy();
    });
```

![img](http://project.ueflat.xyz/image/longpress.gif)

## [解除事件绑定](http://project.ueflat.xyz/#/api/Event?id=%e8%a7%a3%e9%99%a4%e4%ba%8b%e4%bb%b6%e7%bb%91%e5%ae%9a)

这个就更简单了 只要你不是bind的匿名函数

```js
let fuc = function(){

      rect.destroy();
    });


ellipse.bind('longpress',fuc);
```

解除时只需要

```js
ellipse.unbind('longpress',fuc);
```

那么此事件就不会触发这个函数了 是不是特别像DOM操作 O(∩_∩)O哈哈~

## [事件特别说明](http://project.ueflat.xyz/#/api/Event?id=%e4%ba%8b%e4%bb%b6%e7%89%b9%e5%88%ab%e8%af%b4%e6%98%8e)

1. 由于小程序的canvas并不带isPointInPath这一类比较底层的与计算机图形学相关的API，所以wxDraw所有关于图形的事件判断，都是通过将点位进过矩阵变化再经过数学的特别算法计算的，在多边形上面基本没有问题，**但是在纯边的line上或者是lineWidth特别宽的情况下的扇形以及lineWidth特别宽情况下的cshape**，它们的事件在有一些地方会感应不到，这一点，现在我还没想到更好的解决方法，还请避免lineWidth特别大的情况。
2. 在一个物体进行动画时，为了避免冲突，所以即使他设置了可以drag，但是在他进行动画时是drag不动的。

# [开发指南](http://project.ueflat.xyz/#/develop?id=%e5%bc%80%e5%8f%91%e6%8c%87%e5%8d%97)

## [开发环境](http://project.ueflat.xyz/#/develop?id=%e5%bc%80%e5%8f%91%e7%8e%af%e5%a2%83)

- 设备 Macbook pro
- 系统 OSX
- 包管理器 npm 3.10.10
- 打包工具 rollup version 0.50.0
- 微信调试 微信开发者工具 v1.01.17
- 基础库 1.6
- 实体测试机 一加3
- 其他辅助 babel

## [src目录简述](http://project.ueflat.xyz/#/develop?id=src%e7%9b%ae%e5%bd%95%e7%ae%80%e8%bf%b0)

```
├── index.js // 引入文件 wxDraw老巢
├── animation  //动画控制中心
│   ├── animation.js
│   ├── animationFrag.js
│   ├── animationFragWraper.js
│   ├── animationFrame.js
│   ├── animationFunc.js
│   ├── animationTimer.js
│   └── specialAtrribute.js
├── handler //没用到 事件处理都放到了shape里面
│   └── event.js
├── shape   //图形中心  用户想自定义图形在此处加
│   ├── circle.js
│   ├── cshape.js
│   ├── ellipse.js
│   ├── line.js
│   ├── mixins
│   │   ├── commonAttr.js
│   │   ├── commonMethods.js
│   │   ├── getCurvePoints.js
│   │   └── points.js
│   ├── path.js
│   ├── polygon.js
│   ├── rect.js
│   ├── shape.js
│   ├── shapeBase.js
│   └── text.js
├── store  //仓库
│   └── store.js
└── util //工具库
    ├── eventBus.js
    ├── matrix.js //矩阵计算
    ├── patch.js
    └── utils.js
```