var player;

$('#ytsearch').each(function() {
   var elem = $(this);
   elem.data('oldVal', elem.val());
   elem.bind("propertychange change click keyup input paste", function(event){
     if (elem.data('oldVal') != elem.val()) {
        elem.data('oldVal', elem.val());

    		var request = gapi.client.youtube.search.list({
    			part: "snippet",
    			// type: "video",
          // type: "search",
    			q: encodeURIComponent(elem.val()).replace(/%20/g, '+'),
    			maxResults: 25,
    			order: "viewCount"
    			// publishedAfter: "2015-01-01T00:00:00Z"
    		})

    		request.execute(function(response) {
    			var results = response.result
          console.log(result)
          $('.results').empty()
    			$.each(results.items, function(index, item) {
    				autocomplete(item.snippet.title, item.id.videoId, item.snippet.thumbnails.high.url)
    			})
    		})
     }
  });
});

function autocomplete(title, id, image){
  $('.results').append('<div id="'+id+'" class="resultItem">'+
    '<div class="resultImage" style="background-image:url('+image+');"></div>'+
    '<div class="resultTitle">'+title+'</div>'+
  '</div>')
  $('#'+id).click(function(){
    console.log('click')
    var url = 'https://www.youtube.com/watch?v=' + id
    io.socket.post('/Room/addSong', {url: url, code: code, image: image, title: title})
    $('#ytsearch').val('')
    $('.albumArt').css('background-image', 'url('+image+')')
    $('.songTitle').text(title)
    $('.results').hide().empty()
  })
}

$('#ytsearch').focus(function(){
  $('.results').show()
})

$('#ytsearch').focusout(function(){
  // $('.results').hide()
})

function ytinit() {
	gapi.client.setApiKey("AIzaSyDvDcWpPGW8EeltsGtAWK0C2NJu4XPsGs4")
	gapi.client.load("youtube", "v3", function(){
		// youtube api ready
		console.log('youtube api ready!')
	})
}
