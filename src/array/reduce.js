/**
 * reduce 隶属于 ES5
 * 
 * 说明： 对数组中的每个元素执行选定的callback函数
 * 
 * reduce 参数;
 *  1. callback：调用函数
 *  2. initialValue： （可选） 作为第一次调用callback时的第一个参数。如果没有提供initiaValue ，那么数组中的第一个元素将作为 callback的第一个参数
 * 
 * callback 包含四个参数
 * 1. previousValue ： 表示“上一次” callback 函数的返回值
 * 2. currentvalue： 数组遍历中正在处理的元素
 * 3. currentIndec ： （可选参数） 表示 currentValue 在数组中对应的索引，如果提供了 initiaValue ，则起始索引为0,否则为1
 * 4. array: (可选) 调用reduce 的数组
 */ 

export default function forEachReduce(fun, initialValue){
    typeof fun === 'undefined'? Error('callback can\'t null') : '';
    // Array 的this 就是调用此函数的数组

    let arr = this;
    
    // 这里把数组第一项提出来，所以运行时不能加第一项，如有第二个参数则把第一个算上
    let base = typeof initialValue === 'undefined'? arr[0] : initialValue; 
    let startPoint = typeof initialValue === 'undefined' ? 1 : 0;
    arr.slice(startPoint) // 去掉相应的位置的数组数据
            .forEach((val , index) => {
                base = fun(base, val, index + startPoint, arr);
            });
            
    return base;
}

/**
 * MDN polyfile
 */

if( !Array.prototype.reduce ) {
    Object.defineProperty(Array.prototype,'reduce',{
        value: function(callback /*,initiaValue */){
            if(this === null ){ // 没有数组 报错
                throw new TypeError( 'Array.prototype.reduce ' + 
                'called on null or undefined' );
            }
            if( typeof callback !== 'function'){ // 没有 callback 报错
                throw new TypeError( callback +
                    ' is not a function');
            }
            let o = Object(this); //改成对象

            let len = o.length >>> 0; // ? 具体作用呢

            let k = 0;
            let value;

            if( arguments.length >= 2){ //  初始字符串
                value = arguments[1];
            }else{
                while(k < len && !(k in o)){ // 对象为空时 && 右侧为true
                    k++;
                }
            
                if( k >= len ){ // k》0则为数组为空
                    throw new TypeError( 'Reduce of empty array ' +
                    'with no initial value' );
                }
                value = o[k++]; // value 在k++运算前赋值，所以是0[0]
            }
            while ( k< len ){ // k从 第二个对象开始遍历
                if( k in o){
                    value = callback(value, o[k], k, o)
                }
                k++;
            }
            return value;
        }
    })
}