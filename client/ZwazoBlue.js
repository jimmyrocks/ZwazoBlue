
//Buildings = new Meteor.Collection("buildings");

var menuItems = [
{name: "Map", admin: "false"},
{name: "Schedule", admin: "false"},
{name: "Help", admin: "false"},
{name: "Contact", admin: "false"},
{name: "Admin", admin: "true"}
];



if (Meteor.isClient) {


    Template.main.header = function () {
        var header = "<h1>test</h1>";
        return header;
    };
    Template.main.signin = function () {
        return "Sign In!";
    };
    Template.header.menuItems = function() {
        return menuItems;
    };
    Template.header.active = function() {
        return Session.equals('mode', this.name) ? 'active' : '';
    };

    Template.content.display = function() {
        var mode = "welcome";
        if (Meteor.userId()) {
            if (Session.get("mode")) {
                if (Template[Session.get("mode").toLowerCase()]) {
                    mode = Session.get("mode").toLowerCase();
                }
            }
        } else {
            mode = "signin";
        }
        return Template[mode]();
    };


    /////////////////////////////////////////////////////////////////////////////////////////
    // Calendar functions //
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////

    Template.building_dropdown.buildingName = function() {
        return Buildings.find(
                {approved:"true"},
                {sort: {name: 1}}
                );
    };
    Template.building_dropdown.selected = function(a) {
        return Session.equals('buildingList', this.name) ? 'selected' : '';
    };
    Template.location_dropdown.locationName = function() {
        return Locations.find(
                {
                    approved:"true",
               building: (Session.get("buildingList")? Session.get("buildingList") : "")
                }, {
                    sort: {name: 1}
                }
                );
    };
    Template.location_dropdown.disabled = function() {
        return Session.get("buildingList") ? "" : "disabled='disabled'";
    };
    Template.location_dropdown.selected = function(a) {
        return Session.equals('locationList', this.name) ? 'selected' : '';
    };
    Template.show_calendar.disabled = function() {
        return Session.get("locationList") ? "" : "disabled='disabled'";
    };
    Template.show_calendar.selectedLocation = function() {
        return Session.get("buildingList") + ": " + Session.get("locationList");
    };
    Template.show_calendar.selectedDescription = function() {
        var query = Locations.findOne({
            approved:"true",
            building: (Session.get("buildingList")? Session.get("buildingList") : ""),
            name:     (Session.get("locationList")? Session.get("locationList") : "")
        }, {});
        var description = query && query.description ? query.description : "";
        return description;
    };
    
    Template.show_calendar.availableDays = function() {
        return calendarTools.distinctDays(getCalendarData());;
    };
    Template.show_calendar.availableTimes = function() {
        var locationId = (Session.get("locationList")? Session.get("locationList") : "");
        var timeslots = TimeSlots.find({"locationId": locationId}).fetch();
        return calendarTools.distinctTimes(getCalendarData());;
    };

    Template.show_calendar.availableSlot = function() {
        var returnValue = "";

		// Define the queries
        var locationId = (Session.get("locationList")? Session.get("locationList") : "");
        var locationQuery = {"locationId" : locationId};
        return calendarTools.drawSlots(locationQuery, this.startTimeDate, this.endTimeDate, calendarTools.drawButton, calendarTools.distinctDays(getCalendarData()));
    };
    
    // Non template functions

    var setSelection = function(dropdownBox) {
        var sessionElement = dropdownBox.id;
        var sessionValue = dropdownBox.value;

        if (dropdownBox.selectedIndex > 0) {
            Session.set(sessionElement, sessionValue);
        } else {
            Session.set(sessionElement, "");
        }

        // There will probably be some cool map logic in here too!

    };

    var getCalendarData = function() {
        var locationId = (Session.get("locationList")? Session.get("locationList") : "");
        var timeslots = TimeSlots.find({"locationId": locationId}).fetch();
        return timeslots;
    };

    var toggleCalendarButton = function (obj) {
        var classes = obj.getAttribute("class").split(" ");
        var activeWhenClicked = false;
        var timeSlotId = obj.hasAttribute("slot_id") ? obj.getAttribute("slot_id") : "";
        var calendarId = obj.hasAttribute("calendar_id") ? obj.getAttribute("calendar_id") : "";

        for (var i=0; i<classes.length; i++) {
            if (classes[i] === "active") {
                activeWhenClicked = true;
            }
        }

        if (activeWhenClicked) {
            //remove the user's calendar entry for this
            Calendar.remove({"timeSlot_id": timeSlotId, "user_id" : userId});
        } else {
            //add a record to the user's calendar for this slot_id
            var a = Calendar.insert({"timeSlot_id": timeSlotId, "user_id" : userId});
        }

    };

    var modalCalendar =  function() {
        return {
            hide: function() { Session.set("calendar_displayed","false"); },
            show: function() { Session.set("calendar_displayed","true"); }
        };
    }();

    Template.map.modal_calendar = function () {
        if (Session.equals("calendar_displayed","true")) {
            return Template.show_calendar();
        } else {
            return "";
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////

	// Schedule Page
	
	var getUserScheduleData = function() {
        var calendar = Calendar.find({"user_id": userId}).fetch();
        var timeslots = [];

        for (var k=0; k<calendar.length; k++) {
            if (calendar[k].timeSlot_id) {
                timeslots.push(TimeSlots.findOne({"_id": calendar[k].timeSlot_id}));
            }
        }
        return timeslots;
	};
	
    Template.schedule.availableDays = function() {
        return calendarTools.distinctDays(getUserScheduleData());
    };
    
    Template.schedule.availableTimes = function() {
        return calendarTools.distinctTimes(getUserScheduleData());
    };
    
    Template.schedule.availableSlot = function() {
        var returnValue = "";
		// Define the queries
        var userQuery = {};//{"user_id" : userId};
        return calendarTools.drawSlots(userQuery, this.startTimeDate, this.endTimeDate, calendarTools.drawScheduleTable, calendarTools.distinctDays(getUserScheduleData()));
    };
    
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    
    ////////// Functions
    
	var calendarTools = function() {
    var distinctDays = function(timeslots) {
        var availableDays = [];
        var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

            for (var i=0; i<timeslots.length; i++) {
            var record = {};
            var newEntry = true;
            var curTimeSlot = timeslots[i];
            record.startTime = new Date(timeslots[i].startTime);
            record.day = days[record.startTime.getDay()];
            record.date = [record.startTime.getMonth()]+"/"+[record.startTime.getDate()];
            for (var j=0; j<availableDays.length; j++) {
                if (availableDays[j] &&
                        availableDays[j].startTime &&
                        availableDays[j].startTime.getDate() === record.startTime.getDate() &&
                        availableDays[j].startTime.getMonth() === record.startTime.getMonth() &&
                        availableDays[j].startTime.getFullYear() === record.startTime.getFullYear()
                   ) {
                       newEntry = false;
                   }
            }
            if (newEntry) {
                availableDays.push(record);
            }
        }
        return availableDays;
    };
    
    var distinctTimes = function(timeslots) {
            var availableTimes = [];

        for (var i=0; i<timeslots.length; i++) {
            var record = {};
            var newEntry = true;
            var curTimeSlot = timeslots[i];
            record.startTimeDate = new Date(timeslots[i].startTime);
            record.endTimeDate =new Date(timeslots[i].endTime);
            record.startTime = toTime(record.startTimeDate);
            record.endTime = toTime(record.endTimeDate);
            for (var j=0; j<availableTimes.length; j++) {
                if (availableTimes[j] &&
                        availableTimes[j].startTimeDate &&
                        availableTimes[j].endTimeDate &&
                        availableTimes[j].startTimeDate.getHours() === record.startTimeDate.getHours() &&
                        availableTimes[j].startTimeDate.getMinutes() === record.startTimeDate.getMinutes() &&
                        availableTimes[j].endTimeDate.getHours() === record.endTimeDate.getHours() &&
                        availableTimes[j].endTimeDate.getMinutes() === record.endTimeDate.getMinutes()
                   ) {
                       newEntry = false;
                   }
            }
            if (newEntry) {
                availableTimes.push(record);
            }
        }
        
        return availableTimes;
    };
    
	var drawSlots = function(query, startTimeRaw, endTimeRaw, drawFunction, availableDays) {
		var returnValue = ""
        var slotStartDate = new Date(startTimeRaw.getTime());
        var slotEndDate = new Date(endTimeRaw.getTime());

		// Loop through all the days

        for (var i=0; i<availableDays.length; i++) {

			// Create a new time from the column and row headers
            var columnDay = availableDays[i].startTime;
            slotStartDate.setMonth(columnDay.getMonth());
            slotStartDate.setFullYear(columnDay.getFullYear());
            slotStartDate.setDate(columnDay.getDate());
            slotEndDate.setMonth(columnDay.getMonth());
            slotEndDate.setFullYear(columnDay.getFullYear());
            slotEndDate.setDate(columnDay.getDate());
            
            // Create the base query
            var slotQuery = {
            	"endTime": slotEndDate,
            	"startTime": slotStartDate
            };
            
            // Add parameters to the query
            for (key in query) {
            	if (query.hasOwnProperty(key)) {
	            	slotQuery[key] = query[key];
	            };
            }
			// Run another query to mongo
            var currentSlot = TimeSlots.findOne(slotQuery);
            
            // Build the table entry
            returnValue += drawFunction(currentSlot);
        }
        return returnValue;
    }

	var drawButton = function (currentSlot) {    
            // Build the button
            var returnValue = "";
            if (currentSlot) {
                var remaining = Calendar.find({"timeSlot_id": currentSlot._id}).fetch().length;
                var userSelected = Calendar.findOne({"timeSlot_id": currentSlot._id, "user_id" : userId});
                var classes = ['btn', 'btn-small'];
                var colorClass = "btn-primary";
                var outerDiv = document.createElement("div");
                var button = document.createElement("button");
                button.setAttribute("slot_id", currentSlot._id);
                button.setAttribute("onclick", "toggleCalendarButton(this);");
                if (remaining >= currentSlot.available) {
                    if (!userSelected) {button.setAttribute("disabled", "disabled");}
                    colorClass = "btn-danger";
                }
                if (userSelected) {
                    classes.push("active");
                    colorClass = "btn-success";
                    button.setAttribute("calendar_id", userSelected._id);
                }
                classes.push(colorClass);
                button.setAttribute("class", classes.join(" "));
                button.textContent = "[" + remaining + "/" + currentSlot.available + "]";
                outerDiv.appendChild(button);

                returnValue += outerDiv.innerHTML;
            }
            return "<td>" + returnValue + "</td>";
        };
        
	var drawScheduleTable = function (currentSlot) {    
            // Build the button
            var returnValue = "";
            if (currentSlot) {
            	var location = Locations.findOne({"name" : currentSlot.locationId});
            	var building = Buildings.findOne({"name": location.building});
                var userSelected = Calendar.findOne({"timeSlot_id": currentSlot._id, "user_id" : userId});
                var outerDiv = document.createElement("div");
                var displayField = document.createElement("div");
                var styles = ["-moz-border-radius: 15px", "border-radius: 15px", "text-align: center"]; // Should be in the stylesheet
                var color = "";
                
                if (userSelected) {
                    styles.push("background-color: #afa");
                    displayField.innerText = building.name + ": " + location.name;
	                displayField.setAttribute("onclick", "console.log('" + currentSlot._id+ "');" );
                }
                displayField.setAttribute("style", styles.join("; "));
                outerDiv.appendChild(displayField);

                returnValue = outerDiv.innerHTML;
            }
            return "<td>" + returnValue + "</td>";
        };
    
        var toTime = function(dateField) {
            var hours24 = false;
            var returnValue = {
                hours: dateField.getHours(),
                minutes: dateField.getMinutes(),
                ampm: ""
            };

            if (returnValue.minutes < 10) {
                returnValue.minutes = "0" + returnValue.minutes;
            }

            if (!hours24) {
                returnValue.hours =  returnValue.hours % 12;
                returnValue.ampm = (returnValue.hours >= 11) ? "am" : "pm";
                if (returnValue.hours === 0) {
                    returnValue.hours = 12;
                }
            }

            return returnValue.hours + ":" + returnValue.minutes + returnValue.ampm;
        };
        return {
        	toTime: function(dateField) {return toTime(dateField);},
        	distinctTimes: function(tileslots) {return distinctTimes(tileslots);},
        	distinctDays: function(tileslots) {return distinctDays(tileslots);},
        	drawSlots: function(query, startTimeRaw, endTimeRaw, drawFunction, availableDays) {
        		return drawSlots(query, startTimeRaw, endTimeRaw, drawFunction, availableDays);
        	},
        	drawButton: function (currentSlot) {return drawButton(currentSlot);},
        	drawScheduleTable: function (currentSlot) {return drawScheduleTable(currentSlot);}
        };
    }();


}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
        /*
           Meteor.publish("directory", function () {
           return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
           });

           Meteor.publish("buildings", function () {
           return buildings.find({});
           });
           */

        Meteor.startup(function () {
        });
    });
}

////// Login stuff
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});

// Mustache stuff
var brand = {
    logoBlack: "<span class='logoAB'>Zwazo</span><span class='logoBB'>Blue</span>",
    logoWhite: "<span class='logoAW'>Zwazo</span><span class='logoBW'>Blue</span>"
};

Handlebars.registerHelper("brandLogoBlack",function () {
    return new Handlebars.SafeString(brand.logoBlack);
});
Handlebars.registerHelper("brandLogoWhite",function () {
    return new Handlebars.SafeString(brand.logoWhite);
});
