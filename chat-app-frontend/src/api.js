const baseURL = "https://chat-app-backend-sl.herokuapp.com/api";
const base = "https://chat-app-backend-sl.herokuapp.com";
export const getChats = () => `${baseURL}/chats`;

export const newChat = () => `${baseURL}/chats/new`;

export const newMsgPut = (id) => `${baseURL}/chats/messages/new/${id}`;
export const newMsg = () => `${baseURL}/chats/messages/new`;
export const getChatMessages = (id) => `${baseURL}/chats/messages/${id}`;

export const auth = () => `${baseURL}/auth`;
export const tokenAuth = () => `${baseURL}/auth/token`;
export const newUser = () => `${baseURL}/users/new`;

export const findUsers = (query) => `${baseURL}/users/find?query=${query}`;
export const getFriends = () => `${baseURL}/users/friends`;
export const sendFriendRequest = () => `${baseURL}/users/add`;
export const deleteFriend = () => `${baseURL}/users/removefriend`;
export const acceptRequest = () => `${baseURL}/users/acceptrequest`;
export const rejectRequest = () => `${baseURL}/users/rejectrequest`;
export const getRequests = () => `${baseURL}/users/requests`;
export const changePassword = () => `${baseURL}/users/changepassword`;
export const changeName = () => `${baseURL}/users/changename`;
export const notificationDelete = () => `${baseURL}/users/notifications/delete`;
export const notificationDeleteAll = () =>
  `${baseURL}/users/notifications/deleteall`;

export const userAlertUpdate = () => `${baseURL}/users/alert/update`;
export const userImage = (image) => `${base}/uploads/${image}`;
export const imageURL = (image) => `${base}/uploads/${image}`;
export const getUserImage = () => `${baseURL}/image`;

export const getChatImage = (id) => `${baseURL}/image/chat/${id}`;

export const uploadUserImageURL = () => `${base}/api/image`;
export const uploadChatImageURL = (id) => `${base}/api/image/chat/${id}`;

export const changeChatNameURL = () => `${baseURL}/chats/changename`;
export const getChatMembersURL = (chatId) =>
  `${baseURL}/chats/members/${chatId}`;
export const addUserChatURL = () => `${baseURL}/chats/adduser`;
export const removeUserChatURL = () => `${baseURL}/chats/removeuser`;
export const leaveChatURL = () => `${baseURL}/chats/leave`;

export const addManagerChatURL = () => `${baseURL}/chats/manager/add`;
export const removeManagerChatURL = () => `${baseURL}/chats/manager/remove`;
