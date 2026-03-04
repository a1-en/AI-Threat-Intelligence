import { NextResponse } from 'next/server';
import { pdf, Document, Page, Text, StyleSheet, View, Font } from '@react-pdf/renderer';
import React from 'react';

// Register fonts
Font.register({
    family: 'Helvetica-Bold',
    src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-bold@1.0.4/Helvetica-Bold.ttf'
});

export async function POST(req: Request) {
    try {
        const { lookups, email, stats } = await req.json();

        const colors = {
            primary: '#2563eb',
            bg: '#ffffff',
            dark: '#0f172a',
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
                marginBottom: 15,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: colors.dark,
            },
            statsGrid: {
                flexDirection: 'row',
                gap: 15,
                marginBottom: 30,
            },
            statCard: {
                flex: 1,
                backgroundColor: '#f8fafc',
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
            },
            statValue: {
                fontSize: 18,
                fontFamily: 'Helvetica-Bold',
                color: colors.primary,
            },
            statLabel: {
                fontSize: 8,
                color: colors.gray,
                marginTop: 4,
                textTransform: 'uppercase',
            },
            table: {
                width: 'auto',
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: colors.border,
                borderRightWidth: 0,
                borderBottomWidth: 0,
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
                fontSize: 8,
            },
            tableCol: {
                padding: 8,
                fontSize: 8,
            },
            scoreText: {
                fontFamily: 'Helvetica-Bold',
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

        const ReportDocument = React.createElement(
            Document,
            null,
            React.createElement(
                Page,
                { size: 'A4', style: styles.page },
                // Header
                React.createElement(View, { style: styles.header },
                    React.createElement(View, null,
                        React.createElement(Text, { style: styles.brand }, 'SECURITY DASHBOARD'),
                        React.createElement(Text, { style: { color: colors.gray, fontSize: 8, marginTop: 4 } }, 'THREAT INTELLIGENCE SUMMARY REPORT')
                    ),
                    React.createElement(View, { style: styles.reportMeta },
                        React.createElement(Text, null, `GENERATED: ${new Date().toLocaleString()}`),
                        React.createElement(Text, null, `ACCOUNT: ${email}`),
                        React.createElement(Text, null, `TOTAL INVESTIGATIONS: ${lookups.length}`)
                    )
                ),

                // Stats Quick Look
                React.createElement(View, { style: styles.section },
                    React.createElement(Text, { style: styles.sectionTitle }, 'Security Overview'),
                    React.createElement(View, { style: styles.statsGrid },
                        React.createElement(View, { style: styles.statCard },
                            React.createElement(Text, { style: styles.statValue }, lookups.length.toString()),
                            React.createElement(Text, { style: styles.statLabel }, 'Total Lookups')
                        ),
                        React.createElement(View, { style: styles.statCard },
                            React.createElement(Text, { style: [styles.statValue, { color: colors.malicious }] },
                                lookups.filter((l: any) => l.score >= 70).length.toString()
                            ),
                            React.createElement(Text, { style: styles.statLabel }, 'Critical Threats')
                        ),
                        React.createElement(View, { style: styles.statCard },
                            React.createElement(Text, { style: [styles.statValue, { color: colors.suspicious }] },
                                lookups.filter((l: any) => l.score >= 30 && l.score < 70).length.toString()
                            ),
                            React.createElement(Text, { style: styles.statLabel }, 'Suspicious')
                        ),
                        React.createElement(View, { style: styles.statCard },
                            React.createElement(Text, { style: [styles.statValue, { color: colors.clean }] },
                                lookups.filter((l: any) => l.score < 30).length.toString()
                            ),
                            React.createElement(Text, { style: styles.statLabel }, 'Clean/Safe')
                        )
                    )
                ),

                // Recent Investigations Table
                React.createElement(View, { style: styles.section },
                    React.createElement(Text, { style: styles.sectionTitle }, 'Recent Security Investigations'),
                    React.createElement(View, { style: styles.table },
                        React.createElement(View, { style: [styles.tableRow, { backgroundColor: '#f8fafc' }] },
                            React.createElement(Text, { style: [styles.tableColHeader, { flex: 3 }] }, 'TARGET / QUERY'),
                            React.createElement(Text, { style: [styles.tableColHeader, { flex: 1 }] }, 'TYPE'),
                            React.createElement(Text, { style: [styles.tableColHeader, { flex: 1 }] }, 'SCORE'),
                            React.createElement(Text, { style: [styles.tableColHeader, { flex: 2 }] }, 'TIMESTAMP')
                        ),
                        lookups.map((lookup: any, i: number) =>
                            React.createElement(View, { key: i, style: styles.tableRow },
                                React.createElement(Text, { style: [styles.tableCol, { flex: 3, fontFamily: 'Helvetica-Bold' }] }, lookup.query),
                                React.createElement(Text, { style: [styles.tableCol, { flex: 1, textTransform: 'uppercase' }] }, lookup.queryType),
                                React.createElement(Text, { style: [styles.tableCol, { flex: 1, color: getScoreColor(lookup.score), fontFamily: 'Helvetica-Bold' }] }, `${lookup.score}%`),
                                React.createElement(Text, { style: [styles.tableCol, { flex: 2, color: colors.gray }] }, new Date(lookup.createdAt).toLocaleString())
                            )
                        )
                    )
                ),

                // Footer
                React.createElement(View, { style: styles.footer },
                    React.createElement(Text, null, 'CONFIDENTIAL SECURITY AUDIT'),
                    React.createElement(Text, null, 'AI THREAT INTELLIGENCE PLATFORM V2.5'),
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
                'Content-Disposition': `attachment; filename="Security_Dashboard_Summary_${new Date().getTime()}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Dashboard PDF generation error:', error);
        return NextResponse.json({ message: 'Failed to generate Dashboard PDF' }, { status: 500 });
    }
}
