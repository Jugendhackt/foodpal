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
      username: $('#username').val(),
      email: $('#email').val(),
      password: $('#password').val(),
      food: $('#food').val(),
      matched: false
    }

    if ($('#food-image').val()) user.foodImage = $('#food-image').val()

    db.ref('users/' + user.username).once('value')
      .then(function(data) {
        const val = data.val()
        if (val) {
          throw new Error('Exisiting Username')
        } else {
          db.ref('users/' + user.username).set(user)
          setUserLocalStorage(user)

          alert('Congrat!')
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
  return localStorage.getItem('user')
}
