namespace SpriteKind {
    export const Cursor = SpriteKind.create()
    export const Gem = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (attacked == false) {
        music.zapped.play()
        info.changeLifeBy(-1)
        info.changeScoreBy(3)
        otherSprite.destroy()
        mySprite.setImage(assets.image`PlayerHurt`)
        attacked = true
        info.startCountdown(6)
    }
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Projectile, function (sprite, otherSprite) {
    sprite.destroy()
    sprites.destroy(otherSprite)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    info.changeScoreBy(1)
})
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    music.jumpUp.play()
    if (Math.percentChance(50)) {
        game.setDialogCursor(assets.image`Player`)
    } else {
        game.setDialogCursor(assets.image`Monster`)
    }
    game.splash("PAUSED", "Day " + day)
    music.jumpDown.play()
})
controller.player2.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function () {
    if (info.score() > 0) {
        info.changeScoreBy(-1)
        music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet`, mySprite, 100, 0)
    }
})
info.onLifeZero(function () {
    game.setDialogCursor(assets.image`PlayerHurt`)
    game.splash("GAME OVER", "Continue for Results")
    game.splash("Day of Death", "Day " + day)
    game.splash("Wood Collected", info.score())
    game.splash("Tents Used", tentsUsed)
    game.reset()
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (tiles.tileAtLocationEquals(location, assets.tile`Tent`)) {
        if (Math.percentChance(50)) {
            game.showLongText("You went in and got some good rest! (1 Life)", DialogLayout.Center)
            info.changeLifeBy(1)
        } else {
            game.showLongText("You were ambushed by a monster! (-1 Life)", DialogLayout.Center)
            info.changeLifeBy(-1)
        }
        tentsUsed += 1
        tiles.setTileAt(location, assets.tile`Grass`)
        tiles.setWallAt(location, false)
    }
})
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    if (!(tiles.tileAtLocationEquals(location, assets.tile`Wood0`))) {
        if (cooldown > 0) {
            cooldown += -1
        } else {
            tiles.setTileAt(location, assets.tile`Grass`)
            tiles.setWallAt(location, false)
            cooldown = 100
        }
    }
})
info.onCountdownEnd(function () {
    attacked = false
    mySprite.setImage(assets.image`Player`)
})
controller.player2.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function () {
    if (info.score() > 0) {
        info.changeScoreBy(-1)
        music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet`, mySprite, -100, 0)
    }
})
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    sprites.destroy(sprite)
    if (tiles.tileAtLocationEquals(location, assets.tile`Tree`)) {
        info.changeScoreBy(randint(3, 5))
        tiles.setTileAt(location, assets.tile`Grass`)
        tiles.setWallAt(location, false)
    }
})
controller.player2.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    if (info.score() > 0) {
        info.changeScoreBy(-1)
        music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet`, mySprite, 0, -100)
    }
})
controller.player2.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    if (info.score() > 0) {
        info.changeScoreBy(-1)
        music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
        projectile = sprites.createProjectileFromSprite(assets.image`Bullet`, mySprite, 0, 100)
    }
})
function start () {
    if (game.ask("A = Play", "B = How To Play")) {
        mySprite = sprites.create(assets.image`Player`, SpriteKind.Player)
        item = sprites.create(assets.image`Blaster`, SpriteKind.Cursor)
        soulGem = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . c c . . . . . . . 
            . . . . . . c b b c . . . . . . 
            . . . . . c b b 1 b c . . . . . 
            . . . . c b b b 1 1 b c . . . . 
            . . . c b b b d d 1 1 b c . . . 
            . . . c b d d b b d d b c . . . 
            . . f b b d b d d b 1 1 b c . . 
            . . f b d b d d d d b d b c . . 
            . . f b d b d d d d b d b c . . 
            . . f b b d b d d b d b b c . . 
            . . . f b d d b b d d b c . . . 
            . . . f b b b d d b b b c . . . 
            . . . . f f b b b b f f . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Gem)
        controller.moveSprite(mySprite)
        item.follow(mySprite, 100)
        tiles.setCurrentTilemap(tilemap`Arena`)
        tiles.placeOnTile(item, tiles.getTileLocation(24, 38))
        tiles.placeOnTile(mySprite, tiles.getTileLocation(24, 38))
        tiles.placeOnTile(soulGem, tiles.getTileLocation(randint(1, 46), randint(1, 46)))
        scene.cameraFollowSprite(mySprite)
        cooldown = 0
        attacked = false
        day = 0
        tentsUsed = 0
        info.setLife(3)
        info.setScore(5)
    } else {
        game.showLongText("Move with WASD, arrow keys or controller joystick. To shoot with your blaster, press I, J, K, or L to shoot in any direction. (Keyboard is required to shoot.)", DialogLayout.Full)
        game.showLongText("Monsters can be defeated with blaster, and use wood blocks to defend yourself but be careful, they can break blocks!", DialogLayout.Full)
        game.showLongText("You also need to shoot trees to collect wood to power your blaster. Try to also find Soul Gems so you can earn an extra life or extra wood.", DialogLayout.Full)
        start()
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Gem, function (sprite, otherSprite) {
    if (Math.percentChance(25)) {
        info.changeLifeBy(1)
    } else {
        info.changeScoreBy(5)
    }
    music.beamUp.play()
    tiles.placeOnTile(soulGem, tiles.getTileLocation(randint(1, 30), randint(1, 30)))
})
let monster: Sprite = null
let soulGem: Sprite = null
let item: Sprite = null
let cooldown = 0
let tentsUsed = 0
let projectile: Sprite = null
let day = 0
let mySprite: Sprite = null
let attacked = false
music.setVolume(200)
if (Math.percentChance(50)) {
    game.setDialogCursor(assets.image`Player`)
} else {
    game.setDialogCursor(assets.image`Monster`)
}
game.setDialogFrame(img`
    . f f f f f f f f f f f f f . 
    f f e e e e e e e e e e e f f 
    f e f 4 4 4 4 4 4 4 4 4 f e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e f 4 4 4 4 4 4 4 4 4 f e f 
    f f e e e e e e e e e e e f f 
    . f f f f f f f f f f f f f . 
    `)
game.splash("Defense!", "Egeomplo")
start()
game.onUpdateInterval(20000, function () {
    day += 1
    for (let value of tiles.getTilesByType(assets.tile`Enemy Spawn`)) {
        monster = sprites.create(assets.image`Monster`, SpriteKind.Enemy)
        tiles.placeOnTile(monster, value)
        monster.follow(mySprite, 20)
    }
    music.powerDown.play()
})
