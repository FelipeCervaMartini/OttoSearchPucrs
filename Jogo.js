// Arquivo: JogoOtto.js
// Classe principal do jogo do investigador Otto

import { Engine, prompt } from "./Basicas.js";
import {
  Jardim,
  HallInferior,
  Cozinha,
  Banheiro,
  Garagem,
  SalaEstar,
  SalaJantar,
  Fundos,
  HallSuperior,
  Quarto,
  Biblioteca,
  Sotao,
} from "./Salas.js";

export class JogoOtto extends Engine {
  #horaAtual;
  #nivelCansaco;
  #jogoTerminado;
  #motivoTermino;

  constructor() {
    super();
    this.#horaAtual = 10; // Jogo começa às 10h da manhã
    this.#nivelCansaco = 0; // Começa sem cansaço (0-100)
    this.#jogoTerminado = false;
    this.#motivoTermino = "";
  }

  get horaAtual() {
    return this.#horaAtual;
  }

  get nivelCansaco() {
    return this.#nivelCansaco;
  }

  // Método para avançar o tempo quando o jogador faz ações
  avancaTempo(minutos = 15) {
    this.#horaAtual += minutos / 60;
    this.#nivelCansaco += 2; // Cada ação aumenta um pouco o cansaço

    // Verifica se passou das 19h
    if (this.#horaAtual >= 19 && !this.#jogoTerminado) {
      console.log("\n=== GAME OVER ===");
      console.log("São 19 horas! Jerry chegou e te encontrou na casa!");
      console.log("Você não conseguiu escapar a tempo...");
      this.#motivoTermino = "tempo";
      this.indicaFimDeJogo();
      return;
    }

    // Verifica se o cansaço é muito alto
    if (this.#nivelCansaco >= 100 && !this.#jogoTerminado) {
      console.log("\n=== GAME OVER ===");
      console.log("Você desmaiou de exaustão!");
      console.log("Otto não aguentou mais e perdeu a consciência...");
      this.#motivoTermino = "cansaco";
      this.indicaFimDeJogo();
      return;
    }
  }

  // Método para indicar derrota por motivo específico
  indicaDerrota(motivo) {
    this.#jogoTerminado = true;
    this.#motivoTermino = motivo;
    this.indicaFimDeJogo();
  }

  // Método para indicar vitória
  indicaVitoria() {
    this.#jogoTerminado = true;
    this.#motivoTermino = "vitoria";
    console.log("\n=== PARABÉNS! VITÓRIA! ===");
    console.log("Otto conseguiu as evidências necessárias!");
    console.log("Agora Jerry pode finalmente ser preso!");
    this.indicaFimDeJogo();
  }

  // Método para descansar e reduzir cansaço
  descansar() {
    if (this.#nivelCansaco > 0) {
      this.#nivelCansaco = Math.max(0, this.#nivelCansaco - 30);
      this.avancaTempo(30); // Descansar leva 30 minutos
      console.log("Você descansou um pouco. Cansaço reduzido.");
    } else {
      console.log("Você não está cansado.");
    }
  }

  // Método para olhar no espelho
  olharEspelho() {
    let descricao = "";
    if (this.#nivelCansaco < 20) {
      descricao = "Otto parece alerta e focado.";
    } else if (this.#nivelCansaco < 50) {
      descricao = "Otto está um pouco cansado mas ainda determinado.";
    } else if (this.#nivelCansaco < 80) {
      descricao = "Otto está visivelmente cansado, com olheiras.";
    } else {
      descricao = "Otto está exausto, quase no limite.";
    }
    console.log(descricao);
  }

  // Método para ver as horas no relógio
  olharRelogio() {
    let hora = Math.floor(this.#horaAtual);
    let minutos = Math.floor((this.#horaAtual - hora) * 60);
    console.log(`São ${hora}:${minutos.toString().padStart(2, "0")}h`);

    if (this.#horaAtual >= 18) {
      console.log("ATENÇÃO: Jerry pode chegar a qualquer momento!");
    } else if (this.#horaAtual >= 17) {
      console.log("Cuidado: Está ficando tarde...");
    }
  }

  criaCenario() {
    console.log("=== INVESTIGAÇÃO NA CASA DE JERRY ===");
    console.log(
      "Otto, o investigador veterano, chegou à casa suspeita às 10h da manhã."
    );
    console.log(
      "Objetivo: Encontrar evidências contra Jerry antes que ele apareça às 19h!"
    );
    console.log("Cuidado com o tempo e seu nível de cansaço!\n");

    // Define as salas que compõem o mapa
    let jardim = new Jardim(this);
    let hallInferior = new HallInferior(this);
    let cozinha = new Cozinha(this);
    let banheiro = new Banheiro(this);
    let garagem = new Garagem(this);
    let salaEstar = new SalaEstar(this);
    let salaJantar = new SalaJantar(this);
    let fundos = new Fundos(this);
    let hallSuperior = new HallSuperior(this);
    let quarto = new Quarto(this);
    let biblioteca = new Biblioteca(this);
    let sotao = new Sotao(this);

    // Configuração das conexões entre salas (portas)
    // Jardim conecta apenas com Hall Inferior
    jardim.portas.set(hallInferior.nome, hallInferior);
    jardim.portas.set(garagem.nome, garagem);

    // Hall Inferior é o centro - conecta com várias salas
    hallInferior.portas.set(jardim.nome, jardim);
    hallInferior.portas.set(cozinha.nome, cozinha);
    hallInferior.portas.set(salaEstar.nome, salaEstar);

    // Conexões das salas com Hall Inferior
    cozinha.portas.set(hallInferior.nome, hallInferior);
    cozinha.portas.set(banheiro.nome, banheiro);

    banheiro.portas.set(cozinha.nome, cozinha);

    garagem.portas.set(jardim.nome, jardim);

    // Sala de Estar conecta com Hall Inferior e Sala de Jantar
    salaEstar.portas.set(hallInferior.nome, hallInferior);
    salaEstar.portas.set(salaJantar.nome, salaJantar);
    salaEstar.portas.set(hallSuperior.nome, hallSuperior);

    // Sala de Jantar conecta com Sala de Estar e Fundos
    salaJantar.portas.set(salaEstar.nome, salaEstar);
    salaJantar.portas.set(fundos.nome, fundos);

    // Fundos conecta apenas com Sala de Jantar
    fundos.portas.set(salaJantar.nome, salaJantar);

    // Hall Superior conecta com Hall Inferior, Quarto, Biblioteca e Sótão
    hallSuperior.portas.set(salaEstar.nome, salaEstar);
    hallSuperior.portas.set(quarto.nome, quarto);
    hallSuperior.portas.set(biblioteca.nome, biblioteca);
    hallSuperior.portas.set(sotao.nome, sotao);

    // Conexões das salas superiores
    quarto.portas.set(hallSuperior.nome, hallSuperior);

    biblioteca.portas.set(hallSuperior.nome, hallSuperior);

    sotao.portas.set(hallSuperior.nome, hallSuperior);

    // Define a sala inicial (Otto começa no jardim, na frente da casa)
    this.salaCorrente = jardim;
  }

  // Sobrescreve o método joga para incluir comandos específicos do jogo
  joga() {
    let novaSala = null;
    let acao = "";
    let tokens = null;

    while (!this.fim) {
      console.log("-------------------------");
      console.log(this.salaCorrente.textoDescricao());

      // Mostra informações adicionais
      let hora = Math.floor(this.horaAtual);
      let minutos = Math.floor((this.horaAtual - hora) * 60);
      console.log(
        `Hora atual: ${hora}:${minutos
          .toString()
          .padStart(2, "0")}h | Cansaço: ${this.nivelCansaco}/100`
      );

      acao = prompt("O que você deseja fazer? ");
      tokens = acao.split(" ");

      switch (tokens[0].toLowerCase()) {
        case "fim":
          this.fim = true;
          break;

        case "pega":
          if (this.salaCorrente.pega(tokens[1])) {
            console.log("Ok! " + tokens[1] + " guardado!");
            this.avancaTempo(10); // Pegar item leva 10 minutos
          } else {
            console.log("Objeto " + tokens[1] + " não encontrado.");
          }
          break;

        case "inventario":
          console.log("Ferramentas disponíveis: " + this.mochila.inventario());
          break;

        case "usa":
          if (tokens.length >= 3) {
            if (this.salaCorrente.usa(tokens[1], tokens[2])) {
              console.log("Feito!");
              this.avancaTempo(); // Usar ferramenta leva 15 minutos
              if (this.fim === true) {
                console.log("Parabéns, você venceu!");
              }
            } else {
              console.log(
                "Não é possível usar " +
                  tokens[1] +
                  " sobre " +
                  tokens[2] +
                  " nesta sala"
              );
            }
          } else if (tokens.length === 2) {
            // Comando "usa objeto" sem ferramenta
            if (this.salaCorrente.usa("", tokens[1])) {
              console.log("Feito!");
              this.avancaTempo();
            } else {
              console.log("Não é possível interagir com " + tokens[1]);
            }
          }
          break;

        case "sai":
          novaSala = this.salaCorrente.sai(tokens[1]);
          if (novaSala == null) {
            console.log("Sala desconhecida...");
          } else {
            this.salaCorrente = novaSala;
            this.avancaTempo(5); // Mudar de sala leva 5 minutos
          }
          break;
        case "pega":
          const ferramenta = this.salaCorrente.pega(tokens[1]);
          if (ferramenta) {
            if (this.mochila.guarda(ferramenta)) {
              console.log("Ok! " + tokens[1] + " guardado!");
              this.avancaTempo(10);
            } else {
              console.log(
                "Não foi possível guardar " + tokens[1] + ", mochila cheia!"
              );
            }
          } else {
            console.log("Objeto " + tokens[1] + " não encontrado.");
          }
          break;
        case "remove":
          if (this.mochila.remove(tokens[1])) {
            console.log(tokens[1] + " descartado da mochila.");
            this.avancaTempo(5);
          } else {
            console.log("Você não tem " + tokens[1] + " na mochila.");
          }
          break;
        case "descansar":
          this.descansar();
          break;

        case "olhar":
          if (tokens[1] === "espelho") {
            this.olharEspelho();
          } else if (tokens[1] === "relogio") {
            this.olharRelogio();
          } else {
            console.log(
              "Comando não reconhecido. Tente 'olhar espelho' ou 'olhar relogio'"
            );
          }
          break;

        default:
          console.log("Comando desconhecido: " + tokens[0]);
          console.log(
            "Comandos disponíveis: pega, usa, sai, remove, inventario, descansar, olhar, fim"
          );
          break;
      }
    }

    console.log("\n=== JOGO ENCERRADO ===");
    if (this.#motivoTermino === "vitoria") {
      console.log("Otto completou sua missão com sucesso!");
    } else if (this.#motivoTermino === "tempo") {
      console.log("Jerry chegou antes que Otto pudesse escapar...");
    } else if (this.#motivoTermino === "cansaco") {
      console.log("Otto não aguentou o cansaço...");
    } else if (this.#motivoTermino === "cachorro") {
      console.log("O cachorro impediu Otto de continuar...");
    } else {
      console.log("Otto decidiu encerrar a investigação.");
    }
  }
}
