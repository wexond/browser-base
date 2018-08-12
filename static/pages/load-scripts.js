function loadScripts(scripts) {
  scripts.forEach(item => {
    const script = document.createElement('script');
    script.src = item;
    document.body.appendChild(script);
  });
}
