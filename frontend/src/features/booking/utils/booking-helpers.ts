export function formatMoney(amount: number) {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}
