'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Search, 
  Phone, 
  Mail, 
  Briefcase, 
  Download, 
  CheckCircle2, 
  Clock, 
  MapPin,
  FileSpreadsheet,
  Trash2,
  Edit2
} from 'lucide-react';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: 'Trades & Joinery' | 'Automotive' | 'Site Management' | 'Retail & Sales' | 'Administration';
  licenseNumber: string;
  phone: string;
  email: string;
  status: 'On Site' | 'Available' | 'On Call' | 'On Leave';
  assignedJob?: string;
  hourlyRate?: number;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Marcus Vance',
    role: 'Lead Master Builder & Joiner',
    department: 'Trades & Joinery',
    licenseNumber: 'BLD 294810',
    phone: '0412 345 678',
    email: 'marcus@vancetradegroup.com.au',
    status: 'On Site',
    assignedJob: 'Unley Park Kitchen Renovation (Site #104)',
    hourlyRate: 95
  },
  {
    id: 'staff-2',
    name: 'Liam Gallagher',
    role: 'Senior Cabinet Maker & Installer',
    department: 'Trades & Joinery',
    licenseNumber: 'CAB 849201',
    phone: '0423 456 789',
    email: 'liam.g@vancetradegroup.com.au',
    status: 'On Site',
    assignedJob: 'Unley Park Kitchen Renovation (Site #104)',
    hourlyRate: 75
  },
  {
    id: 'staff-3',
    name: 'Chloe Tremaine',
    role: 'Licensed Vehicle Inspector & Roadworthy Tech',
    department: 'Automotive',
    licenseNumber: 'LMVD-MEC-3829',
    phone: '0434 567 890',
    email: 'chloe.t@tarntanyamotors.com.au',
    status: 'Available',
    assignedJob: 'Pre-Purchase Car Inspection Queue',
    hourlyRate: 85
  },
  {
    id: 'staff-4',
    name: 'Hamish Clark',
    role: 'Site Estimator & Building Inspector',
    department: 'Site Management',
    licenseNumber: 'QS-SA-49102',
    phone: '0445 678 901',
    email: 'hamish@vancesitemanagement.com.au',
    status: 'On Call',
    assignedJob: 'North Adelaide Commercial Site Feasibility',
    hourlyRate: 90
  },
  {
    id: 'staff-5',
    name: 'Sophie Lin',
    role: 'Client Liaison & Contract Administrator',
    department: 'Administration',
    licenseNumber: 'ADM-CERT-902',
    phone: '0456 789 012',
    email: 'sophie@vancetradegroup.com.au',
    status: 'Available',
    assignedJob: 'Escrow & Statutory Compliance Audits',
    hourlyRate: 65
  }
];

interface StaffManagementModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

export function StaffManagementModal({ isOpen, onOpenChange, trigger }: StaffManagementModalProps) {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New staff form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState<StaffMember['department']>('Trades & Joinery');
  const [newLicense, setNewLicense] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newStatus, setNewStatus] = useState<StaffMember['status']>('Available');
  const [newJob, setNewJob] = useState('');

  const filteredStaff = staff.filter(s => {
    const matchesDept = selectedDepartment === 'all' || s.department === selectedDepartment;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = !query || 
      s.name.toLowerCase().includes(query) || 
      s.role.toLowerCase().includes(query) || 
      s.licenseNumber.toLowerCase().includes(query) ||
      (s.assignedJob && s.assignedJob.toLowerCase().includes(query));
    return matchesDept && matchesQuery;
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRole) return;

    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newName,
      role: newRole,
      department: newDept,
      licenseNumber: newLicense || 'SA-PENDING-2026',
      phone: newPhone || '0400 000 000',
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@adelaidetrades.com.au`,
      status: newStatus,
      assignedJob: newJob || 'General Roster Queue'
    };

    setStaff([newMember, ...staff]);
    setIsAddingNew(false);
    // Reset form
    setNewName('');
    setNewRole('');
    setNewLicense('');
    setNewPhone('');
    setNewEmail('');
    setNewJob('');
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Role,Department,License,Phone,Email,Status,AssignedJob'];
    const rows = staff.map(s => `"${s.id}","${s.name}","${s.role}","${s.department}","${s.licenseNumber}","${s.phone}","${s.email}","${s.status}","${s.assignedJob || ''}"`);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Staff_Database_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[960px] rounded-[2.5rem] border-0 glass p-0 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b bg-white/80 backdrop-blur-md shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DialogTitle className="text-2xl font-display font-bold tracking-tight text-zinc-900">
                Staff Database & Trade Roster
              </DialogTitle>
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 mr-1 inline" /> Certified Personnel
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Manage internal tradespeople, inspectors, sub-contractors, shifts, and active site allocations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCSV}
              className="rounded-xl h-9 text-xs font-bold cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="rounded-xl h-9 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              {isAddingNew ? 'Cancel' : 'Add Staff Member'}
            </Button>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 space-y-5">
          {/* Add New Staff Form (Conditional) */}
          {isAddingNew && (
            <form onSubmit={handleAddStaff} className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600">Register New Staff Profile</h4>
                <span className="text-[10px] text-zinc-400 font-mono">Real-time local database sync</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <Label className="text-[10px] font-bold uppercase text-zinc-500">Full Name</Label>
                  <Input
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. David Walker"
                    className="rounded-xl h-9 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase text-zinc-500">Trade Title / Role</Label>
                  <Input
                    required
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    placeholder="e.g. Master Plumber"
                    className="rounded-xl h-9 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase text-zinc-500">Department</Label>
                  <select
                    value={newDept}
                    onChange={e => setNewDept(e.target.value as any)}
                    className="w-full h-9 mt-1 rounded-xl border border-zinc-200 bg-white text-xs font-semibold px-2"
                  >
                    <option value="Trades & Joinery">Trades & Joinery</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Site Management">Site Management</option>
                    <option value="Retail & Sales">Retail & Sales</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div>
                  <Label className="text-[10px] font-bold uppercase text-zinc-500">License / Accreditation #</Label>
                  <Input
                    value={newLicense}
                    onChange={e => setNewLicense(e.target.value)}
                    placeholder="e.g. PGE 284102"
                    className="rounded-xl h-9 text-xs font-mono mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase text-zinc-500">Mobile Phone</Label>
                  <Input
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="0400 123 456"
                    className="rounded-xl h-9 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase text-zinc-500">Initial Shift Status</Label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as any)}
                    className="w-full h-9 mt-1 rounded-xl border border-zinc-200 bg-white text-xs font-semibold px-2"
                  >
                    <option value="Available">Available</option>
                    <option value="On Site">On Site</option>
                    <option value="On Call">On Call</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <Label className="text-[10px] font-bold uppercase text-zinc-500">Assigned Job / Site</Label>
                  <Input
                    value={newJob}
                    onChange={e => setNewJob(e.target.value)}
                    placeholder="e.g. Norwood Bathroom & Kitchen Remodel (Site #108)"
                    className="rounded-xl h-9 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingNew(false)}
                  className="rounded-xl h-9 text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl h-9 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer"
                >
                  Save to Staff Database
                </Button>
              </div>
            </form>
          )}

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search staff, trade license, or active site..."
                className="pl-10 rounded-xl h-10 bg-white text-xs border-zinc-200 font-medium"
              />
            </div>

            {/* Department Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['all', 'Trades & Joinery', 'Automotive', 'Site Management', 'Administration'].map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    selectedDepartment === dept
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {dept === 'all' ? 'All Departments' : dept}
                </button>
              ))}
            </div>
          </div>

          {/* Staff Database Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredStaff.map(member => (
              <div 
                key={member.id} 
                className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-display font-bold text-zinc-900">{member.name}</h4>
                      <p className="text-xs text-zinc-500 font-medium">{member.role}</p>
                    </div>
                    <Badge className={`text-[9px] font-bold uppercase tracking-wider ${
                      member.status === 'On Site' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : member.status === 'Available'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : member.status === 'On Call'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                    }`}>
                      {member.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-600 mt-3 pt-3 border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-mono text-[11px] text-zinc-700 font-bold">{member.licenseNumber}</span>
                      <span className="text-[10px] text-zinc-400">({member.department})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-mono text-[11px] text-zinc-500">{member.email}</span>
                    </div>
                  </div>

                  {member.assignedJob && (
                    <div className="mt-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-2 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-700 font-medium leading-tight">{member.assignedJob}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400">
                    {member.hourlyRate ? `$${member.hourlyRate}/hr Standard Rate` : 'Certified Staff'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteStaff(member.id)}
                    className="text-zinc-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                    title="Remove from roster"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredStaff.length === 0 && (
            <div className="p-8 text-center bg-white rounded-3xl border border-zinc-200">
              <Users className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-zinc-600">No staff members found matching criteria.</p>
              <p className="text-[10px] text-zinc-400 mt-1">Try changing your search query or department filter.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
