Page({
  data: {
    // 下拉菜单
    first: '一级分销',
    second: '二级分销',
    thirds: '起始日期',
    fours: '结束日期',
    _num: 0,
    _res: 0,
    FirstShare:[],
    SecondShare:[],
 
    // 筛选
    array: [{ name: '单拍' }, { name: '亲子套餐' }, { name: '活动套餐' }, { name: '女王套餐' }],
    chaoxiang: [{ name: '单拍' }, { name: '亲子套餐' }, { name: '活动套餐' }, { name: '女王套餐' }],
    louceng: [{ name: '单拍' }, { name: '亲子套餐' }, { name: '活动套餐' }, { name: '女王套餐' }],
    zhuangxiu: [{ name: '单拍' }, { name: '亲子套餐' }, { name: '活动套餐' }, { name: '女王套餐' }],
    leibei: [{ name: '单拍' }, { name: '亲子套餐' }, { name: '活动套餐' }, { name: '女王套餐' }],
    tese: [{ name: '单拍' }, { name: '亲子套餐' }, { name: '活动套餐' }, { name: '女王套餐' }],
    paixu: [{ name: '单拍' }, { name: '亲子套餐' }, { name: '活动套餐' }, { name: '女王套餐' }],
    one: 0,
    two: 0,
    third: 0,
    four: 0,
    five: 0,
    six: 0,
    seven: 0,
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
    console.log(e.target.dataset.num)
    this.setData({
      _num: e.target.dataset.num
    })
    this.setData({
      first: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
    var text = this.data.name
    console.log(text)
  },
  // 二级分销
  clickSecond: function (e) {
    console.log(e)
    this.setData({
      _num: e.target.dataset.num
    })
    this.setData({
      second: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
    var text = this.data.name
    console.log(text)
  },
  onLoad: function (options) {
    this.initShare();
  },

  initShare: function () {
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
          for (var j in res.data.data[i].Second){
            var second = new Object();
            second.name = res.data.data[i].Second[j].name;
            second.id = res.data.data[i].Second[j].id;
            Second[j] = second;
          }
          first.Second = Second;
          FirstShare[i] = first;
        }
        page.setData({
          FirstShare:FirstShare
        });
        console.log(page.data.FirstShare)
      },
      fail: function (res) {
      }
    })
  },
  // 房型
  clickHouse: function (e) {
    console.log(e.target.dataset.num)
    this.setData({
      _res: e.target.dataset.num
    })
    this.setData({
      thirds: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
  },
 
  // 筛选
  choseTxtColor: function (e) {
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值  
    console.log(e.currentTarget.dataset.id)
    this.setData({
      one: id
    })
  },
  chaoxiang: function (e) {
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值  
    this.setData({
      two: id
    })
  },
  louceng: function (e) {
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值  
    this.setData({
      third: id
    })
  },
  zhuangxiu: function (e) {
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值  
    this.setData({
      four: id
    })
  },
  leibei: function (e) {
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值  
    this.setData({
      five: id
    })
  },
  tese: function (e) {
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值  
    this.setData({
      six: id
    })
  },
  paixu: function (e) {
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值  
    this.setData({
      seven: id
    })
  }
})
