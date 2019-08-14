/**
 * Array.of()
 * 
 * 将一组值转换为数组
 */

export default function of() {
    return [].slice.call(arguments)
}