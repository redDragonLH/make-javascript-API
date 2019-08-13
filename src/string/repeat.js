/*
* string.prototype.repeat()
* 表示将原字符串重复几次
*/

export default function repeat(n) {
    if(typeof n !== 'number' ){
        throw TypeError('error')
    }
    // 判断 参数复数
    // 判断参数无穷大
    // 判断字符串长度
    let string = this;
    for (let index = 0; index < n; index++) {
        string += this
        
    }
    return string;
}