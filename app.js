// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Services, Servers } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />  
        <Route path="/servers" element={<Servers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// servicesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getServices } from './servicesApi';

export const fetchServices = createAsyncThunk('services/fetch', async () => {
  const services = await getServices();
  return services;
});

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    items: [],
    status: 'idle'
  },
  extraReducers: {
    [fetchServices.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchServices.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.status = 'succeeded';
    },
    [fetchServices.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error;
    }
  }
});

export default servicesSlice.reducer;

// ServicesPage.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices } from './servicesSlice';
import ServiceList from './ServiceList';

function ServicesPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.services);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'failed') {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <h1>Services</h1>
      <ServiceList services={items} />
    </>
  );
}

export default ServicesPage;


// ServiceList.js
import ServiceItem from './ServiceItem';

function ServiceList({ services }) {
  const filtered = services.filter(s => s.name.includes('Voxco'));
  
  return (
    <div className="service-list">
      {filtered.map(service => (
        <ServiceItem key={service.id} {...service} />
      ))}
    </div>
  );
}

export default ServiceList;

// ServiceItem.js
import styled from 'styled-components';

const ServiceItem = styled.div`
  padding: 8px 16px;
  border-bottom: 1px solid #ddd;

  .status {
    text-transform: uppercase;
    font-weight: bold; 
  }
`;

export default ServiceItem;
