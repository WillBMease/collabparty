function getRandomToken() {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    return hex;
}

var User = function(){
  var code = (window.location.hash).replace('#', '')
  if (!document.cookie){
  	document.cookie = 'username='+getRandomToken()+'; expires=Thu, 18 Dec 2020 12:00:00 UTC'
  }
  var id = document.cookie
}
