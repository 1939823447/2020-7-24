Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentId: '1',
    section: [{
      name: 'HTML',
      typeId: '1'
    }, {
      name: 'CSS',
      typeId: '2'
    }, {
      name: 'JS',
      typeId: '3'
    }],
  },
  //点击每个导航的点击事件
  handleTap: function (e) {
    let id = e.currentTarget.id;
    if (id) {
      this.setData({
        currentId: id
      })
    }
  },
onLoad:function(){
  wx.connectSocket({
    url: 'wss://example.qq.com',
    success:function(res){
      console.log(res)
      if (res.errMsg == "connectSocket:ok"){
        console.log("开始建立连接！");
      }
      else{
        console.log("建立连接失败！");
  //      wx.hideLoading();
      } 
    },
    fail:function(res){
      console.log(res);
    }
  })
}
})