# Destructible Terrain With Phaser

A work in progress.

Current progress - example screenshot:

The below example show 4 destructable objects.
Terrain blocks are rendered with hollow green frames.
Destroyed blocks are rendered with hollow red frames.
![Example](/assets/spec/2019-02-22.21-34-26.png "Example")

## Instructions
1. run npm install
2. run devserver.bat

## Features
* Support draw/erase with circles, triangles, rectangles, lines
* Destructible objects base class, allow extends, support draw/erase with another destructible object.
* Examples

## Environment
* Phaser 3, Typescript, Lodash, Webpack

## Task List

2. Destructible object collision check with a point. Returns whether the point is inside the object.
3. Destructible object collision check with a line or a moving point. Returns the point where the first contact happened.

4. Destructible object collision check with another moving destructible object? Returns 2 points where the destructible object first reached each other.

6. Desctructable Object save/load (serialization)

## Pending Task List (implement on high demand only)
* Moving destructible objet colision with a static line