'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BookingStatus, IBooking } from '../../types/booking.type';
import { useState } from 'react';
import BookingSessionDrawer from './BookingSessionDrawer';
import { translateBookingStatus } from '../../utils/booking-status';

interface Props {
    bookings: IBooking[];
}

export default function UpcomingBookingCalendar({ bookings }: Props) {
    const [open, setOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<IBooking | null>(null);

    const getColor = (status?: BookingStatus) => {
        switch (status) {
            case BookingStatus.CONFIRMED:
                return '#22c55e';
            case BookingStatus.PENDING:
                return '#f59e0b';
            case BookingStatus.REJECTED:
                return '#ef4444';
            case BookingStatus.CANCELLED:
                return '#6b7280';
            default:
                return '#3b82f6';
        }
    };

    const events = bookings.map((booking) => {
        const dateObj = new Date(booking.bookingDate);
        const dateOnly = dateObj.toISOString().split('T')[0];
        const statusColor = getColor(booking.status);

        return {
            id: booking._id,
            title: booking.contactName,
            start: `${dateOnly}T${booking.startTime}:00`,
            end: `${dateOnly}T${booking.endTime}:00`,
            extendedProps: booking,
            // display: 'background',
            backgroundColor: statusColor,
            borderColor: statusColor,
            textColor: '#ffffff',
        };
    });

    const handleCloseDrawer = () => {
        setOpen(false);
        setSelectedSession(null);
    };

    return (
        <div className="rounded-xl bg-white p-4 upcoming-booking-calendar">
            <style jsx global>{`
                .upcoming-booking-calendar .fc-daygrid-event {
                    margin: 3px 0px !important;
                    padding: 4px 6px !important;
                    border-radius: 4px !important;
                    border: none !important;
                }

                .upcoming-booking-calendar .fc-event-time {
                    display: none !important;
                }
            `}</style>

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                height="auto"
                events={events}
                eventClick={(info) => {
                    setSelectedSession(info.event.extendedProps as IBooking);

                    setOpen(true);
                }}
                eventDisplay="block"
                eventClassNames="text-xs font-medium cursor-pointer shadow-sm border-none"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                eventContent={(eventInfo) => {
                    const { contactName, startTime, endTime, status } = eventInfo.event
                        .extendedProps as IBooking;
                    return (
                        <div className="w-full flex flex-col items-start gap-0.5 p-0.5 overflow-hidden">
                            <span className="font-bold text-[13px] text-white truncate w-full block">
                                {contactName}
                            </span>

                            <div className="flex flex-wrap items-center gap-1 text-[10px] w-full">
                                <span className="opacity-95 bg-white/25 px-1 py-0.5 rounded font-medium text-[9px] text-white whitespace-nowrap">
                                    {translateBookingStatus(status)}
                                </span>

                                <span className="opacity-90 bg-black/15 px-1 py-0.5 rounded text-white whitespace-nowrap">
                                    {startTime} - {endTime}
                                </span>
                            </div>
                        </div>
                    );
                }}
            />

            <BookingSessionDrawer
                session={selectedSession}
                open={open}
                onClose={handleCloseDrawer}
            />
        </div>
    );
}
