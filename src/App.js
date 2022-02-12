import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import AdminForm from './pages/admin/form';
import PublicProfile from './pages/public/profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/profile/:id" element={<PublicProfile />} />
        <Route path="*" element={<AdminForm />} />
      </Routes>
    </Router>
  );
}

export default App;