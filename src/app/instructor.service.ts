import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Instructor } from './instructor';
import { CalendarEvent } from './event';



@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private InstructorsUrl = 'http://localhost:8080/instructor/';
  private EventUrl = 'http://localhost:8080/event/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET instructors from the server */
  getInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(this.InstructorsUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Instructor[]>('getInstructors', []))
      );
  }

  getEvent(id:any): Observable<CalendarEvent> {
    return this.http.get<CalendarEvent>(this.EventUrl+`/${id}`)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<CalendarEvent>('getEvent'))
      );
  }

  createEvent(event: CalendarEvent): Observable<BigInteger> {
    return this.http.post<BigInteger>(this.EventUrl, event, this.httpOptions)
      .pipe(
        tap((newEvent: BigInteger) => this.log(`added CalendarEvent w/ id=${newEvent}`)),
        catchError(this.handleError<BigInteger>('Add CalendarEvent'))
      );
  }

  createInstructor(instructor: Instructor) : Observable<BigInteger>{
    return this.http.post<BigInteger>(this.InstructorsUrl, instructor, this.httpOptions)
      .pipe(
        tap((newInstructor: BigInteger) => this.log(`added Instructor w/ id=${newInstructor}`)),
        catchError(this.handleError<BigInteger>('Add Instructor'))
      );
  }

  updateEvent(event: CalendarEvent): Observable<BigInteger> {
    console.log("se actualioza");
    return this.http.post<BigInteger>(this.EventUrl+"update", event, this.httpOptions)
      .pipe(
        tap((newEvent: BigInteger) => this.log(`updated CalendarEvent w/ id=${newEvent}`)),
        catchError(this.handleError<BigInteger>('update CalendarEvent'))
      );
  }

  deleteEvent(id: number): Observable<BigInteger> {
    const url = `${this.EventUrl}${id}`;

    return this.http.delete<BigInteger>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted event id=${id}`)),
      catchError(this.handleError<BigInteger>('deleteEvent'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  log(name: any) {
    console.log(name)
  }



}
