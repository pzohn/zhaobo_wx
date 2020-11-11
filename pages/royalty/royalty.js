var app = getApp()
Page({
  data: {
    currentTab: 0,
    myroyalty:0,
    orderShopList: [],
    tradeShopList: [],
    one_flag:true,
    manage_flag:false
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

  onLoad: function () {
    if (app.globalData.manger_flag == true){
      this.manger();
    }else{
      this.share();
    }
  },

  share: function () {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/getShareForZhaobo',
      data: {
        wx_id: app.globalData.wx_id
      },
      method: 'POST',
      success: function (res) {
        var orderShopList = [];
        var tradeShopList = [];
        for (var index in res.data.tradesOne) {
          var object = new Object();
          object.BillDate = res.data.tradesOne[index].time;
          object.BillNo = res.data.tradesOne[index].body;
          object.EmpFullName = res.data.tradesOne[index].trade_name;
          object.TotalTaxAmount = res.data.tradesOne[index].charge;
          object.royalty = res.data.tradesOne[index].num;
          object.address = res.data.tradesOne[index].trade_addr;
          object.share = '';
          orderShopList[index] = object;
        }
        for (var i in res.data.tradesTwo) {
          var object = new Object();
          object.BillDate = res.data.tradesTwo[i].time;
          object.BillNo = res.data.tradesTwo[i].body;
          object.EmpFullName = res.data.tradesTwo[i].trade_name;
          object.TotalTaxAmount = res.data.tradesTwo[i].charge;
          object.royalty = res.data.tradesTwo[i].num;
          object.address = res.data.tradesTwo[i].trade_addr;
          object.share = res.data.tradesTwo[i].share_name;
          tradeShopList[i] = object;
        }
        page.setData({
          orderShopList: orderShopList,
          tradeShopList: tradeShopList,
          myroyalty: res.data.count,
          one_flag:(res.data.one_flag == 1)
        });
      },
      fail: function (res) {
      }
    })
  },

  manger: function () {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/getShareForZhaoboEx',
      data: {
        
      },
      method: 'POST',
      success: function (res) {
        var orderShopList = [];
        var tradeShopList = [];
        for (var i in res.data.tradesTwo) {
          var object = new Object();
          object.BillDate = res.data.tradesTwo[i].time;
          object.BillNo = res.data.tradesTwo[i].body;
          object.EmpFullName = res.data.tradesTwo[i].trade_name;
          object.TotalTaxAmount = res.data.tradesTwo[i].charge;
          object.royalty = res.data.tradesTwo[i].num;
          object.address = res.data.tradesTwo[i].trade_addr;
          object.share = res.data.tradesTwo[i].share_name;
          orderShopList[i] = object;
        }
        page.setData({
          orderShopList: orderShopList,
          tradeShopList: tradeShopList,
          myroyalty: res.data.count,
          one_flag:false,
          manage_flag:true
        });
      },
      fail: function (res) {
      }
    })
  },

})