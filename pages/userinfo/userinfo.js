var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: '',
    phone: '',
    name: '',
    email: '',
    age: ''
  },

  formSubmit: function (e) {
    if (e.detail.value.name == ''){
      wx.showModal({
        title: '错误提示',
        content: '姓名不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return;
    }
    if (e.detail.value.sex == '') {
      wx.showModal({
        title: '错误提示',
        content: '性别不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return;
    }
    if (e.detail.value.sex != '男' && e.detail.value.sex != '女') {
      wx.showModal({
        title: '错误提示',
        content: '性别格式有误',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return;
    }
    if (e.detail.value.age == 0 || e.detail.value.age > 30) {
      wx.showModal({
        title: '错误提示',
        content: '请输入正确的年龄',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return;
    }
    wx.request({
      url: 'https://www.hattonstar.com/memberUpdate',
      data: {
        name: e.detail.value.name,
        age: e.detail.value.age,
        email: e.detail.value.email,
        phone: e.detail.value.phone,
        sex: e.detail.value.sex,
        wx_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        console.l
        wx.showModal({
          title: '提示',
          content: '更新成功！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              });
            }
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var wxUserInfo = wx.getStorageSync('wxUserInfo');
    this.setData({
      avatarUrl: wxUserInfo.avatarUrl
    });
    this.initData();
  },

  initData: function () {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/memberSelect',
      data: {
        wx_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        page.setData({
          name: res.data.name,
          phone: res.data.phone,
          email: res.data.email,
          age: res.data.age,
          sex:res.data.sex
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})