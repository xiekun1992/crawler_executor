const {
  Sequelize,
  Model,
  DataTypes
} = require('sequelize')

class Hyperlink extends Model {}
class RawText extends Model {}
class DetailPage extends Model {}
class Record extends Model {}

async function connect(dbConfig, dropTables) {
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: 'mariadb'
    }
  )
  Hyperlink.init({
    rawTextId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize
  })
  
  RawText.init({
    detailPageId: DataTypes.INTEGER,
    text: DataTypes.TEXT
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
  Record.init({
    pageIndex: DataTypes.INTEGER
  }, {
    sequelize
  })
  if (dropTables) {
    await sequelize.drop({
      cascade: true
    })
  }
  await sequelize.sync({
    alter: {
      drop: true
    }
  })
  console.log('database connected')
  return
}

module.exports = {
  Hyperlink,
  RawText,
  DetailPage,
  Record,
  connect
}