var Sync = function(){
  var low = {latency: 999999}
  var pingInterval
  var pingct = 0

  function startPing(){
    this.pingInterval = setInterval(ping, 35)
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
  this.pingct++
  if (this.pingct > 50){
    clearInterval(this.pingInterval)
    this.low.offset = this.low.server - this.low.start - this.low.latency
    this.low.id = myid
    io.socket.post('/Room/storeOffset', low)
  }
}
