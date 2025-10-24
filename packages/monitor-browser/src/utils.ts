/**
 * 获取高精度时间戳
 * 优先使用 performance.now() + performance.timeOrigin，如果不支持则回退到 Date.now()
 * @returns 时间戳（毫秒）
 */
export function getTimestamp(): number {
    return typeof performance !== 'undefined' && typeof performance.now === 'function' && typeof performance.timeOrigin === 'number'
        ? performance.now() + performance.timeOrigin
        : Date.now();
}

/**
 * 将高精度时间戳格式化为指定格式（默认 'YYYY/MM/DD hh:mm:ss.SSS'），支持占位符：YYYY, MM, DD, hh, mm, ss, SSS
 * @param format 可选的格式字符串，默认为 'YYYY/MM/DD hh:mm:ss.SSS'
 * @param timestamp 可选的时间戳（毫秒），不传则使用 getTimestamp()
 */
export function formatTimestamp(format: string = 'YYYY/MM/DD hh:mm:ss.SSS', timestamp?: number,): string {
    const ts = typeof timestamp === 'number' ? timestamp : getTimestamp();
    const d = new Date(Math.floor(ts));
    const pad = (n: number, len = 2) => n.toString().padStart(len, '0');
    const year = d.getFullYear().toString();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const minute = pad(d.getMinutes());
    const second = pad(d.getSeconds());
    const ms = pad(d.getMilliseconds(), 3);

    // 简单的 token 替换
    return format
        .replace(/YYYY/g, year)
        .replace(/MM/g, month)
        .replace(/DD/g, day)
        .replace(/hh/g, hour)
        .replace(/mm/g, minute)
        .replace(/ss/g, second)
        .replace(/SSS/g, ms);
}