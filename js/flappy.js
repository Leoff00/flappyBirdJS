function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
} //função para criar um novo elemento


//funcao para gerar a barreira e a barreira invertida (reversa)
function barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda') //ou novoElemneto('div', 'borda')
    const corpo = novoElemento('div', 'corpo') //ou novoElemneto('div', 'corpo')

    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    /* ou  if(reversa == true) {
         this.elemento.appendChild(corpo)
         this.elemento.appendChild(borda)
     }

     else {
         this.elemento.appendChild(borda)
         this.elemento.appendChild(corpo)
     } */

    this.setAltura = altura => corpo.style.height = `${altura}px`

}

//instanciando para ver se a altura esta sendo invertida.

//const b = new barreira(true)
//b.setAltura(400)
//document.querySelector('[wm-flappy]').appendChild(b.elemento)



// funcao para sortear o tamanho das barreiras
function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new barreira(true) //gerando as duas barreiras
    this.inferior = new barreira(false)

    //atribuindo as classes no DOM essas esses dois elementos
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    //metodo que sorteia o tamanho das barreiras
    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    //executando a função para sortear o tamanho das barreiras
    this.sortearAbertura()
    this.setX(x)

}

//instanciando e gerando as barreiras com as seguintes medidas.
// const b = new ParDeBarreiras(700, 200, 500)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)


function barreiras(altura, largura, abertura, espaco, notificarPonto) {

    /* notificarPonto = () => {
        const pontos = document.querySelector('.progresso')
    pontos.innerHTML++ } */

    //funcao para mudar os pontos


    this.pares = [ //criando 4 barreiras
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3),
    ]

    const deslocamento = 3

    this.animar = () => { //callback para o deslocamento das barreiras
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)


            //assim que a barreira chegar na borda esquerda da tela
            //a barreira voltara para a ultima posição com 1800 pixels
            //alem da borda direita da tela vira com o valor sorteado

            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            //logica para saber se o elemento cruzou o meio
            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio &&
                par.getX() < meio

            if (cruzouOMeio) notificarPonto()

        })
    }
}


function passaro(alturaJogo) {
    let voando = false
    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = '../img/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight


        //condicao para o passaro nao passar o topo nem o solo
        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)

}

function progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

/* const Barreiras = new barreiras(700, 1200, 250, 400)
const Passaro = new passaro(700)
const areaDoJogo = document.querySelector('[wm-flappy]')
areaDoJogo.appendChild(Passaro.elemento)
Barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

setInterval(() => {
    Barreiras.animar()
    Passaro.animar()
}, 40) */

function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left &&
        b.left + b.width >= a.left

    const vertical = a.top + a.height >= b.top &&
        b.top + b.height >= a.top


    return horizontal && vertical

}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento

            colidiu = estaoSobrepostos(passaro.elemento, superior) ||
                estaoSobrepostos(passaro.elemento, inferior)
        }
    })

    return colidiu
}


function flappyBird() {
    let pontos = 0


    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth
    const Progresso = new progresso()
    const Barreiras = new barreiras(altura, largura, 200, 400,
        () => Progresso.atualizarPontos(++pontos))
    const Passaro = new passaro(altura)

    areaDoJogo.appendChild(Progresso.elemento)
    areaDoJogo.appendChild(Passaro.elemento)
    Barreiras.pares.forEach(par =>
        areaDoJogo.appendChild(par.elemento))


    this.start = () => {
        const temporizador = setInterval(() => {
            Barreiras.animar()
            Passaro.animar()

            if (colidiu(Passaro, Barreiras)) {
                clearInterval(temporizador)
            }

        }, 20)
    }
}

new flappyBird().start()