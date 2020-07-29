/* eslint-disable */
export function provideEventsDebugger(window) {
  function debugEvents(target: HTMLElement, events = []) {
    const logTarget = document.getElementsByTagName('events-log')[0] || document.createElement('events-log');
    document.body.prepend(logTarget);

    function logIt({ type, target: _target, detail }: any) {
      const line = document.createElement('span');
      const eventTarget = _target as HTMLElement;

      const attributes = Object.values(eventTarget.attributes).map((attr) => `${attr.name}='${attr.value}'`).join(' ');

      line.textContent = `[${type}]: ${JSON.stringify({
        target: `<${eventTarget.tagName} ${attributes} />`,
        detail,
      }, null, 2)} `;

      logTarget.append(line);
      logTarget.scrollTop = logTarget.scrollHeight;
    }

    events.forEach((event) => {
      target.addEventListener(event, logIt);
    });
  }

  window.debugEvents = debugEvents;
}