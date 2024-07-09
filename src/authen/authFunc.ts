import { cookies } from "../constants/constants";

export const logOut = () => cookies.get('localDataObject') ? true : false