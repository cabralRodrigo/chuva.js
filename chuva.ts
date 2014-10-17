/**
  * Obtem um número randômico no intervalo passado
  * @param min Número mínimo no internavalo
  * @param max Número máximo no internavalo
  */
function RangeNumber(min: number, max: number): number {
    return ((Math.random() * (max - min + 1)) + min);
}

/**
  * Classe que representa a gota na animação
  */
class Gota {
    private x: number;
    private y: number;
    private color: string;
    private tamanho: number;
    private yV: number;
    private xV: number;
    private maxX: number;
    private maxY: number;

    /**
      * Inicializa a gota
      * @param maxX Número máximo na coordenada X
      * @param maxY Número mínimo no coordenada Y
      */
    constructor(maxX: number, maxY: number) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.x = RangeNumber(0, this.maxX);
        this.y = 0;
        this.color = "blue";
        this.tamanho = RangeNumber(5, 20);
        this.yV = RangeNumber(10, this.tamanho);
        this.xV = 0;
    }

    /**
    * Flag que informa se a gota esta no limite do frame ou não
    */
    public gotaNoLimiteDoFrame(): boolean {
        return this.y + this.tamanho + this.yV >= this.maxX;
    }

    /**
     * Atualiza o valor de Y da gota sobre a velocidade
     */
    private atualizarPosicao(): void {
        this.y += this.yV;
        this.x += this.xV;
    }

    /**
      * Renderiza a gota no frame e retorna se a gota esta ou não no limite do tamanho do frame
      * @param context Contexto do canvas em 2D
      */
    public desenharGota(context: CanvasRenderingContext2D): boolean {

        //Só renderiza a linha, se a mesma não estiver no limite do frame
        if (!this.gotaNoLimiteDoFrame()) {
            //Calcula o valor de finalização da linha de acordo com o limite do frame
            var novoY: number = this.y + this.tamanho > this.maxY ? this.maxY : this.y + this.tamanho;

            context.beginPath();
            context.strokeStyle = this.color;
            context.moveTo(this.x, this.y);
            context.lineTo(this.x, novoY);
            context.stroke();

            //Atualiza a posição da linha baseando-se na velocidade
            this.atualizarPosicao();
        }

        return this.gotaNoLimiteDoFrame();
    }
}

/**
  * Classe que representa a chuva na animação
  *
  */
class Chuva {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private gotas: Array<Gota>;
    private gotasPorFrame: number = 10;
    private width: number;
    private height: number;

    /**
      * Inicializa a intância do objeto
      * @param width Tamanho a largura do canvas que irá renderizar a animação
      * @param height Tamanho a altura do canvas que irá renderizar a animação
      */
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.canvas = <HTMLCanvasElement>document.getElementById("chuva");
        this.ctx = this.canvas.getContext("2d");
        this.gotas = [];
    }

    /**
      * Limpa o frame
      */
    private limparFrame(): void {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
      * Renderiza na tela informações de debug
      * @param texto Texto que irá ser renderizado na tela
      * @param linha Número da linha que o texto será renderizado
      */
    private definirDebugInfo(texto: string, linha: number): void {
        if (false) {
            this.ctx.fillStyle = "red";
            this.ctx.font = "20px Arial";
            this.ctx.fillText(texto, 0, linha * 20);
        }
    }

    /**
      * Renderiza na tela informações de créditos
      */
    private renderizarCreditos(): void {
        this.ctx.fillStyle = "green";
        this.ctx.font = "10px Arial";
        this.ctx.fillText("Animação criada por Rodrigo Cabral", 5, this.height - 15);
        this.ctx.fillText("http://github.com/cabralRodrigo/chuva.js", 5, this.height - 5);
    }

    /**
      * Renderiza todas as gotas no frame
      */
    private renderizarGotas(): void {
        //Array que contém todas as gotas a serem deletadas por estarem no limite do frame
        var gotasDeletar: Array<number> = [];
        var gotasDeletadas: number = 0;

        //Renderiza todas as gotas no frame e adiciona o index da gota no array de gotas a deletar
        for (var i = 0; i < this.gotas.length; i++)
            if (this.gotas[i].desenharGota(this.ctx))
                gotasDeletar.push(i);

        //Deleta todas as gotas no limite do frame
        for (var i = 0; i < gotasDeletar.length; i++)
            if (this.gotas[gotasDeletar[i]].gotaNoLimiteDoFrame()) {
                this.gotas.splice(gotasDeletar[i], 1);
                gotasDeletadas++;
            }

        //Adiciona novas gotas no frame para serem renderizadas no próximo frame
        for (var i = 0; i < this.gotasPorFrame; i++)
            this.gotas.push(new Gota(this.width, this.height));

        //Renderiza as informações de debug no frame
        this.definirDebugInfo("Contagem de gotas: " + this.gotas.length, 1);
        this.definirDebugInfo("Gotas deletadas no frame: " + gotasDeletadas, 2);
        this.definirDebugInfo("Gotas por frame: " + this.gotasPorFrame, 3);
    }

    /**
      * Atualiza a posição de cada gota e renderiza o frame
      * É necessário usar essa sintaxe pois no segundo frame em diante a palavra-chave "this" perde sua referência para a instância da classe
      * Ref: http://stackoverflow.com/questions/21924719/how-to-use-requestanimationframe-with-a-typescript-object
      */
    private renderizarFrame = () => {
        this.limparFrame();
        this.renderizarGotas();
        this.renderizarCreditos();
        requestAnimationFrame(this.renderizarFrame);
    }

    /**
     * Inicia a animação de chuva
     */
    public iniciarChuva(): void {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.renderizarFrame();
    }
}