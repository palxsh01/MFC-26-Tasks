import { Toaster } from 'sonner@2.0.3';
import { LandingPage } from './components/LandingPage';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden relative">
      <Toaster theme="dark" position="bottom-center" />
      <LandingPage />
    </div>
  );
}
