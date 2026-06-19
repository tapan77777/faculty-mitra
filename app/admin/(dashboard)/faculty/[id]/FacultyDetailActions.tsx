'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import EditFacultyModal from '../EditFacultyModal';
import DeleteFacultyButton from '../DeleteFacultyButton';

interface FacultyData {
  id: string;
  name: string;
  college: string;
  subject: string;
  designation: string;
  language: string;
  is_verified: boolean;
}

export default function FacultyDetailActions({ faculty }: { faculty: FacultyData }) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1.5 text-sm text-[#635BFF] hover:text-[#5851DB] border border-[#635BFF]/30 hover:border-[#635BFF] hover:bg-[#F0F0FF] px-3 py-2 rounded-lg transition-colors font-medium"
        >
          <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
          Edit Profile
        </button>
        <DeleteFacultyButton facultyId={faculty.id} facultyName={faculty.name} />
      </div>

      {editing && (
        <EditFacultyModal faculty={faculty} onClose={() => setEditing(false)} />
      )}
    </>
  );
}
