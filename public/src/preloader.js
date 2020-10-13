export default function() {

    // Preloader scene
    return new Phaser.Class({
        Extends: Phaser.Scene,
        initialize: function Preloader() {
            Phaser.Scene.call(this, { key: "Preloader" })

            this.loadTxt;
        },

        preload: function() {
            this.load.setBaseURL("./assets/");

            //this.load.image('image0', '0.png');
            //this.load.json("story1", "storyjson/story1.json");
            //this.load.text("locDE", "languageData/deutsch.txt");
            //this.load.audio('decisionLeft', 'audio/decision.wav');
            //this.load.atlas("tilesGrass", "sprites/tiles/grassDirt.png", "sprites/tiles/tilesGround_atlas.json");

            this.load.bitmapFont("pixelmix", "fonts/pixelmix.png", "fonts/pixelmix.xml");

            this.load.image("sprLcarsPipLeft16", "sprites/lcarsPipLeft16.png");
            this.load.image("sprLcarsPipRight16", "sprites/lcarsPipRight16.png");
            this.load.image("sprLcarsPillar32", "sprites/lcarsPillar32.png");
            this.load.image("sprLcarsL64thin", "sprites/lcarsL64thin.png");
            this.load.image("sprLcarsL48", "sprites/lcarsL48.png");
            this.load.image("sprLcarsL64", "sprites/lcarsL64.png");
            this.load.image("sprLcarsCrosspadBg", "sprites/lcarsCrosspadBg04.png")
            
            this.load.image("sprLcarsBtnMono16", "sprites/lcarsBtnMono16.png");
            this.load.image("sprLcarsBtnLong64", "sprites/lcarsBtnLong64.png");
            this.load.image("sprLcarsBtnLong32", "sprites/lcarsBtnLong32.png");
            this.load.image("sprLcarsBtnLong48", "sprites/lcarsBtnLong48.png");
            this.load.image("sprLcarsBtnLeft32", "sprites/lcarsBtnLeft32.png");
            this.load.image("sprLcarsBtnLeft48", "sprites/lcarsBtnLeft48.png");
            this.load.image("sprLcarsBtnLeft64", "sprites/lcarsBtnLeft64.png");
            this.load.image("sprLcarsBtnRight48", "sprites/lcarsBtnRight48.png");

            this.load.image("sprSectorGrid3d", "sprites/sectorGrid3d.png");
            this.load.image("sprGoldTarget", "sprites/goldTarget.png");
            this.load.image("sprPinkCircle", "sprites/pinkCircle.png");
            this.load.image("sprPinkSimpleHeading", "sprites/pinkSimpleHeading.png");
            this.load.image("sprPinkSimpleHeading01", "sprites/pinkSimpleHeading01.png");
            this.load.image("sprSymbolUnknown", "sprites/symbolUnknown.png");
            this.load.image("sprSymbolFriendlyShip", "sprites/symbolFriendlyShip.png");
            this.load.image("sprSymbolFriendlyStation", "sprites/symbolFriendlyStation.png");

            // Display loading progress
            var game_config = this.game.config
            var width = game_config.width

            //let style = { fontFamily: 'Mozart', fontSize: 64, color: '#ffffff', align: 'center', wordWrap: { width: 700 } };
            //this.loadTxt = this.add.text(game_config.width * 0.5, game_config.height * 0.5, "LOADING...", style).setOrigin(0.5);

            //this.load.on('progress', this.update_progress_display, this)
        },

        create: function() {
            this.cameras.main.setBackgroundColor(0x000000);
            this.load.off("progress", this.update_progress_display, this);

            this.cache.bitmapFont.get("pixelmix").data.lineHeight = 40;
            this.scene.start("ScnMain");
        },

        update_progress_display: function(pct) {
            //update text or whatever
        }
    })

}