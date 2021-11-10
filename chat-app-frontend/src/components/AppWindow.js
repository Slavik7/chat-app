import React, { useEffect, useState } from "react";
import ChatRooms from "./ChatRooms";
import ChatWindow from "./ChatWindow";
import FriendsList from "./FriendsList";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import Settings from "./Settings";
import AddFriends from "./AddFriends";
import { Route, Switch } from "react-router-dom";
import {
  friendsUpdate,
  updateAlert,
  updateLastMessage,
  updateRequests,
  updateUserChats,
  userLoginByToken,
} from "../actions/userActions";
import NewChat from "./NewChat";
import PopupMessage from "./PopupMessage";
import ChatSettings from "./ChatSettings";
import Pusher from "pusher-js";
import {
  resetActiveChat,
  updateActiveChat,
  updateRealTimeMessage,
} from "../actions/chatActions";
import NotificationsPage from "./NotificationsPage";
const AppWindow = ({ user }) => {
  const popMessage = useSelector((state) => state.popMessage);
  const activeChat = useSelector((state) => state.chat);
  const [realTimeData, setRealTimeData] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user.active) {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        const token = JSON.parse(userToken);
        dispatch(userLoginByToken(token));
      } else {
        window.location.assign("/login");
      }
      // dispatch(requestsUpdate(user.token));
      // dispatch(friendsUpdate(user.token));
    }
  }, [dispatch]);

  const realTimeMsgUpdate = (data) => {
    setRealTimeData({ data: data, type: "MESSAGE" });
  };
  const realTimeChatUpdate = (data) => {
    setRealTimeData({ data: data, type: "CHAT" });
  };
  //Real time update on the current active chat and other chats
  useEffect(() => {
    if (realTimeData && user.active) {
      switch (realTimeData.type) {
        case "MESSAGE": {
          if (realTimeData.data.chatId === activeChat._id)
            dispatch(updateRealTimeMessage(realTimeData.data.msg));
          dispatch(
            updateLastMessage(realTimeData.data.chatId, realTimeData.data.msg)
          );
          break;
        }
        case "CHAT": {
          dispatch(updateUserChats(user.token));

          if (realTimeData.data.chat._id === activeChat._id) {
            if (realTimeData.data.removed) {
              dispatch(resetActiveChat());
            } else {
              dispatch(updateActiveChat(realTimeData.data.chat));
            }
          }

          break;
        }
        case "FRIENDS": {
          dispatch(friendsUpdate(user.token));
        }
        default: {
          break;
        }
      }
      if (realTimeData.data.alert)
        dispatch(updateAlert(realTimeData.data.alert));
      if (realTimeData.data.notifications)
        dispatch(realTimeData.data.notifications);
      if (realTimeData.data.requests)
        dispatch(updateRequests(realTimeData.data.requests));
      setRealTimeData(null);
    }
  }, [realTimeData, dispatch]);
  //useEffect to inital subscribe to pusher
  useEffect(() => {
    if (user._id) {
      const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
        cluster: "eu",
      });
      const channel = pusher.subscribe(`user_${user._id}`);
      channel.bind("message", function (data) {
        realTimeMsgUpdate(data);
      });

      //TODO: FIXXX THE CHAT ADD REAL TIME
      channel.bind("chat", function (data) {
        realTimeChatUpdate(data);
      });

      channel.bind("friends", (data) => {
        setRealTimeData({ data: data, type: "FRIENDS" });
      });
    }
  }, [user._id, dispatch]);

  return (
    user.active && (
      <StyledAppWindow>
        {popMessage.active && <PopupMessage />}
        <Header alert={user.alert} />
        <MainAppStyled>
          <Switch>
            <Route path="/app" exact>
              <ChatRooms chatrooms={user.chats} token={user.token} />
              <ChatWindow userId={user._id} token={user.token} />
              <FriendsList friends={user.friends} token={user.token} />
            </Route>
            <Route path="/app/settings">
              <Settings user={user} />
            </Route>
            <Route path="/app/addfriends">
              <AddFriends user={user} />
            </Route>
            <Route path="/app/notifications">
              <NotificationsPage
                requests={user.requests}
                alert={user.alert}
                token={user.token}
              />
            </Route>
            <Route path="/app/chat/new">
              <NewChat token={user.token} />
            </Route>
            <Route path="/app/chat/settings">
              <ChatSettings token={user.token} />
            </Route>
          </Switch>
        </MainAppStyled>
      </StyledAppWindow>
    )
  );
};

export default AppWindow;

const StyledAppWindow = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
`;
const MainAppStyled = styled.div`
  display: flex;
  height: 100%;
`;
