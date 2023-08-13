export default class Queue {
    constructor() { this.q = []; }

    items() { return this.q; }

    enqueue(item) { return this.q.push(item); }
    
    dequeue(item) { return this.q.shift(item); }
    
    size() { return this.q.length; }
    
    setItems() { return this.q = items }
}