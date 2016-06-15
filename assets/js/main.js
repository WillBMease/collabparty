var checkLoadedInt, currentSong = null

$('#enableContainer').click(function(){
  $('#song').get(0).play()
  $('#song').get(0).pause()
  $('#enableContainer').remove()
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
}

var code = null, myid = Math.floor(Math.random() * 99999)

io.socket.on('connect', function(){
	console.log((window.location.hash).replace('#', ''))
  code = (window.location.hash).replace('#', '')
	$('.uuid').text(code)
  io.socket.post('/Room/join', {code: code})
})

var low = {latency: 999999}

var pingInt = setInterval(ping, 50)

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
// audio = context.createMediaElementSource(player);
// audio.connect(visualizer)
// audio.connect(context.destination)

io.socket.on('addSong', function (data){
  console.log('got add song message')
  console.log(data)
  $('#songList').empty()
  $('.albumArt').css('background-image', 'url(' + data.image + ')')
  $('.songTitle').text(data.title)
  $('.results').hide().empty()
  currentSong = data
  setTimeout(function(){
    loadSong(data.url)
  }, 1000)
})

function loadSong(url){
  player.src = url
  player.load()
}

var updateTimeInt, player, myAudio, playing = false

$('#play').click(function(){
  if (!playing){
    $(this).css('background-image', 'url(/images/pause.png)')
    playing = true
    var obj = {
      code: code,
      time: +new Date(),
      offset: low.offset,
      currentTime: player.currentTime,
      id: myid
    }

    player.play()
    io.socket.post('/Room/play', obj)
    updateTimeInt = setInterval(updateTime, 400)
  }
  else {
    $(this).css('background-image', 'url(/images/play.jpg)')
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
})

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
      this.increment -= 0.003
    }
    else if (status == 'below'){
      if (this.increment < 0)
        this.increment = 0
      this.increment += 0.003
    }
    return this.increment
  }
}

var learn = new Learn()

io.socket.on('updateTime', function (data){
  console.log('updating time')
  if (myid != data.id){
    if (isNaN(low.offset)){
      low.offset = data.offset
    }
    else if (isNaN(data.offset)){
      data.offset = low.offset
    }
    var offset = parseFloat(low.offset) - parseFloat(data.offset)
    var delay = parseFloat(((+new Date() - data.time + offset) / 1000).toFixed(6))
    var time = data.currentTime + delay
    var bottomCheck = -0.025, aboveCheck = 0.025
    if (Math.abs(player.currentTime - time) > 0.08){
      synced = false
    }
    if (synced){
      bottomCheck = -0.045
      aboveCheck = 0.045
    }

    if (player.currentTime - time < bottomCheck){
      player.currentTime = parseFloat( time ) + parseFloat(learn.adjust('below'))
      console.log('below')
    }
    else if (player.currentTime - time > aboveCheck){
      player.currentTime = parseFloat( time ) + parseFloat(learn.adjust('above'))
      console.log('above')
    }
    else {
      synced = true
    }
  }
})

io.socket.on('play', function (data){
  console.log('play')
  if (myid != data.id){
    console.log('inside')
    var offset = parseFloat(low.offset) - parseFloat(data.offset)
    var delay = ((+new Date() - data.time + offset) / 1000).toFixed(6)
    console.log(delay)
    if (delay < 0)
      delay = 0

    player.currentTime = parseFloat( (player.currentTime).toFixed(6) + parseFloat(delay) )
    player.play()
    synced = false
    // player.start()
  }
})

io.socket.on('pause', function (data){
  console.log('pause')
  if (myid != data.id){
    player.pause()
    synced = false
  }
})
