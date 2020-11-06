const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    activity: [],
    btn_type:'btn',
    info_flag: false
  },

  onShow: function () {
    var id = 0;
    this.initData(id);
    if (id == 18) {
      this.setData({ info_flag: true,
        btn_type:'btn_gonggao' })
    }else {
      this.setData({
        info_flag: false,
        btn_type: 'btn'
      })     
    }
  },

  //事件处理函数
  onLoad: function (options) {
    let qrUrl = decodeURIComponent(options.q)
    if (qrUrl.indexOf("shareId=") != -1) {
      var arr = qrUrl.split("shareId=");
      var strId = arr[1];
      app.globalData.share_id = strId;
      wx.setStorageSync('share_id', strId);
    }else{
      var share_id = wx.getStorageSync('share_id');    
      if (share_id != undefined){
        if (share_id != ""){
          app.globalData.share_id = share_id
        }
      }
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })


    var id = 0;
    this.initData(id);
    if (id == 18) {
      this.setData({ info_flag: true,
        btn_type:'btn_gonggao' })
    }else {
      this.setData({
        info_flag: false,
        btn_type: 'btn'
      })     
    }
  },

  initData: function (id) {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/shoppingGetByType',
      data: {
        type_id: id,
        shop_id: app.globalData.shop_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          var activity = [];
          for (var index in res.data.data.shoppings) {
            var object = new Object();
            object.img = 'https://www.hattonstar.com/storage/' + res.data.data.shoppings[index].url;
            console.log(object.img)
            object.name = res.data.data.shoppings[index].name;
            object.id = res.data.data.shoppings[index].id;
            activity[index] = object;
          }
          page.setData({
            activity: activity
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

  typeHandler: function (e) {
    var id = e.currentTarget.dataset.id;
    if (this.data.info_flag == false) {
      wx.navigateTo({
        url: '../detail/detail?id=' + id
      });
    }else {
      wx.navigateTo({
        url: '../detailinfo/detailinfo?id=' + id
      });
    }
  }
})