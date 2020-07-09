

var currentDoc;

function submitForm() {
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
  fetch('/doPutUpdate', {
    method: 'put',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      'id': currentDoc._id,
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
    }else{
      console.log("############# main2.js > submit() => Bad response")
    }
  }).then(function(data) {
    $('#updateFormModal').modal('hide');
    window.location.href= '/';
  }).catch(function(error) {
    console.log("############# main.js > submit() > catch => error: " + error)
  })
}



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


function doModalEdit(theid) {
  fetch('/doPutFind', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          'id': theid
      })
    }).then(function(response) {
      if (response.ok) {
          return response.json()
      }else{
          console.log("############# main2.js > doModalEdit => Bad response")
      }
    }).then(function(data) {

      currentDoc = data;

      var tf = document.getElementById('myFavNoveltiesForm');

      for(var j in currentDoc) {
        var r = currentDoc[j];
        switch (j) {
          case 'firstName': tf.elements[j].value=r; break;
          case 'lastName': tf.elements[j].value=r; break;
          case 'city': tf.elements[j].value=r; break;
          case 'state': $('#state').selectpicker('val', r); break;
          case 'favNovelties': $('#favNovelties').selectpicker('val', r); break;
        }
      }

      $('#updateFormModal').modal({
        keyboard: false,
        backdrop: 'static'
      })

    }).catch(function(error) {
      console.log("############# main2.js > doModalEdit > catch => error: ", error)
  })
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


function deleteObject(theid) {
  fetch('/doDelete', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          'id': theid
      })
    }).then(function(response) {
      if (response.ok) {
          window.location.reload();
      }else{
          console.log("############# main2.js > deleteObject => Bad response")
      }
    }).then(function(data) {
      //
    }).catch(function(error) {
      console.log("############# main2.js > deleteObject > catch => error: ", error)
  })
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
