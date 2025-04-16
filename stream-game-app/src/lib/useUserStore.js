import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: {
        email: "",
        u_name: "",
        password: "",
        signature: "",
      },
      setUser: (user) => set({ user }),
      logout: () => {
        // 清除本地存储中的用户数据（由 persist 自动处理）
        set({ user: null });
      },
    }),
    {
      name: "user-storage", // 存储的名称，用于 localStorage 的键名
      getStorage: () => localStorage, // 使用 localStorage
    }
  )
);

export default useUserStore;
