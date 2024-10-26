const memorizedState: Array<T> = [];
const effectDestory = [];
let _idx = 0;

/**
 * 模拟实现 useEffect
 * // deps 的不同对应着不同的情况，
 // 1. deps 不存在时：每次 state 的更新，都需要执⾏ callback
 // 2. deps 存在，但数组为空时，只需要在挂载也就是初次渲染时执⾏callback
 // 3. deps 存在且有依赖项，则对应的依赖性更新时才执⾏ callback
 * @param {Function} callback 回调函数
 * @param {Array} deps 依赖
**/ 
export function useEffect(callback: Function, deps: Array<T>) {
    if (Object.prototype.toString.call(deps) === '[object Array]') {
        throw new Error('useEffect second argument must be an array');
    }
    const memorizedDeps = memorizedState[_idx];
    if (!memorizedDeps) {
        const destory = callback();
        memorizedState[_idx] = deps;
        if (typeof destory === 'function') {
            effectDestory.push(destory);
        }
    } else {
        if (!deps) {
            callback();
        } else {
            const hasChanged = deps.some((dep, idx) => dep!== memorizedDeps[idx]);
            if (hasChanged) {
                callback();
            }
            memorizedDeps[_idx] = deps;
        }
    }
    _idx++;
}