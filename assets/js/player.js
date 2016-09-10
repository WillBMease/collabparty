var Player = {
  var player = document.getElementById('song')

  function play(){
    player.play()
  }

  player.addEventListener('ended', function(){
    playlist.nextSong()
  })
}
