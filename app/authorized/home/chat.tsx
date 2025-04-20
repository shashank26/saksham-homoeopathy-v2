import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { View, Text, Input, Button, XStack, YStack } from 'tamagui';

const messagesMock = [
  { id: '1', text: 'Hey there!', sender: 'them' },
  { id: '2', text: 'Hello! How are you?', sender: 'me' },
  { id: '3', text: 'I’m good! Working on the project.', sender: 'them' },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(messagesMock);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: newMessage, sender: 'me' }]);
    setNewMessage('');
  };

  const renderMessage = ({ item }: any) => (
    <XStack justifyContent={item.sender === 'me' ? 'flex-end' : 'flex-start'} marginBottom="$3">
      <View
        backgroundColor={item.sender === 'me' ? '$blue10' : '$gray6'}
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderRadius="$5"
        maxWidth="75%"
      >
        <Text color={item.sender === 'me' ? 'white' : 'black'} fontSize={18}>{item.text}</Text>
      </View>
    </XStack>
  );

  return (
    <YStack flex={1} padding="$3" background="$background">
      {/* Header */}
      <View paddingVertical="$3" borderBottomWidth={1} borderColor="$gray5" alignItems="center">
        <Text fontSize={24} fontWeight="600">Chat</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingVertical: 10 }}
        style={{ flex: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <XStack padding="$2" alignItems="center" space="$2" background="$background">
          <Input
            size="$4"
            flex={1}
            fontSize={24}
            borderRadius="$6"
            placeholder="Type a message"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <Button size="$4" fontSize={24} borderRadius="$6" onPress={sendMessage}>
            Send
          </Button>
        </XStack>
      </KeyboardAvoidingView>
    </YStack>
  );
}