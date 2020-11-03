// pages/leasing/leasing.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    detail_id: 0,
    type: '',
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var detail_id = options.detail_id;
    var type = options.type;
    console.log(type)
    var count = options.count
    this.setData({
      detail_id: detail_id,
      type: type,
      count: count
    });
    this.initData();
  },

  initData: function () {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/getFixedAddresses',
      data: {
        shop_id: app.globalData.shop_id
      },
      method: 'POST',
      success: function (res) {
        var array = [];
        for (var index in res.data.leasings) {
          var object = new Object();
          object.id = res.data.leasings[index].leasing.id;
          object.name = res.data.leasings[index].leasing.name;
          object.phone = res.data.leasings[index].leasing.phone;
          object.address = res.data.leasings[index].leasing.desc;
          array[index] = object;
        }
        page.setData({ array: array });
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

  seeDetail: function (e) {
    var page = this;
    app.globalData.leasing_id = this.data.array[e.currentTarget.id].id;
    wx.redirectTo({
      url: '../certmake/certmake?id=' + page.data.detail_id + '&type=' + page.data.type + '&num=' + page.data.count
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