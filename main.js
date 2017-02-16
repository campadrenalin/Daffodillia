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
    ctx.stroke();
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
Flower.prototype.innerPetalPoints = function(cap, radiusFactor) {
    var points = [];
    var quality = Math.round(this.height / 2);
    for (var i = 0; i<=quality; i++) {
        var radius = this.height/150 * radiusFactor * (
            10 +
            Math.sin(i/quality*Math.PI*30) +
            Math.sin(i/quality*Math.PI*20 + this.height)
        );
        points.push([
            cap[0] + Math.sin(i/quality*2*Math.PI)*radius,
            cap[1] + Math.cos(i/quality*2*Math.PI)*radius,
        ]);
    }
    return points;
}
Flower.prototype.outerPetalPoints = function(cap, radiusFactor) {
    var points = [];
    var quality = Math.round(this.height / 2);
    for (var petal = 0; petal < 5; petal++) {
        var offset = 2*Math.PI/5 * petal + this.height;
        for (var i = 0; i < quality; i++) {
            var radius = this.height/5 * Math.sin(i/quality*Math.PI) * radiusFactor;
            points.push([
                cap[0] + Math.sin(i/quality*2*Math.PI/3.5 + offset)*radius,
                cap[1] + Math.cos(i/quality*2*Math.PI/3.5 + offset)*radius,
            ]);
        }
    }
    return points;
}
Flower.prototype.render = function(ctx) {
    var budtime = 20;
    var cap = [this.x + this.bend, this.y - this.height];
    renderShape(ctx, "green", this.stemPoints());
    if (this.bloomed && (this.anim > budtime)) {
        // flower
        var radiusFactor = Math.log10(this.anim-budtime)/3;
        renderShape(ctx, "yellow", this.outerPetalPoints(cap, radiusFactor));
        renderShape(ctx, "red",    this.innerPetalPoints(cap, radiusFactor));
    } else {
        // bud
        var factor = (budtime-this.anim)/budtime;
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(cap[0], cap[1], (this.height/10)*factor*factor, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    if (this.bloomed) this.anim++;
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
