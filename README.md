# eleme

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
## 数据流向

[数据流向图](https://moudicat-data.oss-cn-beijing.aliyuncs.com/cdn/2017/04/所有数据.png)

## 总结

> 解决1px-border

在移动端中，由于不同设备的像素比不同，比如视网膜设备devicePixelRatio为2，而有些安卓设备的devicePixelRatio为1.5。 这就造成了1px边框在上述手机中并不是标准的1px，就显得有些粗，不符合设计要求。所以需要解决这样一个问题。  关于设备像素比[这里有更深入的讲解](http://www.zhangxinxu.com/wordpress/2012/08/window-devicepixelratio/)


解决总体思路是将要加边框的元素创建一个伪元素，在伪元素中加入border1px， 如下：

```css
.needBorder {
  position: relative;
  &:after {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid $color;
  }
}
```

然而这样做确实有了一个边框，但是在设备像素比不为1的设备上还不是标准1px， 所以我们需要对这个伪元素进行处理，给他加上一个Y方向上的缩放：

```css
@media (-webkit-device-pixel-ratio: 1.5), (min-device-pixel-ratio: 1.5) {
  .border-1px {
    &::after {
      -webkit-transform: scaleY(.7);
      transform: scaleY(.7);
    }
  }
}
@media (-webkit-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
  .border-1px {
    &::after {
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
    }
  }
}
```
通过这两操作，就可以解决1px-border问题了！
