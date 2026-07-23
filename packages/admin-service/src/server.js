const app = require('./app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`admin-service listening on port ${port}`);
});
