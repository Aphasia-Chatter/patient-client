import React, { useEffect } from 'react';
import { View, Text, Platform, ScrollView } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';

const faq = () => {
  return (
    <View className='flex-1 bg-light dark:bg-dark'>
        <View className='rounded-full m-5 mb-10 justify-start'>
            <Text className='text-xl mb-2 font-bold text-black dark:text-white'>We're here to help you with anything and everything on AphasiaChatter!</Text>
        </View>
        <View className='rounded-full ml-5 mb-2 justify-start'>
            <Text className='text-base font-bold text-black dark:text-white'>FAQs</Text>
        </View>
        <ScrollView
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            className={`${Platform.OS === 'ios' ? 'mb-12' : 'mb-4'}`}>
            <View>
                <Collapsible title="What is AphasiaChatter?">
                    <Text className='text-justify text-dark dark:text-light'>
                        This app has two screens:{' '}
                        <Text className='text-justify text-dark dark:text-light'>app/(tabs)/index.tsx</Text> and{' '}
                        <Text className='text-justify text-dark dark:text-light'>app/(tabs)/explore.tsx</Text>
                    </Text>
                    <Text className='text-justify text-dark dark:text-light'>
                        The layout file in <Text>app/(tabs)/_layout.tsx</Text>{' '}
                        sets up the tab navigator.
                    </Text>
                    <ExternalLink className='text-justify' href="https://docs.expo.dev/router/introduction">
                        <Text className=' text-blue-600 dark:text-blue-500'>Learn more</Text>
                    </ExternalLink>
                </Collapsible>
                <Collapsible title="How does AphasiaChatter help with speech therapy?">
                    <Text className='text-justify text-dark dark:text-light'>
                    You can open this project on Android, iOS, and the web. To open the web version, press{' '}
                    <Text>w</Text> in the terminal running this project.
                    </Text>
                </Collapsible>
                <Collapsible title="Is AphasiaChatter suitable for all types of aphasia?">
                    <Text className='text-justify text-dark dark:text-light'>
                    For static images, you can use the <Text>@2x</Text> and{' '}
                    <Text className='text-justify text-dark dark:text-light'>@3x</Text> suffixes to provide files for
                    different screen densities
                    </Text>
                    <ExternalLink className='text-justify text-blue-600 dark:text-blue-500' href="https://reactnative.dev/docs/images">
                        <Text>Learn more</Text>
                    </ExternalLink>
                </Collapsible>
                <Collapsible title="Does AphasiaChatter offer Text-to-Speech functionality?">
                    <Text className='text-justify text-dark dark:text-light'>
                    Open <Text>app/_layout.tsx</Text> to see how to load{' '}
                    <Text className='text-justify text-dark dark:text-light'>
                        custom fonts such as this one.
                    </Text>
                    </Text>
                    <ExternalLink className='text-justify' href="https://docs.expo.dev/versions/latest/sdk/font">
                        <Text className='text-justify text-blue-600 dark:text-blue-500'>Learn more</Text>
                    </ExternalLink>
                </Collapsible>
                <Collapsible title="Is AphasiaChatter free to use?">
                    <Text className='text-justify text-dark dark:text-light'>
                    This template has light and dark mode support. The{' '}
                    <Text className='text-justify text-dark dark:text-light'>useColorScheme()</Text> hook lets you inspect
                    what the user's current color scheme is, and so you can adjust UI colors accordingly.
                    </Text>
                    <ExternalLink className='text-justify' href="https://docs.expo.dev/develop/user-interface/color-themes/">
                        <Text className='text-justify text-blue-600 dark:text-blue-500'>Learn more</Text>
                    </ExternalLink>
                </Collapsible>
                <Collapsible title="Can family members or caregivers use AphasiaChatter to support therapy?">
                    <Text className='text-justify text-dark dark:text-light'>
                    This template includes an example of an animated component. The{' '}
                    <Text className='text-justify text-dark dark:text-light'>components/HelloWave.tsx</Text> component uses
                    the powerful <Text className='text-justify text-dark dark:text-light'>react-native-reanimated</Text> library
                    to create a waving hand animation.
                    </Text>
                    {Platform.select({
                        ios: (
                            <Text className='text-justify text-dark dark:text-light'>
                            The <Text className='text-justify text-dark dark:text-light'>components/ParallaxScrollView.tsx</Text>{' '}
                            component provides a parallax effect for the header image.
                            </Text>
                        ),
                    })}
                </Collapsible>
            </View>
        </ScrollView>
    </View>
  );
}

export default faq