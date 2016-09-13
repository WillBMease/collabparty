var updateTimeInt, myAudio

function clickPlay(){
  if (!player.playing){
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

function play(){
	console.log('the play function is called')
  player.play()
  synced = false
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
