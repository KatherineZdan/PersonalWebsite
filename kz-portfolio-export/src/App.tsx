import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PaintTransitionProvider } from './transition/PaintTransition';
import About from './pages/About';
import Art from './pages/Art';
import Contact from './pages/Contact';
import Experience from './pages/Experience';
import Home from './pages/Home';
import Work from './pages/Work';

export default function App() {
  return (
    <BrowserRouter>
      <PaintTransitionProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Work />} />
          <Route path="/art" element={<Art />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </PaintTransitionProvider>
    </BrowserRouter>
  );
}
