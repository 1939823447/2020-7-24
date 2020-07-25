const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: [],
    circular: true,
    consumeList: [],
  },
  // 随机渲染
  // switch1: function() {
  //   const length = this.data.collage.length
  //   console.log(length)
  //   for (let i = 0; i < length; ++i) {
  //     const x = Math.floor(Math.random() * length)
  //     const y = Math.floor(Math.random() * length)
  //     const temp = this.data.collage[x]
  //     this.data.collage[x] = this.data.collage[y]
  //     this.data.collage[y] = temp
  //   }
  //   this.setData({
  //     collage: this.data.collage
  //   })
  // },
  aab: function () {
    wx.clearStorageSync();
    console.log('清理成功')
  },
  bindcata: function (e) {
    console.log(e.currentTarget.dataset.id)
    var id=e.currentTarget.dataset.id
    var chan1=this.data.channel[0].id
    console.log(this.data.channel)
    
    if(id=chan1){
      wx.switchTab({
        url: this.data.channel[0].url,
      })
    }
  },
  onShareAppMessage: function (options) {
    console.log(options)
    let userId = wx.getStorageSync('userId');
    console.log(userId)
    return {
      title: '蜜桃美妆馆',
      desc: '商品精选微信小程序商城',
      path: '/pages/auth/btnAuth/btnAuth?spid=' + userId + "&&share_type=is_share",
      // path: '/pages/au?spid=' + userId + "&&share_type=is_share",
    }
  },
  onPullDownRefresh() {
    // 增加下拉刷新数据的功能
    var self = this;
    this.getIndexData();
    // this.getCartDetail()

  },
  getCartDetail: function () {
    let that = this;


  },
  getIndexData: function () {
    console.log(123)
    let that = this;
    var data = new Object();
    util.request(api.IndexUrlNewGoods).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        data.newGoods = res.data.newGoodsList
        that.setData(data);
      }
    });
    util.request(api.IndexUrlHotGoods).then(function (res) {
      if (res.errno === 0) {
        data.hotGoods = res.data.hotGoodsList
        that.setData(data);
      }
    });
    util.request(api.IndexUrlTopic).then(function (res) {
      if (res.errno === 0) {
        data.topics = res.data.topicList
        that.setData(data);
      }
    });
    util.request(api.IndexUrlBrand).then(function (res) {
      if (res.errno === 0) {
        data.brand = res.data.brandList
        that.setData(data);
      }
    });
    util.request(api.IndexUrlCategory).then(function (res) {
      if (res.errno === 0) {
        data.floorGoods = res.data.categoryList
        that.setData(data);
      }
    });
    util.request(api.IndexUrlBanner).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        data.banner = res.data.banner
        that.setData(data);
      }
    });
    util.request(api.IndexUrlChannel).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        data.channel = res.data.channel
        that.setData(data);
      }
    });
    util.request(api.getCartDetail).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        that.setData({
          consumeList: res.data,
        });
        console.log(that.data)
        const length = that.data.consumeList.length
        console.log(length)
        for (let i = 0; i < length; ++i) {
          const x = Math.floor(Math.random() * length)
          const y = Math.floor(Math.random() * length)
          const temp = that.data.consumeList[x]
          that.data.consumeList[x] = that.data.consumeList[y]
          that.data.consumeList[y] = temp
        }
        that.setData({
          consumeList: that.data.consumeList
        })
      }
    });

  },
  bindshare: function () {
    wx.updateShareMenu({
      withShareTicket: true,
      success() {}
    })
  },
  bindSeckill: function () {
    wx.navigateTo({
      url: '/pages/seckill/seckill'
    })
  },
  bindMore: function () {
    wx.switchTab({
      url: '/pages/catalog/catalog',
    })
  },
  onLoad: function (options) {
    this.getIndexData();
    // this.getCartDetail();
    // this.switch1()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // this.getCartDetail();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})