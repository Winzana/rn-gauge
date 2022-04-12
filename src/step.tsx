import * as React from 'react';
import { Circle, G, Text } from 'react-native-svg';

interface StepProps {
  percent: number;
  label: string;
  labelColor?: string;
  segmentColor?: string;
  segmentSize: number;
  labelStyle: any;
  index: number;
  SIZE_VIEWPORT: number;
  radius: number;
  fillProgress: number;
  strokeWidth: number;
}

const TEXT_MARGIN = 40;
const OPTIONAL_MARGIN = 10;
const ORIGINAL_ROTATION = 90;

const calculatedAngle = (percent: number) => {
  return (360 * percent) / 100;
};

export const Step: React.FC<StepProps> = ({
  percent,
  labelColor,
  segmentColor,
  label,
  segmentSize,
  SIZE_VIEWPORT,
  labelStyle,
  index,
  radius,
  fillProgress,
  strokeWidth,
}) => {
  const circumference = radius * 2 * Math.PI;
  return (
    <React.Fragment key={index}>
      <Circle
        stroke={segmentColor || '#000'}
        fill="none"
        cx={SIZE_VIEWPORT / 2}
        cy={SIZE_VIEWPORT / 2}
        r={radius}
        strokeDashoffset={
          segmentSize
            ? circumference * segmentSize
            : circumference * segmentSize
        }
        rotation={calculatedAngle(percent)}
        origin={[SIZE_VIEWPORT / 2, SIZE_VIEWPORT / 2]}
        strokeDasharray={`${circumference} ${circumference}`}
        {...{ strokeWidth }}
      />
      <G
        rotation={calculatedAngle(percent)}
        origin={[SIZE_VIEWPORT / 2, SIZE_VIEWPORT / 2]}
      >
        <Text
          stroke={labelColor || '#000'}
          fill={labelColor || '#000'}
          x={
            percent > 35 && percent > 70
              ? SIZE_VIEWPORT - TEXT_MARGIN - OPTIONAL_MARGIN
              : SIZE_VIEWPORT - TEXT_MARGIN
          }
          y={SIZE_VIEWPORT / 2}
          rotation={ORIGINAL_ROTATION - calculatedAngle(percent)}
          origin={[SIZE_VIEWPORT - TEXT_MARGIN, SIZE_VIEWPORT / 2]}
          textAnchor={percent > 50 ? 'end' : 'middle'}
          dx={percent > 10 && percent < 50 ? fillProgress / 100 + 15 : 0}
          {...labelStyle}
          dy={percent > 10 && percent < 50 ? fillProgress / 100 + 5 : 0}
        >
          {label}
        </Text>
      </G>
    </React.Fragment>
  );
};
