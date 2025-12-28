import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Navbar from './components/Navbar/Navbar';
import Messenger from './pages/Messenger/Messenger';
import Explore from './pages/Explore/Explore'
import Feed from './pages/Feed/Feed';
import CreatePost from './pages/CreatePost/CreatePost';
import './App.css';


function App() {
  const isLoginPage = window.location.pathname === '/';

  return (
    <BrowserRouter>
      <div className="app-layout">

        {/* Colonne Gauche : Sidebar */}
        {!isLoginPage && (
          <div className="left-sidebar">
            <Navbar />
          </div>
        )}


        {/* Colonne Milieu : Feed/Contenu */}
        <div className="main-content" style={{
          width: isLoginPage ? "100vw" : "var(--main-content-width)",
        }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Explore />} />
            <Route path="/messages" element={<Messenger />} />
            <Route path="/feed" element={<Feed />} />
            <Route path='/createPost' element={<CreatePost />}></Route>
          </Routes>
        </div>

        {/* AJOUT : Colonne Droite (Contrepoids) */}
        {/* Même si elle est vide pour l'instant, elle force le Feed à rester au milieu */}
        {/* <div className="right-sidebar">
          <SideBarRight />
        </div> */}

      </div>
    </BrowserRouter>
  );
}

// const SidebarWrapper = () => {
//   return window.location.pathname !== '/' ? <Navbar /> : null;
// }

export default App;