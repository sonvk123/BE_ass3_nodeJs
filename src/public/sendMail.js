require("dotenv").config();

const nodemailer = require("nodemailer");

const html = ({ fullname, phone, address, userCartItems, total }) => {
  return `
  <div style="background-color: black; color: white; padding: 20px;">
  <h1>Xin Chào ${fullname}</h1>
  <p>Phone: ${phone}</p>
  <p>Address: ${address}</p>
  
  <table style="width:100%; border-collapse: collapse; color:white;">
  <tr>
      <th style="width: 22%;">Tên Sản Phẩm</th>
      <th>Hình Ảnh</th>
      <th>Giá</th>
      <th>Số Lượng</th>
      <th>Thành Tiền</th>
  </tr>

  <!-- Add 'return' statement in the map function -->
    
  ${
    userCartItems &&
    userCartItems.map((value) => {
      const priceProduct = (+value.priceProduct).toLocaleString();
      const totalPrice = (
        +value.priceProduct * +value.quantity
      ).toLocaleString();
      return `
        <tr style="border-top: 1px solid white;">
          <td style="text-align: center; width: 22%;">${value.nameProduct}</td>
          <td style="text-align: center;"><img src="${value.img.replace(
            /\\/g,
            "/"
          )}" alt="iPhone" width="50"></td>
          <td style="text-align: center;"><span">${priceProduct} VND</span></td>
          <td style="text-align: center;">${value.quantity}</td>
          <td style="text-align: center;"><span">${totalPrice} VND</span></td>
        </tr>
      `;
    })
  }
    </table>
  
  <p style="font-weight: bold;">Tổng Thanh Toán:</p>
  <p style="font-weight: bold;">${total}</p>

  <p>Cảm ơn bạn!</p>
  </div>
  `;
};

const userSend = async ({
  email,
  subbject,
  fullname,
  phone,
  address,
  userCartItems,
  total,
}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gamail.com",
    service: "Gmail",
    auth: {
      user: process.env.GmailUser,
      pass: process.env.Password,
    },
  });

  const message = {
    from: process.env.GmailUser,
    to: email,
    subbject: subbject,
    html: html({ fullname, phone, address, userCartItems, total }),
  };

  const result = await transporter.sendMail(message);
  return result;
};

module.exports = userSend;
