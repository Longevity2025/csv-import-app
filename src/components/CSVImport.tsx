import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export function CSVImport({ onImportComplete }: { onImportComplete: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');

    const parseLine = (line: string): string[] => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    };

    const headers = parseLine(lines[0]);

    return lines.slice(1).map(line => {
      const values = parseLine(line);
      const row: Record<string, string> = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      return row;
    });
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setResult({ success: 0, failed: 1, errors: ['Please upload a CSV file'] });
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      const success: number[] = [];
      const errors: string[] = [];

      for (const row of rows) {
        try {
          const assessmentData = {
            timestamp_local: row.timestamp_local,
            app_version: row.app_version || '',
            name_full: row.name_full,
            tester: row.tester || '',
            location: row.location || '',
            sex: row.sex,
            age: parseInt(row.age),
            tug_s: row.tug_s ? parseFloat(row.tug_s) : null,
            vo2_mlkgmin: row.vo2_mlkgmin ? parseFloat(row.vo2_mlkgmin) : null,
            sitreach_in: row.sitreach_in ? parseFloat(row.sitreach_in) : null,
            mtp_pct: row.mtp_pct ? parseFloat(row.mtp_pct) : null,
            mip_pct: row.mip_pct ? parseFloat(row.mip_pct) : null,
            grip_r_pct: row.grip_r_pct ? parseFloat(row.grip_r_pct) : null,
            grip_l_pct: row.grip_l_pct ? parseFloat(row.grip_l_pct) : null,
            sway_r_pct: row.sway_r_pct ? parseFloat(row.sway_r_pct) : null,
            sway_l_pct: row.sway_l_pct ? parseFloat(row.sway_l_pct) : null,
            mobility_age: row.mobility_age ? parseFloat(row.mobility_age) : null,
            user_id_csv: row.user_id || '',
            user_id: user!.id,
          };

          const { error: insertError } = await supabase
            .from('assessments')
            .insert(assessmentData);

          if (insertError) {
            console.error('Insert error:', insertError);
            errors.push(`Failed to import ${row.name_full}: ${insertError.message}`);
          } else {
            success.push(1);
          }
        } catch (err) {
          console.error('Catch error:', err);
          errors.push(`Invalid data for ${row.name_full}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      setResult({
        success: success.length,
        failed: errors.length,
        errors: errors.slice(0, 5),
      });

      if (success.length > 0) {
        onImportComplete();
      }
    } catch (err) {
      setResult({
        success: 0,
        failed: 1,
        errors: ['Failed to read CSV file'],
      });
    }

    setImporting(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Import CSV Data</h2>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
          isDragging
            ? 'border-slate-900 bg-slate-50'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-slate-900' : 'text-slate-400'}`} />
        <p className="text-slate-900 font-medium mb-1">
          {importing ? 'Importing...' : 'Drop CSV file here or click to browse'}
        </p>
        <p className="text-sm text-slate-500">
          CSV files with assessment data
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {result && (
        <div className="mt-4">
          {result.success > 0 && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">
                  Successfully imported {result.success} assessment{result.success !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}

          {result.errors.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-red-900 mb-2">
                  {result.failed} error{result.failed !== 1 ? 's' : ''} occurred
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  {result.errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                  {result.failed > 5 && (
                    <li className="text-red-600">... and {result.failed - 5} more</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
