class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

// 前序遍历：根 -> 左 -> 右
function preorderTraversal(root) {
    if (!root) return [];
    let stack = [root];
    let res = [];
    while (stack.length > 0) {
        let cur = stack.pop();
        res.push(cur.val);
        if (cur.right) stack.push(cur.right);
        if (cur.left) stack.push(cur.left);
    }
    return res;
}

// 中序遍历：左 -> 根 -> 右
function inorderTraversal(root) {
    if (!root) return [];
    let stack = [];
    let res = [];
    let current = root;
    while (current || stack.length > 0) {
        while (current) {
            // 先遍历左子树
            stack.push(current);
            current = current.left;
        }  

        current = stack.pop();
        res.push(current.val);
        current = current.right;
    }
    return res;
}

// 后序遍历：左 -> 右 -> 根
function postorderTraversal(root) {
    if (!root) return [];
    let stack = [root];
    let res = [];
    while (stack.length) {
        let cur = stack.pop();
        res.unshift(cur.val);
        if (cur.left) stack.push(cur.left);
        if (cur.right) stack.push(cur.right);
    }
    return res;
}