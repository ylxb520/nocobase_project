/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { RunnableConfig } from '@langchain/core/runnables';
import {
  BaseCheckpointSaver,
  ChannelVersions,
  Checkpoint,
  CheckpointListOptions,
  CheckpointMetadata,
  CheckpointTuple,
  PendingWrite,
  SerializerProtocol,
} from '@langchain/langgraph-checkpoint';
import { SequelizeCollectionManager } from '@nocobase/data-source-manager';
import { FindOptions } from '@nocobase/database';
export declare class SequelizeCollectionSaver extends BaseCheckpointSaver {
  private readonly provideCollectionManager;
  constructor(
    provideCollectionManager: () => {
      collectionManager: SequelizeCollectionManager;
    },
    serde?: SerializerProtocol,
  );
  getTuple(config: RunnableConfig): Promise<CheckpointTuple | undefined>;
  list(config: RunnableConfig, options?: CheckpointListOptions): AsyncGenerator<CheckpointTuple>;
  _migratePendingSends(
    pendingSends: [Uint8Array, Uint8Array][],
    mutableRow: {
      channelValues: [Uint8Array, Uint8Array, Uint8Array][];
      checkpoint: Omit<Checkpoint, 'pending_sends' | 'channel_values'>;
    },
  ): Promise<void>;
  put(
    config: RunnableConfig,
    checkpoint: Checkpoint,
    metadata: CheckpointMetadata,
    newVersions: ChannelVersions,
  ): Promise<RunnableConfig>;
  putWrites(config: RunnableConfig, writes: PendingWrite[], taskId: string): Promise<void>;
  deleteThread(threadId: string): Promise<void>;
  protected _loadCheckpoint(
    checkpoint: Omit<Checkpoint, 'pending_sends' | 'channel_values'>,
    channelValues: [Uint8Array, Uint8Array, Uint8Array][],
  ): Promise<Checkpoint>;
  protected _loadBlobs(blobValues: [Uint8Array, Uint8Array, Uint8Array][]): Promise<Record<string, unknown>>;
  protected _loadMetadata(metadata: Record<string, unknown>): Promise<any>;
  protected _loadWrites(
    writes: [Uint8Array, Uint8Array, Uint8Array, Uint8Array][],
  ): Promise<[string, string, unknown][]>;
  protected _dumpBlobs(
    threadId: string,
    checkpointNs: string,
    values: Record<string, unknown>,
    versions: ChannelVersions,
  ): Promise<[string, string, string, string, string, Uint8Array | undefined][]>;
  protected _dumpCheckpoint(checkpoint: Checkpoint): Record<string, unknown>;
  protected _dumpMetadata(metadata: CheckpointMetadata): Promise<any>;
  protected _dumpWrites(
    threadId: string,
    checkpointNs: string,
    checkpointId: string,
    taskId: string,
    writes: [string, unknown][],
  ): Promise<[string, string, string, string, number, string, string, Uint8Array][]>;
  protected _searchWhere(
    config?: RunnableConfig,
    filter?: Record<string, unknown>,
    before?: RunnableConfig,
  ): FindOptions;
  private getCheckpointWrites;
  private getPendingSends;
  private getCheckpointBlobs;
  private get checkpointsModel();
  private get checkpointBlobsModel();
  private get checkpointWritesModel();
  private get sequelize();
  private get collectionManager();
}
