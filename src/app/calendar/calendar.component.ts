import { Component, OnInit } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { Instructor } from '../instructor';
import { CalendarEvent } from '../event';
import { InstructorService } from '../instructor.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';




@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  instructors: Instructor[] = [];
  calendarEvent = {} as CalendarEvent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    displayEventTime: false,
    dateClick: this.handleDateClick.bind(this),
    events: [],
    eventClick: this.handleEventClick.bind(this)
  };

  @ViewChild('content')
  private content: TemplateRef<any> | undefined;

  @ViewChild('createInstructor')
  private createInstructor: TemplateRef<any> | undefined;

  @ViewChild('updateEvent')
  private updateEvent: TemplateRef<any> | undefined;

  @ViewChild('calendar')
  private calendarComponent!: FullCalendarComponent;


  title = 'appBootstrap';
  closeResult: string = "";

  createEventForm = this.formBuilder.group({
    description: '',
    startDate: '',
    eventType:'',
    instructor: '',
    endDate: ''
  });


  updateEventForm = this.formBuilder.group({
    description: '',
    startDate: '',
    eventType:'',
    instructor: '',
    endDate: ''
  });

  createInstructorForm = this.formBuilder.group({
    name: '',
    LastName: '',
    BirthDate: ''
  });


  constructor(private instructorService: InstructorService, private modalService: NgbModal, private formBuilder: FormBuilder,) { }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-create-event' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.getInstructors();
  }


  getInstructors(): void {
    this.instructorService.getInstructors().subscribe(instructors => {

      this.instructors = instructors
      var calendarEvent: any[] = [];
      this.instructors.forEach(insturtor => {
        insturtor.color = this.getRandomColor();
        var events: CalendarEvent[] = insturtor.events;
        events.forEach(evento => {
          calendarEvent.push({ title: evento.description+": " + insturtor.name+" "+insturtor.lastName, start: evento.startDate, end: evento.endDate, backgroundColor: insturtor.color, id: evento.id });
        })
      }
      );
      this.calendarOptions.events = calendarEvent;

    });


  }


  handleDateClick(arg: any) {
    this.modalService.open(this.content);
    //alert('date click! ' + arg.dateStr)
  }

  handleEventClick(arg: any) {
    this.modalService.open(this.updateEvent)
    console.log(arg.event.id);
    this.instructorService.getEvent(arg.event.id).subscribe(eventSel => {
      console.log(eventSel);
      this.calendarEvent = eventSel;
      this.updateEventForm.value["description"]= eventSel.description;
    });

    //alert('date click! ' + arg.dateStr)
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  onSubmit(): void {
    console.log('the even has been created', this.createEventForm.value);
    let eventPost = {} as CalendarEvent;
    let InstructorPost = {} as Instructor;
    eventPost.description = this.createEventForm.value["description"];
    eventPost.eventType = this.createEventForm.value["eventType"];
    var monthStartDate = this.createEventForm.value["startDate"]["month"] + '';
    var dayStartDate = this.createEventForm.value["startDate"]["day"] + '';
    var monthEndtDate = this.createEventForm.value["endDate"]["month"] + '';
    var dayEndDate = this.createEventForm.value["endDate"]["day"] + '';
    eventPost.startDate = this.createEventForm.value["startDate"]["year"] + "-" + monthStartDate.padStart(2, "0") + "-" + dayStartDate.padStart(2, "0")+"T06:06:00.000+00:00";
    eventPost.endDate = this.createEventForm.value["endDate"]["year"] + "-" + monthEndtDate.padStart(2, "0") + "-" + dayEndDate.padStart(2, "0")+"T06:06:00.000+00:00";
    InstructorPost.id = this.createEventForm.value["instructor"]
    eventPost.instructor = InstructorPost;
    this.instructorService.createEvent(eventPost).subscribe(idEvent => {
      var colorEvent: string = "";
      this.instructors.map(function (instructor) {
        if (instructor.id == InstructorPost.id) {
          colorEvent = instructor.color;
        }
      });
      console.log("id creada: " + idEvent);
      let calendarApi = this.calendarComponent.getApi();
      calendarApi.addEvent({ title: eventPost.description, start: eventPost.startDate, end: eventPost.endDate, backgroundColor: colorEvent, id: idEvent + '' });
    });;
    this.createEventForm.reset();
  }

  onSubmitUpdateEvent(): void{
    console.log('the even has been updated', this.updateEventForm.value);
    if(this.updateEventForm.value["description"]!='' || this.updateEventForm.value["startDate"]!='' || this.updateEventForm.value["endDate"]!='' || this.updateEventForm.value["eventType"]!=''){
      let eventPost = {} as CalendarEvent;
      let InstructorPost = {} as Instructor;
      if(this.updateEventForm.value["description"]!=''){
        console.log("descripcion no es vacia");
        eventPost.description = this.updateEventForm.value["description"];
      }else{
        eventPost.description = this.calendarEvent.description;
      }
      if(this.updateEventForm.value["eventType"]!=''){
        console.log("descripcion no es vacia");
        eventPost.eventType = this.updateEventForm.value["eventType"];
      }else{
        eventPost.eventType = this.calendarEvent.eventType;
      }
      if(this.updateEventForm.value["startDate"]!=''){
        console.log("startDate no es vacia");
        var monthStartDate = this.updateEventForm.value["startDate"]["month"] + '';
        var dayStartDate = this.updateEventForm.value["startDate"]["day"] + '';
        eventPost.startDate = this.updateEventForm.value["startDate"]["year"] + "-" + monthStartDate.padStart(2, "0") + "-" + dayStartDate.padStart(2, "0")+"T06:06:00.000+00:00";
      }else{
        eventPost.startDate = this.calendarEvent.startDate;
      }
      if(this.updateEventForm.value["endDate"]!=''){
        console.log("endDate no es vacia");
        var monthEndtDate = this.updateEventForm.value["endDate"]["month"] + '';
        var dayEndDate = this.updateEventForm.value["endDate"]["day"] + '';
        eventPost.endDate = this.updateEventForm.value["endDate"]["year"] + "-" + monthEndtDate.padStart(2, "0") + "-" + dayEndDate.padStart(2, "0")+"T06:06:00.000+00:00";
      }else{
        eventPost.endDate = this.calendarEvent.endDate;
      }
      InstructorPost.id = this.calendarEvent.instructor.id
      eventPost.instructor = InstructorPost;
      eventPost.id =  this.calendarEvent.id;

      this.instructorService.updateEvent(eventPost).subscribe(idEvent => {
        var colorEvent: string = "";
        this.instructors.map(function (instructor) {
          if (instructor.id == InstructorPost.id) {
            colorEvent = instructor.color;
          }
        });
        this.getInstructors();
      });;

      this.updateEventForm.reset();
    }
  }


  onSubmitcreateInstructor(): void{
    console.log('the instructor has been created', this.createInstructorForm.value);
    let InstructorPost = {} as Instructor;
    InstructorPost.name = this.createInstructorForm.value["name"];
    InstructorPost.lastName = this.createInstructorForm.value["LastName"];

    var monthbirthDate = this.createInstructorForm.value["BirthDate"]["month"] + '';
    var daybirthDate = this.createInstructorForm.value["BirthDate"]["day"] + '';
    InstructorPost.birthDate = this.createInstructorForm.value["BirthDate"]["year"] + "-" + monthbirthDate.padStart(2, "0") + "-" + daybirthDate.padStart(2, "0")+"T06:06:00.000+00:00";


    this.instructorService.createInstructor(InstructorPost).subscribe(idInstructor => {
        console.log(idInstructor);
        this.getInstructors();
        this.createInstructorForm.reset();
    });;


  }

  deleteEvent():void{
    this.instructorService.deleteEvent(this.calendarEvent.id).subscribe(idEvent => {
      console.log(idEvent);
      this.modalService.dismissAll();
      this.getInstructors();
  });;
  }

}
