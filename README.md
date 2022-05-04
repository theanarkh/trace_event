# v8_trace_event
trace event by V8 `trace` API, see https://github.com/nodejs/node/pull/42462 and https://nodejs.org/dist/latest-v18.x/docs/api/tracing.html .

# install
```
npm i v8_trace_event --save
```

# use
compute cost time of function by trace event system, and [more](https://github.com/theanarkh/trace_event/tree/main/test)
```
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
```
