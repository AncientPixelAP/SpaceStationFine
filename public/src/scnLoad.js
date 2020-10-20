export default class ScnLoad extends Phaser.Scene {

    constructor() {
        super("ScnLoad");
        this.loadTxt = null;
    }

    preload(){
        this.cameras.main.setBackgroundColor(0x000000);
        this.cameras.main.setScroll(-this.game.config.width * 0.5, -this.game.config.height * 0.5);

        this.load.setBaseURL("./assets/");

        //this.load.image('image0', '0.png');
        //this.load.json("story1", "storyjson/story1.json");
        //this.load.text("locDE", "languageData/deutsch.txt");
        //this.load.audio('decisionLeft', 'audio/decision.wav');
        //this.load.atlas("tilesGrass", "sprites/tiles/grassDirt.png", "sprites/tiles/tilesGround_atlas.json");

        this.load.image("sprHandOpen", "sprites/hands/handOpen.png");

        this.load.image("sprLcarsPipLeft16", "sprites/lcarsPipLeft16.png");
        this.load.image("sprLcarsPipRight16", "sprites/lcarsPipRight16.png");
        this.load.image("sprLcarsPillar32", "sprites/lcarsPillar32.png");
        this.load.image("sprLcarsL64thin", "sprites/lcarsL64thin.png");
        this.load.image("sprLcarsL48", "sprites/lcarsL48.png");
        this.load.image("sprLcarsL64", "sprites/lcarsL64.png");
        this.load.image("sprLcarsCrosspadBg", "sprites/lcarsCrosspadBg03.png");
        this.load.image("sprLcarsSlider16", "sprites/lcarsSlider16.png");

        this.load.image("sprLcarsBtnMono16", "sprites/lcarsBtnMono16.png");
        this.load.image("sprLcarsBtnLong32", "sprites/lcarsBtnLong32.png");
        this.load.image("sprLcarsBtnLong48", "sprites/lcarsBtnLong48.png");
        this.load.image("sprLcarsBtnLong64", "sprites/lcarsBtnLong64.png");
        this.load.image("sprLcarsBtnLeft32", "sprites/lcarsBtnLeft32.png");
        this.load.image("sprLcarsBtnLeft48", "sprites/lcarsBtnLeft48.png");
        this.load.image("sprLcarsBtnLeft64", "sprites/lcarsBtnLeft64.png");
        this.load.image("sprLcarsBtnRight32", "sprites/lcarsBtnRight32.png");
        this.load.image("sprLcarsBtnRight48", "sprites/lcarsBtnRight48.png");

        this.load.image("sprBlueRect52", "sprites/blueRect52.png");
        this.load.image("sprBeamAlignTargetInner52", "sprites/beamAlignTargetInner52.png");
        this.load.image("sprBeamAlignTargetOuter52", "sprites/beamAlignTargetOuter52.png");

        this.load.image("sprSectorGridBg00", "sprites/sectorGridBg00.png");
        this.load.image("sprSectorGrid3d", "sprites/sectorGrid3d.png");
        this.load.image("sprPinkTarget", "sprites/pinkTarget.png");
        this.load.image("sprGoldTarget", "sprites/goldTarget.png");
        this.load.image("sprPinkCircle", "sprites/pinkCircle.png");
        this.load.image("sprPinkSimpleHeading", "sprites/pinkSimpleHeading.png");
        this.load.image("sprPinkSimpleHeading01", "sprites/pinkSimpleHeading01.png");

        this.load.image("sprSymbolUnknown", "sprites/symbolUnknown.png");
        this.load.image("sprSymbolFriendlyShip", "sprites/symbolFriendlyShip.png");
        this.load.image("sprSymbolFriendlyStation", "sprites/symbolFriendlyStation.png");
        this.load.image("sprSymbolFriendlyPlanet", "sprites/symbolFriendlyPlanet.png");
        this.load.image("sprSymbolWarpcore", "sprites/symbolWarpcore.png");
        this.load.image("sprSymbolTorpedo", "sprites/symbolTorpedo.png");
        this.load.image("sprSymbolPhotonicTorpedo", "sprites/symbolPhotonicTorpedo.png");

        this.load.image("sprBlueprintShipGalaxyClass", "sprites/blueprintShipGalaxyClass.png");
        this.load.image("sprBlueprintShipShuttle", "sprites/blueprintShipShuttle.png");
        this.load.image("sprBlueprintStationDeepStation", "sprites/blueprintStationDeepStation.png");

        this.load.image("sprCaptainPickert00", "sprites/characters/captainPickert00.png");
        this.load.image("sprCommanderCirca00", "sprites/characters/commanderCirca00.png");
        this.load.image("sprQuirk00", "sprites/characters/quirk01.png");
        this.load.image("sprDerrek00", "sprites/characters/derrek00.png");

        this.load.json("bajaCaptain00", "jsons/bajaCaptain00.json");
        this.load.json("bajaCommanderCirca00", "jsons/bajaCommanderCirca00.json");
        this.load.json("bajaQuirk00", "jsons/bajaQuirk00.json");

        this.loadTxt = this.add.bitmapText(0, 0, "pixelmix", "LOADING: 0%", 8, 1).setOrigin(0.5);

        this.load.on('progress', this.update_progress_display, this);
    }

    create(){
        this.load.off("progress", this.update_progress_display, this);

        this.cache.bitmapFont.get("pixelmix").data.lineHeight = 40;
        this.scene.start("ScnLogin");
    }

    update(){

    }

    update_progress_display(_pct) {
        this.loadTxt.setText("LOADING: " + String(Math.floor(_pct * 100)) + "%");
    }
}
