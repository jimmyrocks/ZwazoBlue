if (Meteor.isClient) {
  Template.signin.signin = function () {
    return "Sign In!";
  };

  Template.signin.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

////// Login stuff
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});