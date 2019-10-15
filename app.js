var bot = require('./lib/bot');

bot.proceed('9702802101191131').then(code => console.log('done! val_code = ' + code));
