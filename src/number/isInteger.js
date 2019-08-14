/**
 * Number.isInteger
 * 
 * 判断数字是否整数（小数点后边全是零的也算）
 */
import isFinite from './isFinite.js';

export default function isInteger(number) {
    return typeof number === "number" && 
            isFinite(number) &&
            Math.floor(number) === number;
}  