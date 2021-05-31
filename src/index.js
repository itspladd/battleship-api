const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

console.log("Server running!")

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/backend-test', (req, res) => {
  res.send({ msg: 'Successful connection!' })
});