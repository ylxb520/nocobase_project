/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useRef } from 'react';
import { Layout, Card, Button, Divider, Tooltip, notification, Avatar, Flex, Typography } from 'antd';
import {
  CloseOutlined,
  FullscreenOutlined,
  PlusCircleOutlined,
  FullscreenExitOutlined,
  CodeOutlined,
  CompressOutlined,
  BugOutlined, // [AI_DEBUG]
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useMobileLayout, useToken } from '@nocobase/client';
const { Header, Footer, Sider } = Layout;
import { Conversations } from './Conversations';
import { Messages } from './Messages';
import { Sender } from './Sender';
import { useT } from '../../locale';
import { UserPrompt } from './UserPrompt';
import { useChatBoxStore } from './stores/chat-box';
import { useChatBoxActions } from './hooks/useChatBoxActions';
import { observer } from '@nocobase/flow-engine';
import { dialogController } from '../stores/dialog-controller';
import { CodeHistory } from '../ai-coding/CodeHistory';
import { isEngineer } from '../built-in/utils';
import { avatars } from '../avatars';
const { Text } = Typography;
export const ChatBox = () => {
  const chatBoxRef = useRef(null);
  const setChatBoxRef = useChatBoxStore.use.setChatBoxRef();
  const setOpen = useChatBoxStore.use.setOpen();
  const currentEmployee = useChatBoxStore.use.currentEmployee();
  const expanded = useChatBoxStore.use.expanded();
  const setExpanded = useChatBoxStore.use.setExpanded();
  const setMinimize = useChatBoxStore.use.setMinimize();
  const showConversations = useChatBoxStore.use.showConversations();
  const setShowConversations = useChatBoxStore.use.setShowConversations();
  const setShowCodeHistory = useChatBoxStore.use.setShowCodeHistory();
  // [AI_DEBUG]
  const showDebugPanel = useChatBoxStore.use.showDebugPanel();
  const setShowDebugPanel = useChatBoxStore.use.setShowDebugPanel();
  const { startNewConversation } = useChatBoxActions();
  const { token } = useToken();
  const t = useT();
  useEffect(() => {
    setChatBoxRef(chatBoxRef);
  }, []);
  const { isMobileLayout } = useMobileLayout();
  return React.createElement(
    Layout,
    { style: { height: '100%', position: 'relative' }, ref: chatBoxRef },
    showConversations &&
      !expanded &&
      React.createElement(
        React.Fragment,
        null,
        React.createElement('div', {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10,
            cursor: 'pointer',
          },
          onClick: () => setShowConversations(false),
        }),
        React.createElement(
          'div',
          {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '300px',
              height: '100%',
              backgroundColor: token.colorBgContainer,
              zIndex: 11,
              borderRight: `1px solid ${token.colorBorder}`,
              overflow: 'hidden',
            },
          },
          React.createElement(Conversations, null),
        ),
      ),
    showConversations &&
      expanded &&
      React.createElement(
        Sider,
        {
          width: 300,
          style: {
            backgroundColor: token.colorBgContainer,
            borderRight: `1px solid ${token.colorBorder}`,
            overflow: 'hidden',
          },
        },
        React.createElement(Conversations, null),
      ),
    React.createElement(
      Layout,
      null,
      React.createElement(
        Header,
        {
          style: {
            backgroundColor: token.colorBgContainer,
            height: '48px',
            lineHeight: '48px',
            padding: '0 16px',
            borderBottom: `1px solid ${token.colorBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        },
        React.createElement(
          'div',
          null,
          React.createElement(Button, {
            icon: showConversations
              ? React.createElement(MenuFoldOutlined, null)
              : React.createElement(MenuUnfoldOutlined, null),
            type: 'text',
            onClick: (e) => {
              e.stopPropagation();
              setShowConversations(!showConversations);
            },
          }),
        ),
        React.createElement(
          'div',
          null,
          currentEmployee
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  Tooltip,
                  { arrow: false, title: t('New conversation') },
                  React.createElement(Button, {
                    icon: React.createElement(PlusCircleOutlined, null),
                    type: 'text',
                    onClick: startNewConversation,
                  }),
                ),
                React.createElement(UserPrompt, null),
                isEngineer(currentEmployee) &&
                  React.createElement(
                    Tooltip,
                    { arrow: false, title: t('Code history') },
                    React.createElement(Button, {
                      icon: React.createElement(CodeOutlined, null),
                      type: 'text',
                      onClick: () => {
                        setShowCodeHistory(true);
                      },
                    }),
                  ),
                !expanded &&
                  React.createElement(
                    Tooltip,
                    { arrow: false, title: t('Debug Panel') },
                    React.createElement(Button, {
                      icon: React.createElement(BugOutlined, null),
                      type: 'text',
                      onClick: () => setShowDebugPanel(!showDebugPanel),
                    }),
                  ),
                React.createElement(Divider, { type: 'vertical' }),
              )
            : null,
          isMobileLayout
            ? React.createElement(Button, {
                icon: React.createElement(CompressOutlined, null),
                type: 'text',
                onClick: () => {
                  setMinimize(true);
                },
              })
            : React.createElement(Button, {
                icon: !expanded
                  ? React.createElement(FullscreenOutlined, null)
                  : React.createElement(FullscreenExitOutlined, null),
                type: 'text',
                onClick: () => {
                  if (!expanded) {
                    setShowDebugPanel(false);
                  }
                  setExpanded(!expanded);
                },
              }),
          React.createElement(
            Tooltip,
            { arrow: false, title: t('Collapse panel') },
            React.createElement(Button, {
              icon: React.createElement(CloseOutlined, null),
              type: 'text',
              onClick: () => setOpen(false),
            }),
          ),
        ),
      ),
      React.createElement(Messages, null),
      React.createElement(
        Footer,
        {
          style: {
            backgroundColor: token.colorBgContainer,
            padding: 0,
          },
        },
        React.createElement(Sender, null),
        React.createElement(
          'div',
          {
            style: {
              textAlign: 'center',
              margin: '10px 0',
              fontSize: token.fontSizeSM,
              color: token.colorTextTertiary,
            },
          },
          t('AI disclaimer'),
        ),
      ),
    ),
  );
};
const ExpandChatBox = observer(() => {
  return React.createElement(
    Card,
    {
      style: {
        position: 'fixed',
        transform: 'translate(-50%, -50%)',
        left: '50%',
        top: '50%',
        width: '95%',
        height: '95%',
        zIndex: dialogController.shouldHide ? -1 : 1100,
      },
      styles: {
        body: {
          height: '100%',
          padding: 0,
        },
      },
    },
    React.createElement(ChatBox, null),
  );
});
const MobileLayoutChatBox = observer(({ minimize }) => {
  return React.createElement(
    'div',
    {
      style: {
        position: 'fixed',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        zIndex: dialogController.shouldHide ? -1 : 1100,
        backgroundColor: 'white',
        display: minimize ? 'none' : 'block',
      },
    },
    React.createElement(ChatBox, null),
    React.createElement(ChatBoxMinimizeControl, null),
  );
});
export const ChatBoxMinimizeControl = () => {
  const currentEmployee = useChatBoxStore.use.currentEmployee();
  const minimize = useChatBoxStore.use.minimize();
  const setMinimize = useChatBoxStore.use.setMinimize();
  const setOpen = useChatBoxStore.use.setOpen();
  const t = useT();
  const [api, contextHolder] = notification.useNotification();
  const key = useRef(`ai-chat-box-minimize--control-${new Date().getTime()}`);
  const currentEmployeeAvatar = currentEmployee?.avatar;
  useEffect(() => {
    if (minimize === true && currentEmployeeAvatar) {
      api.open({
        key: key.current,
        closeIcon: false,
        message: React.createElement(
          Flex,
          { justify: 'space-between', align: 'center' },
          React.createElement(Avatar, { shape: 'circle', size: 35, src: avatars(currentEmployeeAvatar) }),
          React.createElement(Text, { ellipsis: true }, t('Conversation')),
          React.createElement(Button, {
            type: 'text',
            icon: React.createElement(CloseOutlined, null),
            onClick: (e) => {
              e.stopPropagation();
              setOpen(false);
              setMinimize(false);
            },
          }),
        ),
        duration: 0,
        placement: 'top',
        style: {
          width: 200,
        },
        onClick() {
          setMinimize(false);
        },
      });
    } else {
      api.destroy(key.current);
    }
    return () => {
      api.destroy(key.current);
    };
  }, [api, currentEmployeeAvatar, minimize, setMinimize, setOpen, t]);
  return React.createElement(React.Fragment, null, contextHolder);
};
export const ChatBoxWrapper = () => {
  const expanded = useChatBoxStore.use.expanded();
  const minimize = useChatBoxStore.use.minimize();
  const showCodeHistory = useChatBoxStore.use.showCodeHistory();
  const { isMobileLayout } = useMobileLayout();
  if (isMobileLayout) {
    return React.createElement(MobileLayoutChatBox, { minimize: minimize });
  }
  if (expanded) {
    return React.createElement(ExpandChatBox, null);
  }
  return React.createElement(
    'div',
    {
      style: {
        position: 'fixed',
        transform: 'translateX(0px) !important',
        right: '-450px',
        zIndex: 1,
        top: 0,
        width: '450px',
        height: '100vh',
        overflow: 'hidden',
        borderInlineStart: '1px solid rgba(5, 5, 5, 0.06)',
      },
    },
    showCodeHistory ? React.createElement(CodeHistory, null) : React.createElement(ChatBox, null),
  );
};
//# sourceMappingURL=ChatBox.js.map
