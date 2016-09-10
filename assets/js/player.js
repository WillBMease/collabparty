var Player = function() {
  var player = document.getElementById('song')

  this.player.addEventListener('ended', function(){
    playlist.nextSong()
  })
}

Player.prototype.play = function(){
  this.player.play()
}

Player.prototype.pause = function(){
  this.player.pause()
}

Player.prototype.checkWorks = function(){
  alert(this.player.duration)
}

// Player.prototype.
