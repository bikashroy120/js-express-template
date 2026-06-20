import EventEmitter from 'events';
class MyEmitter extends EventEmitter {}
const emailEmitter = new MyEmitter();

export default emailEmitter;
