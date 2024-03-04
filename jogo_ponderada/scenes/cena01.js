class Cena01 extends Phaser.Scene {

    platforms;
    coins;
    cars;

    constructor() {
        super({
            key: 'Cena01',
        });
    }

    init() {
        // cria variável jogador e atribui alguns atributos
        this.player = {
            width: 64,
            height: 96,
            obj: null
        };

        // controles da rodada
        this.gameControls = {
            over: false,
            score: 0,
            restartBt: null,
            scoreText: '',
            cursors: null
        };
    }

    preload () {

        // carrega no jogo o fundo, a plataforma, a moeda, o carro e a sprite do jogador
        this.load.image('bg', 'assets/bg.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('car', 'assets/car.png');
        this.load.spritesheet('dude', 'assets/ninja.png', { frameWidth: this.player.width, frameHeight: this.player.height });
        this.load.image('gameWin', 'assets/win.png');
        this.load.image('restart', 'assets/reset.png');
        this.load.image('gameOver', 'assets/gameOver.png');
    }

    create() {

        // cria no jogo o fundo, a plataforma, a moeda
        this.add.image(711, 400, 'bg');

        this.platforms = this.physics.add.staticGroup(); // adiciona a platforma e a coloca física

        let numPlat = 0; // inicializa a variável numPlat com o valor 0, que será usado como contador
        for (let _ of Array(10)) 
        { // loop forEach que irá executar 10 vezes, criando um elemento de array para cada iteração
            this.platforms.create(1422 - 155 * numPlat, 750, 'ground'); // Cria uma plataforma com base na posição calculada usando o contador numPlat
            numPlat++; // incrementa o contador numPlat para a próxima iteração
        }

        // criação de outras plataformas
        this.platforms.create(1350, 455, 'ground');
        this.platforms.create(1050, 355, 'ground');
        this.platforms.create(800, 250, 'ground');
        this.platforms.create(640, 400, 'ground');
        this.platforms.create(200, 655, 'ground');
        this.platforms.create(700, 650, 'ground');
        this.platforms.create(80, 500, 'ground');

        /*for (let i = 0; i < 13; i++) { // Loop que irá executar 13 vezes
            this.plataformas.create(1422 - 155 * i, 750, "plataforma"); // Cria uma plataforma com base no índice do loop
        }*/

        //this.add.image(711, 400, 'coin');

        // cria a sprite do player e a adiciona física
        this.player.obj = this.physics.add.sprite(this.player.width, this.player.height, 'dude');

        this.player.obj.setBounce(0.2); // adiciona um leve valor de ressalto quando o player é carregado no jogo
        this.player.obj.setCollideWorldBounds(true); // faz o player colidir com os limites da tela

        // cria as sprites 'esquerda', 'direita' e 'pular'
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        //adiciona colisão com o jogador e a plataforma
        this.physics.add.collider(this.player.obj, this.platforms);

        // atribui valor a variável 'cursors', que verifica se o botão do teclado foi pressionado
        //this.cursors = this.input.keyboard.createCursorKeys();

        // adiciona a moeda e física a ela
        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 12,
            setXY: { x: 50, y: 0, stepX: 150 }
        });

        this.coins.children.iterate(function (child) { // coloca 'coin' na função child para o player capturar o item

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        // adiociona a colisão entre a 'coin' e plataforma
        this.physics.add.collider(this.coins, this.platforms);

        // verifica se o jogador se sobrepõe a uma estrela ou não
        this.physics.add.overlap(this.player.obj, this.coins, this.collectCoin, null, this);

        // adiciona o placar e botão reset
        this.gameControls.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});
        this.gameControls.restartBt = this.add.image( 650, 500, 'restart').setScale(0.1).setOrigin(0, 0).setInteractive().setVisible(false);

        // sistema de reset
        this.gameControls.restartBt.on('pointerdown', function () {
            if (this.gameControls.over) {
                this.gameControls.over = false;
                this.gameControls.score = 0;
                this.scene.restart();
            }
        }, this);

        // adiciona um grupo para os carros, coloca física e colisão entre eles, o player e as plataformas
        this.cars = this.physics.add.group();

        this.physics.add.collider(this.cars, this.platforms);

        this.physics.add.collider(this.player.obj, this.cars, this.hitBomb, null, this);

    }

    update() {
        // atribui valor a variável 'cursors', que verifica se o botão do teclado foi pressionado
        this.gameControls.cursors = this.input.keyboard.createCursorKeys();
        
        // estabelece as condições para quando os botões são pressionados e assim realizar uma função
        if (this.gameControls.cursors.left.isDown)
        {
            this.player.obj.setVelocityX(-160);

            this.player.obj.anims.play('left', true);
        }

        else if (this.gameControls.cursors.right.isDown)
        {
            this.player.obj.setVelocityX(160);

            this.player.obj.anims.play('right', true);
        }

        else 
        {
            this.player.obj.setVelocityX(0);

            this.player.obj.anims.play('turn',true);
        }

        if (this.gameControls.cursors.up.isDown && this.player.obj.body.touching.down)
        {
            this.player.obj.setVelocityY(-330);
        }
    }

    // adicionamos a função collectCoin para o jogador coletar as moedas e também contabilizar no placar
    collectCoin ( player, coin ) {
        
        coin.disableBody(true, true);

        this.gameControls.score += 10;
        this.gameControls.scoreText.setText('Score: ' + this.gameControls.score);

        // verifica quantas 'coin' sobraram vivas e se não tiver mais nenhuma esses itens reiniciam 
        if(this.coins.countActive(true) === 0)
        {
            this.gameWin();
        }

            // cria os carros 
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0,400);

        var car = this.cars.create(x, 16, 'car');
        car.setBounce(1);
        car.setCollideWorldBounds(true);
        car.setVelocity(Phaser.Math.Between(-200, 200), 20);

        
    }

    // cria a função hitBomb para quando o jogador bater no carro o jogo para e ele ser pinatdo de vermelho
    hitBomb (player, car) {

        player.anims.play('turn');
        this.gameOver();
        
    }

    // Função chamada ao vencer o jogo  
    gameWin()
    {
        // Ação ao vencer o jogo
        this.physics.pause();
        this.gameControls.over = false;
        this.add.image(960, 500, 'gameWin').setScale(.25);
        this.gameControls.restartBt.visible = true;
        if (this.gameControls.score > this.game.highScore) {
            this.game.highScore = this.gameControls.score;
        }
    }

    // Função chamada ao perder o jogo
    gameOver()
    {
        // Ação ao perder o jogo
        this.physics.pause();
        this.player.obj.setTint(0xff0000);
        this.gameControls.over = true;
        this.add.image(711, 250, 'gameOver').setScale(.25);
        this.gameControls.restartBt.visible = true;
        if (this.gameControls.score > this.game.highScore) {
            this.game.highScore = this.gameControls.score;
        }
    }
}