import React, { useEffect } from 'react';
import { View, Text, Platform, ScrollView } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';

const help = () => {
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
                    <Text className='leading-5 text-dark dark:text-light'>
                        AphasiaChatter is an app specifically designed by NUHs to help individuals with aphasia practice conversations, improve word retrieval, and strengthen their communication skills.
                        The app provides an interactive chatbot and therapy tools for practicing speaking, listening, and comprehension exercises.
                    </Text>
                    <ExternalLink className='mt-2 text-blue-600 dark:text-blue-500' href="https://docs.expo.dev/router/introduction">
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
                    <ExternalLink className='mt-2 text-blue-600 dark:text-blue-500' href="https://reactnative.dev/docs/images">
                        <Text>Learn more</Text>
                    </ExternalLink>
                </Collapsible>
                <Collapsible title="Does AphasiaChatter offer Text-to-Speech functionality?">
                    <Text className='leading-5 text-dark dark:text-light'>
                        Yes, AphasiaChatter includes a Text-to-Speech feature that reads out words and phrases, helping users with pronunciation and listening skills.
                        This feature can also aid those who have difficulty producing speech but want to practice understanding.
                    </Text>
                    <ExternalLink className=' mt-2 text-blue-600 dark:text-blue-500' href="https://docs.expo.dev/versions/latest/sdk/font">
                        <Text>Learn more</Text>
                    </ExternalLink>
                </Collapsible>
                <Collapsible title="Is AphasiaChatter free to use?">
                    <Text className='leading-5 text-dark dark:text-light'>
                        AphasiaChatter offers a free version with basic speech therapy exercises.
                        However, there is a premium version that unlocks additional features such as personalized therapy plans, more advanced conversation modules, and progress tracking tools.
                    </Text>
                    <ExternalLink className=' mt-2 text-blue-600 dark:text-blue-500' href="https://docs.expo.dev/develop/user-interface/color-themes/">
                        <Text>Learn more</Text>
                    </ExternalLink>
                </Collapsible>
                <Collapsible title="Can family members or caregivers use AphasiaChatter to support therapy?">
                    <Text className='leading-5 text-dark dark:text-light'>
                        Yes, AphasiaChatter includes features for family members and caregivers to participate in therapy sessions.
                        They can track the user’s progress, suggest practice tasks, and even engage in guided conversations to support the individual's communication improvement.
                    </Text>
                </Collapsible>
            </View>
        </ScrollView>
    </View>
  );
}

export default help