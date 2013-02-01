ZwazoBlue
---------

Zwazo Blue is a scheduling system written in JavaScript. It is currently under development, **do not expect a full project** at this point. [Zwazo] is French Creole for birds. It uses the following libraries:

  - [Meteor.js]
  - [leaflet]
  - [D3]
  - [Twitter Bootstrap] 
  - [MongoDB]

Quick start!
---------------
  
    curl https://install.meteor.com | /bin/sh
    git clone {proj path}
    cd ./{prog path}
    meteor add accounts-ui
    meteor add backbone
    meteor add d3
    meteor add accounts-base
    meteor

To load the database with sample data, open up the JavaScript console on the webpage, and enter:

    loadExampleData();

"Building4":"LocationD4" is the only location with timeslot data in the example.

Security
--

There is currently **no security** on this project, so any user can add / remove anything. This functionality will be restricted after the development phase is completed.
  [Zwazo]: http://en.wiktionary.org/wiki/zwazo
  [Meteor.js]: http://meteor.com/
  [leaflet]: http://leafletjs.com/
  [D3]: https://github.com/mbostock/d3/wiki/Gallery
  [Twitter Bootstrap]: http://twitter.github.com/bootstrap/
  [MongoDB]: http://www.mongodb.org/
