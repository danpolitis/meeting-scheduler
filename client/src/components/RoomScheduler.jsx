import React, { useState, setState } from 'react';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import Scheduler, { Editing, View } from 'devextreme-react/scheduler';
import AppointmentTemplate from './AppointmentTemplate.jsx'
import axios from 'axios';

function handleErrors(response) {
  if (!response.ok) {
      throw Error(response.statusText);
  }
  return response;
}

//maps CRUD operation to node api
const meetings = new DataSource({
  key: 'id',
  loadMode: 'raw',
  load: () => {
    let roomId = document.getElementById("schedulerWrapper").attributes.roomid.value
    return fetch(`/meetings/${roomId}`)
    .then(handleErrors)
    .then(response => response.json())
    .catch(() => { throw 'Network error' });
  },
  insert: (values) => {
    return fetch('/meetings', {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then(handleErrors)
  },
  remove: (key) => {
    return fetch(`/meetings/${key}`, {
      method: "DELETE"
    })
    .then(handleErrors)
  }
});

const remainingDiscountHours = (hours, discountHours) => {
  if (discountHours > hours) {
    return discountHours - hours;
  } else {
    return 0;
  }
}

const remainingUnpaidHours = (hours, discountHours) => {
  if (discountHours >= hours) {
    return 0;
  } else {
    return hours - discountHours;
  }
}

const remainingCredit = (price, credit) => {
  if (price >= credit) {
    return 0;
  } else {
    return credit - price;
  }
}

const calculateHours = (endDate, startDate) => {
  let eDate = new Date(endDate);
  let sDate = new Date(startDate);
  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30 ,31];

  //calculate hours if start/end are seperate months else if start/end are different days else same day
  if (eDate.getMonth() !== sDate.getMonth()){
    let totalDays = daysInMonth[sDate.getMonth()] - sDate.getDate() + eDate.getDate()
    return ((new Date(endDate)- new Date(startDate))/3600000 - (15 * totalDays))
  } else if (eDate.getDate() !== sDate.getDate()) {
    let totalDays = eDate.getDate() - sDate.getDate()
    return ((new Date(endDate)- new Date(startDate))/3600000 - (15 * totalDays))
  } else {
    return ((new Date(endDate)- new Date(startDate))/3600000)
  }

}

const calculatePrice = (hours, rate, credit, freeHours, roomType, halfHourlyRate, halfDayRate, fullDayRate) => {
  let price;
  let remainingFreeHours = remainingDiscountHours(hours, freeHours);
  let hoursUsed = freeHours - remainingFreeHours
  hours = remainingUnpaidHours(hours, freeHours);
  if (hours === 0) {
    if (hoursUsed > 4.5) {
      return [0, remainingFreeHours, credit, hoursUsed, 0]
    } else {
      return [0, remainingFreeHours, credit, hoursUsed, 0]
    }
  }
  if(roomType === 'office'){
    hours = hours / 4.5
    console.log(hours)
    if (hours % 2 === 0) {
      price = hours/2 * 150
    } else {
      price = Math.floor(hours/2) * 150 + 90
    }
    console.log(price)
  } else {
    price = halfHourlyRate * hours/(.5)
  }
  let leftoverCredit = remainingCredit(price, credit);
  let creditUsed = credit - leftoverCredit;
  if (price > credit) {
    price = price - credit;
  } else {
    price = 0;
  }
  price = price * rate;
  return [price, remainingFreeHours, leftoverCredit, hoursUsed, creditUsed];
}

class RoomScheduler extends React.Component {
  constructor(props) {
    super(props);

    this.onAppointmentFormOpening = this.onAppointmentFormOpening.bind(this)
  }

  onAppointmentFormOpening =  (e) => {
    e.form.option('items[0].items[1].items[0].editorOptions.type', 'datetime')
    e.form.option('items[0].items[1].items[2].editorOptions.type', 'datetime')
    e.form.option('items[0].items[2].items[1].visible', false)
    e.form.option('items[0].items[0].visible', false)

    //checks for conflicts if other meetings exist and the formOpening event is not for an existing appointment
    if (e.component._preparedItems !== undefined && e.form.option('readOnly') === false) {

      for (var i = 0; i < e.component._preparedItems.length; i++) {
        let currentStartDate = new Date(e.component._preparedItems[i].rawAppointment.startDate)
        let currentEndDate = new Date(e.component._preparedItems[i].rawAppointment.endDate)
        let newAppointmentDate = new Date(e.appointmentData.startDate)
        //checks for conflicts
        if ((e.appointmentData.startDate < e.component._preparedItems[i].rawAppointment.startDate) && (e.appointmentData.endDate > e.component._preparedItems[i].rawAppointment.startDate)) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
          break;
        }
        //checks for conflicts
        if (e.appointmentData.startDate > e.component._preparedItems[i].rawAppointment.startDate && e.appointmentData.startDate < e.component._preparedItems[i].rawAppointment.endDate) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
          break;
        }
        if (e.appointmentData.startDate === e.component._preparedItems[i].rawAppointment.startDate) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
          break;
        }

        //checks for conflicts with all day appointments
        if ((currentStartDate.getDate() === newAppointmentDate.getDate() && currentStartDate.getMonth() === newAppointmentDate.getMonth() && currentStartDate.getYear() === newAppointmentDate.getYear()) && (e.component._preparedItems[i].allDay === true)) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
          break;
        }
        if ((currentEndDate.getDate() === newAppointmentDate.getDate() && currentEndDate.getMonth() === newAppointmentDate.getMonth() && currentEndDate.getYear() === newAppointmentDate.getYear()) && (e.component._preparedItems[i].allDay === true)) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
          break;
        }
      }
    }
    //adds the appointment information to the appointment form
    if (e.appointmentData.hoursUsed !== undefined) {
      e.popup.option('showTitle', true);
      e.popup.option('titleTemplate', `Final Price: $${e.appointmentData.price}, Free Hours Used: ${e.appointmentData.hoursUsed} hours, Credit Used: $${e.appointmentData.creditsUsed}`)
    } else {
      let price;
      let sDate = new Date(e.appointmentData.startDate)
      let eDate = new Date(e.appointmentData.endDate)
      //calculates price for all day else calculates normally
      if (e.appointmentData.allDay === true){
        let allDayHours = (eDate.getDate() - sDate.getDate() + 1) * 9
        price =(calculatePrice(allDayHours, this.props.rate, this.props.credit, this.props.freeHours, this.props.roomType, this.props.halfHourlyRate, this.props.halfDayRate, this.props.fullDayRate))
      } else {

        price =(calculatePrice(calculateHours(e.appointmentData.endDate, e.appointmentData.startDate), this.props.rate, this.props.credit, this.props.freeHours, this.props.roomType, this.props.halfHourlyRate, this.props.halfDayRate, this.props.fullDayRate))
      }
      e.popup.option('showTitle', true);
      e.popup.option('titleTemplate', `Final Price: $${price[0]}, Free Hours Remaining: ${price[1]} hours, Credit Remaining: $${price[2]}, Free Hours Used: ${price[3]} hours, Credit Used: $${price[4]}`)
    }
  }

  onAppointmentAdding = (e) => {
    //ensures that appointments are booked in 30 minute intervals
    if (calculateHours(e.appointmentData.endDate, e.appointmentData.startDate) % 0.5 !== 0 && this.props.roomType === 'meeting') {
      e.cancel = true;
      alert('Meeting room appointments must be booked in 30 minute increments.')
    }
    //ensures that appointments start between 8:00 and 5:00
    if (e.appointmentData.allDay === false) {
      let sDate = new Date(e.appointmentData.startDate)
      let eDate = new Date(e.appointmentData.endDate)
      if (sDate.getHours() < 8 || sDate.getHours() >= 17 || eDate.getHours() < 8 || eDate.getHours() > 17 || (eDate.getHours() === 17 && eDate.getMinutes() > 0)) {
        e.cancel = true;
        alert('Appointments can only be booked between 8:00 am and 5:00 pm.')
      }
    }

    if (e.component._preparedItems !== undefined) {
      for (var i = 0; i < e.component._preparedItems.length; i++) {
        let currentStartDate = new Date(e.component._preparedItems[i].rawAppointment.startDate)
        let newAppointmentDate = new Date(e.appointmentData.startDate)
        //checks for conflicts
        if ((e.appointmentData.startDate < e.component._preparedItems[i].rawAppointment.startDate) && (e.appointmentData.endDate > e.component._preparedItems[i].rawAppointment.startDate)) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
          break;
        }
        //checks for conflicts
        if (e.appointmentData.startDate > e.component._preparedItems[i].rawAppointment. startDate && e.appointmentData.startDate < e.component._preparedItems[i].rawAppointment.endDate) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
          break;
        }
        if (e.appointmentData.startDate === e.component._preparedItems[i].rawAppointment. startDate) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
          break;
        }
        //checks for all day conflicts
        if ((currentStartDate.getDate() === newAppointmentDate.getDate() && currentStartDate.getMonth() === newAppointmentDate.getMonth() && currentStartDate.getYear() === newAppointmentDate.getYear()) && (e.component._preparedItems[i].allDay === true)) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
          break;
        }
      }
    }

    let start = new Date(e.appointmentData.startDate)
    //ensures that office appointments either start at 8:00am or 12:30pm
    if (this.props.roomType === 'office' && e.appointmentData.allDay === false) {
      if (start.getHours() !== 8) {
        if (start.getHours() !== 12 || start.getMinutes() !== 30) {
          e.cancel = true;
          alert('Day office appointments must start at 8:00 am or 12:30 pm.')
        }
      }
      if (start.getHours() !== 12) {
        if (start.getHours() !== 8 || start.getMinutes() !== 0) {
          e.cancel = true;
          alert('Day office appointments must start at 8:00 am or 12:30 pm.')
        }
      }
    }
    //ensures that office appointments are only booked in half day increments
    if (calculateHours(e.appointmentData.endDate, e.appointmentData.startDate) % 4.5 !== 0 && this.props.roomType === 'office') {
      e.cancel = true;
      alert('Day office appointments must be booked for either a half day(starting at 8 or 12:30) or a full day(starting at 8).')
    }
    //calculates price for allDay else calculates normal price
    let price;
    if (e.appointmentData.allDay === true){
      price =(calculatePrice(9, this.props.rate, this.props.credit, this.props.freeHours, this.props.roomType, this.props.halfHourlyRate, this.props.halfDayRate, this.props.fullDayRate))
    } else {
      price =(calculatePrice(calculateHours(e.appointmentData.endDate, e.appointmentData.startDate), this.props.rate, this.props.credit, this.props.freeHours, this.props.roomType, this.props.halfHourlyRate, this.props.halfDayRate, this.props.fullDayRate));
    }
    //assigns data to appointment object for storage in DB
    e.appointmentData.price = price[0];
    e.appointmentData.hoursUsed = price[3];
    e.appointmentData.creditsUsed = price[4];
    e.appointmentData.text = this.props.customerName;
    e.appointmentData.roomId = this.props.roomId;
  }
  //reload meetings after adding appointments
  onAppointmentAdded = (e) => {
    meetings.reload()
    this.props.getCustomers()
  }
  //relaod meetings after deleting appointments
  onAppointmentDeleted = (e) => {
    meetings.reload()
    this.props.getCustomers()
  }
  //reload meetings when user selects a different room
  componentDidUpdate(prevProps) {
    if (this.props.roomId !== prevProps.roomId) {
      meetings.reload()
    }
  }

  render() {
    return (
      <div id="schedulerWrapper" roomid={this.props.roomId}>
        <Scheduler id='roomScheduler'
          // views = {['day', 'week', 'month']}
          dataSource={meetings}
          maxAppointmentsPerCell={1}
          endDayHour={17}
          startDayHour={8}
          onAppointmentFormOpening={this.onAppointmentFormOpening}
          onAppointmentAdding={this.onAppointmentAdding}
          onAppointmentAdded={this.onAppointmentAdded}
          onAppointmentDeleted={this.onAppointmentDeleted}
          appointmentComponent={AppointmentTemplate}
          defaultCurrentView={'week'}
          width={'70%'}
          style={{ margin: 'auto', paddingBottom: '100px' }}
        >
          <Editing
            allowUpdating={false}
          />
          <View
            type="day"
            cellDuration = {this.props.roomType === 'office' ? 270 : 30}
          />
          <View
            type="week"
            cellDuration={this.props.roomType === 'office' ? 270 : 30}
          />
          <View
            type="month"
          />
        </Scheduler>
      </div>
    );
  }
}

export default RoomScheduler;