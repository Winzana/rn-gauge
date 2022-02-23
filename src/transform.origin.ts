type Point = { x: number; y: number };

export const transformOriginWorklet = (
  anchorPoint: Point,
  originalCenterPoint: Point,
  transforms: any[]
) => {
  'worklet';
  const result = [
    { translateX: anchorPoint.x - originalCenterPoint.x },
    { translateY: anchorPoint.y - originalCenterPoint.y },
    ...transforms,
    { translateX: -(anchorPoint.x - originalCenterPoint.x) },
    { translateY: -(anchorPoint.y - originalCenterPoint.y) },
  ];
  return result;
};
