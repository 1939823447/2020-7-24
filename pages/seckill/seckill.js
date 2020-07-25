// pages/seckill/seckill.js
let goodsList = [
  {actEndTime: '2020-05-20 10:00:43'},]
  var util = require('../../utils/util.js');

  var api = require('../../config/api.js');
  var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    countDownList: [],
    actEndTimeList: [],
    goods:10,
    goodsInfo:[],
    page: 1,
    size: 1000,
   
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
   
    let endTimeList = [];
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    goodsList.forEach(o => {endTimeList.push(o.actEndTime)})
    this.setData({ actEndTimeList: endTimeList});
    // 执行倒计时函数
    this.countDown();
    this.getData();
  },
  
  getData() {
    var that = this;
console.log(that.data)
    util.request(api.Collage, { page: that.data.page, size: that.data.size}).then(function (res) {
        console.log(res.data)
        if (res.errno === 0) {
          that.setData({
            goodsInfo: res.data.goodsList
          });
        }
      });
  },
  timeFormat(param){//小于10的格式化函数
    return param < 10 ? '0' + param : param; 
  },
  countDown(){//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      let endTime = new Date(o).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0){
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      }else{//活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDownList: countDownArr})
    setTimeout(this.countDown,1000);

  },
  actioncnt:function(){
    wx.showModal({
      title: '提示',
      content: '物品已被抢完',
      success: function (res) {
          if (res.confirm) {
              console.log('用户点击确定')
          }else{
             console.log('用户点击取消')
          }

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
    // console.log(util.formatTime())
    // var arr=new Date().getTime()
    // var date = new Date(arr * 1000);
    // console.log(util.formatTime())
    // console.log(util.formatTimeTwo(arr),'Y-M-D h:m:s');
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