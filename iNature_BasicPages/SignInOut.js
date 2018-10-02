 //SIGN IN
 var answ= "";
 function signin(form) {
   var uname = document.getElementById('username_in').value;
   var psw = document.getElementById('password_in').value;
   console.log(psw)
   console.log(uname)
   var request = $.ajax({
     url:'http://localhost:3000/signin',
     type: 'POST',
     cache: false ,
     contentType: "application/json",
     data: JSON.stringify ({ //req body
       uname: uname,
       psw: psw
     }),
     success: function(res){
       console.log(res.rows[0].case);
       answ = res.rows[0].case;
       if (answ!='false') {
        var request = $.ajax({
          url:'http://localhost:3000/setuser',
          type: 'POST',
          cache: false ,
          contentType: "application/json",
          data: JSON.stringify ({ //req body
            user: answ
          }),
        });
        window.location.href = "./WEBGISProjectP3.html";
        console.log("du har skrivit rätt");
       }
       else {
         alert('The username or password is incorrect, please try again.')
       }
     }
   });
 }
 //SIGN UP
 function signup(form) {
   var uname = document.getElementById('username_up').value;
   var psw= document.getElementById('password_up').value;
   var confPsw = document.getElementById('confpassword_up').value;
   if (confPsw==psw && psw!="" && confPsw!="") {
     var request = $.ajax ({
       url: 'http://localhost:3000/signup',
       type: "POST",
       cache: false ,
       contentType: "application/json",
       data: JSON.stringify ({ //req body
         uname: uname,
         psw: psw
       }),
       success: function(res){
         console.log(res)
         if (res=='error') {
           alert("The username is already in use, please choose another one!")
         }
         else {
           alert("Welcome to iNature - please sign in!")
           $("#signUp .close").click()
         }
       }
     });
   }
   else {
     alert('Please, fill in all fields.')
   }
 }

 var a = document.getElementById("upBtn");
 a.addEventListener("click",signup);

 var b = document.getElementById("inBtn");
 b.addEventListener("click",signin);
















 // KLISTRAS IN LÄNGST UPP I WEBGISPROJP3
 // //-------------------------------------------------------------------- SIGN IN/OUT FUNCTIONS
 // //SIGN IN
 // var userId = [];
 // function signin(form) {
 //   var uname = document.getElementById('username_in').value;
 //   var psw = document.getElementById('password_in').value;
 //   // console.log(psw)
 //   // console.log(uname)
 //   request = $.ajax({
 //     url:'http://localhost:3000/signin',
 //     type: 'POST',
 //     cache: false ,
 //     contentType: "application/json",
 //     data: JSON.stringify ({ //req body
 //       uname: uname,
 //       psw: psw
 //     }),
 //     success: function(res){
 //       //console.log(res.rows[0].case);
 //       var answ = res.rows[0].case;
 //       if (answ !='false') {
 //       userId.push(answ);
 //       window.location.href = "./WEBGISProjectP3.html";
 //       }
 //       else {
 //         alert('The username or password is incorrect, please try again.')
 //       }
 //     }
 //   });
 // }
 //
 // //SIGN UP
 // function signup(form) {
 //   var uname = document.getElementById('username_up').value;
 //   var psw = document.getElementById('password_up').value;
 //   var confPsw = document.getElementById('confpassword_up').value;
 //   var randStr = require('randomstring');
 //   var yourString = randStr.generate(8);
 //   if (confPsw==psw && psw!="" && confPsw!="") {
 //     var request = $.ajax ({
 //       url: 'http://localhost:3000/signup',
 //       type: "POST",
 //       cache: false ,
 //       contentType: "application/json",
 //       data: JSON.stringify ({ //req body
 //         uname: uname,
 //         psw: psw,
 //         id: yourString
 //       }),
 //       success: function(res){
 //         console.log(res)
 //         if (res=='error') {
 //           alert("The username is already in use, please choose another one!")
 //         }
 //         else {
 //           alert("Welcome to iNature - please sign in!")
 //           $("#signUp .close").click()
 //         }
 //       }
 //     });
 //   }
 //   else {
 //     alert('Please, fill in all fields.')
 //   }
 // }
 //
 // var upBtn = document.getElementById("upBtn");
 // if(upBtn){
 // upBtn.addEventListener("click",signup,false);
 // }
 // var inBtn = document.getElementById("inBtn");
 // if(inBtn){
 // inBtn.addEventListener("click",signin,true);
 // }
