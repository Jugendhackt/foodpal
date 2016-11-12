$('document').ready(function() {
  if (!localStorage) {
    alert('No Support Browser')
  }

  $('#form-signin').on('submit', function(e) {
    e.preventDefault()

    const db = firebase.database()
    db.ref('users/' + $('#country').val() + '/' + $('#username').val()).once('value', function(data) {
      const user = data.val()
      if (user) {
        if (user.password === $('#password').val()) {
          localStorage.setItem('user', JSON.stringify(user))

          if (user.matched) location.href = '/me.html'
          else location.href = '/list.html'
        } else {
          alert('Wrong Password!')
        }
      } else {
        alert('Sign Up First!')
        location.href = '/signup.html'
      }
    })
  })
})

