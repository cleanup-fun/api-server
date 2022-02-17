
export type JSON_Primitives = boolean | number | string;
export type JSON_Array = Array<JSON_Primitives | JSON_Object | JSON_Array>
export type JSON_Object = {
  [key: string]: JSON_Primitives | JSON_Object | JSON_Array
}

export type JSON_Unknown = void | JSON_Primitives | JSON_Object | JSON_Array;
