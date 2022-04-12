import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Svg, Circle, FontProps, Rect } from 'react-native-svg';
import GradientPath from 'react-native-svg-path-gradient';
import { Step } from './step';

const SEGMENT_SIZE = 0.995;
const DELIMITER_OFFSET = 5;
const REVERSE_ROTATION = -90;

interface IProps {
  strokeWidth?: number;
  emptyColor: string;
  fillColor: string;
  testID: string;
  initialRotation: number;
  fillProgress: number;
  steps?: {
    segmentSize?: number;
    segments: {
      percent: number;
      label: string;
      labelColor?: string;
      segmentColor?: string;
    }[];
  };
  center: React.ReactNode;
  size: number;
  labelStyle: FontProps;
}
export const Gauge: React.FC<IProps> = (props) => {
  const {
    strokeWidth = 50,
    emptyColor,
    fillColor,
    fillProgress,
    testID,
    initialRotation = REVERSE_ROTATION,
    center,
    size,
    steps,
    labelStyle,
  } = props;

  const SIZE_VIEWPORT = size + 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const calculatedAngle = (percent: number) => {
    return (360 * percent) / 100;
  };

  const cx = SIZE_VIEWPORT / 2;

  const cy = SIZE_VIEWPORT / 2;

  const segmentsUnderValueExists = React.useMemo(() => {
    console.warn({ steps });
    if (steps) {
      return (
        steps &&
        steps.segments.reduce(
          (acc, seg) => acc && seg.percent < fillProgress,
          true
        )
      );
    }
    return false;
  }, [steps, fillProgress]);

  console.warn(segmentsUnderValueExists);
  return (
    <View
      testID={testID}
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <Svg
        width={SIZE_VIEWPORT}
        height={SIZE_VIEWPORT}
        rotation={initialRotation}
        style={{ transform: [{ rotate: `${initialRotation}deg` }] }}
        testID={`${testID}-svg`}
      >
        <Circle
          stroke={emptyColor}
          fill="none"
          cx={cx}
          cy={cy}
          r={radius}
          {...{ strokeWidth }}
        />
        {!segmentsUnderValueExists && (
          <>
            {fillProgress > 0 && (
              <Rect
                x={SIZE_VIEWPORT / 2 - DELIMITER_OFFSET}
                y={SIZE_VIEWPORT / 2 + radius - strokeWidth / 2}
                rx={5}
                origin={[SIZE_VIEWPORT / 2, SIZE_VIEWPORT / 2]}
                width={10}
                height={strokeWidth}
                rotation={REVERSE_ROTATION}
                fill={fillColor}
              />
            )}
            <Circle
              stroke={fillColor}
              cx={cx}
              cy={cy}
              r={radius}
              strokeDasharray={`${circumference} ${circumference}`}
              {...{ strokeWidth }}
            />
            {fillProgress > 0 && (
              <Rect
                x={SIZE_VIEWPORT / 2}
                y={SIZE_VIEWPORT / 2 + radius - strokeWidth / 2}
                rx={4}
                origin={[SIZE_VIEWPORT / 2, SIZE_VIEWPORT / 2]}
                width={10}
                height={strokeWidth}
                rotation={initialRotation + calculatedAngle(fillProgress)}
                fill={fillColor}
              />
            )}
          </>
        )}
        {segmentsUnderValueExists && (
          <>
            <GradientPath
              d={`M ${cx + 100} ${cy} a ${radius} ${radius} 0 1 0 ${
                radius * -2
              } 0 a ${radius} ${radius} 0 1 0 ${radius * 2} 0`}
              colors={[emptyColor, fillColor, fillColor]}
              precision={1}
              {...{ strokeWidth }}
            />
            <Rect
              x={SIZE_VIEWPORT / 2 - DELIMITER_OFFSET}
              y={SIZE_VIEWPORT / 2 + radius - strokeWidth / 2}
              rx={5}
              origin={[SIZE_VIEWPORT / 2, SIZE_VIEWPORT / 2]}
              width={10}
              height={strokeWidth}
              rotation={REVERSE_ROTATION}
              fill={fillColor}
            />
          </>
        )}
        {steps &&
          steps?.segments?.length > 0 &&
          steps.segments.map((step, index) => {
            return (
              <Step
                {...step}
                {...{
                  SIZE_VIEWPORT,
                  labelStyle,
                  fillProgress,
                  segmentSize: SEGMENT_SIZE,
                  index,
                  radius,
                  strokeWidth,
                }}
              />
            );
          })}
      </Svg>
      {center && (
        <View
          style={[
            styles.container,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          {center}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', zIndex: 99 },
});
