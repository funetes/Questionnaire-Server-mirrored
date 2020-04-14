const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
sequelize.sync();


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Event = require('./event')(sequelize, Sequelize);
db.Like = require('./like')(sequelize, Sequelize);
db.Presentor = require('./presentor')(sequelize, Sequelize);
db.Question = require('./question')(sequelize, Sequelize);

db.Presentor.hasMany(db.Event, { foreignKey: 'presentorId', sourceKey : 'id' });
db.Event.belongsTo(db.Presentor, { foreignKey :'prsentorId', targetKey : 'id' });

db.Event.hasMany(db.Question, { foreignKey: 'eventId', sourceKey : 'id' });
db.Question.belongsTo(db.Event, { foreignKey : 'eventId', targetKey : 'id'});

db.Question.hasMany(db.Like, { foreignKey: 'questionId', sourceKey : 'id' });
db.Like.belongsTo(db.Question, { foreignKey : 'questionId', targetKey : 'id'});

module.exports = db;
