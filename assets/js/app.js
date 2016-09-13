var App = function(){
  var t = this

  t.clickPlay(){

  }

  t.updateTime = function(){
    var obj = {
      roomid: roomid,
      time: +new Date(),
      offset: sync.low.offset,
      currentTime: player.getCurrentTime(),
      userid: userid
    }
    io.socket.post('/Room/updateTime', obj)
  }

  t.updateScrubber = function(){
    var curr = t.player.getCurrentTime()
    var duration = t.player.getDuration()
    var time_left = Math.round(duration) - Math.round(curr)
    var progress = ((curr / duration).toFixed(6))*100
    $('.scrubber').css('left', progress+'%')
    var mins = Math.floor(time_left / 60)
    var secs = time_left % 60
    if (secs < 10)
      secs = '0' + secs
    $('.playerTime').text('- ' + mins + ':' + secs)
  }

  t.startThread = function(){

  }

  t.stopThread = function(){

  }

  t.thread = function(){

  }
}

app = new App()
