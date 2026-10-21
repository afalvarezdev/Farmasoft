import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="d-flex vh-100 overflow-hidden">
      {/* Sidebar fijo a la izquierda */}
      <div style={{ position: "sticky", top: 0, height: "100vh", zIndex: 1000 }}>
        <Sidebar />
      </div>
      
      {/* Contenido derecho con scroll independiente */}
      <div className="flex-grow-1 h-100 overflow-y-auto" style={{ backgroundColor: "#f8fafc" }}>
        <Navbar />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;