var Playlist = {
  var currentSong = null
}

Playlist.prototype.nextSong = function(){

}

Playlist.prototype.addSongToBottom (data){
  $('.albumArt').css('background-image', 'url(' + data.image + ')')
  $('.songTitle').text(data.title)
  this.currentSong = data
}

function addSongToList(data){
  $('.song-list').append('<div id="song'+data.videoid+'" class="song-item">'+
    '<div id="song-image'+data.videoid+'" class="song-image" style="background-image: url('+data.image+')"></div>'+
    '<div id="song-title'+data.videoid+'" class="song-title">'+data.title+'</div>'+
  '</div>')

  songs.push(data)

  $('#song'+data.videoid).click(function(){
    if (currentSong.videoid != data.videoid){
      io.socket.post('/Room/changeSong', {videoid: data.videoid, id: myid, code: code})
    }
    else {
      console.log('not sending')
    }
  })
}

function changeSong(data){
  player.pause()
  playing = false
  clearInterval(updateTimeInt)
  songs.forEach(function(s, i){
    if (s.videoid == data.videoid){
      currentSong = s
    }
  })
  loadSong(currentSong.url)
  addSongToBottom(currentSong)
  if (data.id == myid){
    setTimeout(function(){
      console.log('should play new')
      clickPlay()
    }, 1500)
  }
}

function loadSong(url){
  console.log(url)
  player.src = url
  player.load()
}
