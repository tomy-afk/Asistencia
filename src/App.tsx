import React, { useState } from 'react';
import AttendanceForm from './components/AttendanceForm';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { LogIn } from 'lucide-react';

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  if (isAdminLoggedIn) {
    return <AdminPanel onLogout={() => setIsAdminLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 bg-white shadow-md flex justify-end">
        <button
          onClick={() => setShowAdminLogin(true)}
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Inicio de sesión
        </button>
      </div>

      <AttendanceForm />

      {showAdminLogin && (
        <AdminLogin
          onLogin={() => {
            setShowAdminLogin(false);
            setIsAdminLoggedIn(true);
          }}
        />
      )}
    </div>
  );
}

export default App;