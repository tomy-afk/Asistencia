import React, { useState } from 'react';
import { getEmployees, saveEmployees, getAttendanceRecords } from '../utils/storage';
import { Download, UserPlus, LogOut, Edit, Trash2 } from 'lucide-react';
import { Employee } from '../types';
import EmployeeForm from './EmployeeForm';

interface Props {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: Props) {
  const [employees, setEmployees] = useState<Employee[]>(getEmployees());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const agencies = [
    'Central',
    'Pucara',
    'Quillacollo',
    '1 de Mayo'
  ];

  const handleSaveEmployee = (employee: Employee) => {
    const updatedEmployees = editingEmployee
      ? employees.map(emp => emp.code === editingEmployee.code ? employee : emp)
      : [...employees, employee];
    
    setEmployees(updatedEmployees);
    saveEmployees(updatedEmployees);
    setShowAddModal(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (code: string) => {
    const updatedEmployees = employees.filter(emp => emp.code !== code);
    setEmployees(updatedEmployees);
    saveEmployees(updatedEmployees);
    setShowDeleteModal(null);
  };

  const downloadExcel = () => {
    const records = getAttendanceRecords();
    const csvContent = [
      ['Código', 'Nombre', 'Área', 'Agencia', 'Tipo', 'Hora', 'Fecha', 'Observación'],
      ...records.map(record => {
        const employee = employees.find(emp => emp.code === record.employeeCode);
        return [
          employee?.code,
          employee?.name,
          employee?.area,
          employee?.agency,
          record.type,
          record.timestamp,
          record.date,
          record.observation || ''
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'registros.csv';
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Agregar Empleado
          </button>
          <button
            onClick={downloadExcel}
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar Excel
          </button>
          <button
            onClick={onLogout}
            className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Empleados Registrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Código</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Área</th>
                <th className="px-4 py-2 text-left">Agencia</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.code} className="border-b">
                  <td className="px-4 py-2">{employee.code}</td>
                  <td className="px-4 py-2">{employee.name}</td>
                  <td className="px-4 py-2">{employee.area}</td>
                  <td className="px-4 py-2">{employee.agency}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setEditingEmployee(employee)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(employee.code)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingEmployee) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
            </h2>
            <EmployeeForm
              employee={editingEmployee}
              agencies={agencies}
              onSave={handleSaveEmployee}
              onCancel={() => {
                setShowAddModal(false);
                setEditingEmployee(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirmar Eliminación</h2>
            <p className="mb-6">¿Está seguro que desea eliminar este empleado?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteEmployee(showDeleteModal)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}