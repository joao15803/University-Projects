
console.log("hello from external app.js");


//journal event handlers quoteLists

document.getElementById("QuoteEntries").addEventListener('click', populateEntry);
document.getElementById("deleteQuote").addEventListener('click', deleteEntry);
document.getElementById("addQuote").addEventListener('click', addEntry);
document.getElementById("uploadQuote").addEventListener('click', uploadJournal);

// initialise journal list
document.addEventListener("DOMContentLoaded", function(){
    console.log("calling getJournal")
    getQuoteEntries();
});


//utility functions 
function getUniqueKey(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};




/**
 * getQuoteEntries() - Get list of Quote entries
 *
 * Write a function that will
 * * retrieve the JSON file of Quote entries
 * * format the entries into a single string with appropriate html tags
 * * set the content of the "QuoteEntries" element to the formatted string
 */
function getQuoteEntries(){
  //console.log("getting Quote entries");
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    //console.log("xhttp ready state recieved")
    if (this.readyState == 4 && this.status == 200) { 
      //console.log("ready and OK");
      let journalResult = JSON.parse(this.responseText);
      //console.log(journalResult);
      
      let journalList = "";
      for (let item of journalResult.quoteLists) { 
        journalList = journalList + "<li dat='" + String(item.date) +  "' name='" + String(item.name) + "' note='" + String(item.note) + "' id='idGenerator" + journalResult.quoteLists.indexOf(item) + "'>" + String(item.date) + "</li>";}
     
    document.getElementById("QuoteEntries").innerHTML = journalList;
    
    }
    else{
      console.log("xhttp request problem occurred")
    }
  }
  xhttp.open("GET", "api/quoteLists", true);
  xhttp.send();
}
/**
 */

/**
 * clearEntry()
 *
 * * clear the selected entry inputs
 *
 */
function clearEntry(){
    document.getElementById("idGenerator").value = "";
    document.getElementById("automatedDate").value = "";
    document.getElementById("authorNameAdd").value = "";
    document.getElementById("txtNote").value = "";
}

/**
 * populateEntry(item)
 */
function populateEntry(e){
    //clear old entry
    clearEntry()
    //console.log("item: " + e.target);
    let itemIndex = e.target.id;
    let itemDate = e.target.getAttribute("dat");
    let itemName = e.target.getAttribute("name");
    let itemNote = e.target.getAttribute("note");
    document.getElementById("idGenerator").value = itemIndex;
    document.getElementById("automatedDate").value = itemDate;
    document.getElementById("authorNameAdd").value = itemName;
    document.getElementById("txtNote").value = itemNote;
}

/**
 * addEntry() - add a Quote entry
 */
function addEntry(){
  let uid = getUniqueKey();
  console.log("uid: " + uid)
  const dat = new Date();
  let newDate = dat.getDate() + "/" + dat.getMonth() + "/" + dat.getFullYear();
  console.log("date: " + newDate);
  let newName = document.getElementById("authorNameAdd2").value;
  let newNote = document.getElementById("txtAdd").value;
  if(newName == "" || newNote == ""){
    alert("Please enter values in the name and the notes inputs.")
  }else{
    //create new li item
    let newEntry = document.createElement('li');
    newEntry.id = uid;
    newEntry.setAttribute("dat", newDate)
    newEntry.setAttribute("name", newName);
    newEntry.setAttribute("note", newNote);
    newEntry.innerText = newDate;
    document.getElementById("QuoteEntries").appendChild(newEntry)
    alert("Quote entry added to clientsdide list. Upload to save the list.")
  }
}

/**
 * deleteEntry()
 *
 * Write a function that will
 * * delete a Quote entry (list item) from the html page
 */
function deleteEntry(){
  let idToDelete = document.getElementById("idGenerator").value; 
  if(idToDelete != ""){
    document.getElementById(idToDelete).remove(); 
    //remove deleted details from selected entry boxes
    clearEntry()
    alert("Quote entry deleted on clientside. Upload to save changes.")
  } else {
    alert("Please select an Quote entry to delete.")
  }
}

/**
 * uploadQuote()
 *
 * Write a function that will
 * * get the data from the list entries on the html page
 * * put the entries from the list into a collection
 * * convert the collection into a JSON object
 * * send JSON object to the url in the flask api
 * * and handle the response
 */
function uploadJournal(){
  //get list 
  let uploadList = document.getElementById("QuoteEntries");
  var entriesList = uploadList.getElementsByTagName("li")
  //console.log("entries no. " + entriesList.length)
  // make object to convert to JSON
  let uploadObject = {};
  uploadObject.quoteLists = [];
  //list items and put into an array of objects
  //console.log(entriesList)
  for (let i = 0; i < entriesList.length ; i++){
    //console.log("upload entry " + entriesList[i].innerHTML);
    let objEntry = {}
    objEntry.date = entriesList[i].getAttribute("dat");
    objEntry.name = entriesList[i].getAttribute("name");
    objEntry.note = entriesList[i].getAttribute("note");
    uploadObject.quoteLists.push(objEntry);
  }
  //console.log("upload Object:" + JSON.stringify(uploadObject));

  //convert object to JSON and put to api
  let xhttp = new XMLHttpRequest();
  let url = "/api/quoteLists"
  
    xhttp.onreadystatechange = function() {
      let strResponse = "Error: no response";
      if (this.readyState == 4 && this.status == 200) {
        strResponse = JSON.parse(this.responseText);
        alert(strResponse.message)
      }
      //document.getElementById(elResponse).setAttribute("value",  strResponse.result);
      
    };
    xhttp.open("PUT", url, true);
    // Converting JSON data to string
    var data = JSON.stringify(uploadObject)
    // Set the request header i.e. which type of content you are sending
    xhttp.setRequestHeader("Content-Type", "application/json");
    //send it
    xhttp.send(data);

}


//random Quote
let RandomQuote = document.getElementById('RandomQuote');
console.log(RandomQuote)
let output = document.getElementById('output');
let quote = ['"I have always believed that each man makes his own happiness and is responsible for his own problems. It is a simple philosophy." Ray Kroc','When we have respect for ourselves and others, we gravitate towards connections that encourage that. Simeon Lindstrom','Keep Going, Life gets better','Anger is the ultimate destroyer of your own peace of mind. Dalai Lama','A man should have the aim and the determination to be honest and upright and sincere in all that he undertakes. If he adds persistency to this he can hardly help being successful L. R. Ellert', 'The fact is that grief today is a family matter as much a s it is an individual one. Barbara Okun', 'Memories, pressed between the pages of my mind. Memories, sweetened through the ages just like wine. Elvis Presley','Appreciate the bad times, so when you get to the good ones its even better','Nothing is more worth the family, and the good about family is that its not always about blood', ]

RandomQuote.addEventListener('click', function(){
  var randQuote = quote[Math.floor(Math.random() * quote.length)];
  console.log(randQuote);
  output.innerHTML = randQuote;
} )                          

function quoteAdd() {
  let person = prompt("Please Enter your Quote to Submit", "Enter Quote Here");
  if (person != null) {
    document.getElementById("demo").innerHTML =
    "Hello " + person + "! How are you today?";
  }
}

function showMyQuotes() {
  var OnAndOff = document.getElementById("showingQuote");
  if (OnAndOff.style.display === "none") {
    OnAndOff.style.display = "block";
  } else {
    OnAndOff.style.display = "none";
  }
}
function showMyQuotes2() {
  var OnAndOff2 = document.getElementById("quoteJournal");
  if (OnAndOff2.style.display === "none") {
    OnAndOff2.style.display = "block";
  } else {
    OnAndOff2.style.display = "none";
  }
}
function QuotesGallery2() {
  var OnAndOff3 = document.getElementById("QuoteItem");
  if (OnAndOff3.style.display === "none") {
    OnAndOff3.style.display = "block";
  } else {
    OnAndOff3.style.display = "none";
  }
}
