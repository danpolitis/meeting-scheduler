import React from 'react'

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const AppointmentTemplate = (model) => {
  return (
    <React.Fragment>
      <div style={{backgroundColor: `${model.data.targetedAppointmentData.color}`, padding: '5px', position: 'absolute', top: '0', right: '0', bottom: '0', left: '0'}}>
        <div className="dx-scheduler-appointment-title">{model.data.targetedAppointmentData.text}</div>
        <div className="dx-scheduler-appointment-content-details">
          <div className="dx-scheduler-appointment-content-date">
            {formatAMPM(new Date(model.data.targetedAppointmentData.startDate))} - {formatAMPM(new Date(model.data.targetedAppointmentData.endDate))}
          </div>
          <div id='tooltip-price'>
            Price: ${model.data.targetedAppointmentData.price}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default AppointmentTemplate;