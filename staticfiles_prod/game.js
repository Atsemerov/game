 function preload() {
    this.load.image('background', 'static/images/background.jpg');
    this.load.image('hero', 'static/images/hero.png');
    this.load.image('enemy', 'static/images/enemy.png');
    this.load.image('coin', 'static/images/coin.png');
    this.load.image('arch', 'static/images/arch.png');
}
    function create() {

    this.background = this.add.tileSprite(0, 0, 12000, this.game.config.height, 'background').setOrigin(0, 0);
    this.ground = this.physics.add.staticGroup();
    this.ground.create(6000, this.game.config.height, 'ground').setSize(12000, 10).setVisible(false);

    this.add.image(11500, game.config.height - 200, 'arch').setScale(0.08);

    this.player = this.physics.add.sprite(100, 0, 'hero');
    this.player.setScale(0.05);
    this.player.body.setSize(1700, 3300).setOffset(1100, 300);
    this.physics.add.collider(this.player, this.ground);

    this.enemies = this.physics.add.group({
    key: 'enemy',        // ключ картинки, загруженной в preload()
    repeat: 6,           // сколько дополнительных врагов добавить (всего 7 с учётом первого)
    setXY: { x: 1050, y: 340, stepX: 1500 }  // координаты размещения и шаг по X
    });
    this.enemies.children.iterate(function (enemy) {
        enemy.setScale(0.066);
        enemy.body.setSize(3000, 3700);
        enemy.body.setOffset(500, 150);
        });
    this.physics.add.collider(this.enemies, this.ground);

    this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
        player.setTint(0xff0000);
        this.physics.pause();
        this.popup.setPosition(this.cameras.main.scrollX + this.scale.width / 2, game.config.height / 2);
        this.popup.setVisible(true);
    });

    this.coinsTop = this.physics.add.group({
        key: 'coin',
        repeat: 13,
        setXY: { x: 500, y: 250, stepX: 800 }
    });

    this.coinsBottom = this.physics.add.group({
        key: 'coin',
        repeat: 8,
        setXY: { x: 900, y: 450, stepX: 800 }
    });

    this.coinsTop.children.iterate((coin) => {
        coin.setScale(0.012);
        coin.body.allowGravity = false;
    });

    this.coinsBottom.children.iterate((coin) => {
        coin.setScale(0.012);
        coin.body.allowGravity = false;
    });

    this.score = 0;

    this.physics.add.collider(this.player, this.coinsTop, (player, coin) => {
        coin.disableBody(true, true);
        this.score += 1;
        console.log(this.score);
    });

    this.physics.add.collider(this.player, this.coinsBottom, (player, coin) => {
        coin.disableBody(true, true);
        this.score += 1;
        console.log(this.score);
    });

    this.physics.world.setBounds(0, 0, 12000, game.config.height); //границы физического мира
    this.player.setCollideWorldBounds(true); //запрет на выход героя за пределы физ мира
    this.cameras.main.setBounds(0, 0, 12000, game.config.height); // ограничиваем движение камеры
    this.cameras.main.startFollow(this.player); //камера следует за персонажем
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);


    // Фон и текст
this.popupBg = this.add.rectangle(0, 0, game.config.width + 100, game.config.height, 0x000000, 0.8);
this.popupText = this.add.text(0, -60, 'Конец игры. Чтобы сохранить результат, войдите или зарегистрируйтесь.', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);

// Кнопка Регистрация
this.btnRegister = this.add.text(0, 20, 'Регистрация', { fontSize: '18px', backgroundColor: '#444', color: '#fff', padding: 10 })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {localStorage.setItem("score", this.score); window.location.href = '/register/';});

// Кнопка Вход
this.btnLogin = this.add.text(0, 70, 'Вход', { fontSize: '18px', backgroundColor: '#444', color: '#fff', padding: 10 })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {localStorage.setItem("score", this.score); window.location.href = '/login/';});

// Кнопка Заново
this.btnRestart = this.add.text(0, 120, 'Заново', { fontSize: '18px', backgroundColor: '#444', color: '#fff', padding: 10 })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => this.scene.restart());

    this.popup = this.add.container(this.cameras.main.scrollX + this.scale.width / 2, game.config.height / 2, [
    this.popupBg,
    this.popupText,
    this.btnRegister,
    this.btnLogin,
    this.btnRestart
    ]);

    this.popup.setVisible(false); // Сначала скрываем окно


    this.cursors = this.input.keyboard.createCursorKeys();
    this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    //this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.spaceKey = this.input.keyboard.on('keydown-SPACE', () => {
        if (this.player.body.blocked.down) {
            this.player.setVelocityY(-1000);  // Прыжок вверх
        }
    });
}

function update() {
        if (this.cursors.left.isDown) {
        this.player.setVelocityX(-660);   // движение влево
        this.player.flipX = true;         // поворачиваем картинку героя влево
    }
    else if (this.cursors.right.isDown) {
        this.player.setVelocityX(660);    // движение вправо
        this.player.flipX = false;        // поворачиваем картинку героя вправо
    }
    else {
        this.player.setVelocityX(0);      // стоим на месте
    }

    if (this.player.x >= 11000) {
        this.physics.pause();
        this.popup.setPosition(this.cameras.main.scrollX + this.scale.width / 2, game.config.height / 2);
        this.popup.setVisible(true);
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y:1500 },
            debug: false
        }
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


const game = new Phaser.Game(config);