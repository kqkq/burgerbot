const assert = require('assert');
const bot = require('../lib/bot');

describe('Test the burger bot (this may take a minute)', function() {
  it('Should retrieve a validation code', async function() {
    const val_code = await bot.proceed('9702802101191131');
    assert(val_code === '18901822');
  })
  it('Should raise an error when survey code is invalid', async function() {
    await assert.rejects(async () => await bot.proceed('0000000000000000'), Error, 'SurveyCodeInvalid');
  })
});