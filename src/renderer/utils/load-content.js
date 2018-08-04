function loadScripts(scripts) {
  scripts.forEach(item => {
    const script = document.createElement('script');
    script.src = item;
    document.body.appendChild(script);
  });
}

const loadContent = name => {
  document.addEventListener('DOMContentLoaded', () => {
    if (process.env.ENV === 'dev') {
      loadScripts([`http://localhost:8080/${name}.js`]);
    } else {
      loadScripts([`file:///${__dirname}/../../../build/${name}.js`]);
    }
  });
};

module.exports = loadContent;
