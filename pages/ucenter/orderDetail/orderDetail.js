var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
// payStatus
//付款状态 支付状态;0未付款;1付款中;2已付款
// shippingStatus
//发货状态 商品配送情况;0未发货,1已发货,2已收货,4退货
// orderStatus
//1xx 表示订单取消和删除等状态 0订单创建成功等待付款，　101订单已取消，　102订单已删除  107  正在拼单中 108  拼单已完成,待发货  109  拼单未完成,待退款  110  拼单未成功,已退款
//2xx 表示订单支付状态　201订单已付款，等待发货
//3xx 表示订单物流相关状态　300订单已发货,待确认收货， 301用户确认收货
//4xx 表示订单退换货相关的状态　401 没有发货，退款　402 已收货，退款退货
Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {},
    showModal: false,
    showModal2: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    util.request(api.OrderDetail, {
      orderId: that.data.orderId
    }).then(function (res) {
      console.log(res.data.orderInfo.take_way)
      if (res.errno === 0) {
        that.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          handleOption: res.data.handleOption
        });
        console.log(res)
        //that.payTimer();
      }
    });
  }, 
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  cancelOrder(){
    let that = this;
    let orderInfo = that.data.orderInfo;
    var order_status = orderInfo.order_status;

    var errorMessage = '';
    switch (order_status){
      case 300: {
        errorMessage = '订单已发货';
        break;
      }
      case 301:{
        errorMessage = '订单已收货';
        break;
      }
      case 101:{
        errorMessage = '订单已取消';
        break;
      }
      case 102: {
        errorMessage = '订单已删除';
        break;
      }
      case 401: {
        errorMessage = '订单已退款';
        break;
      }
      case 402: {
        errorMessage = '订单已退货';
        break;
      }
    }
      
    if (errorMessage != '') {
      util.showErrorToast(errorMessage);
      return false;
    }
    
    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {

          util.request(api.OrderCancel,{
            orderId: orderInfo.id
          }).then(function (res) {
            if (res.errno === 0) {
              wx.showModal({
                title:'提示',
                content: res.data,
                showCancel:false,
                confirmText:'继续',
                success: function (res) {
                //  util.redirect('/pages/ucenter/order/order');
                  wx.navigateBack({
                    url: 'pages/ucenter/order/order',
                  });
                }
              });
            }
          });

        }
      }
    });
  },
  payOrder() {
    console.log(2222)
    let that = this;
    util.request(api.PayPrepayId, {
      orderId: that.data.orderId || 15
    }).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log(res);
          },
          'fail': function (res) {
            console.log(res);
          }
        });
      }else{
        wx.showToast({
          // image: '/static/images/icon_error.png',
          icon:'none',
          title:res.errmsg,
          mask: true
        });
      }
    });

  },
  confirmOrder() {
//确认收货
      let that = this;
      let orderInfo = that.data.orderInfo;

      var order_status = orderInfo.order_status;

      var errorMessage = '';
      switch (order_status) {
          // case 300: {
          //   errorMessage = '订单已发货';
          //   break;
          // }
          case 301: {
              errorMessage = '订单已收货';
              break;
          }
          case 101: {
              errorMessage = '订单已取消';
              break;
          }
          case 102: {
              errorMessage = '订单已删除';
              break;
          }
          case 401: {
              errorMessage = '订单已退款';
              break;
          }
          case 402: {
              errorMessage = '订单已退货';
              break;
          }
      }

      if (errorMessage != '') {
          util.showErrorToast(errorMessage);
          return false;
      }
      // util.redirect('/pages/ucenter/order/order');
      
      util.request(api.OrderConfirm, {
        orderId: orderInfo.id
    }).then(function (res) {
        if (res.errno === 0) {
             util.redirect('/pages/ucenter/order/order');
            // wx.showModal({
            //     title: '提示',
            //     content: res.data,
            //     showCancel: false,
            //     confirmText: '继续',
            //     success: function (res) {
            //         //  util.redirect('/pages/ucenter/order/order');
            //         wx.navigateBack({
            //             url: 'pages/ucenter/order/order',
            //         });
            //     }
            // });
        }
    });
      // wx.showModal({
      //     title: '',
      //     content: '确定已经收到商品？',
      //     success: function (res) {
      //         if (res.confirm) {

      //             util.request(api.OrderConfirm, {
      //                 orderId: orderInfo.id
      //             }).then(function (res) {
      //                 if (res.errno === 0) {
      //                      util.redirect('/pages/ucenter/order/order');
      //                     // wx.showModal({
      //                     //     title: '提示',
      //                     //     content: res.data,
      //                     //     showCancel: false,
      //                     //     confirmText: '继续',
      //                     //     success: function (res) {
      //                     //         //  util.redirect('/pages/ucenter/order/order');
      //                     //         wx.navigateBack({
      //                     //             url: 'pages/ucenter/order/order',
      //                     //         });
      //                     //     }
      //                     // });
      //                 }
      //             });

      //         }
      //     }
      // });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
   /**
    * 弹窗
    */
   showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  showDialogBtn2: function () {
    this.setData({
      showModal2: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  hideModal2: function () {
    this.setData({
      showModal2: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  onCancel2: function () {
    this.hideModal2();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    let that = this;
    let orderInfo = that.data.orderInfo;

    var order_status = orderInfo.order_status;

    var errorMessage = '';
    switch (order_status){
      case 300: {
        errorMessage = '订单已发货';
        break;
      }
      case 301:{
        errorMessage = '订单已收货';
        break;
      }
      case 101:{
        errorMessage = '订单已取消';
        break;
      }
      case 102: {
        errorMessage = '订单已删除';
        break;
      }
      case 401: {
        errorMessage = '订单已退款';
        break;
      }
      case 402: {
        errorMessage = '订单已退货';
        break;
      }
    }
      
    if (errorMessage != '') {
      util.showErrorToast(errorMessage);
      return false;
    }
    
          util.request(api.OrderCancel,{
            orderId: orderInfo.id
          }).then(function (res) {
            if (res.errno === 0) {
              util.redirect('/pages/ucenter/order/order');
              // wx.navigateBack({
              //   url: 'pages/ucenter/order/order',
              // });
              // wx.showModal({
              //   title:'提示',
              //   content: res.data,
              //   showCancel:false,
              //   confirmText:'继续',
              //   success: function (res) {
              //   //  util.redirect('/pages/ucenter/order/order');
              //     wx.navigateBack({
              //       url: 'pages/ucenter/order/order',
              //     });
              //   }
              // });
            }
         

  
   
    });
  },
  onConfirm2: function () {
    this.hideModal2();
   
    this.confirmOrder()
    
       
  }
})