// stores/useStore.ts
import { create } from "zustand";
import { User, Course, Service, Partner, PageContent } from "../types";

interface AppState {
  // Theme and Language
  theme: "light" | "dark";
  language: "fr" | "en";

  // Authentication
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Data
  courses: Course[];
  services: Service[];
  partners: Partner[];
  pageContent: PageContent[];

  // Actions
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: "fr" | "en") => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
  setCourses: (courses: Course[]) => void;
  setServices: (services: Service[]) => void;
  setPartners: (partners: Partner[]) => void;
  setPageContent: (content: PageContent[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addPartner: (partner: Partner) => void;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  deletePartner: (id: string) => void;
  setIsAuth: (isAuthenticated: boolean) => void;
}

export const useStore = create<AppState>((set, get) => {
  // Initialize from localStorage
  const initializeAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (token && user) {
      return { user, token, isAuthenticated: true };
    }
    return { user: null, token: null, isAuthenticated: false };
  };

  return {
    // Initial state
    theme: (localStorage.getItem("theme") as "light" | "dark") || "light",
    language: (localStorage.getItem("language") as "fr" | "en") || "fr",
    ...initializeAuth(),
    courses: [],
    services: [],
    partners: [],
    pageContent: [],

    // Actions
    setTheme: (theme) => {
      localStorage.setItem("theme", theme);
      set({ theme });
    },

    setLanguage: (language) => {
      localStorage.setItem("language", language);
      set({ language });
    },

    setIsAuth: (isAuthenticated) => set({ isAuthenticated }),

    login: (user, token) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, token: null, isAuthenticated: false });
    },

    initializeAuth: () => {
      const authState = initializeAuth();
      set(authState);
    },

    setCourses: (courses) => set({ courses }),
    setServices: (services) => set({ services }),
    setPartners: (partners) => set({ partners }),
    setPageContent: (pageContent) => set({ pageContent }),

    addCourse: (course) =>
      set((state) => ({ courses: [...state.courses, course] })),
    updateCourse: (id, updatedCourse) =>
      set((state) => ({
        courses: state.courses.map((course) =>
          course.id === id ? { ...course, ...updatedCourse } : course
        ),
      })),
    deleteCourse: (id) =>
      set((state) => ({
        courses: state.courses.filter((course) => course.id !== id),
      })),

    addService: (service) =>
      set((state) => ({ services: [...state.services, service] })),
    updateService: (id, updatedService) =>
      set((state) => ({
        services: state.services.map((service) =>
          service.id === id ? { ...service, ...updatedService } : service
        ),
      })),
    deleteService: (id) =>
      set((state) => ({
        services: state.services.filter((service) => service.id !== id),
      })),

    addPartner: (partner) =>
      set((state) => ({ partners: [...state.partners, partner] })),
    updatePartner: (id, updatedPartner) =>
      set((state) => ({
        partners: state.partners.map((partner) =>
          partner.id === id ? { ...partner, ...updatedPartner } : partner
        ),
      })),
    deletePartner: (id) =>
      set((state) => ({
        partners: state.partners.filter((partner) => partner.id !== id),
      })),
  };
});
