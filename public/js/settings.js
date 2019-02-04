var account=true, people=false;
$("#addPeople").hide();
$('.btnSmall').hide();

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