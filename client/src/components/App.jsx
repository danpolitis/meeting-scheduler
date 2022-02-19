import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import RoomScheduler from './RoomScheduler.jsx'
import 'devextreme/dist/css/dx.light.css'
import { Navbar, Container, DropdownButton, Dropdown} from 'react-bootstrap'
import CustomerInfo from './CustomerInfo.jsx'
import RoomInfo from './RoomInfo.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css'

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [selectedRoom, setSelectedRoom]= useState();
  const [customerTitle, setCustomerTitle] = useState('Select Customer');
  const [roomTitle, setRoomTitle] = useState('Select Room')
  const [currentMonth, setCurrentMonth] = useState()
  const isMounted = useRef(false);

  const getMonth = () => {
    axios.get('/date')
    .then(({ data }) => {
      setCurrentMonth(data[0].month)
      return data
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const changeMonth = (month) => {
    axios.put('/date', {month: month})
    .then(() => {
      axios.put('/customers')
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const checkForNewMonth = (month) => {
    let newDate = new Date()
    let monthOnRender = newDate.getMonth()
    if (month !== JSON.stringify(monthOnRender)) {
      changeMonth(monthOnRender)
    }
  }

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
    getMonth();
  }, [])

  useEffect(() => {
    if (isMounted.current) {
      checkForNewMonth(currentMonth)
    } else {
      isMounted.current = true;
    }
  }, [currentMonth])

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
    setCustomerTitle(JSON.parse(e).name)
  }
  const handleRoomSelect = (e) => {
    setSelectedRoom(JSON.parse(e))
    setRoomTitle(JSON.parse(e).name)
  }

  return (
    <>
      <h2 className="header-element" style={{ textAlign: 'center', paddingBottom: '5px'}}>
        Room Scheduler
      </h2>
      <Container>
        <DropdownButton onSelect={handleCustomerSelect} variant="success" title={customerTitle} >
          {customers.map((customer) => {
            return(
              <Dropdown.Item eventKey={JSON.stringify(customer)} key={customer.id}>
                {customer.name}
              </Dropdown.Item>
            )
          })}
        </DropdownButton>
        {selectedCustomer === undefined &&
          <div style={{
            textAlign: 'center',
            margin: 'auto'
          }}
          >Select a customer to see their information.
          </div>
        }
        {selectedCustomer !== undefined &&
          <CustomerInfo customer={selectedCustomer}/>
        }
        <DropdownButton onSelect={handleRoomSelect} variant="success" title={roomTitle}>
          {rooms.map((room) => {
            return(
              <Dropdown.Item eventKey={JSON.stringify(room)} key={room.id}>
                {room.name}
              </Dropdown.Item>
            )
          })}
        </DropdownButton>
        {selectedRoom === undefined &&
          <div style={{
            textAlign: 'center',
            margin: 'auto'
          }}
          >Select a room to see information about it.
          </div>
        }
        {selectedRoom !== undefined &&
          <RoomInfo room={selectedRoom}/>
        }
      </Container>
      {(selectedRoom === undefined || selectedCustomer === undefined) &&
          <div style={{
            textAlign: 'center',
            margin: 'auto',
            marginTop: '100px'
          }}
          >Select a room and a customer to see the scheduler.
          </div>
        }
      <div>
        {
          selectedRoom !== undefined && selectedCustomer !== undefined &&
          <RoomScheduler
            customerName={selectedCustomer.name}
            rate={selectedCustomer.rate}
            credit={selectedCustomer.credit}
            freeHours={selectedCustomer.free_hours}
            color={selectedCustomer.color}
            roomType={selectedRoom.type}
            roomId={selectedRoom.id}
            halfHourlyRate={selectedRoom.half_hourly_rate}
            halfDayRate={selectedRoom.half_day_rate}
            fullDayRate={selectedRoom.full_day_rate}
            getCustomers={getCustomers}
          />
        }
      </div>
    </>
  )
}

export default App;