import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const SYSTEM_PROMPT = `You are GoGym AI Coach, a personal fitness coach for Malaysians. 
Give concise, practical, motivating workout plans. Keep responses under 200 words. 
Use simple language. Reference Malaysian context when relevant. 
Format workout plans clearly with days and exercises.`;

export default function AiCoachScreen() {
  const [messages, setMessages] = useState([
    { id: '0', role: 'assistant', text: "Hi! I'm your GoGym AI Coach 💪 Tell me your fitness goal and I'll build you a personalised plan. Example: \"I want to lose weight in 4 weeks\"" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const historyRef = useRef([]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    historyRef.current = [...historyRef.current, { role: 'user', content: text }];
    setLoading(true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: historyRef.current,
        }),
      });
      const data = await res.json();
      const reply = data.content[0].text;
      historyRef.current = [...historyRef.current, { role: 'assistant', content: reply }];
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: 'Sorry, connection issue. Please try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Coach</Text>
        <Text style={styles.sub}>Powered by Claude AI</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          style={styles.chat}
          onContentSizeChange={() => listRef.current?.scrollToEnd()}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={[styles.bubbleText, item.role === 'user' && styles.userText]}>{item.text}</Text>
            </View>
          )}
          ListFooterComponent={loading ? (
            <View style={[styles.bubble, styles.botBubble]}>
              <ActivityIndicator size="small" color={colors.gold} />
            </View>
          ) : null}
        />

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Ask your AI coach..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  title: { fontSize: 24, fontWeight: '700', color: colors.gold, letterSpacing: 2 },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  chat: { flex: 1, padding: spacing.xl },
  bubble: { maxWidth: '80%', padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.md },
  botBubble: { backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4, alignSelf: 'flex-start', borderTopLeftRadius: 4 },
  userBubble: { backgroundColor: colors.gold, alignSelf: 'flex-end', borderTopRightRadius: 4 },
  bubbleText: { fontSize: 13, color: colors.text, lineHeight: 20 },
  userText: { color: '#000' },
  inputArea: { flexDirection: 'row', gap: 10, padding: spacing.md, backgroundColor: colors.dark2, borderTopWidth: 0.5, borderTopColor: colors.dark4, alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: colors.dark3, borderRadius: 20, paddingHorizontal: spacing.lg, paddingVertical: 10, color: colors.text, fontSize: 13, maxHeight: 100 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { fontSize: 14, color: '#000' },
});
