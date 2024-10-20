import {
  AE,
  AU,
  US,
  BE,
  BR,
  CA,
  CN,
  DE,
  ES,
  FR,
  GB,
  HK,
  ID,
  IN,
  IT,
  JP,
  KR,
  LU,
  MX,
  MY,
  NL,
  PL,
  SG,
  TR,
  type FlagComponent,
} from "country-flag-icons/react/3x2";
import type { Cities } from "@skywatch/city-list";
import type { ComponentProps } from "react";

export type SupportedFlag = (typeof Cities)[keyof typeof Cities]["code"];
const flagMap: Record<SupportedFlag, FlagComponent> = {
  AE,
  AU,
  BE,
  BR,
  CA,
  CN,
  DE,
  ES,
  FR,
  GB,
  HK,
  ID,
  IN,
  IT,
  JP,
  KR,
  LU,
  MX,
  MY,
  NL,
  PL,
  SG,
  TR,
  US,
};

export interface FlagProps extends ComponentProps<FlagComponent> {
  country: SupportedFlag;
}
export function Flag(props: FlagProps) {
  const { country, ...rest } = props;
  const Component = flagMap[country];
  return <Component {...rest} />;
}
