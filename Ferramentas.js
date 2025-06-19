// Arquivo: ferramentasOtto.js
// Ferramentas específicas do jogo do Otto

import { Ferramenta } from "./Basicas.js";

// Pá para cavar - ferramenta básica
export class Pa extends Ferramenta {
  constructor() {
    super("pa");
  }
}

// Controle remoto com pilhas limitadas - 3 usos apenas
export class ControleRemoto extends Ferramenta {
  #pilhas;
  #usos;

  constructor() {
    super("controle_remoto");
    this.#pilhas = false; // Inicia sem pilhas
    this.#usos = 0;
  }

  // Adiciona pilhas e define 3 usos
  colocarPilhas() {
    this.#pilhas = true;
    this.#usos = 3;
  }

  // Usa o controle - reduz usos disponíveis
  usar() {
    if (!this.#pilhas || this.#usos <= 0) {
      return false;
    }
    this.#usos--;
    return true;
  }

  // Getter para verificar se tem pilhas
  get temPilhas() {
    return this.#pilhas;
  }

  // Getter para verificar usos restantes
  get usosRestantes() {
    return this.#usos;
  }
}

// Chave da casa - abre portas e armários
export class ChaveCasa extends Ferramenta {
  constructor() {
    super("chave_casa");
  }
}

// Pé de cabra - uso único para forçar portas
export class PeDeCabra extends Ferramenta {
  #usado;

  constructor() {
    super("pe_de_cabra");
    this.#usado = false; // Controla uso único
  }

  // Pode ser usado apenas uma vez
  usar() {
    if (this.#usado) {
      return false;
    }
    this.#usado = true;
    return true;
  }
}

// Relógio que mostra hora atual do jogo
export class Relogio extends Ferramenta {
  #engine;

  constructor(engine) {
    super("relogio");
    this.#engine = engine;
  }

  // Método para ver as horas atuais
  verHoras() {
    return this.#engine.horaAtual;
  }
}

// Chave especial do piso secreto - abre o sótão
export class ChavePisoSecreto extends Ferramenta {
  constructor() {
    super("chave_piso_secreto");
  }
}
