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
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    
    const handlePress = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

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
                    {/* Tutorial - How do I start a practice task? */}
                    <Collapsible
                        title="How do I start a practice task?"
                        isOpen={activeIndex === 0}
                        onPress={() => handlePress(0)}>
                        <View className='flex-1 items-center justify-center'>
                            <Video className='h-60 w-screen bg-black'
                                ref={video}
                                style={styles.videoPortrait}
                                source={{uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"}}
                                useNativeControls={true}
                                isLooping={false}
                                shouldPlay={false}
                                resizeMode={ResizeMode.CONTAIN}
                                onPlaybackStatusUpdate={(newStatus) => setStatus(newStatus)}
                                testID='start-practice-task-video-player'
                            />
                        </View>
                    </Collapsible>
                    {/* Tutorial - How do I update my password? */}
                    <Collapsible
                        title="How do I update my account password?"
                        isOpen={activeIndex === 1}
                        onPress={() => handlePress(1)}>
                        <View className='flex-1 items-center justify-center bg-black'>
                            <Video className='h-60 w-screen'
                                ref={video}
                                style={styles.videoPortrait}
                                source={require("../../assets/videos/How do I update my account password - portrait.mp4")}
                                useNativeControls={true}
                                isLooping={false}
                                shouldPlay={false}
                                resizeMode={ResizeMode.CONTAIN}
                                onPlaybackStatusUpdate={(newStatus) => setStatus(newStatus)}
                                testID='update-account-password-video-player'
                            />
                        </View>
                    </Collapsible>
                    {/* Tutorial - How do I delete my account? */}
                    <Collapsible
                        title="How do I delete my account?"
                        isOpen={activeIndex === 2}
                        onPress={() => handlePress(2)}>
                        <View className='flex-1 items-center justify-center bg-black'>
                            <Video className='h-60 w-screen'
                                ref={video}
                                style={styles.videoPortrait}
                                source={require("../../assets/videos/How do I update my account password - portrait.mp4")}
                                useNativeControls={true}
                                isLooping={false}
                                shouldPlay={false}
                                resizeMode={ResizeMode.CONTAIN}
                                onPlaybackStatusUpdate={(newStatus) => setStatus(newStatus)}
                                testID='delete-account-video-player'
                            />
                        </View>
                    </Collapsible>
                </View>
                {/* Section 2 - Frequently Asked Questions */}
                <View className='mb-0'>
                    <Text className='ml-5 mb-2 justify-start text-base font-bold text-black dark:text-white'>FAQs</Text>
                    {/* FAQ - What is AphasiaChatter? */}
                    <Collapsible
                        title="What is AphasiaChatter?"
                        isOpen={activeIndex === 3}
                        onPress={() => handlePress(3)}>
                        <Text className='leading-5 text-dark dark:text-light text-justify'>
                            AphasiaChatter is a mobile application specifically designed to help individuals with aphasia practice conversations, improve word retrieval, and strengthen their communication skills.
                            The app provides an interactive chatbot and therapy tools for practicing speaking, listening, and comprehension exercises.
                        </Text>
                    </Collapsible>
                    {/* FAQ - Who created AphasiaChatter? */}
                    <Collapsible
                        title="Who created AphasiaChatter?"
                        isOpen={activeIndex === 4}
                        onPress={() => handlePress(4)}>
                        <Text className='leading-5 text-dark dark:text-light text-justify'>
                            AphasiaChatter was developed by a team of year three software engineering students from Singapore Institute of Technology, in collaboration with National University Hospital Singapore (NUHs),
                            focused on improving accessibility and communication tools for individuals with aphasia.
                        </Text>
                    </Collapsible>
                    {/* FAQ - How does AphasiaChatter help with speech therapy? */}
                    <Collapsible
                        title="How does AphasiaChatter help with speech therapy?"
                        isOpen={activeIndex === 5}
                        onPress={() => handlePress(5)}>
                        <Text className='leading-5 text-dark dark:text-light text-justify'>
                            AphasiaChatter offers personalized speech therapy exercises, including guided conversation practice, vocabulary retrieval tasks, and communication strategies.
                            This initiative aimed to create a supportive platform that leverages technology, including automatic speech recognition and feedback mechanism powered by Artificial Intelligence (AI), that adapts to the unique needs of each user.
                            {'\n\n'}
                            By using AI to analyze and respond to individual speech patterns, AphasiaChatter provides dynamic, real-time assistance that encourages consistent practice and improvement.
                            The app's technology supports users in building confidence and independence in communication, making speech therapy accessible and engaging for those working through the challenges of aphasia.
                        </Text>
                    </Collapsible>
                    {/* FAQ - Is AphasiaChatter suitable for all types of aphasia? */}
                    <Collapsible
                        title="Is AphasiaChatter suitable for all types of aphasia?"
                        isOpen={activeIndex === 6}
                        onPress={() => handlePress(6)}>
                        <Text className='leading-5 text-dark dark:text-light text-justify'>
                            AphasiaChatter supports individuals with different subtypes of aphasia, including Broca's, Wernicke's, and anomic aphasia.
                            Currently, your doctor(s) can prepare word retrieval exercises— a form of speech therapy for you to practice.
                            These exercises are designed to help you strengthen word retrieval abilities and sentence formation.
                            Do approach your doctors on this!
                        </Text>
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
    videoPortrait: {
        flex: 1,
        width: width * 0.90,
        height: height * 0.55
    },
    buttons: {
        margin: 16
    }
});