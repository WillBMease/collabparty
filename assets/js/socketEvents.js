io.socket.on('connect', function(){
  app.socketConnect()
})

io.socket.on('play', function (data){
  app.socketPlay(data)
})

io.socket.on('pause', function (data){
  app.socketPause(data)
})

io.socket.on('updateTime', function (data){
  app.socketUpdateTime(data)
})

io.socket.on('addSong', function (data){
  app.socketAddSong(data)
})

io.socket.on('changeSong', function (data){
  app.socketChangeSong(data)
})
