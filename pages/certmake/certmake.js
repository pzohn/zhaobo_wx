var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail_id: 0,
    address_id:0,
    address_info: {}, //地址信息
    goods_info: [], //商品信息
    address_info:[],//地址信息
    goods_count: '', //商品件数
    goods_freight: '', //运费
    goods_price: '', //商品价格
    total_price: '', //合计价格
    all_total_price:'',//最终价格
    royalty_price:'',//分润抵扣
    item: {
      iconfontBack: "icon-arrowleft",
      navigationBarTitle: "确认订单",
      statusBarHeight: app.globalData.statusBarHeight
    },
    statusBarHeight: app.globalData.statusBarHeight,
    goods_id: '', //商品id
    hasAddr: false, //选项
    order_message: '', //订单留言
    cart_ids: [], // 购物车商品id
    type:'',
    fixed_address_flag:false,
    fixed_address:[],
    down_flag:false
  },
  //选择地址
  bindaddress: function () {
    if (this.data.fixed_address_flag == false){
      if (this.data.hasAddr == 1) {
        wx.redirectTo({
          url: '../editaddress/editaddress?id=' + this.data.address_id + '&detail_id=' + this.data.detail_id + '&type=' + this.data.type + '&count=' + this.data.goods_count
        })
      } else {
        wx.redirectTo({
          url: '../newaddress/newaddress?detail_id=' + this.data.detail_id + '&type=' + this.data.type + '&count=' + this.data.goods_count
        })
      }
    } else {
      
    }


  },
  // 留言
  bindwaitMsg: function (event) {
    this.setData({
      order_message: event.detail.value, // 订单留言
    })
  },

  deleteCert(id) {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/certdelete',
      data: {
        id: id
      },
      method: 'POST',
      success: function (res) {

      },
      fail: function (res) {
        wx.showModal({
          title: '错误提示',
          content: '服务器无响应，请联系工作人员!',
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  },
  //  提交订单
  bindSubmitOrder: function (e) {
    this.setData({down_flag:false});
    this.doDeal();
  },

  //  线下订单
  bindSubmitDownOrder: function (e) {
    this.setData({down_flag:true});
    this.doDeal();
  },

  delCerts(list) {
    for (var index in list) {
      var item = list[index];
      this.deleteCert(item.id);
    }
  },

  authorize: function () {
    wx.navigateTo({
      url: '../getuser/getuser'
    });
  },

  dealTrade() {
    var wxUserInfo = wx.getStorageSync('wxUserInfo');
    if (wxUserInfo.nickName == undefined) {
      app.globalData.authorizeFlag = false;
      this.authorize();
      return;
    }

    var page = this;
    wx.login({
      success: res => {
        var code = res.code;
        // console.log(code)
        // console.log(page.data.detail_id)
        // console.log(app.globalData.wx_id)
        // console.log(page.data.goods_count)
        // console.log(page.data.address_id)
        // console.log(wxUserInfo.nickName)
        // console.log(app.globalData.share_id)
        // console.log(page.data.royalty_price)
        // console.log(page.data.all_total_price)
        // console.log( app.globalData.shop_id)
        // return
        if (code) {
          wx.request({
            url: 'https://www.hattonstar.com/onPayShopping',
            data: {
              js_code: code,
              detail_id: page.data.detail_id,
              wx_id: app.globalData.wx_id,
              num: page.data.goods_count,
              address_id: page.data.address_id,
              name: wxUserInfo.nickName,
              share_id: app.globalData.share_id,
              use_royalty: page.data.royalty_price,
              total_fee:page.data.all_total_price,
              shop_id: app.globalData.shop_id
            },
            method: 'POST',
            success: function (res) {
              wx.requestPayment(
                {
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.paySign,
                  'success': function (res) {
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 2000,
                      success: function () {
                        setTimeout(function () {
                          wx.switchTab({
                            url: '../my/my'
                          })
                        }, 2000) //延迟时间
                      }
                    });
                  },
                  'fail': function (res) {
                  },
                  'complete': function (res) {
                  }
                })
            },
            fail: function (res) {
            }
          })
        }
      }
    })
  },

  dealTradeDown() {
    var wxUserInfo = wx.getStorageSync('wxUserInfo');
    if (wxUserInfo.nickName == undefined) {
      app.globalData.authorizeFlag = false;
      this.authorize();
      return;
    }

    var page = this;
    wx.login({
      success: res => {
        var code = res.code;
        if (code) {
          wx.request({
            url: 'https://www.hattonstar.com/onPayShoppingDown',
            data: {
              js_code: code,
              detail_id: page.data.detail_id,
              wx_id: app.globalData.wx_id,
              num: page.data.goods_count,
              address_id: page.data.address_id,
              name: wxUserInfo.nickName,
              share_id: app.globalData.share_id,
              use_royalty: page.data.royalty_price,
              total_fee:page.data.all_total_price,
              shop_id: app.globalData.shop_id
            },
            method: 'POST',
            success: function (res) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000,
                success: function () {
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../my/my'
                    })
                  }, 2000) //延迟时间
                }
              });
            },
            fail: function (res) {
            }
          })
        }
      }
    })
  },

  dealTradeFree() {
    var wxUserInfo = wx.getStorageSync('wxUserInfo');
    if (wxUserInfo.nickName == undefined) {
      app.globalData.authorizeFlag = false;
      this.authorize();
      return;
    }
    var page = this;
    var wxUserInfo = wx.getStorageSync('wxUserInfo');
    wx.request({
      url: 'https://www.hattonstar.com/onPayShoppingFree',
      data: {
        detail_id: page.data.detail_id,
        wx_id: app.globalData.wx_id,
        num: page.data.goods_count,
        address_id: page.data.address_id,
        name: wxUserInfo.nickName,
        share_id: app.globalData.share_id,
        use_royalty: page.data.royalty_price
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.switchTab({
                url: '../my/my',
              })
            }, 2000) //延迟时间
          }
        });
      },
      fail: function (res) {
      }
    })
  },

  dealCertFree(certInfo) {
    var wxUserInfo = wx.getStorageSync('wxUserInfo');
    if (wxUserInfo.nickName == undefined) {
      app.globalData.authorizeFlag = false;
      this.authorize();
      return;
    }
    this.delCerts(app.globalData.certlist);
    var page = this;
    var body = '';
    if (page.data.goods_info.length == 1) {
      body = page.data.goods_info[0].title;
    } else if (page.data.goods_info.length > 1) {
      body = page.data.goods_info[0].title + '...'
    }
    wx.request({
      url: 'https://www.hattonstar.com/onPayrCertFree',
      data: {
        certInfo: certInfo,
        body: body,
        wx_id: app.globalData.wx_id,
        address_id: page.data.address_id,
        name: wxUserInfo.nickName,
        share_id: app.globalData.share_id,
        use_royalty: page.data.royalty_price
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.switchTab({
                url: '../my/my',
              })
            }, 2000) //延迟时间
          }
        });
      },
      fail: function (res) {
      }
    })
  },

  dealCert(certInfo) {
    var wxUserInfo = wx.getStorageSync('wxUserInfo');
    if (wxUserInfo.nickName == undefined) {
      app.globalData.authorizeFlag = false;
      this.authorize();
      return;
    }
   this.delCerts(app.globalData.certlist);
    var page = this;
    var body = '';
    if (page.data.goods_info.length == 1){
      body = page.data.goods_info[0].title;
    } else if (page.data.goods_info.length > 1){
      body = page.data.goods_info[0].title + '...'
    }
    wx.login({
      success: res => {
        var code = res.code;
        if (code) {
          wx.request({
            url: 'https://www.hattonstar.com/onPayForCert',
            data: {
              js_code: code,
              certInfo: certInfo,
              wx_id: app.globalData.wx_id,
              address_id: page.data.address_id,
              charge: page.data.all_total_price,
              body: body,
              name: wxUserInfo.nickName,
              share_id: app.globalData.share_id,
              use_royalty: page.data.royalty_price,
              shop_id: app.globalData.shop_id
            },
            method: 'POST',
            success: function (res) {
              wx.requestPayment(
                {
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.paySign,
                  'success': function (res) {
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 2000,
                      success: function () {
                        setTimeout(function () {
                          wx.switchTab({
                            url: '../my/my',
                          })
                        }, 2000) //延迟时间
                      }
                    });
                  },
                  'fail': function (res) {
                  },
                  'complete': function (res) {
                  }
                })
            },
            fail: function (res) {
            }
          })
        }
      }
    })
  },


  //返回上一页
  navBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    var id = options.id;
    var num = options.num;
    this.initMember(id, type, num);
  },

  initData: function (id) {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/makeTrades',
      data: {
        id: id,
        login_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        var goods_info = [];
        var object = new Object();
        object.title = res.data.name
        object.price = res.data.charge;
        object.image = 'https://www.hattonstar.com/storage/' + res.data.title_pic;
        object.count = page.data.goods_count;
        goods_info[0] = object;
        var total_price = object.price * page.data.goods_count;
        var royalty_price = page.data.royalty_price;
        royalty_price = 0
        var all_total_price = page.numberFormat(total_price - royalty_price);
        if (all_total_price <= 0){
          royalty_price = total_price;
          all_total_price = 0;
        }
        page.setData({
          goods_info: goods_info,
          total_price: page.numberFormat(total_price),
          royalty_price: page.numberFormat(royalty_price),
          all_total_price: page.numberFormat(all_total_price)
        });
        if (res.data.address){
          var address_info = [];
          var object = new Object();
          object.id = res.data.address.id;
          object.name = res.data.address.name;
          object.phone = res.data.address.phone;
          object.province = res.data.address.province;
          object.city = res.data.address.city;
          object.area = res.data.address.area;
          object.detail = res.data.address.detail;
          object.login_id = res.data.address.login_id;
          address_info[0] = object;
          page.setData({
            address_info: address_info,
            hasAddr: true,
            address_id: object.id
          });
          
        }else{
          page.setData({
            hasAddr: false
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '错误提示',
          content: '服务器无响应，请联系工作人员!',
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  },

  initMember: function (id, type, num) {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/memberSelect',
      data: {
        wx_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        var royalty_price = res.data.royalty;
        page.setData({
          royalty_price: royalty_price
        });
        if (type == 'trade') {
          page.setData({
            detail_id: id,
            goods_count: num,
            type: type
          });
          page.initData(id);
        } else if (type == 'cert') {
          page.initCert();
          page.setData({
            type: type
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '错误提示',
          content: '服务器无响应，请联系工作人员!',
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  },

  initCert: function () {
    var page = this;
    var goods_info = [];
    var total_price = 0;
    for (var index in app.globalData.certlist){
      var object = new Object();
      object.title = app.globalData.certlist[index].title;
      object.price = app.globalData.certlist[index].price;
      object.image = app.globalData.certlist[index].image;
      object.count = app.globalData.certlist[index].num;
      goods_info[index] = object;
      total_price += object.price * object.count;
    }
    var royalty_price = page.data.royalty_price;
    var all_total_price = page.numberFormat(total_price - royalty_price);
    if (all_total_price <= 0) {
      royalty_price = total_price;
      all_total_price = 0;
    }
    if (app.globalData.certlist.length) {
      page.setData({
        goods_info: goods_info,
        total_price: total_price,
        royalty_price: royalty_price,
        all_total_price: all_total_price
      });
    }
    wx.request({
      url: 'https://www.hattonstar.com/getAddress',
      data: {
        login_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data) {
          var address_info = [];
          var object = new Object();
          object.id = res.data.id;
          object.name = res.data.name;
          object.phone = res.data.phone;
          object.province = res.data.province;
          object.city = res.data.city;
          object.area = res.data.area;
          object.detail = res.data.detail;
          object.login_id = res.data.login_id;
          address_info[0] = object;
          page.setData({
            address_info: address_info,
            hasAddr: true,
            address_id: object.id
          });
        } else {
          page.setData({
            hasAddr: false
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '错误提示',
          content: '服务器无响应，请联系工作人员!',
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  },

  numberFormat: function (value) {
    var v = parseFloat(value)//强转Int，毕竟有可能返回是String类型的数字
    return v.toFixed(2)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.setData({fixed_address_flag:app.globalData.fixed_address_flag})
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

  },

  doDeal:function() {
    if (this.data.hasAddr == 0) {
      wx.showModal({
        title: '错误提示',
        content: '没有选择地址，请完善!',
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
      return
    }
    if (this.data.type == 'trade') {
      this.doTrade()
    } else if (this.data.type == 'cert') {
      this.doCert();
    }
  },

  doTrade: function () {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/shoppingGetById',
      data: {
        id: page.data.detail_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.data.shopping.stock <= 0){
          wx.showModal({
            title: '库存不足',
            content: '库存不足，请修改数量或选择其他商品!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            }
          })
          return
        }else{
          if (page.data.all_total_price == 0) {
            page.dealTradeFree();
          } else {
            if (page.data.down_flag == true){
              page.dealTradeDown();
            }else{
              page.dealTrade();
            }
          }
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '错误提示',
          content: '服务器无响应，请联系工作人员!',
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  },

  doCert: function () {
    var page = this;
    var certInfo = '';
    for (var index in app.globalData.certlist) {
      certInfo += app.globalData.certlist[index].shoppingid + ',' + app.globalData.certlist[index].num;
      certInfo += '@';
    }
    certInfo = certInfo.substr(0, certInfo.length - 1);
    wx.request({
      url: 'https://www.hattonstar.com/certStock',
      data: {
        certInfo: certInfo
      },
      method: 'POST',
      success: function (res) {
        if (res.data.result) {
          var str = res.data.str + '库存不足，请修改数量或选择其他商品!'
          wx.showModal({
            title: '库存不足',
            content: str,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            }
          })
          return
        } else {
      if (page.data.all_total_price == 0) {
        page.dealCertFree(certInfo);
      } else {
        page.dealCert(certInfo);
      }
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '错误提示',
          content: '服务器无响应，请联系工作人员!',
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  }
})