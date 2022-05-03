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

async function test() {
    const events = [];
    session.on('NodeTracing.dataCollected', (n) => {
        events.push(...n.params.value);
    });
    session.on('NodeTracing.tracingComplete', () => {});
    await post('NodeTracing.start', { traceConfig: { includedCategories: ['test'] } });

    trace(phase.TRACE_EVENT_PHASE_BEGIN, 'test', 'a', 0, {name: 'hello'});
    trace(phase.TRACE_EVENT_PHASE_END, 'test', 'a', 0, {name: 'world'});

    await post('NodeTracing.stop');
    console.log(events.filter((t) => null !== /test/.exec(t.cat)))
}

test();