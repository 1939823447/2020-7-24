const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navUrl: '',
    code: ''
  },
  onLoad: function (options) {
    let that = this; 
    wx.getStorageSync({ 
      key: 'key',
      success(res) {
        console.log(res);
      }
    })

    console.log(app.globalData);
    console.log(options)
    // 如果有spid，则建立上下级关系
    if (options.spid) {
      app.globalData.spid = options.spid;
      wx.setStorage({
        key: 'spid',
        data: options.spid
      })
      wx.setStorage({
        key: 'share_type',
        data: "is_share"
      })
    } else {
      wx.setStorage({
        key: 'spid',
        data: 0
      })
      wx.setStorage({
        key: 'share_type',
        data: "0"
      })
    }

    if (options.share_type) {
      if (options.share_type == "is_share") {
        app.globalData.share_type = options.share_type;
      }
    }
    //从小程序码进入页面，建立上下级关系
    if (typeof (options.scene) != 'undefined') {
      console.log('进入分享页面')
      var scene = decodeURIComponent(options.scene);
      this.setSceneParam(scene);
      // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      // var scene = (options.scene)
      console.log('分享参数：', scene);
      if (scene) {
        this.setData({
          scene: scene
        });
      }
    }
    if (options.scene != "" && typeof (options.scene) != "undefined") {
      // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    }
    if (wx.getStorageSync("navUrl")) {
      that.setData({
        navUrl: wx.getStorageSync("navUrl")
      })
    } else {
      console.log(22225552)
      that.setData({
        navUrl: '/pages/index/index'
      })
      // wx.switchTab({
      //   url: '/pages/index/index',
      // })
    }

    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          that.setData({
            code: res.code
          })
        }
      }
    });
    //新增分享时判断如果用户存在就进入首页开始
    // let userId = wx.getStorage('userId');
    // console.log(userId)
    // if(userId!=''){
    //   wx.switchTab({
    //     url: '/pages/index/index',
    //   })
    // }
    //新增分享时判断如果用户存在就进入首页结束
  },

  bindGetUserInfo: function (e) {
    console.log(e)
    let that = this;
    console.log(that)
    console.log(e.detail.userInfo)
    console.log(api.AuthLoginByWeixin)
    wx.getStorage({
      key: 'spid',
      success(res) {
        console.log(res)
        console.log("前一行");
        //所有人打开时，上传其上下级信息
        // userInfo.share_type = app.globalData.share_type;
        if (that.data.code) {
          console.log(res.data)
          util.request(api.AuthLoginByWeixin, {
            code: that.data.code,
            userInfo: e.detail,
            spid: res.data
          }, 'POST', 'application/json').then(res => {
            if (res.errno === 0) {
              //存储用户信息
              console.log(res)
              wx.setStorageSync('userInfo', res.data.userInfo);
              wx.setStorageSync('token', res.data.token);
              wx.setStorageSync('userId', res.data.userId);
         
            } else {
              console.log(res)
              // util.showErrorToast(res.errmsg)
              // wx.showModal({
              //   title: '提示',
              //   content: res.errmsg,
              //   showCancel: false
              // });
            }
          });
        }

        // wx.login({
        //     success: function(res) {
        //         console.log(that.data.code)
        //         if (res.code) {
        //             wx.request({
        //                 url: api.AuthLoginByWeixin,
        //                 method: 'POST',
        //                 dataType  : 'application/json',
        //                 data: {
        //                   userInfo:e.detail.userInfo,
        //                   code: that.data.code,
        //                 },
        //                 success: function(res) {
        //                     console.log(123456+res);
        //                     console.log(res.data.userId);
        //                     app.globalData.userId = res.data.userId;
        //                 }
        //             })
        //         } else {
        //             console.log('登录失败！' + res.errMsg)
        //         }
        //     }
        // })
      }
    })
    //登录远程服务器
    // if (that.data.code) {
    //   util.request(api.AuthLoginByWeixin, {
    //     code: that.data.code,
    //     userInfo: e.detail
    //   }, 'POST', 'application/json').then(res => {
    //     if (res.errno === 0) {
    //       //存储用户信息
    //       wx.setStorageSync('userInfo', res.data.userInfo);
    //       wx.setStorageSync('token', res.data.token);
    //       wx.setStorageSync('userId', res.data.userId);
    //     } else {
    //       // util.showErrorToast(res.errmsg)
    //       wx.showModal({
    //         title: '提示',
    //         content: res.errmsg,
    //         showCancel: false
    //       });
    //     }
    //   });
    // }
    if (that.data.navUrl && that.data.navUrl == '/pages/index/index') {
      wx.switchTab({
        url: that.data.navUrl,
      })
      
    } else if (that.data.navUrl) {
      wx.redirectTo({
        url: that.data.navUrl,
      })

    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    wx.getStorageSync({
      key: 'key',
      success(res) {
        console.log(res);
      }
    })
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})