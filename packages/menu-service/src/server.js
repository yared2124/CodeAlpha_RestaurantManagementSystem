const app = require('./app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`menu-service listening on port ${port}`);
});
