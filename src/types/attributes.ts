export type AttributeName =
  | "wealth"
  | "vitality"
  | "focus"
  | "momentum"
  | "discipline";

export interface Attribute {
  name: AttributeName;
  level: number;
  currentXp: number;
  xpToNext: number;
  multiplier: number;
}
