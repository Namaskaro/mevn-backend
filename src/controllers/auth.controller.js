require('dotenv').config()
const jwt = require('jsonwebtoken')

const { User, Token } = require('../model')

module.exports = {
  async logout({ body: { refreshToken } }, res) {
    const foundToken = await Token.findOne({ token: refreshToken })

    if (!foundToken) {
      return res.status(403).send({
        message: 'Пользователь не авторизован'
      })
    }

    await Token.findByIdAndDelete(foundToken._id)

    return res.status(200).send({
      message: 'Юзер успешно разлогинен'
    })
  },
  async refreshToken({ body: { refreshToken } }, res) {
    // Проверяем есть ли токен в запросе на сервер
    if (!refreshToken) {
      return res.status(403).send({
        message: 'Действие запрещено'
      })
    }
    // ищем токен в бд
    const currentToken = await Token.findOne({ token: refreshToken })

    // если не находим токен то возвращаем ошибку
    if (!currentToken) {
      return res.status(403).send({
        message: 'Действие запрещено'
      })
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (err, user) => {
      if (err) {
        return res.status(403).send({
          message: 'Действие запрещено'
        })
      }

      const accessToken = jwt.sign({
        userId: user._id,
        email: user.email,
      }, process.env.JWT_SECRET, {
        expiresIn: '1m'
      })

      return res.status(200).send({
        accessToken,
        email: user.email
      })

    })
  },
  async login({ body: { email, password } }, res) {
    try {
      const foundUser = await User.findOne({ email })

      if (!foundUser) {
        return res.status(403).send({
          message: 'Извините, но логин или пароль не подходят!',
          err
        })
      }
      
      // мы расшифровываем пароль из базы данных
      // сравниваем
      // TO_DO
      const isPasswordCorrect = foundUser.password === password

      if (!isPasswordCorrect) {
        return res.status(403).send({
          message: 'Извините, но логин или пароль не подходят!',
          err
        })
      }

      const accessToken = jwt.sign({
        userId: foundUser._id,
        email: foundUser.email,
      }, process.env.JWT_SECRET, {
        expiresIn: '1m'
      })

      const refreshToken = jwt.sign({
        userId: foundUser._id,
        email: foundUser.email,
      }, process.env.JWT_SECRET_REFRESH)

      const foundToken = await Token.findOne({
        user: foundUser._id
      })

      if (foundToken) {
        await Token.findByIdAndUpdate(foundToken._id, { token: refreshToken })
        return res.status(200).send({
          accessToken,
          refreshToken,
          email: foundUser.email,
        })
      }

      const item = new Token({ token: refreshToken, user: foundUser._id });
      await item.save();

      return res.status(200).send({
        accessToken,
        refreshToken,
        email: foundUser.email,
      })

    } catch (err) {
      return res.status(403).send({
        message: 'Извините, но логин или пароль не подходят!',
        err
      })
    }
  },
  async signUp({ body: { email, password } }, res) {
    try {
      const foundUser = await User.findOne({ email })

      if (foundUser) {
        return res.status(403).send({
          message: 'Данный емейл занят',
          err
        })
      }

      const createdUser = await new User({ email, password })
      await createdUser.save();

      return res.status(200).send({
        message: "Пользователь создан"
      })
      // сделать емейл об удачной регистрации

    } catch (err) {
      return res.status(403).send({
        message: 'Извините, но логин или пароль не подходят!',
        err
      })
    }
  }
}