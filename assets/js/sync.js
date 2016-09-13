var Sync = function(){
  this.low = {latency: 999999}
  this.pingInterval
  this.pingct = 0

  this.startPing = function(){
    this.pingInterval = setInterval(this.ping, 45)
  }

  this.ping = function(){
    io.socket.post('/Room/ping/', {start: +new Date()}, function (data){
      data.latency = (+new Date() - data.start) / 2
      if (data.latency < this.low.latency){
        this.low = data
      }
      this.pingct++
      if (this.pingct > 125){
        clearInterval(pingInterval)
        this.low.offset = this.low.server - this.low.start - this.low.latency
        this.low.userid = userid
        io.socket.post('/Room/storeOffset', this.low)
      }
    })
  }
}

// Sync.prototype.startPing = function(){
//   pingInterval = setInterval(this.ping, 45)
// }
//
// Sync.prototype.ping = function(){
//   io.socket.post('/Room/ping/', {start: +new Date()}, function (data){
//     data.latency = (+new Date() - data.start) / 2
//     console.log(data)
//     console.log(low)
//     if (data.latency < low.latency){
//       low = data
//     }
//     pingct++
//     if (pingct > 100){
//       clearInterval(pingInterval)
//       low.offset = low.server - low.start - low.latency
//       low.userid = userid
//       io.socket.post('/Room/storeOffset', low)
//     }
//   })
// }

sync = new Sync()
