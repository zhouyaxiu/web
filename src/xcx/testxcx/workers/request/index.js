const utils = require('./work')

console.log('hello worker')//2

worker.postMessage({
  msg: 'hello from worker: ' + utils.test(),
  buffer: utils.str2ab('hello arrayBuffer from worker')
})

worker.onMessage((msg) => {
  console.log('[Worker] on appservice message', msg)//5
  const buffer = msg.buffer
  console.log('[Worker] on appservice buffer length ', buffer)//6
  console.log('[Worker] on appservice buffer', utils.ab2str(buffer))//7
})