/**
 * Expose Public API
 *
 * Tightly coupled public hooks from and to GAME object
 *
 * GAME object calls JumpSlide.start()
 * 
 */
localStorage.coins;
console.log(localStorage.coins);

localStorage.counter = "0";
 
JumpSlide = {};


  
/**
 * Public Properties
 */

JumpSlide.SETTINGS = { // default settings
  background_color : 0x3E4044,
  ipad_dimensions : [1024, 768],
  starting_point : {
    x : 100,
    y : 200
  },
  gravity : 0.9,
  run_speed : 5,
  controls : {
    up : 500, // click area, top
    down : 524 // click area, down
  },
  jump_velocity : 15, // jump height
  character_graphic : 1, // which alien graphic to use, valid range 1-5
  coin_graphic : "/assets/media/coin.png",
  goal_graphic : "/assets/media/flag.png",
  bg_image : "/assets/media/background.png",
  sfx : {
    coin : "/assets/media/sfx/coin.m4a",
    death : "/assets/media/sfx/death.m4a",
    jump : "/assets/media/sfx/jump.m4a",
    win : "/assets/media/sfx/win.m4a",
  },
  debug : false // set to true to show bounding box
};
// convenience


JumpSlide.SETTINGS.ipad_dimensions.width = JumpSlide.SETTINGS.ipad_dimensions[0];
JumpSlide.SETTINGS.ipad_dimensions.height = JumpSlide.SETTINGS.ipad_dimensions[1];

// doesn't work great on ios
JumpSlide.sfx = {
  coin : new Howl({ urls: [JumpSlide.SETTINGS.sfx.coin], buffer:true }),
  death : new Howl({ urls: [JumpSlide.SETTINGS.sfx.death], buffer:true }),
  jump : new Howl({ urls: [JumpSlide.SETTINGS.sfx.jump], buffer:true }),
  win : new Howl({ urls: [JumpSlide.SETTINGS.sfx.win], buffer:true })
  
};
JumpSlide.stage = new PIXI.Stage(JumpSlide.SETTINGS.background_color);
JumpSlide.player = new PIXI.DisplayObjectContainer();

JumpSlide.platforms = [];
JumpSlide.coins = [];
JumpSlide.goals = [];
JumpSlide.texture_cache = {};
JumpSlide.score = 0;
JumpSlide.score_board = null;

window.addEventListener('keydown', function (e) {
  switch(e.keyCode){
    case 13: // enter
      JumpSlide.stage.tap({originalEvent : { clientX : 0, clientY : 900} });
      break;
    case 38: // up
    case 32: // space
      GAME.tap({x: 0, y: 0});
      break;
    case 40: // down
      GAME.touch_start({x: 0, y: 900});
      break;
  }
});

window.addEventListener('keyup', function (e) {
  switch(e.keyCode){
    case 40: // down
      GAME.touch_end({x: 0, y: 900});
      break;
  }
});
/**
 * Public Methods
 */
JumpSlide.addPlatform = function ( x, y, width, height ) {

  var platform = new PIXI.Graphics();
  platform.position.x = x;
  platform.position.y = y;

  platform.beginFill(0xADC0C1);

  // set the line style to have a width of 5 and set the color to #90A5A6
  platform.lineStyle(1, 0x90A5A6);

  // draw a rectangle
  platform.drawRect( 0, 0, width, height );

  platform.endFill();

  JumpSlide.stage.addChild( platform );

  JumpSlide.platforms.push(platform);
  
};

JumpSlide.addGoal = function ( x, y ) {

  var goal = this.createSprite( JumpSlide.SETTINGS.goal_graphic, x, y );

  JumpSlide.stage.addChild( goal );

  JumpSlide.goals.push(goal);
  
};

JumpSlide.createSprite = function ( path, x, y ) {
  // get cached texture if exists
  var texture = null;
  if( JumpSlide.texture_cache.hasOwnProperty(path) ){
    texture = JumpSlide.texture_cache[path];
  }else{
    texture = PIXI.Texture.fromImage( path );
    JumpSlide.texture_cache[path] = texture;
  }
  
  var sprite = new PIXI.Sprite( texture );
  // no x and y coordinates centers the registration point
  if( x !== undefined && y !== undefined ){
    sprite.anchor.x = 0;
    sprite.anchor.y = 0;
  }else{
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
  }
  

  // default to middle of screen
  sprite.position.x = x || JumpSlide.SETTINGS.ipad_dimensions.width/2;
  sprite.position.y = y || JumpSlide.SETTINGS.ipad_dimensions.height/2;

  JumpSlide.stage.addChild( sprite );
  
  return sprite;
};

JumpSlide.removeSprite = function ( sprite ) {
  
  JumpSlide.stage.removeChild( sprite );
  
};

JumpSlide.addCoin = function ( x, y ) {
  // get cached texture if exists
  var texture = null;
  if( JumpSlide.texture_cache.hasOwnProperty( JumpSlide.SETTINGS.coin_graphic ) ){
    texture = JumpSlide.texture_cache[ JumpSlide.SETTINGS.coin_graphic ];
  }else{
    texture = PIXI.Texture.fromImage(  JumpSlide.SETTINGS.coin_graphic  );
    JumpSlide.texture_cache[ JumpSlide.SETTINGS.coin_graphic ] = texture;
  }
  
  var sprite = new PIXI.Sprite( texture );
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.position.x = x;
  sprite.position.y = y;

  JumpSlide.stage.addChild( sprite );
  JumpSlide.coins.push( sprite );
  
  return sprite;
};

JumpSlide.collectCoin = function ( coin ) {
  localStorage.coins++;
  JumpSlide.score++;
  JumpSlide.score_board.setText( JumpSlide.score );
  this.removeSprite( coin );
  JumpSlide.coins.splice( JumpSlide.coins.indexOf(coin), 1 );
}

/**
 * Loops over each coin, calls cb on each coin
 *   moves the coin with the world
 * @param  {Function} cb callback function from dev
 */
JumpSlide.forEachCoin = function( cb ){
  
  JumpSlide.coins.forEach(function (coin, i) {
    
    if( JumpSlide.player.running ){
      cb( coin );
    }

  });

};

JumpSlide.forEachPlatform = function( cb ) {
  
  JumpSlide.platforms.forEach(function (platform) {
    
    if( JumpSlide.player.running ){
      if(!JumpSlide.player.check_x_collision(platform)){
        cb(platform);
      }
    }

  });

};

JumpSlide.forEachGoal = function( cb ) {
  
  JumpSlide.goals.forEach(function (goal) {
    
    if( JumpSlide.player.running ){
      cb(goal);
    }

  });

};

JumpSlide.game_lose = null;
JumpSlide.game_win = null;

/**
 * Private Engine initialization
 */

(function () {

  if( JumpSlide.SETTINGS.debug ) JumpSlide.player.debug();

  var GAME_STATES = {
    start : "start",
    playing : "playing",
    end : "end"
  };
  var GAME_STATE = GAME_STATES.start;

  // create a renderer instance
  var renderer = PIXI.autoDetectRenderer.apply(this, JumpSlide.SETTINGS.ipad_dimensions);

  // add the renderer view element to the DOM
  document.body.appendChild(renderer.view);

  JumpSlide.start = function(){
    requestAnimFrame( animate );
  }

  // character
  // 
  // create an array of assets to load
  var assetsToLoad = [ "/assets/media/alien.json"];
  
  // create a new loader
  loader = new PIXI.AssetLoader(assetsToLoad);
  
  // use callback
  loader.onComplete = function(){
    // adds JumpSlide.player.states hash
    prepareCharacterAssets();
    
    JumpSlide.player.set_state( JumpSlide.player.states.idle );

    JumpSlide.player.position.x = JumpSlide.SETTINGS.starting_point.x;
    JumpSlide.player.position.y = JumpSlide.SETTINGS.starting_point.y;

    // JumpSlide.player.anchor.y = 1;
    JumpSlide.player.vy = 0;
    JumpSlide.player.vx = 0;
    JumpSlide.player.stageX = 0;

    // move the sprite to starting point
    JumpSlide.player.new_position = JumpSlide.player.position;

    JumpSlide.player.on_platform = false;
    JumpSlide.player.is_jumping = false;
    JumpSlide.player.is_sliding = false;

    JumpSlide.stage.addChild( JumpSlide.player );
  }
  
  //begin load
  loader.load();

  // ui
  var bg = JumpSlide.createSprite( JumpSlide.SETTINGS.bg_image );
  JumpSlide.score_board = new PIXI.Text(JumpSlide.score, {font:"bold 50px Arial", fill:"#FDE48B"});
  JumpSlide.score_board.x = 105;
  JumpSlide.score_board.y = 20;
  JumpSlide.stage.addChild( JumpSlide.score_board );
  var coin_symbol = JumpSlide.createSprite( JumpSlide.SETTINGS.coin_graphic, 12, 24 );
  var score_times_symbol = JumpSlide.createSprite("/assets/media/times.png", 70, 37 );
  

  // start screen
  var startsprite = JumpSlide.createSprite("/assets/media/start.png");

  // interaction
  JumpSlide.stage.click = JumpSlide.stage.tap = function (event) {
    var touched = {};
    if( event.originalEvent.toString() == "[object TouchEvent]" ){
      touched = event.global;
    }else{
      touched.x = event.originalEvent.clientX;
      touched.y = event.originalEvent.clientY;
    }

    if( GAME_STATE == GAME_STATES.playing ){

      GAME.tap( touched );

    }else if( GAME_STATE == GAME_STATES.start ){

      JumpSlide.player.running = true;
      GAME_STATE = GAME_STATES.playing;
      JumpSlide.removeSprite( startsprite );
      JumpSlide.player.set_state( JumpSlide.player.states.run );

    }else if( GAME_STATE == GAME_STATES.end ){

      // restart game
      location.reload();

    }
  };

  JumpSlide.stage.mousedown = JumpSlide.stage.touchstart = function (event) {
    var touched = {};
    if( event.originalEvent.toString() == "[object TouchEvent]" ){
      touched = event.global;
    }else{
      touched.x = event.originalEvent.clientX;
      touched.y = event.originalEvent.clientY;
    }

    if( GAME_STATE == GAME_STATES.playing ){

      GAME.touch_start( touched );

    }
  }

  JumpSlide.stage.mouseup = JumpSlide.stage.touchend = function (event) {
    
    if( GAME_STATE == GAME_STATES.playing ){

      GAME.touch_end();
      
    }
  }

  // spritesheet loaded
  function prepareCharacterAssets () {
    // create an array to store the alien textures
    var alienTextures = {};
    
    var frames = {
      idle : "idle",
      duck : "duck",
      walk_1 : "walk_1",
      walk_2 : "walk_2",
      jump : "jump"
    }
    for (var frame in frames) 
    {
      var texture = PIXI.Texture.fromFrame("1_green" + JumpSlide.SETTINGS.character_graphic + "_" + frame + ".png");
      alienTextures[frame] = texture;
    };
    
    // create display objects to store on JumpSlide.player
    JumpSlide.player.states = {
      idle : new PIXI.Sprite( alienTextures["idle"] ),
      duck : new PIXI.Sprite( alienTextures["duck"] ),
      jump : new PIXI.Sprite( alienTextures["jump"] ),
      run  : new PIXI.MovieClip( [ alienTextures["walk_1"], alienTextures["walk_2"] ] )
    }
  }


  // game loop
  function animate() {

    requestAnimFrame( animate );

    // add gravity
    JumpSlide.player.vy += JumpSlide.SETTINGS.gravity;

    // apply vertical velocity
    JumpSlide.player.position.y += JumpSlide.player.vy;
    JumpSlide.player.position.x += JumpSlide.player.vx *= .96;

    JumpSlide.player.on_platform = JumpSlide.platforms.reduce(function (p,c,i,a) {
      return p || JumpSlide.player.check_y_collision(c);
    },false);

    JumpSlide.player.free_fall();

    /*
    Moved to public api JumpSlide.forEachPlatform
    JumpSlide.platforms.forEach(function (platform) {
      
    });
    */

    /*
    Moved to public api JumpSlide.forEachCoin
    JumpSlide.coins.forEach(function (coin, i) {
      
    });
    */

    /*
    Moved to public api JumpSlide.forEachCoin
    JumpSlide.goals.forEach(function (goal) {
      
    });
    */

    if( GAME_STATE == GAME_STATES.playing ){
      
      JumpSlide.player.stageX += JumpSlide.SETTINGS.run_speed;

      GAME.loop( JumpSlide );

    } // end GAME_SATES.playing


    // debugger
    if( JumpSlide.SETTINGS.debug ) JumpSlide.player.debugUpdate();
    
    // render the stage   
    renderer.render( JumpSlide.stage );

  }



  function show_endgame_ui () {
    var overlay = JumpSlide.createSprite("/assets/media/end_overlay.png");
    JumpSlide.score_board = new PIXI.Text(JumpSlide.score, {font:"bold 70px Arial", fill:"#3E4044"});
    JumpSlide.score_board.x = JumpSlide.SETTINGS.ipad_dimensions.width/2 - JumpSlide.score_board.width/2 ;
    JumpSlide.score_board.y = JumpSlide.SETTINGS.ipad_dimensions.height/2;
    JumpSlide.stage.addChild( JumpSlide.score_board );

  }

  JumpSlide.game_win = function() {
    JumpSlide.player.running = false;
    JumpSlide.player.set_state( JumpSlide.player.states.idle );
    GAME_STATE = GAME_STATES.end;

    show_endgame_ui();
    
    GAME.win( JumpSlide );

    JumpSlide.sfx.win.play();
  }

  JumpSlide.game_lose = function() {
    JumpSlide.player.running = false;
    GAME_STATE = GAME_STATES.end;

    show_endgame_ui();

    GAME.lose( JumpSlide );

    JumpSlide.sfx.death.play();

    // alert('You Lose! Total Score: '+ localStorage.coins);
    
  }

})();

/**
 * Initialize the GAME implementation
 */

GAME.init(JumpSlide);
/**
 * PIXI Sprite extensions
 */

PIXI.DisplayObjectContainer.prototype.check_y_collision = function (displayObject) {
  var myBox = this.getLocalBounds();
  myBox.x += this.position.x;
  myBox.y += this.position.y;
  var otherBox = displayObject.getLocalBounds();
  otherBox.x = displayObject.position.x;
  otherBox.y = displayObject.position.y;

  if( !(otherBox.x < (myBox.x + myBox.width) && (otherBox.x + otherBox.width ) > myBox.x) ){
    return false
  }

  var colliding = !(otherBox.y > (myBox.y + myBox.height) ||
           (otherBox.y + otherBox.height) < myBox.y);

  if( colliding ) this.collide_on_platform( displayObject );

  return colliding;
};

PIXI.DisplayObjectContainer.prototype.check_x_collision = function (displayObject) {
  var myBox = this.getLocalBounds();
  myBox.x += this.position.x;
  myBox.y += this.position.y;
  var otherBox = displayObject.getLocalBounds();
  otherBox.x = displayObject.position.x;
  otherBox.y = displayObject.position.y;
  
  if( otherBox.y+2 >= myBox.y+myBox.height){ // +2 to compensate for overshot
    return false;
  }

  var colliding = !(otherBox.x > (myBox.x + myBox.width)  || 
           (otherBox.x + otherBox.width ) < myBox.x || 
           otherBox.y > (myBox.y + myBox.height) ||
           (otherBox.y + otherBox.height) < myBox.y);

  if( colliding ) this.collide_against_platform( displayObject );

  return colliding;
};

PIXI.DisplayObjectContainer.prototype.check_collision = function (displayObject) {
  var myBox = this.getLocalBounds();
  myBox.x += this.position.x;
  myBox.y += this.position.y;
  var otherBox = displayObject.getLocalBounds();
  otherBox.x = displayObject.position.x;
  otherBox.y = displayObject.position.y;
  
  var colliding = !(otherBox.x > (myBox.x + myBox.width)  || 
           (otherBox.x + otherBox.width ) < myBox.x || 
           otherBox.y > (myBox.y + myBox.height) ||
           (otherBox.y + otherBox.height) < myBox.y);

  return colliding;
};


PIXI.DisplayObjectContainer.prototype.free_fall = function () {
  
  this.is_jumping = false;

}

PIXI.DisplayObjectContainer.prototype.collide_on_platform = function (platform) {

  if( !this.is_jumping ){
  
    this.position.y = platform.y;
    this.vy = 0;

    if( this.hasOwnProperty("states") && 
      this.current_state != this.states.run && 
      !this.is_sliding &&
      this.running ){
      this.set_state( this.states.run );
    }

  }
}

PIXI.DisplayObjectContainer.prototype.collide_against_platform = function (platform) {

  this.running = false;
  this.vx = -3;

  if( this.hasOwnProperty("states") ){
    this.set_state( this.states.idle );
  }

  JumpSlide.game_lose();

}

PIXI.DisplayObjectContainer.prototype.jump = function () {
  if(this.on_platform){
    this.vy = -JumpSlide.SETTINGS.jump_velocity;
    this.is_jumping = true;
    this.set_state( this.states.jump );
    JumpSlide.sfx.jump.play();
  }
}

PIXI.DisplayObjectContainer.prototype.slide = function () {
  if(this.on_platform){
    this.is_sliding = true;
    this.set_state( this.states.duck );
  }
}

PIXI.DisplayObjectContainer.prototype.stop_sliding = function () {
  this.is_sliding = false;
  this.set_state( this.states.run );
}

PIXI.DisplayObjectContainer.prototype.set_state = function ( new_state ) {
  if(this.current_state !== undefined){
    this.removeChild( this.current_state );
  }
  this.current_state = new_state;

  // move the sprite's anchor point to feet
  this.current_state.anchor.x = 0.5;
  this.current_state.anchor.y = 1.0;
  
  this.addChild( this.current_state );

  if( this.current_state.__proto__.hasOwnProperty("play") ){
    this.current_state.play();
    this.current_state.animationSpeed = 0.1;
  }
}

PIXI.DisplayObjectContainer.prototype.debug = function ( ) {
  var boundingBox = new PIXI.Graphics();

  boundingBox.lineStyle(2, 0xFF0000);

  boundingBox.drawRect( 0, 0, this.getLocalBounds().width, this.getLocalBounds().height );

  boundingBox.position.x = this.position.x + this.getLocalBounds().x;
  boundingBox.position.y = this.position.y + this.getLocalBounds().y;

  JumpSlide.stage.addChild( boundingBox );
  this.debugGraphic = boundingBox;
}

PIXI.DisplayObjectContainer.prototype.debugUpdate = function ( ) {
  JumpSlide.stage.removeChild( this.debugGraphic );
  this.debug();
}