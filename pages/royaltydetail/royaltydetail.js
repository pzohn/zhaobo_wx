var util=require('../../utils/util.js')

Page({
  data: {
    // 下拉菜单
    first: '一级分销',
    second: '二级分销',
    thirds: '筛选查询',
    _num: 0,
    _res: 0,
    FirstShare: [],
    SecondShare: [],
    FirstShare_id: 0,
    SecondShare_id: 0,
    dateBefore: '',
    dateAfter: '',
    currentTab1: 0,
    myroyalty:0,
    orderShopList: []
  },
  isShow: true,
  currentTab: 0,
 
  // 下拉切换
  hideNav: function () {
    this.setData({
      displays: "none"
    })
  },
    // 区域
  tabNav: function (e) {
    this.setData({
      displays: "block"
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
 
      var showMode = e.target.dataset.current == 0;
 
      this.setData({
        currentTab: e.target.dataset.current,
        isShow: showMode
      })
    }
  },
  // 一级分销
  clickFirst: function (e) {
    this.setData({
      first: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
    var index = e.target.dataset.itemIndex;
    var Second = [];
    if (index > 0){
      Second = this.data.FirstShare[index].Second;
    }else if (index == 0){
      var header = new Object();
      header.name = "全部";
      header.id = 0;
      Second[0] = header;
      this.setData({
        SecondShare_id: 0
      })
    }
    this.setData({
      SecondShare: Second,
      second: Second[0].name,
      FirstShare_id: e.target.dataset.num
    })
  },
  // 二级分销
  clickSecond: function (e) {
    this.setData({
      _num: e.target.dataset.num
    })
    this.setData({
      second: e.target.dataset.name,
      SecondShare_id: e.target.dataset.num
    })
    this.setData({
      displays: "none"
    })
  },

  onLoad: function (options) {
    this.initShare();
  },

  initShare: function () {
    var date = util.formatDate(new Date());
    this.setData({
      dateAfter: date,
      dateBefore:date
      });

    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/getAreasFirst',
      data: {
      },
      method: 'POST',
      success: function (res) {
        var FirstShare = [];
        for (var i in res.data.data) {
          var first = new Object();
          first.name = res.data.data[i].name;
          first.id = res.data.data[i].id;
          first.count = res.data.data[i].count;
          var Second = [];
          var header = new Object();
          header.name = "全部";
          header.id = 0;
          for (var j in res.data.data[i].Second){
            var second = new Object();
            second.name = res.data.data[i].Second[j].name;
            second.id = res.data.data[i].Second[j].id;
            Second[j] = second;
          }
          Second.splice(0,0,header);
          first.Second = Second;
          FirstShare[i] = first;
        }
        FirstShare.splice(0,0,header);
        page.setData({
          FirstShare:FirstShare
        });
      },
      fail: function (res) {
      }
    })
  },

  // 筛选
  bindDateChange1: function(e) {
    this.setData({
      dateBefore: e.detail.value
    })
  },

  bindDateChange2: function(e) {
    this.setData({
      dateAfter: e.detail.value
    })
  },

  queren: function () {
    var page = this;
    console.log(this.data)
    if (this.data.dateBefore > this.data.dateAfter)
    {
      wx.showModal({
        title: '日期错误',
        content: '截止日期不能早于起始日期!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
      return;
    }
    var url = '';
    var first_id = 0;
    var second_id = 0;
    if (page.data.FirstShare_id){
      first_id = page.data.FirstShare_id
    }
    if (page.data.SecondShare_id){
      second_id = page.data.SecondShare_id
    }
    if (first_id == 0 && second_id == 0){
      page.All(page.data.dateBefore,page.data.dateAfter)
    }else if (first_id != 0 && second_id == 0){
      page.First(first_id,page.data.dateBefore,page.data.dateAfter)
    }else if (second_id != 0){
      page.First(second_id,page.data.dateBefore,page.data.dateAfter)
    }

    this.setData({
      displays: "none"
    })
  },

  All: function (begin,after)  {
    console.log(begin)
    console.log(after)
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/getShareForZhaoboEx',
      data: {
        dateflag:1,
        date_begin: begin,
        date_after: after
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        var orderShopList = [];
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
          myroyalty: res.data.count
        });
      },
      fail: function (res) {
      }
    })
  },

  First: function (id,begin,after)  {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/getShareForZhaoboEx2',
      data: {
        first_id:id,
        dateflag:1,
        date_begin: begin,
        date_after: after
      },
      method: 'POST',
      success: function (res) {
        var orderShopList = [];
        for (var i in res.data.tradesOne) {
          var object = new Object();
          object.BillDate = res.data.tradesOne[i].time;
          object.BillNo = res.data.tradesOne[i].body;
          object.EmpFullName = res.data.tradesOne[i].trade_name;
          object.TotalTaxAmount = res.data.tradesOne[i].charge;
          object.royalty = res.data.tradesOne[i].num;
          object.address = res.data.tradesOne[i].trade_addr;
          object.share = res.data.tradesOne[i].share_name;
          orderShopList[i] = object;
        }
        page.setData({
          orderShopList: orderShopList,
          myroyalty: res.data.count
        });
      },
      fail: function (res) {
      }
    })
  },

  Second: function (id,begin,after)  {
    var page = this;
    wx.request({
      url: 'https://www.hattonstar.com/getShareForZhaoboEx1',
      data: {
        second_id:id,
        dateflag:1,
        date_begin: begin,
        date_after: after
      },
      method: 'POST',
      success: function (res) {
        var orderShopList = [];
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
          myroyalty: res.data.count
        });
      },
      fail: function (res) {
      }
    })
  },



})
