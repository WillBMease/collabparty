var Playlist = function(){
  var t = this
  t.currentSong = false
  t.songs = []

  t.getCurrentSong = function(){
    return t.currentSong
  }

  t.setSongs = function(data){
    t.songs = data
  }

  t.addSongToBottom = function(data){
    $('.albumArt').css('background-image', 'url(' + data.image + ')')
    $('.songTitle').text(data.title)
    t.currentSong = data
  }

  t.addSongToList = function(data){
    $('.song-list').append('<div id="song'+data.videoid+'" class="song-item">'+
      '<div id="song-image'+data.videoid+'" class="song-image" style="background-image: url('+data.image+')"></div>'+
      '<div id="song-title'+data.videoid+'" class="song-title">'+data.title+'</div>'+
    '</div>')

    t.songs.push(data)

    $('#song'+data.videoid).click(function(){
      if (t.currentSong.videoid != data.videoid){
        io.socket.post('/Room/changeSong', {videoid: data.videoid, userid: userid, roomid: roomid})
      }
    })
  }

  t.changeSong = function(data){
    player.pause()
    clearInterval(updateTimeInt)
    t.songs.forEach(function(s, i){
      if (s.videoid == data.videoid){
        t.currentSong = s
      }
    })
    player.loadSong(t.currentSong.url)
    t.addSongToBottom(t.currentSong)
    if (data.userid == userid){
      setTimeout(function(){
        app.clickPlay()
      }, 1500)
    }
  }

  t.nextSong = function(){
    if (t.songs){
      for (var i = 0 ; i < t.songs.length ; i++){
        if (t.songs[i].videoid == t.currentSong.videoid){
          if (!(i >= t.songs.length - 1)){
            t.currentSong = t.songs[i+1]
            i = t.songs.length
          }
          else {
            t.currentSong = t.songs[0]
            i = t.songs.length
          }
          io.socket.post('/Room/changeSong', {videoid: t.currentSong.videoid, userid: userid, roomid: roomid})
        }
      }
    }
  }
}

playlist = new Playlist()
