# PRD: PegaPalavras

**Status:** Rascunho para validação  
**Data:** 2026-10-20

## 1. Visão do produto

PegaPalavras é um jogo casual de adivinhação de palavras para crianças de 6 a 8 anos. Em partidas curtas, a criança deduz uma palavra de cinco letras usando o feedback de cada palpite e, ao final, aprende seu significado e vê uma frase de exemplo.

O produto será um site responsivo, gratuito e sem anúncios, em português brasileiro. A experiência deve funcionar sem criação de conta e permitir uma rodada diária comum a todos, além de partidas ilimitadas e modo prática.

## 2. Problema e oportunidade

Jogos de palavras oferecem um desafio breve e repetível que combina entretenimento e raciocínio. Para o público definido, o jogo também deve transformar a revelação da resposta em uma oportunidade de aprendizagem, usando palavras familiares e explicações adequadas à idade.

Jogos de referência mostram abordagens distintas: Wordle e TERMO usam feedback sobre letras e posições; Contexto usa proximidade semântica. PegaPalavras adotará a primeira abordagem. A pesquisa disponível sobre hábitos de jogadores sugere que entretenimento e passatempo são motivações importantes, mas não deve ser tomada como previsão direta para crianças brasileiras: o estudo consultado foi feito com uma amostra voluntária de uma versão em letão.

## 3. Público e contexto

- **Público primário:** crianças de 6 a 8 anos, jogando sozinhas.
- **Público de apoio:** familiares e educadores que possam indicar ou acompanhar o jogo.
- **Contexto principal:** partidas curtas em navegador, especialmente em celular, sem necessidade de instalar aplicativo ou criar conta.
- **Idioma:** português brasileiro, com vocabulário concreto e familiar à faixa etária.

## 4. Objetivos e métricas

### Objetivos

1. Permitir que a criança entenda as regras e conclua uma partida sem ajuda externa.
2. Tornar cada rodada uma oportunidade de descobrir o significado e o uso de uma palavra.
3. Oferecer desafios diários compartilhados e partidas de prática sem barreiras de cadastro ou pagamento.

### Sinal de sucesso

O resultado de aprendizagem desejado é que jogadores lembrem o significado de palavras apresentadas. A métrica e o método de validação ainda precisam ser definidos. A validação inicial deve priorizar testes de compreensão e recordação com participação apropriada de responsáveis, sem coletar dados pessoais desnecessários das crianças.

## 5. Escopo

### MVP

- Desafio diário com a mesma palavra para todos, renovada à meia-noite no horário de Brasília.
- Modo ilimitado para iniciar novas partidas sem esperar a virada do dia.
- Modo prática para jogar sem pressão competitiva.
- Rodadas com palavra de cinco letras e até seis tentativas.
- Feedback de letras e posições após cada palpite válido.
- Dicas opcionais, com penalidade ainda a definir.
- Revelação da resposta com definição curta e frase de exemplo.
- Lista de palavras curada para crianças de 6 a 8 anos.
- Site responsivo e utilizável em celulares e computadores.
- Uso sem conta, gratuito e sem anúncios.

### Fora do MVP

- Compartilhamento de resultados e comparação entre amigos.
- Conquistas, missões, histórico persistente e estatísticas detalhadas.
- Sequência diária e placares.
- Arquivo de desafios anteriores.
- Perfis, mensagens, chat, duelo ou recursos multijogador.
- Aplicativo nativo para Android ou iOS.
- Monetização, anúncios ou recursos pagos.

Esses itens podem ser reavaliados após validar compreensão das regras, diversão e aprendizagem no MVP.

## 6. Requisitos funcionais

### RF-01: Iniciar partida

O jogo deve permitir iniciar o desafio diário, uma partida ilimitada ou uma partida de prática sem exigir cadastro.

**Critérios de aceitação:**

- A tela inicial apresenta claramente as opções disponíveis.
- Ao escolher um modo, o jogador pode começar sem preencher formulário ou criar conta.
- A interface explica as regras essenciais em linguagem simples e adequada à faixa etária.

### RF-02: Desafio diário

O jogo deve disponibilizar a mesma palavra diária para todos os jogadores e trocar o desafio à meia-noite no horário de Brasília.

**Critérios de aceitação:**

- A data do desafio é calculada usando o fuso `America/Sao_Paulo`, não apenas o horário local do dispositivo.
- A mesma data corresponde à mesma palavra para todos os jogadores.
- Uma partida diária iniciada deve manter sua palavra e progresso até ser concluída, mesmo que a página seja recarregada.

### RF-03: Enviar palpite

O jogador deve poder inserir palavras de cinco letras usando teclado virtual ou teclado físico. Apenas palavras válidas da lista de palpites devem ser aceitas.

**Critérios de aceitação:**

- O jogo não aceita palpite com quantidade incorreta de letras.
- O jogo não aceita palavra ausente da lista de palpites válidos e informa o motivo com texto simples.
- Enviar um palpite válido consome uma tentativa.
- O estado da partida é preservado durante uma atualização da página.

### RF-04: Avaliar letras e posições

Após cada palpite válido, o jogo deve indicar quais letras estão na posição correta, quais aparecem em outra posição e quais não aparecem na palavra.

**Critérios de aceitação:**

- O feedback visual não depende somente de cor; cada estado também tem uma forma, símbolo ou texto distinguível.
- Letras repetidas são avaliadas pela quantidade real presente na resposta; ocorrências excedentes são indicadas como ausentes.
- A, Á, Ã e Â são tratadas como a mesma letra para avaliar presença e posição. A resposta revelada mantém sua grafia correta.
- A resposta é revelada quando o jogador acerta ou esgota as seis tentativas.

### RF-05: Usar dica

O jogo deve oferecer dicas opcionais durante a partida. A penalidade exata é uma decisão pendente.

**Critérios de aceitação:**

- Antes de confirmar uma dica, o jogo informa seu efeito na tentativa ou pontuação.
- O modo prática não deve gerar uma penalidade competitiva; a implementação exata depende da decisão pendente sobre contabilização.
- A dica não pode revelar diretamente a resposta antes do encerramento, salvo se o jogador optar por encerrar a partida.

### RF-06: Aprender com a resposta

Ao encerrar uma partida, o jogo deve exibir a resposta, uma definição curta e uma frase de exemplo.

**Critérios de aceitação:**

- Definição e frase usam linguagem adequada para crianças de 6 a 8 anos.
- O conteúdo é revisado para clareza, correção e adequação à faixa etária.
- A explicação aparece tanto em caso de vitória quanto de derrota.

### RF-07: Modos ilimitado e prática

O modo ilimitado deve permitir começar outra partida após o encerramento da atual. O modo prática deve permitir exercitar a mecânica sem pressão competitiva.

**Critérios de aceitação:**

- Uma partida ilimitada concluída pode ser seguida por outra sem aguardar a troca do desafio diário.
- O jogador consegue identificar em qual modo está.
- Partidas de prática não alteram resultados competitivos do desafio diário; a definição precisa das estatísticas fica pendente.

## 7. Requisitos de conteúdo

- As respostas devem vir de uma lista curada para crianças de 6 a 8 anos, priorizando palavras concretas e comuns no português brasileiro.
- A lista deve evitar termos ofensivos ou impróprios, regionalismos pouco reconhecidos e palavras cuja dificuldade dependa de conhecimento especializado.
- Cada resposta deve ter definição e frase de exemplo revisadas.
- A equipe deve documentar a origem e a licença dos dicionários ou bases de palavras usados.
- A lista de respostas e a lista de palpites válidos podem ser diferentes: respostas devem ser especialmente familiares; palpites precisam ser reconhecíveis e válidos.

## 8. Requisitos não funcionais

- **Responsividade:** a experiência deve se adaptar a telas pequenas e grandes sem perder o tabuleiro ou os controles.
- **Acessibilidade:** não transmitir estados apenas por cor; manter texto legível, controles claros, áreas de toque adequadas e suporte à navegação por teclado.
- **Usabilidade infantil:** usar instruções curtas, linguagem concreta, estados visuais claros e feedback não punitivo.
- **Privacidade:** não exigir conta e não coletar dados pessoais de crianças para jogar. Métricas de produto, se adicionadas, devem ser agregadas e minimizadas.
- **Persistência:** progresso da partida deve sobreviver a recarregamento no mesmo navegador. Sincronização entre dispositivos não faz parte do MVP.
- **Disponibilidade:** a partida deve carregar sem depender de cadastro ou permissões do dispositivo.

## 9. Regras e decisões pendentes

1. **Penalidade da dica:** definir se consome uma tentativa, reduz uma pontuação, aplica ambas ou não penaliza no modo prática.
2. **Contabilização:** definir se partidas ilimitadas e de prática alteram estatísticas, quando esses recursos forem implementados.
3. **Acentos na digitação:** o feedback trata vogais acentuadas como a mesma letra, mas ainda é necessário definir se palpites sem acento serão aceitos como palavras válidas.
4. **Dificuldade:** definir quantos níveis haverá e como eles afetam a seleção de palavras. A decisão já tomada é variar a lista, mantendo palavras adequadas à idade.
5. **Aprendizagem:** escolher uma métrica e um método de validação de recordação apropriados para crianças e sem coleta desnecessária de dados pessoais.
6. **Persistência de modo:** definir se modo, partida ilimitada e prática são guardados localmente após fechar o navegador.

## 10. Referências pesquisadas

- [Wordle, New York Times Games](https://www.nytimes.com/games/wordle/index.html): desafio de cinco letras e seis tentativas.
- [TERMO, versão em português](https://termo.pt/): referência de adaptação de jogos de letras para o português. A página não foi acessível diretamente durante a consulta; detalhes foram conferidos nos resultados de busca.
- [Contexto](https://contexto.me/): exemplo de adivinhação por proximidade semântica, usado como contraste de mecânica.
- Rikters e Reinsone, [Strategic Insights in Human and Large Language Model Tactics at Word Guessing Games](https://arxiv.org/html/2409.11112v2), 2024: pesquisa de hábitos e estratégias em uma versão letã, com 110 respostas voluntárias; limitações de representatividade devem ser consideradas.
- Anderson e Meyer, [Finding the optimal human strategy for Wordle using maximum correct letter probabilities and reinforcement learning](https://arxiv.org/abs/2202.00557), 2022: estudo de estratégias para escolher palpites.
- [WCAG 2.2: Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html): informação não deve depender exclusivamente de cor.
- [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/): orientações práticas de acessibilidade para jogos.
