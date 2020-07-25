// pages/upgrade/upgrade.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aUpGrade:[],
    orderId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
// this.bindpay()
this.upGrade()
  },
  bindpay:function(){
    console.log(this.data.aUpGrade)
    var orderId =this.data.aUpGrade.id
    pay.prepay(parseInt(orderId)).then(res => {
      console.log(res)
      util.redirect('/pages/mteam/mteam');
      // wx.redirectTo({
      //   url: 'pages/mteam/mteam'
      // });
    }).catch(res => {
    
      // console.log(new Date()+172800)
      // console.log(util.formatTime(new Date()+172800))
      
      // wx.redirectTo({
      //   url: '/pages/payResult/payResult?status=0&orderId=' + orderId
      // });
      util.showErrorToast("付款失败")
    });
  },
  upGrade:function(){
    let that = this;
    util.request(api.upGrade).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        that.data.aUpGrade = res.data.data
        that.setData({
          aUpGrade: that.data.aUpGrade,
        });
      }
    });
  },
//   prepay(event){
//     let that = this;
//     let orderIndex = event.currentTarget.dataset.orderIndex;
//     let order = that.data.orderList[orderIndex];
//     util.request(api.PayPrepayId, {
//       orderId: that.data.orderId || 15
//     }).then(function (res) {
//       console.log(res)
//       if (res.errno === 0) {
//         const payParam = res.data;
//         wx.requestPayment({
//           'timeStamp': payParam.timeStamp,
//           'nonceStr': payParam.nonceStr,
//           'package': payParam.package,
//           'signType': payParam.signType,
//           'paySign': payParam.paySign,
//           'success': function (res) {
//             console.log(res);
//           },
//           'fail': function (res) {
//             console.log(res);
//           }
//         });
//       }
//     });
//     // wx.redirectTo({
//     //     url: '/pages/pay/pay?orderId=' + order.id + '&actualPrice=' + order.actual_price,
//     // })
// },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})