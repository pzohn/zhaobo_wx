var app = getApp()
Page({
  data: {
    isLike: true,
    price:0,
    stock:0,
    detail_id:0,
    iscollect: false,
    video_hide:true,
    collect_url:'../../images/collect-0.png',
    // banner

    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 6000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s

    // 商品详情介绍
    images: [
      "../../images/logo1.png",
      "../../images/logo2.png",
      "../../images/logo3.png",
      "../../images/logo4.png",
      "../../images/logo5.png",
      "../../images/logo1.png",
      "../../images/logo2.png",
      "../../images/logo3.png",
      "../../images/logo4.png",
      "../../images/logo5.png"
    ],
    joinnum: 16666,
    currentTab: 0,
    imgUrls: [],
    title: '',
    classInfo: [],
    video_url:'',

    showModalStatus: false,//是否显示
    gg_image:'',
    gg_txt:'默认规格',
    gg_id: '默认规格',//规格ID
    // guigeList: [{ guige: '100', price: '150' }, { guige: '200', price: '150' }, { guige: '300', price: '150' }],
    guigeList: [{ guige: '默认规格', price: '0' }],
    num: 1,//初始数量
    buy_flag:false,
    name: '',
    phone: ''
  },

  onLoad: function (options) {
    var id = options.id;
    let qrUrl = decodeURIComponent(options.q)
    if (qrUrl.indexOf("shareid=") != -1 ){
      var arr = qrUrl.split("&");
      var strShareId = arr[0];
      var strId = arr[1];
      var arrShareId = strShareId.split("=");
      var arrId = strId.split("=");
      id = arrId[1];
      app.globalData.share_id = arrShareId[1];
    }
    var share_id = options.shareid;
    if (share_id != undefined){
      app.globalData.share_id = share_id;
    }
    
    this.setData({
      detail_id:id
      });
    this.initData(id);
    this.initCollect();
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
          gg_image: 'https://www.hattonstar.com/storage/' + res.data.data.shopping.title[0],
          stock: res.data.data.shopping.stock
        });
        if (res.data.data.shopping.video.length){
          page.setData({
            video_hide: false,
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
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;

    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls // 需要预览的图片http链接列表  
    })
  },
  // 收藏
  collect: function () {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/collect',
      data: {
        wx_id: app.globalData.wx_id,
        detail_id: page.data.detail_id,
        collect_flag: !page.data.iscollect
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        page.setData({
          iscollect: res.data,
        });
        page.initCollectUrl();
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

  initCollect: function () {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/iscollect',
      data: {
        wx_id: app.globalData.wx_id,
        detail_id: page.data.detail_id
      },
      method: 'POST',
      success: function (res) {
        page.setData({
          iscollect: res.data
        });
        page.initCollectUrl();
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

  // 立即购买
  immeBuy() {
    var that = this;


    that.setData({
      showModalStatus: true,
      buy_flag: true
    })

    that.showDialogBtn();
    return;
    
    wx.request({
      url: 'https://www.hattonstar.com/getBaseInfo',
      data: {
        wx_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data == 0) {
          that.setData({
            showModalStatus: true,
            buy_flag: true
          })
        } else {
          that.showDialogBtn();
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

  // 加入购物车
  immeCert() {
    var that = this;
    wx.request({
      url: 'https://www.hattonstar.com/getBaseInfo',
      data: {
        wx_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data == 0) {
          that.setData({
            showModalStatus: true,
            buy_flag: false
          })
        } else {
          that.showDialogBtn();
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

  initCollectUrl() {
    if (this.data.iscollect == true){
      this.setData({ collect_url: '../../images/collect.png'})
    }else{
      this.setData({ collect_url: '../../images/collect-0.png' })
    }
  },

  buttonOk() {
    if (this.data.num > this.data.stock){
      wx.showModal({
        title: '库存不足',
        content: '库存不足，请修改数量或选择其他商品!',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return
    }
    var page = this;
    if (page.data.buy_flag == true) {
      wx.navigateTo({
        url: '../certmake/certmake?type=trade' + '&id=' + page.data.detail_id + '&num=' + page.data.num
      })
    } else {
      wx.request({
        url: 'https://www.hattonstar.com/certInsert',
        data: {
          wx_id: app.globalData.wx_id,
          id: page.data.detail_id,
          count: page.data.num
        },
        method: 'POST',
        success: function (res) {
          page.setData({
            showModalStatus: false
          })
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 2000
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
    }
  },

  home() {
    wx.switchTab({
      url: app.globalData.index_style,
    })
  },

  poster() {
    var page = this;
    app.globalData.notice_flag = 0;
    wx.navigateTo({
      url: '../sharepage/sharepage?id=' + page.data.detail_id,
    })
  },
  
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  filter: function (e) {
    var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, price = e.currentTarget.dataset.price
    self.setData({
      gg_id: id,
      gg_txt: txt,
      gg_price: price
    });
  },

  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  }, 

  authorize: function () {
    if (app.globalData.authorizeFlag == false) {
      wx.navigateTo({
        url: '../getuser/getuser'
      });
    }
  },

  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  inputChangeName: function (e) {
    this.setData({ name: e.detail.value })
  },

  inputChangePhone: function (e) {
    this.setData({ phone: e.detail.value })
  },

  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },

  preventTouchMove: function () {

  },

  hideModalEx: function () {
    this.setData({
      showModal: false
    });
    return
    var that = this;
    wx.request({
      url: 'https://www.hattonstar.com/BaseInfoUpdate',
      data: {
        wx_id: app.globalData.wx_id,
        name: that.data.name,
        phone: that.data.phone
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          showModal: false
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

  preview(event) {
    let currentUrl = event.currentTarget.dataset.src
    var imgList = [
      currentUrl
    ]
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  onCancel: function () {
    this.setData({
      showModal: false
    });
  },

  onConfirm: function () {
    this.hideModalEx();
  },
})
