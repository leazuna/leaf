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
app.post ('/coord', (req , res) => { //req = from ajax,
  console.log ( req.body ); //puts data in consloe for debugging/help when error
   // data you send from your application is available on req.body object , your data processing logic goes here
  pool.query (`INSERT INTO coord VALUES ('${req.body.lon}', '${req.body.lat}', '${req.body.descr}') RETURNING *`, function (err , dbResponse ) { //Query that says where the data will be stored and what data that should be stored using a SQL-ish query, if there is anything wrong the DB will send an error message and an error will be returned
    if ( err) console.log ( err); //if something is wrong put the error message in the console
    res.setHeader ('Access-Control-Allow-Origin', '*'); 
    res.send (dbResponse); //the response which is sent to the client
  });
});

//Gets data from database - reads all data when the application is started
app.get ('/coord', (req,res) => {
  pool.query ('select * from coord', (err, dbResponse ) => { //gets all data from the coord-table
    if ( err) console.log (err); //shows error message in consol if there is an error when reading
    console.log (dbResponse.rows); // response to the server
    // here dbResponse is available , your data processing logic goes here
    res.setHeader ('Access-Control-Allow-Origin', '*'); 
    res.send (dbResponse.rows); //the response which is sent to the client
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
