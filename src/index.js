const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const db = require('./db')


console.log("Server running!")

app.listen(port, () => console.log(`Listening on port ${port}`));

db.query(`DROP TABLE IF EXISTS test; CREATE TABLE test (name VARCHAR(255)); INSERT INTO test VALUES ('dave'); SELECT * FROM test;`, [])
  .then(res => console.log(res[3]))
  .catch(err => console.error(err))

app.get('/', (req, res) => {
  res.json({ you: "are on the root page"})
});

app.get('/backend-test', (req, res) => {
  res.send({ msg: 'Successful connection!' })
});

