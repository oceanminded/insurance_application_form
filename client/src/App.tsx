import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import './App.css';
import { store } from './store/store';
import { InsuranceApplicationPage } from './components/insurance/InsuranceApplicationPage';

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/applications" element={<InsuranceApplicationPage />} />
                    <Route path="/applications/:id" element={<InsuranceApplicationPage />} />
                    <Route path="/applications/:id/quote" element={<InsuranceApplicationPage />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
