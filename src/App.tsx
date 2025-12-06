import "./App.css";
import Navbar from "./components/Navbar";
import EmployeeList from "./components/EmployeeList";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <EmployeeList />
      </main>
    </div>
  );
}

export default App;
