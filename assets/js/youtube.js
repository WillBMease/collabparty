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
    			maxResults: 10,
    			order: "viewCount"
    			// publishedAfter: "2015-01-01T00:00:00Z"
    		})

    		request.execute(function(response) {
    			var results = response.result
          console.log(results)
    			$('.results').show()
    			$('.results').empty()
    			// $('#sortable').hide()
    			$.each(results.items, function(index, item) {
    				autocomplete(item.snippet.title, item.id.videoId, item.snippet.thumbnails.high.url)
    			})
    		})
     }
  });
});



function autocomplete(title, id, image){
  $('.results').append('<li id="'+id+'" class="resultItem">'+title+'</li>')
  $('#'+id).click(function(){
    var url = 'https://www.youtube.com/watch?v=' + id
    io.socket.post('/Room/addSong', {url: url, code: code})
    $('#ytsearch').val('')
    $('.albumArt').css('background-image', 'url('+image+')')
  })
	// $('#sr').append('<div id="'+id+'" class="rs">'+title+"</div>")
	// $('#'+id).click(function(){
	// 	// socket.emit('sendYT', title, id)
	// 	$('#sr').hide()
	// 	$('#sr').empty()
	// 	$('#ytsearch').val('')
	// 	$('#sortable').show()
	// })
}

function ytinit() {
	gapi.client.setApiKey("AIzaSyDvDcWpPGW8EeltsGtAWK0C2NJu4XPsGs4")
	gapi.client.load("youtube", "v3", function(){
		// youtube api ready
		console.log('youtube api ready!')
	})
}

// var playerStatus = false

// function onPlayerReady(event) {
// 	// player.loadVideoById("bHQqvYy5KYo", 5, "large")
//
//   $('#playVid').click(function() {
//   	playVideo()
//   })
//
//   socket.on('changeTrack', function (data){
//   		player.loadVideoById(data[0])
// 		$('#ytname').text(data[1])
// 		playVideo()
//   })
//
//
//   // $('#seekVid').click(function() {
//   // 	player.seekTo(120)
//   // })
//
//   $('#addTime').click(function() {
//   	var temptime = player.getCurrentTime() + 0.1
//   	player.seekTo(temptime)
//   	// console.log(temptime)
//   })
//
//   $('#minusTime').click(function() {
//   	var temptime = player.getCurrentTime() - 0.1
//   	player.seekTo(temptime)
//   })
// }

 // function playVideo(){
 //  	if (!playerStatus){
 //  		player.playVideo();
 //  		playerStatus = true
 //   	// socket.emit('playYT', playerStatus)
 //  	}
 // else {
 // 	player.pauseVideo();
 //  		playerStatus = false
 //   	// socket.emit('playYT', playerStatus)
 // }
 //  }

// socket.on('sendYT', function (name, link) {
// 	receiveYT(name, link)
// })

// socket.on('playYT', function (data) {
// 	if (data){
// 		player.playVideo();
// 		$('#playVid').attr('src', 'img/pause.png')
// 		playerStatus = true
// 	}
// 	else {
// 		player.pauseVideo()
// 		$('#playVid').attr('src', 'img/play.png')
// 		playerStatus = false
// 	}
// })

// http://savemedia.com/watch?v=dXP2GdqYCOM

// var queue = [], links = [], currentSong

// function receiveYT(name, link) {
// 	if (queue.length < 1)
// 	  $('#ytname').text(name)
// 	var newQueue = [link, name]
// 	queue.push(newQueue)
// 	links[link] = name
// 	$('#sortable').append('<li id="'+link+'" class="ui-state-default">'+name+'<image src="img/play.png" class="queuePlay" id="link'+link+'"></image></li>')
// 	createPlayButton(link)
// 	if (player != null){
// 		// player.cueVideoById(link)
// 	}
// 	else {
// 			player = new YT.Player('item', {
//           	height: '400',
//           	width: '640',
//           	videoId: link,
//           	// allowfullscreen: 0,
//           	events: {
//            	 'onReady': onPlayerReady,
//           	 'onStateChange': onPlayerStateChange
//           	}
//         });
// 		$('#'+link).css('background', 'rgb(116, 236, 248)')
// 	}
// }

// function createPlayButton(link){
//
// $('#link'+link).click(function(){
// 	var tempurl = player.getVideoUrl()
// 	var newurl = tempurl.split("=").pop();
// 	var chosenLink = $(this).attr('id').substring(4, $(this).attr('id').length)
// 	console.log($(this).attr('id'))
// 	console.log(chosenLink)
// //
// 	if (newurl == chosenLink){
// 		playVideo()
// 	}
// 	else {
// 		$('#'+newurl).css('background', '#6EACC9')
// 		$('#'+chosenLink).css('background', 'rgb(116, 236, 248)')
// 		player.loadVideoById(chosenLink)
// 		$('#ytname').text(queue[chosenLink])
// 		playVideo()
// 		var temp = [chosenLink, links[chosenLink]]
// 		// socket.emit('changeTrack', temp)
// 	}
// })
//
// }


// function onPlayerStateChange(event) {
// 	// console.log(event)
//
// 	// player.cueVideoById()
// 	var tempurl = player.getVideoUrl()
// 	var newurl = tempurl.split("=").pop();
//
// 	// console.log(newurl)
//
//     if(event.data === 0) {
//         for (var i = 0 ; i < queue.length ; i++){
//         	if (queue[i][0] == newurl){
//         		$('#'+queue[i][0]).css('background', '#6EACC9')
//         		if (i == queue.length - 1)
//         			i = 0
//         		else
//         			i++
//         		player.loadVideoById(queue[i][0])
//         		$('#ytname').text(links[queue[i][0]])
//         		player.playVideo()
//         		$('#'+queue[i][0]).css('background', 'rgb(116, 236, 248)')
//         		i = queue.length
//         	}
//         }
//     }
// }


// $("#sortable").on("sortupdate", function(event, ui){
//     parseList()
// });

// function parseList(){
//   queue = []
// $('.ui-state-default').each(function () {
//   var temp = $(this).attr('id')
//   var newQueue = [temp, links[temp]]
//   queue.push(newQueue)
// });
//     // socket.emit('updateYTlist', queue, myID)
// }

// socket.on('updateYTlist', function (data, id){
//   if (myID != id){
// 	resetList(data)
//   }
// })

// function resetList (data){
// 	$('#sortable').empty()
// 	queue = []
// 	queue = data
// 	for (var i = 0 ; i < data.length ; i++){
// 		$('#sortable').append('<li id="'+data[i][0]+'" class="ui-state-default">'+data[i][1]+'<image src="img/play.png" class="queuePlay" id="link'+data[i][0]+'"></image src="img/play.png"></li>')
// 	}
// }

// $('#lastTrack').click(function(){
// 	// lastTrack()
// 	// socket.emit('lastTrack', true)
// })
//
// $('#nextTrack').click(function(){
// 	// nextTrack()
// 	// socket.emit('nextTrack', true)
// })
//
// socket.on('lastTrack', function (data){
// 	lastTrack()
// })
//
// socket.on('nextTrack', function (data){
// 	nextTrack()
// })

// function lastTrack(){
// 	var tempurl = player.getVideoUrl()
// 	var newurl = tempurl.split("=").pop();
//
// 	for (var i = 0 ; i < queue.length ; i++){
//         	if (queue[i][0] == newurl){
//         		$('#'+queue[i][0]).css('background', '#6EACC9')
//         		if (i == 0)
//         			i = queue.length - 1
//         		else
//         			i--
//         		player.loadVideoById(queue[i][0])
//         		$('#ytname').text(links[queue[i][0]])
//         		player.playVideo()
//         		$('#'+queue[i][0]).css('background', 'rgb(116, 236, 248)')
//         		i = queue.length
//         	}
//     }
// }

// function nextTrack(){
// 	var tempurl = player.getVideoUrl()
// 	var newurl = tempurl.split("=").pop();
//
// 	for (var i = 0 ; i < queue.length ; i++){
//         	if (queue[i][0] == newurl){
//         		$('#'+queue[i][0]).css('background', '#6EACC9')
//         		if (i == queue.length - 1)
//         			i = 0
//         		else
//         			i++
//         		player.loadVideoById(queue[i][0])
//         		$('#ytname').text(links[queue[i][0]])
//         		player.playVideo()
//         		$('#'+queue[i][0]).css('background', 'rgb(116, 236, 248)')
//         		i = queue.length
//         	}
//       }
// }

// socket.on('userJoined', function(data){
// 	if (data != myID)
// 		// socket.emit('updateYTlist', queue, myID)
// })
