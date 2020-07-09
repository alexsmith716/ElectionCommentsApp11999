
function submitForm() {
  var d = new Date();
  var time = d.getTime()
  var firstName;
  var lastName;
  var city;
  var state;
  var tf = document.getElementById("addNewCommentViewFormID");
  var sa = $(tf).serializeArray();
  //

      
    //$('input[name="candidate"]:checked').val();
    //document.querySelector('input[name="candidate"]:checked').value;

  $.each(sa, function(i, field){

    console.log('####### > addNewComment.js > submitForm: ', field.name, " ::: ", field.value, " ::: ", field);

    switch (field.name) {
      case 'firstName': firstName=field.value; break;
      case 'lastName': lastName=field.value; break;
      case 'city': city=field.value; break;
      case 'state': state=field.value; break;
      case 'candidate': candidate=field.value; break;
      case 'comment': comment=field.value; break;
    }

  });
  /*
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
  */
}