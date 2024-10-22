// Detectar armazenamento local (localStorage)
const localStorageEntries = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  localStorageEntries.push({ key, value });
}
chrome.runtime.sendMessage({ type: 'localStorageData', data: localStorageEntries });

// Detectar sessionStorage
const sessionStorageEntries = [];
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  const value = sessionStorage.getItem(key);
  sessionStorageEntries.push({ key, value });
}
chrome.runtime.sendMessage({ type: 'sessionStorageData', data: sessionStorageEntries });

// Detectar IndexedDB
(function() {
  const indexedDBDatabases = [];
  if (window.indexedDB && indexedDB.databases) {
    indexedDB.databases().then(databases => {
      databases.forEach(db => {
        indexedDBDatabases.push(db.name);
      });
      chrome.runtime.sendMessage({ type: 'indexedDBData', data: indexedDBDatabases });
    });
  }
})();

// Detectar Web SQL
(function() {
  if (window.openDatabase) {
    chrome.runtime.sendMessage({ type: 'webSQLData', data: true });
  }
})();

// Detectar Canvas fingerprinting
(function() {
  const methodsToMonitor = ['fillText', 'strokeText', 'drawImage', 'toDataURL', 'getImageData'];
  methodsToMonitor.forEach(method => {
    const originalMethod = CanvasRenderingContext2D.prototype[method];
    CanvasRenderingContext2D.prototype[method] = function() {
      chrome.runtime.sendMessage({ type: 'canvasFingerprinting' });
      return originalMethod.apply(this, arguments);
    };
  });
})();

// Detectar WebGL fingerprinting
(function() {
  const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function() {
    chrome.runtime.sendMessage({ type: 'webGLFingerprinting' });
    return originalGetParameter.apply(this, arguments);
  };
})();

// Detectar AudioContext fingerprinting
(function() {
  const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
  AudioContext.prototype.createAnalyser = function() {
    chrome.runtime.sendMessage({ type: 'audioFingerprinting' });
    return originalCreateAnalyser.apply(this, arguments);
  };
})();

// Detectar tentativas de hijacking
(function() {
  let hijackingDetected = false;

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (hijackingDetected) return;

      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.matches('script')) {
            if (node.src && !node.src.startsWith('data:')) {
              return;
            }

            const scriptContent = node.textContent || '';
            if (/eval\(|document\.write\(/.test(scriptContent)) {
              hijackingDetected = true;
              chrome.runtime.sendMessage({ type: 'hijackingDetected' });
            }
          }
        });
      }
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
