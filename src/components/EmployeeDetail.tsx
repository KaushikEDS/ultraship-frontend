import { Dialog } from "primereact/dialog";
import { Employee } from "../types/Employee";
import "./EmployeeDetail.css";

interface EmployeeDetailProps {
  employee: Employee | null;
  visible: boolean;
  onHide: () => void;
}

function EmployeeDetail({ employee, visible, onHide }: EmployeeDetailProps) {
  if (!employee) return null;

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
              <label>Username</label>
              <span>{employee.username}</span>
            </div>
            <div className="detail-item">
              <label>ID</label>
              <span>{employee.id}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>
            <i className="pi pi-phone"></i> Contact Information
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Email</label>
              <span>{employee.email}</span>
            </div>
            <div className="detail-item">
              <label>Phone</label>
              <span>{employee.phone}</span>
            </div>
            <div className="detail-item">
              <label>Website</label>
              <span>{employee.website}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>
            <i className="pi pi-building"></i> Company
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Company Name</label>
              <span>{employee.company.name}</span>
            </div>
            <div className="detail-item">
              <label>Catch Phrase</label>
              <span>{employee.company.catchPhrase}</span>
            </div>
            <div className="detail-item full-width">
              <label>Business</label>
              <span>{employee.company.bs}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>
            <i className="pi pi-map-marker"></i> Address
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Street</label>
              <span>{employee.address.street}</span>
            </div>
            <div className="detail-item">
              <label>Suite</label>
              <span>{employee.address.suite}</span>
            </div>
            <div className="detail-item">
              <label>City</label>
              <span>{employee.address.city}</span>
            </div>
            <div className="detail-item">
              <label>Zipcode</label>
              <span>{employee.address.zipcode}</span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default EmployeeDetail;
