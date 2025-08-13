import { create } from 'zustand'

const useStore = create((set) => ({
  loading: false,
  setLoading: (state) => set({ loading: state }),
}))

export default useStore;