var d = document.getElementById("collapseTriggerProfile");
var showProfile = false;
$(".alert").hide();
d.onclick = function(){
    var x = document.getElementById("collapseProfile");
    if (showProfile){
        $("#collapseProfile div").fadeOut();
        $("#collapseProfile h5").fadeOut();
        x.classList.add("hide");
        x.classList.remove("show");
    } else {
        x.classList.add("show");
        x.classList.remove("hide");
        $("#collapseProfile div").fadeIn();
        $("#collapseProfile h5").fadeIn();
    }
    showProfile = !showProfile;
};
$( document ).on("click",".nav-pills .active",function () {
    $("#thisPageAlert").fadeIn();
    setTimeout(function(){ $("#thisPageAlert").fadeOut(); }, 2000);
})