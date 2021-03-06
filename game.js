
let img; 

var bullets = [];
var disks = [];

let health = 1; 
let bullethits = 0; 
let bulletmisses = 0;
let level = 1;
let bullet_len = 0;

let gameOver = false; 

function preload() {
    soundFormats('mp3', 'ogg');
    bg_song = loadSound('sound/Dude');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    img = loadImage('img/game.png'); // Load the image

    //generates 3 random factorial disks with values between 0 and 5 
    d1 = new factorials(0, 255, 255, 300, 2, 100, 100, Math.floor((Math.random() * 6)), 0);
    d2 = new factorials(0, 255, 255, 500, 2, 100, 100, Math.floor((Math.random() * 6)), 0);
    d3 = new factorials(0, 255, 255, 700, 2, 100, 100, Math.floor((Math.random() * 6)), 0);

    bullet_len += math.factorial(d1.numVal);
    bullet_len += math.factorial(d2.numVal);
    bullet_len += math.factorial(d3.numVal);

    disks.push(d1);
    disks.push(d2);
    disks.push(d3);

    testdef = new defender(0, 255, 255, 200, windowHeight, 0);
    img.resize(windowWidth, windowHeight); // resizing image to game window
    
    //bg_song.play();
}

// generate new factorial sub-disks
function generatesubdisks(num,x_coord, y_coord) {
    // if the number inputed is less than 2, go through each iteration and create a disk
    if (num <= 2) {
        for (var i = 0; i < math.factorial(num); i++ ) {
            // subdisk speed is based on the level and also interation in while loop
            sub = new factorials(0, 128, 0, x_coord, y_coord + (Math.random() * 30), 20, 20, 1, (Math.random() * 5) + 6);
            disks.push(sub);
        }
    }

    // if the number inputed is greater than 2, go through each iteration and create 2 disks with the max iteration being
    // the factorial outcome divided by 2 
    else  {
        for (var i = 0; i < math.factorial(num) / 2; i++) {
            // subdisk speed is randomized for numbers between 1 and 5 (the plus 6 ensures the disk speed is at least 6)
            sub = new factorials(0, 128, 0, x_coord, y_coord + (Math.random() * 30),20,20,1,(Math.random() * 5) + 6);
            sub2 = new factorials(0, 128, 0, x_coord, y_coord + (Math.random() * 30),20,20,1, (Math.random() * 5) + 6);
            disks.push(sub);
            disks.push(sub2);
        }
    }

}

//generates regular disks
function generatefactdisks(num) {
    for (var i = 1; i < num + 1; i++) {
        reg = new factorials(0, 255, 255, i * (100 + Math.random() * 40),2,100,100, Math.floor((Math.random() * 6)),i * .04);

        // the value of how many bullets are availible depends on the value of the factorial disks
        bullet_len += math.factorial(reg.numVal);

        disks.push(reg);
    }
}

// controls in the game
function keyPressed() {

    if (keyCode === 39) {
        testdef.xChange=10;
    }  

    if (keyCode === 37) {
        testdef.xChange = -10;
    }  

    if (keyCode === 32) {
        //laser created when spacebar is pressed and stored in a array 
        if (bullet_len>0) {
            bullet = new laser(0, 225, 225, testdef.x + 100, windowHeight - 70);
            bullets.push(bullet);
            bullet_len--;
        }
    }

    return false; // prevent any default behaviour on browser 

}

// key released function for when a specific key is released
function keyReleased() {

    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
        testdef.xChange = 0;
    }

    return false; // prevent any default behaviour on browser 

}

function draw() { 
    image(img, 0,0);

    text("health: " +  health, 70, 60);
    text("level: " +  level, 70, 90);
    text("bullets left: " + bullet_len, 120, 120);

    // draws all the disks on the screen
    for (var i = 0; i < disks.length; i++) {
        test = disks[i];
        test.drawShape();
        test.calcCoords();
        test.displayNum();
        if (test.y > windowHeight) {
            health -= test.numVal; 
            disks.splice(i, 1);
        }
    }

    // draws defender 
    testdef.drawShape();

    //draws and calculates coordinates of every bullet 
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].calcCoords();
        bullets[i].drawShape();
    }

    //loops through every regular disk in the array 
    for (var i = 0; i < disks.length; i++) {
        test = disks[i];
        // loops through the bullets fired and their location 
        for (var f = 0; f < bullets.length; f++) { 
            bullet = bullets[f];

            if (abs(bullet.x - test.x) <= 100 * 1/2  && abs(bullet.y - test.y) <= 100 * 1/2) {
                // gets rid of hit disks
                disks.splice(i, 1);

                // gets rid of hit bullets
                bullets.splice(f, 1);
                bullethits++;
                health += test.numVal;

                // the shapeLength of a subdisk is 20, if the disk is length 20, it is a regular disk
                if (test.shapeLength > 20) {
                    generatesubdisks(test.numVal, test.x, test.y);
                }
            }
            else if (bullet.y < 0){
                bullets.splice(f, 1); 
                bulletmisses++;
            }
        }
    }

    if (disks.length == 0 && gameOver == false) {
        // sets bullet length to 0 so it does not hit any of the new generated disks
        bullets.length = 0;
        
        // generates factorials disks based on what the current level is 
        // plus 2 is to account for the initial disks in the game
        generatefactdisks(level + 2);

        // increases level 
        level += 1;
    }

    if (health < 0) {
        gameOver = true; 
    }

    if (gameOver == true) {
        // clears array as the game is over
        disks.length = 0;

        text("thanks for playing", windowWidth/2, windowHeight/2);
    }


}

class factorials {

    constructor(r,g,b,x,y, shapeWidth, shapeLength, numVal, xSpeed) {
        this.r = r;
        this.g = g; 
        this.b = b; 
        this.x = x;
        this.y = y; 
        this.shapeWidth = shapeWidth;
        this.shapeLength = shapeLength;
        this.numVal = numVal;
        this.xSpeed = xSpeed;
    }

    calcCoords() {
        this.y += 0.3;
        this.x += this.xSpeed;

        if (this.x < 0) {
            this.xSpeed = this.xSpeed * -1;
        }

        if (this.x > windowWidth) {
            this.xSpeed = this.xSpeed * -1;
        }
    }

    drawShape() {
        // fills color 
        fill(this.r, this.g, this.b);
        // draws shape with x,y coords and shape width and height
        ellipse(this.x, this.y, this.shapeWidth, this.shapeLength); 

    }

    displayNum() {
        fill(255, 255, 255);
        textSize(30);
        textFont('Impact');
        textAlign(CENTER);

        for (var i = 0; i < disks.length; i++) {
            test = disks[i];
            if (test.shapeLength > 20)  {
                text(test.numVal +  "!", test.x, test.y);
            }
        }

    }

}

class defender {

    constructor(r, g, b, x, y, xChange) {
        this.r = r;
        this.g = g; 
        this.b = b; 
        this.x = x;
        this.y = y; 
        this.xChange = xChange;
    }

    drawShape() {
        // fills color 
        fill(this.r, this.g, this.b);
        // draws shape with x,y coords 
        triangle(this.x, this.y + 7, (this.x + 200 + this.x) / 2, this.y - 100, this.x + 200, this.y + 7);

        this.x += this.xChange;
        if (this.x > windowWidth-200) {
            this.xChange = 0;
        }
        if (this.x < 0) {
            this.xChange = 0;
        }
    }

}

class laser {

    constructor(r, g, b, x, y) {
        this.r = r;
        this.g = g; 
        this.b = b; 
        this.x = x;
        this.y = y; 
    }

    calcCoords() {
        // speed of bullet 
        this.y -= 10;
    }

    drawShape() {
        fill(this.r, this.g, this.b);
        ellipse(this.x, this.y, 10, 10); 
    }

}






