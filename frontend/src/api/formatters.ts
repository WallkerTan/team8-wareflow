import dayjs from "dayjs";

/**
 * Định dạng số thành tiền tệ VND (VD: 100.000 đ)
 */
export const formatCurrency = (value?: number | null): string => {
    if (value === undefined || value === null || isNaN(Number(value))) {
        return "0 đ";
    }
    return new Intl.NumberFormat("vi-VN").format(Number(value)) + " đ";
};

/**
 * Định dạng ngày giờ: DD/MM/YYYY HH:mm
 */
export const formatDateTime = (dateStr?: string | null): string => {
    if (!dateStr) return "-";
    const d = dayjs(dateStr);
    if (!d.isValid()) return "-";
    return d.format("DD/MM/YYYY HH:mm");
};

/**
 * Định dạng ngày: DD/MM/YYYY
 */
export const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return "-";
    const d = dayjs(dateStr);
    if (!d.isValid()) return "-";
    return d.format("DD/MM/YYYY");
};
