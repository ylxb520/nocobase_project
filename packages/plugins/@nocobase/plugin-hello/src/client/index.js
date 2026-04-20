/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ActionModel, ActionSceneEnum, BlockModel, BlockSceneEnum, CollectionBlockModel, DataBlockModel, FieldModel, FilterBlockModel, Plugin, PopupActionModel, } from '@nocobase/client';
import { DisplayItemModel, EditableItemModel, FilterableItemModel, MultiRecordResource } from '@nocobase/flow-engine';
import { Input } from 'antd';
import React from 'react';
class Hello1BlockModel extends BlockModel {
    renderComponent() {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Hello, NocoBase!"),
            React.createElement("p", null, "This is a simple block rendered by HelloBlockModel.")));
    }
}
class Hello2BlockModel extends DataBlockModel {
    renderComponent() {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Hello, NocoBase!"),
            React.createElement("p", null, "This is a simple block rendered by HelloDataBlockModel.")));
    }
}
class Hello3BlockModel extends CollectionBlockModel {
    static scene = BlockSceneEnum.many;
    createResource() {
        return this.context.createResource(MultiRecordResource);
    }
    renderComponent() {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Hello, NocoBase!"),
            React.createElement("p", null, "This is a simple block rendered by HelloCollectionBlockModel.")));
    }
}
class Hello4BlockModel extends CollectionBlockModel {
    static scene = BlockSceneEnum.oam;
    createResource() {
        return this.context.createResource(MultiRecordResource);
    }
    renderComponent() {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Hello, NocoBase!"),
            React.createElement("p", null, "This is a simple block rendered by HelloCollectionBlockModel.")));
    }
}
class Hello5BlockModel extends CollectionBlockModel {
    static scene = BlockSceneEnum.new;
    createResource() {
        return this.context.createResource(MultiRecordResource);
    }
    renderComponent() {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Hello, NocoBase!"),
            React.createElement("p", null, "This is a simple block rendered by HelloCollectionBlockModel.")));
    }
}
class Hello6BlockModel extends CollectionBlockModel {
    static scene = BlockSceneEnum.select;
    createResource() {
        return this.context.createResource(MultiRecordResource);
    }
    renderComponent() {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Hello, NocoBase!"),
            React.createElement("p", null, "This is a simple block rendered by HelloCollectionBlockModel.")));
    }
}
class Hello7BlockModel extends CollectionBlockModel {
    static scene = BlockSceneEnum.one;
    createResource() {
        return this.context.createResource(MultiRecordResource);
    }
    renderComponent() {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Hello, NocoBase!"),
            React.createElement("p", null, "This is a simple block rendered by HelloCollectionBlockModel.")));
    }
}
class Hello8BlockModel extends FilterBlockModel {
    renderComponent() {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Hello, NocoBase!"),
            React.createElement("p", null, "This is a simple block rendered by HelloCollectionBlockModel.")));
    }
}
class Hello1ActionModel extends ActionModel {
    static scene = ActionSceneEnum.collection;
    defaultProps = {
        title: 'Hello1 Action',
    };
}
class Hello2ActionModel extends ActionModel {
    static scene = ActionSceneEnum.record;
    defaultProps = {
        title: 'Hello2 Action',
    };
}
class Hello3ActionModel extends ActionModel {
    static scene = ActionSceneEnum.all;
    defaultProps = {
        title: 'Hello3 Action',
    };
}
class Hello4ActionModel extends PopupActionModel {
    static scene = ActionSceneEnum.all;
    defaultProps = {
        title: 'Hello4 Popup Action',
    };
}
class Hello1FieldModel extends FieldModel {
    render() {
        return React.createElement("div", null, this.props.value);
    }
}
class Hello2FieldModel extends FieldModel {
    render() {
        return React.createElement(Input, { ...this.props });
    }
}
DisplayItemModel.bindModelToInterface('Hello1FieldModel', ['input']);
EditableItemModel.bindModelToInterface('Hello2FieldModel', ['input']);
FilterableItemModel.bindModelToInterface('Hello2FieldModel', ['input']);
export class PluginHelloClient extends Plugin {
    async load() {
        this.flowEngine.registerModels({
            Hello1BlockModel,
            Hello2BlockModel,
            Hello3BlockModel,
            Hello4BlockModel,
            Hello5BlockModel,
            Hello6BlockModel,
            Hello7BlockModel,
            Hello8BlockModel,
            Hello1ActionModel,
            Hello2ActionModel,
            Hello3ActionModel,
            Hello4ActionModel,
            Hello1FieldModel,
            Hello2FieldModel,
        });
    }
}
export default PluginHelloClient;
//# sourceMappingURL=index.js.map