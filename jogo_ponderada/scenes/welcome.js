class Welcome extends Phaser.Scene {

    constructor() {
        super({
            key: 'Welcome',
        });
    }

    // carregamos no jogo o fundo, o formulário html e o botão de jogar
    preload() {
        this.load.image('jogar', 'assets/play_bt.png');
        this.load.html('form', 'form/form.html');
        this.load.image('bgWelcome', 'assets/bgWelcome.png');
    }

    create() {
        //criamos no jogo a imagem de fundo, criamos a variável de cursor e a definimos para reconhecer quando uma tecla é pressionada
        this.add.image( 711, 400, 'bgWelcome' );
        this.cursors = this.input.keyboard.createCursorKeys();

        // atribui valor a variável returnKey e a define para reconhecer quando o enter é pressionado
        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.nameFilled = false;

        var text = {height: 20, padding: 15, content: "City Game --" }
        this.message = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2 - text.padding * 2 - text.height,
            text.content, {
                color: "#FFF",
                fontSize: 40,
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        var inputSize = { width: 270, height: 42, padding: 15 };
        var inputButton = { width: 30, height: 12 };
        var inputCoords = {
            xposition: (this.game.config.width - inputSize.width) / 2 - inputButton.width,
            yposition: (this.game.config.height - inputSize.height - inputSize.padding * 2) / 2,
        };
        this.inputName = this.add.dom(inputCoords.xposition, inputCoords.yposition).createFromCache('form').setOrigin(0, 0);

        const nameOkTextButton = this.add.text(
            inputCoords.xposition + inputSize.width + 13,
            inputCoords.yposition + inputButton.height + 2, ">", {
                fontSize: 18,
                padding: 10
            }
        );
        nameOkTextButton.setInteractive();

        this.returnKey.on("down", event => {
            this.updateName(this.inputName);
        });
         
        this.playBt = this.add.image(this.game.config.width / 2 - 50, this.game.config.height / 5 * 3, 'jogar')
        .setScale(.2).setOrigin(0, 0).setInteractive().setVisible(false);

         // Configuração de evento para iniciar o jogo ao clicar no botão "play"
        this.playBt.on('pointerdown', function () {
            if (this.nameFilled) {
                this.game.highScore = 0;
                this.scene.start('Cena01', this.game);
            }
        }, this);
    }  
    
    updateName(inputNameElement) {
        let name = inputNameElement.getChildByName("name");
        if (name.value != "") {
            this.message.setText("Bem Vindo " + name.value);
            this.playBt.setVisible(true);
            this.nameFilled = true;
            this.game.name = name.value;
        }
    }
}