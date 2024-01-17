import { Route, Router, Routes } from 'react-router-dom';
import './App.css';
import PublishingComponent from './PublishingComponent';
import PeerToPeer from './PeerToPeer';
import WebRTCComponent from "./demo"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<PublishingComponent/>}/>
        <Route path='/peer' element={<PeerToPeer/>}/>
        <Route path='/demo' element={<WebRTCComponent/>}/>

      </Routes>
    </div>
  );
}

export default App;
