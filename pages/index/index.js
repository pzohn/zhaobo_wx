const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    DFrames: {
      layOut: [
        { imgUrl: "https://www.gfcamps.cn/morningstar/1.jpg", text: "研学旅行", route: "../indexdetail/indexdetail?id=15" },
        { imgUrl: "https://www.gfcamps.cn/morningstar/2.jpg", text: "社会实践", route: "../indexdetail/indexdetail?id=16" },
        { imgUrl: "https://www.gfcamps.cn/morningstar/3.jpg", text: "周末主题", route: "../indexdetail/indexdetail?id=17" },
        { imgUrl: "https://www.gfcamps.cn/morningstar/4.jpg", text: "公告中心", route: "../indexdetail/indexdetail?id=18" },
        { imgUrl: "https://www.gfcamps.cn/morningstar/5.jpg", text: "夏/冬令营", route: "../indexdetail/indexdetail?id=19" },
        { imgUrl: "https://www.gfcamps.cn/morningstar/6.jpg", text: "亲子活动", route: "../indexdetail/indexdetail?id=20" },
        { imgUrl: "https://www.gfcamps.cn/morningstar/7.jpg", text: "公益", route: "../indexdetail/indexdetail?id=21" },
        { imgUrl: "https://www.gfcamps.cn/morningstar/8.jpg", text: "家庭教育", route: "../indexdetail/indexdetail?id=22" },
      ]
    },

    proLst: [],
    navScrollLeft: 0,
    name: '',
    imgUrls: [],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    recommend: [],
    hotrec: []
  },

  onShow: function () {
    this.initCert();
    this.initData1();
  },

  goto(ev) {
    let route = ev.currentTarget.dataset.route;
    if (route) {
      wx.navigateTo({
        url: route,
      })
    }
  },

  //事件处理函数
  onLoad: function () {
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

    this.initData1();
  },

  initData1: function () {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/getIndexset',
      data: {
        shop_id: app.globalData.shop_id
      },
      method: 'POST',
      success: function (res) {
        var imgUrls = [];
        for (var i in res.data.lunbo) {
          var object = new Object();
          object.url = 'https://www.hattonstar.com/storage/' + res.data.lunbo[i].title_pic;
          object.link = '../detail/detail?id=' + res.data.lunbo[i].id;
          imgUrls[i] = object;
        }
        var recommend = [];
        for (var i in res.data.good) {
          var object = new Object();
          object.url = 'https://www.hattonstar.com/storage/' + res.data.good[i].title_pic;
          object.text = res.data.good[i].name;
          object.link = '../detail/detail?id=' + res.data.good[i].id;
          // if (object.title.length > 8) {
          //   object.title = object.title.substring(0, 7)
          //   object.title += "..."
          // }
          object.price = res.data.good[i].price + '元';
          object.title = object.price;
          object.id = res.data.good[i].id;
          recommend[i] = object;
        }
        var hotrec = [];
        for (var i in res.data.week) {
          var object = new Object();
          object.url = 'https://www.hattonstar.com/storage/' + res.data.week[i].title_pic;
          object.text = res.data.week[i].name;
          object.link = '../detail/detail?id=' + res.data.week[i].id;
          // if (object.title.length > 8) {
          //   object.title = object.title.substring(0, 7)
          //   object.title += "..."
          // }
          object.price = res.data.week[i].price + '元';
          object.title = object.price;
          object.id = res.data.week[i].id;
          hotrec[i] = object;
        }
        page.setData({
          imgUrls: imgUrls,
          // proLst: recommend,
          proLst: hotrec
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

  onPullDownRefresh: function () {
    this.initData1();
  },


  recommendGood: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  },

  hotrecGood: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  },

  accountInput: function (e) {
    var content = e.detail.value;
    this.setData({ name: content });
  },

  resetSearch: function () {
    var name = this.data.name;
    if (this.data.name == '') {
      wx.showModal({
        title: '搜索条件为空',
        content: '请输入关键字!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
      return;
    }
    wx.navigateTo({
      url: '../search/search?name=' + name
    });
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
  }
})