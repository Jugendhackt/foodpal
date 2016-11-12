// Initialize Firebase
var config = {
  apiKey: "AIzaSyAyEf3JOtIJOTa-IB7oRb37lkHxlgrRuNg",
  authDomain: "foodpal-2c2dc.firebaseapp.com",
  databaseURL: "https://foodpal-2c2dc.firebaseio.com",
  storageBucket: "foodpal-2c2dc.appspot.com",
  messagingSenderId: "716254158440"
}

firebase.initializeApp(config)
const db = firebase.database()

$('document').ready(function() {
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const matchRef = db.ref('matches')
  matchRef.orderByChild(currentUser.country).equalTo(currentUser.username).on('child_added', function(data) {

    matchRef.child(data.key).on('value', function(data) {
      const match = data.val()

      const targetCountry = currentUser.country === 'germany' ? 'korea' : 'germany'
      db.ref('users/' + targetCountry + '/' + match[targetCountry]).once('value', function(data) {
        const matchedUser = data.val()

        $('.' + currentUser.country).append('\
        <div class="card">\
          <img class="card-img-top" src="' + currentUser.foodImage + '" alt="' + currentUser.food + '">\
          <div class="card-block">\
            <h4 class="card-title">' + currentUser.food + '</h4>\
            <p class="card-text">' + currentUser.username + '</p>\
            <p class="card-text">' + currentUser.contact + '</p>\
          </div>\
          <ul class="list-group list-group-flush">\
            <li class="list-group-item">Sent: ' + (match[currentUser.country + 'Sent']) + '</li>\
            <li class="list-group-item">Received: ' + (match[currentUser.country + 'Received']) + '</li>\
          </ul>\
          <div class="card-block">\
            <div class="btn btn-primary">Sent!</div>\
            <div class="btn btn-primary">Received!</div>\
          </div>\
        </div>\
        ')

        $('.' + matchedUser.country).append('\
        <div class="card">\
          <img class="card-img-top" src="' + matchedUser.foodImage + '" alt="' + matchedUser.food + '">\
          <div class="card-block">\
            <h4 class="card-title">' + matchedUser.food + '</h4>\
            <p class="card-text">' + matchedUser.username + '</p>\
            <p class="card-text">' + matchedUser.contact + '</p>\
          </div>\
          <ul class="list-group list-group-flush">\
            <li class="list-group-item">Sent: ' + (match[matchedUser.country + 'Sent']) + '</li>\
            <li class="list-group-item">Received: ' + (match[matchedUser.country + 'Received']) + '</li>\
          </ul>\
          <div class="card-block">\
            <div class="btn btn-primary">Sent!</div>\
            <div class="btn btn-primary">Received!</div>\
          </div>\
        </div>\
        ')
      })
    })
  })

  $('#logout').on('click', function() {
    localStorage.removeItem('user')
    location.href = '/'
  })
})