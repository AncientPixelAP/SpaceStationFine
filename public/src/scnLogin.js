import Hand from "./hand.js";
import Button from "./lcars/button.js";
import Numpad from "./lcars/numpad.js";
import CrossPad from "./lcars/crossPad.js";
import ListButton from "./lcars/listButton.js";
import { SliderVertical } from "./lcars/slider.js";

export default class ScnLogin extends Phaser.Scene {

    constructor() {
        super("ScnLogin");
    }

    create() {
        //console.log(this);
        this.cameras.main.setScroll(-this.game.config.width * 0.5, -this.game.config.height * 0.5);
        this.cameras.main.setBackgroundColor(0x000000);

        this.left = this.game.config.width * -0.5;
        this.right = this.game.config.width * 0.5;
        this.top = this.game.config.height * -0.5;
        this.bottom = this.game.config.height * 0.5;
        this.editing = true;

        this.saveGame = {
            name: this.getRandomName(),
            lastLocationId: "unknown"
        }

        if (localStorage.getItem(SAVEGAMENAME) === null) {
            localStorage.setItem(SAVEGAMENAME, JSON.stringify(this.saveGame));
        } else {
            this.saveGame = JSON.parse(localStorage.getItem(SAVEGAMENAME));
        }

        this.hand = new Hand(this);

        this.leftLTop = this.add.sprite(this.left + 34, this.top + 18, "sprLcarsL64thin");
        this.leftLTop.setTintFill(LCARSCOLOR.gold);

        this.rightLTop = this.add.sprite(this.right - 34, this.top + 18, "sprLcarsL64thin");
        this.rightLTop.setScale(-1, 1);
        this.rightLTop.setTintFill(LCARSCOLOR.gold);

        this.buttons = [];
        this.buttons.push(new Button(this, { x: this.left + 34, y: this.top + 44 + (this.buttons.length * 18) }, "sprLcarsBtnLong64", "EDIT", true, () => {
            this.buttons[1].active = false;
            this.editing = true;
            this.name.colors.out = LCARSCOLOR.offBlue;
            this.name.colorInState(this.name.states.out);
            this.locationTxt.setText("unknown");
        }));
        this.buttons.push(new Button(this, { x: this.left + 34, y: this.top + 44 + (this.buttons.length * 18) }, "sprLcarsBtnLong64", "LOAD", true, () => {
            this.buttons[0].active = false;
            this.editing = false;
            this.name.colors.out = LCARSCOLOR.offOrange;
            this.saveGame = JSON.parse(localStorage.getItem(SAVEGAMENAME));
            this.name.setText(this.saveGame.name);
            this.name.colorInState(this.name.states.out);
            this.locationTxt.setText(this.saveGame.lastLocationId);
        }));

        this.leftLLower = this.add.sprite(this.left + 34, this.top + 52 + (this.buttons.length * 18), "sprLcarsL64thin");
        this.leftLLower.setScale(-1, -1);
        this.leftLLower.setTintFill(LCARSCOLOR.gold);
        this.leftPillar = this.add.sprite(this.left + 50, this.bottom - 34, "sprLcarsPillar32");
        this.leftPillar.setTintFill(LCARSCOLOR.gold);

        this.leftPillarMid = this.add.graphics(0, 0);
        this.leftPillarMid.fillStyle(LCARSCOLOR.gold);
        let h = this.leftPillar.y - this.leftLLower.y;
        this.leftPillarMid.fillRect(this.leftLLower.x, this.leftLLower.y, 32, h);

        this.locationTxt = this.add.bitmapText(this.left + 16, (this.leftPillar.y + this.leftLLower.y) * 0.5, "pixelmix", "Login", 8, 1).setOrigin(0.5);
        this.locationTxt.angle = -90;

        this.pipIdLeft = this.add.sprite(-168, -116, "sprLcarsPipLeft16");
        this.pipIdLeft.setTintFill(LCARSCOLOR.offOrange);
        this.idTxt = this.add.bitmapText(-152, -116, "pixelmix", "id", 8, 1).setOrigin(0, 0.5);
        this.pipIdRight = this.add.sprite(this.idTxt.x + this.idTxt.getTextBounds().local.width + 24, -116, "sprLcarsBtnRight32");
        this.pipIdRight.setTintFill(LCARSCOLOR.offOrange);

        this.name = new ListButton(this, {x: -168, y: -80}, this.saveGame.name, false, () => {
            //genereate random name
            this.saveGame.name = this.getRandomName();
            this.name.setText(this.saveGame.name);
        });

        this.locationPip = this.add.sprite(-168, -62, "sprLcarsPipLeft16");
        this.locationPip.setTintFill(LCARSCOLOR.offOrange);
        this.locationTxt = this.add.bitmapText(-152, -62, "pixelmix", this.saveGame.lastLocationId, 8, 1).setOrigin(0, 0.5);

        this.btnPlay = new Button(this, { x: -144, y: -26 }, "sprLcarsBtnLong64", "PLAY", false, () => {
            this.gotoMain();
        });

        //start withoout editing
        this.editing = false;
        this.name.colors.out = LCARSCOLOR.offOrange;
    }

    update(){
        this.hand.update();

        for (let b of this.buttons) {
            b.update();
        }

        if(this.editing === true){
            this.name.update();
        }
        this.btnPlay.update();
    }

    gotoMain(){
        localStorage.setItem(SAVEGAMENAME, JSON.stringify({
            name: this.name.txt.text,
            lastLocationId: this.locationTxt.text
        }));
        this.scene.start("ScnMain");
    }

    getRandomName(){

        let prefixes = [
            "",
            "Chef ",
            "Ensign ",
            "Cmd. ",
            "Lt. ",
            "Lt. Cmd. ",
            "Dr. ",
            "Son of ",
            "Daughter of ",
            "One of ",
            "Two of ",
            "Three of ",
            "Nine of ",
            "Number ",
            "Doc ",
            "Specialist ",
            "Prof. ",
            "Mr. ",
            "Mrs. ",
            "SCPO ",
            "Constable "
        ]

        let names = [
            "Hugh",
            "O`Bran",
            "Wax",
            "Repaer",
            "Everyone",
            "Rogue",
            "Licious",
            "Kerk",
            "Fernandez",
            "Nine",
            "Pup",
            "Vogue",
            "Peetaq",
            "Uhudler",
            "Two",
            "Three",
            "Spork",
            "Foon",
            "Spot",
            "Tyller",
            "Doc",
            "Bones",
            "Thrasher",
            "Pulanski",
            "Trucker",
            "Troja",
            "Wuff",
            "Le Fraud",
            "Triker",
            "Toto",
            "Dutu",
            "Soren",
            "Vor",
            "Song",
            "McLean",
            "McBash",
            "McMash",
            "Rome",
            "Nugg",
            "Dirk",
            "Fontaine",
            "Myway",
            "Tictac",
            "Wideman",
            "Tilik",
            "O´Neill",
            "Orca",
            "Parcel"
        ]
        return prefixes[Math.floor(Math.random() * prefixes.length)] + names[Math.floor(Math.random() * names.length)];
    }
}
