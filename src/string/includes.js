/**
 * string.prototype.includes
 * 
 * 检查字符串是否包含另一个字符串
 */ 

export default function includes(str,start) {
    if(typeof start !== 'number'){
        start = 0;
    }
    if(start + str.length > this.length){
        return false;
    } else {
        return this.indexOf(str,start) !== -1;
    }
}