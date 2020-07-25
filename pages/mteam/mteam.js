// pages/mteam/mteam.js
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
    sumMember: [{
        levelInfo: [{
          user_level_id: ''
        }]
      }
    ]
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
          user_level_id: that.data.sumMember.levelInfo.user_level_id
        })
       
        // if(that.data.user_level_id==4){
        //   that.data.user_level_id=会员
        // }
        
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


  bindDetail: function () {
    wx.navigateTo({
      url: '/pages/mteamDetail/mteamDetail'
    })
  },
  bindUpgrade: function () {
    var that=this
    console.log(that.data.user_level_id)
    var level_id=that.data.user_level_id
    if(level_id==2){
      util.showErrorToast("您已经是合伙人不能直接升级董事,请联系客服")
    }
    if(level_id==1){
      util.showErrorToast("您已经是最高级别,不能再升级")
    }
    if(level_id==3 || level_id==4){
      wx.navigateTo({
        url: '/pages/upgrade/upgrade'
      })
    }
  }
})