//Given code to be used
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
app.use(bodyParser.urlencoded({ extended: true }));
//Node-postgres: connection to database
const { Pool } = require ('pg');
const pool = new Pool ({
  user: 'group2',
  host: '130.237.64.8',
  database: 'spatial_db',
  password: 'marsvin',
  port: 5432 ,
});
//Takes username and password as input and checks if it is in the DB, if yes - returns user id, elsewhere returns false -- Used by function 'signin'
app.post ('/signin', (req,res) => {
  pool.query (`select case when '${req.body.uname}' in (select name from usr) and '${req.body.psw}' in (select password from usr) then (select id from usr where name = '${req.body.uname}' and password = '${req.body.psw}' )
  else 'false' end`, (err, dbResponse ) => {
    if ( err)  console.log (err);
    console.log (dbResponse); // respons till servern
    // here dbResponse is available , your data processing logic goes here
    res.setHeader ('Access-Control-Allow-Origin', '*');
    res.send (dbResponse); //sänder som repons till klienten
  });
 });

//Takes username, password and a random id as an in put and inserts it into DB (usr table) -- Used by function 'signout'
app.post ('/signup', (req , res) => { //req = from ajax,
  pool.query (`INSERT INTO usr VALUES ('${req.body.uname}', '${req.body.psw}', '${req.body.id}')`, function (err , dbResponse ) {
    if ( err) {
      res.send (err.name);
    }
    else {
      res.setHeader ('Access-Control-Allow-Origin', '*');
      res.send (dbResponse);
    }
  });
});
//Gets all My-places-positions and its beloning information for a specific user - Used by function 'loadMyPlaces'
app.get ('/myplaces', (req,res) => {
  pool.query ('select * from myplaces', (err, dbResponse ) => {
    if ( err) console.log (err);
    console.log (dbResponse.rows); // respons till servern
    // here dbResponse is available , your data processing logic goes here
    res.setHeader ('Access-Control-Allow-Origin', '*');
    res.send (dbResponse.rows); //sÃ¤nder som repons till klienten
  });
 });
//Takes lon, lat, place and description of a My-place-position (along with user id - not handled yet) and stores in DB (myplaces table) -- Used by function 'createMyPosition'
app.post ('/create', (req , res) => { //req = from ajax,
  console.log ( req.body );
   // data you send from your application is available on req.body object , your data processing logic goes here
  pool.query (`INSERT INTO myplaces VALUES ('${req.body.lon}', '${req.body.lat}', '${req.body.place}', '${req.body.descr}') RETURNING *`, function (err , dbResponse ) {
    if ( err) console.log ( err);
    res.setHeader ('Access-Control-Allow-Origin', '*');
    res.send (dbResponse); //sends to client
  });
});

app.listen (3000 , () => console.log('Example app listening on port 3000!'));
















//
//
// const users = []
//
// app.post('/users', function (req, res) {
//     // retrieve user posted data from the body
//     const user = req.body
//     users.push({
//       name: user.name,
//       age: user.age
//     })
//     res.send('successfully registered')
// })

// const express = require ('express');
// const app = express ();
// const bodyParser = require ('body-parser');
//
// app.use ( bodyParser.json ()); // for parsing post data that has json format
//
//  const { Pool } = require ('pg');
//  //
//  const pool = new Pool ({
//    user: 'group2',
//    host: '130.237.64.8',
//    database: 'spatial_db',
//    password: 'marsvin',
//    port: 5432,
//  });
//
//  // app.get ('/fetchuser', (req , res) => {
//  //   pool.query ('select * from usr', (err , dbResponse ) => {
//  //     if (err) console.log(err);
//  //     console.log(dbResponse.rows);
//  //     // here dbResponse is available , your data processing logic goes here
//  //     res.setHeader ('Access-Control-Allow-Origin', '*');
//  //     // res.send ( dbResponse.rows );
//  //  });
//  // // });
//  //
//  // app.get ('/test', (req , res) => {
//  //   pool.query ('select * from usr', (err , dbResponse ) => {
//  //     if (err) console.log(err);
//  //     console.log(dbResponse.rows);
//  //     // here dbResponse is available , your data processing logic goes here
//  //     res.setHeader ('Access-Control-Allow-Origin', '*');
//  //     res.send('testing');
//  //  });
//  // });
//  //
//  // app.post ('/test', (req , res) => {
//  //   console.log ('post working');
//  //   console.log ( JSON.stringify(req.body));
//  //   res.setHeader ('Access-Control-Allow-Origin', '*');
//  //   // data you send from your application is available on
//  //   // req.body object , your data processing logic goes here
//  //   // pool.query ("select * from usr", (err , dbResponse ) => {
//  //   //   if ( err) console.log ( err);
//  //   //   res.setHeader ('Access-Control-Allow-Origin', '*');
//  //   //   res.send ('');
//  //   // });
//  // });
//
// app.listen (3000 , () => console.log('Example app listening on port 3000!'));
//
//
//



//
//
//
