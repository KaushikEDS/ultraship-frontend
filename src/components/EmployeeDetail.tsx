import { Dialog } from "primereact/dialog";
import { Chip } from "primereact/chip";
import { Employee } from "../types/Employee";
import "./EmployeeDetail.css";

interface EmployeeDetailProps {
  employee: Employee | null;
  visible: boolean;
  onHide: () => void;
  onUpdate?: () => void;
}

function EmployeeDetail({ employee, visible, onHide }: EmployeeDetailProps) {
  if (!employee) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderAttendance = () => {
    const attendanceEntries = Object.entries(employee.attendance || {});

    if (attendanceEntries.length === 0) {
      return <span className="no-data">No attendance records</span>;
    }

    return (
      <div className="attendance-grid">
        {attendanceEntries.map(([date, present]) => (
          <div key={date} className={`attendance-item ${present ? "present" : "absent"}`}>
            <span className="date">{date}</span>
            <span className="status">
              <i className={`pi ${present ? "pi-check" : "pi-times"}`}></i>
              {present ? "Present" : "Absent"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog header={employee.name} visible={visible} onHide={onHide} style={{ width: "50vw" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }}>
      <div className="employee-detail">
        <div className="detail-section">
          <h3>
            <i className="pi pi-user"></i> Personal Information
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Full Name</label>
              <span>{employee.name}</span>
            </div>
            <div className="detail-item">
              <label>Age</label>
              <span>{employee.age} years old</span>
            </div>
            <div className="detail-item">
              <label>Class</label>
              <span>{employee.class}</span>
            </div>
            <div className="detail-item">
              <label>ID</label>
              <span>#{employee.id}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>
            <i className="pi pi-book"></i> Subjects
          </h3>
          <div className="subjects-list">
            {employee.subjects.map((subject, index) => (
              <Chip key={index} label={subject} className="subject-chip" />
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h3>
            <i className="pi pi-calendar"></i> Attendance Records
          </h3>
          {renderAttendance()}
        </div>

        <div className="detail-section">
          <h3>
            <i className="pi pi-clock"></i> Record Information
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Created At</label>
              <span>{formatDate(employee.createdAt)}</span>
            </div>
            <div className="detail-item">
              <label>Last Updated</label>
              <span>{formatDate(employee.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default EmployeeDetail;
