
const socket = io();

let devMode = false;
let devPass = "";


socket.emit("getclasses");

socket.on("classes", (classlist) => {

  console.log(classlist);

  document.getElementById("classesloading").style.opacity = 0;

  makesortedlist(classlist);
  makeclasslist(sortingmetric)

})

socket.on("opinionuploaded", (comment) => {


  if("error" in comment){
    opinionuploaded = "failed";
    document.getElementById("opinionfailed").textContent = comment.error;

    if(comment.error.includes("banned")){
      localStorage.setItem("banned", true);
    }

  }
  else{
    opinionuploaded = true;
    console.log(comment);
    commentsection(comment, true);
    socket.emit("getclasses");
  }

})

socket.on("comments", commentsreceived);

socket.on("commentslength", commentslength);

let classopen = null;


function init(){
  setratingscales();
  checkblank();
  classlistinit();
}
