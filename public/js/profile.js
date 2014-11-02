var i = 0;
var title, date, month, year, host;
var attending = [{
	"image": "event2.jpg",
	"title": "Free Pancakes",
	"date": "2",
	"month": "nov",
	"year": "2014",
	"host": "david",
	"attendance": "5"
}];
var invited = [{
	"image": "user.jpg",
	"title": "Not Free Pancakes",
	"date": "2",
	"month": "nov",
	"year": "2014",
	"host": "david hasselhoff",
	"attendance": "4"
}];

function attendingEventCreate(event) {
	var newEvent = document.createElement("a");
	newEvent.className = "button";
	newEvent.setAttribute('href','event.html');
	
	var newImg = document.createElement("img");
	newImg.className = "thumbnail";
	newImg.setAttribute('src', event.image);
	newEvent.appendChild(newImg);
	
	var newP = document.createElement("event");
	var newTitle = document.createTextNode(event.title);
	newP.appendChild(newTitle);
	
	var newP2 = document.createElement("p");
	newP2.setAttribute('textAlign','left');
	newP2.setAttribute('display','inline');
	var newDate = document.createTextNode("Date: " + event.date + "/" + event.month + "/" + event.year + " || ");
	var newHost = document.createTextNode("Host: " + event.host + " || ");
	var newAtten = document.createTextNode("Attendance: " + event.attendance);
	
	newP2.appendChild(newDate);
	newP2.appendChild(newHost);
	newP2.appendChild(newAtten);
	
	newEvent.appendChild(newP);
	newEvent.appendChild(newP2);
	
	var element = document.getElementById("attend");
	element.appendChild(newEvent);
	
}


function invitedEventCreate(event) {
	var newEvent = document.createElement("a");
	newEvent.className = "button2";
	newEvent.setAttribute('href','event.html');
	
	var newImg = document.createElement("img");
	newImg.className = "thumbnail";
	newImg.setAttribute('src', event.image);
	newEvent.appendChild(newImg);
	
	var newP = document.createElement("event");
	var newTitle = document.createTextNode(event.title);
	newP.appendChild(newTitle);
	
	var newP2 = document.createElement("p");
	newP2.setAttribute('textAlign','left');
	newP2.setAttribute('display','inline');
	var newDate = document.createTextNode("Date: " + event.date + "/" + event.month + "/" + event.year + " || ");
	var newHost = document.createTextNode("Host: " + event.host + " || ");
	var newAtten = document.createTextNode("Attendance: " + event.attendance);
	
	newP2.appendChild(newDate);
	newP2.appendChild(newHost);
	newP2.appendChild(newAtten);
	
	newEvent.appendChild(newP);
	newEvent.appendChild(newP2);
	
	var element = document.getElementById("invited");
	element.appendChild(newEvent);
	
}

for(i = 0; i < attending.length; i++){
	attendingEventCreate(attending[i]);
}
for(i = 0; i < invited.length; i++){
	invitedEventCreate(invited[i]);
}

