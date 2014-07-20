//Obtem um número randômico no intervalo passado
Math.range = function (min, max) {
    return ((Math.random() * (max - min + 1)) + min);
}

//Classe que representa a gota na animação
function Gota(maxX, maxY) {
    this.x = Math.range(0, maxX);
    this.y = 0;
    this.color = "blue";
    this.tamanho = Math.range(5, 20);
    this.yV = Math.range(10, this.tamanho);
    this.xV = 0;

    //Flag que informa se a gota esta no limite do frame ou não
    this.gotaNoLimiteDoFrame = function () {
        return this.y + this.tamanho + this.yV >= maxY;
    };

    //Renderiza a gota no frame
    this.desenharGota = function (context) {
        //Calcula o valor de finalização da linha de acordo com o limite do frame
        var novoY = this.y + this.tamanho > maxY ? maxY : this.y + this.tamanho;

        //Só renderiza a linha, se a mesma não estiver no limite do frame
        if (!this.gotaNoLimiteDoFrame()) {
            context.beginPath();
            context.strokeStyle = this.color;
            context.moveTo(this.x, this.y);
            context.lineTo(this.x, novoY);
            context.stroke();

            //Atualiza a posição da linha baseando-se na velocidade
            this.atualizarPosicao();
        }
        return this.gotaNoLimiteDoFrame();
    };

    //Atualiza o valor de Y da gota sobre a velocidade
    this.atualizarPosicao = function () {
        this.y += this.yV;
        this.x += this.xV;
    };
}

//Classe que representa a chuva na animação
function Chuva(width, height) {
    var gotasPorFrame = 10;

    //Obtem o canvas e o contexto 2d
    canvas = document.getElementById("chuva");
    ctx = canvas.getContext("2d");

    //Array que contém todas as gotas na tela
    gotas = [];

    //Atualiza a posição de cada gota e renderiza o frame
    function renderizarFrame() {
        limparFrame();
        renderizarGotas();
        renderizarCreditos();
        requestAnimationFrame(renderizarFrame);
    };

    //Renderiza todas as gotas no frame
    function renderizarGotas() {

        //Array que contém todas as gotas a serem deletadas por estarem no limite do frame
        var gotasDeletar = [];
         var gotasDeletadas = 0;

        //Renderiza todas as gotas no frame e adiciona o index da gota no array de gotas a deletar
        for (var i = 0; i < gotas.length; i++)
            if (gotas[i].desenharGota(ctx))
                gotasDeletar.push(i);

        //Deletas todas as gotas no limite do frame
        for (var i = 0; i < gotasDeletar.length; i++)
            if (gotas[gotasDeletar[i]].gotaNoLimiteDoFrame()) {
                gotas.splice(gotasDeletar[i], 1);
                  gotasDeletadas++;
            }

        //Adiciona novas gotas no frame para serem renderizadas no próximo frame
        for (var i = 0; i < gotasPorFrame; i++)
            gotas.push(new Gota(width, height));

        //Renderiza as informações de debug no frame
          definirDebugInfo("Contagem de gotas: " + gotas.length, 1);
          definirDebugInfo("Gotas deletadas no frame: " + gotasDeletadas, 2);
          definirDebugInfo("Gotas por frame: " + gotasPorFrame, 3);
    };

    function renderizarCreditos() {
        this.ctx.fillStyle = "green";
        this.ctx.font = "10px Arial";
        this.ctx.fillText("Animação criada por Rodrigo Cabral", 5, height - 15);
        this.ctx.fillText("http://github.com/cabralRodrigo/chuva.js", 5, height - 5);
    };

    //Limpa o frame
    function limparFrame() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
    };

    //Renderiza na tela informações de debug
    function definirDebugInfo(texto, linha) {
        if (false) {
            this.ctx.fillStyle = "red";
            this.ctx.font = "20px Arial";
            this.ctx.fillText(texto, 0, 0 + (linha * 20));
        }
    };

    //Inicia a chuva
    this.iniciarChuva = function () {
        canvas.width = width;
        canvas.height = height;
        renderizarFrame();
    };
}