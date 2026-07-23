const app = require('./app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`reporting-service listening on port ${port}`);
});
