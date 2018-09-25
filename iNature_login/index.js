//SIGN IN
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
      var answ = res.rows[0].case;
      if (answ==true) {
        location="batman.html"
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
  var randStr = require('randomstring');
  var yourString = randStr.generate(8);
  if (confPsw==psw && psw!="" && confPsw!="") {
    var request = $.ajax ({
      url: 'http://localhost:3000/signup',
      type: "POST",
      cache: false ,
      contentType: "application/json",
      data: JSON.stringify ({ //req body
        uname: uname,
        psw: psw,
        id: yourString
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
    alert('Fill in your password in both fields!')
  }
}

var a = document.getElementById("upBtn");
a.addEventListener("click",signup);

var b = document.getElementById("inBtn");
b.addEventListener("click",signin);
