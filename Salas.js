// Arquivo: salasOtto.js
// Salas específicas do jogo do Otto

import { validate } from "bycontract";
import { Engine, Sala } from "./Basicas.js";
import {
  Pa,
  ControleRemoto,
  ChaveCasa,
  PeDeCabra,
  Relogio,
  ChavePisoSecreto,
} from "./Ferramentas.js";
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
} from "./Objetos.js";

export class Jardim extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Jardim", engine);

    this.objetos.set("portao_garagem", new PortaoGaragem());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);

    if (nomeObjeto === "pedaco_terra") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("pedaco_terra");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        if (!objeto.acaoOk) return false;
        this.ferramentas.set("chave_piso_secreto", new ChavePisoSecreto());
        console.log("Você encontrou a chave do piso secreto!");
        return true;
      }
    } else if (nomeObjeto === "portao_garagem") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("portao_garagem");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Portão da garagem aberto!");
        return true;
      }
    }

    return false;
  }
}

export class Garagem extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Garagem", engine);

    this.objetos.set("carro", new CarroGaragem());
    this.ferramentas.set("pa", new Pa());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
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

export class HallInferior extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Hall_Inferior", engine);
    this.objetos.set("espelho", new Espelho(engine));
    this.objetos.set("porta_sala_estar", new PortaSalaEstar());
  }
  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    if (nomeObjeto === "espelho" && !nomeFerramenta) {
      let objeto = this.objetos.get("espelho");
      if (objeto) {
        objeto.usar();
        return true;
      }
    }

    if (nomeObjeto === "porta_sala_estar") {
      const ferramenta = this.engine.mochila.pega(nomeFerramenta);
      const objeto = this.objetos.get("porta_sala_estar");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Você destrancou a porta da sala de estar!");
        return true;
      }
    }

    return false;
  }
}

export class Cozinha extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Cozinha", engine);
    this.objetos.set("gaveta_cozinha", new GavetaCozinha());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    if (nomeObjeto === "gaveta_cozinha") {
      let objeto = this.objetos.get("gaveta_cozinha");
      if (objeto && objeto.usar()) {
        // Adiciona controle remoto sem pilhas e pilhas separadas
        let controle = new ControleRemoto();
        controle.colocarPilhas();
        this.ferramentas.set("controle_remoto", controle);
        console.log("Você encontrou um controle remoto com pilhas!");

        return true;
      }
    }
    return false;
  }
}

export class Banheiro extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Banheiro", engine);
    this.objetos.set("armario_vidro", new ArmarioVidro());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    const objeto = this.objetos.get(nomeObjeto);

    if (!nomeFerramenta && objeto && objeto.usar()) {
      this.ferramentas.set("chave_casa", new ChaveCasa());
      console.log("Você encontrou a chave da casa!");
      return true;
    }

    return false;
  }
}

export class SalaEstar extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Sala_de_Estar", engine);
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
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
    validate(engine, Engine);
    super("Sala_de_Jantar", engine);
    this.objetos.set("armario_sala_jantar", new ArmarioSalaJantar());
    this.objetos.set("portao_fundos", new PortaoFundos());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);

    if (nomeObjeto === "armario_sala_jantar") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("armario_sala_jantar");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Armário vazio, nada útil aqui.");
        return true;
      }
    } else if (nomeObjeto === "portao_fundos") {
      const ferramenta = this.engine.mochila.pega(nomeFerramenta);
      const objeto = this.objetos.get("portao_fundos");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Você abriu o portão dos fundos!");

        // Remove o cachorro da sala Fundos
        const salaFundos = this.engine.todasAsSalas.find(
          (s) => s.nome === "Fundos"
        );
        if (salaFundos && salaFundos.objetos.has("cachorro")) {
          salaFundos.objetos.delete("cachorro");
          console.log("O cachorro correu para fora ao ver o portão aberto!");
        }

        return true;
      }
    }

    return false;
  }
}

export class Fundos extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Fundos", engine);

    this.objetos.set("cachorro", new Cachorro());
    this.ferramentas.set("pe_de_cabra", new PeDeCabra());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);

    if (nomeObjeto === "cachorro") {
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

    // Não permite interagir com portao_fundos aqui
    return false;
  }
}

export class HallSuperior extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Hall_Superior", engine);
    this.objetos.set("espelho", new Espelho(engine));
    this.objetos.set("porta_biblioteca", new PortaBiblioteca());
  }
  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    if (nomeObjeto === "espelho" && !nomeFerramenta) {
      let objeto = this.objetos.get("espelho");
      if (objeto) {
        objeto.usar();
        return true;
      }
    }
    if (nomeObjeto === "porta_biblioteca") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("porta_biblioteca");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Porta da biblioteca forçada!");
        return true;
      }
    }
    return false;
  }
}

export class Quarto extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Quarto", engine);
    this.objetos.set("armario_quarto", new ArmarioQuarto());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
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
    validate(engine, Engine);
    super("Biblioteca", engine);
    this.objetos.set("livros", new LivrosBiblioteca());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);

    if (nomeObjeto === "livros") {
      let objeto = this.objetos.get("livros");
      if (objeto && objeto.usar()) {
        console.log("Você leu as anotações nos livros!");

        const salaJardim = this.engine.todasAsSalas.find(
          (s) => s.nome === "Jardim"
        );
        if (salaJardim && !salaJardim.objetos.has("pedaco_terra")) {
          salaJardim.objetos.set("pedaco_terra", new PedacoTerra());
          console.log("Você percebe algo diferente no jardim agora...");
        }

        return true;
      }
    }
    return false;
  }
}

export class Sotao extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Sotao", engine);
    this.objetos.set("porta_sotao", new PortaSotao());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
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
