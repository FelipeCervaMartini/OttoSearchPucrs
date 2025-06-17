// Arquivo: objetosOtto.js
// Objetos específicos do jogo do Otto

import { Objeto } from "./Basicas.js";
import { validate } from "bycontract";
import {
  Pa,
  ControleRemoto,
  ChaveCasa,
  PeDeCabra,
  ChavePisoSecreto,
} from "./Ferramentas.js";

export class PedacoTerra extends Objeto {
  constructor() {
    super(
      "pedaco_terra",
      "Um pedaço de terra que parece ter sido mexido recentemente",
      "Buraco cavado na terra. Você encontrou uma chave do piso secreto!"
    );
  }

  usar(ferramenta) {
    if (ferramenta instanceof Pa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

export class CarroGaragem extends Objeto {
  constructor() {
    super(
      "carro",
      "Um carro antigo com vidros embaçados",
      "Carro com vidro quebrado. Estava vazio."
    );
  }

  usar(ferramenta) {
    if (ferramenta instanceof Pa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

export class PortaSalaEstar extends Objeto {
  constructor() {
    super(
      "porta_sala_estar",
      "Porta trancada da sala de estar",
      "Porta da sala de estar está aberta"
    );
  }

  usar(ferramenta) {
    if (ferramenta instanceof ChaveCasa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

export class GavetaCozinha extends Objeto {
  constructor() {
    super(
      "gaveta_cozinha",
      "Gaveta da cozinha fechada",
      "Gaveta aberta. Você encontrou pilhas e um controle remoto!"
    );
  }

  usar() {
    this.acaoOk = true;
    return true;
  }
}

export class ArmarioVidro extends Objeto {
  constructor() {
    super(
      "armario_vidro",
      "Armário de vidro trancado",
      "Armário de vidro aberto. Há uma chave da casa dentro!"
    );
  }

  usar(ferramenta) {
    if (ferramenta instanceof ControleRemoto && ferramenta.usar()) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

export class LivrosBiblioteca extends Objeto {
  constructor() {
    super(
      "livros",
      "Livros empoeirados na estante",
      "Nos livros há anotações: 'A chave está enterrada no jardim, próximo à roseira murcha'"
    );
  }

  usar() {
    this.acaoOk = true;
    return true;
  }
}

export class ArmarioSalaJantar extends Objeto {
  constructor() {
    super(
      "armario_sala_jantar",
      "Armário da sala de jantar",
      "Armário vazio, nada de útil aqui"
    );
  }

  usar(ferramenta) {
    if (ferramenta instanceof ChaveCasa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

export class ArmarioQuarto extends Objeto {
  constructor() {
    super(
      "armario_quarto",
      "Armário do quarto trancado",
      "Armário aberto. Há um relógio antigo dentro!"
    );
  }

  usar(ferramenta) {
    if (ferramenta instanceof ChaveCasa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

export class Cachorro extends Objeto {
  constructor() {
    super(
      "cachorro",
      "Um cachorro feroz bloqueando a passagem",
      "O cachorro correu quando o portão se abriu"
    );
  }

  usar() {
    // Interagir diretamente com o cachorro causa derrota
    return "DERROTA_CACHORRO";
  }
}

export class Espelho extends Objeto {
  #engine;

  constructor(engine) {
    super(
      "espelho",
      "Um espelho empoeirado na parede",
      "Você se olha no espelho"
    );
    this.#engine = engine;
  }

  usar() {
    return this.#engine.nivelCansaco;
  }
}

export class PortaSotao extends Objeto {
  constructor() {
    super(
      "porta_sotao",
      "Porta trancada do sótão",
      "Porta do sótão aberta. Você encontrou evidências de Jerry!"
    );
  }

  usar(ferramenta) {
    if (ferramenta instanceof ChavePisoSecreto) {
      this.acaoOk = true;
      return "VITORIA";
    }
    return false;
  }
}

export class PortaBiblioteca extends Objeto {
  constructor() {
    super(
      "porta_biblioteca",
      "Porta emperrada da biblioteca",
      "Porta da biblioteca forçada e aberta"
    );
  }

  usar(ferramenta) {
    if (ferramenta instanceof PeDeCabra && ferramenta.usar()) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

export class PortaoFundos extends Objeto {
  constructor() {
    super(
      "portao_fundos",
      "Portão dos fundos fechado",
      "Portão dos fundos aberto"
    );
  }

  usar(ferramenta) {
    if (ferramenta instanceof ControleRemoto && ferramenta.usar()) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

export class PortaoGaragem extends Objeto {
  constructor() {
    super(
      "portao_garagem",
      "Portão da garagem fechado",
      "Portão da garagem aberto"
    );
  }

  usar(ferramenta) {
    if (ferramenta instanceof ControleRemoto && ferramenta.usar()) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}
