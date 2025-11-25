import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './Pages/Accueil';
import Profil from './Pages/Profil';
import Connexion from './Pages/Connexion';
import Feed from './Pages/Feed';
import Messages from './Pages/Messages';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/connexion" element={<Connexion />} />
      </Routes>
    </Router>
  )
}

export default App
