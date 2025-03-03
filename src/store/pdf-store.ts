import { create } from 'zustand';

interface PdfState {
	pdfFile: File | null;
	pdfId: string | null;
	concept: string;
	gradeLevel: string;
	setPdf: (
		file: File,
		id: string,
		concept?: string,
		gradeLevel?: string
	) => void;
	clearPdf: () => void;
}

export const usePdfStore = create<PdfState>((set) => ({
	pdfFile: null,
	pdfId: null,
	concept: '',
	gradeLevel: '',
	setPdf: (file, id, concept = '', gradeLevel = '') =>
		set({ pdfFile: file, pdfId: id, concept, gradeLevel }),
	clearPdf: () =>
		set({ pdfFile: null, pdfId: null, concept: '', gradeLevel: '' }),
}));
