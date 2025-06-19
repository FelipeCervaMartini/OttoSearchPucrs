// Arquivo: Salas
// Salas específicas do jogo

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

// Classe da sala Jardim - área externa inicial
export class Jardim extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Jardim", engine);

    this.objetos.set("portao_garagem", new PortaoGaragem());
  }

  // Gerencia uso de ferramentas nos objetos do jardim
  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);

    // Cavar terra com pá para encontrar chave do piso secreto
    if (nomeObjeto === "pedaco_terra") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("pedaco_terra");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        if (!objeto.acaoOk) return false;
        this.ferramentas.set("chave_piso_secreto", new ChavePisoSecreto());
        console.log(
          "Otto cavava com cuidado, quase em silêncio, exatamente no lugar indicado nos livros que encontrara na biblioteca. Segundo aqueles registros, Jerry havia escondido ali algo importante, longe dos olhos de qualquer curioso. A pá bateu em algo metálico pouco abaixo da superfície. Ele afastou a terra com as mãos e revelou uma pequena caixa de metal, ainda intacta, sem sinais de corrosão. A fechadura estava em uso recente, mas cedeu facilmente ao seu toque. Dentro, envolta em um pano grosso e úmido, repousava uma chave grande, de dentes largos e desenho antigo, claramente usada com frequência. Otto reconheceu imediatamente. Era a chave do piso secreto. A chave que abria o acesso ao compartimento oculto da casa — o verdadeiro motivo daquela investigação. O relógio não parava. O tempo era curto. O objetivo estava próximo."
        );
        return true;
      }
    } else if (nomeObjeto === "portao_garagem") {
      // Abrir portão da garagem
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("portao_garagem");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "O portão da garagem rangeu ao deslizar lentamente, abrindo-se com o clique do controle remoto. O silêncio do lugar parecia ainda mais pesado agora."
        );
        return true;
      }
    }

    return false;
  }
}

// Classe da garagem - contém carro e pá
export class Garagem extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Garagem", engine);

    this.objetos.set("carro", new CarroGaragem());
    this.ferramentas.set("pa", new Pa()); // Pá disponível na garagem
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    // Abrir portão da garagem por dentro
    if (nomeObjeto === "portao_garagem") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("portao_garagem");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Portão da garagem aberto!");
        return true;
      }
    } else if (nomeObjeto === "carro") {
      // Quebrar vidro do carro (mas está vazio)
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("carro");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Com um golpe firme, Otto quebrou o vidro do carro com a pá. O estalo do vidro se espalhou pelo silêncio pesado do jardim. Ele olhou para dentro, esperando encontrar algo — alguma pista, um objeto esquecido, uma prova escondida. Mas o interior estava vazio, tomado por lixo velho e tralhas acumuladas ao longo do tempo. O carro não parecia ter sido usado há muito tempo; o banco estava rasgado, os painéis empoeirados e o cheiro de mofo impregnava o ar. Não havia nada ali que pudesse ajudá-lo, só o eco do abandono e do descaso."
        );
        return true;
      }
    }
    return false;
  }
}

// Hall inferior da casa - entrada principal
export class HallInferior extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Hall_Inferior", engine);
    this.objetos.set("espelho", new Espelho(engine));
    this.objetos.set("porta_sala_estar", new PortaSalaEstar());
  }
  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    // Usar espelho sem ferramenta
    if (nomeObjeto === "espelho" && !nomeFerramenta) {
      let objeto = this.objetos.get("espelho");
      if (objeto) {
        objeto.usar();
        return true;
      }
    }

    // Destrancar porta da sala de estar
    if (nomeObjeto === "porta_sala_estar") {
      const ferramenta = this.engine.mochila.pega(nomeFerramenta);
      const objeto = this.objetos.get("porta_sala_estar");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Otto girou a chave com cuidado e destrancou a porta da sala de estar. O rangido da madeira velha se espalhou pelo silêncio da casa, mostrando a imensidão do local"
        );
        return true;
      }
    }

    return false;
  }
}

// Cozinha - contém gaveta com controle remoto
export class Cozinha extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Cozinha", engine);
    this.objetos.set("gaveta_cozinha", new GavetaCozinha());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    // Abrir gaveta para pegar controle remoto
    if (nomeObjeto === "gaveta_cozinha") {
      let objeto = this.objetos.get("gaveta_cozinha");
      if (objeto && objeto.usar()) {
        // Adiciona controle remoto sem pilhas e pilhas separadas
        let controle = new ControleRemoto();
        controle.colocarPilhas();
        this.ferramentas.set("controle_remoto", controle);
        console.log(
          "Otto abriu a gaveta da cozinha e encontrou o controle remoto, com as pilhas já colocadas. Era a peça que faltava para controlar o portão da garagem."
        );

        return true;
      }
    }
    return false;
  }
}

// Banheiro - contém armário com chave da casa
export class Banheiro extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Banheiro", engine);
    this.objetos.set("armario_vidro", new ArmarioVidro());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    const objeto = this.objetos.get(nomeObjeto);

    // Abrir armário sem ferramenta para pegar chave da casa
    if (!nomeFerramenta && objeto && objeto.usar()) {
      this.ferramentas.set("chave_casa", new ChaveCasa());
      console.log(
        "Otto abriu o armário do banheiro e encontrou uma chave simples. A fechadura parecia comum, como as usadas nas portas da casa, poderia ser útil."
      );
      return true;
    }

    return false;
  }
}

// Sala de estar
export class SalaEstar extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Sala_de_Estar", engine);
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    // Destrancar porta (funcionalidade duplicada do hall)
    if (nomeObjeto === "porta_sala_estar") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("porta_sala_estar");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Otto girou a chave com cuidado e destrancou a porta da sala de estar. O rangido da madeira velha se espalhou pelo silêncio da casa, mostrando a imensidão do local"
        );
        return true;
      }
    }
    return false;
  }
}

// Sala de jantar - contém armário e portão dos fundos
export class SalaJantar extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Sala_de_Jantar", engine);
    this.objetos.set("armario_sala_jantar", new ArmarioSalaJantar());
    this.objetos.set("portao_fundos", new PortaoFundos());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);

    // Abrir armário (vazio)
    if (nomeObjeto === "armario_sala_jantar") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("armario_sala_jantar");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Otto abriu o armário da sala de jantar com cuidado. Lá dentro, só encontrou pratos, copos e alguns talheres — nada que pudesse ajudar na investigação."
        );
        return true;
      }
    } else if (nomeObjeto === "portao_fundos") {
      // Abrir portão dos fundos - remove o cachorro da área
      const ferramenta = this.engine.mochila.pega(nomeFerramenta);
      const objeto = this.objetos.get("portao_fundos");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Otto apontou o controle remoto para o portão do pátio dos fundos. Com um clique suave, o portão se abriu lentamente, rangendo contra o silêncio do lugar."
        );

        // Remove o cachorro da sala Fundos
        const salaFundos = this.engine.todasAsSalas.find(
          (s) => s.nome === "Fundos"
        );
        if (salaFundos && salaFundos.objetos.has("cachorro")) {
          salaFundos.objetos.delete("cachorro");
          console.log(
            "O cachorro, que dormia tranquilamente ao lado, despertou com o som do portão rangendo. Levantou-se rápido e saiu correndo pelo pátio, desaparecendo na escuridão da floresta."
          );
        }

        return true;
      }
    }

    return false;
  }
}

// Área dos fundos - contém cachorro perigoso e pé de cabra
export class Fundos extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Fundos", engine);

    this.objetos.set("cachorro", new Cachorro());
    this.ferramentas.set("pe_de_cabra", new PeDeCabra()); // Ferramenta nova
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);

    // Interagir com cachorro - causa derrota
    if (nomeObjeto === "cachorro") {
      let objeto = this.objetos.get("cachorro");
      if (objeto) {
        let resultado = objeto.usar();
        if (resultado === "DERROTA_CACHORRO") {
          console.log(
            "O cachorro dormia quieto ao lado, mas quando Otto tentou se aproximar, o animal despertou abruptamente e atacou sem aviso. Otto foi ferido gravemente antes de conseguir recuar."
          );
          this.engine.indicaDerrota("cachorro");
          return true;
        }
      }
    }

    // Não permite interagir com portao_fundos aqui
    return false;
  }
}

// Hall superior - segundo andar
export class HallSuperior extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Hall_Superior", engine);
    this.objetos.set("espelho", new Espelho(engine));
    this.objetos.set("porta_biblioteca", new PortaBiblioteca());
  }
  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    // Usar espelho sem ferramenta
    if (nomeObjeto === "espelho" && !nomeFerramenta) {
      let objeto = this.objetos.get("espelho");
      if (objeto) {
        objeto.usar();
        return true;
      }
    }
    // Forçar porta da biblioteca
    if (nomeObjeto === "porta_biblioteca") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("porta_biblioteca");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Otto usou o pé de cabra para arrombar a porta da biblioteca. A madeira cedeu com um estrondo seco, abrindo caminho para o que estava lá dentro."
        );
        return true;
      }
    }
    return false;
  }
}

// Quarto - contém armário com relógio
export class Quarto extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Quarto", engine);
    this.objetos.set("armario_quarto", new ArmarioQuarto());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    // Abrir armário para pegar relógio
    if (nomeObjeto === "armario_quarto") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("armario_quarto");

      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        this.ferramentas.set("relogio", new Relogio(this.engine));
        console.log(
          "Otto abriu o armário do quarto e encontrou um velho relógio de ponteiros. A peça tinha a caixa de metal desgastada pelo tempo, o vidro arranhado e mostrava marcas de uso constante. No verso, uma inscrição quase apagada indicava o nome de Jerry."
        );
        return true;
      }
    }
    return false;
  }
}

// Biblioteca - contém livros com pistas importantes
export class Biblioteca extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Biblioteca", engine);
    this.objetos.set("livros", new LivrosBiblioteca());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);

    // Ler livros - revela pedaço de terra no jardim
    if (nomeObjeto === "livros") {
      let objeto = this.objetos.get("livros");
      if (objeto && objeto.usar()) {
        console.log(
          "Otto passou um tempo lendo os livros antigos, folheando páginas amareladas e poeirentas. Entre as anotações manuscritas, encontrou pistas sutis que indicavam que a chave do sótão estava escondida no pátio da frente."
        );

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

// Sótão - local final com evidências da vitória
export class Sotao extends Sala {
  constructor(engine) {
    validate(engine, Engine);
    super("Sotao", engine);
    this.objetos.set("porta_sotao", new PortaSotao());
  }

  usa(nomeFerramenta, nomeObjeto) {
    validate(arguments, ["String", "String"]);
    // Abrir porta do sótão - condição de vitória
    if (nomeObjeto === "porta_sotao") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("porta_sotao");

      if (ferramenta && objeto) {
        let resultado = objeto.usar(ferramenta);
        if (resultado === "VITORIA") {
          console.log(
            "Otto encontrou provas irrefutáveis ligando Jerry aos crimes. Cada detalhe parecia encaixar perfeitamente, confirmando suas suspeitas e revelando a verdadeira face do criminoso."
          );
          console.log(
            "Documentos, fotos e planos criminosos estavam espalhados pelo sótão, como peças de um quebra-cabeça sombrio que só agora começava a ser montado."
          );
          console.log("Finalmente você conseguiu as provas que precisava. ");
          this.engine.indicaVitoria();
          return true;
        }
      }
    }
    return false;
  }
}
