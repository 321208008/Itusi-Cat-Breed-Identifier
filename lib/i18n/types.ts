import { translations } from './translations';

type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in keyof T]: [K, ...PathsToStringProps<T[K]>]
    }[keyof T];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

export type TranslationKey = Join<PathsToStringProps<typeof translations['en']>, '.'> | `cats.breeds.${string}` | `cats.features.${string}`;

export type Locale = keyof typeof translations; 