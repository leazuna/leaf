//Server Find


const express = require ('express');
const app = express ();
const bodyParser = require ('body-parser');
app.use ( bodyParser.json ()); // for parsing post data that hasjson format
app.use ( function (req , res , next ) {
  res.setHeader ('Access-Control-Allow-Origin', '*');
  res.setHeader ('Access-Control-Allow-Methods', 'GET ,POST ,PUT ,DELETE ,OPTIONS ');
  res.setHeader ('Access-Control-Allow-Headers', 'Content-Type ');
  next ();
});

//Node-postgres: connection to database
const { Pool } = require ('pg');
const pool = new Pool ({
  user: 'group2',
  host: '130.237.64.8',
  database: 'spatial_db',
  password: 'marsvin',
  port: 5432 ,
});


//Database connection functions----------------------------------------

//Gets values from client and inserts to DB table 'coord'
app.post ('/coord', (req , res) => { //req = from ajax,
  console.log ( req.body );
   // data you send from your application is available on req.body object , your data processing logic goes here
  pool.query (`INSERT INTO coord VALUES ('${req.body.lon}', '${req.body.lat}', '${req.body.descr}') RETURNING *`, function (err , dbResponse ) {
    if ( err) console.log ( err);
    res.setHeader ('Access-Control-Allow-Origin', '*');
    res.send (dbResponse); //sends to client
  });
});

//Gets data from database
app.get ('/coord', (req,res) => {
  pool.query ('select * from coord', (err, dbResponse ) => {
    if ( err) console.log (err);
    console.log (dbResponse.rows); // respons till servern
    // here dbResponse is available , your data processing logic goes here
    res.setHeader ('Access-Control-Allow-Origin', '*');
    res.send (dbResponse.rows); //sänder som repons till klienten
  });
 });

 //Takase username, password and a random id as an in put and inserts it into DB
app.post ('/signup', (req , res) => { //req = from ajax,
  pool.query (`INSERT INTO usr VALUES ('${req.body.uname}', '${req.body.psw}', '${req.body.id}')`, function (err , dbResponse) {
  if ( err) {
  //  console.log(err);
    res.send (err.name);
  }
  else {
    res.setHeader ('Access-Control-Allow-Origin', '*');
    res.send (dbResponse);
  }
});
});

//Takes username and password as input and checks if it in the DB, is yes - returns true, elsewhere false
app.post ('/signin', (req,res) => {
pool.query (`select case when '${req.body.uname}' in (select name from usr) and '${req.body.psw}' in (select password from usr) then true else false end`, (err, dbResponse ) => {
  if (err)  console.log (err);
  console.log (dbResponse); // respons till servern
  // here dbResponse is available , your data processing logic goes here
  res.setHeader ('Access-Control-Allow-Origin', '*');
  res.send (dbResponse); //sänder som repons till klienten
});
});

app.listen (3000 , () => console.log('Example app listening on port 3000!'));
