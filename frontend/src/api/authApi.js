import API from "./api";

export const loginUser = async (username, password) => {
  return API.post("/auth/login", { username, password });
};

