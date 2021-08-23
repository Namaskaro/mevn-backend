const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Yandex',
  auth: {
    user: 'delivery@incodewetrust.ru',
    pass: '@123@456',
  },
});


const createUserConfirmationOrderEmail = async ({ _id, email }) => {

  const mail = await transporter.sendMail({
    from: `"IGWT delivery" <delivery@incodewetrust.ru>`, // sender address
    to: `${email}`, // list of receivers
    subject: "Подтверждение заказа", // Subject line
    text: `Ваш заказ с номером  ${_id} подтвержден`, // plain text body
    html: `
      <ul class="list-group">
        <li class="list-group-item"> Ghost of Tsushima - 59$ </li>
        <li class="list-group-item"> Last of Us 2 - 49$ </li>
      </ul>
    `,
  });

  return mail

}
const createAdminConfirmationOrderEmail = async ({ _id, address, fullname, phone }, adminEmail = 'ararat@incodewetrust.ru',) => {

  const mail = await transporter.sendMail({
    from: `"IGWT delivery" <delivery@incodewetrust.ru>`, // sender address
    to: `${adminEmail}`, // list of receivers
    subject: "У вас новый заказ", // Subject line
    text: `Создан заказ с номером  ${_id}`, // plain text body
    html: `
      <h2>Новый заказ с номером ${_id}</h2>

      <ul>
        <li> Имя ${fullname}  </li>
        <li> Адрес ${address}  </li>
        <li> Адрес ${phone}  </li>
      </ul>
    `,
  });

  return mail

}

module.exports = {
  createUserConfirmationOrderEmail,
  createAdminConfirmationOrderEmail
}