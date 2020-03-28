Page({
  data: {
    //轮播图数组,云存储获取轮播图信息
    swiperList: [{
      id: 0,
      type: 'image',
      url: "cloud://jingzhao-mqleo.6a69-jingzhao-mqleo-1301017971/swiper/timg.jpg"
    }, {
      id: 1,
      type: 'image',
        url: "cloud://jingzhao-mqleo.6a69-jingzhao-mqleo-1301017971/swiper/timg01.jpg",
    }, {
      id: 2,
      type: 'image',
        url: "cloud://jingzhao-mqleo.6a69-jingzhao-mqleo-1301017971/swiper/timg02.jpg"
    }, {
      id: 3,
      type: 'image',
        url: "cloud://jingzhao-mqleo.6a69-jingzhao-mqleo-1301017971/swiper/timg03.jpg"
    }],
    goodslist: []
  },
  onLoad: function(options) {
    let that = this
    const db = wx.cloud.database().collection("list")
    //获取云数据库的商品信息
    wx.showLoading({
      title: '加载中',
    })
    db.get({
      success(res) {
        that.setData({
          goodslist: res.data
        })
      },
      fail(res) {
        console.log("获取商品信息失败！", res)
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  }
})