//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    var that = this;

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://www.hattonstar.com/getWxUser',
          data: {
            js_code: res.code,
            shop_id: that.globalData.shop_id
          },
          method: 'POST',
          success: function (res) {
            that.globalData.wx_id = res.data.id;
            if (res.data.nikename != ""){
              var wxUserInfo = new Object();
              wxUserInfo.nickName = res.data.nikename;
              wxUserInfo.avatarUrl = res.data.url;
              wx.setStorageSync('wxUserInfo', wxUserInfo);
              that.initCert();
              that.initShareForZhaobo();
            }
          },
          fail: function (res) {
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 获取手机系统信息
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
      }, fail(err) {
        console.log(err);
      }
    })

    //在线更新功能
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
       console.log('onCheckForUpdate====', res)
       // 请求完新版本信息的回调
       if (res.hasUpdate) {
        console.log('res.hasUpdate====')
        updateManager.onUpdateReady(function () {
         wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
           console.log('success====', res)
           // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
           if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
           }
          }
         })
        })
        updateManager.onUpdateFailed(function () {
         // 新的版本下载失败
         wx.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
         })
        })
       }
      })
     }

  },

  initCert: function () {
    var that = this;
    wx.request({
      url: 'https://www.hattonstar.com/getCertsNum',
      data: {
        wx_id: that.globalData.wx_id
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
  },

  initShareForZhaobo: function () {
    var that = this;
    wx.request({
      url: 'https://www.hattonstar.com/IsShareForZhaobo',
      data: {
        wx_id: that.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data == 1){
          that.globalData.share_user_flag = 1
        }
      },
      fail: function (res) {
      }
    })
  },

  globalData: {
    navHeight: 0,
    phone: '',
    login_id: 0,
    loginFlag: false,
    authorizeFlag:false,
    certlist:[],
    openid:'',
    listdetail:{},
    wx_id:0,
    share_id:0,
    shop_id:5,
    post_url:'',
    index_style:'../indexdetail/indexdetail',
    fixed_address_flag:false,
    leasing_id: 0,
    notice_flag:0,
    share_user_flag:0,
    manger_flag:false,
    express_flag:true,
    expresser_flag:false,
    normal_user_flag:true
  }
})