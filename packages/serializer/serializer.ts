export interface Serializer {
  serialize(value: any): Buffer;
  deserialize(value: Buffer): any;
}
