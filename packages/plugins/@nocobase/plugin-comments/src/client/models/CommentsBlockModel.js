/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { MultiRecordResource, escapeT, FlowModel } from '@nocobase/flow-engine';
import React from 'react';
import { Alert } from 'antd';
import { BlockSceneEnum, CollectionBlockModel } from '@nocobase/client';
import { CommentList } from './CommentList';
import { CommentItem } from './CommentItem';
export class CommentItemModel extends FlowModel {
  onInit(options) {
    super.onInit(options);
  }
  render() {
    return React.createElement(CommentItem, {
      value: this.context.record,
      resource: this.context.blockModel.resource,
      model: this,
    });
  }
}
export class CommentsBlockModel extends CollectionBlockModel {
  static scene = BlockSceneEnum.oam;
  static filterCollection(collection) {
    return collection.template === 'comment';
  }
  createResource(ctx, params) {
    const resource = this.context.createResource(MultiRecordResource);
    resource.setPageSize(this.props.pageSize);
    resource.addAppends('createdBy');
    return resource;
  }
  onInit(options) {
    super.onInit(options);
  }
  getCurrentRecord() {
    const data = this.resource.getData();
    return Array.isArray(data) ? data[0] : data;
  }
  handlePageChange = async (page) => {
    if (this.resource instanceof MultiRecordResource) {
      const multiResource = this.resource;
      multiResource.setPage(page);
      multiResource.loading = true;
      await this.refresh();
    }
  };
  async refresh() {
    await this.resource.refresh();
  }
  renderComponent() {
    const dataSource = this.resource.getData();
    const resource = this.resource;
    if (this.collection.template !== 'comment') {
      return React.createElement(Alert, {
        message: this.context.t(
          'The current collection is not a comment collection, so the comment block cannot be used.',
          { ns: 'comments' },
        ),
        type: 'warning',
        showIcon: true,
      });
    }
    return React.createElement(CommentList, {
      ...this.props,
      dataSource: dataSource,
      resource: resource,
      handlePageChange: this.handlePageChange,
    });
  }
}
CommentsBlockModel.registerFlow({
  key: 'commentsSettings',
  title: escapeT('Comments settings', { ns: 'comments' }),
  sort: 150,
  steps: {
    pageSize: {
      title: escapeT('Page size'),
      uiSchema: {
        pageSize: {
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          enum: [
            { label: '5', value: 5 },
            { label: '10', value: 10 },
            { label: '20', value: 20 },
            { label: '50', value: 50 },
            { label: '100', value: 100 },
            { label: '200', value: 200 },
          ],
        },
      },
      defaultParams: {
        pageSize: 20,
      },
      handler(ctx, params) {
        ctx.model.resource.loading = true;
        const resource = ctx.model.resource;
        resource.setPage(1);
        resource.setPageSize(params.pageSize);
      },
    },
    dataScope: {
      use: 'dataScope',
    },
  },
});
CommentsBlockModel.define({
  label: escapeT('Comments', { ns: 'comments' }),
  searchable: true,
  searchPlaceholder: escapeT('Search'),
  createModelOptions: {
    use: 'CommentsBlockModel',
    subModels: {
      items: [
        {
          use: 'CommentItemModel',
        },
      ],
    },
  },
  sort: 550,
});
//# sourceMappingURL=CommentsBlockModel.js.map
