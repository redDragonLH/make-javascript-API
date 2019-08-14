/**
 * Number.isNaN
 * 
 * 判断数据是否 NaN
 */

export default function isNaN(number) {
    if(number === undefined){
        throw TypeError('parameter can\'t null')
    }
    if(typeof number !== 'number'){
        throw TypeError('parameter not a number')
    }
    return number !== number;
}
/**
 * 示例：
 * isNaN(NaN)
 * isNaN(15)
 * isNaN('true'/0)
 * isNaN('true'/'true'                                                      )
 */ 