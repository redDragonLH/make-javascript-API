/**
 * string.prototype.fromCodePoint 从Unicode 返回对应字符
 */

export default function fromCodePoint(){
    var code = arguments.length === 1 ?  arguments[0] : Array.apply(null,arguments).join('')
    return eval("'" + code +"'"); // eval 将传入的字符串当作 js 代码进行执行
}
