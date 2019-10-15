const bot = require('./lib/bot');
const argv = require('yargs').argv
const emitter = bot.getEventEmitter();
const readline = require('readline');

emitter.on('event', msg => console.log(msg));
emitter.on('progress', prog => console.log(`Progress: ${prog}%`));

if (argv.code) {
  bot.proceed(argv.code).then(val_code => console.log('Validation code = ' + val_code));
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Input your 16-digit survey code: ', code => {
    bot.proceed(code).then(val_code => {
      console.log('Validation code = ' + val_code)
      rl.close();
    });
  });
}
