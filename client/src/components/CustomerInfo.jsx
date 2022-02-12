import React from 'react'
import { Card, ListGroup, Table } from 'react-bootstrap'

const CustomerInfo = ({ customer }) => {
  return (
      <Card style={{ width: "60%", margin: "auto", textAlign:"center", marginBottom: '10px'}}>
        <Card.Header style={{ backgroundColor: 'white' }}>
          {customer.name}
        </Card.Header>
        <Table striped bordered hover style={{ marginBottom: "0"}}>
          <tbody>
            <tr>
              <td>Rate Modifier</td>
              <td>{customer.rate * 100}%</td>
            </tr>
            <tr>
              <td>Free Hours</td>
              <td>{customer.free_hours} hours</td>
            </tr>
            <tr>
              <td>Credit</td>
              <td> ${customer.credit}</td>
            </tr>
            <tr>
              <td>Outstanding Balance</td>
              <td>${customer.outstanding_balance}</td>
            </tr>
          </tbody>
        </Table>
      </Card>
  )
}

export default CustomerInfo;