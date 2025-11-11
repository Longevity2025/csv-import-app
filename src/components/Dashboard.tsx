import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../lib/database.types';
import { Search, Filter, ArrowUpDown, LogOut, Activity, Download } from 'lucide-react';
import { CSVImport } from './CSVImport';

type Assessment = Database['public']['Tables']['assessments']['Row'];

export function Dashboard() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Assessment>('timestamp_local');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterSex, setFilterSex] = useState<string>('');
  const { user, signOut } = useAuth();

  const loadAssessments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('timestamp_local', { ascending: false });

    if (!error && data) {
      setAssessments(data);
      setFilteredAssessments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    let filtered = [...assessments];

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.name_full.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.tester.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSex) {
      filtered = filtered.filter(a => a.sex === filterSex);
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === null) return 1;
      if (bVal === null) return -1;

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredAssessments(filtered);
  }, [assessments, searchTerm, filterSex, sortField, sortDirection]);

  const toggleSort = (field: keyof Assessment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToExcel = async () => {
    const XLSX = await import('xlsx');

    const exportData = filteredAssessments.map(assessment => ({
      'Date': formatDate(assessment.timestamp_local),
      'Name': assessment.name_full,
      'Age': assessment.age,
      'Sex': assessment.sex,
      'TUG (s)': assessment.tug_s?.toFixed(1) ?? '',
      'VO2 (ml/kg/min)': assessment.vo2_mlkgmin?.toFixed(0) ?? '',
      'Sit & Reach (in)': assessment.sitreach_in?.toFixed(0) ?? '',
      'MTP %': assessment.mtp_pct?.toFixed(0) ?? '',
      'Grip R %': assessment.grip_r_pct?.toFixed(0) ?? '',
      'Grip L %': assessment.grip_l_pct?.toFixed(0) ?? '',
      'Sway R %': assessment.sway_r_pct?.toFixed(0) ?? '',
      'Sway L %': assessment.sway_l_pct?.toFixed(0) ?? '',
      'Mobility Age': assessment.mobility_age?.toFixed(1) ?? '',
      'Tester': assessment.tester,
      'Location': assessment.location,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessments');

    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `assessments_${timestamp}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Performance Assessments</h1>
                <p className="text-sm text-slate-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <CSVImport onImportComplete={loadAssessments} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, tester, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-400" />
                <select
                  value={filterSex}
                  onChange={(e) => setFilterSex(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                >
                  <option value="">All Sexes</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {filteredAssessments.length} of {assessments.length} assessments
              </p>
              <button
                onClick={exportToExcel}
                disabled={filteredAssessments.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export to Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading assessments...</div>
            ) : filteredAssessments.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                {assessments.length === 0 ? 'No assessments yet. Import a CSV file to get started.' : 'No assessments match your filters.'}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('timestamp_local')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        Date <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('name_full')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        Name <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('age')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        Age <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Sex</th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('tug_s')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        TUG (s) <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('vo2_mlkgmin')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        VO2 <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('sitreach_in')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        Sit & Reach <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('mtp_pct')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        MTP % <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('grip_r_pct')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        Grip R % <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('grip_l_pct')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        Grip L % <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('sway_r_pct')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        Sway R % <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('sway_l_pct')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        Sway L % <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('mobility_age')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        Mobility Age <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('tester')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        Tester <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('location')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase hover:text-slate-900"
                      >
                        Location <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAssessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-4 text-sm text-slate-900 whitespace-nowrap">
                        {formatDate(assessment.timestamp_local)}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                        {assessment.name_full}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">{assessment.age}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{assessment.sex}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{assessment.tug_s?.toFixed(1) ?? '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{assessment.vo2_mlkgmin?.toFixed(0) ?? '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{assessment.sitreach_in?.toFixed(0) ?? '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{assessment.mtp_pct?.toFixed(0) ?? '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{assessment.grip_r_pct?.toFixed(0) ?? '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{assessment.grip_l_pct?.toFixed(0) ?? '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{assessment.sway_r_pct?.toFixed(0) ?? '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{assessment.sway_l_pct?.toFixed(0) ?? '-'}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-slate-900 text-white">
                          {assessment.mobility_age?.toFixed(1) ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">{assessment.tester}</td>
                      <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">{assessment.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
