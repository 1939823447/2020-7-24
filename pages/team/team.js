// pages/team/team.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sumMember: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.moneyInfo();
  },
  moneyInfo: function () {
    let that = this;
    console.log(that)
    // var data = new Object();
   
    util.request(api.CenterInfo).then(function (res) {
      console.log(res.data)
      if (res.errno === 0) {
        that.data.sumMember = res.data
        that.setData({
          sumMember: that.data.sumMember,
        })
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
  bindDetail:function(){
    wx.navigateTo({
      url:'/pages/teamDetail/teamDetail'
    })
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