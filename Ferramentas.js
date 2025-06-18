// Arquivo: ferramentasOtto.js
// Ferramentas específicas do jogo do Otto

import { Ferramenta } from "./Basicas.js";

export class Pa extends Ferramenta {
  constructor() {
    super("pa");
  }
}

export class ControleRemoto extends Ferramenta {
  #pilhas;
  #usos;

  constructor() {
    super("controle_remoto");
    this.#pilhas = false;
    this.#usos = 0;
  }

  colocarPilhas() {
    this.#pilhas = true;
    this.#usos = 3;
  }

  usar() {
    if (!this.#pilhas || this.#usos <= 0) {
      return false;
    }
    this.#usos--;
    return true;
  }

  get temPilhas() {
    return this.#pilhas;
  }

  get usosRestantes() {
    return this.#usos;
  }
}

export class ChaveCasa extends Ferramenta {
  constructor() {
    super("chave_casa");
  }
}

export class PeDeCabra extends Ferramenta {
  #usado;

  constructor() {
    super("pe_de_cabra");
    this.#usado = false;
  }

  usar() {
    if (this.#usado) {
      return false;
    }
    this.#usado = true;
    return true;
  }
}

export class Relogio extends Ferramenta {
  #engine;

  constructor(engine) {
    super("relogio");
    this.#engine = engine;
  }

  verHoras() {
    return this.#engine.horaAtual;
  }
}

export class ChavePisoSecreto extends Ferramenta {
  constructor() {
    super("chave_piso_secreto");
  }
}
