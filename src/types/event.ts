export enum RecurrenceFrequency {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum WeekDay {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  recurrence_frequency: RecurrenceFrequency;
  recurrence_interval?: number;
  recurrence_days?: number[];
  recurrence_day_of_month?: number;
  recurrence_week_of_month?: number;
  recurrence_day_of_week?: number;
  recurrence_end_date?: Date;
  recurrence_count?: number;
  is_all_day: boolean;
  location?: string;
  color?: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface EventFormData {
  id?: string;
  title: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  recurrence_frequency: RecurrenceFrequency;
  recurrence_interval?: number;
  recurrence_days?: number[];
  recurrence_day_of_month?: number;
  recurrence_week_of_month?: number;
  recurrence_day_of_week?: number;
  recurrence_end_date?: Date;
  recurrence_count?: number;
  is_all_day: boolean;
  location?: string;
  color?: string;
} 