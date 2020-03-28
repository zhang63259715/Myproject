Page({

  data: {
    userInfo:[],
    address:{}
  },
  onShow(){
    //获取缓存中的收货地址
    const address = wx.getStorageSync("Address");
    this.setData({
      address
    });
  },
  handUserInfo(e) {
    const userInfo = e.detail.userInfo;
    //UserInfo存入缓存
    wx.setStorageSync("userInfo", userInfo);
    if (userInfo){
      this.setData({
        userInfo: userInfo
      })
    }
  
  },
  calling(e){
    wx.makePhoneCall({
      phoneNumber: '17396376785',
    })
  },
  getLocation(e){
    wx.openLocation({
      latitude: 34.678407,
      longitude: 112.414915,
      name: "九州茶行",
      address: "洛阳市西工区沙溪茶叶城二楼",
      scale: 28
    })
  },
  addressMf(e){
    const login = e.currentTarget.dataset.name

    if (!login) {
      wx.showToast({
        title: '您还没有登录',
        icon:"none"
      })
      return;
    }
    // 调用内置Api获取收货地址
    //1.获取权限状态
    wx.getSetting({
      success(res) {
        const scopeAddress = res.authSetting["scope.address"];
        if (scopeAddress === true || scopeAddress === undefined) {
          wx.chooseAddress({
            success(e) {
              //将获取到的地址存入本地缓存
              wx.setStorageSync("Address", e);
            }
          })
        } else {
          //用户拒绝过授权时，诱导用户打开授权页面
          wx.openSetting({
            success(e) {
              wx.chooseAddress({
                success(e1) {
                  console.log("获取用户地址", e1);
                }
              })
            }
          })
        }
      }
    })
  }

})