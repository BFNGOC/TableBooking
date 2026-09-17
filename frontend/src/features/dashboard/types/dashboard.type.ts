export type DashboardPeriod = 'week' | 'month';

export interface DashboardChange {
    difference: number;
    percentage: number;
}

export interface DashboardMetric {
    current: number;
    previous: number;
    change: DashboardChange;
}

export interface BookingTrendItem {
    day: number;
    label: string;
    total: number;
}

export interface BookingStatusStats {
    pending: number;
    confirmed: number;
    checkedIn: number;
    noShow: number;
    cancelled: number;
}

export interface UpcomingBooking {
    _id?: string;
    contactName?: string;
    contactPhone?: string;
    guestCount: number;
    bookingDate: string | Date;
    startTime: string;
    endTime: string;
    status?: string;
    paymentStatus?: string;
}

export interface DashboardResponse {
    booking: DashboardMetric;
    revenue: DashboardMetric;
    payingCustomer: DashboardMetric;
    cancellation: DashboardMetric;
    bookingTrend: BookingTrendItem[];
    bookingStatus: BookingStatusStats;
    upcomingBookings: UpcomingBooking[];
}
