// pages/mteamDetail/mteamDetail.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: parseInt(options.id)
      // id: 1181000
    });
this.consumerInfo()
console.log(options)
  },
  consumerInfo:function(){
    let that = this;
    util.request(api.bankInfo, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        console.log(res)
        that.setData({
          bankInfo:res.data.bankInfo
        });
      }
    });
  },
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