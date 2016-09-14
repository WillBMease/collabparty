var Player = function() {
  var t = this
  t.player = document.getElementById('song')
  t.audioControl = context.createMediaElementSource(t.player)
  t.volume = context.createGain()
  t.audioControl.connect(t.volume)
  t.volume.connect(context.destination)

  t.playing = false

  t.player.addEventListener('ended', function(){
    playlist.nextSong()
  })

  t.play = function(){
    console.log('in player play')
    t.player.play()
    t.playing = true
    console.log(sync.synced)
    sync.synced = false
    app.scrubber = setInterval(app.updateScrubber, 50)
    $('.play').addClass('active')
  }

  t.pause = function(){
    t.player.pause()
    t.playing = false
    $('.play').removeClass('active')
    clearInterval(app.updateTimeInt)
    clearInterval(app.scrubber)
  }

  t.loadSong = function(url){
    t.player.src = url
    t.player.load()
  }

  t.getCurrentTime = function(){
    return (t.player.currentTime).toFixed(6)
  }

  t.setCurrentTime = function(time){
    t.player.currentTime = time
  }

  t.getVolume = function(){
    return t.player.volume
  }

  t.setVolume = function(value){
    t.player.volume = value
  }

  t.getDuration = function(){
    return (t.player.duration).toFixed(6)
  }

  t.checkWorks = function(){
    alert(t.player.duration)
  }

  t.player.addEventListener('ended', function(){
    // playlist.nextSong()
  })

  t.player.onloadedmetadata = function(){
    // if (!isNaN(t.player.duration))
    //   alert('song loaded')
    // else
    //   alert('song not supported!')
  }

  t.player.addEventListener('error', function(){
    // alert('there was an error')
  })

}

player = new Player()
