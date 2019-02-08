$(".alert").hide();

var match = false;
var check = function() {
  if ((document.getElementById('inputPassword').value==document.getElementById('inputPassword2').value)
  &&(document.getElementById('inputPassword').value!="")) {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerHTML = 'matching';
    match = true;
  } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'not matching';
    match = false;
  }
}

var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var checkBox = document.getElementById("cbxTerms");
$( document ).on("click","#btnSignUp",function () {
  if (($("#inputEmail").val()=="")||($("#inputPassword").val()=="")||($("#inputPassword2").val()=="")) {
    $("#alertSignUp").html("Please make sure you have filled all the forms");
    $("#alertSignUp").fadeIn();
    setTimeout(function () { $("#alertSignUp").fadeOut(); }, 2000);
  }  else if (!($("#inputEmail").val().match(re))){
    $("#alertSignUp").html("Please make sure the email you've entered is valid");
    $("#alertSignUp").fadeIn();
    setTimeout(function () { $("#alertSignUp").fadeOut(); }, 2000);
  }  else if (!match) {
    $("#alertSignUp").html("Please make sure the password and password validation have the same text");
    $("#alertSignUp").fadeIn();
    setTimeout(function () { $("#alertSignUp").fadeOut(); }, 2000);
  } else if (!checkBox.checked) {
    $("#alertSignUp").html("Please make sure you have agreed to the terms and conditions");
    $("#alertSignUp").fadeIn();
    setTimeout(function () { $("#alertSignUp").fadeOut(); }, 2000);
  } else {
    var jsonSignUp = {
      "username" : $("#inputEmail").val(),
      "password" : $("#inputPassword").val()
    }
    $.ajax({
      type : "POST",
      url : "https://silsilah-app.herokuapp.com/public/api/v1/create-user",
      contentType : 'application/json',
      data : JSON.stringify(jsonSignUp),
      success : function (e) {
        console.log(e);
        alert("Your account is successfully created, please login to continue")
        window.location.href = 'signin.html';
      },
      error : function (e) {
        console.log(e);
      }
    })
  }
})