/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare class FlowI18n {
  protected context: any;
  constructor(context: any);
  /**
   * 翻译函数，支持简单翻译和模板编译
   * @param keyOrTemplate 翻译键或包含 {{t('key', options)}} 的模板字符串
   * @param options 翻译选项（如命名空间、参数等）
   * @returns 翻译后的文本
   *
   * @example
   * // 简单翻译
   * flowEngine.t('Hello World')
   * flowEngine.t('Hello {name}', { name: 'John' })
   *
   * // 模板编译
   * flowEngine.t("{{t('Hello World')}}")
   * flowEngine.t("{{ t( 'User Name' ) }}")
   * flowEngine.t("{{  t  (  'Email'  ,  { ns: 'fields' }  )  }}")
   * flowEngine.t("前缀 {{ t('User Name') }} 后缀")
   * flowEngine.t("{{t('Hello {name}', {name: 'John'})}}")
   */
  translate(keyOrTemplate: string, options?: any): string;
  /**
   * 内部翻译方法
   * @private
   */
  private translateKey;
  /**
   * 检查字符串是否包含模板语法
   * @private
   */
  private isTemplate;
  /**
   * 编译模板字符串
   * @private
   */
  private compileTemplate;
}
