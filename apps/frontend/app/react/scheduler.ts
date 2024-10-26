// 优先级相关常量
export const NoPriority = 0;
export const ImmediatePriority = 1;
export const UserBlockingPriority = 2;
export const NormalPriority = 3;
export const LowPriority = 4;
export const IdlePriority = 5;

// 任务队列
const taskQueue = [];
const timerQueue = [];

// 当前执行的任务
let currentTask = null;

// 调度器是否正在运行
let isHostCallbackScheduled = false;

//  
let isMessageLoopRunning = false;
let scheduledhostCallback = null;

// 主运行函数
function requestHostCallback(callback: Function) {
    isHostCallbackScheduled = true;
    schedulePerformWorkUntilDeadline();
}

function schedulePerformWorkUntilDeadline() {
    if (typeof setImmediate !== 'undefined') {
        setImmediate(performWorkUntilDeadline)
    } else if (typeof MessageChannel !== 'undefined') {
        const channel = new MessageChannel();
        const port = channel.port2;
        channel.port1.onmessage = performWorkUntilDeadline;
        port.postMessage(null);
    } else if (typeof setTimeout !== 'undefined') {
        setTimeout(performWorkUntilDeadline, 0)
    }
}

function performWorkUntilDeadline() {
    if (scheduledhostCallback !== null) {
        const currentTime = getCurrentTime();
        const hasTimeRemaining = true;
        let hasMoreWork = true;
        try {
            hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
        } finally {
            if (hasMoreWork) {
                schedulePerformWorkUntilDeadline();
            } else {
                isMessageLoopRunning = false;
                scheduledhostCallback = false;
            }
        }
    } else {
        isMessageLoopRunning = false;
    }
}

function scheduledHostCallback () {

}
