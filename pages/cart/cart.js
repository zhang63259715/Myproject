// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allchecked: false,
    totalprice: 0,
    totalNum: 0

  },
  onShow() {
    //获取缓存中的收货地址
    const address = wx.getStorageSync("Address");
    //获取缓存中的购物车,如果没有数据则是一个空数组
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    });
    //调用封装的cart
    this.bindCarts(cart);
  },
  // 调用内置Api获取收货地址
  getaddress() {
    
  },
  //选中商品
  fistchecked(e) {
    //获取选中商品的id
    const goods_id = e.currentTarget.dataset.id;
    //获取购物车数组
    let cart = this.data.cart;
    //找到被点击的商品对象
    let index = cart.findIndex(v => v.id === goods_id);
    //选中状态取反
    cart[index].checked = !cart[index].checked;
    //调用封装的购物车
    this.bindCarts(cart);
  },
  // 统一封装在购物车中
  bindCarts(cart) {
    //重新计算全选、价格
    //总价格、数量、是否全选
    let totalprice = 0;
    let totalNum = 0;
    let allchecked = true;
    cart.forEach(v => {
      if (v.checked) {
        totalprice += v.num * v.price;
        totalNum += v.num;

      } else {
        allchecked = false;
      }
    })
    //判断数组是否为空
    allchecked = cart.length != 0 ? allchecked : false;
    //购物车数据设置为data和缓存中
    this.setData({
      cart,
      totalprice,
      totalNum,
      allchecked
    });
    wx.setStorageSync("cart", cart);
  },
  //全选功能
  bindallchecked() {
    //获取data中的数据
    let cart = this.data.cart;
    let allchecked = this.data.allchecked;
    //修改值
    allchecked = !allchecked;
    //循环修改cart中的选中状态
    cart.forEach(v => v.checked = allchecked);
    //把修改后的值放入data和缓存中(调用封装的购物车)
    this.bindCarts(cart);
  },
  // 数量加一或减一
  operation(e) {
    //获取传递过来的参数,用户点击的是+1还是-1
    const operation = e.currentTarget.dataset.operation;
    const id = e.currentTarget.dataset.id;
    //获取购物车数组
    let cart = this.data.cart;
    // 找到需要修改商品的索引
    const index = cart.findIndex(v => v.id === id);
    if (cart[index].num === 1 && operation === -1) {
      wx.showModal({
        title: '提示',
        content: '您是否要删除商品?',
        success: (res) => {
          if (res.confirm) {
            cart.splice(index, 1);
            this.bindCarts(cart);
          } else if (res.cancel) {}
        }
      })
    } else {
      // 进行修改
      cart[index].num += operation;
      //设置回data和缓存中
      this.bindCarts(cart);
    }
  },
  buy_pay(e) {
    const address = this.data.address;
    const totalNum = this.data.totalNum;
    //判断地址
    if (!address.userName) {
      wx.showToast({
        title: '您还没有登录或选择收货地址！',
        icon: "none"
      })
      return;
    }
    //判断有没有选中商品
    if (totalNum === 0) {
      wx.showToast({
        title: '您还没有选择商品!',
        icon: "none"
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/pay'
    })

  }

})