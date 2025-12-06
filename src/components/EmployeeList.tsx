import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Menu } from "primereact/menu";
import { Employee } from "../types/Employee";
import { fetchEmployees } from "../services/employeeService";
import EmployeeDetail from "./EmployeeDetail";
import "./EmployeeList.css";

type ViewMode = "grid" | "tile";

function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const menuRefs = useRef<{ [key: number]: Menu | null }>({});

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to load employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailVisible(true);
  };

  const closeDetail = () => {
    setDetailVisible(false);
    setSelectedEmployee(null);
  };

  const getActionMenuItems = (employee: Employee) => [
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => {
        console.log("Edit employee:", employee.name);
      },
    },
    {
      label: "Flag",
      icon: "pi pi-flag",
      command: () => {
        console.log("Flag employee:", employee.name);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        console.log("Delete employee:", employee.name);
      },
    },
  ];

  const actionBodyTemplate = (rowData: Employee) => {
    return (
      <div className="action-buttons">
        <Menu model={getActionMenuItems(rowData)} popup ref={(el) => (menuRefs.current[rowData.id] = el)} id={`menu-${rowData.id}`} />
        <Button icon="pi pi-ellipsis-v" rounded text onClick={(e) => menuRefs.current[rowData.id]?.toggle(e)} aria-label="Actions" />
      </div>
    );
  };

  const renderGridView = () => {
    return (
      <DataTable
        value={employees}
        loading={loading}
        paginator
        rows={10}
        onRowClick={(e) => openDetail(e.data)}
        className="employee-table"
        selectionMode="single"
        dataKey="id"
      >
        <Column field="id" header="ID" sortable style={{ width: "5%" }} />
        <Column field="name" header="Name" sortable style={{ width: "12%" }} />
        <Column field="username" header="Username" sortable style={{ width: "10%" }} />
        <Column field="email" header="Email" sortable style={{ width: "15%" }} />
        <Column field="phone" header="Phone" sortable style={{ width: "12%" }} />
        <Column field="website" header="Website" sortable style={{ width: "12%" }} />
        <Column field="company.name" header="Company" sortable style={{ width: "12%" }} />
        <Column field="address.city" header="City" sortable style={{ width: "10%" }} />
        <Column field="address.street" header="Street" sortable style={{ width: "10%" }} />
        <Column field="address.zipcode" header="Zipcode" sortable style={{ width: "8%" }} />
        <Column body={actionBodyTemplate} style={{ width: "5%" }} />
      </DataTable>
    );
  };

  const renderTileView = () => {
    if (loading) {
      return <div className="loading-message">Loading employees...</div>;
    }

    return (
      <div className="tile-grid">
        {employees.map((employee) => (
          <Card key={employee.id} className="employee-tile">
            <div className="tile-content" onClick={() => openDetail(employee)}>
              <div className="tile-header">
                <h3>{employee.name}</h3>
                <div className="tile-actions" onClick={(e) => e.stopPropagation()}>
                  <Menu
                    model={getActionMenuItems(employee)}
                    popup
                    ref={(el) => (menuRefs.current[employee.id] = el)}
                    id={`tile-menu-${employee.id}`}
                  />
                  <Button
                    icon="pi pi-ellipsis-v"
                    rounded
                    text
                    onClick={(e) => {
                      e.stopPropagation();
                      menuRefs.current[employee.id]?.toggle(e);
                    }}
                    aria-label="Actions"
                  />
                </div>
              </div>
              <div className="tile-info">
                <div className="tile-info-item">
                  <i className="pi pi-envelope"></i>
                  <span>{employee.email}</span>
                </div>
                <div className="tile-info-item">
                  <i className="pi pi-phone"></i>
                  <span>{employee.phone}</span>
                </div>
                <div className="tile-info-item">
                  <i className="pi pi-building"></i>
                  <span>{employee.company.name}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="employee-list-container">
      <div className="employee-list-header">
        <h1>Employees</h1>
        <Button
          icon={viewMode === "grid" ? "pi pi-th-large" : "pi pi-table"}
          label={viewMode === "grid" ? "Tile View" : "Grid View"}
          onClick={() => setViewMode(viewMode === "grid" ? "tile" : "grid")}
          className="view-toggle-btn"
        />
      </div>

      <div className="employee-list-content">{viewMode === "grid" ? renderGridView() : renderTileView()}</div>

      <EmployeeDetail employee={selectedEmployee} visible={detailVisible} onHide={closeDetail} />
    </div>
  );
}

export default EmployeeList;
