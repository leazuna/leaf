//Given code to be used
//https://stackoverflow.com/questions/50543069/nodejs-express-how-to-send-response-back-to-browser
//https://www.tutorialrepublic.com/codelab.php?topic=bootstrap&file=elegant-modal-login-form-with-avatar-icon
//https://www.tutorialrepublic.com/codelab.php?topic=bootstrap&file=elegant-modal-login-form-with-icons
//https://www.tutorialrepublic.com/snippets/preview.php?topic=bootstrap&file=elegant-modal-login-form-with-icons
//https://www.tutorialrepublic.com/codelab.php?topic=bootstrap&file=simple-modal-login-form
//https://stackoverflow.com/questions/44915831/how-to-use-nodejs-pop-up-a-alert-window-in-browser


const express = require ('express');
const app = express ();
const bodyParser = require ('body-parser');
app.use ( bodyParser.json ()); // for parsing post data that hasjson format
app.use ( function (req , res , next ) {
  res.setHeader ('Access-Control-Allow-Origin', '*');
  res.setHeader ('Access-Control-Allow-Methods', 'GET ,POST ,PUT ,DELETE , OPTIONS ');
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

//Gets values from client and inserts to DB table 'coord'
app.post ('/signup', (req , res) => { //req = from ajax,
  console.log ( req.body );
   // data you send from your application is available on req.body object , your data processing logic goes here
    pool.query (`INSERT INTO usr VALUES ('${req.body.uname}', '${req.body.psw}', '${req.body.id}') RETURNING *`, function (err , dbResponse ) {
    if ( err) console.log ( err.schema);
    res.setHeader ('Access-Control-Allow-Origin', '*');
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

app.listen (3000 , () => console.log('Example app listening on port 3000!'));
