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


$( document ).on("click","#btnSignUp",function () {
  if (match) {
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
      },
      error : function (e) {
        console.log(e);
      }
    })
  }
})