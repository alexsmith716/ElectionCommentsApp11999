
function submitForm() {
  var d = new Date();
  var time = d.getTime()
  var firstName;
  var lastName;
  var city;
  var state;
  var favoriteTreatsArray = [];
  var tf = document.getElementById("myFavNoveltiesForm");
  var sa = $(tf).serializeArray();
  //
  $.each(sa, function(i, field){
    switch (field.name) {
      case 'firstName': firstName=field.value; break;
      case 'lastName': lastName=field.value; break;
      case 'city': city=field.value; break;
      case 'state': state=field.value; break;
      case 'favNovelties': favoriteTreatsArray.push(field.value); break;
    }
  });
  //
  fetch('/doPostPath', {
    method: 'post',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      'time':time,
      'firstName':firstName,
      'lastName':lastName,
      'city':city,
      'state':state,
      'favNovelties':favoriteTreatsArray
    })
  }).then(function(response) {
    var contentType = response.headers.get("content-type");
    if (response.ok) {
      return response.json()
    }
  }).then(function(data) {
    window.location.href= '/';
  }).catch(function(error) {
    console.log("############# main.js > submitForm() > catch >=> error: ", error)
  })
}