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
import type { AuditResult, AuditUnit } from '@/app/faculty/(dashboard)/audit/AuditClient';

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 44,
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1a1a2e',
  },
  // Header
  headerBar: {
    backgroundColor: '#0D9488',
    marginHorizontal: -44,
    marginTop: -40,
    marginBottom: 24,
    paddingHorizontal: 44,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  headerSub: {
    color: '#ccfbf1',
    fontSize: 8,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerDate: {
    color: '#ccfbf1',
    fontSize: 8,
  },
  // Meta section
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metaBox: {
    flex: 1,
    backgroundColor: '#f0fdfa',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#99f6e4',
  },
  metaLabel: {
    fontSize: 7,
    color: '#0D9488',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 9,
    color: '#134e4a',
    fontFamily: 'Helvetica-Bold',
  },
  // Score card
  scoreCard: {
    backgroundColor: '#f0fdfa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#5eead4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreBig: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 36,
  },
  scoreSub: {
    color: '#64748b',
    fontSize: 8,
    marginTop: 2,
  },
  verdictLabel: {
    fontSize: 7,
    color: '#0D9488',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'right',
  },
  verdictText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#134e4a',
    textAlign: 'right',
    maxWidth: 200,
  },
  barBg: {
    backgroundColor: '#ccfbf1',
    borderRadius: 4,
    height: 8,
    marginTop: 10,
    width: '100%',
  },
  // Section heading
  sectionHeading: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f766e',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#99f6e4',
  },
  // Unit card
  unitCard: {
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    backgroundColor: '#fafafa',
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  unitName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeKeep: { color: '#166534', backgroundColor: '#dcfce7', borderColor: '#86efac' },
  badgeUpdate: { color: '#92400e', backgroundColor: '#fef3c7', borderColor: '#fcd34d' },
  badgeRemove: { color: '#991b1b', backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
  unitReasoning: {
    fontSize: 8,
    color: '#475569',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  suggestionBox: {
    backgroundColor: '#f0fdfa',
    borderRadius: 4,
    padding: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#0D9488',
    marginTop: 4,
  },
  suggestionLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0D9488',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  suggestionText: {
    fontSize: 8,
    color: '#0f766e',
    lineHeight: 1.4,
  },
  // Industry context
  industrySection: {
    marginTop: 16,
  },
  industryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  industryBox: {
    flex: 1,
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
  },
  industryLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
  },
});

function getScoreColor(score: number): string {
  if (score >= 80) return '#16a34a';
  if (score >= 60) return '#2563eb';
  if (score >= 40) return '#d97706';
  return '#dc2626';
}

function getBadgeStyle(status: string) {
  if (status === 'KEEP') return styles.badgeKeep;
  if (status === 'UPDATE') return styles.badgeUpdate;
  return styles.badgeRemove;
}

interface PdfDocProps {
  result: AuditResult;
  faculty: FacultyProfile | null;
  subject: string;
  semester: string;
}

function AuditDocument({ result, faculty, subject, semester }: PdfDocProps) {
  const scoreColor = getScoreColor(result.overall_score);
  const barWidth = `${result.overall_score}%`;
  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Document title="Syllabus Audit Report" author="FacultyMitra">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar} fixed>
          <View>
            <Text style={styles.headerTitle}>FacultyMitra — Syllabus Audit Report</Text>
            <Text style={styles.headerSub}>AI-powered curriculum relevance analysis</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Generated {generatedDate}</Text>
          </View>
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
          {semester && (
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Semester</Text>
              <Text style={styles.metaValue}>{semester}</Text>
            </View>
          )}
          {faculty?.college && (
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Institution</Text>
              <Text style={styles.metaValue}>{faculty.college}</Text>
            </View>
          )}
        </View>

        {/* Score card */}
        <View style={styles.scoreCard}>
          <View>
            <Text style={[styles.scoreBig, { color: scoreColor }]}>
              {result.overall_score}/100
            </Text>
            <Text style={styles.scoreSub}>Industry Relevance Score</Text>
            <View style={styles.barBg}>
              <View
                style={{
                  backgroundColor: scoreColor,
                  borderRadius: 4,
                  height: 8,
                  width: barWidth,
                }}
              />
            </View>
          </View>
          <View>
            <Text style={styles.verdictLabel}>Verdict</Text>
            <Text style={styles.verdictText}>{result.verdict}</Text>
            <View style={{ marginTop: 8, flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
              {[
                { label: 'Keep', count: result.units.filter(u => u.status === 'KEEP').length, color: '#166534' },
                { label: 'Update', count: result.units.filter(u => u.status === 'UPDATE').length, color: '#92400e' },
                { label: 'Remove', count: result.units.filter(u => u.status === 'REMOVE').length, color: '#991b1b' },
              ].map(s => (
                <View key={s.label} style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: s.color }}>{s.count}</Text>
                  <Text style={{ fontSize: 7, color: '#64748b' }}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Unit analysis */}
        <Text style={styles.sectionHeading}>Unit-by-Unit Analysis</Text>
        {result.units.map((unit: AuditUnit, i: number) => (
          <View key={i} style={styles.unitCard} wrap={false}>
            <View style={styles.unitHeader}>
              <Text style={styles.unitName}>{unit.name}</Text>
              <Text style={[styles.badge, getBadgeStyle(unit.status)]}>
                {unit.status === 'KEEP' ? '✓ KEEP' : unit.status === 'UPDATE' ? '↻ UPDATE' : '✕ REMOVE'}
              </Text>
            </View>
            <Text style={styles.unitReasoning}>{unit.reasoning}</Text>
            {(unit.status === 'UPDATE' || unit.status === 'REMOVE') && unit.suggestion && (
              <View style={styles.suggestionBox}>
                <Text style={styles.suggestionLabel}>Suggestion</Text>
                <Text style={styles.suggestionText}>{unit.suggestion}</Text>
              </View>
            )}
          </View>
        ))}

        {/* Industry context */}
        {(result.trending_skills_missing.length > 0 || result.outdated_topics.length > 0) && (
          <View style={styles.industrySection}>
            <Text style={styles.sectionHeading}>Industry Context</Text>
            <View style={styles.industryRow}>
              {result.trending_skills_missing.length > 0 && (
                <View
                  style={[
                    styles.industryBox,
                    { backgroundColor: '#f0fdf4', borderColor: '#86efac' },
                  ]}
                >
                  <Text style={[styles.industryLabel, { color: '#166534' }]}>
                    Trending Skills Missing
                  </Text>
                  <View style={styles.chipRow}>
                    {result.trending_skills_missing.map((skill, i) => (
                      <Text
                        key={i}
                        style={[
                          styles.chip,
                          { color: '#166534', backgroundColor: '#dcfce7', borderColor: '#86efac' },
                        ]}
                      >
                        + {skill}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
              {result.outdated_topics.length > 0 && (
                <View
                  style={[
                    styles.industryBox,
                    { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
                  ]}
                >
                  <Text style={[styles.industryLabel, { color: '#991b1b' }]}>
                    Outdated Topics
                  </Text>
                  <View style={styles.chipRow}>
                    {result.outdated_topics.map((topic, i) => (
                      <Text
                        key={i}
                        style={[
                          styles.chip,
                          { color: '#991b1b', backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
                        ]}
                      >
                        ✕ {topic}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>FacultyMitra · Syllabus Audit Report</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

export async function generateAuditPdf(
  result: AuditResult,
  faculty: FacultyProfile | null,
  subject: string,
  semester: string
): Promise<Buffer> {
  const element = React.createElement(AuditDocument, { result, faculty, subject, semester });
  return renderToBuffer(element);
}
