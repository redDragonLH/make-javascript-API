import { resolve } from "path";

/**
 * promise
 *   
 *  用于表示一个异步操作的最终状态，以及该异步操作的结果值
 * 
 * 描述：
 *      promise 对象是一个代理对象（代理一个值），被代理的值在promise 对象创建时可能是未知的，
 *  它允许你为异步操作的成功和失败分别绑定相应的处理方法。这让异步方法可以像同步方法那样返回值，
 *  但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的promise对象
 * 
 * 结论：
 *      Promise 构造函数返回一个Promise 对象实例，这个返回的promise 对象具有一个then方法。then 方法中，调用者可以定义两个参数，分别是onfulfilled 和 onrejected，
 *    它们都是函数类型，其中onfulfilled 通过参数，可以获取promise 对象resolved的值，onrejected获取 promise 对象的rejected的值
 * 
 *      Promise具有凝固性： 状态改变只能单向
 *      Promise 错误处理
 *      Promise 实例添加多个 then 处理
 */ 
/**
 * 处理返回值，返回值可能是Promise 或者 常规值
 * 
 * promise2：返回的promise 的实例
 * result：onfulfilled 或者 onrejected 方法
 * resolve：promise2 的 resolve 方法
 * reject：promise2 的 reject 方法
 */
const resolvePromise = function (promise2, result, resolve, reject){
    // 当 result 和 promise2 相等时，也就是说 onfulfilled 返回promise2时，进行 reject
    if(result === promise2) {
        reject(new TypeError( 'error due to circular reference' ))
    }
    // 是否已经执行过 onfulfilled 或者 onrejected 
    let consumed = false;
    let thenable;

    if( result instanceof Promise){
        if( result.status === 'pending' ){
            result.then(function(data) {
                resolvePromise(promise2, data, resolve, reject);
            },reject );
        } else {
            result.then(resolve, reject);
        }
        return
    }

    let isComplexResult = target => (typeof target === 'function' || typeof target === 'object') && (target !== null)

    // 如果返回的是疑似  Promise 类型
    if( isComplexResult(result) ) {
        try{
            thenable = result.then;
            // 如果返回的是 Promise 类型，具有 then 方法
            if (typeof thenable === 'function') {
                thenable.call(result, function(data){
                    if(consumed){
                        return
                    }
                    consumed = true;
                    return resolvePromise(promise2, data, resolve, reject)
                }, function(error){
                    if(consumed){
                        return
                    }
                    return reject(error);
                })
            } else {
                resolve(result);
            }
        } catch(e){
            if( consumed ){
                return
            }
            consumed = true;
            return reject(e);
        }
    }else{
        resolve( result )
    }
}
export default function Promise(executor) {
    this.status = 'pending';
    this.value = null;
    this.reason = null;
    this.onFulfilledArray = [];
    this.onRejectedArray = [];

    const resolve = value => {
        if(value instanceof Promise ) {
            return value.then(resolve, reject)
        }
        // 需要异步所以要放入任务队列 
        // MutationObserver  可以了解一下
        setTimeout(() => {
            if(this.status === 'pending'){
                this.value = value;
                this.status = 'fulfilled';
                this.onFulfilledArray.forEach(func => {
                    func(value);
                })
            }
        },0)
    }
    const reject = reason => {
        setTimeout(()=>{
            if( this.status === 'pending' ){
                this.reason = reason;
                this.status = 'rejected';
                this.onRejectedArray.forEach(func => {
                    func(reason)
                })
            }
        },0)
    }
    try { // 构造函数中出错，自动触发 promise 实例状态为rejected
        executor(resolve, reject); // 必定运行，然后保存数据
    } catch (e){
        reject(e);
    }
}
Promise.prototype.then = function(onfulfilled, onrejected ) {
    onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : data => data // 函数穿透，参数不是函数则改为默认返回函数
    onrejected = typeof onrejected === 'function' ? onrejected : error => { throw error }

    // Promise 2 将作为 then 方法的返回值
    let promise2;
    if( this.status === 'fulfilled' ) {
        return promise2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                try{
                    //这个新的promise2 resolved 的值为onfulfilled 的执行结果
                    let result = onfulfilled( this.value );
                    resolvePromise(promise2, result, resolve, reject)
                } catch( e ) {
                    reject( e );
                }
            }, 0)
        })
    }
    if( this.status === 'rejected' ) {
        return promise2 = new Promise((resolve, reject) => {
            setTimeout(()=> {
                try{
                    // 新的promise2 reject 的值为 onrejected 的执行结果
                    let result = onrejected( this.value );
                    resolvePromise(promise2, result, resolve, reject)
                } catch(e) {
                    reject(e);
                }
            })
        });
    }

    if( this.status === 'pending' ){
        return promise2 = new Promise( (resolve, reject) => {
            this.onFulfilledArray.push(()=> {
                try{
                    let result = onfulfilled(this.value);
                    resolvePromise(promise2, result, resolve, reject)

                } catch(e){
                    reject(e)
                }
            })
            this.onRejectedArray.push(()=>{
                try {
                    let result= onrejected(this.resolve)
                    resolvePromise(promise2, result, resolve, reject)
                }catch(e){
                    reject(e)
                }
            })
        })
    }
}
/**
 * catch 捕获错误
 * 
 * 这样then 不用写 错误回调函数，直接穿透到 catch
 */
Promise.prototype.catch = function ( catchFunc ) {
    return this.then(null,catchFunc);
}
/**
 * resolve 方法返回一个以给定值解析之后的Promise实例对象
 * 
 */

Promise.resolve = function( value ) {
    return new Promise( ( resolve, reject) => {
        resolve(value);
    })
}

Promise.reject = function(value) {
    return new Promise((resolve, reject) => {
        reject(value)
    })
}

/**
 * Promise.all 
 * 
 * 方法返回一个Promise 实例，此实例在参数内所以的 promise 都“完成(resolved)”或参数中不包含 promise 时回调完成(resolve)
 * 如果参数中 promise 有一个失败，此实例回调失败，失败原因是第一个失败 promise 的结果
 */

Promise.all = function( promiseArray ) { // 这个不能实例化再用，
    if( !Array.isArray(promiseArray) ) {
        throw new TypeError('The arguments should be an array!');
    }
    return new Promise((resolve,reject) => {
        try{ 
            let resultArray = [];
            const length = promiseArray.length;
            for (let index = 0; index < length; index++) { // 循环运行所有promise
                promiseArray[index].then(data => { // 单独调用，但是运行是异步的，挨个运行，数量判断也在挨个判断
                    resultArray.push(data);       // 就是不太好说这样 catch 能不能获取到异步reject错误

                    if( resultArray.length === length ){
                        resolve(resultArray);
                    }
                }, reject ); // 有失败的 reject 直接默认报错，代码跳转到catch
                
            }
        } catch(e){ // 出错直接返回错误信息(好像获取不到唉)
            reject(e);
        }
    })
}

Promise.race = function ( promiseArray) {
    if( !Array.isArray(promiseArray) ) {
        throw new TypeError('The arguments should be an array!') 
    }
    return new Promise( (resolve,reject) =>{
        try{
            const length = promiseArray.length;
            for (let index = 0; index < length; index++) {
                promiseArray[index].zhen(resolve, reject);
                
            }
        }catch(e){
            reject(e)
        }
    })
}