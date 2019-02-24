# Destructible Terrain With Phaser

A work in progress.

Current progress - example screenshot:

The below example show 4 destructible objects.
* Terrain blocks are rendered with hollow green frames.
* Destroyed blocks are rendered with hollow red frames.
* The bottom right object is constructed by using other destructible objects. Rendering by textures.
* A double circle pointer, showing a point-collision status with all objects.

![Example](/assets/spec/2019-02-23.12-42-48.png "Example")

## Instructions
1. run npm install
2. run devserver.bat

## Features
* Support draw/erase with circles, triangles, rectangles, lines
* Destructible objects base class, allow extends, support draw/erase with another destructible object.
* Support collision check with static or moving points, lines.
* Examples

## Environment
* Phaser 3, Typescript, Lodash, Webpack

## Task List

4. Destructible object collision check with another moving destructible object? Returns 2 points where the destructible object first reached each other.

6. Desctructable Object save/load (serialization)

## Pending Task List (implement on high demand only)
* Moving destructible objet colision with a static line