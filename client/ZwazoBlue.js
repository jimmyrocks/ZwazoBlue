
//Buildings = new Meteor.Collection("buildings");

var menuItems = [
{name: "Map"},
{name: "Schedule"},
{name: "Help"},
{name: "Contact"}
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
