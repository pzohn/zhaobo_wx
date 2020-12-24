// pages/express/express.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:'',
    expName:'',
    expSite:'',
    expPhone:'',
    updateTime:'',
    takeTime:'',
    logo:'',
    list:[],
    finish_flag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.initData(id);
  },


  initData: function (id) {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/getExpressById',
      data: {
        id: id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.list.length){
          var list = [];
          for (var i in res.data.list) {
            var object = new Object();
            object.status = res.data.list[i].status;
            var str = res.data.list[i].time;
            var arr = str.split(' ');
            object.date = arr[0];
            object.time = arr[1];
            list[i] = object;
          }
        }
        page.setData({
          number: res.data.number,
          expName: res.data.expName,
          expSite: res.data.expSite,
          expPhone: res.data.expPhone,
          updateTime: res.data.updateTime,
          takeTime: res.data.takeTime,
          logo: res.data.logo,
          list: list
        });
        if ((res.data.issign == 1) || (res.data.deliverystatus >= 3)){
          page.setData({ finish_flag:true})
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