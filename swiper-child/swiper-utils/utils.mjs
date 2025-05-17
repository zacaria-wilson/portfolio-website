export function cLog(...passedContent) { console.log(...passedContent) };
export let dLog = (...passedContent) => { console.log(this.name, ...passedContent) };
export let eLog = (...passedContent) => { console.error('Error:',...passedContent) };
export let now = () => {return Date.now()}