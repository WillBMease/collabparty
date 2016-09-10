var Sync = function(){
  var low = {latency: 999999}
  var pingInterval
  var pingct = 0

  function startPing(){
    pingInterval = setInterval(ping, 35)
  }

  function ping(){

  }
}

Sync.prototype.ping = function(){
  io.socket.post('/Room/ping/', {start: +new Date()}, function (data){
    data.latency = (+new Date() - data.start) / 2
    if (data.latency < low.latency){
      this.low = data
    }
  })
  pingct++
  if (pingct > 50){
    clearInterval(pingInt)
    low.offset = low.server - low.start - low.latency
    low.id = myid
    io.socket.post('/Room/storeOffset', low)
  }
}
