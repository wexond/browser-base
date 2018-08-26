export interface ExtensionsLocale {
  [key: string]: {
    message?: string;
    description?: string;
    placeholders?: {
      [key: string]: {
        content?: string;
        example?: string;
      };
    };
  };
}
