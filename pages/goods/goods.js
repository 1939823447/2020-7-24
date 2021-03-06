var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    winHeight: "",
    id: 0,
    goods: {},
    gallery: [],
    attribute: [],
    issueList: [],
    comment: [],
    brand: {},
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    noCollectImage: "/static/images/icon_collect.png",
    hasCollectImage: "/static/images/icon_collect_checked.png",
    collectBackImage: "/static/images/icon_collect.png",
    allColor: [],
    allPrice: [],
  specValueId:'',
  colorValueId:'',
  },
  getGoodsInfo: function () {
    let that = this;
    util.request(api.GoodsDetail, { 
      id: that.data.id 
    }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data)
        that.setData({
          goods: res.data.info,
          gallery: res.data.gallery,
          attribute: res.data.attribute,
          issueList: res.data.issue,
          comment: res.data.comment,
          brand: res.data.brand,
          specificationList: res.data.specificationList,
          productList: res.data.productList,
          userHasCollect: res.data.userHasCollect
        });
        //设置默认值
        that.setDefSpecInfo(that.data.specificationList);
        if (res.data.userHasCollect == 1) {
          that.setData({
            'collectBackImage': that.data.hasCollectImage
          });
        } else {
          that.setData({
            'collectBackImage': that.data.noCollectImage
          });
        }

        WxParse.wxParse('goodsDetail', 'html', res.data.info.goods_desc, that);

        // that.getGoodsRelated();
      }
    });

  },
  // getGoodsRelated: function () {
  //   let that = this;
  //   util.request(api.GoodsRelated, { id: that.data.id }).then(function (res) {
  //     if (res.errno === 0) {
  //       that.setData({
  //         relatedGoods: res.data.goodsList,
  //       });
  //     }
  //   });

  // },
  clickSkuValue: function (event) {
    console.log(event)
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = that.data.specValueId;
    let colorValueId = that.data.colorValueId;
    if(specNameId==1){
       colorValueId = event.currentTarget.dataset.valueId;
    }
    if(specNameId==2){
     specValueId = event.currentTarget.dataset.valueId;
    }
    that.setData({
      specValueId:specValueId,
      colorValueId:colorValueId
    })
    util.request(api.getCheckPrice, {
      goodsId: that.data.id,
      colorId: colorValueId,
      specifId: specValueId
    }).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        console.log(res.data.color)
        console.log(res.data)
        that.setData({
          allColor: res.data.color,
          allPrice: res.data.price
        })
      } else {
        console.log(res)
      }
    });
    //判断是否可以点击
    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    console.log(_specificationList)
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].specification_id == specNameId) {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].id == specValueId || _specificationList[i].valueList[j].id == colorValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) {
              _specificationList[i].valueList[j].checked = false;
            } else {
              _specificationList[i].valueList[j].checked = true;
            }
          } else {
            _specificationList[i].valueList[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();

    //重新计算哪些值不可以点击
  },
  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    console.log(_specificationList)
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].specification_id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;
  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {

  },
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });

    return checkedValue.join('_');
  },
  changeSpecInfo: function () {
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {

      this.setData({
        'checkedSpecText': checkedValue.join('　')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格数量'
      });
    }

  },
  getCheckedProductItem: function (key) {
    // console.log(this.data.productList.goods_specification_ids.indexOf(key))
    return this.data.productList.filter(function (v) {
      console.log(v.goods_specification_ids.indexOf(key))
      if (v.goods_specification_ids.indexOf(key) > -1) {
        return true;
      } else {
        return false;
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: parseInt(options.id)
      // id: 1181000
    });
    console.log(123333)
    var that = this;
    this.getGoodsInfo();
    util.request(api.CartGoodsCount).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          cartGoodsCount: res.data.cartTotal.goodsCount
        });

      }
    });

    var that = this
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100;
        that.setData({
          winHeight: calc
        });
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
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr,
        collectBackImage: "/static/images/detail_back.png"
      });
    }
  },
  closeAttrOrCollect: function () {
    let that = this;
    if (this.data.openAttr) {
      this.setData({
        openAttr: false,
      });
      if (that.data.userHasCollect == 1) {
        that.setData({
          'collectBackImage': that.data.hasCollectImage
        });
      } else {
        that.setData({
          'collectBackImage': that.data.noCollectImage
        });
      }
    } else {
      //添加或是取消收藏
      util.request(api.CollectAddOrDelete, {
          typeId: 0,
          valueId: this.data.id
        }, "POST", "application/json")
        .then(function (res) {
          let _res = res;
          if (_res.errno == 0) {
            if (_res.data.type == 'add') {
              that.setData({
                'collectBackImage': that.data.hasCollectImage
              });
            } else {
              that.setData({
                'collectBackImage': that.data.noCollectImage
              });
            }

          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }

        });
    }

  },
  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },
  onShareAppMessage: function () {
    let userId = wx.getStorageSync('userId');
    console.log(userId)
    return {
      title: '蜜桃美妆馆',
      desc: '商品精选微信小程序商城',
      path: '/pages/auth/btnAuth/btnAuth?spid=' + userId + "&&share_type=is_share",
      // path: '/pages/au?spid=' + userId + "&&share_type=is_share",
    }
  },
  openIndexPage: function () {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

  /**
   * 直接购买
   */
  buyGoods: function () {
    console.log('点击我')
    var that = this;
    //提示选择完整规格
    if (!this.isCheckedAllSpec()) {
      wx.showToast({
        title: '请选择完整规格',
        icon: 'none',
      });
      return false;
    }
    //根据选中的规格，判断是否有对应的sku信息
    let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
    console.log(checkedProduct)
    if (!checkedProduct || checkedProduct.length <= 0) {
      //找不到对应的product信息，提示没有库存
      return false;
    }

    //验证库存
    if (checkedProduct.goods_number < this.data.number) {
      console.log(checkedProduct.goods_number)
      //找不到对应的product信息，提示没有库存
      return false;
    }
    console.log(this.data)
    if (this.data.allPrice.goods_number==0) {
      wx.showToast({
        image: '/static/images/icon_error.png',
        title:'商品库存不足',
        mask: true
      });
      return false;
    }
    if (this.data.goods.is_on_sale==0) {
      wx.showToast({
        image: '/static/images/icon_error.png',
        title:'商品已下架',
        mask: true
      });
      return false;
    }
    // 直接购买商品
    
    util.request(api.BuyAdd, {
      goodsId: this.data.goods.id,
      number: this.data.number,
      productId: checkedProduct[0].id
    }, "POST", 'application/json').then(function (res) {
      console.log(res)
      let _res = res;
      if (_res.errno == 0) {
        console.log(res + "立即购买")
        that.setData({
          openAttr: !that.data.openAttr,
          showModalStatus: false
        });
        wx.navigateTo({
          url: '/pages/shopping/checkout/checkout?isBuy=true',
        })
      } else {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: _res.errmsg,
          mask: true
        });
        console.log(3398908)
      }

    });
  },
  hideModal2: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY("100vh").step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus2: false
      })
    }.bind(this), 200)
  },
  /**
   * 添加到购物车
   */

  addToCart: function () {
    var that = this;

    //提示选择完整规格
    if (!this.isCheckedAllSpec()) {
      wx.showToast({
        title: '请选择完整规格',
        icon: 'none',
      });
      return false;
    }
    //根据选中的规格，判断是否有对应的sku信息
    let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
    if (!checkedProduct || checkedProduct.length <= 0) {
      //找不到对应的product信息，提示没有库存
      return false;
    }
    //验证库存
    if (checkedProduct.goods_number < this.data.number) {
      //找不到对应的product信息，提示没有库存
      return false;
    }
    console.log(456)
    //添加到购物车
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY("100vh").step()
    this.setData({
      animationData: animation.export(),
    })
    util.request(api.CartAdd, {
        goodsId: this.data.goods.id,
        number: this.data.number,
        productId: checkedProduct[0].id
      }, 'POST', 'application/json')
      .then(function (res) {
        let _res = res;
        if (_res.errno == 0) {
          console.log(res + "我是加入购物车")
          wx.showToast({
            title: '添加成功'
          });
          animation.translateY(0).step()
          that.setData({
            openAttr: !that.data.openAttr,
            cartGoodsCount: _res.data.cartTotal.goodsCount,
            showModalStatus2: false
          });
          if (that.data.userHasCollect == 1) {
            that.setData({
              'collectBackImage': that.data.hasCollectImage
            });
          } else {
            that.setData({
              'collectBackImage': that.data.noCollectImage
            });
          }
        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: _res.errmsg,
             mask: true
          });
        }

      });
  },
  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    });
  },
  setDefSpecInfo: function (specificationList) {
    //未考虑规格联动情况
    let that = this;
    if (!specificationList) return;
    for (let i = 0; i < specificationList.length; i++) {
      let specification = specificationList[i];
      let specNameId = specification.specification_id;
      let specValueId = specification.valueList[0].id;
      let colorValueId = specification.valueList[0].id;
      that.clickSkuValue({
        currentTarget: {
          dataset: {
            "nameId": specNameId,
            "valueId": specValueId
          }
        }
      });
      //规格只有一个时自动选择规格
      if (specification.valueList && specification.valueList.length == 1) {
        let specValueId = specification.valueList[0].id;
        let  colorValueId = specification.valueList[0].id;
        // that.clickSkuValue({
        //   currentTarget: {
        //     dataset: {
        //       "nameId": specNameId,
        //       "valueId": specValueId
        //     }
        //   }
        // });
      }
    }

    specificationList.map(function (item) {

    });
 
  },
  //点击我显示底部弹出框
  clickme: function () {
    this.showModal();
  },
  clickme2: function () {
    this.showModal2();
  },

  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY("100vh").step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY("100vh").step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  showModal2: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY("100vh").step()
    this.setData({
      animationData: animation.export(),
      showModalStatus2: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  //隐藏对话框

  bindClose: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY("100vh").step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  bindClose2: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY("100vh").step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus2: false
      })
    }.bind(this), 200)
  },
  previewImage: function (e) {
    let that = this;
    let src = e.currentTarget.dataset.src;
    console.log(e)
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] 
    })
  },
})