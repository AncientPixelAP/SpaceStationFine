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

            this.load.image("sprCat00Front", "sprites/cat00Front.png");
            this.load.image("sprCat00Belly", "sprites/cat00Belly.png");
            this.load.image("sprCat00Back", "sprites/cat00Back.png");

            this.load.image("sprHugtronaut", "sprites/hugtronaut00.png");
            this.load.image("sprHugtronautArms", "sprites/hugtronaut01.png");
            this.load.image("sprHugtronautBlue", "sprites/otherHugtronaut00.png");
            this.load.image("sprHugtronautBlueArms", "sprites/otherHugtronaut01.png");

            this.load.image("sprHeartBlue", "sprites/heartBlue00.png");
            this.load.image("sprBall", "sprites/ball00.png");
            this.load.image("sprBallShadow", "sprites/ball01.png");

            this.load.image("sprTile00", "sprites/tile00.png");
            this.load.image("sprTile01", "sprites/tile01.png");

            this.load.image("sprWallHalfFront", "sprites/wallHalf00.png");
            this.load.image("sprWallHalfCorner", "sprites/wallHalf01.png");
            this.load.image("sprWallHalfTop", "sprites/wallHalf02.png");
            //TREE
            this.load.image("sprTreeBase", "sprites/treeBase.png");
            this.load.image("sprTreeTrunk", "sprites/treeTrunk.png");
            this.load.spritesheet("sprTreeTop", "sprites/treeTop00.png", {
                frameWidth: 16,
                frameHeight: 16
            });


            this.load.spritesheet("sprFlowersBlue", "sprites/flowersBlue.png", {
                frameWidth: 8,
                frameHeight: 8
            });

            this.load.json("000wakeup", "jsons/000wakeup.json");

            this.load.bitmapFont("pixelmix", "fonts/pixelmix.png", "fonts/pixelmix.xml");

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

            this.scene.start("ScnMain");
        },

        update_progress_display: function(pct) {
            //update text or whatever
        }
    })

}