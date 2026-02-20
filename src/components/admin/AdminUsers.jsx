import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminUsers = () => {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800">
            <TableHead className="text-slate-300">Name</TableHead>
            <TableHead className="text-slate-300">Email</TableHead>
            <TableHead className="text-slate-300">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-slate-800">
            <TableCell className="text-white">Admin User</TableCell>
            <TableCell className="text-slate-400">admin@admin.com.br</TableCell>
            <TableCell className="text-neon-500">Admin</TableCell>
          </TableRow>
          <TableRow className="border-slate-800">
            <TableCell className="text-white">John Doe</TableCell>
            <TableCell className="text-slate-400">john@example.com</TableCell>
            <TableCell className="text-slate-500">Student</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUsers;