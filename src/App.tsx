import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar, BottomNav } from '@/components/Navigation';
import { LoginPage } from '@/pages/LoginPage';
import { LandingPage } from '@/pages/LandingPage';
import { RequestForm } from '@/pages/RequestForm';
import { Verification } from '@/pages/Verification';
import { AIMatching } from '@/pages/AIMatching';
import { Broadcast } from '@/pages/Broadcast';
import { Tracking } from '@/pages/Tracking';
import { DonorDashboard } from '@/pages/DonorDashboard';
import { HospitalDashboard } from '@/pages/HospitalDashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { Inventory } from '@/pages/Inventory';
import { LiveMap } from '@/pages/LiveMap';
import { NearbyEmergencies } from '@/pages/NearbyEmergencies';
import { AIAssistant } from '@/pages/AIAssistant';

function AppContent() {
  const { view, isLoggedIn } = useApp();

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage />;
      case 'request-form':
        return <RequestForm />;
      case 'verification':
        return <Verification />;
      case 'ai-matching':
        return <AIMatching />;
      case 'broadcast':
        return <Broadcast />;
      case 'tracking':
        return <Tracking />;
      case 'donor-dashboard':
        return <DonorDashboard />;
      case 'hospital-dashboard':
        return <HospitalDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'inventory':
        return <Inventory />;
      case 'map':
        return <NearbyEmergencies />;
      case 'nearby-emergency':
        return <NearbyEmergencies />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'login':
        return <LoginPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main>{renderView()}</main>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
