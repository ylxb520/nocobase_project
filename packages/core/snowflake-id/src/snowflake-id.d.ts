/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare class Snowflake {
  private workerId;
  private epoch;
  private workerIdBits;
  private sequenceBits;
  private maxWorkerId;
  private maxSequence;
  private lastTs;
  private sequence;
  constructor(options?: { workerId?: number; epoch?: number });
  private timestamp;
  private tilNextSecond;
  generate(): number;
  parse(id: number): {
    id: number;
    timestamp: number;
    workerId: number;
    sequence: number;
  };
}
