'use strict';

function sendSubscriptionId(sub){
  fetch('https://family1st-push.appspot.com/subscribe', {
      method: 'post',
      body: JSON.stringify({
          subid: sub.subscriptionId,
          href: window.location.href
        }),
      headers: {
        "Content-type": "application/json; charset=utf-8"
        }
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
    }).catch(function(err) {
      console.log('Fetch Error :-S', err);
    })

}

function subscribeDevice() {
  navigator.serviceWorker.ready.then(function(sw){
    sw.pushManager.subscribe()
    .then(function(sub){
      sendSubscriptionId(sub);
      //console.log(sub);
      console.log('curl --header "Authorization: key=' + 'API_KEY' +
      '" --header Content-Type:"application/json" ' + sub.endpoint +
      ' -d "{\\"registration_ids\\":[\\"' + sub.subscriptionId + '\\"]}"');
    });
  });
}

function serviceWorkerRegistration(){
  navigator.serviceWorker.register('/HTML5-Push-Notifications/sw.js').then(function(sw){
    subscribeDevice();
  });
}

window.addEventListener('DOMContentLoaded', function() {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(function(sw) {
      if(sw){
        sw.pushManager.getSubscription().then(function(sub) {
          if(sub){
            //console.log(sub);
            console.log('curl --header "Authorization: key=' + 'API_KEY' +
            '" --header Content-Type:"application/json" ' + sub.endpoint +
            ' -d "{\\"registration_ids\\":[\\"' + sub.subscriptionId + '\\"]}"');
          }else{
            serviceWorkerRegistration();
          }
        });
      }else{
        serviceWorkerRegistration();
      }
    });
  }

});
