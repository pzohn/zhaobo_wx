Page({
  data: {
    activity: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    var ids = options.ids;
    page.initData(ids);
  },

  initData: function (ids) {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/shoppingGetByCollect',
      data: {
        ids: ids
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

  typeHandler: function (e) {
    var id = e.currentTarget.dataset.id;
    var activity_id = e.currentTarget.dataset.activityid;
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&activity_id=' + activity_id
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})