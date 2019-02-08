var account = true, people = false;
$("#addPeople").hide();
$('.btnSmall').hide();
$(".alert").hide();
var reader = new FileReader();
function readURL(input, id) {
  if (input.files && input.files[0]) {
    reader.onload = function (e) {
      $(id).css({ 'background-image': 'url("' + e.target.result + '")' })
      // $(id).attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}




$("#accountPhotoInput").change(function () {
  readURL(this, "#imgChangeAvatar");
});
$("#peoplePhotoInput").change(function () {
  readURL(this, "#changeImgPeople");
});

$(document).on("click", "#uploadAvatar", function () {
  $('#accountPhotoInput').trigger('click');
})
$(document).on("click", "#uploadPeoplePhoto", function () {
  $('#peoplePhotoInput').trigger('click');
})

$(document).on("click", "#addPeople", function () {
  $('#deletePerson').hide();
  $('#editPersonFirstName').val('');
  $('#editPersonLastName').val('');
  $('#editPersonHomeNumber').val('');
  $('#editPersonPhoneNumber').val('');
  $('#editPersonAddress').val('');
  $('#editPersonDateOfBirth').val('');
})

localStorage.setItem('idcounter', 100);

$(document).on("click", "#saveEditPerson", function () {

  if ($('#editPersonFirstName').val() == "" || $('#editPersonLastName').val() == "" ||
    $('#editPersonHomeNumber').val() == "" || $('#editPersonPhoneNumber').val() == "" ||
    $('#editPersonAddress').val() == "" || $('#editPersonDateOfBirth').val() == ""
  ) {
    $("#alertSettingsModal").show();
    $("#alertSettingsModal").html("Please make sure you have filled all the forms");
    $("#alertSettingModal").fadeIn();
    setTimeout(function () { $("#alertSettingsModal").fadeOut(); }, 2000);
  } else {
    var d = new Date();
    var isod = d.toISOString();
    var jsonAddPerson = {
        "id" : localStorage.getItem("idcounter"),
        "nama" : $('#editPersonFirstName').val()+" "+$('#editPersonLastName').val(),
        "no_telp" :$('#editPersonHomeNumber').val() ,
        "alamat" :  $('#editPersonAddress').val(),
        "tempat_lahir" : "",
        "tanggal_lahir" :  $('#editPersonDateOfBirth').val() ,
        "created_at" : isod,
        "updated_at" : isod,
        "avatar" : {
          "url" : "",
        },
        "id_pasangan" : "", 
        "id_ortu" : "",
        "jenis_kelamin" : $('#editPersonGender').val()

    }
    $.ajax({
      type: "POST",
      url: "https://silsilah-app.herokuapp.com/public/api/v1/create-person",
      contentType: 'application/json',
      data: JSON.stringify(jsonAddPerson),
      beforeSend : function(xhr){
        xhr.setRequestHeader("Authorization", localStorage.getItem('token') );
      },
      success: function (e) {
        console.log("add person:  success");
        var counter = localStorage.getItem('idcounter');
        counter++;
        localStorage.setItem('idcounter', counter);
      },
      error: function (e) {
        $("#alertSettingsModal").show();
        $("#alertSettingsModal").html("Somethings wrong :( "+"["+e.statusText+"]");
        $("#alertSettingModal").fadeIn();
        console.log(e);
        setTimeout(function () { $("#alertSettingsModal").fadeOut(); }, 2000);
      }
    })
  }
})

$(document).on("click", ".cardPerson", function () {
  $('#deletePerson').show();
})

$(document).on("click", "#accountTab", function () {
  $("#addPeople").hide();
  $("#saveAccount").fadeIn();
  account = true;
  people = false;
})
$(document).on("click", "#peopleTab", function () {
  $("#saveAccount").hide();
  $("#addPeople").fadeIn();
  account = false;
  people = true;
})
$(document).scroll(function () {
  var y = $(this).scrollTop();
  if (account) {
    if (y > 100) {
      $('#saveAccountSmall').fadeIn();
    } else {
      $('#saveAccountSmall').fadeOut();
    }
  };
  if (people) {
    if (y > 100) {
      $('#addPeopleSmall').fadeIn();
    } else {
      $('#addPeopleSmall').fadeOut();
    }
  };
});

