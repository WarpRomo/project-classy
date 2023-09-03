

let sortingmetric = "Overall";
let ratings = ["Overall", "Enjoyment", "Difficulty", "Work", "Useful"];

function makeclassbutton(classy, sorting){

  let allclasses = document.getElementById("classes");

  let classcontainer = document.createElement("button");

  classcontainer.classList.add("classcontainer");

  let classname = document.createElement("p");

  classname.classList.add("classname")

  classname.innerHTML = classy.name;

  classcontainer.appendChild(classname);

  let description = document.createElement("p");
  description.classList.add("classdescription");
  description.innerHTML = classy.description;

  classcontainer.appendChild(description);

  let ratingcontainer = document.createElement("div")
  ratingcontainer.classList.add("classratingcontainer");

  let rank = "#" + (metrics[sorting].indexOf(classy) + 1);

  if(classy.rating[sorting] == 0){
    ratingcontainer.classList.add("classratingcontainerinvalid")
    rank = "N/A";
  }

  let ranktext = document.createElement("p");
  ranktext.innerHTML = rank + " " + sorting;
  ranktext.classList.add("classrating");

  ratingcontainer.appendChild(ranktext);

  let classreviewcontainer = document.createElement("div");
  classreviewcontainer.classList.add("classreviewcontainer");

  let classreview = document.createElement("div");
  classreview.classList.add("classreviewinside")
  classreview.style.width = (classy.rating[sorting]*100) +"%";

  classreviewcontainer.appendChild(classreview);
  ratingcontainer.appendChild(classreviewcontainer);
  classcontainer.appendChild(ratingcontainer);

  let classtagscontainer = document.createElement("div");
  classtagscontainer.classList.add("classtagscontainer");

  for(var i = 0; i < classy.tags.length; i++){

    let classtag = document.createElement("p");
    classtag.classList.add("classtag");
    classtag.innerHTML = classy.tags[i];
    classtagscontainer.appendChild(classtag)

  }

  classcontainer.appendChild(classtagscontainer);

  classcontainer.onclick = () => {


    classopen = classy.id;


    socket.emit("getdesc", classy.id)

    showclassdesc();



    let classreviews = document.getElementById("classreviews");

    let classdescname = document.getElementById("classdescname");
    classdescname.innerHTML = classy.name;

    let classdescdesc = document.getElementById("classdescdesc");
    classdescdesc.innerHTML = classy.description;

    let ratings = classy.rating;

    let keys = Object.keys(ratings);

    classreviews.innerHTML = "";

    for(var i = 0; i < keys.length; i++){

      let review = reviewsection({

        type: keys[i],
        rating: ratings[keys[i]]

      }, classy)

      classreviews.appendChild(review);



    }


    let commentcontainer = document.getElementById("usercommentscontainer");

    commentcontainer.innerHTML = "";

  }

  return classcontainer;



}


let metrics = {

};

function makesortedlist(classlist){

  let keys = ratings;

  metrics["Overall"] = [...classlist];
  metrics["Overall"].sort((a,b) => {

    let sum = 0;
    let sumlength = 0;

    let sum2 = 0;
    let sum2length = 0;

    for(var i = 0; i < keys.length; i++){

      if(a.rating[keys[i]] > 0){
        sumlength++;
      }

      if(b.rating[keys[i]] > 0){
        sum2length++;
      }

    }

    sum = a.rating["Enjoyment"];
    if(a.rating["Difficulty"] > 0) sum += (1 - a.rating["Difficulty"])
    if(a.rating["Work"] > 0) sum += (1 - a.rating["Work"])
    sum += a.rating["Useful"]

    if(sum > 0){
      sum /= sumlength;
    }
    a.rating["Overall"] = sum

    if(sum2 > 0){
      sum2 /= sum2length;
    }
    b.rating["Overall"] = sum2


    return -sum + sum2;

  })

  for(var i = 0; i < keys.length; i++){

    metrics[keys[i]] = [...classlist];

    let num = i;

    metrics[keys[i]].sort((a,b) => {



      return -a.rating[keys[num]] + b.rating[keys[num]];

    })

  }

}


let classbuttons = [];

let searchstring = "";

let classtags = [];

function classlistinit(){

  initclasstags()

}


function initclasstags(){

  let tagbuttons = document.getElementsByClassName("tagbutton");

  for(var i = 0; i < tagbuttons.length; i++){

    if(tagbuttons[i].checked){

      classtags.push(tagbuttons[i].value);

    }

  }

  let sortings = document.getElementsByClassName("sortingbutton");

  for(var i = 0; i < sortings.length; i++){

    if(sortings[i].checked){
      sortingmetric = sortings[i].value;
    }

  }

  console.log(classtags);


}

function classsettag(event){

  console.log(event.target.checked);

  if(event.target.checked){
    classtags.push(event.target.value);
  }
  else{

    let newarr = [];
    for(var i =0 ; i < classtags.length; i++){
      if(classtags[i] != event.target.value){

        console.log(classtags[i]);

        newarr.push(classtags[i]);
      }
    }
    classtags = newarr;

  }

  console.log(classtags);

  makeclasslist();


}

function changesorting(event){

  console.log(event.target, event.target.value);

  sortingmetric = event.target.value;

  makeclasslist(sortingmetric);



}

function searchclassinput(event){

  searchstring = event.target.value;
  makeclasslist(sortingmetric);

}

function makeclasslist(){


  let allclasses = document.getElementById("classes");

  let classarray = [];



  allclasses.innerHTML = "";


  L: for(var i = 0; i < metrics[sortingmetric].length; i++){

    if(searchstring != "" && metrics[sortingmetric][i].name.toLowerCase().includes(searchstring.toLowerCase()) == false) continue;

    if(classtags.length == 0) break;

    for(var j = 0; j < classtags.length; j++){

      if(metrics[sortingmetric][i].tags.indexOf(classtags[j]) != -1){
        break;
      }

      if(j == classtags.length - 1) continue L;

    }


    let button = makeclassbutton(metrics[sortingmetric][i], sortingmetric)
    classbuttons.push(button);

    allclasses.appendChild( button );

  }


}
