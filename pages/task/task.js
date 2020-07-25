// pages/task/task.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yuan:{height:110},
    sumMember:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.moneyInfo();

      // this.createCanvas('one',colw /2,'#FF8F17','任务完成度',10,300);
 
  },
  moneyInfo:function(){
    let that = this;
    console.log(that)
    var windowidth = 200;
    var colw=windowidth / 1;
  
    this.setData({
      yuan:{
        height:colw
      }
    })
    util.request(api.CenterInfo).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        that.data.sumMember = res.data
        that.setData({
          sumMember:that.data.sumMember,
        })

        console.log(that.data.sumMember)
        if(that.data.sumMember.levelInfo){
     var maxLevel=that.data.sumMember.levelInfo.maxLevel;
        var currentLevel =that.data.sumMember.levelInfo.currentLevel
        that.createCanvas('one',colw /2,'#FF8F17','当前完成量',currentLevel,maxLevel);
        }else{
          that.createCanvas('one',colw /2,'#FF8F17','当前完成量',0,1);
        }
      // that.setData(that.data.sumMember);
      }
    });
  
  },
  createCanvas:function(id,xy,color,txt,val,total){
    var ctx=wx.createCanvasContext(id);
    ctx.setLineWidth(12);
    ctx.setStrokeStyle('#FFD800');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(xy,xy,0.75*xy,0,2*Math.PI,false);
    ctx.stroke();
    ctx.setLineWidth(12);
    ctx.setStrokeStyle(color);
    ctx.setLineCap('round');
    var p=val / total;
    ctx.beginPath(xy);
    ctx.arc(xy,xy,0.75*xy,-90 * Math.PI / 180,(p*360 - 90)*Math.PI / 180,false);
    ctx.textAlign = "center";
    ctx.font = '14rpx Arial';
    ctx.fillText(txt, xy, 1.3 * xy, xy);
    ctx.font = '28rpx Arial';
    ctx.fillStyle = color;
    ctx.fillText(val, xy, 1 * xy, xy);
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
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