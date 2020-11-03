//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    region: ['河南省','许昌市','魏都区'],
    name: '',
    phone: '',
    detail: '',
    detail_id: 0,
    address_id: 0,
    type: '',
    count: 0
  },

  onLoad: function (options) {
    var detail_id = options.detail_id;
    var id = options.id;
    var type = options.type;
    var count = options.count;
    this.setData({
      detail_id: detail_id,
      address_id:id,
      type: type,
      count: count
    });
    this.initData(id);
  },

  saveAddress: function () {
    var page = this;
    var app = getApp();
    wx.request({
      url: 'https://www.hattonstar.com/updateAddress',
      data: {
        id: page.data.address_id,
        name: page.data.name,
        phone: page.data.phone,
        province: page.data.region[0],
        city: page.data.region[1],
        area: page.data.region[2],
        detail: page.data.detail
      },
      method: 'POST',
      success: function (res) {
        if (page.data.type == 100) {
          wx.switchTab({
            url: '../my/my'
          })
        }else {
          wx.redirectTo({
            url: '../certmake/certmake?id=' + page.data.detail_id + '&type=' + page.data.type + '&num=' + page.data.count
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

  delAddress: function () {
    var page = this;
    var app = getApp();
    console.log("oooo")
    console.log(page.data.address_id)
    wx.request({
      url: 'https://www.hattonstar.com/delAddress',
      data: {
        id: page.data.address_id
      },
      method: 'POST',
      success: function (res) {
        if (page.data.type == 100) {
          wx.switchTab({
            url: '../my/my'
          })
        } else {
        wx.redirectTo({
          url: '../certmake/certmake?id=' + page.data.detail_id + '&type=' + page.data.type + '&num=' + page.data.count
        })}
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

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  accountInput: function (e) {
    if (e.currentTarget.id == 1) {
      this.setData({ name: e.detail.value });
    } else if (e.currentTarget.id == 2) {
      this.setData({ phone: e.detail.value });
    } else if (e.currentTarget.id == 3) {
      this.setData({ detail: e.detail.value });
    }
  },

  initData: function (id) {
    var page = this;
    var app = getApp();
    wx.request({
      url: 'https://www.hattonstar.com/getAddressById',
      data: {
        id: id
      },
      method: 'POST',
      success: function (res) {
        var region = [];
        region[0] = res.data.province;
        region[1] = res.data.city;
        region[2] = res.data.area;
        page.setData({ 
          name: res.data.name,
          phone: res.data.phone,
          detail: res.data.detail,
          region: region,
          id:id
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
})
