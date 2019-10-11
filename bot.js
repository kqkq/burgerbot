const req = require('request-promise-native');
const j = req.jar();
const request = req.defaults({jar: j});
const baseUrl = 'https://tellburgerking.com.cn';

function extractTarget(str) {
  let match = /action="(.*\.aspx\?c=\d{6})"/.exec(str);
  return match[1];
}

async function proceed(survey_code) {
  var res = await request.get(baseUrl);
  var target = extractTarget(res);
  if(target) console.log('Landing page OK');

  res = await request.post(`${baseUrl}/${target}`, {form: {JavaScriptEnabled: '1', FIP: 'True', AcceptCookies: 'Y', NextButton: '继续'}});
  var target = extractTarget(res);
  if(target) console.log('Survey started');

  const c = /^(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d)$/.exec(survey_code);
  res = await request.post(`${baseUrl}/${target}`, {form: {JavaScriptEnabled: '1', FIP: 'True', CN1: c[1], CN2: c[2], CN3: c[3], CN4: c[4], CN5: c[5], CN6: c[6], NextButton: '开始'}});
  var target = extractTarget(res);
  if(target) console.log('Survey code accepted');

  console.log(res);
  console.log(j);
}

module.exports.proceed = proceed;
