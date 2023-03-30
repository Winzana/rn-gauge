import * as React from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { degrees_to_radians, generateEllipsePath } from './utils';
import {
  Canvas,
  Path as SkiaPath,
  SweepGradient,
  vec,
  useValue,
  runSpring,
  Shadow,
  AnimatedProps,
  ShadowProps,
} from '@shopify/react-native-skia';
import type { SpringConfig } from '@shopify/react-native-skia/lib/typescript/src/values/animation/types';
import { transformOriginWorklet } from './transform.origin';

type GetAxisValue = (offset: number, radius?: number) => number;

type GetNeedleStyle = (
  width: number,
  height: number,
  pivotOriginalPointY?: number,
  pivotAnchorOffsetY?: number,
  positionYOffset?: number,
  positionXOffset?: number
) => {
  position: string;
  left: number;
  top: number;
  width: number;
  height: number;
  backgroundColor: string;
  transform: any[];
};

export interface IProps {
  /**
   * The external stroke width of the gauge
   */
  strokeColor?: string;

  /**
   * The external stroke width of the gauge
   */
  strokeWidth?: number;
  /**
   * Gauge thickness
   */
  thickness?: number;
  /**
   * Colors filling the gauge progress
   */
  colors: string[];
  /**
   * Steps as string array to display steps on the gauge
   */
  steps?: number[];
  /**
   * Color to display the empty part of the gauge
   */
  emptyColor: string;
  /**
   * Render step function
   */
  renderStep?: (props: {
    // Returns the x position of the step, by default offset can be 0
    getX: GetAxisValue;
    // Returns the y position of the step, by default offset can be 0
    getY: GetAxisValue;
    // Returns the step value
    step: number;
    // Return the step index
    index: number;
    // Return gauge radius, can be useful to do some calculations
    radius: number;
    // Return the angle of the step in degrees
    angle: number;
  }) => JSX.Element;
  /**
   * The progress value of the gauge.
   */
  fillProgress: number;
  /**
   * Gauge's sweep angle, default is 250 ( how wide is the gauge )
   */
  sweepAngle: number;
  /**
   * Render prop for needle component, default is null
   */
  renderNeedle?: (params: {
    getNeedleStyle: GetNeedleStyle;
  }) => React.ReactNode;
  /**
   * Method to render the label center of the gauge
   */
  renderLabel: () => React.ReactNode;
  /**
   * Size given to the component
   */
  size: number;
  /**
   * Custom Canvas style
   */
  canvasStyle?: StyleProp<ViewStyle>;
  /**
   * Shadow props if wanted, provide shadow effect
   */
  shadowProps?: AnimatedProps<ShadowProps>;
  /**
   * Spring config for fill progress animation
   */
  springConfig?: SpringConfig;
  /**
   * Needle base offset
   */
  showGaugeCenter?: boolean;
}

const ANGLE_OFFSET = 90;

export const Gauge: React.FC<IProps> = ({
  canvasStyle,
  shadowProps,
  colors,
  thickness = 50,
  sweepAngle,
  emptyColor,
  fillProgress,
  steps,
  renderStep,
  strokeWidth,
  renderNeedle,
  renderLabel,
  size,
  springConfig,
  strokeColor,
  showGaugeCenter,
}) => {
  const animatedGaugeFillValue = useValue(0);

  const animatedArrowValue = React.useRef(new Animated.Value(0));

  const startAngle = -ANGLE_OFFSET - sweepAngle / 2;

  React.useEffect(() => {
    Animated.timing(animatedArrowValue.current, {
      toValue: parseInt(`${fillProgress}`, 10) / 100,
      duration: 250,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
    runSpring(
      animatedGaugeFillValue,
      { to: fillProgress / 100 },
      springConfig ? springConfig : ({} as any)
    );
  }, [fillProgress, animatedGaugeFillValue, springConfig]);

  // Circle center x
  const cx = size / 2;

  // Circle center y
  const cy = size / 2;

  // Circle size without stroke
  const circleSize = size / 2 - (strokeWidth || 2);

  const getNeedleStyle = (
    width: number,
    height: number,
    pivotOriginalPointY = 0,
    pivotAnchorOffsetY = 0,
    positionYOffset = 0,
    positionXOffset = 0
  ) => ({
    position: 'absolute',
    left: cx - width / 2 - positionXOffset,
    top: cy - height - positionYOffset,
    width,
    height,
    backgroundColor: 'transparent',
    transform: transformOriginWorklet(
      { x: cx, y: cy - pivotAnchorOffsetY },
      { x: cx, y: cy - (height - pivotOriginalPointY) / 2 },
      [
        {
          rotateZ: animatedArrowValue.current.interpolate({
            inputRange: [0, 1],
            outputRange: [`-${sweepAngle / 2}deg`, `${sweepAngle / 2}deg`],
          }),
        },
      ]
    ),
  });

  return (
    <View style={styles.centered}>
      <Canvas
        // eslint-disable-next-line react-native/no-inline-styles
        style={[
          {
            width: size,
            height: size,
          },
          canvasStyle,
        ]}
      >
        <SkiaPath
          style="stroke"
          color={strokeColor ? strokeColor : 'cyan'}
          path={generateEllipsePath(
            [cx, cy],
            [circleSize - thickness / 2, circleSize - thickness / 2],
            [startAngle, sweepAngle],
            0
          )}
          {...{ strokeWidth: thickness + (strokeWidth || 0) }}
        />
        <SkiaPath
          style="stroke"
          color={emptyColor}
          path={generateEllipsePath(
            [cx, cy],
            [circleSize - thickness / 2, circleSize - thickness / 2],
            [startAngle, sweepAngle],
            0
          )}
          start={0.001}
          end={1}
          {...{ strokeWidth: thickness }}
        >
          {shadowProps && <Shadow {...shadowProps} />}
        </SkiaPath>
        <SkiaPath
          style="stroke"
          path={generateEllipsePath(
            [cx, cy],
            [circleSize - thickness / 2, circleSize - thickness / 2],
            [startAngle, sweepAngle],
            0
          )}
          end={animatedGaugeFillValue}
          {...{ strokeWidth: thickness }}
        >
          {shadowProps && <Shadow {...shadowProps} />}
          <SweepGradient
            start={60}
            end={300}
            c={vec((size + 100) / 2, (size + 100) / 2)}
            transform={[
              { rotate: Math.PI / 2 },
              { translateX: 0 },
              { translateY: -(size + 50) },
            ]}
            colors={colors}
          />
        </SkiaPath>
      </Canvas>
      {steps &&
        renderStep &&
        steps.map((step, index) =>
          renderStep({
            step,
            index,
            radius: circleSize / 2,
            getX: (offset: number, radius = circleSize / 2) =>
              cx +
              offset +
              radius *
                Math.sin(
                  degrees_to_radians(
                    startAngle + ANGLE_OFFSET + (sweepAngle * step) / 100
                  )
                ),
            getY: (offset: number, radius = circleSize / 2) =>
              cy -
              offset +
              radius *
                -Math.cos(
                  degrees_to_radians(
                    startAngle + ANGLE_OFFSET + (sweepAngle * step) / 100
                  )
                ),
            angle: startAngle + ANGLE_OFFSET + (sweepAngle * step) / 100,
          })
        )}
      {renderNeedle && renderNeedle({ getNeedleStyle })}
      {renderLabel && (
        <View style={[styles.container, styles.centered]}>{renderLabel()}</View>
      )}
      {showGaugeCenter && (
        <View style={[{ top: cy - 25, left: cx }, styles.verticalAxis]} />
      )}
      {showGaugeCenter && (
        <View
          style={[
            {
              top: cy,
              left: cx - 25,
            },
            styles.horizontalAxis,
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalAxis: {
    height: 1,
    width: 50,
    position: 'absolute',
    backgroundColor: 'red',
  },
  verticalAxis: {
    height: 50,
    width: 1,
    position: 'absolute',
    backgroundColor: 'red',
  },
  container: { position: 'absolute', zIndex: 99 },
});
