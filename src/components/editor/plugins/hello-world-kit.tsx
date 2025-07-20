'use client';

import { HelloWorldMenu } from '@/components/ui/hello-world-menu';
import { type PlatePlugin, createPlatePlugin } from 'platejs/react';

export const KEY_HELLO_WORLD = 'hello_world';

export const HelloWorldPlugin = createPlatePlugin({
  key: KEY_HELLO_WORLD,
  options: {
    open: false,
    anchorEl: null as HTMLElement | null,
    transcript: '',
  },
  render: {
    afterEditable: HelloWorldMenu,
  },
  shortcuts: {
    hello: {
      keys: 'mod+k',
      handler: ({ editor }) => {
        editor.setOption(HelloWorldPlugin, 'open', true);
        const [ancestor] = editor.api.block({ highest: true })!;
        editor.setOption(
          HelloWorldPlugin,
          'anchorEl',
          editor.api.toDOMNode(ancestor)!
        );
      },
    },
  },
});

export const HelloWorldKit: PlatePlugin[] = [HelloWorldPlugin];
