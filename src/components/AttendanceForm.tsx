import React, { useState, useEffect } from 'react';
import { getEmployees, getAttendanceRecords, saveAttendanceRecords } from '../utils/storage';
import { Clock, CheckCircle } from 'lucide-react';

export default function AttendanceForm() {
  const [employeeCode, setEmployeeCode] = useState('');
  const [type, setType] = useState<'Entrada' | 'Salida'>('Entrada');
  const [observation, setObservation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employees = getEmployees();
    const employee = employees.find(emp => emp.code === employeeCode);

    if (!employee) {
      setError('Código de empleado no encontrado');
      return;
    }

    const now = new Date();
    const newRecord = {
      employeeCode,
      type,
      observation,
      timestamp: now.toLocaleTimeString(),
      date: now.toLocaleDateString()
    };

    const records = getAttendanceRecords();
    saveAttendanceRecords([...records, newRecord]);

    setEmployeeCode('');
    setObservation('');
    setError('');
    setSuccess(true);
  };

  const todayRecords = getAttendanceRecords()
    .filter(record => record.date === new Date().toLocaleDateString())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const employees = getEmployees();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <Clock className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Registro de Asistencia</h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Registro guardado exitosamente
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Código de Empleado
            </label>
            <input
              type="text"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tipo de Registro
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'Entrada' | 'Salida')}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Observación (Opcional)
            </label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={3}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Registrar
        </button>
      </form>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Registros del Día</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Agencia</th>
                <th className="px-4 py-2 text-left">Hora</th>
                <th className="px-4 py-2 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {todayRecords.map((record, index) => {
                const employee = employees.find(emp => emp.code === record.employeeCode);
                return (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{employee?.name}</td>
                    <td className="px-4 py-2">{employee?.agency}</td>
                    <td className="px-4 py-2">{record.timestamp}</td>
                    <td className="px-4 py-2">{record.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}