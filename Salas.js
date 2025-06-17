// Arquivo: salasOtto.js
// Salas específicas do jogo do Otto

import { Sala } from "./Basicas.js";
import {
  Pa,
  ControleRemoto,
  ChaveCasa,
  PeDeCabra,
  Relogio,
  ChavePisoSecreto,
  Pilhas,
} from "./ferramentasOtto.js";
import {
  PedacoTerra,
  CarroGaragem,
  PortaSalaEstar,
  GavetaCozinha,
  ArmarioVidro,
  LivrosBiblioteca,
  ArmarioSalaJantar,
  ArmarioQuarto,
  Cachorro,
  Espelho,
  PortaSotao,
  PortaBiblioteca,
  PortaoFundos,
  PortaoGaragem,
} from "./objetosOtto.js";

export class Jardim extends Sala {
  constructor(engine) {
    super("Jardim", engine);
    this.objetos.set("pedaco_terra", new PedacoTerra());
    this.objetos.set("espelho", new Espelho(engine));
  }

  usa(nomeFerramenta, nomeObjeto) {
    if (nomeObjeto === "pedaco_terra") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("pedaco_terra");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        if (!objeto.acaoOk) return false;
        // Adiciona a chave do piso secreto à sala
        this.ferramentas.set("chave_piso_secreto", new ChavePisoSecreto());
        console.log("Você encontrou a chave do piso secreto!");
        return true;
      }
    }
    return false;
  }
}

export class HallInferior extends Sala {
  constructor(engine) {
    super("Hall_Inferior", engine);
    this.objetos.set("espelho", new Espelho(engine));
  }
}

export class Cozinha extends Sala {
  constructor(engine) {
    super("Cozinha", engine);
    this.objetos.set("gaveta_cozinha", new GavetaCozinha());
  }

  usa(nomeFerramenta, nomeObjeto) {
    if (nomeObjeto === "gaveta_cozinha") {
      let objeto = this.objetos.get("gaveta_cozinha");
      if (objeto && objeto.usar()) {
        // Adiciona controle remoto sem pilhas e pilhas separadas
        let controle = new ControleRemoto();
        let pilhas = new Pilhas();
        this.ferramentas.set("controle_remoto", controle);
        this.ferramentas.set("pilhas", pilhas);
        console.log("Você encontrou um controle remoto e pilhas!");
        return true;
      }
    }
    return false;
  }
}

export class Banheiro extends Sala {
  constructor(engine) {
    super("Banheiro", engine);
    this.objetos.set("armario_vidro", new ArmarioVidro());
  }

  usa(nomeFerramenta, nomeObjeto) {
    if (nomeObjeto === "armario_vidro") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("armario_vidro");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        this.ferramentas.set("chave_casa", new ChaveCasa());
        console.log("Você encontrou a chave da casa!");
        return true;
      }
    }
    return false;
  }
}

export class Garagem extends Sala {
  constructor(engine) {
    super("Garagem", engine);
    this.objetos.set("portao_garagem", new PortaoGaragem());
    this.objetos.set("carro", new CarroGaragem());
    this.ferramentas.set("pa", new Pa());
  }

  usa(nomeFerramenta, nomeObjeto) {
    if (nomeObjeto === "portao_garagem") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("portao_garagem");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Portão da garagem aberto!");
        return true;
      }
    } else if (nomeObjeto === "carro") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("carro");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Você quebrou o vidro do carro, mas ele estava vazio.");
        return true;
      }
    }
    return false;
  }
}

export class SalaEstar extends Sala {
  constructor(engine) {
    super("Sala_de_Estar", engine);
    this.objetos.set("porta_sala_estar", new PortaSalaEstar());
  }

  usa(nomeFerramenta, nomeObjeto) {
    if (nomeObjeto === "porta_sala_estar") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("porta_sala_estar");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Porta da sala de estar destrancada!");
        return true;
      }
    }
    return false;
  }
}

export class SalaJantar extends Sala {
  constructor(engine) {
    super("Sala_de_Jantar", engine);
    this.objetos.set("armario_sala_jantar", new ArmarioSalaJantar());
  }

  usa(nomeFerramenta, nomeObjeto) {
    if (nomeObjeto === "armario_sala_jantar") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("armario_sala_jantar");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Armário vazio, nada útil aqui.");
        return true;
      }
    }
    return false;
  }
}

export class Fundos extends Sala {
  constructor(engine) {
    super("Fundos", engine);
    this.objetos.set("portao_fundos", new PortaoFundos());
    this.objetos.set("cachorro", new Cachorro());
    this.ferramentas.set("pe_de_cabra", new PeDeCabra());
  }

  usa(nomeFerramenta, nomeObjeto) {
    if (nomeObjeto === "portao_fundos") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("portao_fundos");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        // Remove o cachorro quando o portão abre
        this.objetos.delete("cachorro");
        console.log("Portão aberto! O cachorro correu para fora!");
        return true;
      }
    } else if (nomeObjeto === "cachorro") {
      let objeto = this.objetos.get("cachorro");
      if (objeto) {
        let resultado = objeto.usar();
        if (resultado === "DERROTA_CACHORRO") {
          console.log("O cachorro te atacou! Você foi ferido gravemente...");
          this.engine.indicaDerrota("cachorro");
          return true;
        }
      }
    }
    return false;
  }
}

export class HallSuperior extends Sala {
  constructor(engine) {
    super("Hall_Superior", engine);
    this.objetos.set("espelho", new Espelho(engine));
  }
}

export class Quarto extends Sala {
  constructor(engine) {
    super("Quarto", engine);
    this.objetos.set("armario_quarto", new ArmarioQuarto());
  }

  usa(nomeFerramenta, nomeObjeto) {
    if (nomeObjeto === "armario_quarto") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("armario_quarto");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        this.ferramentas.set("relogio", new Relogio(this.engine));
        console.log("Você encontrou um relógio!");
        return true;
      }
    }
    return false;
  }
}

export class Biblioteca extends Sala {
  constructor(engine) {
    super("Biblioteca", engine);
    this.objetos.set("porta_biblioteca", new PortaBiblioteca());
    this.objetos.set("livros", new LivrosBiblioteca());
  }

  usa(nomeFerramenta, nomeObjeto) {
    if (nomeObjeto === "porta_biblioteca") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("porta_biblioteca");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Porta da biblioteca forçada!");
        return true;
      }
    } else if (nomeObjeto === "livros") {
      let objeto = this.objetos.get("livros");
      if (objeto && objeto.usar()) {
        console.log("Você leu as anotações nos livros!");
        return true;
      }
    }
    return false;
  }
}

export class Sotao extends Sala {
  constructor(engine) {
    super("Sotao", engine);
    this.objetos.set("porta_sotao", new PortaSotao());
  }

  usa(nomeFerramenta, nomeObjeto) {
    if (nomeObjeto === "porta_sotao") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("porta_sotao");

      if (ferramenta && objeto) {
        let resultado = objeto.usar(ferramenta);
        if (resultado === "VITORIA") {
          console.log("Você encontrou evidências conclusivas sobre Jerry!");
          console.log(
            "Documentos, fotos e planos criminosos estão espalhados pelo sótão."
          );
          console.log("Finalmente você conseguiu as provas que precisava!");
          this.engine.indicaVitoria();
          return true;
        }
      }
    }
    return false;
  }
}
