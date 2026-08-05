import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Redux Setup
import { Provider } from 'react-redux';
import { store } from './store/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* By wrapping App with Provider, we give every component access to the Redux store! */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
