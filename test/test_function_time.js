const { phase, trace } = require('..');
const { Session } = require('inspector');
const session = new Session();
session.connect();

function post(message, data) {
    return new Promise((resolve, reject) => {
      session.post(message, data, (err, result) => {
        if (err)
          reject(new Error(JSON.stringify(err)));
        else
          resolve(result);
      });
    });
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
async function test() {
    const events = [];
    session.on('NodeTracing.dataCollected', (n) => {
        events.push(...n.params.value);
    });
    session.on('NodeTracing.tracingComplete', () => {});
    await post('NodeTracing.start', { traceConfig: { includedCategories: ['test'] } });

    trace(phase.TRACE_EVENT_PHASE_BEGIN, 'test', 'sleep', 0);
    await sleep(3000);
    trace(phase.TRACE_EVENT_PHASE_END, 'test', 'sleep', 0);

    await post('NodeTracing.stop');
    const data = events.filter((t) => null !== /test/.exec(t.cat));
    console.log((data[1].ts - data[0].ts) / 1000)
}

test();