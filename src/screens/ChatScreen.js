import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, StatusBar, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';
import { supabase } from '../lib/supabase';

export default function ChatScreen({ route, navigation }) {
  const booking = route?.params?.booking || {
    id: 'demo',
    trainerName: 'Hafiz Rahman',
    trainerEmoji: '🏋️',
    day: 'Mon, 28 Apr',
    time: '10:00 AM',
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    setupChat();
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  const setupChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);

    if (booking.id === 'demo') {
      setMessages([
        { id: '1', sender_id: 'trainer', content: 'Hi! Looking forward to our session. Where would you like to train?', created_at: new Date(Date.now() - 300000).toISOString() },
        { id: '2', sender_id: user?.id || 'client', content: 'Hey! I was thinking at my home in Seremban. Is that okay?', created_at: new Date(Date.now() - 200000).toISOString() },
        { id: '3', sender_id: 'trainer', content: 'Perfect! Please make sure there is enough space. See you Monday at 10am!', created_at: new Date(Date.now() - 100000).toISOString() },
      ]);
      setLoading(false);
      return;
    }

    // Load existing messages
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('booking_id', booking.id)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
    setLoading(false);

    // Subscribe to new messages in real time
    subscriptionRef.current = supabase
      .channel(`messages:${booking.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `booking_id=eq.${booking.id}`,
      }, (payload) => {
        setMessages(prev => {
          const exists = prev.find(m => m.id === payload.new.id);
          if (exists) return prev;
          return [...prev, payload.new];
        });
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
      })
      .subscribe();
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);

    if (booking.id === 'demo') {
      const newMsg = {
        id: Date.now().toString(),
        sender_id: userId || 'client',
        content: text,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMsg]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
      setSending(false);
      return;
    }

    const { error } = await supabase.from('messages').insert({
      booking_id: booking.id,
      sender_id: userId,
      content: text,
    });

    if (error) console.log('Send error:', error);
    setSending(false);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (msg) => msg.sender_id === userId || msg.sender_id === 'client';

  const renderMessage = ({ item, index }) => {
    const isMine = isMyMessage(item);
    const prevMsg = messages[index - 1];
    const showAvatar = !isMine && (!prevMsg || isMyMessage(prevMsg));

    return (
      <View style={[styles.bubbleWrap, isMine ? styles.bubbleWrapRight : styles.bubbleWrapLeft]}>
        {!isMine && (
          <View style={[styles.avatar, !showAvatar && styles.avatarHidden]}>
            <Text style={styles.avatarText}>{booking.trainerEmoji}</Text>
          </View>
        )}
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>{item.content}</Text>
          <Text style={[styles.bubbleTime, isMine && styles.bubbleTimeMine]}>{formatTime(item.created_at)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerEmoji}>{booking.trainerEmoji}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{booking.trainerName}</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.headerSub}>{booking.day} · {booking.time}</Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.gold} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={m => m.id}
            style={styles.messageList}
            contentContainerStyle={styles.messageContent}
            onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
            ListHeaderComponent={
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionInfoText}>
                  📅 {booking.day} · {booking.time}
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatEmoji}>💬</Text>
                <Text style={styles.emptyChatText}>No messages yet</Text>
                <Text style={styles.emptyChatSub}>Say hi to your trainer!</Text>
              </View>
            }
            renderItem={renderMessage}
          />
        )}

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            multiline
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || sending}
          >
            {sending
              ? <ActivityIndicator size="small" color="#000" />
              : <Text style={styles.sendIcon}>➤</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.dark4, gap: spacing.md },
  backBtn: { padding: spacing.sm },
  backIcon: { fontSize: 22, color: colors.gold },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.dark3, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.gold },
  headerEmoji: { fontSize: 22 },
  headerName: { fontSize: 15, fontWeight: '600', color: colors.text },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green },
  headerSub: { fontSize: 11, color: colors.textMuted },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  messageList: { flex: 1 },
  messageContent: { padding: spacing.lg, gap: spacing.sm, flexGrow: 1 },
  sessionInfo: { alignItems: 'center', marginBottom: spacing.lg },
  sessionInfoText: { fontSize: 11, color: colors.textMuted, backgroundColor: colors.dark3, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full },
  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyChatEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyChatText: { fontSize: 16, fontWeight: '600', color: colors.text },
  emptyChatSub: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  bubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginBottom: 4 },
  bubbleWrapRight: { justifyContent: 'flex-end' },
  bubbleWrapLeft: { justifyContent: 'flex-start' },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.dark3, alignItems: 'center', justifyContent: 'center' },
  avatarHidden: { opacity: 0 },
  avatarText: { fontSize: 14 },
  bubble: { maxWidth: '75%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md },
  bubbleMine: { backgroundColor: colors.gold, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: colors.dark3, borderBottomLeftRadius: 4, borderWidth: 0.5, borderColor: colors.dark4 },
  bubbleText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  bubbleTextMine: { color: '#000' },
  bubbleTime: { fontSize: 10, color: colors.textMuted, marginTop: 3, textAlign: 'right' },
  bubbleTimeMine: { color: 'rgba(0,0,0,0.45)' },
  inputArea: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.dark2, borderTopWidth: 0.5, borderTopColor: colors.dark4 },
  input: { flex: 1, backgroundColor: colors.dark3, borderRadius: 20, paddingHorizontal: spacing.lg, paddingVertical: 10, color: colors.text, fontSize: 14, maxHeight: 100, borderWidth: 0.5, borderColor: colors.dark4 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
  sendIcon: { fontSize: 16, color: '#000' },
});
