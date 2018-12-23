//update clock, current room shifts, and weekly shift view every second
//called initially when body loads
function updateDashboard() {   
    
    var date = getDate(new Date());
  
    //****** TESTING ************
    //uncomment to manipulate date 
		//just changin month, day, and hour will change colors and shifts, 
		//but need to change all to get correct day names and time displayed
    //****************************
//    date.month = 11;
//    date.day = 18;
//    date.hour = 7;
//		date.hour12 = 7;
//		date.minute = 0;
//		date.fullMinute = "00";
//		date.dayOfWeek = 2;
//		date.dayName = "Tuesday";
	
		
    updateClock(date);  
    updateRoomShifts(date);
		updateWeekShifts(date);   
    
    //call again for continuous updates
    setTimeout(updateDashboard, 100);  
}



//return JSON object with date attributes and extra formatted versions
function getDate(fullDate) {

		var date = new Date(fullDate); 
		var month = date.getMonth();
		var day = date.getDate();
		var year = date.getFullYear();
		var dayOfWeek = date.getDay();
		var second = date.getSeconds();


		var hour = date.getHours();
		var minute = date.getMinutes();


		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


	//get full months and days of week
		var fullMonth = months[date.getMonth()];
		var dayName = daysOfWeek[date.getDay()];
	
		var hour12 = hour;
		var fullMinute = minute;
		
  //format hour to 12-hour clock
  if (hour > 12){
     hour12 -= 12;
  }
		
	//format minute to 2 digits
  if (minute < 10){
     fullMinute = "0" + minute;
  }

    var newDate = {
      "month": month,
			"fullMonth": fullMonth,
      "day": day,
			"dayName": dayName, 
			"dayOfWeek": dayOfWeek,
      "year" : year,
      "hour": hour,
			"hour12": hour12,
      "minute": minute,
			"fullMinute": fullMinute,
      "second": second
    }
    
    return newDate;
}


//update calendar and clock
function updateClock(date){
  
		//set date
		document.getElementById("date").innerHTML = date.dayName + ", " + date.fullMonth + " " + date.day + ", " + date.year ;

		//set time
		document.getElementById("time").innerHTML = date.hour12 + ":" + date.fullMinute;
}


function getShifts(date){
		
		var shifts = {};
		
		//get number day of the year 
    //using args for when date is overriden for testing
    var today = new Date(date.year, date.month, date.day, date.hour);
    var jan1 = new Date(date.year, 0, 1);
    var daysSinceJan1 = Math.ceil((today - jan1)/(1000*60*60*24));
		
		//determine room shifts for given day
    if(daysSinceJan1 % 2 === 1){
        shifts.room1 = "shiftA";
				shifts.room2am = "shiftA";
        shifts.room2pm = "shiftB";				
    } else {
        shifts.room1 = "shiftB";
				shifts.room2am = "shiftC";
        shifts.room2pm = "shiftD";
    }
  
 		return shifts;		
}

//update large view of current shifts in Room 1 and Room 2
function updateRoomShifts(date){
		
		var shifts = getShifts(date);
		
		//not open on weekends or outside of hours
		if(date.dayOfWeek === 0 || date.dayOfWeek === 6 ||
			date.hour < 7 || ( date.hour >= 17 && date.minute > 30)){
				//set both room shifts to empty
				document.getElementById("room1").className = "room shiftX";
				document.getElementById("room1").innerHTML = "<h2>Room 1</h2><h2 class='letter'></h2>";
				
				document.getElementById("room2").className = "room shiftX";
				document.getElementById("room2").innerHTML = "<h2>Room 2</h2><h2 class='letter'></h2>"
		}
	
		//display current shift when open
		else{
				//set room 1 shift 
				document.getElementById("room1").className = "room " + shifts.room1;
				document.getElementById("room1").innerHTML = "<h2>Room 1</h2><h2 class='letter'>" + shifts.room1[5] + "</h2>";

				//set room 2 current shift based on time
				if(date.hour < 12) {
					document.getElementById("room2").className = "room " + shifts.room2am;
					document.getElementById("room2").innerHTML = "<h2>Room 2</h2><h2 class='letter'>" + shifts.room2am[5] + "</h2>";
				} else {
					document.getElementById("room2").className = "room " + shifts.room2pm;
					document.getElementById("room2").innerHTML = "<h2>Room 2</h2><h2 class='letter'>" + shifts.room2pm[5] + "</h2>";
				}		
		}
}


function updateWeekShifts(today){
		
		//find Monday relative to current day to always iterate M - F
		var monday =  1 - today.dayOfWeek;
		
		//set shifts for M - F in weekly view
		for(var i=0; i<5; i++){
				var day = (new Date(today.year,today.month, today.day, today.hour)) * 1 + (monday + i) * (1000*60*60*24);
				var date = getDate(day);
				var shifts = getShifts(date);
				
				//set day number 
				document.getElementsByClassName("dayName")[i].innerHTML = date.day + " " + date.dayName;
				
				//set shift for each time block
				var room1Days = document.getElementsByClassName("room1Day");
				var room2Shifts = document.getElementsByClassName("room2Shift");
		
				room1Days[i].className = "room1Day " + shifts.room1;
				room2Shifts[2*i].className = "room2Shift " + shifts.room2am; 
				room2Shifts[2*i + 1].className = "room2Shift " + shifts.room2pm; 
				
				//highlight current day
				if((monday + i) === 0) {
						document.getElementsByClassName("weekday")[i].className = "col weekday " + "today";
				} else {
						document.getElementsByClassName("weekday")[i].className = "col weekday";
				}
				
		}
}