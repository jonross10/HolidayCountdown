'use strict';

const Alexa = require('alexa-sdk');
var https = require('https');
var request = require('request');
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

const HolidayFunctions = require('./functions/HolidayFunctions');
const VoiceConstants = require('./functions/VoiceConstants');

var alexa;


const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', VoiceConstants.WELCOME);
    },
    'HolidayCountdown': function () {
        // emit days until holiday uttered
        try{
          var holiday = this.event.request.intent.slots["holiday"]["resolutions"]["resolutionsPerAuthority"][0]["values"][0]["value"]["name"].toLowerCase();
        } catch(err){
          console.log(err);
          var holiday = this.event.request.intent.slots["holiday"]["value"].toLowerCase();
        }
        HolidayFunctions.checkAPIForHoliday(holiday);
    },
    'NextHoliday': function () {
        HolidayFunctions.getSoonestHoliday(this);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', VoiceConstants.HELP);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', VoiceConstants.GOODBYE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', VoiceConstants.GOODBYE);
    },
    'UNHANDLED': function () {
        this.emit(':tell', VoiceConstants.GOODBYE);
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', VoiceConstants.GOODBYE);
    },
    'AMAZON.FallbackIntent': function () {
        this.emit(':ask', VoiceConstants.REPHRASE);
    },
    'UNKNOWN': function () {
        this.emit(':ask', VoiceConstants.REPHRASE);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = "amzn1.ask.skill.7855b5f2-07dd-4b6d-b035-f81eae44284b"
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
};