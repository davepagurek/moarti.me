var i = 0;
var title, date, month, year, host;
var events = [{
	"img": "user.jpg",
	"title": "Free Pancakes",
	"date": "2",
	"month": "nov",
	"year": "2014",
	"host": "david hasselhoff",
	"attendance": "4"
}];

function buttonCreate(event) {
	'use strict';
	var newEvent = document.createElement("button");
	var newImg = document.createElement("img");
	newImg.setAttribute('class', 'thumbnail');
	newImg.setAttribute('src', event.img);
	newImg.appendChild(newImg);

	var newTitle = document.createTextNode(event.title + "||");
	var newDate = document.createTextNode(event.date + "/" + event.month + "/" + event.year + "||");
	var newHost = document.createTextNode(event.host + "||");
	var newAtten = document.createTextNode(event.attendance);

	newEvent.appendChild(newImg);
	newEvent.appendChild(newTitle);
	newEvent.appendChild(newDate);
	newEvent.appendChild(newAtten);
}

for(i = 0; i < events.length; i++){
	buttonCreate(events[i]);
}

