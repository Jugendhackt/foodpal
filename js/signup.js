// Initialize Firebase
var config = {
  apiKey: "AIzaSyAyEf3JOtIJOTa-IB7oRb37lkHxlgrRuNg",
  authDomain: "foodpal-2c2dc.firebaseapp.com",
  databaseURL: "https://foodpal-2c2dc.firebaseio.com",
  storageBucket: "foodpal-2c2dc.appspot.com",
  messagingSenderId: "716254158440"
};

firebase.initializeApp(config);
const db = firebase.database()

$('document').ready(function() {
  /**
   * Check Browser Supports LocalStorage
   */
  if (!localStorage) {
    alert('No Support Browser')
  }

  /**
   * Check If User Already Signed In
   */
  const existingUser = JSON.parse(checkUserLocalStorage())

  if (existingUser) {
    if (existingUser.matched) location.href = '/foodpal/me.html'
    else location.href = '/foodpal/list.html'
  }

  $('#form').submit(function(e) {
    e.preventDefault()
    const user = {
      country: $('#country').val(),
      username: $('#username').val(),
      email: $('#email').val(),
      contact: $('#contact').val(),
      password: $('#password').val(),
      food: $('#food').val(),
      matched: false,
      foodImage: $('#food-image').val() ? $('#food-image').val() : 'http://rensink.org/wp-content/themes/qaengine16/img/default-thumbnail.jpg'
    }

    const userRefByCountry = db.ref('users/' + user.country + '/' + user.username)

    userRefByCountry.once('value')
      .then(function(data) {
        const val = data.val()

        if (val) {
          throw new Error('Exisiting Username')
        } else {
          const userRef = db.ref('users')
          const newUser = {}
          newUser[user.country + '/' + user.username] = user
          userRef.update(newUser)
            .then(function(data) {
              setUserLocalStorage(user)

              alert('Congrat!')
              location.href = '/foodpal/list.html'
            })
        }
      })
      .catch(function(err) {
        alert('Username already exist!')
        return false
      })
  })
})

function setUserLocalStorage(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

function checkUserLocalStorage() {
  console.log(localStorage.getItem('user'))
  return localStorage.getItem('user')
}

function getUsersNotMatched() {
  db.ref('users').orderByChild('matched').equalTo(false).on('child_added', function(result) {
    drawUserDom(result.key)
  })
}

function drawUserDom(username) {

}