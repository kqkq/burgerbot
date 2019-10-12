const req = require('request-promise-native');
const j = req.jar();
const request = req.defaults({jar: j});
const baseUrl = 'https://tellburgerking.com.cn';

const survey_data = [{
    R001000: '2',
    IoNF: '2',
    PostedFNS: 'S001000|R001000'
  }, {
    R000256: '2',
    IoNF: '5',
    PostedFNS: 'R000256'
  }, {
    R002000: '1',
    IoNF: '6',
    PostedFNS: 'R002000'
  }, null, null, null, null, null, {
    R041000: '2',
    IoNF: '133',
    PostedFNS: 'R041000'
  }, null, {
    S000122: '上菜速度快。食品味道好。餐厅位置方便，卫生条件好。',
    IoNF: '155',
    PostedFNS: 'S000122'
  }, {
    R000091: '1',
    IoNF: '228',
    PostedFNS: 'R000200|R000197|R000174|R000198|R000199|R000195|R000196|R000222|R000221|R000089|R000219|R000218|R000090|R000091'
  }, {
    R000097: '1',
    IoNF: '263',
    PostedFNS: 'R000243|R000237|R000241|R000242|R000240|R000239|R000238|R000244|R000245|R000096|R000097'
  }, {
    R049000: '1',
    IoNF: '280',
    PostedFNS: 'R049000'
  }, null, {
    R060000: '2',
    IoNF: '283',
    PostedFNS: 'R060000'
  }, {
    R068000: '1',
    IoNF: '284',
    PostedFNS: 'R068000'
  }, {
    R069000: '9',
    R070000: '9',
    IoNF: '309',
    PostedFNS: 'R069000|R070000'
  }
];

function extractTarget(str) {
  let match = /action="(.*\.aspx\?c=\d{6})"/.exec(str);
  return match[1];
}

function makeRequest(res) {
  let ionf = /<input type="hidden" name="IoNF" value="(\d*)" id="IoNF" \/>/.exec(res)[1];
  let fns = /<input type="hidden" name="PostedFNS" value="(.*)" id="PostedFNS" \/>/.exec(res)[1];
  let ret = {IoNF: ionf, PostedFNS: fns};
  fns.split('|').forEach(e => ret[e] = '5');
  return ret;
}

async function proceed(survey_code) {
  let res = await request.get(baseUrl);
  let target = extractTarget(res);
  if(target) console.log('Landing page OK');

  res = await request.post(`${baseUrl}/${target}`, {form: {JavaScriptEnabled: '1', FIP: 'True', AcceptCookies: 'Y', NextButton: '继续'}});
  target = extractTarget(res);
  if(target) console.log('Survey started');

  const c = /^(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d)$/.exec(survey_code);
  res = await request.post(`${baseUrl}/${target}`, {form: {JavaScriptEnabled: '1', FIP: 'True', CN1: c[1], CN2: c[2], CN3: c[3], CN4: c[4], CN5: c[5], CN6: c[6], NextButton: '开始'}});
  target = extractTarget(res);
  if(target) console.log('Survey code accepted');

  for(var i = 0; i < survey_data.length; i++) {
    let post_data = survey_data[i] ? survey_data[i] : makeRequest(res);
    res = await request.post(`${baseUrl}/${target}`, {form: post_data});
    let per = /<div id="ProgressPercentage">(\d*)%<\/div>/.exec(res)[1];
    target = extractTarget(res);
    if(target) console.log(`Survey page ${i + 1} / ${survey_data.length} (${per}%) submitted`);
  }

  res = await request.get(`${baseUrl}/${target}`);
  let val_code = /<p class="ValCode">验证代码：(.*)<\/p>/.exec(res)[1];
  if(val_code) console.log('Validation code issued');

  return val_code;
}

module.exports.proceed = proceed;
