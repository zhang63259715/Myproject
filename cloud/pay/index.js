const cloud = require('wx-server-sdk');
cloud.init();
//引入依赖
const tenpay = require('tenpay');
//实例化配置参数
const config = {
  appid: '公众号ID',
  mchid: '微信商户号',
  partnerKey: '微信支付安全密钥',
  notify_url: 'https://mp.weixin.qq.com',
  spbill_create_ip: '127.0.0.1'
};

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 初始化
  const zonghe = event.zonghe;
  const api = tenpay.init(config);
  // 获取支付参数
  let result = await api.getPayParams({
    // 内部商品订单，值必须是唯一的，Date.now()是获取当前的时间戳
    out_trade_no: Date.now(),
    body: '购买商品',
    // 支付的数值，单位为分而不是元
    total_fee: Number(zonghe)*100,
    // 当前哪个用户支付
    openid: wxContext.OPENID,
  });
  return result;
}