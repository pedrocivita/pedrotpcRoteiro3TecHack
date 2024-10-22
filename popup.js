document.addEventListener('DOMContentLoaded', function() {
    function calculatePrivacyScore(data) {
      let score = 100;
  
      const thirdPartyCookiePenalty = Math.min(data.thirdPartyCookies ? data.thirdPartyCookies.count * 1 : 0, 30);
      const thirdPartyDomainPenalty = Math.min(data.thirdPartyDomains ? data.thirdPartyDomains.length * 2 : 0, 20);
      const localStoragePenalty = data.localStorage && data.localStorage.length > 0 ? 10 : 0;
      const sessionStoragePenalty = data.sessionStorage && data.sessionStorage.length > 0 ? 10 : 0;
      const indexedDBPenalty = data.indexedDB && data.indexedDB.length > 0 ? 10 : 0;
      const webSQLPenalty = data.webSQL ? 10 : 0;
      const fingerprintingPenalty = 0 +
        (data.canvasFingerprinting ? 20 : 0) +
        (data.webGLFingerprinting ? 20 : 0) +
        (data.audioFingerprinting ? 20 : 0);
      const hijackingPenalty = data.hijackingDetected ? 20 : 0;
      const superCookiesPenalty = data.superCookies && data.superCookies.length > 0 ? 10 : 0;
      const cookieSyncPenalty = data.cookieSyncDetected ? 15 : 0;
  
      score -= (
        thirdPartyCookiePenalty +
        thirdPartyDomainPenalty +
        localStoragePenalty +
        sessionStoragePenalty +
        indexedDBPenalty +
        webSQLPenalty +
        fingerprintingPenalty +
        hijackingPenalty +
        superCookiesPenalty +
        cookieSyncPenalty
      );
  
      if (score < 0) score = 0;
  
      return score;
    }
  
    function updatePopup() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tabId = tabs[0].id;
  
        chrome.storage.local.get([
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
          'cookieSyncDomains',
          'thirdPartyDomains'
        ], function(data) {
          const thirdPartyDomains = data.thirdPartyDomains || [];
  
          const privacyScore = calculatePrivacyScore(data);
  
          const scoreElement = document.getElementById('privacyScore');
          scoreElement.textContent = privacyScore + '/100';
  
          // Alterar a cor da pontuação com base no valor
          scoreElement.classList.remove('good', 'bad');
          if (privacyScore >= 70) {
            scoreElement.classList.add('good');
          } else if (privacyScore <= 40) {
            scoreElement.classList.add('bad');
          }
  
          // Exibir gráfico (simples barra de progresso)
          const canvas = document.getElementById('privacyChart');
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar o canvas antes de desenhar
          ctx.fillStyle = privacyScore >= 70 ? '#5cb85c' : privacyScore <= 40 ? '#d9534f' : '#f0ad4e';
          ctx.fillRect(0, 0, (privacyScore / 100) * canvas.width, canvas.height);
          ctx.fillStyle = '#ddd';
          ctx.fillRect((privacyScore / 100) * canvas.width, 0, canvas.width - (privacyScore / 100) * canvas.width, canvas.height);
  
          document.getElementById('thirdPartyDomains').textContent = 'Conexões de terceiros: ' + thirdPartyDomains.length;
  
          // Listar domínios de terceiros
          const thirdPartyDomainList = document.getElementById('thirdPartyDomainsList');
          thirdPartyDomainList.innerHTML = '';
          if (thirdPartyDomains.length > 0) {
            thirdPartyDomains.forEach(function(domain) {
              const listItem = document.createElement('li');
              listItem.textContent = domain;
              thirdPartyDomainList.appendChild(listItem);
            });
          } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'Nenhum domínio de terceiro detectado';
            thirdPartyDomainList.appendChild(listItem);
          }
  
          document.getElementById('firstPartyCookies').textContent = 'Cookies de primeira parte: ' + (data.firstPartyCookies ? data.firstPartyCookies.count : 0);
  
          document.getElementById('thirdPartyCookies').textContent = 'Cookies de terceira parte: ' + (data.thirdPartyCookies ? data.thirdPartyCookies.count : 0);
  
          // Exibir supercookies
          const superCookies = data.superCookies || [];
          document.getElementById('superCookies').textContent = 'Supercookies detectados: ' + superCookies.length;
  
          const superCookieList = document.getElementById('superCookieList');
          superCookieList.innerHTML = '';
          if (superCookies.length > 0) {
            superCookies.forEach(function(domain) {
              const listItem = document.createElement('li');
              listItem.textContent = domain;
              superCookieList.appendChild(listItem);
            });
          }
  
          // Armazenamento e segurança
          document.getElementById('localStorage').textContent = 'Armazenamento local: ' + (data.localStorage && data.localStorage.length > 0 ? 'Detectado' : 'Não detectado');
          document.getElementById('sessionStorage').textContent = 'Session Storage: ' + (data.sessionStorage && data.sessionStorage.length > 0 ? 'Detectado' : 'Não detectado');
          document.getElementById('indexedDB').textContent = 'IndexedDB: ' + (data.indexedDB && data.indexedDB.length > 0 ? 'Detectado' : 'Não detectado');
          document.getElementById('webSQL').textContent = 'Web SQL: ' + (data.webSQL ? 'Detectado' : 'Não detectado');
          document.getElementById('canvasFingerprinting').textContent = 'Canvas Fingerprinting: ' + (data.canvasFingerprinting ? 'Detectado' : 'Não detectado');
          document.getElementById('webGLFingerprinting').textContent = 'WebGL Fingerprinting: ' + (data.webGLFingerprinting ? 'Detectado' : 'Não detectado');
          document.getElementById('audioFingerprinting').textContent = 'AudioContext Fingerprinting: ' + (data.audioFingerprinting ? 'Detectado' : 'Não detectado');
          document.getElementById('hijackingDetected').textContent = 'Tentativas de Hijacking: ' + (data.hijackingDetected ? 'Detectadas' : 'Não detectadas');
  
          // Listar nomes dos cookies de primeira parte
          const firstPartyCookieList = document.getElementById('firstPartyCookieNames');
          firstPartyCookieList.innerHTML = '';
          if (data.firstPartyCookies && data.firstPartyCookies.cookies.length > 0) {
            data.firstPartyCookies.cookies.forEach(function(cookie) {
              const listItem = document.createElement('li');
              listItem.textContent = cookie.name + (cookie.session ? ' (Sessão)' : ' (Persistente)');
              firstPartyCookieList.appendChild(listItem);
            });
          } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'Nenhum cookie de primeira parte detectado';
            firstPartyCookieList.appendChild(listItem);
          }
  
          // Listar nomes dos cookies de terceira parte
          const thirdPartyCookieList = document.getElementById('thirdPartyCookieNames');
          thirdPartyCookieList.innerHTML = '';
          if (data.thirdPartyCookies && data.thirdPartyCookies.cookies.length > 0) {
            data.thirdPartyCookies.cookies.forEach(function(cookie) {
              const listItem = document.createElement('li');
              listItem.textContent = cookie.name + (cookie.session ? ' (Sessão)' : ' (Persistente)');
              thirdPartyCookieList.appendChild(listItem);
            });
          } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'Nenhum cookie de terceira parte detectado';
            thirdPartyCookieList.appendChild(listItem);
          }
  
          // Exibir detalhes do armazenamento
          // Local Storage
          const localStorageList = document.getElementById('localStorageEntries');
          localStorageList.innerHTML = '';
          if (data.localStorage && data.localStorage.length > 0) {
            data.localStorage.forEach(function(entry) {
              const listItem = document.createElement('li');
              listItem.textContent = entry.key + ': ' + entry.value;
              localStorageList.appendChild(listItem);
            });
          } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'Nenhum dado no Local Storage';
            localStorageList.appendChild(listItem);
          }
  
          // Session Storage
          const sessionStorageList = document.getElementById('sessionStorageEntries');
          sessionStorageList.innerHTML = '';
          if (data.sessionStorage && data.sessionStorage.length > 0) {
            data.sessionStorage.forEach(function(entry) {
              const listItem = document.createElement('li');
              listItem.textContent = entry.key + ': ' + entry.value;
              sessionStorageList.appendChild(listItem);
            });
          } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'Nenhum dado no Session Storage';
            sessionStorageList.appendChild(listItem);
          }
  
          // IndexedDB
          const indexedDBList = document.getElementById('indexedDBEntries');
          indexedDBList.innerHTML = '';
          if (data.indexedDB && data.indexedDB.length > 0) {
            data.indexedDB.forEach(function(dbName) {
              const listItem = document.createElement('li');
              listItem.textContent = dbName;
              indexedDBList.appendChild(listItem);
            });
          } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'Nenhum banco de dados IndexedDB detectado';
            indexedDBList.appendChild(listItem);
          }
  
          // Web SQL
          const webSQLStatus = document.getElementById('webSQLStatus');
          webSQLStatus.textContent = data.webSQL ? 'Web SQL detectado' : 'Web SQL não detectado';
  
          // Exibir sincronização de cookies
          const cookieSyncDetected = data.cookieSyncDetected;
          const cookieSyncDomains = data.cookieSyncDomains || [];
          document.getElementById('cookieSync').textContent = 'Sincronização de Cookies: ' + (cookieSyncDetected ? 'Detectada' : 'Não detectada');
  
          const cookieSyncList = document.getElementById('cookieSyncDomains');
          cookieSyncList.innerHTML = '';
          if (cookieSyncDetected) {
            cookieSyncDomains.forEach(function(domain) {
              const listItem = document.createElement('li');
              listItem.textContent = domain;
              cookieSyncList.appendChild(listItem);
            });
          }
        });
      });
    }
  
    // Atualizar o popup inicialmente
    updatePopup();
  
    // Adicionar evento ao botão de reiniciar e verificar novamente
    document.getElementById('refreshButton').addEventListener('click', function() {
      // Limpar o storage e recarregar a aba atual
      chrome.storage.local.clear(function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs[0]) {
            chrome.tabs.reload(tabs[0].id, {}, function() {
              // Esperar um pouco para permitir que os scripts sejam executados
              setTimeout(function() {
                updatePopup();
              }, 2000);
            });
          }
        });
      });
    });
  
    // Implementar a exibição da metodologia abaixo do gráfico
    const methodologyLink = document.getElementById('methodologyLink');
    const methodologyContent = document.getElementById('methodologyContent');
  
    methodologyLink.addEventListener('click', function(event) {
      event.preventDefault();
      if (methodologyContent.classList.contains('hidden')) {
        methodologyContent.classList.remove('hidden');
        methodologyLink.textContent = 'Ocultar metodologia';
      } else {
        methodologyContent.classList.add('hidden');
        methodologyLink.textContent = 'Ver metodologia';
      }
    });
  });  