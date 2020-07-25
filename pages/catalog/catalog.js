var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    navList: [],
    categoryList: [],
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    goodsCount: 0,
    scrollHeight: 0,
    goodsList: [],
    id: 0,
    page: 1,
    size: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1
  },
  onLoad: function (options) {
    var that = this;
    if (options.id) {
      that.setData({
        id: parseInt(options.id)
      });
    }
    this.getCatalog();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    var interval = setInterval(function () {
      that.getCategoryInfo();
      clearTimeout(interval)
      //需不断调用的操作
    }, 500) 
  },
  getCatalog: function () {
    //CatalogList
    let that = this;
    // wx.showLoading({
    //   title: '加载中...',
    // });
    util.request(api.CatalogList).then(function (res) {
      that.setData({
        navList: res.data.categoryList,
        currentCategory: res.data.currentCategory,
        id: res.data.currentCategory.subCategoryList[0].id
      });
      wx.hideLoading();
    });
    util.request(api.GoodsCount).then(function (res) {
      that.setData({
        goodsCount: res.data.goodsCount
      });
    });

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that=this
    wx.setNavigationBarTitle({
      title: '正在刷新中……'
    })//
    wx.showNavigationBarLoading() //在标题栏中显示加载
    util.request(api.CatalogList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          navList: res.data.categoryList,
          currentCategory: res.data.currentCategory,
          id: res.data.currentCategory.subCategoryList[0].id
        });
        setTimeout(function(){
          // complete
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          wx.setNavigationBarTitle({
            title: '蜜桃美妆馆'
          })//动态设置当前页面的标题。
        },1200);
      }
    });

  },
  getCurrentCategory: function (id) {

    let that = this;
    console.log(that.data)
    util.request(api.CatalogCurrent, {
        id: id
      }).then(function (res) {
        console.log(res)
        that.setData({
          currentCategory: res.data.currentCategory,
          id: res.data.currentCategory.subCategoryList[0].id
        });
      });


    util.request(api.GoodsCategory, {
      id: id
    }).then(function (res) {
        console.log(res)
        if (res.errno == 0) {
          that.setData({
            // navList: res.data.brotherCategory,
            page: 1,
            totalPages: 1,
            goodsList: [],
            // nomore: false
          });
          //nav位置
          let currentIndex = 0;
          let navListCount = that.data.navList.length;
          for (let i = 0; i < navListCount; i++) {
            currentIndex += 1;
            if (that.data.navList[i].id == that.data.id) {
              break;
            }
          }
          if (currentIndex > navListCount / 2 && navListCount > 5) {
            that.setData({
              scrollLeft: currentIndex * 60
            });
          }
          // that.getGoodsList();
          var interval = setInterval(function () {
            that.getGoodsList();
            clearTimeout(interval)
            //需不断调用的操作
          }, 200) 
    
        } else {
          //显示错误信息
        }

      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getList: function () {
    var that = this;
    util.request(api.ApiRootUrl + 'api/catalog/' + that.data.currentCategory.cat_id)
      .then(function (res) {
        console.log(res)
        that.setData({
          categoryList: res.data,
        });
      });
  },
  getCategoryInfo: function () {
    let that = this;
    console.log(this.data)
    that.getGoodsList();
    // util.request(api.GoodsCategory, {
    //     id: this.data.currentCategory.id
    //   }).then(function (res) {
    //     console.log(res)
    //     if (res.errno == 0) {
    //       console.log(res)
    //       that.setData({
    //         // navList: res.data.brotherCategory,
    //         // currentCategory: res.data.currentCategory
    //       });
    //       //nav位置
    //       let currentIndex = 0;
    //       let navListCount = that.data.navList.length;
    //       for (let i = 0; i < navListCount; i++) {
    //         currentIndex += 1;
    //         if (that.data.navList[i].id == that.data.id) {
    //           break;
    //         }
    //       }
    //       if (currentIndex > navListCount / 2 && navListCount > 5) {
    //         that.setData({
    //           scrollLeft: currentIndex * 60
    //         });
    //       }
    //       that.getGoodsList();

    //     } else {
    //       //显示错误信息
    //     }

    //   });
  },
  onReachBottom: function () {
    this.getGoodsList()
  },
  getGoodsList: function () {
    var that = this;
    console.log(that.data.id, that.data.totalPages, that.data.page - 1)
    if (that.data.totalPages <= that.data.page - 1) {
      that.setData({
        nomore: true
      })
      return;
    }
    console.log(that.data)
    util.request(api.GoodsList, {
        // categoryId: that.data.currentCategory.id,
        categoryId: that.data.id,
        page: that.data.page,
        size: that.data.size
      }).then(function (res) {
        console.log(res)
        that.setData({
          goodsList: that.data.goodsList.concat(res.data.goodsList),
          page: res.data.currentPage + 1,
          totalPages: res.data.totalPages
        });
      });
  },
  switchCate: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    // if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
    //   return false;
    // }
    console.log(event)
    this.getCurrentCategory(event.currentTarget.dataset.id);
    console.log(event.currentTarget.dataset.id)
    // this.getCategoryInfo();
  },

  switchCate1: function (event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    console.log(this.data.goodsCount)
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    console.log(event.currentTarget.dataset.id)
    this.setData({
      id: event.currentTarget.dataset.id,
      page: 1,
      totalPages: 1,
      goodsList: [],
      nomore: false
    });

    this.getCategoryInfo();
  }
})