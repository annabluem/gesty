import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Settings from './pages/Settings.jsx';
import Chat from './pages/Chat.jsx';
import Schedule from './pages/Schedule.jsx';
import ScheduleCustomize from './pages/ScheduleCustomize.jsx';
import MySchedule from './pages/MySchedule.jsx';
import Reservations from './pages/Reservations.jsx';
import WellnessCategories from './pages/WellnessCategories.jsx';
import WellnessCatalog from './pages/WellnessCatalog.jsx';
import WellnessSelect from './pages/WellnessSelect.jsx';
import WellnessMyCourse from './pages/WellnessMyCourse.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/app/inicio" element={<Home />} />
        <Route path="/app/ajustes" element={<Settings />} />
        <Route path="/app/chats" element={<Chat />} />

        <Route path="/app/horario" element={<Schedule />} />
        <Route path="/app/horario/personalizar" element={<ScheduleCustomize />} />
        <Route path="/app/horario/mio" element={<MySchedule />} />

        <Route path="/app/reservas" element={<Reservations />} />

        <Route path="/app/bienestar" element={<WellnessCategories />} />
        <Route path="/app/bienestar/mi-curso" element={<WellnessMyCourse />} />
        <Route path="/app/bienestar/:categoria" element={<WellnessCatalog />} />
        <Route path="/app/bienestar/:categoria/:curso" element={<WellnessSelect />} />
      </Routes>
    </BrowserRouter>
  );
}
