export type ConfigDomain =
  | "wealth"
  | "vitality"
  | "focus"
  | "momentum"
  | "season";

export type ChangeType = "calibration" | "pivot";

export interface PlayerConfigRow {
  domain: ConfigDomain;
  configJson: Record<string, unknown>;
  updatedAt: string;
}

export interface ConfigChangeLogEntry {
  changedAt: string;
  domain: ConfigDomain;
  fieldChanged: string;
  oldValue: unknown;
  newValue: unknown;
  changeType: ChangeType;
}

export interface PivotEvent {
  pivotDate: string;
  domain: ConfigDomain;
  title: string;
  note?: string;
}
