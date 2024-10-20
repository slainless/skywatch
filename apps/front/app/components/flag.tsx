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

export interface FlagProps extends ComponentProps<FlagComponent> {
  country: (typeof Cities)[keyof typeof Cities]["code"];
}
export function Flag(props: FlagProps) {
  const { country, ...rest } = props;
  switch (props.country) {
    case "AE":
      return <AE {...rest} />;
    case "AU":
      return <AU {...rest} />;
    case "BE":
      return <BE {...rest} />;
    case "BR":
      return <BR {...rest} />;
    case "CA":
      return <CA {...rest} />;
    case "CN":
      return <CN {...rest} />;
    case "DE":
      return <DE {...rest} />;
    case "ES":
      return <ES {...rest} />;
    case "FR":
      return <FR {...rest} />;
    case "GB":
      return <GB {...rest} />;
    case "HK":
      return <HK {...rest} />;
    case "ID":
      return <ID {...rest} />;
    case "IN":
      return <IN {...rest} />;
    case "IT":
      return <IT {...rest} />;
    case "JP":
      return <JP {...rest} />;
    case "KR":
      return <KR {...rest} />;
    case "LU":
      return <LU {...rest} />;
    case "MX":
      return <MX {...rest} />;
    case "MY":
      return <MY {...rest} />;
    case "NL":
      return <NL {...rest} />;
    case "PL":
      return <PL {...rest} />;
    case "SG":
      return <SG {...rest} />;
    case "TR":
      return <TR {...rest} />;
    case "US":
      return <US {...rest} />;
  }
}
