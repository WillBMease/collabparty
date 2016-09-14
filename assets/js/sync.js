var Sync = function(){
  var t = this
  t.low = {latency: 999999}
  t.pingInterval
  t.pingct = 0
  t.synced = false

  t.startPing = function(){
    t.pingInterval = setInterval(t.ping, 35)
  }

  t.ping = function(){
    io.socket.post('/Room/ping/', {start: +new Date()}, function (data){
      t.calculatePing(data)
    })
  }

  t.calculatePing = function(data){
    data.latency = (+new Date() - data.start) / 2

    if (data.latency < t.low.latency)
      t.low = data

    t.pingct++
    if (t.pingct > 50){
      clearInterval(t.pingInterval)
      t.low.offset = t.low.server - t.low.start - t.low.latency
      app.obj.offset = t.low.offset
      t.low.userid = userid
      io.socket.post('/Room/storeOffset', t.low)
    }
  }
}

sync = new Sync()
