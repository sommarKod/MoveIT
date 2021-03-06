  walkService = function(){
    var that = this;
    var tenMinutes = new Mongo.Collection('tenMinutes', {connection: null});
    var tenMinutesObserver = new PersistentMinimongo(tenMinutes);

    var alarmingService = new alarmService();
    var soundingService = new soundService();

    var currentActivityLevel = 23;
    var totalSteps = 0;
    var stepsSinceLevelUpdate = 1;
    var levelPerStepsThreshold = 1;
    var timeInterval = 5000;
    var updateInterval = 10000;
    var accUpdateFreq = 2000;
    // Set this to mobile specific
    var barkMobStilla = 9.75;
    var diffForMovement = 0.5;

    function updateCollection() {
        tenMinutes.insert({timestamp: new Date().getTime(), level: currentActivityLevel})
    };

    updateCollectionInterval = Meteor.setInterval(updateCollection, updateInterval);

    timeInterval = Meteor.setInterval(
        function () {
            if(currentActivityLevel > 0){
                currentActivityLevel--;
            }
            alarmingService.checkForAlarms(currentActivityLevel);
            console.log(currentActivityLevel);
            Session.set('level', currentActivityLevel);
        }, timeInterval);

    this.passToAlarm= function (vibration, sound, light) {
      alarmingService.buildAlarms(vibration, sound, light);
    };

    // Update level only if enough steps have been taken
    this.senseMovement= function () {

        stepsSinceLevelUpdate++;
        if(stepsSinceLevelUpdate >
                    levelPerStepsThreshold){
            currentActivityLevel++;
            stepsSinceLevelUpdate = 1;
            alarmingService.levelIncreased(currentActivityLevel);
        }
        console.log("senseMovement");
        Session.set('level', currentActivityLevel);
    };

    function AccSuccess(acceleration) {
        var accelerationTot=Math.sqrt( Math.pow(acceleration.x, 2)+  Math.pow(acceleration.y, 2)+ Math.pow(acceleration.z, 2));
        if( Math.abs(accelerationTot - barkMobStilla) > diffForMovement) {
          that.senseMovement();
        }
    };
    function AccError() {
    };

    var AccOptions = { frequency: accUpdateFreq };  // Update every 3 seconds
    if(Meteor.isCordova){
      document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady() {
          var watchID = navigator.accelerometer.watchAcceleration(AccSuccess, AccError, AccOptions);
      };
    }

    // return current activity level
    this.getCurrent= function () {
        console.log(currentActivityLevel);
        return currentActivityLevel;
    };
    this.sendNotification= function () {

    };
    // Clean collection, TODO: remove
    this.cleanCollection= function () {
        tenMinutes.remove({});
    }
    this.countCollection= function() {
        return tenMinutes.find().count();
    }
  }
