export interface Manifest extends chrome.runtime.Manifest {
  extensionId: string;
  srcDirectory: string;
}
