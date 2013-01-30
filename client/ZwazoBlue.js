
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
        //return "This is a great place near 4th and main or something";
        var query = Locations.findOne({
            approved:"true",
            building: (Session.get("buildingList")? Session.get("buildingList") : ""),
            name:     (Session.get("locationList")? Session.get("locationList") : "")
        }, {});
        var description = query && query.description ? query.description : "";
        return description;
    };
    Template.show_calendar.availableDays = function() {
        var locationId = (Session.get("locationList")? Session.get("locationList") : "");
        var timeslots = TimeSlots.find({"locationId": locationId}).fetch();
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
    Template.show_calendar.availableTimes = function() {
        var locationId = (Session.get("locationList")? Session.get("locationList") : "");
        var timeslots = TimeSlots.find({"locationId": locationId}).fetch();
        var availableTimes = [];

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

    Template.show_calendar.availableSlot = function() {
        //This is going to be a mess!
        returnValue = "";
        var availableDays = Template.show_calendar.availableDays();
        var locationId = (Session.get("locationList")? Session.get("locationList") : "");
        for (var i=0; i<availableDays.length; i++) {
            //I should do a template for this
            var columnDay = availableDays[i].startTime;
            var slotStartDate = new Date(this.startTimeDate.getTime());
            var slotEndDate = new Date(this.endTimeDate.getTime());
            slotStartDate.setMonth(columnDay.getMonth());
            slotStartDate.setFullYear(columnDay.getFullYear());
            slotStartDate.setDate(columnDay.getDate());
            slotEndDate.setMonth(columnDay.getMonth());
            slotEndDate.setFullYear(columnDay.getFullYear());
            slotEndDate.setDate(columnDay.getDate());

            var currentSlot = TimeSlots.findOne({
                "locationId": locationId,
                "startTime": slotStartDate,
                "endTime": slotEndDate
            });
            returnValue += "<td>";
            if (currentSlot) {
                var remaining = Calendar.find({"timeSlot_id": currentSlot._id}).fetch().length;
                var userSelected = Calendar.findOne({"timeSlot_id": currentSlot._id, "user_id" : userId});
                var classes = ['btn', 'btn-small'];
                var colorClass = "btn-primary";
                var outerDiv = document.createElement("div");
                var button = document.createElement("button");
                // Probably will remove this item
                //
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
            returnValue += "</td>";
        }
        return returnValue;
    };

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

    Template.schedule.availableDays = function() {
        var calendar = Calendar.find({"user_id": userId}).fetch();
        var timeslots = [];
        var availableDays = [];
        var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        for (var k=0; k<calendar.length; k++) {
            if (calendar[k].timeSlot_id) {
                timeslots.push(TimeSlots.findOne({"_id": calendar[k].timeSlot_id}));
                console.log(timeslots);
            }
        }

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
