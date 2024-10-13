import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Platform, ScrollView, Dimensions, Button } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { AntDesign } from '@expo/vector-icons';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';

const { height, width } = Dimensions.get('window');

const Help = () => {
    const video = useRef<Video | null>(null);
    const [status, setStatus] = useState<AVPlaybackStatus | null>(null);

    return (
    <View className='flex-1 bg-light dark:bg-dark'>
        <View className='flex-row m-5 mb-8 justify-start'>
            <Text className='text-xl mb-2 font-bold text-black dark:text-white'>We're here to help you with anything and everything on AphasiaChatter!</Text>
            <AntDesign
                name="smileo"
                size={32}
                color="#fff"
                style={{ marginTop: 8, marginLeft: 12 }}
            />        
        </View>
        <View style={Platform.OS === 'ios' ? styles.scrollViewContainerIOS : styles.scrollViewContainerAndroid}>
            <ScrollView
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}>
                {/* Section 1 - Tutorials */}
                <View className={`${Platform.OS === 'ios' ? 'mb-6' : 'mb-8'}`}>
                    <Text className='ml-5 mb-2 justify-start text-base font-bold text-black dark:text-white'>Tutorials</Text>
                    <Collapsible title="How to start a practice task?">
                        <View className='flex-1 items-center justify-center'>
                            <Text style={{alignSelf: 'stretch'}} className={`${Platform.OS === 'ios' && 'mb-2'} leading-5 text-dark dark:text-light `}>
                                Word Retrieval Practice Task
                            </Text>
                            <Video className='h-60 w-screen'
                                ref={video}
                                style={styles.video}
                                source={{uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"}}
                                useNativeControls={true}
                                isLooping={false}
                                shouldPlay={false}
                                resizeMode={ResizeMode.CONTAIN}
                                onPlaybackStatusUpdate={(newStatus) => setStatus(newStatus)}/>
                            <View style={styles.buttons}>
                                <Button title="Play from 5s" 
                                    onPress={() => {
                                        if (video.current != null) {
                                        video.current.playFromPositionAsync(5000);
                                        }
                                    }}/>
                                <Button
                                title={status?.isLoaded && status.isLooping ? "Set to not loop" : "Set to loop"}
                                onPress={() => {
                                    if (video.current != null && status?.isLoaded) {
                                    video.current.playFromPositionAsync(5000);
                                    video.current.setIsLoopingAsync(!status.isLooping);
                                    }
                                }}/>
                            </View>
                            <ExternalLink className='mt-2 text-blue-600 ' href="https://docs.expo.dev/router/introduction">
                                <Text>Learn more</Text>
                            </ExternalLink>
                        </View>
                    </Collapsible>
                </View>
                {/* Section 2 - Frequently Asked Questions */}
                <View className='mb-0'>
                    <Text className='ml-5 mb-2 justify-start text-base font-bold text-black dark:text-white'>FAQs</Text>
                    <Collapsible title="What is AphasiaChatter?">
                        <Text className='leading-5 text-dark dark:text-light'>
                            AphasiaChatter is an app specifically designed by NUHs to help individuals with aphasia practice conversations, improve word retrieval, and strengthen their communication skills.
                            The app provides an interactive chatbot and therapy tools for practicing speaking, listening, and comprehension exercises.
                        </Text>
                        <ExternalLink className='mt-2 text-blue-600 ' href="https://docs.expo.dev/router/introduction">
                            <Text>Learn more</Text>
                        </ExternalLink>
                    </Collapsible>
                    <Collapsible title="Who created AphasiaChatter?">
                        <Text className='leading-5 text-dark dark:text-light'>
                            AphasiaChatter is an app specifically designed by NUHs to help individuals with aphasia practice conversations, improve word retrieval, and strengthen their communication skills.
                            The app provides an interactive chatbot and therapy tools for practicing speaking, listening, and comprehension exercises.
                        </Text>
                        <ExternalLink className='mt-2 text-blue-600 ' href="https://docs.expo.dev/router/introduction">
                            <Text>Learn more</Text>
                        </ExternalLink>
                    </Collapsible>
                    <Collapsible title="How does AphasiaChatter help with speech therapy?">
                        <Text className='leading-5 text-dark dark:text-light'>
                            AphasiaChatter offers personalized speech therapy exercises, including guided conversation practice, vocabulary retrieval tasks, and communication strategies.
                            It uses AI to simulate real-life conversations, giving users a safe space to practice their speaking skills.
                        </Text>
                    </Collapsible>
                    <Collapsible title="Is AphasiaChatter suitable for all types of aphasia?">
                        <Text className='leading-5 text-dark dark:text-light'>
                            AphasiaChatter supports individuals with different subtypes of aphasia, including Broca’s, Wernicke’s, and anomic aphasia.
                            The exercises can be customized to match the specific challenges faced by each user, focusing on word retrieval, sentence formulation, and comprehension.
                        </Text>
                        <ExternalLink className='mt-2 text-blue-600 ' href="https://reactnative.dev/docs/images">
                            <Text>Learn more</Text>
                        </ExternalLink>
                    </Collapsible>
                    <Collapsible title="Is AphasiaChatter free to use?">
                        <Text className='leading-5 text-dark dark:text-light'>
                            AphasiaChatter offers a free version with basic speech therapy exercises.
                            However, there is a premium version that unlocks additional features such as personalized therapy plans, more advanced conversation modules, and progress tracking tools.
                        </Text>
                        <ExternalLink className=' mt-2 text-blue-600 ' href="https://docs.expo.dev/develop/user-interface/color-themes/">
                            <Text>Learn more</Text>
                        </ExternalLink>
                    </Collapsible>
                </View>
            </ScrollView>
        </View>    
    </View>
    );
}

export default Help

const styles = StyleSheet.create({
    scrollViewContainerIOS: {
        height: height * 0.65,
    },
    scrollViewContainerAndroid: {
        height: height * 0.80,
    },
    video: {
        flex: 1,
        width: width * 0.90,
        height: height * 0.3
    },
    buttons: {
        margin: 16
    }
});