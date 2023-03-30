import * as React from 'react';
import { Provider as PaperProvider, Appbar } from 'react-native-paper';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Switch,
  ScrollView,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { Gauge, IProps as GaugeProps } from '../../src/index';

// @ts-ignore
import NeedleImage from './love-arrow.png';
// @ts-ignore
import SimpleNeedleImage from './needle.png';

const Label = () => (
  <Text
    style={{
      color: 'darkgray',
      fontWeight: 'bold',
      fontSize: 30,
      top: 50,
    }}
  >
    Km/h
  </Text>
);

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function App() {
  //#region State Initialization
  const [value, setValue] = React.useState(0);
  const [thickness, setThickness] = React.useState(65);
  const [stepMarker, setStepMarker] = React.useState(18);
  const [marker, setMarker] = React.useState(50);
  const [sweepAngle, setSweepAngle] = React.useState(250);
  const [strokeWidth, setStrokewidth] = React.useState(10);
  const [size, setSize] = React.useState(300);
  const [showNeedle, setNeedleVisibility] = React.useState(true);
  const [showStep, setStepVisibility] = React.useState(true);
  //#endregion

  const Needle: GaugeProps['renderNeedle'] = ({ getNeedleStyle }) => (
    <>
      <AnimatedImage
        style={[getNeedleStyle(300 / 3, 300 / 3)]}
        source={NeedleImage}
      />
    </>
  );

  const SimpleNeedle: GaugeProps['renderNeedle'] = ({ getNeedleStyle }) => (
    <>
      <Animated.View style={[getNeedleStyle(80, 80, 14.5, 0, -7.6)]}>
        <AnimatedImage
          style={{ width: 80, height: 80 }}
          resizeMode="contain"
          source={SimpleNeedleImage}
        />
      </Animated.View>
    </>
  );

  const Step: GaugeProps['renderStep'] = ({
    step,
    angle,
    getX,
    getY,
    radius,
  }) => (
    <>
      <View
        style={[
          {
            width: step % 25 === 0 ? 4 : 1,
            marginLeft: -2,
            height: 20,
            borderRadius: 2,
            position: 'absolute',
            left: getX(0, radius + stepMarker),
            top: getY(10, radius + stepMarker),
            backgroundColor: 'lightgray',
            transform: [{ rotateZ: `${angle}deg` }],
          },
        ]}
      />
      <Text
        style={[
          {
            position: 'absolute',
            left: getX(-10, radius + marker),
            top: getY(10, radius + marker),
            color: 'rgba(0,0,0,0.6)',
            transform: [{ rotateZ: `${angle}deg` }],
          },
        ]}
      >
        {step % 10 === 0 ? `${step}` : ''}
      </Text>
    </>
  );

  return (
    <PaperProvider>
      <Appbar />
      <View style={styles.container}>
        <View style={{ backgroundColor: 'transparent', padding: 5 }}>
          <Gauge
            emptyColor="#C1C1C1"
            springConfig={{
              velocity: 1.5,
              mass: 25,
              stiffness: 800,
              damping: 180,
            }}
            shadowProps={{
              dx: 1,
              dy: 2,
              blur: 5,
              color: 'cyan',
              inner: true,
            }}
            colors={['cyan', 'magenta', 'yellow', 'red']}
            steps={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            renderStep={showStep ? Step : undefined}
            sweepAngle={sweepAngle}
            strokeWidth={strokeWidth}
            fillProgress={value * 100}
            renderNeedle={showNeedle ? Needle : undefined}
            renderLabel={Label}
            size={size}
            thickness={thickness}
          />

          <Gauge
            emptyColor="#FAFAFA"
            springConfig={{
              velocity: 1.5,
              mass: 25,
              stiffness: 800,
              damping: 180,
            }}
            colors={['#14E88A']}
            strokeColor="#14E88A"
            steps={[
              0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
              85, 90, 95, 100,
            ]}
            renderStep={showStep ? Step : undefined}
            sweepAngle={sweepAngle}
            strokeWidth={strokeWidth}
            fillProgress={value * 100}
            renderNeedle={showNeedle ? SimpleNeedle : undefined}
            renderLabel={Label}
            size={size}
            thickness={thickness}
          />
        </View>
        <ScrollView style={{ width: '100%' }}>
          <View style={{ width: '100%', paddingHorizontal: 20 }}>
            <View style={styles.item}>
              <Text>StrokeWidth ({strokeWidth.toFixed(2)})</Text>
              <Slider
                maximumValue={50}
                minimumValue={0}
                containerStyle={{ width: 230 }}
                value={strokeWidth}
                onValueChange={(v: any) => setStrokewidth(v[0])}
              />
            </View>
            <View style={styles.item}>
              <Text>Size ({size.toFixed(2)})</Text>
              <Slider
                containerStyle={{ width: 230 }}
                value={size}
                minimumValue={200}
                maximumValue={500}
                onValueChange={(v: any) => setSize(v[0])}
              />
            </View>
            <View style={styles.item}>
              <Text>Progress ({value.toFixed(2)})</Text>
              <Slider
                containerStyle={{ width: 230 }}
                value={value}
                onValueChange={(v: any) => setValue(v[0])}
              />
            </View>
            <View style={styles.item}>
              <Text style={{ marginRight: 10 }}>Toggle Needle</Text>
              <Switch
                value={showNeedle}
                onValueChange={(v) => setNeedleVisibility(v)}
              />
              <Text style={{ marginHorizontal: 10 }}>Toggle Steps</Text>
              <Switch
                value={showStep}
                onValueChange={(v) => setStepVisibility(v)}
              />
            </View>
          </View>
          <View style={{ width: '100%', paddingHorizontal: 20 }}>
            <View style={styles.item}>
              <Text>Markers Pos. ({marker.toFixed(2)})</Text>
              <Slider
                containerStyle={{ width: 230 }}
                maximumValue={100}
                value={marker}
                onValueChange={(v: any) => setMarker(v[0])}
              />
            </View>

            <View style={styles.item}>
              <Text>Marker Step ({stepMarker.toFixed(2)})</Text>
              <Slider
                value={stepMarker}
                maximumValue={100}
                containerStyle={{ width: 230 }}
                onValueChange={(v: any) => setStepMarker(v[0])}
              />
            </View>
            <View style={styles.item}>
              <Text>Thickness ({thickness.toFixed(2)})</Text>
              <Slider
                value={thickness}
                maximumValue={100}
                minimumValue={0}
                containerStyle={{ width: 230 }}
                onValueChange={(v: any) => setThickness(v[0])}
              />
            </View>
            <View style={styles.item}>
              <Text>Sweep Angle ({sweepAngle.toFixed(0)})</Text>
              <Slider
                value={sweepAngle}
                minimumValue={180}
                maximumValue={350}
                containerStyle={{ width: 230 }}
                onValueChange={(v: any) => setSweepAngle(v[0])}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
});
