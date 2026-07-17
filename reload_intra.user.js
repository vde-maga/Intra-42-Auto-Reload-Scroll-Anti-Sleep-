// ==UserScript==
// @name         Intra 42 Auto-Reload & Scroll (Anti-Sleep)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Faz reload, mete a hora atual no centro e impede o PC de hibernar.
// @author       Mano
// @match        *://projects.intra.42.fr/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const STATE_KEY = 'gamerAutoLoopActive';
    const WAIT_TIME = 5000; // 5 segundos
    const START_DELAY = 1500; // 1.5 segundos para a página e calendário carregarem

    let isActive = localStorage.getItem(STATE_KEY) === 'true';

    // Função para parar o loop
    function stopLoop(e) {
        // TRUQUE DE MESTRE: Se o evento for gerado por código (isTrusted = false), ignoramos!
        // Só paramos se for um movimento real teu (isTrusted = true).
        if (e && e.isTrusted === false) return;

        if (isActive) {
            localStorage.setItem(STATE_KEY, 'false');
            isActive = false;
            console.log("Loop parado pelo utilizador!");
            document.removeEventListener('mousemove', stopLoop);
            document.removeEventListener('keydown', stopLoop);
            document.removeEventListener('click', stopLoop);
        }
    }

    // 1. Tentar ativar o Wake Lock para o PC não hibernar (pede ao sistema operativo)
    let wakeLock = null;
    async function requestWakeLock() {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log("Wake Lock ativado: O PC não vai hibernar.");
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock foi lançado.');
            });
        } catch (err) {
            console.log('Wake Lock não suportado ou bloqueado. Vai usar o wiggle de rato.');
        }
    }

    // 2. Fazer um mini-abano de rato virtual para enganar o browser
    function doMouseWiggle() {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        const fakeMove = new MouseEvent('mousemove', {
            clientX: x,
            clientY: y,
            bubbles: true
        });
        document.dispatchEvent(fakeMove);
    }

    // Função que calcula e faz o scroll para a hora atual
    function scrollToCurrentTime() {
        const scroller = document.querySelector('.fc-scroller.fc-time-grid-container');

        if (!scroller) return;

        const rowMidnight = document.querySelector('tr[data-time="00:00:00"]');
        const row1AM = document.querySelector('tr[data-time="01:00:00"]');

        if (!rowMidnight || !row1AM) {
            scroller.scrollBy(0, 100); // Plano B
            return;
        }

        const scrollerRect = scroller.getBoundingClientRect();
        const midnightRect = rowMidnight.getBoundingClientRect();
        const oneAMRect = row1AM.getBoundingClientRect();

        const hourHeight = oneAMRect.top - midnightRect.top;
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const midnightTopInScroller = midnightRect.top - scrollerRect.top + scroller.scrollTop;
        const targetY = midnightTopInScroller + (currentMinutes / 60) * hourHeight;
        const finalScrollTop = targetY - (scroller.clientHeight / 2);

        scroller.scrollTop = Math.max(0, finalScrollTop);

        const wheelEvent = new WheelEvent('wheel', {
            deltaY: 100,
            bubbles: true,
            cancelable: true
        });
        scroller.dispatchEvent(wheelEvent);
    }

    function runCycle() {
        if (!isActive) return;

        setTimeout(() => {
            if (!isActive) return;

            doMouseWiggle(); // Abana o rato virtualmente para o PC não dormir
            scrollToCurrentTime(); // Mete a hora no centro

            setTimeout(() => {
                if (isActive) {
                    window.location.reload();
                }
            }, WAIT_TIME);

        }, START_DELAY);
    }

    // Se a página carregou e o loop já estava ativo, continuamos
    if (isActive) {
        console.log("Loop está ativo. À procura de slots...");

        // Pede ao PC para não dormir
        requestWakeLock();

        setTimeout(() => {
            if (isActive) {
                document.addEventListener('mousemove', stopLoop);
                document.addEventListener('keydown', stopLoop);
                document.addEventListener('click', stopLoop);
            }
        }, 500);

        runCycle();
    }

    // Atalho para LIGAR: Ctrl + Alt + L
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
            if (!isActive) {
                localStorage.setItem(STATE_KEY, 'true');
                console.log("Loop iniciado! Modo Anti-Sleep ativado.");

                document.addEventListener('mousemove', stopLoop);
                document.addEventListener('keydown', stopLoop);
                document.addEventListener('click', stopLoop);

                e.preventDefault();
                window.location.reload();
            }
        }
    });

})();