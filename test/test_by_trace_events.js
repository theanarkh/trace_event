const { phase, trace } = require('../');
const { createTracing } = require('trace_events');
createTracing({categories: ['test']}).enable();
trace(phase.TRACE_EVENT_PHASE_BEGIN, 'test', 'a', 0, {name: 'hello'});
trace(phase.TRACE_EVENT_PHASE_END, 'test', 'a', 0, {name: 'world'});