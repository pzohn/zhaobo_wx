var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'未登录',
    nickName:'未授权',
    avatarUrl:'',
    wx_id:0,
    royalty:0,
    integral:0,
    iconArray: [
      // {
      //   "iconUrl": 'https://www.hattonstar.com/gfcamp/info.png',
      //   "iconText": '个人信息',
      //   "id":1,
      //   "hide":true
      // },
      {
        "iconUrl": '../../images/myaddress.png',
        "iconText": '收货地址',
        "id": 2
      },
      {
        "iconUrl": '../../images/jifen.png',
        "iconText": '我的分销',
        "id": 3,
        "hide":true
      },
      // {
      //   "iconUrl": '../../images/refund.png',
      //   "iconText": '我的退款',
      //   "id": 4
      // },
      // {
      //   "iconUrl": 'https://www.hattonstar.com/gfcamp/card.png',
      //   "iconText": '积分商城',
      //   "id": 5
      // }
    ],

    tradeArray: [
      {
        "iconUrl": '../../images/qbdd.png',
        "iconText": '全部订单',
        "id": 10
      },
      {
        "iconUrl": '../../images/dfk.png',
        "iconText": '待付款',
        "id": 11
      },
      // {
      //   "iconUrl": '../../images/dfh.png',
      //   "iconText": '待发货',
      //   "id": 21
      // },
      // {
      //   "iconUrl": '../../images/dsh.png',
      //   "iconText": '待收货',
      //   "id": 31
      // },
      {
        "iconUrl": '../../images/dfh.png',
        "iconText": '线下付款',
        "id": 31
      },
      {
        "iconUrl": '../../images/ywc.png',
        "iconText": '已完成',
        "id": 41
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */

  listNew: function (id) {
    wx.navigateTo({
      url: '../list/list?type=' + id
    });
  },

  collect () {
    var wxUserInfo = wx.getStorageSync('wxUserInfo');
    if (wxUserInfo.nickName == undefined) {
      app.globalData.authorizeFlag = false;
      this.authorize();
      return;
    }
    wx.request({
      url: 'https://www.hattonstar.com/getCollect',
      data: {
        wx_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data != 0) {
          wx.navigateTo({
            url: '../collect/collect?ids=' + res.data
          });
        } else {
          wx.showModal({
            title: '收藏夹为空',
            content: '收藏夹为空!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            }
          });
          return;
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '错误提示',
          content: '服务器无响应，请联系工作人员!',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            }
          }
        })
      }
    })
  },

  authorize: function () {
    if (app.globalData.authorizeFlag == false){
      wx.navigateTo({
        url: '../getuser/getuser'
      });
      return;
    }
    wx.showModal({
      content: '更新授权信息',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../getuser/getuser'
          });
          return;
        } else if (res.cancel) {
        }
      }
    })
  },

  onItemClick: function (e) {
    var wxUserInfo = wx.getStorageSync('wxUserInfo');
    if (wxUserInfo.nickName == undefined) {
      app.globalData.authorizeFlag = false;
      this.authorize();
      return;
    }
    var index = e.currentTarget.id;
    var that = this;
    if (index == 1){
      wx.navigateTo({
        url: '../userinfo/userinfo'
      })
    } else if (index == 2){
      that.onAddress();
    } else if (index == 3) {
      wx.navigateTo({
        url: '../royalty/royalty'
      })
    } else if (index == 4) {
      this.listNew(5)
    }else if (index == 5) {
      wx.showModal({
        content: '在路上,敬请期待',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    } else if (index == 10) {
      this.listNew(0)
    } else if (index == 11) {
      this.listNew(1)
    } else if (index == 21) {
      this.listNew(2)
    } else if (index == 31) {
      this.listNew(3)
    } else if (index == 41) {
      this.listNew(4)
    }
  },

  onAddress: function () {
    wx.request({
      url: 'https://www.hattonstar.com/getAddressByLoginId',
      data: {
        login_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data == 0) {
          wx.navigateTo({
            url: '../newaddress/newaddress?detail_id=' + 0 + '&type=' + 100 + '&count=' + 0
          })
        } else {
          wx.navigateTo({
            url: '../editaddress/editaddress?id=' + res.data.id + '&detail_id=' + 0 + '&type=' + 100 + '&count=' + 0
          })
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

  onLoad: function (options) {
    this.setData({ wx_id: app.globalData.wx_id})
    var wxUserInfo = wx.getStorageSync('wxUserInfo');
    if (wxUserInfo.nickName == undefined){
      app.globalData.authorizeFlag = false;
    }else{
      this.setData({
        nickName: wxUserInfo.nickName,
        avatarUrl: wxUserInfo.avatarUrl
      });
      app.globalData.authorizeFlag = true;
    }
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
    var wxUserInfo = wx.getStorageSync('wxUserInfo');
    if (wxUserInfo.nickName == undefined) {
      app.globalData.authorizeFlag = false;
    } else {
      this.setData({
        nickName: wxUserInfo.nickName,
        avatarUrl: wxUserInfo.avatarUrl
      });
      app.globalData.authorizeFlag = true;
    }
    this.initCert();
    this.initMyFen();
    this.initUser();
  },

  initCert: function () {
    var that = this;
    wx.request({
      url: 'https://www.hattonstar.com/getCertsNum',
      data: {
        wx_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        var num = res.data;
        if (num) {
          var numString = num + ""
          wx.setTabBarBadge({
            index: 1,
            text: numString
          })
        } else {
          wx.removeTabBarBadge({
            index: 1,
          })
        }
      },
      fail: function (res) {
      }
    })
  },

  initMyFen: function () {
    var that = this;
    wx.request({
      url: 'https://www.hattonstar.com/memberSelect',
      data: {
        wx_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          royalty: res.data.royalty,
          integral: res.data.integral
        });
      },
      fail: function (res) {
      }
    })
  },

  initUser: function () {
    this.initShareForZhaobo();
  },

  initShareForZhaobo: function () {
    var that = this
    wx.request({
      url: 'https://www.hattonstar.com/IsShareForZhaobo',
      data: {
        wx_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data == 1){
          var iconArray = that.data.iconArray;
          for (var index in iconArray) {
            var item = iconArray[index];
            if (item.id == 3)
            {
              item.hide = false
              iconArray[index] = item
              that.setData({ iconArray: iconArray})
            }
         }
        }else
        {
          var iconArray = that.data.iconArray;
          for (var index in iconArray) {
            var item = iconArray[index];
            if (item.id == 3)
            {
              item.hide = true
              iconArray[index] = item
              that.setData({ iconArray: iconArray})
            }
         }
        }
      },
      fail: function (res) {
      }
    })
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