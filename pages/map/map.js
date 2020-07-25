// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getLocation:function(){
    wx.getLocation({
      type: 'gcj02', 
      success: function (res) {
        console.log(res)
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude:Number(22.549876) ,//要去的纬度-地址
          longitude:Number(114.129208),//要去的经度-地址
          name: "蜜桃美妆馆",
          address: '深圳市罗湖区深南东路中建大厦1712'
        })
      }
    })

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
  onShareAppMessage: function (options) {
    console.log(options)
    // let userId = wx.getStorageSync('userId');
    // console.log(userId)
    return {
      title: '蜜桃美妆馆',
      desc: '商品精选微信小程序商城',
      path:'/pages/map/map'
      // path: '/pages/au?spid=' + userId + "&&share_type=is_share",
    }
  },
})