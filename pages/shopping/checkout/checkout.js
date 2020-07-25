var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00, //快递费
    couponPrice: 0.00, //优惠券的价格
    orderTotalPrice: 0.00, //订单总价
    actualPrice: 0.00, //实际需要支付的总价
    addressId: 0,
    couponId: 0,
    isBuy: false,
    couponDesc: '',
    couponCode: '',
    buyType: '',
    currentData: 0,
    scrollHeight: 0,
    phone: '',
    name: '',
    note: '',
    address: '',
    wxnum: '',
    currentId: '2',
    provinceName: '',
    telNumber: '',
    telNumber: '',
    cityName: '',
    detailInfo: '',
    countyName: '',
    section: [{
      name: '快递配送',
      typeId: '2'
    },{
      name: '到店自提',
      typeId: '1'
    }],
  },
  onLoad: function (options) {
    console.log(options)
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }

    })
  
    // 页面初始化 options为页面跳转所带来的参数
    if (options.isBuy != null) {
      this.data.isBuy = options.isBuy
    }
    var isBuy = this.data.isBuy
    if (isBuy == 'true') {
      this.data.buyType = 'buy'
    } else if (isBuy == false) {
      this.data.buyType = 'cart'
    } else if (isBuy == 2) {
      this.data.buyType = 2
    }
    // this.data.buyType = this.data.isBuy ? 'buy' : 'cart'
    //每次重新加载界面，清空数据
    app.globalData.userCoupon = 'NO_USE_COUPON'
    app.globalData.courseCouponCode = {}
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
        console.log(res)
      }
    });
  },
  chooseAddress() {
    var that = this
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.userInfo'])
        console.log("vres.authSetting['scope.address']：", res.authSetting['scope.address'])
        if (res.authSetting['scope.userInfo']) {
          console.log(12345)
          wx.chooseAddress({
            success(res) {
              console.log(res)
              that.setData({
                cityName: res.cityName,
                countyName: res.countyName,
                detailInfo: res.detailInfo,
                provinceName: res.provinceName,
                userName: res.userName,
                telNumber: res.telNumber
              })
            }
          })
        } else {
          if (res.authSetting['scope.address'] == false) {
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)
                console.log(456)
              }
            })
          } else {
            wx.chooseAddress({
              success(res) {}
            })
          }
        }
      }
    })
  },

  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  bindinputMobile: function (e) {

    this.setData({
      phone: e.detail.value
    })
    // wx.setStorage({
    //   key: "phone",
    //   data: e.detail.value
    // })
  },
  bindinputName: function (e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
    // wx.setStorage({
    //   key: "name",
    //   data: e.detail.value
    // })

  },
  bindinputAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
    console.log(e)
  },
  bindinputNote: function (e) {
    console.log(e.detail.value)
    this.setData({
      note: e.detail.value
    })
  },
  bindinputWxnum: function (e) {
    this.setData({
      wxnum: e.detail.value
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  getCheckoutInfo: function () {
    
    let that = this;
    console.log(that.data)
    var url = api.CartCheckout
    var isBuy = this.data.isBuy;
    var buyType = this.data.buyType
    console.log(isBuy)
    if (isBuy == 'true') {
      buyType = 'buy'
    } else if (isBuy == false) {
      buyType = 'cart'
    } else if (isBuy == 2) {
      buyType = 2
    }
    util.request(url, {
      addressId: that.data.addressId,
      couponId: that.data.couponId,
      type: buyType
    }).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        console.log(res)
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon ? res.data.checkedCoupon : "",
          couponList: res.data.couponList ? res.data.couponList : "",
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice
        }); 
        //设置默认收获地址
        // if (that.data.checkedAddress.id){
        //     let addressId = that.data.checkedAddress.id;
        //     if (addressId) {
        //         that.setData({ addressId: addressId });
        //     }
        // }else{
        //     wx.showModal({
        //         title: '',
        //         content: '请添加默认收货地址!',
        //         success: function (res) {
        //             if (res.confirm) {
        //                 that.selectAddress();
        //             }
        //         }
        //     })
        // }
      }else{
        util.showErrorToast(res.msg);
      }
     
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  getLocation: function () {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: Number(22.549876), //要去的纬度-地址
          longitude: Number(114.129208), //要去的经度-地址
          name: "蜜桃美妆馆",
          address: '深圳市罗湖区深南东路中建大厦1712'
        })
      }
    })

  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    this.getCouponData()
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();

    try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 获取优惠券
   */
  getCouponData: function () {
    if (app.globalData.userCoupon == 'USE_COUPON') {
      this.setData({
        couponDesc: app.globalData.courseCouponCode.name,
        couponId: app.globalData.courseCouponCode.user_coupon_id,
      })
    } else if (app.globalData.userCoupon == 'NO_USE_COUPON') {
      this.setData({
        couponDesc: "不使用优惠券",
        couponId: '',
      })
    }
  },

  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  /**
   * 选择可用优惠券
   */
  tapCoupon: function () {
    let that = this

    wx.navigateTo({
      url: '../selCoupon/selCoupon?buyType=' + that.data.buyType,
    })
  },

  submitOrder: function () {
    console.log(this.data.actualPrice);
    // if (this.data.addressId <= 0 && this.data.currentId == 2) {
    //   util.showErrorToast('请输入收货地址');
    //   return false;
    // }
    if(this.data.actualPrice==0){
      wx.showToast({
        image: '/static/images/icon_error.png',
        title:'下单失败',
        mask: true
      });
   return
    }
    if (this.data.name == '') {
      if (this.data.userName == '') {
        util.showErrorToast('请输入姓名');
        return false;
      }

    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (this.data.phone == '') {
      if (this.data.telNumber == '') {
        util.showErrorToast('手机号码为空');
        return false;
      }

    } else if (this.data.phone.length < 11) {
      util.showErrorToast('手机号码长度有误！');
      return false;
    } else if (!myreg.test(this.data.phone)) {
      util.showErrorToast('请输入正确的号码');
      return false;
    }
    // var provinceName =this.data.provinceName;
    // var cityName=this.data.cityName;
    // var countyName =this.data.countyName;
    // var detailInfo =this.data.detailInfo;
    console.log(this.data.address)
    if (this.data.address == '' && this.data.currentId == 2) {
      if (this.data.provinceName = '') {
        util.showErrorToast('请输入收货地址');
        return false;
      }
    }
    var address = this.data.address;
    var provinceName = this.data.provinceName;
    var cityName = this.data.cityName;
    var countyName = this.data.countyName;
    var detailInfo = this.data.detailInfo;
    var name = this.data.name;
    var phone = this.data.phone;
    var userName = this.data.userName;
    var telNumber = this.data.telNumber;
    if (address == '') {
      this.setData({
        address: provinceName + cityName + countyName + detailInfo
      })
    } else {
      this.setData({
        address: address
      })
    }
    if (name == '') {
      this.setData({
        name: userName
      })
    } else {
      this.setData({
        name: name
      })
    }
    if (phone == '') {
      this.setData({
        phone: telNumber
      })
    } else {
      this.setData({
        phone: phone
      })
    }
    util.request(api.OrderSubmit, {
      // addressId: this.data.addressId,
      couponId: this.data.couponId,
      currentId: this.data.currentId,
      mobile: this.data.phone,
      name: this.data.name,
      note: this.data.note,
      wxnum: this.data.wxnum,
      address: this.data.address,
      type: this.data.buyType
    }, 'POST', 'application/json').then(res => {
      if (res.errno === 0) {

        const orderId = res.data.orderInfo.id;
        pay.payOrder(parseInt(orderId)).then(res => {

          console.log(res)
          wx.navigateTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          console.log(new Date())
          // console.log(new Date()+172800)
          // console.log(util.formatTime(new Date()+172800))
          wx.navigateTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
  },
  //点击每个导航的点击事件
  handleTap: function (e) {
    let id = e.currentTarget.id;
    if (id) {
      this.setData({
        currentId: id
      })
    }
  },
})