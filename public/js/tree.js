var d = document.getElementById("collapseTriggerProfile");
var showProfile = false;
var jsonPeople = [], jsonTree = [];
$(".alert").hide();
$("#tableEditProfile").hide();
$("#save-button").hide();
$("#back-button").hide();
d.onclick = function () {
  var x = document.getElementById("collapseProfile");
  if (showProfile) {
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
$(document).on("click", ".nav-pills .active", function () {
  $("#thisPageAlert").fadeIn();
  setTimeout(function () { $("#thisPageAlert").fadeOut(); }, 2000);
})
$(document).on("click", ".close", function () {
  $(".modal").removeClass("show");
  $(".modal-backdrop").removeClass("show");
})
$(document).on("click", ".closebtn", function () {
  $(".modal").removeClass("show");
  $(".modal-backdrop").removeClass("show");
})
$(document).on("click", "#btnCreateTree", function () {
  $("#modalAddTree").addClass("show");
  $(".modal-backdrop").addClass("show");
})
$(document).on("click", "#edit-button", function () {
  $("#edit-button").hide();
  $("#save-button").show();
  $("#back-button").show();
  $("#imgProfileContainer").hide();
  $("#detailProfile").hide();
  $("#tableEditProfile").fadeIn();
})
$(document).on("click", "#back-button", function () {
  if ($("#tablegender").val()=="M"){
    $(".fa-male").show();
    $(".fa-female").hide();
  } else {
    $(".fa-male").hide();
    $(".fa-female").show();
  }
  $("#edit-button").show();
  $("#save-button").hide();
  $("#back-button").hide();
  $("#imgProfileContainer").fadeIn();
  $("#detailProfile").fadeIn();
  $("#tableEditProfile").hide();
})
$(document).on("click", "#delete-button", function () {
  $.ajax({
    type : "DELETE",
    beforeSend: function(request) {
      request.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    url : "https://silsilah-app.herokuapp.com/public/api/v1/delete-Person/" + $("#tablekey").val(),
    contentType : 'application/json',
    success : function (e2) {
      getTrees();
    },
    error : function (e2) {
      console.log(e2);
    }
  })
})
$(document).on("click", "#save-button", function () {
  var jsonPerson = {
    "nama" : $("#tablename").val(),
    "no_telp" : $("#tablephone").val(),
    
  }
  $.ajax({
    type : "PUT",
    beforeSend: function(request) {
      request.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    url : "https://silsilah-app.herokuapp.com/public/api/v1/update-person/" + $("#tablekey").val(),
    contentType : 'application/json',
    data : JSON.stringify(jsonPerson),
    success : function (e2) {
    },
    error : function (e2) {
      console.log(e2);
    }
  })
  for (var i=0; i<jsonPeople.length; i++){
    if (jsonPeople[i].key==$("#tablekey").val()){
      jsonPeople[i].n = $("#tablename").val();
      jsonPeople[i].s = $("#tablegender").val();
      if ($("#tablemother").val()!="undefined"){jsonPeople[i].m = $("#tablemother").val();}
      if ($("#tablefather").val()!="undefined"){jsonPeople[i].f = $("#tablefather").val();}
      if ($("#tablewife").val()!="undefined"){jsonPeople[i].ux = $("#tablewife").val();}
      if ($("#tablehusband").val()!="undefined"){jsonPeople[i].vir = $("#tablehusband").val();}
      jsonPeople[i].a[1] = $("#tablepob").val();
      jsonPeople[i].a[2] = $("#tabledob").val();
      jsonPeople[i].a[3] = $("#tableemail").val();
      jsonPeople[i].a[4] = $("#tablephone").val();
    }
  }
  setupDiagram(myDiagram, jsonPeople, $("#tablekey").val());
  console.log(jsonPeople)
})
$(document).on("click", "#submitCreateTree", function () {
  var jsonCreatePersonInit = {
    "jenis_kelamin":"male"
  }
  $.ajax({
    type : "POST",
    beforeSend: function(request) {
      request.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    url : "https://silsilah-app.herokuapp.com/public/api/v1/create-person",
    contentType : 'application/json',
    data : JSON.stringify(jsonCreatePersonInit),
    success : function (e) {
      var ids = e.id;
      var jsonCreateTree = {
        "label" : $("#formTreeName").val(),
        "person_id" : ids
      }
      $.ajax({
        type : "POST",
        beforeSend: function(request) {
          request.setRequestHeader("Authorization", localStorage.getItem("token"));
        },
        url : "https://silsilah-app.herokuapp.com/public/api/v1/create-tree",
        contentType : 'application/json',
        data : JSON.stringify(jsonCreateTree),
        success : function (e2) {
          localStorage.setItem('currentTree',e2.result.id)
          window.location.href = "./tree.html";
        },
        error : function (e2) {
          console.log(e2);
        }
      })
    },
    error : function (e) {
      console.log(e);
    }
  })
})
function getTrees(){
  $.ajax({
    type: "GET",
    beforeSend: function(request) {
      request.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    url: "https://silsilah-app.herokuapp.com/public/api/v1/get-tree-all",
    success: function (e) {
      jsonTree = e.result;
      if (jsonTree === undefined || jsonTree === null || jsonTree.length == 0) {
        $("#alertTree").html('You have not created any family tree yet, you can start by clicking on the " + " button on the top left corner');
        $("#alertTree").show();
      } else {
        if (localStorage.getItem("currentTree")==null){
          localStorage.setItem("currentTree",jsonTree[jsonTree.length-1].id);
        }
        for (var i=0; i<jsonTree.length; i++){            
          $("#selectTree").append(''+
            '<option value="' + jsonTree[i].id + '">' + jsonTree[i].label + '</option>'
          )
        }
        reloadTree(localStorage.getItem("currentTree"));
      }
    },
    error : function (e) {
      console.log(e);
    }
  });
}
function reloadTree(id){
  $.ajax({
    type: "GET",
    beforeSend: function(request) {
      request.setRequestHeader("Authorization", localStorage.getItem("token"));
    },
    url: "https://silsilah-app.herokuapp.com/public/api/v1/get-family/"+id,
    success: function (e) {
      console.log(e);
      var responsePeople = e.result;
      var obj, gender, ux, vir, birthday;
      for (var i=0; i<responsePeople.length; i++){
        if (responsePeople[i].id_ayah==null){responsePeople[i].id_ayah=undefined};
        if (responsePeople[i].id_ibu==null){responsePeople[i].id_ibu=undefined};
        if (responsePeople[i].jenis_kelamin=="male"){
          gender = "M";
          ux = responsePeople[i].pasangan;
          vir = undefined;
        } else {
          gender = "F";
          vir = responsePeople[i].pasangan;
          ux = undefined;
        }
        if (responsePeople[i].pasangan==null){
          vir = undefined;
          ux = undefined;
        };
        obj = {
          "key" : responsePeople[i].id,
          "n" : responsePeople[i].nama,
          "s" : gender,
          "m" : responsePeople[i].id_ibu,
          "f" : responsePeople[i].id_ayah,
          "vir" : vir,
          "ux" : ux,
          "a" : [
            responsePeople[i].avatar,
            responsePeople[i].tempat_lahir,
            responsePeople[i].tanggal_lahir,
            responsePeople[i].email,
            responsePeople[i].telp
          ]
        }
        jsonPeople.push(obj);
      }
      console.log(jsonPeople);
      setupDiagram(myDiagram, jsonPeople, 21 /* focus on this person */);
    },
    error : function (e) {
      console.log(e);
    }
  });
}


//============================= 
//========== DIAGRAM ========== 
//============================= 



function init() {

  getTrees();
  // Get the modal
  var modal = document.getElementById('myModal');

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }



  if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
  var $ = go.GraphObject.make;
  myDiagram =
    $(go.Diagram, "myDiagramDiv",
      {
        initialAutoScale: go.Diagram.Uniform,
        "undoManager.isEnabled": true,
        maxSelectionCount: 1, // users can select only one part at a time  

        // when a node is selected, draw a big yellow circle behind it
        nodeSelectionAdornmentTemplate:
          $(go.Adornment, "Auto",
            { layerName: "Grid" },  // the predefined layer that is behind everything else
            $(go.Shape, "RoundedRectangle", { fill: "lightgreen", stroke: null }),
            $(go.Placeholder)
          ),

        layout:  // use a custom layout, defined below
          $(GenogramLayout, { direction: 90, layerSpacing: 30, columnSpacing: 10 })
      });

  //on click modals
  myDiagram.addDiagramListener("ObjectSingleClicked",
    function (e) {
      modal.style.display = "block";
      var part = e.subject.part;
      if (!(part instanceof go.Link)) {
        var tablekey = document.getElementById("tablekey");
        tablekey.value = part.data.key;
        var tablename = document.getElementById("tablename");
        tablename.value = part.data.n;
        var profilename = document.getElementById("nameProfile");
        profilename.innerHTML = part.data.n;
        var tablegender = document.getElementById("tablegender");
        tablegender.value = part.data.s;
        var tablefather = document.getElementById("tablefather");
        tablefather.value = part.data.f;
        var tablemother = document.getElementById("tablemother");
        tablemother.value = part.data.m;
        var tablehusband = document.getElementById("tablehusband")
        tablehusband.value = part.data.vir;
        var tablewife = document.getElementById("tablewife");
        tablewife.value = part.data.ux;
        var avatar = document.getElementById("imgProfile");
        if (part.data.a[0]==null){
          if (part.data.s=="M"){
            avatar.style.backgroundImage = 'url("https://c7.uihere.com/files/348/800/890/computer-icons-avatar-user-login-avatar.jpg")';
          } else {
            avatar.style.backgroundImage = 'url("http://www.epsomps.vic.edu.au/wp-content/uploads/2016/09/512x512-1-300x300.png")';
          }
        } else {
          avatar.style.backgroundImage = "url("+part.data.a[0]+")";
        }
        var tableemail = document.getElementById("tableemail");
        tableemail.value = part.data.a[3];
        var tablephone = document.getElementById("tablephone");
        tablephone.value = part.data.a[4];
        var tablepob = document.getElementById("tablepob");
        tablepob.value = part.data.a[1];
        var tabledob = document.getElementById("tabledob");
        tabledob.value = part.data.a[2];
        var arr = ["0000", "01", "00"]
        if (part.data.a[2]!=null){
          var arr = part.data.a[2].split('-');
        }
        birthday = part.data.a[1] + ", " + arr[2];
        switch (arr[1]) {
          case "01":
            birthday += " Januari "
            break;    
          case "02":
            birthday += " Februari "
            break;    
          case "03":
            birthday += " Maret "
            break;    
          case "04":
            birthday += " April "
            break;    
          case "05":
            birthday += " Mei "
            break;    
          case "06":
            birthday += " Juni "
            break;    
          case "07":
            birthday += " Juli "
            break;    
          case "08":
            birthday += " Agustus "
            break;    
          case "09":
            birthday += " September "
            break;    
          case "10":
            birthday += " Oktober "
            break;    
          case "11":
            birthday += " November "
            break;    
          case "12":
            birthday += " Desember "
            break;    
          default:
            break;
        }
        birthday += arr[0];
        var textbirth = document.getElementById("dateOfBirthProfile");
        textbirth.innerHTML = birthday;
        var profilephone = document.getElementById("phoneNumberProfile");
        profilephone.innerHTML = part.data.a[4];
        var profileemail = document.getElementById("emailProfile");
        profileemail.innerHTML = part.data.a[3];

        // var clicked = part;
        // if (clicked !== null) {
        //   var thisemp = clicked.data;
        //   myDiagram.startTransaction("add child");
        //   var newemp;
        //   if (thisemp.s == "M") {
        //     newemp = {
        //       n: "",
        //       s: "",
        //       m: "",
        //       f: thisemp.key,
        //       ux: "",
        //       vir: "",
        //     };
        //   } else if (thisemp.s == "F") {
        //     newemp = {
        //       n: "",
        //       s: "",
        //       m: thisemp.key,
        //       f: "",
        //       ux: "",
        //       vir: "",
        //     };
        //   }
        //   myDiagram.model.addNodeData(newemp);
        //   myDiagram.commitTransaction("add child");
        // }

        // var titleName = document.createTextNode(part.data.n);
        // title.appendChild(titleName);

        // var x = document.createElement("li");
        // x.className = "list-group-item";
        // var nama = document.createTextNode("Name : " + part.data.n);
        // x.appendChild(nama);
        // ul.appendChild(x);


        // var x2 = document.createElement("li");
        // x2.className = "list-group-item";
        // var gender = document.createTextNode(" Gender : " + part.data.s);
        // x2.appendChild(gender);
        // ul.appendChild(x2);
        var load = document.getElementById('back-button');
        load.click();
        return console.log("id: " + part.data.key + " name: " + part.data.n);
      };
    });

  ///diagram listener

  var buttonmale = document.getElementById("male");
  buttonmale.onclick = function (e) {
    myDiagram.startTransaction("add  male h00man");
    var newemp = {
      n: "",
      s: "M",
      m: "",
      f: "",
      ux: "",
      vir: ""
    };
    myDiagram.model.addNodeData(newemp);
    myDiagram.commitTransaction("add  male h00man");
  }

  var buttonfemale = document.getElementById("female");
  buttonfemale.onclick = function (e) {
    myDiagram.startTransaction("add female h00man");
    var newemp = {
      n: "",
      s: "F",
      m: "",
      f: "",
      ux: "",
      vir: ""
    };
    myDiagram.model.addNodeData(newemp);
    myDiagram.commitTransaction("add female h00man");
  }

  function ConfirmDelete() {
    var x = confirm("Are you sure you want to delete?");
    if (x)
      return true;
    else
      return false;
  }

  myDiagram.addDiagramListener("ObjectSingleClicked", function (e) {
    var part = e.subject.part;
    var buttondelete = document.getElementById("delete-button");
    buttondelete.onclick = function (e) {
      // if (ConfirmDelete() == true) {
        // var node = myDiagram.findNodeForKey(part.data.key);
        // if (node !== null) {
        //   myDiagram.startTransaction();
        //   myDiagram.remove(node);
        //   myDiagram.commitTransaction("deleted node");
        //   //nanti tambahin save json disini untuk save
        // }
      // };
    }

    var buttonsave = document.getElementById("save-button");
    buttonsave.onclick = function(e){
      console.log("button save clicked");
      modal.style.display = "none";
    }
  })
  ////////////

  function mouseEnter(e, obj) {

    var text = obj.findObject("TEXT");
    text.stroke = "darkgreen";
  };

  function mouseLeave(e, obj) {

    var text = obj.findObject("TEXT");
    text.stroke = "black";
  };



  //fungsi mencari foto
  function findHeadShot(key) {
    if (key < 0 || key > 16) return "images/HSnopic.png"; // There are only 16 images on the server
    return "images/HS" + key + ".png"
  }



  // determine the color for each attribute shape
  function attrFill(a) {
    switch (a) {
      case "A": return "green";
      case "B": return "orange";
      case "C": return "red";
      case "D": return "cyan";
      case "E": return "gold";
      case "F": return "pink";
      case "G": return "blue";
      case "H": return "brown";
      case "I": return "purple";
      case "J": return "chartreuse";
      case "K": return "lightgray";
      case "L": return "magenta";
      case "S": return "red";
      default: return "transparent";
    }
  }

  // determine the geometry for each attribute shape in a male;
  // except for the slash these are all squares at each of the four corners of the overall square
  var tlsq = go.Geometry.parse("F M1 1 l19 0 0 19 -19 0z");
  var trsq = go.Geometry.parse("F M20 1 l19 0 0 19 -19 0z");
  var brsq = go.Geometry.parse("F M20 20 l19 0 0 19 -19 0z");
  var blsq = go.Geometry.parse("F M1 20 l19 0 0 19 -19 0z");
  var slash = go.Geometry.parse("F M38 0 L40 0 40 2 2 40 0 40 0 38z");
  function maleGeometry(a) {
    switch (a) {
      case "A": return tlsq;
      case "B": return tlsq;
      case "C": return tlsq;
      case "D": return trsq;
      case "E": return trsq;
      case "F": return trsq;
      case "G": return brsq;
      case "H": return brsq;
      case "I": return brsq;
      case "J": return blsq;
      case "K": return blsq;
      case "L": return blsq;
      case "S": return slash;
      default: return tlsq;
    }
  }

  // determine the geometry for each attribute shape in a female;
  // except for the slash these are all pie shapes at each of the four quadrants of the overall circle
  var tlarc = go.Geometry.parse("F M20 20 B 180 90 20 20 19 19 z");
  function femaleGeometry(a) {
    return tlarc;
  }


  // two different node templates, one for each sex,
  // named by the category value in the node data object
  myDiagram.nodeTemplateMap.add("M",  // male
    $(go.Node, "Vertical",
      {
        locationSpot: go.Spot.Center, locationObjectName: "ICON", mouseEnter: mouseEnter,
        mouseLeave: mouseLeave
      },
      $(go.Panel, "Auto",
        { name: "ICON" },
        $(go.Shape, "RoundedRectangle",
          { width: 50, height: 50, strokeWidth: 2, fill: "lightblue", portId: "" }),
        $(go.Picture, "https://placebear.com/200/300", {//masih harus binding
          desiredSize: new go.Size(40, 40),
          margin: 5
        }),
        $(go.Panel,
          { // for each attribute show a Shape at a particular place in the overall square
            itemTemplate:
              $(go.Panel,
                $(go.Shape,
                  { stroke: null, strokeWidth: 0 },
                  new go.Binding("fill", "", attrFill),
                  new go.Binding("geometry", "", maleGeometry))
              ),
            margin: 1
          },
          //new go.Binding("itemArray", "a")
        )
      ),
      $(go.TextBlock,
        { textAlign: "center", maxSize: new go.Size(80, NaN), margin: 5, name: "TEXT" },
        new go.Binding("text", "n"))
    ));

  myDiagram.nodeTemplateMap.add("F",  // female
    $(go.Node, "Vertical",
      {
        locationSpot: go.Spot.Center, locationObjectName: "ICON", mouseEnter: mouseEnter,
        mouseLeave: mouseLeave
      },
      $(go.Panel, "Auto",
        { name: "ICON" },
        $(go.Shape, "RoundedRectangle",
          { width: 50, height: 50, strokeWidth: 2, fill: "pink", portId: "" }),
        $(go.Picture, "https://placebear.com/200/300", { //masih harus di binding
          desiredSize: new go.Size(40, 40),
          margin: 5
        }),
        $(go.Panel,
          { // for each attribute show a Shape at a particular place in the overall circle
            itemTemplate:
              $(go.Panel,
                $(go.Shape,
                  { stroke: null, strokeWidth: 0 },
                  new go.Binding("fill", "", attrFill),
                  new go.Binding("geometry", "", femaleGeometry)),
              ),
            margin: 1
          },
          new go.Binding("itemArray", "a")
        )
      ),
      $(go.TextBlock,
        { textAlign: "center", maxSize: new go.Size(80, NaN), margin: 5, name: "TEXT" },
        new go.Binding("text", "n"))
    ));

  // the representation of each label node -- nothing shows on a Marriage Link
  myDiagram.nodeTemplateMap.add("LinkLabel",
    $(go.Node, { selectable: false, width: 1, height: 1, fromEndSegmentLength: 20 }));


  myDiagram.linkTemplate =  // for parent-child relationships
    $(go.Link,
      {
        routing: go.Link.Orthogonal, curviness: 15,
        layerName: "Background", selectable: false,
        fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top
      },
      $(go.Shape, { strokeWidth: 2 })
    );

  myDiagram.linkTemplateMap.add("Marriage",  // for marriage relationships
    $(go.Link,
      { selectable: false },
      $(go.Shape, { strokeWidth: 2, stroke: "red" })
    ));

  // // n: name, s: sex, m: mother, f: father, ux: wife, vir: husband, a: attributes/markers
  // setupDiagram(myDiagram, jsonPeople, 21 /* focus on this person */);


  // support editing the properties of the selected person in HTML
  // if (window.Inspector) myInspector = new Inspector("myInspector", myDiagramDiv,
  //   {
  //   properties: {
  //     "key": { readOnly: true },
  //   }
  //   });
}


//create and initialize the Diagram.model given an array of node data representing people
function setupDiagram(diagram, array, focusId) {
  diagram.model =
    go.GraphObject.make(go.GraphLinksModel,
      { // declare support for link label nodes
        linkLabelKeysProperty: "labelKeys",
        // this property determines which template is used
        nodeCategoryProperty: "s",
        // if a node data object is copied, copy its data.a Array
        copiesArrays: true,
        // create all of the nodes for people
        nodeDataArray: array
      });
  setupMarriages(diagram);
  setupParents(diagram);

  var node = diagram.findNodeForKey(focusId);
  if (node !== null) {
    diagram.select(node);
    // remove any spouse for the person under focus:
    //node.linksConnected.each(function(l) {
    //  if (!l.isLabeledLink) return;
    //  l.opacity = 0;
    //  var spouse = l.getOtherNode(node);
    //  spouse.opacity = 0;
    //  spouse.pickable = false;
    //});
  }
}

function findMarriage(diagram, a, b) {  // A and B are node keys
  var nodeA = diagram.findNodeForKey(a);
  var nodeB = diagram.findNodeForKey(b);
  if (nodeA !== null && nodeB !== null) {
    var it = nodeA.findLinksBetween(nodeB);  // in either direction
    while (it.next()) {
      var link = it.value;
      // Link.data.category === "Marriage" means it's a marriage relationship
      if (link.data !== null && link.data.category === "Marriage") return link;
    }
  }
  return null;
}

// now process the node data to determine marriages
function setupMarriages(diagram) {
  var model = diagram.model;
  var nodeDataArray = model.nodeDataArray;
  for (var i = 0; i < nodeDataArray.length; i++) {
    var data = nodeDataArray[i];
    var key = data.key;
    var uxs = data.ux;
    if (uxs !== undefined) {
      if (typeof uxs === "number") uxs = [uxs];
      for (var j = 0; j < uxs.length; j++) {
        var wife = uxs[j];
        if (key === wife) {
          // or warn no reflexive marriages
          continue;
        }
        var link = findMarriage(diagram, key, wife);
        if (link === null) {
          // add a label node for the marriage link
          var mlab = { s: "LinkLabel" };
          model.addNodeData(mlab);
          // add the marriage link itself, also referring to the label node
          var mdata = { from: key, to: wife, labelKeys: [mlab.key], category: "Marriage" };
          model.addLinkData(mdata);
        }
      }
    }
    var virs = data.vir;
    if (virs !== undefined) {
      if (typeof virs === "number") virs = [virs];
      for (var j = 0; j < virs.length; j++) {
        var husband = virs[j];
        if (key === husband) {
          // or warn no reflexive marriages
          continue;
        }
        var link = findMarriage(diagram, key, husband);
        if (link === null) {
          // add a label node for the marriage link
          var mlab = { s: "LinkLabel" };
          model.addNodeData(mlab);
          // add the marriage link itself, also referring to the label node
          var mdata = { from: key, to: husband, labelKeys: [mlab.key], category: "Marriage" };
          model.addLinkData(mdata);
        }
      }
    }
  }
}

// process parent-child relationships once all marriages are known
function setupParents(diagram) {
  var model = diagram.model;
  var nodeDataArray = model.nodeDataArray;
  for (var i = 0; i < nodeDataArray.length; i++) {
    var data = nodeDataArray[i];
    var key = data.key;
    var mother = data.m;
    var father = data.f;
    if (mother !== undefined && father !== undefined) {
      var link = findMarriage(diagram, mother, father);
      if (link === null) {
        // or warn no known mother or no known father or no known marriage between them
        if (window.console) window.console.log("unknown marriage: " + mother + " & " + father);
        continue;
      }
      var mdata = link.data;
      var mlabkey = mdata.labelKeys[0];
      var cdata = { from: mlabkey, to: key };
      myDiagram.model.addLinkData(cdata);
    }
  }
}


// A custom layout that shows the two families related to a person's parents
function GenogramLayout() {
  go.LayeredDigraphLayout.call(this);
  this.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
  this.spouseSpacing = 30;  // minimum space between spouses
}
go.Diagram.inherit(GenogramLayout, go.LayeredDigraphLayout);

GenogramLayout.prototype.makeNetwork = function (coll) {
  // generate LayoutEdges for each parent-child Link
  var net = this.createNetwork();
  if (coll instanceof go.Diagram) {
    this.add(net, coll.nodes, true);
    this.add(net, coll.links, true);
  } else if (coll instanceof go.Group) {
    this.add(net, coll.memberParts, false);
  } else if (coll.iterator) {
    this.add(net, coll.iterator, false);
  }
  return net;
};

// internal method for creating LayeredDigraphNetwork where husband/wife pairs are represented
// by a single LayeredDigraphVertex corresponding to the label Node on the marriage Link
GenogramLayout.prototype.add = function (net, coll, nonmemberonly) {
  var multiSpousePeople = new go.Set();
  // consider all Nodes in the given collection
  var it = coll.iterator;
  while (it.next()) {
    var node = it.value;
    if (!(node instanceof go.Node)) continue;
    if (!node.isLayoutPositioned || !node.isVisible()) continue;
    if (nonmemberonly && node.containingGroup !== null) continue;
    // if it's an unmarried Node, or if it's a Link Label Node, create a LayoutVertex for it
    if (node.isLinkLabel) {
      // get marriage Link
      var link = node.labeledLink;
      var spouseA = link.fromNode;
      var spouseB = link.toNode;
      // create vertex representing both husband and wife
      var vertex = net.addNode(node);
      // now define the vertex size to be big enough to hold both spouses
      vertex.width = spouseA.actualBounds.width + this.spouseSpacing + spouseB.actualBounds.width;
      vertex.height = Math.max(spouseA.actualBounds.height, spouseB.actualBounds.height);
      vertex.focus = new go.Point(spouseA.actualBounds.width + this.spouseSpacing / 2, vertex.height / 2);
    } else {
      // don't add a vertex for any married person!
      // instead, code above adds label node for marriage link
      // assume a marriage Link has a label Node
      var marriages = 0;
      node.linksConnected.each(function (l) { if (l.isLabeledLink) marriages++; });
      if (marriages === 0) {
        var vertex = net.addNode(node);
      } else if (marriages > 1) {
        multiSpousePeople.add(node);
      }
    }
  }
  // now do all Links
  it.reset();
  while (it.next()) {
    var link = it.value;
    if (!(link instanceof go.Link)) continue;
    if (!link.isLayoutPositioned || !link.isVisible()) continue;
    if (nonmemberonly && link.containingGroup !== null) continue;
    // if it's a parent-child link, add a LayoutEdge for it
    if (!link.isLabeledLink) {
      var parent = net.findVertex(link.fromNode);  // should be a label node
      var child = net.findVertex(link.toNode);
      if (child !== null) {  // an unmarried child
        net.linkVertexes(parent, child, link);
      } else {  // a married child
        link.toNode.linksConnected.each(function (l) {
          if (!l.isLabeledLink) return;  // if it has no label node, it's a parent-child link
          // found the Marriage Link, now get its label Node
          var mlab = l.labelNodes.first();
          // parent-child link should connect with the label node,
          // so the LayoutEdge should connect with the LayoutVertex representing the label node
          var mlabvert = net.findVertex(mlab);
          if (mlabvert !== null) {
            net.linkVertexes(parent, mlabvert, link);
          }
        });
      }
    }
  }

  while (multiSpousePeople.count > 0) {
    // find all collections of people that are indirectly married to each other
    var node = multiSpousePeople.first();
    var cohort = new go.Set();
    this.extendCohort(cohort, node);
    // then encourage them all to be the same generation by connecting them all with a common vertex
    var dummyvert = net.createVertex();
    net.addVertex(dummyvert);
    var marriages = new go.Set();
    cohort.each(function (n) {
      n.linksConnected.each(function (l) {
        marriages.add(l);
      })
    });
    marriages.each(function (link) {
      // find the vertex for the marriage link (i.e. for the label node)
      var mlab = link.labelNodes.first()
      var v = net.findVertex(mlab);
      if (v !== null) {
        net.linkVertexes(dummyvert, v, null);
      }
    });
    // done with these people, now see if there are any other multiple-married people
    multiSpousePeople.removeAll(cohort);
  }
};

// collect all of the people indirectly married with a person
GenogramLayout.prototype.extendCohort = function (coll, node) {
  if (coll.has(node)) return;
  coll.add(node);
  var lay = this;
  node.linksConnected.each(function (l) {
    if (l.isLabeledLink) {  // if it's a marriage link, continue with both spouses
      lay.extendCohort(coll, l.fromNode);
      lay.extendCohort(coll, l.toNode);
    }
  });
};

GenogramLayout.prototype.assignLayers = function () {
  go.LayeredDigraphLayout.prototype.assignLayers.call(this);
  var horiz = this.direction == 0.0 || this.direction == 180.0;
  // for every vertex, record the maximum vertex width or height for the vertex's layer
  var maxsizes = [];
  this.network.vertexes.each(function (v) {
    var lay = v.layer;
    var max = maxsizes[lay];
    if (max === undefined) max = 0;
    var sz = (horiz ? v.width : v.height);
    if (sz > max) maxsizes[lay] = sz;
  });
  // now make sure every vertex has the maximum width or height according to which layer it is in,
  // and aligned on the left (if horizontal) or the top (if vertical)
  this.network.vertexes.each(function (v) {
    var lay = v.layer;
    var max = maxsizes[lay];
    if (horiz) {
      v.focus = new go.Point(0, v.height / 2);
      v.width = max;
    } else {
      v.focus = new go.Point(v.width / 2, 0);
      v.height = max;
    }
  });
  // from now on, the LayeredDigraphLayout will think that the Node is bigger than it really is
  // (other than the ones that are the widest or tallest in their respective layer).
};

GenogramLayout.prototype.commitNodes = function () {
  go.LayeredDigraphLayout.prototype.commitNodes.call(this);
  // position regular nodes
  this.network.vertexes.each(function (v) {
    if (v.node !== null && !v.node.isLinkLabel) {
      v.node.position = new go.Point(v.x, v.y);
    }
  });
  // position the spouses of each marriage vertex
  var layout = this;
  this.network.vertexes.each(function (v) {
    if (v.node === null) return;
    if (!v.node.isLinkLabel) return;
    var labnode = v.node;
    var lablink = labnode.labeledLink;
    // In case the spouses are not actually moved, we need to have the marriage link
    // position the label node, because LayoutVertex.commit() was called above on these vertexes.
    // Alternatively we could override LayoutVetex.commit to be a no-op for label node vertexes.
    lablink.invalidateRoute();
    var spouseA = lablink.fromNode;
    var spouseB = lablink.toNode;
    // prefer fathers on the left, mothers on the right
    if (spouseA.data.s === "F") {  // sex is female
      var temp = spouseA;
      spouseA = spouseB;
      spouseB = temp;
    }
    // see if the parents are on the desired sides, to avoid a link crossing
    var aParentsNode = layout.findParentsMarriageLabelNode(spouseA);
    var bParentsNode = layout.findParentsMarriageLabelNode(spouseB);
    if (aParentsNode !== null && bParentsNode !== null && aParentsNode.position.x > bParentsNode.position.x) {
      // swap the spouses
      var temp = spouseA;
      spouseA = spouseB;
      spouseB = temp;
    }
    spouseA.position = new go.Point(v.x, v.y);
    spouseB.position = new go.Point(v.x + spouseA.actualBounds.width + layout.spouseSpacing, v.y);
    if (spouseA.opacity === 0) {
      var pos = new go.Point(v.centerX - spouseA.actualBounds.width / 2, v.y);
      spouseA.position = pos;
      spouseB.position = pos;
    } else if (spouseB.opacity === 0) {
      var pos = new go.Point(v.centerX - spouseB.actualBounds.width / 2, v.y);
      spouseA.position = pos;
      spouseB.position = pos;
    }
  });
  // position only-child nodes to be under the marriage label node
  this.network.vertexes.each(function (v) {
    if (v.node === null || v.node.linksConnected.count > 1) return;
    var mnode = layout.findParentsMarriageLabelNode(v.node);
    if (mnode !== null && mnode.linksConnected.count === 1) {  // if only one child
      var mvert = layout.network.findVertex(mnode);
      var newbnds = v.node.actualBounds.copy();
      newbnds.x = mvert.centerX - v.node.actualBounds.width / 2;
      // see if there's any empty space at the horizontal mid-point in that layer
      var overlaps = layout.diagram.findObjectsIn(newbnds, function (x) { return x.part; }, function (p) { return p !== v.node; }, true);
      if (overlaps.count === 0) {
        v.node.move(newbnds.position);
      }
    }
  });
};

GenogramLayout.prototype.findParentsMarriageLabelNode = function (node) {
  var it = node.findNodesInto();
  while (it.next()) {
    var n = it.value;
    if (n.isLinkLabel) return n;
  }
  return null;
};
//============================= 
//======== END DIAGRAM ======== 
//============================= 


