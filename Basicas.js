// Arquivo: Basicas.js
// Classes básicas para o jogo de aventura do investigador Otto

import { validate } from "bycontract";
import promptsync from "prompt-sync";
const prompt = promptsync({ sigint: true });

// ---------------------------------------------
export class Ferramenta {
  #nome;

  constructor(nome) {
    validate(nome, "String");
    this.#nome = nome;
  }

  get nome() {
    return this.#nome;
  }

  usar() {
    return true;
  }
}

// ---------------------------------------------
export class Mochila {
  #ferramentas;

  constructor() {
    this.#ferramentas = [];
  }

  guarda(ferramenta) {
    validate(ferramenta, Ferramenta);
    this.#ferramentas.push(ferramenta);
  }

  pega(nomeFerramenta) {
    validate(arguments, ["String"]);
    let ferramenta = this.#ferramentas.find((f) => f.nome === nomeFerramenta);
    return ferramenta;
  }

  tem(nomeFerramenta) {
    validate(arguments, ["String"]);
    return this.#ferramentas.some((f) => f.nome === nomeFerramenta);
  }

  inventario() {
    if (this.#ferramentas.length === 0) {
      return "Nenhuma ferramenta";
    }
    return this.#ferramentas.map((obj) => obj.nome).join(", ");
  }
}

// ---------------------------------------------
export class Objeto {
  #nome;
  #descricaoAntesAcao;
  #descricaoDepoisAcao;
  #acaoOk;

  constructor(nome, descricaoAntesAcao, descricaoDepoisAcao) {
    validate(arguments, ["String", "String", "String"]);
    this.#nome = nome;
    this.#descricaoAntesAcao = descricaoAntesAcao;
    this.#descricaoDepoisAcao = descricaoDepoisAcao;
    this.#acaoOk = false;
  }

  get nome() {
    return this.#nome;
  }

  get acaoOk() {
    return this.#acaoOk;
  }

  set acaoOk(acaoOk) {
    validate(acaoOk, "Boolean");
    this.#acaoOk = acaoOk;
  }

  get descricao() {
    if (!this.acaoOk) {
      return this.#descricaoAntesAcao;
    } else {
      return this.#descricaoDepoisAcao;
    }
  }

  usa(ferramenta, objeto) {
    // Método base - deve ser sobrescrito nas classes filhas
    return false; // ver se isso precisa mesmo
  }
}

// ---------------------------------------------
export class Sala {
  #nome;
  #objetos;
  #ferramentas;
  #portas;
  #engine;

  constructor(nome, engine) {
    validate(arguments, ["String", Engine]);
    this.#nome = nome;
    this.#objetos = new Map();
    this.#ferramentas = new Map();
    this.#portas = new Map();
    this.#engine = engine;
  }

  get nome() {
    return this.#nome;
  }

  get objetos() {
    return this.#objetos;
  }

  get ferramentas() {
    return this.#ferramentas;
  }

  get portas() {
    return this.#portas;
  }

  get engine() {
    return this.#engine;
  }

  objetosDisponiveis() {
    let arrObjs = [...this.#objetos.values()];
    return arrObjs.map((obj) => obj.nome + ": " + obj.descricao);
  }

  ferramentasDisponiveis() {
    let arrFer = [...this.#ferramentas.values()];
    return arrFer.map((f) => f.nome);
  }

  portasDisponiveis() {
    let arrPortas = [...this.#portas.values()];
    return arrPortas.map((sala) => sala.nome);
  }

  pega(nomeFerramenta) {
    validate(nomeFerramenta, "String");
    let ferramenta = this.#ferramentas.get(nomeFerramenta);
    if (ferramenta != null) {
      this.#engine.mochila.guarda(ferramenta);
      this.#ferramentas.delete(nomeFerramenta);
      return true;
    } else {
      return false;
    }
  }

  sai(porta) {
    validate(porta, "String");
    return this.#portas.get(porta);
  }

  textoDescricao() {
    let descricao = "Você está no(a) " + this.nome + "\n";

    if (this.objetos.size == 0) {
      descricao += "Não há objetos visíveis na sala\n";
    } else {
      descricao += "Objetos: " + this.objetosDisponiveis().join(", ") + "\n";
    }

    if (this.ferramentas.size == 0) {
      descricao += "Não há ferramentas na sala\n";
    } else {
      descricao +=
        "Ferramentas: " + this.ferramentasDisponiveis().join(", ") + "\n";
    }

    descricao += "Saídas: " + this.portasDisponiveis().join(", ") + "\n";
    return descricao;
  }

  usa(ferramenta, objeto) {
    // Método base - deve ser sobrescrito nas classes filhas
    return false;
  }
}

// ---------------------------------------------
// Classe Engine - base para controle do jogo
// ---------------------------------------------
export class Engine {
  #mochila;
  #salaCorrente;
  #fim;

  constructor() {
    this.#mochila = new Mochila();
    this.#salaCorrente = null;
    this.#fim = false;
    this.criaCenario();
  }

  get mochila() {
    return this.#mochila;
  }

  get salaCorrente() {
    return this.#salaCorrente;
  }

  set salaCorrente(sala) {
    validate(sala, Sala);
    this.#salaCorrente = sala;
  }

  get fim() {
    return this.#fim;
  }

  set fim(valor) {
    validate(valor, "Boolean");
    this.#fim = valor;
  } //verificar se precisa mesmo

  indicaFimDeJogo() {
    this.#fim = true;
  }

  // Para criar um jogo deriva-se uma classe a partir de
  // Engine e se sobrescreve o método "criaCenario"
  criaCenario() {
    // Método base - deve ser sobrescrito na classe filha
  }

  // Para poder acionar o método "joga" deve-se garantir que
  // o método "criaCenario" foi acionado antes
  joga() {
    let novaSala = null;
    let acao = "";
    let tokens = null;

    while (!this.#fim) {
      console.log("-------------------------");
      console.log(this.salaCorrente.textoDescricao());
      acao = prompt("O que você deseja fazer? ");
      tokens = acao.split(" ");

      switch (tokens[0]) {
        case "fim":
          this.#fim = true;
          break;

        case "pega":
          if (this.salaCorrente.pega(tokens[1])) {
            console.log("Ok! " + tokens[1] + " guardado!");
          } else {
            console.log("Objeto " + tokens[1] + " não encontrado.");
          }
          break;

        case "inventario":
          console.log("Ferramentas disponíveis: " + this.#mochila.inventario());
          break;

        case "usa":
          if (tokens.length >= 3) {
            //veririficar oq é isso
            if (this.salaCorrente.usa(tokens[1], tokens[2])) {
              console.log("Feito!");
              if (this.#fim == true) {
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
            } else {
              console.log("Não é possível interagir com " + tokens[1]);
            } //verificar esse trecho
          }
          break;

        case "sai":
          novaSala = this.salaCorrente.sai(tokens[1]);
          if (novaSala == null) {
            console.log("Sala desconhecida...");
          } else {
            this.#salaCorrente = novaSala;
          }
          break;

        default:
          console.log("Comando desconhecido: " + tokens[0]);
          console.log("Comandos disponíveis: pega, usa, sai, inventario, fim");
          break;
      }
    }

    console.log("Jogo encerrado!");
  }
}
