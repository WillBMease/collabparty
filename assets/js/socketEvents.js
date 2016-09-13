io.socket.on('connect', function(){
  roomid = (window.location.hash).replace('#', '')
  // setInterval(ping, 45)
  sync.startPing()
	$('.uuid').text(roomid)
  io.socket.post('/Room/join', {userid: document.cookie, roomid: roomid}, function(data){
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
})


io.socket.on('play', function (data){
  if (userid != data.userid){
    var offset = parseFloat(sync.low.offset) - parseFloat(data.offset)
    var delay = ((+new Date() - data.time + offset) / 1000).toFixed(6)
    if (delay < 0)
      delay = 0

    $('.play').addClass('active')
    player.currentTime = parseFloat( (player.currentTime).toFixed(6) + parseFloat(delay) )
    play()
  }
})

io.socket.on('pause', function (data){
  $('.play').removeClass('active')
  if (userid != data.userid){
    player.pause()
    synced = false
    playing = false
  }
  clearInterval(scrubber)
})

io.socket.on('updateTime', function (data){
  if (mobileReady){
    if (userid != data.userid){
      if (isNaN(sync.low.offset)){
        sync.low.offset = data.offset
      }
      else if (isNaN(data.offset)){
        data.offset = sync.low.offset
      }
      if (player.paused){
        play()
      }
      var offset = parseFloat(sync.low.offset) - parseFloat(data.offset)
      var delay = parseFloat(((+new Date() - data.time + offset) / 1000).toFixed(6))
      var time = data.currentTime + delay
      var bottomCheck = -0.018, aboveCheck = 0.018
      if (Math.abs(player.currentTime - time) > 0.030){
        synced = false
      }
      if (synced){
        bottomCheck = -0.030
        aboveCheck = 0.030
      }
      else {
        player.volume = 0
        $('.syncingContainer').show()
      }

      if (player.currentTime - time < bottomCheck){
        player.currentTime = parseFloat( time ) + parseFloat(learn.adjust('below'))
        player.volume = 0
        $('.syncingContainer').show()
      }
      else if (player.currentTime - time > aboveCheck){
        player.currentTime = parseFloat( time ) + parseFloat(learn.adjust('above'))
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
  changeSong(data)
})
