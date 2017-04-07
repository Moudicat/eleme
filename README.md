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

![数据流向图](https://moudicat-data.oss-cn-beijing.aliyuncs.com/cdn/2017/04/所有数据.png)

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

> 小球的运动

  在项目中，有个添加购物车的小球运动动画，这里我们就来分析一下。
 
 首先要实现这个效果就要了解Vue的transition，Vue 在插入、更新或者移除 DOM 时，提供多种不同方式的应用过渡效果。
 
 Vue 提供了 transition 的封装组件，在下列情形中，可以给任何元素和组件添加 entering/leaving 过渡
 
* 条件渲染 （使用 v-if）
* 条件展示 （使用 v-show）
* 动态组件
* 组件根节点

```css
.fade-enter-active, .fade-leave-active {    // 这里是离开 进入时候的transition
	transition: opacity .5s
}
.fade-enter, .fade-leave-active {  //定义初始状态和结束状态  toggle
	opacity: 0
}
```

会有 4 个(CSS)类名在 enter/leave 的过渡中切换

1. v-enter: 定义进入过渡的开始状态。在元素被插入时生效，在下一个帧移除。
2. v-enter-active: 定义进入过渡的结束状态。在元素被插入时生效，在 transition/animation 完成之后移除。
3. v-leave: 定义离开过渡的开始状态。在离开过渡被触发时生效，在下一个帧移除。
4. v-leave-active: 定义离开过渡的结束状态。在离开过渡被触发时生效，在 transition/animation 完成之后移除。

以下代码是小球的结构，在ball-container中v-for循环数组中的小球。 给每个小球绑上阶段事件。 inner的作用是负责x轴的位移，ball负责y位移。

```html
<div class="ball-container">
  <div v-for="ball in balls">
    <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
      <div class="ball" v-show="ball.show">
        <div class="inner inner-hook"></div>
      </div>
    </transition>
  </div>
</div>
```

```javascript
beforeDrop(target) {
  let count = this.balls.length;
  while (count--) {
    let ball = this.balls[count];
    if (ball.show) {
      let rect = ball.target.getBoundingClientRect();
      let x = rect.left - 32;
      let y = -(window.innerHeight - rect.top - 22);
      target.style.display = '';
      target.style.webkitTransform = `translate3d(0,${y}px,0)`;
      target.style.transform = `translate3d(0,${y}px,0)`;
      let inner = target.getElementsByClassName('inner-hook')[0];
      inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
      inner.style.transform = `translate3d(${x}px,0,0)`;
    }
  }
}

dropping(target, done) {
  /* eslint-disable no-unused-vars */
  let rf = target.offsetHeight; // 手动触发浏览器重绘
  this.$nextTick(() => {
    target.style.webkitTransform = 'translate3d(0,0,0)';
    target.style.transform = 'translate3d(0,0,0)';
    let inner = target.getElementsByClassName('inner-hook')[0];
    inner.style.webkitTransform = `translate3d(0,0,0)`;
    inner.style.transform = `translate3d(0,0,0)`;
    target.addEventListener('transitionend', done);
  });
}

afterDrop(target) {
  let ball = this.dropBalls.shift();
  if (ball) {
    ball.show = false;
    target.style.display = 'none';
  }
}
```
