//
// Define the tables (ish)
//

Buildings = new Meteor.Collection("buildings");
Locations = new Meteor.Collection("locations");
TimeSlots = new Meteor.Collection("timeslots");
Calendar = new Meteor.Collection("calendar");

var standardSetup = {
    insert: function (userId, recordId) {
        //return false; // no cowboy inserts -- use createBuilding method
        return true;
    },
    update: function (userId, recordId, fields, modifier) {
        return _.all(fields, function (record) {
            var returnValue = true;
            if (userId === record.owner) { // Can we check for admin here somehow?
                returnValue =  true;
            }
            return returnValue;
        });
    },
    remove: function (userId, records) {
        /*return ! _.any(records, function (record) {
            var returnValue = true;
            if (userId === record.owner) { // Or admin?
                returnValue = true;
            }
            return returnValue;
        });*/
        return true;
    }
};

Buildings.allow(standardSetup);
Locations.allow(standardSetup);
TimeSlots.allow(standardSetup);
Calendar.allow(standardSetup); // This will be the only one anyone can modify their records in

///////////////////////////////////////////////////////////////////////////////
// Users

var displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  return null;
};   

var validateUser = function (user) {
    Meteor.users.update({"_id": user}, {"valid": "true"});
};

