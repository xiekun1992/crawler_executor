const {
  Sequelize,
  Model,
  DataTypes
} = require('sequelize')
const sequelize = new Sequelize('crawl', 'root', 'root', {
    host: '192.168.128.3',
    port: 3306,
    dialect: 'mariadb'
  }
)

class Hyperlink extends Model {}
class RawText extends Model {}
class DetailPage extends Model {}

Hyperlink.init({
  address: DataTypes.STRING,
  type: DataTypes.STRING
}, {
  sequelize
})

RawText.init({
  text: DataTypes.STRING
}, {
  sequelize
})

DetailPage.init({
  title: DataTypes.STRING,
  address: DataTypes.STRING,
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize
})

function connect() {
  return sequelize.sync({
    alter: {
      drop: false
    }
  }).then((value) => {
    console.log('database connected')
    return value
  })
}

module.exports = {
  Hyperlink,
  RawText,
  DetailPage,
  connect
}