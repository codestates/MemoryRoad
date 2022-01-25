const cli = require('cli');

cli.withInput(function(line, _, eof){
  if(!eof){
    this.output('"' + line + '" +');
  }
});