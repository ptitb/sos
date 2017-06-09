// require('dotenv').config();

// const express = require('express');
// const app = express();
// const path = require('path');
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
// const VoiceResponse = require('twilio').twiml.VoiceResponse;
// const urlencoded = require('body-parser').urlencoded;

// // check NODE_ENV environment variable
// var devMode = app.get('env') === 'development';

// // Have the server serve the dist / production version or the development version
// var rootFolder = devMode? '.' : 'dist';
// app.use(express.static(rootFolder));

// // Parse incoming POST params with Express middleware
// app.use(urlencoded({extended: false}));

// app.post('/voice', (req, res) => {
//   // Get information about the incoming call, like the city associated
//   // with the phone number (if Twilio can discover it)
//   const city = request.body.FromCity;

//   // Use the Twilio Node.js SDK to build an XML response
//   const twiml = new VoiceResponse();
//   twiml.say({voice: 'alice'},
//     `Never gonna give you up ${city}.`
//   );
//   twiml.play({}, 'https://demo.twilio.com/docs/classic.mp3');

//   // Render the response as XML in reply to the webhook request
//   response.type('text/xml');
//   response.send(twiml.toString());
// });

// // Have all other routes forward to regular front end
// const indexPath = path.join(__dirname, `../${devMode? '' : 'dist/'}index.html`);
// app.get('/*', function(req, res) {
//   res.sendFile(indexPath);
// });

// const listener = http.listen(process.env.PORT|3000, function () {
//   console.log('SOS app listening on ', listener.address().port);
// });

/**
 * Play Spinvis
 */

// const express = require('express');
// const VoiceResponse = require('twilio').twiml.VoiceResponse;
// const urlencoded = require('body-parser').urlencoded;

// const app = express();

// // Parse incoming POST params with Express middleware
// app.use(urlencoded({extended: false}));

// // Create a route that will handle Twilio webhook requests, sent as an
// // HTTP POST to /voice in our application
// app.post('/voice', (request, response) => {
//   // Get information about the incoming call, like the city associated
//   // with the phone number (if Twilio can discover it)
//   const city = request.body.FromCity;

//   // Use the Twilio Node.js SDK to build an XML response
//   const twiml = new VoiceResponse();
//   twiml.say({voice: 'alice', language: 'nl-NL'},
//     `Dit vind ik wel een fijn nummertje, Paul en Anne-Marie ${city}.`
//   );
//   twiml.play({}, 'http://vanderwe.sssss.st/sos/mp3/Spinvis-Bagagedrager.mp3');
//   // twiml.play({}, 'http://vanderwest.cc/sos/mp3/Spinvis-Bagagedrager.mp3');

//   // Render the response as XML in reply to the webhook request
//   response.type('text/xml');
//   response.send(twiml.toString());
// });

// // Create an HTTP server and listen for requests on port 3000
// app.listen(3000);


const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;

const app = express();

// Parse incoming POST params with Express middleware
app.use(urlencoded({extended: false}));

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
app.post('/voice', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    numDigits: 1,
    action: '/gather',
  });
  gather.say('For Peter, press 1. For Julius, press 2.');

  // If the user doesn't enter input, loop
  twiml.redirect('/voice');

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

// Create a route that will handle <Gather> input
app.post('/gather', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();

  // If the user entered digits, process their request
  if (request.body.Digits) {
    switch (request.body.Digits) {
      case '1':
      twiml.redirect('/peter');
        break;
      case '2':
      twiml.redirect('/julius');
        break;
      default:
        twiml.say('Sorry, I don\'t understand that choice.').pause();
        twiml.redirect('/voice');
        break;
    }
  } else {
    // If no input was sent, redirect to the /voice route
    twiml.redirect('/voice');
  }

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

app.post('/peter', (request, response) => {
  const twiml = new VoiceResponse();
  // Use the Twilio Node.js SDK to build an XML response
  twiml.say({voice: 'alice', language: 'nl-NL'},
    `Dit vind Peter een fijn nummertje.`
  );
  twiml.play({}, 'http://vanderwest.cc/sos/mp3/Spinvis-Bagagedrager.mp3');

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});


app.post('/julius', (request, response) => {
  const twiml = new VoiceResponse();
  // Use the Twilio Node.js SDK to build an XML response
  twiml.say({voice: 'alice', language: 'nl-NL'},
    `Dit vind Julius een fijn nummertje.`
  );
  twiml.play({}, 'https://demo.twilio.com/docs/classic.mp3');
  // twiml.play({}, 'http://vanderwest.cc/sos/mp3/Spinvis-Bagagedrager.mp3');

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

// Create an HTTP server and listen for requests on port 3000
console.log('Twilio Client app HTTP server running at http://127.0.0.1:3000');
app.listen(3000);
