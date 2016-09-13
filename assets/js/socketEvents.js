io.socket.on('connect', function(){
  app.socketConnect()
  // roomid = (window.location.hash).replace('#', '')
  // sync.startPing()
	// $('.uuid').text(roomid)
  // io.socket.post('/Room/join', {userid: document.cookie, roomid: roomid}, function(data){
  //   $('.song-list').empty()
  //   data.songs.forEach(function (s, i){
  //     playlist.addSongToList(s)
  //   })
  //   if (data.currentSong){
  //     playlist.songs.forEach(function (s, i){
  //       if (s.videoid == data.currentSong)
  //         playlist.changeSong(s)
  //     })
  //   }
  //   if (data.playing){
  //     $('.play').addClass('active')
  //     play()
  //   }
  // })
})


io.socket.on('play', function (data){
  app.socketPlay(data)
  // if (userid != data.userid){
  //   var offset = parseFloat(sync.low.offset) - parseFloat(data.offset)
  //   var delay = ((+new Date() - data.time + offset) / 1000).toFixed(6)
  //   if (delay < 0)
  //     delay = 0
  //
  //   $('.play').addClass('active')
  //   player.setCurrentTime(parseFloat( player.getCurrentTime() + parseFloat(delay) ))
  //   play()
  // }
})

io.socket.on('pause', function (data){
  app.socketPause(data)
  // $('.play').removeClass('active')
  // if (userid != data.userid){
  //   player.pause()
  //   synced = false
  // }
  // clearInterval(scrubber)
  // clearInterval(updateTimeInt)
})

io.socket.on('updateTime', function (data){
  app.socketUpdateTime(data)
  // if (mobileReady){
  //   if (userid != data.userid){
  //     if (isNaN(sync.low.offset)){
  //       sync.low.offset = data.offset
  //     }
  //     else if (isNaN(data.offset)){
  //       data.offset = sync.low.offset
  //     }
  //     if (!player.playing){
  //       play()
  //     }
  //     var offset = parseFloat(sync.low.offset) - parseFloat(data.offset)
  //     var delay = parseFloat(((+new Date() - data.time + offset) / 1000).toFixed(6))
  //     var time = data.currentTime + delay
  //     var bottomCheck = -0.018, aboveCheck = 0.018
  //     if (Math.abs(player.getCurrentTime() - time) > 0.030){
  //       synced = false
  //     }
  //     if (synced){
  //       bottomCheck = -0.030
  //       aboveCheck = 0.030
  //     }
  //     else {
  //       player.setVolume(0)
  //       $('.syncingContainer').show()
  //     }
  //
  //     if (player.getCurrentTime() - time < bottomCheck){
  //       player.setCurrentTime(parseFloat( time ) + parseFloat(learn.adjust('below')))
  //       player.setVolume(0)
  //       $('.syncingContainer').show()
  //     }
  //     else if (player.getCurrentTime() - time > aboveCheck){
  //       player.setCurrentTime(parseFloat( time ) + parseFloat(learn.adjust('above')))
  //       player.setVolume(0)
  //       $('.syncingContainer').show()
  //     }
  //     else {
  //       synced = true
  //       player.setVolume(1)
  //       $('.syncingContainer').hide()
  //     }
  //   }
  // }
})

io.socket.on('addSong', function (data){
  app.socketAddSong(data)
  // playlist.addSongToList(data)
  // if (!playlist.getCurrentSong()){
  //   playlist.addSongToBottom(data)
  //   setTimeout(function(){
  //     player.loadSong(data.url)
  //   }, 1000)
  // }
})

io.socket.on('changeSong', function (data){
  app.socketChangeSong(data)
  // playlist.changeSong(data)
})
