// pages/wallet/wallet.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sumMoney: [],
    name: '',
    IdCard: '',
    bank: '',
    money: '',
    phone: '',
    allBackInfo: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.moneyInfo();
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
  bindinputIDCard: function (e) {
    console.log(e.detail.value)
    this.setData({
      IdCard: e.detail.value
    })
  },
  bindinputBank: function (e) {
    console.log(e.detail.value)
    this.setData({
      bank: e.detail.value
    })
  },
  bindinputMoney: function (e) {
    console.log(e.detail.value)
    this.setData({
      money: e.detail.value
    })
  },
  bindinputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  applyInfo: function () {
    let that = this;
    var sum = that.data.sumMoney;
    var name1 = that.data.allBackInfo.bank_account_name;
    var IdCard1 = that.data.allBackInfo.bank_account;
    var bank1 = that.data.allBackInfo.bank_name;
    var phone1 = that.data.allBackInfo.mobile;
    console.log(that.data.allBackInfo.bank_account_name)
    if (that.data.name == '' && name1 == '') {
      util.showErrorToast('请输入持卡人姓名');
      return false;
    }
    if (that.data.IdCard == '' && IdCard1 == '') {
      util.showErrorToast('请输入银行卡号');
      return false;
    }
    if (that.data.bank == '' && bank1 == '') {
      util.showErrorToast('请输入开户行');
      return false;
    }
    if (name1) {
      if (that.data.name == '') {
        that.data.name = name1
      }
    }
    if (IdCard1) {
      if (that.data.IdCard == '') {
        that.data.IdCard = IdCard1
      }
    }
    if (bank1) {
      if (that.data.bank == '') {
        that.data.bank = bank1
      }
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.phone == '' && phone1 == '') {
      util.showErrorToast('手机号码为空');
      return false;
    } else if (this.data.phone.length < 11 && phone1 == '') {
      util.showErrorToast('手机号码长度有误！');
      return false;
    } else if (!myreg.test(this.data.phone) && phone1 == '') {
      util.showErrorToast('请输入正确的号码');
      return false;
    }
    if (phone1) {
      if (that.data.phone == '') {
        that.data.phone = phone1
      }
      if (that.data.money == '') {
      util.showErrorToast('请输入金额');
      return false;
    } 
    if(that.data.money>sum.levelInfo.balance){
      util.showErrorToast('您的余额不足');
      return false;
    }
    }
    // if (that.data.IdCard == '') {
    //   util.showErrorToast('请输入银行卡号');
    //   return false;
    // }
    // if (that.data.bank == '') {
    //   util.showErrorToast('请输入开户行');
    //   return false;
    // }

    // if (that.data.money == '') {
    //   util.showErrorToast('请输入金额');
    //   return false;
    // } else if(that.data.money>sum.levelInfo.balance){
    //   util.showErrorToast('您的余额不足');
    //   return false;
    // }

    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    // if (this.data.phone == '') {
    //   util.showErrorToast('手机号码为空');
    //   return false;
    // } else if (this.data.phone.length < 11) {
    //   util.showErrorToast('手机号码长度有误！');
    //   return false;
    // } else if (!myreg.test(this.data.phone)) {
    //   util.showErrorToast('请输入正确的号码');
    //   return false;
    // }
    util.request(api.applyInfo, {
      bank_account_name: that.data.name,
      bank_account: that.data.IdCard,
      bank_name: that.data.bank,
      apply_withdraw_money: that.data.money,
      mobile: that.data.phone
    }).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        console.log(res)
        // util.showSuccessToast(res.errmsg);
        wx.showToast({
          title: res.errmsg, //提示文字
          icon: 'success', //图标，支持"success"、"loading"  
          duration:800,
          success: function () {
            setTimeout(function() {
              wx.switchTab({
                url: '/pages/ucenter/index/index',
              });
          }, 1000)
          
          }, //接口调用成功

        })

      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  },
  moneyInfo: function () {
    let that = this;
    util.request(api.CenterInfo).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        that.data.sumMoney = res.data
        that.setData({
          sumMoney: that.data.sumMoney,
          allBackInfo: that.data.sumMoney.bankInfo
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