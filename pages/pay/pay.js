Page({
  data: {
    address: {},
    cart: [],
    totalprice: 0,
    totalNum: 0
  },
  onShow() {
    //获取缓存中的收货地址
    const address = wx.getStorageSync("Address");
    //获取缓存中的购物车,如果没有数据则是一个空数组
    let cart = wx.getStorageSync("cart") || [];
    //过滤购物车数组，checked属性必须为true
    cart = cart.filter(v => v.checked);
    let totalprice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalprice += v.num * v.price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalprice,
      totalNum,
      address
    });
  },
  //发起支付
  zhifu(e) {
    console.log("发起支付");
    let that = this;
    const totalprice = that.data.totalprice;
    const name = that.data.address.userName;
    const dizhi = that.data.address.cityName + that.data.address.countyName + that.data.address.detailInfo;
    const phone = that.data.address.telNumber;
    const carts = that.data.cart;

    var arr = [];
    for (var i = 0;i<carts.length; i++) {
      var goods = {};
      goods.name = carts[i].name;
      goods.num = carts[i].num;
      arr.push(goods);
    }
    console.log(arr);
    
    // 调用支付云函数
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        zonghe: totalprice
      },
      success: (e) => {
        wx.requestPayment({
          timeStamp: e.result.timeStamp,
          nonceStr: e.result.nonceStr,
          package: e.result.package,
          signType: 'MD5',
          paySign: e.result.paySign,
          success(res) {
            // 支付成功后弹窗提示
            wx.showToast({
              title: '支付成功!',
              icon: "success",
              duration: 3000
            });
            //支付成功后舔砖首页
            wx.switchTab({
              url: '/pages/index/index'
            });
            //删除支付成功的商品
            let newCart = wx.getStorageSync("cart");
            //过滤已经支付的商品，留下未被选中的商品
            newCart = newCart.filter(v => !v.checked);
            wx.setStorageSync("cart", newCart);
            //调用邮件云函数，向商户邮箱发送订单信息
            wx.cloud.callFunction({
              name: 'email',
              data: {
                zonghe: totalprice,
                goods:arr,
                name: name,
                dizhi: dizhi,
                phone: phone
              },
              success(res) {
                console.log("订单发送至商家QQ邮箱，微信关注后有提醒", res);
              },
              fail(res) {
                console.log("发送失败", res);
              }
            });

          },
          fail(res) {
            wx.showToast({
              title: '支付失败!',
              icon: "none",
              duration: 3000
            });
          }
        })
      }
    });
  },

})