/**
 *  Array.from 
 * 将类似数组对象和可遍历对象转化为数组
 * 
 */
import isNaN from '../number/isNaN.js';
import isFinite from '../number/isFinite.js';

export default from  (function () {
    var toStr = Object.prototype.toString;

    // 判断参数是否是函数
    var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    }
    var toInteger = function ( value ) {
        var number = Number(value);
        if( isNaN(number) ){return 0;} // 不是数字返回 0 
        if(number === 0 || !isFinite(number) ){return number} // 是0 直接返回
        return (number > 0 ? 1 : -1 ) * Math.floor(Math.abs(number)); // 获取取整后的数字
    }
    // 最大安全数
    var maxSafeInteger = Math.pow(2, 53) -1;
    var toLength = function (value){
        var len = toInteger(value);
        return Math.min(Math.max(len, 0),maxSafeInteger); // 检查是否是最大安全数
    }
    var toItems = function ( value ) { // 可遍历数据 处理
        if( value.size > 0 && value.values){
            let values = value.values();
            var it = values.next()
            var o = [];
            while( !it.done ){
                o.push(it.value);
                it = values.next();
            }
            return o;
        }
        return Object(value);
    }

    return function from(arrayLike /*, mapFn, thisArg */) {
        var C = this;

        var items = toItems(arrayLike);

        if(arrayLike == null ){
            throw new TypeError("Array.from requires an array-like object - not null or undefined");
        }

        var mapFn = arguments.length > 1 ? arguments[1]: void undefined;
        var T;
        if( typeof mapFn !== 'undefined' ){
            if( !isCallable(mapFn) ){
                throw new TypeError('Array.from: when provided, the second argument must be a function');
            }
            if( arguments.length > 2){
                T = arguments[2];
            }
        }

        var len = toLength(items.length)

        var A = isCallable( C ) ?Object(new C( len )) : new Array( len );
        var k = 0;

        var kValue;
        while (k < len){
            kValue = items[k];
            if( mapFn ){
                A[k] = typeof T === 'undefined' ? mapFn(kValue, k) :mapFn.call(T, kValue,k)

            }else {
                A[k] = kValue;
            }
            k += 1;
        }
        A.length = len;
        return A;
    }
})()