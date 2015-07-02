function barHeight() {
  return Math.ceil($('.LeftContent').height() * Session.get('counter') / 100);
}

function updateActivity() {
  var height = barHeight();
  $('.ActivityBar').animate({
    height: ($('.LeftContent').height() - height)+"px"
  }, 100);
  $('.ActivityBarFill').animate({
    height: height + "px"
  }, 100);
}

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Session.setDefault('sliderx', 0);

  // all settings enabled by default for now
  Session.setDefault('alarmUseSound', true);
  Session.setDefault('alarmUseVibration', true);
  Session.setDefault('alarmUseLight', true);

  Meteor.startup(function () {
    updateActivity();
  });

  Template.stats.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.step.events({
    'click': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
      updateActivity();
    }
  });

  Template.dragelement.events({
    'click': function(){
    },
    'touchstart': function(){
    },
    'touchend': function(){

    },
    'touchmove': function(e){
      e.stopPropagation();
      e.preventDefault();
      var currentY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
      if(currentY<($('.LeftContent').height()) && currentY>($('.LeftContent').height()/20)){
        $('#slider').animate({
          top: currentY-($('.LeftContent').height()/20)+"px"
        }, 0);
      }
    }
  });

  Template.body.helpers({
    // Data context for alarm settings buttons:
    alarmSettings: [
      { type: 'Sound',
        icon_enabled: 'volume_up',
        icon_disabled: 'volume_off' },

      { type: 'Vibration',
        icon_enabled: 'alarm_on',
        icon_disabled: 'alarm_off' },

      { type: 'Light',
        icon_enabled: 'phonelink_ring',
        icon_disabled: 'phonelink_erase' }
    ]
  });

  //---------------------------
  // Quick settings buttons
  //---------------------------
  Template.alarmSettingBtn.events({
    'click': function () {
      Session.set('alarmUse' + this.type, !Session.get('alarmUse' + this.type));
    }
  });

  Template.alarmSettingBtn.helpers({
    'state': function() {
      if (Session.get('alarmUse' + this.type)) {
        return '';
      } else {
        return 'disabled';
      }
    },
    'icon': function() {
      if (Session.get('alarmUse' + this.type)) {
        return this.icon_enabled;
      } else {
        return this.icon_disabled;
      }
    }
  });
}
