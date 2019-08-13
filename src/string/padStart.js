/**
 * string.prototype.padStart()
 * 
 * 字符串头部补全
 */


function pad(thisStr,count,str) {
    
    let length = count-thisStr.length;
    let repeatStr = '';
    let i= 0;
    for (let index = 0; index < length; index++) {
        
        if(i >= str.length){
            i = 0;
        }
        repeatStr += str[i];
        i++
    }
    return repeatStr;
}
function padStart(count,str){
    if(this.length >= count){
        return this;
    }
    return pad(this, count, str) + this;
}
/**
 * string.prototype.padEnd()
 * 字符串尾部补全
 */
function padEnd(count,str){
    if(this.length >= count){
        return this;
    }
    return this + pad(this, count, str) ;
}
export{
    padStart,
    padEnd,
}