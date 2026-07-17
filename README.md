# 🎯 Intra 42 Slot Sniper

Um userscript inteligente desenhado para ajudar os alunos da 42 a caçar slots de correção e peer-avaliação. O script faz reload automático à página dos projetos, centra o calendário na hora exata do teu relógio e impede o teu computador de hibernar. Tudo isto de forma segura, parando automaticamente se detectar que voltaste ao PC!

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-00485B?style=for-the-badge&logo=tampermonkey&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Made for 42](https://img.shields.io/badge/Made%20for-42-000000?style=for-the-badge&logo=42&logoColor=white)

---

## ✨ Funcionalidades Principais

- 🔄 **Auto-Reload Inteligente:** Atualiza a página de 5 em 5 segundos à procura de novos slots.
- ⏱️ **Auto-Scroll de Precisão:** Em vez de scroll aleatório, o script lê a hora atual do teu browser (GMT+0 ou o que tenhas configurado) e move a tabela de horários para que a hora fique **exatamente no centro** do teu ecrã.
- ☕ **Modo Anti-Sleep (Cafeína):** Impede o teu PC de hibernar ou o ecrã de se desligar utilizando a `Wake Lock API`. Para garantir, ainda faz um micro-movimento de rato virtual a cada ciclo.
- 🛑 **Safety Break (Deteta Atividade Real):** O script sabe a diferença entre um movimento de rato virtual e o teu rato físico. Se mexeres no rato, clicares ou premires uma tecla, o loop **desliga-se instantaneamente** para não interferir quando encontrares o que procuras.
- ⌨️ **Atalho Secreto:** Liga e desliga o sistema com um simples `Ctrl + Alt + L`.

---

## 🚀 Instalação

1. Instala a extensão **[Tampermonkey](https://www.tampermonkey.net/)** no teu browser (Chrome, Edge, Firefox, Safari, etc.).
2. Abre o painel do Tampermonkey e clica no ícone de **"+" (Criar um novo script)**.
3. Apaga tudo o que lá estiver e cola o código do ficheiro `reload_intra.user.js` deste repositório.
4. Clica em **Ficheiro > Guardar** (ou `Ctrl + S`).
5. Garante que o script está ativado no teu painel do Tampermonkey.

---

## 🎮 Como usar

1. Navega até à página de slots do teu projeto na Intra (ex: `https://projects.intra.42.fr/projects/cub3d/slots`).
2. Carrega em **`Ctrl + Alt + L`**.
3. A página vai fazer reload imediato. A partir daí, o script entra em ação:
   - Espera 1.5s para a página carregar.
   - Centra o calendário na hora atual.
   - Espera 5s.
   - Faz reload e repete o processo.
4. **Para parar:** Basta mexer o rato, clicar em qualquer lado ou carregar numa tecla. O script vai detetar a tua presença, limpar a memória e parar o ciclo.

---

## 🧙‍♂️ Como funciona a magia?

- **Cálculo da Hora:** A Intra usa o FullCalendar. O script vai procurar no DOM a linha da meia-noite (`00:00:00`) e a linha da 1h (`01:00:00`). Medindo a distância em pixéis entre elas, o script descobre quantos pixéis vale uma hora. Depois, pega no `Date()` do browser, calcula os minutos atuais e faz a matemática para centrar o scroll exatamente nessa hora.
- **Eventos `isTrusted`:** Para o PC não adormecer, geramos um `MouseEvent`. No entanto, os browsers marcam eventos gerados por código como `isTrusted: false`. O nosso script usa isso a nosso favor: só para o loop se um evento `isTrusted: true` (vindo do teu rato/teclado físico) for detetado!
- **Persistência de Estado:** Como o JavaScript perde a memória quando a página faz reload, usamos o `localStorage` para guardar um "interruptor". Assim, quando a página recarrega, o script lê o `localStorage` e sabe que deve continuar o loop.

---

## ⚠️ Disclaimer

Este script foi feito para uso pessoal e educacional. A Intra 42 tem sistemas de proteção e rate-limiting. Usa com responsabilidade e bom senso para não sobrecarregar os servidores da escola. Não me responsabilizo por possíveis limitações de IP ou avisos da administração.

---

## 📜 Licença

Distribuído sob a licença MIT. Sente-te à vontade para modificar, melhorar e partilhar! 
