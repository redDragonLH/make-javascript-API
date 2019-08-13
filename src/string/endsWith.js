/**
 * string.prototype.endsWith()
 * 
 * 判断一个字符串是否在另一个字符串的末尾
 */

export default function endsWith(str,start){
    if( typeof start !== 'number' ){
        start = this.length;
    }
    return this.substring( start - str.length, start) === str;
}