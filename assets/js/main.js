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
        io.socket.post('/Room/changeSong', {videoid: currentSong.videoid, userid: userid, roomid: roomid})
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
      io.socket.post('/Room/changeSong', {videoid: data.videoid, userid: userid, roomid: roomid})
    }
    else {
      console.log('not sending')
    }
  })
}

// player.onloadedmetadata = function(){
//   // if (!isNaN(player.duration))
//   //   alert('song loaded')
//   // else
//   //   alert('song not supported!')
// }
//
// player.addEventListener('error', function(){
//   // alert('there was an error')
// })

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
  player.loadSong(currentSong.url)
  addSongToBottom(currentSong)
  if (data.userid == userid){
    setTimeout(function(){
      console.log('should play new')
      clickPlay()
    }, 1500)
  }
}

// function loadSong(url){
//   console.log(url)
//   player.src = url
//   player.load()
// }

var updateTimeInt, myAudio, playing = false

function clickPlay(){
  if (!playing){
    var obj = {
      roomid: roomid,
      time: +new Date(),
      offset: sync.low.offset,
      currentTime: player.getCurrentTime(),
      userid: userid
    }

    play()
    io.socket.post('/Room/play', obj)
    updateTimeInt = setInterval(updateTime, 90)
  }
  else {
    $('#play').css('background-image', 'url(/images/play.jpg)')
    var obj = {
      roomid: roomid,
      time: +new Date(),
      offset: sync.low.offset,
      currentTime: player.getCurrentTime(),
      userid: userid
    }
    playing = false
    player.pause()
    io.socket.post('/Room/pause', obj)
    clearInterval(updateTimeInt)
  }
}

function updateTime(){
  var obj = {
    roomid: roomid,
    time: +new Date(),
    offset: sync.low.offset,
    currentTime: player.getCurrentTime(),
    userid: userid
  }
  io.socket.post('/Room/updateTime', obj)
}

var Learn = function(){
  var increment = 0

  this.adjust = function(status){
    if (status == 'above'){
      if (increment > 0)
        increment = 0
      increment -= 0.0012
    }
    else if (status == 'below'){
      if (increment < 0)
        increment = 0
      increment += 0.0012
    }
    return increment
  }
}

var learn = new Learn()



function play(){
	console.log('the play function is called')
  player.play()
  synced = false
  playing = true
  $('#play').css('background-image', 'url(/images/pause.png)')
  scrubber = setInterval(updateScrubber, 50)
}

function updateScrubber(){
  var curr = player.getCurrentTime()
  var duration = player.getDuration()
  var time_left = Math.round(duration) - Math.round(curr)
  var progress = ((curr / duration).toFixed(6))*100
  $('.scrubber').css('left', progress+'%')
  var mins = Math.floor(time_left / 60)
  var secs = time_left % 60
  if (secs < 10)
    secs = '0' + secs
  $('.playerTime').text('- ' + mins + ':' + secs)
}
