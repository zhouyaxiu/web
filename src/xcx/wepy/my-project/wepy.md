原 `bindtap="click"` 替换为 `@tap="click"`，原`catchtap="click"`替换为`@tap.stop="click"`

原 `capture-bind:tap="click"` 替换为 `@tap.capture="click"`，原`capture-catch:tap="click"`替换为`@tap.capture.stop="click"`。

- **进入项目根目录，安装polyfill**

```
npm install wepy-async-function --save
```

- **在app.wpy中引入polyfill**

```
import 'wepy-async-function'; 
```

- **在app.wpy中使API promise化**

```
export default class extends wepy.app {

    constructor () {
        super();
        this.use('promisify');
    }

}
```

事件传参使用优化后语法代替。 原`bindtap="click" data-index={{index}}`替换为`@tap="click({{index}})"`。

