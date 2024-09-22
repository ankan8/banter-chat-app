export const host = "https://banter-chat-app-api.vercel.app";

// Auth routes
export const registerRoute = `${host}/api/auth/register`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
export const allUsersRoute = `${host}/api/auth/allusers`;

// Message routes
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const getAllMessagesRoute = `${host}/api/messages/getmsg`;

// Login route
export const loginRoute = `${host}/login`;
