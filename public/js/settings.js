
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
      "id": $.now(),
      "nama": $('#editPersonFirstName').val() + " " + $('#editPersonLastName').val(),
      "no_telp": $('#editPersonHomeNumber').val()+" "+$('#editPersonPhoneNumber').val(),
      "alamat": $('#editPersonAddress').val(),
      "tempat_lahir": "",
      "tanggal_lahir": $('#editPersonDateOfBirth').val(),
      "created_at": isod,
      "updated_at": isod,
      "avatar": {
        "url": "https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg",
      },
      "id_pasangan": "",
      "id_ortu": "",
      "jenis_kelamin": $('#editPersonGender').val()

    }
    $.ajax({
      type: "POST",
      url: "https://silsilah-app.herokuapp.com/public/api/v1/create-person",
      contentType: 'application/json',
      data: JSON.stringify(jsonAddPerson),
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('token'));
      },
      success: function (e) {
        console.log("add person:  success");
        var counter = localStorage.getItem('idcounter');
        counter++;
        localStorage.setItem('idcounter', counter);
        $(".modal").hide();
        $(".modal-backdrop").hide();
        $("#alertUpdate").show();
        $("#alertUpdate").html("Person added!");
        $("#alertUpdate").fadeIn();
        setTimeout(function () { $("#alertUpdate").fadeOut(); }, 2000);
      },
      error: function (e) {
        $("#alertSettingsModal").show();
        $("#alertSettingsModal").html("Somethings wrong :( " + "[" + e.statusText + "]");
        $("#alertSettingModal").fadeIn();
        setTimeout(function () { $("#alertSettingsModal").fadeOut(); }, 2000);
      }
    })
  }
})

$(document).on("click", ".cardPerson", function () {
  $('#deletePerson').show();
  var personId;
  $('#modalPeople').on('show.bs.modal', function (e) {
    var yourparameter = e.relatedTarget.dataset.yourparameter;
    personId = e.relatedTarget.id;

    $.ajax({
      type: "GET",
      url: "https://silsilah-app.herokuapp.com/public/api/v1/get-person-detail/" + personId,
      contentType: 'application/json',
      // data: JSON.stringify(jsonUpdatePerson),
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('token'));
      },
      success: function (e) {
        console.log(e);
        var nama = e.nama.split(" ");
        var telp = e.no_telp.split(" ");
        $('#editPersonFirstName').val(nama[0]);
        $('#editPersonLastName').val(nama[1]);
        $('#editPersonHomeNumber').val(telp[0]);
        $('#editPersonPhoneNumber').val(telp[1]);
        $('#editPersonAddress').val('');
        $('#editPersonDateOfBirth').val(e.tanggal_lahir );
        $('#editPersonGender').val(e.jenis_kelamin);
      },
      error: function (e) {
            $("#alertSettingsModal").show();
            $("#alertSettingsModal").html("Somethings wrong :( " + "[" + e.statusText + "]");
            $("#alertSettingModal").fadeIn();
            setTimeout(function () { $("#alertSettingsModal").fadeOut(); }, 2000);
          
      }
    })
  });
})

$(document).on("click", "#deletePerson", function () {

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


// var res = new XMLHttpRequest();
window.onload = function () {
  console.log(localStorage.getItem("token"));
  $.ajax({
    type: "GET",
    url: "https://silsilah-app.herokuapp.com/public/api/v1/get-person-all",
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('token'));
    },
    success: function (res) {
      console.log(res.result[0]);
      var response = res.result;

      console.log(response[0].nama);
      render(response);

    },
    error: function (e) {
      console.log(e.statusText);
    }
  })
}

function render(data) {
  var string = "";
  var pict;

  for (i = 0; i < data.length; i++) {
    var uniqueId = data[i].id;
    if (data[i].avatar.url == null) {
      pict = "https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg";
    } else {
      pict = "data[i].avatar.url";
    }

    string += '<div class="col-6 col-md-3 col-lg-2 cardPerson" data-toggle="modal" data-target="#modalPeople" id="' + uniqueId + '"><div class="card text-center rounded shadow"><img src="' + pict + '" class="card-img-top" alt="..."><div class="card-body">' + data[i].nama + '</div></div></div>';
  }

  console.log(string);
  document.getElementById("rowid").innerHTML = string;
}

