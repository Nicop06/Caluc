import React, { Component } from 'react';
import { Image, Dimensions, PanResponder, View } from 'react-native';
import {
  Body,
  Loop,
  Stage,
  World,
} from 'react-game-kit/native';

import Matter from 'matter-js';

export default class Game extends Component {

  handleUpdate = () => {
    this.setState({
      ballPosition: this.body.body.position,
    });
  }

  physicsInit = (engine) => {

    const dimensions = Dimensions.get('window');

    const ground = Matter.Bodies.rectangle(
      dimensions.width / 2, dimensions.height - 50,
      dimensions.width, 75,
      {
        isStatic: true,
      },
    );

    const ceiling = Matter.Bodies.rectangle(
      dimensions.width / 2, -75,
      dimensions.width, 1,
      {
        isStatic: true,
      },
    );

    const leftWall = Matter.Bodies.rectangle(
      20, dimensions.height / 2,
      1, dimensions.height,
      {
        isStatic: true,
      },
    );

    const rightWall = Matter.Bodies.rectangle(
      dimensions.width, dimensions.height / 2,
       1, dimensions.height - 5,
      {
        isStatic: true,
      },
    );

    Matter.World.add(engine.world, [ground, leftWall, rightWall, ceiling]);
  }

  constructor(props) {
    super(props);

    this.state = {
      gravity: 10,
      ballPosition: {
        x: 0,
        y: 0,
      },
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        Matter.Body.setVelocity(this.body.body, {x: 0, y: -40});
        //this.setState({
          //gravity: 0,
        //});

        //Matter.Body.setAngularVelocity(this.body.body, 0);
        //Matter.Body.setVelocity(this.body.body, {x: 0, y: 0});

        //this.startPosition = {
          //x: this.body.body.position.x,
          //y: this.body.body.position.y,
        //}
      },
      onPanResponderMove: (evt, gestureState) => {
        //Matter.Body.setPosition(this.body.body, {
          //x: this.startPosition.x + gestureState.dx,
          //y: this.startPosition.y + gestureState.dy,
        //});
      },
      onPanResponderRelease: (evt, gestureState) => {
        Matter.Body.setVelocity(this.body.body, {x: 0, y: 0});
        //Matter.Body.applyForce(this.body.body, {
          //x: this.body.body.position.x,
          //y: this.body.body.position.y,
        //}, {
          //x: 0,
          //y: 30,
        //});
      },
    });
  }

  getBallStyles() {
    return {
      height: 75,
      width: 75,
      position: 'absolute',
      transform: [
        { translateX: this.state.ballPosition.x },
        { translateY: this.state.ballPosition.y },
      ],
    };
  }

  render() {
    const dimensions = Dimensions.get('window');
    return (
      <Loop>
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          style={{ backgroundColor: '#3a9bdc' }}
        >
          <World
            onInit={this.physicsInit}
            onUpdate={this.handleUpdate}
            gravity={{ x: 0, y: this.state.gravity, scale: 0.001 }}
          >
            <Body
              shape="rectangle"
              args={[30, dimensions.height - 125, 75, 75]}
              density={1}
              friction={0}
              frictionStatic={0}
              restitution={0}
              ref={(b) => { this.body = b; }}
            >
              <View
                style={this.getBallStyles()} {...this._panResponder.panHandlers}
              >
                <Image
                  source={require('./assets/Caluc.png')}
                  height={75}
                  width = {75}
                />
              </View>
            </Body>
          </World>
        </Stage>
      </Loop>
    );
  }
}
