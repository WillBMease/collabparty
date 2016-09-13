var Learn = function(){
  var t = this
  t.increment = 0

  t.adjust = function(status){
    if (status == 'above'){
      if (t.increment > 0)
        t.increment = 0
      t.increment -= 0.0012
    }
    else if (status == 'below'){
      if (t.increment < 0)
        t.increment = 0
      t.increment += 0.0012
    }
    return t.increment
  }
}

learn = new Learn()
