import React, { useState, useEffect } from 'react';
import axios from 'axios'
import DayOfficeScheduler from './DayOfficeScheduler.jsx'
import 'devextreme/dist/css/dx.light.css'
import { Navbar, Container, DropdownButton, Dropdown} from 'react-bootstrap'
import CustomerInfo from './CustomerInfo.jsx'
import RoomInfo from './RoomInfo.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [selectedRoom, setSelectedRoom]= useState();

  const getCustomers = () => {
    axios.get('/customers')
    .then(({ data }) => {
      setCustomers(data)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const getRooms = () => {
    axios.get('/rooms')
    .then(({ data }) => {
      setRooms(data)
    })
    .catch((err) => {
      console.log(err)
    })
  }
  useEffect(() => {
    getCustomers();
    getRooms();
  }, [])

  const updateCustomerInfo = () => {
    if (selectedCustomer !== undefined) {
      for (var i = 0; i < customers.length; i++) {
        if (customers[i].id === selectedCustomer.id){
          setSelectedCustomer(customers[i])
        }
      }
    }
  }

  useEffect(() => {
    updateCustomerInfo();
  }, [customers])

  const handleCustomerSelect = (e) => {
    setSelectedCustomer(JSON.parse(e))
  }
  const handleRoomSelect = (e) => {
    setSelectedRoom(JSON.parse(e))
  }

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>
        Room Scheduler
      </h2>
      <Container>
        <DropdownButton onSelect={handleCustomerSelect} variant="Secondary" title="Select Customer">
          {customers.map((customer) => {
            return(
              <Dropdown.Item eventKey={JSON.stringify(customer)} key={customer.id}>
                {customer.name}
              </Dropdown.Item>
            )
          })}
        </DropdownButton>
        {selectedCustomer !== undefined &&
          <CustomerInfo customer={selectedCustomer}/>
        }
        <DropdownButton onSelect={handleRoomSelect} variant="Secondary" title="Select Room">
          {rooms.map((room) => {
            return(
              <Dropdown.Item eventKey={JSON.stringify(room)} key={room.id}>
                {room.name}
              </Dropdown.Item>
            )
          })}
        </DropdownButton>
        {selectedRoom !== undefined &&
          <RoomInfo room={selectedRoom}/>
        }
      </Container>
      {
        selectedRoom !== undefined && selectedCustomer !== undefined &&
        <DayOfficeScheduler
          customerName={selectedCustomer.name}
          rate={selectedCustomer.rate}
          credit={selectedCustomer.credit}
          freeHours={selectedCustomer.free_hours}
          roomType={selectedRoom.type}
          roomId={selectedRoom.id}
          halfHourlyRate={selectedRoom.half_hourly_rate}
          halfDayRate={selectedRoom.half_day_rate}
          fullDayRate={selectedRoom.full_day_rate}
          getCustomers={getCustomers}
        />
      }
    </>
  )
}

export default App;