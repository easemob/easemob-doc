const fs = require('fs');
var path = require("path");

console.log(path.resolve('./'));

fs.readFile('docs/product/introduction.md', 'utf8', function(err, data) {
  if (err == null) {
    fs.writeFile('docs/search.json', JSON.stringify({content: data.toString()}), function(err) {
      
    });
  }
})