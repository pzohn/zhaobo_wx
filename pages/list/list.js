var app = getApp()
Page({
  data: {
    activity: [],
    page_id:0,
    itemOnFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    var id = options.type;
    page.initData(id);
  },

  initData: function (id) {
    var page = this;
    var url = '';
    page.setData({ itemOnFlag: true })
    if (id == 0){
      url = 'https://www.hattonstar.com/getOrderAllForPerson'
    } else if (id == 1){
      url = 'https://www.hattonstar.com/getOrderUnPayForPerson'
    } else if (id == 2) {
      url = 'https://www.hattonstar.com/getOrderUnsendForPerson'
    } else if (id == 3) {
      url = 'https://www.hattonstar.com/getOrderUnreceiveForPerson'
    } else if (id == 4) {
      url = 'https://www.hattonstar.com/getOrderFinishForPerson'
    } else if (id == 5) {
      url = 'https://www.hattonstar.com/getOrderRefundForPerson'
      page.setData({itemOnFlag:false})
    } 
    wx.request({
      url: url,
      data: {
        wx_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        var activity = [];
        for (var index in res.data.data) {
          var object = new Object();
          object.count = res.data.data[index].count;
          if (res.data.data[index].count == 1){
            object.img = 'https://www.hattonstar.com/storage/' + res.data.data[index].detail[0].title_pic;
            object.name = res.data.data[index].detail[0].name;
            object.activity_id = res.data.data[index].detail[0].shopping_id;
            object.num = res.data.data[index].detail[0].num;
            object.charge = res.data.data[index].detail[0].charge;
          }else{
            var detail = [];
            for (var i in res.data.data[index].detail){
              var objectDetail = new Object();
              objectDetail.img = 'https://www.hattonstar.com/storage/' + res.data.data[index].detail[i].title_pic;
              objectDetail.activity_id = res.data.data[index].detail[i].shopping_id;
              objectDetail.num = res.data.data[index].detail[i].num;
              objectDetail.name = res.data.data[index].detail[i].name;
              objectDetail.charge = res.data.data[index].detail[i].charge;
              detail[i] = objectDetail;
            }
            object.detail = detail;
          }
          object.out_trade_no = res.data.data[index].tradeid;
          object.status = res.data.data[index].status;
          object.date = res.data.data[index].time;
          object.color = res.data.data[index].color;
          object.trade_id = res.data.data[index].id;
          object.address = res.data.data[index].address;
          object.total_charge = res.data.data[index].charge;
          object.royalty_charge = res.data.data[index].use_royalty;
          if (object.status == '待付款'){
            object.payhide = false;
            object.deletehide = false;
            object.refundhide = true;
            object.refund = true;
          } else if (object.status == '待收货') {
            object.refund = false;
            object.payhide = true;
            object.deletehide = true;
            object.refundhide = true;
          }else {
            object.refund = true;
            object.payhide = true;
            object.deletehide = true;
            object.refundhide = true;
          } 
          if (object.status == '待处理'){
            object.refundhide = false;
          }
          object.index = index;
          activity[index] = object;
        }
        page.setData({
          activity: activity,
          page_id:id
        });
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
  
  gotoDetail(e){
    if (this.data.itemOnFlag == true){{
      var page = this
      var index = e.currentTarget.dataset.index;
      app.globalData.listdetail = this.data.activity[index];
      wx.redirectTo({
        url: '../listdetail/listdetail?page_id=' + page.data.page_id
      });
    }}
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  deleteRefund:function (e) {
    var id = e.currentTarget.dataset.id;
    var page = this
    wx.showModal({
      title: '关闭退款',
      content: '确认关闭退款吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.hattonstar.com/postRefund',
            data: {
              id: id,
              refund_status:0
            },
            method: 'POST',
            success: function (res) {
              wx.showToast({
                title: '关闭成功',
                icon: 'success',
                duration: 3000,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.redirectTo({
                      url: '../list/list?type=' + page.data.page_id
                    })
                  }, 2000)
                }
              });
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
      }
    })
  },

  delete: function (e) {
    var id = e.currentTarget.dataset.id;
    var page = this
    wx.showModal({
      title: '关闭订单',
      content: '确认关闭订单吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.hattonstar.com/hideOrder',
            data: {
              id: id
            },
            method: 'POST',
            success: function (res) {
              wx.showToast({
                title: '关闭成功',
                icon: 'success',
                duration: 3000,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.redirectTo({
                      url: '../list/list?type=' + page.data.page_id
                    })
                  }, 2000)
                }
              });
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
      }
    })
  },

  refund: function (e) {
    var id = e.currentTarget.dataset.id;
    var page = this
    wx.showModal({
      title: '提交退款',
      content: '确定提交退款吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.hattonstar.com/postRefund',
            data: {
              id: id,
              refund_status: 1
            },
            method: 'POST',
            success: function (res) {
              wx.showToast({
                title: '提交退款成功',
                icon: 'success',
                duration: 3000,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.redirectTo({
                      url: '../list/list?type=' + page.data.page_id
                    })
                  }, 2000)
                }
              });
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
      }
    })
  },

  pay: function (e) {
    var id = e.currentTarget.dataset.id;
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/repayStock',
      data: {
        trade_id: id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.result) {
          var str = res.data.str + '库存不足，请关闭订单重新选择!'
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
          page.doPay(id)
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

  doPay(id){
    var page = this
    wx.showModal({
      title: '支付订单',
      content: '确认支付订单吗?',
      success: function (res) {
        if (res.confirm) {
          wx.login({
            success: res => {
              var code = res.code;
              if (code) {
                wx.request({
                  url: 'https://www.hattonstar.com/onRePay',
                  data: {
                    js_code: code,
                    trade_id: id,
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
                            duration: 3000,
                            success: function () {
                              setTimeout(function () {
                                //要延时执行的代码
                                wx.redirectTo({
                                  url: '../list/list?type=3'
                                })
                              }, 2000)
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
        }
      }
    })
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