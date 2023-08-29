import logo from './logo.svg';
import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import UserPage from './pages/UserPage';
import BannerPage from './pages/BannerPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path='users' element={<UserPage />} /> 
          <Route path='banners' element={<BannerPage />} /> 
          <Route path='login' element={<LoginPage />} /> 
          <Route path='posts' element={<PostPage />} /> 
          <Route path='*' element={<LoginPage />} /> 
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
