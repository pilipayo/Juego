new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
         this.hayUnaPartidaEnJuego = true;
         this.saludJugador=100;
         this.saludMonstruo=100;
         this.turnos=[];
        },
        atacar: function () {
            var herida= this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo-= herida;

            this.registrarEvento(true, 'El jugador golpea al monstruo por ', herida)
           

            if(this.verificarGanador()){
                return;
            }

            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            var herida= this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo -=herida;
            this.registrarEvento(true, 'Golpe especial al monstruo por ', herida)
            if(this.verificarGanador()){
                return this.verificarGanador();
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            var curar;
            if(this.saludJugador<=90){
                this.saludJugador+=10;
                curar=10;
            } else{
                curar=(100-this.saludJugador);
                this.saludJugador=100;
            }
            this.registrarEvento(true, 'Me cure por ', curar )
            this.ataqueDelMonstruo();
        },

        registrarEvento(esJugador, texto, golpe) {
            this.turnos.unshift({
                esJugador: esJugador,
                text: texto + golpe
            });
            
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            var herida = this.calcularHeridas(this.rangoAtaqueDelMonstruo)
            this.saludJugador-=herida;
           this.registrarEvento(false,'El monstruo lastima al jugador en ' , herida)
            
            this.verificarGanador();
        },

        calcularHeridas: function (rangoDeAtaque) {
            min= rangoDeAtaque[0];
            max= rangoDeAtaque[1];
            return Math.max(Math.floor(Math.random()*max)+1, min);
        },
        verificarGanador: function () {
          if(this.saludMonstruo<=0){
              if(confirm("Ganaste! Jugar de nuevo?")){
                  this.empezarPartida();
              } else { 
                  this.hayUnaPartidaEnJuego = false;
              }
              return true;
          }else if (this.saludJugador<=0){
            if(confirm("Perdiste! Jugar de nuevo?")){
                this.empezarPartida();
            } else { 
                this.hayUnaPartidaEnJuego=false;
            }
            return true;
          }
          return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});