// 实现useState
/* const state = [];
const setters = [];
let first = true;
let index = 0;

const createSetter = (idx: number) => {
    return function (newVal) {
        state[idx] = newVal;
    }
}

const useState = (initialValue: T) => {
    if (first) {
        state.push(initialValue);
        setters.push(createSetter(index));
        first = false;
    }

    index++;
    return [state[index], setters[index]];
} */

let currentComponent = null;
let workInProgressHook = null;
let currentHook = null;

