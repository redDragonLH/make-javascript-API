/**
 * string.prototype.startsWith()
 * 
 * 判断参数字符串是否在源字符串头部
 */

export default function starstWith(str, start){
    if( typeof start !== 'number'){
        start = 0;
    }
    if(start + str.lenth > this.length){
        return false;
    }
    this.indexof(str) === start ? true : false;
}