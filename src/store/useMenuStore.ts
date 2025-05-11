import { create } from 'zustand';

interface MenuState {
	showMenuDrawer: boolean;
	openMenuDrawer: () => void;
	closeMenuDrawer: () => void;
	toggleMenuDrawer: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
	showMenuDrawer: false,
	openMenuDrawer: () => set({ showMenuDrawer: true }),
	closeMenuDrawer: () => set({ showMenuDrawer: false }),
	toggleMenuDrawer: () =>
		set((state) => ({ showMenuDrawer: !state.showMenuDrawer })),
}));
