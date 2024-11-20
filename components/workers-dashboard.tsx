"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit2, Clock, Download } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"
import { utils, write } from 'xlsx';

// Mock data
const initialWorkers = [
  {
    id: '1',
    name: 'John Doe',
    shiftId: 'S001',
    supervisor: 'Jane Smith',
    subcontractor: 'AM Transport',
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
  {
    id: '2',
    name: 'Alice Johnson',
    shiftId: 'S002',
    supervisor: 'Bob Wilson',
    subcontractor: 'Flagging Spotting',
    date: '2023-05-15',
    startTime: '09:00',
    firstJobCompletedAt: '11:00',
    finishAt: '18:00',
    lastJobCompletedAt: '17:30',
    totalJobs: 6,
    totalHoursPerJob: 1.5,
    totalScheduleHours: 9,
    comments: 'Excellent work ethic'
  },
  {
    id: '3',
    name: 'Mike Brown',
    shiftId: 'S003',
    supervisor: 'Carol Martinez',
    subcontractor: 'Marvelous Mark',
    date: '2023-05-15',
    startTime: '07:30',
    firstJobCompletedAt: '09:45',
    finishAt: '16:30',
    lastJobCompletedAt: '16:00',
    totalJobs: 4,
    totalHoursPerJob: 2.0,
    totalScheduleHours: 8,
    comments: 'Consistent performer'
  },
  {
    id: '4',
    name: 'Sarah Davis',
    shiftId: 'S004',
    supervisor: 'David Lee',
    subcontractor: 'Vladas Solutions',
    date: '2023-05-15',
    startTime: '08:30',
    firstJobCompletedAt: '10:00',
    finishAt: '17:30',
    lastJobCompletedAt: '17:00',
    totalJobs: 7,
    totalHoursPerJob: 1.3,
    totalScheduleHours: 9,
    comments: 'Very efficient'
  },
  {
    id: '5',
    name: 'Tom Wilson',
    shiftId: 'S005',
    supervisor: 'Emma White',
    subcontractor: 'Log Transportation',
    date: '2023-05-15',
    startTime: '09:30',
    firstJobCompletedAt: '11:15',
    finishAt: '18:30',
    lastJobCompletedAt: '18:00',
    totalJobs: 5,
    totalHoursPerJob: 1.7,
    totalScheduleHours: 9,
    comments: 'Good team player'
  },
  {
    id: '6',
    name: 'James Miller',
    shiftId: 'S006',
    supervisor: 'Frank Johnson',
    subcontractor: '23 West',
    date: '2023-05-15',
    startTime: '08:00',
    firstJobCompletedAt: '10:00',
    finishAt: '17:00',
    lastJobCompletedAt: '16:45',
    totalJobs: 6,
    totalHoursPerJob: 1.5,
    totalScheduleHours: 9,
    comments: 'Reliable worker'
  },
  {
    id: '7',
    name: 'Emily Clark',
    shiftId: 'S007',
    supervisor: 'Grace Taylor',
    subcontractor: 'FS Service',
    date: '2023-05-15',
    startTime: '07:45',
    firstJobCompletedAt: '09:30',
    finishAt: '16:45',
    lastJobCompletedAt: '16:15',
    totalJobs: 5,
    totalHoursPerJob: 1.8,
    totalScheduleHours: 9,
    comments: 'Detail oriented'
  },
  {
    id: '8',
    name: 'Daniel Martinez',
    shiftId: 'S008',
    supervisor: 'Henry Wilson',
    subcontractor: 'YLAS Consulting',
    date: '2023-05-15',
    startTime: '08:15',
    firstJobCompletedAt: '10:15',
    finishAt: '17:15',
    lastJobCompletedAt: '16:45',
    totalJobs: 6,
    totalHoursPerJob: 1.5,
    totalScheduleHours: 9,
    comments: 'Fast learner'
  },
  {
    id: '9',
    name: 'Sophia Anderson',
    shiftId: 'S009',
    supervisor: 'Isabella Brown',
    subcontractor: 'Meridian X',
    date: '2023-05-15',
    startTime: '09:00',
    firstJobCompletedAt: '10:45',
    finishAt: '18:00',
    lastJobCompletedAt: '17:30',
    totalJobs: 5,
    totalHoursPerJob: 1.7,
    totalScheduleHours: 9,
    comments: 'Great communication'
  },
  {
    id: '10',
    name: 'Lucas Thompson',
    shiftId: 'S010',
    supervisor: 'Jack Davis',
    subcontractor: 'BK Best',
    date: '2023-05-15',
    startTime: '08:30',
    firstJobCompletedAt: '10:30',
    finishAt: '17:30',
    lastJobCompletedAt: '17:00',
    totalJobs: 6,
    totalHoursPerJob: 1.5,
    totalScheduleHours: 9,
    comments: 'Highly skilled'
  },
  {
    id: '11',
    name: 'Oliver White',
    shiftId: 'S011',
    supervisor: 'Kate Miller',
    subcontractor: 'Sameba',
    date: '2023-05-15',
    startTime: '08:45',
    firstJobCompletedAt: '10:45',
    finishAt: '17:45',
    lastJobCompletedAt: '17:15',
    totalJobs: 5,
    totalHoursPerJob: 1.8,
    totalScheduleHours: 9,
    comments: 'Excellent attendance'
  }
];

const subcontractors = [
  'AM Transport',
  'Flagging Spotting',
  'Marvelous Mark',
  'Vladas Solutions',
  'Log Transportation',
  '23 West',
  'FS Service',
  'YLAS Consulting',
  'Meridian X',
  'BK Best',
  'Sameba'
];

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

// First, add a function to group workers by date
const groupWorkersByDate = (workers: Worker[]) => {
  const grouped = workers.reduce((acc, worker) => {
    const date = worker.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(worker);
    return acc;
  }, {} as Record<string, Worker[]>);

  // Sort dates in descending order
  return Object.entries(grouped)
    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());
};

export function WorkersDashboard() {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcontractor, setSelectedSubcontractor] = useState('');
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [isAddingWorker, setIsAddingWorker] = useState(false);

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

  const handleTimeChange = (workerId: string, field: keyof Worker, value: string) => {
    setWorkers(workers.map(w => {
      if (w.id === workerId) {
        const updatedWorker = { 
          ...w, 
          [field]: ['totalJobs', 'totalHoursPerJob', 'totalScheduleHours'].includes(field) ? Number(value) : value 
        };

        if (field === 'totalJobs' || field === 'totalScheduleHours') {
          const totalJobs = field === 'totalJobs' ? Number(value) : updatedWorker.totalJobs;
          const totalHours = field === 'totalScheduleHours' ? Number(value) : updatedWorker.totalScheduleHours;
          
          const hoursPerJob = totalJobs > 0 ? Number((totalHours / totalJobs).toFixed(1)) : 0;
          
          return {
            ...updatedWorker,
            totalHoursPerJob: hoursPerJob
          };
        }

        return updatedWorker;
      }
      return w;
    }));
  };

  const handleExport = () => {
    // Create a new workbook
    const workbook = utils.book_new();
    
    // Format the data for export
    const exportData = workers.map(worker => ({
      'Shift ID': worker.shiftId,
      'Supervisor': worker.supervisor,
      'Subcontractor': worker.subcontractor,
      'Date': worker.date,
      'Start Time': worker.startTime,
      'First Job': worker.firstJobCompletedAt,
      'Last Job': worker.lastJobCompletedAt,
      'End Time': worker.finishAt,
      'Total Jobs': worker.totalJobs,
      'Total Hours': worker.totalScheduleHours,
      'Hours per Job': worker.totalHoursPerJob,
      'Notes': worker.comments
    }));

    // Create worksheet
    const worksheet = utils.json_to_sheet(exportData);

    // Add worksheet to workbook
    utils.book_append_sheet(workbook, worksheet, 'Workers');

    // Generate Excel file
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Create Blob and download
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workers-${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Workers Dashboard</h1>
          <div className="flex gap-2">
            <Button 
              onClick={handleExport}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Download className="mr-2 h-4 w-4" /> Export to Excel
            </Button>
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
          <div className="relative w-[200px]">
            <select
              value={selectedSubcontractor}
              onChange={(e) => setSelectedSubcontractor(e.target.value)}
              className="w-full h-10 px-3 py-2 bg-white border border-input rounded-md text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 cursor-pointer"
            >
              <option value="">All Subcontractors</option>
              {subcontractors.map((subcontractor) => (
                <option key={subcontractor} value={subcontractor}>
                  {subcontractor}
                </option>
              ))}
            </select>
          </div>
          {selectedSubcontractor && (
            <Button
              variant="ghost"
              onClick={() => setSelectedSubcontractor('')}
              className="px-2 h-10 text-gray-500 hover:text-gray-700"
            >
              Clear filter
            </Button>
          )}
        </div>

        {groupWorkersByDate(filteredWorkers).map(([date, dateWorkers]) => (
          <div key={date} className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <div className="rounded-xl border shadow-sm bg-white overflow-hidden">
              <div className="overflow-auto max-h-[calc(100vh-220px)] scrollbar-thin scrollbar-thumb-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/50 hover:bg-transparent">
                      <TableHead className="w-[120px] bg-gray-50/80 font-semibold text-gray-600">Shift ID</TableHead>
                      <TableHead className="w-[180px] bg-gray-50/80 font-semibold text-gray-600">Supervisor</TableHead>
                      <TableHead className="w-[180px] bg-gray-50/80 font-semibold text-gray-600">Subcontractor</TableHead>
                      <TableHead className="w-[120px] bg-gray-50/90 font-semibold text-gray-600">Date</TableHead>
                      <TableHead className="w-[100px] bg-gray-50/90 font-semibold text-gray-600 border-l">Start Time</TableHead>
                      <TableHead className="w-[100px] bg-gray-50/90 font-semibold text-gray-600">First Job</TableHead>
                      <TableHead className="w-[100px] bg-gray-50/90 font-semibold text-gray-600">Last Job</TableHead>
                      <TableHead className="w-[100px] bg-gray-50/90 font-semibold text-gray-600">End Time</TableHead>
                      <TableHead className="w-[80px] text-center bg-gray-50/95 font-semibold text-gray-600 border-l">Jobs</TableHead>
                      <TableHead className="w-[80px] text-center bg-gray-50/95 font-semibold text-gray-600">Hours</TableHead>
                      <TableHead className="w-[80px] text-center bg-gray-50/95 font-semibold text-gray-600">Hrs/Job</TableHead>
                      <TableHead className="min-w-[300px] bg-gray-50 font-semibold text-gray-600 border-l">Notes</TableHead>
                      <TableHead className="w-[60px] bg-gray-50"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dateWorkers.map((worker, index) => (
                      <TableRow
                        key={worker.id}
                        className={cn(
                          "border-b transition-colors h-12 group",
                          index % 2 === 0 ? "bg-white" : "bg-gray-100/80",
                          "hover:bg-blue-50/70"
                        )}
                      >
                        <TableCell className="font-medium text-gray-900">{worker.shiftId}</TableCell>
                        <TableCell className="font-medium text-blue-600/90">{worker.supervisor}</TableCell>
                        <TableCell className="text-gray-600">{worker.subcontractor}</TableCell>
                        <TableCell className="px-3">
                          <div className="relative group">
                            <input 
                              type="date" 
                              value={worker.date}
                              onChange={(e) => handleTimeChange(worker.id, 'date', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-sm text-gray-700 group-hover:text-gray-900"
                              required 
                            />
                          </div>
                        </TableCell>
                        <TableCell className="px-3 border-l">
                          <div className="relative group">
                            <input 
                              type="time" 
                              value={worker.startTime}
                              onChange={(e) => handleTimeChange(worker.id, 'startTime', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-sm text-gray-700 group-hover:text-gray-900" 
                              required 
                            />
                          </div>
                        </TableCell>
                        <TableCell className="px-3">
                          <div className="relative group">
                            <input 
                              type="time" 
                              value={worker.firstJobCompletedAt}
                              onChange={(e) => handleTimeChange(worker.id, 'firstJobCompletedAt', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-sm text-gray-700 group-hover:text-gray-900" 
                              required 
                            />
                          </div>
                        </TableCell>
                        <TableCell className="px-3">
                          <div className="relative group">
                            <input 
                              type="time" 
                              value={worker.lastJobCompletedAt}
                              onChange={(e) => handleTimeChange(worker.id, 'lastJobCompletedAt', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-sm text-gray-700 group-hover:text-gray-900" 
                              required 
                            />
                          </div>
                        </TableCell>
                        <TableCell className="px-3">
                          <div className="relative group">
                            <input 
                              type="time" 
                              value={worker.finishAt}
                              onChange={(e) => handleTimeChange(worker.id, 'finishAt', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-sm text-gray-700 group-hover:text-gray-900" 
                              required 
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center px-3 border-l">
                          <div className="relative group">
                            <input 
                              type="number" 
                              value={worker.totalJobs}
                              onChange={(e) => handleTimeChange(worker.id, 'totalJobs', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-sm text-center text-gray-700 group-hover:text-gray-900" 
                              min="0"
                              required 
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center px-3">
                          <div className="relative group">
                            <input 
                              type="number" 
                              value={worker.totalScheduleHours}
                              onChange={(e) => handleTimeChange(worker.id, 'totalScheduleHours', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-sm text-center text-gray-700 group-hover:text-gray-900" 
                              min="0"
                              required 
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center px-3">
                          <div className="relative group">
                            <input 
                              type="number" 
                              value={worker.totalHoursPerJob}
                              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-sm text-center text-gray-700 group-hover:text-gray-900 cursor-default" 
                              readOnly 
                            />
                          </div>
                        </TableCell>
                        <TableCell className="px-3 border-l">
                          <div className="relative group">
                            <input 
                              type="text" 
                              value={worker.comments}
                              onChange={(e) => handleTimeChange(worker.id, 'comments', e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-sm text-gray-700 group-hover:text-gray-900" 
                              placeholder="Add notes..."
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => handleEdit(worker)}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-blue-50"
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
        ))}
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
