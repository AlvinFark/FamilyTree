var account=true, people=false;
$("#addPeople").hide();
$('.btnSmall').hide();

var reader = new FileReader();
function readURL(input,id) {
  if (input.files && input.files[0]) {
    reader.onload = function(e) {
      $(id).css({'background-image':'url("'+ e.target.result +'")'})
      // $(id).attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}

$("#accountPhotoInput").change(function() {
  readURL(this,"#imgChangeAvatar");
});
$("#peoplePhotoInput").change(function() {
  readURL(this,"#changeImgPeople");
});

$( document ).on("click","#uploadAvatar",function () {
  $('#accountPhotoInput').trigger('click');
})
$( document ).on("click","#uploadPeoplePhoto",function () {
  $('#peoplePhotoInput').trigger('click');
})

$( document ).on("click","#addPeople",function () {
  $('#deletePerson').hide();
  $('#editPersonFirstName').val('');
  $('#editPersonLastName').val('');
  $('#editPersonHomeNumber').val('');
  $('#editPersonPhoneNumber').val('');
  $('#editPersonAddress').val('');
  $('#editPersonDateOfBirth').val('');
})
$( document ).on("click",".cardPerson",function () {
  $('#deletePerson').show();
})

$( document ).on("click","#accountTab",function () {
  $("#addPeople").hide();
  $("#saveAccount").fadeIn();
  account=true;
  people=false;
})
$( document ).on("click","#peopleTab",function () {
  $("#saveAccount").hide();
  $("#addPeople").fadeIn();
  account=false;
  people=true;
})
$(document).scroll(function() {
  var y = $(this).scrollTop();
  if (account){
    if (y > 100) {
      $('#saveAccountSmall').fadeIn();
    } else {
      $('#saveAccountSmall').fadeOut();
    }
  };
  if (people){
    if (y > 100) {
      $('#addPeopleSmall').fadeIn();
    } else {
      $('#addPeopleSmall').fadeOut();
    }
  };
});