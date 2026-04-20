/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { escapeT, useFlowContext, FlowContextSelector, observer } from '@nocobase/flow-engine';
import { css } from '@emotion/css';
import { Card, Spin, theme, Tooltip, Select, InputNumber } from 'antd';
import { LinkOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import RIframe from 'react-iframe';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CodeEditor,
  BlockModel,
  useCompile,
  useRequest,
  TextAreaWithContextSelector,
  joinUrlSearch,
} from '@nocobase/client';
const HtmlEditorBase = (props) => {
  const { value, onChange } = props;
  const ctx = useFlowContext();
  return React.createElement(CodeEditor, {
    ...props,
    language: 'html',
    value: value,
    onChange: onChange,
    RightExtra: ({ viewRef }) =>
      React.createElement(FlowContextSelector, {
        onChange: (text) => {
          if (!text) return;
          const view = viewRef.current;
          if (!view) return;
          const { from, to } = view.state.selection.main;
          const newPos = from + text.length;
          view.dispatch({ changes: { from, to, insert: text }, selection: { anchor: newPos }, scrollIntoView: true });
          view.focus();
        },
        metaTree: () => ctx.getPropertyMetaTree(),
      }),
  });
};
const Iframe = observer(
  (props) => {
    const { url, htmlId, mode = 'url', html, params, heightMode, ...others } = props;
    const { token } = theme.useToken();
    const compile = useCompile();
    const ctx = useFlowContext();
    const { loading, data: htmlContent } = useRequest(
      {
        url: `iframeHtml:getHtml/${htmlId}`,
      },
      {
        refreshDeps: [htmlId, html],
        ready: mode === 'html' && !!htmlId,
      },
    );
    const [src, setSrc] = useState(null);
    useEffect(() => {
      let active = true; // 标记当前请求是否有效
      const generateSrc = async (content) => {
        if (mode === 'html') {
          if (!content) return;
          try {
            const liquid = ctx.liquid;
            const result = await liquid.renderWithFullContext(content, ctx);
            const targetHtmlContent = compile(result);
            if (targetHtmlContent === undefined) return;
            const encodedHtml = encodeURIComponent(targetHtmlContent);
            const dataUrl = 'data:text/html;charset=utf-8,' + encodedHtml;
            if (active) {
              setSrc(dataUrl);
            }
          } catch (err) {
            console.error(err);
          }
        } else {
          try {
            const targetUrl = joinUrlSearch(url, params);
            if (active) setSrc(targetUrl);
          } catch (error) {
            console.error('Error fetching target URL:', error);
            if (active) setSrc('fallback-url');
          }
        }
      };
      generateSrc(htmlContent);
      // cleanup: 标记旧调用无效
      return () => {
        active = false;
      };
    }, [htmlContent, mode, url, params, html, htmlId]);
    if (loading && !src) {
      return React.createElement(
        'div',
        {
          style: {
            height: heightMode === 'defaultHeight' ? '60vh' : '100%',
            border: 0,
          },
        },
        React.createElement(Spin, null),
      );
    }
    return React.createElement(RIframe, {
      url: src,
      width: '100%',
      display: 'block',
      position: 'relative',
      styles: {
        height: heightMode === 'defaultHeight' ? '60vh' : '100%',
        border: 0,
      },
      ...others,
    });
  },
  { displayName: 'Iframe' },
);
export class IframeBlockModel extends BlockModel {
  renderComponent() {
    const { url, htmlId, mode = 'url', html, params, ...others } = this.props;
    const { heightMode } = this.decoratorProps;
    const token = this.context.themeToken;
    const t = this.context.t;
    if ((mode === 'url' && !url) || (mode === 'html' && !htmlId)) {
      return React.createElement(Card, { style: { marginBottom: token.padding } }, t('Please fill in the iframe URL'));
    }
    return React.createElement(Iframe, { ...this.props, heightMode: heightMode });
  }
}
const AllowDescription = () => {
  const { t, i18n } = useTranslation();
  const helpURL =
    i18n.language === 'zh-CN'
      ? 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/iframe#allow'
      : 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#allow';
  return React.createElement(
    'span',
    null,
    t(
      'Specifies a Permissions Policy for the <iframe>. The policy defines what features are available to the <iframe> (for example, access to the microphone, camera, battery, web-share, etc.) based on the origin of the request.',
    ),
    React.createElement(
      'a',
      { href: helpURL, target: '_blank', rel: 'noreferrer' },
      React.createElement(LinkOutlined, null),
    ),
  );
};
const AllowOptionsHelp = ({ type }) => {
  const { t, i18n } = useTranslation();
  const typeToDescription = {
    autoplay: t(
      'Controls whether the current document is allowed to autoplay media requested through the HTMLMediaElement interface. When this policy is disabled and there were no user gestures, the Promise returned by HTMLMediaElement.play() will reject with a NotAllowedError DOMException. The autoplay attribute on <audio> and <video> elements will be ignored.',
    ),
    camera: t(
      'Controls whether the current document is allowed to use video input devices. When this policy is disabled, the Promise returned by getUserMedia() will reject with a NotAllowedError DOMException.',
    ),
    'document-domain': t(
      'Controls whether the current document is allowed to set document.domain. When this policy is disabled, attempting to set document.domain will fail and cause a SecurityError DOMException to be thrown.',
    ),
    'encrypted-media': t(
      'Controls whether the current document is allowed to use the Encrypted Media Extensions API (EME). When this policy is disabled, the Promise returned by Navigator.requestMediaKeySystemAccess() will reject with a SecurityError DOMException.',
    ),
    fullscreen: t(
      'Controls whether the current document is allowed to use Element.requestFullscreen(). When this policy is disabled, the returned Promise rejects with a TypeError.',
    ),
    geolocation: t(
      'Controls whether the current document is allowed to use the Geolocation Interface. When this policy is disabled, calls to getCurrentPosition() and watchPosition() will cause those functions callbacks to be invoked with a GeolocationPositionError code of PERMISSION_DENIED.',
    ),
    microphone: t(
      'Controls whether the current document is allowed to use audio input devices. When this policy is disabled, the Promise returned by MediaDevices.getUserMedia() will reject with a NotAllowedError DOMException.',
    ),
    midi: t(
      'Controls whether the current document is allowed to use the Web MIDI API. When this policy is disabled, the Promise returned by Navigator.requestMIDIAccess() will reject with a SecurityError DOMException.',
    ),
    payment: t(
      'Controls whether the current document is allowed to use the Payment Request API. When this policy is enabled, the PaymentRequest() constructor will throw a SecurityError DOMException.',
    ),
  };
  const description = typeToDescription[type];
  return React.createElement(
    'span',
    null,
    type,
    React.createElement(
      Tooltip,
      {
        zIndex: 9999,
        title: React.createElement(
          'span',
          null,
          description,
          React.createElement(
            'a',
            {
              href: `https://developer.mozilla.org/${
                i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US'
              }/docs/Web/HTTP/Reference/Headers/Permissions-Policy/${type}`,
              target: '_blank',
              rel: 'noreferrer',
            },
            React.createElement(LinkOutlined, null),
          ),
        ),
      },
      React.createElement(QuestionCircleOutlined, null),
    ),
  );
};
IframeBlockModel.registerFlow({
  key: 'iframeBlockSettings',
  title: escapeT('Iframe block setting', { ns: 'block-iframe' }),
  steps: {
    editIframe: {
      title: escapeT('Edit iframe', { ns: 'block-iframe' }),
      uiSchema(ctx) {
        const t = ctx.t;
        return {
          mode: {
            title: '{{t("Mode")}}',
            'x-component': 'Radio.Group',
            'x-decorator': 'FormItem',
            required: true,
            default: 'url',
            enum: [
              { value: 'url', label: t('URL') },
              { value: 'html', label: t('HTML') },
            ],
          },
          url: {
            title: t('URL'),
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': TextAreaWithContextSelector,
            description: t('Do not concatenate search params in the URL'),
            required: true,
            'x-reactions': {
              dependencies: ['mode'],
              fulfill: {
                state: {
                  hidden: '{{$deps[0] === "html"}}',
                },
              },
            },
          },
          allow: {
            title: 'Allow',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': (props) => {
              return React.createElement(Select, {
                ...props,
                allowClear: true,
                options: [
                  { value: 'autoplay', label: React.createElement(AllowOptionsHelp, { type: 'autoplay' }) },
                  { value: 'camera', label: React.createElement(AllowOptionsHelp, { type: 'camera' }) },
                  {
                    value: 'document-domain',
                    label: React.createElement(AllowOptionsHelp, { type: 'document-domain' }),
                  },
                  {
                    value: 'encrypted-media',
                    label: React.createElement(AllowOptionsHelp, { type: 'encrypted-media' }),
                  },
                  { value: 'fullscreen', label: React.createElement(AllowOptionsHelp, { type: 'fullscreen' }) },
                  { value: 'geolocation', label: React.createElement(AllowOptionsHelp, { type: 'geolocation' }) },
                  { value: 'microphone', label: React.createElement(AllowOptionsHelp, { type: 'microphone' }) },
                  { value: 'midi', label: React.createElement(AllowOptionsHelp, { type: 'midi' }) },
                  { value: 'payment', label: React.createElement(AllowOptionsHelp, { type: 'payment' }) },
                ],
              });
            },
            description: React.createElement(AllowDescription, null),
          },
          params: {
            type: 'array',
            'x-component': 'ArrayItems',
            'x-decorator': 'FormItem',
            title: `{{t("Search parameters")}}`,
            items: {
              type: 'object',
              properties: {
                space: {
                  type: 'void',
                  'x-component': 'Space',
                  'x-component-props': {
                    style: {
                      flexWrap: 'nowrap',
                      maxWidth: '100%',
                      width: '100%',
                    },
                    className: css`
                      & > .ant-space-item:first-child,
                      & > .ant-space-item:last-child {
                        flex-shrink: 0;
                      }
                      & > .ant-space-item:nth-child(2) {
                        width: 100%;
                      }
                    `,
                  },
                  properties: {
                    name: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: `{{t("Name")}}`,
                      },
                    },
                    value: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': TextAreaWithContextSelector,
                      'x-component-props': {
                        placeholder: `{{t("Value")}}`,
                        useTypedConstant: true,
                        changeOnSelect: true,
                        rows: 1,
                        style: {
                          width: '100%',
                        },
                      },
                    },
                    remove: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems.Remove',
                    },
                  },
                },
              },
            },
            'x-reactions': {
              dependencies: ['mode'],
              fulfill: {
                state: {
                  hidden: '{{$deps[0] === "html"}}',
                },
              },
            },
            properties: {
              add: {
                type: 'void',
                title: `{{t("Add parameter")}}`,
                'x-component': 'ArrayItems.Addition',
              },
            },
          },
          html: {
            title: t('html'),
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': HtmlEditorBase,
            'x-component-props': {
              minHeight: '320px',
              theme: 'light',
              enableLinter: true,
              // ref:{editorRef}
              // rightExtra: (
              //   <FlowContextSelector
              //     onChange={(val) => {
              //       if (!val) return;
              //       editorRef.current?.insertAtCursor(val);
              //     }}
              //     metaTree={() => ctx.getPropertyMetaTree()}
              //   />
              // ),
              // wrapperStyle: {
              //   position: 'fixed',
              //   inset: 8,
              // },
            },
            'x-reactions': {
              dependencies: ['mode'],
              fulfill: {
                state: {
                  hidden: '{{$deps[0] === "url"}}',
                },
              },
            },
            required: true,
          },
          height: {
            title: t('Height'),
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': InputNumber,
            'x-component-props': {
              addonAfter: 'px',
            },
            'x-validator': [
              {
                minimum: 40,
              },
            ],
          },
        };
      },
      useRawParams: (ctx) => {
        return ctx.model.props.model === 'html';
      },
      async beforeParamsSave(ctx, params) {
        const { mode, html, htmlId } = params;
        const saveHtml = async (html) => {
          const options = {
            values: { html },
          };
          if (htmlId) {
            // eslint-disable-next-line no-unsafe-optional-chaining
            const { data } = await ctx.api.resource('iframeHtml').update?.({ ...options, filterByTk: htmlId });
            return data?.data?.[0] || { id: htmlId };
          } else {
            // eslint-disable-next-line no-unsafe-optional-chaining
            const { data } = await ctx.api.resource('iframeHtml').create?.(options);
            return data;
          }
        };
        if (mode === 'html') {
          const data = await saveHtml(html);
          ctx.model.setStepParams('iframeBlockSettings', 'editIframe', { htmlId: data.data?.id || data?.id });
        }
      },
      async handler(ctx, params) {
        const { mode, url, html, params: searchParams, allow, htmlId, height } = params;
        ctx.model.setProps({
          mode,
          url,
          html,
          params: searchParams,
          allow,
          htmlId,
          height,
        });
      },
    },
  },
});
IframeBlockModel.define({
  label: escapeT('Iframe'),
});
//# sourceMappingURL=IframeBlockModel.js.map
