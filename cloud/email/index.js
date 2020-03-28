const cloud = require('wx-server-sdk')
cloud.init()
//引入发送邮件的类库
var nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.qq.com', //网易163邮箱 smtp.163.com
  port: 465, //网易邮箱端口 25
  auth: {
    user: '自己的邮箱账号', //邮箱账号
    pass: '邮箱授权码' //邮箱的授权码
  }
};
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);
// 云函数入口函数
exports.main = async (event, context) => {
  const zonghe = event.zonghe;
  const goods = event.goods;
  const name = event.name;
  const dizhi = event.dizhi;
  const phone = event.phone;
  // 创建一个邮件对象
  var mail = {
    // 发件人
    from: '新的订单 <自己的邮箱号@qq.com>',
    // 主题
    subject: '新的订单',
    // 收件人
    to: '需要发送的邮箱号@qq.com',
    // 邮件内容，text或者html格式
    text: '商品:' + JSON.stringify(goods,["name","num"])+',总价:'+zonghe+',收货人姓名：'+name+',收货人地址：'+dizhi+',收货人电话:'+phone
  };

  let res = await transporter.sendMail(mail);
  return res;
}