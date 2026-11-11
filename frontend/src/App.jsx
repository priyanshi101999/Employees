import { useEffect, useState } from "react";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "./api";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeModal from "./components/EmployeeModal";
import DeleteModal from "./components/DeleteModal";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const loadEmployees = async () => {
    try {
      setEmployees(await getEmployees());
      setError("");
    } catch (err) {
      setError("Could not load employees. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const openAdd = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (employee) => {
    setSelected(employee);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelected(null);
  };

  const handleSave = async (data) => {
    if (selected) {
      await updateEmployee(selected.id, data);
    } else {
      await createEmployee(data);
    }
    closeForm();
    loadEmployees();
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(toDelete.id);
      loadEmployees();
    } catch (err) {
      setError(err.message);
    }
    setToDelete(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
          <p className="text-sm text-slate-500">{employees.length} total</p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          + Add Employee
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <p className="py-16 text-center text-slate-500">Loading...</p>
      ) : (
        <EmployeeTable employees={employees} onEdit={openEdit} onDelete={setToDelete} />
      )}

      {formOpen && (
        <EmployeeModal employee={selected} onClose={closeForm} onSave={handleSave} />
      )}

      {toDelete && (
        <DeleteModal
          employee={toDelete}
          onClose={() => setToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
