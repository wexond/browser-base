function loadScripts(scripts) {
  scripts.forEach(item => {
    let script = document.createElement('script');
    script.src = item;
    document.body.appendChild(script);
  });
}

module.exports = { loadScripts };