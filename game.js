
let img; 

var bullets = [];
var disks = [];
var factdisks = [];

let health = 1; 
let bullethits=0; 

function preload() {
    soundFormats('mp3', 'ogg');
    bg_song = loadSound('sound/Dude');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    img = loadImage('img/game.png'); // Load the image

    test = new factorials(0,255,255,300,2,100,100,3,0);
    test2 = new factorials(0,255,255,500,2,100,100,4,0);
    test3 = new factorials(0,255,255,700,2,100,100,5,0);
    disks.push(test);
    disks.push(test2);
    disks.push(test3);

    testdef = new defender(0,255,255,200,windowHeight,0);
    img.resize(windowWidth, windowHeight); // resizing image to game window
    
    //bg_song.play();
}

function generatefactdisks(num,x_coord, y_coord) {
    for (var i = 0; i < math.factorial(num); i++ ) {
        test = new factorials(0,128,0,x_coord, y_coord,20,20,1,0.04*i+1);
        factdisks.push(test);
    }
}

// controls in the game

function keyPressed() {

    if (keyCode === 39) {
        testdef.xChange=5;
    }  

    if (keyCode === 37) {
        testdef.xChange=-5;
    }  

    if (keyCode === 32) {
        //laser created when spacebar is pressed and stored in a array 
        bullet = new laser(0,225, 225,testdef.x+100, windowHeight+30);
        bullets.push(bullet);
    }

    return false; // prevent any default behaviour on browser 

}

// key released function for when the 

function keyReleased() {
    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
        testdef.xChange=0;
    }
    return false; // prevent any default behaviour on browser 

}

function draw() { 

    image(img, 0,0);

    text("health: " +  health, 70, 60);

    for (var i = 0; i < disks.length; i++) {
        test = disks[i];
        test.drawShape();
        test.calcCoords();
        test.displayNum();
    }


    for (var i = 0; i < factdisks.length; i++) {
        test = factdisks[i];
        test.drawShape();
        test.calcCoords();
        test.displayNum();
    }

    testdef.drawShape();

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
                bullets.splice(f,1);
                bullethits++;
                health+=3;

                generatefactdisks(test.numVal, test.x, test.y);
                console.log(factdisks.length);
            }
        }
    }
    
    //loops through every regular disk in the array 
    for (var i = 0; i < factdisks.length; i++) {
        test = factdisks[i];
        // loops through the bullets fired and their location 
        for (var f = 0; f < bullets.length; f++) { 
            bullet = bullets[f];
            if (abs(bullet.x - test.x) <= test.shapeWidth * 1/2 && abs(bullet.y - test.y) <= test.shapeLength * 1/2) {
                factdisks.splice(i, 1);
                health+=3;
            }
        }
    }
    


}




class factorials {

    constructor(r,g,b,x,y, shapeWidth, shapeLength, numVal, xSpeed) {
        this.r = r;
        this.g = g; 
        this.b = b; 
        this.x = x;
        this.y = y; 
        this.shapeWidth=shapeWidth;
        this.shapeLength=shapeLength;
        this.numVal=numVal;
        this.xSpeed=xSpeed;
    }

    calcCoords() {
        this.y += 0.8;
        this.x +=this.xSpeed;
        if (this.x<0) {
            this.xSpeed= this.xSpeed*-1;
        }
        if (this.x>windowWidth) {
            this.xSpeed= this.xSpeed*-1;
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
            text(test.numVal +  "!", test.x, test.y);
        }

    }

}

class defender {

    constructor(r,g,b, x,y, xChange) {
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
        triangle(this.x, this.y+7, (this.x+200+this.x)/2, this.y-100, this.x+200, this.y+7);
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

    constructor(r,g,b, x,y) {
        this.r = r;
        this.g = g; 
        this.b = b; 
        this.x = x;
        this.y = y; 
    }

    calcCoords() {
        this.y -= 10;
        if (this.y < -1) {
            this.y=-30;
        }
    }

    drawShape() {
        fill(this.r, this.g, this.b);
        ellipse(this.x, this.y, 10, 10); 
    }

}






