Page({
  data: {
    goodsObject: [],
  },
  onLoad: function(options) {
    let that = this;
    const id = options.id;
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.database().collection("list").where({
      goods_id: Number(id)
    }).get({
      success(res) {
        //console.log("商品详情", res.data)
        that.setData({
          goodsObject: res.data
        })
      },
      fail(res) {
        console.log("获取失败", res)
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },
  // 加入购物车
  addcarts(e) {
    //定义变量，值为当前点击按钮中的数据,来源在页面数据中
    var goodslist = e.currentTarget.dataset;
    //获取购物车的缓存数组（没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cart') || [];
    //判断商品是否存在于购物车中
    let index = arr.findIndex(v => v.id === goodslist.id);
    if (index === -1) {
      //不存在,则第一次添加,num(数量)为1
      goodslist.num = 1;
      //把当前数据放入购物车数组中
      arr.push(goodslist);
    } else {
      //已经存在，每次点击num(数量)就加1
      arr[index].num++;
    }
    //把购物车数组存入缓存
    try {
      wx.setStorageSync('cart', arr)
      wx.showToast({
        title: '成功加入购物车!',
        icon: 'sucess',
        mask: true
      })
      return;
    } catch (e) {
      console.log(e)
    }
  },
  baycarts(e){
    var goodslist = e.currentTarget.dataset; 
    var arr = wx.getStorageSync('cart') || [];
    let index = arr.findIndex(v => v.id === goodslist.id);
    if (index === -1) {
      goodslist.num = 1;
      arr.push(goodslist);
    } else {
      arr[index].num++;
    }
    wx.switchTab({
      url: '/pages/cart/cart'
    })
    try {
      wx.setStorageSync('cart', arr);
    } catch (e) {
      console.log(e)
    }
  },
  gouwuche(e){
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  }
})