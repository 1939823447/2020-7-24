var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();
 
Page({
  data: {
    cartGoods: [],
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: [],
    footprintList: [],
    hotGoods: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getFootprintList();
this.gethotGoods();
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    this.getCartList();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  getCartList: function () {
    let that = this;
    util.request(api.CartList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal
        });
      }
      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;
    if (!this.data.isEditCart) {
      util.request(api.CartChecked, { productIds: that.data.cartGoods[itemIndex].product_id, isChecked: that.data.cartGoods[itemIndex].checked ? 0 : 1 }, "POST", "application/json").then(function (res) {
        if (res.errno === 0) {
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }
        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else {
      //编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        if (index == itemIndex){
          element.checked = !element.checked;
        }
        return element;
      });
      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  getCheckedGoodsCount: function(){
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.number;
      }
    });
    return checkedGoodsCount;
  },
  checkedAll: function () {
    let that = this;
    if (!this.data.isEditCart) {
      var productIds = this.data.cartGoods.map(function (v) {
        return v.product_id;
      });
      util.request(api.CartChecked, { productIds: productIds.join(','), isChecked: that.isCheckedAll() ? 0 : 1 }, "POST", "application/json").then(function (res) {
        if (res.errno === 0) {
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }
        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.checked = !checkedAllStatus;
        return v;
      });
      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  editCart: function () {
    var that = this;
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  updateCart: function (productId, goodsId, number, id) {
    let that = this;
    util.request(api.CartUpdate, {
      productId: productId,
      goodsId: goodsId,
      number: number,
      id: id
    }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          //cartGoods: res.data.cartList,
          //cartTotal: res.data.cartTotal
        });
      }
      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },
  cutNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = cartItem.number + 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
  },
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;

    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
    if (checkedGoods.length <= 0) {
      return false;
    }
    wx.navigateTo({
      url: '../shopping/checkout/checkout'
    })
  },
  deleteCart: function () {
    //获取已选择的商品
    let that = this;

    let productIds = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (productIds.length <= 0) {
      return false;
    }

    productIds = productIds.map(function (element, index, array) {
      if (element.checked == true) {
        return element.product_id;
      }
    });


    util.request(api.CartDelete, {
      productIds: productIds.join(',')
    }, 'POST', 'application/json').then(function (res) {
      if (res.errno === 0) {
        let cartList = res.data.cartList.map(v => {
          v.checked = false;
          return v;
        });

        that.setData({
          cartGoods: cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },
  //猜你喜欢
  getFootprintList() {
    let that = this;
    var tmpFootPrint;
    util.request(api.FootprintList).then(function (res) {
      if (res.errno === 0) {

        if (res.data.data != undefined) {
          tmpFootPrint = res.data.data;
        } else {
          tmpFootPrint = [];
        }

        that.setData({
          footprintList: tmpFootPrint
        });
      }
    });
  },
  gethotGoods() {
    console.log(123)
    let that = this;
    var data = new Object();
    util.request(api.IndexUrlHotGoods).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        data.hotGoods = res.data.hotGoodsList
      that.setData(data);
      }
    });
  },
  deleteItem(event) {
    let that = this;
    let footprint = event.currentTarget.dataset.footprint;
    console.log(event.currentTarget.dataset.footprint )
    var touchTime = that.data.touch_end - that.data.touch_start;
    //如果按下时间大于350为长按
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '要删除所选足迹？',
        success: function (res) {
          if (res.confirm) {
            util.request(api.FootprintDelete, { footprintId: footprint.id }).then(function (res) {
              if (res.errno === 0) {
                wx.showToast({
                  title: res.errmsg,
                  icon: 'success',
                  duration: 2000,
                  complete: function () {
                    that.getFootprintList();
                  }
                });
              } else {
                util.showErrorToast(res.errmsg);
              }
            });
          }
        }
      });
    } else {
      console.log(this.data.footprint)
      // wx.navigateTo({
      //   url: '/pages/goods/goods?id=' + footprint.goods_id,
      // });
      console.log(123456)
    }
  }
})