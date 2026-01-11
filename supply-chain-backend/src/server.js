require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const port = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('DB connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(port, () => console.log(`Server running on ${port}`));
  })
  .catch(err => {
    console.error('Database error:', err.message);
  });
