var context = new (window.AudioContext || window.webkitAudioContext ||
  window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext)();
if (context) {
  // Web Audio API is available.
} else {
  alert('browser not supported') ;
}

function getRandomToken() {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    return hex;
}

var checkLoadedInt, currentSong = null, songs = null
var mobileReady = true, scrubber = false
var updateTimeInt, myAudio
// Object variables
var app, sync, player, playlist, learn

if (!document.cookie){
  document.cookie = 'username='+getRandomToken()+'; expires=Thu, 18 Dec 2020 12:00:00 UTC'
}
var userid = document.cookie

function detectmob() {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 || (window.innerWidth <= 800 && window.innerHeight <= 600)
 ){
    return true;
  }
 else {
    return false;
  }
}

var isMobile = detectmob()

if (isMobile){
	$('#enableContainer').show()
  mobileReady = false
}
else {
  mobileReady = true
}

$('#enableContainer').click(function(){
  $('#song').get(0).play()
  $('#song').get(0).pause()
  $('#enableContainer').remove()
  mobileReady = true
})

$('#invite').click(function(){
	if (!open){
		$('.sidebar').css('left', '0px')
		open = true
	}
	else {
		$('.sidebar').css('left', '-200px')
		open = false
	}
})

$('.play').click(function(){
  app.clickPlay()
})

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
