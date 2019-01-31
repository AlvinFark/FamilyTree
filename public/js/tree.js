var d = document.getElementById("collapseTriggerProfile");
var showProfile = false;
d.onclick = function(){
    var x = document.getElementById("collapseProfile");
    if (showProfile){
        d.classList.add("shadow");
        x.classList.add("hide");
        x.classList.remove("show");
    } else {
        d.classList.remove("shadow");
        x.classList.add("show");
        x.classList.remove("hide");
    }
    showProfile = !showProfile;
};