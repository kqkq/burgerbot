const req = require('request-promise-native');
const EventEmitter = require('events');
const emitter = new EventEmitter();
const j = req.jar();
const request = req.defaults({jar: j, followAllRedirects: true});
const baseUrl = 'https://tellburgerking.com.cn';

const survey_data = require('../data/survey_data.json');

function isBlocked(str) {
  if(/<div id="softblock">/.exec(str)) return true;
  return false;
}

function extractTarget(str) {
  if(isBlocked(str)) return null;
  let match = /action="(.*\.aspx\?c=\d{6})"/.exec(str);
  return match ? match[1] : null;
}

function makeRequestBody(res) {
  let ionf = /<input type="hidden" name="IoNF" value="(\d*)" id="IoNF" \/>/.exec(res)[1];
  let fns = /<input type="hidden" name="PostedFNS" value="(.*)" id="PostedFNS" \/>/.exec(res)[1];
  let ret = {IoNF: ionf, PostedFNS: fns};
  fns.split('|').forEach(e => ret[e] = '5');
  return ret;
}

async function proceed(survey_code) {
  let res = await request.get(baseUrl);
  let target = extractTarget(res);
  if(!target) throw new Error('NoLandingPage');
  else emitter.emit('event', 'Landing page loaded');

  res = await request.post(`${baseUrl}/${target}`, {form: {JavaScriptEnabled: '1', FIP: 'True', AcceptCookies: 'Y', NextButton: '继续'}});
  target = extractTarget(res);
  if(!target) throw new Error('CannotStartSurvey');
  else emitter.emit('event', 'Survey started');

  const c = /^(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d)$/.exec(survey_code);
  res = await request.post(`${baseUrl}/${target}`, {form: {JavaScriptEnabled: '1', FIP: 'True', CN1: c[1], CN2: c[2], CN3: c[3], CN4: c[4], CN5: c[5], CN6: c[6], NextButton: '开始'}});
  target = extractTarget(res);
  if(!target) throw new Error('SurveyCodeInvalid');
  else emitter.emit('event', 'Survey code accepted');

  for(var i = 0; i < survey_data.length - 1; i++) {
    let post_data = survey_data[i] ? survey_data[i] : makeRequestBody(res);
    res = await request.post(`${baseUrl}/${target}`, {form: post_data});
    let per = /<div id="ProgressPercentage">(\d*)%<\/div>/.exec(res)[1];
    target = extractTarget(res);
    if(!target) throw new Error('SurveyCannotProceed');
    emitter.emit('progress', per);
  }

  res = await request.post(`${baseUrl}/${target}`, {form: survey_data[survey_data.length - 1]});
  let val_code = /<p class="ValCode">验证代码：(.*)<\/p>/.exec(res);
  if(!val_code) throw new Error('CannotRetrieveValCode');
  else emitter.emit('event', 'Validation code issued');

  return val_code[1];
}

module.exports.proceed = proceed;
module.exports.getEventEmitter = () => emitter;
