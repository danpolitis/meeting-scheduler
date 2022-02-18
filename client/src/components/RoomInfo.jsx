import React from 'react';
import { Card, Table } from 'react-bootstrap'

const RoomInfo = ({ room }) => {
  let color;
  if(room.name === 'Meeting Room 1') {
    color = '#9E1400'
  } else if (room.name ==='Meeting Room 2') {
    color = '#362787'
  } else {
    color = '#240B07'
  }

  return (
    <Card style={{ width: "60%", margin: "auto", textAlign:"center", marginBottom: '10px'}}>
    <Card.Header  style={{ backgroundColor: color, color: 'white' }}>
      {room.name}
    </Card.Header>
    <Table striped bordered hover style={{ marginBottom: "0"}}>
      {room.type === 'meeting' &&
      <tbody>
        <tr>
          <td>Half-Hourly Rate</td>
          <td>${room.half_hourly_rate}</td>
        </tr>
      </tbody>
      }
      {room.type === 'office' &&
      <tbody>
        <tr>
          <td>Half Day Rate</td>
          <td>${room.half_day_rate}</td>
        </tr>
        <tr>
          <td>Full Day Rate</td>
          <td>${room.full_day_rate}</td>
        </tr>
      </tbody>
      }
    </Table>
  </Card>
  )
}

export default RoomInfo;