var columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

columns.forEach(function(column) {
  for(var i = 1; i <= columns.length; i++) {
    console.log(column + ' ' + i);
  }
});
