import React, { useEffect } from "react";
import styled from "styled-components";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { IconButton } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { notificationDelete, notificationDeleteAll } from "../api";
import axios from "axios";
import { updateAlertFS, updateNotifications } from "../actions/userActions";
const Notifications = ({ alert, token }) => {
  const notifications = useSelector((state) => state.user.notifications);
  const dispatch = useDispatch();
  useEffect(() => {
    if (alert.notifications) {
      const newAlert = { requests: alert.requests, notifications: false };
      dispatch(updateAlertFS(newAlert, token));
    }
  }, []);

  const getTimeZone = (timeStr) => {
    const date = new Date(timeStr);
    return `${date.toTimeString().slice(0, 5)}`;
  };
  const getDateZone = (timeStr) => {
    const date = new Date(timeStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    const dateStr = `${day}/${month}/${year}`;
    return `${dateStr}`;
  };

  const notificationDeleteHandler = async (notifId) => {
    console.log("in notif");
    const notificationsUpdated = await axios.put(
      notificationDelete(),
      { notifId: notifId },
      {
        headers: { "x-auth-token": token },
      }
    );
    dispatch(updateNotifications(notificationsUpdated.data));
  };

  const deleteAllHandler = async () => {
    if (window.confirm("Sure you want to delete all the notifications?")) {
      await axios.put(
        notificationDeleteAll(),
        {},
        {
          headers: { "x-auth-token": token },
        }
      );
      dispatch(updateNotifications([]));
    }
  };
  return (
    <NotificationsStyled>
      {notifications.length > 0 && (
        <button className="delete-all" onClick={deleteAllHandler}>
          Delete All
        </button>
      )}
      <div className="notifications-container">
        {notifications && notifications.length > 0 ? (
          notifications.map((notif) => (
            <div className="notification" key={notif._id}>
              <div className="time-container">
                <p className="time">{getTimeZone(notif.createdAt)}</p>
                <p className="date">{getDateZone(notif.createdAt)}</p>
              </div>
              <p className="message">{notif.message}</p>
              <IconButton
                size="small"
                className="btn-icon"
                onClick={() => notificationDeleteHandler(notif._id)}
              >
                <DeleteForeverIcon className="icon-delete" />
              </IconButton>
            </div>
          ))
        ) : (
          <h4 className="no-notif">No Notifications</h4>
        )}
      </div>
    </NotificationsStyled>
  );
};

const NotificationsStyled = styled.div`
  width: 100%;

  margin-top: 1rem;
  position: relative;
  overflow-y: scroll;
  .notifications-container {
    margin-top: -1.2rem;
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .delete-all {
    position: sticky;
    top: 3px;
    left: 95%;
    margin: 0.2rem;
    padding: 0.2em 0.5em;
    font-family: "Rubik", sans-serif;
    background: #fff;
    color: #696969;
    border: 1px solid #69696945;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background: #ff000013;
    }
  }
  .no-notif {
    font-weight: 400;
  }
  .notification {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #6969691c;
    height: 2rem;
    border-radius: 5px;
    padding: 1em 1em;
    margin-bottom: 0.5rem;
    width: 50%;
    font-weight: 300;
    font-size: 0.9rem;
  }
  .time-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: 0.5rem;
    color: #696969;
    .time {
      margin-bottom: 0.3rem;
    }
  }
  .message {
    margin-right: 2rem;
  }
  .icon-delete {
    font-size: 1.2rem;
  }
  .btn-icon {
    width: 1.2rem;
    height: 1.2rem;
  }
`;
export default Notifications;
