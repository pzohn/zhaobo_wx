var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    index:0,
    hiddenLoading: false,
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var name = options.name;
    this.initDataByName(name);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var tt = this;
    setTimeout(function () {
      tt.setData({
        hiddenLoading: true
      });
    }, 2000)
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

  },

  initDataByName: function (name) {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/getInfoByName',
      data: {
        name: name,
        shop_id: app.globalData.shop_id
      },
      method: 'POST',
      success: function (res) {
        var activity = [];
        for (var index in res.data) {
          var object = new Object();
          object.img = 'https://www.hattonstar.com/storage/' + res.data[index].title_pic;
          object.name = res.data[index].name;
          object.id = res.data[index].id;
          object.activity_id = res.data[index].activity_id;
          activity[index] = object;
        }
        page.setData({
          activity: activity
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

  resetSearch: function () {
    if (this.data.name == ''){
      wx.showModal({
        title: '搜索条件为空',
        content: '请输入关键字!',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
      return;
    }
    this.initDataByName(this.data.name);
  },

  accountInput: function (e) {
    var content = e.detail.value;
    this.setData({ name: content });
  },

  typeHandler: function (e) {
    var id = e.currentTarget.dataset.id;
    var activity_id = e.currentTarget.dataset.activityid;
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&activity_id=' + activity_id
    });
  }
})