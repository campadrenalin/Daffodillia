var flowers = [];
var currentFlower = null;

function renderShape(ctx, color, points) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
        var x = points[i][0], y = points[i][1];
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.fill();
    ctx.closePath();
}

function Flower(x, y) {
    this.x = x;
    this.y = y;
    this.bend = 0;
    this.height = 0;
    this.anim = 0;
    this.bloomed = false;
    flowers.push(this);
}
Flower.prototype.adjust = function(x, y) {
    this.bend = x - this.x;

    var height_wanted = this.y - y;
    if (height_wanted > 0)
        this.height = height_wanted;
}
Flower.prototype.bloom = function() {
    this.bloomed = true;
}
Flower.prototype.stemPoints = function() {
    var w = this.height / 80;
    var lpoints = [], rpoints = [];
    var quality = Math.round(this.height / 5);
    for (var i = 0; i<=quality; i++) {
        var factor = i/quality;
        var y = this.y - this.height*factor;
        var bend = this.bend * factor * factor;
        lpoints.push([this.x - w*(1-factor) + bend, y]);
        rpoints.push([this.x + w*(1-factor) + bend, y]);
    }
    return lpoints.concat(rpoints.reverse());
}
Flower.prototype.render = function(ctx) {
    var stemPoints = [];
    renderShape(ctx, "green", this.stemPoints());
    if (bloomed) {
        // flower
    } else {
        // bud
    }
}

var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();
    currentFlower = new Flower(e.clientX, e.clientY);
});
canvas.addEventListener('mousemove', function(e) {
    e.preventDefault();
    if (!currentFlower) return;
    currentFlower.adjust(e.clientX, e.clientY);
});
canvas.addEventListener('mouseup', function(e) {
    e.preventDefault();
    currentFlower.bloom();
    currentFlower = null;
});


function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    renderScene();
}
function renderScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < flowers.length; i++) {
        flowers[i].render(ctx);
    }
    window.requestAnimationFrame(renderScene);
}

window.addEventListener('resize', resize, false); resize();
