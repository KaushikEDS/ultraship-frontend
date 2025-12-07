import { useState, useRef, useEffect, useMemo } from "react";
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [flaggedIds, setFlaggedIds] = useState<Set<number>>(new Set());
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const menuRefs = useRef<{ [key: number]: Menu | null }>({});

  useEffect(() => {
    const stored = localStorage.getItem("flaggedEmployees");
    if (stored) {
      try {
        const ids = JSON.parse(stored);
        setFlaggedIds(new Set(ids));
      } catch (e) {
        console.error("Failed to load flagged employees", e);
      }
    }
  }, []);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const data = await fetchEmployees();
        setAllEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        alert("Failed to load employees. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  // Client-side sorting and pagination
  const { employees, totalRecords } = useMemo(() => {
    let sorted = [...allEmployees];

    // Sort
    sorted.sort((a, b) => {
      let aValue: any = a[sortField as keyof Employee];
      let bValue: any = b[sortField as keyof Employee];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "ASC" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "ASC" ? 1 : -1;
      return 0;
    });

    const total = sorted.length;
    const paginated = sorted.slice(first, first + rows);

    return { employees: paginated, totalRecords: total };
  }, [allEmployees, sortField, sortOrder, first, rows]);

  const openDetail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailVisible(true);
  };

  const closeDetail = () => {
    setDetailVisible(false);
    setSelectedEmployee(null);
  };

  const handleDelete = async (employeeId: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      // Remove from local state (jsonplaceholder doesn't support actual deletion)
      setAllEmployees(allEmployees.filter((emp) => emp.id !== employeeId));
      // Also remove from flagged list if present
      const newFlaggedIds = new Set(flaggedIds);
      newFlaggedIds.delete(employeeId);
      setFlaggedIds(newFlaggedIds);
      localStorage.setItem("flaggedEmployees", JSON.stringify(Array.from(newFlaggedIds)));
    }
  };

  const handleFlag = (employeeId: number) => {
    const newFlaggedIds = new Set(flaggedIds);
    if (newFlaggedIds.has(employeeId)) {
      newFlaggedIds.delete(employeeId);
    } else {
      newFlaggedIds.add(employeeId);
    }
    setFlaggedIds(newFlaggedIds);
    localStorage.setItem("flaggedEmployees", JSON.stringify(Array.from(newFlaggedIds)));
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailVisible(true);
  };

  const onSort = (event: any) => {
    const field = event.sortField;
    const order = event.sortOrder === 1 ? "ASC" : "DESC";
    setSortField(field);
    setSortOrder(order);
    setFirst(0);
  };

  const getActionMenuItems = (employee: Employee) => {
    const isFlagged = flaggedIds.has(employee.id);
    const items = [
      {
        label: "View Details",
        icon: "pi pi-eye",
        command: () => openDetail(employee),
      },
      {
        label: isFlagged ? "Unflag" : "Flag",
        icon: isFlagged ? "pi pi-flag-fill" : "pi pi-flag",
        command: () => handleFlag(employee.id),
      },
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => handleEdit(employee),
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => handleDelete(employee.id),
      },
    ];

    return items;
  };

  const actionBodyTemplate = (rowData: Employee) => {
    return (
      <div className="action-buttons">
        <Menu model={getActionMenuItems(rowData)} popup ref={(el) => (menuRefs.current[rowData.id] = el)} id={`menu-${rowData.id}`} />
        <Button icon="pi pi-ellipsis-v" rounded text onClick={(e) => menuRefs.current[rowData.id]?.toggle(e)} aria-label="Actions" />
      </div>
    );
  };

  const subjectsBodyTemplate = (rowData: Employee) => {
    return <span>{rowData.subjects.join(", ")}</span>;
  };

  const nameBodyTemplate = (rowData: Employee) => {
    const isFlagged = flaggedIds.has(rowData.id);
    return (
      <span>
        {isFlagged && <i className="pi pi-flag-fill" style={{ color: "#ff6b6b", marginRight: "8px" }}></i>}
        {rowData.name}
      </span>
    );
  };

  const onPage = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const renderGridView = () => {
    return (
      <DataTable
        value={employees}
        loading={loading}
        paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPage={onPage}
        onSort={onSort}
        sortField={sortField}
        sortOrder={sortOrder === "ASC" ? 1 : -1}
        onRowClick={(e) => openDetail(e.data as Employee)}
        className="employee-table"
        selectionMode="single"
        dataKey="id"
      >
        <Column field="id" header="ID" sortable style={{ width: "8%" }} />
        <Column field="name" header="Name" sortable body={nameBodyTemplate} style={{ width: "20%" }} />
        <Column field="age" header="Age" sortable style={{ width: "10%" }} />
        <Column field="class" header="Class" sortable style={{ width: "12%" }} />
        <Column body={subjectsBodyTemplate} header="Subjects" style={{ width: "35%" }} />
        <Column body={actionBodyTemplate} style={{ width: "10%" }} />
      </DataTable>
    );
  };

  const renderTileView = () => {
    if (loading) {
      return <div className="loading-message">Loading employees...</div>;
    }

    return (
      <div className="tile-grid">
        {employees.map((employee) => {
          const isFlagged = flaggedIds.has(employee.id);
          return (
            <Card key={employee.id} className={`employee-tile ${isFlagged ? "flagged" : ""}`}>
              <div className="tile-content" onClick={() => openDetail(employee)}>
                <div className="tile-header">
                  <h3>
                    {isFlagged && <i className="pi pi-flag-fill" style={{ color: "#ff6b6b", marginRight: "8px" }}></i>}
                    {employee.name}
                  </h3>
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
                    <i className="pi pi-calendar"></i>
                    <span>Age: {employee.age}</span>
                  </div>
                  <div className="tile-info-item">
                    <i className="pi pi-book"></i>
                    <span>Class: {employee.class}</span>
                  </div>
                  <div className="tile-info-item">
                    <i className="pi pi-list"></i>
                    <span>{employee.subjects.length} subjects</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="employee-list-container">
      <div className="employee-list-header">
        <h1>Employees</h1>
        <div className="header-controls">
          <Button
            icon={viewMode === "grid" ? "pi pi-th-large" : "pi pi-table"}
            label={viewMode === "grid" ? "Tile View" : "Grid View"}
            onClick={() => setViewMode(viewMode === "grid" ? "tile" : "grid")}
            className="view-toggle-btn"
          />
        </div>
      </div>

      <div className="employee-list-content">{viewMode === "grid" ? renderGridView() : renderTileView()}</div>

      <EmployeeDetail employee={selectedEmployee} visible={detailVisible} onHide={closeDetail} />
    </div>
  );
}

export default EmployeeList;
