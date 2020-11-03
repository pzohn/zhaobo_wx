var app = getApp()
Page({
  data: {
    detail_id: 0
  },

  onLoad: function (options) {
    var id = options.id;
    let qrUrl = decodeURIComponent(options.q);
    if (qrUrl.indexOf("shareid=") != -1) {
      var arr = qrUrl.split("&");
      var strShareId = arr[0];
      var strId = arr[1];
      var arrShareId = strShareId.split("=");
      var arrId = strId.split("=");
      id = arrId[1];
      app.globalData.share_id = arrShareId[1];
    }
    var share_id = options.shareid;
    if (share_id != undefined) {
      app.globalData.share_id = share_id;
    }
    this.setData({
      detail_id: id
    });
    this.initData(id);
  },

  home() {
    wx.switchTab({
      url: app.globalData.index_style,
    })
  },

  poster() {
    app.globalData.notice_flag = 1;
    var page = this;
    wx.navigateTo({
      url: '../sharepage/sharepage?id=' + page.data.detail_id,
    })
  },

  initData: function (id) {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/shoppingGetById',
      data: {
        id: id
      },
      method: 'POST',
      success: function (res) {
        var imgUrls = [];
        for (var i in res.data.data.shopping.lunbo) {
          var object = new Object();
          object = 'https://www.hattonstar.com/storage/' + res.data.data.shopping.lunbo[i];
          imgUrls[i] = object;
        }
        var classInfo = [];
        for (var j in res.data.data.shopping.detail) {
          var object = new Object();
          object = 'https://www.hattonstar.com/storage/' + res.data.data.shopping.detail[j];
          classInfo[j] = object;
        }
        page.setData({
          title: res.data.data.shopping.name,
          imgUrls: imgUrls,
          classInfo: classInfo,
          price: res.data.data.shopping.price,
          gg_image: 'https://www.hattonstar.com/storage/' + res.data.data.shopping.title[0]
        });
        if (res.data.data.shopping.video != "") {
          page.setData({
            video_hide: true,
            video_url: 'https://www.hattonstar.com/storage/' + res.data.data.shopping.video[0]
          });
        }
        if (res.data.data.shopping.poster != "") {
          app.globalData.post_url = 'https://www.hattonstar.com/storage/' + res.data.data.shopping.poster[0];
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
})
