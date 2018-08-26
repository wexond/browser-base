export interface ExtensionLocale {
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
