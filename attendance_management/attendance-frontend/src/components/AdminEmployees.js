import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    employee_id: '',
    project: '',
    designation: '',
    date_joined_company: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await authAPI.getUsers();
      console.log('API Response:', response.data);
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      const employeeData = {
        ...newEmployee,
        role: 'employee'
      };
      await authAPI.createUser(employeeData);
      toast.success('Employee created successfully!');
      setShowCreateForm(false);
      setNewEmployee({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        employee_id: '',
        project: '',
        designation: '',
        date_joined_company: ''
      });
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to create employee');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <div>
            <h1 className="text-2xl font-bold" style={{color: '#111827'}}>Employee Management</h1>
            <p style={{color: '#6b7280', fontSize: '14px', margin: '4px 0 0 0'}}>
              {employees.length} employees found
            </p>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              Create New Employee
            </button>
            <button
              onClick={fetchEmployees}
              className="btn btn-success"
            >
              Refresh List
            </button>
          </div>
        </div>

        {/* Employee List */}
        <div style={{maxHeight: '500px', overflowY: 'auto'}}>
          {employees.map((employee) => (
            <div key={employee.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '6px',
              backgroundColor: '#ffffff'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', gap: '20px', alignItems: 'center', flex: 1}}>
                  <div style={{minWidth: '120px'}}>
                    <p style={{margin: 0, fontWeight: 'bold', fontSize: '14px'}}>{employee.first_name} {employee.last_name}</p>
                    <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>ID: {employee.employee_id || 'N/A'}</p>
                  </div>
                  <div style={{minWidth: '100px'}}>
                    <p style={{margin: 0, fontSize: '13px', fontWeight: '500'}}>{employee.project || 'No Project'}</p>
                    <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>{employee.designation || 'N/A'}</p>
                  </div>
                  <div style={{minWidth: '120px'}}>
                    <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>Organization</p>
                    <p style={{margin: 0, fontSize: '13px', fontWeight: '500'}}>{employee.organization_name || 'N/A'}</p>
                  </div>
                  <div style={{minWidth: '80px'}}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      backgroundColor: employee.is_active ? '#d1fae5' : '#fee2e2',
                      color: employee.is_active ? '#065f46' : '#991b1b'
                    }}>
                      {employee.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {employees.length === 0 && (
            <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
              <p>No employees found. Create your first employee to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Employee Modal */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{width: '500px', maxHeight: '80vh', overflow: 'auto'}}>
            <h2>Create New Employee</h2>
            <form onSubmit={handleCreateEmployee}>
              <div style={{marginBottom: '16px'}}>
                <label>Employee ID *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEmployee.employee_id}
                  onChange={(e) => setNewEmployee({...newEmployee, employee_id: e.target.value})}
                  required
                />
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label>Username *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEmployee.username}
                  onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                  required
                />
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label>Password *</label>
                <input
                  type="password"
                  className="form-input"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                  required
                />
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label>First Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEmployee.first_name}
                  onChange={(e) => setNewEmployee({...newEmployee, first_name: e.target.value})}
                  required
                />
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label>Last Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEmployee.last_name}
                  onChange={(e) => setNewEmployee({...newEmployee, last_name: e.target.value})}
                  required
                />
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label>Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  required
                />
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label>Project</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEmployee.project}
                  onChange={(e) => setNewEmployee({...newEmployee, project: e.target.value})}
                />
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label>Designation</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEmployee.designation}
                  onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                />
              </div>
              
              <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                <button type="submit" className="btn btn-primary">Create Employee</button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)}
                  className="btn"
                  style={{backgroundColor: '#6b7280', color: 'white'}}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;