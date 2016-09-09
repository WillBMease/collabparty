var context = new (window.AudioContext || window.webkitAudioContext ||
  window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext)();
if (context) {
  // Web Audio API is available.
} else {
  alert('browser not supported') ;
}

var checkLoadedInt, currentSong = null, songs = null
var code = null, myid = Math.floor(Math.random() * 99999)
var mobileReady = true, scrubber = false

// var playlist = function(){
//
// }

$('#enableContainer').click(function(){
  $('#song').get(0).play()
  $('#song').get(0).pause()
  $('#enableContainer').remove()
  mobileReady = true
})

function detectmob() {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 || (window.innerWidth <= 800 && window.innerHeight <= 600)
 ){
    return true;
  }
 else {
    return false;
  }
}

var isMobile = detectmob()

if (isMobile){
	$('#enableContainer').show()
  mobileReady = false
}
else {
  mobileReady = true
}

var low = {latency: 999999}

var pingInt = setInterval(ping, 35)

var pingct = 0

function ping(){
	var obj = {}
	obj.start = +new Date()
	io.socket.post('/Room/ping/', obj, function (data){
    var end = +new Date()
    data.latency = (end - data.start) / 2
    if (data.latency < low.latency){
    	low = data
    }
  })
	pingct++
	if (pingct > 50){
		clearInterval(pingInt)
		low.offset = low.server - low.start - low.latency
    low.id = myid
    io.socket.post('/Room/storeOffset', low)
	}
}

var open = false

$('#invite').click(function(){
	if (!open){
		$('.sidebar').css('left', '0px')
		open = true
	}
	else {
		$('.sidebar').css('left', '-200px')
		open = false
	}
})

player = document.getElementById('song')
var audioControl = context.createMediaElementSource(player)
var volume = context.createGain()
audioControl.connect(volume)
volume.connect(context.destination)

player.addEventListener('ended', function(){
  nextSong()
})

function nextSong(){
  if (songs){
    for (var i = 0 ; i < songs.length ; i++){
      if (songs[i].videoid == currentSong.videoid){
        if (!(i >= songs.length - 1)){
          currentSong = songs[i+1]
          i = songs.length
        }
        else {
          currentSong = songs[0]
          i = songs.length
        }
        io.socket.post('/Room/changeSong', {videoid: currentSong.videoid, id: myid, code: code})
      }
    }
  }
}

function addSongToBottom(data){
  $('.albumArt').css('background-image', 'url(' + data.image + ')')
  $('.songTitle').text(data.title)
  currentSong = data
}

function addSongToList(data){
  $('.song-list').append('<div id="song'+data.videoid+'" class="song-item">'+
    '<div id="song-image'+data.videoid+'" class="song-image" style="background-image: url('+data.image+')"></div>'+
    '<div id="song-title'+data.videoid+'" class="song-title">'+data.title+'</div>'+
  '</div>')

  songs.push(data)

  $('#song'+data.videoid).click(function(){
    console.log('song click')
    console.log(currentSong.videoid)
    console.log(data.videoid)
    if (currentSong.videoid != data.videoid){
      console.log('sending for change song')
      io.socket.post('/Room/changeSong', {videoid: data.videoid, id: myid, code: code})
    }
    else {
      console.log('not sending')
    }
  })
}

function changeSong(data){
  player.pause()
  playing = false
  clearInterval(updateTimeInt)
  console.log(songs)
  songs.forEach(function(s, i){
    if (s.videoid == data.videoid){
      currentSong = s
    }
  })
  loadSong(currentSong.url)
  addSongToBottom(currentSong)
  if (data.id == myid){
    setTimeout(function(){
      console.log('should play new')
      clickPlay()
    }, 1500)
  }
}

function loadSong(url){
  console.log(url)
  player.src = url
  player.load()
}

var updateTimeInt, player, myAudio, playing = false

$('#play').click(function(){
  clickPlay()
})

function clickPlay(){
  if (!playing){
    var obj = {
      code: code,
      time: +new Date(),
      offset: low.offset,
      currentTime: player.currentTime,
      id: myid
    }

    play()
    io.socket.post('/Room/play', obj)
    updateTimeInt = setInterval(updateTime, 100)
  }
  else {
    $('#play').css('background-image', 'url(/images/play.jpg)')
    var obj = {
      code: code,
      time: +new Date(),
      offset: low.offset,
      currentTime: player.currentTime,
      id: myid
    }
    playing = false
    player.pause()
    io.socket.post('/Room/pause', obj)
    clearInterval(updateTimeInt)
  }
}

function updateTime(){
  var obj = {
    code: code,
    time: +new Date(),
    offset: low.offset,
    currentTime: player.currentTime,
    id: myid
  }
  io.socket.post('/Room/updateTime', obj)
}

var Learn = function(){
  this.increment = 0

  this.adjust = function(status){
    if (status == 'above'){
      if (this.increment > 0)
        this.increment = 0
      this.increment -= 0.0014
    }
    else if (status == 'below'){
      if (this.increment < 0)
        this.increment = 0
      this.increment += 0.0014
    }
    return this.increment
  }
}

var learn = new Learn()



function play(){
  player.play()
  synced = false
  playing = true
  $('#play').css('background-image', 'url(/images/pause.png)')
  scrubber = setInterval(updateScrubber, 50)
}

function updateScrubber(){
  var curr = (player.currentTime).toFixed(6)
  var duration = player.duration
  var time_left = Math.round(duration) - Math.round(curr)
  var progress = ((curr / duration).toFixed(6))*100
  $('.scrubber').css('left', progress+'%')
  var mins = Math.floor(time_left / 60)
  var secs = time_left % 60
  if (secs < 10)
    secs = '0' + secs
  $('.playerTime').text('- ' + mins + ':' + secs)
}

// var App = function() {
//   connect: function(){
//     code = (window.location.hash).replace('#', '')
//   	$('.uuid').text(code)
//     io.socket.post('/Room/join', {code: code}, function(data){
//       songs = data.songs
//       $('.song-list').empty()
//       songs.forEach(function (s, i){
//         addSongToList(s)
//       })
//       if (data.currentSong){
//         songs.forEach(function (s, i){
//           if (s.videoid == data.currentSong)
//             changeSong(s)
//         })
//       }
//     })
//   }
// }
//
// var app = new App()


io.socket.on('connect', function(){
  code = (window.location.hash).replace('#', '')
	$('.uuid').text(code)
  io.socket.post('/Room/join', {code: code}, function(data){
    songs = data.songs
    $('.song-list').empty()
    songs.forEach(function (s, i){
      addSongToList(s)
    })
    if (data.currentSong){
      songs.forEach(function (s, i){
        if (s.videoid == data.currentSong)
          changeSong(s)
      })
    }
  })
  // app.connect()
})


io.socket.on('play', function (data){
  if (myid != data.id){
    var offset = parseFloat(low.offset) - parseFloat(data.offset)
    var delay = ((+new Date() - data.time + offset) / 1000).toFixed(6)
    if (delay < 0)
      delay = 0

    player.currentTime = parseFloat( (player.currentTime).toFixed(6) + parseFloat(delay) )
    play()
  }
})

io.socket.on('pause', function (data){
  $('#play').css('background-image', 'url(/images/play.jpg)')
  if (myid != data.id){
    player.pause()
    synced = false
    playing = false
  }
  clearInterval(scrubber)
})

io.socket.on('updateTime', function (data){
  if (mobileReady){
    if (myid != data.id){
      if (isNaN(low.offset)){
        low.offset = data.offset
      }
      else if (isNaN(data.offset)){
        data.offset = low.offset
      }
      if (player.paused){
        play()
      }
      var offset = parseFloat(low.offset) - parseFloat(data.offset)
      var delay = parseFloat(((+new Date() - data.time + offset) / 1000).toFixed(6))
      var time = data.currentTime + delay
      var bottomCheck = -0.018, aboveCheck = 0.018
      if (Math.abs(player.currentTime - time) > 0.038){
        synced = false
      }
      if (synced){
        bottomCheck = -0.032
        aboveCheck = 0.032
      }
      else {
        player.volume = 0
        $('.syncingContainer').show()
      }

      if (player.currentTime - time < bottomCheck){
        player.currentTime = parseFloat( time ) + parseFloat(learn.adjust('below'))
        console.log('below')
        player.volume = 0
        $('.syncingContainer').show()
      }
      else if (player.currentTime - time > aboveCheck){
        player.currentTime = parseFloat( time ) + parseFloat(learn.adjust('above'))
        console.log('above')
        player.volume = 0
        $('.syncingContainer').show()
      }
      else {
        synced = true
        player.volume = 1
        $('.syncingContainer').hide()
      }
    }
  }
})

io.socket.on('addSong', function (data){
  addSongToList(data)
  if (!currentSong){
    addSongToBottom(data)
    setTimeout(function(){
      loadSong(data.url)
    }, 1000)
  }
})

io.socket.on('changeSong', function (data){
  console.log('change song')
  changeSong(data)
})
