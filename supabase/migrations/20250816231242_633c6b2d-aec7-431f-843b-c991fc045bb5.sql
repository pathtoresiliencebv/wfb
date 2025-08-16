-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view their own participation" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can join conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can update their own participation" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;

-- Create RLS policies for conversations
CREATE POLICY "Users can view conversations they participate in" ON public.conversations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_id = conversations.id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create conversations" ON public.conversations
FOR INSERT WITH CHECK (true);

-- Create RLS policies for conversation_participants
CREATE POLICY "Users can view their own participation" ON public.conversation_participants
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can join conversations" ON public.conversation_participants
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own participation" ON public.conversation_participants
FOR UPDATE USING (user_id = auth.uid());

-- Create RLS policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_id = messages.conversation_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to their conversations" ON public.messages
FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_id = messages.conversation_id 
    AND user_id = auth.uid()
  )
);