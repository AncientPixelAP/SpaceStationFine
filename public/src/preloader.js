export default function() {

    // Preloader scene
    return new Phaser.Class({
        Extends: Phaser.Scene,
        initialize: function Preloader() {
            Phaser.Scene.call(this, { key: "Preloader" })
        },

        preload: function() {
            this.load.setBaseURL("./assets/");
            this.load.bitmapFont("pixelmix", "fonts/pixelmix.png", "fonts/pixelmix.xml");
        },

        create: function() {
            this.cameras.main.setBackgroundColor(0x000000);
            this.load.off("progress", this.update_progress_display, this);

            this.cache.bitmapFont.get("pixelmix").data.lineHeight = 40;
            this.scene.start("ScnLoad");
        }
    })

}