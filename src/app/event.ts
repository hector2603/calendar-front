import { Instructor } from "./instructor";

export interface CalendarEvent {
    id: number;
    startDate: string;
    endDate:string;
    description:string;
    instructor:Instructor;
}