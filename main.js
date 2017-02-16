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
    this.height = 0;
    flowers.push(this);
}
Flower.prototype.adjust = function(y) {
    var height_wanted = this.y - y;
    if (height_wanted > 0)
        this.height = height_wanted;
}
Flower.prototype.bloom = function() {
}
Flower.prototype.render = function(ctx) {
    var w = this.height / 80;
    renderShape(ctx, "green", [
        [this.x + w, this.y],
        [this.x - w, this.y],
        [this.x,     this.y - this.height],
    ]);
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
    currentFlower.adjust(e.clientY);
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
