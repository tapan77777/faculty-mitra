import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Font,
} from '@react-pdf/renderer';
import type { FacultyProfile } from './supabase';

Font.registerHyphenationCallback((word) => [word]);

export interface AssignTask {
  number: number;
  title: string;
  description: string;
}
export interface AssignRubricRow {
  criteria: string;
  marks: number;
  description: string;
}
export interface AssignResult {
  title: string;
  overview: string;
  objectives: string[];
  tasks: AssignTask[];
  rubric: AssignRubricRow[];
  hints: string[];
  industry_context: string;
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 44,
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1a1a2e',
  },
  headerBar: {
    backgroundColor: '#059669',
    marginHorizontal: -44,
    marginTop: -40,
    marginBottom: 24,
    paddingHorizontal: 44,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#ffffff', fontSize: 14, fontFamily: 'Helvetica-Bold' },
  headerSub: { color: '#d1fae5', fontSize: 8, marginTop: 2 },
  headerDate: { color: '#d1fae5', fontSize: 8 },
  metaRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metaBox: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    borderRadius: 5,
    padding: 8,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  metaLabel: {
    fontSize: 6.5, color: '#059669', fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 2,
  },
  metaValue: { fontSize: 8.5, color: '#14532d', fontFamily: 'Helvetica-Bold' },
  projectTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#065f46',
    marginBottom: 8,
    lineHeight: 1.3,
  },
  overviewBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
    marginBottom: 16,
  },
  overviewText: { fontSize: 9, color: '#134e4a', lineHeight: 1.6 },
  sectionHeading: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#065f46',
    marginBottom: 8,
    marginTop: 14,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#86efac',
  },
  bulletRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  bullet: { color: '#059669', fontFamily: 'Helvetica-Bold', fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9, color: '#1e293b', lineHeight: 1.5 },
  taskCard: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    backgroundColor: '#fafafa',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 9,
  },
  taskNumber: {
    width: 20, height: 20,
    backgroundColor: '#059669',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  taskNumberText: { color: '#ffffff', fontSize: 8, fontFamily: 'Helvetica-Bold' },
  taskTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 3 },
  taskDesc: { fontSize: 8.5, color: '#475569', lineHeight: 1.5 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d1fae5',
    borderRadius: 4,
    padding: 6,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableHeaderText: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#065f46' },
  tableCellText: { fontSize: 8, color: '#334155', lineHeight: 1.4 },
  industryBox: {
    backgroundColor: '#ecfdf5',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#6ee7b7',
    marginTop: 4,
  },
  industryText: { fontSize: 8.5, color: '#065f46', lineHeight: 1.6 },
  hintsBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginTop: 4,
  },
  hintText: { fontSize: 8.5, color: '#78350f', lineHeight: 1.6, marginBottom: 3 },
  footer: {
    position: 'absolute', bottom: 20, left: 44, right: 44,
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 5,
  },
  footerText: { fontSize: 7, color: '#94a3b8' },
});

interface PdfDocProps {
  result: AssignResult;
  faculty: FacultyProfile | null;
  subject: string;
  semester: string;
  topic: string;
  difficulty: string;
  hours: string;
}

function AssignDocument({ result, faculty, subject, semester: _semester, topic, difficulty, hours }: PdfDocProps) {
  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const totalMarks = result.rubric.reduce((sum, r) => sum + (r.marks || 0), 0);

  return (
    <Document title="Assignment" author="FacultyMitra">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar} fixed>
          <View>
            <Text style={styles.headerTitle}>FacultyMitra — Assignment</Text>
            <Text style={styles.headerSub}>AI-generated practical assignment</Text>
          </View>
          <Text style={styles.headerDate}>Generated {generatedDate}</Text>
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          {faculty?.name && (
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Faculty</Text>
              <Text style={styles.metaValue}>{faculty.name}</Text>
            </View>
          )}
          {(subject || faculty?.subject) && (
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Subject</Text>
              <Text style={styles.metaValue}>{subject || faculty?.subject}</Text>
            </View>
          )}
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Topic</Text>
            <Text style={styles.metaValue}>{topic}</Text>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Difficulty · Hours</Text>
            <Text style={styles.metaValue}>{difficulty} · {hours}h</Text>
          </View>
        </View>

        {/* Project title */}
        <Text style={styles.projectTitle}>{result.title}</Text>

        {/* Overview */}
        <View style={styles.overviewBox}>
          <Text style={styles.overviewText}>{result.overview}</Text>
        </View>

        {/* Objectives */}
        <Text style={styles.sectionHeading}>Learning Objectives</Text>
        {result.objectives.map((obj, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={styles.bullet}>{i + 1}.</Text>
            <Text style={styles.bulletText}>{obj}</Text>
          </View>
        ))}

        {/* Tasks */}
        <Text style={styles.sectionHeading}>Tasks</Text>
        {result.tasks.map((task) => (
          <View key={task.number} style={styles.taskCard} wrap={false}>
            <View style={styles.taskNumber}>
              <Text style={styles.taskNumberText}>{task.number}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDesc}>{task.description}</Text>
            </View>
          </View>
        ))}

        {/* Rubric */}
        <Text style={styles.sectionHeading}>Evaluation Rubric  (Total: {totalMarks} marks)</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Criteria</Text>
          <Text style={[styles.tableHeaderText, { width: 40 }]}>Marks</Text>
          <Text style={[styles.tableHeaderText, { flex: 3 }]}>Description</Text>
        </View>
        {result.rubric.map((row, i) => (
          <View key={i} style={styles.tableRow} wrap={false}>
            <Text style={[styles.tableCellText, { flex: 2 }]}>{row.criteria}</Text>
            <Text style={[styles.tableCellText, { width: 40 }]}>{row.marks}</Text>
            <Text style={[styles.tableCellText, { flex: 3 }]}>{row.description}</Text>
          </View>
        ))}

        {/* Hints */}
        {result.hints.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>Hints</Text>
            <View style={styles.hintsBox}>
              {result.hints.map((hint, i) => (
                <Text key={i} style={styles.hintText}>• {hint}</Text>
              ))}
            </View>
          </>
        )}

        {/* Industry context */}
        {result.industry_context && (
          <>
            <Text style={styles.sectionHeading}>Industry Context</Text>
            <View style={styles.industryBox}>
              <Text style={styles.industryText}>{result.industry_context}</Text>
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>FacultyMitra · Assignment</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}

export async function generateAssignPdf(
  result: AssignResult,
  faculty: FacultyProfile | null,
  subject: string,
  semester: string,
  topic: string,
  difficulty: string,
  hours: string,
): Promise<Buffer> {
  const element = React.createElement(AssignDocument, {
    result, faculty, subject, semester, topic, difficulty, hours,
  });
  return renderToBuffer(element);
}
