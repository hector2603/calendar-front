import { CalendarEvent } from './event';

export interface Instructor {
    id: number;
    name: string;
    lastName:string;
    birthDate:string;
    events:CalendarEvent[],
    duration:bigint,
    color:string
  }