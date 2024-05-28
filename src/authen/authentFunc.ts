export const getUser = () => !localStorage.getItem("token") ? false : true
export const getLogin = () => localStorage.getItem("token") ? true : false
export const userlevel = () => localStorage.getItem("userlevel")