//Server Find


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing post data that hasjson format
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET ,POST ,PUT ,DELETE ,OPTIONS ');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type ');
  next();
});

//Node-postgres: connection to database
const { Pool } = require('pg');
const pool = new Pool({
  user: 'group2',
  host: '130.237.64.8',
  database: 'spatial_db',
  password: 'marsvin',
  port: 5432,
});


//Database connection functions----------------------------------------

//Gets data from database
app.get('/test_wgs84_point', (req, res) => {
  pool.query('SELECT ST_X(ST_Transform(geom, 4326)) AS "longitude", ST_Y(ST_Transform(geom, 4326)) AS "latitude" FROM "test_wgs84_point"', (err, dbResponse) => {
    if (err) console.log(err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(dbResponse.rows); //sänder som repons till klienten
  });
});

app.get('test_wgs84_line', (req, res) => {
  pool.query('SELECT ST_AsGeoJSON(geom) FROM "test_wgs84_linje"', (err, dbResponse) => {
    if (err) console.log(err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(dbResponse.rows); //sänder som repons till klienten
  });
});

app.get('/w_nicespots', (req, res) => {
  pool.query('SELECT ST_X(ST_Transform(geom, 4326)) AS "longitude", ST_Y(ST_Transform(geom, 4326)) AS "latitude" FROM "w_nicespots"', (err, dbResponse) => {
    if (err) console.log(err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(dbResponse.rows); //sänder som repons till klienten
  });
});




//Gets values from client and inserts to DB table 'coord'
app.post('/coord', (req, res) => { //req = from ajax,
  console.log(req.body);
  // data you send from your application is available on req.body object , your data processing logic goes here
  pool.query(`INSERT INTO coord VALUES ('${req.body.lon}', '${req.body.lat}', '${req.body.descr}') RETURNING *`, function (err, dbResponse) {
    if (err) console.log(err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(dbResponse); //sends to client
  });
});


app.listen(3000, () => console.log('Example app listening on port 3000!'));
