import db from '../../config/db';
import { createApiError } from '../../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';

export const claimCertificate = async (userId: number, subjectId: number) => {
    const subject = await db('subjects').where({ id: subjectId }).first();
    if (!subject) throw createApiError('Subject not found', 404);

    const { getSubjectProgress } = await import('../progress/progress.service');
    const progress = await getSubjectProgress(userId, subjectId);

    if (progress.percent_complete < 100) {
        throw createApiError('You must complete 100% of the course to claim a certificate', 400);
    }

    const existing = await db('certificates').where({ user_id: userId, subject_id: subjectId }).first();
    if (existing) {
        return existing;
    }

    const certificateHash = uuidv4();
    const [id] = await db('certificates').insert({
        user_id: userId,
        subject_id: subjectId,
        certificate_hash: certificateHash,
        issued_at: new Date()
    });

    return db('certificates').where({ id }).first();
};

export const getCertificateBySubject = async (userId: number, subjectId: number) => {
    return db('certificates').where({ user_id: userId, subject_id: subjectId }).first();
};

export const generateCertificatePDF = async (userId: number, subjectId: number, res: any) => {
    const cert = await db('certificates').where({ user_id: userId, subject_id: subjectId }).first();
    if (!cert) throw createApiError('Certificate not found. Please claim it first.', 404);

    const user = await db('users').where({ id: userId }).first();
    const subject = await db('subjects').where({ id: subjectId }).first();

    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${subject.title.replace(/\s+/g, '_')}.pdf`);
    doc.pipe(res);

    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a');
    doc.lineWidth(4).strokeColor('#f97316');
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
    doc.lineWidth(1).strokeColor('white');

    doc.fillColor('#f97316').fontSize(50).text('CERTIFICATE OF COMPLETION', 0, 150, { align: 'center' });
    doc.fillColor('white').fontSize(20).text('This is proudly presented to', 0, 230, { align: 'center' });
    
    doc.fillColor('#ec4899').fontSize(40).text(user.name, 0, 280, { align: 'center' });
    
    doc.fillColor('white').fontSize(20).text('For successfully completing the course', 0, 350, { align: 'center' });
    doc.fillColor('#4ade80').fontSize(30).text(subject.title, 0, 400, { align: 'center' });

    doc.fillColor('rgba(255,255,255,0.5)').fontSize(12).text(`Issued on: ${new Date(cert.issued_at).toLocaleDateString()}`, 50, 500);
    doc.fillColor('rgba(255,255,255,0.5)').fontSize(12).text(`Credential ID: ${cert.certificate_hash}`, 50, 520);

    doc.end();
};
