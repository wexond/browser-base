export interface Manifest extends chrome.runtime.Manifest {
  extensionId: string;
  srcDirectory: string;
  default_locale: string;
}
