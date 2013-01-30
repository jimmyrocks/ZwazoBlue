
//Buildings = new Meteor.Collection("buildings");

var menuItems = [
	{name: "Map", admin: "false"},
	{name: "Schedule", admin: "false"},
	{name: "Help", admin: "false"},
	{name: "Contact", admin: "false"},
	{name: "Admin", admin: "true"}
];

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
    
    Template.building_dropdown.buildingName = function() {
    /*
    	Buildings.remove({});
    	var tempDB = [
    			{name: "Building1", approved: "true"},
    			{name: "Building2", approved: "true"},
    			{name: "Building3", approved: "true"},
    			{name: "Building4", approved: "false"},
    			{name: "Building5", approved: "true"},
    			{name: "Building6", approved: "false"},
    			{name: "Building7", approved: "true"}
    		];
    	for (var i = 0; i<tempDB.length; i++) {
    		Buildings.insert(tempDB[i]);
    	}
    	Buildings.find().fetch();
	*/
	
    	return Buildings.find({approved:"true"}, {sort: {name: 1}});
    };
    Template.building_dropdown.selected = function(a) {
    	return Session.equals('selBuilding', this.name) ? 'selected' : '';
    };
    Template.location_dropdown.locationName = function() {
    /*
    	Locations.remove({});
    	var tempDB = [
    			{building: "Building1", approved: "true", name: "LocationA", description: "Great spot!"},
    			{building: "Building1", approved: "true", name: "LocationB", description: "Good View!"},
    			{building: "Building1", approved: "true", name: "LocationC", description: "Near the lake!"},
    			{building: "Building1", approved: "true", name: "LocationD", description: "On the sea!"},
    			{building: "Building2", approved: "true", name: "LocationA2", description: "Great spot!"},
    			{building: "Building2", approved: "true", name: "LocationB2", description: "Good View!"},
    			{building: "Building2", approved: "true", name: "LocationC2", description: "Near the lake!"},
    			{building: "Building2", approved: "true", name: "LocationD2", description: "On the sea!"},
    			{building: "Building3", approved: "true", name: "LocationA3", description: "Great spot!"},
    			{building: "Building3", approved: "true", name: "LocationB3", description: "Good View!"},
    			{building: "Building3", approved: "true", name: "LocationC3", description: "Near the lake!"},
    			{building: "Building3", approved: "true", name: "LocationD3", description: "On the sea!"},
    			{building: "Building4", approved: "true", name: "LocationA4", description: "Great spot!"},
    			{building: "Building4", approved: "true", name: "LocationB4", description: "Good View!"},
    			{building: "Building4", approved: "true", name: "LocationC4", description: "Near the lake!"},
    			{building: "Building4", approved: "true", name: "LocationD4", description: "On the sea!"},
    		];
    	for (var i = 0; i<tempDB.length; i++) {
    		Locations.insert(tempDB[i]);
    	}
    	Locations.find().fetch();
	*/
    	return Locations.find({approved:"true", building: (Session.get("buildingList")? Session.get("buildingList") : "")}, {sort: {name: 1}});
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
    	return [{day: "Mon", date: "1/21"},
    	{day: "Tue", date: "1/22"},
    	{day: "Wed", date: "1/23"},
    	{day: "Thu", date: "1/24"},
    	{day: "Fri", date: "1/25"}];
    };
    Template.show_calendar.availableTimes = function() {
    	return [{startTime: "9:00am", endTime: "11:00am"},
    		{startTime: "11:00am", endTime: "1:00pm"},
    		{startTime: "1:00pm", endTime: "3:00pm"},
    		{startTime: "3:00pm", endTime: "5:00pm"}];
    };
    Template.show_calendar.remaining = function() {
    	return 5;
    };
    Template.show_calendar.available = function() {
    	return 5;
    };
	Template.show_calendar.disabledCheckbox = function() {
    	return this.available >= this.remaining;
    };




/*Template.leaderboard.players = function () {
    return Buildings.find({}, {sort: {score: -1, name: 1}});
};

Template.leaderboard.selected_name = function () {
    var player = Buildings.findOne(Session.get("selected_player"));
    return player && player.name;
};

Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
};

Template.leaderboard.events({
    'click input.inc': function () {
        Buildings.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click input.del': function () {
        Buildings.remove(Session.get("selected_player"));
    }
});

Template.player.events({
    'click': function () {
        Session.set("selected_player", this._id);
    }
});
*/

}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
        Meteor.publish("directory", function () {
            return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
        });

        Meteor.publish("buildings", function () {
            return buildings.find({});
        });

        Meteor.startup(function () {
            if (Buildings.find().count() === 0) {
                var names = ["Ada Lovelace",
            "Grace Hopper",
            "Marie Curie",
            "Carl Friedrich Gauss",
            "Nikola Tesla",
            "Claude Shannon"];
        for (var i = 0; i < names.length; i++)
            Buildings.insert({name: names[i], score: Math.floor(Math.random()*10)*5});
            }
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
