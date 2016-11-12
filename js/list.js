const db = firebase.database()

$('document').ready(function() {
  const user = JSON.parse(localStorage.getItem('user'))
  getUsersNotMatched(user.country)

  setHeader(user.country)

  $('#logout').on('click', function() {
    localStorage.removeItem('user')
    location.href = '/foodpal'
  })
})

function getUsersNotMatched(country) {
  const target = country === 'germany' ? 'korea' : 'germany'
  db.ref('users/' + target).orderByChild('matched').equalTo(false).on('child_added', function(result) {
    drawUserDom(target, result.key)
  })
}

function drawUserDom(target, username) {
  db.ref('users/' + target + '/' + username).once('value', function(data) {
    const user = data.val()

    $('.foods > .row').append('\
    <div class="card col-xs-12 col-sm-6 col-md-6">\
      <img class="card-img-top" src="' + user.foodImage + '" alt="' + user.food + '">\
      <div class="card-block">\
        <h4 class="card-title">' + user.food + '</h4>\
        <p class="card-text">' + user.username + '</p>\
        <div href="#" id="user-' + user.username + '" class="btn btn-primary btn-match">Go Match</div>\
      </div>\
    </div>\
    ')

    addMatchListener()
  })
}

function addMatchListener() {
  $('.btn-match').on('click', function(e) {
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const username = currentUser.username
    const country = currentUser.country
    const matchedUsername = $(this).attr('id').split('-')[1]
    const matchedUserCountry = country === 'germany' ? 'korea' : 'germany'

    const userRefByCountry = db.ref('users/' + country)
    userRefByCountry.child(username).update({
      matched: true
    })

    const matchedUserRefByCountry = db.ref('users/' + matchedUserCountry)
    matchedUserRefByCountry.child(matchedUsername).update({
      matched: true
    })

    const matchesRef = db.ref('matches/' + username + '-' + matchedUsername)
    matchesRef.set({
      korea: country === 'korea' ? username : matchedUsername,
      germany: country === 'korea' ? matchedUsername : username,
      koreaSent: false,
      germanySent: false,
      koreaReceived: false,
      germanyReceived: false
    })

    alert('congrat!')
    location.href = '/foodpal/me.html'
  })
}

function setHeader(country) {
  const target = country === 'germany' ? 'Korea' : 'Germany'
  $('.foods > header > h1').text(target)
}