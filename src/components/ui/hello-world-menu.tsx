'use client';

import { useSpeechToText } from '@/hooks/use-speech-to-text';
import {
    type PlateEditor,
    useEditorRef,
    usePluginOption,
} from 'platejs/react';
import * as React from 'react';

import {
    Popover,
    PopoverAnchor,
    PopoverContent,
} from '@/components/ui/popover';

import { HelloWorldPlugin } from '@/components/editor/plugins/hello-world-kit';
import { Button } from './button';

function isPlateEditor(editor: unknown): editor is PlateEditor {
  return editor != null && typeof (editor as any).id !== 'undefined';
}

export function HelloWorldMenu() {
  const editor = useEditorRef();
  const open = usePluginOption(HelloWorldPlugin, 'open');
  const anchorEl = usePluginOption(HelloWorldPlugin, 'anchorEl');
  const { transcript, startListening, stopListening } = useSpeechToText();

  React.useEffect(() => {
    if (open) {
      startListening();
    } else {
      stopListening();
    }
  }, [open, startListening, stopListening]);

  const insertTranscript = () => {
    if (isPlateEditor(editor)) {
      editor.insertText(transcript);
      editor.setOption(HelloWorldPlugin, 'open', false);
    }
  };

  if (!anchorEl) {
    return null;
  }

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        if (isPlateEditor(editor)) {
          editor.setOption(HelloWorldPlugin, 'open', newOpen);
        }
        if (!newOpen) {
          stopListening();
        }
      }}
    >
      <PopoverAnchor virtualRef={{ current: anchorEl }} />
      <PopoverContent>
        <div>
          <p>Listening...</p>
          <p>{transcript}</p>
          <Button onClick={insertTranscript} disabled={!transcript}>
            Insert
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
} 
