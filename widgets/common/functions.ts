// hàm format số dùng cho tất cả các hiển thị số trong application

export function mathRound(rawNumber: number, roundedNumber: number = 2) {
  if (rawNumber === null || rawNumber === undefined) return null;
  return (
    Math.round((rawNumber + Number.EPSILON) * Math.pow(10, roundedNumber)) /
    Math.pow(10, roundedNumber)
  );
}
export function numberWithCommas(n: number) {
  if (n === null || n === undefined) return '';
  const parts = n.toString().split('.');
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (parts[1] ? '.' + parts[1] : '')
  );
}
