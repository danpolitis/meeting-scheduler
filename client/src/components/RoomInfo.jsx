import React from 'react';
import { Card, Table } from 'react-bootstrap'

const RoomInfo = ({ room }) => {
  return (
    <Card style={{ width: "60%", margin: "auto", textAlign:"center", marginBottom: '10px'}}>
    <Card.Header  style={{ backgroundColor: 'white' }}>
      {room.name}
    </Card.Header>
    <Table striped bordered hover style={{ marginBottom: "0"}}>
      {room.type === 'meeting' &&
      <tbody>
        <tr>
          <td>Half-Hourly Rate</td>
          <td>{room.half_hourly_rate}</td>
        </tr>
      </tbody>
      }
      {room.type === 'office' &&
      <tbody>
        <tr>
          <td>Half Day Rate</td>
          <td>{room.half_day_rate}</td>
        </tr>
        <tr>
          <td>Full Day Rate</td>
          <td>{room.full_day_rate}</td>
        </tr>
      </tbody>
      }
    </Table>
  </Card>
  )
}

export default RoomInfo;