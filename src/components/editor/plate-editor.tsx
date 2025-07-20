'use client';


import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { SettingsDialog } from '@/components/editor/settings-dialog';
import { Editor, EditorContainer } from '@/components/ui/editor';

export function PlateEditor() {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value,
  });

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor variant="demo" />
      </EditorContainer>

      <SettingsDialog />
    </Plate>
  );
}

const value = [
  {
    type: 'h1',
    children: [
      { text: 'GTM Plan: The Fidget Spinner Toothbrush' },
    ],
  },
  {
    type: 'p',
    children: [
      {
        text: 'This document outlines the go-to-market strategy for our revolutionary new product. Our primary goal is to secure initial orders by targeting innovative gadget and lifestyle retailers.',
      },
    ],
  },
  {
    type: 'h2',
    children: [{ text: 'Product Overview' }],
  },
  {
    type: 'img',
    url: 'https://i.imgur.com/Dc5zG2x.png',
    caption: [{ text: 'The Fidget Spinner Toothbrush - Making dental hygiene fun!' }],
    children: [{ text: '' }],
  },
  {
    type: 'h2',
    children: [{ text: 'Q4 Outreach Campaign: Target Retailers' }],
  },
  {
    type: 'p',
    children: [
      {
        text: 'The following is a list of potential retailers to contact for our initial sales push. We will use an automated AI workflow to handle initial outreach and schedule demos.',
      },
    ],
  },
  {
    id: 'retailer-1',
    type: 'p',
    listStyleType: 'disc',
    indent: 1,
    children: [
      {
        bold: true,
        text: 'Gadgetopia Inc. - ',
      },
      {
        text: 'Contact: aliza@gadgetopia.com - Status: [Pending]',
      }
    ],
  },
  {
    id: 'retailer-2',
    type: 'p',
    listStyleType: 'disc',
    indent: 1,
    children: [
      {
        bold: true,
        text: 'Innovate & Co. - ',
      },
      {
        text: 'Contact: ben@innovate.co - Status: [Pending]',
      }
    ],
  },
  {
    type: 'p',
    children: [{ text: '' }],
  },
];
