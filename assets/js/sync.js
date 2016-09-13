var Sync = function(){
  var low = {latency: 999999}
  var pingInterval
  var pingct = 0
}

Sync.prototype.startPing = function(){
  this.pingInterval = setInterval(this.ping, 1005)
}

Sync.prototype.ping = function(){
  io.socket.post('/Room/ping/', {start: +new Date()}, function (data){
    data.latency = (+new Date() - data.start) / 2
    console.log(data)
    console.log(this.low)
    if (data.latency < this.low.latency){
      this.low = data
    }
    this.pingct++
    if (this.pingct > 100){
      clearInterval(this.pingInterval)
      this.low.offset = this.low.server - this.low.start - this.low.latency
      this.low.userid = userid
      io.socket.post('/Room/storeOffset', this.low)
    }
  })
}

sync = new Sync()
