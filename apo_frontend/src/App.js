import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Login from './Login/Login';
import SelectCustomer from './Consultant/SelectCustomer/SelectCustomer';
import Home from './Consultant/Home/Home';
import UploadPage from './Consultant/UploadPage/UploadPage';
import ComboBoxPage from './Consultant/ComboBox/ComboBox';
import ExcelView from './Consultant/ExcelView/ExcelView';
import Reports from './Reports/Reports';
import CategoryComponent from './Consultant/CategoryComponent/CategoryComponent';
import CustomReport from './Reports/CustomReport';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';


const App = () => {

  const { username, customer_id } = useParams();
  console.log(username, customer_id);
  return (
    <Router>
      <Routes>
        {/* Route for the login page */}
        <Route exact path="/" element={<Login />} />

        {/* Route for the select customer page */}
        <Route path="/:username/select-customer" element={<SelectCustomer />} />

        {/* Nested routes for the logged-in user */}
        <Route path="/:username/:customer_id/*" element={<Home />} >
          {/* Child routes for the home page */}
          <Route path="upload" element={<UploadPage />} />
          <Route path="combo-box" element={<ComboBoxPage />} />
          <Route path="excel-view" element={<ExcelView />} />
        </Route>
        <Route path="/:username/:customer_id/home" element={<Home />} />
        <Route path="/:username/:customer_id/upload" element={<UploadPage />} />
        <Route path="/:username/:customer_id/modify-attributes" element={<CategoryComponent />} />
        <Route path="/:username/:customer_id/view-data" element={<ExcelView customer_id={customer_id} />} />
        <Route path="/:username/:customer_id/reports" element={<CustomReport />} />
      </Routes>
    </Router>
  );
};

export default App;
