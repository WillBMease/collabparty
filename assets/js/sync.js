var Sync = function(){
  var t = this
  t.low = {latency: 999999}
  t.pingInterval
  t.pingct = 0

  t.startPing = function(){
    t.pingInterval = setInterval(t.ping, 45)
  }

  t.ping = function(){
    io.socket.post('/Room/ping/', {start: +new Date()}, function (data){
      t.calculatePing(data)
    })
  }

  t.calculatePing = function(data){
    console.log(data)
    console.log(t.low)
    data.latency = (+new Date() - data.start) / 2

    if (data.latency < t.low.latency)
      t.low = data

    t.pingct++
    if (t.pingct > 125){
      clearInterval(t.pingInterval)
      t.low.offset = t.low.server - t.low.start - t.low.latency
      t.low.userid = userid
      io.socket.post('/Room/storeOffset', t.low)
    }
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
