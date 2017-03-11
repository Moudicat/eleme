<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount>0}">
              <i class="icon-shopping_cart"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalCount>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h2 class="title">购物车</h2>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @add="addFood"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from '../cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';

  export default {
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [
            {
              count: 0,
              price: 0
            }
          ];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return this.minPrice + '元起送';
        } else if (this.totalPrice < this.minPrice) {
          return '还差' + (this.minPrice - this.totalPrice) + '元起送';
        } else {
          return '结算';
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      addFood(target) {
        this.drop(target);
      },
      drop(target) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.target = target;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
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
      },
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
      },
      afterDrop(target) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          target.style.display = 'none';
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        } else {
          alert('需要支付' + this.totalPrice + '元');
        }
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../common/style/mixin";

  .shopcart {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
    .content {
      display: flex;
      background-color: #141d27;
      font-size: 0;
      .content-left {
        flex: 1;
        .logo-wrapper {
          display: inline-block;
          vertical-align: top;
          position: relative;
          top: -10px;
          margin: 0 12px;
          padding: 6px;
          width: 56px;
          height: 56px;
          box-sizing: border-box;
          border-radius: 50%;
          background: #141d27;
          .logo {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #2b343c;
            text-align: center;
            &.highlight {
              background: rgb(0, 160, 220);
            }
            &.highlight .icon-shopping_cart {
              color: #fff;
            }
            .icon-shopping_cart {
              line-height: 44px;
              font-size: 24px;
              color: #80858a;
            }
          }
          .num {
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 16px;
            font-size: 9px;
            font-weight: 700;
            color: #fff;
            background: rgb(240, 20, 20);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4);
          }
        }
        .price {
          display: inline-block;
          vertical-align: top;
          margin-top: 12px;
          line-height: 24px;
          padding-right: 12px;
          box-sizing: border-box;
          border-right: 1px solid rgba(255, 255, 255, .1);
          font-size: 16px;
          font-weight: 700;
          color: rgba(255, 255, 255, .4);
          &.highlight {
            color: #fff;
          }
        }
        .desc {
          display: inline-block;
          vertical-align: top;
          margin: 12px 0 0 12px;
          line-height: 24px;
          color: rgba(255, 255, 255, .4);
          font-size: 10px;
        }
      }
      .content-right {
        flex: 0 0 105px;
        width: 105px;
        .pay {
          height: 48px;
          line-height: 48px;
          text-align: center;
          font-size: 12px;
          color: rgba(255, 255, 255, .4);
          font-weight: 700;
          &.not-enough {
            background: #2b333b;
          }
          &.enough {
            background: #00b43c;
            color: #fff;
          }
        }
      }
    }
    .ball-container {
      .ball {
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
        transition: 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
        .inner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(0, 160, 220);
          transition: 0.4s linear;
        }
      }
    }
    .shopcart-list {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      transform: translate3d(0, -100%, 0);
      &.fold-enter-active, &.fold-leave-active {
        transition: all .5s;
      }
      &.fold-enter, &.fold-leave-active {
        transform: translate3d(0, 0, 0);
      }
      .list-header {
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background: #f3f5f7;
        border-bottom: 1px solid rgba(7, 17, 27, .1);
        .title {
          float: left;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .empty {
          float: right;
          font-size: 12px;
          color: rgb(0, 160, 220);
        }
      }
      .list-content {
        padding: 0 18px;
        max-height: 217px;
        overflow: hidden;
        background: #fff;
        .food {
          position: relative;
          padding: 12px 0;
          box-sizing: border-box;
          @include border-1px(rgba(7, 17, 27, .1));
          .name {
            line-height: 24px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .price {
            position: absolute;
            right: 90px;
            bottom: 12px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(240, 20, 20);
          }
          .cartcontrol-wrapper {
            position: absolute;
            bottom: 6px;
            right: 0;
          }
        }
      }
    }
  }

  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    opacity: 1;
    background: rgba(7, 17, 27, .6);
    backdrop-filter: blur(10px);
    &.fade-enter-active, &fade-leave-active {
      transition: .4s;
    }
    &.fade-enter, &.fade-leave-active {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }
  }
</style>
