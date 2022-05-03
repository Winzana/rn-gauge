import { generateEllipsePath } from '../utils';
import { Animated } from 'react-native';
import { transformOriginWorklet } from '../transform.origin';

let cx = 50;
let cy = 50;

describe('Gauge', () => {
  it('should generate ellipse arc path', () => {
    let circleSize = 100;
    let thickness = 0.65;
    let startAngle = 145;
    let sweepAngle = 250;

    const result = generateEllipsePath(
      [cx, cy],
      [circleSize - thickness / 2, circleSize - thickness / 2],
      [startAngle, sweepAngle],
      0
    );
    expect(result).toEqual(' M  -32   107  A  100 100 0 1 1 132 107');
  });
  it('should return transformed origin', () => {
    const width = 5;
    const height = 40;
    const sweepAngle = 250;
    const animatedValue = new Animated.Value(0.5);

    const result = transformOriginWorklet(
      { x: cx + width / 2, y: cy },
      { x: cx + width / 2, y: cy - height / 2 },
      [
        {
          rotateZ: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [`-${sweepAngle / 2}deg`, `${sweepAngle / 2}deg`],
          }),
        },
      ]
    );

    expect(result).toEqual([
      { translateX: 0 },
      { translateY: 20 },
      {
        rotateZ: {
          _children: [],
          _config: {
            inputRange: [0, 1],
            outputRange: ['-125deg', '125deg'],
          },
          _interpolation: expect.anything(),
          _listeners: {},
          _parent: {
            _animation: null,
            _children: [],
            _listeners: {},
            _offset: 0,
            _startingValue: 0.5,
            _value: 0.5,
          },
        },
      },
      { translateX: -0 },
      { translateY: -20 },
    ]);
  });
});
