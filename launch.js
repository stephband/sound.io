var shell = require('shelljs');

// Remove old mongodb log
shell.rm('db/mongodb.log');

// Start mongodb using local directory and logging to file instead
// of holding up the terminal.
shell.exec('mongod --dbpath db/');

// Or do it in the background... but I don't know how to stop this...
// shell.exec('mongod --dbpath db/ --fork --logpath db/mongodb.log --logappend');