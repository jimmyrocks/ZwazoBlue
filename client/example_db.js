/* ////////////////////
// Buildings
Buildings.remove({});
var tempDB = [
{name: "Building1", approved: "true"},
{name: "Building2", approved: "true"},
{name: "Building3", approved: "true"},
{name: "Building4", approved: "true"},
{name: "Building5", approved: "true"},
{name: "Building6", approved: "false"},
{name: "Building7", approved: "true"}
];
for (var i = 0; i<tempDB.length; i++) {
    Buildings.insert(tempDB[i]);
}
Buildings.find().fetch();

/////////////////////
// Locations
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
{building: "Building4", approved: "true", name: "LocationD4", description: "On the sea!"}
];
for (var i = 0; i<tempDB.length; i++) {
    Locations.insert(tempDB[i]);
}
Locations.find().fetch();

////////////////////////////
// Time Slots
TimeSlots.remove({});
var tempDB = [
{
    locationId: "LocationD4",
    startTime:new Date("February 2, 2013 09:00:00"),
    endTime: new Date("February 2, 2013 11:00:00"),
    available: "4",
    tmpSlotID: "1"
}, {
    locationId: "LocationD4",
    startTime:new Date("February 2, 2013 11:00:00"),
    endTime: new Date("February 2, 2013 13:00:00"),
    available: "4",
    tmpSlotID: "2"
}, {
    locationId: "LocationD4",
    startTime:new Date("February 2, 2013 13:00:00"),
    endTime: new Date("February 2, 2013 15:00:00"),
    available: "4",
    tmpSlotID: "3"
}, {
    locationId: "LocationD4",
    startTime:new Date("February 2, 2013 15:00:00"),
    endTime: new Date("February 2, 2013 17:00:00"),
    available: "4",
    tmpSlotID: "4"
}, {
    locationId: "LocationD4",
    startTime:new Date("February 3, 2013 09:00:00"),
    endTime: new Date("February 3, 2013 11:00:00"),
    available: "4",
    tmpSlotID: "5"
}, {
    locationId: "LocationD4",
    startTime:new Date("February 3, 2013 11:00:00"),
    endTime: new Date("February 3, 2013 13:00:00"),
    available: "4",
    tmpSlotID: "6"
}, {
    locationId: "LocationD4",
    startTime:new Date("February 3, 2013 13:00:00"),
    endTime: new Date("February 3, 2013 15:00:00"),
    available: "4",
    tmpSlotID: "7"
}, {
    locationId: "LocationD4",
    startTime:new Date("February 3, 2013 15:00:00"),
    endTime: new Date("February 3, 2013 17:00:00"),
    available: "4",
    tmpSlotID: "8"
}
];
for (var i = 0; i<tempDB.length; i++) {
    TimeSlots.insert(tempDB[i]);
}
TimeSlots.find().fetch();

////////////////////////////
// Calendar
Calendar.remove({});
var tempDB = [
{userId: "", timeSlotId: ""}
];
for (var i = 0; i<tempDB.length; i++) {
    Calendar.insert(tempDB[i]);
}
Calendar.find().fetch();

*/
