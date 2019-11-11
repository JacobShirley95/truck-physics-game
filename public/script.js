var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update
    }
};

//Truck assets: https://www.gamedeveloperstudio.com/graphics/viewgraphic.php?item=1h5i465d8p3q4v6n41



var game = new Phaser.Game(config);

function preload ()
{
    //this.load.setBaseURL('http://localhost');

    this.load.image('trucks', 'assets/truck/truck_1/truck_1_body_lights_on_yellow.png');
    this.load.image('wheel', 'assets/truck/truck_1/truck_1_wheel.png');
    this.load.image('crate', 'assets/crates/crate_01.png');
    this.load.json('shapes', 'assets/truck/truck.json');
}

var aKey;
var dKey;

var chassis;
var backWheel;
var Body;

function create ()
{
    var shapes = this.cache.json.get('shapes');

    Body = Phaser.Physics.Matter.Matter.Body;
    var Bodies = Phaser.Physics.Matter.Matter.Bodies;
    var Composite = Phaser.Physics.Matter.Matter.Composite;

    this.matter.world.setBounds(0, 0, game.config.width, game.config.height);


    this.objs = [];

    this.objs.push(this.matter.add.image(200, 200, 'trucks', null, {shape: shapes.truck, density: shapes.truck.density }));
    this.objs.push(this.matter.add.image(200 + 150, 95, 'wheel', null, {shape: shapes.wheel, ...shapes.wheel }));
    this.objs.push(this.matter.add.image(200 - 155, 95, 'wheel', null, {shape: shapes.wheel, ...shapes.wheel}));
    this.objs.push(this.matter.add.image(100, 0, 'crate', null, {shape: shapes.crate }));

    chassis = this.objs[0];
    backWheel = this.objs[2];
    let crate = this.objs[3];

    var cat1 = this.matter.world.nextCategory();

    //this.objs[0].setCollisionCategory(cat1);
    this.objs[0].setDensity(shapes.truck.density);

    //this.objs[1].setCollisionCategory(cat1);
    this.objs[1].setDensity(shapes.wheel.density);
    this.objs[1].setFriction(shapes.wheel.friction);
    //Body.set(this.objs[1].body, "frictionStatic", 1);

    //this.objs[2].setCollisionCategory(cat1);
    this.objs[2].setDensity(shapes.wheel.density);
    this.objs[2].setFriction(shapes.wheel.friction);
    //Body.set(this.objs[2].body, "frictionStatic", 1);

    let ground = this.matter.add.rectangle(game.config.width / 2, game.config.height, game.config.width, 100, { restitution: 1, isStatic: true, friction: 0.8, frictionStatic: 0.2 });

    //Body.set(ground, "friction", 1);
    //Body.set(ground, "frictionStatic", 1);
    console.log(ground.frictionStatic);

    var cat2 = this.matter.world.nextCategory();
    //ground.collisionFilter.category = cat2;

    //this.objs[0].setCollidesWith([ cat2 ]);
    //this.objs[1].setCollidesWith([ cat2 ]);
    //this.objs[2].setCollidesWith([ cat2 ]);



    var composite = Composite.create();

    //Composite.addBody(composite, this.objs[0].body);
    //Composite.addBody(composite, this.objs[1].body);
    //Composite.addBody(composite, this.objs[2].body);

    const spring = 0.5;

    this.matter.add.constraint(this.objs[0].body, this.objs[1].body, 5, spring, { pointA: { x: 115, y: 85 } });
    this.matter.add.constraint(this.objs[0].body, this.objs[2].body, 5, spring, { pointA: { x: -155, y: 85 } });

    //this.matter.world.add(composite);

    for (var obj of this.objs) {
        obj.setScale(0.3, 0.3);
    }
    
    aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    //this.add.image(50, 50, 'trucks');
}

function update() {
    if (dKey.isDown) {
        Body.setAngularVelocity( backWheel.body, Math.PI/6);
        //chassis.applyForceFrom(chassis.body.position, new Phaser.Math.Vector2(50, 90));
    }
    if (aKey.isDown) {
        Body.setAngularVelocity( backWheel.body, -Math.PI/6);
        //chassis.applyForceFrom(chassis.body.position, new Phaser.Math.Vector2(50, 90));
    }
}
