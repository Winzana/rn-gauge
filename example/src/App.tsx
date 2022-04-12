import * as React from 'react';
import debounce from 'lodash.debounce';
import { StyleSheet, View, Text } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { Gauge } from '../../src/index';

export default function App() {
  const [value, setValue] = React.useState(0);

  const debouncedEventHandler = React.useMemo(
    () => debounce((value) => setValue(value), 300),
    []
  );

  console.warn({ value });
  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        <Slider
          value={value}
          onValueChange={(v) => debouncedEventHandler(v[0])}
        />
      </View>
      <Gauge
        emptyColor="red"
        fillColor="blue"
        testID="gauge"
        strokeWidth={50}
        fillProgress={value * 100}
        steps={{
          segments: [
            { label: 'half', percent: 50 },
            { label: 'quart', percent: 25 },
            { label: 'start', percent: 0 },
          ],
        }}
        center={<Text style={{ color: 'red' }}>Hello</Text>}
        size={250}
        initialRotation={180}
        labelStyle={{}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
