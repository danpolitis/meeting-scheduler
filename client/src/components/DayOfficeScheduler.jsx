import React, {useState} from 'react';
import 'devextreme/dist/css/dx.light.css';
import CustomStore from 'devextreme/data/custom_store';
import Scheduler from 'devextreme-react/scheduler';
import axios from 'axios';

let meetingHours = 9;
let discount = 5;
let rate = 0.1;
let credit = 50;
let customer = 'abc company';
let roomId = 1;


function handleErrors(response) {
  if (!response.ok) {
      throw Error(response.statusText);
  }
  return response;
}

const meetings = new CustomStore({
  key: 'ID',
  loadMode: 'raw', // omit in the DataGrid, TreeList, PivotGrid, and Scheduler
  load: () => {
      return fetch(`/meetings/${roomId}`)
          .then(handleErrors)
          .then(response => response.json())
          .catch(() => { throw 'Network error' });
  }
});
// const meetings = new CustomStore({
//   key: roomId,
//   load: () => {
//     return axios.get(`/meetings/${roomId}`)
//       .then((err, { data }) => {
//         console.log(err)
//         return data
//       })
//       .then((data) => {
//         return (data.json())
//       })
//       .then(() => { throw 'Network error'})
//   }
// })


const onAppointmentFormOpening = (e) => {
  let price =(calculatePrice((e.appointmentData.endDate- e.appointmentData.startDate)/3600000, rate, credit, discount))
  e.popup.option('showTitle', true);
  e.popup.option('titleTemplate', `Final Price: $${price[0]}, Free Hours Remaining: ${price[1]} hours, Credits Remaining: $${price[2]}, Free Hours Used: ${price[3]} hours, Credits Used: $${price[4]}`)
  console.log(typeof(e.appointmentData.startDate))
  // e.popup.option('title', `Free Hours Remaining: ${price[1]}, Credits Remaining: ${price[2]}. Price: ${price[0]}, Free Hours Used: ${price[3]}, Credits Used: ${price[4]}`);
}

const onAppointmentAdding = (e) => {
  let price =(calculatePrice((e.appointmentData.endDate- e.appointmentData.startDate)/3600000, rate, credit, discount));
  e.appointmentData.price = price[0];
  e.appointmentData.hoursUsed = price[3];
  e.appointmentData.creditsUsed = price[4];
  e.appointmentData.text = customer;
}

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
  if (price > credit) {
    return 0;
  } else {
    return credit - price;
  }
}

const calculatePrice = (hours, rate, credit, freeHours) => {
  let price;

  let dHours = remainingDiscountHours(hours, freeHours);
  let hoursUsed = freeHours - dHours

  hours = remainingUnpaidHours(hours, freeHours);

  if (hours === 0) {
    if (hoursUsed > 4.5) {
      return [0, dHours, credit, hoursUsed, 0]
    } else {
      return [0, dHours, credit, hoursUsed, 0]
    }
  }

  if (hours/4.5 > 1) {
    price = 150;
  } else {
    price = 90;
  }

  let rCredit = remainingCredit(price, credit);
  let creditUsed = credit - rCredit;

  if (price > credit) {
    price = price - credit;
  } else {
    price = 0;
  }

  price = price * rate;

  return [price, dHours, rCredit, hoursUsed, creditUsed];
}

const renderAppointmentTooltip = (model) => {
  return (
    <div style = {{height: '100px'}}>
      <i>{model.appointmentData.description}</i>
      <p>Total Cost: {model.appointmentData.price}</p>
      <p>Credits Used: {model.appointmentData.creditsUsed}</p>
      <p>Hours Used: {model.appointmentData.hoursUsed}</p>
    </div>
  );
}

class DayOfficeScheduler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meetings: [],
      nextMeeting:  {}
    }
  }

  render() {
    return (
        <Scheduler id="dayOfficeScheduler"
          dataSource={meetings}
          maxAppointmentsPerCell={1}
          endDayHour={17}
          startDayHour={8}
          cellDuration={270}
          onAppointmentFormOpening={onAppointmentFormOpening}
          onAppointmentAdding={onAppointmentAdding}
          appointmentTooltipRender={renderAppointmentTooltip}
        />
    );
  }
}

export default DayOfficeScheduler;