import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ConsoleSidebar from '../navigation/ConsoleSidebar';
import ConsoleHeader from '../navigation/ConsoleHeader';
import { useAuth } from '../../context/AuthContext';

const ConsoleLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { darkMode, toggleDarkMode } = useAuth();

  return (
    <div className="min-h-screen bg-bg flex">
      <ConsoleSidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className={`flex-1 min-w-0 w-full flex flex-col transition-all duration-300 ml-0 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <ConsoleHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
        />
        <div className="p-6 pb-20 lg:pb-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ConsoleLayout;
