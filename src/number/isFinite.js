/**
 * Number.isFinite
 * 
 * 判断传入数据是否是 infinite
 */

export default function isFinite(number){
    if(number === undefined){
        throw TypeError('parameter can\'t null')
    }
    if( typeof number !== "number" ){
        return false;
    }
    return number === number +1;
}