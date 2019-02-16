# Destructible Terrain With Phaser

A work in progress.

Current progress - example screenshot:

The below example show 4 destructable objects.
Terrain blocks are rendered with hollow green frames.
Destroyed blocks are rendered with hollow red frames.
![Example](/assets/spec/2019-02-16.21-16-17.png "Example")

## Instructions
1. run npm install
2. run devserver.bat

## Features
* Support draw/erase with circles, triangles, rectangles, lines
* Destructable objects class
* Examples

## Environment
* Phaser 3, Typescript, Lodash, Webpack

## Task List
1. Draw/erase with another Destr Object

2. Destructible object collision check with a point. Returns whether the point is inside the object.
3. Destructible object collision check with a line or a moving point. Returns the point where the first contact happened.
4. Destructible object collision check with another moving destructible object? Returns 2 points where the destructible object first reached each other.

5. Update example with drawing using pretty textures. Using phaser.graphics only for debugging.

6. Desctructable Object save/load (serialization)

## Pending Task List (implement on high demand only)
* Moving estructible objet colision with a static line