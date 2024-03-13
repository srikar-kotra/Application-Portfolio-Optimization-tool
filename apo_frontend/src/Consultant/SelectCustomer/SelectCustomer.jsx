import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './SelectCustomer.css'; // Import custom CSS file for styling

const SelectCustomer = () => {

  const { username } = useParams(); // Get the username from the URL
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [password, setPassword] = useState('');
  const [customers, setCustomers] = useState([]);
  const [showAddNewForm, setShowAddNewForm] = useState(false); // New state to control the new form visibility
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPassword, setNewCustomerPassword] = useState('');
  const [confirmNewCustomerPassword, setConfirmNewCustomerPassword] = useState('');

  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
    setPassword(''); // Clear password when customer changes
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleAddNewCustomer = () => {
    // Show the new form for adding a new customer
    setShowAddNewForm(true);
  };

  const handleNewCustomerNameChange = (e) => {
    setNewCustomerName(e.target.value);
  };

  const handleNewCustomerPasswordChange = (e) => {
    setNewCustomerPassword(e.target.value);
  };

  const handleConfirmNewCustomerPasswordChange = (e) => {
    setConfirmNewCustomerPassword(e.target.value);
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of customers when the component mounts
    getCustomers();
  }, []);

  const getCustomers = async () => {
    try {
      const response = await axios.post('http://localhost:3001/get-customers', {
        username: { username }, // Replace with the actual username
      });
      setCustomers(response.data.customers);
      //console.log(customers)
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simulate authentication - Replace with actual authentication logic
    const selectedCustomerObj = customers.find((c) => c.Customer_id === parseInt(selectedCustomer));
    //console.log(selectedCustomerObj)
    // Use navigate to redirect to the home page after successful login
    navigate(`/${username}/${selectedCustomerObj.Customer_id}/home`);

  };

  const handleAddNewCustomerSubmit = async (e) => {
    e.preventDefault();
    // Validate form fields and handle new customer addition
    if (newCustomerName.trim() === '' || newCustomerPassword.trim() === '' || newCustomerPassword !== confirmNewCustomerPassword) {
      // Show an error message or implement your preferred validation logic
      console.log('Please fill in all the fields correctly.');
    } else {
      try {
        await axios.post('http://localhost:3001/add-customer', { // Generate a new Customer_id (you can modify this as needed)
          Customer_name: newCustomerName,
          username: { username },

        });

        // After adding the new customer, fetch the updated list of customers
        getCustomers();

        // Clear the new form and hide it
        setNewCustomerName('');
        setNewCustomerPassword('');
        setConfirmNewCustomerPassword('');
        setShowAddNewForm(false);
      } catch (error) {
        console.error('Error adding new customer:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      {showAddNewForm ? (
        /* New Form for Adding a New Customer */
        <form className="form-container" onSubmit={handleAddNewCustomerSubmit}>
          <div className="form-group">
            <label htmlFor="newCustomerName">Customer Name:</label>
            <input
              type="text"
              id="newCustomerName"
              className="form-control"
              value={newCustomerName}
              onChange={handleNewCustomerNameChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newCustomerPassword">Password:</label>
            <input
              type="password"
              id="newCustomerPassword"
              className="form-control"
              value={newCustomerPassword}
              onChange={handleNewCustomerPasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewCustomerPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmNewCustomerPassword"
              className="form-control"
              value={confirmNewCustomerPassword}
              onChange={handleConfirmNewCustomerPasswordChange}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="btn btn-success">
              Add Customer
            </button>
          </div>
        </form>
      ) : (
        /* Default Form for Selecting a Customer and Login */
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="customers">Select a Customer:</label>
            <select
              id="customers"
              className="form-control"
              value={selectedCustomer}
              onChange={handleCustomerChange}
            >
              <option key="" value="">Select a customer...</option>
              {customers.map((customer, index) => (
                <option key={customer.Customer_id} value={customer.Customer_id}>
                  {customer.Customer_name}

                </option>
              ))}
            </select>


          </div>
          {selectedCustomer && (
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
          )}
          <div className="button-container">
            <button type="submit" className="btn btn-primary" disabled={!selectedCustomer || !password} onClick={handleLogin}>
              Login
            </button>
            <button type="button" className="btn btn-success" onClick={handleAddNewCustomer}>
              Add New Customer
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SelectCustomer;
