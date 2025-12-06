import { useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Menu } from "primereact/menu";
import { InputText } from "primereact/inputtext";
import { Employee } from "../types/Employee";
import { GET_EMPLOYEES_PAGINATED, DELETE_EMPLOYEE } from "../graphql/employee.queries";
import { useAuth } from "../context/AuthContext";
import EmployeeDetail from "./EmployeeDetail";
import "./EmployeeList.css";

type ViewMode = "grid" | "tile";

interface EmployeesPaginatedData {
  employeesPaginated: {
    items: Employee[];
    total: number;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
  };
}

function EmployeeList() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [classFilter, setClassFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const menuRefs = useRef<{ [key: number]: Menu | null }>({});
  const { isAdmin } = useAuth();

  const { data, loading, refetch } = useQuery<EmployeesPaginatedData>(GET_EMPLOYEES_PAGINATED, {
    variables: {
      pagination: {
        limit: rows,
        offset: first,
        sortBy: "name",
        sortOrder: "ASC",
      },
      filter: {
        ...(nameFilter && { name: nameFilter }),
        ...(classFilter && { class: classFilter }),
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => {
      refetch();
    },
    onError: (error: Error) => {
      console.error("Delete error:", error);
      alert("Failed to delete employee. You may not have permission.");
    },
  });

  const employees = data?.employeesPaginated.items || [];
  const totalRecords = data?.employeesPaginated.total || 0;

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
      try {
        await deleteEmployee({ variables: { id: employeeId } });
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const getActionMenuItems = (employee: Employee) => {
    const items = [
      {
        label: "View Details",
        icon: "pi pi-eye",
        command: () => openDetail(employee),
      },
    ];

    if (isAdmin) {
      items.push(
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => {
            console.log("Edit employee:", employee.name);
          },
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => handleDelete(employee.id),
        }
      );
    }

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
        lazy
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPage={onPage}
        onRowClick={(e) => openDetail(e.data as Employee)}
        className="employee-table"
        selectionMode="single"
        dataKey="id"
      >
        <Column field="id" header="ID" sortable style={{ width: "8%" }} />
        <Column field="name" header="Name" sortable style={{ width: "20%" }} />
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
        ))}
      </div>
    );
  };

  return (
    <div className="employee-list-container">
      <div className="employee-list-header">
        <h1>Employees</h1>
        <div className="header-controls">
          <div className="filters">
            <InputText value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} placeholder="Search by name..." className="filter-input" />
            <InputText
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              placeholder="Filter by class..."
              className="filter-input"
            />
          </div>
          <Button
            icon={viewMode === "grid" ? "pi pi-th-large" : "pi pi-table"}
            label={viewMode === "grid" ? "Tile View" : "Grid View"}
            onClick={() => setViewMode(viewMode === "grid" ? "tile" : "grid")}
            className="view-toggle-btn"
          />
        </div>
      </div>

      <div className="employee-list-content">{viewMode === "grid" ? renderGridView() : renderTileView()}</div>

      <EmployeeDetail employee={selectedEmployee} visible={detailVisible} onHide={closeDetail} onUpdate={() => refetch()} />
    </div>
  );
}

export default EmployeeList;
