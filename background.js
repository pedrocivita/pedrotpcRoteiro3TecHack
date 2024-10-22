// Limpar os dados relacionados à página quando a aba é atualizada
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      // Limpar apenas os dados relacionados à página
      chrome.storage.local.remove([
        'thirdPartyDomains',
        'firstPartyCookies',
        'thirdPartyCookies',
        'localStorage',
        'sessionStorage',
        'indexedDB',
        'webSQL',
        'canvasFingerprinting',
        'webGLFingerprinting',
        'audioFingerprinting',
        'hijackingDetected',
        'superCookies',
        'cookieSyncDetected',
        'cookieSyncDomains'
      ], function() {
        // Reexecutar as detecções após a limpeza
        detectThirdPartyConnections();
        detectCookies();
      });
    }
  });
  
  function detectCookies() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        const pageUrl = tabs[0].url;
        const pageDomain = new URL(pageUrl).hostname;
  
        chrome.cookies.getAll({ url: pageUrl }, function(cookies) {
          const firstPartyCookies = [];
          const thirdPartyCookies = [];
  
          cookies.forEach(cookie => {
            const cookieDomain = cookie.domain.replace(/^\./, '');
            if (cookieDomain === pageDomain || pageDomain.endsWith('.' + cookieDomain) || cookieDomain.endsWith('.' + pageDomain)) {
              firstPartyCookies.push({
                name: cookie.name,
                value: cookie.value,
                session: !cookie.expirationDate
              });
            } else {
              thirdPartyCookies.push({
                name: cookie.name,
                value: cookie.value,
                session: !cookie.expirationDate
              });
            }
          });
  
          // Armazena os nomes e a quantidade dos cookies no storage
          chrome.storage.local.set({
            firstPartyCookies: {
              count: firstPartyCookies.length,
              cookies: firstPartyCookies
            },
            thirdPartyCookies: {
              count: thirdPartyCookies.length,
              cookies: thirdPartyCookies
            }
          });
        });
      }
    });
  }
  
  function detectThirdPartyConnections() {
    chrome.webRequest.onBeforeRequest.addListener(
      function(details) {
        const url = new URL(details.url);
        const domain = url.hostname;
  
        chrome.tabs.get(details.tabId, function(tab) {
          if (tab && tab.url) {
            const pageDomain = new URL(tab.url).hostname;
            if (!domain.includes(pageDomain) && !pageDomain.includes(domain)) {
              chrome.storage.local.get({ thirdPartyDomains: [] }, function(data) {
                const domains = data.thirdPartyDomains;
                if (!domains.includes(domain)) {
                  domains.push(domain);
                  chrome.storage.local.set({ thirdPartyDomains: domains });
                }
              });
            }
          }
        });
      },
      { urls: ["<all_urls>"], types: ["script", "image", "xmlhttprequest", "object", "other"] }
    );
  }
  
  // Detectar supercookies (ETag)
  chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
      const responseHeaders = details.responseHeaders;
      const eTagHeader = responseHeaders.find(header => header.name.toLowerCase() === 'etag');
  
      if (eTagHeader) {
        const url = new URL(details.url);
        const domain = url.hostname;
  
        chrome.storage.local.get({ superCookies: [] }, function(data) {
          const superCookies = data.superCookies;
          if (!superCookies.includes(domain)) {
            superCookies.push(domain);
            chrome.storage.local.set({ superCookies: superCookies });
          }
        });
      }
    },
    { urls: ["<all_urls>"], types: ["main_frame", "sub_frame", "xmlhttprequest"] },
    ["responseHeaders"]
  );
  
  // Detecção de sincronização de cookies
  function detectCookieSync() {
    chrome.webRequest.onBeforeSendHeaders.addListener(
      function(details) {
        const url = new URL(details.url);
        const domain = url.hostname;
  
        chrome.tabs.get(details.tabId, function(tab) {
          if (tab && tab.url) {
            const pageDomain = new URL(tab.url).hostname;
  
            // Verificar se a requisição é para um domínio de terceiro
            if (!domain.includes(pageDomain) && !pageDomain.includes(domain)) {
              // Obter cookies de primeira parte
              chrome.cookies.getAll({ url: tab.url }, function(cookies) {
                const firstPartyCookieValues = cookies.map(cookie => cookie.value);
  
                // Verificar se os valores dos cookies estão nos parâmetros da URL ou nos cabeçalhos
                const params = new URLSearchParams(url.search);
                let syncDetected = false;
  
                // Verificar parâmetros da URL
                for (let value of params.values()) {
                  if (firstPartyCookieValues.includes(value)) {
                    syncDetected = true;
                    break;
                  }
                }
  
                // Verificar corpo da requisição (para POST requests)
                if (!syncDetected && details.requestBody && details.requestBody.raw && details.requestBody.raw.length > 0) {
                  const decoder = new TextDecoder("utf-8");
                  const body = decoder.decode(details.requestBody.raw[0].bytes);
                  if (firstPartyCookieValues.some(value => body.includes(value))) {
                    syncDetected = true;
                  }
                }
  
                // Verificar cabeçalhos
                if (!syncDetected) {
                  for (let header of details.requestHeaders) {
                    if (firstPartyCookieValues.includes(header.value)) {
                      syncDetected = true;
                      break;
                    }
                  }
                }
  
                if (syncDetected) {
                  chrome.storage.local.get({ cookieSyncDomains: [] }, function(data) {
                    const domains = data.cookieSyncDomains;
                    if (!domains.includes(domain)) {
                      domains.push(domain);
                      chrome.storage.local.set({ cookieSyncDetected: true, cookieSyncDomains: domains });
                    }
                  });
                }
              });
            }
          }
        });
      },
      { urls: ["<all_urls>"] },
      ["requestHeaders", "requestBody"]
    );
  }
  
  // Chamar a função de detecção de sincronização de cookies
  detectCookieSync();
  
  // Receber e armazenar dados de fingerprinting, storage e hijacking
  chrome.runtime.onMessage.addListener(function(message, sender) {
    if (message.type === 'localStorageData') {
      chrome.storage.local.set({ localStorage: message.data });
    }
  
    if (message.type === 'sessionStorageData') {
      chrome.storage.local.set({ sessionStorage: message.data });
    }
  
    if (message.type === 'indexedDBData') {
      chrome.storage.local.set({ indexedDB: message.data });
    }
  
    if (message.type === 'webSQLData') {
      chrome.storage.local.set({ webSQL: message.data });
    }
  
    if (message.type === 'canvasFingerprinting') {
      chrome.storage.local.set({ canvasFingerprinting: true });
    }
  
    if (message.type === 'webGLFingerprinting') {
      chrome.storage.local.set({ webGLFingerprinting: true });
    }
  
    if (message.type === 'audioFingerprinting') {
      chrome.storage.local.set({ audioFingerprinting: true });
    }
  
    if (message.type === 'hijackingDetected') {
      chrome.storage.local.set({ hijackingDetected: true });
    }
  });
  
  // Inicializar as detecções
  detectCookies();
  detectThirdPartyConnections();  