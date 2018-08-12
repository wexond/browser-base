export function loadScripts(scripts: any[]) {
  scripts.forEach(item => {
    const script = document.createElement('script');
    script.src = item;
    document.body.appendChild(script);
  });
}

export const loadContent = (name: string) => {
  document.addEventListener('DOMContentLoaded', () => {
    if (process.env.ENV === 'dev') {
      loadScripts([`http://localhost:8080/${name}.js`]);
    } else {
      loadScripts([`wexond://build/${name}.js`]);
    }
  });
};
