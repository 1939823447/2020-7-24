var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
    data: {
        userInfo: {},
        hasMobile: '',
        phoneNumber:'',
        phone1:''
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that=this
        console.log(this)

       
    },
    onReady: function () {

    },
    onShow: function () {
        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');
        let phone = wx.getStorageSync('phone');
    
        // 页面显示
        if (userInfo && token) {
            app.globalData.userInfo = userInfo;
            app.globalData.token = token;
        }
        this.setData({
            userInfo: app.globalData.userInfo,
            phone1:phone
        });

    },
    onHide: function () {
        // 页面隐藏

    },
    getPhoneNumber: function (e) { //点击获取手机号码按钮
        var that = this;
        console.log(e)
        wx.login({
            success: res => {
        wx.checkSession({
          success: function (res) {
            console.log(e.detail.errMsg)
            console.log(e.detail.iv)
            console.log(e.detail.encryptedData)
            var ency = e.detail.encryptedData;
            var iv = e.detail.iv;
            if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
            } else {
              //同意授权
              var userinfo = wx.getStorageSync('userInfo');
               let userId = wx.getStorageSync('userId');
              util.request(api.getPhoneNumber, {
                uid: userId,
                iv: iv,
                encryptedData: ency
              }).then(res => {
                if (res.errno === 0) {
                  //存储用户信息
                that.setData({
                    phoneNumber:res.data.phoneNumber
                })
                wx.navigateTo({
                    url: '/pages/getphone/getphone?phone=' + that.data.phoneNumber
                  })
                  wx.setStorageSync('phone', res.data.phoneNumber)
                } else {
                  console.log(res)
                }
              });
            }
          }
        });
    }
})
      },
   
    onUnload: function () {
        // 页面关闭
    },
    bindExtend:function(){
        wx.navigateTo({
            url: '/pages/extend/extend'
          })
    },
    bindGetUserInfo(e) {
      let userInfo = wx.getStorageSync('userInfo');
      let token = wx.getStorageSync('token');
      if (userInfo && token) {
        return;
      }
        if (e.detail.userInfo){
            //用户按了允许授权按钮
            user.loginByWeixin(e.detail).then(res => {
                this.setData({
                    userInfo: res.data.userInfo
                });
                app.globalData.userInfo = res.data.userInfo;
                app.globalData.token = res.data.token;
            }).catch((err) => {
                console.log(err)
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告通知',
                content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                success: function (res) {
                    if (res.confirm) {
                        wx.openSetting({
                            success: (res) => {
                                if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                                    user.loginByWeixin(e.detail).then(res => {
                                        this.setData({
                                            userInfo: res.data.userInfo
                                        });
                                        app.globalData.userInfo = res.data.userInfo;
                                        app.globalData.token = res.data.token;
                                    }).catch((err) => {
                                        console.log(err)
                                    });
                                }
                            }
                        })
                    }
                }
            });
        }
    },

    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })

    }
})