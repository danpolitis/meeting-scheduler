import React, {useState} from 'react';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import Scheduler, { Editing, View } from 'devextreme-react/scheduler';
import axios from 'axios';

function handleErrors(response) {
  if (!response.ok) {
      throw Error(response.statusText);
  }
  return response;
}

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
  return ((new Date(endDate)- new Date(startDate))/3600000)
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
    if (hours/4.5 > 1) {
      price = fullDayRate;
    } else {
      price = halfDayRate;
    }
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
    this.state = {
      meetingInterval: 0
    }
  }

  onAppointmentFormOpening = (e) => {
    if (e.component._preparedItems !== undefined) {
      for (var i = 0; i < e.component._preparedItems.length; i++) {
        let currentStartDate = new Date(e.component._preparedItems[i].rawAppointment.startDate)
        let newAppointmentDate = new Date(e.appointmentData.startDate)
        if ((e.appointmentData.startDate < e.component._preparedItems[i].rawAppointment.startDate) && (e.appointmentData.endDate > e.component._preparedItems[i].rawAppointment.startDate)) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
        }
        if (e.appointmentData.startDate > e.component._preparedItems[i].rawAppointment. startDate && e.appointmentData.startDate < e.component._preparedItems[i].rawAppointment.endDate) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
        }
        if ((currentStartDate.getDate() === newAppointmentDate.getDate() && currentStartDate.getMonth() === newAppointmentDate.getMonth() && currentStartDate.getYear() === newAppointmentDate.getYear()) && (e.component._preparedItems[i].allDay === true)) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
        }
      }
    }

    if (e.appointmentData.hoursUsed !== undefined) {
      e.popup.option('showTitle', true);
      e.popup.option('titleTemplate', `Final Price: $${e.appointmentData.price}, Free Hours Used: ${e.appointmentData.hoursUsed} hours, Credit Used: $${e.appointmentData.creditsUsed}`)
    } else {
      let price;
      if (e.appointmentData.allDay === true){
        price =(calculatePrice(9, this.props.rate, this.props.credit, this.props.freeHours, this.props.roomType, this.props.halfHourlyRate, this.props.halfDayRate, this.props.fullDayRate))
      } else {
        price =(calculatePrice(calculateHours(e.appointmentData.endDate, e.appointmentData.startDate), this.props.rate, this.props.credit, this.props.freeHours, this.props.roomType, this.props.halfHourlyRate, this.props.halfDayRate, this.props.fullDayRate))
      }
      e.popup.option('showTitle', true);
      e.popup.option('titleTemplate', `Final Price: $${price[0]}, Free Hours Remaining: ${price[1]} hours, Credit Remaining: $${price[2]}, Free Hours Used: ${price[3]} hours, Credit Used: $${price[4]}`)
    }
  }

  onAppointmentAdding = (e) => {
    if (calculateHours(e.appointmentData.endDate, e.appointmentData.startDate) % 0.5 !== 0 && this.props.roomType === 'meeting') {
      e.cancel = true;
      alert('Meeting room appointments must be booked in 30 minute increments.')
    }

    if (e.appointmentData.allDay !== true) {
      let sDate = new Date(e.appointmentData.startDate)
      let eDate = new Date(e.appointmentData.endDate)
      if (sDate.getHours() < 8 || sDate.getHours() >= 17 ||eDate.getHours() <= 8 || eDate.getHours() > 17 || (eDate.getHours() === 17 && eDate.getMinutes() > 0)) {
        e.cancel = true;
        alert('Appointments can only be booked between 8:00 am and 5:00 pm.')
      }
    }

    if (e.component._preparedItems !== undefined) {
      for (var i = 0; i < e.component._preparedItems.length; i++) {
        let currentStartDate = new Date(e.component._preparedItems[i].rawAppointment.startDate)
        let newAppointmentDate = new Date(e.appointmentData.startDate)
        if ((e.appointmentData.startDate < e.component._preparedItems[i].rawAppointment.startDate) && (e.appointmentData.endDate > e.component._preparedItems[i].rawAppointment.startDate)) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
        }
        if (e.appointmentData.startDate > e.component._preparedItems[i].rawAppointment. startDate && e.appointmentData.startDate < e.component._preparedItems[i].rawAppointment.endDate) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
        }
        if ((currentStartDate.getDate() === newAppointmentDate.getDate() && currentStartDate.getMonth() === newAppointmentDate.getMonth() && currentStartDate.getYear() === newAppointmentDate.getYear()) && (e.component._preparedItems[i].allDay === true)) {
          e.cancel = true;
          alert('An appointment already exists at that time. Please select a different time.')
        }
      }
    }

    let start = new Date(e.appointmentData.startDate)

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

    if (calculateHours(e.appointmentData.endDate, e.appointmentData.startDate) % 4.5 !== 0 && this.props.roomType === 'office') {
      e.cancel = true;
      alert('Day office appointments must be booked for either a half day(starting at 8 or 12:30) or a full day(starting at 8).')
    }

    let price;
    if (e.appointmentData.allDay === true){
      price =(calculatePrice(9, this.props.rate, this.props.credit, this.props.freeHours, this.props.roomType, this.props.halfHourlyRate, this.props.halfDayRate, this.props.fullDayRate))
    } else {
      price =(calculatePrice(calculateHours(e.appointmentData.endDate, e.appointmentData.startDate), this.props.rate, this.props.credit, this.props.freeHours, this.props.roomType, this.props.halfHourlyRate, this.props.halfDayRate, this.props.fullDayRate));
    }
    e.appointmentData.price = price[0];
    e.appointmentData.hoursUsed = price[3];
    e.appointmentData.creditsUsed = price[4];
    e.appointmentData.text = this.props.customerName;
    e.appointmentData.roomId = this.props.roomId;
  }

  onAppointmentAdded = (e) => {
    meetings.reload()
    this.props.getCustomers()
  }

  onAppointmentDeleted = (e) => {
    meetings.reload()
    this.props.getCustomers()
  }

  componentDidUpdate(prevProps) {
    if (this.props.roomId !== prevProps.roomId) {
      meetings.reload()
    }
  }

  render() {
    return (
      <div id="schedulerWrapper" roomid={this.props.roomId}>
        <Scheduler id="roomScheduler"
          dataSource={meetings}
          maxAppointmentsPerCell={1}
          endDayHour={17}
          startDayHour={8}
          cellDuration={this.props.roomType === 'office' ? 270 : 30}
          onAppointmentFormOpening={this.onAppointmentFormOpening}
          onAppointmentAdding={this.onAppointmentAdding}
          onAppointmentAdded={this.onAppointmentAdded}
          onAppointmentDeleted={this.onAppointmentDeleted}
          defaultCurrentView={'week'}
          width={'70%'}
          style={{ margin: 'auto', paddingBottom: '100px' }}
        >
          <Editing
            allowUpdating={false}
          />
        </Scheduler>
      </div>
    );
  }
}

export default RoomScheduler;