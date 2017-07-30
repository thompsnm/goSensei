var Alexa    = require('alexa-sdk');
var goSensei = require('./gosensei');

var states = {
  GAMEMODE: '_GAMEMODE',   // User is playing against the computer.
  STARTMODE: '_STARTMODE'  // Prompt the user to start or restart the game.
};

var lastMove = null;

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context, callback);
  alexa.registerHandlers(newSessionHandlers, gameModeHandlers, startGameHandlers);
  alexa.execute();
};

var newSessionHandlers = {

  // This will short-cut any incoming intent or launch requests and route them to this handler.
  'NewSession': function() {
    this.handler.state = states.STARTMODE;
    this.emit(
      ':ask',
      'Welcome to Go Sensei. Would you like to play a game of Go?',
      'Say yes to start the game or no to quit.'
    );
  }
};

var gameModeHandlers = Alexa.CreateStateHandler(states.GAMEMODE, {

  'NewSession': function () {
    this.handler.state = '';
    this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
  },

  'MoveIntent': function() {
    var move = this.event.request.intent.slots.move.value;

    console.log('user move: ' + move);
    goSensei.playerMove(move);
    console.log(goSensei.isGameOver());
    if(move == 'pass' && goSensei.isGameOver()) {
      this.emit(':tell', goSensei.reportScore());
    };

    lastMove = goSensei.computerMove()
    console.log(goSensei.isGameOver());
    if(lastMove == 'pass' && goSensei.isGameOver()) {
      this.emit(':tell', goSensei.reportScore());
    } else {
      this.emit(':ask', 'I place a stone at ' + lastMove + '. Where would you like to play? Say a coordinate like F5.', 'Where would you like to play? Say a coordinate like F5.');
    };
  },

  'AMAZON.HelpIntent': function() {
    console.log('user asked for help');
    if(lastMove) {
      this.emit(':ask', 'My last stone was placed at ' + lastMove + '. Where would you like to play? Say a coordinate like F5.', 'Where would you like to play? Say a coordinate like F5.');
    } else {
      this.emit(':ask', 'Where would you like to play? Say a coordinate like F5.', 'Where would you like to play? Say a coordinate like F5.');
    }
  },

  'SessionEndedRequest': function () {
    console.log('session ended!');
  },

  'Unhandled': function() {
    this.emit(':ask', 'Sorry, I didn\'t get that. Try saying the coordinate again.', 'Try saying the coordinate again.');
  }

});

var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {

  'NewSession': function () {
      this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },

  'AMAZON.HelpIntent': function() {
    console.log('user asked for help');
    this.emit(
      ':ask',
      'This skill will allow me to play a game of Go against you.' +
      'We will take turns saying coordinates where we would like to play stones.' +
      'You will go first and play as black.' +
      'I will go second and play as white.' +
      'We will play on a 9 by 9 board.' +
      'We will play by Japanese rules.' +
      'Komi is set at 5 and a half.' +
      'Would you like to play a game of Go?',
      'Say yes to start the game or no to quit.'
    );
  },

  'AMAZON.YesIntent': function() {
    console.log('Yes intent triggered');
    this.handler.state = states.GAMEMODE;
    this.emit(':ask', 'Great! Where would you like to play? Say a coordinate like F5.', 'Where would you like to play? Say a coordinate like F5.');
  },

  'AMAZON.NoIntent': function() {
    this.emit(':tell', 'Ok, see you next time!');
  },

  'SessionEndedRequest': function () {
    console.log('session ended!');
  },

  'Unhandled': function() {
    var message = 'Say yes to continue, or no to end the game.';
    this.emit(':ask', message, message);
  }
});
