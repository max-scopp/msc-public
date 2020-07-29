export function appendGlobalProgressIndicator() {
  const indicator = document.createElement('msc-progress-indicator');
  ApiService.setWorkerNotifierElement(indicator);
  document.body.append(indicator);
}
