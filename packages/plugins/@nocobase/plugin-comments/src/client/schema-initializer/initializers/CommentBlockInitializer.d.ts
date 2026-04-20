import { Collection, CollectionFieldOptions } from '@nocobase/client';
import React from 'react';
export declare const CommentBlockInitializer: ({
  filterCollections,
  filterOtherRecordsCollection,
  onlyCurrentDataSource,
  hideSearch,
  showAssociationFields,
  hideOtherRecordsInPopup,
}: {
  filterCollections: (options: { collection?: Collection; associationField?: CollectionFieldOptions }) => boolean;
  filterOtherRecordsCollection: (collection?: Collection) => boolean;
  onlyCurrentDataSource: boolean;
  hideSearch?: boolean;
  showAssociationFields?: boolean;
  hideOtherRecordsInPopup?: boolean;
}) => React.JSX.Element;
