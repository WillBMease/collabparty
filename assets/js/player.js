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
    t.player.play()
    t.playing = true
  }

  t.pause = function(){
    t.player.pause()
    t.playing = false
  }

  t.getCurrentTime = function(){
    return (t.player.currentTime).toFixed(6)
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
