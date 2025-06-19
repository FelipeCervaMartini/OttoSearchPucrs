// Arquivo: objetos
// Objetos específicos do jogo

import { Objeto, Ferramenta } from "./Basicas.js";
import { validate } from "bycontract";
import {
  Pa,
  ControleRemoto,
  ChaveCasa,
  PeDeCabra,
  ChavePisoSecreto,
} from "./Ferramentas.js";

// Objeto terra escavável no jardim - contém chave do piso secreto
export class PedacoTerra extends Objeto {
  constructor() {
    super(
      "pedaco_terra",
      "Um pedaço de terra que parece ter sido mexido recentemente",
      "Buraco cavado na terra. Você encontrou uma chave do piso secreto!"
    );
  }

  // Só pode ser usado com pá
  usar(ferramenta) {
    validate(ferramenta, Ferramenta);
    if (ferramenta instanceof Pa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

// Carro na garagem - pode ser quebrado mas está vazio
export class CarroGaragem extends Objeto {
  constructor() {
    super(
      "carro",
      "Um carro antigo com vidros embaçados",
      "Carro com vidro quebrado. Estava vazio."
    );
  }

  // Vidro pode ser quebrado com pá
  usar(ferramenta) {
    validate(ferramenta, Ferramenta);
    if (ferramenta instanceof Pa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

// Porta trancada da sala de estar
export class PortaSalaEstar extends Objeto {
  constructor() {
    super(
      "porta_sala_estar",
      "Porta trancada da sala de estar",
      "Porta da sala de estar está aberta"
    );
  }

  // Precisa da chave da casa para abrir
  usar(ferramenta) {
    validate(ferramenta, Ferramenta);
    if (ferramenta instanceof ChaveCasa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

// Gaveta da cozinha - contém controle remoto
export class GavetaCozinha extends Objeto {
  constructor() {
    super(
      "gaveta_cozinha",
      "Gaveta da cozinha fechada",
      "Gaveta aberta. Você encontrou pilhas e um controle remoto!"
    );
  }

  // Abre sem ferramenta
  usar() {
    this.acaoOk = true;
    return true;
  }
}

// Armário do banheiro - contém chave da casa
export class ArmarioVidro extends Objeto {
  constructor() {
    super(
      "armario_vidro",
      "Armário de vidro trancado",
      "Armário de vidro aberto. Há uma chave da casa dentro!"
    );
  }

  // Abre sem ferramenta
  usar() {
    this.acaoOk = true;
    return true;
  }
}

// Livros da biblioteca - contêm pistas importantes
export class LivrosBiblioteca extends Objeto {
  constructor() {
    super(
      "livros",
      "Livros empoeirados na estante",
      "Nos livros há anotações: 'A chave está enterrada no jardim'"
    );
  }

  // Lê sem ferramenta - revela localização da chave
  usar() {
    this.acaoOk = true;
    return true;
  }
}

// Armário da sala de jantar - vazio
export class ArmarioSalaJantar extends Objeto {
  constructor() {
    super(
      "armario_sala_jantar",
      "Armário da sala de jantar",
      "Armário vazio, nada de útil aqui"
    );
  }

  // Precisa da chave da casa
  usar(ferramenta) {
    validate(ferramenta, Ferramenta);
    if (ferramenta instanceof ChaveCasa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

// Armário do quarto - contém relógio
export class ArmarioQuarto extends Objeto {
  constructor() {
    super(
      "armario_quarto",
      "Armário do quarto trancado",
      "Armário aberto. Há um relógio antigo dentro!"
    );
  }

  // Precisa da chave da casa
  usar(ferramenta) {
    validate(ferramenta, Ferramenta);
    if (ferramenta instanceof ChaveCasa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

// Cachorro perigoso nos fundos - causa derrota se interagir
export class Cachorro extends Objeto {
  constructor() {
    super(
      "cachorro",
      "Um cachorro feroz bloqueando a passagem",
      "O cachorro correu quando o portão se abriu"
    );
  }

  // Interação direta causa derrota
  usar() {
    // Interagir diretamente com o cachorro causa derrota
    return "DERROTA_CACHORRO";
  }
}

// Espelho que mostra nível de cansaço do Otto
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

  // Mostra estado de cansaço baseado no nível
  usar() {
    const c = this.#engine.nivelCansaco;
    if (c < 20) {
      console.log("Otto parece alerta e focado.");
    } else if (c < 50) {
      console.log("Otto está um pouco cansado mas ainda determinado.");
    } else if (c < 80) {
      console.log(
        "Otto está visivelmente cansado, com olheiras marcantes e expressão pesada."
      );
    } else {
      console.log(
        "Otto está exausto, quase no limite, mal se reconhecendo no espelho. "
      );
    }

    return true;
  }
}

// Porta do sótão - objetivo final, condição de vitória
export class PortaSotao extends Objeto {
  constructor() {
    super(
      "porta_sotao",
      "Porta trancada do sótão",
      "Porta do sótão aberta. Você encontrou evidências de Jerry!"
    );
  }

  // Precisa da chave do piso secreto - condição de vitória
  usar(ferramenta) {
    validate(ferramenta, Ferramenta);
    if (ferramenta instanceof ChavePisoSecreto) {
      this.acaoOk = true;
      return "VITORIA";
    }
    return false;
  }
}

// Porta emperrada da biblioteca
export class PortaBiblioteca extends Objeto {
  constructor() {
    super(
      "porta_biblioteca",
      "Porta emperrada da biblioteca",
      "Porta da biblioteca forçada e aberta"
    );
  }

  // Precisa de pé de cabra para forçar
  usar(ferramenta) {
    validate(ferramenta, Ferramenta);
    if (ferramenta instanceof PeDeCabra && ferramenta.usar()) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

// Portão dos fundos - controlado por controle remoto
export class PortaoFundos extends Objeto {
  constructor() {
    super(
      "portao_fundos",
      "Portão dos fundos fechado",
      "Portão dos fundos aberto"
    );
  }

  // Precisa do controle remoto funcionando
  usar(ferramenta) {
    validate(ferramenta, Ferramenta);
    if (ferramenta instanceof ControleRemoto && ferramenta.usar()) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

// Portão da garagem - também controlado por controle remoto
export class PortaoGaragem extends Objeto {
  constructor() {
    super(
      "portao_garagem",
      "Portão da garagem fechado",
      "Portão da garagem aberto"
    );
  }

  // Precisa do controle remoto funcionando
  usar(ferramenta) {
    validate(ferramenta, Ferramenta);
    if (ferramenta instanceof ControleRemoto && ferramenta.usar()) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}
