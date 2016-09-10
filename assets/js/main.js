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
  // songs[data.videoid] = data

  $('#song'+data.videoid).click(function(){
    if (currentSong.videoid != data.videoid){
      io.socket.post('/Room/changeSong', {videoid: data.videoid, id: myid, code: code})
    }
    else {
      console.log('not sending')
    }
  })
}

player.onloadedmetadata = function(){
  if (!isNaN(player.duration))
    alert('song loaded')
  else
    alert('song not supported!')
}

function changeSong(data){
  player.pause()
  playing = false
  clearInterval(updateTimeInt)
  // currentSong = songs[data.videoid]
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
  var increment = 0

  this.adjust = function(status){
    if (status == 'above'){
      if (increment > 0)
        increment = 0
      increment -= 0.0010
    }
    else if (status == 'below'){
      if (increment < 0)
        increment = 0
      increment += 0.0010
    }
    return increment
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
