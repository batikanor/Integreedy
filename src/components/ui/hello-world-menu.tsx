'use client';

import { useSpeechToText } from '@/hooks/use-speech-to-text';
import {
  type PlateEditor,
  useEditorRef,
  usePluginOption,
} from 'platejs/react';

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';

import { HelloWorldPlugin } from '@/components/editor/plugins/hello-world-kit';
import { Button } from './button';

async function generateAndInsertAudio(editor: PlateEditor, retailerId: string, script: string) {
  const res = await fetch('/api/generate-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: script }),
  });

  if (!res.ok) {
    console.error('Failed to generate audio');
    return;
  }

  const audioBlob = await res.blob();
  const audioUrl = URL.createObjectURL(audioBlob);

  const nodeEntries = Array.from(
    editor.api.nodes({
      at: [],
      match: (node) => (node as any).id === retailerId,
    })
  );

  if (nodeEntries.length > 0) {
    const [, path] = nodeEntries[0];
    editor.tf.insertNodes(
      {
        type: 'audio',
        url: audioUrl,
        children: [{ text: '' }],
      },
      { at: [path[0] + 1] }
    );
  }
}

export function HelloWorldMenu() {
  const editor = useEditorRef();
  const open = usePluginOption(HelloWorldPlugin, 'open');
  const anchorEl = usePluginOption(HelloWorldPlugin, 'anchorEl');
  const {
    transcript,
    finalTranscript,
    startListening,
    stopListening,
    error,
    isListening,
  } = useSpeechToText();

  const insertTranscript = () => {
    if (editor && finalTranscript.trim()) {
      const plateEditor = editor as PlateEditor;
      if (plateEditor.insertText) {
        plateEditor.insertText(finalTranscript);
        plateEditor.setOption(HelloWorldPlugin, 'open', false);
      }
    }
  };

  const generateAudioOutreach = async () => {
    if (editor) {
      const plateEditor = editor as PlateEditor;
      const retailers = [
        { id: 'retailer-1', name: 'Gadgetopia Inc.', contact: 'Aliza' },
        { id: 'retailer-2', name: 'Innovate & Co.', contact: 'Ben' },
      ];
      for (const retailer of retailers) {
        const script = `Hello ${retailer.contact}, this is a message for ${retailer.name}. ${finalTranscript}`;
        await generateAndInsertAudio(plateEditor, retailer.id, script);
      }
      plateEditor.setOption(HelloWorldPlugin, 'open', false);
    }
  };

  if (!anchorEl) {
    return null;
  }

  const getStatusMessage = () => {
    if (error === 'not-allowed' || error === 'service-not-allowed') {
      return 'Error: Microphone access denied. Please allow microphone permissions in your browser settings.';
    }
    if (error) {
      return `Error: ${error}`;
    }
    if (isListening) {
      return 'Listening...';
    }
    return 'Press the button to start speaking.';
  };

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        if (editor) {
          const plateEditor = editor as PlateEditor;
          plateEditor.setOption(HelloWorldPlugin, 'open', newOpen);
        }
        if (!newOpen && isListening) {
          stopListening();
        }
      }}
    >
      <PopoverAnchor virtualRef={{ current: anchorEl }} />
      <PopoverContent className="w-96">
        <div className="space-y-2 p-4">
          <p className="text-sm font-medium whitespace-normal">{getStatusMessage()}</p>
          <p className="text-sm text-gray-600 min-h-[20px] whitespace-normal">{transcript}</p>
          <div className="flex gap-2">
            <Button onClick={isListening ? stopListening : startListening}>
              {isListening ? 'Stop' : 'Start'}
            </Button>
            <Button onClick={insertTranscript} disabled={!transcript.trim()}>
              Insert
            </Button>
            <Button
              onClick={generateAudioOutreach}
              disabled={!finalTranscript.trim()}
            >
              Generate Audio Outreach
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 
