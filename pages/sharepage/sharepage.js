var QR = require("../../utils/qrcode.js");
var app = getApp();
Page({
  data: {
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
    placeholder: 'http://wxapp-union.com',//默认二维码生成文本
    save_flag:true,
    id:0,
    
    shareThree: {
      avatar: '',
      nickname: '',
      awardMoney: '',
      showShareModel: false
      }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var size = this.setCanvasSize();//动态设置画布大小
    this.setData({ id: options.id});
    var initUrl = 'https://www.hattonstar.com/g?shareid=' + app.globalData.wx_id + '&id=' + options.id;
    if (app.globalData.notice_flag == 1) {
      console.log(options.id)
      initUrl = 'https://www.hattonstar.com/gg?shareid=' + app.globalData.wx_id + '&id=' + options.id;
    }
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
  },

  save: function () {
    this.setData({
      shareThree: {
        avatar: 'https://wx.qlogo.cn/mmopen/vi_32/gcs9nfrPIjZSfZvMmVCK81MpPbWqDspNfc2lRLqllfrpYT61RQWNMHXCfzSia7OiapOfXTjYFR6EF7JQZib5MRCdA/132',
        nickname: '路人甲',
        awardMoney: '哈哈',
        showShareModel: true
      }
    })
  },

  share: function () {

  },

  onReady: function () {

  },
  onShow: function () {

    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面关闭

  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imagePath: tempFilePath,
          save_flag:false
        });
        app.globalData.postcard_code_url = tempFilePath;
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },

  onShareAppMessage: function () {
    return {
      title: '启明星研学_乐体验',
      path: '/pages/detail/detail?shareid=' + app.globalData.wx_id + '&id=' + this.data.id,
      imageUrl: app.globalData.post_url,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  formSubmit: function (e) {
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.saveFile({
          tempFilePath: tempFilePaths[0],
          success: function (res) { 
            var saveFilePath = res.savedFilePath;
          }
        })
      },
    })
  }

})