import { NextResponse } from 'next/server';
import { pdf, Document, Page, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

export async function POST(req: Request) {
  try {
    const { results, email, chartImage } = await req.json();

    // Define styles
    const styles = StyleSheet.create({
      page: { padding: 30 },
      title: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
      label: { fontSize: 12, marginBottom: 10 },
      content: { fontSize: 10, marginBottom: 10 },
    });

    // Calculate risk label
    let riskLabel = 'Low Risk';
    if (results.score >= 70) riskLabel = 'High Risk';
    else if (results.score >= 30) riskLabel = 'Medium Risk';

    // Create PDF document using React.createElement
    const ReportDocument = React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { size: 'A4', style: styles.page },
        React.createElement(Text, { style: styles.title }, 'Threat Intelligence Report'),
        React.createElement(Text, { style: styles.label }, `Email: ${email || 'N/A'}`),
        chartImage && React.createElement(Image, { src: chartImage, style: { width: 300, height: 300, margin: '20px auto' } }),
        React.createElement(Text, { style: { textAlign: 'center', fontSize: 18, marginBottom: 4, color: '#222' } }, `${results.score}%`),
        React.createElement(Text, { style: { textAlign: 'center', fontSize: 14, marginBottom: 12, color: '#666' } }, riskLabel),
        React.createElement(Text, { style: styles.label }, 'Results:'),
        React.createElement(Text, { style: styles.content }, JSON.stringify(results, null, 2))
      )
    );

    // Render PDF to blob and then to array buffer
    const pdfBlob = await pdf(ReportDocument).toBlob();
    const arrayBuffer = await pdfBlob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="threat-report.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ message: 'Failed to generate PDF' }, { status: 500 });
  }
} 