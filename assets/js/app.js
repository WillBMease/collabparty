var App = function(){
  var t = this
  t.updateTimeInt = false
  t.scrubber = false

  t.clickPlay = function(){
    if (!player.playing){
      var obj = {
        roomid: roomid,
        time: +new Date(),
        offset: sync.low.offset,
        currentTime: player.getCurrentTime(),
        userid: userid
      }
      io.socket.post('/Room/play', obj)
      t.updateTimeInt = setInterval(t.updateTime, 100)
    }
    else {
      var obj = {
        roomid: roomid,
        time: +new Date(),
        offset: sync.low.offset,
        currentTime: player.getCurrentTime(),
        userid: userid
      }
      // player.pause()
      io.socket.post('/Room/pause', obj)
    }
  }

  t.play = function(){
    console.log('the play function is called')
    player.play()
    synced = false
    t.scrubber = setInterval(t.updateScrubber, 50)
  }

  t.updateTime = function(){
    var obj = {
      roomid: roomid,
      time: +new Date(),
      offset: sync.low.offset,
      currentTime: player.getCurrentTime(),
      userid: userid
    }
    io.socket.post('/Room/updateTime', obj)
  }

  t.updateScrubber = function(){
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

  t.startThread = function(){

  }

  t.stopThread = function(){

  }

  t.thread = function(){

  }

  t.socketConnect = function(data){
    roomid = (window.location.hash).replace('#', '')
    sync.startPing()
  	$('.uuid').text(roomid)
    io.socket.post('/Room/join', {userid: document.cookie, roomid: roomid}, function(data){
      $('.song-list').empty()
      data.songs.forEach(function (s, i){
        playlist.addSongToList(s)
      })
      if (data.currentSong){
        playlist.songs.forEach(function (s, i){
          if (s.videoid == data.currentSong)
            playlist.changeSong(s)
        })
      }
      if (data.playing){
        $('.play').addClass('active')
        this.play()
      }
    })
  }

  t.socketPlay = function(data){
    if (userid != data.userid){
      var offset = parseFloat(sync.low.offset) - parseFloat(data.offset)
      var delay = ((+new Date() - data.time + offset) / 1000).toFixed(6)
      if (delay < 0)
        delay = 0

      player.setCurrentTime(parseFloat( player.getCurrentTime() + parseFloat(delay) ))
    }
    this.play()
  }

  t.socketPause = function(data){
    player.pause()
    synced = false
    // if (userid != data.userid){
    //   player.pause()
    //   synced = false
    // }
  }

  t.socketUpdateTime = function(data){
    if (mobileReady){
      if (userid != data.userid){
        if (isNaN(sync.low.offset)){
          sync.low.offset = data.offset
        }
        else if (isNaN(data.offset)){
          data.offset = sync.low.offset
        }
        if (!player.playing){
          this.play()
        }
        var offset = parseFloat(sync.low.offset) - parseFloat(data.offset)
        var delay = parseFloat(((+new Date() - data.time + offset) / 1000).toFixed(6))
        var time = data.currentTime + delay
        var bottomCheck = -0.018, aboveCheck = 0.018
        if (Math.abs(player.getCurrentTime() - time) > 0.030){
          synced = false
        }
        if (synced){
          bottomCheck = -0.030
          aboveCheck = 0.030
        }
        else {
          player.setVolume(0)
          $('.syncingContainer').show()
        }

        if (player.getCurrentTime() - time < bottomCheck){
          player.setCurrentTime(parseFloat( time ) + parseFloat(learn.adjust('below')))
          player.setVolume(0)
          $('.syncingContainer').show()
        }
        else if (player.getCurrentTime() - time > aboveCheck){
          player.setCurrentTime(parseFloat( time ) + parseFloat(learn.adjust('above')))
          player.setVolume(0)
          $('.syncingContainer').show()
        }
        else {
          synced = true
          player.setVolume(1)
          $('.syncingContainer').hide()
        }
      }
    }
  }

  t.socketAddSong = function(data){
    playlist.addSongToList(data)
    if (!playlist.getCurrentSong()){
      playlist.addSongToBottom(data)
      setTimeout(function(){
        player.loadSong(data.url)
      }, 1000)
    }
  }

  t.socketChangeSong = function(data){
    playlist.changeSong(data)
  }

  t.handleEnableContainer = function(){

  }
}

app = new App()
