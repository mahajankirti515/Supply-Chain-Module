import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { ResponsiveButton } from './ResponsiveButton';
import { useResponsive } from '../../design-system/useResponsive';

export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  facility: string;
  member: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  color?: string;
}

interface ResponsiveCalendarProps {
  events: CalendarEvent[];
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onDateChange?: (date: Date) => void;
  selectedDate: Date;
}

export function ResponsiveCalendar({
  events,
  view,
  onViewChange,
  onEventClick,
  onDateChange,
  selectedDate,
}: ResponsiveCalendarProps) {
  const { isMobile, isTablet } = useResponsive();

  const handlePrev = () => {
    const newDate = new Date(selectedDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    onDateChange?.(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange?.(newDate);
  };

  const formatHeaderDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      ...(view === 'day' && { day: 'numeric' }),
    };
    return selectedDate.toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--border)]">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <ResponsiveButton
            variant="ghost"
            size="sm"
            icon={<ChevronLeft className="w-5 h-5" />}
            onClick={handlePrev}
            iconOnly
          />
          <div className="font-semibold text-[var(--text-primary)] min-w-[180px] text-center">
            {formatHeaderDate()}
          </div>
          <ResponsiveButton
            variant="ghost"
            size="sm"
            icon={<ChevronRight className="w-5 h-5" />}
            onClick={handleNext}
            iconOnly
          />
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 bg-[var(--background-secondary)] rounded-lg p-1">
          {(['day', 'week', 'month'] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`
                px-3 py-1 rounded text-sm transition-all
                ${view === v
                  ? 'bg-white text-[var(--primary)] font-medium shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Body */}
      <div className="p-4">
        {view === 'day' && <DayView events={events} date={selectedDate} onEventClick={onEventClick} />}
        {view === 'week' && <WeekView events={events} startDate={selectedDate} onEventClick={onEventClick} />}
        {view === 'month' && <MonthView events={events} month={selectedDate} onEventClick={onEventClick} />}
      </div>
    </div>
  );
}

// Day View Component
function DayView({ events, date, onEventClick }: { events: CalendarEvent[]; date: Date; onEventClick?: (event: CalendarEvent) => void }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = events.filter(e => 
    e.start.toDateString() === date.toDateString()
  );

  return (
    <div className="space-y-2">
      {hours.map((hour) => {
        const hourEvents = dayEvents.filter(e => e.start.getHours() === hour);
        
        return (
          <div key={hour} className="flex gap-2 min-h-[60px] border-b border-[var(--border-light)]">
            <div className="w-16 text-sm text-[var(--text-secondary)] flex-shrink-0">
              {hour.toString().padStart(2, '0')}:00
            </div>
            <div className="flex-1 space-y-1">
              {hourEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className={`
                    p-2 rounded cursor-pointer transition-all
                    ${event.status === 'confirmed' ? 'bg-[var(--success-50)] border-l-4 border-[var(--success)]' : ''}
                    ${event.status === 'pending' ? 'bg-[var(--warning-50)] border-l-4 border-[var(--warning)]' : ''}
                    ${event.status === 'cancelled' ? 'bg-[var(--error-50)] border-l-4 border-[var(--error)]' : ''}
                    hover:shadow-md
                  `}
                >
                  <div className="font-medium text-sm text-[var(--text-primary)]">{event.title}</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                    {event.facility} • {event.member}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Week View Component
function WeekView({ events, startDate, onEventClick }: { events: CalendarEvent[]; startDate: Date; onEventClick?: (event: CalendarEvent) => void }) {
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startDate);
    day.setDate(day.getDate() - day.getDay() + i);
    return day;
  });

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-2 min-w-[800px]">
        {weekDays.map((day) => {
          const dayEvents = events.filter(e => 
            e.start.toDateString() === day.toDateString()
          );

          return (
            <div key={day.toString()} className="border border-[var(--border)] rounded p-2">
              <div className="text-center mb-2">
                <div className="text-xs text-[var(--text-secondary)]">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold ${
                  day.toDateString() === new Date().toDateString()
                    ? 'text-[var(--primary)]'
                    : 'text-[var(--text-primary)]'
                }`}>
                  {day.getDate()}
                </div>
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={`
                      text-xs p-1 rounded cursor-pointer
                      ${event.status === 'confirmed' ? 'bg-[var(--success-50)] text-[var(--success-700)]' : ''}
                      ${event.status === 'pending' ? 'bg-[var(--warning-50)] text-[var(--warning-700)]' : ''}
                      ${event.status === 'cancelled' ? 'bg-[var(--error-50)] text-[var(--error-700)]' : ''}
                    `}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-[var(--text-tertiary)] text-center">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Month View Component
function MonthView({ events, month, onEventClick }: { events: CalendarEvent[]; month: Date; onEventClick?: (event: CalendarEvent) => void }) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startingDayOfWeek + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return new Date(month.getFullYear(), month.getMonth(), dayNumber);
    }
    return null;
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-[var(--text-secondary)] py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="aspect-square" />;
          }

          const dayEvents = events.filter(e => 
            e.start.toDateString() === day.toDateString()
          );

          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`
                border border-[var(--border)] rounded p-2 aspect-square
                hover:border-[var(--primary)] transition-colors cursor-pointer
                ${isToday ? 'bg-[var(--primary-50)]' : 'bg-white'}
              `}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'
              }`}>
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={`
                      text-xs p-1 rounded truncate
                      ${event.status === 'confirmed' ? 'bg-[var(--success)]' : ''}
                      ${event.status === 'pending' ? 'bg-[var(--warning)]' : ''}
                      ${event.status === 'cancelled' ? 'bg-[var(--error)]' : ''}
                      text-white
                    `}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-[var(--text-tertiary)]">
                    +{dayEvents.length - 2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
