$(".alert").hide();
$("#btnSignIn>span").hide();
$("#btnSignIn>#spanSignIn").show();

$( document ).on("click","#btnSignIn",function () {
  if (($("#inputEmail").val()=="")||($("#inputPassword").val()=="")) {
    $("#alertSignIn").html("Please make sure you have filled all the forms");
    $("#alertSignIn").fadeIn();
    setTimeout(function () { $("#alertSignIn").fadeOut(); }, 2000);
  } else {
    var jsonSignIn = {
      "username" : $("#inputEmail").val(),
      "password" : $("#inputPassword").val()
    }
    $.ajax({
      type : "POST",
      url : "https://silsilah-app.herokuapp.com/public/api/v1/auth/login",
      contentType : 'application/json',
      data : JSON.stringify(jsonSignIn),
      beforeSend: function(){
        $("#btnSignIn>span").show();
        $("#btnSignIn>#spanSignIn").hide();
      },
      success : function (e) {
        $("#btnSignIn>span").hide();
        $("#btnSignIn>#spanSignIn").show();
        console.log(e);
        localStorage.setItem('token',e.access_token);
      },
      error : function (e) {
        $("#btnSignIn>span").hide();
        $("#btnSignIn>#spanSignIn").show();  
        if (e.status==401){
          $("#btnSignIn>span").hide();
          $("#btnSignIn>#spanSignIn").show();
          $("#alertSignIn").html("You entered wrong email or password, please try again");
          $("#alertSignIn").fadeIn();
          setTimeout(function () { $("#alertSignIn").fadeOut(); }, 3000);
        }
      }
    })
  }
})