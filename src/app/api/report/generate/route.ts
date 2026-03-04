import { NextResponse } from 'next/server';
import { pdf, Document, Page, Text, StyleSheet, View, Image, Link, Font } from '@react-pdf/renderer';
import React from 'react';

// Register fonts for a more professional look
Font.register({
  family: 'Helvetica-Bold',
  src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-bold@1.0.4/Helvetica-Bold.ttf'
});

export async function POST(req: Request) {
  try {
    const { results, email, chartImage, includeRawData } = await req.json();

    const colors = {
      primary: '#2563eb', // Blue
      bg: '#ffffff',
      dark: '#0f172a',    // Darker Blue/Gray
      malicious: '#ef4444',
      suspicious: '#eab308',
      clean: '#22c55e',
      gray: '#64748b',
      border: '#e2e8f0'
    };

    const styles = StyleSheet.create({
      page: {
        padding: 40,
        fontFamily: 'Helvetica',
        backgroundColor: colors.bg,
        color: colors.dark,
        fontSize: 10,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        paddingBottom: 20,
        marginBottom: 30,
      },
      brand: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
      },
      reportMeta: {
        textAlign: 'right',
        fontSize: 8,
        color: colors.gray,
      },
      section: {
        marginBottom: 20,
      },
      sectionTitle: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: colors.dark,
      },
      summaryBox: {
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
      },
      summaryText: {
        lineHeight: 1.6,
        color: '#334155',
      },
      scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        marginBottom: 30,
      },
      chartContainer: {
        width: 150,
        height: 150,
        marginRight: 30,
      },
      scoreInfo: {
        flex: 1,
      },
      scoreValue: {
        fontSize: 48,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 5,
      },
      scoreLabel: {
        fontSize: 12,
        color: colors.gray,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
      },
      queryBadge: {
        backgroundColor: colors.primary,
        color: 'white',
        padding: '4 8',
        borderRadius: 4,
        fontSize: 12,
        marginBottom: 10,
        alignSelf: 'flex-start',
      },
      table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: colors.border,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginTop: 10,
      },
      tableRow: {
        flexDirection: 'row',
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
      },
      tableColHeader: {
        backgroundColor: '#f8fafc',
        padding: 8,
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
      },
      tableCol: {
        padding: 8,
        fontSize: 9,
      },
      footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 8,
        color: colors.gray,
      },
    });

    const getScoreColor = (score: number) => {
      if (score >= 70) return colors.malicious;
      if (score >= 30) return colors.suspicious;
      return colors.clean;
    };

    const riskLabel = results.score >= 70 ? 'CRITICAL / MALICIOUS' : results.score >= 30 ? 'CAUTION / SUSPICIOUS' : 'SECURE / CLEAN';

    const ReportDocument = React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { size: 'A4', style: styles.page },
        // Header
        React.createElement(View, { style: styles.header },
          React.createElement(View, null,
            React.createElement(Text, { style: styles.brand }, 'AI THREAT INTEL'),
            React.createElement(Text, { style: { color: colors.gray, fontSize: 8, marginTop: 4 } }, 'PROFESSIONAL CYBERSECURITY ANALYSIS')
          ),
          React.createElement(View, { style: styles.reportMeta },
            React.createElement(Text, null, `DATE: ${new Date().toLocaleString()}`),
            React.createElement(Text, null, `ANALYST: ${email || 'AUTHORIZED USER'}`),
            React.createElement(Text, null, `ID: #${results.lookupId || 'SESSION-TEMP'}`)
          )
        ),

        // Hero Score Section
        React.createElement(View, { style: styles.section },
          React.createElement(View, { style: styles.scoreContainer },
            chartImage && React.createElement(View, { style: styles.chartContainer },
              React.createElement(Image, { src: chartImage })
            ),
            React.createElement(View, { style: styles.scoreInfo },
              React.createElement(View, { style: styles.queryBadge },
                React.createElement(Text, null, `${results.queryType.toUpperCase()}: ${results.query}`)
              ),
              React.createElement(Text, { style: [styles.scoreValue, { color: getScoreColor(results.score) }] }, `${results.score}%`),
              React.createElement(Text, { style: styles.scoreLabel }, riskLabel)
            )
          )
        ),

        // AI Summary Section
        React.createElement(View, { style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, 'Executive Security Summary'),
          React.createElement(View, { style: styles.summaryBox },
            React.createElement(Text, { style: styles.summaryText }, results.gptSummary)
          )
        ),

        // Passive DNS History Section
        results.relatedData?.resolutions?.length > 0 && React.createElement(View, { style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, 'Passive DNS Intelligence'),
          React.createElement(View, { style: styles.table },
            React.createElement(View, { style: [styles.tableRow, { backgroundColor: '#f8fafc' }] },
              React.createElement(Text, { style: [styles.tableColHeader, { flex: 3 }] }, 'HOST / IP ADDRESS'),
              React.createElement(Text, { style: [styles.tableColHeader, { flex: 2 }] }, 'DATE RESOLVED')
            ),
            results.relatedData.resolutions.map((res: any, i: number) =>
              React.createElement(View, { key: i, style: styles.tableRow },
                React.createElement(Text, { style: [styles.tableCol, { flex: 3 }] }, res.attributes.ip_address || res.attributes.host_name),
                React.createElement(Text, { style: [styles.tableCol, { flex: 2, color: colors.gray }] }, new Date(res.attributes.date * 1000).toLocaleDateString())
              )
            )
          )
        ),

        // Community Intelligence Section
        results.relatedData?.comments?.length > 0 && React.createElement(View, { style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, 'Community Intelligence'),
          results.relatedData.comments.map((comment: any, i: number) =>
            React.createElement(View, { key: i, style: { marginBottom: 10, padding: 10, backgroundColor: '#fdf4ff', borderRadius: 4, borderLeftWidth: 2, borderLeftColor: '#d946ef' } },
              React.createElement(Text, { style: { fontSize: 8, color: '#d946ef', marginBottom: 4, fontFamily: 'Helvetica-Bold' } }, 'SECURITY RESEARCHER'),
              React.createElement(Text, { style: { fontSize: 8, color: '#4b5563', fontStyle: 'italic' } }, `"${comment.attributes.text.substring(0, 300)}${comment.attributes.text.length > 300 ? '...' : ''}"`)
            )
          )
        ),

        // Raw Metadata (Optional)
        includeRawData && React.createElement(View, { style: [styles.section, { marginTop: 20 }] },
          React.createElement(Text, { style: styles.sectionTitle }, 'Extended Metadata'),
          React.createElement(View, { style: { backgroundColor: '#1e293b', padding: 10, borderRadius: 4 } },
            React.createElement(Text, { style: { color: '#cbd5e1', fontSize: 6, fontFamily: 'Courier' } }, JSON.stringify(results.virusTotalData, null, 2).substring(0, 2000))
          )
        ),

        // Footer
        React.createElement(View, { style: styles.footer },
          React.createElement(Text, null, 'CONFIDENTIAL REPORT - INTERNAL USE ONLY'),
          React.createElement(Text, null, 'GENERATED BY AI THREAT INTELLIGENCE ENGINE V2.5'),
          React.createElement(Text, null, 'Page 1 of 1')
        )
      )
    );

    const pdfBlob = await pdf(ReportDocument).toBlob();
    const arrayBuffer = await pdfBlob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Threat_Report_${results.query}_${new Date().getTime()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ message: 'Failed to generate PDF' }, { status: 500 });
  }
} 
