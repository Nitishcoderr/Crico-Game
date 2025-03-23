// Component imports
import App from './App.jsx';
// CSS import
import './index.css';
// Library import
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from './Redux/store.js';
// import { ThemeProvider } from './Helpers/ThemeContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
    {/* <ThemeProvider> */}
      <App />
    {/* </ThemeProvider> */}
      <Toaster />
    </BrowserRouter>
  </Provider>
);