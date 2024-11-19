"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"

// Mock data
const initialWorkers = [
  {
    id: '1',
    name: 'John Doe',
    shiftId: 'S001',
    supervisor: 'Jane Smith',
    subcontractor: 'ABC Corp',
    date: '2023-05-15',
    startTime: '08:00',
    firstJobCompletedAt: '10:30',
    finishAt: '17:00',
    lastJobCompletedAt: '16:30',
    totalJobs: 5,
    totalHoursPerJob: 1.8,
    totalScheduleHours: 9,
    comments: 'Good performance'
  },
]

interface Worker {
  id: string;
  name: string;
  shiftId: string;
  supervisor: string;
  subcontractor: string;
  date: string;
  startTime: string;
  firstJobCompletedAt: string;
  finishAt: string;
  lastJobCompletedAt: string;
  totalJobs: number;
  totalHoursPerJob: number;
  totalScheduleHours: number;
  comments: string;
}

// Add new interface for editable fields
interface EditableCell {
  isEditing: boolean;
  workerId: string;
  field: keyof Worker;
  value: string | number;
}

function EditWorkerForm({ worker, onSave, onChange }: {
  worker: Worker;
  onSave: () => void;
  onChange: (worker: Worker) => void;
}) {
  return (
    <div className="grid gap-4 py-4">
      {Object.entries(worker).map(([key, value]) => {
        if (key === 'id' || key === 'name' || key === 'shiftId') return null;
        return (
          <div key={key} className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={key} className="text-right">{key}</Label>
            <Input
              id={key}
              value={value}
              onChange={(e) => onChange({ ...worker, [key]: e.target.value })}
              className="col-span-3"
            />
          </div>
        );
      })}
      <Button onClick={onSave} className="bg-blue-500 hover:bg-blue-600 text-white mt-4">
        Save Changes
      </Button>
    </div>
  );
}

function AddWorkerForm({ onAdd }: { onAdd: (worker: Omit<Worker, 'id'>) => void }) {
  const [newWorker, setNewWorker] = useState<Omit<Worker, 'id'>>({
    name: '',
    shiftId: '',
    supervisor: '',
    subcontractor: '',
    date: '',
    startTime: '',
    firstJobCompletedAt: '',
    finishAt: '',
    lastJobCompletedAt: '',
    totalJobs: 0,
    totalHoursPerJob: 0,
    totalScheduleHours: 0,
    comments: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setNewWorker({ ...newWorker, [e.target.id]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newWorker);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {Object.entries(newWorker).map(([key, value]) => (
        <div key={key} className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={key} className="text-right">{key}</Label>
          <Input
            id={key}
            value={value}
            onChange={handleChange}
            type={typeof value === 'number' ? 'number' : 'text'}
            className="col-span-3"
            required={key === 'name' || key === 'shiftId'}
          />
        </div>
      ))}
      <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white mt-4">
        Add Worker
      </Button>
    </form>
  );
}

export function WorkersDashboard() {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcontractor, setSelectedSubcontractor] = useState('');
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [isAddingWorker, setIsAddingWorker] = useState(false);
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null);

  const filteredWorkers = workers.filter(worker =>
    (worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     worker.shiftId.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSubcontractor === '' || worker.subcontractor === selectedSubcontractor)
  );

  const handleEdit = (worker: Worker) => {
    setEditingWorker({ ...worker });
  };

  const handleSave = () => {
    if (editingWorker) {
      setWorkers(workers.map(w => w.id === editingWorker.id ? editingWorker : w));
      setEditingWorker(null);
    }
  };

  const handleAdd = (newWorker: Omit<Worker, 'id'>) => {
    setWorkers([...workers, { ...newWorker, id: (workers.length + 1).toString() }]);
    setIsAddingWorker(false);
  };

  // Add handler for inline editing
  const handleCellEdit = (worker: Worker, field: keyof Worker) => {
    if (['shiftId', 'supervisor', 'subcontractor'].includes(field)) return;

    setEditingCell({
      isEditing: true,
      workerId: worker.id,
      field,
      value: worker[field]
    });
  };

  // Add helper to get next editable field
  const getNextEditableField = (currentField: keyof Worker, worker: Worker): keyof Worker | null => {
    const editableFields: (keyof Worker)[] = [
      'date', 'startTime', 'finishAt', 'firstJobCompletedAt',
      'lastJobCompletedAt', 'totalJobs', 'totalHoursPerJob',
      'totalScheduleHours', 'comments'
    ];

    const currentIndex = editableFields.indexOf(currentField);
    if (currentIndex === -1 || currentIndex === editableFields.length - 1) return null;
    return editableFields[currentIndex + 1];
  };

  // Add helper to get previous editable field
  const getPreviousEditableField = (currentField: keyof Worker, worker: Worker): keyof Worker | null => {
    const editableFields: (keyof Worker)[] = [
      'date', 'startTime', 'finishAt', 'firstJobCompletedAt',
      'lastJobCompletedAt', 'totalJobs', 'totalHoursPerJob',
      'totalScheduleHours', 'comments'
    ];

    const currentIndex = editableFields.indexOf(currentField);
    if (currentIndex <= 0) return null;
    return editableFields[currentIndex - 1];
  };

  // Update handleCellUpdate to handle tab navigation
  const handleCellUpdate = (e: React.KeyboardEvent<HTMLInputElement>, worker: Worker) => {
    if (!editingCell) return;

    if (e.key === 'Enter') {
      const updatedWorkers = workers.map(w => {
        if (w.id === editingCell.workerId) {
          return { ...w, [editingCell.field]: editingCell.value };
        }
        return w;
      });
      setWorkers(updatedWorkers);
      setEditingCell(null);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const updatedWorkers = workers.map(w => {
        if (w.id === editingCell.workerId) {
          return { ...w, [editingCell.field]: editingCell.value };
        }
        return w;
      });
      setWorkers(updatedWorkers);

      const nextField = e.shiftKey
        ? getPreviousEditableField(editingCell.field, worker)
        : getNextEditableField(editingCell.field, worker);

      if (nextField) {
        setEditingCell({
          isEditing: true,
          workerId: worker.id,
          field: nextField,
          value: worker[nextField]
        });
      } else {
        // If no next field, move to the next/previous row
        const currentRowIndex = workers.findIndex(w => w.id === worker.id);
        const nextRowIndex = e.shiftKey ? currentRowIndex - 1 : currentRowIndex + 1;

        if (nextRowIndex >= 0 && nextRowIndex < workers.length) {
          const nextWorker = workers[nextRowIndex];
          const nextField = e.shiftKey ? 'comments' : 'date';
          setEditingCell({
            isEditing: true,
            workerId: nextWorker.id,
            field: nextField,
            value: nextWorker[nextField]
          });
        }
      }
    }
  };

  // Add an EditableCell component
  const EditableCell = ({ worker, field, value }: { worker: Worker; field: keyof Worker; value: string | number }) => {
    const isEditing = editingCell?.workerId === worker.id && editingCell?.field === field;
    const isEditable = !['shiftId', 'supervisor', 'subcontractor'].includes(field);

    // Helper function to format date for input
    const formatDateForInput = (dateStr: string) => {
      if (field === 'date') {
        try {
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0];
        } catch {
          return dateStr;
        }
      }
      return dateStr;
    };

    // Helper function to format time for input and display
    const formatTimeForInput = (timeStr: string) => {
      if (['startTime', 'finishAt', 'firstJobCompletedAt', 'lastJobCompletedAt'].includes(field)) {
        try {
          const [hours, minutes] = timeStr.split(':');
          // Convert to 24-hour format
          let hour = parseInt(hours);
          return `${hour.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        } catch {
          return timeStr;
        }
      }
      return timeStr;
    };

    // Helper function to validate time input
    const validateTimeInput = (value: string) => {
      if (['startTime', 'finishAt', 'firstJobCompletedAt', 'lastJobCompletedAt'].includes(field)) {
        const [hours, minutes] = value.split(':');
        const hour = parseInt(hours);
        const minute = parseInt(minutes);

        if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
          return `${hour.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        }
        return value;
      }
      return value;
    };

    // Helper function to validate date input
    const validateDateInput = (value: string) => {
      if (field === 'date') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return value;
        }
        return '';
      }
      return value;
    };

    // Helper function to determine input width based on field type
    const getInputWidth = (field: keyof Worker) => {
      switch (field) {
        case 'totalJobs':
        case 'totalHoursPerJob':
        case 'totalScheduleHours':
          return 'w-16';
        case 'date':
          return 'w-32';
        case 'startTime':
        case 'finishAt':
        case 'firstJobCompletedAt':
        case 'lastJobCompletedAt':
          return 'w-24';
        case 'comments':
          return 'w-full';
        default:
          return 'w-32';
      }
    };

    // Helper function to determine input type based on field
    const getInputType = (field: keyof Worker) => {
      switch (field) {
        case 'date':
          return 'date';
        case 'startTime':
        case 'finishAt':
        case 'firstJobCompletedAt':
        case 'lastJobCompletedAt':
          return 'time';
        case 'totalJobs':
        case 'totalScheduleHours':
          return 'number';
        case 'totalHoursPerJob':
          return 'number';
        default:
          return 'text';
      }
    };

    if (isEditing) {
      if (field === 'date') {
        return (
          <DatePicker
            value={editingCell.value as string}
            onChange={(value) => setEditingCell({ ...editingCell, value })}
            onKeyDown={(e) => handleCellUpdate(e, worker)}
          />
        );
      }

      const inputValue = ['startTime', 'finishAt', 'firstJobCompletedAt', 'lastJobCompletedAt'].includes(field)
        ? formatTimeForInput(editingCell.value as string)
        : editingCell.value;

      return (
        <input
          autoFocus
          value={inputValue}
          onChange={(e) => {
            let newValue = e.target.value;
            if (field === 'totalHoursPerJob') {
              newValue = parseFloat(newValue).toFixed(1);
            } else if (['startTime', 'finishAt', 'firstJobCompletedAt', 'lastJobCompletedAt'].includes(field)) {
              newValue = validateTimeInput(newValue);
            }
            setEditingCell({ ...editingCell, value: newValue });
          }}
          onKeyDown={(e) => handleCellUpdate(e, worker)}
          onBlur={() => {
            let finalValue = editingCell.value;
            if (['startTime', 'finishAt', 'firstJobCompletedAt', 'lastJobCompletedAt'].includes(field)) {
              finalValue = validateTimeInput(editingCell.value as string);
            }

            const updatedWorkers = workers.map(w => {
              if (w.id === editingCell.workerId) {
                return { ...w, [editingCell.field]: finalValue };
              }
              return w;
            });
            setWorkers(updatedWorkers);
            setEditingCell(null);
          }}
          type={['startTime', 'finishAt', 'firstJobCompletedAt', 'lastJobCompletedAt'].includes(field) ? 'text' : getInputType(field)}
          pattern={['startTime', 'finishAt', 'firstJobCompletedAt', 'lastJobCompletedAt'].includes(field) ? "[0-9]{2}:[0-9]{2}" : undefined}
          placeholder={['startTime', 'finishAt', 'firstJobCompletedAt', 'lastJobCompletedAt'].includes(field) ? "HH:MM" : undefined}
          min={field === 'totalHoursPerJob' ? "0" : undefined}
          step={field === 'totalHoursPerJob' ? "0.1" : undefined}
          className={cn(
            "bg-transparent border-none focus:outline-none focus:ring-0 p-0 m-0",
            getInputWidth(field),
            field === 'comments' ? "min-w-[200px]" : "",
            {
              "text-center": ['totalJobs', 'totalHoursPerJob', 'totalScheduleHours'].includes(field as string)
            }
          )}
        />
      );
    }

    // Display formatted value
    const displayValue = field === 'totalHoursPerJob'
      ? Number(value).toFixed(1)
      : field === 'date'
        ? formatDateForInput(value as string)
        : ['startTime', 'finishAt', 'firstJobCompletedAt', 'lastJobCompletedAt'].includes(field)
          ? formatTimeForInput(value as string)
          : value;

    return (
      <div
        className={cn(
          "whitespace-nowrap overflow-hidden text-ellipsis px-1",
          isEditable && "cursor-pointer hover:bg-muted/50 rounded",
          {
            "text-center": ['totalJobs', 'totalHoursPerJob', 'totalScheduleHours'].includes(field as string)
          }
        )}
        onClick={() => isEditable && handleCellEdit(worker, field)}
      >
        {displayValue}
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Workers Dashboard</h1>
          <Dialog open={isAddingWorker} onOpenChange={setIsAddingWorker}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Add Worker
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Worker</DialogTitle>
              </DialogHeader>
              <AddWorkerForm onAdd={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by supervisor or shift ID"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-lg border shadow-sm">
          <div className="overflow-auto max-h-[calc(100vh-220px)]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50">
                  <TableHead className="w-[120px] bg-gray-50/80">Shift ID</TableHead>
                  <TableHead className="w-[180px] bg-gray-50/80">Supervisor</TableHead>
                  <TableHead className="w-[180px] bg-gray-50/80">Subcontractor</TableHead>
                  <TableHead className="w-[120px] bg-gray-50/90">Date</TableHead>
                  <TableHead className="w-[120px] bg-gray-50/90">Start</TableHead>
                  <TableHead className="w-[120px] bg-gray-50/90">End</TableHead>
                  <TableHead className="w-[140px] bg-gray-50/95">First Job</TableHead>
                  <TableHead className="w-[140px] bg-gray-50/95">Last Job</TableHead>
                  <TableHead className="w-[100px] text-center bg-gray-50">Jobs</TableHead>
                  <TableHead className="w-[100px] text-center bg-gray-50">Hrs/Job</TableHead>
                  <TableHead className="w-[100px] text-center bg-gray-50">Total Hrs</TableHead>
                  <TableHead className="min-w-[300px] bg-gray-50">Notes</TableHead>
                  <TableHead className="w-[60px] bg-gray-50"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkers.map((worker) => (
                  <TableRow
                    key={worker.id}
                    className="border-b hover:bg-gray-50/50 transition-colors h-10"
                  >
                    <TableCell className="font-medium">{worker.shiftId}</TableCell>
                    <TableCell className="font-medium text-blue-600">{worker.supervisor}</TableCell>
                    <TableCell className="text-gray-600">{worker.subcontractor}</TableCell>
                    <TableCell>
                      <EditableCell worker={worker} field="date" value={worker.date} />
                    </TableCell>
                    <TableCell>
                      <EditableCell worker={worker} field="startTime" value={worker.startTime} />
                    </TableCell>
                    <TableCell>
                      <EditableCell worker={worker} field="finishAt" value={worker.finishAt} />
                    </TableCell>
                    <TableCell>
                      <EditableCell worker={worker} field="firstJobCompletedAt" value={worker.firstJobCompletedAt} />
                    </TableCell>
                    <TableCell>
                      <EditableCell worker={worker} field="lastJobCompletedAt" value={worker.lastJobCompletedAt} />
                    </TableCell>
                    <TableCell className="text-center">
                      <EditableCell worker={worker} field="totalJobs" value={worker.totalJobs} />
                    </TableCell>
                    <TableCell className="text-center">
                      <EditableCell worker={worker} field="totalHoursPerJob" value={worker.totalHoursPerJob.toFixed(1)} />
                    </TableCell>
                    <TableCell className="text-center">
                      <EditableCell worker={worker} field="totalScheduleHours" value={worker.totalScheduleHours} />
                    </TableCell>
                    <TableCell>
                      <EditableCell worker={worker} field="comments" value={worker.comments} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => handleEdit(worker)}
                        className="h-8 w-8 p-0 hover:bg-muted/80"
                      >
                        <Edit2 className="h-4 w-4 text-blue-600/80" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {editingWorker && (
        <Dialog open={!!editingWorker} onOpenChange={() => setEditingWorker(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Worker Details</DialogTitle>
            </DialogHeader>
            <EditWorkerForm
              worker={editingWorker}
              onSave={handleSave}
              onChange={setEditingWorker}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
