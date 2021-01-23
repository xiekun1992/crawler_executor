const {
  Sequelize,
  Model,
  DataTypes
} = require('sequelize')

class Hyperlink extends Model {}
class RawText extends Model {}
class DetailPage extends Model {}

function connect(dbConfig) {
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: 'mariadb'
    }
  )
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