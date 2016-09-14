var App = function(){
  var t = this
  t.updateTimeInt = false
  t.scrubber = false
  t.userid = document.cookie
  t.roomid = (window.location.hash).replace('#', '')
  t.obj = {
    roomid: t.roomid,
    time: +new Date(),
    userid: t.userid
  }

  t.clickPlay = function(){
    t.obj.currentTime = player.getCurrentTime()
    t.obj.time = +new Date()
    if (!player.playing){
      io.socket.post('/Room/play', t.obj)
      t.updateTimeInt = setInterval(t.updateTime, 100)
    }
    else {
      io.socket.post('/Room/pause', t.obj)
    }
  }

  t.updateTime = function(){
    t.obj.currentTime = player.getCurrentTime()
    t.obj.time = +new Date()
    console.log('updating time')
    console.log(t.obj)
    io.socket.post('/Room/updateTime', t.obj)
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
    sync.startPing()
  	$('.uuid').text(t.roomid)
    io.socket.post('/Room/join', {userid: t.userid, roomid: t.roomid}, function(data){
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
        player.play()
      }
    })
  }

  t.socketPlay = function(data){
    if (t.userid != data.userid){
      var offset = parseFloat(sync.low.offset) - parseFloat(data.offset)
      var delay = ((+new Date() - data.time + offset) / 1000).toFixed(6)
      if (delay < 0)
        delay = 0

      player.setCurrentTime(parseFloat( player.getCurrentTime() + parseFloat(delay) ))
    }
    player.play()
  }

  t.socketPause = function(data){
    player.pause()
    sync.synced = false
  }

  t.socketUpdateTime = function(data){
    if (mobileReady){
      if (t.userid != data.userid){
        console.log('updating time')
        console.log(data)
        if (isNaN(sync.low.offset)){
          sync.low.offset = data.offset
        }
        else if (isNaN(data.offset)){
          data.offset = sync.low.offset
        }

        var offset = parseFloat(sync.low.offset) - parseFloat(data.offset)
        var delay = parseFloat(((+new Date() - data.time + offset) / 1000).toFixed(6))
        var time = data.currentTime + delay
        var bottomCheck = -0.018, aboveCheck = 0.018
        if (Math.abs(player.getCurrentTime() - time) > 0.030){
          sync.synced = false
        }
        if (sync.synced){
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
          sync.synced = true
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
